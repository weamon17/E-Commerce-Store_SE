import React, { useState, useEffect } from "react";
import HdAdmin from "../layouts/HeaderAdmin";
import { CheckUser } from "../Function/CheckUser";
import {
  addNotifications,
  loadInfoNotifications,
  deleteNotifications,
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

const ManageNoti = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [notiList, setNotiList] = useState([]);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  CheckUser("Admin");
  
  const resetForm = () => {
    setTitle("");
    setContent("");
    setError("");
    setShowModal(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Please do not leave blank!");
      return;
    }

    try {
      const data = await addNotifications(title, content);
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "You have added a new notification.",
          confirmButtonColor: "#4f46e5",
        }).then(() => {
          resetForm();
          loadData();
        });
      } else {
        setError(data.message || "Add new notification failed!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  const loadData = async () => {
    const data = await loadInfoNotifications();
    if (data.success) setNotiList(data.notifications);
    else setError(data.message); // Consider using Swal here
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedIdToDelete(id);
    setShowConfirmModal(true);
  }

  const confirmDelete = async () => {
    const result = await deleteNotifications(selectedIdToDelete);
    if (result.success) {
      setNotiList((prev) =>
        prev.filter((noti) => noti._id !== selectedIdToDelete)
      );
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The notification has been deleted.",
        confirmButtonColor: "#4f46e5",
      });
    } else {
      Swal.fire("Error", result.message || "Delete failed", "error");
    }
    setShowConfirmModal(false);
    setSelectedIdToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10">
        <HdAdmin stylePro="btn-line" />
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Notification Management
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-lg font-medium transition-transform active:scale-95"
          >
            Add Notification
          </button>
        </div>

        {/* Notification Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-3 gap-4 text-sm font-semibold bg-indigo-50 text-indigo-800 p-4 text-left">
                <span>Title</span>
                <span className="col-span-1">Content</span>
                <span className="text-right">Actions</span>
              </div>

              {notiList && notiList.length > 0 ? (
                notiList.map((noti, index) => (
                  <div
                    key={noti._id || index}
                    className="grid grid-cols-3 gap-4 border-b p-4 text-sm items-center text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="truncate font-medium">{noti.title}</span>
                    <span className="truncate col-span-1">{noti.content}</span>
                    <div className="flex justify-end gap-2">
                      <Icon
                        className="text-gray-400 hover:text-red-600"
                        onClick={() => handleDeleteClick(noti._id)}
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
                  No notifications found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <Modal onClose={resetForm}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-6 w-full"
          >
            <h1 className="text-2xl font-semibold text-center mb-2 text-gray-800">
              Add New Notification
            </h1>

            <InputUser
              label="Notification Title"
              name="Notification title"
              placeholder="Enter title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm text-gray-700">
                Content
              </label>
              <textarea
                rows="4"
                className="border border-gray-300 p-2 rounded-md resize-y min-h-[100px] w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-600 text-center text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
            >
              Add Notification
            </button>
          </form>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm mx-4 sm:mx-0">
            <p className="mb-6 text-center text-lg text-gray-800">
              Are you sure you want to delete this notification?
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
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageNoti;