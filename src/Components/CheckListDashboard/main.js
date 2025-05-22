import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import TableLoader from "../Loaders/tableLoader";
import "./checklists.css";

import CheckListCircularProgress from "./CheckListCircularProgress"
import WelcomeMessageBlock from "./WelcomeMessageBlock"
import CasesList from "./CasesList"
import PageItem from "./PageItem"
// import { fetchCheckListPageData, getCaseTypes } from "../../Redux/checklist/actions";



const CheckListDashboard = ({onChangeDurationDays, duration}) => {
    const { firmCases } = useSelector((state) => state?.checkLists);

    return (
        <>
            {firmCases &&  (
            <div className="main-content red">
                    <div className="action-bar anti-action-bar client-BarAlign anti-client-BarAlign  topbarMargin has-checklist d-flex mb-5 ">
                        <span className="page-icon">
                            <i className="ic ic-42 ic-speedometer"></i>
                        </span>
                        <div className="text-wrapper text-white d-flex align-items-center p-l-5">
                            <h2 className="text-white">CheckLists</h2>
                        </div>
                        <div className="text-wrapper text-white d-flex align-items-center p-l-5 pr-0 w-280">
                            <div className="w-100">
                                <p className="text-white">Select Days</p>
                            </div>
                            <select className="form-select form-control height-25 p-0 w-100" value={duration} onChange={onChangeDurationDays}>
                                <option value="All" >All</option>
                                <option value="90" >90</option>
                                <option value="60">60</option>
                                <option value="30">30</option>
                                <option value="14">14</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                    </div>
                    <div className="container-fluid has-full-height Checklist-ML5">
                        <WelcomeMessageBlock />
                        <div className="row sam_row h-100 overflow-hidden">
                            <div className="col-auto pr-0"  >
                                <div className="bg-primary h-100 pt-1">
                                    <h4 className="text-lg text-white p-l-15 p-r-15 text-center">Case Types</h4>
                                    <p className="all_case_type_heading text-white p-l-15 p-r-15 height-50 d-flex align-items-center justify-content-center">All Case Types</p>
                                    {firmCases && <ul className="item-list list-unstyled text-white">
                                        {firmCases?.all_firm_casetype_image_list?.map((casetype, index) => (
                                            <CasesList casetype={casetype} key={index} />
                                        ))}
                                    </ul> }
                                </div>
                            </div>
                            <div className="col d-flex flex-column w-100 pl-0">
                                <div className="tab-content position-relative h-100">
                                    <div className="tab-pane fade show active"  role="tabpanel" aria-labelledby="nav-stage-tab">
                                        <table className="table table-earning table-checklists res_tab table-responsive ml-5 has-height-auto" >
                                            <thead className="thead_sam daysSpan">
                                                <tr className="tableHeaderRow custom-style">
                                                {firmCases && firmCases?.pages_list?.map((pageItem, index) => (
                                                    <PageItem pageItem={pageItem} key={index} />
                                                ))}
                                                </tr>
                                            </thead>
                                            <tbody className="sam_tbody">
                                                <tr className="timeDoiBody" id="allcases_timeDoiBody">
                                                    {firmCases && firmCases?.pages_list?.map((pageItem, index) => (
                                                        <CheckListCircularProgress  key={index}  pageItem={pageItem} duration={duration}  case_type_name="All" targetTag={"#allcasesinfo" + JSON.parse(pageItem)[0].pk + "-modal"}  />
                                                    ))}
                                                </tr>
                                            </tbody>

                                            {firmCases && firmCases?.all_firm_cases?.map((firmCaseName, index) => (
                                                <tbody className="sam_tbody guages_tbody" key={index}>
                                                    <tr className="timeDoiBody " id={firmCaseName.replace(/ /g, '') + "_timeDoiBody"}>
                                                        {firmCases && firmCases?.pages_list?.map((pageItem, subIndex) => (
                                                            <CheckListCircularProgress  key={subIndex}  pageItem={pageItem} targetTag={"#casesinfo" + JSON.parse(pageItem)[0].pk + "_" +  JSON.parse(pageItem)[0].fields.name.replace(/ /g, '') + "-modal"} 
                                                            case_type_name={firmCaseName}
                                                            duration={duration}
                                                            />
                                                        ))}
                                                    </tr>
                                                </tbody>
                                            ))}
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            )
            }
        </>
    )
};
export default CheckListDashboard;