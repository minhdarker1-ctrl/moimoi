"use client";

import { useState } from "react";

interface CyberAvatarProps {
  avatarUrl?: string | null;
  avatarFrameUrl?: string | null;
  name: string;
  size?: number;
}

export default function CyberAvatar({
  avatarUrl,
  avatarFrameUrl,
  name,
  size = 76,
}: CyberAvatarProps) {
  const normalizedFrame = avatarFrameUrl?.includes("vthangios.xyz")
    ? "/frame.png"
    : avatarFrameUrl;

  const [frameError, setFrameError] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);

  const hasValidFrame = Boolean(normalizedFrame && !frameError);

  return (
    <div
      className="pro-avatar-container"
      style={{ width: size, height: size }}
    >
      <div className={`pro-avatar-ring ${hasValidFrame ? "has-frame" : ""}`}>
        {avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className="pro-avatar-img"
            src={avatarUrl}
            alt={`Ảnh đại diện ${name}`}
            fetchPriority="high"
            width={size}
            height={size}
          />
        ) : (
          <div className="pro-avatar-fallback">
            {name.slice(0, 2).toUpperCase() || "MS"}
          </div>
        )}
        {normalizedFrame && !frameError && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className="pro-avatar-frame-overlay"
            src={normalizedFrame}
            alt=""
            aria-hidden="true"
            onLoad={() => setFrameLoaded(true)}
            onError={() => setFrameError(true)}
            style={{
              opacity: frameLoaded ? 1 : 0,
              transition: "opacity 0.25s ease-in-out",
            }}
          />
        )}
      </div>
    </div>
  );
}
