import React,{ useState } from 'react';
import unlockedGrey from '../../../public/BP_resources/images/icon/unlocked-grey.svg';
import lockedGrey from '../../../public/BP_resources/images/icon/locked-grey.svg';
import locked from '../../../public/BP_resources/images/icon/locked.svg';
import unlocked from '../../../public/BP_resources/images/icon/unlocked.svg';
import SectionActionBar from './SectionActionBar';
import GenericSettlementAddPopup from '../Modals/GenericSettlementAddPopup';

const AttorneyLiens = ({settlementObjProps}) => {
    const [showSettlementPopup, setShowSettlementPopup] = useState(false);
    return (
    <>
        <div className="m-t-5">
            <SectionActionBar sectionName={"Attorney Liens"} />
            <div className="table--no-card rounded-0 border-0 w-100">
                <table className="table table-borderless table-striped table-earning settlement-table">
                    {/* <thead>
                        <tr id="settle-tb-header" className="settle-t-4">
                            <th className=""></th>
                            <th className="td-autosize text-left provider-col">Firm Name</th>
                            <th className="text-end dollar-amount-value td-autosize">Type</th>
                            <th className="text-end dollar-amount-value td-autosize">Fees</th>
                            <th className="text-end dollar-amount-value td-autosize">Costs</th>
                            <th className="text-end dollar-amount-value td-autosize">Total Lien</th>
                            <th className=""></th>
                            <th className={`height-25 text-right font-weight-bold td-autosize`}
                                    style={{color:"var(--primary-25) !important"}}>
                                    <span className='position-relative center-val-div'>
                                        Working
                                    </span>
                            </th>
                            <th className={`s-draft text-end`} 
                                style={{color:"var(--primary-25) !important"}}>
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
                                                // lockAllLiens("draft1",'false');
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
                                                // lockAllLiens("draft1",'true');
                                            }}
                                            style={{cursor: 'pointer' }}
                                        />
                                    </div>
                                    <span className='position-relative center-val-div' style={{paddingRight:"2px"}}                                     
                                        >
                                    Draft</span>
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
                                                // lockAllLiens("final",'false');
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
                                                // lockAllLiens("final",'true');
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
                    </thead> */}
                    <tbody id="body-table">
                    {/* otherLiens?.length == 0 &&    */}
                            {                               
                                <tr id="cost-settle-row" className='add-btn-row'>
                                    <td className='text=center cursor-pointer' colSpan={ 12 }> 
                                        
                                        <div className='settle-add-btn btn'>
                                            <button type="button" onClick={(e)=>{
                                                e.stopPropagation();
                                                setShowSettlementPopup(true);
                                                }} 
                                            className="btn">
                                                <span className="font-weight-bold text-gold">+ </span>
                                                <span>Attorney Lien</span> 
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            }
                            {/* <tr className="height-25">
                                <td className=""></td>
                                <td className='provider-col text-left'></td>
                                <td className="text-end monospace-font td-autosize"></td>
                                <td className="text-end monospace-font td-autosize"></td>
                                <td className="text-end monospace-font td-autosize"></td>
                                <td className="text-end monospace-font td-autosize"></td>
                                <td className=""></td>
                                <td className={`monospace-font  dollar-amount-value text-right`} ></td>
                                <td className="s-draft text-right"></td>
                                <td className="s-final"></td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td text-center"></td>
                            </tr>
                            <tr className="height-25">
                                <td className=""></td>
                                <td className='provider-col text-left'></td>
                                <td className="text-end monospace-font td-autosize"></td>
                                <td className="text-end monospace-font td-autosize"></td>
                                <td className="text-end monospace-font td-autosize"></td>
                                <td className="text-end monospace-font td-autosize"></td>
                                <td className=""></td>
                                <td className={`monospace-font  dollar-amount-value text-right`} ></td>
                                <td className="s-draft text-right"></td>
                                <td className="s-final"></td>
                                <td className="s-verify"></td>
                                <td className="td-autosize check-request-td text-center"></td>
                            </tr> */}
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
            initialLabel={"Attorney Lien"}
                {...settlementObjProps}
            />
        }
    </>
    )
}

export default AttorneyLiens