import React from 'react'

const InboxConfirmationModalBody = (props) => {
    console.log(props.taskDocumentPopupData)
    return (
    <>

        <div className="modal-header inbox-confirmation-content-header text-center">
            <h5 className="modal-title mx-auto text-white" id="exampleModalLabel">Confirmation Message</h5>
        </div>
        <div className='modal-body inbox-confirmation-content-body overflow-auto'>

            <ul className="document-list-item " style={{ color: "black" }}>
                <li>Document Attached to Case:</li>
                <li>{props.inboxConfirmationContent?.for_client?.first_name} {props.inboxConfirmationContent?.for_client?.last_name}</li>
                <li>{props.inboxConfirmationContent?.for_case?.case_type?.name}</li>
                <li>DOI: {props.inboxConfirmationContent?.for_case?.incident_date}</li>
            </ul>
            <div className="d-flex justify-content-center" >
                <div className="modal-file-name">
                    <span className="icon-wrap align-self-center"> 
                        <i className="ic ic-19 ic-file-colored cursor-pointer"></i> 
                    </span>
                    <span className="name inbox-modal-fn">{props.inboxConfirmationContent?.file_name}</span>
                </div>
            </div>
            {
                props.taskDocumentPopupData?.data ? 
                <table className="table table-hover table-borderless table-striped table-earning ">
                    <thead>
                        <tr className="doc-pop-height-25px">
                            <th></th>
                            <th>Case</th>
                            <th>Task</th>
                            <th>Assigned</th>
                            <th>Due By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.taskDocumentPopupData?.data?.map((task, index) => 
                        <tr>
                            <td>{index+1}</td>
                            <td>
                                <p>{task?.for_client?.last_name} {task?.for_client?.first_name}</p>
                                <p><span className="d-inline-block text-dark-grey mr-1">DOI:</span> {task?.for_case?.incident_date} {task?.for_case?.case_type ? task?.for_case?.case_type?.name : null}</p>
                            </td>
                            <td>
                                <div className="d-flex align-items-center f-gap-05">
                                    <div dangerouslySetInnerHTML={{ __html: task["notes"] }} />
                                </div>
                            </td>
                            <td>
                                <div className="d-flex f-gap-05 align-items-center">
                                    <div className="ic ic-19 doc-pop-float-left">
                                        <img className="doc-pop-position-relative-height-100P output-459 theme-ring" src="null"/>
                                    </div>
                                    <div id="previewProfilePic"></div>
                                    <div>{task.todo_for ? (task.todo_for?.user?.first_name+" "+task.todo_for?.user?.last_name): null}</div>
                                </div>
                            </td>
                            <td>{task?.due_date ? task?.due_date : null}</td>
                        </tr>
                        )}
                    </tbody>
                </table>
                :
                null
            }
        </div>

    </>
  )
}

export default InboxConfirmationModalBody;