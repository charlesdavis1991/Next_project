import React from 'react';
import Footer from '../Components/common/footer';
import Sidebar from '../Components/Sidebars/main';
import NavBar from '../Components/Navbars/main';
import OtherPartiesDashBoard from '../Components/OtherPartiesDashboard/main';


const OtherPartiesPage = () => {
    return (
        <>
        <div className="page-wrapper settle-page-wrapper">
        <Sidebar />
        <div className="page-container settle-page-container">
            <NavBar flaggedPageName={'Parties'} />
            <OtherPartiesDashBoard />
        </div> 
        </div>
        <Footer/>
        </>
    )
}

export default OtherPartiesPage