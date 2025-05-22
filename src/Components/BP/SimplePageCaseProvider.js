import React, { useState, useEffect } from "react";
import Vists from "./Vists";
import SimplePageLocation from "./SimplePageLocation";
import AddTreatmentDateModal from "./modals/AddTreatmentDateModal";
import EditCaseProviderModal from "./modals/EditCaseProviderModal";
import VisitsModal from "./modals/VisitsModal";
import axios from "axios";
import styled from "styled-components";
import DocumentRow from "./../DocumentRow/DocumentRow";

// Helper function to lighten colors
function mixColorWithWhite(hex, percentage) {
  const whitePercentage = (100 - percentage) / 100;

  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Mix each channel with white
  r = Math.floor(r + (255 - r) * whitePercentage);
  g = Math.floor(g + (255 - g) * whitePercentage);
  b = Math.floor(b + (255 - b) * whitePercentage);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const SpecialityContainer = styled.div`
  border-box: box-sizing;
  margin-bottom: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const TopHeader1 = styled.div`
  background-color: ${({ speciality }) =>
    mixColorWithWhite(speciality.color, 10)};
`;

const LightBgParagraph = styled.p`
  background-color: ${({ speciality }) =>
    mixColorWithWhite(speciality.color, 10)} !important;
`;

const TopHeader = styled.div`
  background: ${({ speciality }) => {
    const lightColor1 = mixColorWithWhite(speciality.color, 10);
    const lightColor2 = mixColorWithWhite(speciality.color, 20);
    const lightColor3 = mixColorWithWhite(speciality.color, 30);
    const lightColor4 = mixColorWithWhite(speciality.color, 40);
    const lightColor5 = mixColorWithWhite(speciality.color, 50);
    const lightColor6 = mixColorWithWhite(speciality.color, 57);
    const lightColor7 = mixColorWithWhite(speciality.color, 62);
    const lightColor8 = mixColorWithWhite(speciality.color, 70);
    return `
      linear-gradient(to right, 
        ${lightColor1} 0%, 
        ${lightColor1} 5px, 
        ${lightColor2} 5px, 
        ${lightColor2} 10px, 
        ${lightColor3} 10px, 
        ${lightColor3} 15px,
        ${lightColor4} 15px,
        ${lightColor4} 20px, 
        ${lightColor5} 20px,
        ${lightColor5} 25px,
        ${lightColor6} 25px,
        ${lightColor6} 30px,
        ${lightColor7} 30px,
        ${lightColor7} 35px,
        ${lightColor1} 40px,
        ${lightColor1} 100% 
      ),
      ${lightColor1};
    `;
  }};
  transform: skewX(-10deg);
  transform-origin: top left;
  height: 100px;
  > * {
    transform: skewX(10deg);
  }
>>>>>>> origin/master
`;

const TopHead = styled.div`
    background-color: ${({ speciality }) => speciality.color};
    
    &::before, &::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        z-index: 0;
        height: 25px;
        background-color: ${({ speciality }) => speciality.color};
    }

    &::before {
        width: 14px;
        left: -13px;
        transform-origin: bottom left;
        transform: skew(-11.31deg);
    }

    &::after {
        width: 14px;
        right: -11px;  // Positioning on the opposite side
        transform-origin: bottom right;
        transform: skew(11.31deg);  // Mirror skew effect
    }

    @media screen and (min-width: 1400px) {
      &::before {
          left: -8px;
      }

      @media (min-width: 1500px) and (max-width: 1800px) {
        &::before {
            left: -7px;
        }
    }

    @media screen and (min-width: 1801px) {
        &::before {
            left: -8px;
        }
    }
    @media screen and (min-width: 2000px) {
        &::before {
            left: -8px;
        }
    }
`;

const CheckListSection = styled.div`
  background-color: ${({ speciality }) => speciality.color} !important;

  &::after {
    border-top-color: ${({ speciality }) => speciality.color} !important;
  }
`;

const StyledSpan = styled.span`
  background-color: ${({ speciality }) => speciality.color} !important;
`;

const TreatmentButton = styled.a`
  background-color: ${({ speciality }) => speciality.color} !important;
  color: #fff !important;
`;

function SimplePageCaseProvider({
  caseProvider,
  setcaseProvidersList,
  specialitie,
  setSpecialitiesList,
  onUpdate,
}) {
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [caseProviderShow, setCaseProviderShow] = useState(false);

  const handleCaseProviderClose = () => setCaseProviderShow(false);
  const handleCaseProviderShow = () => setCaseProviderShow(true);

  const [updateCall, setUpdateCall] = useState(false);

  const handleUpdateCall = () => {
    console.log("re render");
    setUpdateCall((prev) => !prev);
  };

  const [location, setLocation] = useState([]);
  if (caseProvider.location) {
    useEffect(() => {
      async function fetchLocation() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/location/" +
            caseProvider.location +
            "/"
        );
        setLocation(data);
      }

      fetchLocation();
    }, []);
  }

  const [contact, setContact] = useState([]);
  if (caseProvider.treatment_location) {
    useEffect(() => {
      async function fetchContactList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider.treatment_location +
            "/"
        );
        setContact(data);
      }
      fetchContactList();
    }, []);
  }

  const [isRequestBillingVerified, setIsRequestBillingVerified] = useState([]);
  useEffect(() => {
    async function fetchRequestBillingVerification() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-billing_ordered/"
      );
      setIsRequestBillingVerified(data);
    }

    fetchRequestBillingVerification();
  }, [updateCall]);

  const [isReceivedBillingVerified, setIsReceivedBillingVerified] = useState(
    []
  );
  useEffect(() => {
    async function fetchIsReceivedBillingVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-billing_received/"
      );
      setIsReceivedBillingVerified(data);
    }

    fetchIsReceivedBillingVerified();
  }, [updateCall]);

  const [treatmentBill, setTreatmentBill] = useState([]);
  if (caseProvider.billing_request) {
    useEffect(() => {
      async function fetchTreatmentBillList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider.billing_request +
            "/"
        );
        setTreatmentBill(data);
      }
      fetchTreatmentBillList();
    }, []);
  }

  const [paidBill, setPaidBill] = useState([]);
  if (caseProvider.billing_request_paid) {
    useEffect(() => {
      async function fetchPaidBillList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider.billing_request_paid +
            "/"
        );
        setPaidBill(data);
      }
      fetchPaidBillList();
    }, []);
  }

  const [isBillingCostVerified, setIsBillingCostVerified] = useState([]);
  useEffect(() => {
    async function fetchIsBillingCostVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-billsCost/"
      );
      setIsBillingCostVerified(data);
    }

    fetchIsBillingCostVerified();
  }, [updateCall]);

  const [isBillingPaidVerified, setIsBillingPaidVerified] = useState([]);
  useEffect(() => {
    async function fetchIsBillingPaidVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-bills_request_paid/"
      );
      setIsBillingPaidVerified(data);
    }

    fetchIsBillingPaidVerified();
  }, [updateCall]);

  const [isRequestRecordVerified, setIsRequestRecordVerified] = useState([]);
  useEffect(() => {
    async function fetchIsRequestRecordVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-record_ordered/"
      );
      setIsRequestRecordVerified(data);
    }

    fetchIsRequestRecordVerified();
  }, [updateCall]);

  const [isRequestRecivedVerified, setIsRequestRecivedVerified] = useState([]);
  useEffect(() => {
    async function fetchIsRequestRecivedVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-record_received/"
      );
      setIsRequestRecivedVerified(data);
    }

    fetchIsRequestRecivedVerified();
  }, [updateCall]);

  const [isRecordCostVerified, setIsRecordCostVerified] = useState([]);
  useEffect(() => {
    async function fetchIsRecordCostVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-recordCost/"
      );
      setIsRecordCostVerified(data);
    }

    fetchIsRecordCostVerified();
  }, [updateCall]);

  const [isRecordPaidVerified, setIsRecordPaidVerified] = useState([]);
  useEffect(() => {
    async function fetchIsRecordPaidVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-rec_request_paid/"
      );
      setIsRecordPaidVerified(data);
    }

    fetchIsRecordPaidVerified();
  }, [updateCall]);

  const [treatmentRecord, setTreatmentRecord] = useState([]);

  if (caseProvider.records_request) {
    useEffect(() => {
      async function fetchTreatmentRecordList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider.records_request +
            "/"
        );

        setTreatmentRecord(data);
      }

      fetchTreatmentRecordList();
    }, []);
  }

  const [paidRecords, setPaidRecords] = useState([]);
  if (caseProvider.records_request_paid) {
    useEffect(() => {
      async function fetchPaidRecordsList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider.records_request_paid +
            "/"
        );
        setPaidRecords(data);
      }
      fetchPaidRecordsList();
    }, []);
  }

  const [isLineHolderBalanceVerified, setIsLineHolderBalanceVerified] =
    useState([]);
  useEffect(() => {
    async function fetchIsLineHolderBalanceVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-final/"
      );
      setIsLineHolderBalanceVerified(data);
    }

    fetchIsLineHolderBalanceVerified();
  }, [updateCall]);

  const [
    isLineHolderBalanceConfirmedVerified,
    setIsLineHolderBalanceConfirmedVerified,
  ] = useState([]);
  useEffect(() => {
    async function fetchIsLineHolderBalanceConfirmedVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-balance_confirmed/"
      );
      setIsLineHolderBalanceConfirmedVerified(data);
    }
    fetchIsLineHolderBalanceConfirmedVerified();
  }, [updateCall]);

  const [lienHolder, setLienHolder] = useState([]);
  if (caseProvider.lien_holder) {
    useEffect(() => {
      async function fetchLienHolderList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider.lien_holder +
            "/"
        );
        setLienHolder(data);
      }
      fetchLienHolderList();
    }, []);
  }

  const [isTreatmentDateFirstVerified, setIsTreatmentDateFirstVerified] =
    useState([]);
  useEffect(() => {
    async function fetchIsTreatmentDateFirstVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-first_date/"
      );
      setIsTreatmentDateFirstVerified(data);
    }

    fetchIsTreatmentDateFirstVerified();
  }, [updateCall]);

  const [isTreatmentDateLastVerified, setIsTreatmentDateLastVerified] =
    useState([]);
  useEffect(() => {
    async function fetchIsTreatmentDateLastVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-second_date/"
      );
      setIsTreatmentDateLastVerified(data);
    }

    fetchIsTreatmentDateLastVerified();
  }, [updateCall]);

  const [isTreatmentDateVisitVerified, setIsTreatmentDateVisitVerified] =
    useState([]);
  useEffect(() => {
    async function fetchIsTreatmentDateVisitVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-visits/"
      );
      setIsTreatmentDateVisitVerified(data);
    }

    fetchIsTreatmentDateVisitVerified();
  }, [updateCall]);

  const [allTreatmentDates, setAllTreatmentDates] = useState([]);
  useEffect(() => {
    async function fetchTfAllTreatmentDates() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/case-providers/all-treatment-dates/" +
          caseProvider.id +
          "/"
      );
      setAllTreatmentDates(data);
    }
    fetchTfAllTreatmentDates();
  }, []);

  const [isTreatmentCompleteVerified, setIsTreatmentCompleteVerified] =
    useState([]);
  useEffect(() => {
    async function fetchVerification() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider.id +
          "/CaseProviders-treatment_complete/"
      );
      setIsTreatmentCompleteVerified(data);
    }
    fetchVerification();
  }, [updateCall]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // visits
  const [showDatesModal, setShowDatesModal] = useState(false);
  const showDatesModalShow = () => setShowDatesModal(true);
  const showDatesModalClose = () => setShowDatesModal(false);
  const [dates, setdates] = useState([]);
  const [firstVisitDate, setFirstVisitDate] = useState("");
  const [lastVisitDate, setLastVisitDate] = useState("");
  useEffect(() => {
    async function fetchDates() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/case-providers/treatment-dates/" +
          caseProvider.id +
          "/"
      );
      setdates(data);
      if (data.length > 0) {
        setFirstVisitDate(formatDate(data[0].date));
      }
      if (data.length > 1) {
        setLastVisitDate(formatDate(data[1].date));
      }
    }

    fetchDates();
  }, [updateCall]);

  const formatDate = (dateString) => {
    if (dateString) {
      return dateString.split("T")[0];
    } else {
      return "";
    }
  };

  console.log("firstVisitDate :", firstVisitDate);

  return (
    <>
      <AddTreatmentDateModal
        show={show}
        handleClose={handleClose}
        caseProviderID={caseProvider.id}
        setAllTreatmentDates={setAllTreatmentDates}
      />

      {/* <EditCaseProviderModal
        show={caseProviderShow}
        handleClose={handleCaseProviderClose}
        caseProvider={caseProvider}
        setcaseProvidersList={setcaseProvidersList}
        specialitie={specialitie}
        setSpecialitiesList={setSpecialitiesList}
        location={location}
        setLocation={setLocation}
        contact={contact}
        setContact={setContact}
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
        isLineHolderBalanceVerified={isLineHolderBalanceVerified}
        setIsLineHolderBalanceVerified={setIsLineHolderBalanceVerified}
        isLineHolderBalanceConfirmedVerified={
          isLineHolderBalanceConfirmedVerified
        }
        setIsLineHolderBalanceConfirmedVerified={
          setIsLineHolderBalanceConfirmedVerified
        }
        lienHolder={lienHolder}
        setLienHolder={setLienHolder}
        isTreatmentDateFirstVerified={isTreatmentDateFirstVerified}
        setIsTreatmentDateFirstVerified={setIsTreatmentDateFirstVerified}
        isTreatmentDateLastVerified={isTreatmentDateLastVerified}
        setIsTreatmentDateLastVerified={setIsTreatmentDateLastVerified}
        isTreatmentDateVisitVerified={isTreatmentDateVisitVerified}
        setIsTreatmentDateVisitVerified={setIsTreatmentDateVisitVerified}
        allTreatmentDates={allTreatmentDates}
        setAllTreatmentDates={setAllTreatmentDates}
        isTreatmentCompleteVerified={isTreatmentCompleteVerified}
        setIsTreatmentCompleteVerified={setIsTreatmentCompleteVerified}
        onUpdate={onUpdate}
        updateCall={handleUpdateCall}
      /> */}

      <VisitsModal
        show={showDatesModal}
        handleClose={showDatesModalClose}
        caseProvider={caseProvider}
        isTreatmentDateFirstVerified={isTreatmentDateFirstVerified}
        setIsTreatmentDateFirstVerified={setIsTreatmentDateFirstVerified}
        isTreatmentDateLastVerified={isTreatmentDateLastVerified}
        setIsTreatmentDateLastVerified={setIsTreatmentDateLastVerified}
        isTreatmentDateVisitVerified={isTreatmentDateVisitVerified}
        setIsTreatmentDateVisitVerified={setIsTreatmentDateVisitVerified}
        dates={dates}
        setdates={setdates}
        caseProviderID={caseProvider.id}
        visits={caseProvider.visits}
        first_visit_date={firstVisitDate}
        last_visit_date={lastVisitDate}
        caseId={caseProvider.for_case}
        onUpdate={onUpdate}
        updateCall={handleUpdateCall}
      />

      <div
        className="border-box has-checklist mr-15 has-speciality-color-${specialitie.id} 
    specialty-panel-${specialitie.id} "
        style={{ marginBottom: "20px" }}
        class_name="92_"
      >
        <div className="expandable-section">
          <div className="has-title-bg" style={{ overflow: "hidden" }}>
            <div className="top-header-wrap">
              <TopHeader
                speciality={specialitie}
                className="top-header top-header-checklist d-md-flex bg-speciality-10 height-25 panel-header p-l-0 top-header-specialty-bg-2 top-header-specialty has-speciality-color-2 pl-35_5px c-pl-35_5px pl-0"
              >
                <TopHead
                  speciality={specialitie}
                  className="top-head-specialty-cw top-head col-md-3 col-xxl-3 p-0 d-flex align-items-center m-l-10 top-head-specialty-bg-2 top-head-specialty overflow-y-clip has-solid-title"
                >
                  <h2
                    className="d-flex align-items-center w-565 w-100 p-0 d-flex flex-wrap text-capitalize text-white"
                    id="d-column"
                  >
                    <div className="col p-0">
                      <small className="font-weight-bold align-cont-1 text-uppercase">
                        {specialitie.name}
                      </small>
                    </div>
                  </h2>
                </TopHead>
                <div
                  id="treatmentDates92 new-padding"
                  className="col-lg-6 d-flex align-items-center justify-content-lg-center 
                  line-height-normal change-alignment bg-speciality-10 c-pl-date-panel"
                >
                  <Vists
                    caseProvider_id={caseProvider.id}
                    visits={caseProvider.visits}
                    dates={dates}
                    setdates={setdates}
                    handleShow={showDatesModalShow}
                    isTreatmentDateFirstVerified={isTreatmentDateFirstVerified}
                    setIsTreatmentDateFirstVerified={
                      setIsTreatmentDateFirstVerified
                    }
                    isTreatmentDateLastVerified={isTreatmentDateLastVerified}
                    setIsTreatmentDateLastVerified={
                      setIsTreatmentDateLastVerified
                    }
                    isTreatmentDateVisitVerified={isTreatmentDateVisitVerified}
                    setIsTreatmentDateVisitVerified={
                      setIsTreatmentDateVisitVerified
                    }
                  />
                </div>
                <div className="col height-39 display-none bg-speciality-10">
                  &nbsp;
                </div>

                <div className="checklist-section-wrapper">
                  <CheckListSection
                    speciality={specialitie}
                    className="checklist-section-new padding-0 p-r-5 title-checklist-c"
                  >
                    <div className="skew-box-c"></div>
                    <div className="dropdown w-100">
                      <button
                        className="dropdown-toggle text-darker d-flex align-items-center justify-content-space-between w-100 c-padding-check"
                        id="myDropdown92"
                        type="button"
                        data-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <div className="nt-box title-bar-checklist c-minus-margin d-flex">
                          <div
                            className="circlechart m-r-8"
                            data-percentage={24}
                            id="circlechart92"
                          >
                            <svg
                              className="circle-chart"
                              viewBox="0 0 33.83098862 33.83098862"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                className="circle-chart__background"
                                cx="16.9"
                                cy="16.9"
                                r="15.9"
                              />
                              <circle
                                className="circle-chart__circle stroke-vivid-cerulean"
                                strokeDasharray="24,100"
                                cx="16.9"
                                cy="16.9"
                                r="15.9"
                              />
                              <g className="circle-chart__info">
                                {" "}
                                <text
                                  className="circle-chart__percent"
                                  x="17.9"
                                  y="12.5"
                                >
                                  24%
                                </text>
                                <text
                                  className="circle-chart__subline"
                                  x="16.91549431"
                                  y={22}
                                >
                                  {" "}
                                  100% 100%
                                </text>{" "}
                              </g>
                            </svg>
                          </div>
                          <span className="ic has-no-after ic-check text-success d-sm-none d-md-none d-lg-flex d-xl-flex align-items-center justify-content-center">
                            <svg
                              width="17"
                              height="50"
                              viewBox="0 0 17 50"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </div>
                        <span className="d-flex align-items-center pr-2">
                          <span className="checklist-text has-column text-white c-margin-r-check">
                            Provider Checklist
                          </span>
                          <span className="ic has-no-after ic-arrow text-white d-sm-none d-md-none d-lg-flex d-xl-flex align-items-center justify-content-center">
                            <svg
                              width="17"
                              height="50"
                              viewBox="0 0 17 50"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                                fill="currentColor"
                              />
                              <path
                                d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </span>
                      </button>
                      <div
                        aria-labelledby="myDropdown92"
                        className="dropdown-menu dropdown-menu-right dropdown-content"
                        id="myChecklistDropdown92"
                      ></div>
                    </div>
                  </CheckListSection>
                </div>
              </TopHeader>
            </div>
            <div className="row m-b-5 margin-l-0 mr-0 ">
              <SimplePageLocation
                caseProvider={caseProvider}
                specialitie={specialitie}
                contact={contact}
                handleShow={handleCaseProviderShow}
              />
              <div className="col pl-0 pr-0 m-l-5">
                <div className="fake-rows top-0">
                  <div className="fake-row c-fake-row-height"></div>
                  <div className="fake-row c-fake-row-height"></div>
                  <div className="fake-row c-fake-row-height"></div>
                </div>
              </div>
            </div>

            {/* <div className="row documents-wrapper m-b-5">
              <div className="col-12">
                <div className="height-25">
                  <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center m-r-15 client-contact-title">
                    {contact ? contact.name : ""}&nbsp;Document Row
                  </h4>
                </div>
                <DocumentRow clientProvider={caseProvider} page="Treatment" />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default SimplePageCaseProvider;
