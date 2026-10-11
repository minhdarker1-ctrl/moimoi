/**
 * mDarker Free Fire Helper - Content Script
 * Cầu nối giao tiếp 2 chiều giữa trang web mDarker và Chrome Extension Background Service Worker
 */

(function () {
  console.log("[mDarker Extension] Content Script đã sẵn sàng.");

  const EXTENSION_VERSION = "1.0.0";

  // 1. Gửi thông điệp chào hỏi đến trang web khi script load xong
  function announcePresence() {
    window.postMessage(
      {
        type: "MINSR_PONG_EXTENSION",
        version: EXTENSION_VERSION,
        source: "mdarker_extension",
      },
      "*"
    );
  }

  announcePresence();
  setTimeout(announcePresence, 500);

  // 2. Lắng nghe các yêu cầu từ Web mDarker (window.postMessage)
  window.addEventListener("message", (event) => {
    // Chỉ xử lý các thông điệp có type hợp lệ
    if (!event.data || typeof event.data !== "object") return;

    // A. Web kiểm tra xem extension có online không
    if (event.data.type === "MINSR_PING_EXTENSION") {
      announcePresence();
      return;
    }

    // B. Web gửi yêu cầu Unlock ID
    if (event.data.type === "MINSR_FF_UNLOCK_REQUEST") {
      const { jobId, uid, server, serverLabel } = event.data;
      console.log("[mDarker Extension] Nhận yêu cầu Unlock ID:", {
        jobId,
        uid,
        server,
      });

      // Chuyển tiếp tới Background Service Worker để xử lý
      chrome.runtime.sendMessage(
        {
          action: "PROCESS_UNLOCK_TASK",
          jobId,
          uid,
          server,
          serverLabel,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.warn(
              "[mDarker Extension] Lỗi gửi tới background:",
              chrome.runtime.lastError.message
            );
            return;
          }

          if (response && response.success) {
            console.log("[mDarker Extension] Background hoàn thành task:", response);
            // Gửi kết quả ngược lại cho Web mDarker
            window.postMessage(
              {
                type: "MINSR_FF_UNLOCK_RESULT",
                jobId,
                uid,
                server,
                serverLabel,
                success: true,
                message:
                  response.message ||
                  "Extension Helper đã đồng bộ UID vào máy chủ Free Fire thành công!",
              },
              "*"
            );
          } else {
            window.postMessage(
              {
                type: "MINSR_FF_UNLOCK_RESULT",
                jobId,
                uid,
                success: false,
                error: response?.error || "Không thể đồng bộ qua Extension.",
              },
              "*"
            );
          }
        }
      );
    }
  });

  // 3. Lắng nghe thông báo đẩy từ Background (ví dụ khi background worker xử lý xong task)
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "TASK_COMPLETED_BROADCAST") {
      window.postMessage(
        {
          type: "MINSR_FF_UNLOCK_RESULT",
          ...request.payload,
        },
        "*"
      );
      sendResponse({ received: true });
    }
    return true;
  });
})();
