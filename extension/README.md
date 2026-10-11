# 🚀 Tiện Ích Chrome Extension - mDarker Free Fire Helper & Auto Worker

Tiện ích mở rộng kết nối 2 chiều giữa trang web **mDarker** (`minsr.vercel.app`) và hệ thống **Unlock ID / Whitelist Free Fire Mod**.

---

## 🌟 Tính Năng Chính
1. **Kết nối 2 chiều tức thì với Website (`window.postMessage`)**:
   - Khi bạn truy cập trang Free Fire trên web, website sẽ tự động nhận diện `Extension Helper: Đã kết nối`.
   - Ngay khi bạn nhập UID và bấm "Kích hoạt", Extension sẽ bắt tín hiệu, thực thi nạp whitelist và phản hồi kết quả về giao diện web trong mili-giây.

2. **Chế độ Auto Worker Hàng Đợi (Background Queue)**:
   - Tự động quét hàng đợi từ web (`/api/freefire/queue?action=claim`).
   - Tự động nhận việc, giải mã UID, nạp vào máy chủ và gửi báo cáo hoàn thành về API (`/api/freefire/queue/complete`).
   - Bạn có thể treo Extension trên trình duyệt máy tính cá nhân hoặc VPS để làm Worker nạp ID tự động 24/7 cho toàn bộ thành viên web.

---

## 🛠 Hướng Dẫn Cài Đặt Trong 30 Giây

1. **Mở trình duyệt Chromium**: (Google Chrome, Microsoft Edge, Brave, Cốc Cốc, v.v.)
2. Truy cập thanh địa chỉ:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Cốc Cốc: `coccoc://extensions/`
3. Bật công tắc **"Developer mode" (Chế độ dành cho nhà phát triển)** ở góc trên bên phải màn hình.
4. Bấm nút **"Load unpacked" (Tải tiện ích đã giải nén)** ở góc trên bên trái.
5. Chọn thư mục `extension` này trong thư mục dự án của bạn.
6. 🎉 **Hoàn tất!** Biểu tượng mDarker Helper sẽ xuất hiện trên thanh công cụ của trình duyệt.

---

## ⚙️ Cấu Hình
- Bấm vào icon Extension trên thanh công cụ trình duyệt để mở bảng điều khiển:
  - **Auto Worker Hàng Đợi**: Bật / Tắt chế độ tự động nhận việc.
  - **Máy chủ Web mDarker**: Mặc định là `https://minsr.vercel.app` (nếu chạy local dev, bạn có thể đổi thành `http://localhost:3000`).
  - **Kiểm tra kết nối**: Bấm để test ping đến máy chủ ngay lập tức.
