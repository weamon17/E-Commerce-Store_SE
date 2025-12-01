import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrder, deleteItem } from "../services/handleAPI";
import Swal from "sweetalert2";
import SearchableSelect from "../components/SearchableSelect";
import { formatPrice } from "../utils/format.js";

// --- Hàm tạo mã đơn hàng ---
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
  const exchangeRate = 24500; 

  // Địa chỉ
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [addressDetail, setAddressDetail] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();

  // Tính tiền
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

  // API Provinces
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => res.json()).then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]); setSelectedDistrict(null); setWards([]); setSelectedWard(null); return;
    }
    fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
      .then((res) => res.json()).then((data) => {
        setDistricts(data.districts); setSelectedDistrict(null); setWards([]); setSelectedWard(null);
      });
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedDistrict) { setWards([]); setSelectedWard(null); return; }
    fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
      .then((res) => res.json()).then((data) => { setWards(data.wards); setSelectedWard(null); });
  }, [selectedDistrict]);

  // Tạo Order State
  const [orderId] = useState(() => generateOrderId());
  const [order, setOrder] = useState({
    id: "", products: [], subtotal: 0, totalPayment: 0, address: "", status: "",
  });

  useEffect(() => {
    const fullAddress = `${addressDetail}, ${selectedWard?.name || ""}, ${selectedDistrict?.name || ""}, ${selectedProvince?.name || ""}`;
    setOrder({
      id: orderId,
      products: cartItems,
      subtotal: totalItemsPrice,
      totalPayment: totalPayment,
      address: fullAddress,
      status: "Waiting for confirmation",
    });
  }, [cartItems, totalItemsPrice, totalPayment, orderId, addressDetail, selectedWard, selectedDistrict, selectedProvince]);

  const handlePlaceOrder = async () => {
    if (!selectedProvince || !selectedDistrict || !selectedWard || !addressDetail) {
      alert("Please complete your shipping address.");
      return;
    }
    const isOrder = await addOrder(order);
    if (isOrder.success) {
      await Swal.fire({
        icon: "success", title: "Success", text: "Order successful", confirmButtonColor: "#d33",
      });
      const productIds = cartItems.map((item) => item.productId);
      const isdelete = await deleteItem(productIds);
      if (isdelete) navigate("/dashboard-customer");
    } else {
      console.log("Error");
    }
  };

  return (
    // Container chính với nền xám nhẹ để làm nổi bật các box trắng
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        {/* --- GRID LAYOUT: CHIA 2 CỘT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* === CỘT TRÁI (LEFT): THÔNG TIN THANH TOÁN & ĐỊA CHỈ (Chiếm 7 phần) === */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Box 1: Địa chỉ */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-sky-100 text-sky-600 w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
                Shipping Address
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <SearchableSelect items={provinces} selected={selectedProvince} onChange={setSelectedProvince} placeholder="Province" />
                <SearchableSelect items={districts} selected={selectedDistrict} onChange={setSelectedDistrict} placeholder="District" disabled={!selectedProvince} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <SearchableSelect items={wards} selected={selectedWard} onChange={setSelectedWard} placeholder="Ward" disabled={!selectedDistrict} />
                 <input
                  type="text"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  placeholder="House number, street name..."
                  className="w-full border rounded-md p-2.5 outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              {/* Preview địa chỉ full */}
              <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 text-gray-600 text-sm">
                <span className="font-semibold">Deliver to: </span>
                {addressDetail
                  ? `${addressDetail}, ${selectedWard?.name || ""}, ${selectedDistrict?.name || ""}, ${selectedProvince?.name || ""}`
                  : "Please select address above..."}
              </div>
            </div>

            {/* Box 2: Phương thức thanh toán */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-sky-100 text-sky-600 w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
                Payment Method
              </h3>
              
              <div className="space-y-3">
                {/* Option COD */}
                <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "COD" ? "border-sky-500 bg-sky-50" : "hover:bg-gray-50"}`}>
                  <input type="radio" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="w-5 h-5 text-sky-600" />
                  <div>
                    <span className="font-medium block">Cash on Delivery (COD)</span>
                    <span className="text-sm text-gray-500">Pay when you receive the package</span>
                  </div>
                </label>

                {/* Option QR */}
                <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "QR" ? "border-sky-500 bg-sky-50" : "hover:bg-gray-50"}`}>
                  <input type="radio" value="QR" checked={paymentMethod === "QR"} onChange={() => setPaymentMethod("QR")} className="w-5 h-5 text-sky-600" />
                  <div>
                    <span className="font-medium block">Bank Transfer via QR Code</span>
                    <span className="text-sm text-gray-500">Scan QR code to pay instantly</span>
                  </div>
                </label>
              </div>

              {/* Hiển thị QR nếu chọn */}
              {paymentMethod === "QR" && (
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg flex flex-col items-center text-center animate-fade-in">
                  <p className="mb-2 text-sm text-gray-600 font-medium">Scan with Banking App</p>
                  <img
                    src={`https://img.vietqr.io/image/VCCB-0898672066-compact2.png?amount=${Math.round(totalPayment)}&addInfo=${generateOrderId()}`}
                    alt="QR Payment"
                    className="w-48 h-48 object-contain border p-2 rounded"
                  />
                  <p className="mt-2 text-red-600 font-bold text-lg">{formatPrice(totalPayment)}</p>
                </div>
              )}
            </div>
            
            {/* Nút Quay lại trang chủ (Trên Mobile nó sẽ nằm dưới cùng phần form) */}
            <button
              className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors font-medium mt-4"
              onClick={() => navigate("/dashboard-customer")}
            >
              ← Continue Shopping
            </button>
          </div>


          {/* === CỘT PHẢI (RIGHT): ĐƠN HÀNG & TỔNG TIỀN (Chiếm 5 phần) === */}
          {/* 'sticky top-24' giúp cột này chạy theo khi cuộn trang */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h3>
              
              {/* Danh sách sản phẩm (Có scroll nếu quá dài) */}
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 mb-6 scrollbar-thin scrollbar-thumb-gray-200">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-center">
                    <div className="relative">
                      <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded-lg border" />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {item.buyQuantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 truncate">{item.productName}</h4>
                      <p className="text-xs text-gray-500">Unit: {formatPrice(item.saleprice)}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {formatPrice(item.saleprice * item.buyQuantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Phần tính tiền */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalItemsPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span>{formatPrice(shippingFee)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-bold text-gray-800">Total Payment</span>
                <span className="text-2xl font-bold text-red-600">{formatPrice(totalPayment)}</span>
              </div>

              {/* Nút đặt hàng TO & NỔI BẬT */}
              <button
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>

              {/* Nút quay lại (Chỉ hiện trên mobile, nằm ngay dưới nút đặt hàng) */}
              <button
                className="lg:hidden w-full mt-4 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
                onClick={() => navigate("/dashboard-customer")}
              >
                Continue Shopping
              </button>
            </div>
            
            {/* Box đảm bảo (Trust badge) - Optional */}
            <div className="bg-sky-50 p-4 rounded-lg border border-sky-100 text-center">
               <p className="text-sm text-sky-700 flex items-center justify-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 Secure Payment & Information
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;