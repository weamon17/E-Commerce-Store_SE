import React, { useState } from "react";
import { setPassword } from "../services/handleAPI";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ChangePass = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error on new submission
    setError("");

    // Kiểm tra nếu mật khẩu mới và xác nhận mật khẩu không khớp
    if (newPassword !== repassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Gọi API để thay đổi mật khẩu
      const isChangePass = await setPassword(oldPassword, newPassword);
      console.log(isChangePass);
      if (!isChangePass.success) {
        setError(isChangePass.message); // Hiển thị lỗi nếu không thành công
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "You have changed your password successfully",
          confirmButtonColor: "#3085d6", // Changed button color to blue
        }).then(() => navigate("/profile-customer"));
      }
    } catch (err) {
      console.log("ERROR", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    // Use a light gray background for a more professional look
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          {/* Lock Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-blue-600"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-blue-700 text-3xl font-bold text-center">
            Change Password
          </h2>
        </div>

        {/* Increased vertical spacing in the form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter current password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={repassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Confirm new password"
              required
            />
          </div>

          {/* Error message remains red for clear visual warning */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePass;