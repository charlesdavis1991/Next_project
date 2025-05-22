import React, { useEffect, useState } from "react";
import EmploymentTitlebar from "./EmploymentTitleBar";
import Employment from "./components/Employment";
import Supervisor from "./components/Supervisor";
import Manager from "./components/Manager";
import DisabilityLien from "./components/DisabilityLien";
import EmployeeBottom from "./components/EmployeeBottom";
import NotesPanel from "../NotesPanelSection/NotesPanel";
import DocumentRow from "../DocumentRow/DocumentRow";
import DocumentFetchingLoader from "../Loaders/DocumentFetchingLoader";
import GenrateDocument from "../GenrateDocument/GenrateDocument";
import PanelActionBarComponent from "../common/PanelActionBarComponent";
import ContactPanel from "../common/ContactPanel";

function EmploymentMain({ employmentData, onEdit, onDelete, loading }) {
  // if (!employmentData.length) {
  //   return <DocumentFetchingLoader />;
  // }
  const [showDocument, setShowDocument] = useState(false);
  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);
  const [dropdownName, setDropdownName] = useState("");

  const handleGenrateDocument = (instanceId, dropDownName) => {
    console.log("FUNCTION IS CALLED");
    console.log("HGD instance id == :: ", instanceId);
    setDropdownName(dropDownName);
    setInstanceIdForGenragteDoc(instanceId);
    setShowDocument(true);
  };

  const DefendantButtonsConfig = [
    {
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "p-l-6 p-r-5",
      style: { height: "25px" },
      onClick: handleGenrateDocument,
    },
  ];

  return (
    <>
      {
        loading ? (
          <DocumentFetchingLoader />
        ) : employmentData.length ? (
          employmentData.map((employment) => {
            const {
              id,
              disability_lien_contact,
              employment_contact,
              manager,
              supervisor,
              for_case,
              for_client,
              employer_name,
              job_title,
              job_description,
              wages_lost,
              disability_lost,
              disability_lien,
              disability_final,
              disability_claim_number,
              documents,
              photos,
            } = employment;

            return (
              <div key={id} className="expert">
                <PanelActionBarComponent
                  id={id}
                  page_name={"Employment"}
                  panelIconSrc={
                    "/BP_resources/images/icon/defendants-icon-color.svg"
                  }
                  title={employer_name}
                />
                <div className="flex-row d-flex" style={{ overflow: "hidden" }}>
                  <div className="reports-data row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels padding-t-5">
                    <div className="d-flex">
                      {/* <div onClick={() => onEdit(employment, "employment")}>
                        <Employment 
                          object={employment}
                          handleGenrateDocument={handleGenrateDocument}
                        /> 
                      </div> */}
                      <ContactPanel
                        id={id}
                        name={employment_contact?.name}
                        dynamic_label={
                          employment_contact?.first_name ||
                          employment_contact?.last_name
                            ? "Private Individual"
                            : "Full Name"
                        }
                        panel_name={"Employment"}
                        phone_number={employment_contact?.phone_number}
                        email={employment_contact?.email}
                        address1={employment_contact?.address1}
                        address2={employment_contact?.address2}
                        city={employment_contact?.city}
                        state={employment_contact?.state}
                        zip_code={employment_contact?.zip}
                        ext={employment_contact?.phone_ext}
                        buttonData={DefendantButtonsConfig}
                        genrate_doc_address={"Employment Address"}
                        onSelectObject={() => {
                          onEdit(employment, "employment");
                        }}
                      />

                      {/* <div onClick={() => onEdit(employment, "supervisor")}>
                    <Supervisor object={employment} />
                  </div> */}
                      <ContactPanel
                        id={id}
                        name={
                          supervisor?.first_name || supervisor?.last_name
                            ? `${supervisor?.first_name || ""} ${supervisor?.last_name || ""}`.trim() ||
                              undefined
                            : undefined
                        }
                        dynamic_label={
                          supervisor?.defendantType_name !==
                          "Private Individual"
                            ? "Full Name"
                            : ""
                        }
                        panel_name={"Supervisor"}
                        phone_number={supervisor?.home_contact?.phone_number}
                        email={supervisor?.home_contact?.email}
                        address1={supervisor?.home_contact?.address1}
                        address2={supervisor?.home_contact?.address2}
                        city={supervisor?.home_contact?.city}
                        state={supervisor?.home_contact?.state}
                        zip_code={supervisor?.home_contact?.zip}
                        ext={supervisor?.home_contact?.phone_ext}
                        buttonData={DefendantButtonsConfig}
                        genrate_doc_address={"Defendant Address"}
                        onSelectObject={() => onEdit(employment, "supervisor")}
                      />
                    </div>
                    <div className="d-flex">
                      {/* <div onClick={() => onEdit(employment, "manager")}>
                    <Manager object={employment} />
                  </div> */}
                      <ContactPanel
                        id={id}
                        name={
                          manager?.first_name || manager?.last_name
                            ? `${manager?.first_name || ""} ${manager?.last_name || ""}`.trim() ||
                              undefined
                            : undefined
                        }
                        dynamic_label="Employer Name"
                        panel_name={"Manager"}
                        phone_number={manager?.home_contact?.phone_number}
                        email={manager?.home_contact?.email}
                        address1={manager?.home_contact?.address1}
                        address2={manager?.home_contact?.address2}
                        city={manager?.home_contact?.city}
                        state={manager?.home_contact?.state}
                        zip_code={manager?.home_contact?.zip}
                        ext={manager?.home_contact?.phone_ext}
                        buttonData={DefendantButtonsConfig}
                        genrate_doc_address={"Defendant Address"}
                        onSelectObject={() => onEdit(employment, "manager")}
                      />
                      <ContactPanel
                        id={id}
                        name={
                          disability_lien?.first_name ||
                          disability_lien?.last_name
                            ? `${disability_lien?.first_name || ""} ${disability_lien?.last_name || ""}`.trim() ||
                              undefined
                            : undefined
                        }
                        dynamic_label={
                          disability_lien?.defendantType_name !==
                          "Private Individual"
                            ? "Full Name"
                            : ""
                        }
                        panel_name={"DisabilityLien"}
                        phone_number={
                          disability_lien?.home_contact?.phone_number
                        }
                        email={disability_lien?.home_contact?.email}
                        address1={disability_lien?.home_contact?.address1}
                        address2={disability_lien?.home_contact?.address2}
                        city={disability_lien?.home_contact?.city}
                        state={disability_lien?.home_contact?.state}
                        zip_code={disability_lien?.home_contact?.zip}
                        ext={disability_lien?.home_contact?.phone_ext}
                        buttonData={DefendantButtonsConfig}
                        genrate_doc_address={"Defendant Address"}
                        onSelectObject={() =>
                          onEdit(employment, "disabilityLien")
                        }
                      />
                      {/* <div onClick={() => onEdit(employment, "disabilityLien")}>
                    <DisabilityLien object={employment} />
                  </div> */}
                    </div>
                    <div onClick={() => onEdit(employment, "employeeBottom")}>
                      <EmployeeBottom object={employment} />
                    </div>
                  </div>

                  <NotesPanel
                    entity_type={"Employment"}
                    record_id={id}
                    module={"Employments"}
                    // pagePanels={5}
                  />
                </div>
                <div className="row documents-wrapper m-t-5">
                  <div className="col-12">
                    <div className="height-25">
                      <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
                        Employment {employer_name} Quick-Access Document Row
                      </h4>
                    </div>    
                    <DocumentRow
                      clientProvider={employment}
                      page="Employment"
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          ""
        )
        //  (
        //   <h4 className="px-3 pb-2">Not Enough Record</h4>
        // )
      }
      {showDocument && (
        <GenrateDocument
          show={true}
          handleClose={() => setShowDocument(false)}
          PageEntity="Employment"
          dropdownName={dropdownName}
          instanceId={instanceIdForGenrateDoc}
        />
      )}
    </>
  );
}

export default EmploymentMain;
