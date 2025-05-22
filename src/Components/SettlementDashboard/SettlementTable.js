import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import unlockedGrey from '../../../public/BP_resources/images/icon/unlocked-grey.svg';
import lockedGrey from '../../../public/BP_resources/images/icon/locked-grey.svg';
import locked from '../../../public/BP_resources/images/icon/locked.svg';
import unlocked from '../../../public/BP_resources/images/icon/unlocked.svg';
import SettlementCosts from './SettlementCosts';
import SettlementEmptyTable from './SettlementEmptyTable';
import EditMedicalBills from '../Modals/EditMedicalBills';
import updateLockSettleValue from './common/updateLockSettleValue';
import { currencyFormat, formatDate, inputCurrencyFormat } from '../../Utils/helper';
import ClientProvidersStyles from '../CaseDashboard/ClientProvidersStyles';
import EditLoans from '../Modals/EditLoans';
import SettlementErrorModal from '../Modals/SettlementErrorModal';
import SettlementNoCheckModal from '../Modals/SettlementNoCheckModal';
import SettlementCheckRequest from '../Modals/SettlementCheckRequest';
import updateLockSettleAmount from './common/updateLockSettleAmount';
import AllLockSettle from './common/AllLockSettle';
import SettlementRecentOffers from './SettlementRecentOffers';
import OffersFeeTable from './OffersFeeTable';
import ChequeUpload from './ChequeUpload';
import CopyValueSettlement from './common/CopyValueSettlement';
import updateRightColumnValue from './common/updateRightColumnValue';
import SectionActionBar from './SectionActionBar';
import RequestCheckButton from './common/RequestCheckButton';
import ClientProceeds from './ClientProceeds';
import InsuranceLiensTable from './InsuranceLiensTable';
import OtherLiensTable from './OtherLiensTable';
import AttorneyLiens from './AttorneyLiens';
import getPanelDetail from './api/getPanelDetail';
import GenericSettlementAddPopup from '../Modals/GenericSettlementAddPopup';

