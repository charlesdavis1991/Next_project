import React from "react";
import { Form } from "react-bootstrap";

const CheckListNav = ({ duration, setDuration }) => {
  return (
    <div className="action-bar client-BarAlign has-checklist d-flex m-b-5 m-t-5 m-l-10">
      <span className="page-icon ">
        <i className="ic ic-29 ic-speedometer"></i>
      </span>
      <div className="text-wrapper text-white d-flex align-items-center p-l-5">
        <h2 className="text-white">CheckLists</h2>
      </div>
      <div className="text-wrapper text-white d-flex align-items-center p-l-5 pr-0 w-280">
        <div className="w-100">
          <p className="text-white">Select Days</p>
        </div>

        <Form.Select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="form-select form-control height-25 p-t-0 p-b-0 w-100"
        >
          <option value="All">All</option>
          <option value="90">90</option>
          <option value="60">60</option>
          <option value="30">30</option>
          <option value="14">14</option>
          <option value="5">5</option>
        </Form.Select>
      </div>
    </div>
  );
};

export default CheckListNav;
