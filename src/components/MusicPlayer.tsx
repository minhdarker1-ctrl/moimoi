"use client";

/**
 * MusicPlayer — mini player nổi cuối trang, tự phát nhạc YouTube khi vào web.
 * Luôn hiện đầy đủ, không có nút thu nhỏ.
 * IFrame được đặt ra ngoài viewport (không display:none) để tuân ToS YouTube.
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
        el: HTMLElement,
        opts: {
          height: string;
          width: string;
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; UNSTARTED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(id: string): void;
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(sec: number, allow: boolean): void;
}

export default function MusicPlayer() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);

  const playerRef = useRef<YTPlayer | null>(null);
  const iframeContainerRef = useRef<HTMLDivElement | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load playlist
  useEffect(() => {
    fetch("/api/music")
      .then((r) => r.json())
      .then((data: Track[]) => setTracks(data))
      .catch(() => {});
  }, []);

  // Tải YouTube IFrame API script một lần
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("yt-api-script")) return;
    const script = document.createElement("script");
    script.id = "yt-api-script";
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  }, []);

  const track = tracks[index];

  const loadTrack = useCallback((yt: YTPlayer, vid: string) => {
    yt.loadVideoById(vid);
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!track || typeof window === "undefined") return;

    const initPlayer = () => {
      if (!iframeContainerRef.current) return;

      // Player đã có — chỉ load bài mới
      if (playerRef.current) {
        loadTrack(playerRef.current, track.youtubeId);
        return;
      }

      playerRef.current = new window.YT.Player(iframeContainerRef.current, {
        height: "1",
        width: "1",
        videoId: track.youtubeId,
        // autoplay: 1 — trình duyệt thường cho phép vì YouTube được whitelist
        playerVars: { autoplay: 1, controls: 0, rel: 0, playsinline: 1 },
        events: {
          onReady: (e) => {
            playerRef.current = e.target;
            setReady(true);
            setDuration(e.target.getDuration());
            e.target.playVideo();
            setPlaying(true);
          },
          onStateChange: (e) => {
            const YT = window.YT;
            if (e.data === YT.PlayerState.PLAYING) {
              setPlaying(true);
              setDuration(playerRef.current?.getDuration() ?? 0);
            } else if (e.data === YT.PlayerState.PAUSED) {
              setPlaying(false);
            } else if (e.data === YT.PlayerState.ENDED) {
              // Tự chuyển bài kế tiếp và lặp playlist
              setIndex((i) => (i + 1) % tracks.length);
            } else if (e.data === YT.PlayerState.UNSTARTED || e.data === -1) {
              // Một số trình duyệt giữ ở UNSTARTED trước khi cho autoplay — thử lại sau 300ms
              setTimeout(() => playerRef.current?.playVideo(), 300);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.youtubeId]);

  // Cập nhật progress bar mỗi giây
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (playing && playerRef.current) {
      tickRef.current = setInterval(() => {
        const t = playerRef.current?.getCurrentTime() ?? 0;
        const d = playerRef.current?.getDuration() ?? 0;
        setCurrent(t);
        if (d > 0) setDuration(d);
      }, 1000);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [playing]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const prev = () => setIndex((i) => (i - 1 + tracks.length) % tracks.length);
  const next = () => setIndex((i) => (i + 1) % tracks.length);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    playerRef.current?.seekTo(val, true);
    setCurrent(val);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Không render nếu playlist rỗng
  if (tracks.length === 0) return null;

  const thumb = track
    ? `https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg`
    : "";

  return (
    <>
      {/* IFrame YouTube đặt ngoài viewport — không display:none để tuân ToS */}
      <div
        style={{ position: "fixed", bottom: "-10px", right: "-10px", width: 1, height: 1, overflow: "hidden" }}
        aria-hidden="true"
      >
        <div ref={iframeContainerRef} />
      </div>

      {/* Mini player — luôn hiện đầy đủ ở cuối trang */}
      <div className="mdarker-music-player">
        {/* Thumbnail tròn + ring cam + equalizer khi phát */}
        <div className={`mdarker-music-thumb${playing ? " mdarker-music-playing" : ""}`}>
          {thumb && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt={track?.title} />
          )}
          {playing && (
            <div className="mdarker-music-eq" aria-hidden="true">
              <span /><span /><span />
            </div>
          )}
        </div>

        {/* Info + điều khiển — luôn hiện */}
        <div className="mdarker-music-body">
          <div className="mdarker-music-info">
            <p className="mdarker-music-title">{track?.title}</p>
            <p className="mdarker-music-artist">{track?.artist}</p>
          </div>

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
            />
            <span className="mdarker-music-time">{fmt(duration)}</span>
          </div>

          <div className="mdarker-music-controls">
            <button onClick={prev} aria-label="Bài trước" className="mdarker-music-btn">
              <i className="bi bi-skip-start-fill" />
            </button>
            <button
              onClick={togglePlay}
              aria-label={playing ? "Dừng" : "Phát"}
              className="mdarker-music-btn mdarker-music-btn-main"
              disabled={!ready}
            >
              <i className={playing ? "bi bi-pause-fill" : "bi bi-play-fill"} />
            </button>
            <button onClick={next} aria-label="Bài sau" className="mdarker-music-btn">
              <i className="bi bi-skip-end-fill" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
