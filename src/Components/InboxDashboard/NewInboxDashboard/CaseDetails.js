import React, { useEffect } from "react";
import birthdayIcon from "../../../assets/images/birthdayicon.svg";
import incidentIcon from "../../../assets/images/incident.svg";
import { formatDate } from "../../../Utils/helper";

const CaseDetails = ({ caseData, isStacked, index }) => {
  const client = caseData?.for_client;

  const adjustCaseDetailsWidths = () => {
    const leftColumns = document.querySelectorAll(".box-left");
    const rightColumns = document.querySelectorAll(".box-right");

    let maxLeftWidth = 0;
    let maxRightWidth = 0;

    // Calculate maximum width for left and right columns
    leftColumns.forEach((column) => {
      const width = column.getBoundingClientRect().width;
      maxLeftWidth = Math.max(maxLeftWidth, width);
    });

    rightColumns.forEach((column) => {
      const width = column.getBoundingClientRect().width;
      maxRightWidth = Math.max(maxRightWidth, width);
    });

    // Apply calculated widths to both left and right columns
    leftColumns.forEach((column) => {
      column.style.width = `${maxLeftWidth}px`;
    });

    rightColumns.forEach((column) => {
      column.style.width = `${maxRightWidth}px`;
    });
  };

  useEffect(() => {
    adjustCaseDetailsWidths();
    window.addEventListener("resize", adjustCaseDetailsWidths);
    return () => {
      window.removeEventListener("resize", adjustCaseDetailsWidths);
    };
  }, [caseData]);

  return (
    <div className="col-2 pl-0 pr-0">
      <div
        className="d-flex align-items-center"
        style={{ gap: "5px", color: "var(--primary-25)", fontWeight: "600" }}
      >
        {index + 1}
        <div className="d-flex flex-column">
          {/* Client Name and Birthday */}
          <div
            className="d-flex"
            style={{
              height: isStacked ? "auto" : "21px",
              flexDirection: isStacked ? "column" : "row",
              alignItems: isStacked ? "flex-start" : "center",
            }}
          >
            <div className="d-flex align-items-center box-left">
              <span className="ic ic-avatar ic-19 d-flex align-items-center has-avatar-icon has-cover-img">
                {client?.profile_pic_19p && (
                  <img
                    src={client?.profile_pic_19p}
                    className="output-3 theme-ring"
                    alt="Client Avatar"
                  />
                )}
              </span>
              <span className="m-l-5 text-black text-black-2 whitespace-nowrap font-600">
                {client?.last_name},{client?.first_name}
              </span>
            </div>
            <p
              className="d-flex align-items-center text-black"
              style={{
                fontWeight: "600",
                marginLeft: isStacked ? "0" : "10px",
              }}
            >
              <img
                src={birthdayIcon}
                className="m-r-5 d-flex align-items-center ic-19"
                alt="Birthday Icon"
              />
              {formatDate(client?.birthday)}
            </p>
          </div>

          {/* Case Type and Incident Date */}
          <div
            className="d-flex"
            style={{
              height: isStacked ? "auto" : "21px",
              flexDirection: isStacked ? "column" : "row",
              alignItems: isStacked ? "flex-start" : "center",
            }}
          >
            <div className="d-flex align-items-center height-21 box-left font-600">
              {caseData?.case_type?.casetype_icon && (
                <img
                  className="m-r-5 ic-19 d-flex align-items-center"
                  src={caseData?.case_type?.casetype_icon}
                  alt="Case Type Icon"
                />
              )}
              <p className="MR8H19 text-black">{caseData?.case_type?.name}</p>
            </div>
            <p
              className="d-flex align-items-center box-right font-600 text-black"
              style={{
                fontWeight: "600",
                marginLeft: isStacked ? "0" : "10px",
              }}
            >
              <img
                src={incidentIcon}
                className="m-r-5 ic-19 d-flex align-items-center"
                alt="Incident Icon"
              />
              {caseData?.incident_date
                ? formatDate(caseData?.incident_date)
                : "-"}
            </p>
          </div>

          {/* Case Status (Wide screens) */}
          <div
            className="height-21"
            style={{
              display: isStacked ? "none" : "flex",
            }}
          >
            <p
              className="box-left height-21"
              style={{
                color: caseData?.open === "True" ? "green" : "grey",
                fontWeight: "600",
              }}
            >
              {caseData?.open === "True" ? "O :" : "C :"}
            </p>
            <div
              className="d-flex align-items-center box-right height-21 font-600"
              style={{
                marginLeft: isStacked ? "0" : "10px",
              }}
            >
              <p
                style={{
                  color: "black",
                  fontWeight: "600",
                }}
              >
                {caseData?.open === "True"
                  ? formatDate(caseData?.intake_date)
                  : caseData?.date_closed
                    ? formatDate(caseData?.date_closed)
                    : "-"}
              </p>
            </div>
          </div>

          {/* Case Status (Small screens) */}
          <div
            className="height-21"
            style={{
              display: isStacked ? "flex" : "none",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <p
              className="height-21 p-r-5"
              style={{
                color: caseData?.open === "True" ? "green" : "grey",
                fontWeight: "600",
              }}
            >
              {caseData?.open === "True" ? "O :" : "C :"}
            </p>
            <div className="d-flex align-items-center box-right height-21 font-600">
              <p
                style={{
                  color: "black",
                  fontWeight: "600",
                }}
              >
                {caseData?.open === "True"
                  ? formatDate(caseData?.intake_date)
                  : caseData?.date_closed
                    ? formatDate(caseData?.date_closed)
                    : "-"}
              </p>
            </div>
          </div>

          <div
            className="height-21"
            style={{
              display: isStacked ? "flex" : "none",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <p
              className="height-21 p-r-5"
              style={{
                color: "var(--primary-25)",
                fontWeight: "600",
              }}
            >
              {"C :"}
            </p>
            <div className="d-flex align-items-center box-right height-21 font-600">
              <p
                style={{
                  color: "var(--primary-25)",
                  fontWeight: "600",
                }}
              >
                {caseData?.date_closed
                  ? formatDate(caseData?.date_closed)
                  : "12/12/2027"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
