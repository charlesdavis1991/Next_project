import React, { useState } from "react";
import { formatDateForPanelDisplay } from "../../Utils/helper";

const ClaimInfo = ({
  insurance_type_name,
  insurance_liabilityLimit,
  insurance_liabilityLimitAll,
  insurance_policy_number,
  insurance_claim_number,
  insurance_Dateconfirmedactive,
  handleEditModalShow,
}) => {
  const myStyle = {
    box: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "4px",
    },
    title: {
      textAlign: "center",
      color: "#007bff",
      textTransform: "uppercase",
    },
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Formating Liability figures
  const formatWithCommas = (value) => {
    if (value !== "") {
      const intValue = parseInt(value);
      const formattedValue = intValue.toLocaleString();
      return formattedValue;
    } else {
      return value;
    }
  };

  return (
    <>
      <div className="info-div">
        <div onClick={() => handleEditModalShow("claim")} className="h-100">
          <p class="columnsTitle text-primary text-center  text-uppercase">
            Claim Information
          </p>
          <div class="row mb-0">
            <div class="col text-left">
              <span class="d-inline-block ">Type</span>
            </div>
            <div class="col-auto text-left ">
              <p>{insurance_type_name && insurance_type_name}</p>
            </div>
          </div>
          <div class="row mb-0">
            <div class="col text-left">
              <span class="d-inline-block ">Limits</span>
            </div>
            <div class="col-auto text-left ">
              <p>
                ${" "}
                {insurance_liabilityLimit
                  ? formatWithCommas(insurance_liabilityLimit)
                  : ""}{" "}
                / ${" "}
                {insurance_liabilityLimitAll
                  ? formatWithCommas(insurance_liabilityLimitAll)
                  : ""}
              </p>
            </div>
          </div>
          <div class="row mb-0">
            <div class="col text-left">
              <span class="d-inline-block ">Policy</span>
            </div>
            <div class="col-auto text-left ">
              <p>{insurance_policy_number && insurance_policy_number}</p>
            </div>
          </div>
          <div class="row mb-0">
            <div class="col text-left">
              <span class="d-inline-block ">Claim</span>
            </div>
            <div class="col-auto text-left ">
              <p>{insurance_claim_number && insurance_claim_number}</p>
            </div>
          </div>
          <div class="row mb-0">
            <div class="col text-left">
              <span class="d-inline-block ">Date</span>
            </div>
            <div class="col-auto text-left ">
              <p>
                {insurance_Dateconfirmedactive &&
                  formatDateForPanelDisplay(insurance_Dateconfirmedactive)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimInfo;
