import React, { useState } from "react";
import { countries } from "../Data/Countries";
import useInfo from "../Function/UseInfoUser.js"; 
import { useNavigate } from "react-router-dom";

const Infomation = () => {
  const navigate = useNavigate();
  const [isEditting, setIsEditting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null); // Dùng state để lưu ảnh tải lên

  const { info, handleChange, handleSave, handleCancel } = useInfo(); // Sử dụng custom hook

  const handleEdit = () => setIsEditting(!isEditting);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        handleChange(e);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-11/12 bg-white flex-col justify-center m-auto my-8 rounded-2xl">
      <div className="font-bold text-[20px] text-white w-full rounded-t-2xl py-3 text-center bg-gradient-to-r from-blue-600 to-blue-400">
        Welcome, {info.username}
      </div>
      <div className="avt flex">
        <div className="flex-none avt w-[100px] h-[100px] mx-8 my-4">
          <img
            className="fix-img rounded-full"
            src={
              uploadedImage ||
              (info.avatar
                ? `http://localhost:5000/${info.avatar.replace(/^\/+/, "")}`
                : null)
            }
            alt="Avatar"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className={`${!isEditting ? "hidden" : "flex mt-2"}`}
          />
        </div>
        <div className="grow flex flex-col justify-center gap-2">
          <p className="text-[20px] font-bold leading-none">{info.username}</p>
          <p className="text-gray-500 text-[13px] leading-none">{info.email}</p>
          <p className="text-white bg-blue-600 px-2 py-0.5 rounded-lg max-w-fit text-[12px]">
            {info.position}
          </p>
        </div>
        <div className="px-8 py-12">
          {!isEditting ? (
            <button
              className="px-5 py-2 rounded-lg font-semibold
                          bg-blue-600 text-white
                          border border-blue-600
                          hover:bg-white
                          active:bg-blue-100
                          hover:text-blue-600
                          transition-all duration-150"
              onClick={handleEdit}
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                className="px-5 py-2 rounded-lg font-semibold
                          bg-blue-600 text-white
                          border border-blue-600
                          hover:bg-white
                          active:bg-blue-100
                          hover:text-blue-600
                          transition-all duration-150"
                onClick={() => {
                  handleSave(); 
                  setIsEditting(!isEditting);
                }}
              >
                Save
              </button>
              <button
                className="px-5 py-2 rounded-lg font-semibold
                          bg-blue-600 text-white
                          border border-blue-600
                          hover:bg-white
                          active:bg-blue-100
                          hover:text-blue-600
                          transition-all duration-150"
                onClick={() => {
                  handleCancel(); // Đảm bảo gọi hàm handleCancel
                  setIsEditting(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-8">
        {[
          {
            label: "Full Name",
            type: "text",
            name: "yourname",
            value: info.yourname,
          },
          {
            label: "User Name",
            type: "text",
            name: "username",
            value: info.username,
          },
          {
            label: "Gender",
            type: "select",
            name: "gender",
            options: ["Select", "Male", "Female"],
            value: info.gender,
          },
          {
            label: "Birth of day",
            type: "date",
            name: "birthDay",
            value: info.birthDay,
          },
          {
            label: "Country",
            type: "select",
            name: "country",
            options: countries,
            value: info.country,
          },
          {
            label: "Address",
            type: "text",
            name: "address",
            value: info.address,
          },
        ].map((field, index) => (
          <div key={index} className="flex flex-col gap-3">
            <label>{field.label}</label>
            {field.type === "select" ? (
              <select
                disabled={!isEditting}
                name={field.name}
                value={field.value}
                className={`h-[50px] rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ${
                  isEditting
                    ? "bg-white border border-blue-400"
                    : "bg-[#F9F9F9] cursor-not-allowed text-gray-600"
                }`}
                onChange={handleChange}
              >
                {field.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                disabled={!isEditting}
                type={field.type}
                name={field.name}
                value={field.value || ""}
                placeholder={field.placeholder || ""}
                className={`h-[50px] rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ${
                  isEditting
                    ? "bg-white border border-blue-400"
                    : "bg-[#F9F9F9] cursor-not-allowed text-gray-600 placeholder:text-gray-600"
                }`}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col px-8 gap-2">
        <p className="font-bold flex-none">My email Address</p>
        <div className="flex gap-x-3 items-center pb-5">
          <div className="text-blue-600 bg-blue-100 w-9 h-9 rounded-full center hover:bg-blue-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
          </div>
          <div className="grow">
            <input
              disabled={!isEditting}
              type="text"
              name="email"
              value={info.email || ""}
              className={`${
                !isEditting
                  ? "bg-transparent outline-none w-3/12 border-b-2 px-2 h-[50px] cursor-not-allowed "
                  : "outline-none w-3/12 border-b-2 px-2 h-[50px] rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-[#F9F9F9] text-gray-500"
              } ${isEditting ? "bg-white border border-blue-400" : ""}`}
              onChange={handleChange}
            />
          </div>
          <button
            className="px-5 py-2 rounded-lg font-semibold
                          bg-blue-600 text-white
                          border border-blue-600
                          hover:bg-white
                          active:bg-blue-100
                          hover:text-blue-600
                          transition-all duration-150"
            onClick={() => {
              navigate("/change-password");
            }}
          >
            Change password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Infomation;
