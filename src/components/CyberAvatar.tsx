"use client";

import { useEffect, useRef, useState } from "react";

interface CyberAvatarProps {
  avatarUrl?: string | null;
  avatarFrameUrl?: string | null;
  name: string;
}

export default function CyberAvatar({
  avatarUrl,
  avatarFrameUrl,
  name,
}: CyberAvatarProps) {
  // Normalize legacy external URLs to local fast asset
  const normalizedFrame = avatarFrameUrl?.includes("vthangios.xyz")
    ? "/frame.png"
    : avatarFrameUrl;

  const [frameError, setFrameError] = useState(false);
  const frameRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setFrameError(false);
    if (
      frameRef.current &&
      frameRef.current.complete &&
      frameRef.current.naturalWidth === 0
    ) {
      setFrameError(true);
    }
  }, [normalizedFrame]);

  const hasValidFrame = Boolean(normalizedFrame && !frameError);

  return (
    <div className="cyber-avatar-container">
      {/* Dynamic ambient aura glow */}
      <div className={`cyber-avatar-aura ${hasValidFrame ? "has-frame" : ""}`} aria-hidden="true" />

      <div className={`cyber-avatar-ring ${hasValidFrame ? "has-frame" : ""}`}>
        {avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className="cyber-avatar-img"
            src={avatarUrl}
            alt={`Ảnh đại diện ${name}`}
            fetchPriority="high"
            width={320}
            height={320}
          />
        ) : (
          <div className="cyber-avatar-fallback">MS</div>
        )}
        {normalizedFrame && !frameError && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            ref={frameRef}
            className="cyber-avatar-frame-overlay"
            src={normalizedFrame}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            onError={() => setFrameError(true)}
          />
        )}
      </div>
    </div>
  );
}
