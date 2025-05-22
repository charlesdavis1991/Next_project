import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { formatPhoneNumber } from "../TreatmentPage/utils/helperFn";
import "./SimplePage.css";
import SendEmailBtnTreatment from "../TreatmentPage/components/SendEmailBtnTreatment";
function SimplePageLocation({
  // caseProvider,
  specialitie,
  contact,
  onClick,
  generateDocButtonClick,
}) {
  return (
    <div
      className="col w-515 p-0 d-flex flex-column overflow-x-hidden "
      id="treatment_location_info"
      data-toggle="modal"
      data-target="#case-provider-edit-modal"
    >
      <div
        style={{
          backgroundColor: "var(--primary-15)",
          fontSize: "14px",
          fontWeight: "600",
          height: "25px",
        }}
        className="d-flex justify-content-center align-items-center color-primary"
      >
        TREATMENT LOCATION
      </div>
      <div
        className="d-flex cursor-pointer flex-wrap min-h-45"
        onmouseover="this.style.backgroundColor='#eee'"
        onmouseout="this.style.backgroundColor='#fff'"
        style={{ backgroundColor: "rgb(255, 255, 255)" }}
      >
        <div className="col p-0 w-contact-box m-r-5" onClick={onClick}>
          <div
            style={{ backgroundColor: "var(--primary-2)" }}
            className="p-l-5 colFont font-weight-semibold bg-speciality-2  m-0 text-truncated"
          >
            {contact?.name ? (
              contact?.name
            ) : (
              <span
                className="font-weight-semibold"
                style={{ color: "var(--primary-25)" }}
              >
                Company Name
              </span>
            )}
          </div>
          <div
            style={{ backgroundColor: "var(--primary-4)" }}
            className="p-l-5 colFont font-weight-semibold bg-speciality-4  m-0"
          >
            {contact?.address1 ? (
              contact?.address1
            ) : (
              <span
                className="font-weight-semibold"
                style={{ color: "var(--primary-25)" }}
              >
                Address
              </span>
            )}
            {contact?.address2 ? (
              contact?.address2
            ) : (
              <span
                className="font-weight-semibold"
                style={{ color: "var(--primary-25)" }}
              ></span>
            )}
          </div>
          <div
            style={{ backgroundColor: "var(--primary-2)" }}
            className="p-l-5 font-weight-semibold colFont bg-speciality-2  m-0"
          >
            {contact?.city ? (
              `${contact?.city}, `
            ) : (
              <span
                className="font-weight-semibold"
                style={{ color: "var(--primary-25)" }}
              >
                City,
              </span>
            )}
            {contact?.state ? (
              <span
                className="font-weight-semibold"
                style={{ marginRight: "16px" }}
              >
                {contact?.state}
              </span>
            ) : (
              <span
                className="font-weight-semibold"
                style={{ color: "var(--primary-25)" }}
              >
                State,
              </span>
            )}
            {contact?.zip ? (
              <span className="font-weight-semibold">{contact?.zip}</span>
            ) : (
              <span
                className="font-weight-semibold"
                style={{ color: "var(--primary-25)" }}
              >
                Zip
              </span>
            )}
          </div>
        </div>
        <div className="col w-contact-box  p-0">
          <div className="">
            <p
              onClick={onClick}
              style={{ backgroundColor: "var(--primary-2)" }}
              className=" p-l-5 colText font-weight-semibold colFont m-0 bg-speciality-4  "
            >
              {contact?.phone_number ? (
                formatPhoneNumber(contact?.phone_number)
              ) : (
                <span
                  className="font-weight-semibold"
                  style={{ color: "var(--primary-25)" }}
                >
                  (###) ###-####
                </span>
              )}
            </p>
            <p
              onClick={onClick}
              style={{ backgroundColor: "var(--primary-4)" }}
              className="p-l-5 colText font-weight-semibold height-21 bg-speciality-2 colFont m-0  "
            >
              {contact?.fax ? (
                <>{formatPhoneNumber(contact?.fax)}</>
              ) : (
                <span
                  className="font-weight-semibold"
                  style={{ color: "var(--primary-25)" }}
                >
                  (###) ###-####
                </span>
              )}
              <small
                className="ml-1 font-weight-semibold"
                style={{ fontSize: "14px", color: "var(--primary-25)" }}
              >
                fax
              </small>
            </p>
            {contact?.website ? (
              <p
                style={{ backgroundColor: "var(--primary-2)" }}
                className="height-21 font-weight-semibold email-text  bg-speciality-4 text-center"
              >
                <a
                  className="colText colFont mb-0"
                  href={contact?.website}
                  target="_blank"
                >
                  {contact?.website}
                </a>
              </p>
            ) : (
              <div
                style={{ backgroundColor: "var(--primary-2)" }}
                className="mb-0 text-center bg-speciality-4"
              >
                <div
                  class="font-weight-semibold colFont "
                  style={{ color: "var(--primary-25)" }}
                >
                  www.providerwebsite.com
                </div>

                <div class=" colFont "> </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex f-gap-05">
        <div className="col w-contact-box p-0">
          <a
            href="#"
            className="btn btn-primary-lighter-default font-weight-semibold c-border-style
                        btn-primary-10 text-lg height-25 btn-hover-effect-btns rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
            data-toggle="modal"
            data-target="#generateDocument"
            onClick={generateDocButtonClick}
          >
            <i className="ic ic-19 ic-generate-document m-r-5"></i>
            Generate Document
          </a>
        </div>
        <div className="col w-contact-box p-0">
          <SendEmailBtnTreatment
            email={contact?.email ?? ""}
            specialitie={specialitie}
            name={contact?.name ?? ""}
          />
          {/* <a
            href="#"
            className="btn btn-primary-lighter-default font-weight-semibold c-border-style
                        btn-primary-10 text-lg height-25 btn-hover-effect-btns rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
          >
            <i className="ic ic-19 ic-email-3d m-r-5"></i>
            {contact?.email ? (
              <span className="email-text font-weight-semibold">
                {contact?.email}
              </span>
            ) : (
              <span className="text-primary-20 font-weight-semibold">
                email@address.com
              </span>
            )}
          </a> */}
        </div>
      </div>
    </div>
  );
}

export default React.memo(SimplePageLocation);
