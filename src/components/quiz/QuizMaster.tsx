"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { QuizQuestion, QuizMode, QuizTopic, QuizResult } from "@/types/quiz";
import { QUIZ_TOPICS, MECHANICAL_QUIZ_QUESTIONS } from "@/data/quizBank";

// Helper audio synthesizer (Zero external asset dependencies)
function playSound(type: "correct" | "wrong" | "finish" | "click") {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === "correct") {
      const now = ctx.currentTime;
      // Pleasant double bell chime
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.08, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } else if (type === "wrong") {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.18);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === "finish") {
      const now = ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.1, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.36);
      });
    }
  } catch {
    // Audio context not allowed or failed silently
  }
}

export default function QuizMaster() {
  const [mounted, setMounted] = useState(false);

  // Storage states
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Config lobby states
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [mode, setMode] = useState<QuizMode>("practice");
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);

  // Playing states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [activeQuestionList, setActiveQuestionList] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});

  // Exam timer states
  const [examSecondsLeft, setExamSecondsLeft] = useState<number>(20 * 60);
  const [examTotalSeconds, setExamTotalSeconds] = useState<number>(20 * 60);

  // Flashcard states
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Review mode filter on results screen
  const [reviewFilter, setReviewFilter] = useState<"all" | "wrong" | "correct">("all");

  // Load from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const bm = JSON.parse(localStorage.getItem("minsr_quiz_bookmarks") || "[]");
      const mis = JSON.parse(localStorage.getItem("minsr_quiz_mistakes") || "[]");
      const snd = localStorage.getItem("minsr_quiz_sound") !== "false";
      setBookmarks(bm);
      setMistakes(mis);
      setSoundEnabled(snd);
    } catch {}
  }, []);

  // Save changes
  const saveBookmarks = (newBm: number[]) => {
    setBookmarks(newBm);
    try {
      localStorage.setItem("minsr_quiz_bookmarks", JSON.stringify(newBm));
    } catch {}
  };

  const saveMistakes = (newMis: number[]) => {
    setMistakes(newMis);
    try {
      localStorage.setItem("minsr_quiz_mistakes", JSON.stringify(newMis));
    } catch {}
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem("minsr_quiz_sound", String(next));
    } catch {}
    if (next) playSound("click");
  };

  const toggleBookmark = (qId: number) => {
    if (soundEnabled) playSound("click");
    if (bookmarks.includes(qId)) {
      saveBookmarks(bookmarks.filter((id) => id !== qId));
    } else {
      saveBookmarks([...bookmarks, qId]);
    }
  };

  // Filter available questions based on topic or special list
  const availableQuestions = useMemo(() => {
    if (selectedTopic === "bookmarks") {
      return MECHANICAL_QUIZ_QUESTIONS.filter((q) => bookmarks.includes(q.id));
    }
    if (selectedTopic === "mistakes") {
      return MECHANICAL_QUIZ_QUESTIONS.filter((q) => mistakes.includes(q.id));
    }
    if (selectedTopic === "all") {
      return MECHANICAL_QUIZ_QUESTIONS;
    }
    return MECHANICAL_QUIZ_QUESTIONS.filter((q) => q.chapterId === selectedTopic);
  }, [selectedTopic, bookmarks, mistakes]);

  // Start Quiz
  const startQuiz = useCallback(
    (customQuestions?: QuizQuestion[]) => {
      let pool = customQuestions ? [...customQuestions] : [...availableQuestions];
      if (pool.length === 0) return;

      if (shuffleQuestions) {
        pool = [...pool].sort(() => Math.random() - 0.5);
      }

      if (questionCount > 0 && questionCount < pool.length) {
        pool = pool.slice(0, questionCount);
      }

      // Shuffle options if enabled
      if (shuffleOptions) {
        pool = pool.map((q) => {
          const originalCorrectAnswer = q.options[q.correctIndex];
          const shuffledOpts = [...q.options].sort(() => Math.random() - 0.5);
          const newCorrectIndex = shuffledOpts.indexOf(originalCorrectAnswer);
          return {
            ...q,
            options: shuffledOpts,
            correctIndex: newCorrectIndex,
            correctAnswer: originalCorrectAnswer,
            correctAnswerLetter: String.fromCharCode(65 + newCorrectIndex),
          };
        });
      }

      setActiveQuestionList(pool);
      setCurrentIndex(0);
      setUserAnswers({});
      setRevealedQuestions({});
      setIsCardFlipped(false);
      setIsPlaying(true);
      setIsFinished(false);

      if (mode === "exam") {
        const timeNeeded = Math.max(pool.length * 60, 5 * 60); // 1 min/question or min 5 mins
        setExamTotalSeconds(timeNeeded);
        setExamSecondsLeft(timeNeeded);
      }

      if (soundEnabled) playSound("click");
    },
    [availableQuestions, shuffleQuestions, shuffleOptions, questionCount, mode, soundEnabled]
  );

  // Timer countdown for Exam Mode
  useEffect(() => {
    if (!isPlaying || isFinished || mode !== "exam") return;
    if (examSecondsLeft <= 0) {
      finishQuiz();
      return;
    }
    const timer = setInterval(() => {
      setExamSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isFinished, mode, examSecondsLeft]);

  // Current Question
  const currentQ = activeQuestionList[currentIndex];

  // Select Option Handler
  const handleSelectOption = (optIndex: number) => {
    if (!currentQ || isFinished) return;

    if (mode === "practice") {
      // In practice mode, lock once chosen
      if (revealedQuestions[currentQ.id]) return;

      setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optIndex }));
      setRevealedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));

      const isCorrect = optIndex === currentQ.correctIndex;
      if (isCorrect) {
        if (soundEnabled) playSound("correct");
        // Remove from mistakes if previously wrong
        if (mistakes.includes(currentQ.id)) {
          saveMistakes(mistakes.filter((id) => id !== currentQ.id));
        }
      } else {
        if (soundEnabled) playSound("wrong");
        // Add to mistakes notebook
        if (!mistakes.includes(currentQ.id)) {
          saveMistakes([...mistakes, currentQ.id]);
        }
      }
    } else if (mode === "exam") {
      // In exam mode, can freely change answers until submit
      if (soundEnabled) playSound("click");
      setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optIndex }));
    }
  };

  // Next / Prev controls
  const handleNext = () => {
    if (currentIndex < activeQuestionList.length - 1) {
      if (soundEnabled) playSound("click");
      setCurrentIndex((prev) => prev + 1);
      setIsCardFlipped(false);
    } else if (mode === "practice") {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      if (soundEnabled) playSound("click");
      setCurrentIndex((prev) => prev - 1);
      setIsCardFlipped(false);
    }
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    if (!isPlaying || isFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is inside an input or editable field
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea") return;

      const key = e.key.toLowerCase();

      // Number keys 1, 2, 3, 4
      if (["1", "2", "3", "4"].includes(key)) {
        e.preventDefault();
        const optIdx = parseInt(key, 10) - 1;
        if (mode === "practice" || mode === "exam") {
          handleSelectOption(optIdx);
        }
        return;
      }

      // Letter keys A, B, C, D
      if (["a", "b", "c", "d"].includes(key)) {
        e.preventDefault();
        const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
        if (mode === "practice" || mode === "exam") {
          handleSelectOption(map[key]);
        }
        return;
      }

      // Navigation: Right Arrow / Enter / Space (for next or flip)
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === " " && mode === "flashcard") {
        e.preventDefault();
        setIsCardFlipped((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isFinished, mode, currentIndex, activeQuestionList.length, revealedQuestions, currentQ]);

  // Finish Quiz Handler
  const finishQuiz = () => {
    setIsFinished(true);
    setIsPlaying(false);
    if (soundEnabled) playSound("finish");

    // Process all exam answers and save mistakes
    if (mode === "exam") {
      const newMistakes = [...mistakes];
      activeQuestionList.forEach((q) => {
        const selected = userAnswers[q.id];
        if (selected !== q.correctIndex && !newMistakes.includes(q.id)) {
          newMistakes.push(q.id);
        }
      });
      saveMistakes(newMistakes);
    }
  };

  // Exit back to lobby
  const exitToLobby = () => {
    if (soundEnabled) playSound("click");
    setIsPlaying(false);
    setIsFinished(false);
  };

  // Result statistics
  const results: QuizResult = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    const wrongIds: number[] = [];

    activeQuestionList.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === q.correctIndex) {
        correct++;
      } else {
        wrong++;
        wrongIds.push(q.id);
      }
    });

    const total = activeQuestionList.length || 1;
    const pct = Math.round((correct / total) * 100);
    const spent = mode === "exam" ? examTotalSeconds - examSecondsLeft : 0;

    return {
      totalQuestions: activeQuestionList.length,
      correctCount: correct,
      wrongCount: wrong,
      scorePercentage: pct,
      timeSpentSeconds: spent,
      wrongQuestionIds: wrongIds,
      completedAt: new Date().toLocaleTimeString("vi-VN"),
    };
  }, [activeQuestionList, userAnswers, mode, examTotalSeconds, examSecondsLeft]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(Math.max(secs, 0) / 60);
    const s = Math.max(secs, 0) % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (!mounted) {
    return (
      <div className="cyber-quiz-loading">
        <i className="fa-solid fa-spinner fa-spin" />
        <p>Đang khởi tạo MinSr Quiz Master...</p>
      </div>
    );
  }

  // ========================================================
  // RENDER 1: RESULT SCREEN (BẢNG TỔNG KẾT & PHÂN TÍCH)
  // ========================================================
  if (isFinished) {
    const isPass = results.scorePercentage >= 70;
    const grade =
      results.scorePercentage >= 90
        ? { title: "XUẤT SẮC!", color: "#10b981", badge: "🏆 THÀNH THẠO" }
        : results.scorePercentage >= 80
        ? { title: "GIỎI!", color: "#38bdf8", badge: "🥇 VỮNG VÀNG" }
        : results.scorePercentage >= 65
        ? { title: "KHÁ!", color: "#f59e0b", badge: "🥈 ĐẠT YÊU CẦU" }
        : { title: "CẦN CỐ GẮNG!", color: "#f43f5e", badge: "⚠️ CẦN ÔN LẠI" };

    const filteredReviewQuestions = activeQuestionList.filter((q) => {
      const isCorrect = userAnswers[q.id] === q.correctIndex;
      if (reviewFilter === "wrong") return !isCorrect;
      if (reviewFilter === "correct") return isCorrect;
      return true;
    });

    return (
      <div className="cyber-quiz-container">
        {/* Result Header Card */}
        <div className="cyber-result-header-card">
          <div className="cyber-result-top-badge" style={{ borderColor: grade.color, color: grade.color }}>
            {grade.badge}
          </div>
          <h2 className="cyber-result-title" style={{ color: grade.color }}>
            {grade.title}
          </h2>
          <div className="cyber-result-score-circle" style={{ borderColor: grade.color }}>
            <span className="cyber-result-pct">{results.scorePercentage}%</span>
            <span className="cyber-result-ratio">
              {results.correctCount} / {results.totalQuestions} Câu
            </span>
          </div>

          <div className="cyber-result-metrics-row">
            <div className="cyber-metric-card green">
              <i className="fa-solid fa-circle-check" />
              <strong>{results.correctCount}</strong>
              <span>Đúng</span>
            </div>
            <div className="cyber-metric-card red">
              <i className="fa-solid fa-circle-xmark" />
              <strong>{results.wrongCount}</strong>
              <span>Sai</span>
            </div>
            <div className="cyber-metric-card blue">
              <i className="fa-solid fa-clock" />
              <strong>{formatTime(results.timeSpentSeconds)}</strong>
              <span>Thời gian</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="cyber-result-actions-row">
            <button
              type="button"
              className="cyber-quiz-btn primary"
              onClick={() => startQuiz()}
            >
              <i className="fa-solid fa-rotate-right" /> Làm Lại Đề Này
            </button>

            {results.wrongQuestionIds.length > 0 && (
              <button
                type="button"
                className="cyber-quiz-btn danger"
                onClick={() => {
                  const wrongPool = activeQuestionList.filter((q) =>
                    results.wrongQuestionIds.includes(q.id)
                  );
                  setMode("practice");
                  startQuiz(wrongPool);
                }}
              >
                <i className="fa-solid fa-bolt" /> Ôn {results.wrongQuestionIds.length} Câu Vừa Sai
              </button>
            )}

            <button
              type="button"
              className="cyber-quiz-btn secondary"
              onClick={exitToLobby}
            >
              <i className="fa-solid fa-house" /> Về Bảng Điều Khiển
            </button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="cyber-review-section">
          <div className="cyber-review-header">
            <h3>
              <i className="fa-solid fa-list-check" /> Chi Tiết Từng Câu Hỏi
            </h3>
            <div className="cyber-review-filters">
              <button
                type="button"
                className={`cyber-rf-btn ${reviewFilter === "all" ? "active" : ""}`}
                onClick={() => setReviewFilter("all")}
              >
                Tất cả ({activeQuestionList.length})
              </button>
              <button
                type="button"
                className={`cyber-rf-btn wrong ${reviewFilter === "wrong" ? "active" : ""}`}
                onClick={() => setReviewFilter("wrong")}
              >
                Câu sai ({results.wrongCount})
              </button>
              <button
                type="button"
                className={`cyber-rf-btn correct ${reviewFilter === "correct" ? "active" : ""}`}
                onClick={() => setReviewFilter("correct")}
              >
                Câu đúng ({results.correctCount})
              </button>
            </div>
          </div>

          <div className="cyber-review-list">
            {filteredReviewQuestions.map((q, idx) => {
              const selectedOpt = userAnswers[q.id];
              const isCorrect = selectedOpt === q.correctIndex;
              const isStarred = bookmarks.includes(q.id);

              return (
                <div
                  key={q.id}
                  className={`cyber-review-card ${isCorrect ? "correct" : "wrong"}`}
                >
                  <div className="cyber-rc-head">
                    <span className="cyber-rc-num">
                      #{idx + 1} · {q.chapterTitle}
                    </span>
                    <div className="cyber-rc-status-wrap">
                      <span className={`cyber-rc-badge ${isCorrect ? "correct" : "wrong"}`}>
                        {isCorrect ? "✓ ĐÚNG" : "✗ SAI"}
                      </span>
                      <button
                        type="button"
                        className={`cyber-star-btn ${isStarred ? "active" : ""}`}
                        onClick={() => toggleBookmark(q.id)}
                        title={isStarred ? "Bỏ gắn sao" : "Gắn sao câu hỏi"}
                      >
                        <i className={isStarred ? "fa-solid fa-star" : "fa-regular fa-star"} />
                      </button>
                    </div>
                  </div>

                  <p className="cyber-rc-question">{q.question}</p>

                  <div className="cyber-rc-options">
                    {q.options.map((optText, oIdx) => {
                      const isUserChoice = selectedOpt === oIdx;
                      const isRightChoice = oIdx === q.correctIndex;
                      let optClass = "cyber-rc-opt";
                      if (isRightChoice) optClass += " is-correct";
                      if (isUserChoice && !isRightChoice) optClass += " is-wrong";

                      return (
                        <div key={oIdx} className={optClass}>
                          <span className="cyber-opt-letter">{String.fromCharCode(65 + oIdx)}</span>
                          <span className="cyber-opt-text">{optText}</span>
                          {isRightChoice && <span className="cyber-opt-tag correct">Đáp án đúng</span>}
                          {isUserChoice && !isRightChoice && <span className="cyber-opt-tag wrong">Bạn chọn</span>}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="cyber-rc-explanation">
                      <div className="cyber-exp-title">
                        <i className="fa-solid fa-lightbulb" /> Giải thích chi tiết:
                      </div>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // RENDER 2: PLAYING SCREEN (LUYỆN TẬP / THI THỬ / FLASHCARD)
  // ========================================================
  if (isPlaying && currentQ) {
    const isAnswered = userAnswers[currentQ.id] !== undefined;
    const selectedOption = userAnswers[currentQ.id];
    const isCorrect = isAnswered && selectedOption === currentQ.correctIndex;
    const isStarred = bookmarks.includes(currentQ.id);
    const progressPct = Math.round(((currentIndex + 1) / activeQuestionList.length) * 100);

    return (
      <div className="cyber-quiz-container">
        {/* Quiz Top Action Bar */}
        <div className="cyber-quiz-top-bar">
          <button
            type="button"
            className="cyber-top-back-btn"
            onClick={exitToLobby}
            title="Thoát về menu chính"
          >
            <i className="fa-solid fa-arrow-left" /> Thoát
          </button>

          <div className="cyber-top-info">
            <span className="cyber-mode-indicator">
              {mode === "practice" && <><i className="fa-solid fa-bullseye" /> Luyện Tập</>}
              {mode === "exam" && <><i className="fa-solid fa-clock" /> Thi Thử</>}
              {mode === "flashcard" && <><i className="fa-solid fa-clone" /> Flashcard</>}
            </span>
            <span className="cyber-chapter-indicator">
              {currentQ.chapterTitle}
            </span>
          </div>

          <div className="cyber-top-right-tools">
            {mode === "exam" && (
              <div className={`cyber-exam-timer ${examSecondsLeft < 180 ? "urgent" : ""}`}>
                <i className="fa-solid fa-stopwatch" />
                <span>{formatTime(examSecondsLeft)}</span>
              </div>
            )}

            <button
              type="button"
              className={`cyber-sound-toggle-btn ${soundEnabled ? "on" : "off"}`}
              onClick={toggleSound}
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              <i className={soundEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark"} />
            </button>

            <button
              type="button"
              className={`cyber-star-toggle-btn ${isStarred ? "starred" : ""}`}
              onClick={() => toggleBookmark(currentQ.id)}
              title={isStarred ? "Bỏ đánh dấu câu này" : "Đánh dấu câu khó (Bookmark)"}
            >
              <i className={isStarred ? "fa-solid fa-star" : "fa-regular fa-star"} />
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="cyber-quiz-progress-bar-wrap">
          <div className="cyber-quiz-progress-track">
            <div className="cyber-quiz-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="cyber-quiz-progress-labels">
            <span>Câu {currentIndex + 1} / {activeQuestionList.length}</span>
            <span>{progressPct}% hoàn thành</span>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SUB-VIEW A: FLASHCARD 3D MODE                        */}
        {/* ---------------------------------------------------- */}
        {mode === "flashcard" ? (
          <div className="cyber-flashcard-wrap">
            <div
              className={`cyber-flashcard-card ${isCardFlipped ? "flipped" : ""}`}
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              role="button"
              tabIndex={0}
            >
              {/* Mặt trước: Câu hỏi */}
              <div className="cyber-fc-side cyber-fc-front">
                <span className="cyber-fc-badge">MẶT TRƯỚC · CÂU HỎI #{currentIndex + 1}</span>
                <p className="cyber-fc-question">{currentQ.question}</p>
                <div className="cyber-fc-options-preview">
                  {currentQ.options.map((opt, idx) => (
                    <div key={idx} className="cyber-fc-opt-item">
                      <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
                    </div>
                  ))}
                </div>
                <div className="cyber-fc-flip-prompt">
                  <i className="fa-solid fa-rotate" /> Chạm hoặc nhấp chuột để lật đáp án
                </div>
              </div>

              {/* Mặt sau: Đáp án & Giải thích */}
              <div className="cyber-fc-side cyber-fc-back">
                <span className="cyber-fc-badge correct">MẶT SAU · ĐÁP ÁN ĐÚNG</span>
                <div className="cyber-fc-correct-box">
                  <span className="cyber-fc-ans-letter">{currentQ.correctAnswerLetter}</span>
                  <p className="cyber-fc-ans-text">{currentQ.correctAnswer}</p>
                </div>
                {currentQ.explanation && (
                  <div className="cyber-fc-explanation-box">
                    <strong><i className="fa-solid fa-lightbulb" /> Ghi nhớ cốt lõi:</strong>
                    <p>{currentQ.explanation}</p>
                  </div>
                )}
                <div className="cyber-fc-flip-prompt">
                  <i className="fa-solid fa-rotate" /> Chạm để lật lại câu hỏi
                </div>
              </div>
            </div>

            {/* Flashcard navigation controls */}
            <div className="cyber-fc-nav-controls">
              <button
                type="button"
                className="cyber-quiz-btn secondary"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <i className="fa-solid fa-chevron-left" /> Câu trước
              </button>

              <button
                type="button"
                className="cyber-quiz-btn danger"
                onClick={() => {
                  if (!mistakes.includes(currentQ.id)) {
                    saveMistakes([...mistakes, currentQ.id]);
                  }
                  handleNext();
                }}
              >
                <i className="fa-solid fa-xmark" /> Chưa Nhớ (Lưu Sổ Sai)
              </button>

              <button
                type="button"
                className="cyber-quiz-btn success"
                onClick={() => {
                  if (mistakes.includes(currentQ.id)) {
                    saveMistakes(mistakes.filter((id) => id !== currentQ.id));
                  }
                  handleNext();
                }}
              >
                <i className="fa-solid fa-check" /> Đã Thuộc Lòng
              </button>

              <button
                type="button"
                className="cyber-quiz-btn primary"
                onClick={handleNext}
                disabled={currentIndex === activeQuestionList.length - 1}
              >
                Câu sau <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
          </div>
        ) : (
          /* ---------------------------------------------------- */
          /* SUB-VIEW B: PRACTICE & EXAM 4-OPTION MODE            */
          /* ---------------------------------------------------- */
          <div className="cyber-quiz-card">
            {/* Question Text & Meta Header */}
            <div className="cyber-quiz-question-box">
              <div className="cyber-q-meta-row">
                <div className="cyber-q-meta-left">
                  <span className="cyber-q-num-pill">
                    <i className="fa-solid fa-hashtag" /> CÂU {currentIndex + 1} / {activeQuestionList.length}
                  </span>
                  <span className="cyber-q-chapter-badge">
                    <i className="fa-solid fa-layer-group" /> {currentQ.chapterTitle}
                  </span>
                </div>
                <div className="cyber-q-meta-right">
                  <span className="cyber-q-kbd-hint" title="Bấm phím 1-4 hoặc A-D trên bàn phím để chọn nhanh">
                    <i className="fa-solid fa-keyboard" /> Phím 1-4 / A-D
                  </span>
                  <button
                    type="button"
                    className={`cyber-q-star-btn ${isStarred ? "starred" : ""}`}
                    onClick={() => toggleBookmark(currentQ.id)}
                    title={isStarred ? "Bỏ gắn sao câu này" : "Gắn sao câu hỏi khó ⭐"}
                  >
                    <i className={isStarred ? "fa-solid fa-star" : "fa-regular fa-star"} />
                    <span>{isStarred ? "Đã lưu ⭐" : "Gắn sao"}</span>
                  </button>
                </div>
              </div>

              <h2 className="cyber-quiz-question-title">{currentQ.question}</h2>
            </div>

            {/* 4 Options Grid */}
            <div className="cyber-quiz-options-grid">
              {currentQ.options.map((optText, idx) => {
                const isSelected = selectedOption === idx;
                const isRight = idx === currentQ.correctIndex;
                let optStyle = "cyber-quiz-option-btn";

                if (mode === "practice" && isAnswered) {
                  if (isRight) {
                    optStyle += " correct-revealed";
                  } else if (isSelected && !isRight) {
                    optStyle += " wrong-revealed";
                  } else {
                    optStyle += " dim-revealed";
                  }
                } else if (mode === "exam" && isSelected) {
                  optStyle += " exam-selected";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={optStyle}
                    onClick={() => handleSelectOption(idx)}
                    disabled={mode === "practice" && isAnswered}
                  >
                    <div className="cyber-option-key-wrap">
                      <span className="cyber-option-letter">{String.fromCharCode(65 + idx)}</span>
                      <span className="cyber-option-kbd-sub">{idx + 1}</span>
                    </div>

                    <span className="cyber-option-text">{optText}</span>

                    <div className="cyber-option-status-wrap">
                      {mode === "practice" && isAnswered && isRight && (
                        <span className="cyber-opt-status-tag correct">
                          <i className="fa-solid fa-circle-check" /> ĐÁP ÁN ĐÚNG
                        </span>
                      )}
                      {mode === "practice" && isAnswered && isSelected && !isRight && (
                        <span className="cyber-opt-status-tag wrong">
                          <i className="fa-solid fa-circle-xmark" /> BẠN ĐÃ CHỌN
                        </span>
                      )}
                      {mode === "exam" && isSelected && (
                        <span className="cyber-opt-status-tag selected">
                          <i className="fa-solid fa-check" /> ĐÃ CHỌN
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Practice Mode: Instant Explanation Dropdown */}
            {mode === "practice" && isAnswered && (
              <div className={`cyber-instant-explanation ${isCorrect ? "correct" : "wrong"}`}>
                <div className="cyber-exp-header">
                  <div className="cyber-exp-icon-wrap">
                    <i className={isCorrect ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation"} />
                  </div>
                  <div className="cyber-exp-title-box">
                    <span className="cyber-exp-badge">
                      {isCorrect ? "CHÍNH XÁC TUYỆT ĐỐI" : "HÃY GHI NHỚ KIẾN THỨC NÀY"}
                    </span>
                    <strong className="cyber-exp-main-status">
                      {isCorrect ? "Chúc mừng! Bạn đã nắm chắc câu này." : "Rất tiếc! Câu trả lời chưa chính xác."}
                    </strong>
                  </div>
                </div>

                <div className="cyber-exp-callout">
                  <span className="cyber-callout-tag">ĐÁP ÁN CHUẨN:</span>
                  <div className="cyber-callout-content">
                    <span className="cyber-callout-letter">{currentQ.correctAnswerLetter}</span>
                    <span className="cyber-callout-text">{currentQ.correctAnswer}</span>
                  </div>
                </div>

                {currentQ.explanation && (
                  <div className="cyber-exp-body">
                    <div className="cyber-exp-body-title">
                      <i className="fa-solid fa-lightbulb" /> Cốt Lõi Kiến Thức Kỹ Thuật:
                    </div>
                    <p className="cyber-exp-body-text">{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Nav Controls */}
            <div className="cyber-quiz-bottom-controls">
              <button
                type="button"
                className="cyber-quiz-btn secondary"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <i className="fa-solid fa-chevron-left" /> Câu trước <span className="cyber-btn-kbd">←</span>
              </button>

              {mode === "exam" && (
                <button
                  type="button"
                  className="cyber-quiz-btn danger"
                  onClick={finishQuiz}
                >
                  <i className="fa-solid fa-flag-checkered" /> Nộp Bài Thi
                </button>
              )}

              {currentIndex < activeQuestionList.length - 1 ? (
                <button
                  type="button"
                  className="cyber-quiz-btn primary"
                  onClick={handleNext}
                >
                  Câu tiếp <span className="cyber-btn-kbd">→</span> <i className="fa-solid fa-chevron-right" />
                </button>
              ) : (
                <button
                  type="button"
                  className="cyber-quiz-btn success"
                  onClick={finishQuiz}
                >
                  <i className="fa-solid fa-check-double" /> Xem Kết Quả
                </button>
              )}
            </div>

            {/* Exam Mode Question Matrix Jump Grid */}
            {mode === "exam" && (
              <div className="cyber-exam-matrix">
                <span className="cyber-matrix-title">Bảng câu hỏi:</span>
                <div className="cyber-matrix-grid">
                  {activeQuestionList.map((q, idx) => {
                    const answered = userAnswers[q.id] !== undefined;
                    const isCur = idx === currentIndex;
                    let mClass = "cyber-matrix-cell";
                    if (isCur) mClass += " current";
                    if (answered) mClass += " answered";
                    if (bookmarks.includes(q.id)) mClass += " starred";

                    return (
                      <button
                        key={q.id}
                        type="button"
                        className={mClass}
                        onClick={() => setCurrentIndex(idx)}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ========================================================
  // RENDER 3: LOBBY / CONFIGURATION SCREEN (BẢNG ĐIỀU KHIỂN)
  // ========================================================
  return (
    <div className="cyber-quiz-container">
      {/* Hero Welcome Banner */}
      <div className="cyber-quiz-hero-card">
        <div className="cyber-hero-badge">
          <span className="cyber-hero-dot" />
          <span>MINSR QUIZ MASTER · V2.0 PRO</span>
        </div>
        <h1 className="cyber-hero-title">
          Khảo Thí &amp; Ôn Tập <span className="cyber-highlight-cyan">Cơ Khí Thông Minh</span>
        </h1>
        <p className="cyber-hero-desc">
          Nền tảng ôn luyện trắc nghiệm tối ưu phương pháp khoa học <strong>Active Recall</strong> &amp;{" "}
          <strong>Spaced Repetition</strong>. Thuộc lòng ngân hàng {MECHANICAL_QUIZ_QUESTIONS.length} câu hỏi then chốt về Công nghệ cơ khí, Dung sai lắp ghép, Cấp chính xác và Công nghệ Đúc kim loại.
        </p>

        {/* Global Stats Counter */}
        <div className="cyber-stats-grid">
          <div className="cyber-stat-box blue">
            <i className="fa-solid fa-database" />
            <div className="cyber-stat-text">
              <strong>{MECHANICAL_QUIZ_QUESTIONS.length}</strong>
              <span>Tổng câu hỏi</span>
            </div>
          </div>
          <div className="cyber-stat-box gold">
            <i className="fa-solid fa-star" />
            <div className="cyber-stat-text">
              <strong>{bookmarks.length}</strong>
              <span>Đã gắn sao ⭐</span>
            </div>
          </div>
          <div className="cyber-stat-box red">
            <i className="fa-solid fa-triangle-exclamation" />
            <div className="cyber-stat-text">
              <strong>{mistakes.length}</strong>
              <span>Sổ tay câu sai</span>
            </div>
          </div>
          <div className="cyber-stat-box green">
            <i className="fa-solid fa-graduation-cap" />
            <div className="cyber-stat-text">
              <strong>100%</strong>
              <span>Miễn phí 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="cyber-config-card">
        {/* Section 1: Choose Topic / Chapter */}
        <div className="cyber-config-section">
          <label className="cyber-config-label">
            <i className="fa-solid fa-book-bookmark" /> 1. Chọn Chương Học / Chủ Đề
          </label>
          <div className="cyber-topic-grid">
            {QUIZ_TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  className={`cyber-topic-card ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    if (soundEnabled) playSound("click");
                    setSelectedTopic(topic.id);
                  }}
                >
                  <div className="cyber-topic-head">
                    <i className={topic.icon} />
                    <span className="cyber-topic-badge">{topic.badge}</span>
                  </div>
                  <strong className="cyber-topic-title">{topic.title}</strong>
                  <p className="cyber-topic-desc">{topic.desc}</p>
                </button>
              );
            })}

            {/* Special Quick Topic: Mistakes Notebook */}
            {mistakes.length > 0 && (
              <button
                type="button"
                className={`cyber-topic-card special-mistakes ${selectedTopic === "mistakes" ? "selected" : ""}`}
                onClick={() => {
                  if (soundEnabled) playSound("click");
                  setSelectedTopic("mistakes");
                }}
              >
                <div className="cyber-topic-head">
                  <i className="fa-solid fa-bolt" />
                  <span className="cyber-topic-badge red">{mistakes.length} CÂU SAI</span>
                </div>
                <strong className="cyber-topic-title">Sổ Tay Câu Sai</strong>
                <p className="cyber-topic-desc">Chinh phục toàn bộ các câu bạn đã từng trả lời sai</p>
              </button>
            )}

            {/* Special Quick Topic: Starred Questions */}
            {bookmarks.length > 0 && (
              <button
                type="button"
                className={`cyber-topic-card special-stars ${selectedTopic === "bookmarks" ? "selected" : ""}`}
                onClick={() => {
                  if (soundEnabled) playSound("click");
                  setSelectedTopic("bookmarks");
                }}
              >
                <div className="cyber-topic-head">
                  <i className="fa-solid fa-star" />
                  <span className="cyber-topic-badge gold">{bookmarks.length} CÂU SAO</span>
                </div>
                <strong className="cyber-topic-title">Câu Đã Gắn Sao ⭐</strong>
                <p className="cyber-topic-desc">Ôn lại các câu hỏi khó bạn đã lưu vào danh sách ưu tiên</p>
              </button>
            )}
          </div>
        </div>

        {/* Section 2: Choose Study Mode */}
        <div className="cyber-config-section">
          <label className="cyber-config-label">
            <i className="fa-solid fa-compass" /> 2. Chọn Chế Độ Ôn Luyện
          </label>
          <div className="cyber-mode-grid">
            <button
              type="button"
              className={`cyber-mode-btn ${mode === "practice" ? "selected" : ""}`}
              onClick={() => {
                if (soundEnabled) playSound("click");
                setMode("practice");
              }}
            >
              <div className="cyber-mode-icon cyan">
                <i className="fa-solid fa-bullseye" />
              </div>
              <div className="cyber-mode-info">
                <strong>Luyện Tập Tự Do</strong>
                <span>Biết đáp án ngay, giải thích cặn kẽ từng câu, không giới hạn giờ</span>
              </div>
            </button>

            <button
              type="button"
              className={`cyber-mode-btn ${mode === "exam" ? "selected" : ""}`}
              onClick={() => {
                if (soundEnabled) playSound("click");
                setMode("exam");
              }}
            >
              <div className="cyber-mode-icon gold">
                <i className="fa-solid fa-clock" />
              </div>
              <div className="cyber-mode-info">
                <strong>Thi Thử Tính Giờ</strong>
                <span>Bấm giờ đếm ngược, nộp bài tính điểm xếp loại như phòng thi thực tế</span>
              </div>
            </button>

            <button
              type="button"
              className={`cyber-mode-btn ${mode === "flashcard" ? "selected" : ""}`}
              onClick={() => {
                if (soundEnabled) playSound("click");
                setMode("flashcard");
              }}
            >
              <div className="cyber-mode-icon purple">
                <i className="fa-solid fa-clone" />
              </div>
              <div className="cyber-mode-info">
                <strong>Flashcard 3D</strong>
                <span>Lật thẻ 2 mặt ghi nhớ siêu tốc, tự đánh giá mức độ thuộc bài</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section 3: Settings & Number of Questions */}
        <div className="cyber-config-section">
          <label className="cyber-config-label">
            <i className="fa-solid fa-sliders" /> 3. Tùy Chọn Số Lượng &amp; Đảo Đề
          </label>
          <div className="cyber-settings-row">
            {/* Question count selector */}
            <div className="cyber-setting-box">
              <span className="cyber-setting-title">Số câu ôn tập:</span>
              <div className="cyber-count-btns">
                {Array.from(new Set([10, 20, 30, 60, availableQuestions.length]))
                  .filter((cnt) => cnt > 0 && cnt <= availableQuestions.length)
                  .sort((a, b) => a - b)
                  .map((cnt) => {
                    const isAll = cnt === availableQuestions.length;
                    const label = isAll ? `Tất cả (${cnt})` : `${cnt} câu`;
                    const isCur = questionCount === cnt || (isAll && questionCount >= cnt);
                    return (
                      <button
                        key={cnt}
                        type="button"
                        className={`cyber-count-btn ${isCur ? "active" : ""}`}
                        onClick={() => setQuestionCount(cnt)}
                      >
                        {label}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="cyber-toggles-box">
              <label className="cyber-toggle-item">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                />
                <span>Xáo trộn câu hỏi ngẫu nhiên</span>
              </label>

              <label className="cyber-toggle-item">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                />
                <span>Xáo trộn vị trí A, B, C, D</span>
              </label>

              <label className="cyber-toggle-item">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={toggleSound}
                />
                <span>Âm thanh phản hồi sinh động</span>
              </label>
            </div>
          </div>
        </div>

        {/* Start Action Button */}
        <div className="cyber-start-cta-wrap">
          <button
            type="button"
            className="cyber-big-start-btn"
            onClick={() => startQuiz()}
            disabled={availableQuestions.length === 0}
          >
            <span>
              BẮT ĐẦU ÔN TẬP NGAY ({Math.min(questionCount, availableQuestions.length)} CÂU)
            </span>
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
}
