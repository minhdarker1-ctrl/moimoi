"use client";

import { useState, useTransition } from "react";
import { unlockApp } from "@/app/actions";

export default function UnlockForm({ appId }: { appId: number }) {
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState("");
  const [url, setUrl] = useState("");
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    start(async () => {
      const r = await unlockApp(appId, key);
      if (r.ok) {
        setUrl(r.url);
        setMsg("");
      } else {
        setUrl("");
        setMsg(r.error);
      }
    });
  }

  if (url) {
    return (
      <div className="vthangios-app-actions">
        <a className="vthangios-download-btn" href={url} target="_blank" rel="noopener noreferrer">
          <span>Tải Xuống</span>
          <i className="bi bi-download" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <>
      <form className="vt-unlock" onSubmit={submit}>
        <label className="vt-sr-only" htmlFor={`key-${appId}`}>
          Nhập key
        </label>
        <input
          id={`key-${appId}`}
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Nhập key để tải"
          autoComplete="off"
          spellCheck={false}
          maxLength={40}
          required
        />
        <button type="submit" disabled={pending}>
          {pending ? "..." : "Mở"}
        </button>
      </form>
      {msg && (
        <p className="vt-msg vt-msg-err" role="alert">
          {msg}
        </p>
      )}
    </>
  );
}
