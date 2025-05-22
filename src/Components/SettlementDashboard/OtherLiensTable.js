import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import SettlementEmptyTable from './SettlementEmptyTable';
import unlockedGrey from '../../../public/BP_resources/images/icon/unlocked-grey.svg';
import lockedGrey from '../../../public/BP_resources/images/icon/locked-grey.svg';
import locked from '../../../public/BP_resources/images/icon/locked.svg';
import unlocked from '../../../public/BP_resources/images/icon/unlocked.svg';
import { currencyFormat,formatDate,inputCurrencyFormat } from '../../Utils/helper';
import SettlementErrorModal from '../Modals/SettlementErrorModal';
import SettlementNoCheckModal from '../Modals/SettlementNoCheckModal';
import SettlementCheckRequest from '../Modals/SettlementCheckRequest';
import updateLockSettleAmount from './common/updateLockSettleAmount';
import AllLockSettle from './common/AllLockSettle';
import updateLockSettleValue from './common/updateLockSettleValue';
import ChequeUpload from './ChequeUpload';
import SectionActionBar from './SectionActionBar';
import RequestCheckButton from './common/RequestCheckButton';
import CopyValueSettlement from './common/CopyValueSettlement';
import updateRightColumnValue from './common/updateRightColumnValue';
import EditOtherLiens from '../Modals/EditOtherLiens';
import getPanelDetail from './api/getPanelDetail';
import GenericSettlementAddPopup from '../Modals/GenericSettlementAddPopup';

