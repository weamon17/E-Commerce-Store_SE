import React, { useState } from "react";
import logo from "../assets/logo.png";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/handleAPI.js";
import useInfo from "../Function/UseInfoUser.js"; // Import custom hook
import BackToTop from "../components/Button/BackToTop.jsx";
import { useEffect } from "react";

const Icon = ({ children, onClick, className = "" }) => (
  <button onClick={onClick} className={` ${className}`}>
    {children}
  </button>
);

const HeaderAdmin = ({ stylePro }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [backToTop, setBackToTop] = useState(false);
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

  const navigate = useNavigate();
  const location = useLocation();
  const { info } = useInfo();
  const [menuOpen, setMenuOpen] = useState(false); // State for toggling menu

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This action cannot be undone",
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const res = await logout();
      if (res.success) navigate("/");
      else console.log(res.message);
    }
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "underline text-red-600" // Gạch chân khi mục được chọn
      : "text-black hover:text-red-600"; // Mặc định màu text đỏ
  };

  return (
    <header
      className={`relative flex justify-between items-center p-5 bg-white ${
        isScrolled ? " shadow-md" : ""
      }`}
    >
      {backToTop && <BackToTop />}
      <button className="flex items-center">
        <img
          src={logo}
          alt="logo"
          onClick={() => navigate("/dashboard-admin")}
          className="min-w-[127px] h-[55px] overflow-hidden hover:scale-105"
        />
      </button>

      {/* Menu Links */}
      <div className="flex-1  justify-center gap-10 text-lg hidden xl:flex">
        <div
          className={`text-red-600 hover:translate-y-[-5px] font-bold cursor-pointer ${getLinkClass(
            "/manage-staff"
          )}`}
          onClick={() => navigate("/manage-staff")}
        >
          Staff
        </div>
        <div
          className={`text-red-600 hover:translate-y-[-5px] font-bold cursor-pointer ${getLinkClass(
            "/manage-customer"
          )}`}
          onClick={() => navigate("/manage-customer")}
        >
          Customer
        </div>
        <div
          className={`text-red-600 hover:translate-y-[-5px] font-bold cursor-pointer ${getLinkClass(
            "/manage-product"
          )}`}
          onClick={() => navigate("/manage-product")}
        >
          Product
        </div>
        <div
          className={`text-red-600 hover:translate-y-[-5px] font-bold cursor-pointer ${getLinkClass(
            "/manage-noti"
          )}`}
          onClick={() => navigate("/manage-noti")}
        >
          Notification
        </div>
        <div
          className={`text-red-600 hover:translate-y-[-5px] font-bold cursor-pointer ${getLinkClass(
            "/manage-order"
          )}`}
          onClick={() => navigate("/manage-order")}
        >
          Order
        </div>
      </div>

      {/* Responsive Menu Button */}
      <button
        className="block xl:hidden p-2 text-red-600"
        onClick={() => setMenuOpen(!menuOpen)}
      >
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Menu Links (for mobile view) */}
      {menuOpen && (
        <div className="absolute top-16 right-4 w-[250px] bg-white shadow-lg rounded-xl flex flex-col items-center gap-4 py-4 xl:hidden z-50 border">
          <div
            className={`font-bold cursor-pointer ${getLinkClass(
              "/manage-staff"
            )}`}
            onClick={() => {
              navigate("/manage-staff");
              setMenuOpen(false);
            }}
          >
            Staff
          </div>
          <div
            className={`font-bold cursor-pointer ${getLinkClass(
              "/manage-customer"
            )}`}
            onClick={() => {
              navigate("/manage-customer");
              setMenuOpen(false);
            }}
          >
            Customer
          </div>
          <div
            className={`font-bold cursor-pointer ${getLinkClass(
              "/manage-product"
            )}`}
            onClick={() => {
              navigate("/manage-product");
              setMenuOpen(false);
            }}
          >
            Product
          </div>
          <div
            className={`font-bold cursor-pointer ${getLinkClass(
              "/manage-noti"
            )}`}
            onClick={() => {
              navigate("/manage-noti");
              setMenuOpen(false);
            }}
          >
            Notification
          </div>
          <div
            className={`font-bold cursor-pointer ${getLinkClass(
              "/manage-order"
            )}`}
            onClick={() => {
              navigate("/manage-order");
              setMenuOpen(false);
            }}
          >
            Order
          </div>

          {/* Profile button */}
          <div
            className="font-bold text-black cursor-pointer hover:text-red-600"
            onClick={() => {
              navigate("/profile-admin");
              setMenuOpen(false);
            }}
          >
            {info.username}
          </div>

          <div
            className="font-bold text-red-600 cursor-pointer hover:underline"
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
          >
            Log out
          </div>
        </div>
      )}

      {/* Profile & Logout (Hidden on mobile) */}
      <div className="hidden xl:flex gap-10 items-center">
        <Icon
          className={`Profile ${stylePro} center`}
          onClick={() => navigate("/profile-admin")}
        >
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
          {info.username}
        </Icon>
        <button
          onClick={handleLogout}
          className="btn-error px-5 py-2 rounded-lg whitespace-nowrap"
        >
          Log out
        </button>
      </div>
    </header>
  );
};

export default HeaderAdmin;
