import React, { useState, useEffect } from 'react';
import locked from '../../../public/BP_resources/images/icon/locked.svg';
import unlocked from '../../../public/BP_resources/images/icon/unlocked.svg';
import lockedGrey from '../../../public/BP_resources/images/icon/locked-grey.svg';
import unlockedGrey from '../../../public/BP_resources/images/icon/unlocked-grey.svg';
import { currencyFormat, formatDate, inputCurrencyFormat } from '../../Utils/helper';
import { useSelector } from "react-redux";
import EditOfferPopUp from '../Modals/EditOfferModal/EditOfferPopUp';
import SettlementErrorModal from '../Modals/SettlementErrorModal';
import updateLockSettleValue from './common/updateLockSettleValue';
import updateLockSettleAmount from './common/updateLockSettleAmount';
import AllLockSettle from './common/AllLockSettle';
import SettlementNoCheckModal from '../Modals/SettlementNoCheckModal';
import ChequeUpload from './ChequeUpload';
import acceptOffer from './api/acceptOffer';
import CopyValueSettlement from './common/CopyValueSettlement';
import updateRightColumnValue from './common/updateRightColumnValue';
import SectionActionBar from './SectionActionBar';
import GenericSettlementAddPopup from '../Modals/GenericSettlementAddPopup';
import EditSettlementTrustLedgerCheckPopup from '../Modals/EditSettlementTrustLedgerCheckPopup';


