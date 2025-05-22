import React, { useState } from "react";
import SendEmailBtn from "../Modals/SendEmailBtn";

const Adjsuter = ({ adjuster, handleEditModalShow }) => {
  const myStyle = {
    box: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "4px",
    },
    title: {
      textAlign: "center",
      color: "#007bff",
      textTransform: "uppercase",
    },
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      <div className="info-div">
        <div>
          <div onClick={() => handleEditModalShow("adjuster")}>
            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
              Adjuster
            </p>
            <p className="">
              {adjuster?.first_name ? (
                <>
                  {adjuster.first_name} {adjuster.last_name}
                </>
              ) : adjuster?.name ? (
                <>{adjuster?.name}</>
              ) : (
                <span className="text-primary-50">Adjuster Name</span>
              )}
            </p>
            <div>
              {/* <>
                {adjuster?.address1 || adjuster?.address2 ? (
                  <>
                    {adjuster?.address1 &&
                      (adjuster?.address1.length > 10 ? (
                        <span title={adjuster?.address1}>
                          {adjuster?.address1.slice(0, 10) + "..."},{" "}
                        </span>
                      ) : (
                        <span>{adjuster?.address1}, </span>
                      ))}{" "}
                    {adjuster?.address2 &&
                      (adjuster?.address2.length > 10 ? (
                        <span title={adjuster?.address2}>
                          {adjuster?.address2.slice(0, 10) + "..."}
                        </span>
                      ) : (
                        <span>{adjuster?.address2}</span>
                      ))}
                  </>
                ) : (
                  <span className="text-primary-50">Address</span>
                )}
              </> */}

                    <p className='inline-row-h-21 text-capitalize ' style={{textWrap:'nowrap'}}>
                    {adjuster?.address1 || adjuster?.address2 ? (
                        <>
                        {adjuster?.address1 && (
                            <span>{adjuster?.address1}</span>
                        )}
                        {adjuster?.address2 && (
                            <span>{adjuster?.address1 && ","} {adjuster?.address2}</span>
                        )}
                        </>
                    ) : (
                        <span className="text-primary-50">Address</span>
                    )}
                    </p>

              <p className="inline-row-h-21 text-capitalize">
                {adjuster?.city ? (
                  `${adjuster.city}, `
                ) : (
                  <span className="text-primary-50">City, </span>
                )}
                {adjuster?.state ? (
                  `${adjuster.state} `
                ) : (
                  <span className="text-primary-50">State </span>
                )}
                {adjuster?.zip ? (
                  adjuster.zip
                ) : (
                  <span className="text-primary-50">Zip</span>
                )}
              </p>
            </div>
            <p class="inline-row-h-21">
              {adjuster?.phone_number ? (
                formatPhoneNumber(adjuster.phone_number)
              ) : (
                <span className="text-primary-50">(###) ###-####</span>
              )}
              <span className="ml-1">
                <small className="text-primary-50">ext </small>
                {adjuster?.phone_ext && adjuster.phone_ext}
              </span>
            </p>
            <p className="">
              {adjuster?.fax ? (
                formatFaxNumber(adjuster.fax)
              ) : (
                <span className="text-primary-50">(###) ###-####</span>
              )}
              <small className="ml-1 text-primary-50">
                fax
              </small>
            </p>
          </div>
        </div>
        <div className="mt-auto">
          {/* <a style={{ height: '25px' }} href="#" className={`btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg rounded-0 d-flex align-items-center justify-content-center overflow-hidden info_email mb-1`}>
                        <i className="ic ic-19 ic-email-3d m-r-5"></i>
                        {adjuster?.email && adjuster.email}
                    </a> */}
          <SendEmailBtn email={adjuster?.email} />
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
      {/* <!-- New Report Agency Popup Starts --> */}

      {/* <!-- New Report Agency Popup Ends --> */}
    </>
  );
};

export default Adjsuter;
