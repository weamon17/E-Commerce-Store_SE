import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png"; 

const BackToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 bg-sky-300 text-white p-3 rounded-full shadow-lg hover:bg-sky-400 transition-all duration-200 z-50"
      aria-label="Back to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [backToTop, setBackToTop] = useState(false);

  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      }

      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      if (window.scrollY > 500) {
          setBackToTop(true);
      } else {
          setBackToTop(false);
      }

      setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {backToTop && <BackToTop />}
      
      <header
        ref={headerRef}
        className={`grid grid-cols-3 items-center gap-4 py-2 px-4 md:px-10 lg:px-20 
          fixed top-0 left-0 right-0 z-30 transition-transform duration-300 ease-in-out
          transition-colors
          ${isScrolled ? "bg-sky-300 shadow-md" : "bg-transparent"}
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* --- MỚI: Cột 1 (Trái) - Trống --- */}
        <div></div>

        {/* --- MỚI: Cột 2 (Giữa) - Logo --- */}
        <div className="flex justify-center">
          <button className="center" onClick={handleLogoClick}>
            <img
              src={logo}
              alt="Logo"
              className="min-w-[200px] h-[150px] overflow-hidden hover:scale-105 transition-transform duration-200 rounded-md"
            />
          </button>
        </div>

        {/* --- MỚI: Cột 3 (Phải) - Các nút (căn phải) --- */}
        <div className="flex items-center justify-end gap-2 ">
          {/* Nút 'Log in' */}
          <button
            className="bg-white text-sky-500 px-5 py-2 rounded-lg whitespace-nowrap max-md:hidden hover:bg-gray-100 transition-colors duration-200 font-medium"
            onClick={() => (window.location.href = "/login")}
          >
            Log in
          </button>
          
          {/* Nút 'Sign up' (với logic đổi màu) */}
          <button
            className={`border px-4 py-2 rounded-lg whitespace-nowrap max-md:hidden transition-colors duration-200 font-medium
              ${isScrolled 
                ? 'border-white text-white hover:bg-white hover:text-sky-500' 
                : 'border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white'
              }
            `}
            onClick={() => (window.location.href = "/signup")}
          >
            Sign up
          </button>
          
          {/* Biểu tượng menu di động (với logic đổi màu) */}
          <div
            className={`hidden max-md:flex items-center cursor-pointer transition-colors duration-200
              ${isScrolled ? 'text-white' : 'text-sky-500'}
            `}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon />
          </div>
        </div>
      </header>

      {/* div đệm vẫn sử dụng chiều cao động */}
      <div style={{ height: `${headerHeight}px` }}></div>

      {/* Menu di động (giữ nguyên nền xanh pastel để dễ đọc) */}
      {isMenuOpen && (
        <div className="flex flex-col md:hidden absolute top-20 right-5 mt-2 w-32 bg-sky-300 shadow-lg rounded-lg p-2 gap-2 z-40">
          <div
            className="bg-white text-sky-500 text-center rounded-md px-2 py-2 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => (window.location.href = "/login")}
          >
            <LoginButton />
          </div>
          <div
            className="border border-white text-white text-center rounded-md px-2 py-2 hover:bg-white hover:text-sky-500 transition-colors duration-200"
            onClick={() => (window.location.href = "/signup")}
          >
            <SignupButton />
          </div>
        </div>
      )}
    </>
  );
};

// --- Các component hỗ trợ ---
const LoginButton = () => (
  <button className="w-full h-full font-medium">Log in</button>
);
const SignupButton = () => (
  <button className="w-full h-full font-medium">Sign up</button>
);

// --- Icons ---
const XIcon = () => (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SearchIcon = () => (
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
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

const MenuIcon = () => (
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
);

export default Header;