"use client";

import { useState, useEffect } from "react";
import {
  Headphones,
  X,
  Send,
  MessageCircle,
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Check,
  Copy,
} from "lucide-react";

interface FaqItem {
  q: string;
  category: "locket" | "freefire" | "aov" | "key";
  categoryName: string;
  a: string;
  steps?: string[];
}

const FAQS: FaqItem[] = [
  {
    q: "Kích hoạt Locket Gold xong mở app chưa thấy viền vàng?",
    category: "locket",
    categoryName: "Locket Gold",
    a: "Hệ thống đã đồng bộ bản quyền với máy chủ. Hãy thực hiện theo các bước sau:",
    steps: [
      "Vuốt tắt hoàn toàn ứng dụng Locket khỏi màn hình đa nhiệm (App Switcher) rồi mở lại.",
      "Vào Cài đặt trong Locket > Đăng xuất tài khoản rồi đăng nhập lại.",
      "Nếu máy từng cài DNS Locket cũ: Vào Cài đặt iPhone > Cài đặt chung > VPN & Quản lý thiết bị > Xóa cấu hình cũ trước khi cài mới.",
    ],
  },
  {
    q: "iPhone (iOS 17 / iOS 18) không tải được file .mobileconfig?",
    category: "locket",
    categoryName: "Locket Gold",
    a: "Do trình duyệt trong ứng dụng (in-app browser) của TikTok/Facebook chặn tải hồ sơ hệ thống:",
    steps: [
      "Bắt buộc mở website MinSr bằng trình duyệt Safari mặc định của iPhone.",
      "Bấm nút Tải DNS > Chọn 'Cho phép' khi Safari hỏi 'Trang web đang cố tải về một hồ sơ cấu hình'.",
      "Vào Cài đặt iPhone > Chọn mục 'Đã tải về hồ sơ' (ngay dưới tên iCloud) hoặc vào Cài đặt chung > VPN & Quản lý thiết bị > Bấm Cài đặt.",
    ],
  },
  {
    q: "Kéo tâm Free Fire bị vọt qua đầu hoặc bị dính vào ngực?",
    category: "freefire",
    categoryName: "Free Fire",
    a: "Bạn có thể tinh chỉnh nhanh theo mẹo từ các Pro Player:",
    steps: [
      "Nếu tâm bị vọt qua đầu: Giảm độ nhạy 'Nhìn Xung Quanh' và 'Red Dot' xuống 5 - 10 điểm.",
      "Nếu tâm bị ghim vào ngực (nặng tay): Tăng 'Nhìn Xung Quanh' lên 98-100, điều chỉnh DPI máy (Android: 392 - 420; iPhone: tốc độ lướt 120Hz).",
      "Kích thước nút bắn chuẩn nhất: Đặt ở mức 45% - 52% và kéo sát mép dưới màn hình để có nhiều khoảng trống vuốt tay.",
    ],
  },
  {
    q: "Kẹt ở trang vượt link hoặc trang đếm ngược không chạy?",
    category: "key",
    categoryName: "Vượt Link / Key",
    a: "Trang đếm ngược bị kẹt thường do trình duyệt bật chặn script quá mức hoặc mạng chập chờn:",
    steps: [
      "Tắt tạm thời các tiện ích chặn script (nếu có) hoặc thử mở bằng tab ẩn danh.",
      "Không đóng tab khi đang chuyển tiếp.",
      "Bấm nút 'Thử lại' trên màn hình để hệ thống tự động cấp một cổng vượt link mới mượt mà hơn.",
    ],
  },
  {
    q: "Sau khi xé Túi Mù nhận được acc Liên Quân thì làm gì?",
    category: "aov",
    categoryName: "Liên Quân AOV",
    a: "Acc được cấp là tài khoản trắng thông tin hoặc thông tin sạch theo sự kiện:",
    steps: [
      "Bấm nút 'Sao Chép' tài khoản và mật khẩu được hiển thị trên bảng.",
      "Đăng nhập ngay vào ứng dụng Garena hoặc game Liên Quân Mobile để kiểm tra.",
      "Tiến hành liên kết số điện thoại hoặc email cá nhân của bạn để bảo mật vĩnh viễn.",
    ],
  },
];

