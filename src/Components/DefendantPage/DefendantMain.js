import React, { useState } from "react";
import DocumentRow from "../DocumentRow/DocumentRow";
import NotesPanel from "../NotesPanelSection/NotesPanel";
import PanelActionBarComponent from "../common/PanelActionBarComponent";
import ContactPanel from "../common/ContactPanel";
import InformationPanel from "../common/InformationPanel";
import { currencyFormat, formatDateForPanelDisplay } from "../../Utils/helper";
import PanelActionBarComponentDefendant from "../common/PanelActionBarDefendant";

function DefendantMain({
  object,
  selecetedEditableTapPanel,
  setSelectedDefendant,
  setForDeleteDefendatsId,
  setAddInsuranceModalShow,
  setAddCounselModalShow,
  setCurrentDefendantId,
  handleGenrateDocument,
  handeCounselShow,
  handeInsuranceShow,
  defendants,
}) {
  // const handeInsuranceShow = () => {
  //   setAddInsuranceModalShow(true);
  //   setCurrentDefendantId(object.id);
  // };
  // const handeCounselShow = () => {
  //   setAddCounselModalShow(true);
  //   setCurrentDefendantId(object.id);
  // };

  function roundToInt(value) {
    const number = parseFloat(value) || 0; // Convert value to a float
    return Math.round(number); // Proper rounding without skewing
  }

  const buttonsConfig = [
    // {
    //   label: "Insurance",
    //   icon: "+",
    //   className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
    //   dataToggle: "modal",
    //   dataTarget: "#addInsurance",
    //   onClick: () => handeInsuranceShow(object.id),
    // },
    // {
    //   label: "Counsel",
    //   icon: "+",
    //   className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
    //   dataToggle: "modal",
    //   dataTarget: "#addCounsel",
    //   onClick: () => handeCounselShow(object.id),
    // },
  ];
  const DefendantButtonsConfig = [
    {
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "p-l-6 p-r-5",
      style: {
        height: "25px",
        backgroundColor: "var(--primary-10)",
        borderColor: "var(--primary)",
        color: "var(--primary)",
      },
      onClick: handleGenrateDocument,
    },
  ];

  const EmploymentButtonsConfig = [
    {
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "p-l-6 p-r-5",
      style: {
        height: "25px",
        backgroundColor: "var(--primary-10)",
        borderColor: "var(--primary)",
        color: "var(--primary)",
      },
      onClick: (id, name) => {},
    },
  ];


  return (
    <div className="expert" key={object?.id}>
      {/* <div className="continuous-tabs">
        <div className="tab defendants d-flex align-items-center justify-content-center">
          <span className="font-weight-bold pr-2 text-gold">+</span>Defendants
        </div>
        <div className="tab insurance d-flex align-items-center justify-content-center">
          <span className="font-weight-bold pr-2 text-gold">+</span>Insurance
        </div>
        <div className="tab counsel d-flex align-items-center justify-content-center">
          {" "}
          <span className="font-weight-bold pr-2 text-gold">+</span>Counsel
        </div>
      </div> */}
      {defendants[0]?.id === object?.id ? (
        <PanelActionBarComponentDefendant
          id={object?.id}
          title={object?.title}
          object={object}
          buttons={buttonsConfig}
          page_name={"Defendants"}
          hasGradient={true}
          defendants={defendants}
        />
      ) : (
        <PanelActionBarComponent
          id={object?.id}
          title={object?.title}
          object={object}
          buttons={buttonsConfig}
          page_name={"Defendants"}
          hasGradient={true}
          defendants={defendants}
        />
      )}
      {/* <PanelActionBarComponent
        id={object?.id}
        title={object?.title}
        object={object}
        buttons={buttonsConfig}
        page_name={"Defendants"}
        hasGradient={true}
        defendants={defendants}
      /> */}
      <div className="d-flex">
        <div className="d-grid leins-container-four">
          <div className="liens-container-item">
          <ContactPanel
              id={object?.id}
              pageName="Defendants"
              name={
                object?.defendantType_name === "Private Individual"
                  ? `${object?.first_name}  ${object?.last_name}`
                  : object?.entity_name
              }
              dynamic_label={
                object?.defendantType_name !== "Private Individual"
                  ? "Entity Name"
                  : ""
              }
              panel_name={
                object?.defendantType_name == "Private Individual"
                  ? "Contact Information"
                  : object?.defendantType_name === "Commercial Company"
                    ? "Company Information"
                    : object?.defendantType_name === "Public Entity"
                      ? "Public Entity"
                      : "Defendant"
              }
              className=""
              phone_number={object?.home_contact?.phone_number}
              fax_number={object?.home_contact?.fax}
              email={object?.home_contact?.email}
              address1={object?.home_contact?.address1}
              address2={object?.home_contact?.address2}
              city={object?.home_contact?.city}
              state={object?.home_contact?.state}
              zip_code={object?.home_contact?.zip}
              ext={object?.home_contact?.phone_ext}
              buttonData={DefendantButtonsConfig}
              genrate_doc_address={"Defendant Address"}
              onSelectObject={() => (
                setSelectedDefendant(object),
                (selecetedEditableTapPanel.current = "defendant"),
                setForDeleteDefendatsId(object?.id)
              )}
            />
          </div>
          <div className="liens-container-item">
          <ContactPanel
            pageName="Defendants"
              id={object?.id}
              name={object?.defendant_employer}
              panel_name={
                object?.defendantType_name == "Private Individual"
                  ? "Employer"
                  : object?.defendantType_name === "Commercial Company"
                    ? "Agent For Service"
                    : object?.defendantType_name === "Public Entity"
                      ? "Claims Of Department"
                      : "Employer"
              }
              className=""
              phone_number={object?.work_contact?.phone_number}
              email={object?.work_contact?.email}
              address1={object?.work_contact?.address1}
              address2={object?.work_contact?.address2}
              city={object?.work_contact?.city}
              state={object?.work_contact?.state}
              zip_code={object?.work_contact?.zip}
              ext={object?.work_contact?.phone_ext}
              fax_number={object?.work_contact?.fax}
              buttonData={EmploymentButtonsConfig}
              onSelectObject={() => (
                setSelectedDefendant(object),
                (selecetedEditableTapPanel.current = "employment"),
                setForDeleteDefendatsId(object?.id)
              )}
            />

          </div>
          <div className="liens-container-item">
          <InformationPanel
              panel_name={"Information"}
              className=""
              data={[
                {
                  label: "Type",
                  value: `${object?.gender} ${object?.defendantType_name}`,
                },
                {
                  label: "Liability%",
                  value: `${roundToInt(object?.liability_estimate)} %/ ${roundToInt(object?.liability_percent)} %`,
                },
                {
                  label: "Rep Letter",
                  value: formatDateForPanelDisplay(object?.repr_letter_sent),
                },
                {
                  label: "Contact",
                  value: formatDateForPanelDisplay(object?.contact_date),
                },
                {
                  label: "Served",
                  value: formatDateForPanelDisplay(object?.defServedDate),
                },
                object?.defendantType_name === "Private Individual"
                  ? {
                      label: "DOB",
                      value: formatDateForPanelDisplay(object?.birthday),
                    }
                  : {},
              ]}
              onSelectReport={() => (
                setSelectedDefendant(object),
                (selecetedEditableTapPanel.current = "information"),
                setForDeleteDefendatsId(object?.id)
              )}
            />
          </div>
          <div className="liens-container-item">
          <ContactPanel
              id={object?.id}
              pageName="Defendants"
              className=""
              name={object?.process_server?.contact_id?.name}
              panel_name={"process-server"}
              phone_number={object?.process_server?.contact_id?.phone_number}
              email={object?.process_server?.contact_id?.email}
              address1={object?.process_server?.contact_id?.address1}
              address2={object?.process_server?.contact_id?.address2}
              city={object?.process_server?.contact_id?.city}
              state={object?.process_server?.contact_id?.state}
              zip_code={object?.process_server?.contact_id?.zip}
              ext={object?.process_server?.contact_id?.phone_ext}
              fax_number={object?.process_server?.contact_id?.fax}
              buttonData={EmploymentButtonsConfig}
              onSelectObject={() => (
                setSelectedDefendant(object),
                (selecetedEditableTapPanel.current = "process-server"),
                setForDeleteDefendatsId(object?.id)
              )}
            />
          </div>
        </div>
        <div className="d-flex d-flex-1 p-l-5 m-b-5 overflow-hidden">
          <NotesPanel
            entity_type={"Defendants"}
            record_id={object.id}
            module={"Defendants"}
            notesName={"Defendants"}
          />
        </div>
      </div>
      {/* <div className="flex-row d-flex lien-rows" style={{ overflow: "hidden" }}>
        <div className="reports-data row no-gutters equal-column-wrapper position-relative panels-direction-secondary insurance-col-panels padding-t-5">
          <div className="d-flex flex-xl-row flex-column">
            <ContactPanel
              id={object?.id}
              name={
                object?.defendantType_name === "Private Individual"
                  ? `${object?.first_name}  ${object?.last_name}`
                  : object?.entity_name
              }
              dynamic_label={
                object?.defendantType_name !== "Private Individual"
                  ? "Entity Name"
                  : ""
              }
              panel_name={
                object?.defendantType_name == "Private Individual"
                  ? "Contact Information"
                  : object?.defendantType_name === "Commercial Company"
                    ? "Company Information"
                    : object?.defendantType_name === "Public Entity"
                      ? "Public Entity"
                      : "Defendant"
              }
              className=""
              phone_number={object?.home_contact?.phone_number}
              fax_number={object?.home_contact?.fax}
              email={object?.home_contact?.email}
              address1={object?.home_contact?.address1}
              address2={object?.home_contact?.address2}
              city={object?.home_contact?.city}
              state={object?.home_contact?.state}
              zip_code={object?.home_contact?.zip}
              ext={object?.home_contact?.phone_ext}
              buttonData={DefendantButtonsConfig}
              genrate_doc_address={"Defendant Address"}
              onSelectObject={() => (
                setSelectedDefendant(object),
                (selecetedEditableTapPanel.current = "defendant"),
                setForDeleteDefendatsId(object?.id)
              )}
            />

            <ContactPanel
              id={object?.id}
              name={object?.defendant_employer}
              panel_name={
                object?.defendantType_name == "Private Individual"
                  ? "Employer"
                  : object?.defendantType_name === "Commercial Company"
                    ? "Agent For Service"
                    : object?.defendantType_name === "Public Entity"
                      ? "Claims Of Department"
                      : "Employer"
              }
              className=""
              phone_number={object?.work_contact?.phone_number}
              email={object?.work_contact?.email}
              address1={object?.work_contact?.address1}
              address2={object?.work_contact?.address2}
              city={object?.work_contact?.city}
              state={object?.work_contact?.state}
              zip_code={object?.work_contact?.zip}
              ext={object?.work_contact?.phone_ext}
              fax_number={object?.work_contact?.fax}
              buttonData={EmploymentButtonsConfig}
              onSelectObject={() => (
                setSelectedDefendant(object),
                (selecetedEditableTapPanel.current = "employment"),
                setForDeleteDefendatsId(object?.id)
              )}
            />

            <InformationPanel
              panel_name={"Information"}
              className=""
              data={[
                {
                  label: "Type:",
                  value: `${object?.gender} ${object?.defendantType_name}`,
                },
                {
                  label: "Liability%:",
                  value: `${roundToInt(object?.liability_estimate)} %/ ${roundToInt(object?.liability_percent)} %`,
                },
                {
                  label: "Rep Letter:",
                  value: formatDateForPanelDisplay(object?.repr_letter_sent),
                },
                {
                  label: "Contact:",
                  value: formatDateForPanelDisplay(object?.contact_date),
                },
                {
                  label: "Served:",
                  value: formatDateForPanelDisplay(object?.defServedDate),
                },
                object?.defendantType_name === "Private Individual"
                  ? {
                      label: "DOB:",
                      value: formatDateForPanelDisplay(object?.birthday),
                    }
                  : {},
              ]}
              onSelectReport={() => (
                setSelectedDefendant(object),
                (selecetedEditableTapPanel.current = "information"),
                setForDeleteDefendatsId(object?.id)
              )}
            />
          </div>
          <div className="d-flex flex-xl-row flex-column">


            <ContactPanel
              id={object?.id}
              className=""
              name={object?.process_server?.contact_id?.name}
              panel_name={"process-server"}
              phone_number={object?.process_server?.contact_id?.phone_number}
              email={object?.process_server?.contact_id?.email}
              address1={object?.process_server?.contact_id?.address1}
              address2={object?.process_server?.contact_id?.address2}
              city={object?.process_server?.contact_id?.city}
              state={object?.process_server?.contact_id?.state}
              zip_code={object?.process_server?.contact_id?.zip}
              ext={object?.process_server?.contact_id?.phone_ext}
              fax_number={object?.process_server?.contact_id?.fax}
              buttonData={EmploymentButtonsConfig}
              onSelectObject={() => (
                setSelectedDefendant(object),
                (selecetedEditableTapPanel.current = "process-server"),
                setForDeleteDefendatsId(object?.id)
              )}
            />
            <InformationPanel
              panel_name={"Lien Information"}
              className=""
              data={[
                {
                  label: "Lien Adjuster:",
                  value: `John Doe`,
                },
                {
                  label: "HI Paid:",
                  value: `${currencyFormat("3400")}`,
                },
                {
                  label: "Medpay/Pip:",
                  value: `${currencyFormat("3400")}`,
                },
                {
                  label: "ERISA Protected Lien",
                  value: <Form.Check
                  style={{width:"15px",height:"15px"}}
                  type="checkbox"
                  className="protection-lien-cb"
                  name="protection_lien"
                  />,
                },
                {
                  label: "",
                  value:"",
                },
                {
                  label: "Total Paid",
                  value: `${currencyFormat("3400")}`,
                },
                {
                  label: "Original Lien:",
                  value: `${currencyFormat("3400")}`,
                },
                {
                  label: "Final Lien:",
                  value: `${currencyFormat("3400")}`,
                },
              ]}
            />
            <ContactPanel
              panel_name={"lien contact panel"}
              buttonData={LienButtonsConfig}
              dynamic_label={"Company Name"}
            />
          </div>
        </div>

        <NotesPanel
          entity_type={"Defendants"}
          record_id={object.id}
          module={"Defendants"}
          notesName={"Defendants"}
        />
      </div> */}
      <div className="row documents-wrapper">
        <div className="col-12">
          <div className="height-25">
            <h4
              className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case font-weight-semibold text-center client-contact-title"
              style={{ background: "var(--primary-15)" }}
            >
              &nbsp;Document Row
            </h4>
          </div>
          <DocumentRow clientProvider={object} page="Defendants" />
        </div>
      </div>
    </div>
  );
}

export default DefendantMain;
