import React from "react";
import SendEmailBtn from "../../Modals/SendEmailBtn";

function Employment({ object, onSelectDefenedant }) {
  // Formating phone number if exist
  const formatPhoneNumber = (number) => {
    if (!number) return null;
    const areaCode = number.slice(0, 3);
    const firstPart = number.slice(3, 6);
    const secondPart = number.slice(6);
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  };

  return (
    <>
      <div className="info-div">
        <div className="" onClick={onSelectDefenedant}>
          <div>
            <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
              Employment
            </p>
            {object?.defendant_employer ? (
              <p className="text-capitalize">{object.defendant_employer} </p>
            ) : (
              <p className="text-primary-50">Full Name</p>
            )}
            <div>
             <>
                {object?.work_contact?.address1 || object?.work_contact?.address2 ? (
                  <p className="inline-row-h-21 text-capitalize" style={{ whiteSpace: 'nowrap' }}>
                    {object?.work_contact?.address1 && (
                      <span>{object?.work_contact?.address1}</span>
                    )}
                    {object?.work_contact?.address2 && (
                      <span>{object?.work_contact?.address1 && ","} {object?.work_contact?.address2}</span>
                    )}
                  </p>
                ) : (
                  <span className="text-primary-50">Address</span>
                )}
              </>
              <p className="inline-row-h-21 text-capitalize">
                {object?.work_contact?.city ? (
                  object.work_contact?.city+","
                ) : (
                  <span className="text-primary-50">city,</span>
                )}{" "}
                {object?.work_contact?.state ? (
                  object.work_contact?.state
                ) : (
                  <span className="text-primary-50">state</span>
                )}
                {" "}
                {object?.work_contact?.zip ? (
                  object.work_contact?.zip
                ) : (
                  <span className="text-primary-50">zip</span>
                )}
              </p>
            </div>
            <div>
              <p className="inline-row-h-21">
                {object?.work_contact?.phone_number ? (
                  formatPhoneNumber(object.work_contact.phone_number)
                ) : (
                  <span className="text-primary-50">(###) ###-####</span>
                )}
                <small className="ml-1 text-primary-50">ext </small>{object?.work_contact?.phone_ext||""}
              </p>
              <p className="inline-row-h-21">
                {object?.work_contact?.fax ? (
                  formatPhoneNumber(object.work_contact.fax)
                ) : (
                  <span className="text-primary-50">(###) ###-####</span>
                )}
                <small className="ml-1 text-primary-50">fax</small>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-auto">
  
            <SendEmailBtn email={object?.work_contact?.email} />
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

export default Employment;
