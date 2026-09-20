"use client";

/**
 * MusicPlayer — phát nhạc nền YouTube qua IFrame API.
 * Thiết kế giao diện theo ảnh mẫu:
 * - Ảnh thumbnail tròn viền cam bên trái
 * - Hàng trên: Icon sóng nhạc tím + Tên bài + Nghệ sĩ, bên phải là cụm nút [⏮] [▶/⏸] [⏭]
 * - Hàng dưới: Thanh tiến độ 0:10 ────○──── 5:26
 *
 * Tự động phát nhạc khi vào web:
 * 1. Gọi unMute() và playVideo() ngay khi player onReady.
 * 2. Nếu trình duyệt chặn autoplay khi chưa có tương tác (Chrome/Safari policy):
 *    Tự động lắng nghe lần chạm / click / phím đầu tiên trên trang để kích hoạt phát ngay lập tức.
 */

import { useEffect, useRef, useState, useCallback } from "react";

interface Track {
  id: number;
  youtubeId: string;
  title: string;
  artist: string;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          width?: string | number;
          height?: string | number;
          videoId?: string;
          playerVars?: Record<string, number | string | undefined>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number }) => void;
            onError?: (e: { data: number }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
      ready?: (fn: () => void) => void;
      loaded?: number;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  loadVideoById(id: string | { videoId: string; startSeconds?: number }): void;
  cueVideoById(id: string): void;
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  getPlayerState(): number;
  unMute(): void;
  mute(): void;
  isMuted(): boolean;
  setVolume(volume: number): void;
  getVolume(): number;
  destroy(): void;
}

function ensureYouTubeApi(callback: () => void) {
  if (typeof window === "undefined") return;

  // 1. Đã sẵn sàng constructor
  if (window.YT && typeof window.YT.Player === "function") {
    callback();
    return;
  }

  // 2. YT.ready có sẵn
  if (window.YT && typeof window.YT.ready === "function") {
    window.YT.ready(callback);
    return;
  }

  let called = false;
  const safeCallback = () => {
    if (called) return;
    called = true;
    callback();
  };

  // 3. Hook vào onYouTubeIframeAPIReady
  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    if (prev) {
      try {
        prev();
      } catch {}
    }
    safeCallback();
  };

  // 4. Chèn script nếu chưa có
  if (!document.getElementById("yt-api-script")) {
    const tag = document.createElement("script");
    tag.id = "yt-api-script";
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(tag, firstScript);
    } else {
      document.head.appendChild(tag);
    }
  }

  // 5. Polling dự phòng khi script load xong mà callback không kích hoạt
  const timer = setInterval(() => {
    if (window.YT && typeof window.YT.Player === "function") {
      clearInterval(timer);
      safeCallback();
    }
  }, 250);
  setTimeout(() => clearInterval(timer), 10000);
}

