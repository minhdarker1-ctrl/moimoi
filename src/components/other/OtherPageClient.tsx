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
    <div className="pro-other-wrapper">
      {/* Tab Switcher */}
      <div className="pro-segmented" role="tablist" aria-label="Chọn tiện ích">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "quiz"}
          onClick={() => setActiveTab("quiz")}
          className={`pro-seg-btn ${activeTab === "quiz" ? "active" : ""}`}
        >
          <i className="fa-solid fa-graduation-cap" />
          <span>Trắc Nghiệm Cơ Khí (335 câu)</span>
          <span className="pro-seg-badge">8 Chương</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "tools"}
          onClick={() => setActiveTab("tools")}
          className={`pro-seg-btn ${activeTab === "tools" ? "active" : ""}`}
        >
          <i className="fa-solid fa-toolbox" />
          <span>Kho Ứng Dụng &amp; Tiện Ích</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "quiz" ? (
        <QuizMaster />
      ) : (
        <div className="pro-other-tools-container">
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
