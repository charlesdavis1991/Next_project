import React, { useMemo, useState } from "react";
import "./GenericTab.css";

const GenericTabs = ({ tabsData, height, currentTab, popupTabs }) => {
  const [activeTab, setActiveTab] = useState(currentTab ? currentTab : null);

  // Dynamically generate styles for each tab
  const tabStyles = useMemo(() => {
    return tabsData.reduce((styles, tab) => {
      const color = tab.background;
      styles += `
        .tab-${tab.id}::before {
          border-bottom: ${height}px solid ${color};
        }
        .tab-${tab.id}::after {
          border-bottom: ${height}px solid ${color};
        }
        .tab-${tab.id}:active,
        .tab-${tab.id}.active {
          color: ${tab.activeColor};
        }
        .tab-${tab.id} {
          color: ${tab.color};
        }
      `;
      return styles;
    }, "");
  }, [tabsData, height]);

  return (
    <>
      <style>{tabStyles}</style>

      <div className="continuous-tabs">
        {tabsData.map((tab, index) => {
          let currTab = popupTabs && popupTabs ? currentTab : activeTab;
          const activeIndex = tabsData.findIndex((t) => t.id === currTab);
          const hasValidActiveTab = activeIndex !== -1;
          const isActive = tab.id === currTab;

          let zIndex;

          if (isActive) {
            zIndex = tabsData.length + 1; // Highest for active tab
          } else if (
            hasValidActiveTab &&
            (index === activeIndex - 1 || index === activeIndex + 1)
          ) {
            zIndex = tabsData.length - index - 1; // Lower for neighbors
          } else {
            zIndex = tabsData.length - index;
          }

          return (
            <button
              id={tab.id}
              key={index}
              data-toggle="modal"
              data-target={tab.modalTarget}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.onClick) tab.onClick();
              }}
              className={`tab-defendant-page tab-trapezium-cycles-corners tab-${tab.id} d-flex align-items-center justify-content-center`}
              style={{
                background: tab.background,
                zIndex: zIndex,
                left: tab.left,
                padding: "0px 15px",
              }}
            >
              {tab.leftHand && tab.span}
              {tab.label}
              {tab.rightHand && tab.span}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default GenericTabs;
