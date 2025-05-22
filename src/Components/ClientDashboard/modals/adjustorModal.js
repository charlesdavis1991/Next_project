import React from 'react'
import Input from '../shared/input';
import Form from "react-bootstrap/Form";
import InputNumber from "../shared/numbersInput";

const ModalBody = (props) => {
    return (
        <>
            <div class="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
                <h5 class="modal-title mx-auto font-size-24 height-40 font-weight-semibold text-uppercase popup-heading-color font-weight-500" id="avatarModalTitle">
                COMPANY
                </h5>
            </div>
            <p class="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center" id="">Input and edit the information about the insurance claim adjuster here.</p>
            <div class="modal-body">
                <form>
                    <div className='mt-2'>
                        <Input placeholder="Type Insurance Company Name" flag={true} />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="Company" lable="Company:" />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="last name" lable="First Name:" />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="first name" lable="Last Name:" />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="13001 Seal Beach Blvd" lable="Address 1:" />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="Ste 3001111" lable="Address 2:" />
                    </div>
                    <div class="row align-items-center mt-2">
                        <div class="col-2">
                            <label class="text-grey">City</label>
                        </div>
                        <div class="col-10">
                            <div className='row'>
                                <div className='col-4'>
                                    <input type="text" class="modal-input" placeholder="hello" />
                                </div>
                                <div className='col-4'>
                                    <div class="row align-items-center">
                                        <div class="col-3">
                                            <label class="text-grey mt-2">State:</label>
                                        </div>
                                        <div class="col-9">
                                            <Form.Select aria-label="Default select example" className="custome-slect">
                                                <option>select</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </Form.Select>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-4'>
                                    <div class="row align-items-center">
                                        <div class="col-2">
                                            <label class="text-grey mt-2">ZIP:</label>
                                        </div>
                                        <div class="col-10">
                                            <input type="text" class="modal-input" placeholder="1234" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <InputNumber placeholder="(562) 596-9800" lable="Phone:" />
                    </div>
                    <div className='mt-2'>
                        <InputNumber placeholder="(562) 596-9800" lable="Fax:" />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="someone@allstate.com" lable="Email:" />
                    </div>
                    <div className='mt-2'>
                        <InputNumber placeholder="(###) ###-####" lable="Extension:" />
                    </div>
                </form>

            </div>

            <div class="mb-3 ml-3">
                <button type="button" id=""
                    class="btn btn-success input-group-text send_btn notification-position-absolute-right-14px-background-color-218838-color-white-border-color-218838 save-btn-popup popup-heading-color"
                    data-dismiss="modal">Save Insurance Claim Adjuster Contact Information</button>
                     
                <button type="button" class="btn btn-danger  notification-background-color-grey"
                    onClick={props.hideModal}>Cancle</button>
                     <button type="button" class="btn btn-danger notification-background-color-red ml-4"
                    onClick={props.hideModal}>Delete</button>
            </div>
        </>
    );
}

export default ModalBody;


