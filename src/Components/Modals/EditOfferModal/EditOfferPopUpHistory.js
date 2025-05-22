import React from 'react'
import { currencyFormat, formatDate } from '../../../Utils/helper';
import checkMark from '../../../../public/BP_resources/images/icon/checkmark.svg';
import closeMark from '../../../../public/BP_resources/images/icon/closemark.svg';
import makeDeposit from '../../SettlementDashboard/api/makeDeposit';

const EditOfferPopUpHistory = ({offer,formik,currentTab,checks,handleChangeChecks, setCurrentCheck,check}) => {
    
    if (!offer || Object.keys(offer).length === 0) {
        return null; // or show a loading spinner
    }
    let index1 = 1;
    let index2 = 1;
    const offerAmount = offer?.offer_type.name ==="Demand" ? offer?.demand || 0.00 : offer?.amount || 0.00;
    const checkAmountsDepositTotal = checks?.reduce((acc,check) => check?.deposit ? parseFloat(acc) + parseFloat(check?.amount || 0.00) : parseFloat(acc),0);
    const checkAmountsNotDepositTotal = checks?.reduce((acc,check) => !check?.deposit ? parseFloat(acc) + parseFloat(check?.amount || 0.00) : parseFloat(acc),0);

    let date = formatDate(offer.date);;
    const expiration = formatDate(offer.expiration_date);
    const by = offer.by_entity_client ? `${offer.by_entity_client.first_name || ''} ${offer.by_entity_client.last_name || ''}` : 
    
            offer?.by_defendant?.defendantType?.name === "Private Individual" ? 
            `${offer?.by_defendant?.first_name || ''} ${offer?.by_defendant?.last_name || ''}` :
            `${offer?.by_defendant?.entity_name || ''}`

    const party = offer.entity_client ? `${offer.entity_client.first_name || ''} ${offer.entity_client.last_name || ''}` : 
    
            offer?.defendant?.defendantType?.name === "Private Individual" ? 
            `${offer?.defendant?.first_name || ''} ${offer?.defendant?.last_name || ''}` :
            `${offer?.defendant?.entity_name || ''}`
    const insurance = offer.insurance ? offer.insurance?.company || '' : '';
    const offerType = offer.offer_type ? offer.offer_type.name : '';
    const note = offer.note || '';
    const demanded = offer.demand ? currencyFormat(offer.demand) : '';
    const offered = offer.amount ? currencyFormat(offer.amount) : '';
    return (
        <div style={{margin:"0px -5px"}}>
            <div className="litigation-sec-action-bar">
                <div className="w-100 height-25" style={{ height: "25px" }}>
                    <div className="d-flex justify-content-center align-items-center height-25">
                        <span className='text-uppercase m-l-5 text-white font-weight-bold text-center'>Offer History</span>
                    </div>
                </div>
            </div>
            <div className='table--no-card rounded-0 border-0 w-100'>
                <table id="edit-offer-popup-offer-history-table" class="table table-borderless table-striped table-earning settlement-table">
                    <thead>
                    <tr id="settle-tb-header">
                        
                        <th className='text-center p-l-5 p-r-5'>By</th>
                        <th className='text-center p-l-5 p-r-5' colSpan={2}>To</th>
                        <th className="td-autosize p-l-5 p-r-5">Date</th>
                        <th className="td-autosize p-l-5 p-r-5">Expires</th>
                        <th className='p-l-5 p-r-5 td-autosize text-center' colSpan={2}>Accepted</th>
                        {/* <th className='p-l-5 p-r-5 s-offer-date'>Check Date</th> */}
                        <th class="p-l-5 p-r-5 text-right td-autosize">Amount</th>
                        {/* <th class=" p-l-5 p-r-5s-demand text-right">Offered</th> */}
                        {/* <th className='p-l-5 p-r-5'>TD</th> */}
                    </tr>
                    </thead>
                    <tbody id="body-table">
                        <tr className='height-25' style={{height:"25px"}}>
                            
                            <td class="text-center height-25 p-l-5 p-r-5 color-black">{by}</td>
                            <td class="text-center height-25 p-l-5 p-r-5">{party}</td>
                            <td class="text-center height-25 p-l-5 p-r-5">{insurance}</td>
                            <td class="s-offer-date td-autosize height-25 p-l-5 p-r-5">{date}</td>
                            <td class="s-offer-date td-autosize height-25 p-l-5 p-r-5">{expiration}</td>
                            <td class="td-autosize height-25 p-l-5 p-r-5">{offer?.checks[0]?.check_number}</td>
                            <td class="td-autosize height-25 p-l-5 p-r-5">{ formatDate(offer?.accepted_date)}</td>
                            
                            <td class="monospace-font height-25 p-l-5 p-r-5 text-right td-autosize">{demanded}</td>
                            {/* <td class="s-demand monospace-font height-25 p-l-5 p-r-5 text-right">{offered}</td> */}
                            {/* <td className="height-25 p-l-5 p-r-5 text-center">
                                <input
                                type="checkbox"
                                name="mark_deposit"
                                checked={formik.values.mark_deposit === "on"}
                                onChange={(e) =>
                                    formik.setFieldValue("mark_deposit", e.target.checked ? "on" : "off")
                                }

                                />
                            </td> */}
                        </tr>
                    
                    </tbody>
                </table>
            </div>

            {
            <>
                <div className="litigation-sec-action-bar m-t-5">
                    <div className="w-100 height-25" style={{ height: "25px" }}>
                        <div className="d-flex justify-content-center align-items-center height-25">
                            <span className='text-uppercase m-l-5 text-white font-weight-bold text-center'>Settlement Checks for Deposit in to the Trust</span>
                        </div>
                    </div>
                </div>
                <div className='table--no-card rounded-0 border-0 w-100 trust-deposit-table'>
                    <table id="edit-offer-popup-checks-table position-relative" class="trust-deposit-table table table-borderless table-striped table-earning settlement-table">
                        <thead className='position-sticky top-0'>
                        <tr id="settle-tb-header">
                            <th style={{width:"28px"}}></th>
                            <th className='p-l-5 p-r-5'>By</th>
                            {/* <th className='p-l-5 p-r-5' colSpan={2}>To</th> */}
                            <th className='p-l-5 p-r-5'>Payee</th>
                            <th className='p-l-5 p-r-5'>TD</th>
                            <th className='p-l-5 p-r-5'>Number</th>
                            <th className='p-l-5 p-r-5 text-right'>Amount</th>
                            <th className='p-l-5 p-r-5'>Date</th>
                            
                    
                        </tr>
                        </thead>
                        <tbody id="body-table">
                        {checks?.length > 0 && checks?.map(element=>{
                            return (
                        (   element?.deposit && 
                            <tr style={{height:"25px",background:element?.id === check?.id && "var(--primary-50)",cursor:"pointer"}} onClick={()=>{
                                setCurrentCheck(element)
                            }}>
                                <td style={{width:"28px"}}>{ index2++ }</td>
                                <td class="s-offer-by td-autosize height-25 p-l-5 p-r-5">{by} {insurance}</td>
                                {/* <td class="height-25 p-l-5 p-r-5">{party}</td>
                                <td class="height-25 p-l-5 p-r-5">{insurance}</td> */}
                                <td class="height-25 p-l-5 p-r-5">{element?.payee}</td>
                                <td className="height-25 p-l-5 p-r-5 text-center">  
                                    {
                                    element?.deposit ? 
                                    <img className='ic ic-25'  src={checkMark} />
                                    :
                                    ""
                                    }                               
                                    
                                </td>
                                <td className="text-center td-autosize">{element?.cheque_number && <span className='d-inline-block check-number'>{element?.cheque_number}</span>}</td>
                                <td className="text-right td-autosize monospace-font">{currencyFormat(element?.amount)}</td>
                                <td className="text-center td-autosize">{element?.cheque_date && <span>{formatDate(element?.cheque_date)}</span>}</td>
                                
                            </tr>
                        ))
                        })
                        }
                            <tr >
                                <td className='text-end' colSpan={6}>Settlement Remaining For Assignment:</td>                
                                <td className="text-right td-autosize monospace-font" data-value={(offerAmount || 0.00 - checkAmountsDepositTotal || 0.00) || 0.00}>{currencyFormat(offerAmount || 0.00 - checkAmountsTotal || 0.00) || 0.00}</td>
                            </tr>
                            {
                                checks?.filter(check=>check.deposit)?.length < 6 && Array(6 - checks?.filter(check=>check.deposit)?.length).fill(null).map((_, index) => (
                                    <tr key={index}>
                                        <td colSpan={7}></td>
                                    </tr>
                                ))
                            }
                    
                        </tbody>
                    </table>
                </div>
            </>
            }
            {
            <>
                <div className="litigation-sec-action-bar m-t-5">
                    <div className="w-100 height-25" style={{ height: "25px" }}>
                        <div className="d-flex justify-content-center align-items-center height-25">
                            <span className='text-uppercase m-l-5 text-white font-weight-bold text-center'>Settlement Checks that are not for Deposit to the Trust</span>
                        </div>
                    </div>
                </div>
                <div className='table--no-card rounded-0 border-0 w-100 trust-deposit-table'>
                    <table id="edit-offer-popup-checks-table position-relative" class="table table-borderless table-striped table-earning settlement-table">
                        <thead className='position-sticky top-0'>
                        <tr id="settle-tb-header">
                            <th style={{width:"28px"}}></th>
                            <th className='p-l-5 p-r-5'>By</th>
                            {/* <th className='p-l-5 p-r-5' colSpan={2}>To</th> */}
                            <th className='p-l-5 p-r-5'>Payee</th>
                            <th className='p-l-5 p-r-5'>TD</th>
                            <th className='p-l-5 p-r-5'>Number</th>
                            <th className='p-l-5 p-r-5 text-right'>Amount</th>
                            <th className='p-l-5 p-r-5'>Date</th>
                            
                    
                        </tr>
                        </thead>
                        <tbody id="body-table">
                        {checks?.length > 0 && checks?.map(element=>{

                            return (
                        (   
                            !element?.deposit &&
                            <tr style={{height:"25px",background:element?.id === check?.id && "var(--primary-50)",cursor:"pointer"}} onClick={()=>{
                                setCurrentCheck(element)
                            }}>
                                <td style={{width:"28px"}}>{ index1++ }</td>
                                <td class="s-offer-by td-autosize height-25 p-l-5 p-r-5">{by} {insurance}</td>
                                {/* <td class="height-25 p-l-5 p-r-5">{party}</td>
                                <td class="height-25 p-l-5 p-r-5">{insurance}</td> */}
                                <td class="height-25 p-l-5 p-r-5">{element?.payee}</td>
                                <td className="height-25 p-l-5 p-r-5 text-center">  
                                    {
                                    element?.deposit ? 
                                    <img className='ic ic-25'  src={checkMark} />
                                    :
                                    ""
                                    }                               
                                    
                                </td>
                                <td className="text-center td-autosize">{element?.cheque_number && <span className='d-inline-block check-number'>{element?.cheque_number}</span>}</td>
                                <td className="text-right td-autosize monospace-font">{currencyFormat(element?.amount)}</td>
                                <td className="text-center td-autosize">{element?.cheque_date && <span>{formatDate(element?.cheque_date)}</span>}</td>
                                
                            </tr>
                    
                        ))
                        })
                        }
                            <tr >
                                <td className='text-end' colSpan={6}>Settlement Remaining For Assignment:</td>                
                                <td className="text-right td-autosize monospace-font" data-value={(offerAmount || 0.00 - checkAmountsNotDepositTotal || 0.00) || 0.00}>{currencyFormat(offerAmount || 0.00 - checkAmountsTotal || 0.00) || 0.00}</td>
                            </tr>
                            {
                                checks?.filter(check=>!check.deposit)?.length < 6 && Array(6 - checks?.filter(check=>!check.deposit)?.length).fill(null).map((_, index) => (
                                    <tr key={index}>
                                        <td colSpan={7}></td>
                                    </tr>
                                ))
                            }
                    
                        </tbody>
                    </table>
                </div>
            </>
            }
    </div>
    )
}

export default EditOfferPopUpHistory