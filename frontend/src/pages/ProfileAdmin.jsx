import React from "react";
import HeaderAdmin from "../layouts/HeaderAdmin";
import Infomation from "../components/Infomation";
import Footer from "../layouts/Footer";
import { CheckUser } from "../Function/CheckUser";

const ProfileAdmin = () => {
  CheckUser("Admin")
  return (
    <div>
      <HeaderAdmin
        styleOrder="btn-line"
        styleCart="btn-line"
        stylePro="line"
      ></HeaderAdmin>
      <Infomation></Infomation>
      <div className="my-10 mx-auto px-4 max-w-screen-xl">
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ProfileAdmin;
