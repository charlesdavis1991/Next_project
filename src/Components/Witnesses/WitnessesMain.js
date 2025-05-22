import React, { useContext, useState } from "react";
import DocumentRow from "../DocumentRow/DocumentRow";
import WitnessTitleBar from "./Witnesses/WitnessTitleBar";
import Witness from "./Witnesses/Witness";
import WitnessFor from "./Witnesses/WitnessFor";
import WitnessDetails from "./Witnesses/WitnessDetails";
import NotesPanel from "../NotesPanelSection/NotesPanel";
import AddWitnessCounsel from "./Counsel/AddWitnessCounsel";
import EditWitnesses from "./Witnesses/EditWitnesses";
import ConfirmDeletePopup from "../DefendantPage/DefandantMain/ConfirmDeletePopup";
import AddWitnessInsuranceModal from "./insurance/AddWitnessInsuranceModal";
import api from "../../api/api";
import WitnessStatementSummary from "./Witnesses/WitnessStatementSummary";
import TextPanel from "../common/TextPanel";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
import PanelActionBarComponent from "../common/PanelActionBarComponent";
import { useSelector } from "react-redux";
import ContactPanel from "../common/ContactPanel";
import GenrateDocument from "../GenrateDocument/GenrateDocument";
import InformationPanel from "../common/InformationPanel";
import { parseISO, format } from "date-fns";

