"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, Copy, Check, Trash2, ShieldAlert } from "lucide-react";
import { deleteSavedKeyAction } from "@/app/actions/auth";

interface SavedKey {
  id: number;
  appName: string;
  key: string;
  expiresAt: string | null;
  createdAt: string;
}

interface Props {
  initialKeys: SavedKey[];
}

export default function KeysListClient({ initialKeys }: Props) {
  const [keys, setKeys] = useState(initialKeys);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCopy = async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xoá mã key này khỏi danh sách lưu?")) return;
    setDeletingId(id);
    const res = await deleteSavedKeyAction(id);
    if (res.ok) {
      setKeys((prev) => prev.filter((k) => k.id !== id));
    } else {
      alert(res.error || "Không thể xoá key.");
    }
    setDeletingId(null);
  };

  if (keys.length === 0) {
    return (
      <div className="dash-empty-card">
        <KeyRound size={44} className="text-muted" />
        <h3>Chưa có mã key nào được lưu</h3>
        <p>Khi bạn vượt link hoặc tạo key Free Fire, hãy lưu key để xem lại tại đây mà không cần vượt lại.</p>
        <Link href="/freefire" className="dash-btn-primary">
          Lấy mã key ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="dash-card">
      <div className="dash-table-wrapper">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Ứng dụng / Dịch vụ</th>
              <th>Mã Key</th>
              <th>Ngày lưu</th>
              <th>Tình trạng</th>
              <th style={{ textAlign: "right" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => {
              const isExpired = k.expiresAt && new Date(k.expiresAt) < new Date();
              const isCopied = copiedId === k.id;
              const isDeleting = deletingId === k.id;

              return (
                <tr key={k.id}>
                  <td>
                    <div className="dash-app-name-cell">
                      <KeyRound size={16} className="text-accent" />
                      <span className="font-semibold">{k.appName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="dash-key-copy-cell">
                      <code className="dash-key-code">{k.key}</code>
                      <button
                        type="button"
                        onClick={() => handleCopy(k.id, k.key)}
                        className={`dash-copy-btn ${isCopied ? "copied" : ""}`}
                        title="Sao chép key"
                        aria-label="Sao chép key"
                      >
                        {isCopied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{isCopied ? "Đã copy" : "Copy"}</span>
                      </button>
                    </div>
                  </td>
                  <td className="text-muted text-sm">
                    {new Intl.DateTimeFormat("vi-VN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(k.createdAt))}
                  </td>
                  <td>
                    {k.expiresAt ? (
                      isExpired ? (
                        <span className="badge-danger">Hết hạn</span>
                      ) : (
                        <span className="badge-success">Còn hiệu lực</span>
                      )
                    ) : (
                      <span className="badge-info">Vĩnh viễn</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => handleDelete(k.id)}
                      disabled={isDeleting}
                      className="dash-action-btn-danger"
                      title="Xoá key"
                      aria-label="Xoá key"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
