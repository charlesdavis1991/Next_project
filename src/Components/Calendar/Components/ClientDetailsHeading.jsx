import React from "react";
import { calculateAge, formatDate } from "../../../Utils/helper";
import "./customStyle.css";
import bdayIcon from "../../../assets/images/birthdayicon.svg";
import avatar from "../../../assets/images/avatar.svg";
import incident from "../../../assets/images/incident.svg";

// Define the icon mapping for static icons
const iconMapping = {
  Birthday: bdayIcon,
  "Incident Date": incident,
  // "Case Type" will be handled dynamically
};

const ClientDetailsHeading = ({
  client,
  caseSummary,
  parseDate,
  errorMsg,
  selectedTab,
  record,
}) => {
  // Safely access case_type and casetype_icon (using optional chaining)

  return (
    <div
      className="h-100 container-fluid py-2"
      // style={{ backgroundColor: " var(--primary-5)" }}
    >
      <div>
        <DetailHeading
          label="Client Name"
          value={`${client?.first_name} ${client?.last_name}`}
          icon={client?.profile_pic_19p || avatar}
        />
        <DetailHeading
          label="Birthday"
          value={client?.birthday ? formatDate(client.birthday) : ""}
          icon={iconMapping["Birthday"]}
        />
        <DetailHeading
          label="Case Type"
          value={caseSummary?.case_type?.name}
          icon={caseSummary?.case_type?.casetype_icon}
        />

        {/* <DetailHeading
          label="Age"
          value={calculateAge(client?.birthday)}
          icon={iconMapping["Age"]}
        /> */}
        <DetailHeading
          label="Incident Date"
          value={formatDate(caseSummary?.incident_date)}
          icon={iconMapping["Incident Date"]}
        />
      </div>
    </div>
  );
};

const DetailHeading = ({ label, value, icon }) => (
  <div className="d-flex align-items-center minWidth">
    <img
      className="img-19px mr-5px"
      src={icon}
      alt={`${label} Icon`}
    />
    <h6 className="mb-0 text-nowrap" style={{ fontSize: "14px" }}>
      {value || "N/A"}
    </h6>
  </div>
);

export default ClientDetailsHeading;
