import React, { useEffect, useState } from 'react';
import { currencyFormat, formatDate } from '../../Utils/helper';
import CurrentUserInfo from './common/CurrentUserInfo';
import EditOfferPopUp from '../Modals/EditOfferModal/EditOfferPopUp';
import SectionActionBar from './SectionActionBar';

const SettlementOffers = ({offersObj,updateClientProceedStates,updateFeesState, trustLedgerObj, offerCombinations, groupedOffersObj}) => {
    const { updateTrustLedger } = trustLedgerObj;
    const {groupedOffers,updateGroupedOffersState} = groupedOffersObj;
    const {
        offers,
        showOfferModal, handleOfferClose,
        handleOfferShow, 
        currentOffer, setCurrentOffer,
        updateOffersState
    } = offersObj;
    return (
    <>
        <div style={{marginTop:"55px"}}>
            {    
            <>
                {offers.length > 0 && groupedOffers.map((group,parentIndex)=>{ 
                        let initialOffer = group?.offers_list?.slice().reverse()[0];
                        const by = initialOffer.by_entity_client ? `${initialOffer.by_entity_client.first_name || ''} ${initialOffer.by_entity_client.last_name || ''}` : 
                                initialOffer?.by_defendant?.defendantType?.name === "Private Individual" ? 
                                `${initialOffer?.by_defendant?.first_name || ''} ${initialOffer?.by_defendant?.last_name || ''}` :
                                `${initialOffer?.by_defendant?.entity_name || ''}`
                    
                        const party = initialOffer.entity_client ? `${initialOffer.entity_client.first_name || ''} ${initialOffer.entity_client.last_name || ''}` : 
                                initialOffer?.defendant?.defendantType?.name === "Private Individual" ? 
                                `${initialOffer?.defendant?.first_name || ''} ${initialOffer?.defendant?.last_name || ''}` :
                                `${initialOffer?.defendant?.entity_name || ''}`
                        return  <React.Fragment>
                        {parentIndex == 0 && <SectionActionBar sectionName={`${initialOffer?.offer_type?.name} from ${by} to ${party}, ${initialOffer.insurance?.company}`} />}
                        {parentIndex == 0 &&
                            <div className="table--no-card rounded-0 border-0 w-100 m-b-5">
                            <table className="table table-borderless table-striped table-earning settlement-table">
                                <thead>
                                    <tr id="settle-tb-header" className="settle-t-4">
                                        <th></th>
                                        <th className="s-offer-date">Initiated</th>
                                        <th>Input</th>
                                        {/* <th>By</th> */}
                                        <th colSpan={3}>Party</th>
                                        {/* <th>Insurance</th> */}
                                        <th>Offer Type</th>
                                        <th className="big-n-1">Note</th>
                                        <th className="s-offer-date">Expires</th>
                                        <th className="td-autosize text-end">Initial</th>
                                        <th className="text-end td-autosize">Counter</th>
                                    </tr>
                                </thead>
                                <tbody id="body-table" className='group-offer-table'>
                                    {
                                        group?.offers_list.slice().reverse().map((offer,index) =>
                                            <tr key={index}  onClick={()=>{
                                                setCurrentOffer(offer);
                                                handleOfferShow();
                                            }}>
                                                <td className="td-autosize">{index + 1}</td>
                                                <td className="s-offer-date">
                                                    {/* {offer.offer_type.name === 'Offer' && (
                                                        formatDate(offer.date)
                                                    )}
                                                    {offer.offer_type.name === 'Demand' && (
                                                        formatDate(offer.demand_date_sent)
                                                    )}
                                                    {offer.offer_type.name === 'Mediation' && (
                                                        formatDate(offer.mediation_date)
                                                    )}
                                                    {offer.offer_type.name === 'Settlement Conference' && (
                                                        formatDate(offer.settlement_conference_date)
                                                    )} */}
                                                    {formatDate(offer?.date)}
                                                </td>
                                                <td className="td-autosize">
                                                    <CurrentUserInfo id={offer.firm_user} />
                                                </td>
                                                <td className="td-autosize">
                                                    {
                                                        offer.by_defendant ?  offer?.by_defendant?.defendantType?.name === "Private Individual" ? 
                                                            `${offer?.by_defendant?.first_name || ''} ${offer?.by_defendant?.last_name || ''}` :
                                                            `${offer?.by_defendant?.entity_name || ''}` : `${ offer.by_entity_client?.first_name } ${ offer.by_entity_client?.last_name }`
                                                    }
                                                    {/* { offer.by_defendant ? 
                                                    <span>{ offer.by_defendant?.first_name } { offer.by_defendant?.last_name }</span>  :     
                                                    <span>{ offer.by_entity_client?.first_name } { offer.by_entity_client?.last_name }</span>                                             
                                                    } */}
                                                </td>
                                                <td className="td-autosize">
                                                    {
                                                        offer?.defendant ?  offer?.defendant?.defendantType?.name === "Private Individual" ? 
                                                            `${offer?.defendant?.first_name || ''} ${offer?.defendant?.last_name || ''}` :
                                                            `${offer?.defendant?.entity_name || ''}` : `${ offer.entity_client?.first_name } ${ offer.entity_client?.last_name }`
                                                    }
                                                </td>
                                                <td className="td-autosize">
                                                    { offer?.insurance &&
                                                        <span>{ offer.insurance?.company }</span>  
                                                    }
                                                </td>
                                                <td className="td-autosize">{index == 0 ? "Initial " : ""} { offer.offer_type.name }</td>
                                                <td className=" text-capitalize big-n-1">{offer.note}</td>
                                                <td className="s-offer-date">{formatDate(offer.expiration_date)}</td>
                                                <td className="td-autosize monospace-font text-end whitespace-SETTLE dollar-amount-value" data-value={offer?.demand || 0}>
                                                    {/* {  offer?.offer_type?.name == 'Demand' &&
                                                        currencyFormat(offer.demand)
                                                    } */}
                                                    {/* {  offer?.offer_type?.name == 'Demand' && offer?.counter_offer_amount == 0 &&
                                                        currencyFormat(offer.demand)
                                                    } */}
                                                    { index === 0 && currencyFormat(offer?.demand)}
                                                </td>
                                                <td className="monospace-font td-autosize text-end whitespace-SETTLE dollar-amount-value" data-value={offer?.demand || 0}>
                                                    {/* {  offer?.offer_type?.name == 'Offer' && offer?.counter_offer_amount == 0 &&
                                                        currencyFormat(offer?.amount) 
                                                    } */}
                                                    {/* {  offer?.offer_type?.name == 'Offer' &&
                                                        currencyFormat(offer?.amount) 
                                                    } */}
                                                    { index > 0 && currencyFormat(offer?.demand) }
                                                </td>
                                            </tr>
                                    )}
                                
                                {
                                groupedOffers.map((group,parentIndex)=>{ 
                                    let initialOffer = group?.offers_list?.slice().reverse()[0];
                                    const by = initialOffer.by_entity_client ? `${initialOffer.by_entity_client.first_name || ''} ${initialOffer.by_entity_client.last_name || ''}` : 
                                            initialOffer?.by_defendant?.defendantType?.name === "Private Individual" ? 
                                            `${initialOffer?.by_defendant?.first_name || ''} ${initialOffer?.by_defendant?.last_name || ''}` :
                                            `${initialOffer?.by_defendant?.entity_name || ''}`
                                
                                    const party = initialOffer.entity_client ? `${initialOffer.entity_client.first_name || ''} ${initialOffer.entity_client.last_name || ''}` : 
                                            initialOffer?.defendant?.defendantType?.name === "Private Individual" ? 
                                            `${initialOffer?.defendant?.first_name || ''} ${initialOffer?.defendant?.last_name || ''}` :
                                            `${initialOffer?.defendant?.entity_name || ''}`
                                    return <>
                                    {parentIndex > 0 && <tr className='offer-action-bar-row'>
                                        <td className='offer-action-bar-td' colSpan={11}>
                                            <SectionActionBar sectionName={`${initialOffer?.offer_type?.name} from ${by} to ${party}, ${initialOffer.insurance?.company}`} />
                                        </td>
                                    </tr>
                                    }
                                    
                                    { parentIndex > 0 && <tr id="settle-tb-header" className="settle-t-4">
                                        <th></th>
                                        <th className="s-offer-date">Initiated</th>
                                        <th>Input</th>
                                        {/* <th>By</th> */}
                                        <th colSpan={3}>Party</th>
                                        {/* <th>Insurance</th> */}
                                        <th>Offer Type</th>
                                        <th className="big-n-1">Note</th>
                                        <th className="s-offer-date">Expires</th>
                                        <th className="td-autosize text-end">Initial</th>
                                        <th className="text-end td-autosize">Counter</th>
                                    </tr>}
                                    {
                                    parentIndex > 0 &&
                                        group?.offers_list.slice().reverse().map((offer,index) =>
                                            <tr key={index}  onClick={()=>{
                                                setCurrentOffer(offer);
                                                handleOfferShow();
                                            }}>
                                                <td className="td-autosize">{index + 1}</td>
                                                <td className="s-offer-date">
                                                    {/* {offer.offer_type.name === 'Offer' && (
                                                        formatDate(offer.date)
                                                    )}
                                                    {offer.offer_type.name === 'Demand' && (
                                                        formatDate(offer.demand_date_sent)
                                                    )}
                                                    {offer.offer_type.name === 'Mediation' && (
                                                        formatDate(offer.mediation_date)
                                                    )}
                                                    {offer.offer_type.name === 'Settlement Conference' && (
                                                        formatDate(offer.settlement_conference_date)
                                                    )} */}
                                                    {formatDate(offer?.date)}
                                                </td>
                                                <td className="td-autosize">
                                                    <CurrentUserInfo id={offer.firm_user} />
                                                </td>
                                                <td className="td-autosize">
                                                    {
                                                        offer.by_defendant ?  offer?.by_defendant?.defendantType?.name === "Private Individual" ? 
                                                            `${offer?.by_defendant?.first_name || ''} ${offer?.by_defendant?.last_name || ''}` :
                                                            `${offer?.by_defendant?.entity_name || ''}` : `${ offer.by_entity_client?.first_name } ${ offer.by_entity_client?.last_name }`
                                                    }
                                                    {/* { offer.by_defendant ? 
                                                    <span>{ offer.by_defendant?.first_name } { offer.by_defendant?.last_name }</span>  :     
                                                    <span>{ offer.by_entity_client?.first_name } { offer.by_entity_client?.last_name }</span>                                             
                                                    } */}
                                                </td>
                                                <td className="td-autosize">
                                                    {
                                                        offer?.defendant ?  offer?.defendant?.defendantType?.name === "Private Individual" ? 
                                                            `${offer?.defendant?.first_name || ''} ${offer?.defendant?.last_name || ''}` :
                                                            `${offer?.defendant?.entity_name || ''}` : `${ offer.entity_client?.first_name } ${ offer.entity_client?.last_name }`
                                                    }
                                                </td>
                                                <td className="td-autosize">
                                                    { offer?.insurance &&
                                                        <span>{ offer.insurance?.company }</span>  
                                                    }
                                                </td>
                                                <td className="td-autosize">{index == 0 ? "Initial " : ""} { offer.offer_type.name }</td>
                                                <td className=" text-capitalize big-n-1">{offer.note}</td>
                                                <td className="s-offer-date">{formatDate(offer.expiration_date)}</td>
                                                <td className="td-autosize monospace-font text-end whitespace-SETTLE dollar-amount-value" data-value={offer?.demand || 0}>
                                                    {/* {  offer?.offer_type?.name == 'Demand' &&
                                                        currencyFormat(offer.demand)
                                                    } */}
                                                    {/* {  offer?.offer_type?.name == 'Demand' && offer?.counter_offer_amount == 0 &&
                                                        currencyFormat(offer.demand)
                                                    } */}
                                                    { index === 0 && currencyFormat(offer?.demand)}
                                                </td>
                                                <td className="monospace-font td-autosize text-end whitespace-SETTLE dollar-amount-value" data-value={offer?.demand || 0}>
                                                    {/* {  offer?.offer_type?.name == 'Offer' && offer?.counter_offer_amount == 0 &&
                                                        currencyFormat(offer?.amount) 
                                                    } */}
                                                    {/* {  offer?.offer_type?.name == 'Offer' &&
                                                        currencyFormat(offer?.amount) 
                                                    } */}
                                                    { index > 0 && currencyFormat(offer?.demand)}
                                                </td>
                                            </tr>
                                    )}
                                    </>
                                    
                                })
                                }

                                </tbody>
                            </table>
                            </div>
                        }
                                </React.Fragment>  
                    }       
                )}
            </>
            }
        </div>
        <EditOfferPopUp show={showOfferModal} updateGroupedOffersState={updateGroupedOffersState} handleClose={handleOfferClose} offer={currentOffer} updateOffersState={updateOffersState} updateClientProceedStates={updateClientProceedStates} updateFeesState={updateFeesState} updateTrustLedger={updateTrustLedger} offerCombinations={offerCombinations} />
    </>
)
}

export default SettlementOffers