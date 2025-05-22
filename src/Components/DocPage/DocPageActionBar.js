import React from "react";
import PhotoIcon from "../../../public/BP_resources/images/icon/photo-icon-color.svg";
import { Tabs, Tab, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

function DocPageActionBar({ onSelect, data }) {
  const open = useSelector((state) => state?.open?.open);

  return (
    <div
      className="action-bar client-BarAlign d-flex align-items-center m-t-5 margin-left-12"
      style={{ zIndex: open ? "0" : "" }}
    >
      <span className="page-icon">
        <img src={PhotoIcon} alt="Photo Icon" />
      </span>
      <div className="text-wrapper text-white d-flex align-items-center p-l-5">
        <h2 className="text-white">Documents</h2>
      </div>
      <div
        className="btn-wrapper d-flex align-items-center "
        style={{ height: "99%" }}
      >
        <Tabs
          defaultActiveKey="all"
          id="doc-tabs"
          className="hello"
          onSelect={onSelect}
        >
          <Tab
            eventKey="all"
            title="All"
            defaultActiveKey="all"
            tabClassName=" nav-item nav-link btn btn-primary rounded-0 Doc-background-color-transparent"
          />
          {data?.map((tab) => (
            <Tab
              key={tab?.id}
              eventKey={tab?.id}
              title={tab?.name}
              tabClassName="nav-item nav-link btn btn-primary rounded-0 Doc-background-color-transparent"
              activeClassName="active text-white bg-dark"
            />
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default DocPageActionBar;
