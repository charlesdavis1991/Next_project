import React from "react";
import VerificationIcons from "../TreatmentPage/components/VerificationIcons";

function Vists({ visits, dates, handleShow, verification }) {
  return (
    <>
      <p
        onClick={handleShow}
        className="d-flex align-items-center margin-left-low text-md-grey cursor-pointer "
      >
        <span
          className="d-flex align-items-center "
          style={{
            paddingRight: "20px",
          }}
        >
          {/* <VisitVerificationIcon
            caseProvider_id={caseProvider_id}
            visits={visits}
          /> */}
          <VerificationIcons
            type="visits"
            verificationData={verification?.verification_info?.visits}
            visits={visits}
          />
        </span>
        <span
          className="d-flex align-items-center"
          style={{
            paddingRight: "20px",
          }}
        >
          {/* <span className="d-flex align-items-center ">
            <VerificationIcon caseProvider_id={caseProvider_id} dates={dates} />
          </span> */}
          <VerificationIcons
            type="first"
            verificationData={verification?.verification_info?.first_date}
            dates={dates}
          />{" "}
        </span>

        <span className="d-flex align-items-center ">
          {/* <LastVerificationIcon
            caseProvider_id={caseProvider_id}
            dates={dates}
          /> */}
          <VerificationIcons
            type="last"
            verificationData={verification?.verification_info?.second_date}
            dates={dates}
          />
        </span>
      </p>
    </>
  );
}

export default React.memo(Vists);
