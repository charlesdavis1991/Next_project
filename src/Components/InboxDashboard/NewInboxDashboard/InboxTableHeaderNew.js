import React from "react";

const InboxTableHeaderNew = ({ inboxTab }) => {
  return (
    <div
      className="row text-uppercase m-0"
      style={{
        background: "var(--primary-10)",
        color: "var(--primary)",
        fontWeight: 600,
        fontSize: "14px",
        textAlign: "center",
      }}
    >
      <div
        className="col-auto"
        style={{ maxWidth: "217px", flex: "0 0 217px" }}
      >
        document image
      </div>
      {inboxTab !== "processing" && (
        <>
          <div className="col-2 pl-0 pr-0" style={{ minWidth: "180px" }}>
            case
          </div>
          <div className="col-2 pl-0 pr-0 whitespace-nowrap">
            send document review task
          </div>
          {inboxTab === "insurance" && (
            <div className="col-auto flex-grow-1 pl-0 pr-0 ">insurance</div>
          )}
          {inboxTab === "account" && (
            <div className="col-auto flex-grow-1 pl-0 pr-0 ">invoice</div>
          )}
          {inboxTab === "check" && (
            <div className="col-auto flex-grow-1 pl-0 pr-0 ">Account</div>
          )}
          {!["insurance", "account", "check"].includes(inboxTab) && (
            <div className="col-auto flex-grow-1"></div>
          )}
          <div className="col-3 pl-0  whitespace-nowrap">
            Select Location for document
          </div>
          <div className="col pl-0  whitespace-nowrap">Save to Case</div>
          <div className="col pl-0 pr-0"></div>{" "}
        </>
      )}
    </div>
  );
};

export default InboxTableHeaderNew;
