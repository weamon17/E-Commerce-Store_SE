import React, { useState, useEffect } from "react";
import InputUser from "../components/InputUser"; // Assuming this is a styled component
import Swal from "sweetalert2";
import HdAdmin from "../layouts/HeaderAdmin";
import { CheckUser } from "../Function/CheckUser";
import {
  addProducts,
  loadInfoProducts,
  deleteProducts,
  uploadImage,
  updateProducts,
} from "../services/handleAPI";

const productCategories = ["Laptop", "Computer Screens", "Mouse", "Keyboard"];

// --- 1. MOVED OUTSIDE ---
// A cleaner, reusable Icon component
const Icon = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

// --- 2. MOVED OUTSIDE ---
// Shared Modal Container Component
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
    <div className="bg-white shadow-2xl rounded-lg w-full max-w-md p-6 relative mx-4 sm:mx-0 max-h-[90vh] overflow-y-auto">
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

// --- 3. MOVED OUTSIDE & RECEIVES PROPS ---
// Shared Form Fields Component
const ProductFormFields = ({
  productInfo,
  handleChange,
  handleUpload,
  uploadedImage,
  showEditModal,
}) => (
  <>
    <InputUser
      label="Product ID"
      name="productId"
      type="text"
      value={productInfo.productId}
      onChange={handleChange}
      required
      readOnly={showEditModal} // Now reads from prop
      disabled={showEditModal} // Now reads from prop
    />
    <InputUser
      label="Product Name"
      name="productName"
      type="text"
      value={productInfo.productName}
      onChange={handleChange}
      required
    />

    <div>
      <label
        htmlFor="category"
        className="block font-semibold mb-1 text-sm text-gray-700"
      >
        Category
      </label>
      <select
        id="category"
        name="category"
        value={productInfo.category}
        onChange={handleChange}
        required
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="" disabled>
          Select a category
        </option>
        {productCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <InputUser
        label="Price"
        name="oldprice"
        type="number"
        value={productInfo.oldprice}
        onChange={handleChange}
        required
      />
      <InputUser
        label="Sale Price"
        name="saleprice"
        type="number"
        value={productInfo.saleprice}
        onChange={handleChange}
      />
    </div>
    <InputUser
      label="Quantity"
      name="quantity"
      type="number"
      value={productInfo.quantity}
      onChange={handleChange}
      required
    />
    <InputUser
      label="Description"
      name="description"
      type="text"
      value={productInfo.description}
      onChange={handleChange}
    />
    <div>
      <label className="block font-semibold mb-1 text-sm text-gray-700">
        Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      {uploadedImage && (
        <img
          src={uploadedImage}
          alt="Preview"
          className="mt-3 w-24 h-24 object-cover rounded-lg shadow"
        />
      )}
    </div>
  </>
);

// --- MAIN COMPONENT ---
const ManageProduct = () => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [productList, setProductList] = useState([]);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [productInfo, setProductInfo] = useState({
    productId: "",
    productName: "",
    saleprice: "",
    oldprice: "",
    image: "",
    quantity: "",
    description: "",
    category: "",
  });

  // This utility function remains
  CheckUser("Admin");

  // Resets the form and closes all modals
  const resetAndClose = () => {
    setShowModal(false);
    setShowEditModal(false);
    setProductInfo({
      productId: "",
      productName: "",
      saleprice: "",
      oldprice: "",
      image: "",
      quantity: "",
      description: "",
      category: "",
    });
    setUploadedImage(null);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInfo({ ...productInfo, [name]: value });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const {
      productId,
      productName,
      saleprice,
      oldprice,
      image,
      quantity,
      description,
      category,
    } = productInfo;

    if (
      !productId ||
      !productName ||
      !saleprice ||
      !oldprice ||
      !description ||
      !image ||
      !quantity ||
      !category
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const data = await addProducts(productInfo);
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "You have added a new product.",
          confirmButtonColor: "#4f46e5", // Indigo color
        }).then(() => {
          resetAndClose();
          loadData();
        });
      } else {
        setError(data.message || "Add new product failed!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    const {
      productId,
      productName,
      saleprice,
      oldprice,
      image,
      quantity,
      description,
      category,
    } = productInfo;

    if (
      !productId ||
      !productName ||
      !saleprice ||
      !oldprice ||
      !description ||
      !image ||
      !quantity ||
      !category
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const data = await updateProducts(productInfo);
      if (data.success) {
        Swal.fire(
          "Updated!",
          "Product updated successfully!",
          "success"
        ).then(() => {
          resetAndClose();
          loadData();
        });
      } else {
        setError(data.message || "Update failed!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  const loadData = async () => {
    const data = await loadInfoProducts();
    if (data.success) setProductList(data.products);
    else setError(data.message);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await uploadImage(formData);
        if (res.success) {
          setProductInfo({ ...productInfo, image: res.path });
        } else {
          Swal.fire("Error", "Failed to upload product image", "error");
        }
      } catch (uploadError) {
        console.error(uploadError);
        Swal.fire("Error", "Image upload failed. Please try again.", "error");
      }
    }
  };

  const handleEditClick = (product) => {
    setProductInfo({ ...product });
    setUploadedImage(
      `http://localhost:5000/${product.image?.replace(/^\/+/, "")}`
    );
    setShowEditModal(true);
    setError("");
  };

  const handleDeleteClick = (productId) => {
    setSelectedIdToDelete(productId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (selectedIdToDelete) {
      const res = await deleteProducts(selectedIdToDelete);
      if (res.success) {
        Swal.fire("Deleted!", "Product has been deleted.", "success");
        setShowConfirmModal(false);
        setSelectedIdToDelete(null);
        loadData();
      } else {
        Swal.fire("Error!", res.message || "Delete failed", "error");
      }
    }
  };

  // Note: Icon, Modal, and ProductFormFields are now defined ABOVE ManageProduct

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10">
        <HdAdmin stylePro="btn-line" />
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Product Management
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-lg font-medium transition-transform active:scale-95"
          >
            Add Product
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Table Header --- FIXED grid-cols-9 --- */}
              <div className="grid grid-cols-9 gap-4 text-sm font-semibold bg-indigo-50 text-indigo-800 p-4 text-left">
                <span>Product ID</span>
                <span>Image</span>
                <span className="col-span-1">Product Name</span>
                <span>Category</span>
                <span className="text-right">Price</span>
                <span className="text-right">Sale Price</span>
                <span className="text-right">Quantity</span>
                <span className="col-span-1">Description</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Table Body */}
              {productList.length > 0 ? (
                productList.map((product, index) => (
                  <div
                    key={product.productId || index}
                    className="grid grid-cols-9 gap-4 border-b p-4 text-sm items-center text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="truncate font-mono text-xs">
                      {product.productId}
                    </span>
                    <span>
                      {product.image ? (
                        <img
                          src={`http://localhost:5000/${product.image?.replace(
                            /^\/+/,
                            ""
                          )}`}
                          alt={product.productName}
                          className="w-16 h-16 object-cover rounded-md shadow"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                    </span>
                    <span className="truncate font-medium col-span-1">
                      {product.productName}
                    </span>
                    {/* Category column data */}
                    <span className="truncate">{product.category}</span>

                    <span className="truncate text-right line-through text-gray-500">
                      {product.oldprice}
                    </span>
                    <span className="truncate text-right font-semibold text-green-600">
                      {product.saleprice}
                    </span>
                    <span className="truncate text-right">
                      {product.quantity}
                    </span>
                    <span className="truncate col-span-1">
                      {product.description}
                    </span>
                    <div className="flex justify-end gap-2">
                      <Icon
                        className="text-gray-400 hover:text-indigo-600"
                        onClick={() => handleEditClick(product)}
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
                        onClick={() => handleDeleteClick(product.productId)}
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
                  No products found. Add one to get started!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <Modal onClose={resetAndClose}>
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Add New Product
          </h3>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <form onSubmit={addProduct} className="space-y-4">
            {/* --- 4. PASSING PROPS --- */}
            <ProductFormFields
              productInfo={productInfo}
              handleChange={handleChange}
              handleUpload={handleUpload}
              uploadedImage={uploadedImage}
              showEditModal={showEditModal} // Will be 'false' here
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
            >
              Add Product
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <Modal onClose={resetAndClose}>
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Update Product
          </h3>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <form onSubmit={updateProduct} className="space-y-4">
            {/* --- 5. PASSING PROPS --- */}
            <ProductFormFields
              productInfo={productInfo}
              handleChange={handleChange}
              handleUpload={handleUpload}
              uploadedImage={uploadedImage}
              showEditModal={showEditModal} // Will be 'true' here
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
            >
              Update Product
            </button>
          </form>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm mx-4 sm:mx-0">
            <p className="mb-6 text-center text-lg text-gray-800">
              Are you sure you want to delete this product?
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;