import React, { useState } from "react";
import BgAce from "../assets/giaodienlogin.png";
import InputUser from "../components/InputUser";
import "../Styles/main.css";
import { useNavigate } from "react-router-dom";
// [Cite: 1] Import API
import { register, sendVerifyEmail, verifyEmailCode } from "../services/handleAPI";
import Swal from "sweetalert2";

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [error, setError] = useState("");

  // --- STATE CHO VERIFICATION ---
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Dùng chung cho cả gửi mail và xác thực

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // --- BƯỚC 1: GỬI MÃ XÁC THỰC ---
  const handlePreSubmit = async (e) => {
    e.preventDefault();

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

    setIsLoading(true);
    setError("");

    try {
      // Gọi API gửi mã [Cite: 1]
      const res = await sendVerifyEmail(email);
      
      if (res.success) {
        Swal.fire({
            icon: "info",
            title: "Check your email",
            text: `We have sent a verification code to ${email}`,
            timer: 3000,
            showConfirmButton: false
        });
        setShowVerifyModal(true);
      } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: res.message || "Could not send verification email.",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Error sending verification email.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- BƯỚC 2: XÁC THỰC MÃ & ĐĂNG KÝ ---
  const handleVerifyAndRegister = async () => {
    if (!verificationCode) {
        Swal.fire("Warning", "Please enter the code", "warning");
        return;
    }

    setIsLoading(true); // Bắt đầu loading khi bấm Verify

    try {
        // 1. Kiểm tra mã OTP [Cite: 1]
        const verifyRes = await verifyEmailCode(email, verificationCode);

        if (!verifyRes.success) {
            setIsLoading(false); // Tắt loading để nhập lại
            Swal.fire({
                icon: "error",
                title: "Invalid Code",
                text: "The code you entered is incorrect or expired.",
            });
            return;
        }

        // 2. Nếu mã đúng -> Gọi API Đăng ký [Cite: 1]
        const data = await register(username, email, password, "Customer");

        if (data.success) {
            setShowVerifyModal(false);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "You have signed up successfully",
                confirmButtonColor: "#0284c7",
            }).then(() => navigate("/login"));
        } else {
            // Xử lý lỗi đăng ký (trùng user/email sau khi đã verify)
            setIsLoading(false); 
            setShowVerifyModal(false); // Tắt modal để sửa thông tin
            
            if (data.message && data.message.includes("Email already exists")) {
                Swal.fire("Warning", "Email already exists!", "warning");
            } else if (data.message && data.message.includes("Username already exists")) {
                Swal.fire("Warning", "Username already exists!", "warning");
            } else {
                setError(data.message || "Sign up failed!");
            }
        }
    } catch (err) {
        console.error(err);
        setIsLoading(false);
        Swal.fire("Error", "An unexpected error occurred.", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4 relative">
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl w-full max-w-4xl relative z-10">
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
            onSubmit={handlePreSubmit}
            className="flex flex-col justify-center w-full p-8 lg:p-16 space-y-6"
          >
            <h1 className="font-bold text-center text-3xl lg:text-4xl text-gray-800">
              Create your account
            </h1>
            <div className="flex flex-col gap-4 w-full">
              <InputUser
                name="User name"
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-sky-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-sky-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-sky-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-sky-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
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
                disabled={isLoading}
                className={`w-full text-white font-bold px-16 py-3 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none 
                ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700"}`}
              >
                {isLoading ? "Processing..." : "Sign up"}
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

      {/* --- MODAL NHẬP MÃ VERIFY --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Email Verification</h2>
            <p className="mb-4 text-gray-600 text-center text-sm">
              Please enter the 6-digit code sent to <br/>
              <span className="font-semibold text-sky-600">{email}</span>
            </p>
            
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-lg p-3 text-center text-xl tracking-widest focus:border-sky-500 focus:outline-none mb-6"
              placeholder="123456"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
            />

            <div className="flex gap-3">
                <button
                    type="button" 
                    onClick={() => {
                        setShowVerifyModal(false);
                        setVerificationCode(""); // Reset mã khi tắt
                        setIsLoading(false);
                    }}
                    className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleVerifyAndRegister}
                    disabled={isLoading}
                    className={`flex-1 py-2 rounded-lg text-white font-bold transition shadow-lg
                        ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700"}`}
                >
                    {isLoading ? "Checking..." : "Verify"}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;