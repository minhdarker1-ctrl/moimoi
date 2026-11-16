"use client";

import { QuizQuestion } from "@/types/quiz";
import { TTSSettings, TTSQuestionScope } from "@/types/tts";

// Default settings
export const DEFAULT_TTS_SETTINGS: TTSSettings = {
  voice: "vi-VN-HoaiMyNeural",
  speed: "1.0x",
  scope: "question_and_options",
  autoReadQuestion: false,
  autoReadExplanation: false,
};

// Simple hash for cache keys
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
  private currentBlobUrl: string | null = null;
  private memoryCache: Map<string, string> = new Map();
  private abortController: AbortController | null = null;
  private statusListeners: Set<(status: "idle" | "loading" | "playing" | "paused") => void> = new Set();
  private currentStatus: "idle" | "loading" | "playing" | "paused" = "idle";

  constructor() {
    if (typeof window !== "undefined") {
      // Clean up on page unload
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

  /**
   * Stop any ongoing speech or network fetch immediately.
   */
  public stop() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.src = "";
      this.currentAudio = null;
    }

    // Also cancel native browser SpeechSynthesis if active
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
      this.currentAudio.play().then(() => this.setStatus("playing")).catch(() => this.setStatus("idle"));
    }
  }

  /**
   * Synthesize and play raw text using Edge TTS API with fallback to Web Speech.
   */
  public async speakText(text: string, settings: TTSSettings): Promise<void> {
    if (!text.trim()) return;

    this.stop();
    this.setStatus("loading");

    const cacheKey = `${settings.voice}_${settings.speed}_${hashString(text)}`;

    try {
      let audioUrl = this.memoryCache.get(cacheKey);

      if (!audioUrl) {
        this.abortController = new AbortController();

        const response = await fetch("/api/quiz/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            voice: settings.voice,
            speed: settings.speed,
          }),
          signal: this.abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`TTS API failed with status ${response.status}`);
        }

        const blob = await response.blob();
        audioUrl = URL.createObjectURL(blob);
        this.memoryCache.set(cacheKey, audioUrl);
      }

      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      this.currentBlobUrl = audioUrl;

      audio.onplay = () => this.setStatus("playing");
      audio.onended = () => {
        this.setStatus("idle");
        this.currentAudio = null;
      };
      audio.onerror = () => {
        this.fallbackWebSpeech(text, settings);
      };

      await audio.play();
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        return;
      }
      console.warn("[Edge TTS] API failed, using Web Speech fallback:", err);
      this.fallbackWebSpeech(text, settings);
    }
  }

  /**
   * Native browser SpeechSynthesis fallback in case Edge TTS is offline.
   */
  private fallbackWebSpeech(text: string, settings: TTSSettings) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.setStatus("idle");
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";

      const speedMap: Record<string, number> = {
        "0.8x": 0.8,
        "1.0x": 1.0,
        "1.25x": 1.25,
        "1.5x": 1.5,
      };
      utterance.rate = speedMap[settings.speed] || 1.0;

      utterance.onstart = () => this.setStatus("playing");
      utterance.onend = () => this.setStatus("idle");
      utterance.onerror = () => this.setStatus("idle");

      window.speechSynthesis.speak(utterance);
    } catch {
      this.setStatus("idle");
    }
  }

  /**
   * Speak question content (and optionally 4 options).
   */
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

  /**
   * Speak answer feedback + full explanation when user selects an option.
   */
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

  /**
   * Speak explanation only.
   */
  public async speakExplanation(explanation: string, settings: TTSSettings): Promise<void> {
    if (!explanation) return;
    const speech = `Giải thích chi tiết: ${explanation}`;
    await this.speakText(speech, settings);
  }
}

// Global Singleton Instance
export const quizTTS = new QuizTTSController();
