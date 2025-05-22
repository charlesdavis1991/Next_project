import React from 'react'
import Input from '../shared/input';
import Form from "react-bootstrap/Form";
const ModalBody = (props) => {
    return (
        <>
            <div class="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
                <h5 class="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500" id="avatarModalTitle">Send Email to
                    <div class="ic ic-29 email-popup">
                        <img class="notification-position-relative-height-100P" src="https://simplefirm-bucket.s3.amazonaws.com/static/images/CA29/3-profile_pic_29px_t62dbwo.png" />
                    </div>
                    Lakeasha Johnson </h5>
            </div>
            <p class="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center" id="">Your Email Message for this poup goes here.</p>
            <div class="modal-body">
                <div class="btn-group mt-2 ChatB4 justify-content-center" role="group">
                    <button type="button" class="btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5">Testing 1</button>
                    <button type="button" class="btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5 ml-2">Testing 2</button>
                    <button type="button" class="btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5 ml-2">Testing 3</button>
                    <button type="button" class="btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5 ml-2">Testing 4</button>
                </div>
                <form>
                    <div className='p-2'>
                        <div className='d-flex justify-content-space-between'>
                            <div>
                                <label for="w3review mt-3">Chat Subject Greeting:</label>
                            </div>
                            <div>
                            <Form.Check
                                label="Include chat subject greeting"
                                name="group1"
                                type="checkbox"
                                className='custom-checkbox-phone'
                            />
                            </div>
                        </div>
                        <div className=''>
                            <div className='w-100'>
                                <Input placeholder="From the Client regarding Lakeasha Johnson:" flag={true} disabled={true} />
                            </div>
                        </div>
                        <div>
                            <label for="w3review" class="mt-3">Type Mail:</label>
                            <textarea type="text" class="chatMessage notification-border-solid-1px-grey-width-100P-padding-10px" rows="4" cols="50"></textarea>
                        </div>

                    </div>
                </form>
                <div class="k-separator-line col-12"></div>
            </div>

            <div class="mb-3 pl-3">
                <button type="button" id=""
                    class="btn btn-success input-group-text send_btn notification-position-absolute-right-14px-background-color-218838-color-white-border-color-218838 save-btn-popup popup-heading-color"
                    data-dismiss="modal">Send Email To Client</button>
                <button type="button" class="btn btn-danger  notification-background-color-grey"
                    onClick={props.hideModal}>Cancle</button>

            </div>
        </>
    );
}

export default ModalBody;


