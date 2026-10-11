"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LogIn,
  KeyRound,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { loginAction } from "@/app/actions/auth";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential.trim() || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("credential", credential.trim());
      fd.append("password", password);

      const res = await loginAction(fd);
      if (res.ok) {
        // Chuyển hướng sang đích
        const target = res.data?.redirectUrl || redirectTarget;
        window.location.href = target;
      } else {
        setError(res.error || "Tên đăng nhập hoặc mật khẩu không chính xác.");
      }
    } catch {
      setError("Đã xảy ra lỗi kết nối máy chủ. Vui lòng thử lại sau ít phút.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* NÚT QUAY LẠI TRANG CHỦ */}
      <div className="auth-top-nav">
        <Link href="/" className="auth-back-link">
          <span>← QUAY LẠI TRANG CHỦ</span>
        </Link>
      </div>

      <div className="auth-card-wrap">
        {/* CARD CONTAINER */}
        <div className="auth-card">
          {/* LOGO & TITLE */}
          <div className="auth-header">
            <div className="auth-badge-glow">
              <Sparkles size={14} className="text-sky-400" />
              <span>MINSR PORTAL • THÀNH VIÊN</span>
            </div>
            <h1 className="auth-title">Đăng Nhập Tài Khoản</h1>
            <p className="auth-subtitle">
              Đồng bộ mã Key, số dư xu và mở khóa tính năng độc quyền
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error-box" role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="credential-input" className="auth-label">
                Tên đăng nhập hoặc Email
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <User size={18} />
                </span>
                <input
                  id="credential-input"
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  placeholder="Ví dụ: minsr hoặc email của bạn"
                  className="auth-input"
                  autoComplete="username"
                  autoFocus
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="password-input" className="auth-label">
                  Mật khẩu
                </label>
                <a
                  href="https://t.me/thedarker1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="auth-forgot-link"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <KeyRound size={18} />
                </span>
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                  className="auth-input"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-password-toggle"
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`auth-submit-btn ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  <span>Đang xác thực tài khoản...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>ĐĂNG NHẬP NGAY</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* CHUYỂN SANG ĐĂNG KÝ */}
          <div className="auth-footer-switch">
            <span>Chưa có tài khoản?</span>
            <Link
              href={`/register${redirectTarget !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTarget)}` : ""}`}
              className="auth-switch-link"
            >
              Đăng ký miễn phí ngay →
            </Link>
          </div>

          {/* BENEFIT ICONS ROW */}
          <div className="auth-benefits-grid">
            <div className="auth-benefit-item">
              <KeyRound size={15} className="text-emerald-400" />
              <span>Tự lưu mã Key</span>
            </div>
            <div className="auth-benefit-item">
              <Sparkles size={15} className="text-amber-400" />
              <span>Vòng quay may mắn</span>
            </div>
            <div className="auth-benefit-item">
              <ShieldCheck size={15} className="text-sky-400" />
              <span>Bảo mật 100%</span>
            </div>
          </div>
        </div>

        {/* FOOTER SUPPORT */}
        <div className="auth-sub-footer">
          <p>
            Cần hỗ trợ?{" "}
            <a href="https://t.me/thedarker1" target="_blank" rel="noopener noreferrer">
              Nhắn Admin Telegram @thedarker1
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
