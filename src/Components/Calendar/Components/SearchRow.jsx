import React from "react";
import { mediaRoute, calculateAge, formatDate } from "../../../Utils/helper";
import bdayIcon from "../../../assets/images/birthdayicon.svg";
import incidentIcon from "../../../assets/images/incident.svg";

export default function SearchRow({ client, caseSummary }) {
  const separator = client?.first_name && client.last_name ? " , " : " ";
  console.log("hello", client);
  return (
    <div
      className="search-row-custom d-flex align-items-center mb-1"
      style={{
        width: "100%",
        cursor: "pointer",
        padding: "10px 0",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div
        className="d-flex align-items-center col-3"
        style={{ flexShrink: 0 }}
      >
        <span className="ic ic-avatar ic-19 mr-8px">
          {client?.profile_pic_19p && (
            <img
              src={mediaRoute(client.profile_pic_19p)}
              alt="avatar"
              style={{ width: "32px", height: "32px", borderRadius: "50%" }}
            />
          )}
        </span>
        <span className="text-black text-black-2 font-weight-bold">
          {`${client?.last_name || ""}${separator} ${client?.first_name || ""}`}
        </span>
      </div>

      <div
        className="d-flex align-items-center col-3"
        style={{ flexShrink: 0 }}
      >
        <img className="img-19px mr-8px" src={bdayIcon} alt="birthday" />
        <span>{formatDate(client?.birthday)}</span>
        <span className="ml-4">{calculateAge(client?.birthday)}</span>
      </div>

      <div
        className="d-flex align-items-center col-3"
        style={{ flexShrink: 0 }}
      >
        {caseSummary?.case_type?.casetype_icon && (
          <img
            className="img-19px mr-8px"
            src={caseSummary.case_type.casetype_icon}
            alt="case type icon"
            style={{ width: "19px", height: "19px" }}
          />
        )}
        <span>{caseSummary?.case_type?.name}</span>
      </div>

      <div
        className="d-flex align-items-center col-3"
        style={{ flexShrink: 0 }}
      >
        <img className="img-19px mr-8px" src={incidentIcon} alt="incident" />
        <span>{formatDate(caseSummary?.incident_date)}</span>
      </div>
    </div>
  );
}
