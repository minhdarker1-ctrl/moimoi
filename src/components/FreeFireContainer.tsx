"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FreeFireHub from "./FreeFireHub";
import FreeFireUnlockHub from "./FreeFireUnlockHub";
import type { FreeFireNoteData } from "./FreeFireAdminNote";

export default function FreeFireContainer({
  ffConfig,
}: {
  ffConfig?: (FreeFireNoteData & Record<string, unknown>) | null;
}) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "unlock" ? "unlock" : "sens";
  const [activeTab, setActiveTab] = useState<"sens" | "unlock">(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "unlock" || tabParam === "sens") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  function switchTab(tab: "sens" | "unlock") {
    setActiveTab(tab);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    } catch {}
  }

  return (
    <div className="mdarker-ff-wrapper">
      {/* THANH CHUYỂN TAB CHÍNH (SEGMENTED DUAL-TAB SWITCHER) */}
      <div className="mdarker-ff-tab-switcher" role="tablist" aria-label="Chuyển dịch vụ Free Fire">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "sens"}
          className={`mdarker-ff-tab-item ${activeTab === "sens" ? "active" : ""}`}
          onClick={() => switchTab("sens")}
        >
          <span className="tab-icon">🎯</span>
          <span className="tab-label">Độ Nhạy Kéo Tâm</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "unlock"}
          className={`mdarker-ff-tab-item ${activeTab === "unlock" ? "active" : ""}`}
          onClick={() => switchTab("unlock")}
        >
          <span className="tab-icon">⚡</span>
          <span className="tab-label">Unlock ID Whitelist</span>
          <span className="tab-badge-hot">HOT</span>
        </button>
      </div>

      {/* NỘI DUNG TỪNG PHÂN HỆ */}
      <div className="mdarker-ff-tab-content">
        {activeTab === "sens" ? (
          <FreeFireHub adminNote={ffConfig} />
        ) : (
          <FreeFireUnlockHub config={ffConfig} />
        )}
      </div>
    </div>
  );
}
