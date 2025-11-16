import React, { useState, useEffect } from "react";
import HdAdmin from "../layouts/HeaderAdmin";
import { CheckUser } from "../Function/CheckUser";
import { loadInfoCustomer, register, deleteUser } from "../services/handleAPI";
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

const ManageCustomer = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  CheckUser("Admin");

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setRePassword("");
    setError("");
    setShowFormModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !repassword) {
      setError("Please do not leave blank!");
      return;
    }

    if (password !== repassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const data = await register(username, password, "Customer");
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "You have added a new customer.",
          confirmButtonColor: "#4f46e5",
        }).then(() => {
          resetForm();
          loadData(); // refresh
        });
      } else {
        setError(data.message || "Add new customer failed!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  const handleViewDetail = (cus) => {
    setSelectedCustomer(cus);
    setShowViewModal(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedIdToDelete(id);
    setShowConfirmModal(true);
  };
  
  const confirmDelete = async () => {
    const result = await deleteUser({ id: selectedIdToDelete });
    if (result.success) {
      setCustomerList((prev) =>
        prev.filter((cus) => cus._id !== selectedIdToDelete)
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "You have disabled the customer account",
        confirmButtonColor: "#4f46e5",
      });
    } else {
      Swal.fire("Error", result.message || "Disable failed", "error");
    }
    setShowConfirmModal(false);
    setSelectedIdToDelete(null);
  }

  const loadData = async () => {
    const data = await loadInfoCustomer();
    if (data.success) setCustomerList(data.customers);
    else setError(data.message); // Consider Swal
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
            Customer Management
          </h2>
          <button
            onClick={() => setShowFormModal(true)}
            className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-lg font-medium transition-transform active:scale-95"
          >
            Add Customer
          </button>
        </div>

        {/* Customer Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-5 gap-4 text-sm font-semibold bg-indigo-50 text-indigo-800 p-4 text-left">
                <span>Username</span>
                <span>Name</span>
                <span>Email</span>
                <span>Address</span>
                <span className="text-right">Actions</span>
              </div>

              {customerList &&
              customerList.filter((cus) => cus.isActive).length > 0 ? (
                customerList
                  .filter((cus) => cus.isActive)
                  .map((cus, index) => (
                    <div
                      key={cus._id || index}
                      className="grid grid-cols-5 gap-4 border-b p-4 text-sm items-center text-left text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span className="truncate font-medium">
                        {cus.username}
                      </span>
                      <span className="truncate">{cus.yourname}</span>
                      <span className="truncate">{cus.email}</span>
                      <span className="truncate">{cus.address}</span>
                      <div className="flex justify-end gap-2">
                        <Icon
                          className="text-gray-400 hover:text-indigo-600"
                          onClick={() => handleViewDetail(cus)}
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
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteClick(cus._id)}
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
                  No active customers found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showFormModal && (
        <Modal onClose={resetForm}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-6 w-full"
          >
            <h1 className="text-2xl font-semibold text-center mb-2 text-gray-800">
              Add New Customer
            </h1>

            <InputUser
              label="Username"
              name="User name"
              placeholder="Enter user name"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputUser
              label="Password"
              name="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputUser
              label="Repeat password"
              name="Repeat password"
              placeholder="Re-enter your password"
              type="password"
              value={repassword}
              onChange={(e) => setRePassword(e.target.value)}
            />

            {error && (
              <p className="text-red-600 text-center text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
            >
              Add Customer
            </button>
          </form>
        </Modal>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedCustomer && (
        <Modal onClose={() => setShowViewModal(false)}>
          <div className="flex flex-col gap-y-3">
            <h1 className="text-2xl font-semibold text-center mb-2 text-gray-800">
              Customer Details
            </h1>

            <p>
              <strong>Username:</strong> {selectedCustomer.username}
            </p>
            <p>
              <strong>Full Name:</strong> {selectedCustomer.yourname || "N/A"}
            </p>
            <p>
              <strong>Birthday:</strong> {selectedCustomer.birthDay?.split("T")[0] || "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {selectedCustomer.gender || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {selectedCustomer.email || "N/A"}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedCustomer.phoneNum || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {selectedCustomer.address || "N/A"}
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
              Are you sure you want to disable this customer account?
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

export default ManageCustomer;