import React from "react";
import birthdayIcon from "../../../../assets/images/birthdayicon.svg";
import incidentIcon from "../../../../assets/images/incident.svg";
import { formatDate } from "../../../../Utils/helper";

const HistoryCaseDetails = ({ caseData, client, index }) => {
  return (
    <div className="col pl-0 pr-0">
      <div
        className="d-flex align-items-center"
        style={{ gap: "5px", fontWeight: "600", color: "var(--primary-25)" }}
      >
        {index + 1}
        <div className="d-flex flex-column">
          {/* Client Name and Birthday */}
          <div
            className="d-flex"
            style={{
              height: "auto",
              flexDirection: "column",
              //   alignItems: "center",
            }}
          >
            <div className="d-flex align-items-center box-left ">
              <span className="ic ic-avatar ic-19 d-flex align-items-center has-avatar-icon has-cover-img">
                {client?.profile_pic_19p && (
                  <img
                    src={client?.profile_pic_19p}
                    className="output-3 theme-ring"
                    alt="Client Avatar"
                  />
                )}
              </span>
              <span className="m-l-5 text-black-2 whitespace-nowrap font-600 text-black">
                {client?.last_name},{client?.first_name}
              </span>
            </div>
            <p
              className="d-flex  align-items-center text-black"
              style={{
                fontWeight: "600",
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
              height: "auto",
              flexDirection: "column",
              //   alignItems: "center",
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
                // marginLeft: isStacked ? "0" : "10px",
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
        </div>
      </div>
    </div>
  );
};

export default HistoryCaseDetails;