const SettlementTable = ({
    clientProceeds,
    offersObj,
    feesObj,
    costsObj,
    medicalBillsObj,
    insuranceLiensObj,
    otherLiensObj,
    loansObj,
    costsReimbursementsObj,
    trustLedgerObj, 
    offerCombinations,
    updateGroupedOffersState,
    settlementObjProps,
    initialOffers
    }) => {
    const [showSettlementPopup1, setShowSettlementPopup1] = useState(false);
    const [showSettlementPopup2, setShowSettlementPopup2] = useState(false);
    const variableMedBillWidth = () => {
        const currencyColumns = [...document.querySelectorAll('.med-bill-width')];
        const providerColumns = [...document.querySelectorAll('.provider-col')];
        const CheckNumberColumns = [...document.querySelectorAll('.check-number')];
        const CheckReqColumns = [...document.querySelectorAll('.check-request-td')];

        if (currencyColumns.length === 0 && providerColumns.length === 0 && CheckNumberColumns.length === 0 && CheckReqColumns.length === 0) return;
        let currencyMaxWidth = 0;
        currencyColumns.forEach(col => {
            const colWidth = col.offsetWidth;
            if (colWidth > currencyMaxWidth) {
                currencyMaxWidth = colWidth;
            }
        });
        currencyColumns.forEach(col => {
            col.style.minWidth = `${currencyMaxWidth}px`;
            col.style.width = `${currencyMaxWidth}px`;
        });

        let providerMaxWidth = 0;
        providerColumns.forEach(col => {
            if(!col.classList.contains("offer-provider-col")){
                const colWidth = col.offsetWidth;
                if (colWidth > providerMaxWidth) {
                    providerMaxWidth = colWidth;
                }
            }
        });
        providerColumns.forEach(col => {
            col.style.minWidth = `${providerMaxWidth}px`;
            col.style.width = `${providerMaxWidth}px`;
            col.style.maxWidth = `${providerMaxWidth}px`;
        });

        let checkNumMaxWidth = 0;
        CheckNumberColumns.forEach(col => {
            const colWidth = col.offsetWidth;
            if (colWidth > checkNumMaxWidth) {
                checkNumMaxWidth = colWidth;
            }
        });
        CheckNumberColumns.forEach(col => {
            col.style.minWidth = `${checkNumMaxWidth}px`;
            col.style.width = `${checkNumMaxWidth}px`;
        });

        let checkReqMaxWidth = 0;
        CheckReqColumns.forEach(col => {
            const colWidth = col.offsetWidth;
            if (colWidth > checkReqMaxWidth) {
                checkReqMaxWidth = colWidth;
            }
        });
        CheckReqColumns.forEach(col => {
            col.style.minWidth = `${checkReqMaxWidth}px`;
            col.style.width = `${checkReqMaxWidth}px`;
        });
    };
    const lockAllMedBills = (bType, boolVal) => {
        AllLockSettle("provider", bType, boolVal)
        if (bType === "draft1") {
            setMedicalBillsLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isDraftLocked: boolVal === "true"
                }))
            );
        }
        else {
            setMedicalBillsLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isFinalLocked: row.checkID ? row.isFinalLocked : boolVal === "true"
                }))
            );
        }
    }
    const lockAllLoans = (bType, boolVal) => {
        AllLockSettle("loans", bType, boolVal)
        if (bType === "draft1") {
            setLoansLocks((prevStates) =>
                prevStates.map((row) => ({
                    ...row,
                    isDraftLocked: boolVal === "true"
                }))
            );
        }
        else {
            setLoansLocks((prevStates) =>
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
    const handleDraftLockChange = (id, sectionName, e) => {
        e.stopPropagation();
        if (sectionName === "medical_bills") {
            updateLockSettleValue(id, "provider", "draft1");
            setMedicalBillsLocks((prevStates) =>
                prevStates.map((row) =>
                    row.id === id ? { ...row, isDraftLocked: !row.isDraftLocked } : row
                )
            );
        }
        else if (sectionName === "loans") {
            updateLockSettleValue(id, "loans", "draft1");
            setLoansLocks((prevStates) =>
                prevStates.map((row) =>
                    row.id === id ? { ...row, isDraftLocked: !row.isDraftLocked } : row
                )
            );
        }
    };

    const handleFinalLockChange = (id, sectionName, e) => {
        e.stopPropagation();
        if (sectionName === "medical_bills") {
            updateLockSettleValue(id, "provider", "final");
            setMedicalBillsLocks((prevStates) =>
                prevStates.map((row) =>
                    row.id === id ? { ...row, isFinalLocked: !row.isFinalLocked } : row
                )
            );
        }
        else if (sectionName === "loans") {
            updateLockSettleValue(id, "loans", "final");
            setLoansLocks((prevStates) =>
                prevStates.map((row) =>
                    row.id === id ? { ...row, isFinalLocked: !row.isFinalLocked } : row
                )
            );
        }
    };

    const {
        medicalBillsLocks, setMedicalBillsLocks,
        medicalBills, setMedicalBills,
        medicalBillFinalAmount,
        medicalBillLockValues, setMedicalBillLockValues,
        showMedBillModal,
        handleMedBillClose, handleMedBillShow,
        currentMedicalBill, setCurrentMedicalBill,
        showErrorModal,
        handleErrorClose,
        handleErrorShow,
        updateMedicalBillsState
    } = medicalBillsObj;

    const { loansLocks, setLoansLocks,
        loans, setLoans, loansFinalAmount,
        loansLockValues, showLoanModal,
        handleLoanClose, handleLoanShow,
        currentLoan, setCurrentLoan,
        showErrorLoanModal, setLoansLockValues,
        handleLoanErrorClose, handleLoanErrorShow,
        updateLoansState
    } = loansObj;

    const [showNoCheckModal, setNoCheckModal] = useState(false);
    const handleNoCheckClose = () => setNoCheckModal(false);
    const handleNoCheckShow = () => setNoCheckModal(true);

    const [showCheckRequestModal, setCheckRequestModal] = useState(false);
    const handleCheckRequestClose = () => setCheckRequestModal(false);
    const handleCheckRequestShow = () => setCheckRequestModal(true);

    const [showLoanCheckRequestModal, setLoanCheckRequestModal] = useState(false);
    const handleLoanCheckRequestClose = () => setLoanCheckRequestModal(false);
    const handleLoanCheckRequestShow = () => setLoanCheckRequestModal(true);

    const [errorMsg, setMsgError] = useState("")

    const [colSpanValue, setColSpanValue] = useState(document.documentElement.clientWidth < 2100 ? 6 : 10);
    useEffect(() => {
        const handleResize = () => {
            setColSpanValue(document.documentElement.clientWidth < 2100 ? 6 : 10);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        variableMedBillWidth();
    }, 
    [
        medicalBills, 
        costsObj.itemizedCost,
        costsReimbursementsObj.costsReimbursements, 
        loans,
        clientProceeds.checks,
        otherLiensObj.otherLiens,
        insuranceLiensObj.insuranceLiens,
        offersObj.groupedOffers,
        colSpanValue
    ]);
    return (
        <div style={{ marginTop: "55px" }}>
            <ClientProvidersStyles clientProviders={medicalBills} />
            <SettlementRecentOffers offersObj={offersObj} updateGroupedOffersState={updateGroupedOffersState} trustLedgerObj={trustLedgerObj} feesObj={feesObj} clientProceed={clientProceeds.clientProceed} setClientProceed={clientProceeds.setClientProceed} updateClientProceedStates={clientProceeds.updateClientProceedsState} offerCombinations={offerCombinations} settlementObjProps={settlementObjProps} />
            <OffersFeeTable initialOffers={initialOffers} clientProceeds={clientProceeds} feesObj={feesObj} settlementObjProps={settlementObjProps} />
            <SettlementCosts costsObj={costsObj} clientProceed={clientProceeds} costsReimbursementsObj={costsReimbursementsObj} settlementObjProps={settlementObjProps} />
            <div className='m-t-5'>
                <SectionActionBar sectionName={"Treatment"} />
                <div className="table--no-card rounded-0 border-0 w-100">
                    <table className="table table-borderless table-striped table-earning settlement-table">
                        {   medicalBills.length > 0 &&
                            <thead>
                                <tr id="settle-tb-header" className="settle-t-4">
                                    <th className=""></th>
                                    <th className="td-autosize text-center provider-col">Provider</th>
                                    <th className="text-end dollar-amount-value td-autosize med-bill-width">Original</th>
                                    <th className="text-end dollar-amount-value td-autosize med-bill-width hide-table-data">HI Paid</th>
                                    <th className="text-end dollar-amount-value td-autosize med-bill-width hide-table-data">HI Reduc</th>
                                    <th className="text-end dollar-amount-value td-autosize med-bill-width hide-table-data">MEDPAY/PIP</th>
                                    <th className="text-end dollar-amount-value td-autosize med-bill-width hide-table-data">Client Paid</th>
                                    <th className="text-end dollar-amount-value td-autosize med-bill-width hide-table-data">REDUCTION</th>
                                    <th className="text-end dollar-amount-value td-autosize med-bill-width show-table-data">Debits</th>
                                    <th className="text-end dollar-amount-value td-autosize med-bill-width">Lien</th>
                                    <th className="big-n-4 "></th>
                                    <th className={`text-end td-autosize ${medicalBillsLocks?.some(lock => !lock.isDraftLocked) ? "cursor-pointer" : ""}`}
                                        style={{ color: "var(--primary-25) !important" }}
                                        onClick={() => {
                                            const draftLockCheck = medicalBillsLocks?.some(lock => !lock.isDraftLocked);
                                            if (draftLockCheck) {
                                                medicalBillsLocks?.forEach((medBill, index) => {
                                                    if (!medBill.isDraftLocked) {
                                                        updateRightColumnValue(
                                                            medBill.isDraftLocked,
                                                            medBill.isFinalLocked,
                                                            setMedicalBillsLocks,
                                                            "bill-draft",
                                                            medBill.id,
                                                            medicalBillLockValues,
                                                            setMedicalBillLockValues,
                                                            "provider",
                                                            "draft1",
                                                            medicalBills[index].final_amount
                                                        )
                                                    }
                                                })
                                                clientProceeds.updateClientProceedsState();
                                            }
                                        }}
                                    >
                                        <span className='d-flex align-items-center justify-content-end position-relative center-val-div'>
                                            {medicalBillsLocks?.some(lock => !lock.isDraftLocked) && <CopyValueSettlement />}
                                            Working
                                        </span>
                                    </th>
                                    <th className={`s-draft text-end ${medicalBillsLocks?.some(lock => lock.isDraftLocked && !lock.isFinalLocked) ? "cursor-pointer" : ""}`}
                                        style={{ color: "var(--primary-25) !important" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const finalLockCheck = medicalBillsLocks?.some(lock => lock.isDraftLocked && !lock.isFinalLocked);
                                            if (finalLockCheck) {
                                                medicalBillsLocks?.forEach(medBill => {
                                                    console.log("SOME:", medBill)
                                                    if (medBill.isDraftLocked && !medBill.isFinalLocked && !medBill.checkID) {
                                                        updateRightColumnValue(
                                                            medBill.isDraftLocked,
                                                            medBill.isFinalLocked,
                                                            setMedicalBillsLocks,
                                                            "bill-final",
                                                            medBill.id,
                                                            medicalBillLockValues,
                                                            setMedicalBillLockValues,
                                                            "provider",
                                                            "final",
                                                            medBill.isDraftAmount
                                                        )
                                                    }
                                                })
                                                clientProceeds.updateClientProceedsState();
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        lockAllMedBills("draft1", 'false');
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <img
                                                    id="unlock-image"
                                                    className='ic ic-19 lock-icon'
                                                    alt="lock-icon"
                                                    src={locked}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        lockAllMedBills("draft1", 'true');
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                
                                            </div>
                                            
                                            <span className='d-flex align-items-center justify-content-end position-relative center-val-div draft-central-div' style={{ paddingRight: "2px" }}>
                                                {medicalBillsLocks?.some(lock => lock.isDraftLocked && !lock.isFinalLocked && !lock.checkID) && <CopyValueSettlement />}
                                                <span className="position-absolute right-0">Draft</span>
                                            </span>
                                        </div>
                                    </th>
                                    <th className="s-final text-end" style={{ color: "var(--primary-25) !important" }}>
                                        <div className='d-flex justify-content-between align-items-center height-25'>
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        lockAllMedBills("final", 'false');
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <img
                                                    id="unlock-image"
                                                    className='ic ic-19'
                                                    alt="lock-icon"
                                                    src={locked}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        lockAllMedBills("final", 'true');
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </div>
                                            <span style={{ paddingRight: "2px" }}>Final</span>
                                        </div>
                                    </th>
                                    <th className="s-verify"></th>
                                    <th className='td-autosize check-request-td text-center' style={{ color: "var(--primary-25) !important" }}>Check</th>
                                </tr>
                            </thead>
                        }
                        <tbody id="body-table">
                            <>
                                { medicalBills?.length == 0 &&                                 
                                    <tr id="cost-settle-row" className='add-btn-row'>
                                        <td className='text=center cursor-pointer' colSpan={colSpanValue + 5}> 
                                            <div className='settle-add-btn btn'>
                                                <button type="button" onClick={(e)=>{
                                                    e.stopPropagation();
                                                    setShowSettlementPopup1(true);
                                                    }} 
                                                className="btn">
                                                    <span className="font-weight-bold text-gold">+ </span>
                                                    <span>Medical Provider Lien or Expense</span> 
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                }
                                {
                                    medicalBills.length > 0 && medicalBills?.map((medicalBill, index) =>
                                        <tr key={index} className={`has-speciality-color-${medicalBill?.specialty?.id}`} style={{ height: "25px" }}
                                            onClick={() => {
                                                setCurrentMedicalBill(medicalBill);
                                                handleMedBillShow();
                                            }}>
                                            <td className="">{index + 1}</td>
                                            <td className={`td-autosize speciality-color-td provider-col bg-speciality-10`}>
                                                <div className="d-flex align-items-center">
                                                    <div className="provider-field logo-specialty-provider">
                                                        <span className="d-flex justify-content-center font-weight-bold align-items-center" style={{ backgroundColor: `${medicalBill?.specialty?.color}`,fontSize:"16px" }}>{medicalBill?.specialty?.name[0]}</span>
                                                    </div>
                                                    <p className="p-l-5 p-r-5">{medicalBill.treatment_location_name || ""}</p>
                                                </div>
                                            </td>
                                            <td className="td-autosize text-end monospace-font dollar-amount-value med-bill-width" data-value={medicalBill.amount}>{currencyFormat(medicalBill.amount)}</td>
                                            <td className="td-autosize text-end monospace-font dollar-amount-value med-bill-width hide-table-data" data-value={medicalBill.ins_paid}>{currencyFormat(-Math.abs(medicalBill.ins_paid))}</td>
                                            <td className="td-autosize text-end monospace-font dollar-amount-value med-bill-width hide-table-data" data-value={medicalBill.write_off}>{currencyFormat(-Math.abs(medicalBill.write_off))}</td>
                                            <td className="td-autosize text-end monospace-font dollar-amount-value med-bill-width hide-table-data" data-value={medicalBill.medpaypaip}>{currencyFormat(-Math.abs(medicalBill.medpaypaip))}</td>
                                            <td className="td-autosize text-end monospace-font dollar-amount-value med-bill-width hide-table-data" data-value={medicalBill.patient_paid}>{currencyFormat(-Math.abs(medicalBill.patient_paid))}</td>
                                            <td className="td-autosize text-end monospace-font dollar-amount-value med-bill-width show-table-data"
                                                data-value={
                                                    parseFloat(medicalBill.ins_paid || 0) +
                                                    parseFloat(medicalBill.write_off || 0) +
                                                    parseFloat(medicalBill.medpaypaip || 0) +
                                                    parseFloat(medicalBill.reduction || 0) +
                                                    parseFloat(medicalBill.patient_paid || 0)
                                                }
                                            >
                                                {currencyFormat(
                                                    -Math.abs(
                                                        parseFloat(medicalBill.ins_paid || 0) +
                                                        parseFloat(medicalBill.write_off || 0) +
                                                        parseFloat(medicalBill.medpaypaip || 0) +
                                                        parseFloat(medicalBill.reduction || 0) +
                                                        parseFloat(medicalBill.patient_paid || 0)
                                                    )
                                                )}
                                            </td>
                                            <td className="td-autosize text-end monospace-font dollar-amount-value med-bill-width hide-table-data" data-value={medicalBill.reduction}>{currencyFormat(-Math.abs(medicalBill.reduction))}</td>
                                            <td className="td-autosize text-end monospace-font dollar-amount-value med-bill-width" data-value={medicalBill.liens}>{currencyFormat(medicalBill.liens)}</td>
                                            <td className="text-capitalize big-n-4" onClick={(e)=>e.stopPropagation()}></td>
                                            <td className={`monospace-font dollar-amount-value td-autosize text-right ${!medicalBillsLocks[index].isDraftLocked ? "cursor-pointer" : ""}`} data-value={medicalBill.liens}>
                                                <span className={`d-flex align-items-center ${!medicalBillsLocks[index].isDraftLocked ? "justify-content-between" : "justify-content-end"} align-items-center position-relative center-val-div`} onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateRightColumnValue(
                                                        medicalBillsLocks[index].isDraftLocked,
                                                        medicalBillsLocks[index].isFinalLocked,
                                                        setMedicalBillsLocks,
                                                        "bill-draft",
                                                        medicalBill.id,
                                                        medicalBillLockValues,
                                                        setMedicalBillLockValues,
                                                        "provider",
                                                        "draft1",
                                                        medicalBill.liens
                                                    );
                                                    clientProceeds.updateClientProceedsState();
                                                }
                                                }>
                                                    {!medicalBillsLocks[index].isDraftLocked && <CopyValueSettlement />}
                                                    {currencyFormat(medicalBill.liens)}
                                                </span>
                                            </td>
                                            <td className="s-draft text-right">
                                                <div onClick={(e) => {
                                                e.stopPropagation();
                                                updateRightColumnValue(
                                                    medicalBillsLocks[index].isDraftLocked,
                                                    medicalBillsLocks[index].isFinalLocked,
                                                    setMedicalBillsLocks,
                                                    "bill-final",
                                                    medicalBill.id,
                                                    medicalBillLockValues,
                                                    setMedicalBillLockValues,
                                                    "provider",
                                                    "final",
                                                    medicalBillsLocks[index].isDraftAmount
                                                );
                                                clientProceeds.updateClientProceedsState();
                                            }} className={`monospace-font d-flex justify-content-between align-items-center height-25 position-relative center-val-div`}>                                                  
                                                    
                                                    <img
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // if (medicalBillsLocks[index].checkID) {
                                                            //     setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${medicalBillsLocks[index].checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                            //     handleErrorShow();
                                                            //     return;
                                                            // }
                                                            const inputField = e.target.nextElementSibling;
                                                            if (!medicalBillsLocks[index].isDraftLocked) {

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
                                                            handleDraftLockChange(medicalBill.id, "medical_bills", e)
                                                        }}
                                                        id="lock-image"
                                                        className='ic ic-19'
                                                        src={medicalBillsLocks[index].isDraftLocked ? locked : unlocked}
                                                        alt="lock-icon"
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                    
                                                    <input
                                                        id="lock-input"
                                                        className={`${(medicalBillsLocks[index].isDraftLocked && !medicalBillsLocks[index].isFinalLocked) ? "cursor-pointer" : ""} monospace-font bill-draft-${medicalBill.id} text-right bill-draft dollar-amount-value ${medicalBillsLocks[index].isDraftLocked ? "locked-input" : "unlock-input"
                                                            } ${["0", "0.00"].includes(medicalBill.draft1.toString()) ? "zero-placeholder" : "black-placeholder"}`}
                                                        type={"text"}
                                                        data-value={medicalBill.draft1}
                                                        readOnly={medicalBillsLocks[index].isDraftLocked}
                                                        placeholder={medicalBill.draft1 ? currencyFormat(medicalBill.draft1) : "$ 0.00"}
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
                                                        onClick={(e) => {

                                                            e.target.focus(); // Ensure input gets focus
                                                            
                                                        }}
                                                        onChange={async (e) => {
                                                            let numericValue = e.target.value
                                                                .replace(/[^0-9.-]/g, '')
                                                                .replace(/(?!^)-/g, '');
                                                            const res = await updateLockSettleAmount(medicalBill.id, "provider", "draft1", parseFloat(numericValue || 0).toFixed(2));
                                                            setMedicalBillsLocks((prevStates) =>
                                                                prevStates.map((row) =>
                                                                    row.id === medicalBill.id ? { ...row, isDraftAmount: numericValue } : row
                                                                )
                                                            );
                                                            if (numericValue !== '' && !isNaN(numericValue)) {
                                                                let num = parseFloat(numericValue);

                                                                if (num > 999999.99) num = 999999.99;
                                                                else if (num < -999999.99) num = -999999.99;

                                                                numericValue = num.toString();
                                                            }

                                                            e.target.setAttribute('data-value', numericValue);

                                                            const loanInputs = [...document.querySelectorAll('.bill-draft')];


                                                            const sum = loanInputs.reduce((acc, input) => {
                                                                const val = input.getAttribute('data-value') || '0';
                                                                const num = parseFloat(val);

                                                                return !isNaN(num) ? acc + num : acc;
                                                            }, 0);
                                                            console.log("VALUES",res);
                                                            const obj = {
                                                                ...clientProceeds.clientProceed, 
                                                                balance_record : {
                                                                    ...clientProceeds.clientProceed.balance_record,
                                                                    draft1:res?.data?.balance_record?.draft1
                                                                }
                                                            }
                                                            clientProceeds.setClientProceed(obj);
                                                            clientProceeds.updateClientProceedsState();
                                                            setMedicalBillLockValues([sum, medicalBillLockValues[1]])
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            
                                                            if(medicalBillsLocks[index].isDraftLocked && !medicalBillsLocks[index].isFinalLocked){
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

                                                            if(medicalBillsLocks[index].isDraftLocked && !medicalBillsLocks[index].isFinalLocked){
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
                                                    {medicalBillsLocks[index].isDraftLocked && !medicalBillsLocks[index].isFinalLocked && <CopyValueSettlement draft={true} />}
                                                </div>
                                            </td>
                                            <td className="s-final" onClick={(e) => e.stopPropagation()}>
                                                <div className="monospace-font d-flex justify-content-between align-items-center height-25">
                                                    <img
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (medicalBillsLocks[index]?.checkID) {
                                                                setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${medicalBillsLocks[index].checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                                handleErrorShow();
                                                                return;
                                                            }
                                                            const inputField = e.target.nextElementSibling;
                                                            if (!medicalBillsLocks[index].isFinalLocked) {

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
                                                            handleFinalLockChange(medicalBill.id, "medical_bills", e);
                                                        }}
                                                        id="lock-image"
                                                        className={`ic ic-19 ${medicalBillsLocks[index].checkID?.check_sent ? "invisible" : ""} `}
                                                        src={medicalBillsLocks[index].isFinalLocked ? (medicalBillsLocks[index].checkID?.check_sent ? lockedGrey : locked) : (medicalBillsLocks[index].checkID?.check_sent ? unlockedGrey : unlocked)}
                                                        alt="lock-icon"
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                    <input
                                                        id="lock-input"
                                                        className={`monospace-font bill-final-${medicalBill.id} text-right bill-final dollar-amount-value ${medicalBillsLocks[index].isFinalLocked ? "locked-input" : "unlock-input"
                                                            } ${["0", "0.00"].includes(medicalBill.final.toString()) ? "zero-placeholder" : "black-placeholder"}`}

                                                        type="text"
                                                        data-value={medicalBill.final}
                                                        disabled={medicalBillsLocks[index].isFinalLocked}
                                                        placeholder={medicalBill.final ? currencyFormat(medicalBill.final) : "$ 0.00"}

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

                                                            const res = await updateLockSettleAmount(medicalBill.id, "provider", "final", parseFloat(numericValue || 0).toFixed(2));
                                                            setMedicalBillsLocks((prevStates) =>
                                                                prevStates.map((row) =>
                                                                    row.id === medicalBill.id ? { ...row, isFinalAmount: numericValue } : row
                                                                )
                                                            );

                                                            if (numericValue !== '' && !isNaN(numericValue)) {
                                                                let num = parseFloat(numericValue);

                                                                if (num > 999999.99) num = 999999.99;
                                                                else if (num < -999999.99) num = -999999.99;

                                                                numericValue = num.toString();
                                                            }

                                                            e.target.setAttribute("data-value", numericValue);

                                                            const loanInputs = [...document.querySelectorAll('.bill-final')];
                                                            const sum = loanInputs.reduce((acc, input) => {
                                                                const val = input.getAttribute("data-value") || "0";
                                                                const num = parseFloat(val);
                                                                return !isNaN(num) ? acc + num : acc;
                                                            }, 0);
                                                            console.log("VALUES",res);
                                                            const obj = {
                                                                ...clientProceeds.clientProceed, 
                                                                balance_record : {
                                                                    ...clientProceeds.clientProceed.balance_record,
                                                                    final:res?.data?.balance_record?.final
                                                                }
                                                            }
                                                            clientProceeds.setClientProceed(obj);
                                                            clientProceeds.updateClientProceedsState();
                                                            setMedicalBillLockValues([medicalBillLockValues[0], sum]);
                                                        }}
                                                    />

                                                </div>
                                            </td>
                                            <td className="s-verify" onClick={(e) => e.stopPropagation()}>
                                                <ChequeUpload entity={medicalBill} panel={"medical_bill"} pageId={page_id_click_record} documentType="verify" updateStates={updateMedicalBillsState} handleNoCheckShow={handleNoCheckShow} />
                                            </td>
                                            <td className="td-autosize check-request-td text-center" onClick={(e) => e.stopPropagation()}>
                                                <div className={`${ medicalBillsLocks[index]?.checkID?.cheque_number ? "check-class" : "d-flex justify-content-center" } `}>
                                                    {
                                                        ((!medicalBillsLocks[index].checkID && medicalBillsLocks[index].isFinalLocked && medicalBillsLocks[index].isFinalAmount != 0)) ? <div className="settle-check-request-btn btn" id="nomargin">
                                                            <RequestCheckButton onHandleClick={async() => {
                                                                try {
                                                                    const res = await getPanelDetail("edit-medical-bill","provider_id",medicalBill?.id);
                                                                    // If a check was already requested, show error
                                                                    if (res) {
                                                                        if (res?.data?.checkID?.date_check_requested) {
                                                                            setMsgError("Check has already been requested by another user. Close the popup to see the details.");
                                                                            handleErrorShow();
                                                                        } else {
                                                                            setMsgError(""); // Clear error if no request date found
                                                                            setCurrentMedicalBill({...medicalBill,final:medicalBillsLocks[index].isFinalAmount})
                                                                            updateMedicalBillsState()
                                                                            handleCheckRequestShow()
                                                                            
                                                                        }
                                                                    } else {
                                                                        setMsgError(""); // No checkID, so no error
                                                                        setCurrentMedicalBill({...medicalBill,final:medicalBillsLocks[index].isFinalAmount})
                                                                        updateMedicalBillsState()
                                                                        handleCheckRequestShow()
                                                                        
                                                                    }
                                                                } catch (error) {
                                                                    setMsgError(""); // Optional: Or you can set a different error message
                                                                    console.error("Error fetching request details:", error);
                                                                    setCurrentMedicalBill({...medicalBill,final:medicalBillsLocks[index].isFinalAmount})
                                                                    updateMedicalBillsState()
                                                                    handleCheckRequestShow()
                                                                    
                                                                }

                                                            }} />
                                                        </div>
                                                            :
                                                            <>
                                                                <div className='d-flex justify-content-center'>
                                                                    <span>{medicalBillsLocks[index].checkID?.cheque_date ? '' : medicalBillsLocks[index].checkID?.date_check_requested && <span className='requested-btn'>Requested:&nbsp;</span>}</span>
                                                                    
                                                                    <span>{formatDate(medicalBillsLocks[index].checkID?.cheque_date || medicalBillsLocks[index].checkID?.date_check_requested || '')}</span>
                                                                </div>
                                                            </>
                                                    }
                                                    {medicalBillsLocks[index]?.checkID?.cheque_number && <span className='d-inline-block check-number'>{medicalBillsLocks[index]?.checkID?.cheque_number}</span>}
                                                    {medicalBillsLocks[index]?.checkID?.cheque_number && <ChequeUpload entity={medicalBill} panel={"medical_bill"} pageId={page_id_click_record} documentType="check_as_sent" updateStates={updateMedicalBillsState} handleNoCheckShow={handleNoCheckShow} />}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                {   medicalBills.length > 0 &&
                                    <tr className="height-25">
                                        <td className=""></td>
                                        <td className="height-25 text-capitalize text-right bill-total-td" colSpan={colSpanValue}>
                                            <span className='whitespace-SETTLE primary-clr-25'>Total Medical Bills: </span>
                                            <p className="d-inline-flex align-items-center height-25 monospace-font text-right font-weight-bold dollar-amount-value" data-value={medicalBillFinalAmount || 0.00}>
                                            {currencyFormat(medicalBillFinalAmount || 0.00)}
                                            </p>
                                        </td>
                                        <td className="s-draft monospace-font text-right" data-value={medicalBillLockValues[0]}>
                                            <span style={{ paddingRight: "2px" }} data-value={medicalBillLockValues[0] || 0.00} className='dollar-amount-value'>{currencyFormat(medicalBillLockValues[0])}</span>
                                        </td>
                                        <td className="s-final monospace-font text-right" data-value={medicalBillLockValues[1]}>
                                            <span style={{ paddingRight: "2px" }} data-value={medicalBillLockValues[1] || 0.00} className='dollar-amount-value'>{currencyFormat(medicalBillLockValues[1])}</span>
                                        </td>
                                        <td className="s-verify"></td>
                                        <td className="td-autosize check-request-td"></td>
                                    </tr>
                                }
                            </>
                        </tbody>
                    </table>
                </div>
            </div>
            <InsuranceLiensTable insuranceLiensObj={insuranceLiensObj} clientProceeds={clientProceeds} settlementObjProps={settlementObjProps} />
            <OtherLiensTable otherLiensObj={otherLiensObj} clientProceeds={clientProceeds} settlementObjProps={settlementObjProps} />
            
            <div className="m-t-5 m-b-5">
                <SectionActionBar sectionName={"LOANS AND ADVANCES"} />
                <div className="table--no-card rounded-0 border-0 w-100">
                    <table className="table table-borderless table-striped table-earning settlement-table">
                        {   loans?.length > 0 &&                    
                            <thead>
                                <tr id="settle-tb-header" className="settle-t-5">
                                    <th className=""></th>
                                    <th className="td-autosize text-left provider-col">Company</th>
                                    <th className="td-autosize text-center">Account</th>
                                    <th className="td-autosize text-end med-bill-width">Loan</th>
                                    <th className="td-autosize text-center">Disbursed</th>
                                    <th className="td-autosize text-end med-bill-width">Payoff</th>
                                    <th className="td-autosize text-center">Verified</th>
                                    <th className=""></th>
                                    <th className={`text-end td-autosize ${loansLocks?.some(lock => !lock.isDraftLocked) ? "cursor-pointer" : ""}`}
                                        style={{ color: "var(--primary-25) !important" }}
                                        onClick={() => {
                                            const draftLockCheck = loansLocks?.some(lock => !lock.isDraftLocked);
                                            if (draftLockCheck) {
                                                loansLocks?.forEach((loan, index) => {
                                                    if (!loan.isDraftLocked) {
                                                        updateRightColumnValue(
                                                            loan.isDraftLocked,
                                                            loan.isFinalLocked,
                                                            setLoansLocks,
                                                            "loan-draft",
                                                            loan.id,
                                                            loansLockValues,
                                                            setLoansLockValues,
                                                            "loans",
                                                            "draft1",
                                                            loans[index].final_amount
                                                        )
                                                    }
                                                })
                                                clientProceeds.updateClientProceedsState();
                                            }
                                        }}
                                    >
                                        <span className='d-flex align-items-center justify-content-end position-relative center-val-div'>
                                            {loansLocks?.some(lock => !lock.isDraftLocked) && <CopyValueSettlement />}
                                            Working
                                        </span>
                                    </th>
                                    <th className={`s-draft text-end ${loansLocks?.some(lock => lock.isDraftLocked && !lock.isFinalLocked) ? "cursor-pointer" : ""}`}
                                        style={{ color: "var(--primary-25) !important" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const finalLockCheck = loansLocks?.some(lock => lock.isDraftLocked && !lock.isFinalLocked);
                                            if (finalLockCheck) {
                                                loansLocks?.forEach(loan => {
                                                    if (loan.isDraftLocked && !loan.isFinalLocked && !lock.checkID) {
                                                        updateRightColumnValue(
                                                            loan.isDraftLocked,
                                                            loan.isFinalLocked,
                                                            setLoansLocks,
                                                            "loan-final",
                                                            loan.id,
                                                            loansLockValues,
                                                            setLoansLockValues,
                                                            "loans",
                                                            "final",
                                                            loan.isDraftAmount
                                                        )
                                                    }
                                                })
                                                clientProceeds.updateClientProceedsState();
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        lockAllLoans("draft1", 'false');
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <img
                                                    id="unlock-image"
                                                    className='ic ic-19 lock-icon'
                                                    alt="lock-icon"
                                                    src={locked}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        lockAllLoans("draft1", 'true');
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </div>
                                            <span className='d-flex align-items-center justify-content-end position-relative center-val-div draft-central-div' style={{ paddingRight: "2px" }}>
                                                {loansLocks?.some(lock => lock.isDraftLocked && !lock.isFinalLocked && !lock.checkID) && <CopyValueSettlement />}
                                                <span className="position-absolute right-0">Draft</span>
                                                
                                            </span>
                                        </div>
                                    </th>
                                    <th className="s-final text-end" style={{ color: "var(--primary-25) !important" }}>
                                        <div className='d-flex justify-content-between align-items-center height-25'>
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        lockAllLoans("final", 'false');
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <img
                                                    id="unlock-image"
                                                    className='ic ic-19'
                                                    alt="lock-icon"
                                                    src={locked}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        lockAllLoans("final", 'true');
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </div>
                                            <span style={{ paddingRight: "2px" }}>Final</span>
                                        </div>
                                    </th>
                                    <th className="s-verify"></th>
                                    <th className='td-autosize check-request-td text-center' style={{ color: "var(--primary-25) !important" }}>Check</th>
                                </tr>
                            </thead>
                        }
                        <tbody id="body-table">
                            { loans?.length == 0 &&                                 
                                <tr id="cost-settle-row" className='add-btn-row'>
                                    <td className='text=center cursor-pointer' colSpan={13}> 
                                        <div className='settle-add-btn btn'>
                                            <button type="button" onClick={(e)=>{
                                                e.stopPropagation();
                                                setShowSettlementPopup2(true);
                                                }} 
                                            className="btn">
                                                <span className="font-weight-bold text-gold">+ </span>
                                                <span>Loan and Advance</span> 
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            }
                            {loans?.length > 0 && loans?.map((loan, index) =>
                                <tr key={index} className="height-25" onClick={() => {
                                    setCurrentLoan(loan);
                                    handleLoanShow();
                                }}>
                                    <td className="">{index + 1}</td>
                                    <td className="td-autosize text-left provider-col">{loan?.loan_company}</td>
                                    <td className="td-autosize text-center">{loan?.account_number}</td>
                                    <td className="td-autosize text-end td-autosize med-bill-width monospace-font dollar-amount-value" data-value={loan?.current_amount_verified}>{currencyFormat(loan?.current_amount_verified)}</td>
                                    <td className="td-autosize text-center">{formatDate(loan?.application_date)}</td>
                                    <td className="td-autosize monospace-font text-right dollar-amount-value" data-value={loan?.final_amount}>{currencyFormat(loan?.final_amount)}</td>
                                    <td className="td-autosize text-center">{formatDate(loan?.date_verified)}</td>
                                    <td className="" onClick={(e) => e.stopPropagation()}></td>
                                    <td className="text-right monospace-font dollar-amount-value td-autosize" data-value={loan?.final_amount}>
                                        <span className={`d-flex align-items-center ${!loansLocks[index].isDraftLocked ? "justify-content-between" : "justify-content-end"} align-items-center position-relative center-val-div`} onClick={(e) => {
                                            e.stopPropagation();
                                            updateRightColumnValue(
                                                loansLocks[index].isDraftLocked,
                                                loansLocks[index].isFinalLocked,
                                                setLoansLocks,
                                                "loan-draft",
                                                loan.id,
                                                loansLockValues,
                                                setLoansLockValues,
                                                "loans",
                                                "draft1",
                                                loan?.final_amount
                                            )
                                            clientProceeds.updateClientProceedsState();
                                        }
                                        }>
                                            {!loansLocks[index].isDraftLocked && <CopyValueSettlement />}
                                            {currencyFormat(loan?.final_amount)}
                                        </span>
                                    </td>
                                    <td className="s-draft text-right" onClick={(e) => {
                                        e.stopPropagation(); //
                                        updateRightColumnValue(
                                            loansLocks[index].isDraftLocked,
                                            loansLocks[index].isFinalLocked,
                                            setLoansLocks,
                                            "loan-final",
                                            loan.id,
                                            loansLockValues,
                                            setLoansLockValues,
                                            "loans",
                                            "final",
                                            loansLocks[index].isDraftAmount
                                        )
                                        clientProceeds.updateClientProceedsState();
                                    }}>
                                        <div className="monospace-font d-flex justify-content-between align-items-center height-25 position-relative center-val-div">
                                            <img
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // if (loansLocks[index]?.checkID) {
                                                    //     setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${loansLocks[index]?.checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                    //     handleLoanErrorShow();
                                                    //     return;
                                                    // }
                                                    const inputField = e.target.nextElementSibling;
                                                    if (!loansLocks[index].isDraftLocked) {

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
                                                    handleDraftLockChange(loan.id, "loans", e)
                                                }}
                                                id="lock-image"
                                                className='ic ic-19'
                                                src={loansLocks[index].isDraftLocked ? locked : unlocked}
                                                alt="lock-icon"
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <input
                                                id="lock-input"
                                                className={`${(loansLocks[index].isDraftLocked && !loansLocks[index].isFinalLocked) ? "cursor-pointer" : ""} monospace-font text-right loan-draft-${loan.id} loan-draft dollar-amount-value ${loansLocks[index].isDraftLocked ? "locked-input" : "unlock-input"
                                                    } ${["0", "0.00"].includes(loan.draft1.toString()) ? "zero-placeholder" : "black-placeholder"}`}

                                                type={"text"}
                                                data-value={loan.draft1}
                                                readOnly={loansLocks[index].isDraftLocked}
                                                placeholder={loan.draft1 ? currencyFormat(loan.draft1) : "$ 0.00"}
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
                                                onChange={(e) => {
                                                    let numericValue = e.target.value
                                                        .replace(/[^0-9.-]/g, '')
                                                        .replace(/(?!^)-/g, '');

                                                    updateLockSettleAmount(loan.id, "loans", "draft1", parseFloat(numericValue || 0).toFixed(2));

                                                    if (numericValue !== '' && !isNaN(numericValue)) {
                                                        let num = parseFloat(numericValue);

                                                        if (num > 999999.99) num = 999999.99;
                                                        else if (num < -999999.99) num = -999999.99;

                                                        numericValue = num.toString();
                                                    }

                                                    e.target.setAttribute('data-value', numericValue);

                                                    const loanInputs = [...document.querySelectorAll('.loan-draft')];
                                                    const sum = loanInputs.reduce((acc, input) => {
                                                        const val = input.getAttribute('data-value') || '0';
                                                        const num = parseFloat(val);
                                                        return !isNaN(num) ? acc + num : acc;
                                                    }, 0);
                                                    console.log("VALUES",res);
                                                    const obj = {
                                                        ...clientProceeds.clientProceed, 
                                                        balance_record : {
                                                            ...clientProceeds.clientProceed.balance_record,
                                                            draft1:res?.data?.balance_record?.draft1
                                                        }
                                                    }
                                                    clientProceeds.setClientProceed(obj);
                                                    clientProceeds.updateClientProceedsState();
                                                    setLoansLockValues([sum, loansLockValues[1]])
                                                }}
                                                onMouseEnter={(e) => {                                     
                                                    if(loansLocks[index].isDraftLocked && !loansLocks[index].isFinalLocked){
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
                                                    if(loansLocks[index].isDraftLocked && !loansLocks[index].isFinalLocked){
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
                                            {loansLocks[index].isDraftLocked && !loansLocks[index].isFinalLocked && <CopyValueSettlement draft={true} />}
                                        </div>
                                    </td>
                                    <td className="s-final" onClick={(e) => e.stopPropagation()}>
                                        <div className="monospace-font d-flex justify-content-between align-items-center height-25">
                                            <img
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (loansLocks[index].checkID) {
                                                        setMsgError(`The Amount Cannot Be Modified Because a Check Has Been ${loansLocks[index]?.checkID?.check_sent ? 'Issued' : 'Requested'}.`)
                                                        handleLoanErrorShow();
                                                        return;
                                                    }
                                                    const inputField = e.target.nextElementSibling;
                                                    if (!loansLocks[index].isFinalLocked) {

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
                                                    handleFinalLockChange(loan.id, "loans", e)
                                                }}
                                                id="lock-image"
                                                className={`ic ic-19 ${loansLocks[index].checkID?.check_sent ? "invisible" : ""} `}
                                                src={loansLocks[index].isFinalLocked ? (loansLocks[index].checkID?.check_sent ? lockedGrey : locked) : (loansLocks[index].checkID?.check_sent ? unlockedGrey : unlocked)}
                                                alt="lock-icon"
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <input
                                                id="lock-input"
                                                className={`monospace-font text-right loan-final-${loan.id} loan-final dollar-amount-value ${loansLocks[index].isFinalLocked ? "locked-input" : "unlock-input"
                                                    } ${["0", "0.00"].includes(loan.final.toString()) ? "zero-placeholder" : "black-placeholder"}`}

                                                type={"text"}
                                                data-value={loan.final}
                                                disabled={loansLocks[index].isFinalLocked}
                                                placeholder={loan.final ? currencyFormat(loan.final) : "$ 0.00"}
                                                onDoubleClick={(e) => {
                                                    const inputField = e.target;
                                                    inputField.value = currencyFormat(inputField.getAttribute("data-value")); // Set real value
                                                    inputField.placeholder = ""; // Remove placeholder
                                                    inputField.select(); // Select all text
                                                }}
                                                onClick={(e) => e.stopPropagation()}
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

                                                    const res = await updateLockSettleAmount(loan.id, "loans", "final", parseFloat(numericValue || 0).toFixed(2));
                                                    setLoansLocks((prevStates) =>
                                                        prevStates.map((row) =>
                                                            row.id === loan.id ? { ...row, isFinalAmount: numericValue } : row
                                                        )
                                                    );

                                                    if (numericValue !== '' && !isNaN(numericValue)) {
                                                        let num = parseFloat(numericValue);

                                                        if (num > 999999.99) num = 999999.99;
                                                        else if (num < -999999.99) num = -999999.99;

                                                        numericValue = num.toString();
                                                    }

                                                    e.target.setAttribute('data-value', numericValue);

                                                    const loanInputs = [...document.querySelectorAll('.loan-final')];
                                                    const sum = loanInputs.reduce((acc, input) => {
                                                        const val = input.getAttribute('data-value') || '0';
                                                        const num = parseFloat(val);
                                                        return !isNaN(num) ? acc + num : acc;
                                                    }, 0);
                                                    console.log("VALUES",res);
                                                    const obj = {
                                                        ...clientProceeds.clientProceed, 
                                                        balance_record : {
                                                            ...clientProceeds.clientProceed.balance_record,
                                                            final:res?.data?.balance_record?.final
                                                        }
                                                    }
                                                    clientProceeds.setClientProceed(obj);
                                                    clientProceeds.updateClientProceedsState();
                                                    setLoansLockValues([loansLockValues[0], sum])
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="s-verify" onClick={(e) => e.stopPropagation()}>
                                        <ChequeUpload entity={loan} panel={"loan"} pageId={page_id_click_record} documentType="verify" updateStates={updateLoansState} handleNoCheckShow={handleNoCheckShow} />
                                    </td>
                                    <td className="td-autosize check-request-td text-center" onClick={(e) => e.stopPropagation()}>
                                        <div className={`${ loansLocks[index]?.checkID?.cheque_number ? "check-class" : "d-flex justify-content-center" } `}>
                                            {
                                                ((!loansLocks[index].checkID && loansLocks[index].isFinalLocked && loansLocks[index].isFinalAmount != 0)) ? <div className="settle-check-request-btn btn" id="nomargin">
                                                    <RequestCheckButton onHandleClick={async() => {
                                                        try {
                                                            const res = await getPanelDetail("edit-case-loan","loan_id",loan?.id);
                                                            // If a check was already requested, show error
                                                            if (res) {
                                                                if (res?.data?.checkID?.date_check_requested) {
                                                                    setMsgError("Check has already been requested by another user. Close the popup to see the details.");
                                                                    handleLoanErrorShow();
                                                                } else {
                                                                    setMsgError(""); // Clear error if no request date found
                                                                    setCurrentLoan({...loan,final:loansLocks[index].isFinalAmount})
                                                                    updateLoansState()
                                                                    handleLoanCheckRequestShow()
                                                                    
                                                                }
                                                            } else {
                                                                setMsgError(""); // No checkID, so no error
                                                                setCurrentLoan({...loan,final:loansLocks[index].isFinalAmount})
                                                                updateLoansState()
                                                                handleLoanCheckRequestShow()
                                                                
                                                            }
                                                        } catch (error) {
                                                            setMsgError(""); // Optional: Or you can set a different error message
                                                            console.error("Error fetching request details:", error);
                                                            setCurrentLoan({...loan,final:loansLocks[index].isFinalAmount})
                                                            updateLoansState()
                                                            handleLoanCheckRequestShow()
                                                            
                                                        }

                                                    }} />
                                                    {/* <RequestCheckButton onHandleClick={() => {
                                                        setCurrentLoan({...loan,final:loansLocks[index].isFinalAmount})
                                                        updateLoansState()
                                                        handleLoanCheckRequestShow()
                                                    }} /> */}
                                                </div>
                                                    :
                                                    <>
                                                        <div className='d-flex justify-content-center'>
                                                            <span>{loansLocks[index].checkID?.cheque_date ? '' : loansLocks[index].checkID?.date_check_requested && <span className='requested-btn'>Requested:&nbsp;</span>}</span>
                                                            
                                                            <span>{formatDate(loansLocks[index].checkID?.cheque_date || loansLocks[index].checkID?.date_check_requested || '')}</span>
                                                        </div>
                                                    </>
                                            }
                                            {loansLocks[index]?.checkID?.cheque_number && <span className='d-inline-block check-number'>{loansLocks[index]?.checkID?.cheque_number}</span>}
                                            {loansLocks[index]?.checkID?.cheque_number && <ChequeUpload entity={loan} panel={"loan"} pageId={page_id_click_record} documentType="check_as_sent" updateStates={updateLoansState} handleNoCheckShow={handleNoCheckShow} />}
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {
                                loans?.length > 0 &&
                                <tr className="height-25">
                                    <td></td>
                                    <td className="height-25 text-capitalize text-right" colSpan={8}>
                                        <span className='whitespace-SETTLE primary-clr-25'>Total Loans:</span>
                                        <p className="d-inline-flex align-items-center height-25 monospace-font text-right font-weight-bold dollar-amount-value" data-value={loansFinalAmount || 0.00}>
                                            {currencyFormat(loansFinalAmount || 0.00)}
                                        </p>
                                    </td>
                                    <td className="s-draft monospace-font text-right" data-value={loansLockValues[0] || 0.00}>
                                        <span style={{ paddingRight: "2px" }} className='dollar-amount-value' data-value={loansLockValues[0] || 0.00}> {currencyFormat(loansLockValues[0] || 0.00)}</span>
                                    </td>
                                    <td className="s-final monospace-font text-right" data-value={loansLockValues[1] || 0.00}>
                                        <span style={{ paddingRight: "2px" }} className='dollar-amount-value' data-value={loansLockValues[1] || 0.00}> {currencyFormat(loansLockValues[1] || 0.00)}</span>
                                    </td>
                                    <td className="s-verify"></td>
                                    <td className="td-autosize check-request-td"></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <AttorneyLiens settlementObjProps={settlementObjProps} />
            <ClientProceeds clientProceeds={clientProceeds} settlementObjProps={settlementObjProps}/>
            <div className='m-b-5 m-t-5'>
                <tr className="height-25 total-settle-row">
                    <td className="height-25 text-capitalize text-right big-n-5 primary-clr-25" colSpan={8}>Total:</td>
                    <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value"
                        data-value={
                                    parseFloat(offersObj.offerFinalAmount || 0.00) -
                                    (parseFloat(clientProceeds.clientProceedFinalAmount || 0.00) + 
                                    parseFloat(feesObj.feesFinalAmount || 0.00) + 
                                    parseFloat(costsObj.costFinalAmount || 0.00) + 
                                    parseFloat(medicalBillFinalAmount || 0.00) + 
                                    parseFloat(insuranceLiensObj.insuranceLienFinalAmount || 0.00) + 
                                    parseFloat(otherLiensObj.otherLienFinalAmount || 0.00) + 
                                    parseFloat(loansFinalAmount || 0.00)) || "0.00"}>
                        {currencyFormat(
                            parseFloat(offersObj.offerFinalAmount || 0.00) -
                            (parseFloat(clientProceeds.clientProceedFinalAmount || 0.00) + 
                            parseFloat(feesObj.feesFinalAmount || 0.00) + 
                            parseFloat(costsObj.costFinalAmount || 0.00) + 
                            parseFloat(medicalBillFinalAmount || 0.00) + 
                            parseFloat(insuranceLiensObj.insuranceLienFinalAmount || 0.00) + 
                            parseFloat(otherLiensObj.otherLienFinalAmount || 0.00) + 
                            parseFloat(loansFinalAmount || 0.00)) || 0.00
                        )}
                    </td>

                    <td className="s-draft monospace-font text-right dollar-amount-value"
                        data-value={ 
                                    parseFloat(offersObj.offerLockValues[0] || 0.00) - 
                                    (parseFloat(clientProceeds.checksLocksValues[0] || 0.00) +
                                    parseFloat(feesObj.feesLockValues[0] || 0.00) + 
                                    parseFloat(costsObj.itemizedCost.chv_settle.draft1) + 
                                    parseFloat(medicalBillLockValues[0] || 0.00) + 
                                    parseFloat(insuranceLiensObj.insuranceLiensLocksValues[0] || 0.00) + 
                                    parseFloat(otherLiensObj.otherLiensLocksValues[0] || 0.00) + 
                                    parseFloat(loansLockValues[0] || 0.00)) || "0.00"}>
                        <span style={{ paddingRight: "2px" }}>
                            {currencyFormat(
                                parseFloat(offersObj.offerLockValues[0] || 0.00) - 
                                (parseFloat(clientProceeds.checksLocksValues[0] || 0.00) +
                                parseFloat(feesObj.feesLockValues[0] || 0.00) + 
                                parseFloat(costsObj.itemizedCost.chv_settle.draft1) + 
                                parseFloat(medicalBillLockValues[0] || 0.00) + 
                                parseFloat(insuranceLiensObj.insuranceLiensLocksValues[0] || 0.00) + 
                                parseFloat(otherLiensObj.otherLiensLocksValues[0] || 0.00) + 
                                parseFloat(loansLockValues[0] || 0.00)) || 0.00
                            )}
                        </span>
                    </td>

                    <td className="s-final monospace-font text-right dollar-amount-value"
                        data-value={ 
                                    parseFloat(offersObj.offerLockValues[1] || 0.00) - 
                                    (parseFloat(clientProceeds.checksLocksValues[1] || 0.00) +
                                    parseFloat(feesObj.feesLockValues[1] || 0.00) + 
                                    parseFloat(costsObj.itemizedCost.chv_settle.final) + 
                                    parseFloat(medicalBillLockValues[1] || 0.00) + 
                                    parseFloat(insuranceLiensObj.insuranceLiensLocksValues[1] || 0.00) + 
                                    parseFloat(otherLiensObj.otherLiensLocksValues[1] || 0.00) + 
                                    parseFloat(loansLockValues[1] || 0.00)) || "0.00"}>
                        <span style={{ paddingRight: "2px" }}>
                            {currencyFormat(
                                parseFloat(offersObj.offerLockValues[1] || 0.00) - 
                                (parseFloat(clientProceeds.checksLocksValues[1] || 0.00) +
                                parseFloat(feesObj.feesLockValues[1] || 0.00) + 
                                parseFloat(costsObj.itemizedCost.chv_settle.final) + 
                                parseFloat(medicalBillLockValues[1] || 0.00) + 
                                parseFloat(insuranceLiensObj.insuranceLiensLocksValues[1] || 0.00) + 
                                parseFloat(otherLiensObj.otherLiensLocksValues[1] || 0.00) + 
                                parseFloat(loansLockValues[1] || 0.00)) || 0.00
                            )}
                        </span>
                    </td>

                    <td className="s-verify"></td>
                    <td className="td-autosize check-request-td"></td>
                </tr>
            </div>
            { showSettlementPopup1 &&
                <GenericSettlementAddPopup 
                show={showSettlementPopup1}                 
                handleClose={()=>{
                setShowSettlementPopup1(false);
                }} 
                initialLabel={"Medical Provider Lien or Expense"}
                    {...settlementObjProps}
                />
            }
            { showSettlementPopup2 &&
                <GenericSettlementAddPopup 
                show={showSettlementPopup2}                 
                handleClose={()=>{
                setShowSettlementPopup2(false);
                }} 
                initialLabel={"Loan and Advance"}
                    {...settlementObjProps}
                />
            }
            <EditMedicalBills show={showMedBillModal} handleClose={handleMedBillClose} medicalBill={currentMedicalBill} setData={setMedicalBills} updateMedicalStates={updateMedicalBillsState} />
            <EditLoans show={showLoanModal} handleClose={handleLoanClose} loan={currentLoan} setData={setLoans} updateLoansState={updateLoansState} />
            <SettlementErrorModal show={showErrorModal} handleClose={handleErrorClose} errorMsg={errorMsg} updateStates={updateMedicalBillsState} />
            <SettlementErrorModal show={showErrorLoanModal} handleClose={handleLoanErrorClose} errorMsg={errorMsg} updateStates={updateLoansState} />
            <SettlementNoCheckModal show={showNoCheckModal} handleClose={handleNoCheckClose} />
            <SettlementCheckRequest show={showCheckRequestModal} handleClose={handleCheckRequestClose} panelLabel={"CaseProviders"} finalAmount={currentMedicalBill.final} panelName={"provider"} panelEntity={currentMedicalBill} updateStates={updateMedicalBillsState} />
            <SettlementCheckRequest show={showLoanCheckRequestModal} handleClose={handleLoanCheckRequestClose} panelLabel={"CaseLoans"} finalAmount={currentLoan?.final} panelName={"loans"} panelEntity={currentLoan} updateStates={updateLoansState} />
        </div>
    )
}

export default SettlementTable