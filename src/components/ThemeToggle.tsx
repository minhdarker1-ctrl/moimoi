"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("vt-theme", next ? "dark" : "light");
    } catch {
      // localStorage bị chặn (private mode) — theme vẫn đổi, chỉ không nhớ.
    }
  }

  return (
    <button
      type="button"
      className="mdarker-theme-btn"
      onClick={toggle}
      aria-label={dark ? "Chuyển chế độ sáng" : "Chuyển chế độ tối"}
      title={dark ? "Chế độ sáng" : "Chế độ tối"}
    >
      <i className={dark ? "bi bi-moon-stars-fill" : "bi bi-sun-fill"} aria-hidden="true" />
    </button>
  );
}
