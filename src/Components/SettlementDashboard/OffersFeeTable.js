import React, { useState,useEffect } from 'react';
import locked from '../../../public/BP_resources/images/icon/locked.svg';
import unlocked from '../../../public/BP_resources/images/icon/unlocked.svg';
import lockedGrey from '../../../public/BP_resources/images/icon/locked-grey.svg';
import unlockedGrey from '../../../public/BP_resources/images/icon/unlocked-grey.svg';
import EditFeesPopup from '../Modals/EditFeesPopup';
import updateLockSettleValue from './common/updateLockSettleValue';
import { currencyFormat, formatDate,inputCurrencyFormat } from '../../Utils/helper';
import CurrentUserInfo from './common/CurrentUserInfo';
import SettlementErrorModal from '../Modals/SettlementErrorModal';
import SettlementNoCheckModal from '../Modals/SettlementNoCheckModal';
import SettlementCheckRequest from '../Modals/SettlementCheckRequest';
import updateLockSettleAmount from './common/updateLockSettleAmount';
import AllLockSettle from './common/AllLockSettle';
import ChequeUpload from './ChequeUpload';
import { useSelector } from 'react-redux';
import SectionActionBar from './SectionActionBar';
import updateRightColumnValue from './common/updateRightColumnValue';
import RequestCheckButton from './common/RequestCheckButton';
import CopyValueSettlement from './common/CopyValueSettlement';
import getPanelDetail from './api/getPanelDetail';
import GenericSettlementAddPopup from '../Modals/GenericSettlementAddPopup';

