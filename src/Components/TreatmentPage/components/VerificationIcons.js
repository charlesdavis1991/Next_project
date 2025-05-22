import React from "react";
import {
  formatDate,
  formatDateForInput,
  formatDateVisitsDates,
} from "../utils/helperFn";

function VerificationIcons({ type, verificationData, dates, visits }) {
  const iconClass = verificationData != null ? "ic-verified" : "ic-unverified";

  const renderAvatar = () => {
    if (verificationData === null) {
      return (
        <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img mr-lg-1"></span>
      );
    }

    if (verificationData && verificationData?.profile === "") {
      return (
        <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img mr-lg-1"></span>
      );
    }

    if (verificationData?.profile) {
      return (
        <img
          src={`https://simplefirm-bucket.s3.amazonaws.com/static/${verificationData?.profile}`}
          alt=""
          className="verify-profile-img"
        />
      );
    }

    return (
      <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mr-lg-1"></span>
    );
  };

  const getLabelAndValue = () => {
    console.log("Dates Checking Here in the component ===>", dates);
    switch (type) {
      case "first":
        return {
          label: "First:",
          value:
            dates && dates.length > 0
              ? formatDateVisitsDates(dates[0]?.date)
              : "--/--/----",
          id: "treatment_first_date92",
        };
      case "last":
        return {
          label: "Last:",
          value:
            dates && dates.length > 1
              ? formatDateVisitsDates(dates[1]?.date)
              : "--/--/----",
          id: "treatment_second_date92",
        };
      case "visits":
        return {
          label: "Visits:",
          value: visits ? visits : "---",
          id: "treatment_visits92",
        };
      default:
        return { label: "", value: "", id: "" };
    }
  };

  const { label, value, id } = getLabelAndValue();

  return (
    <>
      {renderAvatar()}
      <span className="label text-grey" style={{ fontWeight: "600" }}>
        {label}
      </span>
      <span
        className="text-black p-r-5 p-l-5"
        style={{ fontWeight: "600" }}
        id={id}
      >
        {value}
      </span>
      <i className={`ic ${iconClass} ic-19`}></i>
    </>
  );
}

export default React.memo(VerificationIcons);
