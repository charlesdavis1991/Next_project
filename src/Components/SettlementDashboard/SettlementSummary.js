import React from 'react';
import SectionActionBar from './SectionActionBar';
import { currencyFormat } from '../../Utils/helper';


const SettlementSummary = ({ offersObj, feesObj, costsObj, insuranceLiensObj, otherLiensObj, clientProceeds }) => {
    return (
            <div className='m-t-5 m-b-5'>
                <SectionActionBar sectionName={"Settlement Summary"} />
                <div className="table--no-card rounded-0 border-0 w-100">
                    <table className="table table-borderless table-striped table-earning settlement-table">
                        <thead>
                            <tr id="settle-tb-header" className="settle-t-4">
                                <th className=""></th>
                                <th className="td-autosize text-left provider-col">Section</th>
                                <th className="text-left">Description</th>
                                <th className="text-end td-autosize med-bill-width" style={{ color: "var(--primary-25) !important" }}>Total</th>
                                <th className="s-draft text-end" style={{ color: "var(--primary-25) !important" }}>Draft</th>
                                <th className="s-final text-end" style={{ color: "var(--primary-25) !important" }}>Final</th>
                                <th className="s-verify"></th>
                                <th className='td-autosize check-request-td text-center'></th>
                            </tr>
                        </thead>
                        <tbody id="body-table">
                            <tr className="height-25 total-settle-row">
                                <td className="">1</td>
                                <td className="td-autosize text-left provider-col">Settlement</td>
                                <td className="text-left">Total of all Offers</td>
                                <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value med-bill-width"
                                    data-value={parseFloat(offersObj.offerFinalAmount)}>
                                    {currencyFormat(offersObj.offerFinalAmount)}
                                </td>
                                <td className="s-draft monospace-font text-right dollar-amount-value" data-value={offersObj.offerLockValues[0] || 0.00}>{currencyFormat(offersObj.offerLockValues[0] || 0.00)}</td>
                                <td className="s-final monospace-font text-right dollar-amount-value" data-value={offersObj.offerLockValues[1] || 0.00}>{currencyFormat(offersObj.offerLockValues[1] || 0.00)}</td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td"></td>
                            </tr>
                            <tr className="height-25 total-settle-row">
                                <td className="">2</td>
                                <td className="td-autosize text-left provider-col">Fees</td>
                                <td className="text-left">Total Fees taken</td>
                                <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value med-bill-width"
                                    data-value={parseFloat(feesObj.feesFinalAmount)}>
                                    {currencyFormat(feesObj.feesFinalAmount)}
                                </td>
                                <td className="s-draft monospace-font text-right dollar-amount-value" data-value={feesObj.feesLockValues[0] || 0.00}>{currencyFormat(feesObj.feesLockValues[0] || 0.00)}</td>
                                <td className="s-final monospace-font text-right dollar-amount-value" data-value={feesObj.feesLockValues[1] || 0.00}>{currencyFormat(feesObj.feesLockValues[1] || 0.00)}</td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td"></td>
                            </tr>
                            <tr className="height-25 total-settle-row">
                                <td className="">3</td>
                                <td className="td-autosize text-left provider-col">Costs</td>
                                <td className="text-left">Total Case Costs</td>
                                <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value med-bill-width"
                                    data-value={parseFloat(costsObj.costFinalAmount)}>
                                    {currencyFormat(costsObj.costFinalAmount)}
                                </td>
                                <td className="s-draft monospace-font text-right dollar-amount-value" data-value={costsObj.costLockValues[0] || 0.00}>{currencyFormat(costsObj.costLockValues[0] || 0.00)}</td>
                                <td className="s-final monospace-font text-right dollar-amount-value" data-value={costsObj.costLockValues[1] || 0.00}>{currencyFormat(costsObj.costLockValues[1] || 0.00)}</td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td"></td>
                            </tr>
                            <tr className="height-25 total-settle-row">
                                <td className="">4</td>
                                <td className="td-autosize text-left provider-col">Insurance Liens</td>
                                <td className="text-left">Total Insurance Liens</td>
                                <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value med-bill-width"
                                    data-value={parseFloat(insuranceLiensObj.insuranceLienFinalAmount )}>
                                    {currencyFormat(insuranceLiensObj.insuranceLienFinalAmount )}
                                </td>
                                <td className="s-draft monospace-font text-right dollar-amount-value" data-value={ insuranceLiensObj.insuranceLiensLocksValues[0]  || 0.00}>{currencyFormat(insuranceLiensObj.insuranceLiensLocksValues[0] || 0.00)}</td>
                                <td className="s-final monospace-font text-right dollar-amount-value" data-value={ insuranceLiensObj.insuranceLiensLocksValues[1] || 0.00}>{currencyFormat( insuranceLiensObj.insuranceLiensLocksValues[1] || 0.00)}</td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td"></td>
                            </tr>
                            <tr className="height-25 total-settle-row">
                                <td className="">5</td>
                                <td className="td-autosize text-left provider-col">Other Liens</td>
                                <td className="text-left">Total Other Liens</td>
                                <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value med-bill-width"
                                    data-value={parseFloat(otherLiensObj.otherLienFinalAmount )}>
                                    {currencyFormat(otherLiensObj.otherLienFinalAmount )}
                                </td>
                                <td className="s-draft monospace-font text-right dollar-amount-value" data-value={ otherLiensObj.otherLiensLocksValues[0]  || 0.00}>{currencyFormat(otherLiensObj.otherLiensLocksValues[0] || 0.00)}</td>
                                <td className="s-final monospace-font text-right dollar-amount-value" data-value={ otherLiensObj.otherLiensLocksValues[1] || 0.00}>{currencyFormat( otherLiensObj.otherLiensLocksValues[1] || 0.00)}</td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td"></td>
                            </tr>
                            <tr className="height-25 total-settle-row">
                                <td className="">6</td>
                                <td className="td-autosize text-left provider-col">Client Proceeds</td>
                                <td className="text-left">Total Client Proceeds</td>
                                <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value med-bill-width"
                                    data-value={parseFloat(clientProceeds.clientProceed.working || 0.00)}>
                                    {currencyFormat(clientProceeds.clientProceed.working || 0.00)}
                                </td>
                                <td className="s-draft monospace-font text-right dollar-amount-value" data-value={clientProceeds.clientProceed?.balance_record?.draft1 || 0.00}>{currencyFormat(clientProceeds.clientProceed?.balance_record?.draft1 || 0.00)}</td>
                                <td className="s-final monospace-font text-right dollar-amount-value" data-value={clientProceeds.clientProceed?.balance_record?.final || 0.00}>{currencyFormat(clientProceeds.clientProceed?.balance_record?.final || 0.00)}</td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td"></td>
                            </tr>
                            <tr className="height-25 total-settle-row">
                                <td className="">7</td>
                                <td className="td-autosize text-left provider-col">Remaining to be Allocated</td>
                                <td className="text-left">Remaining</td>
                                <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value med-bill-width"
                                    data-value={parseFloat(clientProceeds.clientProceedFinalAmount || 0.00)}>
                                    {currencyFormat(clientProceeds.clientProceedFinalAmount || 0.00)}
                                </td>
                                <td className="s-draft monospace-font text-right dollar-amount-value" data-value={clientProceeds.checksLocksValues[0] || 0.00}>{currencyFormat(clientProceeds.checksLocksValues[0] || 0.00)}</td>
                                <td className="s-final monospace-font text-right dollar-amount-value" data-value={clientProceeds.checksLocksValues[1] || 0.00}>{currencyFormat(clientProceeds.checksLocksValues[1] || 0.00)}</td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
    )
}

export default SettlementSummary