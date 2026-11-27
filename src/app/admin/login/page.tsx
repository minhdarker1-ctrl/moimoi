"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, UserCheck, Lock, Eye, EyeOff, ArrowLeft, LogIn } from "lucide-react";
import { login } from "../actions";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const fd = new FormData();
      fd.set("username", username);
      fd.set("password", password);
      if (redirect) fd.set("redirect", redirect);

      const r = await login(fd);
      if (r?.error) {
        setError(r.error);
      }
    });
  };

  return (
    <div className="auth-card" style={{ maxWidth: 440, margin: "40px auto" }}>
      <div className="auth-header">
        <div
          className="auth-badge"
          style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(168, 85, 247, 0.2))",
            color: "#ef4444",
          }}
        >
          <ShieldCheck size={32} />
        </div>
        <h1 className="auth-title" style={{ fontSize: 22, marginTop: 8 }}>
          Đăng Nhập Quản Trị
        </h1>
        <p className="auth-subtitle">
          Vui lòng nhập tài khoản và mật khẩu quản trị viên để truy cập Control Panel.
        </p>
      </div>

      {error && (
        <div className="auth-error-box" role="alert" style={{ marginBottom: 16 }}>
          <span className="auth-error-dot" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <input type="hidden" name="redirect" value={redirect} />

        <div className="auth-field">
          <label htmlFor="admin-username">Tài khoản quản trị</label>
          <div className="auth-input-wrapper">
            <UserCheck size={18} className="auth-input-icon" />
            <input
              id="admin-username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên tài khoản admin..."
              required
              autoComplete="username"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="admin-password">Mật khẩu quản trị</label>
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />
            <input
              id="admin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              required
              autoComplete="current-password"
              disabled={isPending}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isPending || !password}
          style={{
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            marginTop: 8,
          }}
        >
          {isPending ? (
            <span className="auth-loading-spinner" />
          ) : (
            <>
              <LogIn size={18} />
              <span>Đăng Nhập Quản Trị</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-footer" style={{ marginTop: 20 }}>
        <Link href="/" style={{ color: "var(--vi-muted)", fontSize: 13 }}>
          ← Về lại trang chủ người dùng
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="auth-wrapper" style={{ padding: "40px 16px" }}>
      <Link href="/" className="auth-back-link">
        <ArrowLeft size={16} />
        <span>Về trang chủ</span>
      </Link>

      <Suspense fallback={<div className="auth-card" style={{ maxWidth: 440, margin: "40px auto" }}>Đang tải...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}

