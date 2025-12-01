import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png"; 

const Header = () => {
  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-center px-4 md:px-8 transition-all duration-300
          ${isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-sm border-gray-200" 
            : "bg-white border-transparent"
          } border-b
        `}
      >
        <button 
          className="hover:opacity-80 transition-opacity flex items-center justify-center" 
          onClick={handleLogoClick}
        >
          <img
            src={logo}
            alt="Logo"
            className="h-20 md:h-24 w-auto object-contain"
          />
        </button>

        <div className="absolute right-4 md:right-8 flex items-center gap-2 md:gap-3">
          <button
            className="text-sky-600 text-sm md:text-base font-semibold px-3 py-1.5 rounded-md hover:bg-sky-50 transition-colors"
            onClick={() => (window.location.href = "/login")}
          >
            Log in
          </button>
          
          <button
            className="bg-sky-500 text-white text-sm md:text-base font-semibold px-4 py-2 rounded-md hover:bg-sky-600 shadow-sm transition-all hover:shadow-md"
            onClick={() => (window.location.href = "/signup")}
          >
            Sign up
          </button>
        </div>
      </header>

      <div className="h-20"></div> 
    </>
  );
};

export default Header;