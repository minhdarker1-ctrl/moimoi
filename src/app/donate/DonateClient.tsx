"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DONATE_CONFIG, PresetOption } from "@/config/donate";

export default function DonateClient() {
  const [selectedPreset, setSelectedPreset] = useState<number>(DONATE_CONFIG.defaultAmount);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("Fan OnCyber");
  const [donorMessage, setDonorMessage] = useState<string>("Cảm ơn bạn vì những công cụ hữu ích!");
  const [dark, setDark] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Sync theme
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

  // Calculate actual amount
  const actualAmount = customAmount ? parseInt(customAmount.replace(/\D/g, ""), 10) || 0 : selectedPreset;

  // Generate memo content for VietQR
  const cleanName = donorName.trim() ? donorName.trim().replace(/[^a-zA-Z0-9\s]/g, "") : "AN DANH";
  const memo = `${DONATE_CONFIG.memoPrefix} ${cleanName}`.toUpperCase();

  // VietQR Image URL
  const qrUrl = `https://img.vietqr.io/image/${DONATE_CONFIG.bankId}-${DONATE_CONFIG.accountNo}-${DONATE_CONFIG.vietqrTemplate}.png?amount=${actualAmount}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(DONATE_CONFIG.accountNameEncoded)}`;

  function handleSelectPreset(p: PresetOption) {
    setSelectedPreset(p.amount);
    setCustomAmount("");
  }

  function handleCustomAmountChange(val: string) {
    const raw = val.replace(/\D/g, "");
    if (!raw) {
      setCustomAmount("");
      setSelectedPreset(DONATE_CONFIG.defaultAmount);
      return;
    }
    const num = parseInt(raw, 10);
    setCustomAmount(num.toLocaleString("vi-VN"));
    setSelectedPreset(0);
  }

  async function handleCopy(text: string, fieldName: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  }

  async function handleCopyAll() {
    const text = `💖 THÔNG TIN ỦNG HỘ DỰ ÁN NUÔI TÔI - ONCYBER
──────────────
🏦 Ngân hàng: ${DONATE_CONFIG.bankName} (${DONATE_CONFIG.bankId})
💳 Số tài khoản: ${DONATE_CONFIG.accountNo}
👤 Chủ tài khoản: ${DONATE_CONFIG.accountName}
💰 Số tiền: ${actualAmount.toLocaleString("vi-VN")} VNĐ
📝 Nội dung CK: ${memo}
💌 Lời nhắn: ${donorMessage || "Chúc OnCyber ngày càng phát triển!"}
──────────────
Cảm ơn bạn rất nhiều vì đã tiếp thêm động lực cho mình! ✨`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  }

  function handleDownloadQr() {
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `VietQR-NuoiToi-${actualAmount}.png`;
    a.target = "_blank";
    a.click();
  }

  return (
    <div className="donate-page-container">
      {/* TOP NAVIGATION BAR */}
      <header className="donate-top-nav">
        <Link href="/#services" className="donate-back-btn" aria-label="Quay lại dịch vụ">
          <i className="fas fa-arrow-left" />
          <span>QUAY LẠI DỊCH VỤ</span>
        </Link>
        <button
          type="button"
          className="vthangios-theme-btn donate-theme-btn"
          onClick={handleToggleTheme}
          aria-label={dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        >
          <i
            className={`bi ${dark ? "bi-moon-stars-fill" : "bi-sun-fill"}`}
            aria-hidden="true"
          />
        </button>
      </header>

      <main className="donate-main-content">
        {/* HERO SECTION */}
        <div className="donate-hero-section">
          <div className="donate-badge-glow">
            <span className="donate-badge-icon">💖</span>
            <span className="donate-badge-text">DỰ ÁN CỘNG ĐỒNG • NUÔI TÔI</span>
          </div>
          <h1 className="donate-title">
            Ủng Hộ Tác Giả <span className="donate-pink-gradient">Nuôi Tôi</span> ☕
          </h1>
          <p className="donate-subtitle">
            Mọi công cụ trên OnCyber đều hoàn toàn miễn phí. Nếu bạn yêu quý hệ thống, hãy mời mình
            một cốc trà đá hay ly cà phê để tiếp thêm kinh phí duy trì máy chủ &amp; phát triển thêm nhiều
            tính năng hữu ích nhé!
          </p>
        </div>

        {/* 2-COLUMN INTERACTIVE VIETQR GRID */}
        <div className="donate-grid">
          {/* COLUMN 1: FORM CẤU HÌNH DONATE */}
          <section className="donate-card donate-config-card" aria-label="Tùy chọn số tiền ủng hộ">
            <div className="donate-card-head">
              <span className="donate-step-badge">1</span>
              <div>
                <h2 className="donate-card-title">Tùy Chọn Mức Ủng Hộ</h2>
                <p className="donate-card-desc">Chọn nhanh mốc tiền hoặc tự nhập số tiền bạn muốn:</p>
              </div>
            </div>

            {/* PRESET BUTTONS */}
            <div className="donate-presets-grid">
              {DONATE_CONFIG.presets.map((preset) => {
                const isActive = selectedPreset === preset.amount && !customAmount;
                return (
                  <button
                    key={preset.amount}
                    type="button"
                    className={`donate-preset-btn ${isActive ? "active" : ""}`}
                    onClick={() => handleSelectPreset(preset)}
                  >
                    <span className="donate-preset-icon">{preset.icon}</span>
                    <div className="donate-preset-info">
                      <span className="donate-preset-val">{preset.label}</span>
                      <span className="donate-preset-desc">{preset.desc}</span>
                    </div>
                    {isActive && <i className="fas fa-check-circle donate-preset-check" />}
                  </button>
                );
              })}
            </div>

            {/* CUSTOM AMOUNT INPUT */}
            <div className="donate-form-group">
              <label htmlFor="custom-amount-input" className="donate-input-label">
                <i className="fas fa-coins" /> Hoặc tự nhập số tiền tùy ý (VNĐ):
              </label>
              <div className="donate-input-wrapper">
                <input
                  id="custom-amount-input"
                  type="text"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="VD: 30.000, 68.000, 150.000..."
                  className="donate-text-input"
                  inputMode="numeric"
                />
                <span className="donate-input-suffix">VNĐ</span>
              </div>
            </div>

            {/* DONOR NAME INPUT */}
            <div className="donate-form-group">
              <label htmlFor="donor-name-input" className="donate-input-label">
                <i className="fas fa-user" /> Tên của bạn (Tùy chọn):
              </label>
              <div className="donate-input-wrapper">
                <input
                  id="donor-name-input"
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="VD: Minh, Fan OnCyber, Ẩn danh..."
                  className="donate-text-input"
                  maxLength={30}
                />
              </div>
            </div>

            {/* DONOR MESSAGE INPUT */}
            <div className="donate-form-group">
              <label htmlFor="donor-message-input" className="donate-input-label">
                <i className="fas fa-comment-heart" /> Lời nhắn gửi gắm (Tùy chọn):
              </label>
              <div className="donate-input-wrapper">
                <textarea
                  id="donor-message-input"
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  placeholder="Nhập lời chúc hoặc lời nhắn cho tác giả..."
                  className="donate-textarea-input"
                  rows={2}
                  maxLength={120}
                />
              </div>
            </div>

            <div className="donate-memo-preview">
              <i className="fas fa-receipt" />
              <span>
                Cú pháp chuyển khoản tự động: <strong>{memo}</strong>
              </span>
            </div>
          </section>

          {/* COLUMN 2: VIETQR DISPLAY & QUICK ACTIONS */}
          <section className="donate-card donate-qr-card" aria-label="Mã VietQR chuyển khoản">
            <div className="donate-card-head">
              <span className="donate-step-badge">2</span>
              <div>
                <h2 className="donate-card-title">Quét Mã VietQR Chuyển Khoản</h2>
                <p className="donate-card-desc">Mở ứng dụng ngân hàng bất kỳ để quét mã tự động điền số tiền:</p>
              </div>
            </div>

            {/* QR IMAGE WRAPPER */}
            <div className="donate-qr-wrapper">
              <div className="donate-qr-img-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt={`VietQR ${DONATE_CONFIG.bankName} - ${actualAmount}đ`}
                  className="donate-qr-img"
                  width={340}
                  height={420}
                  loading="eager"
                />
              </div>
              <div className="donate-qr-live-tag">
                <span className="donate-live-dot" />
                <span>VIETQR 24/7 • TỰ ĐỘNG ĐIỀN {actualAmount.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>

            {/* DETAIL COPY ROWS */}
            <div className="donate-info-rows">
              <div className="donate-info-row">
                <span className="donate-info-label">Ngân hàng:</span>
                <div className="donate-info-val-wrap">
                  <span className="donate-info-val bank-name">{DONATE_CONFIG.bankName}</span>
                </div>
              </div>

              <div className="donate-info-row">
                <span className="donate-info-label">Số tài khoản:</span>
                <div className="donate-info-val-wrap">
                  <span className="donate-info-val highlight">{DONATE_CONFIG.accountNo}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(DONATE_CONFIG.accountNo, "stk")}
                    className={`donate-copy-btn ${copiedField === "stk" ? "copied" : ""}`}
                    aria-label="Sao chép số tài khoản"
                  >
                    <i className={`fas ${copiedField === "stk" ? "fa-check" : "fa-copy"}`} />
                    <span>{copiedField === "stk" ? "Đã copy" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div className="donate-info-row">
                <span className="donate-info-label">Chủ tài khoản:</span>
                <div className="donate-info-val-wrap">
                  <span className="donate-info-val">{DONATE_CONFIG.accountName}</span>
                </div>
              </div>

              <div className="donate-info-row">
                <span className="donate-info-label">Số tiền:</span>
                <div className="donate-info-val-wrap">
                  <span className="donate-info-val amount">
                    {actualAmount.toLocaleString("vi-VN")} VNĐ
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(actualAmount.toString(), "amount")}
                    className={`donate-copy-btn ${copiedField === "amount" ? "copied" : ""}`}
                    aria-label="Sao chép số tiền"
                  >
                    <i className={`fas ${copiedField === "amount" ? "fa-check" : "fa-copy"}`} />
                    <span>{copiedField === "amount" ? "Đã copy" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div className="donate-info-row">
                <span className="donate-info-label">Nội dung CK:</span>
                <div className="donate-info-val-wrap">
                  <span className="donate-info-val memo">{memo}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(memo, "memo")}
                    className={`donate-copy-btn ${copiedField === "memo" ? "copied" : ""}`}
                    aria-label="Sao chép nội dung chuyển khoản"
                  >
                    <i className={`fas ${copiedField === "memo" ? "fa-check" : "fa-copy"}`} />
                    <span>{copiedField === "memo" ? "Đã copy" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div className="donate-cta-actions">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="donate-primary-action-btn"
              >
                <i className="fas fa-download" />
                <span>TẢI MÃ QR VỀ MÁY</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAll}
                className={`donate-secondary-action-btn ${copiedAll ? "copied" : ""}`}
              >
                <i className={`fas ${copiedAll ? "fa-check" : "fa-share-alt"}`} />
                <span>{copiedAll ? "ĐÃ SAO CHÉP TOÀN BỘ" : "SAO CHÉP THÔNG TIN CHUYỂN KHOẢN"}</span>
              </button>
            </div>
          </section>
        </div>

        {/* HEARTFELT APPRECIATION SECTION */}
        <section className="donate-appreciation-box" aria-label="Lời cảm ơn từ tác giả">
          <div className="donate-heart-icon">
            <i className="fas fa-heart" />
          </div>
          <div className="donate-appreciation-content">
            <h3>Cảm ơn bạn rất nhiều vì đã đồng hành cùng OnCyber! ✨</h3>
            <p>
              Mỗi cốc cà phê hay sự ủng hộ của bạn, dù lớn hay nhỏ, đều là nguồn động viên vô giá giúp
              mình duy trì hệ thống máy chủ vận hành 24/7 và tiếp tục chia sẻ thêm nhiều công cụ miễn phí
              chất lượng cao cho cộng đồng game thủ và bạn trẻ. Chúc bạn có những phút giây trải nghiệm thật tuyệt vời!
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="donate-footer">
          <p>© 2026 OnCyber • Dự Án Nuôi Tôi • Cảm ơn sự đồng hành của bạn</p>
        </footer>
      </main>
    </div>
  );
}
