"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Ticket,
  Gift,
  HelpCircle,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  RotateCw,
  Trophy,
  Package,
  X,
  ShieldCheck,
  Flame,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import AovTaskbar from "./AovTaskbar";
import {
  openBlindBagAction,
  spinWheelAction,
  getMyAovInventoryAction,
  ClaimedAovAccount,
} from "@/app/actions/aov";

interface CurrentUserData {
  id: number;
  username: string;
  role: string;
  aovTickets: number;
  name?: string | null;
}

interface AovArenaClientProps {
  currentUser: CurrentUserData | null;
  availableStock: number;
  claimedStock: number;
  blindBoxEnabled: boolean;
  notice: string;
  initialInventory: ClaimedAovAccount[];
}

// 6 Lớp giải thưởng của Vòng Quay (Mỗi ô 60 độ)
const WHEEL_SLICES = [
  { index: 0, count: 0, label: "Chúc may mắn", sub: "Lần sau nhé", color: "#475569", bg: "#1e293b", textColor: "#94a3b8" },
  { index: 1, count: 1, label: "1 ACC", sub: "Garena VIP", color: "#0284c7", bg: "#0c4a6e", textColor: "#38bdf8" },
  { index: 2, count: 2, label: "2 ACC", sub: "Trắng TT", color: "#10b981", bg: "#064e3b", textColor: "#34d399" },
  { index: 3, count: 3, label: "3 ACC", sub: "Leo Rank", color: "#8b5cf6", bg: "#4c1d95", textColor: "#c084fc" },
  { index: 4, count: 4, label: "4 ACC", sub: "Siêu VIP", color: "#ec4899", bg: "#831843", textColor: "#f472b6" },
  { index: 5, count: 5, label: "5 ACC", sub: "JACKPOT 👑", color: "#f59e0b", bg: "#78350f", textColor: "#fbbf24" },
];

