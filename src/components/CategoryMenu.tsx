"use client";

import { useMemo } from "react";

export interface CategoryItem {
  id: number;
  title: string;
  slug?: string;
  icon?: string;
  badge?: string;
  desc?: string;
  appCount: number;
}

interface CategoryMenuProps {
  categories: CategoryItem[];
  selectedId: number | "all";
  onSelect: (id: number | "all") => void;
}

export default function CategoryMenu({
  categories,
  selectedId,
  onSelect,
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

  return (
    <nav className="mdarker-category-menu" aria-label="Danh mục lĩnh vực">
      <div className="mdarker-category-scroll">
        {/* Nút xem Tất Cả */}
        <button
          type="button"
          className={`mdarker-category-tab ${selectedId === "all" ? "active" : ""}`}
          onClick={() => onSelect("all")}
          aria-pressed={selectedId === "all"}
        >
          <div className="mdarker-category-tab-inner">
            <span className="mdarker-cat-icon-wrap">
              <i className="fa-solid fa-shapes mdarker-cat-icon" aria-hidden="true" />
            </span>
            <span className="mdarker-cat-name">ALL</span>
            <span className="mdarker-cat-badge-count">{totalApps}</span>
          </div>
        </button>

        {/* Danh sách các mảng cụ thể */}
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`mdarker-category-tab ${isSelected ? "active" : ""}`}
              onClick={() => onSelect(cat.id)}
              aria-pressed={isSelected}
            >
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
                <span className="mdarker-cat-badge-count">{cat.appCount}</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
