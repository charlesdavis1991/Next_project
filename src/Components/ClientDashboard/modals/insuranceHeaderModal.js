import React from 'react'
import Select from '../shared/select';


const ModalBody = (props) => {
    return (
        <>
            <div className="modal-header text-center p-3 justify-content-center">
                <h5 className="modal-title mx-auto font-size-24 height-40 font-weight-semibold  font-weight-500" id="avatarModalTitle">
                    nsurance Notes
                </h5>
            </div>

            <div className='row p-4'>
                <div className='d-flex w-100 justify-cont-even mb-3'>
                    <div className="footer-line">
                        <button form="notes-form" type="button" className=" rounded-0">
                            New <br />
                            Critical<br />
                            Note
                        </button>
                    </div>
                    <div className='w-97'>
                        <textarea id="note_description_panel" required="" name="description" placeholder="Case Note:.."></textarea>
                    </div>
                    <div>
                        <div className="footer-line pl-2 mr-4">
                            <button form="notes-form" type="button" className="rounded-0">
                                Update<br />
                                Case<br />
                                Status
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-3'>
                    <div className='row'>
                        <div className='text-black col-4 pl-0 pr-0 mt-2'>To-Do For</div>
                        <div className='col-8 pr-0 pl-0'>
                            <Select flag={true} />
                        </div>
                    </div>
                </div>
                <div className='col-5'>
                    <div className='row'>
                        <div className='text-black col-2 pl-2 pr-0 mt-2'>Due In</div>
                        <div className='col-7 pr-0 pl-0'>
                            <Select flag={true} />
                        </div>
                        <div className='col-3 pr-0'>
                            <button className="btn btn-primary rounded-0" type="button"><span className="font-weight-bold pr-2 text-gold">+</span>To-Do</button>
                        </div>
                    </div>
                </div>
                <div className='col-4'>
                    <div className='row mr-1'>
                        <div className='text-black col-2 pr-0 mt-2'></div>
                        <div className='col-7 pr-0 pl-0'>
                            <Select flag={true} />
                        </div>
                        <div className='col-3'>
                            <button className="btn btn-primary rounded-0" type="button"><span className="font-weight-bold text-gold">+</span>Note</button>
                        </div>
                    </div>
                </div>
                {/* tbale */}
                <div className='border mt-3 w-100'>
                    <div className='table-responsive table--no-card'>
                        <table className='table table-borderless table-striped table-earning-subheader'>
                            <thead>
                                <tr>
                                    <th scope="col" className="width-1"></th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th className="width-6-padding-left">User</th>
                                    <th>Note</th>
                                    <th>Category</th>
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

            <div className="mb-3 notification-padding-2rem">

                <button type="button" className="btn btn-danger  notification-background-color-grey-border-color-grey-position-absolute-left-14px"
                    onClick={props.hideModal}>Cancle</button>
            </div>
        </>
    );
}

export default ModalBody;


