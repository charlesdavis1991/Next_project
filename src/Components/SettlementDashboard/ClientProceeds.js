import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import unlockedGrey from '../../../public/BP_resources/images/icon/unlocked-grey.svg';
import lockedGrey from '../../../public/BP_resources/images/icon/locked-grey.svg';
import locked from '../../../public/BP_resources/images/icon/locked.svg';
import unlocked from '../../../public/BP_resources/images/icon/unlocked.svg';
import updateLockSettleAmount from './common/updateLockSettleAmount';
import updateLockSettleValue from './common/updateLockSettleValue';
import AllLockSettle from './common/AllLockSettle';
import ChequeUpload from './ChequeUpload';
import SettlementErrorModal from '../Modals/SettlementErrorModal';
import SettlementNoCheckModal from '../Modals/SettlementNoCheckModal';
import SettlementCheckRequest from '../Modals/SettlementCheckRequest';
import { currencyFormat,inputCurrencyFormat,formatDate } from '../../Utils/helper';
import CopyValueSettlement from './common/CopyValueSettlement';
import SectionActionBar from './SectionActionBar';
import ClientProceedPopup from '../Modals/ClientProceedPopup';
import updateRightColumnValue from './common/updateRightColumnValue';
import RequestCheckButton from './common/RequestCheckButton';
import getPanelDetail from './api/getPanelDetail';
import GenericSettlementAddPopup from '../Modals/GenericSettlementAddPopup';

