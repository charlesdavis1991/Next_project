import React from "react";
import UploadIcon from "/public/bp_assets/img/cloud_icon.svg";

const PageSlot = ({ slot, onSelect }) => {
  return (
    <li
      className="d-flex align-items-center whitespace-nowrap"
      style={{
        padding: "0px 10px",
        height: "25px",
        cursor: "pointer",
      }}
      onClick={() => onSelect(slot)}
    >
      <span
        className="d-flex align-items-center justify-content-center"
        style={{ width: "19px" }}
      >
        <img
          src={UploadIcon}
          className="document-icons-width cursor-pointer"
          style={{ backgroundRepeat: "no-repeat" }}
          alt="Upload"
        />
      </span>
      <div
        className="d-flex align-items-center color-grey-2 hoverable-text"
        style={{ fontWeight: "bold" }}
      >
        <span className="ml-2 hoverable-text">{slot.slot_number}.</span>
        <span className="ml-2 hoverable-text">
          {slot.slot_name ? slot.slot_name : "Available"}
        </span>
      </div>
    </li>
  );
};

export default PageSlot;
