import React from "react";
import SendEmailBtn from "../../Modals/SendEmailBtn";

function Supervisor({ object }) {
  const formatPhoneNumber = (number) => {
    if (!number) return null;
    const areaCode = number.slice(0, 3);
    const firstPart = number.slice(3, 6);
    const secondPart = number.slice(6);
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  };

  const contact = object?.supervisor || {};

  const formatAddress = (contact) => {
    const fullAddress = `${contact.address1 || ""}${contact.address1 && contact.address2 ? ", " : ""}${contact.address2 || ""}`;

    if (fullAddress.length > 34) {
      return `${fullAddress.slice(0, 34)}...`;
    }

    return fullAddress;
  };
  return (
    <div className="info-div employment-divs">
      <div className="p-l-5 text-capitalize">
        <div>
          <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
            Supervisor
          </p>
          {contact.first_name || contact.last_name ? (
            <p className="inline-row-h-21  fs-14">
              {contact.first_name} {contact.last_name}
            </p>
          ) : (
            <p className="text-primary-50 fs-14">Full Name</p>
          )}
          <div>
            {contact.address1 || contact.address2 ? (
              <p className="inline-row-h-21 fs-14">{formatAddress(contact)}</p>
            ) : (
              <span className="text-primary-50 fs-14">Address</span>
            )}
            <p className="inline-row-h-21 fs-14">
              {contact.city ? (
                contact.city
              ) : (
                <span className="text-primary-50 fs-14">City , </span>
              )}{" "}
              {contact.state ? (
                contact.state
              ) : (
                <span className="text-primary-50 fs-14">State</span>
              )}{" "}
              {contact.zip ? (
                contact.zip
              ) : (
                <span className="text-primary-50 fs-14">Zip</span>
              )}
            </p>
          </div>
          <div>
            <p className="inline-row-h-21 fs-14">
              {contact.phone_number ? (
                formatPhoneNumber(contact.phone_number)
              ) : (
                <span className="text-primary-50">(###) ###-####</span>
              )}
              <small className="ml-1 text-primary-50 fs-14 text-lowercase">
                ext
              </small>
              <span className="fs-14"> {contact.phone_ext}</span>
            </p>
            <p className="inline-row-h-21 fs-14">
              {contact.fax ? (
                formatPhoneNumber(contact.fax)
              ) : (
                <span className="text-primary-50 fs-14">(###) ###-####</span>
              )}
              <small className="ml-1 text-primary-50 text-lowercase">fax</small>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-auto">
        {/* Prevent the event propagation on the email button */}
        <div onClick={(e) => e.stopPropagation()}>
          <button
            style={{ height: "25px", width: "100%" }}
            className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center overflow-hidden info_email m-b-5 p-l-6 p-r-6"
          >
            <i className="ic ic-19 ic-email-3d mr-1"></i>
            <p className="overflow-hidden fs-14">{contact.email}</p>
          </button>
        </div>
        {/* Prevent the event propagation on the generate document button */}
        <a
          style={{ height: "25px" }}
          href="#"
          className="btn fs-14 btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
          onClick={(e) => e.stopPropagation()} // Prevent modal open on click
        >
          <i className="ic ic-19 ic-generate-document mr-1"></i>
          Generate Document
        </a>
      </div>
    </div>
  );
}

export default Supervisor;