const OffersFeeTable = ({clientProceeds, feesObj, settlementObjProps, initialOffers}) => {
    const caseSummary = useSelector((state) => state?.caseData?.summary);
    console.log(caseSummary)
    const [showSettlementPopup, setShowSettlementPopup] = useState(false);
    const {clientProceed,setClientProceed,updateClientProceedsState} = clientProceeds;
    const lockAllFees = (bType,boolVal) => {
        AllLockSettle("fees",bType,boolVal)
        if(bType === "draft1"){
            setFeesLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isDraftLocked: boolVal === "true"
                }))
            );
        }
        else{
            setFeesLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isFinalLocked: row.checkID ? row.isFinalLocked : boolVal === "true"
                }))
            );
        }
    }
    const page_id_click_record = useSelector(
        (state) => state.page_id_click_record.page_id_click_record
    );
    const handleDraftLockChange = (id,sectionName,event) => {
        event.stopPropagation(); 
        updateLockSettleValue(id,"fees","draft1") 
        setFeesLocks((prevStates) =>
            prevStates.map((row) =>
                row.id === id ? { ...row, isDraftLocked: !row.isDraftLocked } : row
            )
        );
    };
    const [modalAction,setModalAction] = useState("")
    const [errorMsg, setMsgError] = useState("")
    const [showNoCheckModal, setNoCheckModal] = useState(false);
    const handleNoCheckClose = () => setNoCheckModal(false);
    const handleNoCheckShow = () => setNoCheckModal(true);

    const [showCheckRequestModal, setCheckRequestModal] = useState(false);
    const handleCheckRequestClose = () => setCheckRequestModal(false);
    const handleCheckRequestShow = () => setCheckRequestModal(true);

    const handleFinalLockChange = (id,sectionName,event) => {
        event.stopPropagation(); 
        updateLockSettleValue(id,"fees","final")
        setFeesLocks((prevStates) =>
            prevStates.map((row) =>
                row.id === id ? { ...row, isFinalLocked: !row.isFinalLocked } : row
            )
        );
    };  
    const { 
        feesLocks, setFeesLocks,
        fees,feesPercentages, setFees,
        feesFinalAmount, feesLockValues, 
        showFeeModal, setFeesLockValues,
        handleFeeClose, handleFeeShow,
        currentFee, setCurrentFee,
        feesCombinationList,
        currentCombination, setCurrentCombination,
        showErrorModal,
        setFeesFinalAmount,
        handleErrorClose, handleErrorShow,
        updateFeesState
    } = feesObj;
    let offer_num = 1;
    return (
        <>
        
            <div className='m-b-5'>
                <SectionActionBar sectionName={"Fees"} />
                <div className="table--no-card rounded-0 border-0 w-100">
                    <table className="table table-borderless table-striped table-earning settlement-table">
                        {   fees?.length > 0 &&
                            <thead>
                                <tr id="settle-tb-header" className="settle-t-4">
                                    <th className=""></th>
                                    <th className="td-autosize text-center">Added</th>
                                    <th className=""></th>
                                    <th className='text-center' colSpan={3}>Negotiating Party</th>
                                    <th className="c-percentage"></th>
                                    <th className="td-autosize text-end">Fee</th>
                                    <th className=""></th>
                                    <th className=""></th>
                                    <th className=""></th>
                                    <th className={`td-autosize text-end ${feesLocks?.some(lock=>!lock.isDraftLocked) ? "cursor-pointer" : ""}`}
                                        style={{color:"var(--primary-25) !important"}}
                                        onClick={()=>{
                                            const draftLockCheck = feesLocks?.some(lock=>!lock.isDraftLocked);
                                            if(draftLockCheck){
                                                feesLocks?.forEach((fee,index)=>{
                                                    if(!fee.isDraftLocked){
                                                        updateRightColumnValue(
                                                            fee.isDraftLocked,
                                                            fee.isFinalLocked,
                                                            setFeesLocks,
                                                            "fee-draft",
                                                            fee.id,
                                                            feesLockValues,
                                                            setFeesLockValues,
                                                            "fees",
                                                            "draft1",
                                                            fees[index].final_amount
                                                        )
                                                    }
                                                })
                                                updateClientProceedsState();
                                            }
                                        }}
                                    >
                                        <span className='d-flex align-items-center justify-content-end position-relative center-val-div'>
                                            {feesLocks?.some(lock=>!lock.isDraftLocked) && <CopyValueSettlement/>}
                                            Working
                                        </span>
                                    </th>
                                    <th className={`s-draft text-end ${feesLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked) ? "cursor-pointer" : ""}`} 
                                        style={{color:"var(--primary-25) !important"}}
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            const finalLockCheck = feesLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked);
                                            if(finalLockCheck){
                                                feesLocks?.forEach(fee=>{
                                                    if(fee.isDraftLocked && !fee.isFinalLocked && !fee.checkID){
                                                        updateRightColumnValue(
                                                            fee.isDraftLocked,
                                                            fee.isFinalLocked,
                                                            setFeesLocks,
                                                            "fee-final",
                                                            fee.id,
                                                            feesLockValues,
                                                            setFeesLockValues,
                                                            "fees",
                                                            "final",
                                                            fee.isDraftAmount
                                                        )
                                                    }
                                                })
                                                updateClientProceedsState();
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
                                                    style={{cursor: 'pointer' }}
                                                />
                                                <img
                                                    id="lock-image"
                                                    className='ic ic-19 lock-icon'
                                                    src={unlocked}
                                                    alt="lock-icon"
                                                    onClick={(e)=>{
                                                        e.stopPropagation();
                                                        lockAllFees("draft1",'false');
                                                    }}
                                                    style={{cursor: 'pointer' }}
                                                />
                                                <img
                                                    id="unlock-image"
                                                    className='ic ic-19 lock-icon'
                                                    alt="lock-icon"
                                                    src={locked}
                                                    onClick={(e)=>{
                                                        e.stopPropagation();
                                                        lockAllFees("draft1",'true');
                                                    }}
                                                    style={{cursor: 'pointer' }}
                                                />
                                            </div>
                                            <span className='d-flex align-items-center justify-content-end position-relative center-val-div draft-central-div' style={{ paddingRight: "2px" }}>
                                                {feesLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked  && !lock.checkID) && <CopyValueSettlement />}
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
                                                        lockAllFees("final",'false');
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
                                                        lockAllFees("final",'true');
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
                            { fees?.length == 0 &&                                 
                                <tr id="cost-settle-row" className='add-btn-row'>
                                    <td className='text=center cursor-pointer' colSpan={ 16 }> 
                                        
                                        <div className='settle-add-btn btn'>
                                            <button type="button" onClick={(e)=>{
                                                e.stopPropagation();
                                                setShowSettlementPopup(true);
                                                }} 
                                            className="btn">
                                                <span className="font-weight-bold text-gold">+ </span>
                                                <span>Fee</span> 
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            }
                            {fees?.length > 0 && fees?.map((fee,index) => {
                                const by = fee?.offer?.by_entity_client ? `${fee?.offer?.by_entity_client.first_name || ''} ${fee?.offer?.by_entity_client.last_name || ''}` : 
                                        fee?.offer?.by_defendant?.defendantType?.name === "Private Individual" ? 
                                        `${fee?.offer?.by_defendant?.first_name || ''} ${fee?.offer?.by_defendant?.last_name || ''}` :
                                        `${fee?.offer?.by_defendant?.entity_name || ''}`;
                            
                                const party = fee?.offer?.entity_client ? `${fee?.offer?.entity_client.first_name || ''} ${fee?.offer?.entity_client.last_name || ''}` : 
                                        fee?.offer?.defendant?.defendantType?.name === "Private Individual" ? 
                                        `${fee?.offer?.defendant?.first_name || ''} ${fee?.offer?.defendant?.last_name || ''}` :
                                        `${fee?.offer?.defendant?.entity_name || ''}`;
                                
                                return fee?.offer && 
                                <tr key={index} style={{ height: '25px' }} onClick={()=>{
                                    setCurrentFee(fee);
                                    setModalAction("EDIT");
                                    setCurrentCombination(feesCombinationList[0]);
                                    handleFeeShow();
                                }}>
                                    <td className="">{offer_num++}</td>
                                    <td className="td-autosize">
                                        <div class="d-flex align-items-center">
                                            <span className='m-r-5'>{formatDate(fee?.last_edited)}</span>
                                            <div class="d-flex align-items-center">
                                                {fee?.offer?.firm_user?.profile_pic_29p ?
                                                <img
                                                    src={fee?.offer?.firm_user?.profile_pic_29p}
                                                    className="ic ic-19"
                                                    style={{borderRadius:"50%"}}
                                                />
                                                :
                                                <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img mr-lg-1"></span>
                                                }
                                                <span className=''>{fee?.offer?.firm_user?.first_name} {fee?.offer?.firm_user?.last_name}</span>
                                            
                                            </div>
                                        </div>
                                        </td>
                                    <td className="td-autosize height-33">
                                        {/* <CurrentUserInfo id={fee?.last_edited_by} /> */}
                                    </td>
                                    <td className="td-autosize">
                                        {fee?.offer?.insurance?.company ? "" : party} 
                                        {by}
                                    </td>
                                    <td className="td-autosize height-33">{fee?.offer?.insurance?.company}</td>
                                    <td className="text-end monospace-font td-autosize dollar-amount-value med-bill-width" 
                                        data-value={fee.offer?.demand && fee.offer?.demand == 0 ? fee.offer?.amount || 0.00  : fee.offer?.demand || 0.00}
                                        >
                                        {fee.offer?.demand && fee.offer?.demand == 0 ? currencyFormat(fee.offer?.amount || 0.00)  : currencyFormat(fee.offer?.demand || 0.00) }
                                        
                                        
                                    </td>
                                    <td className="c-percentage height-33">{fee?.percentage || 0} %</td>
                                    <td className="dollar-amount-value monospace-font td-autosize text-end med-bill-width" data-value={fee.amount || 0}>{currencyFormat(fee?.amount)}</td>
                                    <td className="text-capitalize big-n-2 height-33"></td>
                                    <td className=""></td>
                                    <td className=""></td>
                                    <td className={`monospace-font  dollar-amount-value td-autosize text-right ${!feesLocks[index].isDraftLocked ? "cursor-pointer" : ""}`} data-value={fee.amount || 0.00}>
                                        <span className={`d-flex align-items-center ${!feesLocks[index].isDraftLocked ? "justify-content-between cursor-pointer" : "justify-content-end"} align-items-center position-relative center-val-div`} onClick={(e) => {
                                            e.stopPropagation();
                                            updateRightColumnValue(
                                                feesLocks[index].isDraftLocked,
                                                feesLocks[index].isFinalLocked,
                                                setFeesLocks,
                                                "fee-draft",
                                                fee.id,
                                                feesLockValues,
                                                setFeesLockValues,
                                                "fees",
                                                "draft1",
                                                fee.amount || 0.00
                                            );
                                            clientProceeds.updateClientProceedsState();
                                        }
                                        }>
                                            {!feesLocks[index].isDraftLocked && <CopyValueSettlement />}
                                            {currencyFormat(fee.amount || 0.00)}
                                        </span>
                                    </td>
                                    <td className={`s-draft text-end`} onClick={(e) => {
                                        e.stopPropagation();
                                        updateRightColumnValue(
                                            feesLocks[index].isDraftLocked,
                                            feesLocks[index].isFinalLocked,
                                            setFeesLocks,
                                            "fee-final",
                                            fee.id,
                                            feesLockValues,
                                            setFeesLockValues,
                                            "fees",
                                            "final",
                                            feesLocks[index].isDraftAmount
                                        );
                                        clientProceeds.updateClientProceedsState();
                                    }}>
                                        <div className="monospace-font d-flex justify-content-between align-items-center height-25 position-relative center-val-div">
                                            <img
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // if(feesLocks[index].checkID){
                                                    //     setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${feesLocks[index].checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                    //     handleErrorShow();
                                                    //     return;
                                                    // }
                                                    const inputField = e.target.nextElementSibling;
                                                    if (!feesLocks[index].isDraftLocked) {
                                                    
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
                                                    handleDraftLockChange(fee.id,"fees",e)
                                                }}
                                                id="lock-image"
                                                className='ic ic-19'
                                                src={feesLocks[index]?.isDraftLocked ?  locked :  unlocked}
                                                alt="lock-icon"
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <input
                                                id="lock-input"
                                                className={`${(feesLocks[index].isDraftLocked && !feesLocks[index].isFinalLocked) ? "cursor-pointer" : ""} monospace-font text-right fee-draft-${fee.id} fee-draft dollar-amount-value ${
                                                    feesLocks[index].isDraftLocked ? "locked-input" : "unlock-input"
                                                } ${ ["0", "0.00"].includes(fee.draft1.toString()) ? "zero-placeholder" : "black-placeholder"}`}
                                                
                                                type={"text"}
                                                data-value={fee.draft1}                                               
                                                readOnly={feesLocks[index].isDraftLocked}
                                                placeholder={fee.draft1 ? currencyFormat(fee.draft1) : "$ 0.00"}                                     
                                                onClick={(e)=>e.stopPropagation()}
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
                                                onChange={async(e)=>{
                                                    let numericValue = e.target.value
                                                    .replace(/[^0-9.-]/g, '') 
                                                    .replace(/(?!^)-/g, '');

                                                    const res = await updateLockSettleAmount(fee.id,"fees","draft1",parseFloat(numericValue || 0).toFixed(2));

                                                    if (numericValue !== '' && !isNaN(numericValue)) {
                                                        let num = parseFloat(numericValue);

                                                        if (num > 999999.99) num = 999999.99; 
                                                        else if (num < -999999.99) num = -999999.99; 

                                                        numericValue = num.toString(); 
                                                    }

                                                    e.target.setAttribute('data-value', numericValue); 
                                                
                                                    const loanInputs = [...document.querySelectorAll('.fee-draft')];
                                                
                                                    
                                                    const sum = loanInputs.reduce((acc, input) => {
                                                        const val = input.getAttribute('data-value') || '0';
                                                        const num = parseFloat(val);
                                                
                                                        return !isNaN(num) ? acc + num : acc;
                                                    }, 0);
                                                    const obj = {
                                                        ...clientProceed, 
                                                        balance_record : {
                                                            ...clientProceed.balance_record,
                                                            draft1:res?.data?.balance_record?.draft1
                                                        }
                                                    }
                                                    setClientProceed(obj);
                                                    updateClientProceedsState();
                                                    // setTotalDraftFee(sum);
                                                    setFeesLockValues([sum, feesLockValues[1] ])
                                                }}
                                                onMouseEnter={(e) => {                                     
                                                    if(feesLocks[index].isDraftLocked && !feesLocks[index].isFinalLocked){
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
                                                    if(feesLocks[index].isDraftLocked && !feesLocks[index].isFinalLocked){
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
                                            {(feesLocks[index].isDraftLocked && !feesLocks[index].isFinalLocked) && <CopyValueSettlement draft={true} />}
                                        </div>
                                    </td>
                                    <td className="s-final text-right">
                                        <div className="monospace-font input-lock-container d-flex">
                                        <img
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if(feesLocks[index].checkID){
                                                    setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${feesLocks[index].checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                    handleErrorShow();
                                                    return;
                                                }
                                                const inputField = e.target.nextElementSibling;
                                                if (!feesLocks[index].isFinalLocked) {
                                                    
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
                                                handleFinalLockChange(fee.id, "fees", e);
                                            }}
                                            id="lock-image"
                                            className={`ic ic-19 ${feesLocks[index].checkID?.check_sent ? "invisible" : ""} `}
                                            src={feesLocks[index]?.isFinalLocked ? (feesLocks[index]?.checkID?.check_sent ? lockedGrey : locked) : (feesLocks[index]?.checkID?.check_sent ? unlockedGrey : unlocked)}
                                            alt="lock-icon"
                                            style={{ cursor: 'pointer' }}
                                        />

                                        <input
                                            id="lock-input"
                                            className={`monospace-font text-right fee-final-${fee.id} fee-final dollar-amount-value ${
                                                feesLocks[index].isFinalLocked ? "locked-input" : "unlock-input"
                                            } ${  ["0", "0.00"].includes(fee.final.toString()) ? "zero-placeholder" : "black-placeholder"}`}
                                            
                                            type={"text"}
                                            
                                            data-value={fee.final}
                                            disabled={feesLocks[index].isFinalLocked}
                                            placeholder={fee.final ? currencyFormat(fee.final) : "$ 0.00"}
                                            onClick={(e) => e.stopPropagation()}
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
                                            onChange={async (e) => {
                                                let numericValue = e.target.value
                                                    .replace(/[^0-9.-]/g, '') 
                                                    .replace(/(?!^)-/g, '');

                                                const res = await updateLockSettleAmount(fee.id,"fees","final",parseFloat(numericValue || 0).toFixed(2));
                                                setFeesLocks((prevStates) =>
                                                    prevStates.map((row) =>
                                                        row.id === fee.id ? { ...row, isFinalAmount: numericValue } : row
                                                    )
                                                );

                                                if (numericValue !== '' && !isNaN(numericValue)) {
                                                    let num = parseFloat(numericValue);

                                                    if (num > 999999.99) num = 999999.99; 
                                                    else if (num < -999999.99) num = -999999.99; 

                                                    numericValue = num.toString(); 
                                                }

                                                e.target.setAttribute('data-value', numericValue); 
                                            
                                                const loanInputs = [...document.querySelectorAll('.fee-final')];
                                            
                                                
                                                const sum = loanInputs.reduce((acc, input) => {
                                                    const val = input.getAttribute('data-value') || '0';
                                                    const num = parseFloat(val);
                                            
                                                    return !isNaN(num) ? acc + num : acc;
                                                }, 0);

                                                const obj = {
                                                    ...clientProceed, 
                                                    balance_record : {
                                                        ...clientProceed.balance_record,
                                                        final:res?.data?.balance_record?.final
                                                    }
                                                }
                                                setClientProceed(obj);
                                                updateClientProceedsState();
                                                // setTotalFinalFee(sum);
                                                setFeesLockValues([feesLockValues[0], sum]);
                                            }}
                                        />
                                        </div>
                                    </td>
                                    <td className="s-verify" onClick={(e)=>e.stopPropagation()}>
                                        <ChequeUpload entity={fee} panel={"fee"} pageId={page_id_click_record} documentType="verify" updateStates={updateFeesState} handleNoCheckShow={handleNoCheckShow}/>
                                    </td>  
                                    <td className="td-autosize text-center check-request-td" onClick={(e)=>e.stopPropagation()}>
                                        <div className={`${ feesLocks[index]?.checkID?.cheque_number ? "check-class" : "d-flex justify-content-center" } `}>
                                            {
                                                ((!feesLocks[index].checkID && feesLocks[index].isFinalLocked && feesLocks[index].isFinalAmount != 0)) ? <div className="settle-check-request-btn btn" id="nomargin">
                                                    <RequestCheckButton onHandleClick={async() => {
                                                        try {
                                                            const res = await getPanelDetail("edit-fees","fee_id",fee?.id);
                                                            // If a check was already requested, show error
                                                            if (res) {
                                                                if (res?.data?.checkID?.date_check_requested) {
                                                                    setMsgError("Check has already been requested by another user. Close the popup to see the details.");
                                                                    handleErrorShow();
                                                                } else {
                                                                    setMsgError(""); // Clear error if no request date found
                                                                    setCurrentFee({...fee,final:feesLocks[index].isFinalAmount});
                                                                    updateFeesState();
                                                                    handleCheckRequestShow();
                                                                    
                                                                }
                                                            } else {
                                                                setMsgError(""); // No checkID, so no error
                                                                setCurrentFee({...fee,final:feesLocks[index].isFinalAmount});
                                                                updateFeesState();
                                                                handleCheckRequestShow();
                                                                
                                                            }
                                                        } catch (error) {
                                                            setMsgError(""); // Optional: Or you can set a different error message
                                                            console.error("Error fetching request details:", error);
                                                            setCurrentFee({...fee,final:feesLocks[index].isFinalAmount});
                                                            updateFeesState();
                                                            handleCheckRequestShow();
                                                            
                                                        }

                                                    }} />
                                                    
                                                    {/* <RequestCheckButton onHandleClick={() => {
                                                        setCurrentFee({...fee,final:feesLocks[index].isFinalAmount});
                                                        updateFeesState();
                                                        handleCheckRequestShow();
                                                    }} /> */}
                                                </div>
                                                    :
                                                    <>
                                                        <div className='d-flex justify-content-center'>
                                                            <span>{feesLocks[index].checkID?.cheque_date ? '' : feesLocks[index].checkID?.date_check_requested && <span className='requested-btn'>Requested:&nbsp;</span>}</span>
                                                            
                                                            <span>{formatDate(feesLocks[index].checkID?.cheque_date || feesLocks[index].checkID?.date_check_requested || '')}</span>
                                                        </div>
                                                    </>
                                            }
                                            {feesLocks[index]?.checkID?.cheque_number && <span className='d-inline-block check-number'>{feesLocks[index]?.checkID?.cheque_number}</span>}
                                            {feesLocks[index]?.checkID?.cheque_number && <ChequeUpload entity={fee} panel={"fee"} pageId={page_id_click_record} documentType="check_as_sent" updateStates={updateFeesState} handleNoCheckShow={handleNoCheckShow}/>}
                                        </div>
                                    </td> 
                                </tr>
                                })}
                            {
                                fees?.length > 0 && 
                                <tr style={{height:"25px"}}>
                                    <td></td>
                                    <td className="height-25 text-capitalize text-right" colSpan={11}>
                                        <span className='whitespace-SETTLE primary-clr-25'>Total Fees: </span>
                                        <p className="d-inline-flex align-items-center height-25 monospace-font text-right font-weight-bold dollar-amount-value" data-value={feesFinalAmount || 0.00}>
                                            {currencyFormat(feesFinalAmount || 0.00)}
                                        </p>
                                    </td>
                                    <td className="s-draft monospace-font text-right" >
                                        <span style={{paddingRight:"2px"}} data-value={feesLockValues[0] || 0.00} className='dollar-amount-value'>{currencyFormat(feesLockValues[0] || 0.00)}</span>
                                    </td>
                                    <td className="s-final monospace-font text-right" >                                                   
                                        <span style={{paddingRight:"2px"}} data-value={feesLockValues[1] || 0.00} className='dollar-amount-value'>{currencyFormat(feesLockValues[1] || 0.00)}</span>
                                    </td>
                                    <td className="verify"></td>
                                    <td className="td-autosize check-request-td text-center"></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <EditFeesPopup 
                show={showFeeModal}
                fee={modalAction === "EDIT" ? currentFee : {} } 
                currentCombination={currentCombination}
                handleClose={handleFeeClose}
                feesPercentages={feesPercentages}
                amount={feesFinalAmount}
                action={modalAction}
                feesCombinationList ={feesCombinationList}
                setData={setFees}
                updateFeesState = {updateFeesState}
                initialOffers={initialOffers}
            />
            { showSettlementPopup &&
                <GenericSettlementAddPopup 
                show={showSettlementPopup}                 
                handleClose={()=>{
                setShowSettlementPopup(false);
                }} 
                initialLabel={"Fee"}
                    {...settlementObjProps}
                />
            }
            <SettlementErrorModal show={showErrorModal} handleClose={handleErrorClose} errorMsg={errorMsg} updateStates={updateFeesState}  />
            <SettlementNoCheckModal show={showNoCheckModal} handleClose={handleNoCheckClose} />
            <SettlementCheckRequest show={showCheckRequestModal} handleClose={handleCheckRequestClose} finalAmount={currentFee?.final} panelLabel={"Fees"} panelName={"fees"} panelEntity={currentFee} updateStates={updateFeesState} />
        </>
    );
}

export default OffersFeeTable