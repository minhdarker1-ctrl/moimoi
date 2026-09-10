"use client";

import { useState } from "react";

export default function LogVisitorCell({ visitorId }: { visitorId: string }) {
  const [copied, setCopied] = useState(false);

  const short =
    visitorId.length > 14
      ? `${visitorId.slice(0, 12)}...`
      : visitorId;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(visitorId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <span
      className="vt-mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        cursor: "pointer",
        color: "var(--vi-text)",
      }}
      title={`Bấm để sao chép Visitor ID đầy đủ: ${visitorId}`}
      onClick={handleCopy}
    >
      <span>{short}</span>
      <i
        className={copied ? "fa-solid fa-check" : "fa-regular fa-copy"}
        style={{
          fontSize: 11,
          color: copied ? "#10b981" : "var(--vi-muted)",
          opacity: 0.8,
        }}
      />
    </span>
  );
}
