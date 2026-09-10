"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AntiBotOverlay from "@/components/AntiBotOverlay";

type InitState =
  | { status: "loading"; stepText: string }
  | { status: "redirecting"; url: string; appName: string; countdown: number }
  | { status: "error"; error: string };

export default function GetKeyFreeFirePage() {
  const [state, setState] = useState<InitState>({
    status: "loading",
    stepText: "Đang chờ xác minh bảo mật môi trường thiết bị...",
  });
  const [antiBotToken, setAntiBotToken] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState({ dev: "", dt: "", vid: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      let vid = urlParams.get("vid") || "";
      let dev = urlParams.get("device") || "";
      let dt = urlParams.get("type") || "";
      let botToken = urlParams.get("botToken") || "";
      try {
        if (!vid) vid = localStorage.getItem("moimoi_visitor_id") || "";
        if (!dev) dev = localStorage.getItem("ff_pending_device") || "";
        if (!dt) dt = localStorage.getItem("ff_pending_type") || "";
        if (!botToken) botToken = sessionStorage.getItem("ff_anti_bot_token") || "";
      } catch {}
      setDeviceInfo({ dev, dt, vid });

      if (botToken) {
        setAntiBotToken(botToken);
        startFlow(botToken);
      }
    }
  }, []);

  const startFlow = async (verifiedToken?: string) => {
    const tokenToUse = verifiedToken || antiBotToken || "";
    setState({ status: "loading", stepText: "Đang kết nối cổng lấy Key an toàn..." });
    try {
      let vid = deviceInfo.vid;
      let dev = deviceInfo.dev;
      let dt = deviceInfo.dt;
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        if (!vid) vid = urlParams.get("vid") || localStorage.getItem("moimoi_visitor_id") || "";
        if (!dev) dev = urlParams.get("device") || localStorage.getItem("ff_pending_device") || "";
        if (!dt) dt = urlParams.get("type") || localStorage.getItem("ff_pending_type") || "";
      }

      const q = new URLSearchParams({
        scope: "freefire",
        format: "json",
        vid,
        device: dev,
        type: dt,
        botToken: tokenToUse,
      });

      const res = await fetch(`/api/getkey/start?${q.toString()}`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();

      if (!res.ok || !data.ok || !data.url) {
        setState({
          status: "error",
          error: data.error || "Chưa cấu hình cổng lấy Key cho Free Fire. Vui lòng liên hệ Admin.",
        });
        return;
      }

      setState({
        status: "redirecting",
        url: data.url,
        appName: data.appName || "Độ Nhạy Free Fire",
        countdown: 2,
      });
    } catch {
      setState({
        status: "error",
        error: "Lỗi kết nối mạng hoặc máy chủ không phản hồi. Vui lòng thử lại.",
      });
    }
  };

  useEffect(() => {
    if (state.status !== "redirecting") return;

    if (state.countdown <= 0) {
      window.location.href = state.url;
      return;
    }

    const timer = setTimeout(() => {
      setState((prev) =>
        prev.status === "redirecting" ? { ...prev, countdown: prev.countdown - 1 } : prev,
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [state]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      {/* Lớp bảo mật Anti-Bot & Phát hiện giả lập */}
      {!antiBotToken && (
        <AntiBotOverlay
          scope="freefire"
          deviceInput={deviceInfo.dev}
          deviceType={deviceInfo.dt}
          onSuccess={(token) => {
            setAntiBotToken(token);
            startFlow(token);
          }}
          onError={(err) => {
            setState({ status: "error", error: err });
          }}
        />
      )}

      <div className="vt-key-card" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
        {state.status === "loading" && (
          <div>
            <div style={{ margin: "16px auto 20px" }}>
              <i
                className="fas fa-circle-notch fa-spin"
                style={{ fontSize: 44, color: "var(--vi-accent)" }}
              />
            </div>
            <h1 style={{ fontSize: 18, margin: "0 0 8px", fontWeight: 800 }}>
              Đang chuẩn bị Key Free Fire
            </h1>
            <p className="vt-hint" style={{ fontSize: 14 }}>
              {state.stepText}
            </p>
            <p style={{ fontSize: 12, color: "var(--vi-muted)", marginTop: 16 }}>
              Vui lòng không tắt hoặc tải lại trang này.
            </p>
          </div>
        )}

        {state.status === "redirecting" && (
          <div>
            <div style={{ margin: "14px auto 16px" }}>
              <i
                className="fas fa-shield-alt"
                style={{ fontSize: 44, color: "#22c55e" }}
              />
            </div>
            <h1 style={{ fontSize: 18, margin: "0 0 8px", fontWeight: 800 }}>
              Kết nối cổng thành công!
            </h1>
            <p className="vt-hint" style={{ fontSize: 14, margin: "0 0 16px" }}>
              Đang chuyển hướng tới cổng vượt link cho <strong>{state.appName}</strong> sau{" "}
              <span style={{ color: "var(--vi-accent)", fontWeight: 800 }}>{state.countdown}s</span>...
            </p>

            <a
              href={state.url}
              className="vt-btn-primary"
              style={{ width: "100%", boxSizing: "border-box" }}
            >
              <span>Chuyển tiếp ngay</span>
              <i className="fas fa-external-link-alt" />
            </a>
          </div>
        )}

        {state.status === "error" && (
          <div>
            <div style={{ margin: "14px auto 16px" }}>
              <i
                className="fas fa-exclamation-triangle"
                style={{ fontSize: 44, color: "#ef4444" }}
              />
            </div>
            <h1 style={{ fontSize: 18, margin: "0 0 8px", fontWeight: 800, color: "#ef4444" }}>
              Không thể khởi tạo link lấy Key
            </h1>
            <p className="vt-hint" style={{ fontSize: 14, margin: "0 0 20px" }}>
              {state.error}
            </p>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => startFlow()}
                className="vt-btn-primary"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-redo" />
                <span>Thử lại</span>
              </button>
              <Link href="/freefire" className="vt-btn-ghost">
                Về trang Free Fire
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
