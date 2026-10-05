"use client";

import { useState } from "react";
import { User, LogIn, UserPlus, LogOut, Ticket, Package, X, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { loginAction, registerAction, logoutAction } from "@/app/actions/auth";

interface CurrentUserData {
  id: number;
  username: string;
  role: string;
  aovTickets: number;
  name?: string | null;
}

interface AovTaskbarProps {
  currentUser: CurrentUserData | null;
  inventoryCount: number;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: "login" | "register";
  setAuthModalTab: (tab: "login" | "register") => void;
  onOpenInventory: () => void;
  onGetTicketClick: () => void;
  authPromptMessage?: string;
}

export default function AovTaskbar({
  currentUser,
  inventoryCount,
  isAuthModalOpen,
  setIsAuthModalOpen,
  authModalTab,
  setAuthModalTab,
  onOpenInventory,
  onGetTicketClick,
  authPromptMessage,
}: AovTaskbarProps) {
  // Form states
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Login form state
  const [loginCred, setLoginCred] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Register form state
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regPassConfirm, setRegPassConfirm] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.set("credential", loginCred);
      fd.set("password", loginPass);

      const res = await loginAction(fd);
      if (!res.ok) {
        setFormError(res.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
        setLoading(false);
        return;
      }

      setFormSuccess("Đăng nhập thành công! Đang tải lại...");
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch {
      setFormError("Đã có lỗi kết nối. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (regPass !== regPassConfirm) {
      setFormError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.set("username", regUser);
      fd.set("password", regPass);

      const res = await registerAction(fd);
      if (!res.ok) {
        setFormError(res.error || "Đăng ký thất bại. Vui lòng thử tên đăng nhập khác!");
        setLoading(false);
        return;
      }

      setFormSuccess("Đăng ký thành công! Đang đăng nhập...");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      setFormError("Đã có lỗi kết nối. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      await logoutAction();
      window.location.reload();
    }
  };

  return (
    <>
      {/* TASKBAR CỐ ĐỊNH TRÊN CÙNG CỦA ĐẤU TRƯỜNG AOV */}
      <header className="aov-taskbar">
        <div className="aov-taskbar-inner">
          {/* Logo / Status bên trái */}
          <div className="aov-taskbar-brand">
            <span className="aov-taskbar-glow-dot" />
            <span className="aov-taskbar-title">ĐẤU TRƯỜNG AOV</span>
            <span className="aov-taskbar-tag">MINI-GAMES</span>
          </div>

          {/* Khu vực thông tin & nút bấm bên phải */}
          <div className="aov-taskbar-actions">
            {currentUser ? (
              // ĐÃ ĐĂNG NHẬP
              <>
                {/* Huy hiệu số vé */}
                <div
                  className="aov-ticket-badge"
                  onClick={onGetTicketClick}
                  title="Nhấn để vượt link lấy thêm vé"
                >
                  <Ticket size={16} className="text-amber-400" />
                  <span className="aov-ticket-num">{currentUser.aovTickets}</span>
                  <span className="aov-ticket-lbl">VÉ</span>
                  <span className="aov-ticket-plus" title="Nạp vé">+</span>
                </div>

                {/* Nút mở Túi đồ */}
                <button
                  type="button"
                  className="aov-btn-inventory"
                  onClick={onOpenInventory}
                  title="Xem kho tài khoản đã trúng"
                >
                  <Package size={16} />
                  <span className="hidden-xs">Túi Đồ</span>
                  <span className="aov-inv-count">{inventoryCount}</span>
                </button>

                {/* Thông tin User */}
                <div className="aov-user-chip">
                  <div className="aov-user-avatar">
                    <User size={14} />
                  </div>
                  <span className="aov-user-name">@{currentUser.username}</span>
                </div>

                {/* Nút Đăng xuất */}
                <button
                  type="button"
                  className="aov-btn-logout"
                  onClick={handleLogout}
                  title="Đăng xuất tài khoản"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              // CHƯA ĐĂNG NHẬP
              <>
                {/* Huy hiệu 0 vé */}
                <div
                  className="aov-ticket-badge aov-ticket-badge-muted"
                  onClick={onGetTicketClick}
                  title="Đăng nhập để nhận và lưu vé"
                >
                  <Ticket size={16} className="text-amber-400" />
                  <span className="aov-ticket-num">0</span>
                  <span className="aov-ticket-lbl">VÉ</span>
                </div>

                {/* Nút Đăng Nhập / Đăng Ký mở Modal */}
                <button
                  type="button"
                  className="aov-btn-auth-trigger"
                  onClick={() => {
                    setAuthModalTab("login");
                    setIsAuthModalOpen(true);
                  }}
                >
                  <LogIn size={15} />
                  <span>ĐĂNG NHẬP / ĐĂNG KÝ</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* POPUP / MODAL ĐĂNG NHẬP & ĐĂNG KÝ */}
      {isAuthModalOpen && (
        <div className="aov-modal-backdrop" onClick={() => setIsAuthModalOpen(false)}>
          <div
            className="aov-auth-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Nút đóng */}
            <button
              type="button"
              className="aov-modal-close-btn"
              onClick={() => setIsAuthModalOpen(false)}
              aria-label="Đóng"
            >
              <X size={18} />
            </button>

            {/* Header Modal */}
            <div className="aov-auth-modal-header">
              <div className="aov-auth-icon-wrap">
                <Sparkles size={24} className="text-sky-400" />
              </div>
              <h3>TÀI KHOẢN ĐẤU TRƯỜNG AOV</h3>
              <p>
                {authPromptMessage ||
                  "Đăng nhập để nhận vé vượt link, lưu trữ nick trúng thưởng và tham gia Đấu Trường!"}
              </p>
            </div>

            {/* Tabs chuyển đổi: ĐĂNG NHẬP / ĐĂNG KÝ */}
            <div className="aov-auth-tabs">
              <button
                type="button"
                className={`aov-auth-tab ${authModalTab === "login" ? "active" : ""}`}
                onClick={() => {
                  setAuthModalTab("login");
                  setFormError(null);
                  setFormSuccess(null);
                }}
              >
                <LogIn size={15} />
                <span>ĐĂNG NHẬP</span>
              </button>
              <button
                type="button"
                className={`aov-auth-tab ${authModalTab === "register" ? "active" : ""}`}
                onClick={() => {
                  setAuthModalTab("register");
                  setFormError(null);
                  setFormSuccess(null);
                }}
              >
                <UserPlus size={15} />
                <span>ĐĂNG KÝ MỚI</span>
              </button>
            </div>

            {/* Thông báo lỗi / thành công */}
            {formError && (
              <div className="aov-auth-alert error">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="aov-auth-alert success">
                <CheckCircle2 size={16} />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* FORM 1: ĐĂNG NHẬP */}
            {authModalTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="aov-auth-form">
                <div className="aov-form-group">
                  <label>TÊN ĐĂNG NHẬP HOẶC EMAIL</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập username hoặc email..."
                    value={loginCred}
                    onChange={(e) => setLoginCred(e.target.value)}
                    autoComplete="username"
                  />
                </div>

                <div className="aov-form-group">
                  <label>MẬT KHẨU</label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập mật khẩu..."
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="aov-auth-submit-btn"
                >
                  {loading ? (
                    <span>ĐANG XÁC THỰC...</span>
                  ) : (
                    <>
                      <LogIn size={16} />
                      <span>ĐĂNG NHẬP NGAY</span>
                    </>
                  )}
                </button>

                <div className="aov-auth-switch-hint">
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab("register");
                      setFormError(null);
                    }}
                  >
                    Tạo tài khoản miễn phí (5 giây)
                  </button>
                </div>
              </form>
            )}

            {/* FORM 2: ĐĂNG KÝ */}
            {authModalTab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="aov-auth-form">
                <div className="aov-form-group">
                  <label>TÊN ĐĂNG NHẬP (VIẾT LIỀN KHÔNG DẤU)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: lienquan_pro, gamevip99..."
                    value={regUser}
                    onChange={(e) => setRegUser(e.target.value)}
                    autoComplete="username"
                  />
                </div>

                <div className="aov-form-group">
                  <label>MẬT KHẨU (TỐI THIỂU 6 KÝ TỰ)</label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập mật khẩu bí mật..."
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                <div className="aov-form-group">
                  <label>XÁC NHẬN MẬT KHẨU</label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập lại mật khẩu..."
                    value={regPassConfirm}
                    onChange={(e) => setRegPassConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="aov-auth-submit-btn"
                >
                  {loading ? (
                    <span>ĐANG TẠO TÀI KHOẢN...</span>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>ĐĂNG KÝ VÀ VÀO ĐẤU TRƯỜNG</span>
                    </>
                  )}
                </button>

                <div className="aov-auth-switch-hint">
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab("login");
                      setFormError(null);
                    }}
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
