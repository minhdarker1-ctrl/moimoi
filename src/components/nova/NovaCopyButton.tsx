"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function NovaCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is blocked
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`nova-copy-btn ${copied ? "copied" : ""}`}
      title={copied ? "Đã sao chép!" : "Sao chép key"}
      aria-label="Sao chép key"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? "Đã chép" : "Copy"}</span>
    </button>
  );
}
