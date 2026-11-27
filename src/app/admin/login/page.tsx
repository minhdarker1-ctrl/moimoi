"use client";

import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, UserCheck, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import FocusedFlowShell from "@/components/FocusedFlowShell";
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
    <div>
      <div className="auth-header">
        <div
          className="auth-badge"
          style={{
            background: "rgba(0, 122, 204, 0.14)",
            border: "1px solid rgba(55, 148, 255, 0.3)",
            color: "#3794ff",
          }}
        >
          <ShieldCheck size={28} />
        </div>
        <h1 className="auth-title" style={{ fontSize: 21, marginTop: 8 }}>
          Đăng Nhập Quản Trị
        </h1>
        <p className="auth-subtitle">
          Nhập tài khoản và mật khẩu quản trị viên để truy cập Control Panel.
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
            background: "#007acc",
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
    </div>
  );
}

export default function LoginPage() {
  return (
    <FocusedFlowShell backHref="/" backLabel="Về trang chủ" maxWidth={440}>
      <Suspense fallback={<div style={{ textAlign: "center", color: "#9d9d9d", padding: 24 }}>Đang tải...</div>}>
        <AdminLoginForm />
      </Suspense>
    </FocusedFlowShell>
  );
}

