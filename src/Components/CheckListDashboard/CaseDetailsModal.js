import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCasesByCaseType, setCaseAssignTasks } from "../../Redux/checklist/actions"
import ProgressCircle from "./ProgressCircle"
import UserTypeRow from "./UserTypeRow"
import UniqueUserTypes from "./UniqueUserTypes"
import {findCasesForUserWithStatusTrue, countCasesForUserId, changeDateFormate, uniqueByObject, parseJSON, defaultImagePath, isAnyCaseAndUserSelected, findTrueStatusCases, transformGroupedCases, } from "./helpers"

const CaseDetailsModal = ({pageItem, case_percentage, changeModalState, duration,case_type_name, confirmationModalHandler, setUniqueCases}) => {    
    const cases_by_case_type = useSelector((state) => state?.checkLists?.case_details[case_type_name]?.[JSON.parse(pageItem)[0]?.fields.name]?.data || null);
    const page_data = JSON.parse(pageItem)[0];
    const [checkAssignData, setCheckAssignData] = useState(null)
    const dispatch = useDispatch();    
    useEffect(() => {
        getCasesByCaseType(dispatch, JSON.parse(pageItem)[0]?.fields.name, duration , case_type_name);
        let dictOfBools ;
        if(case_type_name?.toLowerCase() === "all"){
            dictOfBools = cases_by_case_type?.cases?.reduce((acc, value, index) => {
                acc[value?.case?.id] = {
                    ...value?.sorted_user_types.map((item, subIndex) => {
                        return { 
                            user_id: item?.pk, 
                            status: false ,
                            index : subIndex+1,
                            case_id : value?.case?.id,
                            firm_user1 : value?.case?.firm_user1?.id,
                            firm_user2 : value?.case?.firm_user2?.id,
                            firm_user3 : value?.case?.firm_user3?.id,
                            firm_user4 : value?.case?.firm_user4?.id,
                            firm_user5 : value?.case?.firm_user5?.id,
                            firm_user6 : value?.case?.firm_user6?.id,
                        };
                    }),
                    status : false
                }
                return acc;
            }, {});
            setCheckAssignData({ 
                ...dictOfBools
            })
        } else{
            dictOfBools = cases_by_case_type?.cases?.reduce((acc, value, index) => {
                acc[value?.case?.id] = {
                    ...uniqueByObject(cases_by_case_type?.unique_user_types)?.map((item, subIndex) => {
                        return { 
                            user_id: item?.pk, 
                            status: false ,
                            index : subIndex+1,
                            case_id : value?.case?.id,
                            firm_user1 : value?.case?.firm_user1?.id,
                            firm_user2 : value?.case?.firm_user2?.id,
                            firm_user3 : value?.case?.firm_user3?.id,
                            firm_user4 : value?.case?.firm_user4?.id,
                            firm_user5 : value?.case?.firm_user5?.id,
                            firm_user6 : value?.case?.firm_user6?.id,
                        };
                    }),
                    status : false
                }
                return acc;
            }, {});
            console.debug({ 
                ...dictOfBools
            })
            setCheckAssignData({ 
                ...dictOfBools
            })
        }
    }, [])
    
    const clickHandler = () => {
        changeModalState()
    }

    const getIsEnableValue = () => {
        return isAnyCaseAndUserSelected(checkAssignData)
    }

   
    const updateCaseStatus = (case_id, newStatus) => {
        const updateData = { ...checkAssignData };
        if(case_id === "all"){
            for (let caseItem in updateData){
                updateData[caseItem] = {
                    ...updateData[caseItem],
                    status: newStatus
                };
            }
        } else{
            updateData[case_id] = {
                ...updateData[case_id],
                status: newStatus
            };
        }
        setCheckAssignData(updateData);
    };

    const isCaseSelected = (case_id) => {
        if(case_id === "all"){  
            let counter = checkAssignData ? Object.keys(checkAssignData).length : 0
            let total_true_counter = 0;
            for (let caseItem in checkAssignData){
                if(checkAssignData[caseItem]?.status === true){
                    total_true_counter = total_true_counter + 1
                }
            }
            if((total_true_counter > 0) && (total_true_counter == counter)){
                return true
            } else{
                return false
            }
        } else {
            return checkAssignData?.[case_id]?.status || false
        }
    }

    // select case from first column of each row
    const selectCase = (case_id) => {
        updateCaseStatus(case_id, true);    
    }

    // un-select a case
    const unSelectCase = (case_id) => {
        updateCaseStatus(case_id, false); 
    }


    // handler to change status for all cases
    const handleSelectAllCase = (case_id) => {
        if(!isCaseSelected(case_id)){
            selectCase(case_id)
        } else{
            unSelectCase(case_id)
        }
    }
    
    const handleSelectCase = (case_id) => {
        if(isCaseSelected(case_id)){
            unSelectCase(case_id)
        } else{
            selectCase(case_id)
        }
    }


    const updateCaseWorkerStatus = (case_id, user_id, row_index, newStatus) => {
        const updateData = { ...checkAssignData };
        if(case_id === "all"){
            for (let caseItem in updateData){
                for (let userItem in updateData[caseItem]){
                    if(parseInt(updateData[caseItem][userItem]?.user_id) === parseInt(user_id)){
                        updateData[caseItem] = {
                            ...updateData[caseItem],
                            [userItem]: {
                              ...updateData[caseItem][userItem],
                              status: newStatus,
                            }
                          };
                        
                    }
                }
                updateData[caseItem] = {
                    ...updateData[caseItem],
                    status: true
                };
                
            }
        } else{
            updateData[case_id] = {
                ...updateData[case_id],
                [row_index]: {
                  ...updateData[case_id][row_index],
                  status: newStatus,
                }
            };
            if(newStatus === true)
            {
                updateData[case_id] = {
                    ...updateData[case_id],
                    status: true
                };
            }
              
        }
        setCheckAssignData(updateData);
    };


    const isCaseWorkerSelected = (case_id, user_id=0, row_index=0) => {
        if(case_id === "all"){  
            let counter = checkAssignData ? countCasesForUserId(
                checkAssignData,
                user_id
            ) : 0
            let total_true_counter = checkAssignData ?  findCasesForUserWithStatusTrue(
                checkAssignData,
                user_id
            ).length : 0;
            if((total_true_counter > 0) && (total_true_counter == counter)){
                return true
            } else{
                return false
            }
        } else {
            return checkAssignData?.[case_id]?.[row_index]?.status || false
        }
    }

    const selectCaseWorker = (case_id, user_id,row_index=0) => {
        updateCaseWorkerStatus(case_id, user_id, row_index,true)
    }

    const unSelectCaseWorker = (case_id, user_id, row_index=0) => {
        updateCaseWorkerStatus(case_id, user_id, row_index, false)
    }

    // const selectCaseWorker
    const handleSelectAllCaseWorkers = (case_id, user_id) => {
        if(!isCaseWorkerSelected(case_id, user_id)){
            selectCaseWorker(case_id, user_id)
        } else{
            unSelectCaseWorker(case_id, user_id)
        }
    }

    const handleSelectCaseWorker = (case_id, user_id, row_index) => {
        if(!isCaseWorkerSelected(case_id, user_id,row_index)){
            selectCaseWorker(case_id, user_id,row_index)
            
        } else{
            unSelectCaseWorker(case_id, user_id,row_index)
        }
    }

    const assignTaskHandler = () => {
        let page_name = JSON.parse(pageItem)[0]?.fields?.name
        let unique_cases = transformGroupedCases(findTrueStatusCases(checkAssignData), page_name)
        setUniqueCases(unique_cases)
        setCaseAssignTasks(dispatch, JSON.stringify(unique_cases, null, 2));
        setTimeout(()=> {
            changeModalState()
            confirmationModalHandler()
        }, 1000)
    }
    
    return (
        <div className="modal generic-popup fade bd-example-modal-lg zoom-in checklist-modal show"  tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"  style={{"background-color" : "#7c94adb8"}}>
            <div className="modal-dialog modal-lg modal-dialog-centered checklist-wo-header-max-width-80" role="document">
                <div className="modal-content">
                    <div className="modal-header text-center d-flex justify-content-center align-items-center text-center height-35 bg-primary text-white p-0 rounded-0">
                        {"Checklist Completion Task Generator"}
                    </div>
                    <div className="modal-body pt-0 overflow--scroll table-responsive">
                        <p className="text-left p-t-5 p-b-5 middle-text1">
                            {"These are the ten cases with the lowest completion percentage on the " + page_data?.fields?.name + " page.  Send a task to the people assigned to this case with the tools below."}
                        </p>
                        <p className="text-left p-t-5 p-b-5 middle-text2">
                            {"All tasks will begin with “Review this case and address the " + page_data?.fields?.name + " checklist items and complete any available items on that list.”  Additional instructions can be entered in the below input field"}
                        </p>
                        <table className="table table-borderless table-striped table-earning has-height-25 additional-instructions">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th className='font-weight-bold'>{page_data?.fields.name} {page_data?.fields.name === "Case" ? "Complete" : "Page"}</th>
                                    <th className="fluid-width-60">Additional Instructions for Each Task</th>
                                    <th className="fluid-width-50">Case Workers</th>
                                </tr>
                            </thead>
                            {/* Assign Task */}
                            <tbody>
                                <tr className="has-white-td">
                                    <td></td>
                                    <td>
                                        <input onChange={() => handleSelectAllCase('all')} className="all_checkbox_check align-middle" type="checkbox" checked={isCaseSelected("all")}  />
                                    </td>
                                    <td className="text-left white_space-wrap assign-task-container">
                                        <div className="assign-task-div">Assign Task to All Cases Listed Here</div>
                                    </td>
                                    <td></td>
                                    <td className="avg-checklist-div">
                                        <ProgressCircle  case_percentage={case_percentage} />
                                    </td>
                                    <td className="text-left">
                                        <input type="text" className="form-control all-checkbox-text" data-case_id="46" onKeyUp={() => console.debug("AllautoCheckAll('${jsonData[0].pk}')")} />
                                    </td>
                                    {/* case workers */}
                                    <td className="td-autosize">
                                        {
                                            case_type_name?.toLowerCase() === "all" ? 
                                            <UniqueUserTypes unique_user_types={cases_by_case_type?.unique_user_types} handleSelectAllCaseWorkers={handleSelectAllCaseWorkers}  checked={isCaseWorkerSelected} /> : 
                                            <UniqueUserTypes unique_user_types={cases_by_case_type?.unique_user_types} handleSelectAllCaseWorkers={handleSelectAllCaseWorkers} checked={isCaseWorkerSelected} />
                                        }
                                    </td>
                                </tr>
                            </tbody>

                            {/* Client  */}
                            <tbody className={"allcasesinfo" + page_data?.pk}>
                                <tr className="header">
                                    <th></th>
                                    <th className='columnCounter'></th>
                                    <th className="text-center">Client</th>
                                    <th className="text-center">Case</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                {
                                    // Single Row
                                    cases_by_case_type?.cases?.map((caseItem, index) => (
                                        <tr data-case_id={caseItem?.case?.id} className="checklist-wo-header-height-63px ">
                                            <td >{index+1}</td>
                                            <td>
                                                <input type="checkbox" data-case-id={caseItem?.case?.id}   className={"case-row-checkboxes case-row-checkbox-" + caseItem?.case?.id} onClick={() => handleSelectCase(caseItem?.case?.id)} style={{
                                                    "height" : "20px",
                                                    "width" : "50px"
                                                }} 
                                                checked={isCaseSelected(caseItem?.case?.id)}
                                                />
                                            </td>
                                            
                                            <td className="text-left" >
                                                <div className='d-flex align-items-center'>
                                                    <span className="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                        <img className={"output-1 theme-ring"} src={caseItem.case.for_client.profile_pic_29p ? caseItem.case.for_client.profile_pic_29p : defaultImagePath} />
                                                    </span>
                                                    <div className='ml-1'>
                                                        <p className="text-darker font-weight-semibold"> {caseItem.case.for_client.last_name}, {caseItem.case.for_client.first_name}</p>
                                                        <p className="text-darker"><span className="d-inline-block text-dark-grey mr-1">DOB</span> {changeDateFormate(caseItem.case.for_client.birthday)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='text-left' >
                                                <div className='d-flex align-items-center'>
                                                    <div className='ml-1'>
                                                        <p className="text-darker d-flex">
                                                            <span className="ic-avatar ic-19 mr-1">
                                                                <img className="" src={caseItem.case.case_type.casetype_icon} />
                                                            </span> {caseItem.case.case_type.name}
                                                        </p>
                                                        <p className="text-darker"><span className="d-inline-block text-dark-grey mr-1">DOI</span>{caseItem.case.incident_date}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <ProgressCircle case_percentage={caseItem?.percentage} />
                                            </td>
                                            <td className="text-left">
                                                <input type="text" className={"form-control case-row-text-" + caseItem?.case?.id} data-case_id={caseItem?.case?.id} onKeyUp={() => console.debug("updateWorkerCheckbox3('${jsonData[0].fields.name}','${jsonData[0].pk}','${caseID}')")} />
                                            </td>
                                            <td className="td-autosize">
                                                {/* case workers */}
                                                {checkAssignData && 
                                                (
                                                    <UserTypeRow  
                                                        caseItem={caseItem} 
                                                        case_type_name={case_type_name}  
                                                        cases_by_case_type={cases_by_case_type}  
                                                        checked={isCaseWorkerSelected}
                                                        handleChange={handleSelectCaseWorker}
                                                        data={checkAssignData}
                                                        isCaseSelected={isCaseSelected}
                                                        
                                                    />
                                                )
                                                
                                                }
                                                
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer border-0 justify-content-between pt-0">
                        <button  type="button" className="btn btn-secondary"  onClick={clickHandler}>Cancel</button>
                        {checkAssignData && 
                            <button  type="button" className={getIsEnableValue('all') ? "btn btn-success" : "btn btn-secondary"} onClick={() => assignTaskHandler()} disabled={!getIsEnableValue('all')}>Assign Tasks</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}



export default CaseDetailsModal