// RK:08-08-2024 :: 2:40 am
function WitnessesMain({
  object,
  witnesses,
  handleFetchWitnesses,
  modalData,
  retainedByList,
  setReducer,
  reducerValue,
}) {
  const [counselAddModalShow, setAddCounselModalShow] = useState(false);
  const [showEditWitnessesModal, setShowEditWitnessesModal] = useState(false);
  const [activeTab, SetActiveTab] = useState("witness");
  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);
  const [addInsuranceModalShow, setAddInsuranceModalShow] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);

  const {
    isClientDataUpdated,
    setIsClientDataUpdated,
    isPanelChecklistUpdated,
    setIsPanelChecklistUpdated,
  } = useContext(ClientDataContext);

  const handleDeleteShow = () => {
    setShowEditWitnessesModal(!showEditWitnessesModal);
    setIsShowConfirmDelete(!isShowConfirmDelete);
  };

  const handleDeleteSubmission = async () => {
    try {
      const response = await api.delete(
        `api/witnesses/delete_witness/${object?.id}/`
      );
      if (response.status === 204) {
        // handleFetchWitnesses();
        setIsClientDataUpdated(!isClientDataUpdated);
        setIsPanelChecklistUpdated(!isPanelChecklistUpdated);
        setReducer(reducerValue);
        // setShowEditWitnessesModal(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsShowConfirmDelete(false);
    }
  };

  const header_name = useSelector((state) => state.header_name?.header_name);
  const handleGenrateDocument = (instanceId) => {
    console.log("FUNCTION IS CALLED");
    console.log("HGD instance id == :: ", instanceId);
    setInstanceIdForGenragteDoc(instanceId);
    setShowDocument(true);
  };

  console.log("Object ===>", object);
  const buttonData = [
    {
      id: "email-button",
      iconClassName: "ic ic-19 ic-email-3d",
      buttonText: object?.witness_contact_last?.email,
      className: "overflow-hidden info_email m-b-5 p-l-6 p-r-6",
      style: { height: "25px" },
      onClick: () => console.log("Email clicked"),
    },
    {
      id: "generate-document-button",
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "p-l-6 p-r-5",
      style: { height: "25px" },
      onClick: (id) => handleGenrateDocument(id),
    },
  ];
  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = parseISO(date);
    return format(parsedDate, "M/dd/yyyy");
  };
  const personalData = [
    { label: "For:", value: object?.witness_for_name },
    { label: "DOB", value: formatDate(object?.witness_birthday) },
    { label: "Gender", value: object?.witness_gender },
    { label: "Rep Letter", value: formatDate(object?.RepLetterSent) },
    { label: "Contact", value: formatDate(object?.contact_confirmed_date) },
  ];

  const firstName = object?.witness_first_name?.trim() || "";
  const lastName = object?.witness_last_name?.trim() || "";
  const name = `${firstName} ${lastName}`.trim();
  return (
    <>
      <div className="report" key={object?.id}>
        {/* <WitnessTitleBar
          object={object}
          setAddCounselModalShow={setAddCounselModalShow}
          setAddInsuranceModalShow={setAddInsuranceModalShow}
        /> */}
        <PanelActionBarComponent
          id={object?.id}
          page_name={"Witnesses"}
          title={object?.witness_title}
          first_name={object?.witness_first_name}
          last_name={object?.witness_last_name}
          report_type_name={"Witness"}
        />
        <div className="flex-row d-flex" style={{ overflow: "hidden" }}>
          <div className="row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels">
            {/* <Witness
              object={object}
              onSelect={() => {
                SetActiveTab("witness");
                setShowEditWitnessesModal(true);
              }}
            /> */}
            <ContactPanel
              id={object?.id}
              panel_name="Witness"
              title={""}
              name={name}
              address1={object?.witness_contact_last?.address1}
              address2={object?.witness_contact_last?.address2}
              city={object?.witness_contact_last?.city}
              state={object?.witness_contact_last?.state}
              zip_code={object?.witness_contact_last?.zip}
              phone_number={object?.witness_contact_last?.phone_number}
              ext={object?.witness_contact_last?.phone_ext}
              fax_number={object?.witness_contact_last?.fax}
              email={object?.witness_contact_last?.email}
              onSelectReport={() => {
                SetActiveTab("witness");
                setShowEditWitnessesModal(true);
              }}
              buttonData={buttonData}
            />
            {/* 
            <WitnessDetails
              object={object}
              onSelect={() => {
                SetActiveTab("details");
                setShowEditWitnessesModal(true);
              }}
            /> */}

            <InformationPanel
              id={object?.id}
              panel_name="Witness Details"
              data={personalData}
              onSelectReport={() => {
                SetActiveTab("details");
                setShowEditWitnessesModal(true);
              }}
              hasBtn={false}
            />

            {/* <WitnessFor
              object={object}
              onSelect={() => {
                SetActiveTab("witness-for");
                setShowEditWitnessesModal(true);
              }}
            /> */}

            <TextPanel
              object={object}
              panel_name="Witness Statement Summary"
              className="info-div-witness-statement-summary"
              onSelect={() => {
                SetActiveTab("WitnessStatementSummary");
                setShowEditWitnessesModal(true);
              }}
            />
          </div>

          <NotesPanel
            entity_type={"Witnesses"}
            record_id={object?.id}
            module={"Witnesses"}
            pagePanels={3}
          />
        </div>
        <div className="row documents-wrapper m-t-5">
          <div className="col-12">
            <div className="height-25">
              <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
                &nbsp;Document Row
              </h4>
            </div>
            <DocumentRow clientProvider={object} page="Witnesses" />
          </div>
        </div>
      </div>

      {showEditWitnessesModal && (
        <EditWitnesses
          object={object}
          show={showEditWitnessesModal}
          activeTab={activeTab}
          onFetch={handleFetchWitnesses}
          handleClose={() => setShowEditWitnessesModal(false)}
          onShowDeleteConfirmPopup={handleDeleteShow}
          retainedByList={retainedByList}
          setReducer={setReducer}
          reducerValue={reducerValue}
        />
      )}

      {isShowConfirmDelete && (
        <ConfirmDeletePopup
          entity="Witness"
          handleClose={() => setIsShowConfirmDelete(false)}
          handleDeleteSubmission={handleDeleteSubmission}
        />
      )}

      {counselAddModalShow && (
        <AddWitnessCounsel
          witnesses={witnesses}
          handleFacth={handleFetchWitnesses}
          handleClose={() => setAddCounselModalShow(false)}
          currentWitnessId={object?.id}
        />
      )}

      {addInsuranceModalShow && (
        <AddWitnessInsuranceModal
          show={addInsuranceModalShow}
          handleClose={() => setAddInsuranceModalShow(false)}
          handleInsuranceSubmit={handleFetchWitnesses}
          client={modalData?.client}
          otherParties={modalData?.other_parties}
          witnesses={witnesses}
          insuranceTypes={modalData?.insurance_types}
          states={modalData?.states}
          litigation={modalData?.litigation}
          currentWitnessId={object?.id}
        />
      )}

      {showDocument && (
        <GenrateDocument
          show={true}
          handleClose={() => setShowDocument(false)}
          PageEntity="Witnesses"
          instanceId={instanceIdForGenrateDoc}
        />
      )}
    </>
  );
}

export default WitnessesMain;
