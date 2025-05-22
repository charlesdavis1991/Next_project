import React from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import Main from "../Components/TimePageDashBoard/main";
import Footer from "../Components/common/footer";

function TimePage() {
  return (
    <>
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <div className="main-content p-t-130">
          <NavBar flaggedPageName="Time" />
          <Main />
          <NotesSectionDashboard />
        </div>
      </div>
    </div>
    <Footer/>
    </>  
);
}

export default TimePage;
