import React, { useState, useEffect } from "react";
import Vists from "./Vists";
import TreatmentLocation from "./TreatmentLocation";
import RecordReceived from "./RecordReceived";
import BillRecived from "./BillRecived";
import PaidRecords from "./PaidRecords";
import PaidBill from "./PaidBill";
import LienHolder from "./LienHolder";
import PaymentTable from "./PaymentTable";
import MedicalTable from "./MedicalTable";
import AddTreatmentDateModal from "./modals/AddTreatmentDateModal";
import EditCaseProviderModal from "./modals/EditCaseProviderModal";
import VisitsModal from "./modals/VisitsModal";
import DocumentRow from "./../DocumentRow/DocumentRow";
import axios from "axios";
import styled from "styled-components";
import { Modal, Button } from "react-bootstrap";
import PanelChecklist from "../common/PanelChecklist";
import NotesPanel from "../NotesPanelSection/NotesPanel";

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
`;

const LightBgParagraph = styled.p`
  background-color: ${({ speciality }) =>
    mixColorWithWhite(speciality.color, 10)} !important;
`;

const TopHead = styled.div`
  background-color: ${({ speciality }) => speciality.color};

  &::before,
  &::after {
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
    right: -11px; // Positioning on the opposite side
    transform-origin: bottom right;
    transform: skew(11.31deg); // Mirror skew effect
  }

  @media screen and (min-width: 1400px) {
    &::before {
      left: -8px;
    }
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

const CheckListSectionMain = styled.div`
  background-color: ${({ speciality }) => speciality.color} !important;
`;

const StyledSpan = styled.span`
  background-color: ${({ speciality }) => speciality.color} !important;
`;

const TreatmentButton = styled.a`
  background-color: ${({ speciality }) => speciality.color} !important;
  color: #fff !important;
`;

function TreatmentCaseProvider({
  caseProvider,
  setcaseProvidersList,
  specialitie,
  setSpecialitiesList,
  onUpdate,
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Hasnat
  const [updateCall, setUpdateCall] = useState(false);

  const handleUpdateCall = () => {
    console.log("re render");
    setUpdateCall((prev) => !prev);
  };
  //

  const [caseProviderShow, setCaseProviderShow] = useState(false);

  const handleCaseProviderClose = () => setCaseProviderShow(false);
  const handleCaseProviderShow = () => setCaseProviderShow(true);

  const origin = process.env.REACT_APP_BACKEND_URL;

  const pageWrapper = {
    paddingLeft: "131px",
  };

  const bg_color_3300CC = {
    backgroundColor: "#3300CC",
  };

  const bg_color_35b17f = {
    backgroundColor: "#35b17f",
  };

  const bg_color_CC0000 = {
    backgroundColor: "#CC0000",
  };

  const bg_color_b18735 = {
    backgroundColor: "#b18735",
  };

  const bg_color_910D50 = {
    backgroundColor: "#910D50",
  };

  const [contact, setContact] = useState([]);

  if (caseProvider?.treatment_location) {
    useEffect(() => {
      async function fetchContactList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider?.treatment_location +
            "/"
        );

        setContact(data);
      }

      fetchContactList();
    }, []);
  }

  const [treatmentRecord, setTreatmentRecord] = useState([]);

  if (caseProvider?.records_request) {
    useEffect(() => {
      async function fetchTreatmentRecordList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider?.records_request +
            "/"
        );

        setTreatmentRecord(data);
      }

      fetchTreatmentRecordList();
    }, []);
  }

  const [treatmentBill, setTreatmentBill] = useState([]);

  if (caseProvider?.billing_request) {
    useEffect(() => {
      async function fetchTreatmentBillList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider?.billing_request +
            "/"
        );

        setTreatmentBill(data);
      }

      fetchTreatmentBillList();
    }, []);
  }

  const [paidRecords, setPaidRecords] = useState([]);
  if (caseProvider?.records_request_paid) {
    useEffect(() => {
      async function fetchPaidRecordsList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider?.records_request_paid +
            "/"
        );

        setPaidRecords(data);
      }

      fetchPaidRecordsList();
    }, []);
  }

  const [paidBill, setPaidBill] = useState([]);
  if (caseProvider?.billing_request_paid) {
    useEffect(() => {
      async function fetchPaidBillList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider?.billing_request_paid +
            "/"
        );

        setPaidBill(data);
      }

      fetchPaidBillList();
    }, []);
  }

  const [lienHolder, setLienHolder] = useState([]);

  if (caseProvider?.lien_holder) {
    useEffect(() => {
      async function fetchLienHolderList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider?.lien_holder +
            "/"
        );

        setLienHolder(data);
      }

      fetchLienHolderList();
    }, []);
  }

  const [tfAccounting, setTfAccounting] = useState([]);

  useEffect(() => {
    async function fetchTfAccounting() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/case-providers/tf-accounting/" +
          caseProvider?.id +
          "/"
      );

      setTfAccounting(data);
    }

    fetchTfAccounting();
  }, []);

  const [allTreatmentDates, setAllTreatmentDates] = useState([]);

  useEffect(() => {
    async function fetchTfAllTreatmentDates() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/case-providers/all-treatment-dates/" +
          caseProvider?.id +
          "/"
      );

      setAllTreatmentDates(data);
    }

    fetchTfAllTreatmentDates();
  }, []);

  // ***********************

  function created_at_format(string_date) {
    const date = new Date(string_date);

    const options = {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDateTime = date.toLocaleString("en-US", options);
    return formattedDateTime;
  }

  const [location, setLocation] = useState([]);
  if (caseProvider?.location) {
    useEffect(() => {
      async function fetchLocation() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/location/" +
            caseProvider?.location +
            "/"
        );
        setLocation(data);
      }

      fetchLocation();
    }, []);
  }

  const [isTreatmentCompleteVerified, setIsTreatmentCompleteVerified] =
    useState([]);
  useEffect(() => {
    async function fetchVerification() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider?.id +
          "/CaseProviders-treatment_complete/"
      );
      setIsTreatmentCompleteVerified(data);
    }

    fetchVerification();
  }, [updateCall]);

  const [isRequestBillingVerified, setIsRequestBillingVerified] = useState([]);
  useEffect(() => {
    async function fetchRequestBillingVerification() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider?.id +
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
          caseProvider?.id +
          "/CaseProviders-billing_received/"
      );
      setIsReceivedBillingVerified(data);
    }

    fetchIsReceivedBillingVerified();
  }, [updateCall]);

  const [isBillingCostVerified, setIsBillingCostVerified] = useState([]);
  useEffect(() => {
    async function fetchIsBillingCostVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider?.id +
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
          caseProvider?.id +
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
          caseProvider?.id +
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
          caseProvider?.id +
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
          caseProvider?.id +
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
          caseProvider?.id +
          "/CaseProviders-rec_request_paid/"
      );
      setIsRecordPaidVerified(data);
    }

    fetchIsRecordPaidVerified();
  }, [updateCall]);

  const [isLineHolderBalanceVerified, setIsLineHolderBalanceVerified] =
    useState([]);
  useEffect(() => {
    async function fetchIsLineHolderBalanceVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider?.id +
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
          caseProvider?.id +
          "/CaseProviders-balance_confirmed/"
      );
      setIsLineHolderBalanceConfirmedVerified(data);
    }

    fetchIsLineHolderBalanceConfirmedVerified();
  }, [updateCall]);

  const [isTreatmentDateFirstVerified, setIsTreatmentDateFirstVerified] =
    useState([]);
  useEffect(() => {
    async function fetchIsTreatmentDateFirstVerified() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/get-single-verification-info/" +
          caseProvider?.id +
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
          caseProvider?.id +
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
          caseProvider?.id +
          "/CaseProviders-visits/"
      );
      setIsTreatmentDateVisitVerified(data);
    }

    fetchIsTreatmentDateVisitVerified();
  }, [updateCall]);

  function request_billing_modal() {
    if (isRequestBillingVerified.action.toLowerCase() === "verified") {
      $("#is_request_billing_ordered_verified").addClass("ic-verified");
      $("#is_request_billing_ordered_verified").removeClass("ic-unverified");
      $("#is_request_billing_ordered_verified_btn").text("Un Verify");
      $("#request_billing_ordered_verified_date").html(
        "Verified " + created_at_format(isRequestBillingVerified.created_at)
      );
      $("#request_billing_ordered_verified_by").html(
        isRequestBillingVerified.verification_by +
          " ip: " +
          isRequestBillingVerified.ip_address
      );
    } else {
      $("#is_request_billing_ordered_verified").addClass("ic-unverified");
      $("#is_request_billing_ordered_verified").removeClass("ic-verified");
      $("#is_request_billing_ordered_verified_btn").text("Verify");
      $("#request_billing_ordered_verified_date").html("");
      $("#request_billing_ordered_verified_by").html("");
    }

    if (caseProvider?.billing_ordered) {
      $("#is_request_billing_ordered_date").val(
        caseProvider?.billing_ordered.split("T")[0]
      );
    } else {
      $("#is_request_billing_ordered_date").val("");
    }

    if (
      isReceivedBillingVerified.action &&
      isReceivedBillingVerified.action.toLowerCase() === "verified"
    ) {
      $("#is_request_billing_recived_verified").addClass("ic-verified");
      $("#is_request_billing_recived_verified").removeClass("ic-unverified");
      $("#is_request_billing_recived_verified_btn").text("Un Verify");
      $("#request_billing_recived_verified_date").html(
        "Verified " + created_at_format(isReceivedBillingVerified.created_at)
      );
      $("#request_billing_recived_verified_by").html(
        isReceivedBillingVerified.verification_by +
          " ip: " +
          isReceivedBillingVerified.ip_address
      );
      $("#is_request_billing_received_date").val(
        caseProvider?.billing_received.split("T")[0]
      );
    } else {
      $("#is_request_billing_recived_verified").addClass("ic-unverified");
      $("#is_request_billing_recived_verified").removeClass("ic-verified");
      $("#is_request_billing_recived_verified_btn").text("Verify");
      $("#request_billing_recived_verified_date").html("");
      $("#request_billing_recived_verified_by").html("");
      $("#is_request_billing_received_date").val("");
    }

    if (
      isBillingCostVerified.action &&
      isBillingCostVerified.action.toLowerCase() === "verified"
    ) {
      $("#is_bills_cost_verify").addClass("ic-verified");
      $("#is_bills_cost_verify").removeClass("ic-unverified");
      $("#bills_cost_verify_btn").text("Un Verify");
      $("#bills_cost_verified_date").html(
        "Verified " + created_at_format(isBillingCostVerified.created_at)
      );
      $("#bills_cost_verified_by").html(
        isBillingCostVerified.verification_by +
          " ip: " +
          isBillingCostVerified.ip_address
      );
    } else {
      $("#is_bills_cost_verify").addClass("ic-unverified");
      $("#is_bills_cost_verify").removeClass("ic-verified");
      $("#bills_cost_verify_btn").text("Verify");
      $("#bills_cost_verified_date").html("");
      $("#bills_cost_verified_by").html("");
    }

    if (caseProvider?.billing_paid) {
      $("#bills_coast_paid_at").val(caseProvider?.billing_paid.split("T")[0]);
    } else {
      $("#bills_coast_paid_at").val(caseProvider?.billing_paid);
    }
    if (caseProvider?.bills_request_paid) {
      if (caseProvider?.bills_request_paid.toLowerCase() == "yes") {
        $("#bills_coast_paid_yes").prop("checked", true);
        $("#bills_coast_paid_no").prop("checked", false);
      } else {
        $("#bills_coast_paid_yes").prop("checked", false);
        $("#bills_coast_paid_no").prop("checked", true);
      }
    }
    if (
      isBillingPaidVerified.action &&
      isBillingPaidVerified.action.toLowerCase() === "verified"
    ) {
      $("#is_bills_request_paid_verified").addClass("ic-verified");
      $("#is_bills_request_paid_verified").removeClass("ic-unverified");
      $("#is_bills_request_paid_verified_btn").text("Un Verify");
      $("#bills_paid_verified_date").html(
        "Verified " + created_at_format(isBillingPaidVerified.created_at)
      );
      $("#bills_paid_verified_by").html(
        isBillingPaidVerified.verification_by +
          " ip: " +
          isBillingPaidVerified.ip_address
      );
    } else {
      $("#is_bills_request_paid_verified").addClass("ic-unverified");
      $("#is_bills_request_paid_verified").removeClass("ic-verified");
      $("#is_bills_request_paid_verified_btn").text("Verify");
      $("#bills_paid_verified_date").html("");
      $("#bills_paid_verified_by").html("");
    }
  }

  function request_record_modal() {
    if (isRequestRecordVerified.action.toLowerCase() === "verified") {
      $("#is_request_records_order_verify").addClass("ic-verified");
      $("#is_request_records_order_verify").removeClass("ic-unverified");
      $("#is_request_records_order_verify_btn").text("Un Verify");
      $("#request_records_order_verified_date").html(
        "Verified " + created_at_format(isRequestRecordVerified.created_at)
      );
      $("#request_records_order_verified_by").html(
        isRequestRecordVerified.verification_by +
          " ip: " +
          isRequestRecordVerified.ip_address
      );
      $("#is_record_ordered_date").val(
        caseProvider?.record_ordered.split("T")[0]
      );
    } else {
      $("#is_request_records_order_verify").addClass("ic-unverified");
      $("#is_request_records_order_verify").removeClass("ic-verified");
      $("#is_request_records_order_verify_btn").text("Verify");
      $("#request_records_order_verified_date").html("");
      $("#request_records_order_verified_by").html("");
      $("#is_record_ordered_date").val("");
    }

    if (isRequestRecivedVerified.action.toLowerCase() === "verified") {
      $("#is_request_records_received_verify").addClass("ic-verified");
      $("#is_request_records_received_verify").removeClass("ic-unverified");
      $("#is_request_records_received_verify_btn").text("Un Verify");
      $("#request_records_received_verified_date").html(
        "Verified " + created_at_format(isRequestRecivedVerified.created_at)
      );
      $("#request_records_received_verified_by").html(
        isRequestRecivedVerified.verification_by +
          " ip: " +
          isRequestRecivedVerified.ip_address
      );
      $("#is_record_received_date").val(
        caseProvider?.record_received.split("T")[0]
      );
    } else {
      $("#is_request_records_received_verify").addClass("ic-unverified");
      $("#is_request_records_received_verify").removeClass("ic-verified");
      $("#is_request_records_received_verify_btn").text("Verify");
      $("#request_records_received_verified_date").html("");
      $("#request_records_received_verified_by").html("");
      $("#is_record_received_date").val("");
    }

    if (isRecordCostVerified.action.toLowerCase() === "verified") {
      $("#is_request_record_cost_verify").addClass("ic-verified");
      $("#is_request_record_cost_verify").removeClass("ic-unverified");
      $("#is_request_record_cost_verify_btn").text("Un Verify");
      $("#request_record_cost_verified_date").html(
        "Verified " + created_at_format(isRecordCostVerified.created_at)
      );
      $("#request_record_cost_verified_by").html(
        isRecordCostVerified.verification_by +
          " ip: " +
          isRecordCostVerified.ip_address
      );
    } else {
      $("#is_request_record_cost_verify").addClass("ic-unverified");
      $("#is_request_record_cost_verify").removeClass("ic-verified");
      $("#is_request_record_cost_verify_btn").text("Verify");
      $("#request_record_cost_verified_date").html("");
      $("#request_record_cost_verified_by").html("");
    }
    if (caseProvider?.recordCost) {
      $("#is_request_record_cost").val(caseProvider?.recordCost.split("T")[0]);
    } else {
      $("#is_request_record_cost").val(caseProvider?.recordCost);
    }

    if (isRecordPaidVerified.action.toLowerCase() === "verified") {
      $("#is_request_record_paid_verify").addClass("ic-verified");
      $("#is_request_record_paid_verify").removeClass("ic-unverified");
      $("#is_request_record_paid_verify_btn").text("Un Verify");
      $("#request_record_paid_verified_date").html(
        "Verified " + created_at_format(isRecordPaidVerified.created_at)
      );
      $("#request_record_paid_verified_by").html(
        isRecordPaidVerified.verification_by +
          " ip: " +
          isRecordPaidVerified.ip_address
      );
    } else {
      $("#is_request_record_paid_verify").addClass("ic-unverified");
      $("#is_request_record_paid_verify").removeClass("ic-verified");
      $("#is_request_record_paid_verify_btn").text("Verify");
      $("#request_record_paid_verified_date").html("");
      $("#request_record_paid_verified_by").html("");
    }
    if (caseProvider?.rec_request_paid) {
      $("#is_request_record_paid").val(
        caseProvider?.rec_request_paid.split("T")[0]
      );
    } else {
      $("#is_request_record_paid").val(caseProvider?.rec_request_paid);
    }
    if (caseProvider?.recordCost) {
      if (caseProvider?.recordCost.toLowerCase() == "yes") {
        $("#is_request_record_paid_verify_yes").prop("checked", true);
        $("#is_request_record_paid_verify_no").prop("checked", false);
      } else {
        $("#is_request_record_paid_verify_no").prop("checked", true);
        $("#is_request_record_paid_verify_yes").prop("checked", false);
      }
    } else {
      $("#is_request_record_paid_verify_no").prop("checked", true);
      $("#is_request_record_paid_verify_yes").prop("checked", false);
    }

    $("#request_records_completed_specialty")
      .html(specialitie?.name)
      .css("background-color", specialitie?.color);
    $("#request_records_completed_location_name").html(
      caseProvider?.providerprofile_office_name
    );
    $("#request_records_completed_location_address1").html(
      location.address + ", "
    );
    $("#request_records_completed_location_address2").html(location.address2);
    $("#request_records_completed_location_city").html(location.city + ", ");
    $("#request_records_completed_location_state").html(location.state + ", ");
    $("#request_records_completed_location_zip").html(location.post_code);

    $("#request_record_medical_id").val(treatmentRecord.id);
    $("#request_record_medical_name").val(treatmentRecord.name);
    $("#request_record_medical_address1").val(treatmentRecord.address1);
    $("#request_record_medical_address2").val(treatmentRecord.address2);
    $("#request_record_medical_city").val(treatmentRecord.city);
    $("#request_record_medical_state").val(treatmentRecord.state);
    $("#request_record_medical_zip").val(treatmentRecord.zip);
    $("#request_record_medical_phone").val(treatmentRecord.phone_number);
    $("#request_record_medical_fax").val(treatmentRecord.fax);
    $("#request_record_medical_email").val(treatmentRecord.email);
    $("#request_record_medical_website").val(treatmentRecord.website);

    $("#request_record_2_medical_id").val(paidRecords.id);
    $("#request_record_2_medical_name").val(paidRecords.name);
    $("#request_record_2_medical_address1").val(paidRecords.address1);
    $("#request_record_2_medical_address2").val(paidRecords.address2);
    $("#request_record_2_medical_city").val(paidRecords.city);
    $("#request_record_2_medical_state").val(paidRecords.state);
    $("#request_record_2_medical_zip").val(paidRecords.zip);
    $("#request_record_2_medical_phone").val(paidRecords.phone_number);
    $("#request_record_2_medical_fax").val(paidRecords.fax);
    $("#request_record_2_medical_email").val(paidRecords.email);
    $("#request_record_2_medical_website").val(paidRecords.website);
  }

  function lien_holder_modal() {
    $("#lien_holder_completed_specialty")
      .html(specialitie?.name)
      .css("background-color", specialitie?.color);
    $("#lien_holder_completed_location_name").html(
      caseProvider?.providerprofile_office_name
    );
    $("#lien_holder_completed_location_address1").html(location.address + ", ");
    $("#lien_holder_completed_location_address2").html(location.address2);
    $("#lien_holder_completed_location_city").html(location.city + ", ");
    $("#lien_holder_completed_location_state").html(location.state + ", ");
    $("#lien_holder_completed_location_zip").html(location.post_code);

    $("#lien_holder_modal_id").val(lienHolder.id);
    $("#lien_holder_medical_name").val(lienHolder.name);
    $("#lien_holder_medical_address1").val(lienHolder.address1);
    $("#lien_holder_medical_address2").val(lienHolder.address2);
    $("#lien_holder_medical_city").val(lienHolder.city);
    $("#lien_holder_medical_state").val(lienHolder.state);
    $("#lien_holder_medical_zip").val(lienHolder.zip);
    $("#lien_holder_medical_phone").val(lienHolder.phone_number);
    $("#lien_holder_medical_fax").val(lienHolder.fax);
    $("#lien_holder_medical_email").val(lienHolder.email);
    $("#lien_holder_medical_website").val(lienHolder.website);

    if (isLineHolderBalanceVerified.action) {
      if (isLineHolderBalanceVerified.action.toLowerCase() === "verified") {
        $("#is_line_holder_balance_verify").addClass("ic-verified");
        $("#is_line_holder_balance_verify").removeClass("ic-unverified");
        $("#is_line_holder_balance_verified_btn").text("Un Verify");
        $("#line_holder_balance_verified_date").html(
          "Verified " +
            created_at_format(isLineHolderBalanceVerified.created_at)
        );
        $("#line_holder_balance_verified_by").html(
          isLineHolderBalanceVerified.verification_by +
            " ip: " +
            isLineHolderBalanceVerified.ip_address
        );
      } else {
        $("#is_line_holder_balance_verify").addClass("ic-unverified");
        $("#is_line_holder_balance_verify").removeClass("ic-verified");
        $("#is_line_holder_balance_verified_btn").text("Verify");
        $("#line_holder_balance_verified_date").html("");
        $("#line_holder_balance_verified_by").html("");
      }
    } else {
      $("#is_line_holder_balance_verify").addClass("ic-unverified");
      $("#is_line_holder_balance_verify").removeClass("ic-verified");
      $("#is_line_holder_balance_verified_btn").text("Verify");
      $("#line_holder_balance_verified_date").html("");
      $("#line_holder_balance_verified_by").html("");
    }
    $("#line_holder_balance_input").val(caseProvider?.final);

    if (isLineHolderBalanceConfirmedVerified.action) {
      if (
        isLineHolderBalanceConfirmedVerified.action.toLowerCase() === "verified"
      ) {
        $("#is_line_holder_balance_confirmed").addClass("ic-verified");
        $("#is_line_holder_balance_confirmed").removeClass("ic-unverified");
        $("#is_line_holder_balance_confirmed_btn").text("Un Verify");
        $("#line_holder_balance_confirmed_date").html(
          "Verified " +
            created_at_format(isLineHolderBalanceConfirmedVerified.created_at)
        );
        $("#line_holder_balance_confirmed_by").html(
          isLineHolderBalanceConfirmedVerified.verification_by +
            " ip: " +
            isLineHolderBalanceConfirmedVerified.ip_address
        );
      } else {
        $("#is_line_holder_balance_confirmed").addClass("ic-unverified");
        $("#is_line_holder_balance_confirmed").removeClass("ic-verified");
        $("#is_line_holder_balance_confirmed_btn").text("Verify");
        $("#line_holder_balance_confirmed_date").html("");
        $("#line_holder_balance_confirmed_by").html("");
      }
    } else {
      $("#is_line_holder_balance_confirmed").addClass("ic-unverified");
      $("#is_line_holder_balance_confirmed").removeClass("ic-verified");
      $("#is_line_holder_balance_confirmed_btn").text("Verify");
      $("#line_holder_balance_confirmed_date").html("");
      $("#line_holder_balance_confirmed_by").html("");
    }
    if (caseProvider?.balance_confirmed) {
      if (caseProvider?.balance_confirmed.toLowerCase() == "yes") {
        $("#is_line_holder_balance_confirmed_yes").prop("checked", true);
        $("#is_line_holder_balance_confirmed_no").prop("checked", false);
      } else {
        $("#is_line_holder_balance_confirmed_no").prop("checked", true);
        $("#is_line_holder_balance_confirmed_yes").prop("checked", false);
      }
    } else {
      $("#is_line_holder_balance_confirmed_no").prop("checked", true);
      $("#is_line_holder_balance_confirmed_yes").prop("checked", false);
    }
  }

  function set_treatment_date_table() {
    let singleLineString = "";

    for (let i = 0; i < allTreatmentDates.length; i++) {
      singleLineString +=
        '<tr id="client_provider_treatment_date" className="black-color"><td className="td-autosize client-location-class bg-speciality-10"><div className="d-flex align-items-center"><div className="d-flex align-items-center justify-content-center"><span className="d-flex align-items-center justify-content-center text-center text-white specialty-icon">' +
        "M" +
        '</span></div><p className="m-l-5 m-r-5">John Doe</p></div></td><td className="td-autosize client-location-class">' +
        allTreatmentDates[i].date.split("T")[0] +
        '</td><td className="td-autosize py-2 treatment-note-doc"></td><td className="client-location-class line-height-26">' +
        allTreatmentDates[i].description +
        '</td><td className="client-location-class line-height-26"></td></tr>';
    }
    console.log(singleLineString);
    $("#treatment_dates_table").html(singleLineString);
  }

  function treatment_dates_modal() {
    if (isTreatmentDateFirstVerified) {
      if (isTreatmentDateFirstVerified.action.toLowerCase() === "verified") {
        $("#is_treatment_dates_first_date_verified").addClass("ic-verified");
        $("#is_treatment_dates_first_date_verified").removeClass(
          "ic-unverified"
        );
        $("#treatment_dates_first_date_verified_btn").text("Un Verify");
        $("#treatment_dates_first_date_verified_date").html(
          "Verified " +
            created_at_format(isTreatmentDateFirstVerified.created_at)
        );
        $("#treatment_dates_first_date_verified_by").html(
          isTreatmentDateFirstVerified.verification_by +
            " ip: " +
            isTreatmentDateFirstVerified.ip_address
        );
      } else {
        $("#is_treatment_dates_first_date_verified").addClass("ic-unverified");
        $("#is_treatment_dates_first_date_verified").removeClass("ic-verified");
        $("#treatment_dates_first_date_verified_btn").text("Verify");
        $("#treatment_dates_first_date_verified_date").html("");
        $("#treatment_dates_first_date_verified_by").html("");
      }
    } else {
      $("#is_treatment_dates_first_date_verified").addClass("ic-unverified");
      $("#is_treatment_dates_first_date_verified").removeClass("ic-verified");
      $("#treatment_dates_first_date_verified_btn").text("Verify");
      $("#treatment_dates_first_date_verified_date").html("");
      $("#treatment_dates_first_date_verified_by").html("");
    }
    $("#treatment_dates_first_date").val(caseProvider?.first_date);

    if (isTreatmentDateLastVerified) {
      if (isTreatmentDateLastVerified.action.toLowerCase() === "verified") {
        $("#is_treatment_dates_last_date_verified").addClass("ic-verified");
        $("#is_treatment_dates_last_date_verified").removeClass(
          "ic-unverified"
        );
        $("#treatment_dates_last_date_verified_btn").text("Un Verify");
        $("#treatment_dates_last_date_verified_date").html(
          "Verified " +
            created_at_format(isTreatmentDateLastVerified.created_at)
        );
        $("#treatment_dates_last_date_verified_by").html(
          isTreatmentDateLastVerified.verification_by +
            " ip: " +
            isTreatmentDateLastVerified.ip_address
        );
      } else {
        $("#is_treatment_dates_last_date_verified").addClass("ic-unverified");
        $("#is_treatment_dates_last_date_verified").removeClass("ic-verified");
        $("#treatment_dates_last_date_verified_btn").text("Verify");
        $("#treatment_dates_last_date_verified_date").html("");
        $("#treatment_dates_last_date_verified_by").html("");
      }
    } else {
      $("#is_treatment_dates_last_date_verified").addClass("ic-unverified");
      $("#is_treatment_dates_last_date_verified").removeClass("ic-verified");
      $("#treatment_dates_last_date_verified_btn").text("Verify");
      $("#treatment_dates_last_date_verified_date").html("");
      $("#treatment_dates_last_date_verified_by").html("");
    }
    $("#treatment_dates_last_date").val(caseProvider?.second_date);

    if (isTreatmentDateVisitVerified) {
      if (isTreatmentDateVisitVerified.action.toLowerCase() === "verified") {
        $("#is_treatment_dates_visits_verify").addClass("ic-verified");
        $("#is_treatment_dates_visits_verify").removeClass("ic-unverified");
        $("#treatment_dates_visits_verify_btn").text("Un Verify");
        $("#treatment_dates_visits_verify_date").html(
          "Verified " +
            created_at_format(isTreatmentDateVisitVerified.created_at)
        );
        $("#treatment_dates_visits_verify_by").html(
          isTreatmentDateVisitVerified.verification_by +
            " ip: " +
            isTreatmentDateVisitVerified.ip_address
        );
      } else {
        $("#is_treatment_dates_visits_verify").addClass("ic-unverified");
        $("#is_treatment_dates_visits_verify").removeClass("ic-verified");
        $("#treatment_dates_visits_verify_btn").text("Verify");
        $("#treatment_dates_visits_verify_date").html("");
        $("#treatment_dates_visits_verify_by").html("");
      }
    } else {
      $("#is_treatment_dates_visits_verify").addClass("ic-unverified");
      $("#is_treatment_dates_visits_verify").removeClass("ic-verified");
      $("#treatment_dates_visits_verify_btn").text("Verify");
      $("#treatment_dates_visits_verify_date").html("");
      $("#treatment_dates_visits_verify_by").html("");
    }
    $("#treatment_dates_visits").val(caseProvider?.visits);
  }

  function provider_charges_modal() {
    $("#provider_charges_original").val(caseProvider?.amount);
    $("#provider_charges_hi_paid").val(caseProvider?.ins_paid);
    $("#provider_charges_hi_reduction").val(caseProvider?.write_off);
    $("#provider_charges_mp_pip").val(caseProvider?.medpaypaip);
    $("#provider_charges_reduc").val(caseProvider?.reduction);
    $("#provider_charges_client_paid").val(caseProvider?.patient_paid);
    $("#provider_charges_line").val(caseProvider?.liens);
    $("#provider_charges_final_amount").val(caseProvider?.final);
  }

  useEffect(() => {
    $("#request_billing_modal_save_btn").click(async function () {
      if (
        $("#request_billing_medical_name").val() === "" ||
        $("#request_billing_2_medical_name").val() === ""
      ) {
        console.log("Empty val");
      } else {
        try {
          const response = await axios.post(
            origin + "/api/treatment/edit-contact-info/",
            {
              location_id: $("#request_billing_id").val(),

              name: $("#request_billing_medical_name").val(),
              address1: $("#request_billing_medical_address1").val(),
              address2: $("#request_billing_medical_address2").val(),
              city: $("#request_billing_medical_city").val(),
              state: $("#request_billing_medical_state").val(),
              zip: $("#request_billing_medical_zip").val(),
              phone: $("#request_billing_medical_phone").val(),
              fax: $("#request_billing_medical_fax").val(),
              email: $("#request_billing_medical_email").val(),
              website: $("#request_billing_medical_website").val(),
            }
          );
          console.log(response, "<<<<<<<<<<<<<");
        } catch (error) {
          console.error("Error:", error);
        }

        try {
          const response = await axios.post(
            origin + "/api/treatment/edit-contact-info/",
            {
              location_id: $("#request_billing_2_id").val(),

              name: $("#request_billing_2_medical_name").val(),
              address1: $("#request_billing_2_medical_address1").val(),
              address2: $("#request_billing_2_medical_address2").val(),
              city: $("#request_billing_2_medical_city").val(),
              state: $("#request_billing_2_medical_state").val(),
              zip: $("#request_billing_2_medical_zip").val(),
              phone: $("#request_billing_2_medical_phone").val(),
              fax: $("#request_billing_2_medical_fax").val(),
              email: $("#request_billing_2_medical_email").val(),
              website: $("#request_billing_2_medical_website").val(),
            }
          );
          console.log(response, "<<<<<<<<<<<<<");
        } catch (error) {
          console.error("Error:", error);
        }
      }
    });
  }, []);

  useEffect(() => {
    $("#request_records_modal_save_btn").click(async function () {
      if (
        $("#request_record_medical_name").val() === "" ||
        $("#request_record_2_medical_name").val() === ""
      ) {
        console.log("Empty val");
      } else {
        try {
          const response = await axios.post(
            origin + "/api/treatment/edit-contact-info/",
            {
              location_id: $("#request_record_medical_id").val(),

              name: $("#request_record_medical_name").val(),
              address1: $("#request_record_medical_address1").val(),
              address2: $("#request_record_medical_address2").val(),
              city: $("#request_record_medical_city").val(),
              state: $("#request_record_medical_state").val(),
              zip: $("#request_record_medical_zip").val(),
              phone: $("#request_record_medical_phone").val(),
              fax: $("#request_record_medical_fax").val(),
              email: $("#request_record_medical_email").val(),
              website: $("#request_record_medical_website").val(),
            }
          );
          console.log(response, "<<<<<<<<<<<<<");
        } catch (error) {
          console.error("Error:", error);
        }

        try {
          const response = await axios.post(
            origin + "/api/treatment/edit-contact-info/",
            {
              location_id: $("#request_record_2_medical_id").val(),

              name: $("#request_record_2_medical_name").val(),
              address1: $("#request_record_2_medical_address1").val(),
              address2: $("#request_record_2_medical_address2").val(),
              city: $("#request_record_2_medical_city").val(),
              state: $("#request_record_2_medical_state").val(),
              zip: $("#request_record_2_medical_zip").val(),
              phone: $("#request_record_2_medical_phone").val(),
              fax: $("#request_record_2_medical_fax").val(),
              email: $("#request_record_2_medical_email").val(),
              website: $("#request_record_2_medical_website").val(),
            }
          );
          console.log(response, "<<<<<<<<<<<<<");
        } catch (error) {
          console.error("Error:", error);
        }
      }
    });
  }, []);

  useEffect(() => {
    $("#line_holder_modal_save_btn").click(async function () {
      if ($("#lien_holder_medical_name").val() === "") {
        console.log("Empty val");
      } else {
        try {
          const response = await axios.post(
            origin + "/api/treatment/edit-contact-info/",
            {
              location_id: $("#lien_holder_modal_id").val(),

              name: $("#lien_holder_medical_name").val(),
              address1: $("#lien_holder_medical_address1").val(),
              address2: $("#lien_holder_medical_address2").val(),
              city: $("#lien_holder_medical_city").val(),
              state: $("#lien_holder_medical_state").val(),
              zip: $("#lien_holder_medical_zip").val(),
              phone: $("#lien_holder_medical_phone").val(),
              fax: $("#lien_holder_medical_fax").val(),
              email: $("#lien_holder_medical_email").val(),
              website: $("#lien_holder_medical_website").val(),
            }
          );
          console.log(response, "<<<<<<<<<<<<<");
        } catch (error) {
          console.error("Error:", error);
        }
      }
    });
  }, []);

  const get_providers_edit_modal = () => {
    request_billing_modal();
    request_record_modal();
    lien_holder_modal();
    treatment_dates_modal();
    set_treatment_date_table();
    provider_charges_modal();
  };

  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } else {
      return "";
    }
  };

  const [showDatesModal, setShowDatesModal] = useState(false);

  const showDatesModalClose = () => setShowDatesModal(false);
  const showDatesModalShow = () => setShowDatesModal(true);

  const [dates, setdates] = useState([]);
  const [firstVisitDate, setFirstVisitDate] = useState("");
  const [lastVisitDate, setLastVisitDate] = useState("");
  useEffect(() => {
    async function fetchDates() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/case-providers/treatment-dates/" +
          caseProvider?.id +
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

  //console.log("firstVisitDate : ", firstVisitDate)

  const [activeTab, setActiveTab] = useState("provider-tab");

  // ***********************

  return (
    <>
      <AddTreatmentDateModal
        show={show}
        handleClose={handleClose}
        caseProviderID={caseProvider?.id}
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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
        caseProviderID={caseProvider?.id}
        visits={caseProvider?.visits}
        first_visit_date={firstVisitDate}
        last_visit_date={lastVisitDate}
        caseId={caseProvider?.for_case}
        onUpdate={onUpdate}
        updateCall={handleUpdateCall}
      />

      <div
        className="border-box has-checklist mr-15 has-speciality-color-${specialitie?.id} specialty-panel-${specialitie?.id}"
        class_name="92_"
      >
        <div className="expandable-section">
          <div className="has-title-bg" style={{ overflow: "hidden" }}>
            <div className="top-header-wrap">
              <TopHeader
                speciality={specialitie}
                className="top-header top-header-checklist 
                        d-md-flex bg-speciality-10 height-25 panel-header p-l-0 top-header-specialty-bg-2 
                        top-header-specialty has-speciality-color-2 pl-35_5px c-pl-35_5px pl-0"
              >
                <TopHead
                  speciality={specialitie}
                  className="top-head-specialty-cw top-head col-md-3 col-xxl-3 p-0 d-flex align-items-center m-l-10 top-head-specialty-bg-2 top-head-specialty overflow-y-clip has-solid-title"
                >
                  <h2
                    className="d-flex align-items-center w-565 w-100 p-0 d-flex flex-nowrap flex-md-wrap text-capitalize"
                    id="d-column"
                  >
                    <div className="col p-0">
                      <small className="font-weight-bold text-uppercase align-cont-1">
                        {specialitie?.name}
                      </small>
                    </div>
                  </h2>
                </TopHead>
                <div
                  id="treatmentDates92"
                  className="col-lg-6 d-flex align-items-center justify-content-lg-center line-height-normal 
                                    change-alignment bg-speciality-10 c-pl-date-panel"
                >
                  <Vists
                    caseProvider_id={caseProvider?.id}
                    visits={caseProvider?.visits}
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
                <div className="col height-39 d-none">&nbsp;</div>
                <div className="checklist-class d-none">
                  <div className="checklistAngle textcol">
                    <div className="nt-box mr-0"></div>
                    <div className="dropdown6">
                      <button onclick="myFunction6(92)" className="dropbtn">
                        <i className="fa fa-check" aria-hidden="true"></i>
                        Checklist{" "}
                        <i
                          className="fa fa-chevron-down"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </div>
                  </div>
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
                        <span className="d-flex align-items-center c-m-r-7">
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
            <div className="row-new no-gutters position-relative m-b-5 p-r-15 p-md-r-0">
              <div className="provider-panel-width">
                <div className="row-new no-gutters equal-column-wrapper">
                  <TreatmentLocation
                    caseProvider={caseProvider}
                    contact={contact}
                    specialitie={specialitie}
                    get_providers_edit_modal={get_providers_edit_modal}
                    handleShow={handleCaseProviderShow}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />

                  <RecordReceived
                    record_date={
                      caseProvider?.record_received
                        ? caseProvider?.record_received
                        : caseProvider?.record_ordered
                    }
                    contact={treatmentRecord}
                    specialitie={specialitie}
                    get_providers_edit_modal={get_providers_edit_modal}
                    handleShow={handleCaseProviderShow}
                  />

                  <BillRecived
                    record_date={
                      caseProvider?.billing_received
                        ? caseProvider?.billing_received
                        : caseProvider?.billing_ordered
                    }
                    contact={treatmentBill}
                    specialitie={specialitie}
                    get_providers_edit_modal={get_providers_edit_modal}
                    handleShow={handleCaseProviderShow}
                  />

                  <PaidRecords
                    contact={paidRecords}
                    specialitie={specialitie}
                    get_providers_edit_modal={get_providers_edit_modal}
                    handleShow={handleCaseProviderShow}
                  />

                  <PaidBill
                    contact={paidBill}
                    specialitie={specialitie}
                    get_providers_edit_modal={get_providers_edit_modal}
                    handleShow={handleCaseProviderShow}
                  />

                  <LienHolder
                    contact={lienHolder}
                    specialitie={specialitie}
                    get_providers_edit_modal={get_providers_edit_modal}
                    handleShow={handleCaseProviderShow}
                  />
                </div>
              </div>
              {/* <div className="col-md">
                                <div className="fake-rows top-0">
                                    <div className="fake-row c-fake-row-height"></div>
                                    <div className="fake-row c-fake-row-height"></div>
                                    <div className="fake-row c-fake-row-height"></div>
                                    <div className="fake-row c-fake-row-height"></div>
                                    <div className="fake-row c-fake-row-height"></div>
                                </div>
                            </div> */}

              {/* <NotesPanel entity_type={"CaseProviders"} record_id={caseProvider?.id} module={'Reports'} /> */}
            </div>

            <div
              className="grayPanelWrap row wf m-b-5 ml-0 mr-0 p-r-15 p-md-r-0"
              data-id="92"
              data-amount="15,100.00"
              data-ins_paid="1,130.00"
              data-write_off="11,101.00"
              data-reduction="1,101.00"
              data-medpaypaip="101.00"
              data-final_amount="1,666.00"
              data-patient_paid="1.00"
              data-med_provider_name="Sultan Associates1"
              data-firm_name="Ali Usama Associates"
              data-final="113.00"
              onclick="med_provider_charges_modal(this)"
              id="medical_provider_charges92"
            >
              <div className="col-md-auto p-0">
                <div className="panel-sub-title height-25 btn-primary-lighter-default"></div>
                <div className="title-col-row height-25 ">
                  <p className="text-lg mb-0 p-l-30 p-r-5">
                    Ali Usama Associates
                  </p>
                </div>
                <div className="title-col-row height-25  ">
                  <div className="d-flex align-items-center justify-content-left align-items-center height-25">
                    <StyledSpan
                      speciality={specialitie}
                      className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
                      style={bg_color_3300CC}
                    >
                      {specialitie?.name[0]}
                    </StyledSpan>

                    <LightBgParagraph
                      speciality={specialitie}
                      className="d-flex p-l-5 p-r-5 align-items-center text-lg mb-0 bg-speciality-10 height-25 align-self-center"
                    >
                      {contact.name}
                    </LightBgParagraph>
                  </div>
                </div>
              </div>
              <div className="d-flex-1 position-relative bilings-table no-rl-padding">
                <div className="table--no-card rounded-0 border-0">
                  <table
                    className="table table-borderless table-striped table-earning has-height-25"
                    data-toggle="modal"
                    data-target="#medical-provider-charges"
                    id="tf_provider_table"
                  >
                    <thead>
                      <tr>
                        <th className="text-center btn-primary-lighter-default color-primary c-font-weight-600">
                          Original
                        </th>
                        <th className="text-center btn-primary-lighter-default color-primary c-font-weight-600">
                          HI Paid
                        </th>
                        <th className="text-center btn-primary-lighter-default color-primary c-font-weight-600">
                          HI Reduction
                        </th>
                        <th className="text-center btn-primary-lighter-default color-primary c-font-weight-600">
                          MP / PIP
                        </th>
                        <th className="text-center btn-primary-lighter-default color-primary c-font-weight-600">
                          Reduc.
                        </th>
                        <th className="text-center btn-primary-lighter-default color-primary c-font-weight-600">
                          Client Paid
                        </th>
                        <th className="text-center btn-primary-lighter-default color-primary c-font-weight-600">
                          Lien
                        </th>
                        <th className="text-center btn-primary-lighter-default color-primary c-font-weight-600">
                          Final Payment
                        </th>
                      </tr>
                    </thead>

                    {tfAccounting && tfAccounting.length > 0 ? (
                      tfAccounting.map((tf) => (
                        <PaymentTable
                          tfAccounting={tf}
                          type={"tf"}
                          handleShow={handleCaseProviderShow}
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                        />
                      ))
                    ) : (
                      <PaymentTable
                        tfAccounting={caseProvider}
                        type="cp"
                        handleShow={handleCaseProviderShow}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                      />
                    )}
                  </table>
                </div>
              </div>
            </div>

            <div
              className="row-new bg-white m-0 p-r-15 has-speciality-color-2"
              id="treatment-dates-block-92"
            >
              <div className="d-flex justify-content-start w-100">
                <div className="table-responsive table--no-card overflow-hidden">
                  <table className="table table-borderless table-striped table-earning has-specialty-icon">
                    <thead>
                      <tr id="bg-m-10" className="line-height">
                        <th className=" pr-3 btn-primary-lighter-default color-primary c-font-weight-600">
                          MEDICAL PROVIDER
                        </th>
                        <th className=" btn-primary-lighter-default color-primary c-font-weight-600">
                          Date
                        </th>
                        <th className="pr-3  btn-primary-lighter-default color-primary c-font-weight-600">
                          Record
                        </th>
                        <th
                          colspan="2"
                          className=" btn-primary-lighter-default"
                        >
                          <div className="d-flex align-items-center notes-section">
                            <span className="color-primary c-font-weight-600">
                              Treatment Note
                            </span>
                            {/*}    <div className="d-flex flex-g-1 justify-content-end dropdown-btn-row">
                                                            <TreatmentButton speciality={specialitie} className="btn border-no"
                                                                id="treatment-date-col"
                                                                onClick={handleShow}
                                                            >
                                                                <span
                                                                    className="font-weight-bold pr-2 text-gold  margin-b-08">+</span>
                                                                Treatment Date
                                                            </TreatmentButton>
                                    </div>*/}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTreatmentDates.map((date) => (
                        <MedicalTable
                          date={date}
                          specialitie={specialitie}
                          contact={contact}
                          setAllTreatmentDates={setAllTreatmentDates}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="row documents-wrapper">
              <div className="col-12">
                <div className="height-25">
                  <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center m-r-15 mt-1 columnsTitle client-contact-title">
                    {contact ? contact.name : ""}&nbsp;Document Row
                  </h4>
                </div>
                <DocumentRow clientProvider={caseProvider} page="Treatment" />
                {/* <div className="row no-gutters flex-row position-relative p-r-15 p-md-r-0">
                                    <div className="col p-0">
                                        <div className="d-md-flex justify-content-start w-100">
                                            <div className="icon-text-boxes d-flex flex-wrap w-100 e-template-row ">
                                                <div className="col-12 col-md-3 col-xl icon-text-box text-center order-last">
                                                    <div className="upload-icon border-0 rounded-0 bg-transparent dropzone-2-92">
                                                        <div className="d-flex align-items-center">
                                                            <span className="font-weight-bold text-gold h5 m-0 pr-2">+</span>
                                                            <span className="text-lg-grey">Upload
                                                                Document to Page</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TreatmentCaseProvider;
