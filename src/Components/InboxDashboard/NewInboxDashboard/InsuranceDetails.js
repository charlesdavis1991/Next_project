import React, { useEffect } from "react";

const InsuranceDetails = ({ insurance, caseData, isStacked }) => {
  const adjustCaseDetailsWidths = () => {
    const leftColumns = document.querySelectorAll(".insurance-details");

    let maxLeftWidth = 0;

    // Calculate maximum width for left and right columns
    leftColumns.forEach((column) => {
      const width = column.getBoundingClientRect().width;
      maxLeftWidth = Math.max(maxLeftWidth, width);
    });

    leftColumns.forEach((column) => {
      column.style.width = `${maxLeftWidth}px`;
    });
  };

  useEffect(() => {
    adjustCaseDetailsWidths();
    window.addEventListener("resize", adjustCaseDetailsWidths);
    return () => {
      window.removeEventListener("resize", adjustCaseDetailsWidths);
    };
  }, [insurance]);
  return (
    <div className="col-auto flex-grow-1 pl-0 pr-0">
      <div
        className="d-flex align-items-center flex-column justify-content-center insurance-details"
        style={{
          position: "relative",
          left: "8%",
        }}
      >
        {/* Insurance Type and Company */}
        <div
          className="align-items-center d-flex"
          style={{
            flexDirection: isStacked ? "column" : "row",
          }}
        >
          <div className="pb-0 mb-0 font-600 p-r-5">
            {insurance?.insurance_type?.name
              ? insurance?.insurance_type?.name
              : " - "}
          </div>{" "}
          <div className="font-600">
            {insurance?.company?.company_name
              ? insurance?.company?.company_name
              : " - "}
          </div>
        </div>

        {/* Claim and Policy Numbers */}
        <div
          className="align-items-center d-flex"
          style={{
            flexDirection: isStacked ? "column" : "row",
          }}
        >
          <div className="pb-0 mb-0 font-600 p-r-5">
            {insurance?.claim_number ? insurance?.claim_number : " - "}
          </div>{" "}
          <div className="font-600">
            {insurance?.policy_number ? insurance?.policy_number : " - "}
          </div>
        </div>

        {/* Court Name and Case Number */}
        <div
          className="align-items-center d-flex"
          style={{
            flexDirection: isStacked ? "column" : "row",
          }}
        >
          <div className="pb-0 mb-0 font-600 p-r-5">
            {caseData?.court_name ? caseData?.court_name : " - "}
          </div>{" "}
          <div className="font-600">
            {caseData?.case_number ? caseData?.case_number : " - "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceDetails;
