"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, User, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/actions/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const fd = new FormData();
      fd.set("credential", credential);
      fd.set("password", password);

      const res = await loginAction(fd);
      if (!res.ok) {
        setError(res.error || "Đăng nhập thất bại. Vui lòng thử lại.");
        return;
      }

      const target = redirect || (res.data?.role === "ADMIN" ? "/admin" : "/dashboard");
      router.push(target);
      router.refresh();
    });
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-badge">
          <ShieldCheck size={28} className="text-accent" />
        </div>
        <h1 className="auth-title">Đăng Nhập</h1>
        <p className="auth-subtitle">
          Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
        </p>
      </div>

      {error && (
        <div className="auth-error-box" role="alert">
          <span className="auth-error-dot" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="credential">Tên đăng nhập hoặc Email</label>
          <div className="auth-input-wrapper">
            <User size={18} className="auth-input-icon" />
            <input
              id="credential"
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="Nhập username hoặc email..."
              required
              autoComplete="username"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="password">Mật khẩu</label>
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />
            <input
              id="password"
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
          disabled={isPending || !credential || !password}
        >
          {isPending ? (
            <span className="auth-loading-spinner" />
          ) : (
            <>
              <LogIn size={18} />
              <span>Đăng Nhập</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <span>Chưa có tài khoản? </span>
        <Link href={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}>
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="auth-wrapper">
      <Link href="/" className="auth-back-link">
        <ArrowLeft size={16} />
        <span>Về trang chủ</span>
      </Link>

      <Suspense fallback={<div className="auth-card">Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
