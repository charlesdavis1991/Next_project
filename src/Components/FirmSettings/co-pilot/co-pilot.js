import React, { useState } from "react";
import CommonHeader from "../common/common-header";
import CoPilotSettings from "./tabs/copilot-settings";
import CaseTypes from "./tabs/case-type";
import CoPilotStates from "./tabs/copilot-states";
import CoPilotInjuries from "./tabs/copilot-injuries";
import NavFirmSettingsTab from "../common/nav-firm-settings-tab";

const CoPilot = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];
  const [activeTab, setActiveTab] = useState("copilot_settings");

  const sidebarItems = [
    { id: "copilot_settings", name: "CoPilot Settings" },
    { id: "case_type", name: "Case Type" },
    { id: "state", name: "State" },
    { id: "injuries", name: "Injuries" },
  ];
  const handleTabChange = (id) => {
    setActiveTab(id);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "copilot_settings":
        return <CoPilotSettings />;
      case "case_type":
        return <CaseTypes />;
      case "state":
        return <CoPilotStates />;
      case "injuries":
        return <CoPilotInjuries />;
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

export default CoPilot;
