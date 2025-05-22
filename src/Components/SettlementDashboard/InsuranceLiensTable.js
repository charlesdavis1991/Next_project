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
import EditLiens from '../Modals/EditLiens';
import RequestCheckButton from './common/RequestCheckButton';
import CopyValueSettlement from './common/CopyValueSettlement';
import updateRightColumnValue from './common/updateRightColumnValue';
import getPanelDetail from './api/getPanelDetail';
import GenericSettlementAddPopup from '../Modals/GenericSettlementAddPopup';

const InsuranceLiensTable = ({insuranceLiensObj, clientProceeds, settlementObjProps}) => {
    const [showSettlementPopup, setShowSettlementPopup] = useState(false);
    const {clientProceed,setClientProceed,updateClientProceedsState} =  clientProceeds;
    const [errorMsg, setMsgError] = useState("");
    const lockAllLiens = (bType,boolVal) => {
        // AllLockSettle("med-pay-lien",bType,boolVal)
        // AllLockSettle("health_insurance_lien",bType,boolVal)
        // if(bType === "draft1"){
        //     setMedPayLiens(
        //         {   
        //             ...medPayLiens,
        //             draft1_checked: boolVal==="true"
        //         }
        //     );
        //     setHealthInsuranceLiens(
        //         {   
        //             ...healthInsuranceLiens,
        //             draft1_checked: boolVal==="true"
        //         }
        //     );
        // }
        // else{
        //     setMedPayLiens(
        //         {   
        //             ...medPayLiens,
        //             final_checked: medPayLiens?.checkID ? medPayLiens?.checkID : boolVal==="true"
        //         }
        //     );
        //     setHealthInsuranceLiens(
        //         {   
        //             ...healthInsuranceLiens,
        //             final_checked: healthInsuranceLiens?.checkID ? healthInsuranceLiens?.checkID : boolVal==="true"
        //         }
        //     );
        // }
        AllLockSettle("lien_insurance",bType,boolVal)
        if(bType === "draft1"){
            setInsuranceLiensLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isDraftLocked: boolVal === "true"
                }))
            );
        }
        else{
            setInsuranceLiensLocks((prevStates) =>
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
        if (sectionName === "lien_insurance") {
            updateLockSettleValue(id,"lien_insurance","draft1");
            setInsuranceLiensLocks((prevStates) =>
                prevStates.map((row) =>
                    row.id === id ? {...row, isDraftLocked: !row.isDraftLocked } : row
                )
            );
        } 
        // else if (sectionName === "health_insurance_liens") {
        //     updateLockSettleValue(id,"health_insurance_lien","draft1");
        //     const obj = {...healthInsuranceLiens,draft1_checked:!healthInsuranceLiens.draft1_checked}
        //     setHealthInsuranceLiens(obj);
        // }


        // if (sectionName === "med_pay_liens") {
        //     console.log("HELLO: ",id)
        //     updateLockSettleValue(id,"med-pay-lien","draft1");
        //     const obj = {...medPayLiens,draft1_checked:!medPayLiens.draft1_checked}
        //     setMedPayLiens(obj);
        // } 
        // else if (sectionName === "health_insurance_liens") {
        //     updateLockSettleValue(id,"health_insurance_lien","draft1");
        //     const obj = {...healthInsuranceLiens,draft1_checked:!healthInsuranceLiens.draft1_checked}
        //     setHealthInsuranceLiens(obj);
        // }

    };

    const handleFinalLockChange = (id,sectionName,e) => {
        e.stopPropagation();
        if (sectionName === "lien_insurance") {
            updateLockSettleValue(id,"lien_insurance","final");
            setInsuranceLiensLocks((prevStates) =>
                prevStates.map((row) =>
                    row.id === id ? {...row, isFinalLocked: !row.isFinalLocked } : row
                )
            );
        } 
        // if (sectionName === "med_pay_liens") {
        //     updateLockSettleValue(id,"med-pay-lien","final");
        //     const obj = {...medPayLiens,final_checked:!medPayLiens.final_checked}
        //     setMedPayLiens(obj);
        // } 
        // else if (sectionName === "health_insurance_liens") {
        //     updateLockSettleValue(id,"health_insurance_lien","final");
        //     const obj = {...healthInsuranceLiens,final_checked:!healthInsuranceLiens.final_checked}
        //     setHealthInsuranceLiens(obj);
        // }

    };
    const {  
        insuranceLienFinalAmount, setInsuranceLienFinalAmount,
        insuranceLiens,setInsuranceLiens,
        insuranceLiensLocks,setInsuranceLiensLocks,
        insuranceLiensLocksValues,setInsuranceLiensLocksValues,
        medPayLiens,setMedPayLiens, 
        healthInsuranceLiens, setHealthInsuranceLiens, 
        showErrorLeinModal,handleLienErrorShow,handleLienErrorClose,
        showErrorMedModal, handleMedErrorClose, handleMedErrorShow,
        showErrorHealthModal, handleHealthErrorClose, handleHealthErrorShow,
        showEditLien, handleEditLienClose, handleEditLienShow,
        updateLiensStates  
    } = insuranceLiensObj;
    const [currentInsuranceLien,setCurrentInsuranceLien] = useState(insuranceLiens[0] || {});
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
            <SectionActionBar sectionName={"Insurance Liens"} />
            <div className="table--no-card rounded-0 border-0 w-100">
                <table className="table table-borderless table-striped table-earning settlement-table">
                    {   insuranceLiens?.length > 0 &&
                        <thead>
                            <tr id="settle-tb-header" className="settle-t-4">
                                <th className=""></th>
                                <th className="td-autosize provider-col">Insurance</th>
                                <th className="text-end dollar-amount-value med-bill-width td-autosize">Total Paid</th>
                                <th className="text-end dollar-amount-value med-bill-width td-autosize hide-table-data">Lien</th>
                                <th className="text-end dollar-amount-value med-bill-width td-autosize hide-table-data">Reduction</th>
                                <th className="text-end dollar-amount-value med-bill-width td-autosize show-table-data">Debits</th>
                                <th className="text-end dollar-amount-value med-bill-width td-autosize">Final Lien</th>
                                <th className=""></th>
                                <th className={`height-25 text-right font-weight-bold td-autosize ${insuranceLiensLocks?.some(lock=>!lock.isDraftLocked) ? "cursor-pointer" : ""}`}
                                        style={{color:"var(--primary-25) !important"}}
                                        onClick={()=>{
                                            const draftLockCheck = insuranceLiensLocks?.some(lock=>!lock.isDraftLocked);
                                            if(draftLockCheck){
                                                insuranceLiensLocks?.forEach((lien,index)=>{
                                                    if(!lien.isDraftLocked){
                                                        updateRightColumnValue(
                                                            lien.isDraftLocked,
                                                            lien.isFinalLocked,
                                                            setInsuranceLiensLocks,
                                                            "insurance-draft",
                                                            lien.id,
                                                            insuranceLiensLocksValues,
                                                            setInsuranceLiensLocksValues,
                                                            "lien_insurance",
                                                            "draft1",
                                                            insuranceLiens[index]?.lienfinal
                                                        )
                                                    }
                                                })
                                                updateClientProceedsState();
                                            }
                                        }}
                                    >
                                        <span className='d-flex align-items-center justify-content-end position-relative center-val-div'>
                                            {insuranceLiensLocks?.some(lock=>!lock.isDraftLocked) && <CopyValueSettlement/>}
                                            Working
                                        </span>
                                </th>
                                <th className={`s-draft text-end ${insuranceLiensLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked) ? "cursor-pointer" : ""}`} 
                                    style={{color:"var(--primary-25) !important"}}
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        const finalLockCheck = insuranceLiensLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked);
                                        if(finalLockCheck){
                                            insuranceLiensLocks?.forEach(lien=>{
                                                if(lien.isDraftLocked && !lien.isFinalLocked && !lien.checkID){
                                                    updateRightColumnValue(
                                                        lien.isDraftLocked,
                                                        lien.isFinalLocked,
                                                        setInsuranceLiensLocks,
                                                        "insurance-final",
                                                        lien.id,
                                                        insuranceLiensLocksValues,
                                                        setInsuranceLiensLocksValues,
                                                        "lien_insurance",
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
                                            {insuranceLiensLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked && !lock.checkID) && <CopyValueSettlement />}
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
                        { insuranceLiens?.length == 0 &&                                 
                            <tr id="cost-settle-row" className='add-btn-row'>
                                <td className='text=center cursor-pointer' colSpan={ colSpanValue + 5 }> 
                                    
                                    <div className='settle-add-btn btn'>
                                        <button type="button" onClick={(e)=>{
                                            e.stopPropagation();
                                            setShowSettlementPopup(true);
                                            }} 
                                        className="btn">
                                            <span className="font-weight-bold text-gold">+ </span>
                                            <span>Insurance Lien</span> 
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        }
                        {
                            insuranceLiens?.length > 0 && insuranceLiens?.map((lien,index)=>
                            <tr className="height-25"                                     
                                onClick={()=>{
                                    setCurrentInsuranceLien(lien);
                                    handleEditLienShow();
                                }}
                            >
                                <td className="">{index + 1}</td>
                                <td className='provider-col text-left'>{lien?.insuranceID?.company} {lien?.insuranceID?.insurance_type}</td>
                                <td className="text-end monospace-font dollar-amount-value med-bill-width td-autosize" data-value={lien?.totalpaid}>{currencyFormat(lien?.totalpaid)}</td>
                                <td className="text-end monospace-font dollar-amount-value med-bill-width td-autosize hide-table-data" data-value={lien?.liens}>{currencyFormat(-Math.abs(lien?.liens))}</td>
                                <td className="text-end monospace-font dollar-amount-value med-bill-width td-autosize hide-table-data" data-value={lien?.reduction}>{currencyFormat(-Math.abs(lien?.reduction))}</td>
                                <td className="text-end monospace-font dollar-amount-value med-bill-width td-autosize show-table-data" 
                                    data-value={
                                        parseFloat(lien.liens || 0) + 
                                        parseFloat(lien.reduction || 0)
                                    }
                                    >
                                    {currencyFormat(
                                        -Math.abs(
                                        parseFloat(lien.liens || 0) + 
                                        parseFloat(lien.reduction || 0)
                                        )
                                    )}
                                </td>
                                <td className="text-end monospace-font dollar-amount-value med-bill-width td-autosize" data-value={lien?.lienfinal}>{currencyFormat(lien?.lienfinal)}</td>
                                <td className="" onClick={(e)=>e.stopPropagation()}></td>
                                <td className={`monospace-font  dollar-amount-value td-autosize text-right ${!insuranceLiensLocks[index].isDraftLocked ? "cursor-pointer" : ""}`} data-value={lien?.lienfinal}>
                                    <span className={`d-flex align-items-center ${!insuranceLiensLocks[index].isDraftLocked ? "justify-content-between cursor-pointer" : "justify-content-end"} align-items-center position-relative center-val-div`} onClick={(e)=>
                                        {
                                            e.stopPropagation();
                                            updateRightColumnValue(
                                            insuranceLiensLocks[index].isDraftLocked,
                                            insuranceLiensLocks[index].isFinalLocked,
                                            setInsuranceLiensLocks,
                                            "insurance-draft",
                                            lien.id,
                                            insuranceLiensLocksValues,
                                            setInsuranceLiensLocksValues,
                                            "lien_insurance",
                                            "draft1",
                                            lien?.lienfinal
                                        );
                                        updateClientProceedsState();
                                    }
                                    }>
                                        {!insuranceLiensLocks[index].isDraftLocked && <CopyValueSettlement/>}
                                        {currencyFormat(lien?.lienfinal)}
                                    </span>
                                </td>
                                <td className="s-draft text-right" onClick={(e)=>{
                                        e.stopPropagation();
                                        updateRightColumnValue(
                                            insuranceLiensLocks[index].isDraftLocked,
                                            insuranceLiensLocks[index].isFinalLocked,
                                            setInsuranceLiensLocks,
                                            "insurance-final",
                                            lien.id,
                                            insuranceLiensLocksValues,
                                            setInsuranceLiensLocksValues,
                                            "lien_insurance",
                                            "final",
                                            insuranceLiensLocks[index].isDraftAmount
                                        );
                                        updateClientProceedsState();
                                    }}>
                                    <div  className={`monospace-font d-flex justify-content-between align-items-center height-25 position-relative center-val-div`}>
                                        <img
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // if(insuranceLiensLocks[index].checkID){
                                                //     setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${insuranceLiensLocks[index].checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                //     handleLienErrorShow();
                                                //     return;
                                                // }
                                                const inputField = e.target.nextElementSibling;
                                                if (!insuranceLiensLocks[index].isDraftLocked) {
                                                
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
                                                handleDraftLockChange(lien.id,"lien_insurance",e)
                                            }}
                                            id="lock-image"
                                            className='ic ic-19'
                                            src={insuranceLiensLocks[index].isDraftLocked ? locked : unlocked}
                                            alt="lock-icon"
                                            style={{cursor: 'pointer' }}
                                        />
                                        <input
                                            id="lock-input"
                                            className={`${(insuranceLiensLocks[index].isDraftLocked && !insuranceLiensLocks[index].isFinalLocked) ? "cursor-pointer" : ""} monospace-font insurance-draft-${lien?.id} text-right insurance-draft dollar-amount-value ${
                                                insuranceLiensLocks[index].isDraftLocked ? "locked-input" : "unlock-input"
                                            } ${  ["0", "0.00"].includes(lien?.draft1.toString()) ? "zero-placeholder" : "black-placeholder"}`}
                                            type={"text"}
                                            data-value={lien?.draft1}                                                   
                                            readOnly={insuranceLiensLocks[index].isDraftLocked}
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
                                            const res = await updateLockSettleAmount(lien?.id,"lien_insurance","draft1",parseFloat(numericValue || 0).toFixed(2));
                                            setInsuranceLiensLocks((prevStates) =>
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
                                        
                                            const loanInputs = [...document.querySelectorAll('.insurance-draft')];
                                        
                                            
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
                                            setInsuranceLiensLocksValues([sum, insuranceLiensLocksValues[1] ])
                                            }}
                                            onMouseEnter={(e) => {                                     
                                                if(insuranceLiensLocks[index].isDraftLocked && !insuranceLiensLocks[index].isFinalLocked){
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
                                                if(insuranceLiensLocks[index].isDraftLocked && !insuranceLiensLocks[index].isFinalLocked){
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
                                        {insuranceLiensLocks[index].isDraftLocked && !insuranceLiensLocks[index].isFinalLocked && <CopyValueSettlement draft={true} />}
                                    </div>
                                </td>
                                <td className="s-final" onClick={(e)=>e.stopPropagation()}>
                                    <div className="monospace-font d-flex justify-content-between align-items-center height-25">
                                        <img
                                            onClick={(e) =>{
                                                e.stopPropagation();
                                                if(insuranceLiensLocks[index]?.checkID){
                                                    setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${insuranceLiensLocks[index].checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                    handleLienErrorShow();
                                                    return;
                                                }
                                                const inputField = e.target.nextElementSibling;
                                                if (!insuranceLiensLocks[index].isFinalLocked) {
                                                
                                                    const rawValue = inputField.getAttribute('data-value') || "0";
                                                    inputField.setAttribute('placeholder', currencyFormat(rawValue));
                                                    inputField.value = ""; 
                                                }
                                                setTimeout(() => {
                                                    let val = inputField.getAttribute('data-value') || "0";
                                                    val = val.trim().replace(/^0+(\.\d+)?$/, "0"); // Normalize zero-like values

                                                    // Convert to number and check if it's a zero-type value
                                                    const isZeroValue = parseFloat(val) === 0;

                                                    console.log(`isZeroValue: ${isZeroValue}, Value: ${val}, InputField:`, inputField);
                                                    console.log("Before Change: zero-placeholder", inputField.classList.contains("zero-placeholder"));
                                                    console.log("Before Change: black-placeholder", inputField.classList.contains("black-placeholder"));

                                                    if (isZeroValue) {
                                                        inputField.classList.add("zero-placeholder");
                                                        inputField.classList.remove("black-placeholder");
                                                    } else {
                                                        inputField.classList.add("black-placeholder");
                                                        inputField.classList.remove("zero-placeholder");
                                                    }

                                                    console.log("After Change: zero-placeholder", inputField.classList.contains("zero-placeholder"));
                                                    console.log("After Change: black-placeholder", inputField.classList.contains("black-placeholder"));
                                                }, 10);
                                                handleFinalLockChange(lien?.id,"lien_insurance",e);
                                            }}
                                            id="lock-image"
                                            className={`ic ic-19 ${insuranceLiensLocks[index].checkID?.check_sent ? "invisible" : ""} `}
                                            src={insuranceLiensLocks[index].isFinalLocked ? (insuranceLiensLocks[index].checkID?.check_sent ? lockedGrey : locked) : (insuranceLiensLocks[index].checkID?.check_sent ? unlockedGrey : unlocked)}
                                            alt="lock-icon"
                                            style={{cursor: 'pointer' }}
                                        />
                                        <input
                                            id="lock-input"
                                            className={`monospace-font insurance-final-${lien?.id} text-right insurance-final dollar-amount-value ${
                                                insuranceLiensLocks[index].isFinalLocked ? "locked-input" : "unlock-input"
                                            } ${["0", "0.00"].includes(lien?.final.toString()) ? "zero-placeholder" : "black-placeholder"}`}
                                            
                                            type="text"
                                            data-value={lien?.final}                                                   
                                            disabled={insuranceLiensLocks[index].isFinalLocked}
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
                                                const res = await updateLockSettleAmount(lien?.id, "lien_insurance", "final", parseFloat(numericValue || 0).toFixed(2));
                                                setInsuranceLiensLocks((prevStates) =>
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
                                                const loanInputs = [...document.querySelectorAll('.insurance-final')];
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
                                                setInsuranceLiensLocksValues([insuranceLiensLocksValues[0], sum]);
                                            }}
                                        />

                                    </div>
                                </td>
                                <td className="s-verify" onClick={(e)=>e.stopPropagation()}>
                                    <ChequeUpload entity={lien} panel={"lien_insurance"} pageId={page_id_click_record} documentType="verify" updateStates={updateLiensStates} handleNoCheckShow={handleNoCheckShow}/>
                                </td>
                                <td className="td-autosize check-request-td text-center" onClick={(e)=>e.stopPropagation()}>
                                    <div className={`${ insuranceLiensLocks[index]?.checkID?.cheque_number ? "check-class" : "d-flex justify-content-center" } `}>
                                        {
                                            ((!insuranceLiensLocks[index].checkID && insuranceLiensLocks[index].isFinalLocked && insuranceLiensLocks[index].isFinalAmount != 0)) ? <div className="settle-check-request-btn btn" id="nomargin">
                                                <RequestCheckButton onHandleClick={async() => {
                                                    try {
                                                        const res = await getPanelDetail("insurance-lien/edit","insurance_lien_id",lien?.id);
                                                        // If a check was already requested, show error
                                                        if (res) {
                                                            if (res?.data?.checkID?.date_check_requested) {
                                                                setMsgError("Check has already been requested by another user. Close the popup to see the details.");
                                                                handleLienErrorShow();
                                                            } else {
                                                                setMsgError(""); // Clear error if no request date found
                                                                setCurrentInsuranceLien({...lien,final:insuranceLiensLocks[index].isFinalAmount})
                                                                updateLiensStates()
                                                                handleCheckRequestShow()
                                                                
                                                            }
                                                        } else {
                                                            setMsgError(""); // No checkID, so no error
                                                            setCurrentInsuranceLien({...lien,final:insuranceLiensLocks[index].isFinalAmount})
                                                            updateLiensStates()
                                                            handleCheckRequestShow()
                                                            
                                                        }
                                                    } catch (error) {
                                                        setMsgError(""); // Optional: Or you can set a different error message
                                                        console.error("Error fetching request details:", error);
                                                        setCurrentInsuranceLien({...lien,final:insuranceLiensLocks[index].isFinalAmount})
                                                        updateLiensStates()
                                                        handleCheckRequestShow()
                                                        
                                                    }

                                                }} />
                                                {/* <RequestCheckButton onHandleClick={() => {
                                                    setCurrentInsuranceLien({...lien,final:insuranceLiensLocks[index].isFinalAmount})
                                                    updateLiensStates()
                                                    handleCheckRequestShow()
                                                }} /> */}
                                            </div>
                                                :
                                                <>
                                                    <div className='d-flex justify-content-center'>
                                                        <span>{insuranceLiensLocks[index].checkID?.cheque_date ? '' : insuranceLiensLocks[index].checkID?.date_check_requested && <span className='requested-btn'>Requested:&nbsp;</span>}</span>
                                                        
                                                        <span>{formatDate(insuranceLiensLocks[index].checkID?.cheque_date || insuranceLiensLocks[index].checkID?.date_check_requested || '')}</span>
                                                    </div>
                                                </>
                                        }
                                        {insuranceLiensLocks[index]?.checkID?.cheque_number && <span className='d-inline-block check-number'>{insuranceLiensLocks[index]?.checkID?.cheque_number}</span>}
                                        {insuranceLiensLocks[index]?.checkID?.cheque_number && <ChequeUpload entity={lien} panel={"lien_insurance"} pageId={page_id_click_record} documentType="check_as_sent" updateStates={updateLiensStates} handleNoCheckShow={handleNoCheckShow}/>}
                                    </div>  
                                </td> 
                            </tr>)
                        }
                        {   insuranceLiens?.length > 0 &&
                            <tr className="height-25">
                                <td></td>
                                <td className="height-25 text-capitalize text-right" colSpan={colSpanValue}>
                                    <span className='whitespace-SETTLE primary-clr-25'>Total Insurance Liens: </span>
                                    <p className="d-inline-flex align-items-center height-25 monospace-font text-right font-weight-bold dollar-amount-value" data-value={insuranceLienFinalAmount || 0.00}>
                                        {currencyFormat(insuranceLienFinalAmount || 0.00)}
                                    </p>
                                </td>
                                <td className="s-draft text-end monospace-font" data-value={insuranceLiensLocksValues[0] || 0.00}>
                                    <span style={{paddingRight:"2px"}} data-value={insuranceLiensLocksValues[0] || 0.00} className='dollar-amount-value'>{currencyFormat(insuranceLiensLocksValues[0] || 0.00)}</span>
                                </td>
                                <td className="s-final text-end monospace-font" >
                                    <span style={{paddingRight:"2px"}} data-value={insuranceLiensLocksValues[1] || 0.00} className='dollar-amount-value'>{currencyFormat(insuranceLiensLocksValues[1] || 0.00)}</span>
                                </td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td text-center"></td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
        <EditLiens 
            handleClose={handleEditLienClose} 
            lien={currentInsuranceLien} 
            show={showEditLien} 
            updateLienStates={updateLiensStates}
            updateClientProceedStates={updateClientProceedsState}
        />
        { showSettlementPopup &&
            <GenericSettlementAddPopup 
            show={showSettlementPopup}                 
            handleClose={()=>{
            setShowSettlementPopup(false);
            }} 
            initialLabel={"Insurance Lien"}
                {...settlementObjProps}
            />
        }
        <SettlementErrorModal show={showErrorLeinModal} handleClose={handleLienErrorClose} errorMsg={errorMsg} updateStates={updateLiensStates} />
        <SettlementNoCheckModal show={showNoCheckModal} handleClose={handleNoCheckClose} />
        <SettlementCheckRequest show={showCheckRequestModal} handleClose={handleCheckRequestClose} finalAmount={currentInsuranceLien?.final} panelLabel={"InsuranceLiens"} panelName={"lien_insurance"} panelEntity={currentInsuranceLien} updateStates={updateLiensStates} />
        </>
    )
}

export default InsuranceLiensTable