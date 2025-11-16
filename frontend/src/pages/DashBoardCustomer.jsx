import { useEffect, useState } from "react";
import ListProduct from "../components/ListProduct";
import Footer from "../layouts/Footer";
import HdCustomer from "../layouts/HeaderCustomer";
import { CheckUser } from "../Function/CheckUser";
import picture3 from "../assets/picture3.png";
import picture4 from "../assets/picture4.png";
import picture5 from "../assets/picture5.png";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [picture3, picture4, picture5];

// --- MỚI: Thêm danh sách các danh mục ---
const categories = ["All", "Laptop", "Computer Screens", "Mouse", "Keyboard"];

const DashBoardCustomer = () => {
  const [index, setIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const nextSlide = () => setIndex((index + 1) % images.length);
  const prevSlide = () => setIndex((index - 1 + images.length) % images.length);

  useEffect(() => {
    const timer = setTimeout(nextSlide, 2500);
    return () => clearTimeout(timer);
  }, [index]);

  CheckUser("Customer");

  return (
    <div className="min-h-screen bg-sky-50">
      <div className="sticky top-0 z-50 ">
        <HdCustomer
          styleCart="btn-line"
          styleOrder="btn-line"
          stylePro="btn-line"
        />
      </div>

      <div className="relative">
        {/* Hình ảnh chính (Slidehow) */}
        <div className="w-full center flex-col bg-white py-10">
          <div className="relative w-full max-w-7xl h-auto min-h-[250px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl shadow-lg mt-4">
            <AnimatePresence mode="wait">
              <motion.img
                key={images[index]}
                src={images[index]}
                alt="Slide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full w-full object-contain"
              />
            </AnimatePresence>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full shadow-md transition-colors duration-200"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full shadow-md transition-colors duration-200"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* --- MỚI: Thanh lọc danh mục --- */}
        <div className="w-full flex justify-center items-center flex-wrap gap-3 md:gap-6 py-8 bg-sky-50">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-300
                ${
                  selectedCategory === category
                    ? "bg-sky-600 text-white shadow-lg scale-105"
                    : "bg-white text-sky-700 hover:bg-sky-100 shadow-sm"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* --- CẬP NHẬT: Truyền 'selectedCategory' vào ListProduct --- */}
        <ListProduct selectedCategory={selectedCategory} />
      </div>

      <Footer />
    </div>
  );
};

export default DashBoardCustomer;