const SettlementRecentOffers = ({
    offersObj,
    clientProceed,
    setClientProceed,
    updateClientProceedStates,
    feesObj,
    trustLedgerObj,
    offerCombinations, 
    updateGroupedOffersState,
    settlementObjProps
    }) => {
    const [showSettlementPopup, setShowSettlementPopup] = useState(false);
    const {updateFeesState} = feesObj;
    const { updateTrustLedger } = trustLedgerObj;
    const [currentCheck,setCheck] = useState({});
    const [showModal, showEditCostModal] = useState(false);
    const lockAllOffers = (bType,boolVal) => {
        AllLockSettle("offer",bType,boolVal);
        if(bType === "draft1"){
            setOffersLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isDraftLocked: boolVal === "true"
                }))
            );
        }
        else{
            setOffersLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isFinalLocked: row.checks ? row.isFinalLocked : boolVal === "true"
                }))
            );
        }
    }
    const page_id_click_record = useSelector(
        (state) => state.page_id_click_record.page_id_click_record
    );

    const handleDraftLockChange = (id,sectionName,event) => {
        event.stopPropagation(); 
        updateLockSettleValue(id,"offer","draft1")
        setOffersLocks((prevStates) =>
            prevStates.map((row) =>
                row.id === id ? { ...row, isDraftLocked: !row.isDraftLocked } : row
            )
        );
        
    };
    const handleFinalLockChange = (id, sectionName, event) => {
        event.stopPropagation();
        updateLockSettleValue(id, "offer", "final");
        setOffersLocks((prevStates) =>
            prevStates.map((row) =>
                row.id === id ? { ...row, isFinalLocked: !row.isFinalLocked } : row
            )
        );

    };
    const [errorMsg, setMsgError] = useState("")
    const [showNoCheckModal, setNoCheckModal] = useState(false);
    const handleNoCheckClose = () => setNoCheckModal(false);
    const handleNoCheckShow = () => setNoCheckModal(true);

    const {offersLocks, setOffersLocks,
        groupedOffers,
            offers,
            offerFinalAmount, setOfferLockValues,
            offerLockValues,
            showOfferModal, handleOfferClose,
            handleOfferShow, 
            currentOffer, setCurrentOffer,
            showErrorModal,
            handleErrorClose,
            handleErrorShow,
            updateOffersState
    } = offersObj;
    const [colSpanValue, setColSpanValue] = useState(document.documentElement.clientWidth < 2100 ? 7 : 10);
    const [lessThan1635, setcurrentWidth] = useState(document.documentElement.clientWidth < 1635 ? true : false);
    useEffect(() => {
        const handleResize = () => {
            setColSpanValue(document.documentElement.clientWidth < 2100 ? 7 : 10);
            setcurrentWidth(document.documentElement.clientWidth < 1635 ? true : false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    let totalChecksAmount = 0.00;
    const totalOffersAmount= offers?.reduce((acc,offer)=>{
        totalChecksAmount += offer.checks?.reduce((acc,check)=> parseFloat(acc) + parseFloat(check?.amount || 0.00),0.00);
        return offer?.offer_type.name == "Offer" ? parseFloat(acc) + parseFloat(offer?.amount || 0.00) : parseFloat(acc) + parseFloat(offer?.demand || 0.00);
    },0.00);
    const totalTrustDeposit =   totalOffersAmount - totalChecksAmount;
    return (
        <>
            <div className='m-t-5'>
                <SectionActionBar sectionName={"Negotiation"} />
                <div className="table--no-card rounded-0 border-0 w-100">
                    <table className="table table-borderless table-striped table-earning settlement-table">
                        { 
                        offers?.length > 0 && <thead>
                            <tr id="settle-tb-header" className="settle-t-4">
                                <th></th>
                                <th className='td-autosize text-left' colSpan={lessThan1635 ? 1 : colSpanValue - 4}>Description</th>
                                <th className='td-autosize text-center'>Accepted</th>
                                <th className='td-autosize text-end'>Amount</th>
                                <th className=""></th>
                                <th className={`text-end td-autosize ${offersLocks.some((lock) => !lock.isDraftLocked) ? "cursor-pointer" : ""}`}
                                    style={{color:"var(--primary-25) !important"}}
                                    onClick={()=>{
                                        groupedOffers.forEach( (group,parentIndex) => {
                                            const offer = group.offers_list[0];
                                            const draftLockCheck = !offersLocks.find((lock) => lock.id === offer.id)?.isDraftLocked;
                                            if(draftLockCheck){
                                            offersLocks?.forEach((obj,index)=>{
                                                if(!obj.isDraftLocked){
                                                    updateRightColumnValue(
                                                        obj.isDraftLocked,
                                                        obj.isFinalLocked,
                                                        setOffersLocks,
                                                        "offer-draft",
                                                        obj.id,
                                                        offerLockValues,
                                                        setOfferLockValues,
                                                        "offer",
                                                        "draft1",
                                                        offer?.offer_type.name == "Offer" ? (offer?.amount || 0.00) : (offer?.demand || 0.00)
                                                    )
                                                }
                                            })
                                            updateClientProceedStates();
                                        }
                                        });
                                        
                                    }}
                                >
                                    <span className='d-flex align-items-center justify-content-end position-relative center-val-div'>
                                        {offersLocks.some((lock) => !lock.isDraftLocked) && <CopyValueSettlement/>}
                                        Working
                                    </span>
                                </th>
                                <th className={`s-draft text-end ${offersLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked) ? "cursor-pointer" : ""}`} 
                                    style={{color:"var(--primary-25) !important"}}
                                    onClick={(e)=>{
                                        groupedOffers.forEach( (group,parentIndex) => {
                                            const offer = group.offers_list[0];
                                            const finalLockCheck = offersLocks.find((lock) => lock.id === offer.id)?.isDraftLocked && !offersLocks.find((lock) => lock.id === offer.id)?.isFinalLocked;
                                            if(finalLockCheck){
                                            offersLocks?.forEach((obj,index)=>{
                                                if(!obj.isDraftLocked && obj.isFinalLocked && !obj.checkID){
                                                    updateRightColumnValue(
                                                        obj.isDraftLocked,
                                                        obj.isFinalLocked,
                                                        setOffersLocks,
                                                        "offer-final",
                                                        obj.id,
                                                        offerLockValues,
                                                        setOfferLockValues,
                                                        "offer",
                                                        "final",
                                                        offer?.isDraftAmount
                                                    )
                                                }
                                            })
                                            updateClientProceedStates();
                                        }
                                        });
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
                                                    lockAllOffers("draft1",'false');
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
                                                    lockAllOffers("draft1",'true');
                                                }}
                                                style={{cursor: 'pointer' }}
                                            />
                                        </div>
                                        <span className='d-flex align-items-center justify-content-end position-relative center-val-div draft-central-div' style={{ paddingRight: "2px" }}>
                                            {offersLocks?.some(lock=> lock.isDraftLocked && !lock.isFinalLocked && !lock.checkID) && <CopyValueSettlement  />}
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
                                                    lockAllOffers("final",'false');
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
                                                    lockAllOffers("final",'true');
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
                            <>
                            {/* {offers.length === 0 && <SettlementEmptyTable tableName={"recent_offers"} />} */}
                                { offers?.length == 0 &&                                 
                                    <tr id="cost-settle-row" className='add-btn-row'>
                                        <td className='text=center cursor-pointer' colSpan={ lessThan1635 ? 10 : colSpanValue + 5 }> 
                                            
                                            <div className='settle-add-btn btn'>
                                                <button type="button" onClick={(e)=>{
                                                    e.stopPropagation();
                                                    setShowSettlementPopup(true);
                                                    }} 
                                                className="btn">
                                                    <span className="font-weight-bold text-gold">+ </span>
                                                    <span>Initial Demand or Offer</span> 
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                }
                                { offers?.length > 0 && groupedOffers.map( (group,parentIndex) => {

                                if (group.offers_list?.length === 0) return null; // Skip empty groups
                                const offer = group.offers_list[0]; // Get only the first offer
                                const by = offer.by_entity_client ? `${offer.by_entity_client.first_name || ''} ${offer.by_entity_client.last_name || ''}` : 
    
                                offer?.by_defendant?.defendantType?.name === "Private Individual" ? 
                                `${offer?.by_defendant?.first_name || ''} ${offer?.by_defendant?.last_name || ''}` :
                                `${offer?.by_defendant?.entity_name || ''}`;

                                return (
                                <React.Fragment key={parentIndex}>
                                <tr  onClick={()=>{
                                
                                setCurrentOffer(offer);
                                handleOfferShow();
                            }}>
                                    <td className="">{parentIndex + 1}</td>
                                    <td className='td-autosize provider-col text-left whitespace-SETTLE offer-provider-col offer-description'>
                                        {formatDate(offer?.date)}
                                        &nbsp;
                                        { offer?.offer_type?.name === "Settlement Conference" || offer?.offer_type?.name === "Mediation" ? `${offer?.offer_type?.name} Offer` : offer?.offer_type?.name }&nbsp;
                                        { "By" }&nbsp;
                                        {
                                            offer.by_defendant ?  offer?.by_defendant?.defendantType?.name === "Private Individual" ? 
                                                `${offer?.by_defendant?.first_name || ''} ${offer?.by_defendant?.last_name || ''}` :
                                                `${offer?.by_defendant?.entity_name || ''}` : `${ offer.by_entity_client?.first_name } ${ offer.by_entity_client?.last_name }`
                                        }&nbsp;
                                        { "To" }&nbsp;
                                        {
                                            offer?.defendant ?  offer?.defendant?.defendantType?.name === "Private Individual" ? 
                                                `${offer?.defendant?.first_name || ''} ${offer?.defendant?.last_name || ''}` :
                                                `${offer?.defendant?.entity_name || ''}` : `${ offer.entity_client?.first_name } ${ offer.entity_client?.last_name }`
                                        }
                                    </td>
                                    {!lessThan1635 && <td className="text-end dollar-amount-value td-autosize med-bill-width"></td>}
                                    {!lessThan1635 && <td className="text-end dollar-amount-value td-autosize med-bill-width"></td>}
                                    <td className="text-end dollar-amount-value td-autosize med-bill-width hide-table-data"></td>
                                    <td className="text-end dollar-amount-value td-autosize med-bill-width hide-table-data"></td>
                                    <td className="text-end dollar-amount-value td-autosize med-bill-width hide-table-data"></td>
                                    <td className="text-center dollar-amount-value td-autosize med-bill-width">{ offer?.accepted && `${formatDate(offer?.accepted_date)}` }</td>
                                    <td className='text-end dollar-amount-value td-autosize med-bill-width'>
                                    {/* offer.offer_type.name == 'Offer' ? offer?.amount || 0 : */}
                                        <span className="monospace-font whitespace-SETTLE dollar-amount-value text-end" data-value={ offer?.demand || 0.00 }>
                                            {/* {  offer.offer_type.name == 'Demand' && offer?.counter_offer_amount == 0 &&
                                                currencyFormat(offer?.demand)
                                            }
                                            {  offer.offer_type.name == 'Offer' && offer?.counter_offer_amount == 0 &&
                                            currencyFormat(offer?.amount) 
                                            } */}
                                            {/* {  offer.offer_type.name == 'Demand' &&
                                                currencyFormat(offer?.demand)
                                            }
                                            {  offer.offer_type.name == 'Offer' &&
                                            currencyFormat(offer?.amount) 
                                            }
                                            {   offer?.offer_type?.name === "Settlement Conference" || offer?.offer_type?.name === "Mediation" &&
                                            currencyFormat(offer?.demand) 
                                            } */}
                                            { currencyFormat(offer?.demand) }
                                        </span>
                                    </td>
                                    <td className="" onClick={(e)=>e.stopPropagation()}></td>
                                    {/* data-value={
                                            offer?.offer_type.name == "Offer" ? 
                                            offer?.amount || 0.00 : 
                                            offer?.demand || 0.00 
                                        } */}
                                    <td className="text-end monospace-font td-autosize dollar-amount-value" data-value={offer?.demand || 0.00 }>
                                        <span className={`d-flex align-items-center ${!offersLocks.find((row) => row.id === offer.id)?.isDraftLocked ? "justify-content-between cursor-pointer" : "justify-content-end"} align-items-center position-relative center-val-div`} onClick={(e)=>
                                        {
                                            e.stopPropagation();
                                            updateRightColumnValue(
                                                offersLocks.find((row) => row.id === offer.id)?.isDraftLocked,
                                                offersLocks.find((row) => row.id === offer.id)?.isFinalLocked,
                                                setOffersLocks,
                                                "offer-draft",
                                                offer.id,
                                                offerLockValues,
                                                setOfferLockValues,
                                                "offer",
                                                "draft1",
                                                offer?.demand
                                                // offer?.offer_type.name == "Offer" ?  offer?.amount : offer?.demand
                                            )
                                            updateClientProceedStates();
                                    }}>
                                        {!offersLocks.find((row) => row.id === offer.id)?.isDraftLocked && <CopyValueSettlement/>}
                                        { currencyFormat(offer?.demand) }
                                        </span>
                                    </td>
                                    <td className="s-draft text-right" onClick={(e)=>{
                                        console.log("ClickedOffer",offersLocks.find((row) => row.id === offer.id));
                                        e.stopPropagation(); //
                                        
                                        updateRightColumnValue(
                                            offersLocks.find((row) => row.id === offer.id)?.isDraftLocked,
                                            offersLocks.find((row) => row.id === offer.id)?.isFinalLocked,
                                            setOffersLocks,
                                            "offer-final",
                                            offer.id,
                                            offerLockValues,
                                            setOfferLockValues,
                                            "offer",
                                            "final",
                                            offersLocks.find((row) => row.id === offer.id)?.isDraftAmount
                                        )
                                        updateClientProceedStates();
                                    }}>
                                    { 
                                        <div className={`monospace-font d-flex justify-content-between align-items-center height-25 position-relative center-val-div`}>
                                            
                                            <img
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    const offerLock = offersLocks.find((row) => row.id === offer.id);

                                                    // if (offerLock?.checkID) {
                                                    //     setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${offerLock.checkID?.check_sent ? 'Issued' : 'Requested'}.`);
                                                    //     handleErrorShow();
                                                    //     return;
                                                    // }

                                                    const inputField = e.target.nextElementSibling;
                                                    if (!inputField) return; // Prevent errors if next element is not found

                                                    if (!offerLock?.isDraftLocked) {
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
                                                    }, 1);

                                                    handleDraftLockChange(offer.id, "offers", e);
                                                }}
                                                id="lock-image"
                                                className='ic ic-19'
                                                src={offersLocks.find((row) => row.id === offer.id)?.isDraftLocked ? locked : unlocked}
                                                alt="lock-icon"
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <input
                                                id="lock-input"
                                                className={`${(offersLocks.find((row) => row.id === offer.id)?.isDraftLocked && !offersLocks.find((row) => row.id === offer.id)?.isFinalLocked) ? "cursor-pointer" : ""} monospace-font text-right offer-draft-${offer.id} offer-draft dollar-amount-value ${
                                                    offersLocks.find((row) => row.id === offer.id)?.isDraftLocked ? "locked-input" : "unlock-input"
                                                } ${
                                                    ["0", "0.00", "0.0", ""].includes(offer.draft1.toString().trim()) ? "zero-placeholder" : "black-placeholder"
                                                }`}
                                                data-value={offer.draft1}
                                                readOnly={offersLocks.find((row) => row.id === offer.id)?.isDraftLocked}
                                                placeholder={offer.draft1 ? currencyFormat(offer.draft1) : "$ 0.00"}
                                                onClick={(e) => {
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
                                                    e.target.setAttribute('data-value', value || "");
                                                
                                                    // Restore cursor position
                                                    setTimeout(() => e.target.setSelectionRange(newCursorPosition, newCursorPosition), 0);
                                                }}
                                                onChange={async (e) => {
                                                    let numericValue = e.target.value
                                                        .replace(/[^0-9.-]/g, '') 
                                                        .replace(/(?!^)-/g, '');
                                                    const res = await updateLockSettleAmount(offer.id,"offer","draft1",parseFloat(numericValue || 0).toFixed(2));
                                                    if (numericValue !== '' && !isNaN(numericValue)) {
                                                        let num = parseFloat(numericValue);
                                                        if (num > 999999.99) num = 999999.99; 
                                                        else if (num < -999999.99) num = -999999.99; 
                                                        numericValue = num.toString(); 
                                                    }               
                                                    e.target.setAttribute('data-value', numericValue); 
                                                    const loanInputs = [...document.querySelectorAll('.offer-draft')];
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
                                                    setOfferLockValues([sum, offerLockValues[1]]);
                                                }}
                                                onMouseEnter={(e) => {                                     
                                                    if(offersLocks.find((row) => row.id === offer.id)?.isDraftLocked && !offersLocks.find((row) => row.id === offer.id)?.isFinalLocked){
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
                                                    if(offersLocks.find((row) => row.id === offer.id)?.isDraftLocked && !offersLocks.find((row) => row.id === offer.id)?.isFinalLocked){
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
                                            {(offersLocks.find((row) => row.id === offer.id)?.isDraftLocked && !offersLocks.find((row) => row.id === offer.id)?.isFinalLocked) && <CopyValueSettlement draft={true} />}
                                        </div> 
                                    }
                                    </td>
                                    <td className="s-final">
                                        {
                                            <div className={`monospace-font d-flex justify-content-between align-items-center height-25`}>
                                                <img
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if(offersLocks.find((row) => row.id === offer.id).checkID){
                                                            setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${offersLocks.find((row) => row.id === offer.id).checkID?.check_sent ? 'Issued' : 'Requested'}.`);
                                                            handleErrorShow();
                                                            return;
                                                        }
                                                        const inputField = e.target.nextElementSibling;
                                                        if (!offersLocks.find((row) => row.id === offer.id)?.isFinalLocked) {
                                                            
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
                                                        
                                                        const payload = { offer_id: offer?.id,accepted: offersLocks.find((row) => row.id === offer.id)?.isFinalLocked ? "False" : "True" }; 
                                                        acceptOffer(payload);
                                                        
                                                        
                                                        handleFinalLockChange(offer.id,"offers",e)
                                                    }}
                                                    id="lock-image"
                                                    className={`ic ic-19 ${offersLocks.find((row) => row.id === offer.id)?.checkID?.check_sent ? "invisible" : ""}`}
                                                    src={offersLocks.find((row) => row.id === offer.id)?.isFinalLocked ? (offersLocks.find((row) => row.id === offer.id)?.checkID?.check_sent ? lockedGrey : locked) : (offersLocks.find((row) => row.id === offer.id)?.checkID?.check_sent ? unlockedGrey : unlocked)}
                                                    alt="lock-icon"
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <input
                                                    id="lock-input"
                                                    className={`monospace-font text-right offer-final-${offer.id} offer-final dollar-amount-value ${
                                                        offersLocks.find((row) => row.id === offer.id)?.isFinalLocked ? "locked-input" : "unlock-input"
                                                    } ${  ["0", "0.00"].includes(offer.final.toString()) ? "zero-placeholder" : "black-placeholder"}`}                 
                                                    data-value={offer.final}
                                                    disabled={offersLocks.find((row) => row.id === offer.id)?.isFinalLocked}
                                                    placeholder={offer.final ? currencyFormat(offer.final) : "$ 0.00"}
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
                                                    onChange={async(e) => {
                                                        let numericValue = e.target.value
                                                            .replace(/[^0-9.-]/g, '') 
                                                            .replace(/(?!^)-/g, '');
                                                        const res = await updateLockSettleAmount(offer.id,"offer","final",parseFloat(numericValue || 0).toFixed(2));
                                                        setOffersLocks((prevStates) =>
                                                            prevStates.map((row) =>
                                                                row.id === offer.id ? { ...row, isFinalAmount: numericValue } : row
                                                            )
                                                        );
                                                        if (numericValue !== '' && !isNaN(numericValue)) {
                                                            let num = parseFloat(numericValue);
                                                            if (num > 999999.99) num = 999999.99; 
                                                            else if (num < -999999.99) num = -999999.99; 
                                                            numericValue = num.toString(); 
                                                        }               
                                                        e.target.setAttribute('data-value', numericValue); 
                                                        const loanInputs = [...document.querySelectorAll('.offer-final')];
                                                        const sum = loanInputs.reduce((acc, input) => {
                                                            const val = input.getAttribute('data-value') || '0';
                                                            const num = parseFloat(val);
                                                            return !isNaN(num) ? acc + num : acc;
                                                        }, 0);
                                                        console.log("VALUES",res);
                                                        const obj = {
                                                            ...clientProceed, 
                                                            balance_record : {
                                                                ...clientProceed.balance_record,
                                                                final:res?.data?.balance_record?.final
                                                            }
                                                        }
                                                        setClientProceed(obj);
                                                        setOfferLockValues([ offerLockValues[0], sum ]);
                                                    }}
                                                />
                                            </div>
                                        }
                                    </td>
                                    <td className="s-verify" onClick={(e)=>e.stopPropagation()}>
                                        <ChequeUpload entity={offer} panel={"offer"} pageId={page_id_click_record} documentType="verify" updateStates={updateOffersState} handleNoCheckShow={handleNoCheckShow}/>
                                    </td>
                                    <td className="td-autosize check-request-td text-center" onClick={(e)=>e.stopPropagation()}>
                                        {/* <div className={`${ offer.checks[0]?.cheque_number ? "check-class" : "d-flex justify-content-center" } `}>
                                            {offer.checks[0]?.cheque_date && <span>{formatDate(offer.checks[0]?.cheque_date)}</span>}
                                            {offer.checks[0]?.cheque_number && <span className='d-inline-block '>{offer.checks[0]?.cheque_number}</span>}
                                            {offer.checks[0]?.cheque_number && <span className='d-inline-block check-number monospace-font'>{currencyFormat(offer?.checks[0]?.amount)}</span>}
                                            {offer.checks[0]?.cheque_number && <ChequeUpload entity={offer} panel={"offer"} pageId={page_id_click_record} documentType="check_as_sent" updateStates={updateOffersState} handleNoCheckShow={handleNoCheckShow}/>}
                                        </div>
                                         */}
                                    </td>
                                </tr>

                                {offer?.checks?.length > 0 && offer?.checks?.map((check,index)=>{
                                    
                                    return (
                                    <tr onClick={(e)=>{
                                        e.stopPropagation();
                                        setCurrentOffer(offer);
                                        setCheck(check);
                                        showEditCostModal(true);
                                    }}>
                                        <td ></td>
                                        <td className="text-end whitespace-SETTLE primary-clr-25" colSpan={lessThan1635 ? 2 : colSpanValue - 3}>{check?.deposit ? "Trust Deposit Check:" : "Settlement Check:"}</td>
                                        <td className="text-end monospace-font td-autosize dollar-amount-value">{currencyFormat(check?.amount)}</td>
                                        <td className=""></td>
                                        <td className="text-end monospace-font td-autosize dollar-amount-value">{currencyFormat(check?.amount)}</td>
                                        <td className="s-draft text-right"></td>
                                        <td className="s-final"></td>
                                        <td className="s-verify">
                                            <ChequeUpload 
                                            entity={{
                                                id:offer?.id,
                                                checkID: check
                                            }} 
                                            panel={"other"} pageId={page_id_click_record} documentType="verify" updateStates={updateOffersState} handleNoCheckShow={handleNoCheckShow}/>
                                        </td>
                                        <td className="td-autosize check-request-td text-center" onClick={(e)=>e.stopPropagation()}>
                                            <div className={`${ check?.cheque_number ? "check-class" : "d-flex justify-content-center" } `}>
                                                {check?.cheque_date && <span>{formatDate(check?.cheque_date)}</span>}
                                                {check?.cheque_number && <span className='d-inline-block check-number'>{check?.cheque_number}</span>}
                                                {check?.cheque_number && 
                                                <ChequeUpload 
                                                    entity={{
                                                    id:offer?.id,
                                                    checkID: check
                                                    }}  
                                                    panel={"other"} pageId={page_id_click_record} documentType="check_as_sent" updateStates={updateOffersState} handleNoCheckShow={handleNoCheckShow}/>}
                                            </div>
                                            
                                        </td>
                                    </tr>
                                    )
                                }) 
                                }
                                

                                <tr className="">
                                    <td className="height-33 text-right td-autosize whitespace-SETTLE primary-clr-25" colSpan={lessThan1635 ? 5 : colSpanValue}></td>
                                    <td className="monospace-font td-autosize text-end whitespace-SETTLE dollar-amount-value"></td>
                                    <td className="monospace-font text-right" ></td>
                                    <td className="monospace-font text-right" ></td>
                                    <td className="s-verify"></td>
                                    <td className="td-autosize check-request-td"></td>
                                </tr>
                                </React.Fragment>
                                )
                                })}

                                {offers?.length > 0 &&
                                    <tr className="">
                                        <td></td>
                                        <td className="height-25 text-capitalize text-right" colSpan={lessThan1635 ? 5 : colSpanValue}>
                                            <span className='whitespace-SETTLE primary-clr-25'>Total Settlement: </span>
                                            <p className="d-inline-flex align-items-center height-25 monospace-font text-right font-weight-bold dollar-amount-value" data-value={offerFinalAmount || 0.00}>
                                                {currencyFormat(offerFinalAmount || 0.00)}
                                            </p>
                                        </td>
                                        <td className="s-draft monospace-font text-right" >
                                            <span style={{paddingRight:"2px"}} data-value={offerLockValues[0] || 0.00} className='dollar-amount-value' >{currencyFormat(offerLockValues[0] || 0.00)}</span>
                                        </td>
                                        <td className="s-final monospace-font text-right" >
                                            <span style={{paddingRight:"2px"}} data-value={offerLockValues[1] || 0.00} className='dollar-amount-value'>{currencyFormat(offerLockValues[1] || 0.00)}</span>
                                        </td>
                                        <td className="s-verify"></td>
                                        <td className="td-autosize check-request-td"></td>
                                    </tr>
                                }
                                {
                                    offers?.length > 0 && 
                                    <tr className="">
                                        <td></td>
                                        <td className="height-25 text-capitalize text-right" colSpan={lessThan1635 ? 5 : colSpanValue}>
                                            <span className='whitespace-SETTLE primary-clr-25'>Settlement Remaining For Assignment: </span>
                                            <p className="d-inline-flex align-items-center height-25 monospace-font text-right font-weight-bold dollar-amount-value" data-value={totalTrustDeposit || 0.00}>
                                                {currencyFormat(totalTrustDeposit || 0.00)}
                                            </p>
                                        </td>
                                        <td className="s-draft monospace-font text-right" ></td>
                                        <td className="s-final monospace-font text-right" ></td>
                                        <td className="s-verify"></td>
                                        <td className="td-autosize check-request-td"></td>
                                    </tr>
                                }
                            </>
                        </tbody>
                    </table>
                </div>
            </div>
            { showSettlementPopup &&
                <GenericSettlementAddPopup 
                show={showSettlementPopup}                 
                handleClose={()=>{
                setShowSettlementPopup(false);
                }} 
                initialLabel={"Initial Demand or Offer"}
                    {...settlementObjProps}
                />
            }
            {showModal && (
            <EditSettlementTrustLedgerCheckPopup
                onHide={()=>{
                    showEditCostModal(false)
                    updateOffersState();
                }}
                isVisible={showModal}
                check={currentCheck}
                offer={currentOffer}
                checks={currentOffer.checks}
                setCurrentCheck={setCheck}
                fetchAccountsData={updateOffersState}
            />
            )}
            <EditOfferPopUp show={showOfferModal} updateGroupedOffersState={updateGroupedOffersState} handleClose={handleOfferClose} offer={currentOffer} updateFeesState={updateFeesState} updateOffersState={updateOffersState} updateClientProceedStates={updateClientProceedStates} updateTrustLedger={updateTrustLedger} offerCombinations={offerCombinations} />
            <SettlementNoCheckModal show={showNoCheckModal} handleClose={handleNoCheckClose} />
            <SettlementErrorModal show={showErrorModal} handleClose={handleErrorClose} errorMsg={errorMsg}  />       
        </>
        )
}

export default SettlementRecentOffers