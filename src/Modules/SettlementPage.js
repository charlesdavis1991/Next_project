import React from 'react'
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import Footer from "../Components/common/footer";
import "../../public/BP_resources/css/settlement_copy.css";
import SettlementDashboard from '../Components/SettlementDashboard/main';

const SettlementPage = () => {
  return (
    <>
    <div className="page-wrapper settle-page-wrapper">
      <Sidebar />
      <div className="page-container settle-page-container">
        <NavBar flaggedPageName={'Settlement'} />
        <SettlementDashboard />
      </div> 
    </div>
    <Footer/>
    </>
  );
}

export default SettlementPage