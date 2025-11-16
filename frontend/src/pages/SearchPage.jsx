import { useSearchParams } from "react-router-dom";
import ListProduct from "../components/ListProduct";
import HeaderCustomer from "../layouts/HeaderCustomer";
import Footer from "../layouts/Footer";
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  return (
    <>
      <div className="sticky top-0 z-50">
        <HeaderCustomer
          styleCart={"btn-line"}
          styleOrder={"btn-line"}
          stylePro={"btn-line"}
        />
      </div>
      <ListProduct searchTerm={query} />
      <Footer/>
    </>
  );
};

export default SearchPage;
