import React from 'react'
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import NotesSectionDashboard from '../Components/NotesSectionDashboard/main'
import Footer from "../Components/common/footer";

function NotesSectionPage() {
  return (
    <>
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <NavBar flaggedPageName="Notes" />
        
        <div className="main-content p-t-130">
            <NotesSectionDashboard />
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default NotesSectionPage
