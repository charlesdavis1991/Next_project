import React from 'react'


const ModalBody = (props) => {
    return (
        <>
            <div className="modal-header text-center p-0 bg-primary text-white justify-content-center">
                <h5 className="modal-title mx-auto font-size-24 height-40 text-white  font-weight-semibold  font-weight-500" id="avatarModalTitle">
                <i className="ic ic-29 ic-generate-document m-r-5 pt-2"></i>
                Generate Document
                </h5>
            </div>

            <div className='row p-2'>
                {/* tbale */}
                <div className='mt-3 w-100'>
                    <div className='table-responsive table--no-card'>
                        <table className='table table-borderless table-striped table-earning-subheader'>
                        <thead>
                            <tr>
                              <th scope="col" className="width-1"></th>
                              <th>Template Name</th>
                              <th>Copilot</th>
                              <th className="text-center">Pages</th>

                              <th className="text-center">Uploaded</th>
                              <th className="text-center width-25">Last Generated</th>
                              <th className="text-center">
                              </th>
                              <th>Task For</th>
                              <th></th>
                            </tr>
                          </thead>
                            <tbody id='table-body-cat-notes'>
                                <tr className="Insurance539 d-none">
                                    <td scope="row">1</td>
                                    <td className="td-autosize">
                                        Feb 06, 2024
                                    </td>
                                    <td className="td-autosize">4:24 a.m.</td>
                                    <td className="td-autosize d-flex align-items-center">
                                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        </span>
                                        <span className="ml-2 text-black">
                                            Usama Nawaz
                                        </span>
                                    </td>
                                    <td className="client_page_note_row color-black">
                                    </td>
                                    <td className="td-autosize">Update Case Status</td>
                                    <td className="td-autosize hover-button">
                                        <button type="button" className="btn btn-secondary edit-notes-btn" data-toggle="modal" data-target="#exampleModalCenter" onclick="editNotes('', '1696')">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <div className="modal-footer justify-content-between">
                    <button type="button"  onClick={props.hideModal} className="btn btn-danger notification-background-color-grey" data-dismiss="modal">Cancel</button>
                    <div className="d-flex">
                        <button className="btn btn-primary d-flex align-items-center m-r-5">Open Selected Docs in Tabs</button>
                        <button className="btn btn-primary  d-flex align-items-center m-r-5">Download Selected as PDFs</button>
                        <button className="btn btn-primary  d-flex align-items-center m-r-5">Download Selected as Docs</button>
                        <button className="btn btn-primary  d-flex align-items-center m-r-5"> Print Selected</button>
                    </div>
                </div>
        </>
    );
}

export default ModalBody;


