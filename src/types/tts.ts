export type TTSVoice = "vi-VN-HoaiMyNeural" | "vi-VN-NamMinhNeural";

export type TTSSpeed = "0.8x" | "1.0x" | "1.25x" | "1.5x";

export type TTSQuestionScope = "question_only" | "question_and_options";

export interface TTSSettings {
  voice: TTSVoice;
  speed: TTSSpeed;
  scope: TTSQuestionScope;
  autoReadQuestion: boolean;
  autoReadExplanation: boolean;
}

export type TTSStatus = "idle" | "loading" | "playing" | "paused";

export type TTSTrackType = "question" | "explanation" | "custom";

export interface TTSState {
  status: TTSStatus;
  trackType: TTSTrackType | null;
  text: string;
}
