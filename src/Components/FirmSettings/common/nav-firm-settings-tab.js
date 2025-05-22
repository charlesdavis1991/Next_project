import React from "react";

const NavFirmSettingsTab = ({ sidebarItems, handleTabChange, activeTab }) => {
  return (
    <nav className="nav nav-tabs custom-nav-tabs d-flex align-items-center justify-content-around">
      {sidebarItems.map((item) => (
        <a
          key={item.id}
          className={`nav-item nav-link custom-tab-item ${activeTab === item.id ? "active custom-tab-active" : ""}`}
          onClick={() => handleTabChange(item.id)}
          role="tab"
          aria-selected={activeTab === item.id}
        >
          {item.name}
        </a>
      ))}
    </nav>
  );
};

export default NavFirmSettingsTab;
