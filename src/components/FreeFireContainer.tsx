"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Crosshair, Zap } from "lucide-react";
import PageHeader from "./PageHeader";
import FreeFireHub from "./FreeFireHub";
import FreeFireUnlockHub from "./FreeFireUnlockHub";
import type { FreeFireNoteData } from "./FreeFireAdminNote";

export default function FreeFireContainer({
  ffConfig,
}: {
  ffConfig?: (FreeFireNoteData & Record<string, unknown>) | null;
}) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || searchParams.get("mode");
  const serverParam = searchParams.get("server") || searchParams.get("port");
  const ontopParam = searchParams.get("ontop");
  const uidParam = searchParams.get("uid");

  const initialUnlock = Boolean(
    tabParam === "unlock" ||
      serverParam === "kipas" ||
      serverParam === "astute" ||
      ontopParam ||
      uidParam
  );

  const [activeMode, setActiveMode] = useState<"sens" | "unlock">(
    initialUnlock ? "unlock" : "sens"
  );

  const [selectedServer, setSelectedServer] = useState<"kipas" | "astute">(
    serverParam === "astute" ? "astute" : "kipas"
  );

  useEffect(() => {
    const p = searchParams.get("tab") || searchParams.get("mode");
    const s = searchParams.get("server") || searchParams.get("port");
    const o = searchParams.get("ontop");
    const u = searchParams.get("uid");

    if (s === "kipas" || s === "astute") {
      setSelectedServer(s);
      setActiveMode("unlock");
    } else if (p === "unlock" || o || u) {
      setActiveMode("unlock");
    } else if (p === "sens") {
      setActiveMode("sens");
    }
  }, [searchParams]);

  function selectTool(mode: "sens" | "unlock", serverChoice?: "kipas" | "astute") {
    setActiveMode(mode);
    if (serverChoice) {
      setSelectedServer(serverChoice);
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", mode);
      url.searchParams.delete("mode");
      if (serverChoice) {
        url.searchParams.set("server", serverChoice);
      } else if (mode === "sens") {
        url.searchParams.delete("server");
        url.searchParams.delete("port");
      }
      window.history.replaceState({}, "", url.toString());
    } catch {}
  }

  return (
    <div className="mdarker-ff-wrapper">
      <PageHeader
        badge="Free Fire Pro Suite"
        title="Độ nhạy & Unlock ID Whitelist"
        description="Tra cứu thông số kéo tâm chuẩn theo từng dòng máy hoặc kích hoạt Whitelist UID trực tiếp qua cổng FF Kipas & Astute."
        rightSlot={
          <div className="pro-segmented" role="tablist" aria-label="Chuyển đổi công cụ Free Fire">
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === "sens"}
              onClick={() => selectTool("sens")}
              className={`pro-seg-btn ${activeMode === "sens" ? "active" : ""}`}
            >
              <Crosshair size={15} />
              <span>Độ nhạy &amp; Mã HUD</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === "unlock"}
              onClick={() => selectTool("unlock")}
              className={`pro-seg-btn ${activeMode === "unlock" ? "active" : ""}`}
            >
              <Zap size={15} />
              <span>Unlock ID Whitelist</span>
            </button>
          </div>
        }
      />

      {activeMode === "sens" ? (
        <FreeFireHub adminNote={ffConfig} />
      ) : (
        <FreeFireUnlockHub
          config={ffConfig}
          initialServer={selectedServer}
          onBack={() => selectTool("sens")}
        />
      )}
    </div>
  );
}
