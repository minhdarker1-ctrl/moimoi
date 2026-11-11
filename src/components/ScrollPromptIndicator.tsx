"use client";

interface ScrollPromptIndicatorProps {
  targetId?: string;
  label?: string;
}

export default function ScrollPromptIndicator({
  targetId = "detailed-services",
  label = "KÉO LÊN ĐỂ XEM CHI TIẾT",
}: ScrollPromptIndicatorProps) {
  function handleScrollDown() {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({
        top: window.innerHeight * 0.9,
        behavior: "smooth",
      });
    }
  }

  return (
    <button
      type="button"
      onClick={handleScrollDown}
      className="cyber-scroll-prompt"
      aria-label={`${label} - Bấm để cuộn xuống`}
    >
      <div className="cyber-scroll-mouse" aria-hidden="true">
        <div className="cyber-scroll-wheel" />
      </div>

      <span className="cyber-scroll-label">
        <span>{label}</span>
        <i className="fas fa-chevron-down cyber-scroll-arrow" aria-hidden="true" />
      </span>
    </button>
  );
}
