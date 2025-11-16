import HeaderCustomer from "../layouts/HeaderCustomer";
import Infomation from "../components/Infomation";
import Footer from "../layouts/Footer";
import { CheckUser } from "../Function/CheckUser";
const ProfileCustomer = () => {
  CheckUser("Customer")
  return (
    <div>
      <div className="sticky top-0">
        <HeaderCustomer
        styleOrder="btn-line"
        styleCart="btn-line"
        stylePro="line"
      ></HeaderCustomer>
      </div>
      <Infomation></Infomation>
      <Footer></Footer>
    </div>
  );
};

export default ProfileCustomer;
