# PHỤ LỤC 2: NHẬT KÝ ĐỒNG HÀNH CÙNG AI (PROMPT LOG)

**Học phần:** Thiết kế Web — Trường Đại học Lạc Hồng (LHU)  
**Tên dự án:** MedCare CRM — Healthcare Customer Relationship Management System  
**Nhóm sinh viên thực hiện:** Nhóm MedCare CRM  

---

## 1. Thông Tin Công Cụ AI Sử Dụng

- **Công cụ AI chính:** Antigravity AI Assistant (Google DeepMind Advanced Agentic Coding), Gemini, Claude.
- **Môi trường & Công cụ hỗ trợ lập trình:** Antigravity IDE, Visual Studio Code (Live Server), trình duyệt Google Chrome (DevTools Inspect).
- **Thư viện bên ngoài:** Chart.js CDN (vẽ biểu đồ phân tích). Không dùng framework ngoài (thuần HTML5, CSS3, JavaScript ES6+ và LocalStorage).

---

## 2. Nhật Ký Quá Trình Thực Hiện (Các Prompt Quan Trọng)

| Giai đoạn | Mục tiêu (Bạn muốn AI làm gì?) | Nội dung Prompt (Câu lệnh bạn đã dùng) | Kết quả & Tùy chỉnh (AI có làm đúng không? Bạn có sửa lại gì không?) |
| :--- | :--- | :--- | :--- |
| **1. Khởi tạo & Kiến trúc** | Xây dựng đặc tả dự án và cấu trúc thư mục chuẩn SaaS 3 phân vùng (Landing, Auth, CRM). | *"Bạn là chuyên gia kiến trúc Front-end, hãy thiết kế dự án MedCare CRM cho phòng khám tầm trung theo phong cách Modern HealthTech (Teal/Emerald), gồm 3 phân vùng: Landing Page, Auth (Login/Register), và CRM Dashboard. Yêu cầu chạy hoàn toàn trên trình duyệt, không dùng Node.js server."* | AI đề xuất cấu trúc module khoa học và bảng Design Tokens CSS hoàn chỉnh. Nhóm đã duyệt và yêu cầu chia nhỏ các file CSS, JS theo từng phân hệ. |
| **2. Giao diện (CSS)** | Thiết kế hệ thống CSS Variables, Global Components và hiệu ứng CSS3 Transition thuần cho trang Khảo sát CSAT. | *"Hãy viết CSS3 chuẩn cho trang surveys.html với 3 hiệu ứng transition thuần: (1) Hover thẻ đổi màu nền và nổi bóng; (2) Accordion mở rộng chi tiết nhận xét với max-height và opacity mượt mà; (3) Thanh đo tiến trình CSAT tự động chạy tăng dần từ 0% tới tỷ lệ thực tế bằng hàm cubic-bezier."* | AI sinh code transition chuẩn xác, mượt mà ở tốc độ 60fps. Nhóm tùy chỉnh thêm màu sắc Teal `#0F766E` và thời gian transition `0.45s` để hiệu ứng tự nhiên nhất. |
| **3. Tính năng (HTML5 Form)** | Tạo biểu mẫu tiếp nhận Lead mới với đầy đủ các thuộc tính kiểm tra dữ liệu HTML5 Form. | *"Tạo form tiếp nhận Lead mới trong leads.html đáp ứng đầy đủ yêu cầu học phần: bắt buộc nhập (required), email (type='email'), điện thoại 10 số (type='tel' pattern='^0[0-9]{9}$'), độ dài tên (minlength='2'), chọn ngày hẹn (type='date'), bộ radio chọn mức độ ưu tiên và textarea ghi chú."* | AI tạo đúng 100% các thuộc tính HTML5. Nhóm bổ sung thêm hàm JavaScript chuyển đổi Lead thành Bệnh nhân chính thức và lưu vào LocalStorage. |
| **4. Tính năng (JS Logic)** | Xây dựng thuật toán phân hạng khách hàng Đồng - Bạc - Vàng và bộ dữ liệu mẫu 50 bệnh nhân. | *"Viết hàm classifyPatient(totalSpent) bằng JavaScript ES6: nếu chi tiêu >= 15 triệu là Hạng Vàng, từ 5 đến dưới 15 triệu là Hạng Bạc, dưới 5 triệu là Hạng Đồng. Tích hợp hàm này vào giao diện quản lý bệnh nhân để khi nhập số tiền, badge phân hạng tự động đổi ngay lập tức."* | AI hoàn thành xuất sắc hàm phân hạng. Nhóm kiểm tra chạy thử và kết nối với biểu đồ Donut Chart để hiển thị tỷ lệ % cơ cấu phân hạng. |
| **5. Sửa lỗi & Tối ưu** | Khắc phục hiện tượng menu dropdown bị mất khi di chuột xuống các mục con và hoàn thiện Responsive. | *"Menu dropdown trên thanh điều hướng đôi lúc khi kéo chuột xuống các mục con bị biến mất do khoảng cách hở. Hãy khắc phục triệt để bằng cách dùng click toggle an toàn kết hợp đóng khi click bên ngoài (click outside)."* | AI chuyển sang cơ chế quản lý sự kiện Click Event cho menu người dùng và thêm cầu đệm chuột, loại bỏ hoàn toàn hiện tượng mất menu khi rê chuột. |

---

## 3. Những Bài Học Kinh Nghiệm Khi Dùng AI

- **Câu lệnh (Prompt) hiệu quả nhất mà nhóm đúc kết được:**  
  *Cần đưa ra ngữ cảnh cụ thể, các ràng buộc kỹ thuật rõ ràng (ví dụ: 'không dùng Node.js backend', 'dùng CSS transition thuần thay vì thư viện', 'kiểm tra regex số điện thoại Việt Nam') và chia nhỏ bài toán thành từng module cụ thể.*
- **Khó khăn khi làm việc với AI:**  
  *Đôi khi AI có xu hướng dùng các thư viện ngoài phức tạp hoặc sinh code Node.js backend. Nhóm phải nhắc nhở AI tuân thủ đúng yêu cầu tĩnh (Static Client-side Only) chạy qua `file:///` hoặc Live Server.*
- **Cách nhóm kiểm tra độ chính xác của code AI:**  
  1. Kiểm tra cú pháp bằng Node CLI (`node --check`) và script kiểm tra toàn bộ liên kết HTML.
  2. Mở trực tiếp trên Google Chrome DevTools (F12) để kiểm tra Console (đảm bảo 0 lỗi), kiểm tra tab Elements xem các thuộc tính HTML5 Form.
  3. Thử nghiệm trên các kích thước màn hình khác nhau (Desktop 1440px, Laptop 1024px, Tablet 768px, Mobile 375px) để đảm bảo giao diện co giãn hoàn hảo.

---

## 4. Cam Kết Của Nhóm

- [x] Nhóm đã đọc, hiểu rõ và làm chủ 100% mã nguồn do AI tạo ra.
- [x] Nhóm đã tự tay kiểm thử, tinh chỉnh giao diện, màu sắc, nội dung y tế và dữ liệu mẫu tiếng Việt để phù hợp với thực tế trung tâm y tế tại Việt Nam.
- [x] Đồ án đáp ứng đầy đủ và vượt mong đợi cả 3 tiêu chí cốt lõi của Học phần Thiết kế Web.
