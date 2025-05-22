import React, { useState } from "react";
import "../../../public/BP_resources/css/litigation.css";
import Button from "../ClientDashboard/shared/button";
import LitigationCourtPopUp from "../Modals/LitigationCourtPopUp";
import GenrateDocument from "../GenrateDocument/GenrateDocument";
import CourtForm from "../CourtForm/CourtForm";
import NotEnablePopUp from "../Modals/NotEnablePopUp";
import ContactPanel from "../common/ContactPanel";

export default function LitigationCourtInfo({
  Court,
  litigation_obj,
}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [validationPopUp, setValidationPopUp] = useState(false);
  const [validationText, setValidationText] = useState("");
  const [showCourtForm, setShowCourtForm] = useState(false);


  const handleValidationPopUp = () => {
    setValidationPopUp(false);
  };


  const [showPopup, setShowPopup] = useState(false);

  const handleCaseClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const [showDocument, setShowDocument] = useState(false);
  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);

  const handleGenrateDocument = () => {
    setInstanceIdForGenragteDoc(Court?.litigation_id);
    setShowDocument(true);
  };

  const CourtButtonsConfig = [
    {
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "",
      style: {
        height: "25px",
        backgroundColor: "var(--primary-10)",
        borderColor: "var(--primary)",
        color: "var(--primary)",
      },
      onClick: handleGenrateDocument,
    },
  ];

  const handleCourtForm = () => {

    if (litigation_obj && Object.keys(litigation_obj).length === 0) {
      console.log("litigation not found")
      setValidationText("Please select Jurisdiction type and State first.");
      setValidationPopUp(true);
    } else {
      const litigation_jurisdiction_type = litigation_obj?.jurisdiction_type;
      const litigation_states = litigation_obj?.state;
      
      if (litigation_states && litigation_jurisdiction_type) {
        setShowCourtForm(true);
      } else {
        return;
      }
    }
   
  };


  return (
    <div className="width-255 d-flex flex-column p-0 p-r-5 H1-35PX lit-upper-section-child">
      <div className="information-wrapper-litigation d-flex flex-column flex-grow-1">
        {/* <div data-toggle="modal" data-target="#court-details-modal"> */}
        <ContactPanel
          id={Court?.litigation_id}
          pageName={"litigation"}
          onSelectObject={handleCaseClick}
          panel_name={"Court"}
          name={Court?.court_name}
          title1={Court?.court_title1}
          title2={Court?.court_title2}
          address1={Court?.court_contact?.address1 }
          address2={Court?.court_contact?.address2 }
          city={Court?.court_contact?.city}
          state={Court?.court_contact?.state && Court?.court_contact?.state.toUpperCase()}
          zip_code={Court?.court_contact?.zip}
          phone_number={Court?.court_contact?.phone_number}
          fax_number={Court?.court_contact?.fax}
          websiteURL={Court?.court_contact?.website}
          email={Court?.court_contact?.email}
          buttonData={CourtButtonsConfig}
        />
        {/* <div onClick={handleCaseClick} style={{ cursor: "pointer" }} className="flex-grow-1">
          <div className="text-left gapleft">
            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase d-flex justify-content-center align-items-center" style={{height: "25px", backgroundColor: "var(--primary-15)"}}>
              Court
            </p>
            <p className="columnsTitle">
              {Court?.court_name ? (
                Court.court_name
              ) : (
                <span className="text-primary-20">Court Name</span>
              )}
            </p>
            <p className="colFont m-0 font-weight-semibold">
              {Court?.court_title1 ? (
                <span>{Court.court_title1}</span>
              ) : (
                <span className="text-primary-20">Title 1</span>
              )}
            </p>
            <p className="colFont m-0 font-weight-semibold">
              {Court?.court_title2 ? (
                <span>{Court.court_title2}</span>
              ) : (
                <span className="text-primary-20">Title 2</span>
              )}
            </p>
            <div>
              <p className="colFont m-0 font-weight-semibold info_address">
                {Court?.court_contact?.address1 ||
                Court?.court_contact?.address2 ? (
                  <>
                    <div className="col-value colFonts text-left col-title min-h-0 mb-0">
                      {Court?.court_contact?.address1 && (
                        <span>{Court.court_contact.address1}</span>
                      )}
                      {Court?.court_contact?.address2 && (
                        <span>
                          {Court?.court_contact?.address1 && ","}{" "}
                          {Court.court_contact.address2}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-primary-20">Address</div>
                )}
              </p>
              <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                {Court?.court_contact?.city ? (
                  <span>{Court.court_contact.city},</span>
                ) : (
                  <span className="text-primary-20">City, </span>
                )}
                {Court?.court_contact?.state ? (
                  <span>{Court.court_contact.state.toUpperCase() + ", "}</span>
                ) : (
                  <span className="text-primary-20">State, </span>
                )}
                {Court?.court_contact?.zip ? (
                  Court.court_contact.zip
                ) : (
                  <span className="text-primary-20">Zip</span>
                )}
              </p>
            </div>
            {Court?.court_contact?.phone_number ? (
              <p className="colFont info_phone_number text-black">
                {Court.court_contact.phone_number}
              </p>
            ) : (
              <p className="colFont info_phone_number text-black">
                <span className="text-primary-20">(###) ###-####</span>
              </p>
            )}
            {Court?.court_contact?.fax ? (
              <p className="colFont info_fax">
                <small>(</small>
                {Court.court_contact.fax?.slice(0, 3)}
                <small>)-</small>
                {Court.court_contact.fax?.slice(3, 6)}<small>-</small>
                {Court.court_contact.fax?.slice(6)}
                <small className="ml-2 text-grey">fax</small>
              </p>
            ) : (
              <p className="colFont info_fax">
                <span className="text-primary-20">(###) ###-####</span>
              </p>
            )}
            {Court?.court_contact?.website ? (
              <p className="colFont info_fax">
                {Court.court_contact.website}
              </p>
            ) : (
              <p className="colFont info_fax">
                <span className="text-primary-20">prefix.name.com</span>
              </p>
            )}
          </div>
        </div>
        <div>
          {Court?.court_contact?.email && (
            <div>
              <Button
                showButton={true}
                icon={"ic ic-19 ic-email-3d m-r-5"}
                buttonText={`${Court.court_contact.email}`}
              />
            </div>
          )}
          {!window.location.href.includes("bp-courtform") ? (
            <div onClick={handleGenrateDocument}>
              <Button
                showButton={true}
                icon={"ic ic-19 ic-generate-document m-r-5"}
                buttonText={"Generate Document"}
              />
            </div>
          ) : null}




        </div> */}
                  {/* {!window.location.href.includes("bp-courtform") ? (
            <div onClick={handleCourtForm}>
              <Button
                showButton={true}
                icon={"ic ic-19 ic-court-form m-r-5"}
                buttonText={"Court Form"}
              />
            </div>
          ) : null} */}
        {showCourtForm && (
          <CourtForm
            show={true}
            handleClose={() => setShowCourtForm(false)}
            PageEntity="litigation"
            instanceId={"0"}
            // instanceId={litigation_obj?.id}
          />
        )}
        {
          <NotEnablePopUp
            confirmPopUp={validationPopUp}
            handleClose={handleValidationPopUp}
            title={validationText}
          />
        }
        {showDocument && (
          <GenrateDocument
            show={true}
            handleClose={() => setShowDocument(false)}
            PageEntity="litigation"
            instanceId={instanceIdForGenrateDoc}
          />
        )}
        {showPopup && (
          <LitigationCourtPopUp
            CourtData={Court}
            showPopup={showPopup}
            handleClose={handleClosePopup}
          />
        )}
      </div>
    </div>
  );
}
