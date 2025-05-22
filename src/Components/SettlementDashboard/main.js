import React, { useEffect, useState } from 'react'
import ActionBarComponent from "../common/ActionBarComponent";
import SettlementTabs from './SettlementTabs';
import SettlementTable from './SettlementTable';
import SettlementOffers from './SettlementOffers';
import SettlementFees from './SettlementFees';
import NotesSectionDashboard from "../../Components/NotesSectionDashboard/main";
import useGetSettleHeaders from './hooks/useGetSettleHeaders';
import { currencyFormat } from '../../Utils/helper';
import useGetOfferCombinations from './hooks/useGetOfferCombinations';
import useGetOffers from './hooks/useGetOffers';
import AddOfferPopUp from '../Modals/AddOfferModal/AddOfferPopUp';
import AddLiens from '../Modals/AddLiens';
import SettlementTrustLedger from './SettlementTrustLedger';
import useGetTrustLedger from './hooks/useGetTrustLedger';
import useGetLiens from './hooks/useGetLiens';
import AddOtherLien from '../Modals/AddOtherLien';
import ClientProceedPopup from '../Modals/ClientProceedPopup';
import useGetClientProceeds from './hooks/useGetClientProceeds';
import AddCostReimburstmentPopUp from '../Modals/AddCostReimburstmentPopUp';
import useGetFees from './hooks/useGetFees';
import useGetMedicalBills from './hooks/useGetMedicalBills';
import useGetLoans from './hooks/useGetLoans';
import useGetOtherLiens from './hooks/useGetOtherLiens';
import useGetCosts from './hooks/useGetCosts';
import EditFeesPopup from '../Modals/EditFeesPopup';
import SettlementErrorModal from '../Modals/SettlementErrorModal';
import useGetCostsReimbursements from './hooks/useGetCostsReimbursements';
import useGetCaseInsurances from './hooks/useGetCaseInsurances';
import useGetGroupedOffers from './hooks/useGetGroupedOffers';
import GenericSettlementAddPopup from '../Modals/GenericSettlementAddPopup';
import offerTypesApi from './api/offerTypesApi';
import popupOffersApi from './api/popupOffersApi';
import acceptOffer from './api/acceptOffer';
import latestOffersApi from './api/latestOffersApi';
import useGetPartiesCombinations from './hooks/useGetPartiesCombinations';
import SettlementSummary from './SettlementSummary';


