import React from 'react'
import Input from '../shared/input';
import Form from "react-bootstrap/Form";
import InputNumber from "../shared/numbersInput";

const ModalBody = (props) => {
    return (
        <>
            <div class="modal-header text-black text-center p-2 justify-content-center">
                <h5 class="modal-title mx-auto  text-black font-size-24 height-40 font-weight-semibold font-weight-500" id="avatarModalTitle">
                Counsel Contact
                </h5>
            </div>
           
            <div class="modal-body">
                <form>
                    <div className='mt-2'>
                        <Input placeholder="ristianFirm" lable="Name" />
                    </div>
                   
                    <div className='mt-2'>
                        <Input placeholder="Long beach 1" lable="Address 1" />
                    </div>
                   
                    <div className='mt-2'>
                        <Input placeholder="Cal 1" lable="Address 2" />
                    </div>
                   
                    <div class="row align-items-center mt-2">
                        <div class="col-2">
                            <label class="text-grey"></label>
                        </div>
                        <div class="col-10">
                            <div className='row'>
                                <div className='col-4'>
                                    <input type="text" class="modal-input" placeholder="hello" />
                                </div>
                                <div className='col-4'>
                                    <div class="row align-items-center">
                                        <div class="col-3">
                                            <label class="text-grey mt-2"></label>
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
                                            <label class="text-grey mt-2"></label>
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
                        <InputNumber placeholder="(562) 596-9800" lable="Phone" />
                    </div>
                    <div className='mt-2'>
                        <InputNumber placeholder="(562) 596-9800" lable="Fax:" />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="someone@allstate.com" lable="Email:" />
                    </div>
                   
                </form>

            </div>

            <div class="mb-3 ml-3">
                <button type="button" id=""
                    class="btn btn-success input-group-text send_btn notification-position-absolute-right-14px-background-color-218838-color-white-border-color-218838 save-btn-popup popup-heading-color"
                    data-dismiss="modal">Save</button>
                <button type="button" class="btn btn-danger  notification-background-color-grey"
                    onClick={props.hideModal}>Cancle</button>
                    
            </div>
        </>
    );
}

export default ModalBody;


