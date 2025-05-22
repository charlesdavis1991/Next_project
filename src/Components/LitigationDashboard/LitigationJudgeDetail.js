import React, { useState } from "react";
import "../../../public/BP_resources/css/litigation.css";
import Button from "../ClientDashboard/shared/button";
import JudgeandDepartmentPopUp from "../Modals/JudgeandDepartmentPopUp";
import GenrateDocument from "../GenrateDocument/GenrateDocument";
import ContactPanel from "../common/ContactPanel";

export default function LitigationJudgeInfo({ Judge }) {
  const templatePopUp = (params) => {
    // Add your templatePopUp function here
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
    setInstanceIdForGenragteDoc(Judge?.litigation_id);
    setShowDocument(true);
  };
  const JudgeButtonsConfig = [
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

  return (
    <div className="width-255 d-flex flex-column p-0 p-r-5 lit-upper-section-child">
      <div className="information-wrapper-litigation d-flex flex-column flex-grow-1">
        {/* <div data-toggle="modal" data-target="#judge-department-modal"> */}
        <ContactPanel 
        id={Judge?.litigation_id}
        pageName={"litigation"}
        onSelectObject={handleCaseClick}
        panel_name={"Judge & Department"}
        name={(Judge?.judge_first_name || Judge?.judge_last_name) && `${Judge?.judge_first_name} ${Judge?.judge_last_name}`}
        dynamic_label={"Judge Name"}
        title1={Judge?.department && `${Judge.department}${Judge?.floor ? `, ${Judge.floor}` : ""}${Judge?.room ? `, ${Judge.room}` : ""}${Judge?.deps ? `, ${Judge.deps}` : ""}`}
        title2={Judge?.clerk_first_name && Judge?.clerk_last_name && `${Judge.clerk_first_name} ${Judge.clerk_last_name}` }
        address1={Judge?.judge_contact?.address1 }
        address2={Judge?.judge_contact?.address2 }
        city={Judge?.judge_contact?.city}
        state={Judge?.judge_contact?.state && Judge?.judge_contact?.state.toUpperCase()}
        zip_code={Judge?.judge_contact?.zip}
        phone_number={Judge?.judge_contact?.phone_number}
        fax_number={Judge?.judge_contact?.fax}
        websiteURL={Judge?.judge_contact?.website}
        email={Judge?.judge_contact?.email}
        buttonData={JudgeButtonsConfig}
        />
        {/* <div
          onClick={handleCaseClick}
          style={{ cursor: "pointer" }}
          className="flex-grow-1"
        >
          <div className="text-left">
            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase d-flex justify-content-center align-items-center" style={{height: "25px", backgroundColor: "var(--primary-15)"}}>
              Judge & Department
            </p>
            <p className="columnsTitle">
              {Judge?.judge_first_name || Judge?.judge_last_name ? (
                `${Judge?.judge_first_name} ${Judge?.judge_last_name}`
              ) : (
                <span className="text-primary-20">Judge Name</span>
              )}
            </p>
            <p className="columnsTitle font-weight-semibold">
              {Judge?.department ? (
                `${Judge.department}${Judge?.floor ? `, ${Judge.floor}` : ""}${Judge?.room ? `, ${Judge.room}` : ""}${Judge?.deps ? `, ${Judge.deps}` : ""}`
              ) : (
                <span className="text-primary-20">Department</span>
              )}
            </p>
            <p className="colFont font-weight-semibold">
              {Judge?.clerk_first_name && Judge?.clerk_last_name ? (
                `${Judge.clerk_first_name} ${Judge.clerk_last_name}`
              ) : (
                <span className="text-primary-20">Clerk Name</span>
              )}
            </p>
            <div>
              <p className="colFont m-0 font-weight-semibold info_address">
                {Judge?.judge_contact?.address1 ||
                Judge?.judge_contact?.address2 ? (
                  <>
                    <div className="col-value colFonts text-left col-title min-h-0 mb-0">
                      {Judge?.judge_contact?.address1 && (
                        <span>{Judge.judge_contact.address1}</span>
                      )}
                      {Judge?.judge_contact?.address2 && (
                        <span>
                          {Judge?.judge_contact?.address1 && ","}{" "}
                          {Judge.judge_contact.address2}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-primary-20">Address</div>
                )}
              </p>
              <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                {Judge?.judge_contact?.city ? (
                  <span
                    style={{
                      fontWeight: "600",
                      color: "black",
                      fontSize: "14px",
                      lineHeight: "21px",
                    }}
                  >
                    {Judge.judge_contact.city},{" "}
                  </span>
                ) : (
                  <span className="text-primary-20">City, </span>
                )}
                {Judge?.judge_contact?.state ? (
                  <span
                    style={{
                      fontWeight: "600",
                      color: "black",
                      fontSize: "14px",
                      lineHeight: "21px",
                    }}
                  >
                    {Judge.judge_contact.state + ", "}
                  </span>
                ) : (
                  <span className="text-primary-20">State </span>
                )}
                {Judge?.judge_contact?.zip ? (
                  <span
                    style={{
                      fontWeight: "600",
                      color: "black",
                      fontSize: "14px",
                      lineHeight: "21px",
                    }}
                  >
                    {Judge.judge_contact.zip}
                  </span>
                ) : (
                  <span className="text-primary-20">Zip</span>
                )}
              </p>
            </div>
            {Judge?.judge_contact?.phone_number ? (
              <p className="colFont info_phone_number text-black">
                {Judge.judge_contact.phone_number}
              </p>
            ) : (
              <p className="colFont info_phone_number text-black">
                <span className="text-primary-20">(###) ###-####</span>
              </p>
            )}
            {Judge?.judge_contact?.fax ? (
              <p className="colFont info_fax">
                <small>(</small>
                {Judge.judge_contact.fax?.slice(0, 3)}
                <small>)-</small>
                {Judge.judge_contact.fax?.slice(3, 6)}
                <small>-</small>
                {Judge.judge_contact.fax?.slice(6)}
                <small className="ml-2 text-grey">fax</small>
              </p>
            ) : (
              <p className="colFont info_fax">
                <span className="text-primary-20">(###) ###-####</span>
              </p>
            )}
            {Judge?.judge_contact?.website ? (
              <p className="colFont info_fax">{Judge.judge_contact.website}</p>
            ) : (
              <p className="colFont info_fax">
                <span className="text-primary-20">prefix.name.com</span>
              </p>
            )}
          </div>
        </div>
        <div>
          {Judge?.judge_contact?.email && (
            <div>
              <div>
                <Button
                  showButton={true}
                  icon={"ic ic-19 ic-email-3d m-r-5"}
                  buttonText={`${Judge.judge_contact.email}`}
                />
              </div>
            </div>
          )}
          {!window.location.href.includes("bp-courtform") ? (
            <div>
              <div onClick={handleGenrateDocument}>
                <Button
                  showButton={true}
                  icon={"ic ic-19 ic-generate-document m-r-5"}
                  buttonText={"Generate Document"}
                />
              </div>
            </div>
          ) : null}
        </div> */}
        {showDocument && (
          <GenrateDocument
            show={true}
            handleClose={() => setShowDocument(false)}
            PageEntity="litigation"
            instanceId={instanceIdForGenrateDoc}
          />
        )}
        {showPopup && (
          <JudgeandDepartmentPopUp
            JudgeData={Judge}
            showPopup={showPopup}
            handleClose={handleClosePopup}
          />
        )}
      </div>
    </div>
  );
}
