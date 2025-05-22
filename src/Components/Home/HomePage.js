// import "../../../public/BP_resources/css/home-original.css";
import "../../../public/BP_resources/css/home_component.css";
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebars/main";
import NavBar from "../Navbars/main";
import ActionBar from "./ActionBar";

import Chats from "./Chats";
import NewsFeed from "./NewsFeed";
import CaseDetails from "./CaseDetails";
import Footer from "../common/footer";

const HomePage = ({}) => {
  const [chatHeight, setChatHeight] = useState(47);

  const handleChatHeightChange = (height) => {
    setChatHeight(height);
  };
  return (
    <>
      <div className="page-wrapper">
        <Sidebar />
        <div className="page-container">
          <NavBar />
          <ActionBar />
        </div>

        <div
          className="container-fluid h-80 ml-0 Home-ML5P"
          style={{ marginTop: "165px" }}
        >
          <div className="row h-100">
            <div className="col-12 h-100" style={{ paddingRight: "10px" }}>
              <div
                className="content-wrapper"
                style={{
                  gridTemplateRows: `${chatHeight}px 1fr`,
                }}
              >
                <Chats onHeightChange={handleChatHeightChange} />
                <NewsFeed />
                <CaseDetails />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
