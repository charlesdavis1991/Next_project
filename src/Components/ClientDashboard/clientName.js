import React from "react";
import "../../../public/BP_resources/css/client-main.css"

const ClientName = (props) => {
  // Function to truncate the name if it exceeds 8 characters
  const truncateName = (name) => {
    if (name && name.length > 9) {
      return name.slice(0, 8) + "...";
    }
    return name;
  };

  const isLink = props.rightText && (props.rightText.startsWith("http") || props.rightText.startsWith("https"));

  return (
    <div>
      <div className="client-address-wrapper-row row no-gutters justify-content-end">
        <div className="col w-md-235 client-contact-phone-col client-contact-col c-name Client-H-109 min-w-260px-client">
          <div className="">
            <h4 className="client-contact-title text-center">Client Name</h4>
          </div>
          <div className="">
            <div className="background-white client-name-panel" data-toggle="modal" data-target="#edit-client-information-modal">
              <div className="client-identification-row d-flex">
                <div className="colFonts text-left min-h-0 mb-0 font-weight-400-client">First:</div>
                <div className="col-value colFonts min-h-0 mb-0 font-weight-semibold">
                  {props.first_name}
                </div>
              </div>
              <div className="client-identification-row d-flex">
                <div className="colFonts text-left min-h-0 mb-0 font-weight-400-client">Middle:</div>
                <div className="col-value colFonts min-h-0 mb-0 font-weight-semibold">
                  {props.middle_name}
                </div>
              </div>
              <div className="client-identification-row d-flex">
                <div className="colFonts text-left min-h-0 mb-0 font-weight-400-client">Last:</div>
                <div className="col-value colFonts min-h-0 mb-0 font-weight-semibold">
                  {props.last_name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientName;
