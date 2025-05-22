import React, { useState, useEffect } from "react";
const origin = process.env.REACT_APP_BACKEND_URL;

function VerificationIcon({
  caseProvider_id,
  arg,
  isTreatmentDateFirstVerified,
  setIsTreatmentDateFirstVerified,
  dates,
}) {
  // const iconClass =
  //   isTreatmentDateFirstVerified && isTreatmentDateFirstVerified.action
  //     ? isTreatmentDateFirstVerified.action.toLowerCase() === "verified"
  //       ? "ic-verified"
  //       : "ic-unverified"
  //     : "ic-unverified";

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <>
      {/* {isTreatmentDateFirstVerified.action ? (
        isTreatmentDateFirstVerified.action.toLowerCase() != "verified" ? (
          <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img mr-lg-1"></span>
        ) : isTreatmentDateFirstVerified.profile != "" ? (
          <img
            src={
              "https://simplefirm-bucket.s3.amazonaws.com/static/" +
              isTreatmentDateFirstVerified.profile
            }
            alt=""
            className="verify-profile-img"
          />
        ) : (
          <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mr-lg-1"></span>
        )
      ) : (
        <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img mr-lg-1"></span>
      )}

      <span className="label text-grey">First Visit:</span>
      <span className="text-black mr-lg-1" id="treatment_first_date92">
        {dates.length !== 0 ? formatDate(dates[0].date) : "--/--/----"}
      </span>
      <i className={`ic ${iconClass} ic-19`}></i> */}
    </>
  );
}

export default VerificationIcon;
