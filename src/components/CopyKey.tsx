"use client";

import { useState } from "react";

export default function CopyKey({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard bị chặn (http, quyền) — user vẫn chọn chữ copy tay được
    }
  }

  return (
    <>
      <div className="vt-key-value">{value}</div>
      <button type="button" className="vt-btn-ghost" onClick={copy} style={{ marginBottom: 14 }}>
        <i className="fas fa-copy" aria-hidden="true" /> {copied ? "Đã copy" : "Copy key"}
      </button>
    </>
  );
}