const SettlementDashboard = () => {
    const [settlementTab,setSettlementTab] = useState("settlement")
    const handleTabChange = (tab) =>{
        setSettlementTab(tab)
    }
    
    const {offerCombinations} = useGetOfferCombinations();
    const {partiesCombinations} = useGetPartiesCombinations();
    const clientProceeds = useGetClientProceeds();
    const offersObj = useGetOffers();
    const costsObj = useGetCosts();
    const feesObj = useGetFees();
    const medicalBillsObj = useGetMedicalBills();
    const insuranceLiensObj = useGetLiens();
    const otherLiensObj = useGetOtherLiens();
    const loansObj = useGetLoans();
    const trustLedgerData = useGetTrustLedger();
    const costsReimbursementsObj = useGetCostsReimbursements();
    const { insurances } = useGetCaseInsurances();
    const groupedOffersObj = useGetGroupedOffers();
    const [offerTypes, setOfferTypes] = useState([]);
    const [popupOffersData, setPopupOffersData] = useState([]);
    const [initialOffers, setInitialOffers] = useState([]);

    const [showSettlementPopup, setShowSettlementPopup] = useState(false);


    const tabsData = [
        {   id: "settlement", 
            label: "Settlement",
            onClick: () => handleTabChange("settlement"),
            className: settlementTab === "settlement" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
            background: settlementTab === "settlement" ? "var(--primary) !important" : "var(--primary-70) !important",
            rightHand:true,
            activeColor: 'white',
        },
        {   id: "summary", 
            label: "Summary", 
            onClick: () => handleTabChange("summary"),
            className: settlementTab === "summary" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
            background: settlementTab === "summary" ? "var(--primary) !important" : "var(--primary-70) !important",
            rightHand:true,
            activeColor: 'white',
        },
        {   id: "offers", 
            label: "Negotiations", 
            onClick: () => handleTabChange("offers"),
            className: settlementTab === "offers" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
            background: settlementTab === "offers" ? "var(--primary) !important" : "var(--primary-70) !important",
            rightHand:true,
            activeColor: 'white',
        },
        {   id: "fees", 
            label: "Fees", 
            onClick: () => handleTabChange("fees"),
            className: settlementTab === "fees" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
            background: settlementTab === "fees" ? "var(--primary) !important" : "var(--primary-70) !important",
            rightHand:true,
            activeColor: 'white',
        },
        {   id: "trust_ledger", 
            label: "Trust", 
            onClick: () => handleTabChange("trust_ledger"),
            className: settlementTab === "trust_ledger" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
            background: settlementTab === "trust_ledger" ? "var(--primary) !important" : "var(--primary-70) !important",
            rightHand:true,
            activeColor: 'white',
        },

        {   id: "create_item", 
            label: "Settlement Item", 
            span: <span className="font-weight-bold pr-2 text-gold">+ </span>,
            onClick: () => {
                setShowSettlementPopup(true)
            },
            className: settlementTab === "create_cost_reimburstment" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
            background: settlementTab === "create_cost_reimburstment" ? "var(--primary) !important" : "var(--primary-70) !important",
            leftHand:true,
            activeColor: 'white',
        },
        
    ];
    const fetchOfferTypes = async () => {
        try {
            const { data : types } = await offerTypesApi();
            const { data: offers } = await popupOffersApi();
            const { data: initialOffers } = await latestOffersApi();
            setOfferTypes(types);
            setPopupOffersData(offers);
            setInitialOffers(initialOffers);
        } catch (error) {
            console.error("Failed to fetch offer types or popup offers:", error);
        }
    };
    const settlementObjProps = {
        addOfferObj: {
            show: showSettlementPopup,
            updateClientProceedStates: clientProceeds.updateClientProceedsState,
            updateFeesState: feesObj.updateFeesState,
            updateOffersState: offersObj.updateOffersState,
            offerCombinations: offerCombinations,
            partiesCombinations: partiesCombinations,
            updateGroupedOffersState: groupedOffersObj.updateGroupedOffersState,
            types: offerTypes,
            itemName: "Offer",
        },
        generateCheckObj: {
            show: showSettlementPopup,
            acceptedOffers: popupOffersData,
            updateClientProceedStates: clientProceeds.updateClientProceedsState,
            updateFeesState: feesObj.updateFeesState,
            updateOffersState: offersObj.updateOffersState,
            updateGroupedOffersState: groupedOffersObj.updateGroupedOffersState,
            updateTrustLedger: trustLedgerData.updateTrustLedger,
            itemName: "Check",
        },
        counterOfferObj: {
            show: showSettlementPopup,
            initialOffers: initialOffers,
            types: offerTypes,
            updateClientProceedStates: clientProceeds.updateClientProceedState,
            offerCombinations: offerCombinations,
            updateFeesState: feesObj.updateFeesState,
            updateOffersState: offersObj.updateOffersState,
            updateGroupedOffersState: groupedOffersObj.updateGroupedOffersState,
            itemName: "Counter Offer",
        },
        addFeeObj: {
            show: showSettlementPopup,
            initialOffers: initialOffers,
            updateClientProceedStates: clientProceeds.updateClientProceedsState,
            feesCombinations: feesObj.feesCombinationList,
            feesPercentages: feesObj.feesPercentages,
            updateFeesState: feesObj.updateFeesState,
            itemName: "Fee",
        },
        addInsuranceLienObj: {
            show: showSettlementPopup,
            insurances,
            updateLienStates: insuranceLiensObj.updateLiensStates,
            hi_paid_total: medicalBillsObj.medicalBills?.reduce(
            (acc, medBill) => parseFloat(acc) + parseFloat(medBill?.ins_paid),
            0.0
            ) || 0.0,
            medpay_total: medicalBillsObj.medicalBills?.reduce(
            (acc, medBill) => parseFloat(acc) + parseFloat(medBill?.medpaypaip),
            0.0
            ) || 0.0,
            itemName: "Insurance",
        },
        addClientProceedObj: {
            show: showSettlementPopup,
            updateClientProceedStates: clientProceeds.updateClientProceedsState,
            total_settlement: offersObj.offerFinalAmount,
            amount_after_lien_deductions: clientProceeds.clientProceed.working,
            clientProceeds,
            itemName: "Client Proceed Check",
        },
        addCostReimburseObj: {
            show: showSettlementPopup,
            costsReimbursements:costsReimbursementsObj.costsReimbursements,
            costReimbursementsFinalAmount:costsReimbursementsObj.costReimbursementsFinalAmount,
            costFinalAmount:costsObj.costFinalAmount,
            updateStates: costsReimbursementsObj.updateCostsReimbursementsState,
            itemName: "Cost Reimbursement",
        },
        addOtherLienObj: {
            updateOtherLiensStates: otherLiensObj.updateOtherLiensStates,
            updateClientProceedStates: clientProceeds.updateClientProceedsState,
        },
        addMedicalProviderObj:{
            show: showSettlementPopup,
            updateMedicalBillsState:medicalBillsObj.updateMedicalBillsState
        }
        };
    useEffect(() => {
        fetchOfferTypes();
    }, [showSettlementPopup]);
    return (
        <>
            <div className="top-panel-wrapper"></div>
            <div className="main-content settle-content-div" style={{paddingTop:"169.4px"}}>
                
                <ActionBarComponent
                isChecklist={true}
                src="/BP_resources/images/icon/settlement-icon-color.svg"
                page_name="Settlement"
                />
                <div id='parent-settle'>
                    <div className='position-relative'>
                        <div className='position-fixed w-100' style={{height:"55px",background:"#fff",top:"164.4px",zIndex:99}}></div>
                        <div className='settle-main-head position-fixed w-100'  style={{top:"169.4px",zIndex:99999}}>
                            <SettlementTabs settlementTab={settlementTab} handleTabChange={handleTabChange} tabsData={tabsData} />
                            <div className="litigation-sec-action-bar">
                                <div className="w-100" style={{ height: "25px", marginBottom: "5px" }}>
                                    <div className="d-flex justify-content-center align-items-center height-25" style={{gap:"18px"}}>
                                    {settlementTab === "settlement" ? <>
                                
                                        <span className='primary-clr-25'>Demanded: <span className="monospace-font font-weight-600 color-white">{offersObj.offerFinalAmount ? currencyFormat(offersObj.offerFinalAmount) : `$ 0.00`}</span></span>
                                        <span className='primary-clr-25'>Recovery: <span className=" monospace-font font-weight-600 color-white">{offersObj.offerLockValues[1] ? currencyFormat(offersObj.offerLockValues[1]) : `$ 0.00`}</span></span>
                                        <span className='primary-clr-25'>Fees: <span className="monospace-font font-weight-600 color-white">{feesObj.feesFinalAmount ? currencyFormat(feesObj.feesFinalAmount) : `$ 0.00`}</span></span>
                                        <span className='primary-clr-25'>Client Proceeds: <span className="monospace-font font-weight-600 color-white">{clientProceeds.clientProceed.working ? currencyFormat(clientProceeds.clientProceed.working): `$ 0.00`}</span></span>
                                        <span className='primary-clr-25'>Medical Bills: <span className="monospace-font font-weight-600 color-white">{medicalBillsObj.medicalBillFinalAmount ? currencyFormat(medicalBillsObj.medicalBillFinalAmount): `$ 0.00`}</span></span>
                                        <span className='primary-clr-25'>Insurance Liens: <span className="monospace-font font-weight-600 color-white">{insuranceLiensObj.insuranceLienFinalAmount ? currencyFormat(insuranceLiensObj.insuranceLienFinalAmount): `$ 0.00`}</span></span>
                                        <span className='primary-clr-25'>Other Liens: <span className="monospace-font font-weight-600 color-white">{otherLiensObj.otherLienFinalAmount ? currencyFormat(otherLiensObj.otherLienFinalAmount): `$ 0.00`}</span></span>
                                        <span className='primary-clr-25'>Loans and Advances: <span className="monospace-font font-weight-600 color-white">{loansObj.loansFinalAmount ? currencyFormat(loansObj.loansFinalAmount): `$ 0.00`}</span></span>
                                
                                    </> :
                                    <span className="text-center d-flex justify-content-center align-items-center text-uppercase color-white font-weight-bold height-25 p-t-0 p-b-0">{tabsData.find(tab=>tab.id === settlementTab).label === "Trust Ledger" ? "Trust Account Deposits and Debits" : tabsData.find(tab=>tab.id === settlementTab).label}</span>
                                }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {settlementTab === "settlement" && 
                        <SettlementTable 
                            clientProceeds={clientProceeds} 
                            offersObj={offersObj} 
                            feesObj={feesObj} 
                            costsObj={costsObj} 
                            medicalBillsObj={medicalBillsObj}
                            insuranceLiensObj={insuranceLiensObj}
                            otherLiensObj={otherLiensObj}
                            loansObj={loansObj}
                            trustLedgerObj={trustLedgerData}
                            costsReimbursementsObj={costsReimbursementsObj}
                            offerCombinations={offerCombinations}
                            updateGroupedOffersState={groupedOffersObj.updateGroupedOffersState}
                            settlementObjProps={settlementObjProps}
                            initialOffers={initialOffers}
                        />
                        }
                        {settlementTab === "offers" && <SettlementOffers offersObj={offersObj} groupedOffersObj={groupedOffersObj} trustLedgerObj={trustLedgerData} updateClientProceedStates={clientProceeds.updateClientProceedsState} updateFeesState={feesObj.updateFeesState} offerCombinations={offerCombinations} />}
                        {settlementTab === "fees" && <SettlementFees feesObj={feesObj} />}
                        {settlementTab === "trust_ledger" && <SettlementTrustLedger TrustLedgerData={trustLedgerData} />}
                        {settlementTab === "summary" && 
                            <SettlementSummary
                                clientProceeds={clientProceeds} 
                                offersObj={offersObj} 
                                feesObj={feesObj} 
                                costsObj={costsObj} 
                                insuranceLiensObj={insuranceLiensObj}
                                otherLiensObj={otherLiensObj}
                            />
                        }
                    </div>
                    <NotesSectionDashboard />
                </div>
            
            </div>

            {
            showSettlementPopup && <GenericSettlementAddPopup 
                show={showSettlementPopup}                 
                handleClose={()=>{
                setSettlementTab("settlement");
                setShowSettlementPopup(false);
                }} 
                initialLabel={"Select a new Settlement Item"}
                {...settlementObjProps}
            />}
            {/* <AddOfferPopUp 
                show={showOfferPopup}  
                handleClose={()=>{
                    setSettlementTab("settlement");
                    setShowOfferPopup(false);
                }}  
                updateClientProceedStates={clientProceeds.updateClientProceedsState}
                updateFeesState={feesObj.updateFeesState}
                updateOffersState={offersObj.updateOffersState}
                offerCombinations={offerCombinations} 
                updateGroupedOffersState={groupedOffersObj.updateGroupedOffersState}
                addOfferObj = {
                    {
                        show,
                        updateClientProceedStates: clientProceeds.updateClientProceedsState,
                        updateFeesState: feesObj.updateFeesState,
                        updateOffersState: offersObj.updateOffersState,
                        offerCombinations: offerCombinations ,
                        updateGroupedOffersState: groupedOffersObj.updateGroupedOffersState,
                    }
                }
                /> */}
            {/* { offersObj.offersCount > 0 ?           
                <EditFeesPopup 
                    action={"ADD"}
                    handleClose={()=>{
                        setSettlementTab("settlement");
                        setShowFeePopup(false);
                    }}  
                    feesPercentages={feesObj.feesPercentages}
                    feesCombinationList={feesObj.feesCombinationList}
                    updateFeesState={feesObj.updateFeesState}
                    show={showFeePopup}
                    fee={{}}
                /> :
                <SettlementErrorModal show={showErrorPopup} handleClose={()=>setShowErrorPopup(false)} errorMsg={"You can't add a fee without an offer."}  />
            }
            <AddLiens
                show={showLienPopup}  
                handleClose={()=>{
                    setSettlementTab("settlement");
                    setShowLienPopup(false);
                }}  
                insurances={insurances}
                updateLienStates={insuranceLiensObj.updateLiensStates} 
                hi_paid_total={medicalBillsObj.medicalBills.reduce((acc,medBill)=>parseFloat(acc) + parseFloat(medBill?.ins_paid),0.00)}
                medpay_total={medicalBillsObj.medicalBills.reduce((acc,medBill)=>parseFloat(acc) + parseFloat(medBill?.medpaypaip),0.00)}
            />
            <AddOtherLien
                show={showOtherLein}  
                handleClose={()=>{
                setSettlementTab("settlement");
                setShowOtherLienPopup(false);
                }} 
            />
            <ClientProceedPopup
                show={showClientProceedPopup}  
                updateClientProceedStates={clientProceeds.updateClientProceedsState}
                action={"ADD"}
                check={{}}
                handleClose={()=>{
                setSettlementTab("settlement");
                setShowClientProceedPopup(false);
                }}
            />
            <AddCostReimburstmentPopUp
                action={"ADD"}
                costReimburse={{}}
                show={showCostPopup}  
                handleClose={()=>{
                setSettlementTab("settlement");
                setShowCostPopup(false);
                }} 
                updateStates={costsReimbursementsObj.updateCostsReimbursementsState}
            /> */}


            
        </>
        
    )
}

export default SettlementDashboard