import React from "react";
import Link from "next/link";

export interface FocusedFlowShellProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export default function FocusedFlowShell({
  title,
  subtitle,
  backHref = "/",
  backLabel = "Trang chủ",
  children,
  maxWidth = 460,
}: FocusedFlowShellProps) {
  return (
    <div className="pro-flow-shell">
      <div className="pro-flow-topbar">
        <Link href={backHref} className="pro-flow-back">
          <i className="fa-solid fa-arrow-left" aria-hidden="true" />
          <span>{backLabel}</span>
        </Link>
        <Link href="/" className="pro-flow-brand">
          <span className="vsc-brand-mark" aria-hidden="true">
            <i className="fa-solid fa-terminal" />
          </span>
          <span>MinSr</span>
        </Link>
      </div>

      <main className="pro-flow-main">
        <div className="pro-flow-card" style={{ maxWidth }}>
          {(title || subtitle) && (
            <div className="pro-flow-head">
              {title && <h1 className="pro-flow-title">{title}</h1>}
              {subtitle && <p className="pro-flow-subtitle">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
