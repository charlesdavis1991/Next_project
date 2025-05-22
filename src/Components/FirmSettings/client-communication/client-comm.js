import React, { useEffect, useState } from "react";

import useClientCommuincation from "./hooks/useClientCommunication";

import "./client-comm.css";

import CommonHeader from "../common/common-header";
import NavFirmSettingsTab from "../common/nav-firm-settings-tab";

import CommunicationEmail from "./tabs/comm-email";
import CommunicationText from "./tabs/comm-text";
import CommunicationChat from "./tabs/comm-chat";

const ClientCommunication = () => {
  const heading = "Firm Settings Client Communication";
  const points = [
    "1. Set up your firm's email for sending and receiving emails.",
    "2. Set up your firm's texting number for sending and receiving texts.",
    "3. Firm client chat settings.",
  ];

  const [activeTab, setActiveTab] = useState("comm_email");
  const sidebarItems = [
    { id: "comm_email", name: "Firm Email Contact" },
    { id: "comm_text", name: "Firm Phone Number for Texting" },
    { id: "comm_chat", name: "Firm Client Chat Portal" },
  ];

  const { 
    data: CommData, 
    refetch: refetchCommData, 
  } = useClientCommuincation();

  const handleTabChange = (id) => {
    setActiveTab(id);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "comm_email":
        return <CommunicationEmail data={CommData} refetchData={refetchCommData}/>;
      case "comm_chat":
        return <CommunicationChat data={CommData} refetchData={refetchCommData}/>;
      case "comm_text":
        return <CommunicationText data={CommData} refetchData={refetchCommData}/>;
    }
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <NavFirmSettingsTab
        sidebarItems={sidebarItems}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />
      <div className="tab-content mt-3">{renderActiveTabContent()}</div>
    </div>
  );
};

export default ClientCommunication;
