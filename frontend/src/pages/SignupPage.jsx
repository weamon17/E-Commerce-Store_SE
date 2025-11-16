import React, { useState } from "react";
import BgAce from "../assets/giaodienlogin.png";
import InputUser from "../components/InputUser";
import "../Styles/main.css";
import { useNavigate } from "react-router-dom";
import { register } from "../services/handleAPI";
import Swal from "sweetalert2";

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // (Các bước kiểm tra giữ nguyên)
    if (!username || !email || !password || !repassword) {
      setError("Please do not leave blank!");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password !== repassword) {
      setError("Passwords don't match");
      return;
    }
    
    try {
      const data = await register(username, email, password, "Customer");

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "You have signed up successfully",
          confirmButtonColor: "#0284c7",
        }).then(() => navigate("/login"));
      } else {
        // --- BẮT ĐẦU THAY ĐỔI ---
        
        // Kiểm tra xem lỗi có phải là do 'Email' không
        if (data.message && data.message.includes("Email already exists")) {
          // Hiển thị thông báo "đẹp" bằng SweetAlert
          Swal.fire({
            icon: "warning", // Icon cảnh cáo
            title: "Email đã tồn tại", // Tiêu đề
            text: "Email bạn vừa nhập đã được đăng ký. Vui lòng sử dụng một email khác!", // Nội dung
            confirmButtonColor: "#ef4444", // Nút màu đỏ
          });
          // Xóa lỗi text cũ (nếu có)
          setError(""); 
        } 
        // Kiểm tra lỗi do 'Username'
        else if (data.message && data.message.includes("Username already exists")) {
          Swal.fire({
            icon: "warning",
            title: "Tên đăng nhập đã tồn tại",
            text: "Tên đăng nhập này đã được sử dụng. Vui lòng chọn một tên khác!",
            confirmButtonColor: "#ef4444",
          });
          setError("");
        } 
        // Nếu là lỗi khác, thì dùng thông báo text như cũ
        else {
          setError(data.message || "Sign up failed!");
        }
        // --- KẾT THÚC THAY ĐỔI ---
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  // (Phần return ... JSX ... giữ nguyên như cũ)
  // ...
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl w-full max-w-4xl">
        <div className="relative grid grid-cols-2 max-[900px]:grid-cols-1">
          <div className="flex justify-center items-center p-8 max-[900px]:hidden">
            <img
              onClick={() => navigate("/")}
              className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform rounded-2xl"
              src={BgAce}
              alt="Background"
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center w-full p-8 lg:p-16 space-y-6"
          >
            <h1 className="font-bold text-center text-3xl lg:text-4xl text-gray-800">
              Create your account
            </h1>
            <div className="flex flex-col gap-4 w-full">
              <InputUser
                name="User name"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-sky-600"
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
              />

              <InputUser
                name="Email"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-sky-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                }
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                    className="w-6 h-6 text-sky-600"
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
              />
              <InputUser
                name="Confirm password"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-sky-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                }
                placeholder="Re-enter your password"
                type="password"
                value={repassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
            </div>

            <div className="h-6">
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
            </div>

            <div className="flex w-full">
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold px-16 py-3 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Sign up
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>
                I have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                  type="button"
                >
                  Log in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;