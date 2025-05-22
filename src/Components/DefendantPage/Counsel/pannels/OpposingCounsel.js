import React from "react";
import SendEmailBtn from "../../../Modals/SendEmailBtn";

function OpposingCounsel({ opposingcounselcontact, handleCounselEditModal }) {
  // Formating phone number if exist
  const formatPhoneNumber = (number) => {
    if (!number) return null;
    const areaCode = number.slice(0, 3);
    const firstPart = number.slice(3, 6);
    const secondPart = number.slice(6);
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  };

  // Function to format the fax number
  const formatFaxNumber = (number) => {
    if (!number) return null;
    const areaCode = number.slice(0, 3);
    const firstPart = number.slice(3, 6);
    const secondPart = number.slice(6);
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  };
  return (
    <>
      <div className="info-div-counsel">
        <div onClick={() => handleCounselEditModal("counsel")}>
          <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
            Opposing Counsel
          </p>
          <p className="inline-row-h-21">
            {opposingcounselcontact?.name ? (
              opposingcounselcontact.name
            ) : (
              <span className="text-primary-50">Opposing Counsel Name</span>
            )}
          </p>
          <div>
            <p
              className="inline-row-h-21 text-capitalize "
              style={{ textWrap: "nowrap" }}
            >
              {opposingcounselcontact?.address1 ||
              opposingcounselcontact?.address2 ? (
                <>
                  {opposingcounselcontact?.address1 && (
                    <span>{opposingcounselcontact?.address1}</span>
                  )}
                  {opposingcounselcontact?.address2 && (
                    <span>{opposingcounselcontact?.address1 && ","} {opposingcounselcontact?.address2}</span>
                  )}
                </>
              ) : (
                <span className="text-primary-50">Address</span>
              )}
            </p>

            <p className="inline-row-h-21">
              {opposingcounselcontact?.city ? (
                `${opposingcounselcontact.city}, `
              ) : (
                <span className="text-primary-50">City, </span>
              )}
              {opposingcounselcontact?.state ? (
                `${opposingcounselcontact.state} `
              ) : (
                <span className="text-primary-50">State </span>
              )}
              {opposingcounselcontact?.zip ? (
                opposingcounselcontact.zip
              ) : (
                <span className="text-primary-50">Zip</span>
              )}
            </p>
          </div>
          <p class="text-black d-flex">
            {opposingcounselcontact?.phone_number ? (
              formatPhoneNumber(opposingcounselcontact.phone_number)
            ) : (
              <span className="text-primary-50">(###) ###-####</span>
            )}{" "}
            <small className="ml-1 mr-1 text-primary-50">ext</small>
            {opposingcounselcontact?.phone_ext || ""}
          </p>
          <p className="">
            {opposingcounselcontact?.fax ? (
              formatFaxNumber(opposingcounselcontact.fax)
            ) : (
              <span className="text-primary-50">(###) ###-####</span>
            )}
            <small className=" ml-1 text-primary-50">fax</small>
          </p>
        </div>
        <div className="mt-auto">
          {/* <a
            style={{ height: "25px" }}
            href="#"
            className={`btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg rounded-0 d-flex align-items-center justify-content-center overflow-hidden info_email mb-1`}
          >
            <i className="ic ic-19 ic-email-3d m-r-5"></i>
            {opposingcounselcontact?.email && opposingcounselcontact.email}
          </a> */}
          <SendEmailBtn email={opposingcounselcontact?.email} />
          <a
            style={{ height: "25px" }}
            href="#"
            className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
          >
            <i className="ic ic-19 ic-generate-document mr-1"></i>
            Generate Document
          </a>
        </div>
      </div>
    </>
  );
}

export default OpposingCounsel;
