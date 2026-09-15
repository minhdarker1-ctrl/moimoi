"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus, User, Lock, Mail, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { registerAction } from "@/app/actions/auth";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.set("username", username);
      fd.set("name", name);
      fd.set("email", email);
      fd.set("password", password);

      const res = await registerAction(fd);
      if (!res.ok) {
        setError(res.error || "Đăng ký thất bại. Vui lòng thử lại.");
        return;
      }

      router.push(redirect || "/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-badge">
          <Sparkles size={28} className="text-accent" />
        </div>
        <h1 className="auth-title">Đăng Ký Tài Khoản</h1>
        <p className="auth-subtitle">
          Tạo tài khoản để lưu key, quản lý tiện ích và trải nghiệm đầy đủ tính năng.
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
          <label htmlFor="username">Tên đăng nhập *</label>
          <div className="auth-input-wrapper">
            <User size={18} className="auth-input-icon" />
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="Ví dụ: darkerminh"
              required
              autoComplete="username"
              disabled={isPending}
            />
          </div>
          <small className="auth-hint">Chỉ gồm chữ thường, số, dấu gạch ngang hoặc gạch dưới.</small>
        </div>

        <div className="auth-field">
          <label htmlFor="name">Tên hiển thị (Tùy chọn)</label>
          <div className="auth-input-wrapper">
            <User size={18} className="auth-input-icon" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Minh Darker"
              autoComplete="name"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="email">Email (Tùy chọn - để nhận thông báo)</label>
          <div className="auth-input-wrapper">
            <Mail size={18} className="auth-input-icon" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              autoComplete="email"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="password">Mật khẩu *</label>
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự..."
              required
              autoComplete="new-password"
              disabled={isPending}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu..."
              required
              autoComplete="new-password"
              disabled={isPending}
            />
          </div>
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isPending || !username || !password || !confirmPassword}
        >
          {isPending ? (
            <span className="auth-loading-spinner" />
          ) : (
            <>
              <UserPlus size={18} />
              <span>Tạo Tài Khoản</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <span>Đã có tài khoản? </span>
        <Link href={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}>
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="auth-wrapper">
      <Link href="/" className="auth-back-link">
        <ArrowLeft size={16} />
        <span>Về trang chủ</span>
      </Link>

      <Suspense fallback={<div className="auth-card">Đang tải...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
