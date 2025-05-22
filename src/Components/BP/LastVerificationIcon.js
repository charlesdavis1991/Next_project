import React, { useState, useEffect } from "react";
const origin = process.env.REACT_APP_BACKEND_URL;

function LastVerificationIcon({
  caseProvider_id,
  arg,
  isTreatmentDateLastVerified,
  setIsTreatmentDateLastVerified,
  dates,
}) {
  // const [isVerified, setIsVerified] = useState(false);
  // const [profile, setProfile] = useState("");

  // useEffect(() => {
  //   const fetchVerification = async () => {
  //     try {
  //       const response = await fetch(
  //         origin +
  //           "/api/treatment/check-verification/" +
  //           caseProvider_id +
  //           "/" +
  //           arg +
  //           "/"
  //       );

  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = await response.json();
  //       setIsVerified(data.varification);
  //       setProfile(data.profile_url);
  //     } catch (error) {
  //       console.error("Failed to fetch verification:", error);
  //       setIsVerified(false);
  //     }
  //   };

  //   fetchVerification();
  // }, [caseProvider_id]);

  // const iconClass =
  //   isTreatmentDateLastVerified && isTreatmentDateLastVerified.action
  //     ? isTreatmentDateLastVerified.action.toLowerCase() === "verified"
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
      {/* {isTreatmentDateLastVerified.action ? (
        isTreatmentDateLastVerified.action.toLowerCase() != "verified" ? (
          <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img mr-lg-1"></span>
        ) : isTreatmentDateLastVerified.profile != "" ? (
          <img
            src={
              "https://simplefirm-bucket.s3.amazonaws.com/static/" +
              isTreatmentDateLastVerified.profile
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

      <span className="label text-grey">Last Visit: </span>
      <span className="text-black mr-lg-1" id="treatment_second_date92">
        {dates.length !== 0 ? formatDate(dates[1]?.date) : "--/--/----"}
      </span>
      <i className={`ic ${iconClass} ic-19`}></i> */}
    </>
  );
}

export default LastVerificationIcon;
