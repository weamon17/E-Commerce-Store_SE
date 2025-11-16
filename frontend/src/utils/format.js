// src/utils/format.js

/**
 * Định dạng một số thành chuỗi tiền tệ VND.
 * Ví dụ: 725000 -> "725.000 VND"
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return "";
  
  // Sử dụng Intl.NumberFormat của JavaScript để tự động thêm dấu chấm
  // 'vi-VN' sẽ dùng dấu '.' làm dấu phân cách hàng ngàn.
  return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
};

/**
 * Tính toán phần trăm giảm giá.
 * Ví dụ: (oldPrice: 1000, salePrice: 800) -> 20
 */
export const calculateDiscount = (oldPrice, salePrice) => {
  const old = Number(oldPrice);
  const sale = Number(salePrice);

  // Không có giảm giá nếu giá cũ thấp hơn hoặc không có
  if (!old || old <= sale) return 0;

  const discount = ((old - sale) / old) * 100;
  
  // Làm tròn số
  return Math.round(discount);
};

/**
 */
export const removeVietnameseTones = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};