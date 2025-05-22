import React from "react";
import "./navbarProfile.css";
import incidentIcon from "../../assets/images/incident.svg";
import birthdayIcon from "../../assets/images/birthdayicon.svg";
import { calculateAge, formatDate, formatDateUTC } from "../../Utils/helper";
import { Link } from "react-router-dom";

const LastAccessedCases = ({ data, extractDigits, page, onClick }) => {
  return (
    <>
      <div className="header-wrapper-client" onClick={onClick}>
        <div className="temp-header-details" style={{ zIndex: 100 }}>
          <Link
            href={
              page
                ? `/bp-switch_client/${data.for_client.id}/${data.id}/${page.name}`
                : `/bp-switch_client/${data.for_client.id}/${data.id}/Case`
            }
          >
            <div
              className="header-client-image"
              style={{ marginLeft: "15px", marginRight: "5px" }}
            >
              {data?.for_client.profile_pic_63p ? (
                <div
                  className="image-container"
                  style={{ backgroundColor: "white" }}
                >
                  <img
                    src={data?.for_client.profile_pic_63p}
                    alt={data?.for_client.first_name}
                  />
                  <div className="border-overlay"></div>
                </div>
              ) : (
                <div className="icon-container">
                  <i
                    className="ic ic-client-avatar"
                    style={{ backgroundColor: "white" }}
                  ></i>
                  <div className="border-overlay"></div>
                </div>
              )}
            </div>
            {/* <div
              className="header-client-image"
              style={{
                marginLeft: "10px",
                marginRight: "5px",
                backgroundColor: "white",
              }}
            >
              {data?.for_client.profile_pic_63p ? (
                <img
                  src={data?.for_client?.profile_pic_63p}
                  alt={data?.for_client?.first_name}
                />
              ) : (
                <i className="ic ic-client-avatar h-100 w-100"></i>
              )}
            </div> */}
          </Link>
          {/* <div className="header-client-image">
            <a
              href={
                page
                  ? `/bp-switch_client/${data.for_client.id}/${data.id}/${page.name}`
                  : `/bp-switch_client/${data.for_client.id}/${data.id}/Case`
              }
            >
              {data.for_client.profile_pic_63p ? (
                <img
                  src={data.for_client.profile_pic_63p}
                  alt={`${data.for_client.first_name} ${data.for_client.last_name}`}
                />
              ) : (
                <i className="ic ic-client-avatar h-100 w-100"></i>
              )}
            </a>
          </div> */}
          <div
            id="client-info"
            className="d-flex flex-column justify-content-between position-relative d-flex-1 z-index-1 h-100"
          >
            <div className="client-name d-flex align-items-center">
              <a
                className="clientTabFont text-black d-block text-nowrap"
                href="#"
              >
                <a
                  href={
                    page
                      ? `/bp-switch_client/${data.for_client.id}/${data.id}/${page.name}`
                      : `/bp-switch_client/${data.for_client.id}/${data.id}/Case`
                  }
                  className="clientTabFont d-block text-decoration-none"
                >
                  {data.for_client.last_name}
                  <span className="text-dark-grey">,</span>&nbsp;
                  {data.for_client.first_name}
                </a>
              </a>
            </div>
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ height: "25px" }}
            >
              <a
                href="#"
                className="js-acc-btn text-nowrap text-black accident-type d-flex align-items-center client_phone_header text-decoration-none"
              >
                {data.for_client.primary_phone.phone_number && (
                  <span className="text-black font-weight-semibold">
                    (
                    {extractDigits(
                      data.for_client.primary_phone.phone_number
                    ).slice(0, 3)}
                    ){" "}
                    {extractDigits(
                      data.for_client.primary_phone.phone_number
                    ).slice(3, 6)}
                    -
                    {extractDigits(
                      data.for_client.primary_phone.phone_number
                    ).slice(6)}
                  </span>
                )}
              </a>
              <div className="d-flex align-items-center justify-content-between p-r-5">
                <div className="d-flex m-r-5">
                  <span className="ic-avatar ic-19 m-0 d-flex align-items-center m-r-5 text-label color-grey-2 text-uppercase font-weight-bold">
                    <img
                      src={birthdayIcon}
                      className=""
                      style={{
                        width: "19px",
                        height: "19px",
                      }}
                    />
                  </span>

                  <p className="font-weight-semibold" style={{ width: "70px" }}>
                    {data.for_client?.birthday
                      ? formatDate(data.for_client?.birthday)
                      : ""}
                  </p>
                </div>
                <a
                  className="js-acc-btn text-black accident-date ml-auto text-decoration-none d-flex align-items-center"
                  style={{ paddingLeft: "5px" }}
                  href="#"
                >
                  <span className="text-grey" style={{ fontWeight: "600" }}>
                    Age
                  </span>
                  <span
                    className="text-black m-l-5 font-weight-semibold"
                    style={{ width: "20px" }}
                  >
                    {calculateAge(new Date(data.for_client.birthday))}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          className=""
          style={{
            // backgroundColor: "rgb(255, 255, 255)",
            fontSize: "14px",
            height: "50px",
            marginTop: "-5px",
          }}
        >
          {/* <div
            className="d-flex justify-content-between align-items-center w-100"
            style={{ padding: "0px 0px", height: "25px" }}
          >
            <div className="d-flex align-items-center" style={{ zIndex: "2" }}>
              {data?.case_type?.casetype_icon && (
                <span className="ic-avatar ic-19 m-r-5 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center">
                  <img
                    style={{ width: "19px", height: "19px" }}
                    src={data?.case_type?.casetype_icon}
                    alt="icon"
                  />
                </span>
              )}

              <p className="font-weight-semibold">
                {data.case_type && data.case_type.name}
              </p>
            </div>
            <div
              className="d-flex align-items-center  m-r-5"
              style={{ zIndex: "2" }}
            >
              <div
                className="text-label color-green font-weight-bold"
                style={{ marginRight: "0.5rem" }}
              >
                OPEN
              </div>
              <p className="font-weight-semibold">
                {data.date_open && formatDateUTC(data.date_open)}{" "}
              </p>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <span className="ic-avatar ic-19 m-r-5 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center">
                <img
                  src={incidentIcon}
                  className=""
                  style={{ width: "19px", height: "19px" }}
                />
              </span>

              <p className="font-weight-semibold">
                {data.incident_date && formatDate(data.incident_date)}
              </p>
            </div>
            <div className="d-flex align-items-center">
              <div className="text-label m-r-5 color-grey-2 font-weight-bold">
                Last Accessed
              </div>

              <p className="font-weight-semibold">12/12/2024</p>
            </div>
          </div> */}
          <div
            className="d-flex justify-content-between align-items-center w-100 p-r-5 p-l-5"
            style={{ height: "25px" }}
          >
            <div className="d-flex align-items-center" style={{ zIndex: "2" }}>
              {data?.case_type?.casetype_icon && (
                <span className="ic-avatar ic-19 m-r-5 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center">
                  <img
                    style={{ width: "19px", height: "19px" }}
                    src={data?.case_type?.casetype_icon}
                    alt="icon"
                  />
                </span>
              )}
              <p className="font-weight-semibold" style={{}}>
                {data.case_type && data.case_type.name}
              </p>
            </div>
            <div className="d-flex align-items-center" style={{ zIndex: "2" }}>
              <div className="text-label color-green font-weight-bold m-r-5">
                OPEN{" "}
              </div>
              <p className="font-weight-semibold">
                {data.date_open && formatDateUTC(data.date_open)}{" "}
              </p>
            </div>
          </div>
          <div
            className="d-flex justify-content-between align-items-center w-100 p-r-5 p-l-5"
            style={{ height: "25px" }}
          >
            <div className="d-flex align-items-center">
              <span className="ic-avatar ic-19 m-r-5 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center">
                <img
                  src={incidentIcon}
                  className=""
                  style={{ width: "19px", height: "19px" }}
                />
              </span>
              <p style={{}} className="font-weight-semibold">
                {data.incident_date && formatDate(data.incident_date)}
              </p>
            </div>
            <div className="d-flex align-items-center">
              <div className="text-label m-r-5 color-grey-2 font-weight-bold">
                Last Accessed{" "}
              </div>

              <p className="font-weight-semibold">12/12/2024</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LastAccessedCases;
