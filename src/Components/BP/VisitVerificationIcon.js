import React, { useState, useEffect } from "react";
const origin = process.env.REACT_APP_BACKEND_URL;

function VisitVerificationIcon({
  caseProvider_id,
  arg,

  isTreatmentDateVisitVerified,
  visits,
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
  //   isTreatmentDateVisitVerified && isTreatmentDateVisitVerified.action
  //     ? isTreatmentDateVisitVerified.action.toLowerCase() === "verified"
  //       ? "ic-verified"
  //       : "ic-unverified"
  //     : "ic-unverified";

  return (
    <>
      {/* {isTreatmentDateVisitVerified.action ? (
        isTreatmentDateVisitVerified.action.toLowerCase() != "verified" ? (
          <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img mr-lg-1"></span>
        ) : isTreatmentDateVisitVerified.profile != "" ? (
          <img
            src={
              "https://simplefirm-bucket.s3.amazonaws.com/static/" +
              isTreatmentDateVisitVerified.profile
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

      <span className="label text-grey">Visits:</span>

      <span className="text-black " id="treatment_visits92">
        {visits ? visits : "---"}
      </span>
      <i className={`ic ${iconClass} ic-19`}></i> */}
    </>
  );
}

export default VisitVerificationIcon;
