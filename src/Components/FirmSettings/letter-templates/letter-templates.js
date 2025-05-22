import React, { useState } from "react";
import CommonHeader from "../common/common-header";
import NavFirmSettingsTab from "../common/nav-firm-settings-tab";
import LetterTemplatesALL from "./tabs/letter-template-all";
import UploadLetterTemplates from "./tabs/upload-letter-template";
import DocumentVariables from "./tabs/document-variables";
import CourtForms from "./tabs/court-forms";

const LetterTemplates = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const [activeTab, setActiveTab] = useState("letter_templates");

  const sidebarItems = [
    { id: "letter_templates", name: "Letter Templates" },
    { id: "upload_letter_template", name: "Upload New Letter Template" },
    { id: "document_variable", name: "Document Variables" },
    { id: "court_forms", name: "Court Forms" },

  ];
  const handleTabChange = (id) => {
    setActiveTab(id);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "letter_templates":
        return <LetterTemplatesALL />;
      case "upload_letter_template":
        return <UploadLetterTemplates handleTabChange={handleTabChange}/>;
      case "document_variable":
        return <DocumentVariables />;
      case "court_forms":
          return <CourtForms />;
    }
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="col-lg-12 m-b-5">
        <h3 style={{ fontSize: "24px" }}>Letter Templates</h3>
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

export default LetterTemplates;
