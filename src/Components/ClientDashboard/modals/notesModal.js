import React from 'react'
import Select from "../shared/select";

const ModalBody = (props) => {
    return (
        <div>
            <div className="modal-header text-center p-0 bg-primary-5 popup-heading-color justify-content-center">
                <h5 className="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase text-primary font-weight-500 d-flex align-items-center modal-title-with-icon">
                    <img src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/to-do-icon.svg" />
                    ASSIGN TASK</h5>
            </div>

            <div className="modal-body">
                <div className="row">
                    <div className="assign_text-field col-9">
                        <textarea className="note_assign_text assign_todo_textarea" onkeyup="enable_assign_todo_btn()" required="" name="description" placeholder="Input a Case Note, New To-Do, or Update the Case Status…"></textarea>
                    </div>
                    <div className='col-3'>
                        <div className="">
                            <div className='mt-2'>
                                <Select placeholder="Type 1" lable="Due:" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="m-r-15 background-main-10 height-25">
                    <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center">CASE WORKERS ASSIGNED TO CASE</h4>
                </div>
                <div className='row'>
                    <div className='col-6'>
                        <table className='table table-borderless table-striped table-earning has-height-25 has-table-sub-panel'>
                            <tbody>
                                <tr>
                                    <td id="padding-l-15"></td>
                                    <td className="td-autosize d-flex justify-content-between align-items-center w-100">
                                        <div className="d-flex">
                                            <button type="button" data-toggle="modal" data-target="#avatarModal" className="btn d-flex align-items-center justify-content-center padding-transform-visibility-margin p-0 flex-g">
                                                <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                </div>
                                                <div className="ml-2 flex-g"> </div>
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="custom-control custom-checkbox m-l-10">
                                                <input type="checkbox" className="custom-control-input todo_popup_checkbox" id="todo_popup_checkbox1_" user_id="" onclick="event.stopPropagation();" />
                                                <label className="custom-control-label" for="todo_popup_checkbox1_"></label>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-end">
                                    </td>
                                </tr>
                                <tr>
                                    <td id="padding-l-15"></td>
                                    <td className="td-autosize d-flex justify-content-between align-items-center w-100">
                                        <div className="d-flex">
                                            <button type="button" data-toggle="modal" data-target="#avatarModal" className="btn d-flex align-items-center justify-content-center padding-transform-visibility-margin p-0 flex-g">
                                                <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                </div>
                                                <div className="ml-2 flex-g"> </div>
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="custom-control custom-checkbox m-l-10">
                                                <input type="checkbox" className="custom-control-input todo_popup_checkbox" id="todo_popup_checkbox1_" user_id="" onclick="event.stopPropagation();" />
                                                <label className="custom-control-label" for="todo_popup_checkbox1_"></label>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-end">
                                    </td>
                                </tr>
                                <tr>
                                    <td id="padding-l-15"></td>
                                    <td className="td-autosize d-flex justify-content-between align-items-center w-100">
                                        <div className="d-flex">
                                            <button type="button" data-toggle="modal" data-target="#avatarModal7" className="btn d-flex align-items-center justify-content-center padding-transform-visibility-margin p-0 flex-g">
                                                <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"><img id="output" src="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/1_1_ErAdzXJ.jpg" /></div>
                                                <div className="ml-2 flex-g">Ali Staff</div>
                                            </button>

                                        </div>

                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="custom-control custom-checkbox m-l-10">
                                                <input type="checkbox" className="custom-control-input todo_popup_checkbox" id="todo_popup_checkbox3_7" user_id="7" onclick="event.stopPropagation();" />
                                                <label className="custom-control-label" for="todo_popup_checkbox3_7"></label>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-end">
                                        1/16/2024
                                    </td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='col-6'>
                        <table className='table table-borderless table-striped table-earning has-height-25 has-table-sub-panel'>
                            <tbody>
                                <tr>
                                    <td id="padding-l-15"></td>
                                    <td className="td-autosize d-flex justify-content-between align-items-center w-100">
                                        <div className="d-flex">
                                            <button type="button" data-toggle="modal" data-target="#avatarModal" className="btn d-flex align-items-center justify-content-center padding-transform-visibility-margin p-0 flex-g">
                                                <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                </div>
                                                <div className="ml-2 flex-g"> </div>
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="custom-control custom-checkbox m-l-10">
                                                <input type="checkbox" className="custom-control-input todo_popup_checkbox" id="todo_popup_checkbox1_" user_id="" onclick="event.stopPropagation();" />
                                                <label className="custom-control-label" for="todo_popup_checkbox1_"></label>
                                            </div>
                                        </div>
                                    </td>

                                </tr>
                                <tr>
                                    <td id="padding-l-15"></td>
                                    <td className="td-autosize d-flex justify-content-between align-items-center w-100">
                                        <div className="d-flex">
                                            <button type="button" data-toggle="modal" data-target="#avatarModal" className="btn d-flex align-items-center justify-content-center padding-transform-visibility-margin p-0 flex-g">
                                                <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                </div>
                                                <div className="ml-2 flex-g"> </div>
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="custom-control custom-checkbox m-l-10">
                                                <input type="checkbox" className="custom-control-input todo_popup_checkbox" id="todo_popup_checkbox1_" user_id="" onclick="event.stopPropagation();" />
                                                <label className="custom-control-label" for="todo_popup_checkbox1_"></label>
                                            </div>
                                        </div>
                                    </td>

                                </tr>
                                <tr>
                                    <td id="padding-l-15"></td>
                                    <td className="td-autosize d-flex justify-content-between align-items-center w-100">
                                        <div className="d-flex">
                                            <button type="button" data-toggle="modal" data-target="#avatarModal7" className="btn d-flex align-items-center justify-content-center padding-transform-visibility-margin p-0 flex-g">
                                                <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"><img id="output" src="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/download.png" /></div>
                                                <div className="ml-2 flex-g">Usama Staff</div>
                                            </button>

                                        </div>

                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="custom-control custom-checkbox m-l-10">
                                                <input type="checkbox" className="custom-control-input todo_popup_checkbox" id="todo_popup_checkbox3_7" user_id="7" onclick="event.stopPropagation();" />
                                                <label className="custom-control-label" for="todo_popup_checkbox3_7"></label>
                                            </div>
                                        </div>
                                    </td>


                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="m-r-15 background-main-10 height-25">
                    <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center">Other Firm users</h4>
                </div>

                <div className='row'>
                    <div className='col-3'>
                        <div className="td-autosize d-flex justify-content-between align-items-center w-100 height-35">
                            <div className="d-flex align-items-center">
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    <img src="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/1.png" alt="" /></span>
                                <span className="ml-2 color-black">Tom Cruise</span>
                            </div>
                            <div>
                                <div className="custom-control custom-checkbox m-l-10 checkbox-event">
                                    <input type="checkbox" className="custom-control-input todo_popup_checkbox " id="todo_popup_checkbox_6" user_id="6" onclick="event.stopPropagation();" />
                                    <label className="custom-control-label" for="todo_popup_checkbox_6"></label>
                                </div>
                            </div>
                        </div>
                        <div className="td-autosize d-flex justify-content-between align-items-center w-100 height-35">
                            <div className="d-flex align-items-center">
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    <img src="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/5-profile_pic_63px_JCmYi0k.jpg" alt="" /></span>
                                <span className="ml-2 color-black">Uneeb Hassan</span>
                            </div>
                            <div>
                                <div className="custom-control custom-checkbox m-l-10 checkbox-event">
                                    <input type="checkbox" className="custom-control-input todo_popup_checkbox " id="todo_popup_checkbox_5" user_id="5" onclick="event.stopPropagation();" />
                                    <label className="custom-control-label" for="todo_popup_checkbox_5"></label>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='col-3'>
                        <div className="td-autosize d-flex justify-content-between align-items-center w-100 height-35">
                            <div className="d-flex align-items-center">
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    <img src="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/1_1.jpg" alt=" " /></span>

                                <span className="ml-2 color-black">Christian Rios</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-end flex-g">
                                <div className="custom-control custom-checkbox m-l-10 checkbox-event">
                                    <input type="checkbox" className="custom-control-input todo_popup_checkbox " id="todo_popup_checkbox_9" user_id="9" onclick="event.stopPropagation();" />
                                    <label className="custom-control-label" for="todo_popup_checkbox_9"></label>
                                </div>
                            </div>
                        </div>

                        <div className="td-autosize d-flex justify-content-between align-items-center w-100 height-35">
                            <div className="d-flex align-items-center">
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></span>
                                <span className="ml-2 color-black">Usama Nawaz</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-end flex-g">
                                <div className="custom-control custom-checkbox m-l-10 checkbox-event">
                                    <input type="checkbox" className="custom-control-input todo_popup_checkbox " id="todo_popup_checkbox_11" user_id="11" onclick="event.stopPropagation();" />
                                    <label className="custom-control-label" for="todo_popup_checkbox_11"></label>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className='col-3'>
                        <div className="td-autosize d-flex justify-content-between align-items-center w-100 height-35">
                            <div className="d-flex align-items-center">
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    <img src="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/1494599203-greatest-superhero-films-iron-man.jpg" alt="" /></span>
                                <span className="ml-2 color-black">Ian Silverthorne</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-end flex-g">
                                <div className="custom-control custom-checkbox m-l-10 checkbox-event">
                                    <input type="checkbox" className="custom-control-input todo_popup_checkbox " id="todo_popup_checkbox_4" user_id="4" onclick="event.stopPropagation();" />
                                    <label className="custom-control-label" for="todo_popup_checkbox_4"></label>
                                </div>
                            </div>
                        </div>

                        <div className="td-autosize d-flex justify-content-between align-items-center w-100 height-35">
                            <div className="d-flex align-items-center">
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></span>
                                <span className="ml-2 color-black">Automatic User</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-end flex-g">
                                <div className="custom-control custom-checkbox m-l-10 checkbox-event">
                                    <input type="checkbox" className="custom-control-input todo_popup_checkbox " id="todo_popup_checkbox_12" user_id="12" onclick="event.stopPropagation();" />
                                    <label className="custom-control-label" for="todo_popup_checkbox_12"></label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-3'>
                        <div className="td-autosize d-flex justify-content-between align-items-center w-100 height-35">
                            <div className="d-flex align-items-center">
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    <img src="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/avatar-05_PmbIVew.jpg" alt="" /></span>
                                <span className="ml-2 color-black">Kamran Dev</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-end flex-g">
                                <div className="custom-control custom-checkbox m-l-10 checkbox-event">
                                    <input type="checkbox" className="custom-control-input todo_popup_checkbox " id="todo_popup_checkbox_1" user_id="1" onclick="event.stopPropagation();" />
                                    <label className="custom-control-label" for="todo_popup_checkbox_1"></label>
                                </div>
                            </div>
                        </div>

                        <div className="td-autosize d-flex justify-content-between align-items-center w-100 height-35">
                            <div className="d-flex align-items-center">
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    <img src="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/avatar-05.jpg" alt="" /></span>
                                <span className="ml-2 color-black">Muhammad Abubakar</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-end flex-g">
                                <div className="custom-control custom-checkbox m-l-10 checkbox-event">
                                    <input type="checkbox" className="custom-control-input todo_popup_checkbox " id="todo_popup_checkbox_8" user_id="8" onclick="event.stopPropagation();" />
                                    <label className="custom-control-label" for="todo_popup_checkbox_8"></label>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="mb-3 ml-3">
                <button type="button" id=""
                    className="btn btn-success input-group-text send_btn notification-position-absolute-right-14px-background-color-218838-color-white-border-color-218838 save-btn-popup popup-heading-color"
                    data-dismiss="modal">Asign New Task</button>
                <button type="button" className="btn btn-danger  notification-background-color-grey"
                    onClick={props.hideModal}>Cancle</button>

            </div>
        </div>
    );
}

export default ModalBody;


