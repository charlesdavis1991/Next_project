import React from "react";
import { Nav } from "react-bootstrap";
import "./newcase.css";

function ModalHeaderTabs({ activeTab, setActiveTab }) {
  return (
    <Nav variant="tabs" className="" style={{ width: "100%", flex: "none" }}>
      <Nav.Item style={{ width: "25%" }}>
        <Nav.Link
          eventKey="new-client"
          active={activeTab === "new-client"}
          onClick={() => setActiveTab("new-client")}
          className={`d-flex align-items-center ${activeTab === "new-client" ? "active-tab" : ""}`}
          style={{ width: "100%" }}
        >
          New Case for New Client
        </Nav.Link>
      </Nav.Item>
      <Nav.Item style={{ width: "25%" }}>
        <Nav.Link
          eventKey="existing-client"
          active={activeTab === "existing-client"}
          onClick={() => setActiveTab("existing-client")}
          className={`d-flex align-items-center ${activeTab === "existing-client" ? "active-tab" : ""}`}
          style={{ width: "100%" }}
        >
          New Case for Existing Client
        </Nav.Link>
      </Nav.Item>
      <Nav.Item style={{ width: "25%" }}>
        <Nav.Link
          eventKey="new-client-existing-case"
          active={activeTab === "new-client-existing-case"}
          onClick={() => setActiveTab("new-client-existing-case")}
          className={`d-flex align-items-center ${activeTab === "new-client-existing-case" ? "active-tab" : ""}`}
          style={{ width: "100%" }}
        >
          New Client for Existing Case
        </Nav.Link>
      </Nav.Item>
      <Nav.Item style={{ width: "25%" }}>
        <Nav.Link
          eventKey="intake-reporting"
          active={activeTab === "intake-reporting"}
          onClick={() => setActiveTab("intake-reporting")}
          className={`d-flex align-items-center ${activeTab === "intake-reporting" ? "active-tab" : ""}`}
        >
          Intake Reporting
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default ModalHeaderTabs;
