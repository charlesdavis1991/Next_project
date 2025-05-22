import React,{useState,useEffect} from 'react';
import unlockedGrey from '../../../public/BP_resources/images/icon/unlocked-grey.svg';
import lockedGrey from '../../../public/BP_resources/images/icon/locked-grey.svg';
import locked from '../../../public/BP_resources/images/icon/locked.svg';
import unlocked from '../../../public/BP_resources/images/icon/unlocked.svg';
import { currencyFormat,formatDate,inputCurrencyFormat } from '../../Utils/helper'
import updateLockSettleAmount from './common/updateLockSettleAmount';
import updateLockSettleValue from './common/updateLockSettleValue';
import SettlementNoCheckModal from '../Modals/SettlementNoCheckModal';
import SettlementCheckRequest from '../Modals/SettlementCheckRequest';
import SettlementErrorModal from '../Modals/SettlementErrorModal';
import SettlementEmptyTable from './SettlementEmptyTable';
import AllLockSettle from './common/AllLockSettle';
import ChequeUpload from './ChequeUpload';
import { useSelector } from 'react-redux';
import CopyValueSettlement from './common/CopyValueSettlement';
import SectionActionBar from './SectionActionBar';
import RequestCheckButton from './common/RequestCheckButton';
import updateRightColumnValue from './common/updateRightColumnValue';
import AddCostReimburstmentPopUp from '../Modals/AddCostReimburstmentPopUp';
import getPanelDetail from './api/getPanelDetail';
import GenericSettlementAddPopup from '../Modals/GenericSettlementAddPopup';

