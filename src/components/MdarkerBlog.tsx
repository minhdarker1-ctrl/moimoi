"use client";

import { useState, useMemo } from "react";

export interface BlogPostData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverUrl: string;
  category: string;
  tags: string;
  views: number;
  pinned: boolean;
  visible: boolean;
  order: number;
  createdAt: string;
}

interface MdarkerBlogProps {
  posts: BlogPostData[];
  authorName?: string;
  authorAvatar?: string;
}

function parseTags(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function MdarkerBlog({
  posts,
  authorName = "The Darker",
  authorAvatar = "https://i.ibb.co/jv75LbdS/6123108838828349044.jpg",
}: MdarkerBlogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePost, setActivePost] = useState<BlogPostData | null>(null);
  const [copied, setCopied] = useState(false);

  // Lấy danh sách các categories duy nhất
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return Array.from(set);
  }, [posts]);

  // Lọc bài viết theo category và từ khoá tìm kiếm
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSummary = p.summary.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchCategory) return false;
      }
      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

  const handleCopyLink = (slug: string) => {
    if (typeof window === "undefined") return;
    const url = window.location.origin + "/#blog-" + slug;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mdarker-blog-hub">
      {/* 1. PROFILE / ABOUT MDARKER HERO CARD */}
      <section className="mdarker-about-card" aria-label="Giới thiệu về The Darker">
        <div className="mdarker-about-glow" aria-hidden="true" />
        <div className="mdarker-about-header">
          <div className="mdarker-about-avatar-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={authorAvatar}
              alt={authorName}
              className="mdarker-about-avatar"
              width={70}
              height={70}
            />
            <span className="mdarker-about-badge-online" title="Đang hoạt động" />
          </div>
          <div className="mdarker-about-meta">
            <div className="mdarker-about-title-row">
              <h2 className="mdarker-about-title">{authorName}</h2>
              <span className="mdarker-about-tag-pro">MDARKER BLOG</span>
            </div>
            <p className="mdarker-about-sub">
              Developer • Mobile Modding • Game Performance Enthusiast
            </p>
          </div>
        </div>

        <p className="mdarker-about-bio">
          Chào mừng bạn đến với chuyên trang bài viết & blog chia sẻ của <strong>The Darker</strong>.
          Nơi tổng hợp các hướng dẫn cài đặt mod, tinh chỉnh độ nhạy game, mẹo tối ưu hệ thống
          iOS & Android và cập nhật những công cụ tiện ích mới nhất dành riêng cho cộng đồng.
        </p>

        {/* Kỹ năng & Chuyên môn */}
        <div className="mdarker-specialties">
          <span className="mdarker-spec-item">
            <i className="fab fa-apple" /> iOS Mod & IPA
          </span>
          <span className="mdarker-spec-item">
            <i className="fa-solid fa-crosshairs" /> Free Fire Sensitivity Pro
          </span>
          <span className="mdarker-spec-item">
            <i className="bi bi-android2" /> Android Tweaks & APK
          </span>
          <span className="mdarker-spec-item">
            <i className="fa-solid fa-shield-halved" /> Anti-Ban & An Toàn
          </span>
          <span className="mdarker-spec-item">
            <i className="fa-solid fa-bolt" /> 100% Tiện Ích Miễn Phí
          </span>
        </div>
      </section>

      {/* 2. THANH BỘ LỌC & TÌM KIẾM BÀI VIẾT */}
      <div className="mdarker-blog-toolbar">
        <div className="mdarker-blog-cats">
          <button
            type="button"
            className={"mdarker-blog-cat-btn " + (selectedCategory === "all" ? "active" : "")}
            onClick={() => setSelectedCategory("all")}
          >
            <i className="fa-solid fa-layer-group" /> Tất cả bài viết ({posts.length})
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={"mdarker-blog-cat-btn " + (selectedCategory === c ? "active" : "")}
              onClick={() => setSelectedCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mdarker-blog-search">
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Tìm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="mdarker-blog-search-clear"
              onClick={() => setSearchQuery("")}
            >
              <i className="bi bi-x" />
            </button>
          )}
        </div>
      </div>

      {/* 3. LƯỚI BÀI VIẾT BLOG */}
      {filteredPosts.length > 0 ? (
        <div className="mdarker-blog-grid">
          {filteredPosts.map((post) => {
            const tags = parseTags(post.tags);
            const readingTime = calculateReadingTime(post.content || post.summary);
            const dateFormatted = new Date(post.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            return (
              <article
                key={post.id}
                id={"blog-" + post.slug}
                className={"mdarker-blog-card " + (post.pinned ? "is-pinned" : "")}
                onClick={() => setActivePost(post)}
              >
                {/* Ảnh bìa */}
                {post.coverUrl ? (
                  <div className="mdarker-blog-cover-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverUrl}
                      alt={post.title}
                      className="mdarker-blog-cover"
                      loading="lazy"
                    />
                    <div className="mdarker-blog-badges">
                      {post.pinned && (
                        <span className="mdarker-badge-pinned">
                          <i className="fa-solid fa-thumbtack" /> Ghim
                        </span>
                      )}
                      <span className="mdarker-badge-cat">{post.category}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mdarker-blog-cover-placeholder">
                    <div className="mdarker-blog-badges">
                      {post.pinned && (
                        <span className="mdarker-badge-pinned">
                          <i className="fa-solid fa-thumbtack" /> Ghim
                        </span>
                      )}
                      <span className="mdarker-badge-cat">{post.category}</span>
                    </div>
                    <i className="fa-solid fa-newspaper" />
                  </div>
                )}

                {/* Nội dung tóm tắt */}
                <div className="mdarker-blog-body">
                  <div className="mdarker-blog-meta">
                    <span className="mdarker-blog-date">
                      <i className="bi bi-calendar3" /> {dateFormatted}
                    </span>
                    <span className="mdarker-blog-time">
                      <i className="bi bi-clock" /> {readingTime} phút đọc
                    </span>
                  </div>

                  <h3 className="mdarker-blog-title">{post.title}</h3>

                  <p className="mdarker-blog-excerpt">
                    {post.summary || post.content.slice(0, 140) + "..."}
                  </p>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="mdarker-blog-tags">
                      {tags.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="mdarker-blog-tag">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mdarker-blog-footer">
                    <span className="mdarker-blog-read-btn">
                      Đọc bài viết <i className="fa-solid fa-arrow-right" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mdarker-empty-search" style={{ marginTop: 24 }}>
          <div className="mdarker-empty-icon">
            <i className="bi bi-journal-text" />
          </div>
          <h3 className="mdarker-empty-title">Không tìm thấy bài viết nào</h3>
          <p className="mdarker-empty-desc">
            Không có bài viết nào khớp với từ khóa "{searchQuery}". Vui lòng thử tìm kiếm khác!
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="vt-btn-primary mdarker-empty-btn"
          >
            Xem tất cả bài viết
          </button>
        </div>
      )}

      {/* 4. MODAL XEM CHI TIẾT BÀI VIẾT (READING MODAL) */}
      {activePost && (
        <div
          className="mdarker-modal-backdrop"
          onClick={() => setActivePost(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="mdarker-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng */}
            <button
              type="button"
              className="mdarker-modal-close"
              onClick={() => setActivePost(null)}
              aria-label="Đóng"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            {/* Header bài viết */}
            {activePost.coverUrl && (
              <div className="mdarker-modal-cover-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePost.coverUrl}
                  alt={activePost.title}
                  className="mdarker-modal-cover"
                />
              </div>
            )}

            <div className="mdarker-modal-content">
              <div className="mdarker-modal-meta-top">
                <span className="mdarker-badge-cat">{activePost.category}</span>
                {activePost.pinned && (
                  <span className="mdarker-badge-pinned">
                    <i className="fa-solid fa-thumbtack" /> Bài viết ghim
                  </span>
                )}
                <span className="mdarker-modal-date">
                  {new Date(activePost.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
                <span className="mdarker-modal-reading">
                  • {calculateReadingTime(activePost.content)} phút đọc
                </span>
              </div>

              <h1 className="mdarker-modal-title">{activePost.title}</h1>

              {/* Tác giả */}
              <div className="mdarker-modal-author">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="mdarker-modal-author-avatar"
                  width={38}
                  height={38}
                />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <strong>{authorName}</strong>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/verify.svg" alt="Verified" width={16} height={16} />
                  </div>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>Tác giả & Quản trị viên</span>
                </div>
              </div>

              {/* Nội dung chi tiết */}
              <div className="mdarker-modal-body">
                {activePost.content.split("\n\n").map((paragraph, pIdx) => {
                  const trimmed = paragraph.trim();
                  if (trimmed.startsWith("## ")) {
                    return (
                      <h2 key={pIdx} className="mdarker-modal-h2">
                        {trimmed.replace(/^##\s+/, "")}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith("### ")) {
                    return (
                      <h3 key={pIdx} className="mdarker-modal-h3">
                        {trimmed.replace(/^###\s+/, "")}
                      </h3>
                    );
                  }
                  if (trimmed.startsWith("> ")) {
                    return (
                      <blockquote key={pIdx} className="mdarker-modal-quote">
                        {trimmed.replace(/^>\s+/, "")}
                      </blockquote>
                    );
                  }
                  if (trimmed.startsWith("- ")) {
                    const items = trimmed.split("\n").filter(Boolean);
                    return (
                      <ul key={pIdx} className="mdarker-modal-list">
                        {items.map((item, iIdx) => (
                          <li key={iIdx}>
                            {item.replace(/^-\s+/, "")}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={pIdx} className="mdarker-modal-p">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Tags */}
              {parseTags(activePost.tags).length > 0 && (
                <div className="mdarker-modal-tags">
                  <span style={{ fontSize: 13, opacity: 0.7, marginRight: 6 }}>Tags:</span>
                  {parseTags(activePost.tags).map((t, idx) => (
                    <span key={idx} className="mdarker-blog-tag">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Chân bài viết */}
              <div className="mdarker-modal-footer">
                <button
                  type="button"
                  onClick={() => handleCopyLink(activePost.slug)}
                  className="mdarker-modal-share-btn"
                >
                  <i className={copied ? "bi bi-check2" : "bi bi-link-45deg"} />
                  <span>{copied ? "Đã sao chép link!" : "Chia sẻ bài viết"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePost(null)}
                  className="vt-btn-primary"
                  style={{ padding: "8px 20px" }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
