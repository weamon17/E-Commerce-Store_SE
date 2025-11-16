import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadInfoProducts } from "../../services/handleAPI";

const Icon = ({ children, onClick, className = "" }) => (
  <button onClick={onClick} className={`hover:scale-110 ${className}`}>
    {children}
  </button>
);

const BoxSearch = () => {
  const [listProduct, setListProduct] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await loadInfoProducts();
        setListProduct(data.products);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = listProduct.filter((p) =>
      p.productName.toLowerCase().includes(searchText.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
    setShowSuggestions(true);
  }, [searchText, listProduct]);

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSelectSuggestion = (name) => {
    setSearchText(name);
    setShowSuggestions(false);
    inputRef.current.focus();
    navigate(`/search?query=${encodeURIComponent(name)}`);
  };

  const handleSearch = () => {
    if (searchText.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
    <div className="relative Box-Search min-w-[80px] flex-1 center bg-gray-100 hover:bg-white hover:border hover:border-sky-500 h-[56px] rounded-full border border-transparent">
      <input
        ref={inputRef}
        type="text"
        placeholder="What do you want to buy?"
        className="inline-block w-11/12 h-full pl-5 bg-transparent outline-none placeholder:text-black"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => setShowSuggestions(suggestions.length > 0)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
            setShowSuggestions(false);
          }
        }}
      />
      <div className="flex items-center h-full gap-3 pr-2">
        <Icon onClick={() => setSearchText("")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-gray-400 hover:text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Icon>
        <Icon
          className="w-10 h-10 text-white bg-sky-600 rounded-full center hover:bg-sky-500"
          onClick={handleSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </Icon>
      </div>

      {/* Box gợi ý */}
      {showSuggestions && (
        <ul className="absolute top-[56px] left-0 right-0 bg-white border border-gray-300 rounded-b-md max-h-60 overflow-y-auto  shadow-md">
          {suggestions.length > 0 ? (
            suggestions.map(({ productName, id }) => (
              <li
                key={id}
                className="px-4 py-2 hover:bg-sky-100 cursor-pointer"
                onMouseDown={() => handleSelectSuggestion(productName)}
              >
                {productName}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-center text-gray-500">
              Product not found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default BoxSearch;
