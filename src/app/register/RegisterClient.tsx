"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UserPlus,
  KeyRound,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Mail,
  Smile,
} from "lucide-react";
import { registerAction } from "@/app/actions/auth";

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser) {
      setError("Vui lòng nhập tên đăng nhập.");
      return;
    }
    if (cleanUser.length < 3) {
      setError("Tên đăng nhập phải có ít nhất 3 ký tự.");
      return;
    }
    if (!/^[a-z0-9_-]+$/.test(cleanUser)) {
      setError("Tên đăng nhập chỉ chứa chữ cái không dấu, số, gạch dưới và gạch ngang.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("username", cleanUser);
      fd.append("name", name.trim() || cleanUser);
      if (email.trim()) fd.append("email", email.trim().toLowerCase());
      fd.append("password", password);

      const res = await registerAction(fd);
      if (res.ok) {
        // Tự động chuyển hướng vào Dashboard
        window.location.href = redirectTarget;
      } else {
        setError(res.error || "Không thể đăng ký tài khoản. Vui lòng thử tên khác.");
      }
    } catch {
      setError("Đã xảy ra lỗi kết nối. Vui lòng kiểm tra lại mạng và thử lại.");
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
        <div className="auth-card">
          {/* HEADER */}
          <div className="auth-header">
            <div className="auth-badge-glow">
              <Sparkles size={14} className="text-amber-400" />
              <span>TẠO TÀI KHOẢN MIỄN PHÍ</span>
            </div>
            <h1 className="auth-title">Đăng Ký Thành Viên</h1>
            <p className="auth-subtitle">
              Chỉ 10 giây để gia nhập cộng đồng MinSr và nhận ngay 100 Xu + 1 Vé quay
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
              <label htmlFor="reg-user" className="auth-label">
                Tên đăng nhập <span className="text-rose-400">*</span>
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <User size={18} />
                </span>
                <input
                  id="reg-user"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ví dụ: minsr2026 (viết liền không dấu)"
                  className="auth-input"
                  autoComplete="username"
                  autoFocus
                  disabled={loading}
                />
              </div>
              <span className="auth-field-hint">Dùng để đăng nhập, từ 3-30 ký tự chữ và số.</span>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-name" className="auth-label">
                Tên hiển thị (Biệt danh)
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Smile size={18} />
                </span>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Minh Darker / Hacker Pro"
                  className="auth-input"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email" className="auth-label">
                Email cá nhân <span className="auth-optional">(Không bắt buộc)</span>
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Mail size={18} />
                </span>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ví dụ: yourname@gmail.com"
                  className="auth-input"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-pass" className="auth-label">
                Mật khẩu <span className="text-rose-400">*</span>
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <KeyRound size={18} />
                </span>
                <input
                  id="reg-pass"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập tối thiểu 6 ký tự"
                  className="auth-input"
                  autoComplete="new-password"
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
                  <span>Đang khởi tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>ĐĂNG KÝ MIỄN PHÍ</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* CHUYỂN SANG ĐĂNG NHẬP */}
          <div className="auth-footer-switch">
            <span>Đã có tài khoản từ trước?</span>
            <Link
              href={`/login${redirectTarget !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTarget)}` : ""}`}
              className="auth-switch-link"
            >
              Đăng nhập ngay →
            </Link>
          </div>

          {/* POLICY NOTE */}
          <p className="auth-terms-note">
            Bằng việc đăng ký, bạn đồng ý với các chính sách miễn phí &amp; bảo mật thông tin trên nền tảng MinSr.
          </p>
        </div>

        {/* SUB FOOTER */}
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
