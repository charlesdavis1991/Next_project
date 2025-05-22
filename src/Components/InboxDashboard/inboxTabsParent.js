import React from "react";
import InboxTabComponent from "./inboxTabComponent";
import GenericTabs from "../common/GenericTab";
const InboxTabsParent = ({ inboxTab, inboxTabsCount, handleTabChange }) => {
  const tabs = [
    { id: "processing", label: "Processing", key: "processing" },
    { id: "completed", label: "Completed", key: "completed" },
    { id: "client", label: "Client", key: "client" },
    { id: "check", label: "Check", key: "check" },
    { id: "insurance", label: "Insurance", key: "insurance" },
    { id: "account", label: "Account", key: "account" },
    { id: "ocr_failed", label: "OCR Failed", key: "ocr_failed" },
    { id: "unidentified", label: "UnIdentified", key: "unidentified" },
  ];

  console.log(inboxTabsCount);
  const tabsData = [
    {
      id: "processing",
      label: "Processing",
      onClick: () => handleTabChange("processing"),
      className:
        inboxTab === "processing"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      background:
        inboxTab === "processing"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      span: inboxTabsCount["processing"] > 0 && (
        <span className="fw-bold m-l-5 text-gold">
          {inboxTabsCount["processing"]}
        </span>
      ),
      rightHand: true,
      color:
        inboxTab === "processing" ? "white" : "var(--primary-30) !important",
      activeColor: "white",
    },
    {
      id: "completed",
      label: "Completed",
      onClick: () => handleTabChange("completed"),
      className:
        inboxTab === "completed"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      left: "-3px",
      background:
        inboxTab === "completed"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      span: inboxTabsCount["completed"] > 0 && (
        <span className="fw-bold m-l-5 text-gold">
          {inboxTabsCount["completed"]}
        </span>
      ),
      rightHand: true,
      color:
        inboxTab === "completed" ? "white" : "var(--primary-30) !important",
      activeColor: "white",
    },
    {
      id: "client",
      label: "Client",
      onClick: () => handleTabChange("client"),
      className:
        inboxTab === "client"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      left: "-6px",
      background:
        inboxTab === "client"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      span: inboxTabsCount["client"] > 0 && (
        <span className="fw-bold m-l-5 text-gold">
          {inboxTabsCount["client"]}
        </span>
      ),
      rightHand: true,
      color: inboxTab === "client" ? "white" : "var(--primary-30) !important",
      activeColor: "white",
    },
    {
      id: "check",
      label: "Check",
      onClick: () => handleTabChange("check"),
      className:
        inboxTab === "check"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      left: "-9px",
      background:
        inboxTab === "check"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      span: inboxTabsCount["check"] > 0 && (
        <span className="fw-bold m-l-5 text-gold">
          {inboxTabsCount["check"]}
        </span>
      ),
      rightHand: true,
      color: inboxTab === "check" ? "white" : "var(--primary-30) !important",
      activeColor: "white",
    },
    {
      id: "insurance",
      label: "Insurance",
      onClick: () => handleTabChange("insurance"),
      className:
        inboxTab === "insurance"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      left: "-12px",
      background:
        inboxTab === "insurance"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      span: inboxTabsCount["insurance"] > 0 && (
        <span className="fw-bold m-l-5 text-gold">
          {inboxTabsCount["insurance"]}
        </span>
      ),
      rightHand: true,
      color:
        inboxTab === "insurance" ? "white" : "var(--primary-30) !important",
      activeColor: "white",
    },
    {
      id: "account",
      label: "Account",
      onClick: () => handleTabChange("account"),
      className:
        inboxTab === "account"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      left: "-15px",
      background:
        inboxTab === "account"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      span: inboxTabsCount["account"] > 0 && (
        <span className="fw-bold m-l-5 text-gold">
          {inboxTabsCount["account"]}
        </span>
      ),
      rightHand: true,
      color: inboxTab === "account" ? "white" : "var(--primary-30) !important",
      activeColor: "white",
    },
    {
      id: "ocr_failed",
      label: "OCR Failed",
      onClick: () => handleTabChange("ocr_failed"),
      className:
        inboxTab === "ocr_failed"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      left: "-18px",
      background:
        inboxTab === "ocr_failed"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      span: inboxTabsCount["ocr_failed"] > 0 && (
        <span className="fw-bold m-l-5 text-gold">
          {inboxTabsCount["ocr_failed"]}
        </span>
      ),
      rightHand: true,
      color:
        inboxTab === "ocr_failed" ? "white" : "var(--primary-30) !important",
      activeColor: "white",
    },
    {
      id: "unidentified",
      label: "UnIdentified",
      onClick: () => handleTabChange("unidentified"),
      className:
        inboxTab === "unidentified"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      left: "-21px",
      background:
        inboxTab === "unidentified"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      span: inboxTabsCount["unidentified"] > 0 && (
        <span className="fw-bold m-l-5 text-gold">
          {inboxTabsCount["unidentified"]}
        </span>
      ),
      rightHand: true,
      color:
        inboxTab === "unidentified" ? "white" : "var(--primary-30) !important",
      activeColor: "white",
    },
  ];
  return (
    <div className="d-flex justify-content-between">
      {/* <div
        className="nav nav-tabs align-items-center height-25"
        id="nav-tab"
        role="tablist"
      > */}

      <GenericTabs tabsData={tabsData} height={25} currentTab={inboxTab} />
      {/* </div> */}
      <div
        className="nav nav-tabs"
        role="tablist"
        style={{
          paddingLeft: "2px",
        }}
      >
        <a
          style={{
            background:
              inboxTab === "document_history"
                ? "var(--primary) !important"
                : "var(--primary-70) !important",
          }}
          onClick={() => handleTabChange("document_history")}
          id="document-history"
          className={`nav-item text-capitalize nav-link inbox-tab btn btn-primary rounded-0 ${
            inboxTab === "document_history" ? "active" : ""
          }`}
          data-toggle="tab"
          href={`#inbox-tab-document-history`}
          role="tab"
          aria-controls="all"
          aria-selected="true"
        >
          History
          {inboxTabsCount["document_history"] > 0 && (
            <span className="fw-bold m-l-5 text-gold">
              {inboxTabsCount["document_history"]}
            </span>
          )}
        </a>
      </div>
    </div>
  );
};

export default InboxTabsParent;
