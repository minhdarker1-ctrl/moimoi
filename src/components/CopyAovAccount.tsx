"use client";

import { useState } from "react";
import { Copy, Check, Eye, EyeOff, ShieldCheck, ExternalLink, RefreshCw } from "lucide-react";
import Link from "next/link";

interface AccountItem {
  id?: number;
  username: string;
  password: string;
  rank?: string;
  skins?: number;
  champs?: number;
}

export default function CopyAovAccount({ accounts }: { accounts: AccountItem[] }) {
  const [copiedUserIndex, setCopiedUserIndex] = useState<number | null>(null);
  const [copiedPassIndex, setCopiedPassIndex] = useState<number | null>(null);
  const [showPassIndex, setShowPassIndex] = useState<{ [key: number]: boolean }>({});

  const handleCopy = (text: string, type: "user" | "pass", index: number) => {
    navigator.clipboard.writeText(text);
    if (type === "user") {
      setCopiedUserIndex(index);
      setTimeout(() => setCopiedUserIndex(null), 2000);
    } else {
      setCopiedPassIndex(index);
      setTimeout(() => setCopiedPassIndex(null), 2000);
    }
  };

  const toggleShowPass = (index: number) => {
    setShowPassIndex((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="aov-reward-container" style={{ textAlign: "left", marginTop: 14 }}>
      {accounts.map((acc, idx) => (
        <div
          key={idx}
          className="aov-acc-card"
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))",
            border: "1.5px solid rgba(59, 130, 246, 0.4)",
            borderRadius: 18,
            padding: "20px 18px",
            marginBottom: 16,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25), 0 0 20px rgba(59, 130, 246, 0.15)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 99,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <ShieldCheck size={14} />
                <span>ACC #{idx + 1}</span>
              </span>
              <span style={{ fontSize: 13, color: "#93c5fd", fontWeight: 600 }}>
                {acc.rank || "Trắng Thông Tin"}
              </span>
            </div>
            <span style={{ fontSize: 12, color: "#34d399", fontWeight: 700 }}>
              ✓ ĐÃ XÁC MINH GARENA
            </span>
          </div>

          {/* Row 1: Tên đăng nhập */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 5 }}>
              TÀI KHOẢN (GARENA USERNAME)
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                readOnly
                value={acc.username}
                style={{
                  flex: 1,
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#f8fafc",
                  fontFamily: "monospace",
                }}
              />
              <button
                type="button"
                onClick={() => handleCopy(acc.username, "user", idx)}
                className="vt-btn-primary"
                style={{
                  padding: "0 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                {copiedUserIndex === idx ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
                <span>{copiedUserIndex === idx ? "Đã chép" : "Chép"}</span>
              </button>
            </div>
          </div>

          {/* Row 2: Mật khẩu */}
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 5 }}>
              MẬT KHẨU (PASSWORD)
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  type={showPassIndex[idx] ? "text" : "password"}
                  readOnly
                  value={acc.password}
                  style={{
                    width: "100%",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 10,
                    padding: "10px 42px 10px 14px",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#f8fafc",
                    fontFamily: "monospace",
                  }}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPass(idx)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                  }}
                  title={showPassIndex[idx] ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassIndex[idx] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(acc.password, "pass", idx)}
                className="vt-btn-primary"
                style={{
                  padding: "0 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                {copiedPassIndex === idx ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
                <span>{copiedPassIndex === idx ? "Đã chép" : "Chép"}</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Hành động tiếp theo */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
        <a
          href="https://account.garena.com"
          target="_blank"
          rel="noopener noreferrer"
          className="vt-btn-primary"
          style={{
            flex: 1,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 18px",
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 12,
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
          }}
        >
          <ExternalLink size={16} />
          <span>Đăng Nhập Garena Đổi Pass</span>
        </a>
        <Link
          href="/aov"
          className="vt-btn-ghost"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 18px",
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 12,
          }}
        >
          <RefreshCw size={16} />
          <span>Nhận Thêm Nick Khác</span>
        </Link>
      </div>
    </div>
  );
}
