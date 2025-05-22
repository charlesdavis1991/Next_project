
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AssignTaskConfirmationModal = ({confirmationModalHandler, uniqueCases}) => {
    const json_response = useSelector((state) => state?.checkLists?.assignTask?.json_response_data || null);

    const [data, setData] = useState(null)
    useEffect(() => {
        // console.debug(uniqueCases)
        setData(json_response)
    }, [json_response])

    return (
        <>
        <div class="modal generic-popup fade bd-example-modal-lg zoom-in show" id="confirmation-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" style={{"padding-right": "23px", "display": "block", "background-color": "rgba(124, 148, 173, 0.72)"}}>
	<div class="modal-dialog modal-lg modal-dialog-centered checklist-wo-header-max-width-80" role="document">
		<div class="modal-content">

					<div class="modal-header text-center">
						<h5 class="modal-title mx-auto">{`You assigned ${data?.length} Tasks to ${uniqueCases?.length} cases`}</h5>
					</div>
					<div class="modal-body overflow-x-scroll">
						<table class="table table-hover table-borderless table-striped table-earning ">
												<thead>
													<tr class="checklist-wo-header-height-25px">
														<th></th>
														<th class="checklist-wo-header-width-8P">Case</th>
														<th class="checklist-wo-header-width-42P">Task</th>
														<th class="text-center">Assigned</th>
														<th>Due By</th>
													</tr>
												</thead>
												<tbody>
                            {
                                data && data?.map((item, index) => (
                                    <>
                                        <tr>
                                            <td>{index+1}</td>

                                        <td class="td-autosize">
                                        <p>{item["for_client"] ?  `${item["for_client"]["last_name"]} ${item["for_client"]["first_name"]}` : ""}</p>
                                        <p><span class="d-inline-block text-dark-grey mr-1"></span>
                                            {item["for_case"] ? item["for_case"]["case_type"] ? item["for_case"]["case_type"]["name"] : "" : ""}
                                        </p>
                                        </td>
                                        <td class="align-items-center">
                                            {item["notes"]}
                                        </td>
                                        <td class="checklist-wo-header-width-18P-padding-0px">
                                        <div class="d-flex align-items-center justify-content-center">
                                        <div class="ic ic-29 checklist-wo-header-float-left d-flex align-items-center">
                                        <span class="ic-avatar ic-19 has-avatar-icon has-cover-img">
                                        <img class="output-18 theme-ring" src={item["todo_for"]["profile_pic_19p"]} />
                                        </span>
                                        </div>
                                        <div>
                                            {item["todo_for"] ? `${item["todo_for"]["user"]["first_name"]} ${item["todo_for"]["user"]["last_name"]}` : ""}
                                        </div>
                                        </div>
                                        </td>

                                        <td class="checklist-wo-header-white-space-nowrap"><p>{item["due_date"] ? new Date(item["due_date"]).toLocaleDateString("en-US", { month: 'numeric', day: 'numeric' ,year: 'numeric'}):''}</p> <p>
                                        {item["due_date"] ? new Date(item["due_date"]).toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric' ,hour12: true}):''}
                                        </p></td>

                                        </tr>
                                    </>
                                ))
                            }
                            </tbody>
                        </table>
					</div>
					<div class="modal-footer border-0 justify-content-between pt-0">
    <button type="button" class="btn btn-secondary checklist-wo-header-margin-0-auto-0-auto" onClick={()=> confirmationModalHandler()}>Close</button>
</div></div>
	</div>
        </div>
        </>
    )
}


export default AssignTaskConfirmationModal;