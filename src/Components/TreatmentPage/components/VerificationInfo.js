import React from "react";
import {
  created_at_format,
  created_at_format_verification,
} from "../utils/helperFn";
const VerificationInfo = ({ verificationData }) => {
  console.log(verificationData);
  if (verificationData === null) {
    return (
      <p className="text-black d-flex align-items-center verification_note">
        <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img mr-lg-1"></span>
      </p>
    );
  }

  return (
    <p className="text-black d-flex align-items-center verification_note">
      {verificationData?.profile !== "" ? (
        <img
          src={`https://simplefirm-bucket.s3.amazonaws.com/static/${verificationData?.profile}`}
          alt=""
          className="verify-profile-img-modal ic-19"
        />
      ) : (
        <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mr-lg-1"></span>
      )}
      <span
        style={{
          fontWeight: "600",
          fontSize: "14px",
          paddingRight: "5px",
        }}
      >
        {created_at_format_verification(verificationData?.date)}
      </span>

      <span
        style={{
          fontWeight: "600",
          fontSize: "14px",
        }}
      >
        {`${verificationData?.verification_by} ip: ${verificationData?.ip_address}`}
      </span>
    </p>
  );
};

export default React.memo(VerificationInfo);
