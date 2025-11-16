import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrder, deleteItem } from "../services/handleAPI";
import Swal from "sweetalert2";
import SearchableSelect from "../components/SearchableSelect";
// --- MỚI: Import hàm định dạng tiền tệ ---
import { formatPrice } from "../utils/format.js";

const generateOrderId = () => {
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const DD = String(now.getDate()).padStart(2, "0");
  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `ORDER${YYYY}${MM}${DD}${HH}${mm}${ss}`;
};

const CheckoutPage = () => {
  const { state } = useLocation();
  const cartItems = useMemo(() => state?.cartItems || [], [state?.cartItems]);
  // Exchange & price
  const exchangeRate = 24500; // Giữ lại để tính QR

  // Địa chỉ chọn
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [addressDetail, setAddressDetail] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();

  //! Tính tiền
  const totalItemsPrice = cartItems.reduce(
    (total, item) => total + item.saleprice * item.buyQuantity,
    0
  );

  const calculateShippingFee = () => {
    if (!selectedProvince || !selectedDistrict || !selectedWard) return 0;
    const len =
      (selectedProvince.name.length || 0) +
      (selectedDistrict.name.length || 0) +
      (selectedWard.name.length || 0);
    return Math.round(Math.max(1, len * 0.1) * 10000); 
  };

  const shippingFee = calculateShippingFee();
  const totalPayment = totalItemsPrice + shippingFee;
  const totalPaymentVND = totalPayment * exchangeRate; // Giữ lại để tính QR

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data);
      });
  }, []);

  // Khi chọn tỉnh => load huyện
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict(null);
      setWards([]);
      setSelectedWard(null);
      return;
    }
    fetch(
      `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
    )
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.districts);
        setSelectedDistrict(null);
        setWards([]);
        setSelectedWard(null);
      });
  }, [selectedProvince]);

  // Khi chọn huyện => load xã
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard(null);
      return;
    }
    fetch(
      `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
    )
      .then((res) => res.json())
      .then((data) => {
        setWards(data.wards);
        setSelectedWard(null);
      });
  }, [selectedDistrict]);

  //! Tạo đơn hàng
  const [orderId] = useState(() => generateOrderId());
  const [order, setOrder] = useState({
    id: "",
    products: [],
    subtotal: 0,
    totalPayment: 0,
    address: "",
    status: "",
  });
  useEffect(() => {
    const fullAddress = `${addressDetail}, ${selectedWard?.name || ""}, ${
      selectedDistrict?.name || ""
    }, ${selectedProvince?.name || ""}`;
    setOrder({
      id: orderId,
      products: cartItems,
      subtotal: totalItemsPrice,
      totalPayment: totalPayment, // Lưu giá trị số
      address: fullAddress,
      status: "Waiting for confirmation",
    });
  }, [
    cartItems,
    totalItemsPrice,
    totalPayment,
    orderId,
    addressDetail,
    selectedWard,
    selectedDistrict,
    selectedProvince,
  ]);
  const handlePlaceOrder = async () => {
    if (
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !addressDetail
    ) {
      alert("Please complete your shipping address.");
      return;
    }
    const isOrder = await addOrder(order);
    if (isOrder.success) {
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Order successful",
        confirmButtonColor: "#d33",
      });
      const productIds = cartItems.map((item) => item.productId);
      const isdelete = await deleteItem(productIds);
      if (isdelete) navigate("/dashboard-customer");
    } else {
      console.log("Error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white mt-10">
      <h2 className="text-xl font-bold mb-4">Products</h2>

      <div className="p-4 flex flex-col gap-4">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-start p-2 gap-4 border rounded-md shadow-md"
          >
            <img
              src={item.image}
              alt={item.productName}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.productName}</h3>
            </div>
            <div className="text-right">
              {/* --- SỬA: Dùng formatPrice --- */}
              <p className="text-gray-700">{formatPrice(item.saleprice)}</p>
              <p className="text-sm text-gray-500 mt-2">x{item.buyQuantity}</p>
              {/* --- SỬA: Dùng formatPrice --- */}
              <p className="text-red-600 font-bold mt-1">
                {formatPrice(item.saleprice * item.buyQuantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>

        <div className="mb-3">
          <SearchableSelect
            items={provinces}
            selected={selectedProvince}
            onChange={setSelectedProvince}
            placeholder="Select Province"
          />
        </div>

        <div className="mb-3">
          <SearchableSelect
            items={districts}
            selected={selectedDistrict}
            onChange={setSelectedDistrict}
            placeholder="Select District"
            disabled={!selectedProvince}
          />
        </div>

        <div className="mb-3">
          <SearchableSelect
            items={wards}
            selected={selectedWard}
            onChange={setSelectedWard}
            placeholder="Select Ward"
            disabled={!selectedDistrict}
          />
        </div>

        <input
          type="text"
          value={addressDetail}
          // --- SỬA: Sửa lỗi typo e.gex -> e.target ---
          onChange={(e) => setAddressDetail(e.target.value)}
          placeholder="Number phone ,house number, street name,..."
          className="w-full border rounded-md p-3 mb-3"
        />

        <textarea
          value={
            addressDetail
              ? `${addressDetail}, ${selectedWard?.name || ""}, ${
                  selectedDistrict?.name || ""
                }, ${selectedProvince?.name || ""}`
              : selectedWard
              ? `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`
              : ""
          }
          readOnly
          className="w-full border rounded-md p-3 text-sm bg-gray-100"
          rows={2}
        />
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery (COD)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="QR"
              checked={paymentMethod === "QR"}
              onChange={() => setPaymentMethod("QR")}
            />
            QR Code
          </label>
        </div>

        {paymentMethod === "QR" && (
          <div className="mt-4 bg-white border rounded p-4">
            <p className="mb-2 text-sm text-gray-600">
              Scan this QR code to pay:
            </p>
            <img
              src={`https://img.vietqr.io/image/VCCB-0898672066-compact2.png?amount=${Math.round(
                totalPayment // API QR nên dùng giá VND, không phải $
              )}&addInfo=${generateOrderId()}`}
              alt="QR Payment"
              className="w-48 h-48"
            />
            {/* --- SỬA: Dùng formatPrice --- */}
            <p className="mt-2 text-sm text-gray-500">
              Payment amount: {formatPrice(totalPayment)}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-gray-50 p-4 rounded-md">
        {/* --- SỬA: Dùng formatPrice --- */}
        <div className="flex justify-between py-2">
          <span>Subtotal</span>
          <span>{formatPrice(totalItemsPrice)}</span>
        </div>
        {/* --- SỬA: Dùng formatPrice --- */}
        <div className="flex justify-between py-2">
          <span>Shipping Fee</span>
          <span>{formatPrice(shippingFee)}</span>
        </div>
        {/* --- SỬB: Dùng formatPrice --- */}
        <div className="flex justify-between py-2 text-lg font-bold text-red-600 border-t mt-2 pt-2">
          <span>Total Payment</span>
          <span>{formatPrice(totalPayment)}</span>
        </div>
      </div>

      <div className="text-right mt-6">
        <button
          className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;