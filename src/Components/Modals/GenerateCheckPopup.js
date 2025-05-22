import React,{useState, useEffect, useRef } from 'react';
import closeMark from '../../../public/BP_resources/images/icon/closemark.svg';
import checkMark from '../../../public/BP_resources/images/icon/checkmark.svg';
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import {  getCaseId, getClientId, getCurrentDate, formatDate, currencyFormat } from '../../Utils/helper';
import GenerateCheckFields from './EditOfferModal/GenerateCheckFields';
import getOfferDetailApi from '../SettlementDashboard/api/getOfferDetailApi';
import generateCheckOffer from '../SettlementDashboard/api/generateCheckOffer';
const GenerateCheckPopup = ({handleClose, handleDisableSaveBtn, generateCheckObj}) => {
    const { show, acceptedOffers, updateOffersState, updateClientProceedStates,updateFeesState, updateTrustLedger, updateGroupedOffersState } = generateCheckObj;
    const [currentOffer,setCurrentOffer] = useState(null);
    const [checks,setChecks] = useState([]);
    const offerAmount = currentOffer?.demand || 0.00;
    const checkAmountsTotal = checks?.reduce((acc,check) => parseFloat(acc) + parseFloat(check?.amount || 0.00),0);
    const handleOfferChecks = async(id) => {
        const res = await getOfferDetailApi(id);
        setChecks(res.data.checks);
    }
    const generateOfferFormik = useFormik({
        initialValues: {
            mark_deposit: "off",
            check_amount: "",
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
            const payload = {
                case_id: parseInt(getCaseId()),
                client_id: parseInt(getClientId()),
                linked_offer_for_check: currentOffer?.id,
                mark_deposit: values.mark_deposit,
                check_amount: parseFloat(values.check_amount),
                payee: values.payee,
                check_number: values.check_number,
                check_date: values.check_date
            }
            const res = await generateCheckOffer(payload);
            updateClientProceedStates();
            updateOffersState();
            updateGroupedOffersState();
            updateFeesState();
            handleClose();
        },
    });
    const [selectedLabel1, setSelectedLabel1] = useState(null);
    const [isOpen1, setIsOpen1] = useState(false);
    const dropdownRef1 = useRef(null);
    const handleDropdownToggle1 = () => {
        setIsOpen1((prev) => !prev);
    };
    const handleSelection1 = (e,offer) => {
        e.stopPropagation();
        setSelectedLabel1(offer);
        setCurrentOffer(offer);
        handleOfferChecks(offer?.id)
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
        generateOfferFormik.resetForm();
    }, [show,selectedLabel1]);
    // useEffect(()=>{
    // if(!currentOffer || !generateOfferFormik.values.check_amount==""  || !generateOfferFormik.values.check_date=="" )
    // {
    //     handleDisableSaveBtn(true)
    //     return;
    // }
    //     handleDisableSaveBtn(false)
    // },[selectedLabel1,generateOfferFormik.values.check_amount,generateOfferFormik.values.check_date])
    useEffect(() => {
        if (!show) {
            $('.modal').hide();
            updateTrustLedger();
        }
        
    }, [show]);
    return (
        <div >
            {   acceptedOffers?.length == 0 &&
                <div className='d-flex align-items-center justify-content-center m-b-5'>
                    <p className='text-uppercase font-weight-semibold' style={{color:"var(--primary) !important"}}>No Accepted Offers</p>
                </div>
            }
            {   acceptedOffers?.length > 0 &&         
                <div className="d-flex m-t-5 m-b-5 align-items-center justify-content-center side-padding-100">
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 generate-check-input-label text-end">
                        Select Offeree and Offeror:
                    </span>
                    <div className="dropdown-container custom-select-state-entity" ref={dropdownRef1}>
                        <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle1} style={{ padding: "0px" }}>
                            <span className={`${selectedLabel1 ? "color-primary" : "text-grey"} font-weight-semibold`} style={{padding:"5px"}}>
                                
                                <div class="d-flex align-items-center text-grey font-weight-semibold">
                                    {   
                                        !selectedLabel1 && 
                                        "Select Offeree and Offeror"
                                    }
                                    {   selectedLabel1 &&
                                        <i className={`ic ic-19 ${selectedLabel1?.by_entity?.defendantType ? "ic-defendants" : "ic-client"} m-r-5`}></i>
                                    }
                                    {   selectedLabel1 &&
                                    
                                        selectedLabel1?.by_entity?.defendantType ?
                                            selectedLabel1?.by_entity?.defendantType?.name === "Private Individual" ?
                                            `${selectedLabel1?.by_entity?.first_name || ''} ${selectedLabel1?.by_entity?.last_name || ''}` :
                                            `${selectedLabel1?.by_entity?.entity_name || ''}`
                                        :
                                            `${selectedLabel1?.by_entity.first_name || ''} ${selectedLabel1?.by_entity.last_name || ''}`
                                    }
                                    {   selectedLabel1 &&
                                        <i className={`ic ic-19 ${selectedLabel1?.entity?.defendantType ? "ic-defendants" : "ic-client"} m-r-5 m-l-5`}></i>
                                    }
                                    {   selectedLabel1 &&
                                        selectedLabel1?.entity?.defendantType ?
                                            selectedLabel1?.entity?.defendantType?.name === "Private Individual" ?
                                            `${selectedLabel1?.entity?.first_name || ''} ${selectedLabel1?.entity?.last_name || ''}` :
                                            `${selectedLabel1?.entity?.entity_name || ''}`
                                        :
                                            `${selectedLabel1?.entity.first_name || ''} ${selectedLabel1?.entity.last_name || ''}`
                                    }
                                        &nbsp;
                                    {   selectedLabel1 && selectedLabel1?.insurance?.company &&
                                        <i className={`ic ic-19 ic-insurance m-r-5 m-l-5`}></i>
                                    }
                                    {   selectedLabel1 &&
                                        selectedLabel1?.insurance?.company
                                    }
                                        &nbsp;
                                    {
                                        selectedLabel1 && "Accepted:"}
                                        &nbsp;
                                    {   selectedLabel1 &&
                                        formatDate(selectedLabel1?.accepted_date)
                                    
                                    }
                                </div>
                                </span>
                            {isOpen1 && (
                                <ul className="dropdown-list cpolor-primary font-weight-semibold" style={{ marginTop: "25px",top:"0px" }}>
                                    {acceptedOffers?.map((offer, index) => (
                                        <li
                                            key={index}
                                            className='dropdown-list-item'
                                            onClick={(e) => handleSelection1(
                                                e,
                                                offer
                                            )}
                                        >
                                            <div className='d-flex align-items-center'>
                                                <i className={`ic ic-19 ${offer?.by_entity?.defendantType ? "ic-defendants" : "ic-client"} m-r-5`}></i>
                                                {
                                                offer?.by_entity?.defendantType ?
                                                    offer?.by_entity?.defendantType?.name === "Private Individual" ?
                                                    `${offer?.by_entity?.first_name || ''} ${offer?.by_entity?.last_name || ''}` :
                                                    `${offer?.by_entity?.entity_name || ''}`
                                                :
                                                    `${offer?.by_entity.first_name || ''} ${offer?.by_entity.last_name || ''}`
                                                }
                                                <i className={`ic ic-19 m-l-5 ${offer?.entity?.defendantType ? "ic-defendants" : "ic-client"} m-r-5`}></i>
                                                {
                                                offer?.entity?.defendantType ?
                                                    offer?.entity?.defendantType?.name === "Private Individual" ?
                                                    `${offer?.entity?.first_name || ''} ${offer?.entity?.last_name || ''}` :
                                                    `${offer?.entity?.entity_name || ''}`
                                                :
                                                    `${offer?.entity.first_name || ''} ${offer?.entity.last_name || ''}`
                                                }
                                                &nbsp;
                                                {   offer?.insurance?.company &&
                                                    <i className={`ic ic-19 ic-insurance m-r-5 m-l-5`}></i>
                                                }
                                                {
                                                    offer?.insurance?.company
                                                }
                                                &nbsp;
                                                Accepted:&nbsp;
                                                {
                                                    formatDate(offer?.accepted_date)
                                                
                                                }
                                            </div>
                                            {/* {offer?.name} */}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            }
            <Form className='generate-check-form' onSubmit={generateOfferFormik.handleSubmit}
            >
            <div className="tab-content">  
                <div className='side-padding-100'>
                    <GenerateCheckFields handleDisableSaveBtn={handleDisableSaveBtn} updateOffersState={updateOffersState} formik={generateOfferFormik} offer={currentOffer} handleCurrentOffer={()=>console.log("Hello")} handleOfferChecks={handleOfferChecks} />
                </div>
                {
                <div>
                    <div className="litigation-sec-action-bar">
                        <div className="w-100 height-25" style={{ height: "25px" }}>
                            <div className="d-flex justify-content-center align-items-center height-25">
                                <span className='text-uppercase m-l-5 text-white font-weight-bold text-center'>Checks</span>
                            </div>
                        </div>
                    </div>
                    <div className='table--no-card rounded-0 border-0 w-100 offer-checks-table'>
                        <table id="edit-offer-popup-checks-table position-relative" class="table table-borderless table-striped table-earning settlement-table">
                            <thead className='position-sticky top-0'>
                                <tr id="settle-tb-header">
                                    <th style={{width:"28px"}}></th>
                                    <th className='p-l-5 p-r-5'>By</th>
                                    <th className='p-l-5 p-r-5' colSpan={2}>To</th>
                                    <th className='p-l-5 p-r-5'>Payee</th>
                                    <th className='p-l-5 p-r-5'>TD</th>
                                    <th className='p-l-5 p-r-5'>Number</th>
                                    <th className='p-l-5 p-r-5'>Date</th>
                                    <th className='p-l-5 p-r-5 text-right'>Amount</th>              
                                </tr>
                            </thead>
                            <tbody id="body-table">
                            {checks?.length > 0 && checks?.map((check,index)=>{
                                return (
                            (
                                <tr style={{height:"25px"}}>
                                    <td style={{width:"28px"}}>{ index + 1 }</td>
                                    <td class="s-offer-by td-autosize height-25 p-l-5 p-r-5">
                                        {
                                            currentOffer?.by_entity?.defendantType 
                                            ?
                                                currentOffer?.by_entity?.defendantType?.name === "Private Individual" ?
                                                `${currentOffer?.by_entity?.first_name || ''} ${currentOffer?.by_entity?.last_name || ''}` :
                                                `${currentOffer?.by_entity?.entity_name || ''}`
                                            :
                                                `${currentOffer?.by_entity.first_name || ''} ${currentOffer?.by_entity.last_name || ''}`
                                        }
                                    </td>
                                    <td class="height-25 p-l-5 p-r-5">
                                        {
                                            currentOffer?.entity?.defendantType 
                                            ?
                                                currentOffer?.entity?.defendantType?.name === "Private Individual" ?
                                                `${currentOffer?.entity?.first_name || ''} ${currentOffer?.entity?.last_name || ''}` :
                                                `${currentOffer?.entity?.entity_name || ''}`
                                            :
                                                `${currentOffer?.entity.first_name || ''} ${currentOffer?.entity.last_name || ''}`
                                        }                                        
                                    </td>
                                    <td class="height-25 p-l-5 p-r-5">{currentOffer?.insurance?.company}</td>
                                    <td class="height-25 p-l-5 p-r-5">{check?.payee}</td>
                                    <td className="height-25 p-l-5 p-r-5 text-center">     
                                        {check?.deposit ? <img className='ic ic-25'  src={checkMark} /> : ""}                            
                                        
                                    </td>
                                    <td className="text-center td-autosize">{check?.cheque_number && <span className='d-inline-block check-number'>{check?.cheque_number}</span>}</td>
                                    <td className="text-center td-autosize">{check?.cheque_date && <span>{formatDate(check?.cheque_date)}</span>}</td>
                                    <td className="text-right td-autosize monospace-font">{currencyFormat(check?.amount)}</td>
                                </tr>
                        
                            ))
                            })
                            }
                                <tr >
                                    <td className='text-end' colSpan={8}>Settlement Remaining For Assignment:</td>
                        
                                    <td className="text-right td-autosize monospace-font dollar-amount-value" data-value={(offerAmount - checkAmountsTotal) || 0.00}>{currencyFormat(offerAmount - checkAmountsTotal)}</td>
                                </tr>
                                {
                                    checks?.length < 7 && Array(7 - checks.length).fill(null).map((_, index) => (
                                        <tr key={index}>
                                            <td colSpan={9}></td>
                                        </tr>
                                    ))
                                }
                        
                            </tbody>
                        </table>
                    </div>
                </div>
                }
            </div>
            </Form>
        </div>
    )
}

export default GenerateCheckPopup