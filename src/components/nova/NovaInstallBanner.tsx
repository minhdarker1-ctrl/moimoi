"use client";

import { useEffect, useState } from "react";
import { Smartphone, Download, X } from "lucide-react";

export default function NovaInstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Kiểm tra xem đã tắt banner chưa
    const dismissed = localStorage.getItem("nova_pwa_dismissed");
    if (dismissed) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Kiểm tra iOS Safari nếu chưa cài đặt vào màn hình chính
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isStandalone = ("standalone" in window.navigator) && (window.navigator as any).standalone;
    if (isIos && !isStandalone) {
      setShow(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShow(false);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        "Hướng dẫn iOS Safari: Bấm vào biểu tượng Chia sẻ (Share 📤) ở thanh công cụ trình duyệt, sau đó chọn 'Thêm vào Màn hình chính' (Add to Home Screen) để cài app!"
      );
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("nova_pwa_dismissed", "1");
  };

  if (!show) return null;

  return (
    <div className="nova-install-banner">
      <div className="nova-install-icon">
        <Smartphone size={24} className="text-purple-400" />
      </div>

      <div className="nova-install-body">
        <div className="nova-install-title">📱 Bạn chưa cài đặt App The Darker?</div>
        <div className="nova-install-desc">
          Thêm vào màn hình chính để trải nghiệm mượt mà, truy cập nhanh 1 chạm và không bị gián đoạn.
        </div>
      </div>

      <div className="nova-install-actions">
        <button
          type="button"
          onClick={handleInstall}
          className="nova-install-btn"
        >
          <Download size={14} />
          <span>Cài Đặt</span>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="nova-install-close"
          aria-label="Đóng"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
