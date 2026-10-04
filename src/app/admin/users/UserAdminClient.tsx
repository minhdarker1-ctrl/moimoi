"use client";

import React from "react";
import { Trash2 } from "lucide-react";

export function ClearLogsButton({ serviceType }: { serviceType: string }) {
  return (
    <button
      type="submit"
      className="vt-btn-sm"
      style={{
        background: "transparent",
        color: "#ef4444",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        padding: "6px 12px",
        borderRadius: 6,
        fontSize: 12,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
      onClick={(e) => {
        if (!confirm(`Bạn có chắc muốn xóa tất cả log của dịch vụ [${serviceType}]?`)) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 size={13} />
      <span>Xóa sạch nhật ký ({serviceType})</span>
    </button>
  );
}

export function RoleSelect({
  currentRole,
}: {
  currentRole: string;
}) {
  return (
    <select
      name="role"
      defaultValue={currentRole}
      onChange={(e) => e.target.form?.requestSubmit()}
      style={{
        padding: "4px 8px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 700,
        background: currentRole === "ADMIN" ? "rgba(239, 68, 68, 0.12)" : "rgba(59, 130, 246, 0.12)",
        color: currentRole === "ADMIN" ? "#ef4444" : "#3b82f6",
        border: "1px solid var(--vi-border)",
        cursor: "pointer",
      }}
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}

export function DeleteUserButton({ username }: { username: string }) {
  return (
    <button
      type="submit"
      style={{
        background: "transparent",
        border: "none",
        color: "#ef4444",
        cursor: "pointer",
        padding: 4,
        display: "inline-flex",
        alignItems: "center",
      }}
      title="Xóa tài khoản này"
      onClick={(e) => {
        if (!confirm(`Bạn có chắc muốn xóa tài khoản @${username}?`)) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 size={15} />
    </button>
  );
}