export default function FloatingSupportHub() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"channels" | "faq" | "ticket">("channels");
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [faqFilter, setFaqFilter] = useState<string>("all");
  const [copiedLink, setCopiedLink] = useState(false);
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  // Đóng khi nhấn ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopyPageUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const handleSendTicketToTelegram = () => {
    if (!ticketMessage.trim()) return;
    const currentUrl = typeof window !== "undefined" ? window.location.href : "https://minsr.vercel.app";
    const text = encodeURIComponent(
      `🆘 [YÊU CẦU HỖ TRỢ MINSR]\n` +
      `🌐 Trang gặp sự cố: ${currentUrl}\n` +
      `📝 Nội dung: ${ticketMessage.trim()}`
    );
    window.open(`https://t.me/thedarker1?text=${text}`, "_blank");
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setTicketMessage("");
      setOpen(false);
    }, 1500);
  };

  const filteredFaqs =
    faqFilter === "all" ? FAQS : FAQS.filter((f) => f.category === faqFilter);

  return (
    <>
      {/* NÚT KÍCH HOẠT NỔI Ở GÓC MÀN HÌNH */}
      <div className="floating-support-wrap" aria-label="Nút trợ giúp trực tuyến MinSr">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`floating-support-btn ${open ? "is-active" : ""}`}
          aria-expanded={open}
          aria-haspopup="dialog"
          title="Trợ giúp & Hỗ trợ 24/7"
        >
          <div className="floating-support-pulse" aria-hidden="true" />
          <div className="floating-support-icon">
            {open ? <X size={22} /> : <Headphones size={22} />}
          </div>
          <span className="floating-support-label">HỖ TRỢ 24/7</span>
          <span className="floating-support-badge-dot" title="Admin online" />
        </button>
      </div>

      {/* DRAWER / MODAL HỖ TRỢ */}
      {open && (
        <div className="floating-support-backdrop" onClick={() => setOpen(false)} aria-hidden="true">
          <div
            className="floating-support-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Trung tâm hỗ trợ khách hàng MinSr"
            onClick={(e) => e.stopPropagation()}
          >
            {/* DRAWER HEADER */}
            <div className="fsd-header">
              <div className="fsd-header-info">
                <div className="fsd-badge">
                  <span className="fsd-live-dot" />
                  <span>TRỰC TUYẾN 24/7</span>
                </div>
                <h3 className="fsd-title">Trung Tâm Hỗ Trợ MinSr</h3>
                <p className="fsd-desc">Chúng tôi luôn sẵn sàng đồng hành cùng bạn mọi lúc</p>
              </div>
              <button
                type="button"
                className="fsd-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Đóng bảng hỗ trợ"
              >
                <X size={18} />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="fsd-tabs-nav">
              <button
                type="button"
                className={`fsd-tab-btn ${activeTab === "channels" ? "active" : ""}`}
                onClick={() => setActiveTab("channels")}
              >
                <Send size={15} />
                <span>Liên Hệ Trực Tiếp</span>
              </button>
              <button
                type="button"
                className={`fsd-tab-btn ${activeTab === "faq" ? "active" : ""}`}
                onClick={() => setActiveTab("faq")}
              >
                <HelpCircle size={15} />
                <span>Cứu Hộ &amp; FAQ</span>
              </button>
              <button
                type="button"
                className={`fsd-tab-btn ${activeTab === "ticket" ? "active" : ""}`}
                onClick={() => setActiveTab("ticket")}
              >
                <AlertTriangle size={15} />
                <span>Báo Lỗi Nhanh</span>
              </button>
            </div>

            {/* TAB BODY 1: KÊNH LIÊN HỆ TRỰC TIẾP */}
            {activeTab === "channels" && (
              <div className="fsd-tab-content">
                <p className="fsd-sec-intro">
                  Chọn kênh liên hệ bạn thuận tiện nhất để được Admin và đội ngũ hỗ trợ giải đáp tức thì:
                </p>

                <div className="fsd-channels-grid">
                  {/* TELEGRAM ADMIN (ƯU TIÊN SỐ 1) */}
                  <a
                    href="https://t.me/thedarker1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fsd-channel-card fsd-ch-telegram"
                  >
                    <div className="fsd-ch-icon-box tg-bg">
                      <Send size={20} />
                    </div>
                    <div className="fsd-ch-content">
                      <div className="fsd-ch-name-row">
                        <span className="fsd-ch-name">Telegram Admin</span>
                        <span className="fsd-ch-tag fast">Phản hồi 1-2p</span>
                      </div>
                      <p className="fsd-ch-desc">Chat riêng 1:1 giải quyết lỗi cài đặt, kích hoạt, tài khoản</p>
                    </div>
                    <ExternalLink size={16} className="fsd-ch-arrow" />
                  </a>

                  {/* GROUP TELEGRAM */}
                  <a
                    href="https://t.me/thedarker1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fsd-channel-card"
                  >
                    <div className="fsd-ch-icon-box blue-bg">
                      <MessageCircle size={20} />
                    </div>
                    <div className="fsd-ch-content">
                      <div className="fsd-ch-name-row">
                        <span className="fsd-ch-name">Group Cộng Đồng</span>
                        <span className="fsd-ch-tag">Giao lưu</span>
                      </div>
                      <p className="fsd-ch-desc">Hỏi đáp cùng các thành viên &amp; nhận thông báo update sớm</p>
                    </div>
                    <ExternalLink size={16} className="fsd-ch-arrow" />
                  </a>

                  {/* FACEBOOK FANPAGE */}
                  <a
                    href="https://www.facebook.com/oncyber"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fsd-channel-card"
                  >
                    <div className="fsd-ch-icon-box fb-bg">
                      <i className="fa-brands fa-facebook-f" style={{ fontSize: 20 }} />
                    </div>
                    <div className="fsd-ch-content">
                      <div className="fsd-ch-name-row">
                        <span className="fsd-ch-name">Facebook Fanpage</span>
                        <span className="fsd-ch-tag">Chính thức</span>
                      </div>
                      <p className="fsd-ch-desc">Theo dõi tin tức, sự kiện tặng nick &amp; minigame</p>
                    </div>
                    <ExternalLink size={16} className="fsd-ch-arrow" />
                  </a>

                  {/* YOUTUBE CHANNEL */}
                  <a
                    href="https://youtube.com/@oncyberr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fsd-channel-card"
                  >
                    <div className="fsd-ch-icon-box yt-bg">
                      <i className="fa-brands fa-youtube" style={{ fontSize: 20 }} />
                    </div>
                    <div className="fsd-ch-content">
                      <div className="fsd-ch-name-row">
                        <span className="fsd-ch-name">Kênh YouTube MinSr</span>
                        <span className="fsd-ch-tag">Video Guide</span>
                      </div>
                      <p className="fsd-ch-desc">Xem clip hướng dẫn trực quan từng bước không lo làm sai</p>
                    </div>
                    <ExternalLink size={16} className="fsd-ch-arrow" />
                  </a>

                  {/* TIKTOK */}
                  <a
                    href="https://www.tiktok.com/@oncyberr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fsd-channel-card"
                  >
                    <div className="fsd-ch-icon-box tt-bg">
                      <i className="fa-brands fa-tiktok" style={{ fontSize: 18 }} />
                    </div>
                    <div className="fsd-ch-content">
                      <div className="fsd-ch-name-row">
                        <span className="fsd-ch-name">Kênh TikTok @oncyberr</span>
                        <span className="fsd-ch-tag">Mẹo Hay</span>
                      </div>
                      <p className="fsd-ch-desc">Clip ngắn chia sẻ mẹo kéo tâm Free Fire &amp; thủ thuật iOS</p>
                    </div>
                    <ExternalLink size={16} className="fsd-ch-arrow" />
                  </a>
                </div>

                <div className="fsd-tip-box">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <span>
                    <strong>Cam kết hỗ trợ:</strong> MinSr là dịch vụ hoàn toàn miễn phí &amp; an toàn, không bao giờ yêu cầu mật khẩu iCloud hay mã OTP ngân hàng của bạn.
                  </span>
                </div>
              </div>
            )}

            {/* TAB BODY 2: CỨU HỘ & FAQ NHANH */}
            {activeTab === "faq" && (
              <div className="fsd-tab-content">
                {/* Bộ lọc chuyên mục */}
                <div className="fsd-faq-filters">
                  <button
                    type="button"
                    className={`fsd-filter-chip ${faqFilter === "all" ? "active" : ""}`}
                    onClick={() => setFaqFilter("all")}
                  >
                    Tất cả
                  </button>
                  <button
                    type="button"
                    className={`fsd-filter-chip ${faqFilter === "locket" ? "active" : ""}`}
                    onClick={() => setFaqFilter("locket")}
                  >
                    👑 Locket Gold
                  </button>
                  <button
                    type="button"
                    className={`fsd-filter-chip ${faqFilter === "freefire" ? "active" : ""}`}
                    onClick={() => setFaqFilter("freefire")}
                  >
                    🔥 Free Fire
                  </button>
                  <button
                    type="button"
                    className={`fsd-filter-chip ${faqFilter === "key" ? "active" : ""}`}
                    onClick={() => setFaqFilter("key")}
                  >
                    ⚡ Vượt Link
                  </button>
                  <button
                    type="button"
                    className={`fsd-filter-chip ${faqFilter === "aov" ? "active" : ""}`}
                    onClick={() => setFaqFilter("aov")}
                  >
                    ⚔️ AOV
                  </button>
                </div>

                {/* Danh sách Accordion */}
                <div className="fsd-faq-list">
                  {filteredFaqs.map((faq, idx) => {
                    const isExpanded = selectedFaq === idx;
                    return (
                      <div
                        key={faq.q}
                        className={`fsd-faq-item ${isExpanded ? "expanded" : ""}`}
                      >
                        <button
                          type="button"
                          className="fsd-faq-question"
                          onClick={() => setSelectedFaq(isExpanded ? null : idx)}
                        >
                          <span className="fsd-faq-badge">{faq.categoryName}</span>
                          <span className="fsd-faq-text">{faq.q}</span>
                          <ChevronDown
                            size={16}
                            className={`fsd-faq-chevron ${isExpanded ? "rotate" : ""}`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="fsd-faq-answer">
                            <p className="fsd-faq-ans-text">{faq.a}</p>
                            {faq.steps && (
                              <ol className="fsd-faq-steps">
                                {faq.steps.map((step, sIdx) => (
                                  <li key={sIdx}>{step}</li>
                                ))}
                              </ol>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="fsd-faq-footer">
                  <span>Chưa giải quyết được vấn đề?</span>
                  <a
                    href="https://t.me/thedarker1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fsd-link-bold"
                  >
                    Nhắn Admin hỗ trợ trực tiếp →
                  </a>
                </div>
              </div>
            )}

            {/* TAB BODY 3: BÁO LỖI / GÓP Ý NHANH */}
            {activeTab === "ticket" && (
              <div className="fsd-tab-content">
                <p className="fsd-sec-intro">
                  Gặp lỗi trong quá trình sử dụng? Hãy mô tả ngắn gọn bên dưới, hệ thống sẽ chuyển trực tiếp đến Admin để xử lý trong tích tắc:
                </p>

                <div className="fsd-ticket-form">
                  <div className="fsd-ticket-url-box">
                    <span className="fsd-ticket-url-label">Trang bạn đang mở:</span>
                    <div className="fsd-ticket-url-row">
                      <code className="fsd-ticket-url">
                        {typeof window !== "undefined" ? window.location.pathname : "/"}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyPageUrl}
                        className="fsd-ticket-copy-btn"
                        title="Sao chép đường dẫn"
                      >
                        {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        <span>{copiedLink ? "Đã copy" : "Copy URL"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="fsd-ticket-input-wrap">
                    <label htmlFor="fsd-ticket-input" className="fsd-ticket-label">
                      Mô tả vấn đề bạn gặp phải:
                    </label>
                    <textarea
                      id="fsd-ticket-input"
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Ví dụ: Mình kích hoạt Locket nhưng mở app báo lỗi DNS / Mình bấm lấy key Free Fire nhưng trang bị đứng..."
                      rows={4}
                      className="fsd-ticket-textarea"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendTicketToTelegram}
                    disabled={!ticketMessage.trim() || ticketSent}
                    className={`fsd-ticket-submit-btn ${ticketSent ? "sent" : ""}`}
                  >
                    {ticketSent ? (
                      <>
                        <Check size={16} />
                        <span>Đã chuyển tiếp tới Telegram Admin!</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>GỬI YÊU CẦU ĐẾN ADMIN TELEGRAM</span>
                      </>
                    )}
                  </button>

                  <p className="fsd-ticket-hint">
                    💡 Khi bấm gửi, ứng dụng Telegram sẽ tự động mở với nội dung được soạn sẵn, bạn chỉ cần bấm Send!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
