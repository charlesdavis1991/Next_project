import React from 'react'
import Input from '../shared/input';
import Form from "react-bootstrap/Form";
import Select from "../shared/select";

const ModalBody = (props) => {
    return (
        <>
            <div class="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
                <h5 class="modal-title mx-auto font-size-24 height-40 font-weight-semibold text-uppercase popup-heading-color font-weight-500" id="avatarModalTitle">
                    SPOUSE
                </h5>
            </div>

            <div class="modal-body">
                <form>
                    <div className='mt-2'>
                        <Select lable="Relationship:" />
                    </div>
                    <div className='d-flex align-items-center'>
                        <div className='mt-2 text-grey'>
                            Discuss:
                        </div>
                        <div className='d-flex justify-content-center mt-2 w-100'>
                            <Form.Check
                                label=""
                                name="group1"
                                type="checkbox"
                                className="cleint-information-checkbox"
                            />
                        </div>
                    </div>
                    <div className='mt-2'>
                        <Input type="date" lable="Marriage Date:" />
                    </div>
                    <div className='d-flex align-items-center'>
                        <div className='mt-2 text-grey'>
                            Divorced:
                        </div>
                        <div className='d-flex justify-content-center mt-2 w-100'>
                            <Form.Check
                                label=""
                                name="group1"
                                type="checkbox"
                                className="cleint-information-checkbox"
                            />
                        </div>
                    </div>
                    <div className='mt-2'>
                        <Input type="date" lable="Divorce Date:" />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="Dallas" lable="Phone:" />
                    </div>

                    <div className='mt-2'>
                        <Input placeholder="75216" lable="Email:" />
                    </div>



                </form>

            </div>

            <div class=" notification-padding-2rem mb-3">
                <button type="button" id=""
                    class="btn btn-success input-group-text send_btn notification-position-absolute-right-14px-background-color-218838-color-white-border-color-218838 save-btn-popup popup-heading-color"
                    data-dismiss="modal" onclick="sendMessageClient()">Save</button>
                <button type="button" class="btn btn-danger  notification-background-color-grey-border-color-grey-position-absolute-left-14px"
                    onClick={props.hideModal}>Cancle</button>
            </div>
        </>
    );
}

export default ModalBody;


