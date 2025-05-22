import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Provider from "./CaseProviderModals/Provider";
import TreatmentLocation from "./CaseProviderModals/TreatmentLocation";
import RequestRecords from "./CaseProviderModals/RecordsRecieved";
import LineHolder from "./CaseProviderModals/LineHolder";
import TreatmentDate from "./CaseProviderModals/TreatmentDate";
import ProviderCharges from "./CaseProviderModals/ProviderCharges";

function EditCaseProviderModal({
  updateCall,
  onUpdate,
  show,
  handleClose,
  caseProvider,
  setcaseProvidersList,
  specialitie,
  setSpecialitiesList,
  location,
  setLocation,
  contact,
  setContact,
  isRequestBillingVerified,
  setIsRequestBillingVerified,
  isReceivedBillingVerified,
  setIsReceivedBillingVerified,
  treatmentBill,
  setTreatmentBill,
  paidBill,
  setPaidBill,
  isBillingCostVerified,
  setIsBillingCostVerified,
  isBillingPaidVerified,
  setIsBillingPaidVerified,
  isRequestRecordVerified,
  setIsRequestRecordVerified,
  isRequestRecivedVerified,
  setIsRequestRecivedVerified,
  isRecordCostVerified,
  setIsRecordCostVerified,
  isRecordPaidVerified,
  setIsRecordPaidVerified,
  treatmentRecord,
  setTreatmentRecord,
  paidRecords,
  setPaidRecords,
  isLineHolderBalanceVerified,
  setIsLineHolderBalanceVerified,
  isLineHolderBalanceConfirmedVerified,
  setIsLineHolderBalanceConfirmedVerified,
  lienHolder,
  setLienHolder,
  isTreatmentDateFirstVerified,
  setIsTreatmentDateFirstVerified,
  isTreatmentDateLastVerified,
  setIsTreatmentDateLastVerified,
  isTreatmentDateVisitVerified,
  setIsTreatmentDateVisitVerified,
  allTreatmentDates,
  setAllTreatmentDates,
  isTreatmentCompleteVerified,
  setIsTreatmentCompleteVerified,
}) {
  const [activeTab, setActiveTab] = useState("provider-tab");

  const handleSave = () => {
    switch (activeTab) {
      case "provider-tab":
        providerRef.current.save();
        break;
      case "treatment-location-tab":
        treatmentLocationRef.current.save();
        break;
      case "record-billing-tab":
        requestBillingRef.current.save();
        break;
      case "request-record-tab":
        requestRecordRef.current.save();
      case "line-holder-tab":
        lineHolderRef.current.save();
      case "treatment-dates-tab":
        treatmentDatesRef.current.save();
      case "provider-charges":
        providerChargesRef.current.save();
      default:
        console.error("No active tab selected");
    }
  };

  const providerRef = useRef(null);
  const treatmentLocationRef = useRef(null);
  const requestBillingRef = useRef(null);
  const requestRecordRef = useRef(null);
  const lineHolderRef = useRef(null);
  const treatmentDatesRef = useRef(null);
  const providerChargesRef = useRef(null);

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Body>
        <div className="modal-header text-center">
          <h5 className="modal-title mx-auto">Edit Case Provider</h5>
        </div>

        <div className="modal-body min-h-943 max-h-943 overflow-scroll">
          <div className="custom-tab mt-3">
            <nav className="ml-0">
              <div
                className="nav nav-tabs justify-content-around"
                id="nav-tab"
                role="tablist"
              >
                <a
                  className="nav-item nav-link active Pad8 tab-item edit-case-tabs"
                  id="provider-link"
                  data-toggle="tab"
                  href="#provider-tab"
                  role="tab"
                  aria-controls="provider-tab"
                  aria-selected="false"
                  onClick={() => setActiveTab("provider-tab")}
                >
                  Provider
                </a>
                <a
                  className="nav-item nav-link Pad8 tab-item edit-case-tabs"
                  id="treatment-location-link"
                  data-toggle="tab"
                  href="#treatment-location-tab"
                  role="tab"
                  aria-controls="treatment-location-tab"
                  aria-selected="false"
                  onClick={() => setActiveTab("treatment-location-tab")}
                >
                  Treatment Location
                </a>
                <a
                  className="nav-item nav-link Pad8 tab-item edit-case-tabs"
                  id="request-billing-link"
                  data-toggle="tab"
                  href="#request-billing-tab"
                  role="tab"
                  aria-controls="request-billing-tab"
                  aria-selected="false"
                  onClick={() => setActiveTab("record-billing-tab")}
                >
                  Request Billing
                </a>
                <a
                  className="nav-item nav-link Pad8 tab-item edit-case-tabs"
                  id="request-record-link"
                  data-toggle="tab"
                  href="#request-record-tab"
                  role="tab"
                  aria-controls="request-record-tab"
                  aria-selected="false"
                  onClick={() => setActiveTab("request-record-tab")}
                >
                  Request Records
                </a>
                <a
                  className="nav-item nav-link Pad8 tab-item edit-case-tabs"
                  id="lien-holder-link"
                  data-toggle="tab"
                  href="#lien-holder-tab"
                  role="tab"
                  aria-controls="lien-holder-tab"
                  aria-selected="false"
                  onClick={() => setActiveTab("line-holder-tab")}
                >
                  Lien Holder
                </a>
                <a
                  className="nav-item nav-link Pad8 tab-item edit-case-tabs"
                  id="treatment-dates-link"
                  data-toggle="tab"
                  href="#treatment-dates-tab"
                  role="tab"
                  aria-controls="treatment-dates-tab"
                  aria-selected="false"
                  onClick={() => setActiveTab("treatment-dates-tab")}
                >
                  Treatment Dates
                </a>
                <a
                  className="nav-item nav-link Pad8 tab-item edit-case-tabs"
                  id="provider-charges-link"
                  data-toggle="tab"
                  href="#provider-charges-tab"
                  role="tab"
                  aria-controls="provider-charges-tab"
                  aria-selected="false"
                  onClick={() => setActiveTab("provider-charges")}
                >
                  Provider Charges
                </a>
              </div>
            </nav>

            <div className="tab-content mt-2" id="nav-tabContent">
              <Provider
                handleClose={handleClose}
                location={location}
                setLocation={setLocation}
                caseProvider={caseProvider}
                setcaseProvidersList={setcaseProvidersList}
                specialitie={specialitie}
                setSpecialitiesList={setSpecialitiesList}
                ref={providerRef}
              />
              <TreatmentLocation
                handleClose={handleClose}
                location={location}
                contact={contact}
                caseProvider={caseProvider}
                specialitie={specialitie}
                setContact={setContact}
                ref={treatmentLocationRef}
              />
              {/* <RequestBilling
                handleClose={handleClose}
                location={location}
                caseProvider={caseProvider}
                isRequestBillingVerified={isRequestBillingVerified}
                setIsRequestBillingVerified={setIsRequestBillingVerified}
                isReceivedBillingVerified={isReceivedBillingVerified}
                setIsReceivedBillingVerified={setIsReceivedBillingVerified}
                treatmentBill={treatmentBill}
                setTreatmentBill={setTreatmentBill}
                paidBill={paidBill}
                setPaidBill={setPaidBill}
                isBillingCostVerified={isBillingCostVerified}
                setIsBillingCostVerified={setIsBillingCostVerified}
                isBillingPaidVerified={isBillingPaidVerified}
                setIsBillingPaidVerified={setIsBillingPaidVerified}
                onUpdate={onUpdate}
                updateCall={updateCall}
                ref={requestBillingRef}
              /> */}
              <RequestRecords
                handleClose={handleClose}
                location={location}
                caseProvider={caseProvider}
                isRequestRecordVerified={isRequestRecordVerified}
                setIsRequestRecordVerified={setIsRequestRecordVerified}
                isRequestRecivedVerified={isRequestRecivedVerified}
                setIsRequestRecivedVerified={setIsRequestRecivedVerified}
                isRecordCostVerified={isRecordCostVerified}
                setIsRecordCostVerified={setIsRecordCostVerified}
                isRecordPaidVerified={isRecordPaidVerified}
                setIsRecordPaidVerified={setIsRecordPaidVerified}
                treatmentRecord={treatmentRecord}
                setTreatmentRecord={setTreatmentRecord}
                paidRecords={paidRecords}
                setPaidRecords={setPaidRecords}
                onUpdate={onUpdate}
                updateCall={updateCall}
                ref={requestRecordRef}
              />
              <LineHolder
                handleClose={handleClose}
                location={location}
                caseProvider={caseProvider}
                lienHolder={lienHolder}
                setLienHolder={setLienHolder}
                isLineHolderBalanceVerified={isLineHolderBalanceVerified}
                isLineHolderBalanceConfirmedVerified={
                  isLineHolderBalanceConfirmedVerified
                }
                // setIsLineHolderBalanceVerified={setIsLineHolderBalanceVerified}
                // setIsLineHolderBalanceConfirmedVerified={
                //   setIsLineHolderBalanceConfirmedVerified
                // }
                onUpdate={onUpdate}
                updateCall={updateCall}
              />
              <TreatmentDate
                handleClose={handleClose}
                caseProvider={caseProvider}
                specialitie={specialitie}
                isTreatmentDateFirstVerified={isTreatmentDateFirstVerified}
                // setIsTreatmentDateFirstVerified={
                //   setIsTreatmentDateFirstVerified
                // }
                isTreatmentDateLastVerified={isTreatmentDateLastVerified}
                // setIsTreatmentDateLastVerified={setIsTreatmentDateLastVerified}
                isTreatmentDateVisitVerified={isTreatmentDateVisitVerified}
                // setIsTreatmentDateVisitVerified={
                //   setIsTreatmentDateVisitVerified
                // }
                allTreatmentDates={allTreatmentDates}
                setAllTreatmentDates={setAllTreatmentDates}
                isTreatmentCompleteVerified={isTreatmentCompleteVerified}
                // setIsTreatmentCompleteVerified={setIsTreatmentCompleteVerified}
                contact={contact}
                onUpdate={onUpdate}
                updateCall={updateCall}
                ref={treatmentDatesRef}
              />
              <ProviderCharges
                handleClose={handleClose}
                caseProviderId={caseProvider?.id}
                ref={providerChargesRef}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          onClick={handleClose}
          className="btn btn-secondary"
          data-dismiss="modal"
        >
          Cancel
        </button>
        <button type="button" onClick={handleSave} className="btn btn-success">
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditCaseProviderModal;
