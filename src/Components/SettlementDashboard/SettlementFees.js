import React, { useState } from 'react';
import unlockedGrey from '../../../public/BP_resources/images/icon/unlocked-grey.svg';
import lockedGrey from '../../../public/BP_resources/images/icon/locked-grey.svg';
import locked from '../../../public/BP_resources/images/icon/locked.svg';
import unlocked from '../../../public/BP_resources/images/icon/unlocked.svg';
import EditFeesPopup from '../Modals/EditFeesPopup';
import updateLockSettleValue from './common/updateLockSettleValue';
import { currencyFormat, formatDate,inputCurrencyFormat } from '../../Utils/helper';
import SettlementEmptyTable from './SettlementEmptyTable';
import CurrentUserInfo from './common/CurrentUserInfo';
import SettlementErrorModal from '../Modals/SettlementErrorModal';
import SettlementNoCheckModal from '../Modals/SettlementNoCheckModal';
import SettlementCheckRequest from '../Modals/SettlementCheckRequest';
import updateLockSettleAmount from './common/updateLockSettleAmount';
import AllLockSettle from './common/AllLockSettle';
import ChequeUpload from './ChequeUpload';
import { useSelector } from 'react-redux';
import SectionActionBar from './SectionActionBar';
import RequestCheckButton from './common/RequestCheckButton';
import getPanelDetail from './api/getPanelDetail';

