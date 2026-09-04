"use client";

import { useState } from "react";
import { createManualKey } from "../actions";

export default function ManualKeyForm({
  keyTypes,
  apps,
}: {
  keyTypes: { id: number; name: string; ttlHours: number; maxUses: number }[];
  apps: { id: number; name: string }[];
}) {
  const [created, setCreated] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(fd: FormData) {
    setError("");
    const r = await createManualKey(fd);
    if ("error" in r) setError(r.error);
    else setCreated(r.key);
  }

  if (keyTypes.length === 0) {
    return (
      <p className="vt-msg vt-msg-err" style={{ padding: 0 }}>
        Chưa có loại key. Tạo ở <a href="/admin/keytypes">Loại key</a> trước.
      </p>
    );
  }

  return (
    <>
      <form action={onSubmit} className="vt-form">
        <div className="vt-row">
          <label className="vt-field">
            <span>Loại key</span>
            <select name="keyTypeId" required>
              {keyTypes.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
          </label>
          <label className="vt-field">
            <span>Áp dụng cho</span>
            <select name="appId" defaultValue={0}>
              <option value={0}>Mọi ứng dụng</option>
              {apps.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="vt-row">
          <label className="vt-field">
            <span>Hạn (giờ) — để trống dùng mặc định của loại key</span>
            <input type="number" name="ttlHours" min={1} />
          </label>
          <label className="vt-field">
            <span>Số lần dùng (0 = vô hạn)</span>
            <input type="number" name="maxUses" min={0} defaultValue={1} />
          </label>
          <label className="vt-field">
            <span>Ghi chú (ai nhận key)</span>
            <input type="text" name="note" />
          </label>
        </div>
        <button className="vt-btn-primary" type="submit">
          Tạo key
        </button>
      </form>

      {error && (
        <p className="vt-msg vt-msg-err" role="alert" style={{ padding: "10px 0 0" }}>
          {error}
        </p>
      )}

      {created && (
        <div style={{ marginTop: 14 }}>
          <p className="vt-msg vt-msg-ok" style={{ padding: 0 }} role="status">
            Đã tạo. Copy ngay — key không xem lại được sau khi rời trang.
          </p>
          <div className="vt-key-value">{created}</div>
          <button
            type="button"
            className="vt-btn-sm"
            onClick={() => navigator.clipboard?.writeText(created)}
          >
            Copy
          </button>
        </div>
      )}
    </>
  );
}