const OtherLiensTable = ({otherLiensObj,clientProceeds,settlementObjProps}) => {
    const [showSettlementPopup, setShowSettlementPopup] = useState(false);
    const {clientProceed,setClientProceed,updateClientProceedsState} =  clientProceeds;
    const [errorMsg, setMsgError] = useState("");
    const lockAllLiens = (bType,boolVal) => {
        AllLockSettle("other_lien",bType,boolVal)
        if(bType === "draft1"){
            setOtherLiensLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isDraftLocked: boolVal === "true"
                }))
            );
        }
        else{
            setOtherLiensLocks((prevStates) =>
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

    const [showCheckRequestModal, setCheckRequestModal] = useState(false);
    const handleCheckRequestClose = () => setCheckRequestModal(false);
    const handleCheckRequestShow = () => setCheckRequestModal(true);

    const [showNoCheckModal, setNoCheckModal] = useState(false);
    const handleNoCheckClose = () => setNoCheckModal(false);
    const handleNoCheckShow = () => setNoCheckModal(true);

    const handleDraftLockChange = (id,sectionName,e) => {
        e.stopPropagation();
        if (sectionName === "other_lien") {
            updateLockSettleValue(id,"other_lien","draft1");
            setOtherLiensLocks((prevStates) =>
                prevStates.map((row) =>
                    row.id === id ? {...row, isDraftLocked: !row.isDraftLocked } : row
                )
            );
        } 
    };

    const handleFinalLockChange = (id,sectionName,e) => {
        e.stopPropagation();
        if (sectionName === "other_lien") {
            updateLockSettleValue(id,"other_lien","final");
            setOtherLiensLocks((prevStates) =>
                prevStates.map((row) =>
                    row.id === id ? {...row, isFinalLocked: !row.isFinalLocked } : row
                )
            );
        }
    };
    const {  
        otherLiens,setOtherLiens,
        otherLiensLocks,setOtherLiensLocks,
        otherLiensLocksValues,setOtherLiensLocksValues,
        otherLienFinalAmount,setOtherLienFinalAmount,
        showErrorLeinModal,handleLienErrorShow,handleLienErrorClose,
        handleEditOtherLienClose,handleEditOtherLienShow,showEditOtherLien,
        updateOtherLiensStates
    } = otherLiensObj;
    const [currentOtherLien,setCurrentOtherLien] = useState(otherLiens[0] || {});
    const [colSpanValue, setColSpanValue] = useState(document.documentElement.clientWidth < 2100 ? 6 : 7);
    useEffect(() => {
        const handleResize = () => {
        setColSpanValue(document.documentElement.clientWidth < 2100 ? 6 : 7);
        };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    }, []); 
    return (
        <>
        <div className="m-t-5">
            <SectionActionBar sectionName={"Other Liens"} />
            <div className="table--no-card rounded-0 border-0 w-100">
                <table className="table table-borderless table-striped table-earning settlement-table">
                    {   otherLiens?.length > 0 &&
                        <thead>
                            <tr id="settle-tb-header" className="settle-t-4">
                                <th className=""></th>
                                <th className="td-autosize provider-col">Name</th>
                                <th className="text-end dollar-amount-value med-bill-width td-autosize">Original</th>
                                <th className="text-end dollar-amount-value med-bill-width td-autosize hide-table-data"></th>
                                <th className="text-end dollar-amount-value med-bill-width td-autosize">Reduction</th>
                                <th className="text-end dollar-amount-value med-bill-width td-autosize">Final Lien</th>
                                <th className=""></th>
                                <th className={`height-25 text-right font-weight-bold td-autosize ${otherLiensLocks?.some(lock=>!lock.isDraftLocked) ? "cursor-pointer" : ""}`}
                                        style={{color:"var(--primary-25) !important"}}
                                        onClick={()=>{
                                            const draftLockCheck = otherLiensLocks?.some(lock=>!lock.isDraftLocked);
                                            if(draftLockCheck){
                                                otherLiensLocks?.forEach((lien,index)=>{
                                                    if(!lien.isDraftLocked){
                                                        updateRightColumnValue(
                                                            lien.isDraftLocked,
                                                            lien.isFinalLocked,
                                                            setOtherLiensLocks,
                                                            "other-draft",
                                                            lien.id,
                                                            otherLiensLocksValues,
                                                            setOtherLiensLocksValues,
                                                            "other_lien",
                                                            "draft1",
                                                            otherLiens[index]?.amount
                                                        )
                                                    }
                                                })
                                                updateClientProceedsState();
                                            }
                                        }}
                                    >
                                    <span className='d-flex align-items-center justify-content-end position-relative center-val-div'>
                                        {otherLiensLocks?.some(lock=>!lock.isDraftLocked) && <CopyValueSettlement/>}
                                        Working
                                    </span>
                                </th>
                                <th className={`s-draft text-end ${otherLiensLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked) ? "cursor-pointer" : ""}`} 
                                    style={{color:"var(--primary-25) !important"}}
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        const finalLockCheck = otherLiensLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked);
                                        if(finalLockCheck){
                                            otherLiensLocks?.forEach(lien=>{
                                                if(lien.isDraftLocked && !lien.isFinalLocked && !lien.checkID){
                                                    updateRightColumnValue(
                                                        lien.isDraftLocked,
                                                        lien.isFinalLocked,
                                                        setOtherLiensLocks,
                                                        "other-final",
                                                        lien.id,
                                                        otherLiensLocksValues,
                                                        setOtherLiensLocksValues,
                                                        "other_lien",
                                                        "final",
                                                        lien.isDraftAmount
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
                                                    lockAllLiens("draft1",'false');
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
                                                    lockAllLiens("draft1",'true');
                                                }}
                                                style={{cursor: 'pointer' }}
                                            />
                                        </div>
                                        <span className='d-flex align-items-center justify-content-end position-relative center-val-div draft-central-div' style={{ paddingRight: "2px" }}>
                                            {otherLiensLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked && !lock.checkID) && <CopyValueSettlement />}
                                            <span className="position-absolute right-0">Draft</span>
                                        </span>
                                    </div>                                      
                                </th>
                                <th className="s-final text-end" style={{color:"var(--primary-25) !important"}}>
                                    <div className='d-flex justify-content-between align-items-center height-25'>
                                        <div className='d-flex align-items-center'>
                                            <img
                                                className='invisible ic ic-19'
                                                id="lock-image"
                                                src={unlocked}
                                                alt="lock-icon"
                                                style={{cursor: 'pointer' }}
                                            />
                                            <img
                                                id="lock-image"
                                                className='ic ic-19'
                                                src={unlocked}
                                                alt="lock-icon"
                                                onClick={(e)=>{
                                                    e.stopPropagation();
                                                    lockAllLiens("final",'false');
                                                }}
                                                style={{cursor: 'pointer' }}
                                            />
                                            <img
                                                id="unlock-image"
                                                className='ic ic-19'
                                                alt="lock-icon"
                                                src={locked}
                                                onClick={(e)=>{
                                                    e.stopPropagation();
                                                    lockAllLiens("final",'true');
                                                }}
                                                style={{cursor: 'pointer' }}
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
                        { otherLiens?.length == 0 &&                                 
                            <tr id="cost-settle-row" className='add-btn-row'>
                                <td className='text=center cursor-pointer' colSpan={ colSpanValue + 5 }> 
                                    
                                    <div className='settle-add-btn btn'>
                                        <button type="button" onClick={(e)=>{
                                            e.stopPropagation();
                                            setShowSettlementPopup(true);
                                            }} 
                                        className="btn">
                                            <span className="font-weight-bold text-gold">+ </span>
                                            <span>Other Lien</span> 
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        }
                        {
                            otherLiens?.length > 0 && otherLiens?.map((lien,index)=>
                            <tr className="height-25"                                     
                                onClick={()=>{
                                    setCurrentOtherLien(lien);
                                    handleEditOtherLienShow();
                                }}
                            >
                                <td className="">{index + 1}</td>
                                <td className='provider-col text-left'>{lien?.name}</td>
                                <td className="text-end monospace-font dollar-amount-value med-bill-width td-autosize" data-value={lien?.original}>{currencyFormat(lien?.original)}</td>
                                <td className="text-end monospace-font dollar-amount-value med-bill-width td-autosize hide-table-data"></td>
                                <td className="text-end monospace-font dollar-amount-value med-bill-width td-autosize" data-value={lien?.reduction}>{currencyFormat(-Math.abs(lien?.reduction))}</td>
                                <td className="text-end monospace-font dollar-amount-value med-bill-width td-autosize" data-value={lien?.amount}>{currencyFormat(Math.abs(lien?.amount))}</td>
                                <td className="" onClick={(e)=>e.stopPropagation()}></td>
                                <td className={`monospace-font  dollar-amount-value text-right ${!otherLiensLocks[index].isDraftLocked ? "cursor-pointer" : ""}`} data-value={lien?.amount}>
                                    <span className='position-relative center-val-div' onClick={(e)=>
                                        {
                                            e.stopPropagation();
                                            updateRightColumnValue(
                                            otherLiensLocks[index].isDraftLocked,
                                            otherLiensLocks[index].isFinalLocked,
                                            setOtherLiensLocks,
                                            "other-draft",
                                            lien.id,
                                            otherLiensLocksValues,
                                            setOtherLiensLocksValues,
                                            "other_lien",
                                            "draft1",
                                            lien?.amount
                                        );
                                        updateClientProceedsState();
                                    }
                                    }>
                                        {!otherLiensLocks[index].isDraftLocked && <CopyValueSettlement/>}
                                        {currencyFormat(lien?.amount)}
                                    </span>
                                </td>
                                <td className="s-draft text-right" onClick={(e)=>{
                                        e.stopPropagation();
                                        updateRightColumnValue(
                                            otherLiensLocks[index].isDraftLocked,
                                            otherLiensLocks[index].isFinalLocked,
                                            setOtherLiensLocks,
                                            "other-final",
                                            lien.id,
                                            otherLiensLocksValues,
                                            setOtherLiensLocksValues,
                                            "other_lien",
                                            "final",
                                            otherLiensLocks[index].isDraftAmount
                                        );
                                        updateClientProceedsState();
                                    }}>
                                    <div  className={`monospace-font d-flex justify-content-between align-items-center height-25 position-relative center-val-div`}>
                                        <img
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // if(otherLiensLocks[index].checkID){
                                                //     setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${otherLiensLocks[index].checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                //     handleLienErrorShow();
                                                //     return;
                                                // }
                                                const inputField = e.target.nextElementSibling;
                                                if (!otherLiensLocks[index].isDraftLocked) {
                                                
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
                                                handleDraftLockChange(lien.id,"other_lien",e)
                                            }}
                                            id="lock-image"
                                            className='ic ic-19'
                                            src={otherLiensLocks[index].isDraftLocked ? locked : unlocked}
                                            alt="lock-icon"
                                            style={{cursor: 'pointer' }}
                                        />
                                        <input
                                            id="lock-input"
                                            className={`${(otherLiensLocks[index].isDraftLocked && !otherLiensLocks[index].isFinalLocked) ? "cursor-pointer" : ""} monospace-font other-draft-${lien?.id} text-right other-draft dollar-amount-value ${
                                                otherLiensLocks[index].isDraftLocked ? "locked-input" : "unlock-input"
                                            } ${  ["0", "0.00"].includes(lien?.draft1.toString()) ? "zero-placeholder" : "black-placeholder"}`}
                                            type={"text"}
                                            data-value={lien?.draft1}                                                   
                                            readOnly={otherLiensLocks[index].isDraftLocked}
                                            placeholder={lien?.draft1 ? currencyFormat(lien?.draft1) : "$ 0.00"}
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
                                            onChange={async (e)=>{
                                                let numericValue = e.target.value
                                            .replace(/[^0-9.-]/g, '') 
                                            .replace(/(?!^)-/g, '');
                                            const res = await updateLockSettleAmount(lien?.id,"other_lien","draft1",parseFloat(numericValue || 0).toFixed(2));
                                            setOtherLiensLocks((prevStates) =>
                                                prevStates.map((row) =>
                                                    row.id === lien?.id ? { ...row, isDraftAmount: numericValue } : row
                                                )
                                            );
                                            if (numericValue !== '' && !isNaN(numericValue)) {
                                                let num = parseFloat(numericValue);

                                                if (num > 999999.99) num = 999999.99; 
                                                else if (num < -999999.99) num = -999999.99; 

                                                numericValue = num.toString(); 
                                            }

                                            e.target.setAttribute('data-value', numericValue); 
                                        
                                            const loanInputs = [...document.querySelectorAll('.other-draft')];
                                        
                                            
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
                                            setOtherLiensLocksValues([sum, otherLiensLocksValues[1] ])
                                            }}
                                            onMouseEnter={(e) => {                                     
                                                if(otherLiensLocks[index].isDraftLocked && !otherLiensLocks[index].isFinalLocked){
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
                                                if(otherLiensLocks[index].isDraftLocked && !otherLiensLocks[index].isFinalLocked){
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
                                        {otherLiensLocks[index].isDraftLocked && !otherLiensLocks[index].isFinalLocked && <CopyValueSettlement draft={true} />}
                                    </div>
                                </td>
                                <td className="s-final" onClick={(e)=>e.stopPropagation()}>
                                    <div className="monospace-font d-flex justify-content-between align-items-center height-25">
                                        <img
                                            onClick={(e) =>{
                                                e.stopPropagation();
                                                if(otherLiensLocks[index]?.checkID){
                                                    setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${otherLiensLocks[index].checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                    handleLienErrorShow();
                                                    return;
                                                }
                                                const inputField = e.target.nextElementSibling;
                                                if (!otherLiensLocks[index].isFinalLocked) {
                                                
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
                                                handleFinalLockChange(lien?.id,"other_lien",e);
                                            }}
                                            id="lock-image"
                                            className={`ic ic-19 ${otherLiensLocks[index].checkID?.check_sent ? "invisible" : ""} `}
                                            src={otherLiensLocks[index].isFinalLocked ? (otherLiensLocks[index].checkID?.check_sent ? lockedGrey : locked) : (otherLiensLocks[index].checkID?.check_sent ? unlockedGrey : unlocked)}
                                            alt="lock-icon"
                                            style={{cursor: 'pointer' }}
                                        />
                                        <input
                                            id="lock-input"
                                            className={`monospace-font other-final-${lien?.id} text-right other-final dollar-amount-value ${
                                                otherLiensLocks[index].isFinalLocked ? "locked-input" : "unlock-input"
                                            } ${["0", "0.00"].includes(lien?.final.toString()) ? "zero-placeholder" : "black-placeholder"}`}                                    
                                            type="text"
                                            data-value={lien?.final}                                                   
                                            disabled={otherLiensLocks[index].isFinalLocked}
                                            placeholder={lien?.final ? currencyFormat(lien?.final) : "$ 0.00"}
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
                                            onChange={async (e) => {
                                                let numericValue = e.target.value
                                                    .replace(/[^0-9.-]/g, '') 
                                                    .replace(/(?!^)-/g, '');
                                                const res = await updateLockSettleAmount(lien?.id, "other_lien", "final", parseFloat(numericValue || 0).toFixed(2));
                                                setOtherLiensLocks((prevStates) =>
                                                    prevStates.map((row) =>
                                                        row.id === lien?.id ? { ...row, isFinalAmount: numericValue } : row
                                                    )
                                                );
                                                if (numericValue !== '' && !isNaN(numericValue)) {
                                                    let num = parseFloat(numericValue);
                                                    if (num > 999999.99) num = 999999.99; 
                                                    else if (num < -999999.99) num = -999999.99; 

                                                    numericValue = num.toString(); 
                                                }
                                                e.target.setAttribute("data-value", numericValue);                                     
                                                const loanInputs = [...document.querySelectorAll('.other-final')];
                                                const sum = loanInputs.reduce((acc, input) => {
                                                    const val = input.getAttribute("data-value") || "0";
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
                                                setOtherLiensLocksValues([otherLiensLocksValues[0], sum]);
                                            }}
                                        />

                                    </div>
                                </td>
                                <td className="s-verify" onClick={(e)=>e.stopPropagation()}>
                                    <ChequeUpload entity={lien} panel={"other_lien"} pageId={page_id_click_record} documentType="verify" updateStates={updateOtherLiensStates} handleNoCheckShow={handleNoCheckShow}/>
                                </td>
                                <td className="td-autosize check-request-td text-center" onClick={(e)=>e.stopPropagation()}>
                                    <div className={`${ otherLiensLocks[index]?.checkID?.cheque_number ? "check-class" : "d-flex justify-content-center" } `}>
                                        {
                                            ((!otherLiensLocks[index].checkID && otherLiensLocks[index].isFinalLocked && otherLiensLocks[index].isFinalAmount != 0)) ? <div className="settle-check-request-btn btn" id="nomargin">
                                                <RequestCheckButton onHandleClick={async() => {
                                                    try {
                                                        const res = await getPanelDetail("other-lien/edit","other_lien_id",lien?.id);
                                                        // If a check was already requested, show error
                                                        if (res) {
                                                            if (res?.data?.checkID?.date_check_requested) {
                                                                setMsgError("Check has already been requested by another user. Close the popup to see the details.");
                                                                handleLienErrorShow();
                                                            } else {
                                                                setMsgError(""); // Clear error if no request date found
                                                                setCurrentOtherLien({...lien,final:otherLiensLocks[index].isFinalAmount});
                                                                updateOtherLiensStates();
                                                                handleCheckRequestShow();
                                                                
                                                            }
                                                        } else {
                                                            setMsgError(""); // No checkID, so no error
                                                            setCurrentOtherLien({...lien,final:otherLiensLocks[index].isFinalAmount});
                                                            updateOtherLiensStates();
                                                            handleCheckRequestShow();
                                                            
                                                        }
                                                    } catch (error) {
                                                        setMsgError(""); // Optional: Or you can set a different error message
                                                        console.error("Error fetching request details:", error);
                                                        setCurrentOtherLien({...lien,final:otherLiensLocks[index].isFinalAmount});
                                                        updateOtherLiensStates();
                                                        handleCheckRequestShow();
                                                        
                                                    }

                                                }} />
                                                {/* <RequestCheckButton onHandleClick={() => {
                                                    setCurrentOtherLien({...lien,final:otherLiensLocks[index].isFinalAmount});
                                                    updateOtherLiensStates();
                                                    handleCheckRequestShow();
                                                }} /> */}
                                            </div>
                                                :
                                                <>
                                                    <div className='d-flex justify-content-center'>
                                                        <span>{otherLiensLocks[index].checkID?.cheque_date ? '' : otherLiensLocks[index].checkID?.date_check_requested && <span className='requested-btn'>Requested:&nbsp;</span>}</span>
                                                        
                                                        <span>{formatDate(otherLiensLocks[index].checkID?.cheque_date || otherLiensLocks[index].checkID?.date_check_requested || '')}</span>
                                                    </div>
                                                </>
                                        }
                                        {otherLiensLocks[index]?.checkID?.cheque_number && <span className='d-inline-block check-number'>{otherLiensLocks[index]?.checkID?.cheque_number}</span>}
                                        {otherLiensLocks[index]?.checkID?.cheque_number &&  <ChequeUpload entity={lien} panel={"other_lien"} pageId={page_id_click_record} documentType="check_as_sent" updateStates={updateOtherLiensStates} handleNoCheckShow={handleNoCheckShow}/>}
                                    </div>
                                </td>
                            </tr>)
                        }
                        {   otherLiens?.length > 0 &&
                            <tr className="height-25">
                                <td></td>
                                <td className="height-25 text-capitalize text-right" colSpan={colSpanValue}>
                                    <span className='whitespace-SETTLE primary-clr-25'>Total Other Liens: </span>
                                    <p className="d-inline-flex align-items-center height-25 monospace-font text-right font-weight-bold dollar-amount-value" data-value={otherLienFinalAmount || 0.00}>
                                        {currencyFormat(otherLienFinalAmount || 0.00)}
                                    </p>
                                </td>
                                <td className="s-draft text-end monospace-font" data-value={otherLiensLocksValues[0] || 0.00}>
                                    <span style={{paddingRight:"2px"}} data-value={otherLiensLocksValues[0] || 0.00} className='dollar-amount-value'>{currencyFormat(otherLiensLocksValues[0] || 0.00)}</span>
                                </td>
                                <td className="s-final text-end monospace-font" data-value={otherLiensLocksValues[1] || 0.00}>
                                    <span style={{paddingRight:"2px"}} data-value={otherLiensLocksValues[1] || 0.00} className='dollar-amount-value'>{currencyFormat(otherLiensLocksValues[1] || 0.00)}</span>
                                </td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td text-center"></td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
        <EditOtherLiens 
        handleClose={handleEditOtherLienClose} 
        lien={currentOtherLien} 
        show={showEditOtherLien} 
        updateLienStates={updateOtherLiensStates} 
        updateClientProceedStates={updateClientProceedsState}
        />
        { showSettlementPopup &&
            <GenericSettlementAddPopup 
            show={showSettlementPopup}                 
            handleClose={()=>{
            setShowSettlementPopup(false);
            }} 
            initialLabel={"Additional Liens"}
                {...settlementObjProps}
            />
        }
        <SettlementErrorModal show={showErrorLeinModal} handleClose={handleLienErrorClose} errorMsg={errorMsg} updateStates={updateOtherLiensStates} />
        <SettlementNoCheckModal show={showNoCheckModal} handleClose={handleNoCheckClose} />
        <SettlementCheckRequest show={showCheckRequestModal} handleClose={handleCheckRequestClose} finalAmount={currentOtherLien?.final} panelLabel={"OtherLiens"} panelName={"other_lien"} panelEntity={currentOtherLien} updateStates={updateOtherLiensStates} />
        </>
    )
}

export default OtherLiensTable