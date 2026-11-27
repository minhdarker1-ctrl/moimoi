"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FocusedFlowShell from "@/components/FocusedFlowShell";

export type HopViewProps =
  | {
      type: "success";
      nextUrl: string;
      step: number;
      totalSteps: number;
      appName: string;
    }
  | {
      type: "too_fast";
      remainingSeconds: number;
      step: number;
      totalSteps: number;
      appName: string;
    }
  | {
      type: "error";
      message: string;
    };

export default function HopClient(props: HopViewProps) {
  const [countdown, setCountdown] = useState(
    props.type === "success" ? 2 : props.type === "too_fast" ? props.remainingSeconds : 0,
  );

  useEffect(() => {
    if (props.type === "success") {
      if (countdown <= 0) {
        window.location.href = props.nextUrl;
        return;
      }
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }

    if (props.type === "too_fast") {
      if (countdown <= 0) {
        window.location.reload();
        return;
      }
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [props, countdown]);

  return (
    <FocusedFlowShell maxWidth={480}>
      <div style={{ textAlign: "center", position: "relative" }}>
        {props.type === "success" && (
          <div>
            <div style={{ margin: "6px auto 14px" }}>
              <i className="fas fa-check-circle" style={{ fontSize: 42, color: "#4ec9b0" }} />
            </div>

            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                background: "rgba(78, 201, 176, 0.14)",
                color: "#4ec9b0",
                border: "1px solid rgba(78, 201, 176, 0.3)",
                marginBottom: 10,
              }}
            >
              Bước {props.step} / {props.totalSteps} hoàn thành
            </span>

            <h1 style={{ fontSize: 18, margin: "0 0 8px", fontWeight: 700, color: "#ffffff" }}>
              Xác thực cổng thành công!
            </h1>

            {/* Thanh tiến trình */}
            <div
              style={{
                width: "100%",
                height: 6,
                background: "#333333",
                borderRadius: 4,
                overflow: "hidden",
                margin: "14px 0",
              }}
            >
              <div
                style={{
                  width: `${(props.step / props.totalSteps) * 100}%`,
                  height: "100%",
                  background: "#007acc",
                  borderRadius: 4,
                  transition: "width 0.4s ease",
                }}
              />
            </div>

            <p className="vt-hint" style={{ fontSize: 13.5, margin: "0 0 16px" }}>
              Đang chuyển hướng tới bước tiếp theo sau{" "}
              <strong style={{ color: "#3794ff" }}>{countdown}s</strong>...
            </p>

            <a
              href={props.nextUrl}
              className="pro-btn-primary"
              style={{ width: "100%", boxSizing: "border-box" }}
            >
              <span>Tiếp tục ngay</span>
              <i className="fas fa-arrow-right" />
            </a>
          </div>
        )}

        {props.type === "too_fast" && (
          <div>
            <div style={{ margin: "6px auto 14px" }}>
              <i className="fas fa-stopwatch" style={{ fontSize: 42, color: "#eab308" }} />
            </div>

            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                background: "rgba(234, 179, 8, 0.14)",
                color: "#eab308",
                border: "1px solid rgba(234, 179, 8, 0.3)",
                marginBottom: 10,
              }}
            >
              Cần chờ {countdown} giây
            </span>

            <h1 style={{ fontSize: 18, margin: "0 0 8px", fontWeight: 700, color: "#ffffff" }}>
              Thao tác quá nhanh!
            </h1>

            <p className="vt-hint" style={{ fontSize: 13.5, margin: "0 0 16px", lineHeight: 1.6 }}>
              Hệ thống chống gian lận yêu cầu thời gian xác minh. Vui lòng đợi{" "}
              <strong style={{ color: "#eab308" }}>{countdown}s</strong>, trang sẽ tự động tiếp tục.
            </p>

            {countdown <= 0 ? (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="pro-btn-primary"
                style={{ width: "100%", cursor: "pointer" }}
              >
                <span>Xác nhận &amp; Đi tiếp</span>
                <i className="fas fa-arrow-right" />
              </button>
            ) : (
              <div style={{ fontSize: 13, color: "#9d9d9d" }}>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: 6 }} />
                Đang đếm ngược...
              </div>
            )}
          </div>
        )}

        {props.type === "error" && (
          <div>
            <div style={{ margin: "6px auto 14px" }}>
              <i className="fas fa-exclamation-circle" style={{ fontSize: 42, color: "#f48771" }} />
            </div>

            <h1 style={{ fontSize: 18, margin: "0 0 8px", fontWeight: 700, color: "#f48771" }}>
              Không thể tiếp tục
            </h1>

            <p className="vt-hint" style={{ fontSize: 13.5, margin: "0 0 20px" }}>
              {props.message}
            </p>

            <div className="vt-actions" style={{ justifyContent: "center" }}>
              <Link href="/" className="pro-btn-primary">
                Về trang chính
              </Link>
            </div>
          </div>
        )}
      </div>
    </FocusedFlowShell>
  );
}