const SettlementFees = ({feesObj}) => {
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
    const handleFinalLockChange = (id,sectionName,event) => {
        event.stopPropagation(); 
        updateLockSettleValue(id,"fees","final")
        setFeesLocks((prevStates) =>
            prevStates.map((row) =>
                row.id === id ? { ...row, isFinalLocked: !row.isFinalLocked } : row
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

    const { 
        feesLocks, setFeesLocks,
        fees,feesPercentages, setFees,
        feesFinalAmount, feesLockValues, 
        showFeeModal, setFeesLockValues,
        handleFeeClose, handleFeeShow,
        currentFee, setCurrentFee,
        feesCombinationList, setFeesCombinationList,
        currentCombination, setCurrentCombination,
        showErrorModal,
        handleErrorClose, handleErrorShow,
        updateFeesState,
        offersCount
    } = feesObj;
    return (
        <>
            <div className='m-b-5' style={{marginTop:"55px"}}>
                <SectionActionBar sectionName={"Fees"} />
                <div className="table--no-card rounded-0 border-0 w-100">
                    <table className="table table-borderless table-striped table-earning settlement-table">
                        <thead>
                            <tr id="settle-tb-header" className="settle-t-4">
                                <th className="td-autosize"></th>
                                <th className="s-offer-date">Last Edited</th>
                                <th className=""></th>
                                <th className="c-percentage"></th>
                                <th className="s-paid text-center">Party</th>
                                <th className="">Insurance</th>
                                <th className="">Note</th>
                                <th className=""></th>
                                <th className=""></th>
                                <th className="big-n-4 "></th>
                                <th className="text-end td-autosize" style={{color:"var(--primary-25) !important"}}>Working</th>
                                <th className="s-draft text-end" style={{color:"var(--primary-25) !important"}}>
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
                                                    lockAllFees("draft1",'false');
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
                                                    lockAllFees("draft1",'true');
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                        <span style={{paddingRight:"2px"}}>Draft</span>
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
                                                onClick={(e)=>{
                                                    e.stopPropagation();
                                                    lockAllFees("final",'true');
                                                }}
                                                src={locked}
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
                        <tbody id="body-table">
                            {   fees.length == 0 && <SettlementEmptyTable tableName={"fees"} />}
                            {   fees.length > 0 && fees?.map((fee,index) => (
                                <tr key={index} style={{ height: '25px' }} onClick={()=>{
                                    setCurrentFee(fee);
                                    setModalAction("EDIT");
                                    setCurrentCombination(feesCombinationList[0]);
                                    handleFeeShow();
                                }}>
                                    <td className="td-autosize">{index + 1}</td>
                                    <td className="s-offer-date">{formatDate(fee.last_edited)}</td>
                                    <td className="td-autosize">
                                        <CurrentUserInfo id={fee.last_edited_by} />
                                    </td>
                                    <td className="c-percentage">{fee?.percentage || 0} %</td>
                                    <td className="td-autosize">
                                        {
                                            fee.offer?.defendant ?  fee.offer?.defendant?.defendantType?.name === "Private Individual" ? 
                                                `${fee.offer?.defendant?.first_name || ''} ${fee?.offer?.defendant?.last_name || ''}` :
                                                `${fee.offer?.defendant?.entity_name || ''}` : `${ fee.offer?.entity_client?.first_name || ''} ${ fee?.offer?.entity_client?.last_name || ''}`
                                        }
                                    </td>
                                    <td className="td-autosize">{fee?.offer?.insurance?.company?.company_name}</td>
                                    <td className="text-capitalize big-n-2">{fee.note}</td>
                                    <td className=""></td>
                                    <td className=""></td>
                                    <td className=""></td>
                                    <td className="td-autosize monospace-font text-right dollar-amount-value" data-value={fee.amount}>{currencyFormat(fee?.amount)}</td>
                                    <td className="s-draft text-right">
                                        <div className="monospace-font d-flex justify-content-between align-items-center height-25">
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
                                                className="ic ic-19"
                                                src={feesLocks[index]?.isDraftLocked ? locked : unlocked}
                                                alt="lock-icon"
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <input
                                                id="lock-input"
                                                className={`monospace-font text-right fee-draft dollar-amount-value ${
                                                    feesLocks[index].isDraftLocked ? "locked-input" : "unlock-input"
                                                } ${  ["0", "0.00"].includes(fee.draft1.toString()) ? "zero-placeholder" : "black-placeholder"}`}
                                                
                                                type={"text"}
                                                data-value={fee.draft1}                                               
                                                disabled={feesLocks[index].isDraftLocked}
                                                placeholder={ fee.draft1 ? currencyFormat(fee.draft1) : "$ 0.00"}                                     
                                                onClick={(e)=>e.stopPropagation()}
                                                // onFocus={(e) => {
                                                //     e.target.placeholder = ""; // Remove placeholder when focused
                                                //     updateLockSettleAmount(fee.id,"fees","draft1","0.00");
                                                //     const loanInputs = [...document.querySelectorAll('.fee-draft')];
                                                //     const sum = loanInputs.reduce((acc, input) => {
                                                //         const val = input.getAttribute('data-value') || '0';
                                                //         const num = parseFloat(val);
                                                //         return !isNaN(num) ? acc + num : acc;
                                                //     }, 0);
                                            
                                                //     setFeesLockValues([sum, feesLockValues[1] ])
                                                // }}
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
                                                // onBlur={(e) => {
                                                //     if (!e.target.value.trim()) {
                                                //         e.target.placeholder = "$ 0.00"; // Set placeholder when unfocused and empty
                                                //     }
                                                // }}
                                                onChange={(e)=>{
                                                    let numericValue = e.target.value
                                                    .replace(/[^0-9.-]/g, '') 
                                                    .replace(/(?!^)-/g, '');

                                                    updateLockSettleAmount(fee.id,"fees","draft1",parseFloat(numericValue || 0).toFixed(2));

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
                                            
                                                    setFeesLockValues([sum, feesLockValues[1] ])
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="s-final">
                                        <div className="monospace-font input-lock-container d-flex">
                                        <img
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (feesLocks[index].checkID) {
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
                                            className={`ic ic-19 ${feesLocks[index]?.checkID?.check_sent ? "invisible" : ""} `}
                                            src={feesLocks[index]?.isFinalLocked ? (feesLocks[index]?.checkID?.check_sent ? lockedGrey : locked) : (feesLocks[index]?.checkID?.check_sent ? unlockedGrey : unlocked)}
                                            alt="lock-icon"
                                            style={{ cursor: 'pointer' }}
                                        />

                                        <input
                                            id="lock-input"
                                            className={`monospace-font text-right fee-final dollar-amount-value ${
                                                feesLocks[index].isFinalLocked ? "locked-input" : "unlock-input"
                                            } ${  ["0", "0.00"].includes(fee.final.toString()) ? "zero-placeholder" : "black-placeholder"}`}
                                            
                                            type={"text"}
                                            
                                            data-value={fee.final}
                                            disabled={feesLocks[index].isFinalLocked}
                                            placeholder={fee.final ? currencyFormat(fee.final) : "$ 0.00"}
                                            onClick={(e) => e.stopPropagation()}
                                            // onFocus={(e) => {
                                            //     e.target.placeholder = ""; // Remove placeholder when focused
                                            //     updateLockSettleAmount(fee.id,"fees","final","0.00");
                                            //     const loanInputs = [...document.querySelectorAll('.fee-final')];
                                            //     const sum = loanInputs.reduce((acc, input) => {
                                            //         const val = input.getAttribute('data-value') || '0';
                                            //         const num = parseFloat(val);
                                            
                                            //         return !isNaN(num) ? acc + num : acc;
                                            //     }, 0);
                                            //     setFeesLockValues([feesLockValues[0], sum]);
                                            // }}
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
                                            // onBlur={(e) => {
                                            //     if (!e.target.value.trim()) {
                                            //         e.target.placeholder = "$ 0.00"; // Set placeholder when unfocused and empty
                                            //     }
                                            // }}
                                            onChange={(e) => {
                                                let numericValue = e.target.value
                                                    .replace(/[^0-9.-]/g, '') 
                                                    .replace(/(?!^)-/g, '');

                                                updateLockSettleAmount(fee.id,"fees","final",parseFloat(numericValue || 0).toFixed(2));
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
                            ))}
                            {   fees.length>0 && 
                                <>
                                <tr style={{height:"25px"}}>
                                    <td class="text-capitalize big-n-2 text-end primary-clr-25" colSpan={10}>Total Fees:</td>
                                    <td class="td-autosize dollar-amount-value height-25 monospace-font text-right font-weight-bold dollar-amount-value" data-value={feesFinalAmount}>{currencyFormat(feesFinalAmount)}</td>
                                    <td className="s-draft monospace-font text-right" data-value={feesLockValues[0]}>
                                        <span style={{paddingRight:"2px"}}>{currencyFormat(feesLockValues[0])}</span>
                                    </td>
                                    <td className="s-final monospace-font text-right" data-value={feesLockValues[1]}>
                                        <span style={{paddingRight:"2px"}}>{currencyFormat(feesLockValues[1])}</span>
                                    </td>
                                    <td className="verify"></td>
                                    <td className="td-autosize check-request-td text-center"></td>
                                </tr>
                                {[1, 2,3,4,5].map((element) => (
                                <React.Fragment key={element}>
                                <tr style={{height:"25px"}}>
                                    <td class="td-autosize"></td>
                                    <td class="s-offer-date"></td>
                                    <td class="td-autosize"></td>
                                    <td class="c-percentage"></td>
                                    <td class="s-paid text-right"></td>
                                    <td class=""></td>
                                    <td class=""></td>
                                    <td class=""></td>
                                    <td class=""></td>
                                    <td class="text-capitalize big-n-2"></td>
                                    <td class="initial-btn height-25 monospace-font text-right font-weight-bold"></td>
                                    <td className="s-draft text-right"></td>
                                    <td className="s-final"></td>
                                    <td className="verify"></td>
                                    <td className="td-autosize check-request-td text-center"></td>
                                </tr>
                                </React.Fragment>
                                ))}
                                </> 
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
            />
            <SettlementErrorModal show={showErrorModal} handleClose={handleErrorClose} errorMsg={errorMsg} updateStates={updateFeesState}  />
            <SettlementNoCheckModal show={showNoCheckModal} handleClose={handleNoCheckClose} />
            <SettlementCheckRequest show={showCheckRequestModal} handleClose={handleCheckRequestClose} finalAmount={currentFee?.final} panelLabel={"Fees"} panelName={"fees"} panelEntity={currentFee} updateStates={updateFeesState} />
        </>
    );
};

export default SettlementFees;
