import { useState, useEffect } from "react";

export default function Alert({ message, type = "info", onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000); // Tự động đóng sau 5 giây

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  let typeClasses = "";
  switch (type) {
    case "success":
      typeClasses = "bg-green-100 border border-green-400 text-green-700";
      break;
    case "error":
      typeClasses = "bg-red-100 border border-red-400 text-red-700";
      break;
    case "warning":
      typeClasses = "bg-yellow-100 border border-yellow-400 text-yellow-700";
      break;
    default: // 'info'
      typeClasses = "bg-blue-100 border border-blue-400 text-blue-700";
      break;
  }

  if (!isVisible) return null;

  return (
    <div
      className={`p-4 rounded-lg shadow-lg flex items-center justify-between z-[100] ${typeClasses}`}      
      role="alert"
    >
      <span className="font-medium">{message}</span>
      <button
        onClick={handleClose}
        className="ml-4 -mr-1 -my-1 p-1.5 rounded-md hover:bg-opacity-20"
        style={{ color: "inherit" }}
        aria-label="Close"
      >
        <svg
          className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
}