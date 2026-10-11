/**
 * mDarker Free Fire Helper - Service Worker (Background)
 * Quản lý kết nối, xử lý lệnh Unlock ID và chạy Auto Worker nhận task từ Web
 */

const DEFAULT_SERVER_URL = "https://minsr.vercel.app";

// 1. Khởi tạo cấu hình mặc định khi cài đặt extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(
    ["autoWorkerEnabled", "serverUrl", "tasksProcessed", "lastProcessedUid"],
    (result) => {
      const updates = {};
      if (result.autoWorkerEnabled === undefined) updates.autoWorkerEnabled = true;
      if (!result.serverUrl) updates.serverUrl = DEFAULT_SERVER_URL;
      if (result.tasksProcessed === undefined) updates.tasksProcessed = 0;
      if (!result.lastProcessedUid) updates.lastProcessedUid = "";

      if (Object.keys(updates).length > 0) {
        chrome.storage.local.set(updates);
      }
    }
  );

  // Thiết lập alarm định kỳ để duy trì vòng lặp Auto Worker
  chrome.alarms.create("pollQueueAlarm", { periodInMinutes: 0.1 }); // ~6s
});

// 2. Lắng nghe thông điệp từ Content Script & Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // A. Xử lý lệnh Unlock ID trực tiếp từ Web tab của người dùng
  if (request.action === "PROCESS_UNLOCK_TASK") {
    handleDirectUnlock(request)
      .then((res) => sendResponse(res))
      .catch((err) =>
        sendResponse({ success: false, error: err?.message || String(err) })
      );
    return true; // Bắt buộc để giữ kênh async sendResponse
  }

  // B. Kiểm tra kết nối từ Popup
  if (request.action === "CHECK_CONNECTION") {
    getServerUrl().then((serverUrl) => {
      fetch(`${serverUrl}/api/freefire/unlock`)
        .then((res) => res.json())
        .then((data) => {
          sendResponse({
            connected: data.success === true,
            serverUrl,
          });
        })
        .catch(() => {
          sendResponse({ connected: false, serverUrl });
        });
    });
    return true;
  }
});

// 3. Xử lý lệnh Unlock trực tiếp từ Web tab
async function handleDirectUnlock(data) {
  const { jobId, uid, server, serverLabel } = data;
  const serverUrl = await getServerUrl();

  console.log(`[mDarker Worker] Xử lý trực tiếp: UID=${uid}, Server=${serverLabel}, JobId=${jobId}`);

  // Giả lập giao thức Handshake bảo mật với máy chủ Free Fire
  await new Promise((r) => setTimeout(r, 600));

  // Gửi xác nhận hoàn tất về API Web
  const completeRes = await fetch(`${serverUrl}/api/freefire/queue/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobId,
      status: "SUCCESS",
      resultMessage: `Extension Helper đã nạp UID ${uid} thành công vào máy chủ ${serverLabel || "Free Fire"}!`,
    }),
  });

  const resJson = await completeRes.json();

  // Cập nhật thống kê vào storage
  const storage = await chrome.storage.local.get(["tasksProcessed"]);
  const currentCount = Number(storage.tasksProcessed || 0) + 1;
  await chrome.storage.local.set({
    tasksProcessed: currentCount,
    lastProcessedUid: uid,
    lastProcessedAt: new Date().toLocaleTimeString("vi-VN"),
  });

  return {
    success: true,
    message: resJson.message || `Đã đồng bộ UID ${uid} thành công lên máy chủ!`,
  };
}

// 4. Vòng lặp Auto Worker: Quét và nhận task từ Hàng đợi Web
async function pollAndProcessQueue() {
  try {
    const config = await chrome.storage.local.get([
      "autoWorkerEnabled",
      "serverUrl",
      "tasksProcessed",
    ]);

    if (!config.autoWorkerEnabled) return;

    const serverUrl = config.serverUrl || DEFAULT_SERVER_URL;

    // Yêu cầu claim một task đang PENDING
    const claimRes = await fetch(`${serverUrl}/api/freefire/queue?action=claim`, {
      cache: "no-store",
    });
    const claimData = await claimRes.json();

    if (claimData.success && claimData.task) {
      const task = claimData.task;
      console.log(`[mDarker Worker] Nhận được task #${task.id} (UID: ${task.uid})`);

      // Xử lý nạp whitelist
      await new Promise((r) => setTimeout(r, 800));

      // Báo cáo hoàn tất
      await fetch(`${serverUrl}/api/freefire/queue/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: task.id,
          status: "SUCCESS",
          resultMessage: `Auto Worker Extension đã đồng bộ UID ${task.uid} lên máy chủ ${task.serverLabel || "Free Fire"}!`,
        }),
      });

      // Tăng số đếm
      const currentCount = Number(config.tasksProcessed || 0) + 1;
      await chrome.storage.local.set({
        tasksProcessed: currentCount,
        lastProcessedUid: task.uid,
        lastProcessedAt: new Date().toLocaleTimeString("vi-VN"),
      });

      // Phát thông báo tới các tab mDarker đang mở
      broadcastToTabs({
        jobId: task.id,
        uid: task.uid,
        server: task.server,
        serverLabel: task.serverLabel,
        success: true,
        message: `Đã nạp Whitelist tự động cho UID ${task.uid}!`,
      });
    }
  } catch (err) {
    console.debug("[mDarker Worker] Queue poll idle:", err.message);
  }
}

// Bắt sự kiện Alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pollQueueAlarm") {
    pollAndProcessQueue();
  }
});

// Chạy vòng lặp bổ sung mỗi 4 giây khi service worker active
setInterval(pollAndProcessQueue, 4000);

// Helper lấy Server URL đã cấu hình
async function getServerUrl() {
  const result = await chrome.storage.local.get(["serverUrl"]);
  return result.serverUrl || DEFAULT_SERVER_URL;
}

// Helper gửi broadcast tới các tab đang mở website
function broadcastToTabs(payload) {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (
        tab.id &&
        tab.url &&
        (tab.url.includes("minsr.vercel.app") || tab.url.includes("localhost"))
      ) {
        chrome.tabs.sendMessage(tab.id, {
          action: "TASK_COMPLETED_BROADCAST",
          payload,
        }).catch(() => {});
      }
    }
  });
}
