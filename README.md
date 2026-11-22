# 🩺 MEDCARE CRM — Healthcare Relationship Management System

> **Dự án Đồ án Học phần:** Thiết kế Web — Trường Đại học Lạc Hồng (LHU)  
> **Lĩnh vực:** Quản lý quan hệ khách hàng dành cho Phòng khám & Trung tâm Y tế Đa chuyên khoa  
> **Phong cách thiết kế:** Modern HealthTech SaaS (Teal / Emerald Palette `#0F766E` · `#10B981`)  
> **Công nghệ:** HTML5 Semantic · CSS3 Transition thuần · JavaScript ES6+ · LocalStorage  
> **Môi trường chạy:** Trực tiếp trên trình duyệt (file:/// hoặc Live Server) — **Không cần cài đặt Node.js hay Backend Server**

---

## 🌟 1. Tổng Quan Dự Án

**MedCare CRM** là nền tảng quản lý quan hệ khách hàng chuyên biệt cho lĩnh vực Y tế - Chăm sóc sức khỏe (Healthcare CRM), được xây dựng theo mô hình SaaS chuyên nghiệp với 3 phân vùng rõ ràng:

1. **Public Area (Trang Giới Thiệu & Quảng Bá):** `index.html` — Landing page chuẩn quốc tế, giới thiệu giải pháp, gói dịch vụ khám, thống kê hiệu quả và bảng giá.
2. **Authentication Area (Xác Thực Phân Quyền):** `pages/login.html` & `pages/register.html` — Giao diện đăng nhập/đăng ký hiện đại, hỗ trợ **Quick Demo Login (1-click)** phân quyền 3 cấp bậc.
3. **CRM Application Area (Bàn Làm Việc Chuyên Sâu):** `dashboard/` — Hệ thống phân hệ điều hành đầy đủ:
   - 📊 **Tổng Quan (Dashboard Overview):** 4 thẻ KPI, biểu đồ Chart.js doanh thu & cơ cấu phân hạng, danh sách tái khám hôm nay.
   - 👥 **Quản Lý Bệnh Nhân (Customers):** Danh sách 50 bệnh nhân mẫu, phân trang, tìm kiếm, lọc theo chuyên khoa, xuất file CSV.
   - 🎯 **Tiếp Nhận Tiềm Năng (Leads):** Phễu chuyển đổi khách hàng từ Website/Zalo/Ads thành bệnh nhân chính thức.
   - 💬 **Chăm Sóc Khách Hàng (Customer Care):** Ghi nhận nhật ký tương tác sau khám, nhắc lịch tái khám, dòng thời gian Timeline.
   - 📦 **Kho Dược & Vật Tư Y Tế (Inventory):** Quản lý tồn kho thuốc, cảnh báo sắp hết hàng và theo dõi hạn sử dụng.
   - 💰 **Hóa Đơn & Thu Ngân (Sales & Billing):** Quản lý viện phí khám bệnh, thanh toán QR/thẻ/tiền mặt và in phiếu thu.
   - ⭐ **Khảo Sát Hài Lòng (Surveys & CSAT):** Đo lường chất lượng dịch vụ, hiệu ứng CSS3 Transition mượt mà.
   - 📈 **Báo Cáo & Phân Tích (Reports & CLV):** Mô hình tính toán Giá trị vòng đời bệnh nhân `CLV = AOV × F × L`.

---

## 🎓 2. Ba Yêu Cầu Học Phần (Course Requirements)

Dự án đáp ứng 100% các tiêu chí cốt lõi của Học phần Thiết kế Web:

### ✅ Yêu cầu 1: Biểu mẫu Form HTML5 chuẩn mực với Validation
- **Vị trí kiểm tra:** Trang `dashboard/leads.html` (Form Tiếp Nhận Khách Hàng Mới)
- **Đặc tả kỹ thuật:**
  - `required` trên tất cả các trường dữ liệu bắt buộc.
  - `type="email"`: Trình duyệt tự động kiểm tra định dạng email hợp lệ (có `@` và tên miền).
  - `type="tel"` kèm `pattern="^0[0-9]{9}$"`: Bắt buộc số điện thoại Việt Nam gồm đúng 10 chữ số, bắt đầu bằng số 0.
  - `minlength="2"` trên trường Họ và tên.
  - `type="date"`: Lựa chọn ngày dự kiến gọi điện chăm sóc (chặn chọn ngày trong quá khứ).
  - Bộ `radio buttons` (name="leadPriority"): Lựa chọn mức độ ưu tiên xử lý (Gấp / Vừa / Thấp).
  - `select` danh mục chuyên khoa & `textarea` ghi chú nhu cầu tư vấn.

### ✅ Yêu cầu 2: Hiệu ứng CSS3 Transition thuần mượt mà
- **Vị trí kiểm tra:** Trang `dashboard/surveys.html` (Bảng Khảo Sát Mức Độ Hài Lòng CSAT)
- **Đặc tả 3 hiệu ứng:**
  1. **Hiệu ứng 1 (Hover Card):** `transition: background-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease` — Rê chuột lên hàng khảo sát để thấy màu nền chuyển sang ánh ngọc bích, thẻ nổi lên tạo chiều sâu.
  2. **Hiệu ứng 2 (Accordion Content):** `transition: max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease` — Nhấn trực tiếp vào hàng khảo sát để mở rộng/thu gọn chi tiết nhận xét mà không giật khung hình.
  3. **Hiệu ứng 3 (Progress Bar Animation):** `transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1)` — Thanh đo tỷ lệ điểm dịch vụ tự động chạy tăng dần từ 0% tới tỷ lệ thực tế khi tải trang.

### ✅ Yêu cầu 3: Thuật toán JavaScript Phân Hạng Bệnh Nhân (Đồng - Bạc - Vàng)
- **Vị trí mã nguồn:** Hàm `classifyPatient(totalSpent)` trong `js/data.js`
- **Công thức phân hạng:**
  - 🥇 **Hạng Vàng (Gold):** Tổng chi tiêu tích lũy $\ge 15.000.000$ ₫ (Ưu tiên phục vụ VIP cao nhất).
  - 🥈 **Hạng Bạc (Silver):** Tổng chi tiêu tích lũy từ $5.000.000$ ₫ đến $14.999.999$ ₫.
  - 🥉 **Hạng Đồng (Bronze):** Tổng chi tiêu tích lũy $< 5.000.000$ ₫.
- **Tương tác thực tế:**
  - Khi thêm hoặc chỉnh sửa bệnh nhân tại `dashboard/customers.html`, khi nhập số tiền chi tiêu, hệ thống **tự động tính toán & hiển thị ngay hạng tương ứng** theo thời gian thực.
  - Cơ cấu phân hạng được thống kê trực quan trên biểu đồ Doughnut tại `dashboard/index.html`.

---

## 🔑 3. Tài Khoản Demo Đăng Nhập

Hệ thống tích hợp sẵn nút **Đăng Nhập Nhanh (1-Click Demo Login)** tại trang `pages/login.html`:

| Email | Mật khẩu | Vai trò | Quyền hạn mô phỏng |
| :--- | :--- | :--- | :--- |
| `admin@medcare.vn` | `Admin@123` | **Super Admin** | Ban Giám đốc — Toàn quyền hệ thống |
| `manager@medcare.vn` | `Manager@123` | **Quản lý CSKH** | Trưởng phòng Chăm sóc Khách hàng |
| `staff@medcare.vn` | `Staff@123` | **Nhân viên Tiếp nhận**| Nhân viên CSKH & Trực Hotline |

---

## 📁 4. Cấu Trúc Thư Mục Dự Án

```
medcare-crm/
├── index.html                      # Trang chủ Landing Page giới thiệu sản phẩm
├── README.md                       # Tài liệu hướng dẫn đồ án
│
├── pages/                          # Phân vùng xác thực
│   ├── login.html                  # Giao diện Đăng nhập (+ Quick Demo Buttons)
│   └── register.html               # Giao diện Đăng ký tài khoản phòng khám mới
│
├── dashboard/                      # Phân vùng ứng dụng CRM
│   ├── index.html                  # Tổng quan Dashboard, KPIs, Biểu đồ doanh thu
│   ├── customers.html              # Quản lý 50 Bệnh nhân, Phân hạng Đồng/Bạc/Vàng, CRUD
│   ├── leads.html                  # Form HTML5 tiếp nhận Leads & Phễu chuyển đổi
│   ├── customer-care.html          # Ghi nhận nhật ký tương tác & Timeline chăm sóc
│   ├── inventory.html              # Quản lý Kho Dược, vật tư y tế, cảnh báo tồn kho
│   ├── sales.html                  # Quản lý Hóa đơn thu viện phí & in phiếu thu
│   ├── surveys.html                # Khảo sát CSAT với 3 hiệu ứng CSS3 Transition
│   └── reports.html                # Báo cáo chuyên sâu & Công thức CLV
│
├── css/                            # Hệ thống định kiểu phân tầng
│   ├── variables.css               # Design tokens (Màu sắc, phông chữ, khoảng cách)
│   ├── reset.css                   # Chuẩn hóa hiển thị đa trình duyệt
│   ├── global.css                  # Nút bấm, bảng biểu, modal, badge dùng chung
│   ├── landing.css                 # Style dành riêng cho Landing Page
│   ├── auth.css                    # Style giao diện Đăng nhập / Đăng ký
│   ├── dashboard.css               # Layout App Shell, Sidebar, Header & Components CRM
│   └── responsive.css              # Tương thích màn hình Mobile, Tablet, Desktop
│
└── js/                             # Tầng xử lý logic & dữ liệu
    ├── data.js                     # 50 bệnh nhân mẫu, 20 leads, 15 surveys & logic phân hạng
    ├── auth.js                     # Quản lý phiên đăng nhập LocalStorage, kiểm tra quyền
    ├── app-shell.js                # Render đồng bộ Sidebar, Top Header & Toast thông báo
    ├── dashboard.js                # Xử lý số liệu KPI & biểu đồ Chart.js trang chủ
    ├── customers.js                # CRUD bệnh nhân, lọc, phân trang, xuất CSV
    ├── leads.js                    # Bắt sự kiện form HTML5, chuyển đổi Lead sang Bệnh nhân
    ├── customer-care.js            # Ghi nhận tương tác & dòng thời gian Timeline
    ├── inventory.js                # Quản lý xuất nhập tồn kho dược & vật tư
    ├── sales.js                    # Lập hóa đơn thu tiền khám & in phiếu thu
    ├── surveys.js                  # Điều khiển CSS3 transitions & tính điểm CSAT
    └── reports.js                  # Tính toán công thức CLV & vẽ biểu đồ chuyên khoa
```

---

## 🚀 5. Hướng Dẫn Khởi Chạy

Không cần cài đặt môi trường phức tạp:

1. **Cách 1 (Nhanh nhất):** Nhấp đúp chuột trực tiếp vào tệp `index.html` để mở trong trình duyệt Chrome, Edge, Firefox hoặc Cốc Cốc.
2. **Cách 2 (Khuyến nghị cho Visual Studio Code):**
   - Mở thư mục `medcare-crm` trong VS Code.
   - Nhấp chuột phải vào `index.html` và chọn **"Open with Live Server"**.
3. **Quy trình trải nghiệm mẫu:**
   - Từ `index.html`, bấm nút **"Đăng Nhập"** hoặc **"Trải Nghiệm Demo"**.
   - Tại trang `pages/login.html`, nhấn nút **"⚡ Super Admin"** trong khung Tài Khoản Trải Nghiệm Demo để vào thẳng CRM.
   - Trải nghiệm toàn bộ các phân hệ từ thanh menu bên trái.

---
*Đồ án hoàn thành theo đúng đề cương học phần Thiết kế Web — Trường Đại học Lạc Hồng (LHU).*
