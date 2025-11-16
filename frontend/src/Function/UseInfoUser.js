import { useState, useEffect } from "react";
import { loadInfoUser, updateInfoUser, uploadImage } from "../services/handleAPI.js";
import Swal from "sweetalert2";

const useInfo = () => {
  const [info, setInfo] = useState({
    username: "",
    email: "",
    yourname: "",
    gender: "",
    birthDay: "",
    country: "",
    address: "",
    avatar: "",
    position: "",
  });

  const [initialInfo, setInitialInfo] = useState({});

  useEffect(() => {
    const getData = async () => {
      const data = await loadInfoUser();
      if (data.success) {
        const userInfo = {
          yourname: data.user.yourname,
          username: data.user.username,
          gender: data.user.gender,
          birthDay: data.user.birthDay?.split("T")[0] || "",
          country: data.user.country,
          address: data.user.address,
          email: data.user.email,
          position: data.user.position,
          avatar: data.user.avatar || "uploads/avt.png", // Mặc định ảnh đại diện
        };
        setInfo(userInfo);
        setInitialInfo(userInfo);
      }
    };
    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      setInfo((prevInfo) => ({
        ...prevInfo,
        avatar: files[0], 
      }));
    } else {
      setInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
  try {
    let avatarPath = info.avatar;
    if (info.avatar instanceof File) {
      const formData = new FormData();
      formData.append("image", info.avatar);  // Kiểm tra tệp có thực sự là File

      const res = await uploadImage(formData); // Sửa tên hàm, truyền đúng data
      if (res.success) {
        avatarPath = res.path; 
      } else {
        Swal.fire("Error", "Failed to upload avatar", "error");
        return;
      }
    }
    // Lưu thông tin người dùng với avatar đã upload
    const updatedInfo = { ...info, avatar: avatarPath };
    const data = await updateInfoUser(updatedInfo); 
    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "You have updated successfully",
        confirmButtonColor: "skyblue",
      });
    } else {
      console.log(data.message);
    }
  } catch (err) {
    console.log(err);
    Swal.fire("Error", "Something went wrong", "error");
  }
};

  const handleCancel = () => {
    setInfo(initialInfo); 
  };

  return {
    info,
    setInfo,
    initialInfo,
    handleChange,
    handleSave,
    handleCancel,
  };
};

export default useInfo;
