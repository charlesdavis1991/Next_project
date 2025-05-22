import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Vists from "../Components/BP/Vists";
import axios from "axios";
import SimplePageLocation from "../Components/BP/SimplePageLocation";
// import VisitsModal from "../Components/BP/modals/VisitsModal";
import TreatmentNotesSection from "../Components/TreatmentPage/NotesTreatmentSection";
import { useGetVerificationInfo } from "../Components/TreatmentPage/hooks/useGetVerificationInfo";
import CheckListComponent from "../Components/TreatmentPage/components/ChecklistSection";
import mixColorWithWhite from "../Components/TreatmentPage/utils/helperFn";
import VisitsModal from "../Components/TreatmentPage/modals/visits-modal/visits-modal";
import NewEditCaseProviderModal from "../Components/BP/modals/NewEditCaseProviderModal";
import { useGetProviderInfo } from "../Components/TreatmentPage/hooks/useGetProviderInfo";
import GenrateDocument from "../Components/GenrateDocument/GenrateDocument";
import ClientProvidersStyles from "../Components/CaseDashboard/ClientProvidersStyles";
import { currencyFormat, formatDate } from "../Utils/helper";
import checkUpload from "../../public/BP_resources/images/icon/check upload.svg";
import checkSent from "../../public/BP_resources/images/icon/CHECK SENT.svg";
import checkCleared from "../../public/BP_resources/images/icon/CHECK CLEARED.svg";
import grayDoc from "../../public/BP_resources/images/icon/documents-icon-gray.svg";
import colorDoc from "../../public/BP_resources/images/icon/documents-icon-color.svg";
import EditMedicalBill from "../Components/TreatmentPage/modals/edit-medical-bill/editMedicalBill";
import unlocked from "../../public/BP_resources/images/icon/unlocked.svg";
import TFIcon from "../Components/TreatmentPage/icon/TFIcon.svg";
import locked from "../../public/BP_resources/images/icon/locked.svg";
import TFIcon2 from "../Components/TreatmentPage/icon/treatment-first-icon-2.png";
import InviteTreatmentModal from "../Components/TreatmentPage/modals/invite-treatment-modal/invite-treatment-modal";
import {
  formatOriginalLocalTime,
  getTimeUntilReinvite,
} from "./TreatmentPageDetailPage";

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  color: white;
  font-weight: 700;
  font-size: 16px;
  background-color: ${({ speciality }) => speciality.color};
  height: 25px;
  width: 485px;
  position: relative;

  // Add trapezium shapes to the left and right
  &::before {
    content: "";
    position: absolute;
    top: 0;
    height: 0;
    width: 0;
    border-bottom: 0px solid ${({ speciality }) => speciality.color};
  }
  &::after {
    content: "";
    position: absolute;
    top: 0;
    height: 0;
    width: 0;
    border-bottom: 25px solid ${({ speciality }) => speciality.color};
  }
  &::before {
    left: -5px;
    border-left: 5px solid transparent;
  }
  &::after {
    right: -5px;
    border-right: 5px solid transparent;
  }
