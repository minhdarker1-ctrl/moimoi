"use client";

import { QuizQuestion } from "@/types/quiz";
import { TTSSettings, TTSQuestionScope } from "@/types/tts";

export const DEFAULT_TTS_SETTINGS: TTSSettings = {
  voice: "google-vi",
  speed: "1.0x",
  scope: "question_and_options",
  autoReadQuestion: false,
  autoReadExplanation: false,
};

const SPEED_MAP: Record<string, number> = {
  "0.8x": 0.8,
  "1.0x": 1.0,
  "1.25x": 1.25,
  "1.5x": 1.5,
};

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(36);
}

class QuizTTSController {
  private currentAudio: HTMLAudioElement | null = null;
  private memoryCache: Map<string, string> = new Map();
  private abortController: AbortController | null = null;
  private playSessionId = 0;
  private statusListeners: Set<(status: "idle" | "loading" | "playing" | "paused") => void> = new Set();
  private currentStatus: "idle" | "loading" | "playing" | "paused" = "idle";

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        this.stop();
        this.memoryCache.forEach((url) => URL.revokeObjectURL(url));
        this.memoryCache.clear();
      });
    }
  }

  public getStatus(): "idle" | "loading" | "playing" | "paused" {
    return this.currentStatus;
  }

  public subscribeStatus(listener: (status: "idle" | "loading" | "playing" | "paused") => void): () => void {
    this.statusListeners.add(listener);
    listener(this.currentStatus);
    return () => this.statusListeners.delete(listener);
  }

  private setStatus(status: "idle" | "loading" | "playing" | "paused") {
    this.currentStatus = status;
    this.statusListeners.forEach((fn) => fn(status));
  }

  private notifyMusicPause() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("minsr_pause_music"));
    }
  }

  /**
   * Immediately invalidate any active TTS session, abort inflight fetches,
   * detach audio callbacks before clearing src (preventing spurious onerror overlap),
   * and cancel browser SpeechSynthesis.
   */
  public stop() {
    this.playSessionId += 1;

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.currentAudio) {
      const audio = this.currentAudio;
      this.currentAudio = null;
      audio.onplay = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    this.setStatus("idle");
  }

  public pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.setStatus("paused");
    }
  }

  public resume() {
    if (this.currentAudio && this.currentAudio.paused) {
      this.notifyMusicPause();
      this.currentAudio.play().then(() => this.setStatus("playing")).catch(() => this.setStatus("idle"));
    }
  }

  /**
   * Synthesize and play raw text using Google Vietnamese TTS with Web Speech fallback.
   */
  public async speakText(text: string, settings: TTSSettings): Promise<void> {
    if (!text.trim()) return;

    this.stop();
    const sessionId = ++this.playSessionId;
    this.setStatus("loading");

    const cacheKey = `google-vi_${hashString(text)}`;
    const playbackRate = SPEED_MAP[settings.speed] || 1.0;

    try {
      let audioUrl = this.memoryCache.get(cacheKey);

      if (!audioUrl) {
        const controller = new AbortController();
        this.abortController = controller;

        const response = await fetch("/api/quiz/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            voice: "google-vi",
            speed: settings.speed,
          }),
          signal: controller.signal,
        });

        if (sessionId !== this.playSessionId) return;

        if (!response.ok) {
          throw new Error(`TTS API failed with status ${response.status}`);
        }

        const blob = await response.blob();
        if (sessionId !== this.playSessionId) return;

        audioUrl = URL.createObjectURL(blob);
        this.memoryCache.set(cacheKey, audioUrl);
      }

      if (sessionId !== this.playSessionId) return;

      const audio = new Audio(audioUrl);
      audio.defaultPlaybackRate = playbackRate;
      audio.playbackRate = playbackRate;
      this.currentAudio = audio;

      audio.onplay = () => {
        if (sessionId !== this.playSessionId) return;
        this.notifyMusicPause();
        this.setStatus("playing");
      };
      audio.onended = () => {
        if (sessionId !== this.playSessionId) return;
        this.currentAudio = null;
        this.setStatus("idle");
      };
      audio.onerror = () => {
        if (sessionId !== this.playSessionId) return;
        this.currentAudio = null;
        this.fallbackWebSpeech(text, settings, sessionId);
      };

      await audio.play();
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError" || sessionId !== this.playSessionId) {
        return;
      }
      console.warn("[Google TTS] API failed, using Web Speech fallback:", err);
      this.fallbackWebSpeech(text, settings, sessionId);
    }
  }

  /**
   * Native browser SpeechSynthesis fallback if Google TTS is unreachable.
   * Strictly enforces Vietnamese language so foreign voices never speak Vietnamese text.
   */
  private fallbackWebSpeech(text: string, settings: TTSSettings, sessionId: number) {
    if (sessionId !== this.playSessionId) return;

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.setStatus("idle");
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const voices = window.speechSynthesis.getVoices();
      const viVoices = voices.filter((v) => {
        const lang = (v.lang || "").toLowerCase().replace("_", "-");
        return lang.startsWith("vi");
      });

      if (viVoices.length === 0) {
        this.setStatus("idle");
        window.dispatchEvent(
          new CustomEvent("minsr_tts_notice", {
            detail: {
              type: "warning",
              message:
                "Không thể kết nối giọng đọc Google và thiết bị chưa có giọng Tiếng Việt offline.",
            },
          })
        );
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = viVoices[0];
      utterance.lang = viVoices[0].lang || "vi-VN";
      utterance.pitch = 1.0;
      utterance.rate = SPEED_MAP[settings.speed] || 1.0;

      utterance.onstart = () => {
        if (sessionId !== this.playSessionId) return;
        this.notifyMusicPause();
        this.setStatus("playing");
      };
      utterance.onend = () => {
        if (sessionId !== this.playSessionId) return;
        this.setStatus("idle");
      };
      utterance.onerror = () => {
        if (sessionId !== this.playSessionId) return;
        this.setStatus("idle");
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.setStatus("idle");
    }
  }

  public async speakQuestion(
    question: QuizQuestion,
    scope: TTSQuestionScope,
    settings: TTSSettings
  ): Promise<void> {
    let speech = `Câu hỏi: ${question.question}`;

    if (scope === "question_and_options" && question.options && question.options.length > 0) {
      const letters = ["A", "B", "C", "D"];
      const optionsText = question.options
        .map((opt, idx) => `Phương án ${letters[idx]}: ${opt}`)
        .join(". ");
      speech += `. ${optionsText}`;
    }

    await this.speakText(speech, settings);
  }

  public async speakFeedback(
    isCorrect: boolean,
    selectedOptIndex: number,
    question: QuizQuestion,
    settings: TTSSettings
  ): Promise<void> {
    const letters = ["A", "B", "C", "D"];
    const chosenLetter = letters[selectedOptIndex] || "chưa rõ";
    const correctLetter = question.correctAnswerLetter;
    const correctText = question.options[question.correctIndex];

    let speech = "";
    if (isCorrect) {
      speech = `Chính xác! Đáp án đúng là ${correctLetter}: ${correctText}. `;
    } else {
      speech = `Chưa chính xác! Bạn đã chọn ${chosenLetter}. Đáp án đúng là ${correctLetter}: ${correctText}. `;
    }

    if (question.explanation) {
      speech += `Giải thích: ${question.explanation}`;
    }

    await this.speakText(speech, settings);
  }

  public async speakExplanation(explanation: string, settings: TTSSettings): Promise<void> {
    if (!explanation) return;
    const speech = `Giải thích chi tiết: ${explanation}`;
    await this.speakText(speech, settings);
  }
}

export const quizTTS = new QuizTTSController();
