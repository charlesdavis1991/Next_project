import React, { useState } from "react";
import NavFirmSettingsTab from "../common/nav-firm-settings-tab";
import CommonHeader from "../common/common-header";
import FirmAddressTabOne from "./tabs/firmAddress";
import LoginTimeOutTabTwo from "./tabs/loginTimeout";
import TimeZoneTabThree from "./tabs/timezone";

const FirmAddress = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];
  const [activeTab, setActiveTab] = useState("firm_address");

  const sidebarItems = [
    { id: "firm_address", name: "Firm Address" },
    { id: "login_timeout", name: "Login Timeout" },
    { id: "timezone", name: "TimeZone" },
  ];
  const handleTabChange = (id) => {
    setActiveTab(id);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "firm_address":
        return <FirmAddressTabOne />;
      case "login_timeout":
        return <LoginTimeOutTabTwo />;
      case "timezone":
        return <TimeZoneTabThree />;
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

export default FirmAddress;
