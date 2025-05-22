import React from "react";

function VerificationNote({ verificationItem }) {
  const { action, date, time, profile_pic, first_name, last_name, ip } =
    verificationItem || {};
  return (
    <div className="bg-grey-100 height-35 d-flex align-items-center justify-content-center text-center">
      <p class="font-italic text-black d-flex align-items-center verification_note">
        {verificationItem && action.toLowerCase() === "verified" ? (
          profile_pic ? (
            <>
              Verified {date} {time}{" "}
              <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1">
                <img src={profile_pic} alt="" />
              </span>{" "}
              <span>
                {first_name} {last_name} ip: ${ip}{" "}
              </span>
            </>
          ) : (
            <>
              Verified {date} {time}{" "}
              <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1">
                <img src="/bp_assets/img/avatar.png" alt="" />
              </span>{" "}
              <span>
                {first_name} {last_name} ip: {ip}{" "}
              </span>
            </>
          )
        ) : (
          <>Not Verified</>
        )}
      </p>
    </div>
  );
}

export default VerificationNote;
