import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Tab, Nav } from "react-bootstrap";
import "../../../Modules/TreatmentPage.css";
import ProviderCharges from "./CaseProviderModals/ProviderCharges";
import TreatmentLocation from "./CaseProviderModals/TreatmentLocation";
import Provider from "./CaseProviderModals/Provider";
import RequestBilling from "./CaseProviderModals/BillsRecieved";
import axios from "axios";
import RequestRecords from "./CaseProviderModals/RecordsRecieved";
import LineHolder from "./CaseProviderModals/LineHolder";
import TreatmentDate from "./CaseProviderModals/TreatmentDate";
import useIsStates from "../../../Hooks/getStates";
import "./NewEditCaseProviderModal.css";
import { Padding } from "@mui/icons-material";
import BillsRecieved from "./CaseProviderModals/BillsRecieved";
import BillsRequestPaid from "./CaseProviderModals/BillsRequestPaid";
import RecordsRecieved from "./CaseProviderModals/RecordsRecieved";
import RecordsPaid from "./CaseProviderModals/RecordsPaid";
import { useGetVerificationInfo } from "../../TreatmentPage/hooks/useGetVerificationInfo";
import { formatDateForInput } from "../../TreatmentPage/utils/helperFn";
import GenrateDocument from "../../GenrateDocument/GenrateDocument";

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

