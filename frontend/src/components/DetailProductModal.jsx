import React, { useState, useEffect } from "react";
import { addToCart } from "../services/handleAPI";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/format.js";
import Swal from "sweetalert2"; 
export default function DetailProductModal({
  product,
  isOpen,
  onClose,
  userId,
  onCartUpdated,
}) {
  const [buyQuantity, setBuyQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (product) setBuyQuantity(1);
  }, [product]);

  if (!isOpen || !product) return null;

  // *** HÀM NÀY ĐÃ ĐƯỢC CẬP NHẬT HOÀN TOÀN ***
  const handleAddToCart = async () => {
    if (buyQuantity > product.quantity) {
      // THAY THẾ ALERT LỖI
      Swal.fire({
        icon: "error",
        title: "Không đủ hàng",
        text: `Chỉ còn ${product.quantity} sản phẩm trong kho!`,
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    try {
      await addToCart(userId, product, buyQuantity);

      // THAY THẾ ALERT THÀNH CÔNG
      Swal.fire({
        icon: "success",
        title: "Thêm thành công!",
        text: `Đã thêm ${buyQuantity} sản phẩm vào giỏ hàng.`,
        timer: 1500, // Tự động tắt sau 1.5 giây
        showConfirmButton: false,
      });

      window.dispatchEvent(new CustomEvent("cartUpdated"));
      if (onCartUpdated) onCartUpdated();
      onClose(); // Đóng modal sau khi thêm
      
    } catch (error) {
      // THAY THẾ ALERT LỖI SERVER
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Không thể thêm vào giỏ hàng. Vui lòng thử lại!",
        confirmButtonColor: "#4f46e5",
      });
      console.error(error);
    }
  };

  const handleBuyNow = () => {
    if (buyQuantity > product.quantity) {
      // BẠN CŨNG CÓ THỂ THAY THẾ ALERT NÀY BẰNG SWAL
      // Swal.fire({
      //   icon: "error",
      //   title: "Không đủ hàng",
      //   text: `Chỉ còn ${product.quantity} sản phẩm trong kho!`,
      //   confirmButtonColor: "#4f46e5",
      // });
      alert(`Only ${product.quantity} item(s) available in stock`);
      return;
    }

    navigate("/checkout", {
      state: {
        cartItems: [
          {
            ...product,
            buyQuantity,
            productId: product.id || product.productId,
            image: `http://localhost:5000/${product.image?.replace(
              /^\/+/,
              ""
            )}`,
          },
        ],
      },
    });
    onClose();
  };

  // --- MỚI: Định dạng tất cả các loại giá ---
  const totalPrice = product.saleprice * buyQuantity;
  const formattedSalePrice = formatPrice(product.saleprice);
  const formattedOldPrice = formatPrice(product.oldprice);
  const formattedTotalPrice = formatPrice(totalPrice);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-4xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl font-bold text-gray-600 hover:text-red-500"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={`http://localhost:5000/${product.image?.replace(/^\/+/, "")}`}
            alt="product"
            className="w-full md:w-1/2 h-auto object-cover rounded"
          />

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-3">{product.productName}</h2>

              <div className="flex items-center gap-3 mb-3">
                {/* --- SỬA: Dùng giá đã định dạng --- */}
                <span className="line-through text-gray-500 text-lg">
                  {formattedOldPrice}
                </span>
                {/* --- SỬA: Dùng giá đã định dạng --- */}
                <span className="text-red-600 text-2xl font-semibold">
                  {formattedSalePrice}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-600">Quantity:</span>
                <button
                  onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                  className="border px-3 py-1 rounded"
                >
                  -
                </button>
                <span className="px-2">{buyQuantity}</span>
                <button
                  onClick={() =>
                    setBuyQuantity(Math.min(product.quantity, buyQuantity + 1))
                  }
                  className="border px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                In stock: {product.quantity}
              </span>

              {product.description && (
                <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded mb-4 mt-3">
                  <strong>Description:</strong> {product.description}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-right text-lg font-medium text-gray-800">
                Total:{" "}
                {/* --- SỬA: Dùng giá đã định dạng --- */}
                <span className="text-red-600 font-bold">
                  {formattedTotalPrice}
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3 border border-red-600 text-red-600 rounded hover:bg-red-100"
                >
                  Add to cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}