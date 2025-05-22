import React,{ useState,useEffect,useRef } from 'react'
import { Form, Alert } from "react-bootstrap";
import DefendantFields from "./DefendantFields";
import OfferFields from "./OfferFields";
import MediationFields from "./MediationFields";
import SettlementConferenceFields from "./SettlementConferenceFields";
import GenericTabs from "../../common/GenericTab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCaseId,getClientId,getCurrentDate, getFutureDate } from '../../../Utils/helper';
import addOffer from '../../SettlementDashboard/api/addOffer';

const AddOfferPopUp = ({ addOfferObj, handleDisableSaveBtn, handleClose }) => {
  const { show, types, offerCombinations,partiesCombinations, updateOffersState, updateClientProceedStates, updateFeesState, updateGroupedOffersState } = addOfferObj;
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const conferenceFormik = useFormik({
    initialValues: {
        settlement_conference_date: getCurrentDate(), // required
        settlement_conference_litigation_event: false, // required
        entity: '', // required
        note: '', // optional
        by_entity: '', // optional
    },
    validationSchema: Yup.object({
        settlement_conference_date: Yup.date(),
        settlement_conference_litigation_event: Yup.boolean(),
        entity: Yup.string().required("Defendant Information is required"),
        note: Yup.string().nullable(),
        by_entity: Yup.string().required("Plaintiff Information is required"),
    }),
    onSubmit: async (values) => {
      if(conferenceFormik.values.entity == "" || conferenceFormik.values.by_entity == ""){
        setShowAlert(true);
        const msg = conferenceFormik.values.entity == "" && conferenceFormik.values.by_entity == "" ? "Offeror and Offeree" : conferenceFormik.values.by_entity == "" ? "Offeror" : conferenceFormik.values.entity == "" ? `Offeree` : "";
        setAlertMessage(`${msg} Information is required.`);
        return;
      }
      const handleConferenceSubmit = async () => {
        const dateWithZeros = (date) => {
          const d = new Date(date);
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const year = d.getFullYear();
          return `${month}/${day}/${year}`;
        };
          // Convert values to strings (if required)
          const transformedValues = Object.fromEntries(
              Object.entries(values).map(([key, value]) => [key, value.toString()])
          );
  
          const payload = {
              case_id:getCaseId(),
              client_id:getClientId(),
              ...transformedValues,
              "settlement-conference-date": dateWithZeros(values.settlement_conference_date)
          };
          console.log(payload)
          const res = await addOffer(payload,"add-offer-settlement-conference");
          updateClientProceedStates();
          updateOffersState();
          updateGroupedOffersState();
          updateFeesState();
          handleClose();
      }
      handleConferenceSubmit();  
    },
  });

  const demandFormik = useFormik({
    initialValues: {
        "expiration-date":getFutureDate(30),
        "date-sent":getCurrentDate(),
        demand: 0.00,
        demand_draft:"",
        demand_final:"",
        entity: '', 
        note: '', 
        by_entity: '',
    },
    validationSchema: Yup.object({
        "expiration-date": Yup.date(),
        "date-sent": Yup.date(),
        demand: Yup.number().required("Amount is required"),
        entity: Yup.string(),
        note: Yup.string().nullable(),
        by_entity: Yup.string(),
    }),
    onSubmit: async (values) => {
      if(demandFormik.values.entity == "" || demandFormik.values.by_entity == ""){
        setShowAlert(true);
        const msg = demandFormik.values.entity == "" && demandFormik.values.by_entity == "" ? "Offeror and Offeree" : demandFormik.values.by_entity == "" ? "Offeror" : demandFormik.values.entity == "" ? `Offeree` : "";
        setAlertMessage(`${msg} Information is required.`);
        return;
      }
      if(demandFormik.values.entity.split(',')[2]===" defendant" && demandFormik.values.by_entity.split(',')[2] === " defendant"){
        setShowAlert(true);
        setAlertMessage("Offeree and Offeror cannot be both Defendant");
        return;
      }
      const handleDemandSubmit = async()=>{
        const dateWithZeros = (date) => {
          const d = new Date(date);
          const month = String(d.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
          const day = String(d.getDate()).padStart(2, '0'); // Ensure two-digit day
          const year = d.getFullYear();
          return `${month}/${day}/${year}`; // Correct format MM/DD/YYYY
      };
  
      // Format the dates first
      const formattedValues = {
          ...values,
          "expiration-date": dateWithZeros(values["expiration-date"]),
          "date-sent": dateWithZeros(values["date-sent"]),
          
      };
  
      const transformedValues = Object.fromEntries(
          Object.entries(formattedValues)
              .filter(([key]) => key !== "demand") // Exclude "demand" key
              .map(([key, value]) => [key, value.toString()])
      );
  
      const { demand_draft, demand_final, ...restValues } = transformedValues;
  
      const doc_demand = [];
      if (values["demand_draft"] !== "") doc_demand.push(values["demand_draft"]);
      if (values["demand_final"] !== "") doc_demand.push(values["demand_final"]);
  
      const payload = {
          case_id: getCaseId(),
          client_id: getClientId(),
          offer_type_id:parseInt(selectedLabel1?.id),
          document_type_demand: JSON.stringify(doc_demand),
          demand: parseFloat(values["demand"]),
          ...restValues,
      };
  
      console.log(payload);
      const res = await addOffer(payload, "add-offer-demand");
      updateClientProceedStates();
      updateOffersState();
      updateGroupedOffersState();
      updateFeesState();
      handleClose();
      }
      handleDemandSubmit();
    },
  });

  const mediationFormik = useFormik({
  initialValues: {
      mediation_date:getCurrentDate(),
      mediation_litigation_event: false,
      entity: '', 
      note: '', 
      by_entity: '',
  },
  validationSchema: Yup.object({
      mediation_date: Yup.date(),
      mediation_litigation_event: Yup.boolean(),
      entity: Yup.string(),
      note: Yup.string().nullable(),
      by_entity: Yup.string(),
  }),
  onSubmit: (values) => {
    if(mediationFormik.values.entity == "" || mediationFormik.values.by_entity == ""){
      setShowAlert(true);
      const msg = mediationFormik.values.entity == "" && mediationFormik.values.by_entity == "" ? "Offeror and Offeree" : mediationFormik.values.by_entity == "" ? "Offeror" : mediationFormik.values.entity == "" ? `Offeree` : "";
      setAlertMessage(`${msg} Information is required.`);
      return;
    }
    const handleMediationSubmit = async ()=>{
      const dateWithZeros = (date) => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${month}/${day}/${year}`;
      };
  
      const transformedValues = Object.fromEntries(
          Object.entries(values).map(([key, value]) => [key, value.toString()])
      );
  
      const payload = {
          case_id: getCaseId(),
          client_id: getClientId(),
          ...transformedValues,
          "mediation-date": dateWithZeros(values.mediation_date),
          
      };
  
      console.log(payload);
      const res = await addOffer(payload, "add-offer-mediation");
      updateClientProceedStates();
      updateOffersState();
      updateGroupedOffersState();
      updateFeesState();
      handleClose();
    }
    handleMediationSubmit();
  },
  });

  const offerFormik = useFormik({
    initialValues: {
        date:getCurrentDate(),
        amount: 0,
        offer_draft:"",
        offer_final:"",
        entity: '', 
        note: '', 
        by_entity: '',
    },
    validationSchema: Yup.object({
        date: Yup.date(),
        amount: Yup.number().required("Amount is required"),
        entity: Yup.string(),
        note: Yup.string().nullable(),
        by_entity: Yup.string(),
    }),
    onSubmit: (values) => {
      if(offerFormik.values.entity == "" || offerFormik.values.by_entity == ""){
        setShowAlert(true);
        const msg = offerFormik.values.entity == "" && offerFormik.values.by_entity == "" ? "Offeror and Offeree" : offerFormik.values.by_entity == "" ? "Offeror" : offerFormik.values.entity == "" ? `Offeree` : "";
        setAlertMessage(`${msg} Information is required.`);
        return;
      }
      const handleOfferSubmit = async ()=>{
        const dateWithZeros = (date) => {
          const d = new Date(date);
          const month = String(d.getMonth() + 1).padStart(2, '0'); 
          const day = String(d.getDate()).padStart(2, '0'); 
          const year = d.getFullYear();
          return `${month}/${day}/${year}`;
        };
        const formattedValues = {
            ...values,
            date: dateWithZeros(values.date), 
        };
  
        const transformedValues = Object.fromEntries(
            Object.entries(formattedValues)
                .filter(([key]) => key !== "amount") // Exclude "amount" key
                .map(([key, value]) => [key, value.toString()])
        );
  
        const { offer_draft, offer_final, ...restValues } = transformedValues;
  
        const doc_offer = [];
        if (values["offer_draft"] !== "") doc_offer.push(values["offer_draft"]);
        if (values["offer_final"] !== "") doc_offer.push(values["offer_final"]);
  
        const payload = {
            case_id: getCaseId(),
            client_id: getClientId(),
            document_type_offer: JSON.stringify(doc_offer),
            date: transformedValues.date,
            amount: parseFloat(values.amount),
            ...restValues,
        };
  
        console.log(payload);
        const res = await addOffer(payload, "add-offer-offer");
        updateClientProceedStates();
        updateOffersState();
        updateGroupedOffersState();
        updateFeesState();
        handleClose();
      }
      handleOfferSubmit();
    },
  });
  const [selectedLabel1, setSelectedLabel1] = useState(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const dropdownRef1 = useRef(null);
  const handleDropdownToggle1 = () => {
      setIsOpen1((prev) => !prev);
  };

  const handleSelection1 = (e,label) => {
      e.stopPropagation();
      setSelectedLabel1(label);
      setIsOpen1(false);
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
        setIsOpen1(false);
        }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    conferenceFormik.resetForm();
    demandFormik.resetForm();
    mediationFormik.resetForm();
    offerFormik.resetForm();
    if (show) {
        setAlertMessage("");
        setShowAlert(false); 
    }
  }, [show,selectedLabel1]);

  useEffect(()=>{
    if(!selectedLabel1 || demandFormik.values.demand == '' || demandFormik.values.entity==="" || demandFormik.values.by_entity==="")
    {
        handleDisableSaveBtn(true)
        return;
    }
      handleDisableSaveBtn(false)
    
      
    
  },[selectedLabel1, demandFormik.values.demand, demandFormik.values.entity, demandFormik.values.by_entity])

    const [selectedLabel2, setSelectedLabel2] = useState(null);
  const [isOpen2, setIsOpen2] = useState(false);
  const dropdownRef2 = useRef(null);
  const handleDropdownToggle2 = () => {
      setIsOpen2((prev) => !prev);
  };

  const handleSelection2 = (e,label) => {
      e.stopPropagation();
      setSelectedLabel2(label);
      setIsOpen2(false);
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setIsOpen2(false);
        }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div >
    {/* {show && showAlert && 
    ((selectedLabel1.id === "settlement_conference" && (conferenceFormik.values.entity == "" ||  conferenceFormik.values.by_entity == "")) ||
    (selectedLabel1.id === "demand_or_opening_offer" && (demandFormik.values.entity == "" || demandFormik.values.by_entity == "") ) ||
    (selectedLabel1.id === "offer_or_counter_offer" && (offerFormik.values.entity == "" || offerFormik.values.by_entity== "") ) ||
    (selectedLabel1.id === "mediation" && (mediationFormik.values.entity == "" || mediationFormik.values.by_entity== "") )) && (
      <div className="bottom-right-alert font-wieght-600">
          <Alert variant="danger" 
          onClose={() => {
            setShowAlert(false);
            setAlertMessage("");
          }} dismissible>{alertMessage}</Alert>
      </div>
    )} */}
    {show && showAlert && (
      <div className="bottom-right-alert font-wieght-600">
          <Alert variant="danger" 
          onClose={() => {
            setShowAlert(false);
            setAlertMessage("");
          }} dismissible>{alertMessage}</Alert>
      </div>
    )}
    {/* <div className={`d-flex align-items-center justify-content-center text-uppercase height-25 font-weight-semibold`}>
        <span className='text-uppercase'>Select the </span>
    </div> */}
      <div className='m-t-15 m-b-15'>
          <span className='d-block text-center text-primary font-weight-600'>Panel Instructions</span>
      </div>
      <div className="d-flex m-t-5 m-b-5 align-items-center justify-content-center side-padding-100">
        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 add-offer-input-label text-end">
                Select Negotiating Parties:
        </span>
        <div className="dropdown-container custom-select-state-entity" ref={dropdownRef2}>
            <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle2} style={{ padding: "0px" }}>
                <span className={`${selectedLabel2 ? "color-primary" : "text-grey"} font-weight-semibold`} style={{padding:"5px"}}>
                                {selectedLabel2 ? 
                                <div className='height-25 d-flex align-items-center font-weight-semibold'>
                                    <i className={`ic ic-19 ic-client m-r-5`}></i>
                                    {selectedLabel2?.client?.first_name || ''} {selectedLabel2?.client?.last_name || ''}
                                    {/* {selectedLabel2?.client_insurance && <i className={`ic ic-19 ic-insurance m-l-5 m-r-5`}></i>}
                                    {selectedLabel2?.client_insurance && `${selectedLabel2?.client_insurance?.company || ''}`} */}
                                    <span className='m-l-5 m-r-5 text-uppercase'>vs</span>
                                    <i className={`ic ic-19 ic-defendants m-r-5`}></i>
                                    {selectedLabel2?.defendant?.defendantType?.name === "Private Individual"
                                        ? `${selectedLabel2?.defendant?.first_name || ''} ${selectedLabel2?.defendant?.last_name || ''}`
                                        : `${selectedLabel2?.defendant?.entity_name || ''}`}
                                    {selectedLabel2?.defendant_insurance && <i className={`ic ic-19 ic-insurance m-l-5 m-r-5`}></i>}
                                    {selectedLabel2?.defendant_insurance && `${selectedLabel2?.defendant_insurance?.company || ''}`}
                                </div>
                                :
                                "Select Negotiating Parties"
                                
                                }
                </span>
                {isOpen2 && (
                    <ul className="dropdown-list font-weight-semibold" style={{ marginTop: "25px",top:"0px" }}>
                        {partiesCombinations?.map((partyCombination, index) => (
                            <li
                                key={index}
                                className='dropdown-list-item color-primary'
                                onClick={(e) => handleSelection2(
                                    e,
                                    partyCombination
                                )}
                            >
                                <div className='height-25 d-flex align-items-center'>
                                    <i className={`ic ic-19 ic-client m-r-5`}></i>
                                    {partyCombination?.client?.first_name || ''} {partyCombination?.client?.last_name || ''}
                                    <span className='m-l-5 m-r-5 text-uppercase'>vs</span>
                                    <i className={`ic ic-19 ic-defendants m-r-5`}></i>
                                    {partyCombination?.defendant?.defendantType?.name === "Private Individual"
                                        ? `${partyCombination?.defendant?.first_name || ''} ${partyCombination?.defendant?.last_name || ''}`
                                        : `${partyCombination?.defendant?.entity_name || ''}`}
                                    {partyCombination?.defendant_insurance && <i className={`ic ic-19 ic-insurance m-l-5 m-r-5`}></i>}
                                    {partyCombination?.defendant_insurance && `${partyCombination?.defendant_insurance?.company || ''}`}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
      </div>
      <div className={`d-flex align-items-center justify-content-center text-uppercase height-25 font-weight-semibold m-b-5 ${selectedLabel2 ? "selected-option" : "not-selected-option"}`}>
          <span className='text-uppercase d-flex align-items-center'>Initial Demand or Offer For 
            {
              selectedLabel2 ? 
              <>
                  <i className={`ic ic-19 ic-client m-l-5 m-r-5`}></i>
                  {selectedLabel2?.client?.first_name || ''} {selectedLabel2?.client?.last_name || ''}
                  {/* {selectedLabel2?.client_insurance && <i className={`ic ic-19 ic-insurance m-l-5 m-r-5`}></i>}
                  {selectedLabel2?.client_insurance && `${selectedLabel2?.client_insurance?.company || ''}`} */}
                  <span className='m-l-5 m-r-5 text-uppercase'>vs</span>
                  <i className={`ic ic-19 ic-defendants m-r-5`}></i>
                  {selectedLabel2?.defendant?.defendantType?.name === "Private Individual"
                      ? `${selectedLabel2?.defendant?.first_name || ''} ${selectedLabel2?.defendant?.last_name || ''}`
                      : `${selectedLabel2?.defendant?.entity_name || ''}`}
                  {selectedLabel2?.defendant_insurance && <i className={`ic ic-19 ic-insurance m-l-5 m-r-5`}></i>}
                  {selectedLabel2?.defendant_insurance && `${selectedLabel2?.defendant_insurance?.company || ''}`}
              </>
              : 
              " (Negotiating Parties)"
            }
          </span>
      </div>  
    {/* <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Add Settlement - {tabsData.find((tab)=> tab.id === addOfferTab ).label}</div></div> */}
      <div className={`d-flex m-t-5 m-b-5 align-items-center justify-content-center ${selectedLabel2 ? "" : "disabled-dropdown"}`}>
                <div className="dropdown-container m-r-5 custom-select-state-entity" style={{width:"250px"}} ref={dropdownRef1}>
                    <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle1} style={{ padding: "0px" }}>
                        <span className={`${selectedLabel1 ? "color-primary" : "text-grey"} font-weight-semibold`} style={{padding:"5px"}}>{selectedLabel1 ? selectedLabel1?.name : "Select Offer Type"}</span>
                        {isOpen1 && (
                            <ul className="dropdown-list font-weight-semibold" style={{ marginTop: "25px",top:"0px" }}>
                                {types?.map((offerType, index) => (
                                    <li
                                        key={index}
                                        className='dropdown-list-item color-primary'
                                        onClick={(e) => handleSelection1(
                                            e,
                                            offerType
                                        )}
                                    >
                                        {offerType?.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
      </div>
      <Form className='initial-offer-form side-padding-100' 
      // onSubmit={  selectedLabel1.id === "settlement_conference" ? conferenceFormik.handleSubmit :
      //                   selectedLabel1.id === "demand_or_opening_offer" ? demandFormik.handleSubmit : 
      //                   selectedLabel1.id === "offer_or_counter_offer" ? offerFormik.handleSubmit : 
      //                   selectedLabel1.id === "mediation" ? mediationFormik.handleSubmit : null}
      onSubmit={demandFormik.handleSubmit}
      >
        <div className="tab-content">  
            {/* {selectedLabel1.id == "demand_or_opening_offer" && <DefendantFields formik={demandFormik} offerCombinations={offerCombinations} />} */}
            <DefendantFields formik={demandFormik} offerCombinations={offerCombinations} combination={selectedLabel2} />
            {/* {selectedLabel1.id == "offer_or_counter_offer" && <OfferFields formik={offerFormik} offerCombinations={offerCombinations} />}
            {selectedLabel1.id == "mediation" && <MediationFields formik={mediationFormik} offerCombinations={offerCombinations}  />}
            {selectedLabel1.id == "settlement_conference" && <SettlementConferenceFields formik={conferenceFormik} offerCombinations={offerCombinations} />} */}
        </div>
        </Form>
  </div>
);
}

export default AddOfferPopUp