export default function MusicPlayer() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const manualExpandScrollYRef = useRef<number | null>(null);

  // Khi kéo cuộn xuống quá 80px: tự động thu nhỏ lại ở góc
  // Thu nhỏ là thu nhỏ luôn, KHÔNG tự động phóng to lại khi cuộn lên đỉnh trang.
  // Chỉ phóng to khi user tự bấm vào widget thu nhỏ để mở rộng.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      if (y > 80) {
        // Nếu user vừa bấm phóng to thủ công, chỉ tự thu nhỏ nếu cuộn xa vị trí đó > 120px
        if (manualExpandScrollYRef.current !== null) {
          if (Math.abs(y - manualExpandScrollYRef.current) > 120) {
            manualExpandScrollYRef.current = null;
            setMinimized(true);
          }
        } else {
          setMinimized(true);
        }
      }
      // Không bao giờ tự động mở rộng khi cuộn lên đầu trang (giữ thu nhỏ luôn đến khi user bấm phóng to)
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMinimize = () => {
    setMinimized((prev) => {
      const next = !prev;
      if (!next) {
        // User vừa bấm phóng to bằng tay
        manualExpandScrollYRef.current = typeof window !== "undefined" ? window.scrollY : 0;
      } else {
        manualExpandScrollYRef.current = null;
      }
      return next;
    });
  };

  const playerRef = useRef<YTPlayer | null>(null);
  const isPlayerReadyRef = useRef(false);
  const userPausedRef = useRef(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tracksRef = useRef<Track[]>([]);
  tracksRef.current = tracks;
  const indexRef = useRef(index);
  indexRef.current = index;
  const prevIndexRef = useRef<number | null>(null);
  const consecutiveErrorsRef = useRef(0);

  // 1. Lấy danh sách bài hát từ API
  useEffect(() => {
    let active = true;
    fetch("/api/music")
      .then((r) => r.json())
      .then((data: Track[]) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setTracks(data);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const nextTrack = useCallback(() => {
    if (tracksRef.current.length === 0) return;
    setIndex((prev) => (prev + 1) % tracksRef.current.length);
  }, []);

  const prevTrack = useCallback(() => {
    if (tracksRef.current.length === 0) return;
    setIndex((prev) => (prev - 1 + tracksRef.current.length) % tracksRef.current.length);
  }, []);

  // 2. Khởi tạo YouTube Player khi có danh sách bài
  useEffect(() => {
    if (tracks.length === 0) return;
    let isMounted = true;

    ensureYouTubeApi(() => {
      if (!isMounted) return;
      const host = document.getElementById("youtube-audio-host");
      if (!host || playerRef.current) return;

      const track = tracksRef.current[indexRef.current] || tracksRef.current[0];
      if (!track) return;

      try {
        playerRef.current = new window.YT.Player("youtube-audio-host", {
          width: "200",
          height: "200",
          videoId: track.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1,
            origin: typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: (e) => {
              if (!isMounted) return;
              isPlayerReadyRef.current = true;
              try {
                e.target.unMute();
                e.target.setVolume(100);
                const dur = e.target.getDuration();
                if (dur > 0) setDuration(dur);
              } catch {}
            },
            onStateChange: (e) => {
              if (!isMounted) return;
              const YT = window.YT;
              if (!YT) return;
              if (e.data === YT.PlayerState.PLAYING) {
                setPlaying(true);
                consecutiveErrorsRef.current = 0;
                const dur = playerRef.current?.getDuration() || 0;
                if (dur > 0) setDuration(dur);
              } else if (e.data === YT.PlayerState.PAUSED) {
                setPlaying(false);
              } else if (e.data === YT.PlayerState.ENDED) {
                nextTrack();
              }
            },
            onError: (e) => {
              if (!isMounted) return;
              console.warn("YouTube player error code:", e.data);
              consecutiveErrorsRef.current += 1;
              if (consecutiveErrorsRef.current < tracksRef.current.length) {
                nextTrack();
              } else {
                setPlaying(false);
              }
            },
          },
        });
      } catch (err) {
        console.error("Lỗi khởi tạo YT.Player:", err);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [tracks.length, nextTrack]);

  // 3. Đổi bài khi index thay đổi (Next/Prev hoặc hết bài)
  useEffect(() => {
    if (prevIndexRef.current === null) {
      prevIndexRef.current = index;
      return;
    }
    if (prevIndexRef.current === index) return;
    prevIndexRef.current = index;

    if (!playerRef.current || !isPlayerReadyRef.current || tracks.length === 0) return;
    const currentTrack = tracks[index];
    if (!currentTrack) return;

    try {
      playerRef.current.unMute();
      playerRef.current.setVolume(100);
      playerRef.current.loadVideoById(currentTrack.youtubeId);
      playerRef.current.playVideo();
      setPlaying(true);
      userPausedRef.current = false;
    } catch {}
  }, [index, tracks]);

  // 4. Timer cập nhật progress bar
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (playing && playerRef.current) {
      tickRef.current = setInterval(() => {
        try {
          const t = playerRef.current?.getCurrentTime() ?? 0;
          const d = playerRef.current?.getDuration() ?? 0;
          setCurrent(t);
          if (d > 0) setDuration(d);
        } catch {}
      }, 800);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [playing]);

  const togglePlay = () => {
    if (!playerRef.current || !isPlayerReadyRef.current) return;
    try {
      playerRef.current.unMute();
      playerRef.current.setVolume(100);
      if (playing) {
        userPausedRef.current = true;
        playerRef.current.pauseVideo();
      } else {
        userPausedRef.current = false;
        playerRef.current.playVideo();
      }
    } catch {}
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    try {
      playerRef.current?.seekTo(val, true);
    } catch {}
    setCurrent(val);
  };

  const fmt = (s: number) => {
    if (!Number.isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const track = tracks[index];
  const thumb = track
    ? `https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg`
    : "";

  return (
    <>
      {/* 
        Container YouTube Player kích thước 200x200 đặt trong viewport nhưng vô hình,
        để Chrome/Safari không suspend/pause âm thanh do coi là hidden/offscreen.
      */}
      <div
        style={{
          position: "fixed",
          bottom: "0px",
          right: "0px",
          width: "200px",
          height: "200px",
          opacity: 0.001,
          pointerEvents: "none",
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        <div id="youtube-audio-host" />
      </div>

      {/* Giao diện Music Player nổi ở cuối trang */}
      {tracks.length > 0 &&
        (minimized ? (
          <div
            className={`mdarker-music-minimized${playing ? " playing" : ""}`}
            title="Nhấp để mở rộng trình phát nhạc"
          >
            {/* Thumbnail đĩa xoay có thể click mở rộng */}
            <div
              className={`mdarker-music-mini-thumb${playing ? " mdarker-music-playing" : ""}`}
              onClick={toggleMinimize}
              role="button"
              tabIndex={0}
              aria-label="Mở rộng trình phát nhạc"
            >
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt={track?.title || "Music"} />
              ) : (
                <div className="mdarker-music-thumb-placeholder">🎵</div>
              )}
              {playing && <span className="mdarker-music-mini-dot" />}
            </div>

            {/* Thông tin bài hát ngắn gọn */}
            <div
              className="mdarker-music-mini-info"
              onClick={toggleMinimize}
              role="button"
              tabIndex={0}
            >
              <div className="mdarker-music-mini-title">{track?.title}</div>
              <div className="mdarker-music-mini-artist">{track?.artist || "Đang phát"}</div>
            </div>

            {/* Nút Play/Pause trực tiếp & Nút Phóng to */}
            <div className="mdarker-music-mini-actions">
              <button
                type="button"
                onClick={togglePlay}
                className="mdarker-music-mini-btn"
                aria-label={playing ? "Dừng" : "Phát"}
                title={playing ? "Dừng nhạc" : "Bật nhạc"}
              >
                <i className={playing ? "bi bi-pause-fill" : "bi bi-play-fill"} />
              </button>
              <button
                type="button"
                onClick={toggleMinimize}
                className="mdarker-music-mini-btn mdarker-music-expand-btn"
                aria-label="Mở rộng trình phát"
                title="Mở rộng"
              >
                <i className="bi bi-arrows-angle-expand" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mdarker-music-player">
            {/* Thumbnail tròn viền cam */}
            <div className={`mdarker-music-thumb${playing ? " mdarker-music-playing" : ""}`}>
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt={track?.title || "Music"} />
              ) : (
                <div className="mdarker-music-thumb-placeholder">🎵</div>
              )}
            </div>

            {/* Nội dung thông tin + thanh điều khiển */}
            <div className="mdarker-music-content">
              {/* Hàng trên: Tiêu đề + Nghệ sĩ bên trái, Nút điều khiển bên phải */}
              <div className="mdarker-music-top-row">
                <div className="mdarker-music-info">
                  <div className="mdarker-music-title-wrap">
                    <span
                      className={`mdarker-music-eq-icon${
                        playing ? " mdarker-music-eq-active" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <span />
                      <span />
                      <span />
                    </span>
                    <span className="mdarker-music-title" title={track?.title}>
                      {track?.title}
                    </span>
                  </div>
                  {track?.artist && (
                    <p className="mdarker-music-artist">{track.artist}</p>
                  )}
                </div>

                {/* Cụm nút: Bài trước - Phát/Dừng - Bài sau - Thu nhỏ */}
                <div className="mdarker-music-controls">
                  <button
                    type="button"
                    onClick={prevTrack}
                    aria-label="Bài trước"
                    className="mdarker-music-btn"
                  >
                    <i className="bi bi-skip-start-fill" />
                  </button>
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={playing ? "Dừng" : "Phát"}
                    className={`mdarker-music-btn mdarker-music-btn-main${
                      !playing ? " mdarker-music-btn-pulse" : ""
                    }`}
                    title={playing ? "Dừng nhạc" : "Bật nhạc"}
                  >
                    <i className={playing ? "bi bi-pause-fill" : "bi bi-play-fill"} />
                  </button>
                  <button
                    type="button"
                    onClick={nextTrack}
                    aria-label="Bài sau"
                    className="mdarker-music-btn"
                  >
                    <i className="bi bi-skip-end-fill" />
                  </button>
                  <button
                    type="button"
                    onClick={toggleMinimize}
                    aria-label="Thu nhỏ vào góc"
                    className="mdarker-music-btn mdarker-music-minimize-btn"
                    title="Thu nhỏ vào góc"
                  >
                    <i className="bi bi-chevron-down" />
                  </button>
                </div>
              </div>

              {/* Hàng dưới: Thanh tiến độ phát nhạc */}
              <div className="mdarker-music-progress">
                <span className="mdarker-music-time">{fmt(current)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={current}
                  onChange={seek}
                  className="mdarker-music-range"
                  aria-label="Tiến độ bài nhạc"
                  style={{
                    background:
                      duration > 0
                        ? `linear-gradient(to right, #6366f1 ${
                            (current / duration) * 100
                          }%, rgba(0,0,0,0.1) ${(current / duration) * 100}%)`
                        : undefined,
                  }}
                />
                <span className="mdarker-music-time">{fmt(duration)}</span>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