export default function AovArenaClient({
  currentUser,
  availableStock,
  claimedStock,
  blindBoxEnabled,
  notice,
  initialInventory,
}: AovArenaClientProps) {
  // Trạng thái tài khoản & số vé hiện tại (cập nhật realtime sau khi chơi)
  const [currentTickets, setCurrentTickets] = useState<number>(currentUser?.aovTickets ?? 0);
  const [inventory, setInventory] = useState<ClaimedAovAccount[]>(initialInventory);

  // Trạng thái Auth Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [authPromptMessage, setAuthPromptMessage] = useState<string>("");

  // Trạng thái Túi đồ Inventory Modal
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  // Trạng thái nạp vé (Vượt link)
  const [isStartingHop, setIsStartingHop] = useState(false);
  const [hopError, setHopError] = useState<string | null>(null);

  // ===== TRẠNG THÁI MINI-GAME 1: XÉ TÚI MÙ =====
  // "idle" | "shaking" | "tearing" | "bursting" | "revealed"
  const [bagStage, setBagStage] = useState<"idle" | "shaking" | "tearing" | "bursting" | "revealed">("idle");
  const [bagResultAccounts, setBagResultAccounts] = useState<ClaimedAovAccount[]>([]);
  const [bagError, setBagError] = useState<string | null>(null);

  // ===== TRẠNG THÁI MINI-GAME 2: VÒNG QUAY MAY MẮN =====
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [spinError, setSpinError] = useState<string | null>(null);
  const [spinResultModal, setSpinResultModal] = useState<{
    open: boolean;
    count: number;
    accounts: ClaimedAovAccount[];
  }>({ open: false, count: 0, accounts: [] });

  // Tiện ích hiển thị mật khẩu & sao chép
  const [showPass, setShowPass] = useState<{ [id: number]: boolean }>({});
  const [copiedMap, setCopiedMap] = useState<{ [key: string]: boolean }>({});

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hiệu ứng pháo hoa Confetti Canvas
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#38bdf8", "#f59e0b", "#ec4899", "#10b981", "#8b5cf6", "#ffffff"];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      vRot: number;
      life: number;
    }> = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 15,
        life: 1,
      });
    }

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // gravity
          p.vx *= 0.98; // air drag
          p.rotation += p.vRot;
          p.life -= 0.012;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    render();
  };

  // Sao chép văn bản
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  // Hành động Lấy Ticket (Vượt Link)
  const handleGetTicket = async () => {
    setHopError(null);

    // BẮT BUỘC ĐĂNG NHẬP KHI BẤM LẤY VÉ
    if (!currentUser) {
      setAuthPromptMessage("Vui lòng đăng nhập hoặc tạo tài khoản để nhận và lưu trữ vé của bạn!");
      setAuthModalTab("login");
      setIsAuthModalOpen(true);
      return;
    }

    setIsStartingHop(true);

    try {
      const res = await fetch("/api/getkey/start?scope=aov&format=json", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Lỗi kết nối máy chủ (${res.status}). Vui lòng thử lại!`);
      }

      const redirectUrl = data?.firstHopUrl || data?.url;
      if (!res.ok || !data?.ok || !redirectUrl) {
        throw new Error(data?.error || "Không thể tạo phiên vượt link. Vui lòng thử lại sau ít phút!");
      }

      window.location.href = redirectUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra khi tạo link nạp vé.";
      setHopError(msg);
      setIsStartingHop(false);
    }
  };

  // ===== XỬ LÝ MINI-GAME 1: XÉ TÚI MÙ (1 VÉ) =====
  const handleOpenBlindBag = async () => {
    if (bagStage !== "idle") return;
    setBagError(null);

    // Kiểm tra đăng nhập
    if (!currentUser) {
      setAuthPromptMessage("Vui lòng đăng nhập tài khoản để xé Túi Mù và nhận acc!");
      setAuthModalTab("login");
      setIsAuthModalOpen(true);
      return;
    }

    // Kiểm tra số vé
    if (currentTickets < 1) {
      setBagError("Bạn không đủ vé để xé Túi Mù (Cần 1 Vé). Vui lòng bấm 'Lấy Ticket' để vượt link nạp vé!");
      return;
    }

    // Bắt đầu chuỗi Animation
    setBagStage("shaking");

    try {
      const res = await openBlindBagAction();
      if (!res.ok || !res.data) {
        setBagError(res.error || "Không thể mở túi mù. Vui lòng thử lại!");
        setBagStage("idle");
        return;
      }

      const { accounts, remainingTickets } = res.data;

      // Phase 2: Tearing (sau 1.1s)
      setTimeout(() => {
        setBagStage("tearing");
      }, 1100);

      // Phase 3: Bursting (sau 2.1s)
      setTimeout(() => {
        setBagStage("bursting");
        triggerConfetti();
      }, 2100);

      // Phase 4: Revealed (sau 2.8s)
      setTimeout(() => {
        setBagResultAccounts(accounts);
        setCurrentTickets(remainingTickets);
        setInventory((prev) => [...accounts, ...prev]);
        setBagStage("revealed");
      }, 2800);
    } catch {
      setBagError("Đã có lỗi xảy ra trong quá trình mở túi mù!");
      setBagStage("idle");
    }
  };

  // ===== XỬ LÝ MINI-GAME 2: VÒNG QUAY MAY MẮN (2 VÉ) =====
  const handleSpinWheel = async () => {
    if (isSpinning) return;
    setSpinError(null);

    // Kiểm tra đăng nhập
    if (!currentUser) {
      setAuthPromptMessage("Vui lòng đăng nhập tài khoản để quay Vòng Quay May Mắn!");
      setAuthModalTab("login");
      setIsAuthModalOpen(true);
      return;
    }

    // Kiểm tra vé
    if (currentTickets < 2) {
      setSpinError("Bạn cần ít nhất 2 vé để quay Vòng Quay. Vui lòng bấm 'Lấy Ticket' để vượt link nạp vé!");
      return;
    }

    setIsSpinning(true);

    try {
      const res = await spinWheelAction();
      if (!res.ok || !res.data) {
        setSpinError(res.error || "Lỗi khi quay thưởng. Vui lòng thử lại!");
        setIsSpinning(false);
        return;
      }

      const { sliceIndex, count, accounts, remainingTickets } = res.data;

      // Tính toán góc quay:
      // Bánh xe có 6 ô, mỗi ô 60 độ.
      // Kim chỉ ở đỉnh 12h (0 độ).
      // Ô i có tâm tại: (i * 60 + 30) độ. Để ô i quay đến đỉnh 12h:
      // Target rotation = 360 - (sliceIndex * 60 + 30)
      // Quay thêm 5 - 7 vòng đầy đủ (5 * 360 = 1800 độ).
      const sliceCenter = sliceIndex * 60 + 30;
      const baseRotation = 360 - sliceCenter;
      const totalFullSpins = 5 * 360;
      const targetDeg = wheelRotation + totalFullSpins + ((baseRotation - (wheelRotation % 360) + 360) % 360);

      setWheelRotation(targetDeg);

      // Đợi hết animation 4.5s
      setTimeout(() => {
        setIsSpinning(false);
        setCurrentTickets(remainingTickets);
        if (accounts.length > 0) {
          setInventory((prev) => [...accounts, ...prev]);
          triggerConfetti();
        }
        setSpinResultModal({
          open: true,
          count,
          accounts,
        });
      }, 4600);
    } catch {
      setSpinError("Lỗi kết nối khi quay thưởng. Vui lòng thử lại!");
      setIsSpinning(false);
    }
  };

  return (
    <div className="aov-arena-wrapper">
      {/* Canvas Confetti */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />

      {/* TASKBAR BÊN TRÊN */}
      <AovTaskbar
        currentUser={
          currentUser
            ? { ...currentUser, aovTickets: currentTickets }
            : null
        }
        inventoryCount={inventory.length}
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        authModalTab={authModalTab}
        setAuthModalTab={setAuthModalTab}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onGetTicketClick={handleGetTicket}
        authPromptMessage={authPromptMessage}
      />

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "16px 16px 60px" }}>
        {/* Nút quay lại trang chủ */}
        <div style={{ textAlign: "left", marginBottom: 18 }}>
          <Link href="/#services" className="cyber-back-btn">
            <span>← QUAY LẠI TRANG CHỦ</span>
          </Link>
        </div>

        {/* HERO BANNER ĐẤU TRƯỜNG */}
        <section className="aov-hero-banner">
          <div className="aov-hero-badge">
            <Sparkles size={14} />
            <span>ĐẤU TRƯỜNG GARENA AOV 2026</span>
          </div>

          <h1 className="aov-hero-title">
            ĐẤU TRƯỜNG LIÊN QUÂN MOBILE
          </h1>
          <p className="aov-hero-subtitle">
            Vượt link nhận vé tham gia <b>Xé Túi Mù (1 - 3 acc)</b> hoặc thử vận may với <b>Vòng Quay May Mắn (0 - 5 acc)</b> 100% trắng thông tin!
          </p>

          {/* HYPE CARDS: TÂM PHÁP GACHA & ĐẶC QUYỀN AOV */}
          <div className="aov-hype-grid">
            <div className="aov-hype-card gold">
              <div className="aov-hype-icon">🔥</div>
              <div className="aov-hype-content">
                <div className="aov-hype-title">TỶ LỆ NỔ 5 ACC ~30%</div>
                <div className="aov-hype-desc">
                  Tỷ lệ nổ siêu phẩm Jackpot cực cao, tùy thuộc vào độ may mắn &amp; nhân phẩm!
                </div>
              </div>
            </div>

            <div className="aov-hype-card cyan">
              <div className="aov-hype-icon">🤝</div>
              <div className="aov-hype-content">
                <div className="aov-hype-title">ACC CÀY CHUNG SỨC</div>
                <div className="aov-hype-desc">
                  Nick Garena trắng TT 100%, tha hồ cày sự kiện Chung Sức, kéo rank &amp; test tướng.
                </div>
              </div>
            </div>

            <div className="aov-hype-card purple">
              <div className="aov-hype-icon">🎰</div>
              <div className="aov-hype-content">
                <div className="aov-hype-title">BẤT BẠI TÂM PHÁP</div>
                <div className="aov-hype-desc">
                  99% con bạc thường dừng lại ngay trước khi thắng lớn! Hãy kiên trì tới cùng.
                </div>
              </div>
            </div>
          </div>

          {/* CTA: NẠP VÉ / LẤY TICKET */}
          <div className="aov-ticket-cta-wrap">
            <button
              type="button"
              onClick={handleGetTicket}
              disabled={isStartingHop}
              className="aov-btn-get-ticket"
            >
              <Ticket size={20} className="text-amber-300" />
              <span>
                {isStartingHop
                  ? "ĐANG KHỞI TẠO NHIỆM VỤ..."
                  : "LẤY TICKET (VƯỢT LINK 1 CHẠM)"}
              </span>
              <ArrowRight size={18} />
            </button>
            <p className="aov-ticket-hint">
              Mỗi lượt vượt link thành công = Nhận ngay <b>+1 Vé</b> vào tài khoản. Vé không bị giới hạn thời gian sử dụng!
            </p>
            {hopError && (
              <div className="aov-auth-alert error" style={{ maxWidth: 480, margin: "10px auto 0" }}>
                <AlertTriangle size={16} />
                <span>{hopError}</span>
              </div>
            )}
          </div>
        </section>

        {/* LƯỚI 2 MINI-GAMES TIÊU VÉ */}
        <section className="aov-games-grid">
          {/* ================= GAME 1: XÉ TÚI MÙ ================= */}
          <div className="aov-game-card aov-game-bag">
            <div className="aov-game-badge">
              <Gift size={14} />
              <span>MINI-GAME 1</span>
            </div>

            <h2 className="aov-game-title">XÉ TÚI MÙ MAY MẮN</h2>
            <div className="aov-game-cost">
              <span>CHI PHÍ:</span>
              <span className="cost-tag">1 TICKET</span>
            </div>
            <p className="aov-game-desc">
              Xé túi bí ẩn nhận ngẫu nhiên <b>1 đến 3 nick Liên Quân VIP</b> trắng thông tin Garena. 100% trúng acc!
            </p>

            {/* Khung tương tác Túi Mù */}
            <div className="aov-bag-interactive-area">
              {bagStage === "idle" && (
                <div className="aov-bag-visual idle" onClick={handleOpenBlindBag}>
                  <div className="aov-bag-icon-pack">🎁</div>
                  <div className="aov-bag-click-hint">BẤM VÀO ĐÂY HOẶC NÚT DƯỚI ĐỂ XÉ</div>
                </div>
              )}

              {bagStage === "shaking" && (
                <div className="aov-bag-visual shaking">
                  <div className="aov-bag-icon-pack">🎁</div>
                  <div className="aov-bag-status-txt">ĐANG TÍCH TỤ NĂNG LƯỢNG...</div>
                </div>
              )}

              {bagStage === "tearing" && (
                <div className="aov-bag-visual tearing">
                  <div className="aov-tear-slash" />
                  <div className="aov-bag-icon-pack ripped">💥</div>
                  <div className="aov-bag-status-txt">RẸTTTT...! ĐANG XÉ TÚI!</div>
                </div>
              )}

              {bagStage === "bursting" && (
                <div className="aov-bag-visual bursting">
                  <div className="aov-burst-glow" />
                  <div className="aov-bag-status-txt">✨ BÙNG NỔ PHẦN THƯỞNG!</div>
                </div>
              )}

              {bagStage === "revealed" && (
                <div className="aov-bag-result-area">
                  <div className="aov-bag-result-header">
                    🎉 CHÚC MỪNG BẠN XÉ TRÚNG {bagResultAccounts.length} ACC!
                  </div>
                  <div className="aov-result-cards-list">
                    {bagResultAccounts.map((acc, idx) => (
                      <div key={idx} className="aov-acc-reveal-card">
                        <div className="aov-acc-reveal-head">
                          <span className="badge-rank">ACC #{idx + 1}: {acc.rank || "Trắng Thông Tin"}</span>
                          <span className="badge-verified">✓ GARENA</span>
                        </div>
                        <div className="aov-acc-field">
                          <span className="lbl">TÀI KHOẢN:</span>
                          <div className="val-box">
                            <code>{acc.username}</code>
                            <button
                              type="button"
                              onClick={() => handleCopy(acc.username, `user_${acc.id}`)}
                              className="aov-btn-mini-copy"
                            >
                              {copiedMap[`user_${acc.id}`] ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                        <div className="aov-acc-field">
                          <span className="lbl">MẬT KHẨU:</span>
                          <div className="val-box">
                            <code>{showPass[acc.id] ? acc.password : "••••••••••••"}</code>
                            <button
                              type="button"
                              onClick={() => setShowPass((p) => ({ ...p, [acc.id]: !p[acc.id] }))}
                              className="aov-btn-mini-eye"
                            >
                              {showPass[acc.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(acc.password, `pass_${acc.id}`)}
                              className="aov-btn-mini-copy"
                            >
                              {copiedMap[`pass_${acc.id}`] ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="aov-bag-btn-row">
                    <button
                      type="button"
                      className="aov-btn-again"
                      onClick={() => setBagStage("idle")}
                    >
                      <RotateCw size={15} />
                      <span>XÉ TÚI TIẾP (1 VÉ)</span>
                    </button>
                    <a
                      href="https://account.garena.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aov-btn-garena"
                    >
                      <ExternalLink size={15} />
                      <span>ĐỔI PASS GARENA</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {bagError && (
              <div className="aov-auth-alert error" style={{ marginTop: 12 }}>
                <AlertTriangle size={15} />
                <span>{bagError}</span>
              </div>
            )}

            {bagStage === "idle" && (
              <button
                type="button"
                onClick={handleOpenBlindBag}
                className="aov-game-action-btn bag-btn"
              >
                <Gift size={18} />
                <span>XÉ TÚI MÙ (TỐN 1 VÉ)</span>
              </button>
            )}
          </div>

          {/* ================= GAME 2: VÒNG QUAY MAY MẮN ================= */}
          <div className="aov-game-card aov-game-wheel">
            <div className="aov-game-badge wheel">
              <Trophy size={14} />
              <span>MINI-GAME 2</span>
            </div>

            <h2 className="aov-game-title">VÒNG QUAY MAY MẮN</h2>
            <div className="aov-game-cost">
              <span>CHI PHÍ:</span>
              <span className="cost-tag wheel">2 TICKET</span>
            </div>
            <p className="aov-game-desc">
              Xoay bánh xe thần tài nhận ngẫu nhiên từ <b>0 đến 5 nick Liên Quân VIP</b>! Cơ hội nổ hũ JACKPOT 5 nick.
            </p>

            {/* BÁNH XE QUAY SVG */}
            <div className="aov-wheel-container">
              {/* Kim chỉ ở đỉnh 12h */}
              <div className="aov-wheel-pointer" />

              {/* Bánh xe xoay tròn */}
              <div
                className="aov-wheel-spinner"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isSpinning
                    ? "transform 4.5s cubic-bezier(0.15, 0.9, 0.25, 1)"
                    : "none",
                }}
              >
                <svg viewBox="0 0 400 400" className="aov-wheel-svg">
                  <defs>
                    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Vành ngoài phát sáng */}
                  <circle cx="200" cy="200" r="195" fill="#0f172a" stroke="#38bdf8" strokeWidth="4" />

                  {/* 6 Ô giải thưởng */}
                  {WHEEL_SLICES.map((s) => {
                    const anglePerSlice = 60;
                    const startAngle = (s.index * anglePerSlice * Math.PI) / 180;
                    const endAngle = ((s.index + 1) * anglePerSlice * Math.PI) / 180;
                    const r = 185;

                    const x1 = 200 + r * Math.sin(startAngle);
                    const y1 = 200 - r * Math.cos(startAngle);
                    const x2 = 200 + r * Math.sin(endAngle);
                    const y2 = 200 - r * Math.cos(endAngle);

                    const path = `M 200 200 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
                    const textAngle = s.index * 60 + 30;

                    return (
                      <g key={s.index}>
                        <path
                          d={path}
                          fill={s.bg}
                          stroke="#334155"
                          strokeWidth="1.5"
                        />
                        {/* Text giải thưởng */}
                        <g transform={`rotate(${textAngle} 200 200)`}>
                          <text
                            x="200"
                            y="75"
                            textAnchor="middle"
                            fill={s.textColor}
                            fontWeight="900"
                            fontSize="16"
                            fontFamily="monospace"
                          >
                            {s.label}
                          </text>
                          <text
                            x="200"
                            y="95"
                            textAnchor="middle"
                            fill="#cbd5e1"
                            fontWeight="700"
                            fontSize="11.5"
                          >
                            {s.sub}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* Tâm xoay trung tâm */}
                  <circle cx="200" cy="200" r="38" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
                  <circle cx="200" cy="200" r="28" fill="#0f172a" />
                  <text
                    x="200"
                    y="205"
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontWeight="900"
                    fontSize="13"
                  >
                    AOV
                  </text>
                </svg>
              </div>
            </div>

            {spinError && (
              <div className="aov-auth-alert error" style={{ marginTop: 12 }}>
                <AlertTriangle size={15} />
                <span>{spinError}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isSpinning}
              onClick={handleSpinWheel}
              className="aov-game-action-btn wheel-btn"
            >
              <RotateCw size={18} className={isSpinning ? "animate-spin" : ""} />
              <span>{isSpinning ? "ĐANG QUAY THẦN TỐC..." : "QUAY VÒNG QUAY (TỐN 2 VÉ)"}</span>
            </button>
          </div>
        </section>

        {/* MODAL KẾT QUẢ VÒNG QUAY MAY MẮN */}
        {spinResultModal.open && (
          <div className="aov-modal-backdrop" onClick={() => setSpinResultModal((p) => ({ ...p, open: false }))}>
            <div className="aov-spin-result-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="aov-modal-close-btn"
                onClick={() => setSpinResultModal((p) => ({ ...p, open: false }))}
              >
                <X size={18} />
              </button>

              <div className="aov-spin-result-icon">
                {spinResultModal.count > 0 ? "🎉" : "🍀"}
              </div>

              <h3>
                {spinResultModal.count > 0
                  ? `CHÚC MỪNG BẠN TRÚNG ${spinResultModal.count} ACC!`
                  : "CHÚC BẠN MAY MẮN LẦN SAU!"}
              </h3>
              <p>
                {spinResultModal.count > 0
                  ? "Tài khoản đã được cập nhật vào Túi Đồ của bạn. Vui lòng đổi mật khẩu để bảo mật."
                  : "Đừng nản lòng! Hãy vượt link lấy thêm vé để tiếp tục thử vận may nhận tới 5 acc!"}
              </p>

              {spinResultModal.accounts.length > 0 && (
                <div className="aov-result-cards-list" style={{ marginTop: 16 }}>
                  {spinResultModal.accounts.map((acc, idx) => (
                    <div key={idx} className="aov-acc-reveal-card">
                      <div className="aov-acc-reveal-head">
                        <span className="badge-rank">ACC #{idx + 1}: {acc.rank || "Trắng Thông Tin"}</span>
                        <span className="badge-verified">✓ GARENA</span>
                      </div>
                      <div className="aov-acc-field">
                        <span className="lbl">TÀI KHOẢN:</span>
                        <div className="val-box">
                          <code>{acc.username}</code>
                          <button
                            type="button"
                            onClick={() => handleCopy(acc.username, `spin_user_${acc.id}`)}
                            className="aov-btn-mini-copy"
                          >
                            {copiedMap[`spin_user_${acc.id}`] ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                      <div className="aov-acc-field">
                        <span className="lbl">MẬT KHẨU:</span>
                        <div className="val-box">
                          <code>{showPass[acc.id] ? acc.password : "••••••••••••"}</code>
                          <button
                            type="button"
                            onClick={() => setShowPass((p) => ({ ...p, [acc.id]: !p[acc.id] }))}
                            className="aov-btn-mini-eye"
                          >
                            {showPass[acc.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(acc.password, `spin_pass_${acc.id}`)}
                            className="aov-btn-mini-copy"
                          >
                            {copiedMap[`spin_pass_${acc.id}`] ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  type="button"
                  className="aov-btn-again"
                  onClick={() => setSpinResultModal((p) => ({ ...p, open: false }))}
                >
                  <span>TIẾP TỤC CHƠI</span>
                </button>
                <button
                  type="button"
                  className="aov-btn-inventory-open"
                  onClick={() => {
                    setSpinResultModal((p) => ({ ...p, open: false }));
                    setIsInventoryOpen(true);
                  }}
                >
                  <Package size={15} />
                  <span>XEM TÚI ĐỒ ({inventory.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL / DRAWER TÚI ĐỒ (INVENTORY) */}
        {isInventoryOpen && (
          <div className="aov-modal-backdrop" onClick={() => setIsInventoryOpen(false)}>
            <div className="aov-inventory-modal" onClick={(e) => e.stopPropagation()}>
              <div className="aov-inventory-modal-head">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Package size={22} className="text-sky-400" />
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, color: "var(--vi-text)" }}>
                      TÚI ĐỒ CỦA TÔI
                    </h3>
                    <span style={{ fontSize: 13, color: "var(--vi-muted)" }}>
                      Tổng cộng {inventory.length} tài khoản Liên Quân đã trúng
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="aov-modal-close-btn"
                  onClick={() => setIsInventoryOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {inventory.length === 0 ? (
                <div className="aov-inventory-empty">
                  <Package size={48} className="text-slate-600" />
                  <p>Túi đồ của bạn hiện đang trống!</p>
                  <span>Hãy nạp vé để Xé Túi Mù hoặc Quay Vòng Quay nhận acc ngay nhé.</span>
                </div>
              ) : (
                <div className="aov-inventory-list">
                  {inventory.map((acc, idx) => (
                    <div key={idx} className="aov-inventory-item">
                      <div className="aov-inv-item-top">
                        <span className="rank-tag">#{idx + 1} {acc.rank || "Trắng TT"}</span>
                        <span className="date-tag">
                          {acc.claimedAt ? new Date(acc.claimedAt).toLocaleDateString("vi-VN") : "Gần đây"}
                        </span>
                      </div>
                      <div className="aov-inv-credentials">
                        <div className="cred-row">
                          <span className="lbl">TK:</span>
                          <code>{acc.username}</code>
                          <button
                            type="button"
                            onClick={() => handleCopy(acc.username, `inv_u_${acc.id}`)}
                            className="copy-btn"
                          >
                            {copiedMap[`inv_u_${acc.id}`] ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                          </button>
                        </div>
                        <div className="cred-row">
                          <span className="lbl">MK:</span>
                          <code>{showPass[acc.id] ? acc.password : "••••••••••••"}</code>
                          <button
                            type="button"
                            onClick={() => setShowPass((p) => ({ ...p, [acc.id]: !p[acc.id] }))}
                            className="eye-btn"
                          >
                            {showPass[acc.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(acc.password, `inv_p_${acc.id}`)}
                            className="copy-btn"
                          >
                            {copiedMap[`inv_p_${acc.id}`] ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* LƯU Ý & HƯỚNG DẪN */}
        <section className="aov-guide-card">
          <h3 className="aov-guide-title">
            <HelpCircle size={18} className="text-sky-400" />
            <span>Quy Trình & Hướng Dẫn Tham Gia</span>
          </h3>
          <div className="aov-steps-row">
            <div className="aov-step-item">
              <div className="step-num">1</div>
              <div>
                <div className="step-name">Lấy Ticket</div>
                <div className="step-desc">Đăng nhập tài khoản và bấm &quot;Lấy Ticket&quot; để vượt link an toàn (mỗi lần = +1 Vé).</div>
              </div>
            </div>
            <div className="aov-step-item">
              <div className="step-num">2</div>
              <div>
                <div className="step-name">Chọn Mini-Game</div>
                <div className="step-desc">Dùng 1 vé để <b>Xé Túi Mù</b> (1-3 acc) hoặc 2 vé để xoay <b>Vòng Quay</b> (0-5 acc).</div>
              </div>
            </div>
            <div className="aov-step-item">
              <div className="step-num">3</div>
              <div>
                <div className="step-name">Nhận Nick & Đổi Pass</div>
                <div className="step-desc">Tài khoản được lưu vĩnh viễn trong Túi Đồ. Truy cập <b>account.garena.com</b> đổi pass ngay.</div>
              </div>
            </div>
          </div>
        </section>

        {/* LƯU Ý AN TOÀN */}
        <div className="aov-disclaimer-box">
          <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#d97706" }}>
            ⚠️ LƯU Ý VỀ TÀI KHOẢN TẶNG MIỄN PHÍ:
          </p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Tài khoản phục vụ mục đích trải nghiệm skin, test tướng, làm sự kiện hoặc leo rank giải trí.</li>
            <li>Để giữ tài khoản cho riêng bạn lâu dài, vui lòng đăng nhập <b>account.garena.com</b> để thêm thông tin bảo mật.</li>
            <li>Nghiêm cấm hành vi sử dụng tài khoản vào các mục đích lừa đảo hoặc vi phạm điều khoản nhà phát hành.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
