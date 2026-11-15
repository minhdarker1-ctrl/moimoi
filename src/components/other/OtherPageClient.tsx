"use client";

import { useState } from "react";
import QuizMaster from "@/components/quiz/QuizMaster";
import AppCatalog, { CatalogGroup } from "@/components/AppCatalog";

interface OtherPageClientProps {
  groups: CatalogGroup[];
  otherGroupId: number;
}

export default function OtherPageClient({ groups, otherGroupId }: OtherPageClientProps) {
  const [activeTab, setActiveTab] = useState<"quiz" | "tools">("quiz");

  return (
    <div className="cyber-other-wrapper">
      {/* Tab Switcher */}
      <div className="cyber-other-tabs-bar" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "quiz"}
          onClick={() => setActiveTab("quiz")}
          className={`cyber-other-tab-btn ${activeTab === "quiz" ? "active" : ""}`}
        >
          <i className="fa-solid fa-graduation-cap" />
          <span>Trắc Nghiệm Cơ Khí (125 câu)</span>
          <span className="cyber-tab-pill">+60 câu Đúc</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "tools"}
          onClick={() => setActiveTab("tools")}
          className={`cyber-other-tab-btn ${activeTab === "tools" ? "active" : ""}`}
        >
          <i className="fa-solid fa-toolbox" />
          <span>Kho Ứng Dụng &amp; Tiện Ích Khác</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "quiz" ? (
        <QuizMaster />
      ) : (
        <div className="cyber-other-tools-container">
          <AppCatalog
            groups={groups}
            defaultGroupId={otherGroupId}
            hideCategoryMenu={true}
          />
        </div>
      )}
    </div>
  );
}
