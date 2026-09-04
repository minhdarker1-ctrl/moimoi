"use client";

import { useEffect, useRef, useState } from "react";

export default function PreviewLightbox({
  images,
  title,
  children,
}: {
  images: string[];
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);

  // <dialog> lo focus trap + Esc sẵn, chỉ cần thêm điều hướng bằng mũi tên.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.open || images.length < 2) return;
      if (e.key === "ArrowRight") setI((v) => (v + 1) % images.length);
      if (e.key === "ArrowLeft") setI((v) => (v - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  if (images.length === 0) return <>{children}</>;

  return (
    <>
      <button
        type="button"
        className="mdarker-app-banner"
        onClick={() => {
          setI(0);
          ref.current?.showModal();
        }}
        aria-label={`Xem ảnh ${title}`}
      >
        {children}
      </button>

      <dialog ref={ref} className="vt-lightbox" onClick={(e) => e.target === ref.current && ref.current?.close()}>
        <div className="vt-lightbox-top">
          <span>{title}</span>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Đóng">
            <i className="fas fa-xmark" aria-hidden="true" />
          </button>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- URL ảnh do admin dán, host bất kỳ */}
        <img src={images[i]} alt={`${title} — ảnh ${i + 1}`} />

        {images.length > 1 && (
          <div className="vt-lightbox-nav">
            <button
              type="button"
              onClick={() => setI((v) => (v - 1 + images.length) % images.length)}
              aria-label="Ảnh trước"
            >
              <i className="fas fa-arrow-left" aria-hidden="true" />
            </button>
            <div className="vt-dots">
              {images.map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  className="vt-dot"
                  aria-current={idx === i}
                  aria-label={`Ảnh ${idx + 1}`}
                  onClick={() => setI(idx)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setI((v) => (v + 1) % images.length)}
              aria-label="Ảnh sau"
            >
              <i className="fas fa-arrow-right" aria-hidden="true" />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
