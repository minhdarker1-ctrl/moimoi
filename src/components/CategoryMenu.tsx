"use client";

import { useMemo } from "react";
import Link from "next/link";

export interface CategoryItem {
  id: number;
  title: string;
  slug?: string;
  icon?: string;
  badge?: string;
  desc?: string;
  appCount: number;
}

export function getGroupRoute(cat: { title: string; slug?: string; id?: number }) {
  if (cat.slug && cat.slug.trim()) {
    return `/${cat.slug.trim().replace(/^\//, "")}`;
  }
  const lower = cat.title.toLowerCase();
  if (lower.includes("free fire")) return "/freefire";
  if (lower.includes("liên quân") || lower.includes("lien quan")) return "/lienquan";
  if (lower.includes("other")) return "/other";
  return `/#group-${cat.id}`;
}

interface CategoryMenuProps {
  categories: CategoryItem[];
  selectedId: number | "all";
  onSelect?: (id: number | "all") => void;
  useLinks?: boolean;
}

export default function CategoryMenu({
  categories,
  selectedId,
  onSelect,
  useLinks = false,
}: CategoryMenuProps) {
  const totalApps = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.appCount, 0);
  }, [categories]);

  // Helper render icon
  const renderIcon = (icon?: string, defaultIcon = "bi-grid-fill") => {
    if (!icon) {
      return <i className={`bi ${defaultIcon} mdarker-cat-icon`} aria-hidden="true" />;
    }
    if (icon.startsWith("http://") || icon.startsWith("https://")) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={icon} alt="" className="mdarker-cat-icon-img" aria-hidden="true" />;
    }
    if (icon.startsWith("bi-")) {
      return <i className={`bi ${icon} mdarker-cat-icon`} aria-hidden="true" />;
    }
    return <i className={`${icon} mdarker-cat-icon`} aria-hidden="true" />;
  };

  const renderGroupContent = (cat: CategoryItem) => (
    <div className="mdarker-category-tab-inner">
      <span className="mdarker-cat-icon-wrap">
        {renderIcon(cat.icon, "fa-solid fa-gamepad")}
      </span>
      <span className="mdarker-cat-name">{cat.title}</span>
      {cat.badge && (
        <span className={`mdarker-cat-tag mdarker-tag-${cat.badge.toLowerCase()}`}>
          {cat.badge}
        </span>
      )}
      {cat.appCount > 0 ? (
        <span className="mdarker-cat-badge-count">{cat.appCount}</span>
      ) : cat.title.toLowerCase().includes("free fire") ? (
        <span className="mdarker-cat-badge-count mdarker-cat-tool">TOOL</span>
      ) : (
        <span className="mdarker-cat-badge-count mdarker-cat-soon">COMING SOON</span>
      )}
    </div>
  );

  const renderAllContent = () => (
    <div className="mdarker-category-tab-inner">
      <span className="mdarker-cat-icon-wrap">
        <i className="fa-solid fa-shapes mdarker-cat-icon" aria-hidden="true" />
      </span>
      <span className="mdarker-cat-name">ALL</span>
      <span className="mdarker-cat-badge-count">{totalApps}</span>
    </div>
  );

  return (
    <nav className="mdarker-category-menu" aria-label="Danh mục lĩnh vực">
      <div className="mdarker-category-scroll">
        {/* 1. DANH SÁCH CÁC MẢNG CỤ THỂ (Liên Quân, Free Fire, Other...) */}
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;
          const href = getGroupRoute(cat);

          if (useLinks) {
            return (
              <Link
                key={cat.id}
                href={href}
                className={`mdarker-category-tab ${isSelected ? "active" : ""}`}
                aria-current={isSelected ? "page" : undefined}
                style={{ textDecoration: "none" }}
              >
                {renderGroupContent(cat)}
              </Link>
            );
          }

          return (
            <button
              key={cat.id}
              type="button"
              className={`mdarker-category-tab ${isSelected ? "active" : ""}`}
              onClick={() => onSelect?.(cat.id)}
              aria-pressed={isSelected}
            >
              {renderGroupContent(cat)}
            </button>
          );
        })}

        {/* 2. NÚT XEM TẤT CẢ (ALL) - ĐẶT Ở VỊ TRÍ CUỐI CÙNG THEO YÊU CẦU */}
        {useLinks ? (
          <Link
            href="/all"
            className={`mdarker-category-tab ${selectedId === "all" ? "active" : ""}`}
            aria-current={selectedId === "all" ? "page" : undefined}
            style={{ textDecoration: "none" }}
          >
            {renderAllContent()}
          </Link>
        ) : (
          <button
            type="button"
            className={`mdarker-category-tab ${selectedId === "all" ? "active" : ""}`}
            onClick={() => onSelect?.("all")}
            aria-pressed={selectedId === "all"}
          >
            {renderAllContent()}
          </button>
        )}
      </div>
    </nav>
  );
}
