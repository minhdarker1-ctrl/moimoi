"use client";

import { useState, useEffect } from "react";
import { performSecurityAudit, SecurityViolation } from "@/lib/anti-bot-engine";
import { detectAccurateDevice } from "@/lib/device-detector";

interface AntiBotOverlayProps {
  scope?: string;
  deviceInput?: string;
  deviceType?: string;
  onSuccess: (antiBotToken: string, detectedDevice?: string) => void;
  onError?: (err: string) => void;
  onClose?: () => void;
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
  onClose,
}: AntiBotOverlayProps) {
  const [state, setState] = useState<StepState>("precheck");
  const [elapsed, setElapsed] = useState(0);
  const [violations, setViolations] = useState<SecurityViolation[]>([]);

  // ĐẶC QUYỀN ADMIN: Tự động phát hiện và bypass tức thì
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.role === "ADMIN") {
          onSuccess("admin-bypass-token", deviceInput);
        }
      })
      .catch(() => {});
  }, [onSuccess, deviceInput]);

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
    let detectedName = deviceInput;
    let detectedType = deviceType;

    try {
      const [auditRes, devRes] = await Promise.all([
        Promise.resolve(performSecurityAudit()),
        detectAccurateDevice().catch(() => null),
      ]);
      scan = auditRes;
      if (devRes && devRes.deviceName) {
        detectedName = devRes.deviceName;
        detectedType = devRes.deviceType;
      }
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
            deviceInput: detectedName || deviceInput,
            deviceType: detectedType || deviceType,
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
          deviceInput: detectedName || deviceInput,
          deviceType: detectedType || deviceType,
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
        try {
          sessionStorage.setItem("ff_anti_bot_token", data.token);
          if (detectedName) {
            sessionStorage.setItem("ff_verified_device", detectedName);
          }
        } catch {}
        onSuccess(data.token, detectedName);
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
      {/* 1. PRE-CHECK MODAL (VS Code Dark+) */}
      {state === "precheck" && (
        <div
          style={{
            backgroundColor: "#252526",
            color: "#cccccc",
            borderRadius: 10,
            width: "100%",
            maxWidth: 380,
            boxShadow: "0 16px 36px rgba(0,0,0,0.45)",
            border: "1px solid #3c3c3c",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 3, backgroundColor: "#007acc" }} />

          <div
            style={{
              padding: "16px 20px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              borderBottom: "1px solid #3c3c3c",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: "rgba(0, 122, 204, 0.16)",
                  border: "1px solid rgba(0, 122, 204, 0.35)",
                  color: "#4ec9b0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                <i className="fa-solid fa-shield-halved" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: "#ffffff" }}>
                  Xác minh thiết bị
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9d9d9d" }}>
                  Chỉ mất 1-2 giây để tự nhận diện & bảo vệ phiên lấy Key
                </p>
              </div>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9d9d9d",
                  fontSize: 18,
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: 6,
                }}
                title="Đóng cửa sổ"
                aria-label="Đóng"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>

          <div style={{ padding: "16px 20px" }}>
            <div
              style={{
                backgroundColor: "#1e1e1e",
                border: "1px solid #3c3c3c",
                borderRadius: 8,
                padding: "12px 14px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#cccccc",
              }}
            >
              <i className="fa-solid fa-circle-info" style={{ marginTop: 2, flexShrink: 0, color: "#007acc" }} />
              <div>
                Nhấn nút bên dưới để hệ thống quét phần cứng WebGL, tự nhận diện thiết bị và xác minh tính toàn vẹn.
              </div>
            </div>

            <div style={{ marginTop: 14, fontSize: 11.5, color: "#9d9d9d", lineHeight: 1.5 }}>
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
                height: 42,
                backgroundColor: "#007acc",
                color: "#ffffff",
                border: "1px solid #0e639c",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <i className="fa-solid fa-play" />
              <span>Xác minh ngay</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. LOADING & SCANNING MODAL */}
      {state === "scanning" && (
        <div
          style={{
            backgroundColor: "#252526",
            color: "#cccccc",
            borderRadius: 10,
            width: "100%",
            maxWidth: 320,
            padding: "28px 24px",
            textAlign: "center",
            boxShadow: "0 16px 36px rgba(0,0,0,0.45)",
            border: "1px solid #3c3c3c",
          }}
        >
          <div style={{ fontSize: 34, color: "#007acc", marginBottom: 16 }}>
            <i className="fa-solid fa-circle-notch fa-spin" />
          </div>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
            Đang xác minh...
          </h3>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: "#9d9d9d" }}>
            Vui lòng chờ một chút trước khi bắt đầu nhé
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#1e1e1e",
              border: "1px solid #3c3c3c",
              color: "#4ec9b0",
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
            backgroundColor: "#252526",
            color: "#cccccc",
            borderRadius: 10,
            width: "100%",
            maxWidth: 420,
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            border: "1px solid #5a1d1d",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 3, backgroundColor: "#f44747" }} />

          <div
            style={{
              padding: "16px 20px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid #3c3c3c",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 8,
                backgroundColor: "rgba(244, 71, 71, 0.14)",
                border: "1px solid rgba(244, 71, 71, 0.35)",
                color: "#f44747",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              <i className="fa-solid fa-shield-xmark" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#f48771" }}>
                Truy cập bị từ chối
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9d9d9d" }}>
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
                    backgroundColor: "#1e1e1e",
                    border: "1px solid rgba(244, 71, 71, 0.3)",
                    borderRadius: 8,
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
                      backgroundColor: "rgba(244, 71, 71, 0.14)",
                      color: "#f44747",
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
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f48771" }}>{v.title}</div>
                    <div style={{ fontSize: 11.5, color: "#cccccc", marginTop: 2, lineHeight: 1.4 }}>
                      {v.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                backgroundColor: "#1e1e1e",
                border: "1px solid rgba(204, 167, 0, 0.35)",
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 12,
                color: "#dcdcaa",
                lineHeight: 1.5,
              }}
            >
              <i className="fa-solid fa-circle-info" style={{ marginRight: 6 }} />
              Vui lòng tắt các trình giả lập (Nox, LDPlayer, BlueStacks...), tắt công cụ tự động hóa hoặc mở trên điện thoại thật rồi tải lại trang.
            </div>
          </div>

          <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                flex: 1,
                height: 40,
                backgroundColor: "#c53030",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <i className="fa-solid fa-rotate-right" />
              <span>Tải lại trang</span>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  height: 40,
                  padding: "0 16px",
                  backgroundColor: "#2d2d2d",
                  color: "#cccccc",
                  border: "1px solid #3c3c3c",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
