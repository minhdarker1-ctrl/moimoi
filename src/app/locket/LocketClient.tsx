"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OntopPassWidget, { OntopStatusData } from "@/components/OntopPassWidget";

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
  const [completedAt, setCompletedAt] = useState<string>("");
  const [customerType, setCustomerType] = useState<"new" | "returning">("new");
  const [ontopPass, setOntopPass] = useState<OntopStatusData | null>(null);
  const availableCredits = ontopPass?.availableCredits ?? 0;
  const canActivate = availableCredits > 0;
  const [copiedInfo, setCopiedInfo] = useState(false);
  const [dark, setDark] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const earnedCount = ontopPass?.earnedCount ?? ontopPass?.count ?? 0;
  const activeGatewayName = ontopPass?.activeGatewayName || (earnedCount >= 2 ? "Link4m" : "VietUser");
  const currentGatewayStep = ontopPass?.currentGatewayStep || (earnedCount < 2 ? earnedCount + 1 : (earnedCount - 2) + 1);
  const allGatewaysExhausted = Boolean(ontopPass?.allGatewaysExhausted || earnedCount >= 4);

  // Khôi phục Target 2 lớp (URL query param + localStorage) & Làm sạch thanh URL
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sp = new URLSearchParams(window.location.search);
    const urlTarget = sp.get("target")?.trim() || sp.get("uid")?.trim();

    if (urlTarget) {
      setTarget(urlTarget);
      try {
        localStorage.setItem(
          "locket_saved_target",
          JSON.stringify({ target: urlTarget, exp: Date.now() + 30 * 60 * 1000 })
        );
      } catch {}
    } else {
      try {
        const raw = localStorage.getItem("locket_saved_target");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.target && parsed?.exp > Date.now()) {
            setTarget(parsed.target);
          }
        }
      } catch {}
    }

    if (sp.get("ontop") === "success") {
      const credits = sp.get("credits") || "1";
      setToastMsg(`🎉 VƯỢT LINK THÀNH CÔNG! Bạn đã nhận được +1 lượt Buff Gold (Số dư: ${credits} lượt).`);
      setTimeout(() => setToastMsg(""), 8000);
    }

    // Dọn sạch URL query param để tránh "bóng ma" toast ảo khi F5
    if (sp.has("ontop") || sp.has("target") || sp.has("uid") || sp.has("credits") || sp.has("step") || sp.has("unlimited")) {
      try {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("ontop");
        cleanUrl.searchParams.delete("step");
        cleanUrl.searchParams.delete("credits");
        cleanUrl.searchParams.delete("target");
        cleanUrl.searchParams.delete("uid");
        cleanUrl.searchParams.delete("unlimited");
        window.history.replaceState(null, "", cleanUrl.toString());
      } catch {}
    }
  }, []);

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

  async function handleCopyInfo() {
    const timeStr = completedAt || "13:22:45 · 04/10/2026";
    const returningNote =
      customerType === "returning"
        ? `🔄 LƯU Ý CHO KHÁCH CŨ:\n• Vào Cài đặt → Cài đặt chung → VPN & Quản lý thiết bị → Xóa cấu hình DNS Locket cũ trước khi cài file DNS mới.\n\n`
        : "";

    const infoText = `✅ KÍCH HOẠT LOCKET GOLD THÀNH CÔNG
──────────────
👤 Tài khoản: ${target}
📦 Gói dịch vụ: 🆓 1 Năm Bản Quyền Free
📅 Hoàn tất: ${timeStr}

🌐 DNS ĐÓNG BĂNG GOLD DÙNG CHUNG:
DNS Đóng Băng Gold Locket dùng chung được thay theo tháng. Hồ sơ .mobileconfig đã cài không tự cập nhật; hãy cài phiên bản mới khi nhận nhắc hạn.

${returningNote}📲 HOÀN TẤT TRÊN THIẾT BỊ:
1. Xác nhận Gold đã hiển thị: Mở Locket ngay. Nếu chưa thấy Gold, hãy đăng xuất/đăng nhập lại hoặc cài lại app rồi kiểm tra lại.
2. Cài DNS được bàn giao: Sau khi đã nhìn thấy Gold, tải file .mobileconfig do hệ thống cung cấp.
3. Bật profile ngay: Vào Cài đặt → Cài đặt chung → VPN & Quản lý thiết bị, chọn profile DNS và hoàn tất cài đặt, không để gián đoạn mạng.

⛔ CẢNH BÁO: KHÔNG LÀM NGƯỢC THỨ TỰ!
Cài DNS khi Gold chưa xuất hiện sẽ chỉ giữ trạng thái chưa có Gold. DNS là lớp đóng băng, không phải lần kích hoạt thứ hai.

⏱️ Thời gian hồi sau mỗi lượt chính là lúc kiểm tra Gold và hoàn tất đóng băng trước khi token được dùng cho tài khoản khác.`;

    try {
      await navigator.clipboard.writeText(infoText);
      setCopiedInfo(true);
      setTimeout(() => setCopiedInfo(false), 2000);
    } catch {}
  }

  // Chuyển hướng vượt link (Bảo toàn target 2 lớp)
  async function handleRedirectToBypassLink() {
    const cleanTarget = target.trim();
    setIsRedirecting(true);
    setResult(null);

    // Lớp 2: Lưu localStorage phòng rủi ro mở tab mới
    if (cleanTarget) {
      try {
        localStorage.setItem(
          "locket_saved_target",
          JSON.stringify({ target: cleanTarget, exp: Date.now() + 30 * 60 * 1000 })
        );
      } catch {}
    }

    try {
      const res = await fetch("/api/ontop/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "locket", target: cleanTarget }),
      });
      const json = await res.json();
      if (json.success && json.link) {
        window.location.href = json.link;
      } else {
        setIsRedirecting(false);
        setResult({
          success: false,
          error: json.error || "Không thể tạo liên kết vượt link lúc này. Vui lòng thử lại sau!",
        });
      }
    } catch {
      setIsRedirecting(false);
      setResult({
        success: false,
        error: "Lỗi kết nối khi khởi tạo liên kết. Vui lòng thử lại!",
      });
    }
  }

  // Thực thi kích hoạt Locket Gold khi đã có Credit khả dụng
  async function handleExecuteActivate() {
    const cleanTarget = target.trim();
    if (!cleanTarget) {
      setResult({
        success: false,
        error: "Vui lòng nhập thông tin tài khoản Locket (Username / Link invite).",
      });
      return;
    }

    if (!canActivate) {
      setResult({
        success: false,
        error: "Bạn chưa có lượt buff Locket Gold khả dụng. Vui lòng hoàn thành vượt link ở nút bên dưới để nhận lượt!",
      });
      return;
    }

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
      if (data.success) {
        try {
          localStorage.removeItem("locket_saved_target");
        } catch {}
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        const formatted = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} · ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
        setCompletedAt(formatted);

        // Giảm credit cục bộ
        setOntopPass((prev) =>
          prev
            ? {
                ...prev,
                usedCount: prev.usedCount + 1,
                availableCredits: Math.max(0, prev.availableCredits - 1),
                hasAccess: Math.max(0, prev.availableCredits - 1) > 0,
              }
            : null
        );
      }
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

  // Điều phối Submit Form: Khi có credit thì Kích hoạt, khi chưa có thì vượt link
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || isRedirecting) return;

    if (allGatewaysExhausted && availableCredits === 0) {
      setResult({
        success: false,
        error: "Bạn đã đạt giới hạn vượt link tối đa hôm nay (4 lượt). Vui lòng quay lại sau 00:00!",
      });
      return;
    }

    if (availableCredits > 0) {
      await handleExecuteActivate();
    } else {
      await handleRedirectToBypassLink();
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
            <span className="locket-badge-text">MINSR TOOL • PREMIUM ACTIVE</span>
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

        {/* WORKFLOW GUIDE WITH INTERACTIVE CUSTOMER SEGMENT SELECTOR */}
        {!result?.success && (
          <div className="locket-workflow-box">
            {/* MONTHLY SHARED DNS NOTICE BANNER */}
            <div className="locket-wf-dns-banner">
              <div className="locket-wf-dns-badge">
                <i className="fas fa-globe" /> DNS ĐÓNG BĂNG GOLD DÙNG CHUNG
              </div>
              <p className="locket-wf-dns-text">
                DNS Đóng Băng Gold Locket dùng chung được thay theo tháng. Hồ sơ <code>.mobileconfig</code> đã cài không tự cập nhật; hãy cài phiên bản mới khi nhận nhắc hạn.
              </p>
            </div>

            {/* CUSTOMER SEGMENT SELECTOR */}
            <div className="locket-segment-box">
              <div className="locket-segment-header">
                <span className="locket-segment-tag">
                  <i className="fas fa-question-circle" /> CÂU HỎI XÁC ĐỊNH THIẾT BỊ
                </span>
                <h3 className="locket-segment-title">
                  Bạn đã từng cài đặt cấu hình DNS Locket trên thiết bị này chưa?
                </h3>
                <p className="locket-segment-subtitle">
                  Chọn đúng trạng thái để hiển thị hướng dẫn chuẩn xác nhất cho máy của bạn:
                </p>
              </div>

              <div className="locket-segment-grid">
                <button
                  type="button"
                  className={`locket-segment-card ${customerType === "new" ? "active" : ""}`}
                  onClick={() => setCustomerType("new")}
                >
                  <div className="locket-segment-icon new-icon">
                    <i className="fas fa-sparkles" />
                  </div>
                  <div className="locket-segment-content">
                    <span className="locket-segment-name">Tôi là Khách Mới</span>
                    <span className="locket-segment-desc">Chưa từng cài DNS Locket trên thiết bị này</span>
                  </div>
                  <div className="locket-segment-radio">
                    <span className="locket-radio-circle" />
                  </div>
                </button>

                <button
                  type="button"
                  className={`locket-segment-card ${customerType === "returning" ? "active" : ""}`}
                  onClick={() => setCustomerType("returning")}
                >
                  <div className="locket-segment-icon return-icon">
                    <i className="fas fa-sync-alt" />
                  </div>
                  <div className="locket-segment-content">
                    <span className="locket-segment-name">Tôi là Khách Cũ</span>
                    <span className="locket-segment-desc">Đã từng cài DNS Locket trước đây</span>
                  </div>
                  <div className="locket-segment-radio">
                    <span className="locket-radio-circle" />
                  </div>
                </button>
              </div>
            </div>

            {/* CONDITIONAL WORKFLOW ACCORDING TO CUSTOMER TYPE */}
            {customerType === "new" ? (
              /* NEW CUSTOMER: 5 STEPS AS REQUESTED COMBINED WITH COOLDOWN & ORDER WARNINGS */
              <div className="locket-new-customer-section">
                <div className="locket-wf-header">
                  <span className="locket-wf-badge">
                    <i className="fas fa-list-ol" /> QUY TRÌNH THỰC HIỆN
                  </span>
                  <h2 className="locket-wf-title">5 Bước Kích Hoạt Locket Gold</h2>
                  <p className="locket-wf-desc">
                    Vui lòng đọc kỹ và thực hiện đúng theo các bước dưới đây để tài khoản nhận gói Gold chuẩn xác nhất:
                  </p>
                </div>

                <div className="locket-wf-steps">
                  <div className="locket-wf-step">
                    <span className="locket-wf-num">1</span>
                    <div className="locket-wf-text">
                      <strong>Bước 1:</strong> Mở Locket và đăng xuất tài khoản <em>(nếu chưa đăng xuất)</em>.
                    </div>
                  </div>

                  <div className="locket-wf-step">
                    <span className="locket-wf-num">2</span>
                    <div className="locket-wf-text">
                      <strong>Bước 2:</strong> Nhập sẵn tên và mật khẩu, <em>tuyệt đối chưa bấm Đăng nhập</em>.
                    </div>
                  </div>

                  <div className="locket-wf-step">
                    <span className="locket-wf-num">3</span>
                    <div className="locket-wf-text">
                      <strong>Bước 3:</strong> Nhập link hồ sơ vào ô bên dưới.
                    </div>
                  </div>

                  <div className="locket-wf-step">
                    <span className="locket-wf-num">4</span>
                    <div className="locket-wf-text">
                      <strong>Bước 4:</strong> Bấm Đăng nhập vào Locket và kiểm tra xem đã có gói Gold chưa.
                      <p>Mở Locket ngay khi hệ thống báo thành công. Nếu chưa thấy Gold, hãy đăng xuất/đăng nhập lại hoặc cài lại ứng dụng rồi kiểm tra lại.</p>
                    </div>
                  </div>

                  <div className="locket-wf-step">
                    <span className="locket-wf-num">5</span>
                    <div className="locket-wf-text">
                      <strong>Bước 5:</strong> Cài đặt file DNS do Admin cung cấp.
                      <p>Sau khi đã nhìn thấy Gold, tải tệp <code>.mobileconfig</code> bên dưới và vào <strong>Cài đặt &gt; Cài đặt chung &gt; VPN &amp; Quản lý thiết bị</strong> để bật profile DNS.</p>
                    </div>
                  </div>
                </div>

                {/* IMPORTANT COOLDOWN RULE & ORDER WARNING */}
                <div className="locket-main-wf" style={{ marginTop: "16px" }}>
                  <div className="locket-wf-rule-banner">
                    <i className="fas fa-stopwatch" />
                    <span>
                      <strong>Kiểm tra Gold rồi mới cài DNS:</strong> Thời gian hồi sau mỗi lượt chính là khoảng thời gian để bạn kiểm tra Gold và hoàn tất đóng băng trước khi token được dùng cho tài khoản khác.
                    </span>
                  </div>

                  <div className="locket-warning-callout">
                    <div className="locket-warn-head">
                      <i className="fas fa-ban" />
                      <strong>KHÔNG LÀM NGƯỢC THỨ TỰ</strong>
                    </div>
                    <p>
                      Cài DNS khi Gold chưa xuất hiện sẽ chỉ giữ trạng thái <em>chưa có Gold</em>. DNS là lớp đóng băng, không phải lần kích hoạt thứ hai.
                    </p>
                  </div>

                  <div className="locket-fast-summary">
                    <span className="locket-summary-label">
                      <i className="fas fa-bolt" /> KÍCH HOẠT THEO USERNAME (Web hoặc Bot):
                    </span>
                    <ol className="locket-summary-list">
                      <li>Kiểm tra username và gửi yêu cầu.</li>
                      <li>Chờ thông báo thành công rồi mở Locket kiểm tra Gold.</li>
                      <li>Cài DNS được bàn giao ngay trong thời gian hồi.</li>
                    </ol>
                  </div>
                </div>
              </div>
            ) : (
              /* RETURNING CUSTOMER: SEPARATE DNS REMOVAL STEP + NEW DNS SETUP */
              <div className="locket-returning-customer-section">
                <div className="locket-returning-box">
                  <div className="locket-returning-header">
                    <span className="locket-returning-badge">
                      <i className="fas fa-exclamation-triangle" /> BƯỚC BẮT BUỘC DÀNH CHO KHÁCH CŨ
                    </span>
                    <h4 className="locket-returning-title">
                      Gỡ Hoàn Toàn Cấu Hình DNS Cũ Trước Khi Kích Hoạt
                    </h4>
                    <p className="locket-returning-desc">
                      Nếu máy từng cài DNS Locket, hãy xóa cấu hình cũ trước khi kích hoạt để thiết bị nhận được gói Gold mới:
                    </p>
                  </div>
                  <div className="locket-returning-steps">
                    <div className="locket-ret-step">
                      <span className="locket-ret-num">1</span>
                      <span>Vào <strong>Cài đặt</strong> trên iPhone &gt; <strong>Cài đặt chung</strong> &gt; <strong>VPN &amp; Quản lý thiết bị</strong>.</span>
                    </div>
                    <div className="locket-ret-step">
                      <span className="locket-ret-num">2</span>
                      <span>Nhấn chọn cấu hình <strong>DNS Locket cũ</strong> đã cài trước đây.</span>
                    </div>
                    <div className="locket-ret-step">
                      <span className="locket-ret-num">3</span>
                      <span>Bấm <strong>Xóa cấu hình</strong> (Remove Profile) để khôi phục kết nối mạng mặc định.</span>
                    </div>
                    <div className="locket-ret-step">
                      <span className="locket-ret-num">4</span>
                      <span>Sau khi gỡ sạch DNS cũ, nhập username vào ô bên dưới và gửi yêu cầu kích hoạt.</span>
                    </div>
                  </div>
                </div>

                <div className="locket-main-wf">
                  <div className="locket-wf-rule-banner">
                    <i className="fas fa-stopwatch" />
                    <span>
                      <strong>Kiểm tra Gold rồi mới cài DNS:</strong> Thời gian hồi sau mỗi lượt chính là khoảng thời gian để bạn kiểm tra Gold và hoàn tất đóng băng trước khi token được dùng cho tài khoản khác.
                    </span>
                  </div>

                  <div className="locket-wf-steps">
                    <div className="locket-wf-step">
                      <span className="locket-wf-num">1</span>
                      <div className="locket-wf-text">
                        <strong>Bước 1: Xác nhận Gold đã hiển thị</strong>
                        <p>Mở Locket ngay khi hệ thống báo thành công. Nếu chưa thấy Gold, hãy đăng xuất/đăng nhập lại hoặc cài lại ứng dụng rồi kiểm tra lại.</p>
                      </div>
                    </div>

                    <div className="locket-wf-step">
                      <span className="locket-wf-num">2</span>
                      <div className="locket-wf-text">
                        <strong>Bước 2: Cài DNS được bàn giao</strong>
                        <p>Sau khi đã nhìn thấy Gold, tải đúng link hoặc tệp <code>.mobileconfig</code> do Web/Bot gửi cho yêu cầu đó.</p>
                      </div>
                    </div>

                    <div className="locket-wf-step">
                      <span className="locket-wf-num">3</span>
                      <div className="locket-wf-text">
                        <strong>Bước 3: Bật profile ngay</strong>
                        <p>Vào <strong>Cài đặt &gt; Cài đặt chung &gt; VPN &amp; Quản lý thiết bị</strong>, chọn profile DNS và hoàn tất cài đặt, không để gián đoạn mạng.</p>
                      </div>
                    </div>
                  </div>

                  <div className="locket-warning-callout">
                    <div className="locket-warn-head">
                      <i className="fas fa-ban" />
                      <strong>KHÔNG LÀM NGƯỢC THỨ TỰ</strong>
                    </div>
                    <p>
                      Cài DNS khi Gold chưa xuất hiện sẽ chỉ giữ trạng thái <em>chưa có Gold</em>. DNS là lớp đóng băng, không phải lần kích hoạt thứ hai.
                    </p>
                  </div>

                  <div className="locket-fast-summary">
                    <span className="locket-summary-label">
                      <i className="fas fa-bolt" /> KÍCH HOẠT THEO USERNAME (Web hoặc Bot):
                    </span>
                    <ol className="locket-summary-list">
                      <li>Kiểm tra username và gửi yêu cầu.</li>
                      <li>Chờ thông báo thành công rồi mở Locket kiểm tra Gold.</li>
                      <li>Cài DNS được bàn giao ngay trong thời gian hồi.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACTIVATION FORM CARD */}
        <div className="locket-card">
          {/* TOAST THÔNG BÁO VƯỢT LINK THÀNH CÔNG */}
          {toastMsg && (
            <div className="ontop-toast-banner success">
              <i className="fa-solid fa-circle-check" />
              <span>{toastMsg}</span>
              <button
                type="button"
                className="ontop-toast-close"
                onClick={() => setToastMsg("")}
              >
                ×
              </button>
            </div>
          )}

          {/* THẺ TIẾN ĐỘ VƯỢT LINK CỔNG */}
          <OntopPassWidget service="locket" onStatusChange={setOntopPass} />

          {/* BANNER BÁO SẴN SÀNG BUFF GOLD KHI CÓ CREDIT */}
          {availableCredits > 0 && !loading && (
            <div className="ontop-ready-banner">
              <i className="fa-solid fa-circle-check" />
              <span>
                Bạn đang có <strong>{availableCredits} lượt Buff Gold khả dụng</strong>. Nhập tài khoản và bấm <strong>KÍCH HOẠT LOCKET GOLD NGAY</strong> bên dưới!
              </span>
            </div>
          )}

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

              {/* SUBMIT BUTTON (SINGLE DYNAMIC ACTION CTA) */}
              {loading ? (
                <button type="button" className="locket-submit-btn is-loading" disabled>
                  <span className="locket-spinner" />
                  <span>Đang kích hoạt gói Gold...</span>
                </button>
              ) : isRedirecting ? (
                <button type="button" className="locket-submit-btn bypass-mode" disabled>
                  <i className="fa-solid fa-spinner fa-spin" />
                  <span>ĐANG TẠO LIÊN KẾT ({activeGatewayName})...</span>
                </button>
              ) : availableCredits > 0 ? (
                /* STATE D: CÓ LƯỢT KHẢ DỤNG -> NÚT KÍCH HOẠT CHUẨN XANH NEON */
                <>
                  <button
                    type="submit"
                    className="locket-submit-btn ready-mode"
                    disabled={!target.trim()}
                  >
                    <i className="fas fa-bolt" />
                    <span>⚡ KÍCH HOẠT LOCKET GOLD NGAY ({availableCredits} LƯỢT KHẢ DỤNG)</span>
                  </button>
                  <p className="kps-btn-subnote" style={{ color: "#34d399", marginTop: "10px" }}>
                    <i className="fa-solid fa-circle-check" /> Sẵn sàng! Bấm nút để tiến hành mở khóa Gold cho tài khoản.
                  </p>
                </>
              ) : allGatewaysExhausted ? (
                /* STATE E: TOÀN BỘ CỔNG ĐÃ HẾT LƯỢT TRONG NGÀY */
                <>
                  <button
                    type="button"
                    className="locket-submit-btn exhausted-mode"
                    disabled
                  >
                    <i className="fa-solid fa-hourglass-half" />
                    <span>⏳ ĐÃ ĐẠT GIỚI HẠN HÔM NAY (QUAY LẠI SAU 00:00)</span>
                  </button>
                  <p className="kps-btn-subnote" style={{ color: "#94a3b8", marginTop: "10px" }}>
                    <i className="fa-solid fa-circle-info" /> Bạn đã vượt đủ 4/4 lượt hôm nay. Hạn mức sẽ tự động mở lại sau 00:00!
                  </p>
                </>
              ) : (
                /* STATE A/B/C: CHƯA CÓ CREDIT -> NÚT VƯỢT LINK ĐỘNG THEO CỔNG */
                <>
                  <button
                    type="submit"
                    className="locket-submit-btn bypass-mode"
                  >
                    {earnedCount === 0 ? (
                      <>
                        <i className="fa-solid fa-rocket" />
                        <span>🚀 VƯỢT LINK ĐỂ KÍCH HOẠT LOCKET GOLD (LƯỢT 1/2)</span>
                      </>
                    ) : earnedCount === 1 ? (
                      <>
                        <i className="fa-solid fa-bolt" />
                        <span>⚡ VƯỢT LINK {activeGatewayName.toUpperCase()} (LƯỢT 2/2) ĐỂ KÍCH HOẠT</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-arrows-rotate" />
                        <span>🔄 VƯỢT LINK {activeGatewayName.toUpperCase()} (LƯỢT {currentGatewayStep}/2) ĐỂ KÍCH HOẠT</span>
                      </>
                    )}
                  </button>
                  <p className="kps-btn-subnote" style={{ marginTop: "10px" }}>
                    <i className="fa-solid fa-circle-info" /> Nhập thông tin tài khoản ở trên (không bắt buộc) rồi bấm để vượt link nhận lượt Buff Gold.
                  </p>
                </>
              )}
            </form>
          ) : (
            /* SUCCESS STATUS VIEW (NO RECEIPT JARGON) */
            <div className="locket-success-container">
              <div className="locket-success-box">
                {/* Header */}
                <div className="locket-success-top">
                  <div className="locket-success-icon-badge">
                    <i className="fas fa-check-circle" />
                  </div>
                  <div>
                    <h2 className="locket-success-headline">
                      KÍCH HOẠT LOCKET GOLD THÀNH CÔNG!
                    </h2>
                    <p className="locket-success-sub">
                      Tài khoản: <strong>{target}</strong> • Hoàn tất lúc: <span>{completedAt || "13:22:45 · 04/10/2026"}</span>
                    </p>
                  </div>
                </div>

                {/* Monthly Shared DNS Notice */}
                <div className="locket-wf-dns-banner result-banner">
                  <div className="locket-wf-dns-badge">
                    <i className="fas fa-globe" /> DNS DÙNG CHUNG HÀNG THÁNG
                  </div>
                  <p className="locket-wf-dns-text">
                    DNS Đóng Băng Gold Locket dùng chung được thay theo tháng. Hồ sơ <code>.mobileconfig</code> đã cài không tự cập nhật; hãy cài phiên bản mới khi nhận nhắc hạn.
                  </p>
                </div>

                {/* If returning customer reminder */}
                {customerType === "returning" && (
                  <div className="locket-returning-box compact">
                    <div className="locket-returning-header">
                      <span className="locket-returning-badge">
                        <i className="fas fa-exclamation-triangle" /> LƯU Ý CHO KHÁCH CŨ
                      </span>
                      <p className="locket-returning-desc">
                        Đảm bảo bạn đã vào <strong>Cài đặt &gt; Cài đặt chung &gt; VPN &amp; Quản lý thiết bị</strong> và xóa sạch cấu hình DNS Locket cũ trước khi cài file DNS mới bên dưới.
                      </p>
                    </div>
                  </div>
                )}

                {/* Device completion steps */}
                <div className="locket-success-sec">
                  <h3 className="locket-success-sec-heading">
                    <i className="fas fa-mobile-alt" /> HOÀN TẤT TRÊN THIẾT BỊ (THEO ĐÚNG THỨ TỰ)
                  </h3>
                  <ol className="locket-success-ordered-list">
                    <li>
                      <strong>1. Xác nhận Gold đã hiển thị:</strong> Mở Locket ngay. Nếu chưa thấy Gold, hãy đăng xuất/đăng nhập lại hoặc cài lại app rồi kiểm tra lại.
                    </li>
                    <li>
                      <strong>2. Tải DNS được bàn giao:</strong> Sau khi đã nhìn thấy Gold, bấm nút bên dưới để tải tệp <code>.mobileconfig</code>.
                    </li>
                    <li>
                      <strong>3. Bật profile ngay:</strong> Vào <strong>Cài đặt &gt; Cài đặt chung &gt; VPN &amp; Quản lý thiết bị</strong>, chọn profile DNS và hoàn tất cài đặt, không để gián đoạn mạng.
                    </li>
                  </ol>

                  <div className="locket-wf-rule-banner">
                    <i className="fas fa-stopwatch" />
                    <span>
                      <strong>Thời gian hồi:</strong> Khoảng thời gian hồi sau mỗi lượt chính là lúc bạn kiểm tra Gold và hoàn tất đóng băng trước khi token được dùng cho tài khoản khác.
                    </span>
                  </div>

                  <div className="locket-warning-callout">
                    <div className="locket-warn-head">
                      <i className="fas fa-ban" />
                      <strong>KHÔNG LÀM NGƯỢC THỨ TỰ</strong>
                    </div>
                    <p>
                      Cài DNS khi Gold chưa xuất hiện sẽ chỉ giữ trạng thái <em>chưa có Gold</em>. DNS là lớp đóng băng, không phải lần kích hoạt thứ hai.
                    </p>
                  </div>
                </div>

                {/* Troubleshooting */}
                <div className="locket-success-sec">
                  <h4 className="locket-troubleshoot-title">
                    <i className="fas fa-question-circle" /> NẾU MỞ LOCKET CHƯA THẤY GOLD?
                  </h4>
                  <ul className="locket-success-bullet-list">
                    <li>Đóng hẳn Locket khỏi màn hình đa nhiệm rồi mở lại.</li>
                    <li>Đăng xuất tài khoản trong Locket và đăng nhập lại.</li>
                    <li>Nếu vẫn chưa có, xóa ứng dụng Locket và tải lại bản mới nhất từ App Store.</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="locket-success-cta-group">
                  <a
                    href="/locket/Locket-Dong-Bang-Gold.mobileconfig"
                    download="Locket-Dong-Bang-Gold.mobileconfig"
                    className="locket-success-dns-btn"
                  >
                    <i className="fas fa-download" />
                    <span>TẢI &amp; CÀI ĐẶT DNS ĐÓNG BĂNG GOLD (.mobileconfig)</span>
                  </a>

                  <div className="locket-success-sub-actions">
                    <button
                      type="button"
                      onClick={handleCopyInfo}
                      className={`locket-success-action-btn ${copiedInfo ? "active-copied" : ""}`}
                    >
                      <i className={`fas ${copiedInfo ? "fa-check" : "fa-copy"}`} />
                      <span>{copiedInfo ? "ĐÃ SAO CHÉP HƯỚNG DẪN" : "SAO CHÉP HƯỚNG DẪN"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setResult(null);
                        setTarget("");
                      }}
                      className="locket-success-action-btn"
                    >
                      <i className="fas fa-redo-alt" />
                      <span>Kích hoạt cho tài khoản khác</span>
                    </button>
                  </div>
                </div>
              </div>
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
              <h3>Hồ sơ DNS Đóng Băng Gold dùng chung có tự cập nhật không?</h3>
              <p>
                <strong>Không.</strong> DNS Đóng Băng Gold Locket dùng chung được thay định kỳ theo tháng. Hồ sơ <code>.mobileconfig</code> đã cài không tự cập nhật; hãy quay lại website để cài phiên bản mới khi nhận nhắc hạn.
              </p>
            </div>
            <div className="locket-faq-card">
              <h3>Tại sao bắt buộc phải thấy Gold rồi mới cài DNS?</h3>
              <p>
                DNS hoạt động như một lớp đóng băng chặn kết nối xác thực. Cài DNS khi Gold chưa xuất hiện sẽ chỉ giữ trạng thái <em>chưa có Gold</em>. DNS là lớp đóng băng, không phải lần kích hoạt thứ hai!
              </p>
            </div>
            <div className="locket-faq-card">
              <h3>Khách cũ đã từng cài DNS Locket thì cần làm gì trước khi kích hoạt?</h3>
              <p>
                Bạn <strong>bắt buộc phải xóa cấu hình DNS cũ</strong> bằng cách vào <strong>Cài đặt &gt; Cài đặt chung &gt; VPN &amp; Quản lý thiết bị &gt; Xóa cấu hình</strong>. Khách mới chưa từng cài DNS thì bỏ qua bước này.
              </p>
            </div>
            <div className="locket-faq-card">
              <h3>Nếu mở lại Locket chưa thấy Gold thì làm sao?</h3>
              <p>
                Hãy vuốt tắt hẳn app Locket từ đa nhiệm rồi mở lại. Nếu vẫn chưa hiển thị, hãy đăng xuất tài khoản trong Locket rồi đăng nhập lại hoặc gỡ app cài lại bản mới nhất để làm mới phiên làm việc.
              </p>
            </div>
            <div className="locket-faq-card">
              <h3>iOS 17 &amp; iOS 18 không tải được hồ sơ .mobileconfig?</h3>
              <p>
                Bắt buộc mở website bằng trình duyệt <strong>Safari gốc</strong> của iPhone (không dùng qua in-app browser của TikTok/Facebook). Khi có thông báo hiện lên, bấm <strong>Cho phép</strong>, sau đó vào <strong>Cài đặt &gt; Đã tải về hồ sơ</strong> để kích hoạt.
              </p>
            </div>
            <div className="locket-faq-card">
              <h3>Gặp lỗi không rõ nguyên nhân hoặc cần hỗ trợ?</h3>
              <p>
                Đội ngũ Admin MinSr luôn trực tuyến hỗ trợ miễn phí. Nhắn tin trực tiếp qua Telegram <a href="https://t.me/thedarker1" target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8", fontWeight: "bold" }}>@thedarker1</a> để được hỗ trợ trong 1-2 phút.
              </p>
            </div>
          </div>

          {/* ADMIN DIRECT SUPPORT CALLOUT */}
          <div style={{
            marginTop: 24,
            padding: "16px 20px",
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(14, 165, 233, 0.15))",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>🛟</span>
              <div>
                <strong style={{ display: "block", color: "#f8fafc", fontSize: 14 }}>Bạn cần hỗ trợ cài đặt hoặc kích hoạt?</strong>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Admin trực tuyến 24/7 giải đáp mọi thắc mắc hoàn toàn miễn phí</span>
              </div>
            </div>
            <a
              href="https://t.me/thedarker1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 18px",
                background: "linear-gradient(135deg, #0284c7, #2563eb)",
                borderRadius: 12,
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(2, 132, 199, 0.35)"
              }}
            >
              <i className="fa-brands fa-telegram" />
              <span>Nhắn Admin Telegram</span>
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="locket-footer">
          <p>© 2026 MinSr • Locket Gold Automation Service</p>
        </footer>
      </main>
    </div>
  );
}
