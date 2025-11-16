import React, { useState, useEffect } from "react";
import HdAdmin from "../layouts/HeaderAdmin";
import { CheckUser } from "../Function/CheckUser";
import {
  loadInfoStaff,
  addStaffs,
  updateInfoByAd,
  deleteUser,
} from "../services/handleAPI";
import InputUser from "../components/InputUser";
import Swal from "sweetalert2";

// Reusable Icon Button
const Icon = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

// Reusable Modal Component
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
    <div className="bg-white shadow-2xl rounded-lg w-full max-w-lg p-6 relative mx-4 sm:mx-0 max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-2xl"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

const ManageStaff = () => {
  const [isEditting, setIsEditting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [gender, setGender] = useState("");
  const [yourname, setName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [repassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    yourname: "",
    birthDay: "",
    gender: "",
    email: "",
    phoneNum: "",
    address: "",
  });
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  CheckUser("Admin");

  const resetAddForm = () => {
    setUsername("");
    setPassword("");
    setRePassword("");
    setAddress("");
    setBirthDay("");
    setEmail("");
    setGender("");
    setName("");
    setPhoneNum("");
    setError("");
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    resetAddForm();
    setEditForm({
      username: "",
      yourname: "",
      birthDay: "",
      gender: "",
      email: "",
      phoneNum: "",
      address: "",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !username ||
      !password ||
      !repassword ||
      !gender ||
      !yourname ||
      !birthDay ||
      !address ||
      !email ||
      !phoneNum
    ) {
      setError("Please do not leave blank!");
      return;
    }

    if (password !== repassword) {
      setError("Passwords don't match");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email is invalid!");
      return;
    }

    try {
      const data = await addStaffs(
        username,
        password,
        "Staff",
        email,
        yourname,
        birthDay,
        address,
        gender,
        phoneNum
      );
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "You have added a new staff member.",
          confirmButtonColor: "#4f46e5",
        }).then(() => {
          closeFormModal();
          loadData(); // refresh
        });
      } else {
        setError(data.message || "Add new staff failed!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...editForm, _id: selectedStaff._id };
      const data = await updateInfoByAd(updatedData);
      if (data.success) {
        Swal.fire({
          title: "Updated!",
          text: "Staff info has been updated.",
          icon: "success",
          confirmButtonColor: "#4f46e5",
        });
        closeFormModal();
        loadData();
      } else {
        Swal.fire("Failed", data.message || "Update failed", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server error", "error");
    }
  };

  const handleViewDetail = (staff) => {
    setSelectedStaff(staff);
    setShowViewModal(true);
  };

  const handleEditClick = (staff) => {
    setIsEditting(true);
    setSelectedStaff(staff);
    setEditForm({
      username: staff.username || "",
      yourname: staff.yourname || "",
      birthDay: staff.birthDay?.split("T")[0] || "",
      gender: staff.gender || "",
      email: staff.email || "",
      phoneNum: staff.phoneNum || "",
      address: staff.address || "",
    });
    setShowFormModal(true);
  };

  const handleAddClick = () => {
    setIsEditting(false);
    resetAddForm();
    setShowFormModal(true);
  };

  const handleDeleteClick = (staffId) => {
    setSelectedIdToDelete(staffId);
    setShowConfirmModal(true);
  };
  
  const confirmDelete = async () => {
    const result = await deleteUser({ id: selectedIdToDelete });
    if (result.success) {
      setStaffList((prev) =>
        prev.filter((staff) => staff._id !== selectedIdToDelete)
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "You have disabled the staff account",
        confirmButtonColor: "#4f46e5",
      });
    } else {
      Swal.fire("Error", result.message || "Disable failed", "error");
    }
    setShowConfirmModal(false);
    setSelectedIdToDelete(null);
  }

  const loadData = async () => {
    const data = await loadInfoStaff();
    if (data.success) setStaffList(data.staffs);
    else setError(data.message); // Consider using Swal for this error too
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10">
        <HdAdmin
          styleCart="btn-line"
          styleOrder="btn-line"
          stylePro="btn-line"
        />
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Staff Management
          </h2>
          <button
            onClick={handleAddClick}
            className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-lg font-medium transition-transform active:scale-95"
          >
            Add Staff
          </button>
        </div>

        {/* Staff Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-5 gap-4 text-sm font-semibold bg-indigo-50 text-indigo-800 p-4 text-left">
                <span>Username</span>
                <span>Name</span>
                <span>Phone number</span>
                <span>Email</span>
                <span className="text-right">Actions</span>
              </div>

              {staffList &&
              staffList.filter((staff) => staff.isActive).length > 0 ? (
                staffList
                  .filter((staff) => staff.isActive)
                  .map((staff, index) => (
                    <div
                      key={staff._id || index}
                      className="grid grid-cols-5 gap-4 border-b p-4 text-sm items-center text-left text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span className="truncate font-medium">
                        {staff.username}
                      </span>
                      <span className="truncate">{staff.yourname}</span>
                      <span className="truncate">{staff.phoneNum}</span>
                      <span className="truncate">{staff.email}</span>
                      <div className="flex justify-end gap-2">
                        <Icon
                          className="text-gray-400 hover:text-indigo-600"
                          onClick={() => handleViewDetail(staff)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </Icon>
                        <Icon
                          className="text-gray-400 hover:text-indigo-600"
                          onClick={() => handleEditClick(staff)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </Icon>
                        <Icon
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteClick(staff._id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </Icon>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="p-6 text-center text-gray-500">
                  No active staff found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showFormModal && (
        <Modal onClose={closeFormModal}>
          <form
            onSubmit={isEditting ? handleUpdate : handleSubmit}
            className="flex flex-col gap-y-4"
          >
            <h1 className="text-2xl font-semibold text-center mb-2 text-gray-800">
              {isEditting ? "Edit Staff Info" : "Add New Staff"}
            </h1>

            {/* Form Fields */}
            {!isEditting && (
              <>
                <InputUser
                  label="Username"
                  name="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <InputUser
                  label="Password"
                  name="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputUser
                  label="Repeat Password"
                  name="Repeat Password"
                  type="password"
                  value={repassword}
                  onChange={(e) => setRePassword(e.target.value)}
                />
              </>
            )}

            <InputUser
              label="Full Name"
              name="Full Name"
              value={isEditting ? editForm.yourname : yourname}
              onChange={(e) =>
                isEditting
                  ? setEditForm({ ...editForm, yourname: e.target.value })
                  : setName(e.target.value)
              }
            />
            <InputUser
              label="Birthday"
              name="Birthday"
              type="date"
              value={isEditting ? editForm.birthDay : birthDay}
              onChange={(e) =>
                isEditting
                  ? setEditForm({ ...editForm, birthDay: e.target.value })
                  : setBirthDay(e.target.value)
              }
            />
            <InputUser
              label="Gender"
              name="Gender"
              value={isEditting ? editForm.gender : gender}
              onChange={(e) =>
                isEditting
                  ? setEditForm({ ...editForm, gender: e.target.value })
                  : setGender(e.target.value)
              }
            />
            <InputUser
              label="Email"
              name="Email"
              value={isEditting ? editForm.email : email}
              onChange={(e) =>
                isEditting
                  ? setEditForm({ ...editForm, email: e.target.value })
                  : setEmail(e.target.value)
              }
            />
            <InputUser
              label="Phone Number"
              name="Phone Number"
              value={isEditting ? editForm.phoneNum : phoneNum}
              onChange={(e) =>
                isEditting
                  ? setEditForm({ ...editForm, phoneNum: e.target.value })
                  : setPhoneNum(e.target.value)
              }
            />
            <InputUser
              label="Address"
              name="Address"
              value={isEditting ? editForm.address : address}
              onChange={(e) =>
                isEditting
                  ? setEditForm({ ...editForm, address: e.target.value })
                  : setAddress(e.target.value)
              }
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
            >
              {isEditting ? "Update Staff" : "Add Staff"}
            </button>
          </form>
        </Modal>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedStaff && (
        <Modal onClose={() => setShowViewModal(false)}>
          <div className="flex flex-col gap-y-3">
            <h1 className="text-2xl font-semibold text-center mb-2 text-gray-800">
              Staff Details
            </h1>
            <p>
              <strong>Username:</strong> {selectedStaff.username}
            </p>
            <p>
              <strong>Full Name:</strong> {selectedStaff.yourname}
            </p>
            <p>
              <strong>Birthday:</strong> {selectedStaff.birthDay?.split("T")[0]}
            </p>
            <p>
              <strong>Gender:</strong> {selectedStaff.gender}
            </p>
            <p>
              <strong>Email:</strong> {selectedStaff.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedStaff.phoneNum}
            </p>
            <p>
              <strong>Address:</strong> {selectedStaff.address}
            </p>

            <button
              onClick={() => setShowViewModal(false)}
              className="mt-4 w-full py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm mx-4 sm:mx-0">
            <p className="mb-6 text-center text-lg text-gray-800">
              Are you sure you want to disable this staff account?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition font-medium"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
                onClick={confirmDelete}
              >
                Yes, disable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;