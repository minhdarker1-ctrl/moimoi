"use client";

import { useState, useEffect, useCallback } from "react";
import { LeaderboardEntry } from "@/types/leaderboard";
import { QUIZ_TOPICS } from "@/data/quizBank";

interface QuizLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserName?: string;
  defaultMode?: "exam" | "practice" | "all";
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

export default function QuizLeaderboardModal({
  isOpen,
  onClose,
  currentUserName,
  defaultMode = "exam",
}: QuizLeaderboardModalProps) {
  const [filterMode, setFilterMode] = useState<"exam" | "practice" | "all">(defaultMode);
  const [filterTopic, setFilterTopic] = useState<string>("all");
  const [records, setRecords] = useState<LeaderboardEntry[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/leaderboard?mode=${filterMode}&topicId=${filterTopic}&limit=50`);
      const data = await res.json();
      if (data.success && Array.isArray(data.records)) {
        setRecords(data.records);
        setTotalCount(data.totalCount || data.records.length);
      }
    } catch (err) {
      console.warn("[Leaderboard Fetch Error]:", err);
    } finally {
      setLoading(false);
    }
  }, [filterMode, filterTopic]);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen, fetchLeaderboard]);

  if (!isOpen) return null;

  const top1 = records[0];
  const top2 = records[1];
  const top3 = records[2];
  const rest = records.slice(3);

  return (
    <div className="quiz-lb-modal-overlay" onClick={onClose}>
      <div className="quiz-lb-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="quiz-lb-header">
          <div className="quiz-lb-title-wrap">
            <span className="quiz-lb-trophy-icon">🏆</span>
            <div>
              <h2 className="quiz-lb-title">BẢNG VÀNG DANH DỰ</h2>
              <p className="quiz-lb-subtitle">Vinh danh điểm số cao nhất & thời gian giải đề nhanh nhất môn Công Nghệ Kim Loại</p>
            </div>
          </div>
          <div className="quiz-lb-header-actions">
            <button
              type="button"
              className="quiz-lb-refresh-btn"
              onClick={fetchLeaderboard}
              title="Làm mới bảng vàng"
            >
              <i className={`fa-solid fa-rotate-right ${loading ? "fa-spin" : ""}`} />
            </button>
            <button
              type="button"
              className="quiz-lb-close-btn"
              onClick={onClose}
              title="Đóng bảng vàng"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="quiz-lb-filters-bar">
          <div className="quiz-lb-mode-tabs">
            <button
              type="button"
              className={`quiz-lb-mode-tab ${filterMode === "exam" ? "active" : ""}`}
              onClick={() => setFilterMode("exam")}
            >
              <i className="fa-solid fa-clock" /> Thi Thử
            </button>
            <button
              type="button"
              className={`quiz-lb-mode-tab ${filterMode === "practice" ? "active" : ""}`}
              onClick={() => setFilterMode("practice")}
            >
              <i className="fa-solid fa-bullseye" /> Luyện Tập
            </button>
            <button
              type="button"
              className={`quiz-lb-mode-tab ${filterMode === "all" ? "active" : ""}`}
              onClick={() => setFilterMode("all")}
            >
              <i className="fa-solid fa-layer-group" /> Tất Cả
            </button>
          </div>

          <div className="quiz-lb-topic-select-wrap">
            <select
              className="quiz-lb-topic-select"
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
            >
              <option value="all">Toàn Bộ Ngân Hàng (335 câu)</option>
              {QUIZ_TOPICS.filter((t) => t.id.startsWith("ch")).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.count} câu)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="quiz-lb-body">
          {loading ? (
            <div className="quiz-lb-loading">
              <i className="fa-solid fa-circle-notch fa-spin" />
              <span>Đang tải bảng vàng...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="quiz-lb-empty">
              <span className="quiz-lb-empty-icon">🎖️</span>
              <p>Chưa có ai ghi danh ở danh mục này!</p>
              <span>Hãy hoàn thành bài thi và trở thành người đầu tiên bước lên Bảng Vàng nhé!</span>
            </div>
          ) : (
            <>
              {/* Top 3 Podium (Bục Vinh Quang) */}
              <div className="quiz-lb-podium-wrap">
                {/* Hạng 2: Á Quân Bạc */}
                <div className={`quiz-lb-podium-slot slot-2 ${!top2 ? "empty" : ""}`}>
                  {top2 ? (
                    <>
                      <div className="quiz-lb-podium-avatar silver">
                        <span>🥈</span>
                      </div>
                      <div className="quiz-lb-podium-name" title={top2.userName}>{top2.userName}</div>
                      <div className="quiz-lb-podium-score text-blue">{top2.scorePercentage}%</div>
                      <div className="quiz-lb-podium-time">
                        <i className="fa-solid fa-clock" /> {formatDuration(top2.timeSpentSeconds)}
                      </div>
                      <div className="quiz-lb-podium-pillar pillar-2">
                        <span className="pillar-rank">#2</span>
                      </div>
                    </>
                  ) : (
                    <div className="quiz-lb-podium-pillar pillar-2 empty-pillar">
                      <span className="pillar-rank">#2</span>
                    </div>
                  )}
                </div>

                {/* Hạng 1: Quán Quân Vàng */}
                <div className={`quiz-lb-podium-slot slot-1 ${!top1 ? "empty" : ""}`}>
                  {top1 && (
                    <>
                      <div className="quiz-lb-podium-crown">👑</div>
                      <div className="quiz-lb-podium-avatar gold">
                        <span>🥇</span>
                      </div>
                      <div className="quiz-lb-podium-name gold-name" title={top1.userName}>{top1.userName}</div>
                      <div className="quiz-lb-podium-score text-gold">{top1.scorePercentage}%</div>
                      <div className="quiz-lb-podium-time">
                        <i className="fa-solid fa-clock" /> {formatDuration(top1.timeSpentSeconds)}
                      </div>
                      <div className="quiz-lb-podium-pillar pillar-1">
                        <span className="pillar-rank">#1 QUÁN QUÂN</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Hạng 3: Quý Quân Đồng */}
                <div className={`quiz-lb-podium-slot slot-3 ${!top3 ? "empty" : ""}`}>
                  {top3 ? (
                    <>
                      <div className="quiz-lb-podium-avatar bronze">
                        <span>🥉</span>
                      </div>
                      <div className="quiz-lb-podium-name" title={top3.userName}>{top3.userName}</div>
                      <div className="quiz-lb-podium-score text-orange">{top3.scorePercentage}%</div>
                      <div className="quiz-lb-podium-time">
                        <i className="fa-solid fa-clock" /> {formatDuration(top3.timeSpentSeconds)}
                      </div>
                      <div className="quiz-lb-podium-pillar pillar-3">
                        <span className="pillar-rank">#3</span>
                      </div>
                    </>
                  ) : (
                    <div className="quiz-lb-podium-pillar pillar-3 empty-pillar">
                      <span className="pillar-rank">#3</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Leaderboard Table (Top 4 onwards or all) */}
              <div className="quiz-lb-table-wrap">
                <div className="quiz-lb-table-header">
                  <span>Top Xếp Hạng ({totalCount} lượt thi)</span>
                </div>
                <div className="quiz-lb-table-scroll">
                  <table className="quiz-lb-table">
                    <thead>
                      <tr>
                        <th style={{ width: "50px", textAlign: "center" }}>#</th>
                        <th>Thí Sinh</th>
                        <th style={{ textAlign: "center" }}>Điểm Số</th>
                        <th style={{ textAlign: "center" }}>Thời Gian</th>
                        <th>Chủ Đề</th>
                        <th style={{ textAlign: "right" }}>Thời Điểm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((entry, index) => {
                        const rank = index + 1;
                        const isMe = currentUserName && entry.userName.toLowerCase() === currentUserName.toLowerCase();
                        let rowClass = "quiz-lb-row";
                        if (isMe) rowClass += " is-me";
                        if (rank === 1) rowClass += " rank-1";
                        if (rank === 2) rowClass += " rank-2";
                        if (rank === 3) rowClass += " rank-3";

                        return (
                          <tr key={entry.id} className={rowClass}>
                            <td className="quiz-lb-cell-rank">
                              {rank === 1 && <span className="rank-badge gold">🥇</span>}
                              {rank === 2 && <span className="rank-badge silver">🥈</span>}
                              {rank === 3 && <span className="rank-badge bronze">🥉</span>}
                              {rank > 3 && <span className="rank-number">{rank}</span>}
                            </td>
                            <td className="quiz-lb-cell-name">
                              <span className="entry-username">{entry.userName}</span>
                              {isMe && <span className="me-chip">Bạn</span>}
                            </td>
                            <td className="quiz-lb-cell-score">
                              <strong className={entry.scorePercentage >= 90 ? "text-green" : entry.scorePercentage >= 70 ? "text-blue" : "text-orange"}>
                                {entry.scorePercentage}%
                              </strong>
                              <span className="correct-fraction">({entry.correctCount}/{entry.totalQuestions})</span>
                            </td>
                            <td className="quiz-lb-cell-time">
                              <i className="fa-solid fa-stopwatch" /> {formatDuration(entry.timeSpentSeconds)}
                            </td>
                            <td className="quiz-lb-cell-topic">
                              <span className="topic-badge" title={entry.topicTitle}>
                                {entry.mode === "exam" ? "Thi thử · " : "Luyện tập · "}
                                {entry.topicTitle.length > 25 ? entry.topicTitle.slice(0, 25) + "..." : entry.topicTitle}
                              </span>
                            </td>
                            <td className="quiz-lb-cell-date">
                              {formatDate(entry.createdAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="quiz-lb-footer">
          <span className="quiz-lb-footer-tip">
            💡 <strong>Mẹo:</strong> Hoàn thành bài thi thử với điểm số cao và thời gian nhanh để leo lên top đầu Bảng Vàng!
          </span>
          <button type="button" className="quiz-lb-done-btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
