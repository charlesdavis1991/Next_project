import React from 'react'
import Input from '../shared/input';
import Select from "../shared/select";

const ModalBody = (props) => {
    return (
        <>
            <div class="modal-header text-center p-2 justify-content-center">
                <h5 class="modal-title mx-auto font-size-24 height-40 font-weight-semibold text-black font-weight-500" id="avatarModalTitle">
                Information
                </h5>
            </div>
           
            <div class="modal-body">
                <form>
                    <div className='mt-2'>
                        <Select placeholder="Type 1" lable="Counsel Type:" />
                    </div>
                    <div className='mt-2'>
                        <Input placeholder="556677" lable="File Number" />
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


