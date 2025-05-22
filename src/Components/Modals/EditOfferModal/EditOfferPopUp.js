import React,{useState, useEffect} from 'react'
import { Modal, Button,Form,Alert } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import EditOfferPopUpHistory from './EditOfferPopUpHistory';
import EditFields from './EditFields';
import CounterOfferFields from './CounterOfferFields';
import GenerateCheckFields from './GenerateCheckFields';
import GenericTabs from '../../common/GenericTab';
import { formatToYYYYMMDD, getCaseId, getClientId, getCurrentDate, getFutureDate } from '../../../Utils/helper';
import deletePanelEntity from '../../SettlementDashboard/api/deletePanelEntity';
import generateCheckOffer from '../../SettlementDashboard/api/generateCheckOffer';
import createCounterOffer from '../../SettlementDashboard/api/createCounterOffer';
import updatePanelApi from '../../SettlementDashboard/api/updatePanelApi';
import getOfferDetailApi from '../../SettlementDashboard/api/getOfferDetailApi';
import acceptOffer from '../../SettlementDashboard/api/acceptOffer';

const EditOfferPopUp = ({show, handleClose, offer, updateOffersState, updateClientProceedStates,updateFeesState, updateTrustLedger, offerCombinations,updateGroupedOffersState}) => {
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [addOfferTab,setAddOfferTab] = useState("edit");
    const [currentOffer,setCurrentOffer] = useState(offer);
    const [checks,setChecks] = useState(offer?.checks)
    const handleTabChange = (string) => {
    setAddOfferTab(string, true);
    };
    const tabsData = [
        {   id: "edit", 
            label: "Initial Demand or Offer",
            onClick: () => handleTabChange("edit"),
            className: addOfferTab === "edit" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
            background: addOfferTab === "edit" ? "var(--primary) !important" : "var(--primary-70) !important",
            rightHand:true,
            activeColor: 'white',
        },
        {   id: "counter_offer", 
            label: "Add Counter Offer", 
            onClick: () => handleTabChange("counter_offer"),
            className: addOfferTab === "counter_offer" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
            background: addOfferTab === "counter_offer" ? "var(--primary) !important" : "var(--primary-70) !important",
            rightHand:true,
            activeColor: 'white',
        },
        {   id: "generate_check", 
            label: "Generate Settlement Check as Deposit", 
            onClick: () => handleTabChange("generate_check"),
            className: addOfferTab === "generate_check" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
            background: addOfferTab === "generate_check" ? "var(--primary) !important" : "var(--primary-70) !important",
            rightHand:true,
            activeColor: 'white',
        }
        
    ];

    const editFormik = useFormik({
        initialValues: {
            accepted_date:offer?.accepted_date ? formatToYYYYMMDD(offer?.accepted_date) : '',
            date: offer?.date ? formatToYYYYMMDD(offer?.date) : '', 
            check: offer?.id, 
            counter_offer_amount: parseFloat(offer?.counter_offer_amount || 0).toFixed(2), 
            counter_offer_date: offer?.counter_offer_date || '', 
            note: offer?.note || '',
            amount: offer?.amount ? parseFloat(offer?.amount).toFixed(2) : null, 
            "expiration-date":offer?.expiration_date ? formatToYYYYMMDD(offer?.expiration_date) : '', 
            "date-sent": offer?.expiration_date ? formatToYYYYMMDD(offer?.demand_date_sent) : '', 
            demand: offer?.demand ? parseFloat(offer?.demand).toFixed(2) : null, 
            insurance: offer?.insurance?.id || 0, 
            defendant: offer?.defendant?.id || 0, 
            "client-select": offer?.client_selected?.id || 0, 
            "client-insurance": offer.client_insurance_id || 0,
            offer_type: `${offer?.offer_type?.id}`  || '', 
            "offer-type": offer?.offer_type?.name || '',
            litigation_event_3: offer?.litigation_event_mediation || '',
            litigation_event_4: offer?.litigation_event_settlement_conference || '',
            "mediation-date": offer?.mediation_date ? formatToYYYYMMDD(offer?.mediation_date) : '',
            "settlement-conference-date": offer?.settlement_conference_date ? formatToYYYYMMDD(offer?.settlement_conference_date) : '',
            draft_checked_demand: offer?.offer_type?.name === "Demand" ? offer?.draft1_checked ? "draft" : "" : "",
            final_checked_demand: offer?.offer_type?.name === "Demand" ? offer?.final_checked ? "final" : "" : "",
            draft_checked_offer: offer?.offer_type?.name === "Offer" ? offer?.draft1_checked ? "draft" : "" : "",
            final_checked_offer: offer?.offer_type?.name === "Offer" ? offer?.final_checked ? "final" : "" : "",
            draft_checked_counter_offer: offer?.draft_checked_counter_offer || "",
            final_checked_counter_offer: offer?.final_checked_counter_offer || "",
            counter_offer_accepted: offer?.counter_offer_accepted || false,
        },
        validationSchema: Yup.object({
            date: Yup.date(),
            accepted_date: Yup.date(),
            check: Yup.string(),
            counter_offer_amount: Yup.number()
                .min(0, "Counter offer amount must be positive"),
            counter_offer_date: Yup.date(),
            note: Yup.string().nullable(),
            amount: Yup.number()
                .min(0, "Amount must be positive").nullable(),
            "expiration-date": Yup.date(),
            "date-sent": Yup.date(),
            demand: Yup.number()
                .min(0, "Demand must be positive").nullable(),
            insurance: Yup.number(),
            defendant: Yup.number(),
            "client-select": Yup.number(),
            "client-insurance": Yup.number().nullable(),
            offer_type: Yup.string(),
            "offer-type": Yup.string().nullable(),
            litigation_3: Yup.string().nullable(),
            litigation_event_4: Yup.string().nullable(),
            "mediation-date": Yup.date().nullable(),
            "settlement-conference-date": Yup.date().nullable(),
            counter_offer_accepted: Yup.boolean().nullable(),
        }),
        onSubmit: async (values) => {
            const dateWithZeros = (date) => {
                if(date == "") return '';
                const d = new Date(date);
                const month = String(d.getMonth() + 1);
                const day = String(d.getDate());
                const year = d.getFullYear();
                return `${month}/${day}/${year}`;
            };
            const doc_demand = [];
            if (values.draft_checked_demand !== "") doc_demand.push(values.draft_checked_demand);
            if (values.final_checked_demand !== "") doc_demand.push(values.final_checked_demand);
            // const doc_offer = [];
            // if (values.draft_checked_offer !== "") doc_offer.push(values.draft_checked_offer);
            // if (values.final_checked_offer !== "") doc_offer.push(values.final_checked_offer);
            // const doc_counter = [];
            // if (values.draft_checked_counter_offer !== "") doc_counter.push(values.draft_checked_counter_offer);
            // if (values.final_checked_counter_offer !== "") doc_counter.push(values.final_checked_counter_offer);
            const payload = {
                ...values,
                amount:`${values.amount || ''}`,
                demand:`${values.demand || ''}`,
                "offer-type": offer?.offer_type.name?.toLowerCase(),
                case_id:getCaseId(),
                client_id: getClientId(),
                date: dateWithZeros(values.date),
                "expiration-date": dateWithZeros(values["expiration-date"]),
                // "date-sent": dateWithZeros(values["date-sent"]),
                // "mediation-date": dateWithZeros(values["mediation-date"]),
                // "settlement-conference-date": dateWithZeros(values["settlement-conference-date"]),
                document_type_offer: JSON.stringify([]),
                document_type_demand: JSON.stringify(doc_demand),
                document_type_counter_offer: JSON.stringify([]),
                accepted: offerAccepted ? "on" : "off",
                accepted_date:values["accepted_date"] ? dateWithZeros(values["accepted_date"]): null
            };
            await updatePanelApi(payload,"edit-offer"); 
            updateOffersState(); 
            updateGroupedOffersState();        
            updateFeesState();
            handleClose();
        },
    });

    const generateOfferFormik = useFormik({
        initialValues: {
            mark_deposit: "off",
            check_amount: 0.00,
            payee: "",
            check_number: "",
            check_date: getCurrentDate(),
        },
        validationSchema: Yup.object({
            check_amount: Yup.number()
            .positive("Amount must be positive")
            .required("Check amount is required"),
            payee: Yup.string().nullable(),
            check_number: Yup.number()
            .nullable(),
            check_date: Yup.date()
            .required("Check date is required")
        }),
        onSubmit: async (values) => {
            if(!acceptOffer){
                setShowAlert(true);
                setAlertMessage("You can only add checks against accepted offers.");
                return;
            }
            const payload = {
                case_id: parseInt(getCaseId()),
                client_id: parseInt(getClientId()),
                linked_offer_for_check: offer?.id,
                mark_deposit: values.mark_deposit,
                check_amount: parseFloat(values.check_amount),
                payee: values.payee,
                check_number: values.check_number,
                check_date: values.check_date
            }
            const res = await generateCheckOffer(payload)
            updateClientProceedStates();
            updateOffersState();
            updateGroupedOffersState();
            updateFeesState();
            handleClose();
        },
    })

    const counterOfferFormik = useFormik({
        initialValues: {
            amount: 0.00,
            date: getCurrentDate(),
            draft_checked_counter_offer: false,
            final_checked_counter_offer: false,
            accepted_date: offer?.accepted_date || getCurrentDate(),
            "expiration-date":getFutureDate(30),
            by_entity:"",
            entity:"",
            note: ""
        },
        validationSchema: Yup.object({
            amount: Yup.number()
            .positive("Amount must be positive")
            .required("Counter Offer amount is required"),
            date: Yup.date()
            .required("Offer Date is required"),
            "expiration-date": Yup.date(),
            note: Yup.string(),
            by_entity: Yup.string(),
            entity: Yup.string()
        }),
        onSubmit: async(values) => {
            const dateWithZeros = (date) => {
                if(date == "") return '';
                const d = new Date(date);
                const month = String(d.getMonth() + 1);
                const day = String(d.getDate());
                const year = d.getFullYear();
                return `${month}/${day}/${year}`;
            };
            const payload = {
                case_id: parseInt(getCaseId()),
                client_id: parseInt(getClientId()),
                "linked-offer": parseInt(offer?.id),
                amount: parseFloat(values.amount),
                date: dateWithZeros(values.date),
                document_type_offer: JSON.stringify([
                    values.draft_checked_counter_offer,
                    values.final_checked_counter_offer,
                ]),
                note: values.note,
                "expiration-date": dateWithZeros(values["expiration-date"]),
                by_entity:values.by_entity,
                entity:values.entity
            }
            
            const res = await createCounterOffer(payload)
            updateOffersState();
            updateGroupedOffersState();
            updateFeesState();
            handleClose();
            $('.modal').hide();
        }
    })
    
    const handleDeleteOffer = async (id,panel) =>{
        if(offer.checks.length > 0){
            setShowAlert(true);
            setAlertMessage("You can't delete an offer that has checks associated with it.");
            return;
        }
        const payload = {
            panel_name:panel,
            record_id:id
        }
        const res = await deletePanelEntity(payload)
        updateClientProceedStates();
        updateOffersState();
        updateGroupedOffersState();
        updateFeesState();
        handleClose();
    }

    const handleCurrentOffer = async()=>{
        const res = await getOfferDetailApi(offer.id);
        setCurrentOffer(res.data);
        setChecks(res.data.checks);
    }

    const [offerAccepted,setOfferAccepted] = useState(false);
    const handleOfferAccepted = (value)=>{
        setOfferAccepted(value);
    }
    const [acceptedDate, setAcceptedDate] = useState(offer?.accepted_date || getCurrentDate());
    const handleOfferAcceptedDate = (e) => {
        const value = e.target.value;
        setAcceptedDate(value);
        
    };
    
    useEffect(() => {
        if (offer && show) {
            editFormik.setValues({
                date: offer?.date ? formatToYYYYMMDD(offer?.date) : '', 
                check: offer?.id, 
                counter_offer_amount: parseFloat(offer?.counter_offer_amount || 0).toFixed(2), 
                counter_offer_date: offer?.counter_offer_date || '', 
                note: offer?.note || '',
                amount: offer?.amount ? parseFloat(offer?.amount).toFixed(2) : "0.00", 
                "expiration-date": offer?.expiration_date ? formatToYYYYMMDD(offer?.expiration_date) : '', 
                "date-sent": offer?.demand_date_sent ? formatToYYYYMMDD(offer?.demand_date_sent) : '', 
                demand: offer?.demand ? parseFloat(offer?.demand).toFixed(2) : "0.00", 
                insurance: offer?.insurance?.id || 0, 
                defendant: offer?.defendant?.id || 0, 
                accepted_date:offer?.accepted_date ? formatToYYYYMMDD(offer?.accepted_date) : '',
                "client-select": offer?.client_selected?.id || 0, 
                "client-insurance": offer?.client_insurance_id || 0,
                accepted: offer?.accepted || false, 
                offer_type: `${offer?.offer_type?.id}`  || '', 
                "offer-type": offer?.offer_type?.name || '',
                litigation_event_3: offer?.litigation_event_mediation || '',
                litigation_event_4: offer?.litigation_event_settlement_conference || '',
                "mediation-date": offer?.mediation_date ? formatToYYYYMMDD(offer?.mediation_date) : '',
                "settlement-conference-date": offer?.settlement_conference_date ? formatToYYYYMMDD(offer?.settlement_conference_date) : '',
                draft_checked_demand: offer?.offer_type?.name === "Demand" ? offer?.draft1_checked ? "draft" : "" : "",
                final_checked_demand: offer?.offer_type?.name === "Demand" ? offer?.final_checked ? "final" : "" : "",
                draft_checked_offer: offer?.offer_type?.name === "Offer" ? offer?.draft1_checked ? "draft" : "" : "",
                final_checked_offer: offer?.offer_type?.name === "Offer" ? offer?.final_checked ? "final" : "" : "",
                draft_checked_counter_offer: offer?.draft_checked_counter_offer || "",
                final_checked_counter_offer: offer?.final_checked_counter_offer || "",
                counter_offer_accepted: offer?.counter_offer_accepted || false,
            });
            console.log("Accpeted_Date",)
            setAcceptedDate(offer?.accepted_date);
        }
    }, [offer, show]); // 🔹Now updates when modal opens 
    

    useEffect(() => {
        if (show) {
            setAlertMessage("");
            setShowAlert(false); 
        }
        if (!show) {
            $('.modal').hide();
            updateTrustLedger();
        }
        
    }, [show]);

    useEffect(() => {
        if (offer?.id) {
            handleCurrentOffer();
        }
    }, [offer, show]);

    useEffect(() => {
        const fetchData = async () => {
            if(offer.id){
                const res = await getOfferDetailApi(offer.id);
                handleOfferAccepted(res.data.accepted);
            }

        };
        
        fetchData();
    }, [show,offer]);

    console.log(acceptedDate)

    const handleChangeChecks = (id) => {
        setChecks((prevChecks) =>
            prevChecks.map((check) =>
            check.id === id ? { ...check, deposit: true } : check
            )
        );
    };
    const [check,setCheck] = useState({})

    return (
    <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        dialogClassName="custom-edit-offer-dialog justify-content-center "
        >
            {show && showAlert && (
            <div className="bottom-right-alert font-wieght-600">
                <Alert variant="danger" dismissible>
                {alertMessage}
                </Alert>
            </div>
            )}
        <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Edit Settlement Record Negotiation</div></div>
        <Modal.Body style={{padding:"5px"}}>

        {/* <GenericTabs tabsData={tabsData} height={25} currentTab={addOfferTab} popupTabs={true} /> */}

        
        <Form className='position-relative' onSubmit={ editFormik.handleSubmit }>
        <div className="tab-content">       
            <div className='m-t-15 m-b-15 side-padding-100'>
                <span className='d-block text-left text-primary font-weight-600'>Edit the Selected Settlement Record by clicking a Settlement Offer in the Offer History list. The most recent Settlement Offer shows by default.</span>
                <span className='d-block text-left text-primary font-weight-600'>If a final Settlement Offer has been accepted no other settlement offer can be edited until that final Settlement Offer has been unaccepted.</span>
                <span className='d-block text-left text-primary font-weight-600'>Editing the final Settlement Offer amount will alter the Settlement Remaining for Assignment, which may require Settlement Checks to be edited, deleted or new Settlement checks to be issued.</span>
            </div>
            <EditFields offerTab={addOfferTab} offer={offer} offerCombinations={offerCombinations} formik={ editFormik } offerAccepted={offerAccepted} handleOfferAccepted={handleOfferAccepted} handleOfferAcceptedDate={handleOfferAcceptedDate} acceptedDate={acceptedDate} />  
            {/* {addOfferTab == "counter_offer" && 
                <CounterOfferFields offerTab={addOfferTab} offer={offer} offerCombinations={offerCombinations} formik={counterOfferFormik} editFormik={editFormik} offerAccepted={offerAccepted} handleOfferAccepted={handleOfferAccepted} handleOfferAcceptedDate={handleOfferAcceptedDate} acceptedDate={acceptedDate}  />
            }
            {addOfferTab == "generate_check" && 
                <GenerateCheckFields addOfferTab={addOfferTab} updateOffersState={updateOffersState} formik={generateOfferFormik} offerAccepted={offerAccepted} handleOfferAccepted={handleOfferAccepted} offer={currentOffer} handleCurrentOffer={handleCurrentOffer} />
            } */}
        </div>
        <EditOfferPopUpHistory offer={offer} check={{}} formik={editFormik} currentTab={addOfferTab} checks={checks} handleCurrentOffer={handleCurrentOffer} handleChangeChecks={handleChangeChecks} setCurrentCheck={(data)=>console.log(data)} />
        <div className="d-flex justify-content-between p-t-5">
            <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
            Close
            </Button>
            <div>
            <Button type="submit" variant="success" className="height-25" style={{padding:"0px 12px"}}
            disabled={ 
                addOfferTab === "edit" ? (editFormik.values.amount == '' || editFormik.values.demand == '')  : 
                addOfferTab === "counter_offer" ? (counterOfferFormik.values.amount == '' || counterOfferFormik.values.by_entity == '' || counterOfferFormik.values.entity == '') : 
                addOfferTab === "generate_check" ? generateOfferFormik.values.check_amount == '' : 
                false
                }>
                Save and Close
            </Button>
            </div>
        </div>
        <div className=" position-absolute del-btn-firm">
            <Button
            style={{
                marginRight: "5px",
                padding:"0px 12px"
            }}
            className="height-25"
            variant="danger"
            onClick={()=>handleDeleteOffer(offer.id,"Offer")}
            >
            Delete
            </Button>
        </div>
        </Form>
        
    </Modal.Body>
    </Modal>
    )
}

export default EditOfferPopUp