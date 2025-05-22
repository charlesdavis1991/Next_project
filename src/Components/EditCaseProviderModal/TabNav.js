import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditCaseProviderTab } from "../../Redux/client-providers/clientProviderSlice";

export default function TabNav() {
  const dispatch = useDispatch();
  const activeTabId = useSelector(
    (state) => state.clientProvider.editCaseProviderTab
  );

  const handleTabChange = (tabId) => {
    dispatch(setEditCaseProviderTab(tabId));
  };

  return (
    <nav className="ml-0">
      <div
        className="nav nav-tabs justify-content-around"
        id="nav-tab"
        role="tablist"
      >
        <a
          className={`nav-item nav-link Pad8 tab-item ${activeTabId === "provider-link" ? "active show" : ""}`}
          id="provider-link"
          data-toggle="tab"
          href="#provider-tab"
          role="tab"
          aria-controls="provider-tab"
          aria-selected={activeTabId === "provider-link"}
          onClick={() => handleTabChange("provider-link")}
        >
          Provider
        </a>
        <a
          className={`nav-item nav-link Pad8 tab-item ${activeTabId === "treatment-location-link" ? "active show" : ""}`}
          id="treatment-location-link"
          data-toggle="tab"
          href="#treatment-location-tab"
          role="tab"
          aria-controls="treatment-location-tab"
          aria-selected={activeTabId === "treatment-location-link"}
          onClick={() => handleTabChange("treatment-location-link")}
        >
          Treatment Location
        </a>
        <a
          className={`nav-item nav-link Pad8 tab-item ${activeTabId === "request-billing-link" ? "active show" : ""}`}
          id="request-billing-link"
          data-toggle="tab"
          href="#request-billing-tab"
          role="tab"
          aria-controls="request-billing-tab"
          aria-selected={activeTabId === "request-billing-link"}
          onClick={() => handleTabChange("request-billing-link")}
        >
          Request Billing
        </a>
        <a
          className={`nav-item nav-link Pad8 tab-item ${activeTabId === "request-record-link" ? "active show" : ""}`}
          id="request-record-link"
          data-toggle="tab"
          href="#request-record-tab"
          role="tab"
          aria-controls="request-record-tab"
          aria-selected={activeTabId === "request-record-link"}
          onClick={() => handleTabChange("request-record-link")}
        >
          Request Records
        </a>
        <a
          className={`nav-item nav-link Pad8 tab-item ${activeTabId === "lien-holder-link" ? "active show" : ""}`}
          id="lien-holder-link"
          data-toggle="tab"
          href="#lien-holder-tab"
          role="tab"
          aria-controls="lien-holder-tab"
          aria-selected={activeTabId === "lien-holder-link"}
          onClick={() => handleTabChange("lien-holder-link")}
        >
          Lien Holder
        </a>
        <a
          className={`nav-item nav-link Pad8 tab-item ${activeTabId === "treatment-dates-link" ? "active show" : ""}`}
          id="treatment-dates-link"
          data-toggle="tab"
          href="#treatment-dates-tab"
          role="tab"
          aria-controls="treatment-dates-tab"
          aria-selected={activeTabId === "treatment-dates-link"}
          onClick={() => handleTabChange("treatment-dates-link")}
        >
          Treatment Dates
        </a>
        <a
          className={`nav-item nav-link Pad8 tab-item ${activeTabId === "provider-charges-link" ? "active show" : ""}`}
          id="provider-charges-link"
          data-toggle="tab"
          href="#provider-charges-tab"
          role="tab"
          aria-controls="provider-charges-tab"
          aria-selected={activeTabId === "provider-charges-link"}
          onClick={() => handleTabChange("provider-charges-link")}
        >
          Provider Charges
        </a>
      </div>
    </nav>
  );
}
