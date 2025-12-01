import React, { useState, useEffect, useRef } from "react";
import "../Styles/main.css";
import logo from "../assets/logo.png";
// --- MỚI: Import ảnh avatar mặc định từ assets ---
import defaultAvt from "../assets/avt.png"; 

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
  <button onClick={onClick} className={`hover:scale-110 transition-transform ${className}`}>
    {children}
  </button>
);

const HeaderCustomer = ({ stylePro, styleCart, styleOrder }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [backToTop, setBackToTop] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [showProfileMenu, setShowProfileMenu] = useState(false); 
  
  const { info } = useInfo();
  
  const [isClickNotifi, setIsClickNotifi] = useState(false);
  const [productCart, setProductCart] = useState([]);

  // --- LOGIC THÔNG BÁO ---
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [popupAlert, setPopupAlert] = useState(null);
  const isFirstNotificationFetch = useRef(true);

  const profileMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
        if (window.scrollY > 500) setBackToTop(true);
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
          text: "Hẹn gặp lại bạn!",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({ icon: "error", title: "Lỗi", text: data.message });
      }
    } catch (err) {
      console.error("Logout error:", err);
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
      setUnreadCount(data.unreadCount);
      setNotifications((prev) => {
        if (isFirstNotificationFetch.current) {
          isFirstNotificationFetch.current = false;
          return data.notifications;
        }
        if (data.notifications.length > 0) {
          const newest = data.notifications[0];
          const isExist = prev.some((n) => n._id === newest._id);
          const dismissedId = localStorage.getItem('dismissedNotificationId');
          if (!isExist && newest._id !== dismissedId) {
            setPopupAlert({
              id: newest._id, 
              message: `Thông báo mới: ${newest.title}`,
              type: "info",
            });
          }
        }
        return data.notifications;
      });
    } catch (err) {
      console.error("Error notifications:", err);
    }
  };

  useEffect(() => { fetchCart(); }, []);
  
  useEffect(() => {
    const handleCartUpdate = () => fetchCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  useEffect(() => {
    checkNotifications();
    const intervalId = setInterval(checkNotifications, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (popupAlert) localStorage.setItem('dismissedNotificationId', popupAlert.id);
    setPopupAlert(null);
    if (!notification.isRead) {
      setUnreadCount((prev) => prev - 1);
      setNotifications((prev) => prev.map((n) => n._id === notification._id ? { ...n, isRead: true } : n));
      try { await markNotificationAsRead(notification._id); } catch (e) {}
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

      <header className={`relative flex gap-5 p-4 md:p-5 bg-white items-center justify-between ${isScrolled ? "shadow-md sticky top-0 z-40" : ""}`}>
        {backToTop && <BackToTop />}
        
        {/* LOGO */}
        <button className="center shrink-0">
          <img
            src={logo}
            alt="logo"
            onClick={() => navigate("/dashboard-customer")}
            className="w-[100px] md:w-[127px] h-auto object-contain hover:scale-105 transition-transform"
          />
        </button>

        {/* SEARCH BOX */}
        <div className="flex-1 max-w-2xl mx-4">
            <BoxSearch />
        </div>

        {/* =================== GIAO DIỆN MÁY TÍNH =================== */}
        <div className="center gap-6 lg:gap-8 max-lg:hidden shrink-0">
          
          {/* ORDERS */}
          <Icon className={`Orders ${styleOrder} center flex-col gap-1`} onClick={() => navigate("/my-orders")}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <span className="text-xs font-medium">Orders</span>
          </Icon>

          {/* NOTIFICATION */}
          <div className="relative">
            <Icon className="Notification btn-line relative flex-col gap-1" onClick={() => setIsClickNotifi(!isClickNotifi)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {unreadCount > 0 && <span className="absolute top-0 right-2 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white"></span>}
              <span className="text-xs font-medium">Notify</span>
            </Icon>
            {/* Dropdown Notification */}
            <div className={`absolute right-0 mt-3 w-80 max-h-96 bg-white rounded-xl shadow-xl overflow-hidden z-50 border border-gray-100 origin-top-right transition-all duration-200 ${isClickNotifi ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
               <h2 className="px-4 py-3 text-sm font-bold text-gray-700 border-b bg-gray-50">Notifications</h2>
               <div className="overflow-y-auto max-h-80">
                  {notifications.map((noti) => (
                    <div key={noti._id} className={`flex gap-3 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${!noti.isRead ? "bg-sky-50/50" : ""}`} onClick={() => handleNotificationClick(noti)}>
                       <div className={`shrink-0 w-2 h-2 mt-2 rounded-full ${!noti.isRead ? "bg-sky-500" : "bg-transparent"}`}></div>
                       <div>
                          <h3 className={`text-sm ${!noti.isRead ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}>{noti.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{noti.content}</p>
                       </div>
                    </div>
                  ))}
                  {notifications.length === 0 && <p className="text-center py-6 text-gray-500 text-sm">No notifications</p>}
               </div>
            </div>
          </div>

          {/* CART */}
          <Icon className={`Cart ${styleCart} relative flex-col gap-1`} onClick={() => navigate("/my-cart")}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {productCart?.length > 0 && (
              <span className="absolute -top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                {productCart.length}
              </span>
            )}
            <span className="text-xs font-medium">Cart</span>
          </Icon>

          {/* --- AVATAR USER & DROPDOWN --- */}
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)} 
              className="flex items-center gap-2 focus:outline-none group"
            >
              <img
                src={info?.avatar || defaultAvt}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-sky-500 transition-all shadow-sm"
              />
              <div className="text-left hidden xl:block">
                  <p className="text-sm font-bold text-gray-700 group-hover:text-sky-600 transition-colors">
                    {info?.username ? info.username.split(" ")[0] : "User"}
                  </p>
                  <p className="text-[10px] text-gray-500">Member</p>
              </div>
            </button>

            {/* Menu thả xuống Desktop */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-up">
                <div className="px-4 py-3 border-b border-gray-100 mb-2 bg-gray-50/50">
                   <p className="text-sm font-bold text-gray-800 truncate">{info?.username || "Guest"}</p>
                   <p className="text-xs text-gray-500 truncate">{info?.email || "No email"}</p>
                </div>
                <button 
                  onClick={() => navigate("/profile-customer")}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-3 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  My Profile
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =================== GIAO DIỆN DI ĐỘNG =================== */}
        <div className="lg:hidden flex items-center">
           <button onClick={() => setMenuOpen(!menuOpen)} className="text-sky-600 p-2">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
             </svg>
           </button>
        </div>

        {/* MENU MOBILE */}
        {menuOpen && (
          <div className="absolute top-20 right-5 mt-2 w-56 bg-white shadow-xl rounded-xl py-2 flex flex-col z-50 lg:hidden border border-gray-100 animate-fade-in-up">
            <div className="px-4 py-3 border-b mb-1 bg-gray-50 flex items-center gap-3">
               <img 
                 // --- SỬA: Dùng defaultAvt đã import ---
                 src={info?.avatar || defaultAvt} 
                 className="w-8 h-8 rounded-full object-cover" 
                 alt="avt" 
               />
               <div className="overflow-hidden">
                 <p className="text-sm font-bold text-gray-800 truncate">{info?.username || "User"}</p>
                 <p className="text-xs text-gray-500 truncate">Member</p>
               </div>
            </div>

            <button onClick={() => { navigate("/my-orders"); setMenuOpen(false); }} className="px-4 py-3 hover:bg-gray-50 text-left text-sm font-medium text-gray-700 flex items-center gap-3">
              <span>📦</span> My Orders
            </button>
            <button onClick={() => { navigate("/my-cart"); setMenuOpen(false); }} className="px-4 py-3 hover:bg-gray-50 text-left text-sm font-medium text-gray-700 flex items-center gap-3">
              <span>🛒</span> Shopping Cart
            </button>
            <button onClick={() => { navigate("/profile-customer"); setMenuOpen(false); }} className="px-4 py-3 hover:bg-gray-50 text-left text-sm font-medium text-gray-700 flex items-center gap-3">
              <span>👤</span> My Profile
            </button>
            <button onClick={() => { setIsClickNotifi(true); setMenuOpen(false); }} className="px-4 py-3 hover:bg-gray-50 text-left text-sm font-medium text-gray-700 flex items-center gap-3">
              <span>🔔</span> Notifications
            </button>
            
            <div className="border-t my-1"></div>
            
            <button onClick={handleLogout} className="px-4 py-3 hover:bg-red-50 text-left text-sm font-bold text-red-600 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Log out
            </button>
          </div>
        )}
      </header>
      <ChatBubble />
    </>
  );
};

export default HeaderCustomer;