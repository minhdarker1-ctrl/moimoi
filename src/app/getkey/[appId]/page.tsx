"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

type InitState =
  | { status: "loading"; stepText: string }
  | { status: "redirecting"; url: string; appName: string; countdown: number }
  | { status: "error"; error: string };

export default function GetKeyLoadingPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = use(params);
  const [state, setState] = useState<InitState>({
    status: "loading",
    stepText: "Đang khởi tạo phiên làm việc...",
  });

  const startFlow = async () => {
    setState({ status: "loading", stepText: "Đang kết nối cổng vượt link an toàn..." });
    try {
      const res = await fetch(`/api/getkey/start?appId=${appId}&format=json`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();

      if (!res.ok || !data.ok || !data.url) {
        setState({
          status: "error",
          error: data.error || "Không thể tạo link vượt vào lúc này.",
        });
        return;
      }

      setState({
        status: "redirecting",
        url: data.url,
        appName: data.appName || "Ứng dụng",
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
    startFlow();
  }, [appId]);

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
              Đang chuẩn bị Get Key
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
              Không thể khởi tạo link
            </h1>
            <p className="vt-hint" style={{ fontSize: 14, margin: "0 0 20px" }}>
              {state.error}
            </p>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                type="button"
                onClick={startFlow}
                className="vt-btn-primary"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-redo" />
                <span>Thử lại</span>
              </button>
              <Link href="/" className="vt-btn-ghost">
                Về trang chính
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
