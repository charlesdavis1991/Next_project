import React, { useState } from "react";
import CommonHeader from "../common/common-header";
import "./quickbooks.css";
import api from "../../../api/api";
const QuickBooks = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const [isQuickBooksEnabled, setIsQuickBooksEnabled] = useState(false);

  const handleToggle = async () => {
    setIsQuickBooksEnabled(!isQuickBooksEnabled);
    if (!isQuickBooksEnabled) {
      await getQuickBooks();
    }
  };

  const getQuickBooks = async () => {
    try {
      const response = await api.get("/api/firmsetting-page/quickbooks/");
      if (!response?.data?.active) {
        window.open(response?.data?.quickbooks_auth_url);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="col-lg-12 m-t-5">
        <div className="row">
          <h2 className="text-center">QuickBooks</h2>
        </div>
        <div className="row m-t-5">
          <div className="col-lg-4">
            <div className="form-group form-check mt-2">
              <label className="switch-quickbooks">
                <input
                  type="checkbox"
                  checked={isQuickBooksEnabled}
                  onChange={handleToggle}
                />
                <span className="slider-quickbooks round"></span>
              </label>
              <label className="ml-2">
                <nobr>Enable QuickBooks</nobr>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickBooks;
