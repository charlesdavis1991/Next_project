import React from "react";

const NavLetterTemplates = ({ pages, activeTab, handleTabChange }) => {
  return (
    <nav className="nav nav-tabs custom-nav-tabs d-flex align-items-center justify-content-around">
      <a
        className={`nav-item nav-link custom-tab-item ${
          activeTab === "all" ? "active custom-tab-active" : ""
        }`}
        onClick={() => handleTabChange("all")}
        role="tab"
        aria-selected={activeTab === "all"}
      >
        All
      </a>

      {pages.map((page) => (
        <a
          key={page.id}
          className={`nav-item nav-link custom-tab-item ${
            activeTab === page.id ? "active custom-tab-active" : ""
          }`}
          onClick={() => handleTabChange(page.id)}
          role="tab"
          aria-selected={activeTab === page.id}
        >
          {page.name}
        </a>
      ))}
    </nav>
  );
};

export default NavLetterTemplates;
