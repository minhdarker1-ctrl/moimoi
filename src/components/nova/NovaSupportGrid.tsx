"use client";

import { Headphones, Send, MessageCircle, Users } from "lucide-react";

export default function NovaSupportGrid() {
  const channels = [
    {
      name: "Admin Telegram",
      url: "https://t.me/thedarker1",
      icon: <Send size={22} className="text-sky-400" />,
      tag: "Trực tuyến 24/7",
    },
    {
      name: "Group Cộng Đồng",
      url: "https://t.me/thedarker1",
      icon: <Users size={22} className="text-purple-400" />,
      tag: "Giao lưu chia sẻ",
    },
    {
      name: "Zalo Admin",
      url: "https://zalo.me",
      icon: <MessageCircle size={22} className="text-blue-400" />,
      tag: "Hỗ trợ cài đặt",
    },
    {
      name: "Kênh YouTube",
      url: "https://youtube.com",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      tag: "Video hướng dẫn",
    },
  ];

  return (
    <div className="nova-support-section">
      <div className="nova-sec-title">
        <Headphones size={13} className="text-indigo-400" />
        <span>KÊNH HỖ TRỢ CHÍNH THỨC</span>
      </div>

      <div className="nova-support-grid">
        {channels.map((ch) => (
          <a
            key={ch.name}
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="nova-support-card"
          >
            <div className="nova-support-icon">{ch.icon}</div>
            <div className="nova-support-meta">
              <div className="nova-support-name">{ch.name}</div>
              <div className="nova-support-tag">{ch.tag}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
