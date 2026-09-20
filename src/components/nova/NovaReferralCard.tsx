"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface NovaReferralCardProps {
  referralCode?: string;
  username?: string;
}

export default function NovaReferralCard({
  referralCode = "",
  username = "user",
}: NovaReferralCardProps) {
  const [copied, setCopied] = useState(false);

  const refParam = referralCode || username;
  const refUrl = typeof window !== "undefined"
    ? `${window.location.origin}/register?ref=${refParam}`
    : `https://thedarker.vercel.app/register?ref=${refParam}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="nova-ref-card">
      <div className="nova-sec-title">
        <Share2 size={13} className="text-purple-400" />
        <span>GIỚI THIỆU BẠN BÈ</span>
      </div>

      <p className="nova-ref-desc">
        Mời bạn bè sử dụng OnCyber — nhận ngay <strong className="text-emerald-400">+500 coins</strong> và <strong className="text-amber-400">+1 lượt quay</strong> khi bạn bè đăng ký và lấy key lần đầu tiên.
      </p>

      <div className="nova-ref-link-box" onClick={handleCopy} title="Bấm để sao chép liên kết">
        <span className="nova-ref-link-text">{refUrl}</span>
        <button type="button" className="nova-ref-copy-btn" aria-label="Sao chép">
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </button>
      </div>

      {copied && (
        <div className="nova-toast-notice">
          ✅ Đã sao chép liên kết giới thiệu của bạn!
        </div>
      )}
    </div>
  );
}
