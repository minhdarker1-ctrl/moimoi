"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ActivateResult {
  success: boolean;
  uid?: string;
  expiresDate?: string;
  message?: string;
  error?: string;
}

export default function LocketClient() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [result, setResult] = useState<ActivateResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const isDark =
        document.documentElement.dataset.theme === "dark" ||
        document.body.classList.contains("vthangios-dark");
      setDark(isDark);
    } catch {}
  }, []);

  function handleToggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    if (next) {
      document.body.classList.add("vthangios-dark");
    } else {
      document.body.classList.remove("vthangios-dark");
    }
    try {
      localStorage.setItem("vt-theme", next ? "dark" : "light");
    } catch {}
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTarget(text.trim());
      }
    } catch {
      alert("Không thể đọc từ bộ nhớ tạm. Bạn vui lòng dán thủ công nhé!");
    }
  }

  async function handleCopyUid() {
    if (!result?.uid) return;
    try {
      await navigator.clipboard.writeText(result.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanTarget = target.trim();
    if (!cleanTarget) return;

    setLoading(true);
    setResult(null);
    setStep(1);

    const stepTimer1 = setTimeout(() => setStep(2), 700);
    const stepTimer2 = setTimeout(() => setStep(3), 1500);

    try {
      const res = await fetch("/api/locket/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: cleanTarget }),
      });

      const data: ActivateResult = await res.json();
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setResult(data);
    } catch {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setResult({
        success: false,
        error: "Mất kết nối tới máy chủ. Vui lòng kiểm tra lại mạng và thử lại!",
      });
    } finally {
      setLoading(false);
      setStep(0);
    }
  }

  function formatExpiry(dateStr?: string) {
    if (!dateStr) return "1 Năm Bản Quyền";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="locket-page-container">
      {/* TOP NAVIGATION BAR */}
      <header className="locket-top-nav">
        <Link href="/#services" className="locket-back-btn" aria-label="Quay lại dịch vụ">
          <span>← QUAY LẠI DỊCH VỤ</span>
        </Link>
        <button
          type="button"
          className="vthangios-theme-btn locket-theme-btn"
          onClick={handleToggleTheme}
          aria-label={dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        >
          <i
            className={`bi ${dark ? "bi-moon-stars-fill" : "bi-sun-fill"}`}
            aria-hidden="true"
          />
        </button>
      </header>

      <main className="locket-main-content">
        {/* HERO SECTION */}
        <div className="locket-hero-section">
          <div className="locket-badge-glow">
            <span className="locket-badge-icon">👑</span>
            <span className="locket-badge-text">ONCYBER TOOL • PREMIUM ACTIVE</span>
          </div>
          <h1 className="locket-title">
            Kích Hoạt <span className="locket-gold-gradient">Locket Gold</span>
          </h1>
          <p className="locket-subtitle">
            Mở khóa trọn bộ tính năng Locket Gold 1 năm hoàn toàn miễn phí. Hỗ trợ kích hoạt qua Username,
            Link hồ sơ cá nhân hoặc Link mời bạn bè!
          </p>
        </div>

        {/* BENEFIT PILLS */}
        <div className="locket-features-grid">
          <div className="locket-feature-item">
            <i className="fas fa-crown locket-feat-icon gold" />
            <div>
              <strong>Huy hiệu Gold</strong>
              <p>Hiển thị viền vàng độc quyền</p>
            </div>
          </div>
          <div className="locket-feature-item">
            <i className="fas fa-camera-retro locket-feat-icon cyan" />
            <div>
              <strong>Ảnh & Video HD</strong>
              <p>Độ nét cao không bị nén</p>
            </div>
          </div>
          <div className="locket-feature-item">
            <i className="fas fa-user-friends locket-feat-icon purple" />
            <div>
              <strong>Mở rộng bạn bè</strong>
              <p>Kết nối không giới hạn</p>
            </div>
          </div>
          <div className="locket-feature-item">
            <i className="fas fa-shield-alt locket-feat-icon green" />
            <div>
              <strong>An Toàn 100%</strong>
              <p>Bản quyền chính thức Apple</p>
            </div>
          </div>
        </div>

        {/* ACTIVATION FORM CARD */}
        <div className="locket-card">
          {!result?.success ? (
            <form onSubmit={handleSubmit} className="locket-form">
              <label htmlFor="locket-input" className="locket-input-label">
                <span>Nhập thông tin tài khoản Locket</span>
                <span className="locket-label-hint">Username / Link Invite / UID</span>
              </label>

              <div className="locket-input-wrapper">
                <span className="locket-input-prefix">
                  <i className="fas fa-at" aria-hidden="true" />
                </span>
                <input
                  id="locket-input"
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="VD: minhdarker hoặc locket.cam/... hoặc link invite"
                  className="locket-text-input"
                  disabled={loading}
                  autoComplete="off"
                  autoFocus
                />
                {target && !loading && (
                  <button
                    type="button"
                    onClick={() => setTarget("")}
                    className="locket-clear-btn"
                    title="Xóa nhanh"
                  >
                    <i className="fas fa-times" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="locket-paste-btn"
                  title="Dán từ bộ nhớ tạm"
                  disabled={loading}
                >
                  <i className="fas fa-paste" />
                  <span>Dán</span>
                </button>
              </div>

              <p className="locket-input-tips">
                <i className="fas fa-info-circle" /> Bạn có thể dán link mời (
                <code>https://locket.camera/invites/...</code>), link profile cá nhân, hoặc gõ tên Locket
                (ví dụ: <code>@username</code>).
              </p>

              {/* STEP PROGRESS */}
              {loading && (
                <div className="locket-steps-container">
                  <div className={`locket-step-item ${step >= 1 ? "active" : ""}`}>
                    <span className="locket-step-dot">
                      {step > 1 ? <i className="fas fa-check" /> : "1"}
                    </span>
                    <span>Tìm kiếm & phân giải UID tài khoản...</span>
                  </div>
                  <div className={`locket-step-item ${step >= 2 ? "active" : ""}`}>
                    <span className="locket-step-dot">
                      {step > 2 ? <i className="fas fa-check" /> : "2"}
                    </span>
                    <span>Xác thực gói bản quyền hệ thống...</span>
                  </div>
                  <div className={`locket-step-item ${step >= 3 ? "active" : ""}`}>
                    <span className="locket-step-dot">
                      {step >= 3 ? <span className="locket-spinner-mini" /> : "3"}
                    </span>
                    <span>Đồng bộ trạng thái bản quyền Gold...</span>
                  </div>
                </div>
              )}

              {/* ERROR ALERT */}
              {result && !result.success && (
                <div className="locket-error-box">
                  <i className="fas fa-exclamation-triangle" />
                  <div className="locket-error-text">
                    <strong>Kích hoạt chưa thành công</strong>
                    <p>{result.error || "Vui lòng kiểm tra lại link/username hoặc thử lại sau ít phút."}</p>
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading || !target.trim()}
                className={`locket-submit-btn ${loading ? "is-loading" : ""}`}
              >
                {loading ? (
                  <>
                    <span className="locket-spinner" />
                    <span>Đang kích hoạt gói Gold...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-bolt" />
                    <span>KÍCH HOẠT LOCKET GOLD NGAY</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* SUCCESS VIEW */
            <div className="locket-success-view">
              <div className="locket-success-icon-wrap">
                <span className="locket-success-icon">👑</span>
              </div>
              <h2 className="locket-success-title">KÍCH HOẠT GOLD THÀNH CÔNG!</h2>
              <p className="locket-success-sub">
                Gói bản quyền Locket Gold đã được đồng bộ trực tiếp tới máy chủ Apple cho tài khoản của bạn.
              </p>

              <div className="locket-result-info">
                <div className="locket-info-row">
                  <span className="locket-info-label">Tài khoản:</span>
                  <span className="locket-info-val bold">{target}</span>
                </div>
                {result.uid && (
                  <div className="locket-info-row">
                    <span className="locket-info-label">UID Locket:</span>
                    <span className="locket-info-val uid-badge" onClick={handleCopyUid} title="Bấm để sao chép UID">
                      <code>{result.uid}</code>
                      <i className={`fas ${copied ? "fa-check text-green" : "fa-copy"}`} />
                    </span>
                  </div>
                )}
                <div className="locket-info-row">
                  <span className="locket-info-label">Thời hạn:</span>
                  <span className="locket-info-val gold-badge">
                    {formatExpiry(result.expiresDate)}
                  </span>
                </div>
                <div className="locket-info-row">
                  <span className="locket-info-label">Trạng thái:</span>
                  <span className="locket-info-val active-status">
                    <i className="fas fa-circle-check" /> Đã mở khóa thành công
                  </span>
                </div>
              </div>

              {/* INSTRUCTIONS */}
              <div className="locket-guide-box">
                <h3 className="locket-guide-title">
                  <i className="fas fa-list-check" /> 3 Bước nhận Gold ngay lập tức:
                </h3>
                <ol className="locket-guide-list">
                  <li>
                    <strong>Vuốt tắt ứng dụng Locket:</strong> Mở màn hình đa nhiệm (App Switcher) trên điện thoại và vuốt tắt hoàn toàn ứng dụng Locket.
                  </li>
                  <li>
                    <strong>Mở lại Locket:</strong> Mở lại ứng dụng để tài khoản tải biên lai mới và xuất hiện huy hiệu Gold.
                  </li>
                  <li>
                    <strong>(Khuyên dùng) Cài DNS Đóng Băng Gold:</strong> Tải cấu hình bên dưới để đóng băng gói, không bị reset hay thu hồi theo tháng.
                  </li>
                </ol>
              </div>

              {/* DOWNLOAD PROFILE BUTTON */}
              <div className="locket-download-section">
                <a
                  href="/locket/Locket-Dong-Bang-Gold.mobileconfig"
                  download="Locket-Dong-Bang-Gold.mobileconfig"
                  className="locket-dns-btn"
                >
                  <i className="fas fa-download" />
                  <span>TẢI DNS ĐÓNG BĂNG GOLD (.mobileconfig)</span>
                </a>
                <p className="locket-dns-hint">
                  Mở bằng trình duyệt <strong>Safari</strong> trên iPhone/iPad &gt; Bấm Cho phép &gt; Mở <strong>Cài đặt</strong> &gt; Chọn <strong>Đã tải về hồ sơ</strong> &gt; Cài đặt.
                </p>
              </div>

              {/* RESET BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setTarget("");
                }}
                className="locket-reset-btn"
              >
                <i className="fas fa-redo-alt" /> Kích hoạt cho tài khoản khác
              </button>
            </div>
          )}
        </div>

        {/* FAQ SECTION */}
        <section className="locket-faq-section" aria-label="Câu hỏi thường gặp">
          <h2 className="locket-faq-title">
            <i className="fas fa-question-circle" /> Câu Hỏi Thường Gặp
          </h2>
          <div className="locket-faq-grid">
            <div className="locket-faq-card">
              <h3>Làm sao để lấy link mời Locket?</h3>
              <p>
                Mở ứng dụng <strong>Locket</strong> &gt; Bấm vào biểu tượng <strong>Bạn bè</strong> ở thanh công cụ &gt; Chọn <strong>Thêm bạn mới</strong> &gt; Bấm <strong>Chia sẻ link mời</strong> rồi dán vào trang web này.
              </p>
            </div>
            <div className="locket-faq-card">
              <h3>Kích hoạt có bị khoá tài khoản không?</h3>
              <p>
                <strong>Tuyệt đối an toàn.</strong> Tool sử dụng cơ chế đồng bộ bản quyền tự động, không yêu cầu mật khẩu hay can thiệp vào tài khoản Apple ID của bạn.
              </p>
            </div>
            <div className="locket-faq-card">
              <h3>Hồ sơ DNS Đóng Băng Gold có tác dụng gì?</h3>
              <p>
                Đây là file cấu hình bảo mật DNS giúp duy trì trạng thái Locket Gold bền vững và ổn định lâu dài trên thiết bị của bạn.
              </p>
            </div>
            <div className="locket-faq-card">
              <h3>Nếu mở lại Locket chưa thấy Gold thì làm sao?</h3>
              <p>
                Hãy chắc chắn bạn đã vuốt tắt hẳn app Locket từ đa nhiệm. Nếu vẫn chưa hiển thị, hãy đăng xuất tài khoản trong Locket rồi đăng nhập lại để làm mới phiên làm việc.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="locket-footer">
          <p>© 2026 OnCyber • Locket Gold Automation Service</p>
        </footer>
      </main>
    </div>
  );
}