`;

const TreatmentPageSimplePage = ({
  specialitiesList,
  caseProvider,
  firmName,
  refetchAll,
  maxWidth,
}) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [dates, setdates] = useState([
    {
      date:
        caseProvider?.first_date !== "__/__/___"
          ? caseProvider?.first_date
          : "" ?? "",
    },
    {
      date:
        caseProvider?.second_date !== "__/__/___"
          ? caseProvider?.second_date
          : "" ?? "",
    },
  ]);
  const [visits, setVisits] = useState(caseProvider?.visits);
  // const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [contact, setContact] = useState([]);
  const {
    data: verificationInfo,
    refetch,
    params,
  } = useGetVerificationInfo(caseProvider?.id, "first_date,second_date,visits");
  const toggleModal = useCallback((setter, value) => () => setter(value), []);

  const showDatesModalClose = useCallback(
    toggleModal(setShowDatesModal, false),
    []
  );
  const showDatesModalShow = useCallback(
    toggleModal(setShowDatesModal, true),
    []
  );

  // useEffect(() => {
  //   async function fetchDates() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/case-providers/treatment-dates/" +
  //         caseProvider?.id +
  //         "/"
  //     );
  //     setdates(data);

  //   }

  //   fetchDates();
  // }, [caseProvider?.id]);

  // const [isTreatmentDateFirstVerified, setIsTreatmentDateFirstVerified] =
  //   useState([]);
  // useEffect(() => {
  //   async function fetchIsTreatmentDateFirstVerified() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-first_date/"
  //     );
  //     setIsTreatmentDateFirstVerified(data);
  //   }

  //   fetchIsTreatmentDateFirstVerified();
  // }, [caseProvider?.id]);

  // const [isTreatmentDateLastVerified, setIsTreatmentDateLastVerified] =
  //   useState([]);
  // useEffect(() => {
  //   async function fetchIsTreatmentDateLastVerified() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-second_date/"
  //     );
  //     setIsTreatmentDateLastVerified(data);
  //   }

  //   fetchIsTreatmentDateLastVerified();
  // }, [caseProvider?.id]);

  // const [isTreatmentDateVisitVerified, setIsTreatmentDateVisitVerified] =
  //   useState([]);
  // useEffect(() => {
  //   async function fetchIsTreatmentDateVisitVerified() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-visits/"
  //     );
  //     setIsTreatmentDateVisitVerified(data);
  //   }

  //   fetchIsTreatmentDateVisitVerified();
  // }, [caseProvider?.id]);

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
  const [activeTab, setActiveTab] = useState("Treatment-Location");

  const [caseProviderShow, setCaseProviderShow] = useState(false);
  const handleCaseProviderClose = useCallback(
    toggleModal(setCaseProviderShow, false),
    []
  );
  const handleCaseProviderShow = (tabName) => {
    console.log(tabName);
    setCaseProviderShow(true);
    setActiveTab(tabName);
  };
  const { data } = useGetProviderInfo(caseProvider?.id);
  const [allTreatmentDates, setAllTreatmentDates] = useState([]);
  useEffect(() => {
    async function fetchTfAllTreatmentDates() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/case-providers/all-treatment-dates/" +
          caseProvider?.id +
          "/"
      );
      console.log(data);
      setAllTreatmentDates(data);
    }

    fetchTfAllTreatmentDates();
  }, [caseProvider?.id]);

  const [instanceIdForGenragteDoc, setInstanceIdForGenragteDoc] = useState();
  const [showGenerateDocument, setShowGenerateDocument] = useState(false);
  const [dropdownName, setDropdownName] = useState("");

  const handleGenrateDocument = (instanceId, name) => {
    console.log("FUNCTION IS CALLED");
    console.log("HGD instance id == :: ", instanceId);
    console.log(name);
    setInstanceIdForGenragteDoc(instanceId);
    setDropdownName(name);
    setShowGenerateDocument(true);
  };

  const [tfData, setTFData] = useState({
    original: 0,
    hi_paid: 0,
    hi_reduction: 0,
    mp_paid: 0,
    reduction: 0,
    patient_payment_value: 0,
    liens: 0,
  });
  const [showMedicallBill, setShowMedicalBill] = useState(false);
  const [medBillData, setMedBillData] = useState(null);

  const handleMedBillClose = () => {
    setShowMedicalBill(false);
    // refetchAll();
  };

  const [inviteModalShow, setInviteModalShow] = useState(false);

  const handleInviteModal = () => {
    setInviteModalShow(true);
  };

  const handleMedBillShow = (type, providerData) => {
    console.log(providerData);
    if (type === "caseProvider") {
      data?.tf_accounting?.map((item) => {
        setTFData({
          original: item?.original,
          hi_paid: item?.hi_paid,
          hi_reduction: item?.hi_reduction,
          mp_paid: item?.mp_paid,
          reduction: item?.reduction,
          patient_payment_value: item?.patient_payment_value,
          liens: item?.liens,
        });
      });
      setMedBillData(providerData);
      setShowMedicalBill(true);
    }
    if (type === "tf") {
      setMedBillData({
        id: data.id,
        amount: data.original,
        ins_paid: data.hi_paid,
        write_off: data.hi_reduction,
        medpaypaip: data.mp_paid,
        reduction: data.reduction,
        patient_paid: data.patient_payment_value,
      });
      setShowMedicalBill(true);
    }
    if (type === "number") {
      setMedBillData({
        amount: 0,
        ins_paid: 0,
        write_off: 0,
        medpaypaip: 0,
        reduction: 0,
        patient_paid: 0,
      });
      setShowMedicalBill(true);
    }
  };

  const PanelGenereateButtons = [
    {
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "p-l-6 p-r-5",
      style: { height: "25px" },
      onClick: (id, name) => handleGenrateDocument(id, name),
    },
  ];

  return (
    <div className={`has-speciality-color-${specialitiesList?.id}`}>
      <ClientProvidersStyles
        clientProviders={[
          {
            specialty: {
              ...specialitiesList,
            },
          },
        ]}
      />
      {caseProviderShow && (
        <NewEditCaseProviderModal
          show={caseProviderShow}
          firmName={firmName}
          handleClose={handleCaseProviderClose}
          caseProvider={caseProvider}
          specialitie={specialitiesList}
          contact={data?.contacts?.treatment_location}
          treatmentBill={data?.contacts?.billing_request}
          paidBill={data?.contacts?.billing_request_paid}
          treatmentRecord={data?.contacts?.records_request}
          paidRecords={data?.contacts?.records_request_paid}
          lienHolder={data?.contacts?.lien_holder}
          allTreatmentDates={allTreatmentDates}
          setAllTreatmentDates={setAllTreatmentDates}
          verification={verificationInfo?.verification_info}
          refetchAll={refetchAll}
          refetch={refetch}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      {showDatesModal && (
        <VisitsModal
          show={showDatesModal}
          handleClose={showDatesModalClose}
          verification={verificationInfo?.verification_info}
          dates={dates}
          setdates={setdates}
          caseProvider={caseProvider}
          visits={visits}
          setVisits={setVisits}
          refetch={refetch}
          params={params}
          specialitiesList={specialitiesList}
        />
      )}
      {/* <VisitsModal
        show={showDatesModal}
        handleClose={showDatesModalClose}
        // caseProvider={caseProvider}
        isTreatmentDateFirstVerified={isTreatmentDateFirstVerified}
        // setIsTreatmentDateFirstVerified={setIsTreatmentDateFirstVerified}
        isTreatmentDateLastVerified={isTreatmentDateLastVerified}
        // setIsTreatmentDateLastVerified={setIsTreatmentDateLastVerified}
        isTreatmentDateVisitVerified={isTreatmentDateVisitVerified}
        // setIsTreatmentDateVisitVerified={setIsTreatmentDateVisitVerified}
        dates={dates}
        setdates={setdates}
        caseProviderID={caseProvider?.id}
        visits={visits}
        setVisits={setVisits}
        // first_visit_date={firstVisitDate}
        // last_visit_date={lastVisitDate}
        caseId={caseProvider?.for_case}
        // onUpdate={onUpdate}
        // updateCall={handleUpdateCall}
      /> */}
      <div>
        <div
          style={{
            height: "25px",
            width: "100%",
            // marginLeft: "28px",
            // backgroundColor: mixColorWithWhite(specialitiesList?.color, 10),
            // marginBottom: "5px",
          }}
          className="d-flex bg-speciality-10"
        >
          {/* Name Section with Dynamic Background */}
          {/* <div
            className="bg-speciality"
            style={{
              // backgroundColor: specialitiesList?.color,
              height: "25px",
              width: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            {specialitiesList?.name[0]}
          </div> */}
          <NameContainer
            style={{
              paddingLeft: "10px",
              width: maxWidth,
            }}
            speciality={specialitiesList}
          >
            {specialitiesList?.name}
          </NameContainer>

          {/* Center Section */}
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            {/* <Vists
              caseProvider_id={caseProvider?.id}
              visits={visits}
              dates={dates}
              // setdates={setdates}
              handleShow={showDatesModalShow}
              isTreatmentDateFirstVerified={isTreatmentDateFirstVerified}
              // setIsTreatmentDateFirstVerified={setIsTreatmentDateFirstVerified}
              isTreatmentDateLastVerified={isTreatmentDateLastVerified}
              // setIsTreatmentDateLastVerified={setIsTreatmentDateLastVerified}
              isTreatmentDateVisitVerified={isTreatmentDateVisitVerified}
              // setIsTreatmentDateVisitVerified={setIsTreatmentDateVisitVerified}
            /> */}
            <Vists
              caseProvider_id={caseProvider?.id}
              visits={visits}
              dates={dates}
              handleShow={showDatesModalShow}
              verification={verificationInfo}
            />
          </div>

          {/* Right Section */}
          <div className="d-flex justify-content-end align-items-center ">
            <CheckListComponent
              speciality={specialitiesList}
              provider={caseProvider}
            />
          </div>
        </div>
        <div
          style={{
            //  marginLeft: "27px",
            marginBottom: "5px",
          }}
          className=" d-flex  "
        >
          <SimplePageLocation
            // caseProvider={caseProvider}
            specialitie={specialitiesList}
            onClick={() => handleCaseProviderShow("Treatment-Location")}
            contact={data?.contacts?.treatment_location}
            generateDocButtonClick={() =>
              handleGenrateDocument(
                data?.contacts?.treatment_location?.id,
                "Medical Provider Location"
              )
            }
            // handleShow={handleCaseProviderShow}
          />
          <div
            className=""
            style={{
              flex: 1,
              maxHeight: "113px",
              paddingRight: "0px",
              scrollbarWidth: "none",
              marginLeft: "5px",
              marginRight: "0px",
            }}
          >
            <p
              className="columnsTitle text-center text-primary font-weight-semibold text-uppercase d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "var(--primary-15)", height: "25px" }}
            >
              Notes
            </p>

            <TreatmentNotesSection
              record_id={caseProvider?.id}
              instanceFor="Treatment"
              entity_type={specialitiesList?.name}
              caseProvider={{
                name: caseProvider?.providerprofile_office_name,
              }}
            />
          </div>
        </div>
        <div
          className="TreatmentPageGrayPanel m-b-5 mr-0"
          style={{ background: "transparent" }}
        >
          <div
            className="d-flex-1 position-relative bilings-table no-rl-padding"
            style={{ width: "100%" }}
          >
            <div className="table--no-card rounded-0 border-0 w-100">
              <table
                className="table table-borderless   has-height-25"
                data-toggle="modal"
                data-target="#medical-provider-charges"
                id="tf_provider_table"
              >
                <thead>
                  <tr className="height-25">
                    <th
                      id="lockedTreatmentPagesPadding"
                      style={{
                        textTransform: "uppercase",
                        background: "var(--primary-15)",
                        // width: "1%",
                        minWidth: "360px",
                      }}
                      className="text-center td-autosize provider-col btn-primary-lighter-default color-primary c-font-weight-600"
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      Provider Billing
                    </th>

                    <th
                      id="lockedTreatmentPagesPadding"
                      style={{
                        background: "var(--primary-15)",
                        // width: maxColumnWidth,
                        minWidth: "128px",
                        width: "128px",
                      }}
                      className="text-end  med-bill-width btn-primary-lighter-default color-primary c-font-weight-600"
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      Original
                    </th>
                    <th
                      id="lockedTreatmentPagesPadding"
                      style={{
                        background: "var(--primary-15)",
                        // width: maxColumnWidth,
                        minWidth: "128px",
                        width: "128px",
                      }}
                      className="text-end med-bill-width hide-table-data btn-primary-lighter-default color-primary c-font-weight-600"
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      HI Paid
                    </th>
                    <th
                      id="lockedTreatmentPagesPadding"
                      style={{
                        background: "var(--primary-15)",
                        // width: maxColumnWidth,
                        minWidth: "128px",
                        width: "128px",
                      }}
                      className="text-end med-bill-width hide-table-data btn-primary-lighter-default color-primary c-font-weight-600"
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      HI Reduc
                    </th>
                    <th
                      id="lockedTreatmentPagesPadding"
                      style={{
                        background: "var(--primary-15)",
                        // width: maxColumnWidth,
                        minWidth: "128px",
                        width: "128px",
                      }}
                      className="text-end med-bill-width hide-table-data btn-primary-lighter-default color-primary c-font-weight-600"
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      MP / PIP
                    </th>
                    <th
                      id="lockedTreatmentPagesPadding"
                      style={{
                        background: "var(--primary-15)",
                        // width: maxColumnWidth,
                        minWidth: "128px",
                        width: "128px",
                      }}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                      className="text-end med-bill-width hide-table-data btn-primary-lighter-default color-primary c-font-weight-600"
                    >
                      Reduction
                    </th>
                    <th
                      id="lockedTreatmentPagesPadding"
                      style={{
                        background: "var(--primary-15)",
                        // width: maxColumnWidth,
                        minWidth: "128px",
                        width: "128px",
                      }}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                      className="text-end btn-primary-lighter-default color-primary c-font-weight-600 med-bill-width show-table-data"
                    >
                      Debits
                    </th>
                    <th
                      id="lockedTreatmentPagesPadding"
                      style={{
                        background: "var(--primary-15)",
                        // width: maxColumnWidth,
                        minWidth: "128px",
                        width: "128px",
                      }}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                      className="text-end med-bill-width hide-table-data btn-primary-lighter-default color-primary c-font-weight-600"
                    >
                      Client Paid
                    </th>
                    <th
                      id="lockedTreatmentPagesPadding"
                      style={{
                        background: "var(--primary-15)",
                        // width: maxColumnWidth,
                        minWidth: "128px",
                        width: "128px",
                      }}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                      className="text-end dollar-amount-value med-bill-width btn-primary-lighter-default color-primary c-font-weight-600"
                    >
                      Lien
                    </th>
                    <th
                      id="lockedTreatmentPagesPadding"
                      className="big-n-4 "
                      style={{ background: "var(--primary-15)" }}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    ></th>
                    <th
                      id="lockedTreatmentPagesPadding"
                      className={`text-end med-bill-width c-font-weight-600`}
                      style={{
                        color: "var(--primary-25) !important",
                        background: "var(--primary-15)",
                        minWidth: "128px",
                        width: "128px",
                      }}
                    >
                      <span className="position-relative center-val-div">
                        Working
                      </span>
                    </th>
                    <th
                      id="lockedTreatmentPagesPadding"
                      className={`s-draft text-end c-font-weight-600 `}
                      style={{
                        color: "var(--primary-25) !important",
                        background: "var(--primary-15)",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center height-25">
                        <div className="d-flex align-items-center">
                          <img
                            className="invisible ic ic-19"
                            id="lock-image"
                            src={unlocked}
                            alt="lock-icon"
                            style={{ cursor: "pointer" }}
                          />
                          <img
                            id="lock-image"
                            className="ic ic-19"
                            src={unlocked}
                            alt="lock-icon"
                            style={{ cursor: "pointer" }}
                          />
                          <img
                            id="unlock-image"
                            className="ic ic-19"
                            alt="lock-icon"
                            src={locked}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        <span
                          className="position-relative center-val-div"
                          style={{ paddingRight: "2px" }}
                        >
                          Draft
                        </span>
                      </div>
                    </th>
                    <th
                      id="lockedTreatmentPagesPadding"
                      className="s-final text-end c-font-weight-600"
                      style={{
                        color: "var(--primary-25) !important",
                        background: "var(--primary-15)",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center height-25">
                        <div className="d-flex align-items-center">
                          <img
                            className="invisible ic ic-19"
                            id="lock-image"
                            src={unlocked}
                            alt="lock-icon"
                            style={{ cursor: "pointer" }}
                          />
                          <img
                            id="lock-image"
                            className="ic ic-19"
                            src={unlocked}
                            alt="lock-icon"
                            style={{ cursor: "pointer" }}
                          />
                          <img
                            id="unlock-image"
                            className="ic ic-19"
                            alt="lock-icon"
                            src={locked}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        <span style={{ paddingRight: "2px" }}>Final</span>
                      </div>
                    </th>
                    <th
                      id="lockedTreatmentPagesPadding"
                      className="s-verify c-font-weight-600"
                      style={{ background: "var(--primary-15)" }}
                    ></th>
                    {/* <th
                    className="td-autosize check-request-td text-center c-font-weight-600"
                    style={{
                      color: "var(--primary-25) !important",
                      background: "var(--primary-10)",
                    }}
                  >
                    Requested
                  </th> */}
                    <th
                      id="lockedTreatmentPagesPadding"
                      className="td-autosize text-center c-font-weight-600"
                      style={{
                        color: "var(--primary-25) !important",
                        background: "var(--primary-15)",
                        minWidth: "163px",
                      }}
                    >
                      Check #
                    </th>
                    {/* <th
                    className="s-cheque"
                    style={{
                      color: "var(--primary-25) !important",
                      background: "var(--primary-10)",
                    }}
                  ></th> */}
                    {/* <th
                    style={{
                      background: "var(--primary-15)",
                      width: maxColumnWidth,
                    }}
                    className="text-center btn-primary-lighter-default color-primary c-font-weight-600"
                  >
                    Final
                  </th> */}
                  </tr>
                </thead>
                <tbody
                  id="lockedHeightForInvitation"
                  style={{ backgroundColor: "var(--primary-2)" }}
                >
                  {data?.provider_account_state === "active" && (
                    <tr className="height-25">
                      <td
                        className="td-autosize provider-treatment-col"
                        style={{ textAlign: "start" }}
                        onClick={() =>
                          handleMedBillShow("caseProvider", caseProvider)
                        }
                      >
                        <img
                          src={TFIcon}
                          alt="tf-icon"
                          style={{ height: "25px", width: "25px" }}
                        />
                        <span style={{ marginLeft: "5px", color: "#3469AB" }}>
                          Billing and Deductions from TreatmentFirst.com
                        </span>
                      </td>
                      {data?.tf_accounting &&
                      data?.tf_accounting?.length > 0 ? (
                        data?.tf_accounting?.map((tf) => (
                          <>
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width"
                              data-value={tf?.original ?? "0.00"}
                              // onClick={() => handleMedBillShow("tf", tf)}
                              onClick={() =>
                                handleMedBillShow("caseProvider", caseProvider)
                              }
                            >
                              {currencyFormat(tf?.original ?? "0.00")}
                            </td>
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width hide-table-data"
                              data-value={tf?.hi_paid ?? "0.00"}
                              // onClick={() => handleMedBillShow("tf", tf)}
                              onClick={() =>
                                handleMedBillShow("caseProvider", caseProvider)
                              }
                            >
                              {currencyFormat(-Math.abs(tf?.hi_paid ?? "0.00"))}
                            </td>
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width hide-table-data"
                              data-value={tf?.hi_reduction ?? "0.00"}
                              // onClick={() => handleMedBillShow("tf", tf)}
                              onClick={() =>
                                handleMedBillShow("caseProvider", caseProvider)
                              }
                            >
                              {currencyFormat(
                                -Math.abs(tf?.hi_reduction ?? "0.00")
                              )}
                            </td>
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width hide-table-data"
                              data-value={tf?.mp_paid ?? "0.00"}
                              // onClick={() => handleMedBillShow("tf", tf)}
                              onClick={() =>
                                handleMedBillShow("caseProvider", caseProvider)
                              }
                            >
                              {currencyFormat(-Math.abs(tf?.mp_paid ?? "0.00"))}
                            </td>
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width hide-table-data"
                              data-value={tf?.reduction ?? "0.00"}
                              // onClick={() => handleMedBillShow("tf", tf)}
                              onClick={() =>
                                handleMedBillShow("caseProvider", caseProvider)
                              }
                            >
                              {currencyFormat(
                                -Math.abs(tf?.reduction ?? "0.00")
                              )}
                            </td>
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width show-table-data"
                              data-value={
                                parseFloat(tf?.hi_paid || 0) +
                                parseFloat(tf?.hi_reduction || 0) +
                                parseFloat(tf?.mp_paid || 0) +
                                parseFloat(tf?.reduction || 0) +
                                parseFloat(tf?.patient_payment_value || 0)
                              }
                              // onClick={() => handleMedBillShow("tf", tf)}
                              onClick={() =>
                                handleMedBillShow("caseProvider", caseProvider)
                              }
                            >
                              {currencyFormat(
                                -Math.abs(
                                  parseFloat(tf?.hi_paid || 0) +
                                    parseFloat(tf?.hi_reduction || 0) +
                                    parseFloat(tf?.mp_paid || 0) +
                                    parseFloat(tf?.reduction || 0) +
                                    parseFloat(tf?.patient_payment_value || 0)
                                )
                              )}
                            </td>
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width hide-table-data"
                              data-value={tf?.patient_payment_value ?? "0.00"}
                              // onClick={() => handleMedBillShow("tf", tf)}
                              onClick={() =>
                                handleMedBillShow("caseProvider", caseProvider)
                              }
                            >
                              {currencyFormat(
                                -Math.abs(tf?.patient_payment_value ?? "0.00")
                              )}
                            </td>
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width"
                              data-value={tf?.liens ?? "0.00"}
                              // onClick={() => handleMedBillShow("tf", tf)}
                              onClick={() =>
                                handleMedBillShow("caseProvider", caseProvider)
                              }
                            >
                              {currencyFormat(tf?.liens ?? "0.00")}
                            </td>
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="text-capitalize big-n-4"
                              onClick={() =>
                                handleMedBillShow("caseProvider", caseProvider)
                              }
                            ></td>

                            <td
                              id="lockedTreatmentPagesPadding"
                              className={`monospace-font  dollar-amount-value-tf-bills med-bill-width text-right`}
                            >
                              {/* <span className="position-relative center-val-div">
                      {currencyFormat(caseProvider.final_amount)}
                    </span> */}
                              <span
                                // style={{ marginLeft: "40px" }}
                                className="position-relative center-val-div"
                              >
                                {currencyFormat(tf?.final ?? "0.00")}
                              </span>{" "}
                            </td>
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="s-draft text-right"
                            ></td>
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="s-final"
                            ></td>
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="s-verify"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* <ChequeUpload
                      entity={medicalBill}
                      panel={"medical_bill"}
                      pageId={page_id_click_record}
                      documentType="verify"
                      updateStates={updateMedicalBillsState}
                      handleNoCheckShow={handleNoCheckShow}
                    /> */}
                            </td>
                            {/* <td
                          className="td-autosize check-request-td text-center"
                          onClick={(e) => e.stopPropagation()}
                        ></td> */}
                            <td
                              id="lockedTreatmentPagesPadding"
                              className="td-autosize text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {tf?.check_number}
                            </td>
                            {/* <td
                          className="s-cheque"
                          onClick={(e) => e.stopPropagation()}
                        >
                          
                        </td> */}
                          </>
                        ))
                      ) : (
                        <>
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width"
                            data-value={"0.00"}
                            // onClick={() => handleMedBillShow("number", 0)}
                            onClick={() =>
                              handleMedBillShow("caseProvider", caseProvider)
                            }
                          >
                            {currencyFormat("0.00")}
                          </td>
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width hide-table-data"
                            data-value={"0.00"}
                            // onClick={() => handleMedBillShow("number", 0)}
                            onClick={() =>
                              handleMedBillShow("caseProvider", caseProvider)
                            }
                          >
                            {currencyFormat(-Math.abs("0.00"))}
                          </td>
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width hide-table-data"
                            data-value={"0.00"}
                            // onClick={() => handleMedBillShow("number", 0)}
                            onClick={() =>
                              handleMedBillShow("caseProvider", caseProvider)
                            }
                          >
                            {currencyFormat(-Math.abs("0.00"))}
                          </td>
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width hide-table-data"
                            data-value={"0.00"}
                            // onClick={() => handleMedBillShow("number", 0)}
                            onClick={() =>
                              handleMedBillShow("caseProvider", caseProvider)
                            }
                          >
                            {currencyFormat(-Math.abs("0.00"))}
                          </td>
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width hide-table-data"
                            data-value={"0.00"}
                            // onClick={() => handleMedBillShow("number", 0)}
                            onClick={() =>
                              handleMedBillShow("caseProvider", caseProvider)
                            }
                          >
                            {currencyFormat(-Math.abs("0.00"))}
                          </td>
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width show-table-data"
                            data-value={
                              parseFloat(0) +
                              parseFloat(0) +
                              parseFloat(0) +
                              parseFloat(0) +
                              parseFloat(0)
                            }
                            // onClick={() => handleMedBillShow("number", 0)}
                            onClick={() =>
                              handleMedBillShow("caseProvider", caseProvider)
                            }
                          >
                            {currencyFormat(
                              -Math.abs(
                                parseFloat(0) +
                                  parseFloat(0) +
                                  parseFloat(0) +
                                  parseFloat(0) +
                                  parseFloat(0)
                              )
                            )}
                          </td>
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width hide-table-data"
                            data-value={"0.00"}
                            // onClick={() => handleMedBillShow("number", 0)}
                            onClick={() =>
                              handleMedBillShow("caseProvider", caseProvider)
                            }
                          >
                            {currencyFormat(-Math.abs("0.00"))}
                          </td>
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="text-end monospace-font dollar-amount-value-tf-bills med-bill-width"
                            data-value={"0.00"}
                            // onClick={() => handleMedBillShow("number", 0)}
                            onClick={() =>
                              handleMedBillShow("caseProvider", caseProvider)
                            }
                          >
                            {currencyFormat("0.00")}
                          </td>
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="text-capitalize big-n-4"
                            onClick={() =>
                              handleMedBillShow("caseProvider", caseProvider)
                            }
                          ></td>

                          <td
                            id="lockedTreatmentPagesPadding"
                            className={`monospace-font  dollar-amount-value-tf-bills med-bill-width text-right`}
                            data-value={"0.00"}
                          >
                            {/* <span className="position-relative center-val-div">
                  {currencyFormat(caseProvider.final_amount)}
                </span> */}

                            {currencyFormat("0.00")}
                          </td>
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="s-draft text-right"
                          ></td>
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="s-final"
                          ></td>
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="s-verify"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* <ChequeUpload
                  entity={medicalBill}
                  panel={"medical_bill"}
                  pageId={page_id_click_record}
                  documentType="verify"
                  updateStates={updateMedicalBillsState}
                  handleNoCheckShow={handleNoCheckShow}
                /> */}
                          </td>
                          {/* <td
                        className="td-autosize check-request-td text-center"
                        onClick={(e) => e.stopPropagation()}
                      ></td> */}
                          <td
                            id="lockedTreatmentPagesPadding"
                            className="td-autosize text-center"
                            onClick={(e) => e.stopPropagation()}
                          ></td>
                          {/* <td
                        className="s-cheque"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ChequeUpload
                  entity={medicalBill}
                  panel={"medical_bill"}
                  pageId={page_id_click_record}
                  documentType="check_as_sent"
                  updateStates={updateMedicalBillsState}
                  handleNoCheckShow={handleNoCheckShow}
                />
                      </td> */}
                        </>
                      )}
                    </tr>
                  )}

                  {data?.provider_account_state === "inactive" && (
                    <tr
                      className="height-35"
                      id="childlockedHeightForInvitation"
                    >
                      <td colSpan={15}>
                        <div
                          className="d-flex align-items-center justify-content-center height-25"
                          style={{ gap: "5px" }}
                        >
                          <span
                            style={{
                              color: "var(--primary-25)",
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          >{`Click to Invite Medical Provider to provider updates on your client's treatment through TreatmentFirst.com`}</span>
                          <a
                            href="#"
                            style={{
                              backgroundColor: "var(--primary-10)",
                              borderColor: "var(--primary)",
                              color: "var(--primary-25)",
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                            className={`btn btn-hover-contact-panel-row  height-25 rounded-0 d-flex align-items-center justify-content-center p-r-5 p-l-5 height-25 d-flex algin-items-center justify-content-center`}
                            onClick={() => handleInviteModal()}
                          >
                            <img
                              src={TFIcon2}
                              alt="tf-icon"
                              style={{ height: "25px", width: "25px" }}
                            />

                            {`Invite ${data?.contacts?.treatment_location?.name ?? ""} to Activate Their FREE TreatmentFirst.com Account`}
                          </a>
                        </div>
                      </td>
                    </tr>
                  )}
                  {data?.provider_account_state === "pending" && (
                    <tr
                      className="height-35"
                      id="childlockedHeightForInvitation"
                    >
                      <td colSpan={15}>
                        <div
                          className="d-flex align-items-center justify-content-center height-25"
                          style={{ gap: "5px" }}
                        >
                          <span
                            style={{
                              color: "var(--primary-25)",
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          >
                            {getTimeUntilReinvite(
                              data?.invite_sent_at,
                              data?.invite_timezone === ""
                                ? "America/Los_Angeles"
                                : data?.invite_timezone
                            )}
                            {/* {`Invite sent on ${formatOriginalLocalTime(data?.invite_sent_at, "America/New_York")}`} */}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                <tbody style={{ backgroundColor: "var(--primary-4)" }}>
                  <tr className="bg-speciality-3">
                    <td
                      style={{
                        backgroundColor: mixColorWithWhite(
                          specialitiesList?.color,
                          10
                        ),
                      }}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                      className="td-autosize text-end provider-treatment-col"
                    >
                      <div className="d-flex align-items-center justify-content-left align-items-center height-25">
                        <div
                          className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
                          style={{ backgroundColor: specialitiesList?.color }}
                        >
                          {specialitiesList?.name[0]}
                        </div>

                        <div
                          // speciality={specialitiesList}
                          className="d-flex p-l-5 p-r-5 align-items-center text-lg mb-0  height-25 align-self-center text-black"
                        >
                          {data?.contacts?.treatment_location?.name}
                        </div>
                      </div>
                    </td>
                    <td
                      id="lockedTreatmentPagesPadding"
                      className="text-end monospace-font dollar-amount-value med-bill-width"
                      data-value={caseProvider?.amount}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      {currencyFormat(caseProvider?.amount)}
                    </td>
                    <td
                      id="lockedTreatmentPagesPadding"
                      className="text-end monospace-font dollar-amount-value med-bill-width hide-table-data"
                      data-value={caseProvider.ins_paid}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      {currencyFormat(-Math.abs(caseProvider.ins_paid))}
                    </td>
                    <td
                      id="lockedTreatmentPagesPadding"
                      className="text-end monospace-font dollar-amount-value med-bill-width hide-table-data"
                      data-value={caseProvider.write_off}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      {currencyFormat(-Math.abs(caseProvider.write_off))}
                    </td>
                    <td
                      id="lockedTreatmentPagesPadding"
                      className="text-end monospace-font dollar-amount-value med-bill-width hide-table-data"
                      data-value={caseProvider.medpaypaip}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      {currencyFormat(-Math.abs(caseProvider.medpaypaip))}
                    </td>
                    <td
                      id="lockedTreatmentPagesPadding"
                      className="text-end monospace-font dollar-amount-value med-bill-width hide-table-data"
                      data-value={caseProvider.reduction}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      {currencyFormat(-Math.abs(caseProvider.reduction))}
                    </td>
                    <td
                      id="lockedTreatmentPagesPadding"
                      className="text-end monospace-font dollar-amount-value med-bill-width show-table-data"
                      data-value={
                        parseFloat(caseProvider.ins_paid || 0) +
                        parseFloat(caseProvider.write_off || 0) +
                        parseFloat(caseProvider.medpaypaip || 0) +
                        parseFloat(caseProvider.reduction || 0) +
                        parseFloat(caseProvider.patient_paid || 0)
                      }
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      {currencyFormat(
                        -Math.abs(
                          parseFloat(caseProvider.ins_paid || 0) +
                            parseFloat(caseProvider.write_off || 0) +
                            parseFloat(caseProvider.medpaypaip || 0) +
                            parseFloat(caseProvider.reduction || 0) +
                            parseFloat(caseProvider.patient_paid || 0)
                        )
                      )}
                    </td>
                    <td
                      id="lockedTreatmentPagesPadding"
                      className="text-end monospace-font dollar-amount-value med-bill-width hide-table-data"
                      data-value={caseProvider.patient_paid}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      {currencyFormat(-Math.abs(caseProvider.patient_paid))}
                    </td>
                    <td
                      id="lockedTreatmentPagesPadding"
                      className="text-end monospace-font dollar-amount-value med-bill-width"
                      data-value={caseProvider.liens}
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    >
                      {currencyFormat(caseProvider.liens)}
                    </td>
                    <td
                      id="lockedTreatmentPagesPadding"
                      className="text-capitalize big-n-4"
                      onClick={() =>
                        handleMedBillShow("caseProvider", caseProvider)
                      }
                    ></td>
                    <td
                      id="lockedTreatmentPagesPadding"
                      className={`monospace-font  dollar-amount-value med-bill-width text-right`}
                      data-value={caseProvider.final_amount}
                    >
                      <span className="position-relative center-val-div">
                        {currencyFormat(caseProvider.final_amount)}
                      </span>
                    </td>
                    <td
                      id="lockedTreatmentPagesPadding"
                      className="s-draft text-right"
                    >
                      <div
                        className={`monospace-font d-flex justify-content-between align-items-center height-25 position-relative center-val-div`}
                      >
                        <img
                          id="lock-image"
                          className="ic ic-19"
                          src={unlocked}
                          alt="lock-icon"
                          style={{ cursor: "pointer" }}
                        />
                        <input
                          id="lock-input"
                          className={` monospace-font bill-draft-${caseProvider.id} text-right bill-draft dollar-amount-value unlock-input ${["0", "0.00"].includes(caseProvider.draft1.toString()) ? "zero-placeholder" : "black-placeholder"}`}
                          type={"text"}
                          data-value={caseProvider.draft1}
                          placeholder={
                            caseProvider.draft1
                              ? currencyFormat(caseProvider.draft1)
                              : "$ 0.00"
                          }
                        />
                      </div>
                    </td>
                    <td id="lockedTreatmentPagesPadding" className="s-final">
                      <div className="monospace-font d-flex justify-content-between align-items-center height-25">
                        <img
                          id="lock-image"
                          className="ic ic-19"
                          src={locked}
                          alt="lock-icon"
                          style={{ cursor: "pointer" }}
                        />
                        <input
                          id="lock-input"
                          className={`monospace-font bill-final-${caseProvider.id} text-right bill-final locked-input dollar-amount-value ${["0", "0.00"].includes(caseProvider.final.toString()) ? "zero-placeholder" : "black-placeholder"}`}
                          type="text"
                          data-value={caseProvider.final}
                          placeholder={
                            caseProvider.final
                              ? currencyFormat(caseProvider.final)
                              : "$ 0.00"
                          }
                        />
                      </div>
                    </td>
                    <td
                      id="lockedTreatmentPagesPadding"
                      className="s-verify"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* <ChequeUpload
                      entity={medicalBill}
                      panel={"medical_bill"}
                      pageId={page_id_click_record}
                      documentType="verify"
                      updateStates={updateMedicalBillsState}
                      handleNoCheckShow={handleNoCheckShow}
                    /> */}
                      <img src={grayDoc} />
                    </td>
                    {/* <td
                    className="td-autosize check-request-td text-center"
                    onClick={(e) => e.stopPropagation()}
                  ></td> */}
                    <td
                      id="lockedTreatmentPagesPadding"
                      className="td-autosize text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span>
                          {caseProvider.checkID?.cheque_date
                            ? ""
                            : caseProvider.checkID?.date_check_requested &&
                              "Check Requested: "}
                          {formatDate(
                            caseProvider.checkID?.cheque_date ||
                              caseProvider.checkID?.date_check_requested ||
                              ""
                          )}
                        </span>
                        <span>{caseProvider?.check_number}</span>
                        <img
                          style={{
                            width: "35px",
                          }}
                          src={checkUpload}
                        />
                      </div>
                    </td>
                    {/* <td className="s-cheque" onClick={(e) => e.stopPropagation()}>
                    <ChequeUpload
                      entity={medicalBill}
                      panel={"medical_bill"}
                      pageId={page_id_click_record}
                      documentType="check_as_sent"
                      updateStates={updateMedicalBillsState}
                      handleNoCheckShow={handleNoCheckShow}
                    />
                   
                  </td> */}
                    {/* <td></td>
                  {data?.tf_accounting && data?.tf_accounting?.length > 0 ? (
                    data?.tf_accounting.map((tf) => (
                      <PaymentTable tfAccounting={tf} type={"tf"} />
                    ))
                  ) : (
                    <PaymentTable tfAccounting={caseProvider} type="cp" />
                  )} */}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showMedicallBill && (
        <EditMedicalBill
          show={showMedicallBill}
          handleClose={handleMedBillClose}
          medicalBill={medBillData}
          refetchAll={refetchAll}
          specialitie={specialitiesList}
          tfData={tfData}
          // setData={setMedBillData}
          // updateMedicalStates={updateMedicalBillsState}
        />
      )}

      {inviteModalShow && (
        <InviteTreatmentModal
          show={inviteModalShow}
          handleClose={() => setInviteModalShow(false)}
          refetchAll={refetchAll}
          specialitie={specialitiesList}
          caseProvider={caseProvider}
          data={data}
          PanelGenereateButtons={PanelGenereateButtons}
        />
      )}

      {showGenerateDocument && (
        <GenrateDocument
          show={true}
          handleClose={() => setShowGenerateDocument(false)}
          PageEntity="Treatment"
          instanceId={instanceIdForGenragteDoc}
          dropdownName={dropdownName}
        />
      )}
    </div>
  );
};

export default React.memo(TreatmentPageSimplePage);
