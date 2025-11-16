import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  requestPasswordReset,
  confirmPasswordReset,
} from "../services/handleAPI"; // Import từ handleAPI
import InputUser from "../components/InputUser"; // Import component InputUser
import Swal from "sweetalert2";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); 

  // Bước 1: Gửi yêu cầu mã về email
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = await requestPasswordReset(email);
      if (data.success) {
        setMessage(
          "Mã xác nhận đã được gửi về email của bạn. Vui lòng kiểm tra."
        );
        setStep(2); // Chuyển sang bước 2
      } else {
        setError(data.message || "Email không tồn tại.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  // Bước 2: Xác nhận mã và đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (!code || !newPassword) {
      setError("Vui lòng nhập mã xác nhận và mật khẩu mới.");
      return;
    }
    try {
      const data = await confirmPasswordReset(email, code, newPassword);
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Mật khẩu của bạn đã được đặt lại. Vui lòng đăng nhập.",
        }).then(() => {
          navigate("/login"); // Chuyển về trang đăng nhập
        });
      } else {
        setError(data.message || "Mã xác nhận không đúng hoặc đã hết hạn.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl w-full max-w-md p-8">
        {step === 1 ? (
          // Form 1: Nhập Email
          <form onSubmit={handleRequestCode} className="flex flex-col gap-6">
            <h1 className="font-bold text-center text-3xl text-gray-800">
              Quên mật khẩu
            </h1>
            <p className="text-center text-gray-600">
              Nhập email của bạn để nhận mã đặt lại mật khẩu.
            </p>
            <InputUser
              name="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            {message && <p className="text-green-600 text-sm text-center">{message}</p>}
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold px-16 py-3 rounded-full"
            >
              Gửi mã
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-center text-sm text-sky-600 hover:underline"
              type="button"
            >
              Quay lại Đăng nhập
            </button>
          </form>
        ) : (
          // Form 2: Nhập Mã và Mật khẩu mới
          <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
            <h1 className="font-bold text-center text-3xl text-gray-800">
              Đặt lại mật khẩu
            </h1>
            <p className="text-center text-gray-600">
              Kiểm tra email của bạn và nhập mã xác nhận.
            </p>
            <InputUser
              name="Mã xác nhận"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
                    d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              }
            />
            <InputUser
              name="Mật khẩu mới"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              }
            />
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold px-16 py-3 rounded-full"
            >
              Xác nhận
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;