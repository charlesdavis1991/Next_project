import React from "react";
import SendEmailBtn from "../../../Modals/SendEmailBtn";

function OpposingAttorney({ opposingattorney, handleCounselEditModal }) {
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
        <div onClick={() => handleCounselEditModal("attorney")}>
          <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
            Opposing Attorney
          </p>
          <p className="inline-row-h-21">
            {opposingattorney?.name ? (
              <>{opposingattorney.name}</>
            ) : (
              <span className="text-primary-50">Opposing Attorney Name</span>
            )}
          </p>
          <div>
            <p
              className="inline-row-h-21 text-capitalize "
              style={{ textWrap: "nowrap" }}
            >
              {opposingattorney?.address1 || opposingattorney?.address2 ? (
                <>
                  {opposingattorney?.address1 && (
                    <span>{opposingattorney?.address1}</span>
                  )}
                  {opposingattorney?.address2 && (
                    <span>{opposingattorney?.address1 && ","} {opposingattorney?.address2}</span>
                  )}
                </>
              ) : (
                <span className="text-primary-50">Address</span>
              )}
            </p>

            <p className="colFont m-0  info_city_state_zip">
              {opposingattorney?.city ? (
                `${opposingattorney.city}, `
              ) : (
                <span className="text-primary-50">City, </span>
              )}
              {opposingattorney?.state ? (
                `${opposingattorney.state} `
              ) : (
                <span className="text-primary-50">State </span>
              )}
              {opposingattorney?.zip ? (
                opposingattorney.zip
              ) : (
                <span className="text-primary-50">Zip</span>
              )}
            </p>
          </div>
          <p class="inline-row-h-21">
            {opposingattorney?.phone_number ? (
              formatPhoneNumber(opposingattorney.phone_number)
            ) : (
              <span className="text-primary-50">(###) ###-####</span>
            )}
            <small className="ml-1 text-primary-50">ext </small>
            {opposingattorney?.phone_ext || ""}
          </p>
          <p className="colFont info_fax">
            {opposingattorney?.fax ? (
              formatFaxNumber(opposingattorney.fax)
            ) : (
              <span className="text-primary-50">(###) ###-####</span>
            )}
            <small style={{ marginLeft: "5px" }} className="text-primary-50">
              fax
            </small>
          </p>
        </div>
        <div className="mt-auto">
          {/* <a style={{ height: '25px' }} href="#" className={`btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg rounded-0 d-flex align-items-center justify-content-center overflow-hidden info_email mb-1`}>
                        <i className="ic ic-19 ic-email-3d m-r-5"></i>
                        {opposingattorney?.email && opposingattorney.email}
                    </a> */}
          <SendEmailBtn email={opposingattorney?.email} />
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

export default OpposingAttorney;
