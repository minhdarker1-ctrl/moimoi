"use client";

import { useState, useMemo } from "react";
import AppCard, { AppData } from "./AppCard";

export interface CatalogGroup {
  id: number;
  title: string;
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

  // Lọc từng app theo điều kiện tìm kiếm và nền tảng
  const filteredGroups = useMemo(() => {
    return groups
      .filter((g) => selectedGroupId === "all" || g.id === selectedGroupId)
      .map((g) => {
        const matchingApps = g.apps.filter((app) => {
          // Lọc theo nền tảng
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

  return (
    <div className="vthangios-catalog-wrapper">
      {/* Thanh công cụ tìm kiếm và lọc */}
      <div className="vthangios-catalog-bar">
        {/* Ô tìm kiếm tức thì */}
        <div className="vthangios-search-box">
          <i className="bi bi-search vthangios-search-icon" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm ứng dụng, game..."
            className="vthangios-search-input"
            aria-label="Tìm kiếm ứng dụng"
          />
          {search && (
            <button
              type="button"
              className="vthangios-search-clear"
              onClick={() => setSearch("")}
              title="Xoá tìm kiếm"
            >
              <i className="bi bi-x-circle-fill" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Cụm nút lọc nền tảng */}
        <div className="vthangios-filter-tabs">
          <button
            type="button"
            className={`vthangios-filter-btn ${platform === "all" ? "active" : ""}`}
            onClick={() => setPlatform("all")}
          >
            <i className="bi bi-grid-fill" aria-hidden="true" />
            <span>Tất cả</span>
          </button>
          <button
            type="button"
            className={`vthangios-filter-btn ${platform === "ios" ? "active" : ""}`}
            onClick={() => setPlatform("ios")}
          >
            <i className="fab fa-apple" aria-hidden="true" />
            <span>iOS</span>
          </button>
          <button
            type="button"
            className={`vthangios-filter-btn ${platform === "android" ? "active" : ""}`}
            onClick={() => setPlatform("android")}
          >
            <i className="bi bi-android2" aria-hidden="true" />
            <span>Android</span>
          </button>
        </div>
      </div>

      {/* Danh sách tab danh mục nếu có nhiều nhóm */}
      {groups.length > 1 && (
        <div className="vthangios-group-pills">
          <button
            type="button"
            className={`vthangios-pill ${selectedGroupId === "all" ? "active" : ""}`}
            onClick={() => setSelectedGroupId("all")}
          >
            Tất cả danh mục
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`vthangios-pill ${selectedGroupId === g.id ? "active" : ""}`}
              onClick={() => setSelectedGroupId(g.id)}
            >
              {g.title} ({g.apps.length})
            </button>
          ))}
        </div>
      )}

      {/* Thông tin kết quả tìm kiếm khi đang lọc */}
      {isFiltering && (
        <div className="vthangios-filter-status">
          <span>
            Tìm thấy <strong>{totalResults}</strong> ứng dụng phù hợp
          </span>
          <button type="button" onClick={clearFilters} className="vthangios-clear-btn">
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {/* Danh sách ứng dụng theo nhóm */}
      {filteredGroups.length > 0 ? (
        filteredGroups.map((g) => (
          <section key={g.id} id={`group-${g.id}`} className="vthangios-group-section" aria-label={g.title}>
            <h2 className="vthangios-section-title">
              <span>{g.title}</span>
              <span className="vthangios-group-count">{g.apps.length}</span>
            </h2>
            <div className="vthangios-app-list">
              {g.apps.map((a) => (
                <AppCard key={a.id} app={a} />
              ))}
            </div>
          </section>
        ))
      ) : (
        /* Trạng thái không tìm thấy kết quả */
        <div className="vthangios-empty-search">
          <div className="vthangios-empty-icon">
            <i className="bi bi-inbox" aria-hidden="true" />
          </div>
          <h3>Không tìm thấy ứng dụng</h3>
          <p>Không có kết quả nào khớp với từ khoá hoặc bộ lọc của bạn.</p>
          <button type="button" onClick={clearFilters} className="vt-btn-primary">
            Xoá bộ lọc & Xem tất cả
          </button>
        </div>
      )}
    </div>
  );
}
