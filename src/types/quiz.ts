export interface QuizOption {
  id: string; // "A", "B", "C", "D"
  text: string;
}

export interface QuizQuestion {
  id: number;
  chapterId: string;
  chapterTitle: string;
  question: string;
  options: string[];
  correctIndex: number; // 0, 1, 2, 3
  correctAnswer: string;
  correctAnswerLetter: string; // "A", "B", "C", "D"
  explanation?: string;
  hint?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface QuizTopic {
  id: string;
  title: string;
  desc: string;
  icon: string;
  badge: string;
  count: number;
}

export type QuizMode = "practice" | "exam" | "mistakes" | "flashcard";

export interface QuizResult {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  wrongQuestionIds: number[];
  completedAt: string;
}

export interface UserAnswerRecord {
  questionId: number;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  timeSpentMs?: number;
}
