import React from "react";
// MỚI: Import 2 hàm hỗ trợ chúng ta đã tạo
import { formatPrice, calculateDiscount } from "../utils/format.js";

const Product = ({ image, name, price, oldprice, quantity, onClick }) => {
  // MỚI: Tự động tính toán % giảm giá
  const discount = calculateDiscount(oldprice, price);

  // MỚI: Tự động định dạng tiền tệ
  const formattedSalePrice = formatPrice(price);
  const formattedOldPrice = formatPrice(oldprice);

  return (
    <div
      onClick={onClick}
      className="rounded-lg shadow-md bg-white cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden flex flex-col group"
      // Bỏ w/h cố định để responsive, thêm 'group'
    >
      {/* Vùng chứa ảnh */}
      <div className="relative w-full overflow-hidden">
        {/* MỚI: Dùng 'aspect-square' để giữ ảnh luôn vuông vức */}
        <div className="aspect-square">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Hiệu ứng zoom khi hover
          />
        </div>

        {/* MỚI: Huy hiệu (badge) giảm giá, chỉ hiển thị khi có giảm giá */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            -{discount}%
          </div>
        )}
      </div>

      {/* Vùng chứa thông tin (đã thiết kế lại) */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Tên sản phẩm (giữ 2 dòng, có chiều cao tối thiểu để căn đều các card) */}
        <h2 className="font-semibold text-base text-gray-800 line-clamp-2 min-h-[40px] mb-2">
          {name}
        </h2>

        {/* Khu vực giá (đẩy xuống dưới cùng) */}
        <div className="mt-auto">
          {/* Giá bán (luôn hiển thị) */}
          <span className="text-red-600 font-bold text-lg block">
            {formattedSalePrice} {/* ĐÃ FORMAT */}
          </span>

          {/* Giá gốc (chỉ hiển thị khi có giảm giá) */}
          {discount > 0 && (
            <span className="text-gray-400 line-through text-sm">
              {formattedOldPrice} {/* ĐÃ FORMAT */}
            </span>
          )}
        </div>
        
        {/* Tôi đã ẩn 'quantity' để giao diện sạch hơn. 
            Người dùng có thể thấy nó khi bấm vào xem chi tiết.
            Nếu muốn hiện lại, bạn có thể thêm:
            <span className="text-gray-500 text-xs mt-1">Kho: {quantity}</span> 
        */}
      </div>
    </div>
  );
};

export default Product;