const NewEditCaseProviderModal = ({
  show,
  firmName,
  handleClose,
  caseProvider,
  specialitie,
  contact,
  treatmentBill,
  paidBill,
  treatmentRecord,
  paidRecords,
  lienHolder,
  allTreatmentDates,
  setAllTreatmentDates,
  verification,
  refetchAll,
  refetch,
  activeTab,
  setActiveTab,
}) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");

  // const [isRequestBillingVerified, setIsRequestBillingVerified] = useState([]);
  // const [isReceivedBillingVerified, setIsReceivedBillingVerified] = useState(
  //   []
  // );
  // const [isBillingCostVerified, setIsBillingCostVerified] = useState([]);
  // const [isBillingPaidVerified, setIsBillingPaidVerified] = useState([]);
  // const [isTreatmentCompleteVerified, setIsTreatmentCompleteVerified] =
  //   useState([]);

  const [formStates, setFormStates] = useState({
    treatmentLocation: {
      id: contact?.id,
      name: contact?.name,
      address1: contact?.address1,
      address2: contact?.address2,
      city: contact?.city,
      state: contact?.state,
      zip: contact?.zip,
      phone_number: contact?.phone_number,
      fax: contact?.fax,
      website: contact?.website,
      email: contact?.email,
    },
    billsReceived: {
      id: treatmentBill?.id,
      name: treatmentBill?.name,
      address1: treatmentBill?.address1,
      address2: treatmentBill?.address2,
      city: treatmentBill?.city,
      state: treatmentBill?.state,
      zip: treatmentBill?.zip,
      phone_number: treatmentBill?.phone_number,
      fax: treatmentBill?.fax,
      website: treatmentBill?.website,
      email: treatmentBill?.email,
      // Additional billing fields
      billingOrdered: caseProvider?.billing_ordered
        ? formatDateForInput(caseProvider.billing_ordered?.split("T")[0])
        : "",
      billingReceived: caseProvider?.billing_received
        ? formatDateForInput(caseProvider.billing_received?.split("T")[0])
        : "",
      billingPaid: caseProvider?.bills_request_paid || "",
      billingCost: caseProvider?.billsCost || "",
      billingPaidTime: caseProvider?.billing_paid
        ? formatDateForInput(caseProvider.billing_paid?.split("T")[0])
        : "",
    },
    billsPaid: {
      id: paidBill?.id,
      name: paidBill?.name,
      address1: paidBill?.address1,
      address2: paidBill?.address2,
      city: paidBill?.city,
      state: paidBill?.state,
      zip: paidBill?.zip,
      phone_number: paidBill?.phone_number,
      fax: paidBill?.fax,
      website: paidBill?.website,
      email: paidBill?.email,
      // Additional billing fields
      billingOrdered: formatDateForInput(
        caseProvider?.billing_ordered?.split("T")[0]
      ),
      billingReceived: formatDateForInput(
        caseProvider?.billing_received?.split("T")[0]
      ),
      billingPaid: caseProvider?.bills_request_paid || "",
      billingCost: caseProvider?.billsCost || "",
      billingPaidTime: formatDateForInput(
        caseProvider?.billing_paid?.split("T")[0]
      ),
    },
    recordsReceived: {
      id: treatmentRecord?.id,
      name: treatmentRecord?.name || "",
      address1: treatmentRecord?.address1 || "",
      address2: treatmentRecord?.address2 || "",
      city: treatmentRecord?.city || "",
      state: treatmentRecord?.state || "",
      zip: treatmentRecord?.zip || "",
      phoneNumber: treatmentRecord?.phone_number || "",
      fax: treatmentRecord?.fax || "",
      website: treatmentRecord?.website || "",
      email: treatmentRecord?.email || "",
      // Additional fields
      requestOrdered: caseProvider?.record_ordered
        ? formatDateForInput(caseProvider.record_ordered)
        : "",
      requestReceived: caseProvider?.record_received
        ? formatDateForInput(caseProvider.record_received.split("T")[0])
        : "",
      requestPaid: caseProvider?.rec_request_paid || "",
      requestPaidTime: caseProvider?.record_paid
        ? formatDateForInput(caseProvider.record_paid.split("T")[0])
        : "",
      requestCost: caseProvider?.recordCost || "",
    },
    recordsPaid: {
      id: paidRecords?.id,
      name: paidRecords?.name || "",
      address1: paidRecords?.address1 || "",
      address2: paidRecords?.address2 || "",
      city: paidRecords?.city || "",
      state: paidRecords?.state || "",
      zip: paidRecords?.zip || "",
      phoneNumber: paidRecords?.phone_number || "",
      fax: paidRecords?.fax || "",
      website: paidRecords?.website || "",
      email: paidRecords?.email || "",
      // Additional fields
      requestOrdered: caseProvider?.record_ordered
        ? formatDateForInput(caseProvider.record_ordered.split("T")[0])
        : "",
      requestReceived: caseProvider?.record_received
        ? formatDateForInput(caseProvider.record_received.split("T")[0])
        : "",
      requestPaid: caseProvider?.rec_request_paid || "",
      requestPaidTime: caseProvider?.record_paid
        ? formatDateForInput(caseProvider.record_paid.split("T")[0])
        : "",
      requestCost: caseProvider?.recordCost || "",
    },
    lienHolder: {
      id: lienHolder?.id,
      name: lienHolder?.name || "",
      address1: lienHolder?.address1 || "",
      address2: lienHolder?.address2 || "",
      city: lienHolder?.city || "",
      state: lienHolder?.state || "",
      zip: lienHolder?.zip || "",
      phoneNumber: lienHolder?.phone_number || "",
      fax: lienHolder?.fax || "",
      website: lienHolder?.website || "",
      email: lienHolder?.email || "",
      // Additional fields
      lineHolderBalance: caseProvider?.final || "",
      lineHolderBalanceConfirm: caseProvider?.balance_confirmed || "",
    },
    // treatmentDates: {
    //   firstDate: caseProvider?.first_date
    //     ? formatDateForInput(caseProvider.first_date.split("T")[0])
    //     : "",
    //   lastDate: caseProvider?.second_date
    //     ? formatDateForInput(caseProvider.second_date.split("T")[0])
    //     : "",
    //   visitCount: caseProvider?.visits || "",
    //   completeTreatment: caseProvider?.treatment_complete || "",
    //   //   // ... treatment dates initial state
    // },
    // providerCharges: {
    //   providerAmount: 0.0,
    //   providerInsPaid: 0.0,
    //   providerWriteOff: 0.0,
    //   providerMedPay: 0.0,
    //   providerReduction: 0.0,
    //   providerPatientPaid: 0.0,
    //   providerFinalAmount: 0.0,
    //   providerLiens: 0.0,
    // },
  });

  useEffect(() => {
    if (contact) {
      setFormStates((prev) => ({
        ...prev,
        treatmentLocation: contact,
      }));
    }
    if (treatmentBill) {
      setFormStates((prev) => ({
        ...prev,

        billsReceived: {
          ...formStates.billsReceived,
          ...treatmentBill,
        },
      }));
    }
    if (paidBill) {
      setFormStates((prev) => ({
        ...prev,
        billsPaid: {
          ...formStates.billsPaid,
          ...paidBill,
        },
      }));
    }
    if (treatmentRecord) {
      console.log(treatmentRecord);
      setFormStates((prev) => ({
        ...prev,
        recordsReceived: {
          ...formStates.recordsReceived,
          ...treatmentRecord,
        },
      }));
    }
    if (paidRecords) {
      setFormStates((prev) => ({
        ...prev,
        recordsPaid: {
          ...formStates.recordsPaid,
          ...paidRecords,
        },
      }));
    }
    if (lienHolder) {
      setFormStates((prev) => ({
        ...prev,
        lienHolder: {
          ...formStates.lienHolder,
          ...lienHolder,
        },
      }));
    }
  }, [
    contact,
    treatmentBill,
    paidBill,
    treatmentRecord,
    paidRecords,
    lienHolder,
  ]);

  // Function to update form state for any tab
  const updateFormState = (tabName, newData) => {
    console.log("New Data:", newData);
    setFormStates((prev) => ({
      ...prev,
      [tabName]: newData,
    }));
  };

  const handleSave = async () => {
    try {
      // const savePromises = [];

      // Treatment Location save
      if (formStates.treatmentLocation) {
        // savePromises.push(
        const response = await axios.post(
          origin + "/api/treatment/edit-contact-info/",
          {
            location_id: contact?.id,
            ...formStates.treatmentLocation,
          }
        );
        // setContact(response?.data);
        // );
      }

      // Records Received save
      if (formStates.recordsReceived) {
        // Contact info save
        const contactResponse = await axios.post(
          origin + "/api/treatment/edit-contact-info/",
          {
            location_id: treatmentRecord?.id,
            ...formStates.recordsReceived,
          }
        );
        // setTreatmentRecord(contactResponse?.data);

        // Case provider save
        const caseProviderResponse = await axios.patch(
          `${origin}/api/treatment/update/case-provider/${caseProvider?.id}/`,
          {
            records_ordered: formStates.recordsReceived.requestOrdered,
            records_received: formStates.recordsReceived.requestReceived,
            records_paid: formStates.recordsReceived.requestPaidTime,
            records_paid_time: formStates.recordsReceived.requestPaid,
            records_cost: formStates.recordsReceived.requestCost,
          }
        );

        // Update any additional state if needed
        if (caseProviderResponse?.data) {
          // Handle response if needed
        }
      }

      // Bills Received save
      if (formStates.billsReceived) {
        // First API call (contact info)
        const response = await axios.post(
          origin + "/api/treatment/edit-contact-info/",
          {
            location_id: treatmentBill?.id,
            ...formStates.billsReceived,
          }
        );
        // setTreatmentBill(response?.data);

        // Second API call (case provider update)
        const caseProviderResponse = await axios.patch(
          `${origin}/api/treatment/update/case-provider/${caseProvider?.id}/`,
          {
            billing_ordered: formStates.billsReceived.billingOrdered,
            billing_received: formStates.billsReceived.billingReceived,
            billing_paid: formStates.billsReceived.billingPaidTime,
            billing_paid_time: formStates.billsReceived.billingPaid,
            billing_cost: formStates.billsReceived.billingCost,
          }
        );
        if (caseProviderResponse?.data) {
          // Update the form state with the response data
          setFormStates((prev) => ({
            ...prev,
            billsReceived: {
              ...prev.billsReceived,
              billingOrdered: caseProviderResponse.data.billing_ordered,
              billingReceived: caseProviderResponse.data.billing_received,
            },
          }));
        }
      }

      // Records Paid save
      if (formStates.recordsPaid) {
        // Contact info save
        const contactResponse = await axios.post(
          origin + "/api/treatment/edit-contact-info/",
          {
            location_id: paidRecords?.id,
            ...formStates.recordsPaid,
          }
        );
        // setPaidRecords(contactResponse?.data);

        // Case provider save
        const caseProviderResponse = await axios.patch(
          `${origin}/api/treatment/update/case-provider/${caseProvider?.id}/`,
          {
            records_ordered: formStates.recordsPaid.requestOrdered,
            records_received: formStates.recordsPaid.requestReceived,
            records_paid: formStates.recordsPaid.requestPaidTime,
            records_paid_time: formStates.recordsPaid.requestPaid,
            records_cost: formStates.recordsPaid.requestCost,
          }
        );

        // Update any additional state if needed
        if (caseProviderResponse?.data) {
          // Handle response if needed
        }
      }

      if (formStates.billsPaid) {
        // First API call (contact info)
        const response = await axios.post(
          origin + "/api/treatment/edit-contact-info/",
          {
            location_id: paidBill?.id,
            ...formStates.billsPaid,
          }
        );
        // setPaidBill(response?.data);

        // Second API call (case provider update)
        const caseProviderResponse = await axios.patch(
          `${origin}/api/treatment/update/case-provider/${caseProvider?.id}/`,
          {
            billing_ordered: formStates.billsPaid.billingOrdered,
            billing_received: formStates.billsPaid.billingReceived,
            billing_paid: formStates.billsPaid.billingPaidTime,
            billing_paid_time: formStates.billsPaid.billingPaid,
            billing_cost: formStates.billsPaid.billingCost,
          }
        );

        if (caseProviderResponse?.data) {
          // Update the form state with the response data
          setFormStates((prev) => ({
            ...prev,
            billsPaid: {
              ...prev.billsPaid,
              billingOrdered: caseProviderResponse.data.billing_ordered,
              billingReceived: caseProviderResponse.data.billing_received,
            },
          }));
        }
      }

      if (formStates.lienHolder) {
        // Contact info save
        const contactResponse = await axios.post(
          origin + "/api/treatment/edit-contact-info/",
          {
            location_id: lienHolder?.id,
            ...formStates.lienHolder,
          }
        );
        // setLienHolder(contactResponse?.data);

        // Case provider update
        const caseProviderResponse = await axios.patch(
          `${origin}/api/treatment/update/case-provider/${caseProvider?.id}/`,
          {
            balance: formStates.lienHolder.lineHolderBalance,
            balance_confirmed: formStates.lienHolder.lineHolderBalanceConfirm,
          }
        );

        if (caseProviderResponse?.data) {
          console.log("line holder update!");
        }
      }
      // if (formStates.treatmentDates) {
      //   const caseProviderResponse = await axios.put(
      //     `${origin}/api/treatment/update/case-provider/${caseProvider?.id}/`,
      //     {
      //       first_appointment: formStates.treatmentDates.firstDate,
      //       last_appointment: formStates.treatmentDates.lastDate,
      //       visits: formStates.treatmentDates.visitCount,
      //       treatment_complete: formStates.treatmentDates.completeTreatment,
      //     }
      //   );

      //   if (caseProviderResponse.data) {
      //     // Update the form state with the response data if needed
      //     setFormStates((prev) => ({
      //       ...prev,
      //       treatmentDates: {
      //         ...prev.treatmentDates,
      //         // Update any fields from response if needed
      //       },
      //     }));
      //   }
      // }
      // if (formStates.providerCharges) {
      //   await axios.post(
      //     `${origin}/api/treatment/medical-provider-charges-edit/`,
      //     {
      //       caseProviderId: caseProvider?.id,
      //       "provider-amount":
      //         parseFloat(formStates.providerCharges.providerAmount) || 0,
      //       "provider-ins_paid":
      //         parseFloat(formStates.providerCharges.providerInsPaid) || 0,
      //       "provider-write_off":
      //         parseFloat(formStates.providerCharges.providerWriteOff) || 0,
      //       "provider-medpaypaip":
      //         parseFloat(formStates.providerCharges.providerMedPay) || 0,
      //       "provider-reduction":
      //         parseFloat(formStates.providerCharges.providerReduction) || 0,
      //       "provider-patient_paid":
      //         parseFloat(formStates.providerCharges.providerPatientPaid) || 0,
      //       providerLiens:
      //         parseFloat(formStates.providerCharges.providerLiens) || 0,
      //       // "provider-amount": formStates.providerCharges.providerAmount,
      //       // "provider-ins_paid": formStates.providerCharges.providerInsPaid,
      //       // "provider-write_off": formStates.providerCharges.providerWriteOff,
      //       // "provider-medpaypaip": formStates.providerCharges.providerMedPay,
      //       // "provider-reduction": formStates.providerCharges.providerReduction,
      //       // "provider-patient_paid":
      //       //   formStates.providerCharges.providerPatientPaid,
      //       // providerLiens: formStates.providerCharges.providerLiens,
      //     }
      //   );
      // }

      handleClose();
      refetchAll();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        origin + "/api/delete-caseprovider/",
        {
          headers: { Authorization: token },
          data: {
            provider_id: caseProvider?.id,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        refetchAll();
      }
    } catch (error) {
      console.error("Error deleting provider:", error);
    }
  };
  const {
    data: verifyInfo,
    refetch: refetchAllParams,
    params,
  } = useGetVerificationInfo(
    caseProvider?.id,
    "billing_ordered,billing_received,billsCost,bills_request_paid,treatment_complete,record_ordered,record_received,recordCost,rec_request_paid,balance_confirmed,final"
  );
  // useEffect(() => {
  //   async function fetchRequestBillingVerification() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-billing_ordered/"
  //     );
  //     setIsRequestBillingVerified(data);
  //   }

  //   fetchRequestBillingVerification();
  // }, []);

  // useEffect(() => {
  //   async function fetchIsReceivedBillingVerified() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-billing_received/"
  //     );
  //     setIsReceivedBillingVerified(data);
  //   }

  //   fetchIsReceivedBillingVerified();
  // }, []);

  // useEffect(() => {
  //   async function fetchIsBillingCostVerified() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-billsCost/"
  //     );
  //     setIsBillingCostVerified(data);
  //   }

  //   fetchIsBillingCostVerified();
  // }, []);

  // useEffect(() => {
  //   async function fetchIsBillingPaidVerified() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-bills_request_paid/"
  //     );
  //     setIsBillingPaidVerified(data);
  //   }

  //   fetchIsBillingPaidVerified();
  // }, []);

  // useEffect(() => {
  //   async function fetchVerification() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-treatment_complete/"
  //     );
  //     setIsTreatmentCompleteVerified(data);
  //   }

  //   fetchVerification();
  // }, [caseProvider?.id]);

  // const [isRequestRecordVerified, setIsRequestRecordVerified] = useState([]);
  // const [isRequestRecivedVerified, setIsRequestRecivedVerified] = useState([]);
  // const [isRecordCostVerified, setIsRecordCostVerified] = useState([]);
  // const [isRecordPaidVerified, setIsRecordPaidVerified] = useState([]);

  // const [isLineHolderBalanceVerified, setIsLineHolderBalanceVerified] =
  //   useState([]);
  // const [
  //   isLineHolderBalanceConfirmedVerified,
  //   setIsLineHolderBalanceConfirmedVerified,
  // ] = useState([]);

  // useEffect(() => {
  //   async function fetchIsRequestRecordVerified() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-record_ordered/"
  //     );
  //     setIsRequestRecordVerified(data);
  //   }

  //   fetchIsRequestRecordVerified();
  // }, [caseProvider?.id]);

  // useEffect(() => {
  //   async function fetchIsRequestRecivedVerified() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-record_received/"
  //     );
  //     setIsRequestRecivedVerified(data);
  //   }

  //   fetchIsRequestRecivedVerified();
  // }, [caseProvider?.id]);

  // useEffect(() => {
  //   async function fetchIsRecordCostVerified() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-recordCost/"
  //     );
  //     setIsRecordCostVerified(data);
  //   }

  //   fetchIsRecordCostVerified();
  // }, [caseProvider?.id]);

  // useEffect(() => {
  //   async function fetchIsRecordPaidVerified() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-rec_request_paid/"
  //     );
  //     setIsRecordPaidVerified(data);
  //   }

  //   fetchIsRecordPaidVerified();
  // }, [caseProvider?.id]);

  // useEffect(() => {
  //   async function fetchIsLineHolderBalanceVerified() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-final/"
  //     );
  //     setIsLineHolderBalanceVerified(data);
  //   }

  //   fetchIsLineHolderBalanceVerified();
  // }, [caseProvider?.id]);

  // useEffect(() => {
  //   async function fetchIsLineHolderBalanceConfirmedVerified() {
  //     const { data } = await axios.get(
  //       origin +
  //         "/api/treatment/get-single-verification-info/" +
  //         caseProvider?.id +
  //         "/CaseProviders-balance_confirmed/"
  //     );
  //     setIsLineHolderBalanceConfirmedVerified(data);
  //   }

  //   fetchIsLineHolderBalanceConfirmedVerified();
  // }, [caseProvider?.id]);

  // const renderContent = () => {
  //   switch (activeTab) {
  //     case "Treatment-Location":
  //       return (
  //         <TreatmentLocation
  //           formData={formStates.treatmentLocation}
  //           onChange={(newData) =>
  //             updateFormState("treatmentLocation", newData)
  //           }
  //           contact={contact}
  //           specialitie={specialitie}
  //         />
  //       );
  //     case "Bills-Recieved":
  //       return (
  //         <BillsRecieved
  //           formData={formStates?.billsReceived}
  //           onChange={(newData) => updateFormState("billsReceived", newData)}
  //           specialitie={specialitie}
  //           caseProvider={caseProvider}
  //           verification={verifyInfo?.verification_info}
  //           refetchAllParams={refetchAllParams}
  //           isRequestBillingVerified={isRequestBillingVerified} billing_ordered
  //           isReceivedBillingVerified={isReceivedBillingVerified} billing_received
  //           isBillingCostVerified={isBillingCostVerified} billsCost
  //           isBillingPaidVerified={isBillingPaidVerified} bills_request_paid
  //           isReceivedBillingVerified={isReceivedBillingVerified}
  //           isBillingCostVerified={isBillingCostVerified}
  //           isBillingPaidVerified={isBillingPaidVerified}
  //           ! above needs to be inputed later
  //             setIsRequestBillingVerified={setIsRequestBillingVerified}
  //             setIsReceivedBillingVerified={setIsReceivedBillingVerified}
  //             setIsBillingCostVerified={setIsBillingCostVerified}
  //             setIsBillingPaidVerified={setIsBillingPaidVerified}
  //             onUpdate={onUpdate}
  //             updateCall={updateCall}
  //         />
  //       );
  //     case "Bills-Paid":
  //       return (
  //         <BillsRequestPaid
  //           formData={formStates?.billsPaid}
  //           onChange={(newData) => updateFormState("billsPaid", newData)}
  //           specialitie={specialitie}
  //           caseProvider={caseProvider}
  //           verification={verifyInfo?.verification_info}
  //           refetchAllParams={refetchAllParams}
  //           isRequestBillingVerified={isRequestBillingVerified}
  //           isReceivedBillingVerified={isReceivedBillingVerified}
  //           isBillingCostVerified={isBillingCostVerified}
  //           isBillingPaidVerified={isBillingPaidVerified}
  //           ! above needs to be inputed later
  //             setIsRequestBillingVerified={setIsRequestBillingVerified}
  //             setIsReceivedBillingVerified={setIsReceivedBillingVerified}
  //             setIsBillingCostVerified={setIsBillingCostVerified}
  //             setIsBillingPaidVerified={setIsBillingPaidVerified}
  //             onUpdate={onUpdate}
  //             updateCall={updateCall}
  //         />
  //       );
  //     case "Records-Recieved":
  //       return (
  //         <RecordsRecieved
  //           formData={formStates.recordsReceived}
  //           onChange={(newData) => updateFormState("recordsReceived", newData)}
  //           specialitie={specialitie}
  //           caseProvider={caseProvider}
  //           verification={verifyInfo?.verification_info}
  //           refetchAllParams={refetchAllParams}
  //           isRequestRecordVerified={isRequestRecordVerified}
  //           isRequestRecivedVerified={isRequestRecivedVerified}
  //           isRecordCostVerified={isRecordCostVerified}
  //           isRecordPaidVerified={isRecordPaidVerified}
  //           ! above needs to be inputed later
  //             setIsRequestRecordVerified={setIsRequestRecordVerified}
  //             setIsRequestRecivedVerified={setIsRequestRecivedVerified}
  //             setIsRecordCostVerified={setIsRecordCostVerified}
  //             setIsRecordPaidVerified={setIsRecordPaidVerified}
  //             onUpdate={onUpdate}
  //             updateCall={updateCall}
  //         />
  //       );
  //     case "Records-Paid":
  //       return (
  //         <RecordsPaid
  //           formData={formStates.recordsPaid}
  //           onChange={(newData) => updateFormState("recordsPaid", newData)}
  //           specialitie={specialitie}
  //           caseProvider={caseProvider}
  //           verification={verifyInfo?.verification_info}
  //           refetchAllParams={refetchAllParams}
  //           isRequestRecordVerified={isRequestRecordVerified}
  //           isRequestRecivedVerified={isRequestRecivedVerified}
  //           isRecordCostVerified={isRecordCostVerified}
  //           isRecordPaidVerified={isRecordPaidVerified}
  //           ! above needs to be inputed later
  //             setIsRequestRecordVerified={setIsRequestRecordVerified}
  //             setIsRequestRecivedVerified={setIsRequestRecivedVerified}
  //             setIsRecordCostVerified={setIsRecordCostVerified}
  //             setIsRecordPaidVerified={setIsRecordPaidVerified}
  //             onUpdate={onUpdate}
  //             updateCall={updateCall}
  //         />
  //       );
  //     case "Lien-Holder":
  //       return (
  //         <LineHolder
  //           formData={formStates.lienHolder}
  //           onChange={(newData) => updateFormState("lienHolder", newData)}
  //           caseProvider={caseProvider}
  //           specialitie={specialitie}
  //           verification={verifyInfo?.verification_info}
  //           refetchAllParams={refetchAllParams}
  //           isLineHolderBalanceVerified={isLineHolderBalanceVerified}
  //           isLineHolderBalanceConfirmedVerified={
  //             isLineHolderBalanceConfirmedVerified
  //           }
  //           ! above needs to be inputed later
  //           setIsLineHolderBalanceVerified={setIsLineHolderBalanceVerified}
  //           setIsLineHolderBalanceConfirmedVerified={
  //             setIsLineHolderBalanceConfirmedVerified
  //           }
  //           onUpdate={onUpdate}
  //           updateCall={updateCall}
  //         />
  //       );
  //     case "Treatment-Dates":
  //       return (
  //         <TreatmentDate
  //           formData={formStates.treatmentDates} // Add this
  //           onChange={(newData) => updateFormState("treatmentDates", newData)}
  //           contact={contact}
  //           caseProvider={caseProvider}
  //           specialitie={specialitie}
  //           allTreatmentDates={allTreatmentDates}
  //           setAllTreatmentDates={setAllTreatmentDates}
  //           verification={verification}
  //           isTreatmentCompleteVerified={verifyInfo?.verification_info}
  //           refetch={refetch}
  //           refetchAllParams={refetchAllParams}
  //           ! above needs to be inputed later
  //             onUpdate={onUpdate}
  //             updateCall={updateCall}
  //           setIsTreatmentDateFirstVerified={
  //             setIsTreatmentDateFirstVerified
  //           }
  //           setIsTreatmentDateLastVerified={setIsTreatmentDateLastVerified}
  //           setIsTreatmentDateVisitVerified={
  //             setIsTreatmentDateVisitVerified
  //           }
  //           setIsTreatmentCompleteVerified={setIsTreatmentCompleteVerified}
  //         />
  //       );
  //     case "Provider-Charges":
  //       return (
  //         <ProviderCharges
  //           formData={formStates.providerCharges} // Pass the relevant slice of formStates
  //           onChange={(newData) => updateFormState("providerCharges", newData)}
  //           caseProviderId={caseProvider?.id}
  //           specialitie={specialitie}
  //           contact={contact}
  //           firmName={firmName}
  //         />
  //       );
  //     default:
  //       return null;
  //   }
  // };
  const [instanceIdForGenragteDoc, setInstanceIdForGenragteDoc] = useState();
  const [showGenerateDocument, setShowGenerateDocument] = useState(false);
  const [dropdownName, setDropdownName] = useState("");
  const [stateNewShow, setStateNewShow] = useState(false);

  const handleGenrateDocument = (instanceId, name) => {
    console.log("FUNCTION IS CALLED");
    console.log("HGD instance id == :: ", instanceId);
    console.log(name);
    setInstanceIdForGenragteDoc(instanceId);
    setDropdownName(name);
    setShowGenerateDocument(true);
  };
  return (
    <>
      <Modal
        dialogClassName="modal-width-max-content "
        contentClassName="modal-border-radius-edit-provider"
        show={show}
        onHide={handleClose}
        centered
        style={{
          opacity: stateNewShow ? 0.5 : 1,
        }}
      >
        <div className="modal-height-max-content">
          <div
            className={`has-speciality-color-${specialitie?.id} d-flex align-items-center`}
            style={{ borderBottom: "1px solid #e9ecef", gap: "5px" }}
          >
            <div
              style={{ position: "relative" }}
              className="d-flex  align-items-center"
            >
              <div
                className="d-flex p-r-5 p-l-5 justify-content-start align-items-center bg-speciality"
                style={{
                  color: "white",
                  // backgroundColor: specialitie?.color,
                  fontSize: "16px",
                  fontWeight: "600",
                  height: "25px",
                }}
              >
                {specialitie?.name}
              </div>
              <div
                style={{
                  // backgroundColor: mixColorWithWhite(specialitie?.color, 10),
                  fontSize: "14px",
                  height: "25px",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  fontWeight: "600",
                }}
                className="d-flex justify-content-start align-items-center bg-speciality-10"
              >
                {contact?.name}
              </div>
            </div>
            <h5
              style={{
                height: "25px",
                fontSize: "14px",
              }}
              className="d-flex justify-content-center align-items-center"
            >
              {contact?.name ? `Edit ${contact?.name}` : "Edit Case Provider"}
            </h5>
          </div>
          <Modal.Body
            className="p-0"
            style={{ overflow: "hidden", minWidth: "auto" }}
          >
            <div className="custom-tab">
              <Tab.Container defaultActiveKey={activeTab}>
                <Nav
                  variant="tabs"
                  className="justify-content-around"
                  style={{ marginTop: "5px", marginBottom: "5px" }}
                >
                  <Nav.Link
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite apply-before"
                    eventKey="Treatment-Location"
                    onClick={() => setActiveTab("Treatment-Location")}
                  >
                    Treatment Location
                  </Nav.Link>

                  <Nav.Link
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite "
                    eventKey="Records-Recieved"
                    onClick={() => setActiveTab("Records-Recieved")}
                  >
                    Order Records
                  </Nav.Link>
                  <Nav.Link
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite"
                    eventKey="Bills-Recieved"
                    onClick={() => setActiveTab("Bills-Recieved")}
                  >
                    Order Billing
                  </Nav.Link>
                  <Nav.Link
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite "
                    eventKey="Records-Paid"
                    onClick={() => setActiveTab("Records-Paid")}
                  >
                    Pay for Records
                  </Nav.Link>
                  <Nav.Link
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite "
                    eventKey="Bills-Paid"
                    onClick={() => setActiveTab("Bills-Paid")}
                  >
                    Pay for Billing
                  </Nav.Link>
                  <Nav.Link
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite apply-after"
                    eventKey="Lien-Holder"
                    onClick={() => setActiveTab("Lien-Holder")}
                  >
                    Lien Holder
                  </Nav.Link>
                </Nav>
                <div className="">
                  <Tab.Content>
                    <Tab.Pane eventKey="Treatment-Location">
                      <TreatmentLocation
                        formData={formStates.treatmentLocation}
                        onChange={(newData) =>
                          updateFormState("treatmentLocation", newData)
                        }
                        contact={contact}
                        specialitie={specialitie}
                        generateDoc={handleGenrateDocument}
                        setStateNewShow={setStateNewShow}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="Records-Recieved">
                      <RecordsRecieved
                        formData={formStates.recordsReceived}
                        onChange={(newData) => {
                          updateFormState("recordsReceived", newData);
                          if (
                            newData.requestOrdered ||
                            newData.requestReceived ||
                            newData.requestCost ||
                            newData.requestPaidTime ||
                            newData.requestPaid
                          ) {
                            updateFormState("recordsPaid", {
                              ...formStates.recordsPaid,
                              requestOrdered: newData.requestOrdered,
                              requestReceived: newData.requestReceived,
                              requestCost: newData.requestCost,
                              requestPaidTime: newData.requestPaidTime,
                              requestPaid: newData.requestPaid,
                            });
                          }
                        }}
                        specialitie={specialitie}
                        caseProvider={caseProvider}
                        // isRequestRecordVerified={isRequestRecordVerified}
                        // isRequestRecivedVerified={isRequestRecivedVerified}
                        // isRecordCostVerified={isRecordCostVerified}
                        verification={verifyInfo?.verification_info}
                        refetchAllParams={refetchAllParams}
                        generateDoc={handleGenrateDocument}
                        // isRecordPaidVerified={isRecordPaidVerified}
                        //! above needs to be inputed later
                        //   setIsRequestRecordVerified={setIsRequestRecordVerified}
                        //   setIsRequestRecivedVerified={setIsRequestRecivedVerified}
                        //   setIsRecordCostVerified={setIsRecordCostVerified}
                        //   setIsRecordPaidVerified={setIsRecordPaidVerified}
                        //   onUpdate={onUpdate}
                        //   updateCall={updateCall}
                        setStateNewShow={setStateNewShow}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="Bills-Recieved">
                      <BillsRecieved
                        formData={formStates?.billsReceived}
                        onChange={(newData) => {
                          updateFormState("billsReceived", newData);
                          if (
                            newData.billingOrdered ||
                            newData.billingReceived ||
                            newData.billingCost ||
                            newData.billingPaidTime ||
                            newData.billingPaid
                          ) {
                            updateFormState("billsPaid", {
                              ...formStates.billsPaid,
                              billingOrdered: newData.billingOrdered,
                              billingReceived: newData.billingReceived,
                              billingCost: newData.billingCost,
                              billingPaidTime: newData.billingPaidTime,
                              billingPaid: newData.billingPaid,
                            });
                          }
                        }}
                        specialitie={specialitie}
                        caseProvider={caseProvider}
                        verification={verifyInfo?.verification_info}
                        refetchAllParams={refetchAllParams}
                        generateDoc={handleGenrateDocument}
                        setStateNewShow={setStateNewShow}
                        // isRequestBillingVerified={isRequestBillingVerified} billing_ordered
                        // isReceivedBillingVerified={isReceivedBillingVerified} billing_received
                        // isBillingCostVerified={isBillingCostVerified} billsCost
                        // isBillingPaidVerified={isBillingPaidVerified} bills_request_paid
                        // isReceivedBillingVerified={isReceivedBillingVerified}
                        // isBillingCostVerified={isBillingCostVerified}
                        // isBillingPaidVerified={isBillingPaidVerified}
                        //! above needs to be inputed later
                        //   setIsRequestBillingVerified={setIsRequestBillingVerified}
                        //   setIsReceivedBillingVerified={setIsReceivedBillingVerified}
                        //   setIsBillingCostVerified={setIsBillingCostVerified}
                        //   setIsBillingPaidVerified={setIsBillingPaidVerified}
                        //   onUpdate={onUpdate}
                        //   updateCall={updateCall}
                      />
                    </Tab.Pane>

                    <Tab.Pane eventKey="Records-Paid">
                      <RecordsPaid
                        formData={formStates.recordsPaid}
                        onChange={(newData) => {
                          updateFormState("recordsPaid", newData);
                          if (
                            newData.requestOrdered ||
                            newData.requestReceived ||
                            newData.requestCost ||
                            newData.requestPaidTime ||
                            newData.requestPaid
                          ) {
                            updateFormState("recordsReceived", {
                              ...formStates.recordsReceived,
                              requestOrdered: newData.requestOrdered,
                              requestReceived: newData.requestReceived,
                              requestCost: newData.requestCost,
                              requestPaidTime: newData.requestPaidTime,
                              requestPaid: newData.requestPaid,
                            });
                          }
                        }}
                        specialitie={specialitie}
                        caseProvider={caseProvider}
                        verification={verifyInfo?.verification_info}
                        refetchAllParams={refetchAllParams}
                        generateDoc={handleGenrateDocument}
                        setStateNewShow={setStateNewShow}
                        // isRequestRecordVerified={isRequestRecordVerified}
                        // isRequestRecivedVerified={isRequestRecivedVerified}
                        // isRecordCostVerified={isRecordCostVerified}
                        // isRecordPaidVerified={isRecordPaidVerified}
                        //! above needs to be inputed later
                        //   setIsRequestRecordVerified={setIsRequestRecordVerified}
                        //   setIsRequestRecivedVerified={setIsRequestRecivedVerified}
                        //   setIsRecordCostVerified={setIsRecordCostVerified}
                        //   setIsRecordPaidVerified={setIsRecordPaidVerified}
                        //   onUpdate={onUpdate}
                        //   updateCall={updateCall}
                      />
                    </Tab.Pane>

                    <Tab.Pane eventKey="Bills-Paid">
                      <BillsRequestPaid
                        formData={formStates?.billsPaid}
                        onChange={(newData) => {
                          updateFormState("billsPaid", newData);
                          if (
                            newData.billingOrdered ||
                            newData.billingReceived ||
                            newData.billingCost ||
                            newData.billingPaidTime ||
                            newData.billingPaid
                          ) {
                            updateFormState("billsReceived", {
                              ...formStates.billsPaid,
                              billingOrdered: newData.billingOrdered,
                              billingReceived: newData.billingReceived,
                              billingCost: newData.billingCost,
                              billingPaidTime: newData.billingPaidTime,
                              billingPaid: newData.billingPaid,
                            });
                          }
                        }}
                        specialitie={specialitie}
                        caseProvider={caseProvider}
                        verification={verifyInfo?.verification_info}
                        refetchAllParams={refetchAllParams}
                        generateDoc={handleGenrateDocument}
                        setStateNewShow={setStateNewShow}
                        // isRequestBillingVerified={isRequestBillingVerified}
                        // isReceivedBillingVerified={isReceivedBillingVerified}
                        // isBillingCostVerified={isBillingCostVerified}
                        // isBillingPaidVerified={isBillingPaidVerified}
                        //! above needs to be inputed later
                        //   setIsRequestBillingVerified={setIsRequestBillingVerified}
                        //   setIsReceivedBillingVerified={setIsReceivedBillingVerified}
                        //   setIsBillingCostVerified={setIsBillingCostVerified}
                        //   setIsBillingPaidVerified={setIsBillingPaidVerified}
                        //   onUpdate={onUpdate}
                        //   updateCall={updateCall}
                      />
                    </Tab.Pane>

                    <Tab.Pane eventKey="Lien-Holder">
                      <LineHolder
                        formData={formStates.lienHolder}
                        onChange={(newData) =>
                          updateFormState("lienHolder", newData)
                        }
                        caseProvider={caseProvider}
                        specialitie={specialitie}
                        verification={verifyInfo?.verification_info}
                        refetchAllParams={refetchAllParams}
                        generateDoc={handleGenrateDocument}
                        setStateNewShow={setStateNewShow}
                        // isLineHolderBalanceVerified={isLineHolderBalanceVerified}
                        // isLineHolderBalanceConfirmedVerified={
                        //   isLineHolderBalanceConfirmedVerified
                        // }
                        //! above needs to be inputed later
                        // setIsLineHolderBalanceVerified={setIsLineHolderBalanceVerified}
                        // setIsLineHolderBalanceConfirmedVerified={
                        //   setIsLineHolderBalanceConfirmedVerified
                        // }
                        // onUpdate={onUpdate}
                        // updateCall={updateCall}
                      />
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>
            </div>

            {/* <div style={{ overflowX: "hidden" }}>{renderContent()}</div> */}
          </Modal.Body>
        </div>
        <Modal.Footer style={{ padding: "6px 12px", margin: "0" }}>
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-danger"
            data-dismiss="modal"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            type="button"
            className="btn btn-success"
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>

      {showGenerateDocument && (
        <GenrateDocument
          show={true}
          handleClose={() => setShowGenerateDocument(false)}
          PageEntity="Treatment"
          instanceId={instanceIdForGenragteDoc}
          dropdownName={dropdownName}
        />
      )}
    </>
  );
};

export default React.memo(NewEditCaseProviderModal);
