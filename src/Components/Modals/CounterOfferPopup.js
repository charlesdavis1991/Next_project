import React,{useState, useEffect, useRef } from 'react';
import { Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import {  getCaseId, getClientId, getCurrentDate, formatDate, currencyFormat, getFutureDate } from '../../Utils/helper';
import createCounterOffer from '../SettlementDashboard/api/createCounterOffer';

const CounterOfferPopup = ({ counterOfferObj, handleDisableSaveBtn, handleClose }) => {
    const { show, initialOffers, types, updateOffersState, updateClientProceedStates, updateFeesState,offerCombinations, updateGroupedOffersState } = counterOfferObj;
    const counterOfferFormik = useFormik({
        initialValues: {
            amount: 0.00,
            date: getCurrentDate(),
            draft_checked_counter_offer: false,
            final_checked_counter_offer: false,
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
                "linked-offer": parseInt(selectedLabel1?.id),
                demand: parseFloat(values.amount),
                date: dateWithZeros(values.date),
                document_type_offer: JSON.stringify([
                    values.draft_checked_counter_offer,
                    values.final_checked_counter_offer,
                ]),
                note: values.note,
                "expiration-date": dateWithZeros(values["expiration-date"]),
                by_entity:values.by_entity,
                entity:values.entity,
                note:values.note,
                offer_type_id: selectedLabel?.id
            }
            
            const res = await createCounterOffer(payload)
            updateOffersState();
            updateGroupedOffersState();
            updateFeesState();
            updateClientProceedStates();
            handleClose();
        }
    })
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const handleDropdownToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSelection = (e,offer) => {
        e.stopPropagation();
        setSelectedLabel(offer);
        setIsOpen(false);
    };
    // Close dropdown when clicking outside
    useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [selectedLabel1, setSelectedLabel1] = useState(null);
    const [isOpen1, setIsOpen1] = useState(false);
    const dropdownRef1 = useRef(null);
    const handleDropdownToggle1 = () => {
        console.log("open false")
        setIsOpen1((prev) => !prev);
    };

    const handleSelection1 = (e,offer) => {
        
        e.stopPropagation();
        console.log(offer);
        setSelectedLabel1(offer);
        let selectByIcon = "ic-defendants";
        let selectToIcon = "ic-defendants";
        let selectBy = offerCombinations.defendant_combinations?.find(
            (comb) => offer?.by_defendant?.id === comb?.defendant?.id
        ) || offerCombinations.client_combinations?.find(
            (comb) => {
                const match = offer?.by_entity_client?.id === comb?.client?.id;
                if (match) selectByIcon = "ic-client";
                return match;
            }
        );
        let selectTo = offerCombinations.defendant_combinations?.find(
            (comb) => offer?.defendant?.id === comb?.defendant?.id
        ) || offerCombinations.client_combinations?.find(
            (comb) => {
                const match = offer?.entity_client?.id === comb?.client?.id;
                if (match) selectToIcon = "ic-client";
                return match;
            }
        );

        setByIcon(selectByIcon);
        setToIcon(selectToIcon);
        
        setByEntity(selectBy);
        setToEntity(selectTo);


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

    const [byIcon,setByIcon] = useState(null);
    const [toIcon,setToIcon] = useState(null);

    const [byEntity,setByEntity] = useState(null);
    const [toEntity,setToEntity] = useState(null);

    const [selectedLabel2, setSelectedLabel2] = useState("Select Offeree");
    const [selectedIcon2, setSelectedIcon2] = useState("");

    const [isOpen2, setIsOpen2] = useState(false);
    const dropdownRef2 = useRef(null);
    // Close dropdown when clicking outside
    useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setIsOpen1(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);
    const handleDropdownToggle2 = () => {
        setIsOpen2((prev) => !prev);
    };

    const handleSelection2 = (e,value, label, iconClass,type) => {
        e.stopPropagation();
            counterOfferFormik.setFieldValue("by_entity", value);
            setSelectedLabel2(label);
            setSelectedIcon2(iconClass);
            
            if(type=="by"){
                let entityValue = "";
                if(toEntity?.defendant?.id){
                    entityValue = `${toEntity?.defendant?.id},${toEntity?.insurance?.id || -9999}, defendant`
                }   
                else{
                    entityValue= `${toEntity?.client?.id},${toEntity?.insurance?.id}, client`
                }
                counterOfferFormik.setFieldValue("entity", entityValue);
            }
            else if(type=="to"){
                let entityValue = "";
                if(byEntity?.defendant?.id){
                    entityValue = `${byEntity?.defendant?.id},${byEntity?.insurance?.id || -9999}, defendant`
                }   
                else{
                    entityValue= `${byEntity?.client?.id},${byEntity?.insurance?.id}, client`
                }
                counterOfferFormik.setFieldValue("entity", entityValue);
            }
        
        setIsOpen2(false);
    };
    useEffect(()=>{
        if(!selectedLabel || !selectedLabel1 || !selectedLabel2 || !counterOfferFormik.values.amount){
            handleDisableSaveBtn(true);
            return;
        }
        handleDisableSaveBtn(false);

    },[selectedLabel,selectedLabel1,selectedLabel2,counterOfferFormik.values.amount])
    return (
        <>  
            <div className="d-flex m-t-5 m-b-5 align-items-center justify-content-center">
                <div className="dropdown-container m-r-5 custom-select-state-entity" style={{width:"250px"}} ref={dropdownRef}>
                    <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle} style={{ padding: "0px" }}>
                        <span className={`${selectedLabel ? "color-primary" : "text-grey"} font-weight-semibold`} style={{padding:"5px"}}>{selectedLabel ? selectedLabel?.name : "Select Offer Type"}</span>
                        {isOpen && (
                            <ul className="dropdown-list color-primary font-weight-semibold" style={{ marginTop: "25px",top:"0px" }}>
                                {types?.map((offerType, index) => (
                                    <li
                                        key={index}
                                        className='dropdown-list-item'
                                        onClick={(e) => handleSelection(
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
            {   initialOffers?.length == 0 &&
                <div className='d-flex align-items-center justify-content-center'>
                    <p className='text-uppercase font-weight-semibold' style={{color:"var(--primary) !important"}}>No Initial Offers or Demands Input</p>
                </div>
            }
            { 
            initialOffers?.length > 0 &&
                <div className={`d-flex m-t-5 m-b-5 align-items-center justify-content-center side-padding-100 ${!selectedLabel ? "disabled-dropdown" : ""}`}>
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counter-offer-input-label text-end">
                        Select Initial Offer or Demand:
                    </span>
                    <div className="dropdown-container custom-select-state-entity w-100" ref={dropdownRef1}>
                        <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle1} style={{ padding: "0px" }}>
                            <div className={`${selectedLabel1 ? "color-primary" : "text-grey"} font-weight-semibold`} style={{padding:"5px"}}>
                                <div className="d-flex align-items-center">
                                    {   
                                        !selectedLabel1 && 
                                        "Select Offeree and Offeror"
                                    }
                                    {   selectedLabel1 &&
                                        <i className={`ic ic-19 ${selectedLabel1?.by_defendant ? "ic-defendants" : "ic-client"} m-r-5`}></i>
                                    }
                                    {   selectedLabel1 &&
                                    
                                        selectedLabel1?.by_defendant?.defendantType ?
                                            selectedLabel1?.by_defendant?.defendantType?.name === "Private Individual" ?
                                            `${selectedLabel1?.by_defendant?.first_name || ''} ${selectedLabel1?.by_defendant?.last_name || ''}` :
                                            `${selectedLabel1?.by_defendant?.entity_name || ''}`
                                        :
                                            `${selectedLabel1?.by_entity_client.first_name || ''} ${selectedLabel1?.by_entity_client.last_name || ''}`
                                    }
                                    &nbsp;
                                    {selectedLabel1 && "To"}
                                    &nbsp;
                                    {   selectedLabel1 &&
                                        <i className={`ic ic-19 ${selectedLabel1?.defendant ? "ic-defendants" : "ic-client"} m-r-5 m-l-5`}></i>
                                    }
                                    {   selectedLabel1 &&
                                        selectedLabel1?.defendant?.defendantType ?
                                            selectedLabel1?.defendant?.defendantType?.name === "Private Individual" ?
                                            `${selectedLabel1?.defendant?.first_name || ''} ${selectedLabel1?.defendant?.last_name || ''}` :
                                            `${selectedLabel1?.defendant?.entity_name || ''}`
                                        :
                                            `${selectedLabel1?.entity_client.first_name || ''} ${selectedLabel1?.entity_client.last_name || ''}`
                                    }
                                    &nbsp;
                                    { selectedLabel1 && "Counter Offer "}
                                    &nbsp; 
                                    { selectedLabel1 &&
                                        currencyFormat(selectedLabel1?.demand)
                                    }
                                </div>
                            </div>
                            {isOpen1 && (
                                <ul className="dropdown-list color-primary font-weight-semibold" style={{ marginTop: "25px",top:"0px" }}>
                                    {initialOffers?.map((offer, index) => (
                                        <li
                                            key={index}
                                            style={{ zIndex: 9999 }}
                                            className='dropdown-list-item'
                                            onMouseDown={(e)=>handleSelection1(e,offer?.offers_list[0])}
                                        >
                                            {   
                                                !offer?.offers_list[0] && 
                                                "Select Offeree and Offeror"
                                            }
                                            {   offer?.offers_list[0] &&
                                                <i className={`ic ic-19 ${offer?.offers_list[0]?.by_defendant ? "ic-defendants" : "ic-client"} m-r-5`}></i>
                                            }
                                            {   offer?.offers_list[0] &&
                                            
                                            offer?.offers_list[0]?.by_defendant ?  offer?.offers_list[0]?.by_defendant?.defendantType?.name === "Private Individual" ? 
                                            `${offer?.offers_list[0]?.by_defendant?.first_name || ''} ${offer?.offers_list[0]?.by_defendant?.last_name || ''}` :
                                            `${offer?.offers_list[0]?.by_defendant?.entity_name || ''}` : `${ offer?.offers_list[0]?.by_entity_client?.first_name } ${ offer?.offers_list[0]?.by_entity_client?.last_name }`
                                            }
                                            &nbsp;
                                            {offer?.offers_list[0] && "To"}
                                            &nbsp;
                                            {   offer?.offers_list[0] &&
                                                <i className={`ic ic-19 ${offer?.offers_list[0]?.defendant ? "ic-defendants" : "ic-client"} m-r-5 m-l-5`}></i>
                                            }
                                            {   offer?.offers_list[0] &&
                                                offer?.offers_list[0]?.defendant ?  offer?.offers_list[0]?.defendant?.defendantType?.name === "Private Individual" ? 
                                                `${offer?.offers_list[0]?.defendant?.first_name || ''} ${offer?.offers_list[0]?.defendant?.last_name || ''}` :
                                                `${offer?.offers_list[0]?.defendant?.entity_name || ''}` : `${ offer?.offers_list[0]?.entity_client?.first_name } ${ offer?.offers_list[0]?.entity_client?.last_name }`
                                            }
                                            &nbsp;
                                            { offer?.offers_list[0] && "Counter Offer "}
                                            &nbsp; 
                                            { offer?.offers_list[0] &&
                                                currencyFormat(offer?.offers_list[0]?.demand)
                                            }
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            }

            {
                <div className={`d-flex m-t-5 m-b-5 align-items-center side-padding-100 ${!selectedLabel || !selectedLabel1 ? "disabled-dropdown" : ""}`}>
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counter-offer-input-label text-end">
                        Party Making the Counter Offer:
                    </span>
                    <div className={`dropdown-container custom-select-state-entity w-100`} ref={dropdownRef2}>
                        <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle2} style={{ padding: "0px" }}>
                            {selectedIcon2 && <i className={`ic ic-19 ${selectedIcon2} m-r-5 m-l-10`}></i>}
                            <span className={`${selectedLabel2==="Select Offeree" ? "text-grey" : "color-primary"} font-weight-semibold`} style={{padding:"5px"}}>
                                {selectedLabel2}
                            </span>
                            {isOpen2 && (
                                <ul className="dropdown-list color-primary" style={{ marginTop: "25px",top:"0px" }}>
                                    {
                                        byIcon == "ic-defendants" && 
                                        <li className='dropdown-list-item font-weight-600'
                                            onClick={(e) => handleSelection2(
                                                e,
                                                `${byEntity?.defendant?.id},${byEntity?.insurance?.id || -9999}, defendant`,
                                                byEntity?.defendant?.defendantType?.name === "Private Individual" 
                                                    ? `${byEntity?.defendant?.first_name || ''} ${byEntity?.defendant?.last_name || ''}`
                                                    : `${byEntity?.defendant?.entity_name || ''}${byEntity?.insurance?.length > 0 ? `, ${byEntity?.insurance[0]?.company || ''}` : ''}`,
                                                "ic-defendants",
                                                "by"
                                            )}
                                        >
                                            <i className={`ic ic-19 ic-defendants m-r-5`}></i>
                                            {byEntity?.defendant?.defendantType?.name === "Private Individual"
                                                ? `${byEntity?.defendant?.first_name || ''} ${byEntity?.defendant?.last_name || ''}`
                                                : `${byEntity?.defendant?.entity_name || ''}`}
                                            {byEntity?.insurance?.length > 0 && `, ${byEntity?.insurance[0]?.company || ''}`}
                                        </li>
                                    }
                                    {
                                        byIcon == "ic-client" &&  
                                        <li
                                            className='dropdown-list-item color-primary'
                                            onClick={(e) => handleSelection2(
                                                e,
                                                `${byEntity?.client?.id},${byEntity?.insurance?.id}, client`,
                                                `${byEntity?.client?.first_name || ''} ${byEntity?.client?.last_name || ''} ${byEntity?.insurance ? `, ${byEntity?.insurance?.company || ''}` : ''}`,
                                                "ic-client",
                                                "by"
                                            )}
                                        >
                                            <i className={`ic ic-19 ic-client m-r-5`}></i>
                                            {byEntity?.client?.first_name || ''} {byEntity?.client?.last_name || ''}
                                            {byEntity?.insurance ? `, ${byEntity?.insurance?.company || ''}` : ''}
                                        </li>
                                    }
                                    {
                                    toIcon == "ic-defendants" &&    
                                        <li
                                            className='dropdown-list-item color-primary'
                                            onClick={(e) => handleSelection2(
                                                e,
                                                `${toEntity?.defendant?.id},${toEntity?.insurance?.id || -9999}, defendant`,
                                                toEntity?.defendant?.defendantType?.name === "Private Individual" 
                                                    ? `${toEntity?.defendant?.first_name || ''} ${toEntity?.defendant?.last_name || ''}`
                                                    : `${toEntity?.defendant?.entity_name || ''}${toEntity?.insurance?.length > 0 ? `, ${toEntity?.insurance[0]?.company || ''}` : ''}`,
                                                "ic-defendants",
                                                "to"
                                            )}
                                        >
                                            <i className={`ic ic-19 ic-defendants m-r-5`}></i>
                                            {toEntity?.defendant?.defendantType?.name === "Private Individual"
                                                ? `${toEntity?.defendant?.first_name || ''} ${toEntity?.defendant?.last_name || ''}`
                                                : `${toEntity?.defendant?.entity_name || ''}`}
                                            {toEntity?.insurance?.length > 0 && `, ${toEntity?.insurance[0]?.company || ''}`}
                                        </li>
                                    }
                                    {
                                    toIcon == "ic-client" &&    
                                        <li
                                            className='dropdown-list-item color-primary'
                                            onClick={(e) => handleSelection2(
                                                e,
                                                `${toEntity?.client?.id},${toEntity?.insurance?.id}, client`,
                                                `${toEntity?.client?.first_name || ''} ${toEntity?.client?.last_name || ''} ${toEntity?.insurance ? `, ${toEntity?.insurance?.company || ''}` : ''}`,
                                                "ic-client",
                                                "to"
                                            )}
                                        >
                                            <i className={`ic ic-19 ic-client m-r-5`}></i>
                                            {toEntity?.client?.first_name || ''} {toEntity?.client?.last_name || ''}
                                            {toEntity?.insurance ? `, ${toEntity?.insurance?.company || ''}` : ''}
                                        </li>
                                    }
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            }

            <Form className='counter-offer-form side-padding-100' onSubmit={counterOfferFormik.handleSubmit}>
                <div className={`m-b-5 p-l-15 p-r-15 ${!selectedLabel || !selectedLabel1 || !selectedIcon2 ? "disabled-dropdown" : ""}`}>
                    <Form.Group as={Row} className="m-b-5">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counter-offer-input-label text-end">
                        Counter Offer Date:
                        </span>
                        <div className="d-flex-1 p-r-5">
                            <Form.Control
                                type="date"
                                name="date"
                                className='height-25 p-0 p-l-5 rounded-0'
                                {...counterOfferFormik.getFieldProps("date")}
                                style={{ appearance: "none" }}
                                onClick={(e) => e.target.showPicker()}
                                isInvalid={counterOfferFormik.touched.date && counterOfferFormik.errors.date}
                            />
                            <Form.Control.Feedback type="invalid">
                                {counterOfferFormik.errors.date}
                            </Form.Control.Feedback>
                        </div>
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">
                                Expires:
                        </span>
                        <div className="d-flex-1 p-r-5">
                            <Form.Control
                            type="date"
                            className='height-25 p-0 p-l-5 rounded-0'
                            name='expiration-date'
                            {...counterOfferFormik.getFieldProps("expiration-date")}
                            style={{ appearance: "none" }}
                            onClick={(e) => e.target.showPicker()}
                            isInvalid={counterOfferFormik.touched["expiration-date"] && counterOfferFormik.errors["expiration-date"]}
                            
                            />
                            <Form.Control.Feedback type="invalid">
                            {counterOfferFormik.values["expiration-date"]}
                            </Form.Control.Feedback>
                        </div>
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">
                        Offer Amount:
                    </span>
                        <div className="d-flex-1 p-r-5">
                        <Form.Control
                        type="text"
                        name="amount"
                        className="monospace-font height-25 p-0 p-l-5 rounded-0"
                        value={counterOfferFormik.values.amount !== "" ? `$ ${counterOfferFormik.values.amount}` : "$ "}
                        onFocus={() => {
                            counterOfferFormik.setFieldValue("amount", ""); // Clear only the numeric value on click
                        }}
                        onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and '.'

                            // Ensure only one decimal point
                            if ((value.match(/\./g) || []).length > 1) {
                                value = value.substring(0, value.lastIndexOf("."));
                            }

                            // Restrict to 2 decimal places
                            if (value.includes(".")) {
                                let parts = value.split(".");
                                if (parts[1].length > 2) {
                                    parts[1] = parts[1].substring(0, 2);
                                }
                                value = parts.join(".");
                            }

                            counterOfferFormik.setFieldValue("amount", value); // Update counterOfferFormik state
                        }}
                        onBlur={() => {
                            if (!counterOfferFormik.values.amount) {
                                counterOfferFormik.setFieldValue("amount", ""); // Keep "$ " in place if empty
                            }
                        }}
                        isInvalid={counterOfferFormik.touched.amount && !!counterOfferFormik.errors.amount}
                    />

                            <Form.Control.Feedback type="invalid">
                                {counterOfferFormik.errors.amount}
                            </Form.Control.Feedback>
                        </div>
                        <div class="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                            <div className="d-flex">
                                <input
                                    type="checkbox"
                                    name="draft_checked_counter_offer"
                                    checked={counterOfferFormik.values.draft_checked_counter_offer}
                                    onChange={(e) => counterOfferFormik.setFieldValue("draft_checked_counter_offer", e.target.checked)}
                                />
                                <span className='m-l-5 m-r-5'>Draft</span>
                                <input
                                    type="checkbox"
                                    name="final_checked_counter_offer"
                                    checked={counterOfferFormik.values.final_checked_counter_offer}
                                    onChange={(e) => counterOfferFormik.setFieldValue("final_checked_counter_offer", e.target.checked)} 
                                />
                                <span className='m-l-5 m-r-5'>Final</span>
                                {/* <Form.Check
                                    type="checkbox"
                                    className="mr-2"
                                    label="Draft"
                                    name="draft_checked_counter_offer"
                                    checked={counterOfferFormik.values.draft_checked_counter_offer}
                                    onChange={(e) => counterOfferFormik.setFieldValue("draft_checked_counter_offer", e.target.checked)}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Final"
                                    name="final_checked_counter_offer"
                                    checked={counterOfferFormik.values.final_checked_counter_offer}
                                    onChange={(e) => counterOfferFormik.setFieldValue("final_checked_counter_offer", e.target.checked)} 
                                /> */}
                            </div>
                        </div>
                        </div>
                    </Form.Group>
                </div>
                <div className={`d-flex m-t-5 m-b-5 align-items-center ${!selectedLabel || !selectedLabel1 || !selectedIcon2 ? "disabled-dropdown" : ""}`}>
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counter-offer-input-label text-end">
                        Note:
                    </span>
                    <div className='d-flex-1'>
                        <Form.Control 
                            type="text"
                            className='height-25 rounded-0'
                            placeholder="Add a note"
                            id="add-offer-note"
                            name="note"
                            value={counterOfferFormik.values.note}
                            onChange={counterOfferFormik.handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            {counterOfferFormik.errors.note}
                        </Form.Control.Feedback>
                    </div>
                </div>
            </Form>
        </>
    )
}

export default CounterOfferPopup