document.addEventListener("DOMContentLoaded", () => {
  const workerToggle = document.getElementById("workerToggle");
  const serverInput = document.getElementById("serverInput");
  const taskCount = document.getElementById("taskCount");
  const lastUid = document.getElementById("lastUid");
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");
  const checkBtn = document.getElementById("checkBtn");

  // 1. Tải dữ liệu từ chrome.storage.local
  chrome.storage.local.get(
    ["autoWorkerEnabled", "serverUrl", "tasksProcessed", "lastProcessedUid"],
    (data) => {
      if (data.autoWorkerEnabled !== undefined) {
        workerToggle.checked = Boolean(data.autoWorkerEnabled);
      }
      if (data.serverUrl) {
        serverInput.value = data.serverUrl;
      }
      taskCount.textContent = String(data.tasksProcessed || 0);
      lastUid.textContent = data.lastProcessedUid ? String(data.lastProcessedUid) : "Chưa có";

      checkConnection();
    }
  );

  // 2. Lưu thay đổi switch Auto Worker
  workerToggle.addEventListener("change", () => {
    chrome.storage.local.set({ autoWorkerEnabled: workerToggle.checked });
  });

  // 3. Lưu thay đổi Server URL
  serverInput.addEventListener("change", () => {
    let url = serverInput.value.trim().replace(/\/+$/, "");
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }
    serverInput.value = url;
    chrome.storage.local.set({ serverUrl: url });
    checkConnection();
  });

  // 4. Kiểm tra kết nối với Web API
  function checkConnection() {
    statusDot.className = "status-dot";
    statusText.textContent = "Đang kiểm tra kết nối...";

    chrome.runtime.sendMessage({ action: "CHECK_CONNECTION" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        statusDot.className = "status-dot";
        statusText.textContent = "Không phản hồi từ Background Service";
        return;
      }

      if (response.connected) {
        statusDot.className = "status-dot online";
        statusText.textContent = "Kết nối máy chủ OK (" + (new URL(response.serverUrl).hostname) + ")";
      } else {
        statusDot.className = "status-dot";
        statusText.textContent = "Mất kết nối hoặc sai Server URL";
      }
    });
  }

  checkBtn.addEventListener("click", checkConnection);
});
