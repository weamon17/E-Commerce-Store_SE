import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ResetPasswordPage from './pages/ResetPassword';
import ProfileCustomer from "./pages/ProfileCustomer";
import ChangePass from "./pages/ChangePass";
import LoadingPage from "./pages/LoadingPage";
import DashBoardCustomer from "./pages/DashBoardCustomer";
import DashboardAdmin from "./pages/DashboardAdmin";
import ErrorPage from "./pages/ErrorPage";
import HeaderAdmin from "./layouts/HeaderAdmin";
import ProfileAdmin from "./pages/ProfileAdmin";
import ManageCustomer from "./pages/ManageCustomer";
import ManageNoti from "./pages/ManageNoti";
import ManageOrder from "./pages/ManageOrder";
import ManageProduct from "./pages/ManageProduct";
import ManageStaff from "./pages/ManageStaff";
import ResetPassword from "./pages/ResetPassword";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import CheckoutPage from "./pages/CheckoutPage";
import SearchPage from "./pages/SearchPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoadingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard-customer" element={<DashBoardCustomer />} /> // Dashboard of customer
        <Route path="/profile-customer" element={<ProfileCustomer />} /> // profile of customer
        <Route path="/profile-admin" element={<ProfileAdmin />} /> // profile of admin
        <Route path="/change-password" element={<ChangePass />} /> 
        <Route path="/dashboard-admin" element={<DashboardAdmin />} /> 
        <Route path="/error" element={<ErrorPage />} /> 
        <Route path="/headeradmin" element={<HeaderAdmin />} /> 
        <Route path="/manage-customer" element={<ManageCustomer />} /> 
        <Route path="/manage-noti" element={<ManageNoti />} /> 
        <Route path="/manage-order" element={<ManageOrder />} /> 
        <Route path="/manage-product" element={<ManageProduct />} /> 
        <Route path="/manage-staff" element={<ManageStaff />} /> 
        <Route path="/reset-password" element={<ResetPassword />} /> 
        <Route path="/my-orders" element={<OrderPage />} /> 
        <Route path="/my-cart" element={<CartPage />} /> 
        <Route path="/checkout" element={<CheckoutPage />} /> 
        <Route path="/search" element={<SearchPage />} /> 

      </Routes>
    </Router>
  );
}
export default App
