import React, { useState } from "react";
import BgAce from "../assets/giaodienlogin.png";
import InputUser from "../components/InputUser";
import "../Styles/main.css"; 
import { useNavigate } from "react-router-dom";
import { login } from "../services/handleAPI";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in both fields!");
      return;
    }
    try {
      const data = await login(username, password);
      if (data.success) {
        data.position === "Customer"
          ? navigate("/dashboard-customer")
          : data.position === "Admin"
          ? navigate("/dashboard-admin")
          : navigate("/dashboard-customer");
      } else {
        setError(data.message || "Login failed!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sky-50 p-4">
      <div className="rounded-3xl overflow-hidden shadow-2xl bg-white">
        <div className="relative grid grid-cols-2 max-lg:grid-cols-1 w-full max-w-4xl h-auto">
          <div className="flex justify-center items-center p-6 max-lg:hidden">
            <img
              onClick={() => navigate("/")}
              className="h-full w-full object-cover cursor-pointer hover:scale-95 transition-transform rounded-3xl"
              src={BgAce}
              alt="Background"
            />
          </div>
          
          <form className="flex flex-col gap-6 justify-center w-full lg:w-[400px] p-8 md:p-12 mx-auto h-full">
            <h1 className="font-semibold text-center text-3xl lg:text-4xl text-sky-800 whitespace-nowrap pt-10">
              Welcome to TechSync 
            </h1>
            <div className="flex flex-col gap-6 w-full">
              <InputUser
                name="User name"
                icon={
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
                }
                placeholder="Enter user name"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
              />
              <InputUser
                name="Password"
                icon={
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
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                }
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
              />
            </div>
            {/* THAY ĐỔI: Giữ màu đỏ cho lỗi, nhưng thêm 'text-sm' */}
            {error ? (
              <p className="text-red-500 text-sm -my-4">{error}</p>
            ) : (
              <p className="text-red-500 -my-4 h-5"></p> // Giữ chiều cao
            )}
            <div className="flex w-full">
              {/* THAY ĐỔI: Thay 'btn-error' bằng các lớp Tailwind màu xanh */}
              <button
                className="w-full py-3 px-6 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors duration-200"
                onClick={handleSubmit}
              >
                Log in
              </button>
            </div>
            {/* THAY ĐỔI: Bỏ '-mt-6' để dùng 'gap' tự nhiên, căn giữa text */}
            <div className="flex flex-col items-center text-sm text-gray-500 mb-6">
              {/* THAY ĐỔI: Đổi màu link 'hover' */}
              <button
                onClick={() => navigate("/reset-password")}
                className="text-gray-500 hover:text-sky-600 hover:underline transition-colors"
                type="button"
              >
                Forgot your password?
              </button>
              <p className="mt-2">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-sky-600 font-medium hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;