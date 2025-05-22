import React from "react";

const TableFirmSettings = ({ children }) => {
  return (
    <div className="tab-content">
      <table
        className={`table table-borderless table-striped table-treatment has-specialty-icon has-height-25 block-table m-r-5`}
        id="treatment-summary-table"
      >
        {children}
      </table>
    </div>
  );
};

export default TableFirmSettings;
