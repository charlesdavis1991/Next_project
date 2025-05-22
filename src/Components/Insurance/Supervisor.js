import React, { useState } from "react";
import SendEmailBtn from "../Modals/SendEmailBtn";

const Supervisor = ({ supervisor, handleEditModalShow }) => {
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
      <div className="info-div" onClick={handleShow}>
        <div onClick={() => handleEditModalShow("supervisor")}>
          <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
            Supervisor
          </p>
          <p className="inline-row-h-21">
            {supervisor?.first_name ? (
              <>
                {supervisor.first_name} {supervisor.last_name}
              </>
            ) : supervisor?.name ? (
              <>{supervisor.name}</>
            ) : (
              <span className="text-primary-50">Supervisor Name</span>
            )}
          </p>
          <div>
            <p
              className="inline-row-h-21 text-capitalize "
              style={{ textWrap: "nowrap" }}
            >
              {supervisor?.address1 || supervisor?.address2 ? (
                <>
                  {supervisor?.address1 && (
                    <span>{supervisor?.address1}</span>
                  )}
                  {supervisor?.address2 && <span>{supervisor?.address1 && ","} {supervisor?.address2}</span>}
                </>
              ) : (
                <span className="text-primary-50">Address</span>
              )}
            </p>
            <p className="inline-row-h-21">
              {supervisor?.city ? (
                `${supervisor.city}, `
              ) : (
                <span className="text-primary-50">City, </span>
              )}
              {supervisor?.state ? (
                `${supervisor.state} `
              ) : (
                <span className="text-primary-50">State </span>
              )}
              {supervisor?.zip ? (
                supervisor.zip
              ) : (
                <span className="text-primary-50">Zip</span>
              )}
            </p>
          </div>
          <p class="inline-row-h-21 d-flex">
            {supervisor?.phone_number ? (
              formatPhoneNumber(supervisor.phone_number)
            ) : (
              <span className="text-primary-50">(###) ###-####</span>
            )}
            <span className="ml-1">
              <small className="text-primary-50">ext </small>
              {supervisor?.phone_ext && supervisor.phone_ext}
            </span>
          </p>
          <p className="inline-row-h-21">
            {supervisor?.fax ? (
              formatFaxNumber(supervisor.fax)
            ) : (
              <span className="text-primary-50">(###) ###-####</span>
            )}
            <small className="text-primary-50 ml-1">
              fax
            </small>
          </p>
        </div>
        <div className="mt-auto">
          {/* <a style={{ height: '25px' }} href="#" className={`btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg rounded-0 d-flex align-items-center justify-content-center overflow-hidden info_email mb-1`}>
                        <i className="ic ic-19 ic-email-3d m-r-5"></i>
                        {supervisor?.email && supervisor.email}
                    </a> */}
          <SendEmailBtn email={supervisor?.email} />
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

export default Supervisor;
