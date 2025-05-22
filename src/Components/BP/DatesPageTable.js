import React, { useState, useEffect } from "react";
import DataPageTableSpeciality from "./DataPageTableSpeciality";
import DataPageTableData from "./DataPageTableData";
import AddTreatmentDateModal from "./modals/AddTreatmentDateModal";
import EditCaseProviderModal from "./modals/EditCaseProviderModal";
import VisitsModal from "./modals/VisitsModal";
import axios from "axios";

function DatesPageTable({
  caseProvider,
  setcaseProvidersList,
  specialitie,
  setSpecialitiesList,
  onUpdate,
  treatmentDateData,
}) {
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

  const origin = process.env.REACT_APP_BACKEND_URL;

  const [caseProviderShow, setCaseProviderShow] = useState(false);

  const handleCaseProviderClose = () => setCaseProviderShow(false);
  const handleCaseProviderShow = () => {
    setCaseProviderShow(true);
  };

  const [updateCall, setUpdateCall] = useState(false);

  const handleUpdateCall = () => {
    console.log("re render");
    setUpdateCall((prev) => !prev);
  };

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

  const [contact, setContact] = useState([]);
  if (caseProvider?.treatment_location) {
    useEffect(() => {
      async function fetchContactList() {
        const { data } = await axios.get(
          origin +
            "/api/treatment/case-providers/contact-info/" +
            caseProvider?.treatment_location?.id +
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

  function formatDate(dateStr) {
    if (!dateStr) {
      return "";
    }
    // Convert the input string to a Date object
    const date = new Date(dateStr);
    // Get the day, month, and year from the Date object
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();

    // Format the date in dd/mm/yyyy format
    return `${month}/${day}/${year}`;
  }

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

  // useEffect(() => {
  //   console.log('treatmentDateData----',treatmentDateData)
  // }, []);

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

      {
        // treatmentDateData.map((data) => (
        //   caseProvider?.id === data.client_provider.id ?
        <DataPageTableData
          treatmentDateData={treatmentDateData}
          specialitie={specialitie}
          caseProvider={caseProvider}
          handleShow={handleCaseProviderShow}
        />
        //     :
        //     null
        // ))
      }
    </>
  );
}

export default DatesPageTable;
