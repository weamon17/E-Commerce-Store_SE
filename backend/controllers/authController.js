import User from "../models/User.js";
import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { sendPasswordResetEmail } from  "../services/emailService.js";

//!Đăng ký
export const handleRegister = async (req, res) => {
  try {
    // THAY ĐỔI: Thêm 'email'
    const { username, email, password, position } = req.body;

    // THAY ĐỔI: Kiểm tra email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // THAY ĐỔI: Thêm 'email' khi tạo user
    const user = new User({ username, email, password, position });
    await user.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err); // Thêm log lỗi
    res.status(500).json({
      success: false,
      message: "Server error during sign up",
    });
  }
};

//!Đăng nhập
export const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect username" });
    const match = await user.comparePassword(password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    req.session.user = { id: user._id, position: user.position }; // Lưu session
    res.json({ success: true, position: user.position });
    console.log("Session user:", req.session.user);
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};



//!Đăng xuất
export const handleLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // xoá cookie session
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
};

//!Check ss
export const checkSeSSion = async (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
};

//!Lấy dữ liệu user
export const getInfo = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

//!Cập nhật dữ liệu user
export const updateInfo = async (req, res) => {
  try {
    const updates = (({
      username,
      email,
      yourname,
      gender,
      birthDay,
      country,
      address,
      avatar,
    }) => ({
      username,
      email,
      yourname,
      gender,
      birthDay,
      country,
      address,
      avatar,
    }))(req.body);
    await User.findByIdAndUpdate(req.session.user.id, updates);
    res.json({ success: true, message: "Update Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" }); // Sửa message.err
  }
};

//!change pass
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    user.password = newPassword; // Model User của bạn nên có hook 'pre-save' để hash mật khẩu
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Error changing password",
    });
  }
};
//!Check username exist
export const usernameExist = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(401) // 401 không hợp lý, có thể dùng 200 và success: false
        .json({ success: false, message: "Username is not exist" });
    else res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

// THAY THẾ: Logic Reset Password

//!Reset password (BƯỚC 1: Yêu cầu gửi mã)
export const handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: true, message: "If email exists, a reset code will be sent." });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = Date.now() + 10 * 60 * 1000; 

    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = expiryDate;
    await user.save();

    // === GỌI EMAIL SERVICE TẠI ĐÂY ===
    await sendPasswordResetEmail(user.email, resetCode);
    // ===================================
    
    res.json({ success: true, message: "Password reset code sent to email." });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ success: false, message: "Error processing request" });
  }
};


//!Reset password (BƯỚC 2: Xác minh mã và đặt lại)
export const handleResetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Tìm user bằng email, mã, và mã còn hạn
    const user = await User.findOne({
      email,
      resetPasswordToken: code,
      resetPasswordExpires: { $gt: Date.now() }, // $gt = greater than (còn hạn)
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset code." });
    }

    // Đặt lại mật khẩu (hook 'pre-save' trong Model sẽ hash)
    user.password = newPassword;
    // Xóa mã sau khi dùng
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined; 
    
    await user.save();

    res.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({
      success: false,
      message: "Error changing password",
    });
  }
};


//! Lấy danh sách khách hàng
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ position: "Customer" });
    if (!customers)
      return res.json({
        success: false,
        message: "No customers have registered yet!",
      });
    res.json({ success: true, customers });
  } catch (error) {
    console.error("Error taking customers list:", error);
    res.status(500).json({ message: "" });
  }
};

export const addStaff = async (req, res) => {
  try {
    const {
      username,
      password,
      position,
      email,
      yourname,
      birthDay,
      address,
      gender,
      phoneNum,
    } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }
    // Bạn cũng nên kiểm tra email tồn tại ở đây
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const user = new User({
      username,
      password,
      position,
      email,
      yourname,
      birthDay,
      address,
      gender,
      phoneNum,
    });
    await user.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error during sign up",
    });
  }
};

// ... (Tất cả các hàm khác của bạn từ getStaffs trở đi giữ nguyên) ...
// ... (getStaffs, updateInfoByAdmin, deleteUser, addProducts, ...)
// ... (getProducts, updateProductByAdmin, deleteProducts, ...)
// ... (addNotification, getNotifications, deleteNotifications, ...)
// ... (addToCart, getCart, deleteItem, ...)
// ... (addOrder, getOrders, updateOrder, getOrdersByAdmin)

export const getStaffs = async (req, res) => {
  try {
    const staffs = await User.find({ position: "Staff" });
    if (!staffs)
      return res.json({
        success: false,
        message: "No staffs have registered yet!",
      });
    res.json({ success: true, staffs });
  } catch (error) {
    console.error("Error taking staffs list:", error);
    res.status(500).json({ message: "" });
  }
};

