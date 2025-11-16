import { useState, useEffect } from "react";
import HeaderCustomer from "../layouts/HeaderCustomer";
import { useNavigate } from "react-router-dom";
import { deleteItem, getCart } from "../services/handleAPI";
// 1. IMPORT HÀM formatPrice
import { formatPrice } from "../utils/format.js"; // Giả sử đường dẫn này đúng

export default function CartPage() {
  // ... (các state của bạn giữ nguyên)
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  // ... (các hàm useEffect, toggleSelect, changeQuantity, total giữ nguyên)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const myCart = await getCart();
        setCart(myCart.items || []);
      } catch (err) {
        console.error("Error loading cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const changeQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === id
          ? { ...item, buyQuantity: Math.max(1, item.buyQuantity + delta) }
          : item
      )
    );
  };

  const total = cart
    .filter((item) => selectedIds.includes(item.productId))
    .reduce((sum, item) => sum + item.saleprice * item.buyQuantity, 0);

  const selectAll = selectedIds.length === cart.length && cart.length > 0;

  const handleDelete = async () => {
    try {
      await deleteItem(selectedIds);
      setCart((prev) => prev.filter((item) => !selectedIds.includes(item.productId)));
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      setSelectedIds([]);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  
  // ... (hàm handleBuyNow giữ nguyên)
  const handleBuyNow = () => {
    const selectedItems = cart
      .filter((item) => selectedIds.includes(item.productId))
      .map((item) => ({
        productId: item.productId,
        productName: item.productName,
        oldprice: item.oldprice,
        saleprice: item.saleprice,
        buyQuantity: item.buyQuantity,
        image: `http://localhost:5000/${item.image.replace(/^\/+/, "")}`,
      }));

    navigate("/checkout", { state: { cartItems: selectedItems } });
  };


  return (
    <>
      <div className="sticky top-0 z-50">
        <HeaderCustomer styleOrder="btn-line" styleCart="line" stylePro="btn-line" />
      </div>

      <div className="bg-gray-100 min-h-screen px-4 sm:px-6 lg:px-12 py-6">
        <div className="bg-white rounded-xl shadow-lg p-4 max-w-7xl mx-auto">
          {/* ... (Phần header, loading, cart empty giữ nguyên) ... */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-red-600 text-center sm:text-left">
            Your Cart
          </h2>

          <div className="hidden sm:grid grid-cols-6 gap-4 border-b pb-2 font-bold text-gray-600 text-sm">
            <div className="col-span-3">Product</div>
            <div className="text-center">Price</div>
            <div className="text-center">Quantity</div>
            <div className="text-center">Subtotal</div>
          </div>

          {loading ? (
            <p className="text-gray-500 mt-4 text-center">Loading your cart...</p>
          ) : cart.length === 0 ? (
            <p className="text-gray-500 mt-4 text-center">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="flex flex-wrap sm:grid sm:grid-cols-6 items-center p-4 mb-4 bg-white rounded-xl shadow transition hover:shadow-md"
              >
                {/* ... (Phần Product image, checkbox giữ nguyên) ... */}
                <div className="flex items-center col-span-3 w-full sm:w-auto space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.productId)}
                    onChange={() => toggleSelect(item.productId)}
                    className="flex-shrink-0"
                  />
                  <img
                    src={`http://localhost:5000/${item.image?.replace(/^\/+/, "")}`}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold truncate max-w-[180px] sm:max-w-full">{item.productName}</p>
                  </div>
                </div>

                {/* 2. SỬA LỖI Price */}
                <div className="text-center w-1/3 sm:w-auto sm:text-center mt-2 sm:mt-0">
                  <p className="line-through text-sm text-gray-400">
                    {formatPrice(item.oldprice)}
                  </p>
                  <p className="text-red-600 font-semibold">
                    {formatPrice(item.saleprice)}
                  </p>
                </div>

                {/* ... (Phần Quantity giữ nguyên) ... */}
                <div className="flex justify-center items-center space-x-2 w-1/2 sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={() => changeQuantity(item.productId, -1)}
                    className="border px-3 rounded text-gray-700 hover:bg-gray-100 select-none"
                  >
                    -
                  </button>
                  <span className="min-w-[24px] text-center">{item.buyQuantity}</span>
                  <button
                    onClick={() => changeQuantity(item.productId, 1)}
                    className="border px-3 rounded text-gray-700 hover:bg-gray-100 select-none"
                  >
                    +
                  </button>
                </div>

                {/* 3. SỬA LỖI Subtotal */}
                <div className="text-center text-red-600 font-semibold w-1/2 sm:w-auto mt-2 sm:mt-0">
                  {formatPrice(item.buyQuantity * item.saleprice)}
                </div>
              </div>
            ))
          )}

          {/* Footer tổng và nút */}
          {!loading && cart.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200 space-y-4 sm:space-y-0">
              {/* ... (Phần Select All, Delete giữ nguyên) ... */}
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={() =>
                    setSelectedIds(selectAll ? [] : cart.map((i) => i.productId))
                  }
                  className="cursor-pointer"
                />
                <span className="text-sm text-gray-600 select-none">
                  Select All ({selectedIds.length})
                </span>
                <button
                  className="text-red-600 text-sm hover:underline disabled:text-gray-400"
                  onClick={handleDelete}
                  disabled={selectedIds.length === 0}
                >
                  Delete
                </button>
              </div>

              <div className="flex items-center space-x-6">
                <p className="text-sm whitespace-nowrap">
                  Total ({selectedIds.length} item{selectedIds.length !== 1 ? "s" : ""}):{" "}
                  {/* 4. SỬA LỖI Total */}
                  <span className="text-red-600 text-lg font-semibold">
                    {formatPrice(total)}
                  </span>
                </p>
                <button
                  className={`bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}
                  onClick={handleBuyNow}
                  disabled={selectedIds.length === 0}
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}