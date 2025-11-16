import React, { useState, useEffect, useRef } from "react";
import "../Styles/main.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  logout,
  loadInfoNotifications,
  markNotificationAsRead,
} from "../services/handleAPI.js";
import Swal from "sweetalert2";
import useInfo from "../Function/UseInfoUser.js";
import BackToTop from "../components/Button/BackToTop.jsx";
import BoxSearch from "../components/Button/BoxSearch.jsx";
import Alert from "../components/Alert.jsx";
import ChatBubble from "../components/ChatBubble.jsx"; 

const Icon = ({ children, onClick, className = "" }) => (
  <button onClick={onClick} className={`hover:scale-110 ${className}`}>
    {children}
  </button>
);

const HeaderCustomer = ({ stylePro, styleCart, styleOrder }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [backToTop, setBackToTop] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { info } = useInfo();
  const [isClickNotifi, setIsClickNotifi] = useState(false);
  const [productCart, setProductCart] = useState([]);

  // --- LOGIC THÔNG BÁO ---
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [popupAlert, setPopupAlert] = useState(null); // Giờ sẽ là object: {id, message, type}
  const isFirstNotificationFetch = useRef(true);
  // -------------------------

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
        if (window.scrollY > 500) {
          setBackToTop(true);
        }
      } else {
        setIsScrolled(false);
        setBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const data = await logout();
      
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Đã đăng xuất",
          text: "Bạn đã đăng xuất thành công.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Đăng xuất thất bại",
          text: data.message || "Đã có lỗi xảy ra.",
          confirmButtonColor: "#4f46e5",
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi...",
        text: "Đã có lỗi xảy ra khi đăng xuất!",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  const fetchCart = async () => {
    try {
      const myCart = await getCart();
      setProductCart(myCart.items);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

  const checkNotifications = async () => {
    try {
      const data = await loadInfoNotifications();
      if (!data.success) return;

      const newNotifications = data.notifications;
      const newUnreadCount = data.unreadCount;

      setUnreadCount(newUnreadCount);

      setNotifications((prevNotifications) => {
        if (isFirstNotificationFetch.current) {
          isFirstNotificationFetch.current = false;
          return newNotifications;
        }

        if (newNotifications.length > 0) {
          const newestNotif = newNotifications[0];
          const isAlreadyPresent = prevNotifications.some(
            (prevNotif) => prevNotif._id === newestNotif._id
          );

          const dismissedId = localStorage.getItem('dismissedNotificationId');

          if (!isAlreadyPresent && newestNotif._id !== dismissedId) {
            setPopupAlert({
              id: newestNotif._id, 
              message: `Thông báo mới: ${newestNotif.title}`,
              type: "info",
            });
          }
        }
        return newNotifications;
      });
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  };

  // useEffect để fetch giỏ hàng (chỉ 1 lần khi load)
  useEffect(() => {
    fetchCart();
  }, []);

  // LẮNG NGHE SỰ KIỆN CẬP NHẬT GIỎ HÀNG
  useEffect(() => {
    const handleCartUpdate = () => {
      console.log("Đã nhận tín hiệu cartUpdated! Đang fetch lại giỏ hàng...");
      fetchCart();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // useEffect để "lắng nghe" thông báo mới
  useEffect(() => {
    checkNotifications();
    const intervalId = setInterval(checkNotifications, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (popupAlert) {
      localStorage.setItem('dismissedNotificationId', popupAlert.id);
    }
    setPopupAlert(null);

    if (!notification.isRead) {
      setUnreadCount((prevCount) => prevCount - 1);
      setNotifications((prevNotis) =>
        prevNotis.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n
        )
      );
      try {
        await markNotificationAsRead(notification._id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
  };

  return (
    <>
      {popupAlert && (
        <div className="fixed bottom-6 right-6 z-50">
          <Alert
            message={popupAlert.message}
            type={popupAlert.type}
            onClose={() => {
              localStorage.setItem('dismissedNotificationId', popupAlert.id);
              setPopupAlert(null);
            }}
          />
        </div>
      )}

      <header
        className={`relative flex gap-5 p-5 bg-white ${
          isScrolled ? "shadow-md" : ""
        } `}
      >
        {backToTop && <BackToTop />}
        
        <button className="center">
          <img
            src={logo}
            alt="logo"
            onClick={() => navigate("/dashboard-customer")}
            className="min-w-[127px] h-[55px] overflow-hidden hover:scale-105"
          />
        </button>

        <BoxSearch></BoxSearch>

        {/* =================== GIAO DIỆN MÁY TÍNH =================== */}
        <div className="center gap-10 max-lg:hidden ">
          <Icon
            className={`Orders ${styleOrder} center`}
            onClick={() => navigate("/my-orders")}
          >
            {/* ... (Orders SVG) ... */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
            Orders
          </Icon>
          <div>
            <Icon
              className="Notification btn-line relative"
              onClick={() => {
                setIsClickNotifi(!isClickNotifi);
              }}
            >
              {/* ... (Notification SVG) ... */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>
              )}
            </Icon>
            <div
              className={`absolute right-24 mt-2 w-80 max-h-64 bg-white rounded-xl shadow-xl overflow-y-auto z-50 ${
                isClickNotifi ? "block" : "hidden"
              }`}
            >
              <h2 className="px-4 py-2 text-lg font-semibold text-sky-600 border-b">
                {notifications.length > 0
                  ? "Notification"
                  : "No notification "}
              </h2>
              {notifications.map((noti) => (
                <div
                  key={noti._id}
                  className={`flex items-start gap-3 px-4 py-2 border-b cursor-pointer ${
                    noti.isRead
                      ? "bg-white hover:bg-gray-50"
                      : "bg-sky-50 hover:bg-sky-100 font-medium"
                  }`}
                  onClick={() => handleNotificationClick(noti)}
                >
                  <div
                    className={`p-2 rounded-full ${
                      noti.isRead
                        ? "bg-gray-100 text-gray-500"
                        : "bg-sky-100 text-sky-600"
                    }`}
                  >
                    {/* ... (Notification item SVG) ... */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022 23.848 23.848 0 005.455 1.31m5.714 0a3 3 0 11-5.714 0"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm">{noti.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {noti.content}
                    </p>
                  </div>
                  {!noti.isRead && (
                    <span className="w-2 h-2 bg-sky-500 rounded-full self-center"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Icon
            className={`Cart ${styleCart} flex items-center relative`}
            onClick={() => navigate("/my-cart")}
          >
            {/* ... (Cart SVG) ... */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            Cart
            {productCart && productCart.length > 0 && (
              <div className="w-4 h-4 bg-sky-500 rounded-full text-white  center absolute -top-1 left-[10px]">
                <p className="text-[10px]">{productCart.length}</p>
              </div>
            )}
          </Icon>

          <Icon
            className={`Profile ${stylePro}`}
            onClick={() => navigate("/profile-customer")}
          >
            {/* ... (Profile SVG) ... */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </Icon>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg whitespace-nowrap font-medium hover:bg-red-700 transition-colors duration-200"
          >
            Log out
          </button>
        </div>

        {/* =================== GIAO DIỆN DI ĐỘNG =================== */}
        <div className="flex items-center ml-auto lg:hidden text-sky-600">
          <Icon onClick={() => setMenuOpen(!menuOpen)}>
            {/* ... (Mobile Menu Icon) ... */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </Icon>
        </div>

        {/* *** ĐÂY LÀ PHẦN ĐÃ ĐƯỢC SỬA *** */}
        {menuOpen && (
          <div className="absolute top-20 right-5 mt-2 w-40 bg-white shadow-lg rounded-lg py-2  flex-col z-50 max-lg:flex hidden">
            <button
              onClick={() => {
                navigate("/my-orders");
                setMenuOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 text-left"
            >
              Orders
            </button>
            <button
              onClick={() => {
                navigate("/my-cart");
                setMenuOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 text-left"
            >
              Cart
            </button>
            <button
              onClick={() => {
                navigate("/profile-customer");
                setMenuOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 text-left"
            >
              Profile (User)
            </button>
            <button
              onClick={() => {
                // Mở thông báo và đóng menu
                setIsClickNotifi(true); 
                setMenuOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 text-left"
            >
              Notification
            </button>
          </div>
        )}
      </header>
      <ChatBubble />
    </>
  );
};

export default HeaderCustomer;