export const updateInfoByAdmin = async (req, res) => {
  try {
    const { _id, yourname, birthDay, gender, email, phoneNum, address } =
      req.body;

    const result = await User.findByIdAndUpdate(
      _id,
      { yourname, birthDay, gender, email, phoneNum, address },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }

    res.json({ success: true, staff: result });
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.body.id,
      { isActive: false },
      { new: true }
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, customer: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addProducts = async (req, res) => {
  try {
    const {
      productId,
      productName,
      saleprice,
      oldprice,
      image,
      quantity,
      description,
      category, // <--- THÊM DÒNG NÀY
    } = req.body;
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }

    const product = new Product({
      productId,
      productName,
      saleprice,
      oldprice,
      image,
      quantity,
      description,
      category, 
    });
    await product.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({
      success: false,
      message: "Server error during product creation",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products)
      return res.json({
        success: false,
        message: "No products have added yet!",
      });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error taking products list:", error);
    res.status(500).json({ message: "" });
  }
};

export const updateProductByAdmin = async (req, res) => {
  try {
    const {
      productId,
      productName,
      oldprice,
      saleprice,
      image,
      quantity,
      description,
      category,
    } = req.body;

    const result = await Product.findOneAndUpdate(
      { productId },
      {
        productId,
        productName,
        oldprice,
        image,
        saleprice,
        quantity,
        description,
        category, 
      },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product: result });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProducts = async (req, res) => {
  try {
    console.log("Product ID received:", req.body.productId);
    const deleted = await Product.findOneAndDelete({
      productId: req.body.productId,
    }); // kiểm tra đúng field chưa
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error); // log ra terminal để kiểm tra lỗi thật sự
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// HÀM 1: THÊM THÔNG BÁO
export const addNotification = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required" });
    }

    const notification = new Notification({ title, content });
    await notification.save(); // Lưu thông báo mới

    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error("Error adding notification:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// HÀM 2: LẤY THÔNG BÁO
export const getNotifications = async (req, res) => {
  try {
    // Lấy tổng số thông báo chưa xem
    const unreadCount = await Notification.countDocuments({ isRead: false });

    // Lấy danh sách thông báo, vẫn sắp xếp mới nhất lên đầu
    const notifications = await Notification.find({}).sort({
      createdAt: -1,
    });

    if (!notifications) {
      return res.json({ success: true, notifications: [], unreadCount: 0 });
    }

    // Trả về cả danh sách và số lượng chưa xem
    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error("Error taking notifications list:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// HÀM 3: XÓA THÔNG BÁO
export const deleteNotifications = async (req, res) => {
  try {
    console.log("Notification ID received:", req.body.id);
    const deleted = await Notification.findByIdAndDelete(req.body.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }
    res.json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.body; // Lấy ID của thông báo cần đánh dấu

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Notification ID is required" });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true }, // Cập nhật trạng thái 'đã xem'
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res.json({ success: true, notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


//!Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, product, buyQuantity } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ ...product, buyQuantity }] });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId === product.productId
      );
      if (index > -1) {
        cart.items[index].buyQuantity += Number(buyQuantity);
      } else {
        cart.items.push({ ...product, buyQuantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error Add to Cart", error);
    res.status(500).json({ message: "Error server!", error });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const cart = await Cart.findOne({ userId });
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { productIds } = req.body;
    const userId = req.session.user.id;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Invalid productIds" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ suscess: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => !productIds.includes(item.productId.toString())
    );

    await cart.save();
    res.json({ suscess: true });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting items", error });
  }
};

//!Orders
export const addOrder = async (req, res) => {
  try {
    const { id, products, subtotal, totalPayment, address, status } = req.body;
    const userId = req.session.user.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Trừ số lượng tồn kho
    for (const item of products) {
      const product = await Product.findOne({ productId: item.productId });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      if (product.quantity < item.buyQuantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.productName}`,
        });
      }

      product.quantity -= item.buyQuantity;
      await product.save();
    }

    const order = new Order({
      orderId: id,
      userId: userId,
      items: products,
      total: subtotal,
      totalPayment: totalPayment,
      address: address,
      status: status,
    });

    await order.save();

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Add Order Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during add order",
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.session.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in.",
      });
    }

    const orders = await Order.find({
      userId: new mongoose.Types.ObjectId(userId),
    }); // userId là string, trùng với Order.userId

    if (!orders || orders.length === 0) {
      return res.json({
        success: false,
        message: "You haven't placed any orders yet.",
      });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
//!update
export const updateOrder = async (req, res) => {
  try {
    const {
      orderId: id,
      items: products,
      total: subtotal,
      totalPayment: totalPayment,
      status: status,
      reason: reason,
    } = req.body;

    const result = await Order.findOneAndUpdate(
      { orderId: id },
      {
        items: products,
        total: subtotal,
        totalPayment: totalPayment,
        status: status,
        cancelReason: reason,
      },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, product: result });
    if (status === "Cancelled") {
      for (const item of products) {
        const product = await Product.findOne({ productId: item.productId });
        if (product) {
          product.quantity += item.buyQuantity;
          await product.save();
        }
      }
    }
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getOrdersByAdmin = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders || orders.length === 0) {
      return res.json({
        success: false,
        message: "You haven't placed any orders yet.",
      });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};