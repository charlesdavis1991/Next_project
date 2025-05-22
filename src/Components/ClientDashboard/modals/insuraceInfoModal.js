import React from 'react'
import Input from '../shared/input';
import Select from "../shared/select";

const ModalBody = (props) => {
    return (
        <>
            <div class="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
                <h5 class="modal-title mx-auto font-size-24 height-40 font-weight-semibold text-uppercase popup-heading-color font-weight-500" id="avatarModalTitle">
                CLAIM INFORMATION
                </h5>
            </div>
            <p class="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center" id="">Input and edit the information about the insurance claim here.</p>
            <div class="modal-body">
                <form>
                    <div className='mt-2'>
                        <Select placeholder="Type Insurance Company Name" lable="Coverage Type :" />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="0" lable="Liability Limit :" />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="0" lable="Liability Limit All :" />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="238374rr3f" lable="Policy # :" />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="Test" lable="Claim # :" />
                    </div>
                    <div className='mt-2'>
                        <Input type="date" lable="Confirmed Date:" />
                    </div>
                  
                </form>

            </div>

            <div class="mb-3 pl-3">
                <button type="button" id=""
                    class="btn btn-success input-group-text send_btn notification-position-absolute-right-14px-background-color-218838-color-white-border-color-218838 save-btn-popup popup-heading-color"
                    data-dismiss="modal">Save Insurance Claim Information</button>
                <button type="button" class="btn btn-danger  notification-background-color-grey"
                    onClick={props.hideModal}>Cancle</button>
                    
            </div>
        </>
    );
}

export default ModalBody;


