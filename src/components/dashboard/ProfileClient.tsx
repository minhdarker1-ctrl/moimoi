"use client";

import { useState, useTransition } from "react";
import { User, Lock, Mail, Image, Save, CheckCircle, AlertCircle } from "lucide-react";
import { updateProfileAction } from "@/app/actions/auth";
import { AuthUser } from "@/lib/auth";

interface Props {
  user: AuthUser;
}

export default function ProfileClient({ user }: Props) {
  const [name, setName] = useState(user.name || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword) {
      if (newPassword.length < 6) {
        setMessage({ type: "error", text: "Mật khẩu mới phải từ 6 ký tự trở lên!" });
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setMessage({ type: "error", text: "Mật khẩu mới xác nhận không khớp!" });
        return;
      }
      if (!oldPassword) {
        setMessage({ type: "error", text: "Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu!" });
        return;
      }
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.set("name", name);
      fd.set("avatar", avatar);
      if (newPassword) {
        fd.set("oldPassword", oldPassword);
        fd.set("newPassword", newPassword);
      }

      const res = await updateProfileAction(fd);
      if (res.ok) {
        setMessage({ type: "success", text: "Cập nhật thông tin tài khoản thành công!" });
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setMessage({ type: "error", text: res.error || "Không thể cập nhật tài khoản." });
      }
    });
  };

  return (
    <div className="dash-profile-layout">
      {message && (
        <div className={`dash-alert ${message.type === "success" ? "dash-alert-success" : "dash-alert-error"}`}>
          {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="dash-profile-form">
        {/* Card 1: Thông tin cơ bản */}
        <div className="dash-card">
          <h2 className="dash-card-title">Thông Tin Cá Nhân</h2>
          <p className="dash-card-desc">Cập nhật họ tên hiển thị và hình ảnh đại diện của bạn.</p>

          <div className="dash-profile-avatar-row">
            <div className="dash-profile-avatar-preview">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="Avatar" />
              ) : (
                <span>{(name || user.username).charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="dash-profile-avatar-inputs">
              <label className="dash-field-label">Link ảnh đại diện (URL)</label>
              <div className="dash-input-wrap">
                <Image size={18} className="dash-input-icon" />
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://imgur.com/... hoặc link ảnh"
                  disabled={isPending}
                />
              </div>
              <small className="dash-hint">Dán link ảnh vuông (png, jpg, webp) để hiển thị đẹp nhất.</small>
            </div>
          </div>

          <div className="dash-fields-grid">
            <div className="dash-field">
              <label className="dash-field-label">Tên đăng nhập</label>
              <div className="dash-input-wrap">
                <User size={18} className="dash-input-icon" />
                <input type="text" value={user.username} disabled className="dash-input-disabled" />
              </div>
              <small className="dash-hint">Tên đăng nhập không thể thay đổi.</small>
            </div>

            <div className="dash-field">
              <label className="dash-field-label">Tên hiển thị</label>
              <div className="dash-input-wrap">
                <User size={18} className="dash-input-icon" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ tên của bạn..."
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="dash-field">
              <label className="dash-field-label">Email</label>
              <div className="dash-input-wrap">
                <Mail size={18} className="dash-input-icon" />
                <input type="email" value={user.email || "Chưa thiết lập"} disabled className="dash-input-disabled" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Đổi mật khẩu */}
        <div className="dash-card">
          <h2 className="dash-card-title">Đổi Mật Khẩu</h2>
          <p className="dash-card-desc">Để trống các ô dưới đây nếu bạn không có nhu cầu đổi mật khẩu.</p>

          <div className="dash-fields-grid">
            <div className="dash-field">
              <label className="dash-field-label">Mật khẩu hiện tại</label>
              <div className="dash-input-wrap">
                <Lock size={18} className="dash-input-icon" />
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại..."
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="dash-field">
              <label className="dash-field-label">Mật khẩu mới</label>
              <div className="dash-input-wrap">
                <Lock size={18} className="dash-input-icon" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự..."
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="dash-field">
              <label className="dash-field-label">Xác nhận mật khẩu mới</label>
              <div className="dash-input-wrap">
                <Lock size={18} className="dash-input-icon" />
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  disabled={isPending}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="dash-form-actions">
          <button type="submit" className="dash-btn-primary" disabled={isPending}>
            {isPending ? (
              <span className="auth-loading-spinner" />
            ) : (
              <>
                <Save size={18} />
                <span>Lưu Thay Đổi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
