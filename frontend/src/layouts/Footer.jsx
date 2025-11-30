import logo from "../assets/logo.png";

const Footer = () => {
  return (
    // Bỏ 'absolute', giảm 'py-10' thành 'py-8'
    <footer className="w-full bg-sky-500 text-white px-4 py-8 md:px-20 lg:px-32 z-20">
      
      {/* Dùng Grid (lưới) 3 cột thay vì flex 'justify-between'.
        Grid sẽ tự động chia đều không gian, giúp bố cục cân đối hơn.
        - 'grid-cols-1': Mặc định 1 cột (cho mobile)
        - 'md:grid-cols-3': Chuyển thành 3 cột (cho desktop)
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Cột 1: Logo và Info */}
        <div className="flex flex-col gap-4">
          {/* Giảm kích thước logo từ w-40 xuống w-32 cho gọn hơn */}
          <img src={logo} alt="Logo" className="w-32" />
          
          {/* Thêm 'leading-relaxed' cho dễ đọc hơn */}
          <p className="text-sm leading-relaxed">
            This open source website is our final project.
            <br />
            {/* Cho text phụ này mờ đi một chút */}
            <span className="opacity-80">(Course: Software Engineering)</span>
            <br />
            Contribute to our project on Github:&nbsp;
            <a
              href="https://github.com/weamon17/E-Commerce-Store_SE.git"
              // Làm link nổi bật hơn
              className="font-semibold underline hover:opacity-80 transition-opacity"
              target="_blank" rel="noopener noreferrer"
            >
              TechSync
            </a>
          </p>
        </div>

        {/* Cột 2: About Us (tinh chỉnh tiêu đề) */}
        <div>
          <h2 className="text-base font-semibold uppercase opacity-80 mb-3">About Us</h2>
          <p className="text-sm leading-relaxed">
            A website that guarantees genuine sales, <br />
            established in 2025 with TechShop.
          </p>
        </div>

        {/* Cột 3: Support (tinh chỉnh tiêu đề) */}
        <div>
          <h2 className="text-base font-semibold uppercase opacity-80 mb-3">Support</h2>
          <p className="text-sm">httnotek27@gmail.com</p>
        </div>
      </div>

      {/* Dòng bản quyền (tinh chỉnh lại màu cho đẹp hơn) */}
      <div className="mt-8 border-t border-white/30 pt-6 text-center text-sm text-white opacity-70">
        {/* Đổi text-gray-300 thành text-white opacity-70 */}
        © 2025 TechSync Shop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
