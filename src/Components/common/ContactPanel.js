import React, { useState } from "react";
import SendEmailBtn from "../Modals/SendEmailBtn";
import "./ContactPanel.css";
import { handleLinkClick } from "../LawFirmDirectoryDashboard/main";
const formatPhoneNumber = (number) => {
  if (!number) return null;
  const cleanedNumber = number.replace(/\D/g, "");

  const areaCode = cleanedNumber.slice(0, 3);
  const firstPart = cleanedNumber.slice(3, 6);
  const secondPart = cleanedNumber.slice(6);
  return `(${areaCode}) ${firstPart}-${secondPart}`;
};
const ContactPanel = ({
  id,
  panel_name,
  title,
  catgegory,
  agency,
  department,
  title1,
  title2,
  name,
  address1,
  address2,
  city,
  state,
  zip_code,
  phone_number,
  ext = "",
  fax_number,
  email,
  meetingurl,
  websiteURL,
  pageName = "",
  onSelectObject,
  buttonData,
  className = "",
  dynamic_label,
  genrate_doc_address,
}) => {
  return (
    <>
      <div
        className={`${pageName !== "litigation" ? "info-div" : "width-255 p-r-5"} ${className}`}
        style={{
          width:
            pageName != "" && pageName?.startsWith("litigation")
              ? "255px"
              : "260px",
        }}
      >
        <div className="">
          <div onClick={onSelectObject}>
            <p
              className="columnsTitle text-center text-primary font-weight-semibold text-uppercase d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "var(--primary-15)",
                height: "25px",
                whiteSpace: "nowrap",
              }}
            >
              {panel_name}
            </p>
            {/* {pageName == "Experts" && (
              catgegory?.trim() ? (
                <p
                  style={{ backgroundColor: "var(--primary-2)" }}
                  className="font-weight-semibold text-capitalize p-r-5 p-l-5 text-truncated"
                >
                  {catgegory}
                </p>
              ) : (
                <p
                  className="font-weight-semibold text-capitalize p-r-5 p-l-5"
                  style={{
                    backgroundColor: "var(--primary-2)",
                    color: "var(--primary-25)",
                  }}
                >
                  { title == "Agency" ? "Agency Name" : "Category"}
                </p>
              )
            )} */}
            {name?.trim() ? (
              <p
                style={{ backgroundColor: "var(--primary-2)" }}
                className="font-weight-semibold text-capitalize p-r-5 p-l-5 text-truncated"
              >
                {name}
              </p>
            ) : (
              <p
                className="font-weight-semibold text-capitalize p-r-5 p-l-5"
                style={{
                  backgroundColor: "var(--primary-2)",
                  color: "var(--primary-25)",
                }}
              >
                {dynamic_label?.trim() ? dynamic_label : "Full Name"}
              </p>
            )}
            {/* { pageName === "litigation" && 
              <>
                <p className="colFont m-0 font-weight-semibold p-r-5 p-l-5" style={{ backgroundColor: "var(--primary-4)", height: "21px" }}>
                  {title1 ? (
                    <span>{title1}</span>
                  ) : (
                    <span className="text-primary-50 font-weight-normal text-capitalize" >{panel_name == "Judge & Department" ? "Department" : "Title 1"}</span>
                  )}
                </p>
                <p className="colFont m-0 font-weight-semibold p-r-5 p-l-5" style={{ backgroundColor: "var(--primary-2)", height: "21px" }}>
                  {title2 ? (
                    <span>{title2}</span>
                  ) : (
                    <span className="text-primary-50 font-weight-normal text-capitalize" >{panel_name == "Judge & Department" ? "Clerk Name" : "Title 2"}</span>
                  )}
                </p>
              </> 
              } */}
            {pageName === "litigation" && (
              <>
                <p
                  className="colFont m-0 font-weight-semibold p-r-5 p-l-5"
                  style={{
                    backgroundColor: "var(--primary-4)",
                    height: "21px",
                  }}
                >
                  {title1 ? (
                    <span>{title1}</span>
                  ) : (
                    <span
                      className="font-weight-semibold text-capitalize"
                      style={{ color: "var(--primary-25)" }}
                    >
                      {panel_name == "Judge & Department"
                        ? "Department"
                        : "Title 1"}
                    </span>
                  )}
                </p>
                <p
                  className="colFont m-0 font-weight-semibold p-r-5 p-l-5"
                  style={{
                    backgroundColor: "var(--primary-2)",
                    height: "21px",
                  }}
                >
                  {title2 ? (
                    <span>{title2}</span>
                  ) : (
                    <span
                      className="font-weight-semibold text-capitalize"
                      style={{ color: "var(--primary-25)" }}
                    >
                      {panel_name == "Judge & Department"
                        ? "Clerk Name"
                        : "Title 2"}
                    </span>
                  )}
                </p>
              </>
            )}
            <div>
              <p
                className="inline-row-h-21 text-capitalize p-r-5 p-l-5"
                style={{
                  backgroundColor: "var(--primary-4)",
                }}
              >
                {address1 || address2 ? (
                  <p className="font-weight-semibold ">
                    {address1 && <span>{address1}</span>}
                    {address1 && address2 && <span>, </span>}{" "}
                    {/* Render comma only if both addresses exist */}
                    {address2 && <span>{address2}</span>}
                  </p>
                ) : (
                  <span
                    className="font-weight-semibold text-capitalize"
                    style={{
                      backgroundColor: "var(--primary-4)",
                      color: "var(--primary-25)",
                    }}
                  >
                    Address
                  </span>
                )}
              </p>

              <p
                className="inline-row-h-21 text-capitalize p-r-5 p-l-5"
                style={{
                  backgroundColor: "var(--primary-2)",
                }}
              >
                {city ? (
                  <span className="font-weight-semibold">{city},</span>
                ) : (
                  <span
                    className="font-weight-semibold"
                    style={{ color: "var(--primary-25)" }}
                  >
                    city,
                  </span>
                )}{" "}
                {state ? (
                  <span className="font-weight-semibold">{state}</span>
                ) : (
                  <span
                    className="font-weight-semibold"
                    style={{ color: "var(--primary-25)" }}
                  >
                    state
                  </span>
                )}{" "}
                {zip_code ? (
                  <span className="font-weight-semibold">{zip_code}</span>
                ) : (
                  <span
                    className="font-weight-semibold "
                    style={{
                      color: "var(--primary-25)",
                      textTransform: "uppercase",
                    }}
                  >
                    zip
                  </span>
                )}
              </p>
            </div>
            <div>
              <p
                className="inline-row-h-21 p-r-5 p-l-5"
                style={{
                  backgroundColor: "var(--primary-4)",
                }}
              >
                {phone_number ? (
                  <span className="font-weight-semibold">
                    {formatPhoneNumber(phone_number)}
                  </span>
                ) : (
                  <span
                    className="font-weight-semibold"
                    style={{ color: "var(--primary-25)" }}
                  >
                    (###) ###-####
                  </span>
                )}
                {ext && (
                  <>
                    <small
                      className="ml-1 font-weight-semibold"
                      style={{ color: "var(--primary-25)" }}
                    >
                      ext
                    </small>{" "}
                    <span className="font-weight-semibold">{ext}</span>
                  </>
                )}
              </p>
              <p
                className="inline-row-h-21 p-r-5 p-l-5"
                style={{ backgroundColor: "var(--primary-2)" }}
              >
                {fax_number ? (
                  <span className="font-weight-semibold">
                    {formatPhoneNumber(fax_number)}
                  </span>
                ) : (
                  <span
                    className="font-weight-semibold"
                    style={{ color: "var(--primary-25)" }}
                  >
                    (###) ###-####
                  </span>
                )}
                <span
                  style={{ color: "var(--primary-25)" }}
                  className="ml-1 font-weight-semibold"
                >
                  fax
                </span>
              </p>
            </div>
            {pageName == "Experts" && websiteURL && (
              <div>
                <p
                  className="inline-row-h-21 p-r-5 text-center p-l-5"
                  style={{ backgroundColor: "var(--primary-4)" }}
                >
                  <a
                    href={websiteURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="text-black p-l-5 p-r-5"
                  >
                    {websiteURL.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              </div>
            )}
            {pageName === "litigation" && (
              <div>
                <p
                  className="inline-row-h-21 p-r-5 p-l-5 text-center"
                  style={{ backgroundColor: "var(--primary-4)" }}
                >
                  {websiteURL ? (
                    <span className="font-weight-semibold">{websiteURL}</span>
                  ) : (
                    <span
                      className="font-weight-normal text-center"
                      style={{ color: "var(--primary-25)" }}
                    >
                      prefix.name.com
                    </span>
                  )}
                </p>
              </div>
            )}
            {pageName == "litigation_all_content" && meetingurl && (
              <a
                href={meetingurl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="text-black p-l-5 p-r-5"
              >
                {meetingurl.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
          {pageName === "treatment" && (
            <div>
              <p
                className="inline-row-h-21 p-r-5 text-center p-l-5"
                style={{ backgroundColor: "var(--primary-4)" }}
              >
                {websiteURL ? (
                  <a
                    href={websiteURL}
                    target="_blank"
                    className="font-weight-semibold"
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    {websiteURL}
                  </a>
                ) : (
                  <a
                    className="font-weight-normal"
                    style={{ color: "var(--primary-25)" }}
                  >
                    www.providerurl.com
                  </a>
                )}
              </p>
            </div>
          )}
          {pageName === "Defendants" && (
            <div>
              <p
                className="inline-row-h-21 p-r-5 text-center p-l-5"
                style={{ backgroundColor: "var(--primary-4)" }}
              >
                {websiteURL ? (
                  <a
                    href={websiteURL}
                    target="_blank"
                    className="font-weight-semibold"
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    {websiteURL}
                  </a>
                ) : (
                  <a
                    className="font-weight-normal"
                    style={{ color: "var(--primary-25)" }}
                  >
                    www.providerurl.com
                  </a>
                )}
              </p>
            </div>
          )}
          {pageName === "Case Loans" && (
            <div>
              <p
                className="inline-row-h-21 p-r-5 text-center p-l-5"
                style={{ backgroundColor: "var(--primary-4)" }}
              >
                {websiteURL ? (
                  <a
                    href={websiteURL}
                    target="_blank"
                    className="font-weight-semibold"
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    {websiteURL}
                  </a>
                ) : (
                  <a
                    className="font-weight-normal"
                    style={{ color: "var(--primary-25)" }}
                  >
                    www.insurancewebsite.com
                  </a>
                )}
              </p>
            </div>
          )}
        </div>
        <div className="mt-auto">
          <SendEmailBtn email={email} />
          {buttonData?.map((button, index) => (
            <a
              href="#"
              id={index}
              style={{
                backgroundColor: "var(--primary-10)",
                borderColor: "var(--primary)",
                color: "var(--primary)",
                ...button.style,
              }}
              className={`btn btn-hover-contact-panel-row font-weight-semibold text-lg height-25 rounded-0 d-flex align-items-center justify-content-center ${button.className}`}
              onClick={() => button.onClick(id, genrate_doc_address)}
            >
              {button.iconClassName && (
                <i className={`${button.iconClassName} mr-1`}></i>
              )}
              {button.imgSrc && (
                <img
                  className={button.imgClassName}
                  src={button.imgSrc}
                  alt="icon"
                />
              )}
              {button.buttonText}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default React.memo(ContactPanel);
