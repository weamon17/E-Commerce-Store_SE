import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

// Your existing images
import BackgroundContent from "../assets/backgroundstore.jpg"; // Using this for the Hero
import picture2 from "../assets/picture2.png";
import picture3 from "../assets/smartphone&wearabels.png";
import picture4 from "../assets/laptop&deskop.png";
import picture5 from "../assets/gaming.png";
import picture6 from "../assets/varities.jpg";

// Icons for the new "Trust Bar" and sections
import {
  Package,
  ArrowRight,
  Truck, 
  Cpu,     
  Shield,  
  Layers   
} from "lucide-react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

//Define categories for the grid
const categories = [
  {
    name: "Laptops & Desktops",
    image: picture4, 
  },
  {
    name: "Smartphones & Wearables",
    image: picture3, 
  },
  {
    name: "Gaming & Accessories",
    image: picture5, 
  },
];

const LoadingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-800">
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      {/* === 1. Hero Section === */}
      {/* Uses a pastel blue background */}
      <section className="bg-sky-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Hero Text Content */}
          <motion.div
            className="text-center md:text-left space-y-5"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-sky-700">
              Your future is just a click away
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to TechSync. Discover a seamless shopping experience where innovation meets convenience, from the latest gadgets to essential electronics.
            </p>
            <div className="pt-4" onClick={() => navigate("/login")}>
              <button className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2">
                Shop All Products
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.img
            src={BackgroundContent}
            alt="Store Technology"
            className="w-full max-h-[400px] object-cover rounded-xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      </section>

      {/* === 2. Trust Bar Section (NEW) === */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6">
            <Truck className="w-12 h-12 text-sky-600" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              Fast, Free Shipping
            </h3>
            <p className="mt-1 text-gray-600">On all orders over 1.000.000 VND</p>
          </div>
          <div className="flex flex-col items-center p-6">
            <Cpu className="w-12 h-12 text-sky-600" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              Latest Technology
            </h3>
            <p className="mt-1 text-gray-600">Only the best and newest products</p>
          </div>
          <div className="flex flex-col items-center p-6">
            <Shield className="w-12 h-12 text-sky-600" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              Secure Payments
            </h3>
            <p className="mt-1 text-gray-600">Your information is safe with us</p>
          </div>
        </div>
      </section>

      {/* === 3. Category Grid Section (NEW) === */}
      {/* Alternating pastel blue background */}
      <section className="bg-sky-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold tracking-tight text-sky-700">
              Shop Hottest Categories
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              Find exactly what you're looking for.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <motion.div
                key={category.name}
                className="group relative rounded-xl shadow-lg overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => navigate("/products")} // Navigate to products page
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-2xl font-semibold text-white">
                    {category.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === 4. Content Section 1 (Products Available) === */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-4xl font-semibold tracking-tight text-sky-700 flex items-center justify-center md:justify-start gap-3">
              <Package className="w-10 h-10" />
              Products Available
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our store offers a wide selection of electronics including laptops, smartphones, tablets, smartwatches, gaming accessories, and home appliances. Every product is carefully selected to ensure performance, durability, and value for money.
            </p>
          </div>
          <img
            src={picture2}
            alt="Available Products"
            className="w-full rounded-lg shadow-xl object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </section>

      {/* === 5. Content Section 2 (Product Variety) === */}
      {/* Alternating pastel blue background */}
      <section className="bg-sky-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image on left for md screens, text on right */}
          <img
            src={picture6}
            alt="Product Variety"
            className="w-full rounded-lg shadow-xl object-cover transition-transform duration-300 hover:scale-105 md:order-1"
          />
          <div className="space-y-6 text-center md:text-left md:order-2">
            <h2 className="text-4xl font-semibold tracking-tight text-sky-700 flex items-center justify-center md:justify-start gap-3">
              <Layers className="w-10 h-10" />
              Product Variety
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At TechSync, we believe technology should fit every lifestyle. That’s why we provide a diverse range of products from top global brands, giving you plenty of options whether you’re upgrading your setup or finding the perfect gift.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoadingPage;