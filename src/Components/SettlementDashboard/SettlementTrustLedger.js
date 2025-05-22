import React,{ useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import ChequeUpload from './ChequeUpload';
import { currencyFormat, formatDate } from '../../Utils/helper';
import SettlementEmptyTable from './SettlementEmptyTable';
import EditCheckModal from '../AccountsDashboard/EditCheckModal';
import SectionActionBar from './SectionActionBar';
import arrowUp from '../../../public/BP_resources/images/icon/arrow_up_simple.svg';
import arrowUpColored from '../../../public/BP_resources/images/icon/arrow_up_colored.svg';
import arrowDown from '../../../public/BP_resources/images/icon/arrow_down_simple.svg';
import arrowDownColored from '../../../public/BP_resources/images/icon/arrow_down_colored.svg';


const SettlementTrustLedger = ({TrustLedgerData}) => {
    const caseSummary = useSelector((state) => state?.caseData?.summary);
    const [currentCheck, setCurrentCheck] = useState();
    const [showModal, showEditCostModal] = useState(false);
    const [sorting, setSorting] = useState({ column: "", order: "asc" });
    const [sorting1, setSorting1] = useState({ column: "", order: "asc" });

    const handleSort = (columnName) => {
        setSorting(prev => ({
            column: columnName,
            order: prev.column === columnName && prev.order === "asc" ? "desc" : "asc",
        }));
    };
    const handleSort1 = (columnName) => {
        setSorting1(prev => ({
            column: columnName,
            order: prev.column === columnName && prev.order === "asc" ? "desc" : "asc",
        }));
    };
    const onHide = () => {
        showEditCostModal(false);
    };
    const { offerChecks,otherChecks, sortedTrustLedger, updateTrustLedger } = TrustLedgerData;

    const page_id_click_record = useSelector(
    (state) => state.page_id_click_record.page_id_click_record
    );

    const totalTrustDeposits = offerChecks?.reduce((acc,check)=>  parseFloat(acc) + parseFloat(check?.amount),0.00 )
    const totalOtherCheckAmount = otherChecks?.reduce((acc,check)=> parseFloat(acc) + parseFloat(check?.amount),0.00 )
    const balance = totalTrustDeposits - totalOtherCheckAmount;

    useEffect(()=>{
        sortedTrustLedger("offer_checks",sorting);
    },[sorting]);
    useEffect(()=>{
        sortedTrustLedger("other_checks",sorting1);
    },[sorting1]);
    return (
        <>
            <div className='m-b-5' style={{marginTop:"55px"}}>
            {/* <SectionActionBar sectionName={"Trust Account Deposits and Debits"} tab={"trust_ledger"} /> */}
            <div className="table--no-card rounded-0 border-0 w-100">
                <table className="table table-borderless table-striped table-earning settlement-table">
                    <thead className='position-sticky top-0 trust-ledger-table' style={{zIndex:2}}>
            
                        <tr id="settle-tb-header" className="settle-t-4 ">
                            <th class="td-autosize"></th>
                            <th className='td-autosize height-25' onClick={() => handleSort("date_requested")}>
                                <div class="d-flex align-items-center justify-content-center cursor-pointer">
                                    <span>Input</span>
                                    <div class="m-l-5 d-flex flex-column cursor-pointer">
                                        <img src={sorting.column=="date_requested" && sorting.order=="asc" ? arrowUpColored : arrowUp} className='ic ic-7'/>
                                        <img src={sorting.column=="date_requested" && sorting.order=="desc" ? arrowDownColored : arrowDown} className='ic ic-7'/>
                                    </div>
                                </div>
                            </th>
                            <th className='td-autosize height-25' onClick={() => handleSort("payee")}>
                                <div class="d-flex align-items-center justify-content-center cursor-pointer">
                                    <span>Payee</span>
                                    <div class="m-l-5 d-flex flex-column cursor-pointer">
                                        <img src={sorting.column=="payee" && sorting.order=="asc" ? arrowUpColored : arrowUp} className='ic ic-7'/>
                                        <img src={sorting.column=="payee" && sorting.order=="desc" ? arrowDownColored : arrowDown} className='ic ic-7'/>
                                    </div>
                                </div>
                            </th>
                            <th className='td-autosize height-25'>Check From</th>
                            <th>Memo</th>
                            <th className="td-autosize height-25 text-end" onClick={() => handleSort("amount")}>
                                <div class="d-flex align-items-center justify-content-end cursor-pointer">
                                    <span>Amount</span>
                                    <div class="m-l-5 d-flex flex-column cursor-pointer">
                                        <img src={sorting.column=="amount" && sorting.order=="asc" ? arrowUpColored : arrowUp} className='ic ic-7'/>
                                        <img src={sorting.column=="amount" && sorting.order=="desc" ? arrowDownColored : arrowDown} className='ic ic-7'/>
                                    </div>
                                </div>
                            </th>
                            <th className="td-autosize height-25 text-end">Balance</th>
                            <th className='td-autosize'>Verify</th>
                            <th className='text-center td-autosize height-25 tl-amount-checknum' colSpan={4}>Check As Sent</th>
                            <th className='text-center td-autosize height-25 tl-amount-checknum' colSpan={2}>Check Cleared</th>
                        </tr>
                    </thead>
                    <tbody id="body-table" className=''>
                        {(!offerChecks || offerChecks?.length == 0) && <SettlementEmptyTable tableName={"trust_ledger"} />}
                        {offerChecks?.length > 0 && offerChecks?.map((element,index)=>{
                            let balance = 0.00
                            if(index > 0){
                                offerChecks?.forEach((check,checkNum)=>{
                                    if( checkNum <= index )
                                        balance += parseFloat(check?.amount);
                                })
                            }
                            else{
                                balance = parseFloat(element?.amount)
                            }
                            return <React.Fragment>
                                <tr key={index} onClick={()=>{
                                    setCurrentCheck(element);
                                    showEditCostModal(true);
                                }}>
                                    <td class="td-autosize">{index + 1}</td>
                                    {/* <td className='td-autosize'>{element?.bank_account?.account_name}</td> */}
                                    <td className='td-autosize'>{formatDate(element?.date_requested)}</td>
                                    <td className='td-autosize'>{element?.payee}</td>
                                    <td className='td-autosize'>
                                        {
                                            element?.offer_checks[0]?.by_defendant?.defendantType?.name === "Private Individual" ? 
                                            `${element?.offer_checks[0]?.by_defendant?.first_name || ''} ${element?.offer_checks[0]?.by_defendant?.last_name || ''}` :
                                            `${element?.offer_checks[0]?.by_defendant?.entity_name || ''}`
                                        }
                                        {
                                            element?.offer_checks[0]?.by_insurance?.company?.company_name || ''
                                        }
                                    </td>
                                    <td>{element?.memo}</td>
                                    <td class="td-autosize monospace-font text-end dollar-amount-value" data-value={element?.amount || 0.00}>{currencyFormat(element?.amount)}</td>
                                    <td class="td-autosize monospace-font text-end dollar-amount-value" data-value={balance || 0.00}>{currencyFormat(balance)}</td>
                                    <td className="s-verify" onClick={(e)=>e.stopPropagation()}>
                                        <ChequeUpload entity={
                                            {
                                                id: element?.id,
                                                checkID:{
                                                    verify: element?.verify,
                                                    check_sent: element?.check_sent,
                                                    check_cleared: element?.check_cleared,
                                                }
                                            }
                                        } panel={"trust_ledger"} pageId={page_id_click_record} documentType="verify" updateStates={updateTrustLedger} handleNoCheckShow={()=>console.log("Verify")}/>
                                    </td>

                                    <td className="td-autosize monospace-font text-right dollar-amount-value" data-value={element?.amount || 0.00} onClick={(e)=>e.stopPropagation()}>{element?.entity_name === "Offer" ? currencyFormat(element?.amount) : ""}</td>
                                    <td className='td-autosize' onClick={(e)=>e.stopPropagation()}>
                                        <p style={{ fontSize: "14px", textAlign: "right" }}>{element?.cheque_number}</p>
                                    </td>
                                    <td className='td-autosize' onClick={(e)=>e.stopPropagation()}>{formatDate(element?.cheque_date)}</td>
                                    <td className='td-autosize' onClick={(e)=>e.stopPropagation()}>
                                                <ChequeUpload entity={
                                            {
                                                id: element?.id,
                                                checkID:{
                                                    verify: element?.verify,
                                                    check_sent: element?.check_sent,
                                                    check_cleared: element?.check_cleared,
                                                }
                                            }
                                        } panel={"trust_ledger"} width={"50px"} pageId={page_id_click_record} documentType="check_as_sent" updateStates={updateTrustLedger} handleNoCheckShow={()=>console.log("Check as Sent")}/>

                                    </td>
                                    <td className='td-autosize' onClick={(e)=>e.stopPropagation()}>
                                        <div className={`settle-cheque-date justify-content-center ${element?.cheque_date || element?.cleared_date ? "height-21" : ""}`}>{formatDate(element?.cleared_date)}</div>
                                    </td>
                                    <td className='td-autosize' onClick={(e)=>e.stopPropagation()}>
                                        <div className="d-flex flex-column justify-content-center align-items-center">
                                            <div>
                                            <ChequeUpload entity={
                                            {
                                                id: element?.id,
                                                checkID:{
                                                    verify: element?.verify,
                                                    check_sent: element?.check_sent,
                                                    check_cleared: element?.check_cleared,
                                                }
                                            }
                                        } panel={"trust_ledger"} width={"50px"} pageId={page_id_click_record} documentType="check cleared" updateStates={updateTrustLedger} handleNoCheckShow={()=>console.log("Check Cleared")}/>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                            }
                        )}
                        {/* {checks?.length > 0 && 
                                <tr>
                                    <td className="td-autosize height-25 text-end dollar-amount-value" data-value={balance || 0.00} colSpan={6}>
                                        <span style={{color:"var(--primary-25)"}}>Remaining:</span>
                                        <span className="td-autosize height-25 text-end monospace-font m-l-5" style={{color:`${!balance && balance==0.00 ? "var(--primary-25)" : "black" }`}} >{currencyFormat(balance)}</span>
                                    </td>
                                    <td className='' colSpan={7}></td>
                                </tr>
                        } */}
                        <tr>

                        </tr>
                        <tr>
                            <td className='action-bar-td' colSpan={15} style={{padding:"0px"}}>
                                <SectionActionBar sectionName={"Settlement Entries Not Deposited in Trust Account"} tab={"trust_ledger"} />
                            </td>
                        </tr>
                        <tr id="settle-tb-header" className="settle-t-4 ">
                            <th class="td-autosize"></th>
                            {/* <th class="td-autosize tl-case">Case</th> */}
                            {/* <th className='td-autosize height-25 tl-account'>Account</th> */}
                            <th className='td-autosize height-25' onClick={() => handleSort1("date_requested")}>
                                <div class="d-flex align-items-center justify-content-center cursor-pointer">
                                    <span>Input</span>
                                    <div class="m-l-5 d-flex flex-column cursor-pointer">
                                        <img src={sorting1.column=="date_requested" && sorting1.order=="asc" ? arrowUpColored : arrowUp} className='ic ic-7'/>
                                        <img src={sorting1.column=="date_requested" && sorting1.order=="desc" ? arrowDownColored : arrowDown} className='ic ic-7'/>
                                    </div>
                                </div>
                            </th>
                            <th className='td-autosize height-25' onClick={() => handleSort1("payee")}>
                                <div class="d-flex align-items-center justify-content-center cursor-pointer">
                                    <span>Payee</span>
                                    <div class="m-l-5 d-flex flex-column cursor-pointer">
                                        <img src={sorting1.column=="payee" && sorting1.order=="asc" ? arrowUpColored : arrowUp} className='ic ic-7'/>
                                        <img src={sorting1.column=="payee" && sorting1.order=="desc" ? arrowDownColored : arrowDown} className='ic ic-7'/>
                                    </div>
                                </div>
                            </th>
                            <th className='td-autosize height-25'>Check From</th>
                            <th>Memo</th>
                            <th className="td-autosize height-25 text-end" onClick={() => handleSort1("amount")}>
                                <div class="d-flex align-items-center justify-content-end cursor-pointer">
                                    <span>Amount</span>
                                    <div class="m-l-5 d-flex flex-column cursor-pointer">
                                        <img src={sorting1.column=="amount" && sorting1.order=="asc" ? arrowUpColored : arrowUp} className='ic ic-7'/>
                                        <img src={sorting1.column=="amount" && sorting1.order=="desc" ? arrowDownColored : arrowDown} className='ic ic-7'/>
                                    </div>
                                </div>
                            </th>
                            <th className="td-autosize height-25 text-end">Balance</th>
                            
                            <th className='td-autosize'>Verify</th>
                            {/* <th className='text-center td-autosize height-25 tl-amount-checknum'>Check Amount</th>
                            <th className='text-center td-autosize height-25 tl-amount-checknum'>Check #</th>

                            <th className='text-center td-autosize height-25 tl-amount-checknum'>Check Date</th> */}
                            <th className='text-center td-autosize height-25 tl-amount-checknum' colSpan={4}>Check As Sent</th>
                            {/* <th className='text-center td-autosize height-25 tl-amount-checknum'>Cleared Date</th> */}
                            <th className='text-center td-autosize height-25 tl-amount-checknum' colSpan={2}>Check Cleared</th>
                            {/* <th className="text-center td-autosize tl-check-sent">Sent</th>
                            <th className="text-center td-autosize tl-check-cleared">Cleared</th> */}
                        </tr>
                        
                        {(!otherChecks || otherChecks?.length == 0) && <SettlementEmptyTable tableName={"trust_ledger"} />}
                        {otherChecks?.length > 0 && otherChecks?.map((element,index)=>{
                            let balance = 0.00
                            if(index > 0){
                                otherChecks?.forEach((check,checkNum)=>{
                                    if( checkNum <= index )
                                        balance += parseFloat(check?.amount);
                                })
                            }
                            else{
                                balance = parseFloat(element?.amount)
                            }
                            return <React.Fragment>
                                <tr key={index} onClick={()=>{
                                    setCurrentCheck(element);
                                    showEditCostModal(true);
                                }}>
                                    <td class="td-autosize">{index + 1}</td>
                                    {/* <td className='td-autosize'>{element?.bank_account?.account_name}</td> */}
                                    <td className='td-autosize'>{formatDate(element?.date_requested)}</td>
                                    <td className='td-autosize'>{element?.payee}</td>
                                    <td className='td-autosize'>{caseSummary.for_client.created_by.office_name}</td>
                                    <td>{element?.memo}</td>
                                    <td class="td-autosize monospace-font text-end dollar-amount-value" data-value={element?.amount}>{currencyFormat(-Math.abs(element?.amount))}</td>
                                    <td class="td-autosize monospace-font text-end dollar-amount-value" data-value={balance || 0.00}>{currencyFormat(balance)}</td>
                                    <td className="s-verify" onClick={(e)=>e.stopPropagation()}>
                                        <ChequeUpload entity={
                                            {
                                                id: element?.id,
                                                checkID:{
                                                    verify: element?.verify,
                                                    check_sent: element?.check_sent,
                                                    check_cleared: element?.check_cleared,
                                                }
                                            }
                                        } panel={"trust_ledger"}  pageId={page_id_click_record} documentType="verify" updateStates={updateTrustLedger} handleNoCheckShow={()=>console.log("Verify")}/>
                                    </td>

                                    <td className="td-autosize monospace-font text-right dollar-amount-value" data-value={element?.amount || 0.00} onClick={(e)=>e.stopPropagation()}>{element?.entity_name === "Offer" ? currencyFormat(element?.amount) : ""}</td>
                                    <td className='td-autosize' onClick={(e)=>e.stopPropagation()}>
                                        <p style={{ fontSize: "14px", textAlign: "right" }}>{element?.cheque_number}</p>
                                    </td>
                                    <td className='td-autosize' onClick={(e)=>e.stopPropagation()}>{formatDate(element?.cheque_date)}</td>
                                    <td className='td-autosize' onClick={(e)=>e.stopPropagation()}>

                                                <ChequeUpload entity={
                                            {
                                                id: element?.id,
                                                checkID:{
                                                    verify: element?.verify,
                                                    check_sent: element?.check_sent,
                                                    check_cleared: element?.check_cleared,
                                                }
                                            }
                                        } panel={"trust_ledger"} width={"50px"} pageId={page_id_click_record} documentType="check_as_sent" updateStates={updateTrustLedger} handleNoCheckShow={()=>console.log("Check as Sent")}/>
                                    </td>
                                    <td className='td-autosize' onClick={(e)=>e.stopPropagation()}>
                                        <div className={`settle-cheque-date justify-content-center ${element?.cheque_date || element?.cleared_date ? "height-21" : ""}`}>{formatDate(element?.cleared_date)}</div>
                                    </td>
                                    <td className='td-autosize' onClick={(e)=>e.stopPropagation()}>
                                        <div className="d-flex flex-column justify-content-center align-items-center">
                                            <div>
                                            <ChequeUpload entity={
                                            {
                                                id: element?.id,
                                                checkID:{
                                                    verify: element?.verify,
                                                    check_sent: element?.check_sent,
                                                    check_cleared: element?.check_cleared,
                                                }
                                            }
                                        } panel={"trust_ledger"} width={"50px"} pageId={page_id_click_record} documentType="check cleared" updateStates={updateTrustLedger} handleNoCheckShow={()=>console.log("Check Cleared")}/>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        }
                        )}
                    </tbody>
                </table>
            </div>
            </div>
            {showModal && (
            <EditCheckModal
                onHide={onHide}
                isVisible={showModal}
                check={currentCheck}
                fetchAccountsData={updateTrustLedger}
            />
            )}
        </>
    )
}

export default SettlementTrustLedger