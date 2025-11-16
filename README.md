# 🛍️ TechSync Store (E-commerce)

Đây là một dự án web e-commerce full-stack được xây dựng bằng React (Frontend) và Node.js/Express (Backend) với cơ sở dữ liệu MongoDB. Trang web cho phép người dùng đăng ký, duyệt sản phẩm, thêm vào giỏ hàng, đặt hàng và quản lý tài khoản. Trang web cũng có một bảng điều khiển dành cho Quản trị viên (Admin) để quản lý sản phẩm, người dùng và thông báo.

## ✨ Tính năng nổi bật

### 1. Phía Người dùng (Client) (Phải đăng ký, đăng nhập để xem sản phẩm trực tiếp)
* **Xác thực:** Đăng ký, Đăng nhập, Đăng xuất, Quên mật khẩu.
* **Sản phẩm:** Duyệt xem danh sách sản phẩm, xem chi tiết sản phẩm (dạng modal).
* **Giỏ hàng:** Thêm, xóa, cập nhật số lượng sản phẩm trong giỏ hàng.
* **Thanh toán:** Đặt hàng từ giỏ hàng.
* **Tài khoản:** Xem và cập nhật thông tin cá nhân, xem lịch sử đơn hàng.
* **Thông báo (Real-time):**
    * Nhận pop-up thông báo mới (góc dưới bên phải).
    * Đánh dấu "đã xem" khi nhấp vào thông báo.
    * Trạng thái "đã tắt" được lưu (không hiện lại khi reload).
* **Chatbot:**
    * Một chatbot hỗ trợ (rule-based) tùy chỉnh.
    * Có thể kéo thả tự do trên màn hình.

### 2. Phía Quản trị (Admin)
* **Quản lý Nhận viên** Thêm, xóa, sửa, xem thông tin nhân viên.
* **Quản lý Sản phẩm:** Thêm, Sửa, Xóa sản phẩm (CRUD).
* **Quản lý Người dùng:** Xem danh sách, sửa, và vô hiệu hóa tài khoản (Customer).
* **Quản lý Thông báo:** Tạo và xóa thông báo cho toàn bộ người dùng.
* **Quản lý Đơn hàng:** Xem và cập nhật trạng thái tất cả đơn hàng.
* **Thống kê đơn hàng** Thống kê được các đơn hàng bán được trong 1 tháng 

---

## 💻 Công nghệ sử dụng

* **Frontend:**
    * **React (Vite):** Thư viện JavaScript để xây dựng giao diện.
    * **Tailwind CSS:** Framework CSS cho styling nhanh chóng.
    * **React Router DOM:** Quản lý điều hướng trang.
    * **SweetAlert2:** Tạo các pop-up thông báo đẹp mắt.
    * **React Draggable:** Cho phép kéo thả chatbot.

* **Backend:**
    * **Node.js:** Môi trường chạy JavaScript phía máy chủ.
    * **Express.js:** Framework web cho Node.js để xây dựng API.
    * **MongoDB:** Cơ sở dữ liệu NoSQL.
    * **Mongoose:** Thư viện ODM để làm việc với MongoDB.
    * **Express Session:** Quản lý phiên đăng nhập của người dùng.
    * **Bcrypt:** Mã hóa mật khẩu.
    * **Multer:** Xử lý upload file (hình ảnh).
    * **CORS:** Cho phép giao tiếp giữa frontend và backend.

---

## 🚀 Hướng dẫn cài đặt và chạy

Dự án này được chia làm 2 phần: `frontend` và `backend`. Bạn cần chạy cả hai cùng một lúc.

### Yêu cầu
* [Node.js](https://nodejs.org/) (phiên bản 16 trở lên)
* [MongoDB](https://www.mongodb.com/try/download/community) (Cài đặt local hoặc sử dụng tài khoản MongoDB Atlas)

### 1. Cài đặt Backend (Máy chủ)

1.  Mở một cửa sổ terminal.
2.  Đi đến thư mục backend:
    ```bash
    cd backend
    ```
3.  Cài đặt các gói phụ thuộc:
    ```bash
    npm install
    ```
4.  Tạo một tệp `.env` trong thư mục `backend` và thêm chuỗi kết nối MongoDB của bạn:
    ```
    MONGO_URI=your_mongodb_connection_string_here
    ```
5.  Khởi động máy chủ backend:
    ```bash
    node server.js
    ```
    *Hoặc `npm run dev` nếu bạn có `nodemon`.*
    *Máy chủ sẽ chạy tại `http://localhost:5000`.*

### 2. Cài đặt Frontend (Giao diện)

1.  Mở một cửa sổ terminal **mới**.
2.  Đi đến thư mục frontend:
    ```bash
    cd frontend
    ```
3.  Cài đặt các gói phụ thuộc:
    ```bash
    npm install
    ```
4.  Khởi động máy chủ frontend (Vite):
    ```bash
    npm run dev
    ```
    *Trang web sẽ tự động mở và chạy tại `http://localhost:5173`.*

---

## 📂 Cấu trúc thư mục 
/TechSyncShop
├── package.json 
├── README.md 
│
├── /backend 
│   ├── server.js 
│   ├── package.json 
│   │
│   ├── /config 
│   │   └── db.js 
│   │
│   ├── /controllers 
│   │   ├── authController.js 
│   │   └── ChatController.js 
│   │
│   ├── /models 
│   │   ├── Cart.js 
│   │   ├── Notification.js 
│   │   ├── Order.js 
│   │   ├── Product.js 
│   │   └── User.js 
│   │
│   ├── /public 
│   │   └── /uploads 
│   │       └── (Chứa các file ảnh đã tải lên) 
│   │
│   ├── /routes 
│   │   └── auth.js 
│   │
│   └── /services 
│       └── emailService.js 
│
└── /frontend 
    ├── index.html 
    ├── package.json 
    │
    └── /src 
        ├── App.jsx 
        ├── main.jsx 
        ├── index.css 
        │
        ├── /assets 
        │   └── (Chứa các file ảnh tĩnh, logo...) 
        │
        ├── /components 
        │   ├── Alert.jsx 
        │   ├── ChatBubble.jsx 
        │   └── ... (Các component khác) 
        │
        ├── /Data 
        │   └── Countries.js 
        │
        ├── /Function 
        │   ├── CheckUser.js 
        │   └── UseInfoUser.js 
        │
        ├── /layouts 
        │   ├── Footer.jsx 
        │   ├── Header.jsx 
        │   └── ...
        │
        ├── /pages 
        │   ├── LoginPage.jsx 
        │   ├── SignupPage.jsx 
        │   ├── CartPage.jsx 
        │   ├── DashboardAdmin.jsx 
        │   └── ... (Các trang khác)
        │
        ├── /services 
        │   └── handleAPI.js 
        │
        ├── /Styles 
        │   └── main.css 
        │
        └── /utils 
            └── format.js 