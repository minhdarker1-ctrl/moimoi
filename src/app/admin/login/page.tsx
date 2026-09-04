"use client";

import { useState } from "react";
import { login } from "../actions";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function onSubmit(fd: FormData) {
    const r = await login(fd);
    if (r?.error) setError(r.error);
  }

  return (
    <main>
      <div className="vt-key-card">
        <h1 style={{ fontSize: 19, margin: "0 0 14px" }}>Đăng nhập quản trị</h1>
        <form action={onSubmit} className="vt-form">
          <label className="vt-field">
            <span>Mật khẩu</span>
            <input type="password" name="password" required autoComplete="current-password" />
          </label>
          <button className="vt-btn-primary" type="submit">
            Đăng nhập
          </button>
        </form>
        {error && (
          <p className="vt-msg vt-msg-err" role="alert" style={{ padding: "10px 0 0" }}>
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
