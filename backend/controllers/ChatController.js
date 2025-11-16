export const handleChat = async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase() || '';
    let reply = "Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể hỏi về: 'vận chuyển', 'khuyến mãi', 'sản phẩm' hoặc 'đơn hàng'.";

    // --- Lời chào & Tạm biệt ---
    if (userMessage.includes('chào') || userMessage.includes('hi') || userMessage.includes('hello')) {
      reply = "Chào bạn! Tôi là bot hỗ trợ của TechSync Store. Tôi có thể giúp gì cho bạn?";
    } 
    else if (userMessage.includes('cảm ơn') || userMessage.includes('thank')) {
      reply = "Rất vui được giúp bạn! Chúc bạn một ngày tốt lành.";
    }
    else if (userMessage.includes('tạm biệt') || userMessage.includes('bye')) {
      reply = "Tạm biệt bạn! Hẹn gặp lại.";
    }

    // --- Sản phẩm & Cửa hàng ---
    else if (userMessage.includes('sản phẩm') || userMessage.includes('bán gì')) {
      reply = "TechSync Store chuyên bán các sản phẩm điện tử, công nghệ như laptop, máy tính, bàn phím, và các phụ kiện khác.";
    }
    else if (userMessage.includes('khuyến mãi') || userMessage.includes('sale') || userMessage.includes('giảm giá')) {
      reply = "Hiện tại cửa hàng đang có chương trình 'ONLINE ONLY SALE'. Bạn có thể xem chi tiết trên trang chủ để biết thêm về các sản phẩm đang được giảm giá.";
    }
    else if (userMessage.includes('địa chỉ') || userMessage.includes('ở đâu')) {
      reply = "TechSync Store là cửa hàng trực tuyến (online) 100% và chưa có cửa hàng vật lý. Chúng tôi giao hàng tận nơi trên toàn quốc.";
    }

    // --- Vận chuyển & Đơn hàng ---
    else if (userMessage.includes('vận chuyển') || userMessage.includes('giao hàng') || userMessage.includes('ship')) {
      reply = "TechSync Store giao hàng toàn quốc trong 3-5 ngày làm việc. Phí vận chuyển đồng giá là 25.000đ cho mọi đơn hàng.";
    }
    else if (userMessage.includes('bao lâu') && userMessage.includes('giao')) {
      reply = "Thời gian giao hàng dự kiến là từ 3 đến 5 ngày làm việc, không kể cuối tuần và ngày lễ.";
    }
    else if (userMessage.includes('đơn hàng') || userMessage.includes('order')) {
      reply = "Bạn có thể kiểm tra trạng thái đơn hàng của mình tại trang 'My Orders' sau khi đăng nhập. Nếu cần hỗ trợ thêm, vui lòng cung cấp mã đơn hàng của bạn.";
    }
    else if (userMessage.includes('hủy đơn')) {
      reply = "Để hủy đơn hàng, bạn vui lòng vào trang 'My Orders', chọn đơn hàng muốn hủy và nhấn nút 'Hủy đơn hàng'. Lưu ý: Bạn chỉ có thể hủy khi đơn hàng chưa được vận chuyển.";
    }
    
    // --- Chính sách & Hỗ trợ ---
    else if (userMessage.includes('đổi trả') || userMessage.includes('bảo hành') || userMessage.includes('return')) {
      reply = "Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất. Các sản phẩm đều được bảo hành chính hãng 12 tháng.";
    }
    else if (userMessage.includes('thanh toán')) {
      reply = "Chúng tôi chấp nhận thanh toán khi nhận hàng (COD) và thanh toán trực tuyến qua cổng VNPAY (bao gồm thẻ ATM, Visa, Mastercard).";
    }
    else if (userMessage.includes('tài khoản') || userMessage.includes('mật khẩu')) {
      reply = "Để quản lý tài khoản hoặc đặt lại mật khẩu, bạn vui lòng nhấp vào biểu tượng 'Profile' trên thanh điều hướng.";
    }
    else if (userMessage.includes('liên hệ') || userMessage.includes('hỗ trợ') || userMessage.includes('support')) {
      reply = "Bạn có thể liên hệ với chúng tôi qua email support@techsync.com hoặc SĐT 1900 1234 để được hỗ trợ trực tiếp.";
    }

    // Trả về JSON cho React
    res.json({ reply: reply });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ reply: "Xin lỗi, tôi đang gặp sự cố." });
  }
};