import { useState, useEffect } from "react";
import Product from "./Product";
import DetailProductModal from "./DetailProductModal";
import { loadInfoProducts, loadInfoUser } from "../services/handleAPI";

const ListProduct = ({ selectedCategory = "All", searchTerm = "" }) => {
  const [products, setProducts] = useState([]);
  const [userID, setUserID] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("name-asc");
  

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data1 = await loadInfoProducts();
        const data2 = await loadInfoUser();
        setUserID(data2.user._id);
        setProducts(data1.products);
      } catch (error) {
        console.error("Failed to load products", error);
      }
    }
    fetchProducts();
  }, []);

  const applyFilter = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
  };

  const resetFilter = () => {
    setTempMinPrice("");
    setTempMaxPrice("");
    setMinPrice("");
    setMaxPrice("");
  };

  const filteredProducts = products
    .filter(({ productName }) =>
      productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      if (selectedCategory === "All") return true;
      return product.category === selectedCategory; 
    })
    .filter(({ saleprice }) => {
      const price = Number(saleprice);
      const min = Number(minPrice);
      const max = Number(maxPrice);
      if (minPrice !== "" && price < min) return false;
      if (maxPrice !== "" && price > max) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "name-asc":
          return a.productName.localeCompare(b.productName);
        case "name-desc":
          return b.productName.localeCompare(a.productName);
        case "price-asc":
          return Number(a.saleprice) - Number(b.saleprice);
        case "price-desc":
          return Number(b.saleprice) - Number(a.saleprice);
        default:
          return 0;
      }
    });

  const FilterUI = (
    <div className="bg-white border rounded-lg p-4 mb-6 shadow-md flex flex-col md:flex-row md:items-center md:gap-6">
      <h2 className="text-xl font-bold mb-4 md:mb-0 text-gray-900 md:hidden">
        Filter & Sort
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-0">
        <div className="flex-1">
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Price from:
          </label>
          <input
            type="number"
            min="0"
            className="border rounded px-3 py-2 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            value={tempMinPrice}
            onChange={(e) => setTempMinPrice(e.target.value)}
            placeholder="Min"
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Price to:
          </label>
          <input
            type="number"
            min="0"
            className="border rounded px-3 py-2 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            value={tempMaxPrice}
            onChange={(e) => setTempMaxPrice(e.target.value)}
            placeholder="Max"
          />
        </div>
      </div>

      <div className="mb-4 md:mb-0 md:flex-1">
        <label className="block font-semibold mb-1 text-sm text-gray-700">
          Sort by:
        </label>
        <select
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="name-asc">Name A → Z</option>
          <option value="name-desc">Name Z → A</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
        </select>
      </div>

      <div className="flex gap-4 md:w-auto">
        <button
          onClick={applyFilter}
          className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition flex-grow"
        >
          Apply
        </button>
        <button
          onClick={resetFilter}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition flex-grow"
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sky-50">
      
      
      <main
        className={`flex-1 p-4 sm:p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto`}
      >
        {FilterUI}

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-center text-sky-700">
          Product List
        </h1>


        <div
          className={`grid gap-4 sm:gap-6 p
            grid-cols-2 
            sm:grid-cols-3 
            md:grid-cols-3 
            lg:grid-cols-4 
            xl:grid-cols-5
          `}
        >
          {filteredProducts.map(
            ({
              productId,
              productName,
              oldprice,
              saleprice,
              quantity,
              image,
              description,
              category, 
            }) => (
              <Product
                key={productId}
                name={productName}
                price={saleprice}
                oldprice={oldprice}
                quantity={quantity}
                image={`http://localhost:5000/${image?.replace(/^\/+/, "")}`}
                onClick={() =>
                  setSelectedProduct({
                    productId,
                    productName,
                    oldprice,
                    saleprice,
                    quantity,
                    image,
                    description,
                    category,
                  })
                }
              />
            )
          )}
        </div>
        {filteredProducts.length === 0 && (
         <div className="w-full py-12 flex items-center justify-center text-gray-500 text-lg">
          Product not Found
          </div>
        ) }
        <DetailProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          userId={userID}
        />
      </main>
    </div>
  );
};

export default ListProduct;