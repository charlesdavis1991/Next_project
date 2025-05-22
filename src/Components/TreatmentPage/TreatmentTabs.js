import React, { useMemo, useState } from "react";
import "../common/GenericTab.css";

const TreatmentTabs = ({ handlePage, tabsData, height }) => {
  // Dynamically generate styles for each tab
  const [activeTab, setActiveTab] = useState(
    handlePage === "detail" ? "treatment" : handlePage
  );

  const handleTabClick = (tabId) => {
    if (tabId !== "newProvider" && tabId !== "treatmentDates") {
      setActiveTab(tabId);
      const tab = tabsData.find((tab) => tab.id === tabId);
      tab.onClick();
    } else {
      const tab = tabsData.find((tab) => tab.id === tabId);
      tab.onClick();
    }
  };
  const tabStyles = useMemo(() => {
    return tabsData.reduce((styles, tab, index) => {
      const color = tab.background;
      const hoverColor = tab.hoverColor || "var(--primary)";
      styles += `
        .tab-${tab.id}::before {
          border-bottom: ${height}px solid ${color};
        }
        .tab-${tab.id}::after {
          border-bottom: ${height}px solid ${color};
        }
          .tab-${tab.id}:hover::before {
          border-bottom: ${height}px solid ${hoverColor};
        }
        .tab-${tab.id}:hover::after {
          border-bottom: ${height}px solid ${hoverColor};
        }
             .tab-${tab.id}:active::before,
        .tab-${tab.id}.active::before {
          border-bottom: ${height}px solid ${hoverColor};
        }
        .tab-${tab.id}:active::after,
        .tab-${tab.id}.active::after {
          border-bottom: ${height}px solid ${hoverColor};
        }
        

        .tab-treatment:hover{
          z-index: 10 !important;
            background-color: ${hoverColor} !important;
        }
          
        .tab-treatment:active,
        .tab-treatment.active {
          z-index: 10 !important;
          color: ${tab.hoverColor};
        }

        .tab-dates:hover{
          z-index: 10 !important;
          background-color: ${hoverColor} !important;
        }
        .tab-dates:active,
        .tab-dates.active {
          z-index: 10 !important;
          color: ${tab.hoverColor};
        }
        .tab-newProvider:hover{
          z-index: 10 !important;
            background-color: ${hoverColor} !important;
        }
        .tab-simple:hover{
          z-index: 10 !important;
            background-color: ${hoverColor} !important;
        }
        .tab-newProvider:active,
        .tab-newProvider.active {
          z-index: 10 !important;
          color: ${tab.hoverColor};
        }
          .tab-treatmentDates:active,
        .tab-treatmentDates.active {
          z-index: 10 !important;
          color: ${tab.hoverColor};
        }
           .tab-treatmentDates:hover{
          z-index: 10 !important;
            background-color: ${hoverColor} !important;
        }

        .tab-${tab.id}:active,
        .tab-${tab.id}.active {
          color: ${tab.hoverColor};
        }
      
        .tab-${tab.id}:hover {
          background-color: ${hoverColor};
        }

        .tab-${tab.id}{
          color: ${tab.color};
        }
        .tab-newProvider{
          padding-left: 10px !important;
        }
           .tab-treatmentDates{
          padding-left: 10px !important;
        }
        
      `;
      return styles;
    }, "");
  }, [tabsData, height]);

  return (
    <>
      <style>{tabStyles}</style>

      <div className="continuous-tabs">
        {tabsData.map((tab, index) => (
          <button
            id={tab.id}
            key={index}
            data-toggle="modal"
            data-target={tab.modalTarget}
            onClick={() => handleTabClick(tab.id)}
            className={`tab-defendant-page tab-trapezium-cycles-corners tab-${tab.id} d-flex align-items-center justify-content-center ${
              activeTab === tab.id ? "active" : ""
            }`}
            style={{
              background: tab.background,
              zIndex: tabsData.length - index,
              left: tab.left,
              paddingLeft: "5px",
              paddingRight: "10px",
            }}
          >
            {tab.leftHand && tab.span}
            {tab.label}
            {tab.rightHand && tab.span}
          </button>
        ))}
      </div>
    </>
  );
};

export default React.memo(TreatmentTabs);
