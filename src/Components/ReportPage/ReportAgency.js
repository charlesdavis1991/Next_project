import React, { useState } from "react";

const ReportAgency = ({
  id,
  title ,
  reporting_agency_name ,
  address1,
  address2,
  city ,
  state ,
  zip_code,
  phone_number,
  fax_number ,
  email ,
  onSelectReport,
}) => {
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
      <div className="info-div" >
        <div className="p-l-5 " onClick={onSelectReport}>
          
          <div>
            <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
              Reporting Agency
            </p>
            {reporting_agency_name ? (
              <p>{reporting_agency_name}</p>

            ):
            <p className="text-primary-50">Agency</p>
          
          }
            <div>
              <p className="inline-row-h-21">
                {address1  || address2 ? (
                  <>
                    {address1 && (
                      <span>{address1}, </span>
                    )} {address2 && (
                      <span>{address2}</span>
                    )}
                  </>
                ) : (
                  <span className="text-primary-50">Address</span>
                )}
              </p>
              {/* <p className="inline-row-h-21" >
                {address2 ? (
                  address2
                ) : (
                  <span className="text-primary-50">Address 2</span>
                )}
              </p> */}
                
              <p className="inline-row-h-21">
                {city ? city : <span className="text-primary-50">city</span>}{" "}
                {state ? state : <span className="text-primary-50">state</span>}
                , {zip_code ? zip_code : <span className="text-primary-50">zip</span>}
              </p>
            </div>
            <div>
            <p className="inline-row-h-21">
              {phone_number ? (
                formatPhoneNumber(phone_number)
              ) : (
                <span className="text-primary-50">(###) ###-####</span>
              )}
              <small className="ml-1 text-primary-50">ext</small>
            </p>
            <p className="inline-row-h-21" >
              {fax_number ? (
                formatPhoneNumber(fax_number)
              ) : (
                <span className="text-primary-50">(###) ###-####</span>
              )}
              <small className="ml-1 text-primary-50">fax</small>
            </p>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <a
            style={{ height: "25px" }}
            href="#"
            className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center overflow-hidden info_email m-b-5 p-l-6 p-r-6"
          >
            <i className="ic ic-19 ic-email-3d mr-1"></i>
            <p className="overflow-hidden">{email}</p>
          </a>
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
};

export default ReportAgency;
