import React from 'react'
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import CaseNavigatorDashboard from '../Components/CaseNavigatorDashboard/CaseNavigatorDashboard';
import { CaseNavigatorModalProvider } from '../Components/CaseNavigatorDashboard/CaseNavigatorModalProvider';
import Footer from "../Components/common/footer";

function CaseNavigatorPage() {
  return (
    <>
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <NavBar flaggedPageName={'Case'} />
         
        <div className="main-content p-t-165">
        <CaseNavigatorModalProvider>
            <CaseNavigatorDashboard/>
        </CaseNavigatorModalProvider>
        </div>
      </div>
    </div>
  <Footer/>
  </>
  )
}

export default CaseNavigatorPage
