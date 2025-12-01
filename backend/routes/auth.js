import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  handleRegister,
  handleLogin,
  handleLogout,
  getInfo,
  updateInfo,
  updateInfoByAdmin,
  checkSeSSion,
  changePassword,
  getCustomers,
  addStaff,
  getStaffs,
  getProducts,
  handleForgotPassword,
  handleResetPassword,
  usernameExist,
  deleteUser,
  addProducts,
  updateProductByAdmin,
  deleteProducts,
  addNotification,
  getNotifications,
  deleteNotifications,
  addToCart,
  getCart,
  deleteItem,
  addOrder,
  getOrders,
  updateOrder,
  getOrdersByAdmin,
  markNotificationAsRead,
  // [QUAN TRỌNG] Đảm bảo import 2 hàm này
  handleSendVerifyEmail, 
  handleVerifyEmailCode
} from "../controllers/authController.js";

// Import Chat Controller (Đảm bảo bạn đã có file ChatController.js)
import { handleChat } from "../controllers/ChatController.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Cấu hình Multer (Upload ảnh) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const newFileName = `image_${Math.floor(Date.now() / 1000)}`;
    cb(null, newFileName + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

// --- Authentication & User ---
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.get("/check-session", checkSeSSion);
router.get("/info", getInfo);
router.post("/info", updateInfo);
router.post("/change-pass", changePassword);
router.post("/username-exist", usernameExist);

// --- Quên mật khẩu ---
router.post("/forgot-password", handleForgotPassword); 
router.post("/reset-password", handleResetPassword); 

// --- [QUAN TRỌNG] Xác thực Email khi đăng ký ---
router.post("/send-verify-email", handleSendVerifyEmail);
router.post("/verify-email", handleVerifyEmailCode);

// --- Staff & Admin Management ---
router.get("/customers", getCustomers);
router.get("/staffs", getStaffs);
router.post("/addStaffs", addStaff);
router.post("/updateInfoByAd", updateInfoByAdmin);
router.post("/deleteUser", deleteUser);

// --- Upload Image ---
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ success: true, path: filePath });
});

// --- Products ---
router.post("/addProducts", addProducts);
router.get("/getProducts", getProducts);
router.post("/deleteProducts", deleteProducts);
router.post("/updateProducts", updateProductByAdmin);

// --- Notifications ---
router.post("/addNotifications", addNotification);
router.get("/getNotifications", getNotifications);
router.post("/deleteNotifications", deleteNotifications);
router.post("/markNotificationRead", markNotificationAsRead); 

// --- Cart ---
router.post("/addToCart", addToCart); 
router.get("/userCart", getCart); 
router.delete("/removeCart", deleteItem); 

// --- Orders ---
router.post("/addOrder", addOrder); 
router.get("/getOrders", getOrders); 
router.get("/getOrdersByAdmin", getOrdersByAdmin); 
router.post("/updateOrder", updateOrder); 

// --- Chat ---
router.post("/chat", handleChat);

export default router;