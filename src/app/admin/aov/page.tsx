import { db } from "@/lib/db";
import Link from "next/link";
import AdminNav from "../AdminNav";
import {
  saveAovConfig,
  importAovAccounts,
  deleteAovAccount,
  clearClaimedAovAccounts,
  clearAllAovAccounts,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminAovPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; page?: string; q?: string; imported?: string; error?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const statusFilter = sp.status || "ALL";
  const searchKeyword = (sp.q || "").trim();
  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const pageSize = 50;

  // Xây dựng điều kiện lọc
  const whereCondition: any = { game: "AOV" };
  if (statusFilter === "AVAILABLE") {
    whereCondition.status = "AVAILABLE";
  } else if (statusFilter === "CLAIMED") {
    whereCondition.status = "CLAIMED";
  }

  if (searchKeyword) {
    whereCondition.OR = [
      { username: { contains: searchKeyword, mode: "insensitive" } },
      { claimedBy: { contains: searchKeyword, mode: "insensitive" } },
      { token: { contains: searchKeyword, mode: "insensitive" } },
    ];
  }

  const [config, keyTypes, totalCount, availableCount, claimedCount, accounts, filteredCount] =
    await Promise.all([
      db.aovConfig.findUnique({ where: { id: 1 } }),
      db.keyType.findMany({ where: { enabled: true }, orderBy: { id: "asc" } }),
      db.gameAccount.count({ where: { game: "AOV" } }),
      db.gameAccount.count({ where: { game: "AOV", status: "AVAILABLE" } }),
      db.gameAccount.count({ where: { game: "AOV", status: "CLAIMED" } }),
      db.gameAccount.findMany({
        where: whereCondition,
        orderBy: { id: "desc" },
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      db.gameAccount.count({ where: whereCondition }),
    ]);

  const totalPages = Math.ceil(filteredCount / pageSize) || 1;

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/aov" />

      {/* Header & Quick stats */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px", color: "var(--vi-text)" }}>
              🎮 Quản Lý Kho Nick Liên Quân Mobile (AOV)
            </h1>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--vi-muted)" }}>
              Quản lý phân phối tài khoản Garena trắng thông tin, nạp kho hàng loạt và cài đặt chế độ Túi Mù.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Link
              href="/lienquan"
              target="_blank"
              className="vt-btn-sm"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                background: "rgba(56, 189, 248, 0.12)",
                color: "#0284c7",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                fontWeight: 700,
              }}
            >
              <i className="fa-solid fa-arrow-up-right-from-square" />
              <span>Xem Trang Nhận Nick</span>
            </Link>
          </div>
        </div>

        {sp.imported && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#10b981",
              marginTop: 16,
              fontWeight: 700,
              fontSize: 13.5,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <i className="fa-solid fa-circle-check" />
            <span>Đã nạp thành công {sp.imported} tài khoản Garena vào kho!</span>
          </div>
        )}

        {sp.error === "empty" && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              marginTop: 16,
              fontWeight: 700,
              fontSize: 13.5,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <i className="fa-solid fa-circle-exclamation" />
            <span>Không tìm thấy tài khoản hợp lệ nào theo định dạng username|password trong nội dung dán.</span>
          </div>
        )}

        {/* 3 KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginTop: 20,
          }}
        >
          <div
            style={{
              background: "var(--vi-card)",
              border: "1px solid var(--vi-border)",
              borderRadius: 16,
              padding: "16px 20px",
              boxShadow: "var(--vi-shadow-sm)",
            }}
          >
            <div style={{ fontSize: 12.5, color: "var(--vi-muted)", fontWeight: 600 }}>🟢 TỒN KHO KHẢ DỤNG</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#10b981", marginTop: 4 }}>
              {availableCount.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600 }}>acc</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--vi-muted)", marginTop: 4 }}>
              Sẵn sàng phát khi người dùng vượt link
            </div>
          </div>

          <div
            style={{
              background: "var(--vi-card)",
              border: "1px solid var(--vi-border)",
              borderRadius: 16,
              padding: "16px 20px",
              boxShadow: "var(--vi-shadow-sm)",
            }}
          >
            <div style={{ fontSize: 12.5, color: "var(--vi-muted)", fontWeight: 600 }}>🎁 ĐÃ PHÁT TẶNG</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#38bdf8", marginTop: 4 }}>
              {claimedCount.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600 }}>acc</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--vi-muted)", marginTop: 4 }}>
              Tài khoản đã được game thủ xác thực nhận
            </div>
          </div>

          <div
            style={{
              background: "var(--vi-card)",
              border: "1px solid var(--vi-border)",
              borderRadius: 16,
              padding: "16px 20px",
              boxShadow: "var(--vi-shadow-sm)",
            }}
          >
            <div style={{ fontSize: 12.5, color: "var(--vi-muted)", fontWeight: 600 }}>📦 TỔNG KHO HỆ THỐNG</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#8b5cf6", marginTop: 4 }}>
              {totalCount.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600 }}>acc</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--vi-muted)", marginTop: 4 }}>
              Bao gồm cả acc đang chờ và acc đã nhận
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Form Cấu Hình + Form Nạp Hàng Loạt */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 20,
          marginBottom: 28,
        }}
      >
        {/* Form Cấu Hình Dịch Vụ */}
        <div
          style={{
            background: "var(--vi-card)",
            border: "1px solid var(--vi-border)",
            borderRadius: 18,
            padding: "22px",
            boxShadow: "var(--vi-shadow-sm)",
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px", color: "var(--vi-text)", display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fa-solid fa-sliders" style={{ color: "#0284c7" }} />
            Cấu Hình Nhận Nick & Cổng Vượt Link
          </h2>

          <form action={saveAovConfig} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, color: "var(--vi-text)" }}>
                Tiêu đề hiển thị:
              </label>
              <input
                type="text"
                name="title"
                defaultValue={config?.title || "Tặng Nick Liên Quân Mobile Miễn Phí"}
                className="vt-input"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 10 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, color: "var(--vi-text)" }}>
                Mô tả ngắn:
              </label>
              <textarea
                name="description"
                rows={2}
                defaultValue={config?.description || "Kho tài khoản Liên Quân Garena trắng thông tin, cập nhật liên tục hàng ngày."}
                className="vt-input"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 10 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, color: "var(--vi-text)" }}>
                Thông báo / Lưu ý dưới nút nhận:
              </label>
              <input
                type="text"
                name="notice"
                defaultValue={config?.notice || "Mỗi người nhận 1 acc/lượt vượt link. Vui lòng đổi mật khẩu sau khi nhận."}
                className="vt-input"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 10 }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, color: "var(--vi-text)" }}>
                  Cổng vượt link (KeyType):
                </label>
                <select
                  name="keyTypeId"
                  defaultValue={config?.keyTypeId || (keyTypes[0]?.id ?? 0)}
                  className="vt-input"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 10 }}
                >
                  {keyTypes.map((kt) => (
                    <option key={kt.id} value={kt.id}>
                      {kt.name} ({kt.steps} bước)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    name="blindBoxEnabled"
                    defaultChecked={config?.blindBoxEnabled ?? true}
                    style={{ width: 16, height: 16 }}
                  />
                  <span>Bật cơ chế <b>Túi Mù x5 Acc (10%)</b></span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="requireKey"
                    defaultChecked={config?.requireKey ?? true}
                    style={{ width: 16, height: 16 }}
                  />
                  <span>Bắt buộc vượt link</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="vt-btn-primary"
              style={{ padding: "10px", borderRadius: 12, fontWeight: 700, marginTop: 6 }}
            >
              Lưu Cấu Hình
            </button>
          </form>
        </div>

        {/* Form Nạp Acc Hàng Loạt */}
        <div
          style={{
            background: "var(--vi-card)",
            border: "1px solid var(--vi-border)",
            borderRadius: 18,
            padding: "22px",
            boxShadow: "var(--vi-shadow-sm)",
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px", color: "var(--vi-text)", display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fa-solid fa-file-import" style={{ color: "#10b981" }} />
            Nạp Tài Khoản Hàng Loạt Vào Kho
          </h2>

          <form action={importAovAccounts} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0, fontSize: 13, color: "var(--vi-muted)", lineHeight: 1.5 }}>
              Dán danh sách tài khoản Garena từ file text (như trong <code>C:\tmdev\accttx</code>). Mỗi tài khoản một dòng theo định dạng <code>username|password</code> hoặc <code>username:password</code>.
            </p>

            <textarea
              name="rawAccounts"
              rows={7}
              placeholder={`garena_user_01|pass123456\ngarena_user_02|pass987654\ngarena_user_03|pass333444|Ghi chu rank kim cuong`}
              className="vt-input"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                fontFamily: "monospace",
                fontSize: 12.5,
              }}
              required
            />

            <button
              type="submit"
              className="vt-btn-primary"
              style={{
                padding: "11px",
                borderRadius: 12,
                fontWeight: 700,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <i className="fa-solid fa-cloud-arrow-up" />
              <span>Nạp Danh Sách Vào Kho</span>
            </button>
          </form>
        </div>
      </div>

      {/* Quản lý danh sách tài khoản */}
      <div
        style={{
          background: "var(--vi-card)",
          border: "1px solid var(--vi-border)",
          borderRadius: 20,
          padding: "22px",
          boxShadow: "var(--vi-shadow-sm)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 4px", color: "var(--vi-text)" }}>
              Danh Sách Tài Khoản Trong Kho ({filteredCount.toLocaleString()})
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--vi-muted)" }}>
              Trang {page} / {totalPages}
            </p>
          </div>

          {/* Bộ lọc trạng thái & tìm kiếm */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", background: "var(--vi-surface)", borderRadius: 10, padding: 3, border: "1px solid var(--vi-border)" }}>
              <Link
                href={`/admin/aov?status=ALL${searchKeyword ? `&q=${encodeURIComponent(searchKeyword)}` : ""}`}
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 12.5,
                  textDecoration: "none",
                  fontWeight: 600,
                  background: statusFilter === "ALL" ? "var(--vi-accent)" : "transparent",
                  color: statusFilter === "ALL" ? "#fff" : "var(--vi-muted)",
                }}
              >
                Tất cả ({totalCount})
              </Link>
              <Link
                href={`/admin/aov?status=AVAILABLE${searchKeyword ? `&q=${encodeURIComponent(searchKeyword)}` : ""}`}
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 12.5,
                  textDecoration: "none",
                  fontWeight: 600,
                  background: statusFilter === "AVAILABLE" ? "#10b981" : "transparent",
                  color: statusFilter === "AVAILABLE" ? "#fff" : "var(--vi-muted)",
                }}
              >
                Khả dụng ({availableCount})
              </Link>
              <Link
                href={`/admin/aov?status=CLAIMED${searchKeyword ? `&q=${encodeURIComponent(searchKeyword)}` : ""}`}
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 12.5,
                  textDecoration: "none",
                  fontWeight: 600,
                  background: statusFilter === "CLAIMED" ? "#38bdf8" : "transparent",
                  color: statusFilter === "CLAIMED" ? "#fff" : "var(--vi-muted)",
                }}
              >
                Đã phát ({claimedCount})
              </Link>
            </div>

            {/* Form search */}
            <form method="GET" action="/admin/aov" style={{ display: "flex", gap: 6 }}>
              <input type="hidden" name="status" value={statusFilter} />
              <input
                type="text"
                name="q"
                defaultValue={searchKeyword}
                placeholder="Tìm user, IP, token..."
                className="vt-input"
                style={{ padding: "6px 10px", borderRadius: 8, fontSize: 12.5, width: 170 }}
              />
              <button
                type="submit"
                className="vt-btn-sm"
                style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12.5, cursor: "pointer" }}
              >
                <i className="fa-solid fa-magnifying-glass" />
              </button>
            </form>

            {/* Quick bulk actions */}
            {claimedCount > 0 && (
              <form action={clearClaimedAovAccounts}>
                <button
                  type="submit"
                  className="vt-btn-sm"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#ef4444",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  title="Dọn dẹp các tài khoản đã tặng để giải phóng dung lượng"
                >
                  <i className="fa-solid fa-trash-can" style={{ marginRight: 4 }} />
                  Xóa Acc Đã Phát ({claimedCount})
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Table accounts */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--vi-border)", textAlign: "left", color: "var(--vi-muted)" }}>
                <th style={{ padding: "10px 12px" }}>ID</th>
                <th style={{ padding: "10px 12px" }}>Tài khoản (Username)</th>
                <th style={{ padding: "10px 12px" }}>Mật khẩu</th>
                <th style={{ padding: "10px 12px" }}>Trạng thái</th>
                <th style={{ padding: "10px 12px" }}>Người nhận / IP</th>
                <th style={{ padding: "10px 12px" }}>Thời gian nhận</th>
                <th style={{ padding: "10px 12px", textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "var(--vi-muted)" }}>
                    Không có tài khoản nào phù hợp bộ lọc.
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr
                    key={acc.id}
                    style={{
                      borderBottom: "1px solid var(--vi-border)",
                      background: acc.status === "CLAIMED" ? "rgba(0, 0, 0, 0.015)" : "transparent",
                    }}
                  >
                    <td style={{ padding: "10px 12px", color: "var(--vi-muted)", fontFamily: "monospace" }}>
                      #{acc.id}
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 700, fontFamily: "monospace", color: "var(--vi-text)" }}>
                      {acc.username}
                    </td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "var(--vi-muted)" }}>
                      {acc.password}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      {acc.status === "AVAILABLE" ? (
                        <span
                          style={{
                            background: "rgba(16, 185, 129, 0.12)",
                            color: "#10b981",
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 700,
                          }}
                        >
                          KHẢ DỤNG
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "rgba(56, 189, 248, 0.12)",
                            color: "#0284c7",
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 700,
                          }}
                        >
                          ĐÃ PHÁT
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "10px 12px", color: "var(--vi-muted)", fontSize: 12.5 }}>
                      {acc.claimedBy || "—"}
                    </td>
                    <td style={{ padding: "10px 12px", color: "var(--vi-muted)", fontSize: 12 }}>
                      {acc.claimedAt ? new Date(acc.claimedAt).toLocaleString("vi-VN") : "—"}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right" }}>
                      <form action={deleteAovAccount} style={{ display: "inline-block" }}>
                        <input type="hidden" name="id" value={acc.id} />
                        <button
                          type="submit"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontSize: 12.5,
                          }}
                          title="Xóa tài khoản này"
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/aov?page=${p}&status=${statusFilter}${searchKeyword ? `&q=${encodeURIComponent(searchKeyword)}` : ""}`}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 12.5,
                  textDecoration: "none",
                  fontWeight: 600,
                  background: page === p ? "var(--vi-accent)" : "var(--vi-surface)",
                  color: page === p ? "#fff" : "var(--vi-muted)",
                  border: "1px solid var(--vi-border)",
                }}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
