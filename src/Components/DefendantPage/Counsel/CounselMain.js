import React, { useState } from "react";
import CounselEditPopup from "./popups/CounselEditPopup";
import NotesPanel from "../../NotesPanelSection/NotesPanel";
import DocumentRow from "../../DocumentRow/DocumentRow";
import PanelActionBarComponent from "../../common/PanelActionBarComponent";
import CounselIcon from "../../../../public/BP_resources/images/icon/litigation-icon-color.svg";
import ContactPanel from "../../common/ContactPanel";
import InformationPanel from "../../common/InformationPanel";

function CounselMain({
  opposingcounsel,
  counselTypes,
  entity_name,
  For_instance_name,
  handleFacthDefendants,
  setForDeleteCounselId,
  showDeleteCounselConfirm,
  counselZIndex,
}) {
  const [counselEditModal, setCounselEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("counsel");

  const handleCounselEditModal = (tab) => {
    setCounselEditModal(true);
    setActiveTab(tab);
  };

  const handleDeleteConfirmPopup = () => {
    setCounselEditModal(false);
    setForDeleteCounselId(opposingcounsel?.id);
    showDeleteCounselConfirm(true);
  };

  const CounselButtons = [
    {
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "p-l-6 p-r-5",
      style: { height: "25px" },
      onClick: (id, name) => {},
    },
  ];

  return (
    <>
      <div
        className="report"
        style={{ position: "relative", zIndex: counselZIndex }}
      >
        <PanelActionBarComponent
          panelIconSrc={CounselIcon}
          page_name={"Counsel"}
          instanceForName={"Counsel"}
          id={opposingcounsel?.id}
          forInstanceName={For_instance_name}
        />
        <div className="d-flex">
          <div className="d-grid leins-container-four">
            <div className="liens-container-item">
              <ContactPanel
                name={opposingcounsel?.opposingcounselcontact?.name}
                panel_name={"Opposing Counsel"}
                pageName="Defendants"
                className="m-b-5"
                dynamic_label={"Opposing Counsel Name"}
                phone_number={
                  opposingcounsel?.opposingcounselcontact?.phone_number
                }
                fax_number={opposingcounsel?.opposingcounselcontact?.fax}
                email={opposingcounsel?.opposingcounselcontact?.email}
                address1={opposingcounsel?.opposingcounselcontact?.address1}
                address2={opposingcounsel?.opposingcounselcontact?.address2}
                city={opposingcounsel?.opposingcounselcontact?.city}
                state={opposingcounsel?.opposingcounselcontact?.state}
                zip_code={opposingcounsel?.opposingcounselcontact?.zip}
                ext={opposingcounsel?.opposingcounselcontact?.phone_ext}
                buttonData={CounselButtons}
                onSelectObject={() => handleCounselEditModal("counsel")}
              />
            </div>
            <div className="liens-container-item">
              <ContactPanel
                name={opposingcounsel?.opposingattorney?.name}
                className="m-b-5"
                panel_name={"Opposing Attorney"}
                pageName="Defendants"
                phone_number={opposingcounsel?.opposingattorney?.phone_number}
                fax_number={opposingcounsel?.opposingattorney?.fax}
                email={opposingcounsel?.opposingattorney?.email}
                address1={opposingcounsel?.opposingattorney?.address1}
                address2={opposingcounsel?.opposingattorney?.address2}
                city={opposingcounsel?.opposingattorney?.city}
                state={opposingcounsel?.opposingattorney?.state}
                zip_code={opposingcounsel?.opposingattorney?.zip}
                ext={opposingcounsel?.opposingattorney?.phone_ext}
                buttonData={CounselButtons}
                onSelectObject={() => handleCounselEditModal("attorney")}
              />
            </div>
            <div className="liens-container-item">
              <InformationPanel
                panel_name={"Information"}
                className="m-b-5"
                data={[
                  {
                    label: "Type",
                    value: opposingcounsel?.counsel_type?.name,
                  },
                  {
                    label: "File",
                    value: opposingcounsel?.file_number,
                  },
                ]}
                onSelectReport={() => handleCounselEditModal("information")}
              />
            </div>
            <div className="liens-container-item">
              <InformationPanel
                panel_name={"Service"}
                className="m-b-5"
                data={[]}
                onSelectReport={() => console.log("service")}
              />
            </div>
          </div>
          <div className="d-flex d-flex-1 p-l-5 m-b-5 overflow-hidden">
            <NotesPanel
              entity_type={"Counsel"}
              record_id={opposingcounsel?.id}
              module={"Counsel"}
              notesName={"Counsel"}
            />
          </div>
        </div>
        {/* <div className="flex-row d-flex" style={{ overflow: "hidden" }}>
         
          <div className="reports-data row no-gutters equal-column-wrapper position-relative panels-direction-secondary insurance-col-panels padding-t-5">
            <div className="flex-xl-row d-flex flex-column">
              <ContactPanel
                name={opposingcounsel?.opposingcounselcontact?.name}
                panel_name={"Opposing Counsel"}
                className="m-b-5"
                dynamic_label={"Opposing Counsel Name"}
                phone_number={
                  opposingcounsel?.opposingcounselcontact?.phone_number
                }
                fax_number={opposingcounsel?.opposingcounselcontact?.fax}
                email={opposingcounsel?.opposingcounselcontact?.email}
                address1={opposingcounsel?.opposingcounselcontact?.address1}
                address2={opposingcounsel?.opposingcounselcontact?.address2}
                city={opposingcounsel?.opposingcounselcontact?.city}
                state={opposingcounsel?.opposingcounselcontact?.state}
                zip_code={opposingcounsel?.opposingcounselcontact?.zip}
                ext={opposingcounsel?.opposingcounselcontact?.phone_ext}
                buttonData={CounselButtons}
                onSelectObject={() => handleCounselEditModal("counsel")}
              />

              <ContactPanel
                name={opposingcounsel?.opposingattorney?.name}
                className="m-b-5"
                panel_name={"Opposing Attorney"}
                phone_number={opposingcounsel?.opposingattorney?.phone_number}
                fax_number={opposingcounsel?.opposingattorney?.fax}
                email={opposingcounsel?.opposingattorney?.email}
                address1={opposingcounsel?.opposingattorney?.address1}
                address2={opposingcounsel?.opposingattorney?.address2}
                city={opposingcounsel?.opposingattorney?.city}
                state={opposingcounsel?.opposingattorney?.state}
                zip_code={opposingcounsel?.opposingattorney?.zip}
                ext={opposingcounsel?.opposingattorney?.phone_ext}
                buttonData={CounselButtons}
                onSelectObject={() => handleCounselEditModal("attorney")}
              />
            </div>
            <div className="flex-xl-row d-flex flex-column">
              <InformationPanel
                panel_name={"Information"}
                className="m-b-5"
                data={[
                  {
                    label: "Type:",
                    value: opposingcounsel?.counsel_type?.name,
                  },
                  {
                    label: "File:",
                    value: opposingcounsel?.file_number,
                  },
                ]}
                onSelectReport={() => handleCounselEditModal("information")}
              />

              <InformationPanel
                panel_name={"Service"}
                className="m-b-5"
                data={[]}
                onSelectReport={() => console.log("service")}
              />
            </div>
          </div>
          <NotesPanel
            record_id={opposingcounsel?.id}
            module={"Counsel"}
            pagePanels={3}
          />
        </div> */}
        <div className="row documents-wrapper">
          <div className="col-12">
            <div className="height-25">
              <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
                &nbsp;Document Row
              </h4>
            </div>
            <DocumentRow clientProvider={opposingcounsel} page="Counsel" />
          </div>
        </div>
      </div>

      <CounselEditPopup
        show={counselEditModal}
        handleClose={() => setCounselEditModal(false)}
        activeTab={activeTab}
        opposingcounsel={opposingcounsel}
        counselTypes={counselTypes}
        handleFacthDefendants={handleFacthDefendants}
        onShowDeleteConfirmPopup={handleDeleteConfirmPopup}
        CounselButtons={CounselButtons}
      />
    </>
  );
}

export default CounselMain;