const SettlementCosts = ({costsObj, clientProceed, costsReimbursementsObj, settlementObjProps}) => {
    const [showSettlementPopup, setShowSettlementPopup] = useState(false);
    const [currentCheck,setCurrentCheck] = useState(null)
    const caseSummary = useSelector((state) => state?.caseData?.summary);
    const lockAllCosts = (bType,boolVal) => {
        AllLockSettle("cost_reimbursement", bType, boolVal)
        if (bType === "draft1") {
            setCostsReimbursementsLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isDraftLocked: boolVal === "true"
                }))
            );
        }
        else {
            setCostsReimbursementsLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isFinalLocked: row.checkID ? row.isFinalLocked : boolVal === "true"
                }))
            );
        }
        // AllLockSettle("cost_settle",bType,boolVal);
        // if(bType === "draft1"){
        //     const obj = {
        //         ...itemizedCost, 
        //         chv_settle : {
        //             ...itemizedCost.chv_settle,
        //             draft1_checked: boolVal === "true"
        //         }
        //     }
        //     setItemizedCost(obj);
        // }
        // else{
        //     const obj = {
        //         ...itemizedCost, 
        //         chv_settle : {
        //             ...itemizedCost.chv_settle,
        //             final_checked: itemizedCost.chv_settle.checkID ? itemizedCost.chv_settle.draft1_checked : boolVal === "true"
        //         }
        //     }
        //     setItemizedCost(obj);
        // }
    }
    const page_id_click_record = useSelector(
        (state) => state.page_id_click_record.page_id_click_record
    );
    const [errorMsg, setMsgError] = useState("")
    const [showNoCheckModal, setNoCheckModal] = useState(false);
    const handleNoCheckClose = () => setNoCheckModal(false);
    const handleNoCheckShow = () => setNoCheckModal(true);

    const [showCheckRequestModal, setCheckRequestModal] = useState(false);
    const handleCheckRequestClose = () => setCheckRequestModal(false);
    const handleCheckRequestShow = () => setCheckRequestModal(true);

    const handleDraftLockChange = (id,sectionName,e) => {
        e.stopPropagation();
        if(sectionName==="cost_settle"){
            updateLockSettleValue(id,"cost_settle","draft1");
            const obj = {
                ...itemizedCost, 
                chv_settle : {
                    ...itemizedCost.chv_settle,
                    draft1_checked:!itemizedCost.chv_settle.draft1_checked
                }
            }
            setItemizedCost(obj);
        }else if(sectionName==="cost_reimbursement"){
            updateLockSettleValue(id,"cost_reimbursement","draft1");
            setCostsReimbursementsLocks((prevStates) =>
                prevStates.map((row) =>
                    row.id === id ? { ...row, isDraftLocked: !row.isDraftLocked } : row
                )
            );
        }

        

    };
    const handleFinalLockChange = (id,sectionName,e) => {
        e.stopPropagation();
        if(sectionName==="cost_settle"){
            updateLockSettleValue(id,"cost_settle","final");
            const obj = {
                ...itemizedCost, 
                chv_settle : {
                    ...itemizedCost.chv_settle,
                    final_checked:!itemizedCost.chv_settle.final_checked
                }
            }
            setItemizedCost(obj);
        }else if(sectionName==="cost_reimbursement"){
            updateLockSettleValue(id,"cost_reimbursement","final");
            setCostsReimbursementsLocks((prevStates) =>
                prevStates.map((row) =>
                    row.id === id ? { ...row, isFinalLocked: !row.isFinalLocked } : row
                )
            );
        }
    };
    const {
        itemizedCost, setItemizedCost,
        costFinalAmount, 
        costLockValues, setCostLockValues,
        showErrorModal,
        handleErrorClose,
        handleErrorShow,
        updateCostsState,
        costEnvelope, setCostEnvelope
    } = costsObj;
    const [action, setAction] = useState("");
    const {
        costsReimbursementsLocks, setCostsReimbursementsLocks,
        costsReimbursements, setCostsReimbursements,
        costReimbursementsFinalAmount,
        costReimbursementsLockValues, setCostReimbursementsLockValues,
        showCostModal, handleCostClose, handleCostShow,
        updateCostsReimbursementsState, 
    } = costsReimbursementsObj;
    const [currentCostReimbursement,setCurrentCostReimbursement] = useState(costsReimbursements[0])

    const [colSpanValue, setColSpanValue] = useState(document.documentElement.clientWidth < 2100 ? 7 : 10);
    useEffect(() => {
        const handleResize = () => {
        setColSpanValue(document.documentElement.clientWidth < 2100 ? 7 : 10);
        };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    }, []); 
    
    return (
        <>
        <div className=''>
            <SectionActionBar sectionName={"Costs"} />
            <div className="table--no-card rounded-0 border-0 w-100">
                <table className="table table-borderless table-striped table-earning settlement-table">
                    {   costsReimbursements.length > 0 &&
                        <thead>
                        <tr id="settle-tb-header" class="settle-t-3">
                            <th></th>
                            <th class="td-autosize text-left provider-col"></th>
                            <th class="text-end td-autosize med-bill-width">Fixed</th>
                            <th class="text-end td-autosize med-bill-width hide-table-data">
                                <div className='d-flex justify-content-end align-items-center'>
                                    <span className='text-p-50'>{ itemizedCost.open_count }</span>
                                    <span>&nbsp;Open</span>
                                </div>
                            </th>
                            <th class="text-end td-autosize med-bill-width hide-table-data">
                                <div className='d-flex justify-content-end align-items-center'>
                                    <span className='text-p-50'>{ itemizedCost.requested_count }</span>
                                    <span>&nbsp;Requests</span>
                                </div>
                            </th>
                            <th class="text-end td-autosize med-bill-width">
                                <div className='d-flex justify-content-end align-items-center'>
                                    <span className='text-p-50'>{ itemizedCost.paid_count }</span>
                                    <span>&nbsp;Paid</span>
                                </div>
                            </th>
                            <th class="text-end td-autosize med-bill-width hide-table-data"></th>
                            <th class="text-end td-autosize med-bill-width">Reimbursed</th>
                            <th class="text-end td-autosize med-bill-width">Total</th>
                            <th class=""></th>
                            <th class={`text-end td-autosize ${costsReimbursements?.some(lock=>!lock.isDraftLocked) ? "cursor-pointer" : ""}`} 
                                style={{color:"var(--primary-25) !important"}}                                     
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    const draftLockCheck = costsReimbursementsLocks?.some(lock => !lock.isDraftLocked);
                                    if (draftLockCheck) {
                                        costsReimbursementsLocks?.forEach((costReimburse, index) => {
                                            if (!costReimburse.isDraftLocked) {
                                                updateRightColumnValue(
                                                    costReimburse.isDraftLocked,
                                                    costReimburse.isFinalLocked,
                                                    setMedicalBillsLocks,
                                                    "reimburse-draft",
                                                    costReimburse.id,
                                                    costReimbursementsLockValues,
                                                    setCostReimbursementsLockValues,
                                                    "cost_reimbursement",
                                                    "draft1",
                                                    costsReimbursements[index].amount
                                                )
                                            }
                                        })
                                        clientProceed.updateClientProceedsState();
                                    }
                                }}
                            >
                                <span className='d-flex align-items-center justify-content-end position-relative center-val-div'>
                                    {costsReimbursementsLocks?.some(lock => !lock.isDraftLocked) && <CopyValueSettlement/>}
                                    Working
                                </span>
                            </th>
                            <th className="s-draft text-end" 
                                style={{color:"var(--primary-25) !important"}}
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    const finalLockCheck = costsReimbursementsLocks?.some(lock => lock.isDraftLocked && !lock.isFinalLocked);
                                    if (finalLockCheck) {
                                        costsReimbursementsLocks?.forEach(costReimburse => {
                                            if (costReimburse.isDraftLocked && !costReimburse.isFinalLocked && !costReimburse.checkID) {
                                                updateRightColumnValue(
                                                    costReimburse.isDraftLocked,
                                                    costReimburse.isFinalLocked,
                                                    setCostsReimbursementsLocks,
                                                    "reimburse-final",
                                                    costReimburse.id,
                                                    costReimbursementsLockValues,
                                                    setCostReimbursementsLockValues,
                                                    "cost_reimbursement",
                                                    "final",
                                                    costReimburse.isDraftAmount
                                                )
                                            }
                                        })
                                        clientProceed.updateClientProceedsState();
                                    }
                                    }}
                                >
                                <div className='central-header-div d-flex justify-content-between align-items-center height-25'>
                                    <div className='d-flex align-items-center position-relative'>
                                        <img
                                            className='invisible ic ic-19'
                                            id="lock-image"
                                            src={unlocked}
                                            alt="lock-icon"
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <img
                                            id="lock-image"
                                            className='ic ic-19 lock-icon'
                                            src={unlocked}
                                            alt="lock-icon"
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                                lockAllCosts("draft1",'false');
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <img
                                            id="unlock-image"
                                            className='ic ic-19 lock-icon'
                                            alt="lock-icon"
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                                lockAllCosts("draft1",'true');
                                            }}
                                            src={locked}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </div>
                                    <span className='d-flex align-items-center justify-content-end position-relative center-val-div draft-central-div' style={{ paddingRight: "2px" }}>
                                        {costsReimbursementsLocks?.some(lock => lock.isDraftLocked && !lock.isFinalLocked && !lock.checkID) && <CopyValueSettlement />}
                                        <span className="position-absolute right-0">Draft</span>
                                    </span>
                                </div>                                      
                            </th>
                            <th className="s-final text-end" style={{color:"var(--primary-25) !important"}}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='d-flex align-items-center'>
                                        <img
                                            className='invisible ic ic-19'
                                            id="lock-image"
                                            src={unlocked}
                                            alt="lock-icon"
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <img
                                            id="lock-image"
                                            className='ic ic-19'
                                            src={unlocked}
                                            alt="lock-icon"
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                                lockAllCosts("final",'false');
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <img
                                            id="unlock-image"
                                            className='ic ic-19'
                                            alt="lock-icon"
                                            src={locked}
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                                lockAllCosts("final",'true');
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </div>
                                    <span style={{paddingRight:"2px"}}>Final</span>
                                </div>   
                            </th>
                            <th class="s-verify"></th>
                            <th className='td-autosize check-request-td text-center' style={{color:"var(--primary-25) !important"}}>Check</th>
                        </tr>
                    </thead>
                    }
                    <tbody id="body-table">
                        <>
                        {Object.keys(itemizedCost.chv_settle).length == 0 && costsReimbursements?.length == 0  &&                                 
                            <tr id="cost-settle-row">
                                <td className='text=center cursor-pointer' colSpan={ colSpanValue + 5 }> 
                                    <div className='settle-add-btn btn'>
                                        <button type="button" onClick={(e)=>{
                                            e.stopPropagation();
                                            setShowSettlementPopup(true);
                                            }} 
                                        className="btn">
                                            <span className="font-weight-bold text-gold">+</span>
                                            <span>Firm Cost Reimbursement</span> 
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        }
                        
                            {Object.keys(itemizedCost.chv_settle).length > 0 && 
                            <>
                                <tr id="cost-settle-row">
                                    <td class=""></td>
                                    <td class="text-left td-autosize text-capitalize provider-col">Total Costs</td>
                                    <td class="text-end med-bill-width td-autosize monospace-font dollar-amount-value" data-value={itemizedCost?.total_amount}>{currencyFormat(itemizedCost?.total_amount)}</td>
                                    <td class="td-autosize monospace-font text-end dollar-amount-value med-bill-width hide-table-data" data-value={itemizedCost.open || "0.00"}>{currencyFormat(itemizedCost.open)}</td>
                                    <td class="td-autosize monospace-font text-end dollar-amount-value med-bill-width hide-table-data" data-value={itemizedCost.requested || "0.00"}>{currencyFormat(itemizedCost.requested)}</td>
                                    <td class="td-autosize monospace-font text-end med-bill-width dollar-amount-value" data-value={itemizedCost.paid || "0.00"}>{currencyFormat(itemizedCost.paid)}</td>
                                    <td class="td-autosize text-end med-bill-width hide-table-data"></td>
                                    <td class="td-autosize monospace-font text-end dollar-amount-value med-bill-width" 
                                    data-value={
                                        parseFloat(
                                        costsReimbursements?.reduce((acc, costReimburse) => {
                                            return costReimburse?.checkID?.check_sent
                                            ? acc + parseFloat(costReimburse.amount)
                                            : acc;
                                        }, 0.00))
                                    }>
                                    {currencyFormat(
                                        costsReimbursements?.reduce((acc, costReimburse) => {
                                            return costReimburse?.checkID?.check_sent
                                            ? acc + parseFloat(costReimburse.amount)
                                            : acc;
                                        }, 0.00)
                                    )}</td>
                                    <td class="td-autosize monospace-font text-end dollar-amount-value med-bill-width" data-value={parseFloat(costFinalAmount)}>{currencyFormat(costFinalAmount)}</td>
                                    <td class=""></td>
                                    <td class="td-autosize monospace-font text-end dollar-amount-value" data-value={parseFloat(costFinalAmount)}>{currencyFormat(costFinalAmount)}</td>
                                    <td class="s-draft text-right monospace-font">
                                        <span style={{paddingRight:"2px"}} data-value={parseFloat(costFinalAmount)}>{currencyFormat(costFinalAmount)}</span>
                                    </td>
                                    <td class="s-final text-right monospace-font">
                                        <span style={{paddingRight:"2px"}} data-value={parseFloat(costFinalAmount)}>{currencyFormat(costFinalAmount)}</span>
                                    </td>
                                    <td class="s-verify"></td>
                                    <td className="td-autosize check-request-td"></td>
                                </tr>

                                {
                                costsReimbursements?.map((costReimburse,index)=>                        
                                    <tr className="height-25">    
                                        <td>{index+1}</td>              
                                        <td class="text-left" colSpan={colSpanValue - 1} onClick={(e)=>e.stopPropagation()}>
                                            <div className='d-flex' style={{width:"fit-content"}} onClick={(e)=>{
                                            e.stopPropagation();
                                            setAction("EDIT");
                                            setCurrentCheck(costReimburse);
                                            setCurrentCostReimbursement(costReimburse);
                                            handleCostShow();
                                        }}>
                                            <span className="td-autosize provider-col">
                                                {costReimburse?.date_due && <span className='m-r-5'>{ formatDate(costReimburse?.date_due) }</span>}
                                                <span>Firm Reimbursement Check for</span>&nbsp;
                                                <span className='monospace-font dollar-amount-value' data-value={costReimburse?.amount || 0.00}>{ currencyFormat(costReimburse?.amount) }</span>
                                            </span>
                                            </div>

                                        </td>
                                        <td className={`monospace-font td-autosize dollar-amount-value text-right ${!costsReimbursementsLocks[index].isDraftLocked ? "cursor-pointer" : ""}`} data-value={costReimburse?.amount}>
                                            <span className={`d-flex align-items-center ${!costsReimbursementsLocks[index].isDraftLocked ? "justify-content-between cursor-pointer" : "justify-content-end"} align-items-center position-relative center-val-div`} onClick={(e)=>
                                                {
                                                    e.stopPropagation();
                                                    updateRightColumnValue(
                                                    costsReimbursementsLocks[index].isDraftLocked,
                                                    costsReimbursementsLocks[index].isFinalLocked,
                                                    setCostsReimbursementsLocks,
                                                    "reimburse-draft",
                                                    costReimburse?.id,
                                                    costReimbursementsLockValues,
                                                    setCostReimbursementsLockValues,
                                                    "cost_reimbursement",
                                                    "draft1",
                                                    costReimburse?.amount
                                                )
                                            }
                                            }>
                                                {!costsReimbursementsLocks[index].isDraftLocked && <CopyValueSettlement/>}
                                                {currencyFormat(costReimburse?.amount)}
                                            </span>
                                        </td>
                                        <td className="s-draft text-right" onClick={(e)=>{
                                                e.stopPropagation();
                                                updateRightColumnValue(
                                                    costsReimbursementsLocks[index].isDraftLocked,
                                                    costsReimbursementsLocks[index].isFinalLocked,
                                                    setCostsReimbursementsLocks,
                                                    "reimburse-final",
                                                    costReimburse?.id,
                                                    costReimbursementsLockValues,
                                                    setCostReimbursementsLockValues,
                                                    "cost_reimbursement",
                                                    "final",
                                                    costsReimbursementsLocks[index].isDraftAmount
                                                )
                                                clientProceed.updateClientProceedsState();
                                            }}>
                                            <div  className={`monospace-font d-flex justify-content-between align-items-center height-25 position-relative center-val-div`}>
                                                <img
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // if(costsReimbursementsLocks[index].checkID){
                                                        //     console.log(costsReimbursementsLocks[index].checkID);
                                                        //     setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${costsReimbursementsLocks[index].checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                        //     handleErrorShow();
                                                        //     return;
                                                        // }
                                                        const inputField = e.target.nextElementSibling;
                                                        if (!costsReimbursementsLocks[index].isDraftLocked) {
                                                        
                                                            const rawValue = inputField.getAttribute('data-value') || "0";
                                                            inputField.setAttribute('placeholder', currencyFormat(rawValue));
                                                            inputField.value = ""; 
                                                        }
                                                        setTimeout(() => {
                                                            let val = inputField.getAttribute('data-value') || "0";
                                                            val = val.trim().replace(/^0+(\.\d+)?$/, "0"); // Normalize zero-like values
                                                            // Convert to number and check if it's a zero-type value
                                                            const isZeroValue = parseFloat(val) === 0;
                                                            if (isZeroValue) {
                                                                inputField.classList.add("zero-placeholder");
                                                                inputField.classList.remove("black-placeholder");
                                                            } else {
                                                                inputField.classList.add("black-placeholder");
                                                                inputField.classList.remove("zero-placeholder");
                                                            }
                                                        }, 10);
                                                        handleDraftLockChange(costReimburse?.id,"cost_reimbursement",e)
                                                    }}
                                                    id="lock-image"
                                                    className='ic ic-19'
                                                    src={costsReimbursementsLocks[index].isDraftLocked ?  locked :  unlocked}
                                                    alt="lock-icon"
                                                    style={{cursor: 'pointer' }}
                                                />
                                                <input
                                                    id="lock-input"
                                                    className={`${(costsReimbursementsLocks[index].isDraftLocked && !costsReimbursementsLocks[index].isFinalLocked) ? "cursor-pointer" : ""} monospace-font reimburse-draft-${costReimburse?.id} text-right reimburse-draft dollar-amount-value ${
                                                        costsReimbursementsLocks[index].isDraftLocked ? "locked-input" : "unlock-input"
                                                    } ${  ["0", "0.00"].includes(costReimburse?.draft1.toString()) ? "zero-placeholder" : "black-placeholder"}`}
                                                    type={"text"}
                                                    data-value={costReimburse?.draft1}                                                   
                                                    readOnly={costsReimbursementsLocks[index].isDraftLocked}
                                                    placeholder={costReimburse?.draft1 ? currencyFormat(costReimburse?.draft1) : "$ 0.00"}
                                                    onDoubleClick={(e) => {
                                                        const inputField = e.target;
                                                        inputField.value = currencyFormat(inputField.getAttribute("data-value")); // Set real value
                                                        inputField.placeholder = ""; // Remove placeholder
                                                        inputField.select(); // Select all text
                                                    }}
                                                    onInput={(e) => {
                                                        let value = e.target.value;
                                                        const cursorPosition = e.target.selectionStart; // Store cursor position before formatting
                                                    
                                                        // Remove invalid characters but keep one decimal point and a leading minus sign
                                                        value = value.replace(/[^0-9.-]/g, '');
                                                    
                                                        // Ensure only one leading minus sign
                                                        if (value.includes('-') && value.indexOf('-') !== 0) {
                                                            value = value.replace(/-/g, ''); // Remove extra minus signs
                                                        }
                                                    
                                                        // Prevent multiple decimal points
                                                        const parts = value.split('.');
                                                        if (parts.length > 2) {
                                                            value = parts[0] + '.' + parts.slice(1).join(''); // Keep only the first decimal point
                                                        }
                                                    
                                                        // Limit decimal places to two
                                                        if (parts.length === 2 && parts[1].length > 2) {
                                                            value = parts[0] + '.' + parts[1].slice(0, 2);
                                                        }
                                                    
                                                        // Allow input to end with a decimal point (e.g., "123." while typing)
                                                        let formattedValue;
                                                        if (value.endsWith('.')) {
                                                            formattedValue = inputCurrencyFormat(parts[0]) + '.';
                                                        } else {
                                                            let num = parseFloat(value);
                                                            if (isNaN(num)) num = ""; // Keep empty if invalid
                                                    
                                                            if (num > 999999.99) num = 999999.99;
                                                            else if (num < -999999.99) num = -999999.99;
                                                    
                                                            formattedValue = inputCurrencyFormat(num); // Format number
                                                        }
                                                    
                                                        // Adjust cursor position after formatting
                                                        const newCursorPosition = cursorPosition + (formattedValue.length - value.length);
                                                    
                                                        // Set formatted value
                                                        e.target.value = formattedValue;
                                                        e.target.setAttribute('data-value', value || "");
                                                    
                                                        // Restore cursor position
                                                        setTimeout(() => e.target.setSelectionRange(newCursorPosition, newCursorPosition), 0);
                                                    }}
                                                    onClick={(e)=>{
                                                        e.target.focus(); // Ensure input gets focus
                                                    }}
                                                    onChange={(e)=>{
                                                        let numericValue = e.target.value
                                                    .replace(/[^0-9.-]/g, '') 
                                                    .replace(/(?!^)-/g, '');
                                                    updateLockSettleAmount(costReimburse?.id,"cost_reimbursement","draft1",parseFloat(numericValue || 0).toFixed(2));
                                                    setCostsReimbursementsLocks((prevStates) =>
                                                        prevStates.map((row) =>
                                                            row.id === costReimburse?.id ? { ...row, isDraftAmount: numericValue } : row
                                                        )
                                                    );
                                                    if (numericValue !== '' && !isNaN(numericValue)) {
                                                        let num = parseFloat(numericValue);
                                                        if (num > 999999.99) num = 999999.99; 
                                                        else if (num < -999999.99) num = -999999.99; 
                                                        numericValue = num.toString(); 
                                                    }
                                                    e.target.setAttribute('data-value', numericValue);                                       
                                                    const loanInputs = [...document.querySelectorAll('.reimburse-draft')];
                                                    const sum = loanInputs.reduce((acc, input) => {
                                                        const val = input.getAttribute('data-value') || '0';
                                                        const num = parseFloat(val);
                                                
                                                        return !isNaN(num) ? acc + num : acc;
                                                    }, 0);
                                                    clientProceed.updateClientProceedsState();
                                                    setCostReimbursementsLockValues([sum, costReimbursementsLockValues[1] ])
                                                    }}
                                                    onMouseEnter={(e) => {                                     
                                                        if(costsReimbursementsLocks[index].isDraftLocked && !costsReimbursementsLocks[index].isFinalLocked){
                                                            const lockImg = e.target.previousElementSibling;
                                                            lockImg.style.opacity = 0;
                                                            lockImg.style.zIndex = 0;
                                                            const copyElement = e.target.nextElementSibling;
                                                            copyElement.style.opacity = 1;
                                                            copyElement.style.zIndex = 1;
                                                            copyElement.style.cursor = "pointer"
                                                        }
                                                        
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if(costsReimbursementsLocks[index].isDraftLocked && !costsReimbursementsLocks[index].isFinalLocked){
                                                            const lockImg = e.target.previousElementSibling;
                                                            lockImg.style.opacity = 1;
                                                            lockImg.style.zIndex = 1;
                                                            const copyElement = e.target.nextElementSibling;
                                                            copyElement.style.opacity = 0;
                                                            copyElement.style.zIndex = 0;
                                                            copyElement.style.cursor = "initial"
                                                        }
                                                        
                                                    }}
                                                    style={{zIndex:2}}
                                                />
                                                {costsReimbursementsLocks[index].isDraftLocked && !costsReimbursementsLocks[index].isFinalLocked && <CopyValueSettlement draft={true} />}
                                            </div>
                                        </td>
                                        <td className="s-final" onClick={(e)=>e.stopPropagation()}>
                                            <div className="monospace-font d-flex justify-content-between align-items-center height-25">
                                                <img
                                                    onClick={(e) =>{
                                                        e.stopPropagation();
                                                        if(costsReimbursementsLocks[index]?.checkID){
                                                            setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${costsReimbursementsLocks[index].checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                            handleErrorShow();
                                                            return;
                                                        }
                                                        const inputField = e.target.nextElementSibling;
                                                        if (!costsReimbursementsLocks[index].isFinalLocked) {
                                                        
                                                            const rawValue = inputField.getAttribute('data-value') || "0";
                                                            inputField.setAttribute('placeholder', currencyFormat(rawValue));
                                                            inputField.value = ""; 
                                                        }
                                                        setTimeout(() => {
                                                            let val = inputField.getAttribute('data-value') || "0";
                                                            val = val.trim().replace(/^0+(\.\d+)?$/, "0"); // Normalize zero-like values

                                                            // Convert to number and check if it's a zero-type value
                                                            const isZeroValue = parseFloat(val) === 0;
                                                            if (isZeroValue) {
                                                                inputField.classList.add("zero-placeholder");
                                                                inputField.classList.remove("black-placeholder");
                                                            } else {
                                                                inputField.classList.add("black-placeholder");
                                                                inputField.classList.remove("zero-placeholder");
                                                            }
                                                        }, 10);
                                                        handleFinalLockChange(costReimburse?.id,"cost_reimbursement",e);
                                                    }}
                                                    id="lock-image"
                                                    className={`ic ic-19 ${costsReimbursementsLocks[index].checkID?.check_sent ? "invisible" : ""}`}
                                                    src={costsReimbursementsLocks[index].isFinalLocked ? (costsReimbursementsLocks[index].checkID?.check_sent ? lockedGrey : locked) : (costsReimbursementsLocks[index].checkID?.check_sent ? unlockedGrey : unlocked)}
                                                    alt="lock-icon"
                                                    style={{cursor: 'pointer' }}
                                                    
                                                />
                                                <input
                                                    id="lock-input"
                                                    className={`monospace-font reimburse-final-${costReimburse?.id} text-right reimburse-final dollar-amount-value ${
                                                        costsReimbursementsLocks[index].isFinalLocked ? "locked-input" : "unlock-input"
                                                    } ${["0", "0.00"].includes(costReimburse?.final.toString()) ? "zero-placeholder" : "black-placeholder"}`}                                          
                                                    type="text"
                                                    data-value={costReimburse?.final}                                                   
                                                    disabled={costsReimbursementsLocks[index].isFinalLocked}
                                                    placeholder={costReimburse?.final ? currencyFormat(costReimburse?.final) : "$ 0.00"}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.target.focus(); // Ensure input gets focus
                                                    }}
                                                    onDoubleClick={(e) => {
                                                        const inputField = e.target;
                                                        inputField.value = currencyFormat(inputField.getAttribute("data-value")); // Set real value
                                                        inputField.placeholder = ""; // Remove placeholder
                                                        inputField.select(); // Select all text
                                                    }}
                                                    onInput={(e) => {
                                                        let value = e.target.value;
                                                        const cursorPosition = e.target.selectionStart; // Store cursor position before formatting

                                                        // Remove invalid characters but keep one decimal point and a leading minus sign
                                                        value = value.replace(/[^0-9.-]/g, '');

                                                        // Ensure only one leading minus sign
                                                        if (value.includes('-') && value.indexOf('-') !== 0) {
                                                            value = value.replace(/-/g, ''); // Remove extra minus signs
                                                        }

                                                        // Prevent multiple decimal points
                                                        const parts = value.split('.');
                                                        if (parts.length > 2) {
                                                            value = parts[0] + '.' + parts.slice(1).join(''); // Keep only the first decimal point
                                                        }

                                                        // Limit decimal places to two
                                                        if (parts.length === 2 && parts[1].length > 2) {
                                                            value = parts[0] + '.' + parts[1].slice(0, 2);
                                                        }

                                                        // Allow input to end with a decimal point (e.g., "123." while typing)
                                                        let formattedValue;
                                                        if (value.endsWith('.')) {
                                                            formattedValue = inputCurrencyFormat(parts[0]) + '.';
                                                        } else {
                                                            let num = parseFloat(value);
                                                            if (isNaN(num)) num = ""; // Keep empty if invalid

                                                            if (num > 999999.99) num = 999999.99;
                                                            else if (num < -999999.99) num = -999999.99;

                                                            formattedValue = inputCurrencyFormat(num); // Format number
                                                        }

                                                        // Adjust cursor position after formatting
                                                        const newCursorPosition = cursorPosition + (formattedValue.length - value.length);

                                                        // Set formatted value
                                                        e.target.value = formattedValue;
                                                        e.target.setAttribute("data-value", value || "");

                                                        // Restore cursor position
                                                        setTimeout(() => e.target.setSelectionRange(newCursorPosition, newCursorPosition), 0);
                                                    }}

                                                    onChange={(e) => {
                                                        let numericValue = e.target.value
                                                            .replace(/[^0-9.-]/g, '') 
                                                            .replace(/(?!^)-/g, '');

                                                        updateLockSettleAmount(costReimburse?.id, "cost_reimbursement", "final", parseFloat(numericValue || 0).toFixed(2));
                                                        setCostsReimbursements((prevStates) =>
                                                            prevStates.map((row) =>
                                                                row.id === costReimburse?.id ? { ...row, isFinalAmount: numericValue } : row
                                                            )
                                                        );
                                                        if (numericValue !== '' && !isNaN(numericValue)) {
                                                            let num = parseFloat(numericValue);
                                                            if (num > 999999.99) num = 999999.99; 
                                                            else if (num < -999999.99) num = -999999.99; 
                                                            numericValue = num.toString(); 
                                                        }
                                                        e.target.setAttribute("data-value", numericValue);                                              
                                                        const loanInputs = [...document.querySelectorAll('.reimburse-final')];
                                                        const sum = loanInputs.reduce((acc, input) => {
                                                            const val = input.getAttribute("data-value") || "0";
                                                            const num = parseFloat(val);
                                                            return !isNaN(num) ? acc + num : acc;
                                                        }, 0);
                                                        clientProceed.updateClientProceedsState();
                                                        setCostReimbursementsLockValues([costReimbursementsLockValues[0], sum]);
                                                    }}
                                                />

                                            </div>
                                        </td>
                                        <td className="s-verify" onClick={(e)=>e.stopPropagation()}>
                                            <ChequeUpload entity={costReimburse} panel={"cost_reimbursement"} pageId={page_id_click_record} documentType="verify" updateStates={updateCostsReimbursementsState} handleNoCheckShow={handleNoCheckShow}/>
                                        </td>
                                        <td className="td-autosize check-request-td text-center" onClick={(e)=>e.stopPropagation()}>
                                            <div className={`${ costsReimbursementsLocks[index]?.checkID?.cheque_number ? "check-class" : "d-flex justify-content-center" } `}>
                                                {
                                                    ((!costsReimbursementsLocks[index].checkID && costsReimbursementsLocks[index].isFinalLocked && costsReimbursementsLocks[index].isFinalAmount != 0)) ? <div className="settle-check-request-btn btn" id="nomargin">
                                                        <RequestCheckButton onHandleClick={async() => {
                                                            try {
                                                                const res = await getPanelDetail("cost-reimbursement/edit","cost_reimbursement_id",costReimburse?.id);
                                                                // If a check was already requested, show error
                                                                if (res) {
                                                                    if (res?.data?.checkID?.date_check_requested) {
                                                                        setMsgError("Check has already been requested by another user. Close the popup to see the details.");
                                                                        handleErrorShow();
                                                                    } else {
                                                                        setMsgError(""); // Clear error if no request date found
                                                                        setCurrentCostReimbursement({...costReimburse,final:costsReimbursementsLocks[index].isFinalAmount})
                                                                        updateCostsReimbursementsState()
                                                                        handleCheckRequestShow()
                                                                        
                                                                    }
                                                                } else {
                                                                    setMsgError(""); // No checkID, so no error
                                                                    setCurrentCostReimbursement({...costReimburse,final:costsReimbursementsLocks[index].isFinalAmount})
                                                                    updateCostsReimbursementsState()
                                                                    handleCheckRequestShow()
                                                                    
                                                                }
                                                            } catch (error) {
                                                                setMsgError(""); // Optional: Or you can set a different error message
                                                                console.error("Error fetching request details:", error);
                                                                setCurrentCostReimbursement({...costReimburse,final:costsReimbursementsLocks[index].isFinalAmount})
                                                                updateCostsReimbursementsState()
                                                                handleCheckRequestShow()
                                                                
                                                            }

                                                        }} />
    {/*                                                     
                                                        <RequestCheckButton onHandleClick={() => {
                                                            setCurrentCostReimbursement({...costReimburse,final:costsReimbursementsLocks[index].isFinalAmount})
                                                            updateCostsReimbursementsState()
                                                            handleCheckRequestShow()
                                                        }} /> */}
                                                    </div>
                                                        :
                                                        <>
                                                            <div className='d-flex justify-content-center'>
                                                                <span>{costsReimbursementsLocks[index].checkID?.cheque_date ? '' : costsReimbursementsLocks[index].checkID?.date_check_requested && <span className='requested-btn'>Requested:&nbsp;</span>}</span>
                                                                
                                                                <span>{formatDate(costsReimbursementsLocks[index].checkID?.cheque_date || costsReimbursementsLocks[index].checkID?.date_check_requested || '')}</span>
                                                            </div>
                                                        </>
                                                }
                                                {costsReimbursementsLocks[index]?.checkID?.cheque_number && <span className='d-inline-block check-number'>{costsReimbursementsLocks[index]?.checkID?.cheque_number}</span>}
                                                {costsReimbursementsLocks[index]?.checkID?.cheque_number && <ChequeUpload entity={costReimburse} panel={"cost_reimbursement"} pageId={page_id_click_record} documentType="check_as_sent" updateStates={updateCostsReimbursementsState} handleNoCheckShow={handleNoCheckShow}/>}
                                            </div>                                       
                                        </td>  
                                    </tr>
                                )
                                }
                                { costsReimbursements.length > 0 && <tr className="height-25">
                                    <td></td>
                                    <td className="height-25 text-capitalize text-right" colSpan={colSpanValue}>
                                        <span className='whitespace-SETTLE primary-clr-25'>Remaining to be Reimbursed to {caseSummary.for_client.created_by.office_name}: </span>
                                        <p className="d-inline-flex align-items-center height-25 monospace-font text-right font-weight-bold dollar-amount-value" data-value={parseFloat(parseFloat(costFinalAmount || 0.00) - parseFloat(costReimbursementsFinalAmount || 0.00)).toFixed(2) }>
                                            {currencyFormat(parseFloat(costFinalAmount || 0.00) - parseFloat(costReimbursementsFinalAmount || 0.00))}
                                        </p>
                                    </td>
                                    <td className="s-draft monospace-font text-right dollar-amount-value" data-value={parseFloat(parseFloat(costFinalAmount || 0.00) - parseFloat(costReimbursementsLockValues[0] || 0.00)).toFixed(2)}>
                                        <span style={{paddingRight:"2px"}} >{currencyFormat(parseFloat(costFinalAmount || 0.00) - parseFloat(costReimbursementsLockValues[0] || 0.00))}</span>
                                    </td>
                                    <td className="s-final monospace-font text-right dollar-amount-value" data-value={parseFloat(parseFloat(costFinalAmount || 0.00) - parseFloat(costReimbursementsLockValues[1] || 0.00)).toFixed(2)}>
                                        <span style={{paddingRight:"2px"}} >{currencyFormat(parseFloat(costFinalAmount || 0.00) - parseFloat(costReimbursementsLockValues[1] || 0.00))}</span>
                                    </td>
                                    <td className="s-verify"></td>
                                    <td className="td-autosize check-request-td"></td>
                                </tr>
                                }
                            </>
                            }
                        </>
                    </tbody>
                </table>
            </div>
        </div>
        <AddCostReimburstmentPopUp action={action}
            costReimburse={currentCostReimbursement}
            costReimbursements={costsReimbursements}
            setCurrentCostReimbursement={setCurrentCostReimbursement}
            show={showCostModal}  
            handleClose={ ()=>{
                handleCostClose();
                updateCostsReimbursementsState();
                } 
            } 
            updateStates={updateCostsReimbursementsState} 
            costsReimbursements={costsReimbursements}
            total={costFinalAmount}
            remainingToBeReimburse={parseFloat(costFinalAmount || 0.00) - parseFloat(costReimbursementsFinalAmount || 0.00)}
        />
        { showSettlementPopup &&
            <GenericSettlementAddPopup 
            show={showSettlementPopup}                 
            handleClose={()=>{
            setShowSettlementPopup(false);
            }}
            initialLabel={"Firm Cost Reimbursement"}
                {...settlementObjProps}
            />
        }
        <SettlementErrorModal show={showErrorModal} handleClose={handleErrorClose} errorMsg={errorMsg} updateStates={updateCostsReimbursementsState} />
        <SettlementNoCheckModal show={showNoCheckModal} handleClose={handleNoCheckClose} />
        <SettlementCheckRequest show={showCheckRequestModal} handleClose={handleCheckRequestClose} finalAmount={currentCostReimbursement?.amount} panelLabel={"CostSettlement"} panelName={"cost_settle"} panelEntity={currentCostReimbursement} updateStates={updateCostsState} />
        </>
        
    )
}

export default SettlementCosts