const ClientProceeds = ({clientProceeds, settlementObjProps}) => {
    const [showSettlementPopup, setShowSettlementPopup] = useState(false);
    const [errorMsg, setMsgError] = useState("")
    const [showNoCheckModal, setNoCheckModal] = useState(false);
    const handleNoCheckClose = () => setNoCheckModal(false);
    const handleNoCheckShow = () => setNoCheckModal(true);

    const [errorModal, setErrorModal] = useState(false);
    const handleErrorClose = () => setErrorModal(false);
    const handleErrorShow = () => setErrorModal(true);
    const page_id_click_record = useSelector(
        (state) => state.page_id_click_record.page_id_click_record
    );
    const [showCheckRequestModal, setCheckRequestModal] = useState(false);
    const handleCheckRequestClose = () => setCheckRequestModal(false);
    const handleCheckRequestShow = () => setCheckRequestModal(true);

    const [showEditModal, setShowEditModal] = useState(false);
    const handleShowEditModal = () => setShowEditModal(true);
    const handleCloseEditModal = () => setShowEditModal(false);

    const lockAllClientProceeds = (bType,boolVal) => {
        AllLockSettle("balance",bType,boolVal)
        if(bType === "draft1"){

            const obj = {
                ...clientProceed, 
                balance_record : {
                    ...clientProceed.balance_record,
                    draft1_checked: boolVal === "true"
                }
            }
            setClientProceed(obj);
        }
        else{
            const obj = {
                ...clientProceed, 
                balance_record : {
                    ...clientProceed.balance_record,
                    final_checked: clientProceed.balance_record?.checkID ? clientProceed.balance_record.draft1_checked : boolVal === "true"
                }
            }
            setClientProceed(obj);
        }

        AllLockSettle("client_proceeds",bType,boolVal)
        if(bType === "draft1"){
            setChecksLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isDraftLocked: boolVal === "true"
                }))
            );
        }
        else{
            setChecksLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isFinalLocked: row.checkID ? row.isFinalLocked : boolVal === "true"
                }))
            );
        }
    }
    const handleDraftLockChange = (id,sectionName,e) => {
        e.stopPropagation();
        updateLockSettleValue(id,sectionName,"draft1");
        if(sectionName === "balance"){
            const obj = {
                ...clientProceed, 
                balance_record : {
                    ...clientProceed.balance_record,
                    draft1_checked:!clientProceed.balance_record.draft1_checked
                }
            }
            setClientProceed(obj);
        }
        else if(sectionName === "client_proceeds"){
            setChecksLocks((prevStates) =>
                prevStates.map((row) =>
                    row.id === id ? {...row, isDraftLocked: !row.isDraftLocked } : row
                )
            );
        }

    };
    const handleFinalLockChange = (id,sectionName,e) => {
        e.stopPropagation();
        updateLockSettleValue(id,sectionName,"final");
        if(sectionName === "balance"){
            const obj = {
                ...clientProceed, 
                balance_record : {
                    ...clientProceed.balance_record,
                    final_checked:!clientProceed.balance_record.final_checked
                }
            }
            setClientProceed(obj);
        }
        else if(sectionName === "client_proceeds"){
            setChecksLocks((prevStates) =>
                prevStates.map((row) =>
                    row.id === id ? {...row, isFinalLocked: !row.isFinalLocked } : row
                )
            );
        }
    };
    const [action, setAction] = useState("");
    const {
        checks,setChecks,
        checksLocksValues,setChecksLocksValues,
        checksLocks,setChecksLocks,
        clientProceed, setClientProceed,
        showClientProceedPopup,handleClosePopup,handleShowPopup,
        clientProceedFinalAmount,setClientProceedFinalAmount,
        updateClientProceedsState
    } = clientProceeds;
    const [currentCheck,setCurrentCheck] = useState(checks[0] || {})
    return (
        <>
        <div>
            <SectionActionBar sectionName={"Client Proceeds"} />
            <div className="table--no-card rounded-0 border-0 w-100">
                <table className="table table-borderless table-striped table-earning settlement-table">
                    {   checks?.length > 0 &&
                        <thead>
                            <tr id="settle-tb-header" className="settle-t-4">
                                <th className=""></th>
                                <th className="td-autosize provider-col">Name on Check</th>
                                <th className=""></th>
                                <th class={`text-end td-autosize ${checksLocks?.some(lock=>!lock.isDraftLocked) ? "cursor-pointer" : ""}`} 
                                        style={{color:"var(--primary-25) !important"}}                                     
                                        onClick={()=>{
                                            const draftLockCheck = checksLocks?.some(lock=>!lock.isDraftLocked);
                                            if(draftLockCheck){
                                                checksLocks?.forEach((check,index)=>{
                                                    if(!check.isDraftLocked){
                                                        updateRightColumnValue(
                                                            check.isDraftLocked,
                                                            check.isFinalLocked,
                                                            setChecksLocks,
                                                            "check-draft",
                                                            check.id,
                                                            checksLocksValues,
                                                            setChecksLocksValues,
                                                            "client_proceeds",
                                                            "draft1",
                                                            checks[index].amount
                                                        )
                                                    }
                                                })
                                            }
                                        }}
                                    >
                                        <span className='d-flex align-items-center justify-content-end position-relative center-val-div'>
                                            {checksLocks?.some(lock=>!lock.isDraftLocked) && <CopyValueSettlement/>}
                                            Working
                                        </span>
                                </th>
                                <th className={`s-draft text-end ${checksLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked) ? "cursor-pointer" : ""}` }
                                    style={{color:"var(--primary-25) !important"}}
                                    onClick={
                                        ()=>{
                                            const finalLockCheck = checksLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked);
                                            if(finalLockCheck){
                                                checksLocks?.forEach(check=>{
                                                    if(check.isDraftLocked && !check.isFinalLocked && !check.checkID){
                                                        updateRightColumnValue(
                                                            check.isDraftLocked,
                                                            check.isFinalLocked,
                                                            setChecksLocks,
                                                            "check-final",
                                                            check.id,
                                                            checksLocksValues,
                                                            setChecksLocksValues,
                                                            "client_proceeds",
                                                            "final",
                                                            check.isDraftAmount
                                                        )
                                                    }
                                                })
                                            }
                                            // const finalLockCheck1 = clientProceed?.balance_record?.draft1_checked && !clientProceed?.balance_record?.final_checked;
                                            // if (finalLockCheck1) {
                                            //     const input = document.querySelector(".proceed-final");
                                                
                                            //     // Ensure numericValue is a valid number
                                            //     let numericValue = parseFloat(clientProceed?.balance_record?.draft1) || 0;

                                            //     // Format to 2 decimal places
                                            //     numericValue = numericValue.toFixed(2);

                                            //     input.setAttribute('data-value', numericValue);
                                            //     input.placeholder = numericValue !== "0.00" ? currencyFormat(numericValue) : "$ 0.00";
                                            //     input.value = numericValue !== "0.00" ? currencyFormat(numericValue) : "$ 0.00";

                                            //     updateLockSettleAmount(clientProceed?.balance_record?.id, "balance", "final", numericValue);
                                            //     const obj = {
                                            //         ...clientProceed, 
                                            //         balance_record : {
                                            //             ...clientProceed.balance_record,
                                            //             draft1:numericValue
                                            //         }
                                            //     }
                                            //     setClientProceed(obj);
                                            // }
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
                                                    lockAllClientProceeds("draft1",'false');                                              
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <img
                                                id="unlock-image"
                                                className='ic ic-19 lock-icon'
                                                alt="lock-icon"
                                                onClick={(e)=>{
                                                    e.stopPropagation();
                                                    lockAllClientProceeds("draft1",'true');
                                                }}
                                                src={locked}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                        <span className='d-flex align-items-center justify-content-end position-relative center-val-div draft-central-div' style={{ paddingRight: "2px" }}>
                                            {checksLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked && !lock.checkID) && <CopyValueSettlement />}
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
                                                    lockAllClientProceeds("final",'false');
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
                                                    lockAllClientProceeds("final",'true');
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                        <span style={{paddingRight:"2px"}}>Final</span>
                                    </div>   
                                </th>
                                <th className="s-verify"></th> 
                                <th className='td-autosize check-request-td text-center' style={{color:"var(--primary-25) !important"}}>Check</th>
                            </tr>
                        </thead>
                    }
                    <tbody id="body-table">
                        {/* {checks?.length == 0 && <SettlementEmptyTable tableName={"client_proceeds"} />} */}
                        { checks?.length == 0 &&                                 
                            <tr id="cost-settle-row" className='add-btn-row'>
                                <td className='text=center cursor-pointer' colSpan={ 8 }> 
                                    
                                    <div className='settle-add-btn btn'>
                                        <button type="button" onClick={(e)=>{
                                            e.stopPropagation();
                                            setShowSettlementPopup(true);
                                            }} 
                                        className="btn">
                                            <span className="font-weight-bold text-gold">+ </span>
                                            <span>Client Proceeds Check</span> 
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        }
                        { 
                        !isNaN(clientProceed.working) && checks.length > 0 && 
                            <tr className="height-25">
                                <td></td>
                                <td className="height-25 text-capitalize text-right" colSpan={3}>
                                    <span className='whitespace-SETTLE primary-clr-25'>Total Client Proceeds: </span>
                                    <p className="d-inline-flex align-items-center height-25 monospace-font text-right font-weight-bold dollar-amount-value" data-value={clientProceed?.working || 0.00}>
                                        {currencyFormat(clientProceed?.working || 0.00)}
                                    </p>
                                </td>
                                <td className="s-draft text-right monospace-font" data-value={clientProceed?.balance_record?.draft1}>
                                    <span style={{paddingRight:"2px"}}>{ currencyFormat(clientProceed?.balance_record?.draft1) }</span>
                                </td>
                                <td className="s-final text-right monospace-font" data-value={clientProceed?.balance_record?.final}>
                                    <span style={{paddingRight:"2px"}}>{ currencyFormat(clientProceed?.balance_record?.final) }</span>
                                </td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td text-center"></td>
                            </tr>
                        }
                        {checks?.length > 0 && checks?.map((check,index)=>                        
                            <tr className="height-25"                             
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    setAction("EDIT");
                                    setCurrentCheck(check);
                                    handleShowEditModal();
                                }}
                            >                  
                                <td className="">{index + 1}</td>
                                <td className='provider-col text-left'>{check?.name_on_check}</td>
                                <td className="" ></td>
                                <td className={`monospace-font td-autosize dollar-amount-value text-right ${!checksLocks[index].isDraftLocked ? "cursor-pointer" : ""}`} data-value={check?.amount}>
                                    <span className={`d-flex align-items-center ${!checksLocks[index].isDraftLocked ? "justify-content-between cursor-pointer" : "justify-content-end"} align-items-center position-relative center-val-div`} onClick={(e)=>
                                        {
                                            e.stopPropagation();
                                            updateRightColumnValue(
                                            checksLocks[index].isDraftLocked,
                                            checksLocks[index].isFinalLocked,
                                            setChecksLocks,
                                            "check-draft",
                                            check?.id,
                                            checksLocksValues,
                                            setChecksLocksValues,
                                            "client_proceeds",
                                            "draft1",
                                            check?.amount
                                        )
                                    }
                                    }>
                                        {!checksLocks[index].isDraftLocked && <CopyValueSettlement/>}
                                        {currencyFormat(check?.amount)}
                                    </span>
                                </td>
                                <td className="s-draft text-right" onClick={(e)=>{
                                        e.stopPropagation();
                                        updateRightColumnValue(
                                            checksLocks[index].isDraftLocked,
                                            checksLocks[index].isFinalLocked,
                                            setChecksLocks,
                                            "check-final",
                                            check?.id,
                                            checksLocksValues,
                                            setChecksLocksValues,
                                            "client_proceeds",
                                            "final",
                                            checksLocks[index].isDraftAmount
                                        )
                                    }}>
                                    <div  className={`monospace-font d-flex justify-content-between align-items-center height-25 position-relative center-val-div`}>
                                        <img
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // if(checksLocks[index].checkID){
                                                //     console.log(checksLocks[index].checkID);
                                                //     setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${checksLocks[index].checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                //     handleErrorShow();
                                                //     return;
                                                // }
                                                const inputField = e.target.nextElementSibling;
                                                if (!checksLocks[index].isDraftLocked) {
                                                
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
                                                handleDraftLockChange(check?.id,"client_proceeds",e)
                                            }}
                                            id="lock-image"
                                            className='ic ic-19'
                                            src={checksLocks[index].isDraftLocked ?  locked :  unlocked}
                                            alt="lock-icon"
                                            style={{cursor: 'pointer' }}
                                        />
                                        <input
                                            id="lock-input"
                                            className={`${(checksLocks[index].isDraftLocked && !checksLocks[index].isFinalLocked) ? "cursor-pointer" : ""} monospace-font check-draft-${check?.id} text-right check-draft dollar-amount-value ${
                                                checksLocks[index].isDraftLocked ? "locked-input" : "unlock-input"
                                            } ${  ["0", "0.00"].includes(check?.draft1.toString()) ? "zero-placeholder" : "black-placeholder"}`}
                                            type={"text"}
                                            data-value={check?.draft1}                                                   
                                            readOnly={checksLocks[index].isDraftLocked}
                                            placeholder={check?.draft1 ? currencyFormat(check?.draft1) : "$ 0.00"}
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
                                            updateLockSettleAmount(check?.id,"client_proceeds","draft1",parseFloat(numericValue || 0).toFixed(2));
                                            setChecksLocks((prevStates) =>
                                                prevStates.map((row) =>
                                                    row.id === check?.id ? { ...row, isDraftAmount: numericValue } : row
                                                )
                                            );
                                            if (numericValue !== '' && !isNaN(numericValue)) {
                                                let num = parseFloat(numericValue);

                                                if (num > 999999.99) num = 999999.99; 
                                                else if (num < -999999.99) num = -999999.99; 

                                                numericValue = num.toString(); 
                                            }

                                            e.target.setAttribute('data-value', numericValue); 
                                        
                                            const loanInputs = [...document.querySelectorAll('.check-draft')];
                                        
                                            
                                            const sum = loanInputs.reduce((acc, input) => {
                                                const val = input.getAttribute('data-value') || '0';
                                                const num = parseFloat(val);
                                        
                                                return !isNaN(num) ? acc + num : acc;
                                            }, 0);
                                    
                                            setChecksLocksValues([sum, checksLocksValues[1] ])
                                            }}
                                            onMouseEnter={(e) => {                                     
                                                if(checksLocks[index].isDraftLocked && !checksLocks[index].isFinalLocked){
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
                                                if(checksLocks[index].isDraftLocked && !checksLocks[index].isFinalLocked){
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
                                        {checksLocks[index].isDraftLocked && !checksLocks[index].isFinalLocked && <CopyValueSettlement draft={true} />}
                                    </div>
                                </td>
                                <td className="s-final" onClick={(e)=>e.stopPropagation()}>
                                    <div className="monospace-font d-flex justify-content-between align-items-center height-25">
                                        <img
                                            onClick={(e) =>{
                                                e.stopPropagation();
                                                if(checksLocks[index]?.checkID){
                                                    setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${checksLocks[index].checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                    handleErrorShow();
                                                    return;
                                                }
                                                const inputField = e.target.nextElementSibling;
                                                if (!checksLocks[index].isFinalLocked) {
                                                
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
                                                handleFinalLockChange(check?.id,"client_proceeds",e);
                                            }}
                                            id="lock-image"
                                            className={`ic ic-19 ${checksLocks[index].checkID?.check_sent ? "invisible" : ""}`}
                                            src={checksLocks[index].isFinalLocked ? (checksLocks[index].checkID?.check_sent ? lockedGrey : locked) : (checksLocks[index].checkID?.check_sent ? unlockedGrey : unlocked)}
                                            alt="lock-icon"
                                            style={{cursor: 'pointer' }}
                                            
                                        />
                                        <input
                                            id="lock-input"
                                            className={`monospace-font check-final-${check?.id} text-right check-final dollar-amount-value ${
                                                checksLocks[index].isFinalLocked ? "locked-input" : "unlock-input"
                                            } ${["0", "0.00"].includes(check?.final.toString()) ? "zero-placeholder" : "black-placeholder"}`}                                          
                                            type="text"
                                            data-value={check?.final}                                                   
                                            disabled={checksLocks[index].isFinalLocked}
                                            placeholder={check?.final ? currencyFormat(check?.final) : "$ 0.00"}
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

                                                updateLockSettleAmount(check?.id, "client_proceeds", "final", parseFloat(numericValue || 0).toFixed(2));
                                                setChecksLocks((prevStates) =>
                                                    prevStates.map((row) =>
                                                        row.id === check?.id ? { ...row, isFinalAmount: numericValue } : row
                                                    )
                                                );

                                                if (numericValue !== '' && !isNaN(numericValue)) {
                                                    let num = parseFloat(numericValue);

                                                    if (num > 999999.99) num = 999999.99; 
                                                    else if (num < -999999.99) num = -999999.99; 

                                                    numericValue = num.toString(); 
                                                }

                                                e.target.setAttribute("data-value", numericValue); 
                                            
                                                const loanInputs = [...document.querySelectorAll('.check-final')];
                                                const sum = loanInputs.reduce((acc, input) => {
                                                    const val = input.getAttribute("data-value") || "0";
                                                    const num = parseFloat(val);
                                                    return !isNaN(num) ? acc + num : acc;
                                                }, 0);

                                                setChecksLocksValues([checksLocksValues[0], sum]);
                                            }}
                                        />

                                    </div>
                                </td>
                                <td className="s-verify" onClick={(e)=>e.stopPropagation()}>
                                    <ChequeUpload entity={check} panel={"client_proceeds"} pageId={page_id_click_record} documentType="verify" updateStates={updateClientProceedsState} handleNoCheckShow={handleNoCheckShow}/>
                                </td>
                                <td className="td-autosize check-request-td text-center" onClick={(e)=>e.stopPropagation()}>
                                    <div className={`${ checksLocks[index]?.checkID?.cheque_number ? "check-class" : "d-flex justify-content-center" } `}>
                                        {
                                            ((!checksLocks[index].checkID && checksLocks[index].isFinalLocked && checksLocks[index].isFinalAmount!=0)) ? <div className="settle-check-request-btn btn" id="nomargin">
                                                <RequestCheckButton onHandleClick={async() => {
                                                    try {
                                                        const res = await getPanelDetail("edit-clientproceeds","client_proceed_id",check?.id);
                                                        // If a check was already requested, show error
                                                        if (res) {
                                                            if (res?.data?.checkID?.date_check_requested) {
                                                                setMsgError("Check has already been requested by another user. Close the popup to see the details.");
                                                                handleErrorShow();
                                                            } else {
                                                                setMsgError(""); // Clear error if no request date found
                                                                setCurrentCheck({...check,final:checksLocks[index].isFinalAmount})
                                                                updateClientProceedsState()
                                                                handleCheckRequestShow()
                                                                
                                                            }
                                                        } else {
                                                            setMsgError(""); // No checkID, so no error
                                                            setCurrentCheck({...check,final:checksLocks[index].isFinalAmount})
                                                            updateClientProceedsState()
                                                            handleCheckRequestShow()
                                                            
                                                        }
                                                    } catch (error) {
                                                        setMsgError(""); // Optional: Or you can set a different error message
                                                        console.error("Error fetching request details:", error);
                                                        setCurrentCheck({...check,final:checksLocks[index].isFinalAmount})
                                                        updateClientProceedsState()
                                                        handleCheckRequestShow()
                                                        
                                                    }
                                                }} />
                                                {/* <RequestCheckButton onHandleClick={() => {
                                                    setCurrentCheck({...check,final:checksLocks[index].isFinalAmount})
                                                    updateClientProceedsState()
                                                    handleCheckRequestShow()
                                                }} /> */}
                                            </div>
                                                :
                                                <>
                                                    <div className='d-flex justify-content-center'>
                                                        <span>{checksLocks[index].checkID?.cheque_date ? '' : checksLocks[index].checkID?.date_check_requested && <span className='requested-btn'>Requested:&nbsp;</span>}</span>
                                                        
                                                        <span>{formatDate(checksLocks[index].checkID?.cheque_date || checksLocks[index].checkID?.date_check_requested || '')}</span>
                                                    </div>
                                                </>
                                        }
                                        {checksLocks[index]?.checkID?.cheque_number && <span className='d-inline-block check-number'>{checksLocks[index]?.checkID?.cheque_number}</span>}
                                        {checksLocks[index]?.checkID?.cheque_number && <ChequeUpload entity={check} panel={"client_proceeds"} pageId={page_id_click_record} documentType="check_as_sent" updateStates={updateClientProceedsState} handleNoCheckShow={handleNoCheckShow}/>}
                                    </div>
                                </td>   
                            </tr>)
                        }
                        {checks?.length > 0 &&  
                            <tr className="height-25">
                                <td></td>
                                <td className="height-25 text-capitalize text-right" colSpan={3}>
                                    <span className='whitespace-SETTLE primary-clr-25'>Client Proceeds Remaining to be Distributed: </span>
                                    <p className="d-inline-flex align-items-center height-25 monospace-font text-right font-weight-bold dollar-amount-value" data-value={clientProceedFinalAmount || 0.00}>
                                        {currencyFormat(clientProceedFinalAmount || 0.00)}
                                    </p>
                                </td>
                                <td className="s-draft monospace-font text-right">
                                    <span style={{paddingRight:"2px"}} data-value={checksLocksValues[0] || 0.00} className='dollar-amount-value'>{currencyFormat(checksLocksValues[0] || 0.00)}</span>
                                </td>
                                <td className="s-final monospace-font text-right">
                                    <span style={{paddingRight:"2px"}} data-value={checksLocksValues[1] || 0.00} className='dollar-amount-value'>{currencyFormat(checksLocksValues[1] || 0.00)}</span>
                                </td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td"></td>
                            </tr>
                        }

                    </tbody>
                </table>
            </div>
        </div>
        <ClientProceedPopup
            show={showEditModal}  
            updateClientProceedStates={updateClientProceedsState}
            action={action}
            check={currentCheck}
            handleClose={handleCloseEditModal}
        />
        { showSettlementPopup &&
            <GenericSettlementAddPopup 
            show={showSettlementPopup}                 
            handleClose={()=>{
            setShowSettlementPopup(false);
            }} 
            initialLabel={"Client Proceeds Check"}
                {...settlementObjProps}
            />
        }
        <SettlementErrorModal show={errorModal} handleClose={handleErrorClose} errorMsg={errorMsg} updateStates={updateClientProceedsState} />
        <SettlementNoCheckModal show={showNoCheckModal} handleClose={handleNoCheckClose} />
        <SettlementCheckRequest show={showCheckRequestModal} handleClose={handleCheckRequestClose} panelLabel={"ClientProceeds"} finalAmount={currentCheck?.final} panelName={"client_proceeds"} panelEntity={currentCheck} updateStates={updateClientProceedsState} />
        </>
    )
}

export default ClientProceeds