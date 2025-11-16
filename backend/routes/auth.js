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
} from "../controllers/authController.js";

// *** 1. IMPORT HÀM CHAT MỚI ***
import { handleChat } from "../controllers/ChatController.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ... (phần code multer storage giữ nguyên) ...
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
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.get("/check-session", checkSeSSion);
router.get("/info", getInfo);
router.post("/info", updateInfo);
router.post("/change-pass", changePassword);
router.post("/username-exist", usernameExist);

router.post("/forgot-password", handleForgotPassword); 
router.post("/reset-password", handleResetPassword); 

router.get("/customers", getCustomers);
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ success: true, path: filePath });
});


router.get("/staffs", getStaffs);
router.post("/addStaffs", addStaff);
router.post("/updateInfoByAd", updateInfoByAdmin);
router.post("/deleteUser", deleteUser);


router.post("/addProducts", addProducts);
router.get("/getProducts", getProducts);
router.post("/deleteProducts", deleteProducts);
router.post("/updateProducts", updateProductByAdmin);


router.post("/addNotifications", addNotification);
router.get("/getNotifications", getNotifications);
router.post("/deleteNotifications", deleteNotifications);


router.post("/addToCart", addToCart); 
router.get("/userCart", getCart); 
router.delete("/removeCart", deleteItem); 


router.post("/addOrder", addOrder); 
router.get("/getOrders", getOrders); 
router.get("/getOrdersByAdmin", getOrdersByAdmin); 
router.post("/updateOrder", updateOrder); 
router.post("/markNotificationRead", markNotificationAsRead); // Lỗi ở đây, tôi đã sửa

// *** 2. THÊM ROUTE CHO CHATBOT VÀO ĐÂY ***
router.post("/chat", handleChat);


export default router;