"use client";

import { useState, useMemo } from "react";
import AppCard, { AppData } from "./AppCard";
import CategoryMenu, { CategoryItem } from "./CategoryMenu";

export interface CatalogGroup {
  id: number;
  title: string;
  slug?: string;
  icon?: string;
  badge?: string;
  desc?: string;
  apps: AppData[];
}

interface AppCatalogProps {
  groups: CatalogGroup[];
}

function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function parsePlatforms(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default function AppCatalog({ groups }: AppCatalogProps) {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<"all" | "ios" | "android">("all");
  const [selectedGroupId, setSelectedGroupId] = useState<number | "all">("all");

  const normalizedSearch = useMemo(() => removeVietnameseTones(search), [search]);

  // Chuẩn bị danh sách categories cho CategoryMenu
  const categoryItems: CategoryItem[] = useMemo(() => {
    return groups.map((g) => ({
      id: g.id,
      title: g.title,
      slug: g.slug,
      icon: g.icon,
      badge: g.badge,
      desc: g.desc,
      appCount: g.apps.length,
    }));
  }, [groups]);

  // Lọc từng app theo điều kiện tìm kiếm, nền tảng và mảng đã chọn
  const filteredGroups = useMemo(() => {
    return groups
      .filter((g) => selectedGroupId === "all" || g.id === selectedGroupId)
      .map((g) => {
        const matchingApps = g.apps.filter((app) => {
          // Lọc theo nền tảng (iOS / Android)
          if (platform !== "all") {
            const platforms = parsePlatforms(app.platforms);
            if (!platforms.includes(platform)) return false;
          }

          // Lọc theo từ khóa tìm kiếm
          if (normalizedSearch) {
            const nameMatch = removeVietnameseTones(app.name).includes(normalizedSearch);
            const descMatch = removeVietnameseTones(app.desc || "").includes(normalizedSearch);
            if (!nameMatch && !descMatch) return false;
          }

          return true;
        });

        return {
          ...g,
          apps: matchingApps,
        };
      })
      .filter((g) => g.apps.length > 0);
  }, [groups, selectedGroupId, platform, normalizedSearch]);

  const totalResults = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.apps.length, 0);
  }, [filteredGroups]);

  const isFiltering = search !== "" || platform !== "all" || selectedGroupId !== "all";

  const clearFilters = () => {
    setSearch("");
    setPlatform("all");
    setSelectedGroupId("all");
  };

  const selectedCategory = useMemo(() => {
    if (selectedGroupId === "all") return null;
    return groups.find((g) => g.id === selectedGroupId) || null;
  }, [groups, selectedGroupId]);

  // Helper render icon cho header section
  const renderGroupIcon = (icon?: string) => {
    if (!icon) return <i className="fa-solid fa-gamepad" aria-hidden="true" />;
    if (icon.startsWith("http://") || icon.startsWith("https://")) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={icon} alt="" className="mdarker-group-icon-img" aria-hidden="true" />;
    }
    if (icon.startsWith("bi-")) return <i className={`bi ${icon}`} aria-hidden="true" />;
    return <i className={icon} aria-hidden="true" />;
  };

  return (
    <div className="mdarker-catalog-wrapper">
      {/* 
        1. MENU CÁC MẢNG CHUNG (Category Hub)
        Hiển thị danh sách các mảng (Free Fire, Liên Quân, App, Game Khác...)
      */}
      {groups.length > 0 && (
        <div className="mdarker-category-hub-container">
          <CategoryMenu
            categories={categoryItems}
            selectedId={selectedGroupId}
            onSelect={setSelectedGroupId}
          />
        </div>
      )}

      {/* 
        2. THANH CÔNG CỤ: TÌM KIẾM & LỌC NỀN TẢNG (iOS / Android)
      */}
      <div className="mdarker-catalog-bar">
        <div className="mdarker-search-box">
          <i className="bi bi-search mdarker-search-icon" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm mod, menu, file config..."
            className="mdarker-search-input"
            aria-label="Tìm kiếm nội dung"
          />
          {search && (
            <button
              type="button"
              className="mdarker-search-clear"
              onClick={() => setSearch("")}
              title="Xoá tìm kiếm"
            >
              <i className="bi bi-x-circle-fill" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Nút lọc nền tảng */}
        <div className="mdarker-filter-tabs">
          <button
            type="button"
            className={`mdarker-filter-btn ${platform === "all" ? "active" : ""}`}
            onClick={() => setPlatform("all")}
          >
            <i className="bi bi-grid-fill" aria-hidden="true" />
            <span>Tất cả</span>
          </button>
          <button
            type="button"
            className={`mdarker-filter-btn ${platform === "ios" ? "active" : ""}`}
            onClick={() => setPlatform("ios")}
          >
            <i className="fab fa-apple" aria-hidden="true" />
            <span>iOS</span>
          </button>
          <button
            type="button"
            className={`mdarker-filter-btn ${platform === "android" ? "active" : ""}`}
            onClick={() => setPlatform("android")}
          >
            <i className="bi bi-android2" aria-hidden="true" />
            <span>Android</span>
          </button>
        </div>
      </div>

      {/* Thông tin trạng thái khi đang lọc */}
      {isFiltering && (
        <div className="mdarker-filter-status">
          <span>
            {selectedCategory && (
              <span className="mdarker-status-badge">
                Mảng: <strong>{selectedCategory.title}</strong>
              </span>
            )}
            {" "}Tìm thấy <strong>{totalResults}</strong> mục phù hợp
          </span>
          <button type="button" onClick={clearFilters} className="mdarker-clear-btn">
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
            Đặt lại tất cả
          </button>
        </div>
      )}

      {/* 
        3. DANH SÁCH MỤC THEO MẢNG / LĨNH VỰC
      */}
      {filteredGroups.length > 0 ? (
        filteredGroups.map((g) => (
          <section
            key={g.id}
            id={`group-${g.slug || g.id}`}
            className="mdarker-group-section"
            aria-label={g.title}
          >
            {/* Tiêu đề mảng với Icon, Badge và Mô tả */}
            <div className="mdarker-section-header">
              <div className="mdarker-section-header-left">
                <span className="mdarker-section-icon">
                  {renderGroupIcon(g.icon)}
                </span>
                <div>
                  <h2 className="mdarker-section-title">
                    <span>{g.title}</span>
                    {g.badge && (
                      <span className={`mdarker-group-badge mdarker-badge-${g.badge.toLowerCase()}`}>
                        {g.badge}
                      </span>
                    )}
                    <span className="mdarker-group-count">{g.apps.length}</span>
                  </h2>
                  {g.desc && <p className="mdarker-section-desc">{g.desc}</p>}
                </div>
              </div>
            </div>

            {/* Lưới các thẻ card trong mảng */}
            <div className="mdarker-app-list">
              {g.apps.map((a) => (
                <AppCard key={a.id} app={a} />
              ))}
            </div>
          </section>
        ))
      ) : (
        /* Trạng thái không có sản phẩm hoặc không tìm thấy */
        <div className="mdarker-empty-search">
          <div className="mdarker-empty-icon">
            {search ? (
              <i className="bi bi-search" aria-hidden="true" />
            ) : (
              <i className="fa-solid fa-rocket mdarker-rocket-icon" aria-hidden="true" />
            )}
          </div>
          <h3 className="mdarker-empty-title">
            {search
              ? "Không tìm thấy kết quả"
              : "COMING SOON"}
          </h3>
          <p className="mdarker-empty-desc">
            {search
              ? `Không có kết quả nào khớp với từ khoá "${search}".`
              : selectedCategory
              ? `Mảng ${selectedCategory.title} đang được cập nhật sản phẩm mới. Hãy quay lại sau nhé!`
              : "Nội dung đang được chuẩn bị và sẽ sớm ra mắt!"}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="vt-btn-primary mdarker-empty-btn"
          >
            <i className="fa-solid fa-shapes" aria-hidden="true" />
            <span>Khám phá mục ALL</span>
          </button>
        </div>
      )}
    </div>
  );
}
