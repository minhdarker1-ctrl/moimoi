"use client";

import { useState, useEffect } from "react";
import { performSecurityAudit, SecurityViolation } from "@/lib/anti-bot-engine";

interface AntiBotOverlayProps {
  scope?: string;
  deviceInput?: string;
  deviceType?: string;
  onSuccess: (antiBotToken: string) => void;
  onError?: (err: string) => void;
  cfSiteKey?: string;
  turnstileEnabled?: boolean;
}

type StepState = "precheck" | "scanning" | "blocked" | "passed";

export default function AntiBotOverlay({
  scope = "getkey",
  deviceInput = "",
  deviceType = "",
  onSuccess,
  onError,
}: AntiBotOverlayProps) {
  const [state, setState] = useState<StepState>("precheck");
  const [elapsed, setElapsed] = useState(0);
  const [violations, setViolations] = useState<SecurityViolation[]>([]);

  // Bộ đếm thời gian khi đang scanning
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (state === "scanning") {
      setElapsed(0);
      timer = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state]);

  // Bắt đầu quy trình kiểm tra khi người dùng bấm nút
  const startAudit = async (e: React.MouseEvent) => {
    // 1. Chống bot: bắt buộc event.isTrusted phải là true (người thật click chuột/chạm tay)
    if (!e.isTrusted) {
      alert("Phát hiện thao tác tự động giả lập click!");
      return;
    }

    setState("scanning");

    const startTime = Date.now();
    let scan;
    try {
      scan = performSecurityAudit();
    } catch {
      scan = {
        passed: true,
        isEmulator: false,
        isAutomation: false,
        botScore: 0,
        violations: [],
        details: {
          ua: navigator.userAgent,
          platform: navigator.platform,
          webglRenderer: "",
          webglVendor: "",
          maxTouchPoints: navigator.maxTouchPoints || 0,
          screenRes: "",
          hasWebdriver: false,
        },
        timestamp: Date.now(),
      };
    }

    const elapsedMs = Date.now() - startTime;
    if (elapsedMs < 750) {
      await new Promise((r) => setTimeout(r, 750 - elapsedMs));
    }

    // Nếu phát hiện vi phạm cục bộ nghiêm trọng
    if (!scan.passed) {
      setViolations(scan.violations);
      setState("blocked");
      try {
        let vid = localStorage.getItem("moimoi_visitor_id") || "unknown";
        await fetch("/api/anti-bot/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scanResult: scan,
            visitorId: vid,
            deviceInput,
            deviceType,
            scope,
          }),
        });
      } catch {}
      return;
    }

    // Gửi báo cáo lên server để xác minh và nhận antiBotToken
    try {
      let vid = localStorage.getItem("moimoi_visitor_id") || "unknown";
      const res = await fetch("/api/anti-bot/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scanResult: scan,
          visitorId: vid,
          deviceInput,
          deviceType,
          scope,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.blocked) {
        setViolations(data.violations || scan.violations);
        setState("blocked");
        return;
      }

      if (data.ok && data.token) {
        setState("passed");
        onSuccess(data.token);
      } else {
        throw new Error(data.error || "Xác minh không thành công");
      }
    } catch (err: any) {
      if (onError) onError(err.message || "Lỗi kết nối máy chủ xác minh.");
      alert("Lỗi xác minh: " + (err.message || "Vui lòng thử lại."));
      setState("precheck");
    }
  };

  if (state === "passed") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(10, 15, 29, 0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: "var(--font-quicksand), system-ui, sans-serif",
      }}
    >
      {/* 1. PRE-CHECK MODAL (Chuẩn TrafficVN) */}
      {state === "precheck" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            color: "#1e293b",
            borderRadius: 16,
            width: "100%",
            maxWidth: 380,
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 4, background: "linear-gradient(90deg, #10b981, #059669)" }} />

          <div
            style={{
              padding: "16px 20px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: "#ecfdf5",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              <i className="fa-solid fa-shield-halved" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                Xác minh & Tự nhận diện máy
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
                Quét phần cứng bảo vệ phiên lấy Key
              </p>
            </div>
          </div>

          <div style={{ padding: "16px 20px" }}>
            <div
              style={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#166534",
              }}
            >
              <i className="fa-solid fa-circle-info" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                Bấm nút bên dưới để hệ thống quét phần cứng WebGL, nhận diện thiết bị và xác minh tính toàn vẹn.
              </div>
            </div>

            <div style={{ marginTop: 14, fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
              <i className="fa-solid fa-lock" style={{ marginRight: 5 }} />
              Ngăn chặn công cụ bot tự động và phần mềm giả lập trái phép.
            </div>
          </div>

          <div style={{ padding: "0 20px 20px" }}>
            <button
              type="button"
              onClick={startAudit}
              style={{
                width: "100%",
                height: 44,
                backgroundColor: "#059669",
                color: "#ffffff",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                transition: "all 0.15s ease",
              }}
            >
              <i className="fa-solid fa-microchip" />
              <span>XÁC MINH & TỰ NHẬN DIỆN MÁY</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. LOADING & SCANNING MODAL */}
      {state === "scanning" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            color: "#1e293b",
            borderRadius: 16,
            width: "100%",
            maxWidth: 320,
            padding: "28px 24px",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            border: "1px solid rgba(226, 232, 240, 0.9)",
          }}
        >
          <div style={{ fontSize: 36, color: "#059669", marginBottom: 16 }}>
            <i className="fa-solid fa-circle-notch fa-spin" />
          </div>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
            Đang xác minh...
          </h3>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: "#64748b" }}>
            Vui lòng chờ một chút trước khi bắt đầu nhé
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#059669",
              borderRadius: 99,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <i className="fa-regular fa-clock" />
            <span>{elapsed}s</span>
          </div>
        </div>
      )}

      {/* 3. HARD BLOCK OVERLAY (Khi phát hiện giả lập hoặc bot) */}
      {state === "blocked" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            color: "#1e293b",
            borderRadius: 16,
            width: "100%",
            maxWidth: 420,
            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            border: "1px solid #fecaca",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 4, backgroundColor: "#dc2626" }} />

          <div
            style={{
              padding: "16px 20px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid #fee2e2",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              <i className="fa-solid fa-shield-xmark" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#991b1b" }}>
                Truy cập bị từ chối
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#b91c1c" }}>
                Môi trường không đáp ứng yêu cầu bảo mật
              </p>
            </div>
          </div>

          <div style={{ padding: "16px 20px", maxHeight: 320, overflowY: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {violations.map((v, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: 10,
                    padding: "10px 12px",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    <i className="fa-solid fa-triangle-exclamation" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#991b1b" }}>{v.title}</div>
                    <div style={{ fontSize: 11.5, color: "#7f1d1d", marginTop: 2, lineHeight: 1.4 }}>
                      {v.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                backgroundColor: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 12,
                color: "#92400e",
                lineHeight: 1.5,
              }}
            >
              <i className="fa-solid fa-circle-info" style={{ marginRight: 6 }} />
              Vui lòng tắt các trình giả lập (Nox, LDPlayer, BlueStacks...), tắt công cụ tự động hóa hoặc mở trên điện thoại thật rồi tải lại trang.
            </div>
          </div>

          <div style={{ padding: "0 20px 20px" }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                width: "100%",
                height: 42,
                backgroundColor: "#dc2626",
                color: "#ffffff",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
              }}
            >
              <i className="fa-solid fa-rotate-right" />
              <span>Tải lại trang ngay</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
