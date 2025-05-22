import React, { useState } from "react";
import "../../../public/BP_resources/css/litigation.css";
import Button from "../ClientDashboard/shared/button";
import LitigationClerkPopUp from "../Modals/LitigationClerkPopUp";
import GenrateDocument from "../GenrateDocument/GenrateDocument";
import CourtForm from "../CourtForm/CourtForm";
import NotEnablePopUp from "../Modals/NotEnablePopUp";

export default function LitigationClerkInfo({
  // Clerk,
  states = [],
  litigation_obj,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [validationPopUp, setValidationPopUp] = useState(false);
  const [validationText, setValidationText] = useState("");

  const handleCaseClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleValidationPopUp = () => {
    setValidationPopUp(false);
  };

  const templatePopUp = (params) => {
    // Add your templatePopUp function here
  };

  const [showDocument, setShowDocument] = useState(false);
  const [showCourtForm, setShowCourtForm] = useState(false);

  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);

  const handleGenrateDocument = () => {
    setInstanceIdForGenragteDoc(litigation_obj?.DirDepartment?.litigation_id);
    setShowDocument(true);
  };

  const handleCourtForm = () => {
    const litigation_jurisdiction_type = litigation_obj?.jurisdiction_type;
    const litigation_states = litigation_obj?.state;

    if (litigation_states && litigation_jurisdiction_type) {
      setShowCourtForm(true);
    } else {
      return;
    }
  };

  return (
    <div className="dynamic-width-litigation d-flex flex-column p-0 p-r-5 width-260">
      <div className="information-wrapper-litigation d-flex flex-column flex-grow-1">
        {/* <div data-toggle="modal" data-target="#clerk-department-modal"> */}
        <div
          className="text-left p-l-5 p-r-5"
          onClick={handleCaseClick}
          style={{ cursor: "pointer" }}
        >
          <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
            Department Clerk
          </p>
          <p className="columnsTitle">
            {litigation_obj?.DirDepartment?.department ? (
              `${litigation_obj?.DirDepartment?.department} - `
            ) : (
              <span className="text-primary-20">Department{" - "}</span>
            )}
            {litigation_obj?.DirDepartment?.clerk_first_name ? (
              `${litigation_obj?.DirDepartment?.clerk_first_name} ${litigation_obj?.DirDepartment?.clerk_last_name}`
            ) : (
              <span className="text-primary-20">Clerk Name</span>
            )}
          </p>
          <div>
            <p className="colFont m-0 font-weight-semibold info_address">
              {litigation_obj?.DirDepartment?.department_contact?.address1 ||
              litigation_obj?.DirDepartment?.department_contact?.address2 ? (
                <>
                  <div className="col-value colFonts text-left col-title min-h-0 mb-0">
                    {litigation_obj?.DirDepartment?.department_contact
                      ?.address1 && (
                      <span>
                        {
                          litigation_obj?.DirDepartment?.department_contact
                            ?.address1
                        }
                      </span>
                    )}
                    {litigation_obj?.DirDepartment?.department_contact
                      ?.address2 && (
                      <span>
                        {litigation_obj?.DirDepartment?.department_contact
                          ?.address1 && ","}{" "}
                        {
                          litigation_obj?.DirDepartment?.department_contact
                            ?.address2
                        }
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-primary-20">Address</div>
              )}
            </p>
            <p className="colFont m-0 font-weight-semibold info_city_state_zip">
              {litigation_obj?.DirDepartment?.department_contact?.city ? (
                <span
                  style={{
                    fontWeight: "600",
                    color: "black",
                    fontSize: "14px",
                    lineHeight: "21px",
                  }}
                >
                  {litigation_obj?.DirDepartment?.department_contact?.city},{" "}
                </span>
              ) : (
                <span className="text-primary-20">City, </span>
              )}
              {litigation_obj?.DirDepartment?.department_contact?.state ? (
                <span
                  style={{
                    fontWeight: "600",
                    color: "black",
                    fontSize: "14px",
                    lineHeight: "21px",
                  }}
                >
                  {litigation_obj?.DirDepartment?.department_contact?.state +
                    " "}
                </span>
              ) : (
                <span className="text-primary-20">State </span>
              )}
              {litigation_obj?.DirDepartment?.department_contact?.zip ? (
                <span
                  style={{
                    fontWeight: "600",
                    color: "black",
                    fontSize: "14px",
                    lineHeight: "21px",
                  }}
                >
                  {litigation_obj?.DirDepartment?.department_contact?.zip}
                </span>
              ) : (
                <span className="text-primary-20">Zip</span>
              )}
            </p>
          </div>
          {litigation_obj?.DirDepartment?.department_contact?.phone_number ? (
            <p className="colFont info_phone_number text-black">
              {litigation_obj?.DirDepartment?.department_contact?.phone_number}
            </p>
          ) : (
            <p className="colFont info_phone_number text-black">
              <span className="text-primary-20">(###) ###-####</span>
            </p>
          )}
          {litigation_obj?.DirDepartment?.department_contact?.fax ? (
            <p className="colFont info_fax">
              <small>(</small>
              {litigation_obj?.DirDepartment?.department_contact?.fax.slice(
                0,
                3
              )}
              <small>)</small>
              {litigation_obj?.DirDepartment?.department_contact?.fax.slice(
                3,
                6
              )}
              -{litigation_obj?.DirDepartment?.department_contact?.fax.slice(6)}
              <small className="ml-2 text-grey">fax</small>
            </p>
          ) : (
            <p className="colFont info_fax">
              <span className="text-primary-20">(###) ###-####</span>
            </p>
          )}
        </div>
        <div className="mt-auto">
          {litigation_obj?.DirDepartment?.department_contact?.email && (
            <Button
              showButton={true}
              icon={"ic ic-19 ic-email-3d m-r-5"}
              buttonText={`${litigation_obj?.DirDepartment?.department_contact?.email}`}
            />
          )}

          {!window.location.href.includes("bp-courtform") ? (
            <div onClick={handleCourtForm}>
              <Button
                showButton={true}
                icon={"ic ic-19 ic-court-form m-r-5"}
                buttonText={"Court Form"}
              />
            </div>
          ) : null}
        </div>
        {showCourtForm && (
          <CourtForm
            show={true}
            handleClose={() => setShowCourtForm(false)}
            PageEntity="litigation"
            instanceId={"0"}
          />
        )}

        {showDocument && (
          <GenrateDocument
            show={true}
            handleClose={() => setShowDocument(false)}
            PageEntity="litigation"
            instanceId={instanceIdForGenrateDoc}
          />
        )}
        {showPopup && (
          <LitigationClerkPopUp
            litigation_id={litigation_obj?.litigation_id}
            contact_id={
              litigation_obj?.DirDepartment?.department_contact?.current_id
            }
            current_first_name={litigation_obj?.DirDepartment?.clerk_first_name}
            current_last_name={litigation_obj?.DirDepartment?.clerk_last_name}
            current_department={litigation_obj?.DirDepartment?.department}
            current_address1={
              litigation_obj?.DirDepartment?.department_contact?.address1
            }
            current_address2={
              litigation_obj?.DirDepartment?.department_contact?.address2
            }
            current_city={
              litigation_obj?.DirDepartment?.department_contact?.city
            }
            current_state={
              litigation_obj?.DirDepartment?.department_contact?.state
            }
            current_zip={litigation_obj?.DirDepartment?.department_contact?.zip}
            current_phone={
              litigation_obj?.DirDepartment?.department_contact?.phone_number
            }
            current_fax={litigation_obj?.DirDepartment?.department_contact?.fax}
            current_email={
              litigation_obj?.DirDepartment?.department_contact?.email
            }
            showPopup={showPopup}
            handleClose={handleClosePopup}
            states={states}
          />
        )}
        {
          <NotEnablePopUp
            confirmPopUp={validationPopUp}
            handleClose={handleValidationPopUp}
            title={validationText}
          />
        }
      </div>
    </div>
  );
}
