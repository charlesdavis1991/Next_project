import React from "react";


const Table = () => {
    return (
        <>
            <div class="col-lg-12">
                <div class="row">
                    <div class="table--no-card rounded-0 border-0 w-100 individual_tab_height" id="table-height">
                        <div class="table-div w-100 h-100 position-absolute" ></div>
                        <table class="table table-borderless table-striped table-shared has-height-25" id="table-x">
                            <thead>

                                <tr>
                                    <th class="table-col-1 note-col-1 x1" scope="col" ></th>
                                    <th class="note-col-2 x2" >Date</th>
                                    <th class="note-col-3 x3" >Time</th>
                                    <th class="pl-42 td-autosize note-col-4 x4" >User</th>
                                    <th class="notes-col note-col-5 x5" >Note</th>
                                    <th class="note-col-6 x6" >Category</th>
                                </tr>

                            </thead>
                            <tbody id="table-body-cat" class="fixed_column_width">

                                <tr class="">
                                    <td class="td-autosize" scope="row">1</td>
                                    <td class="td-autosize hover-button-td">
                                        <div class="d-flex align-items-center">
                                            Dec 3, 2023
                                        </div>
                                    </td>
                                    <td class="td-autosize hover-button-td">
                                        <div class="d-flex align-items-center text-lowercase">
                                            12:17 AM
                                        </div>
                                    </td>
                                    <td class="td-autosize hover-button-td">
                                        <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                            <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                            </span>
                                            <div id="previewProfilePic"></div>
                                            <span class="ml-2 text-black">Usama Nawaz</span>
                                        </span>
                                    </td>
                                    <td class="client_page_note_row hover-button-td notes-sec-color-black">
                                        <div class="d-flex align-items-center text-capital">
                                            Accident Information Note:
                                        </div>
                                    </td>
                                    <td class="td-autosize hover-button-td">
                                        <div class="d-flex align-items-center">
                                            Accident
                                        </div>
                                    </td>
                                </tr>
                                <tr class="">
                                    <td class="td-autosize" scope="row">2</td>
                                    <td class="td-autosize hover-button-td">
                                        <div class="d-flex align-items-center">
                                            Sep 14, 2023
                                        </div>
                                    </td>
                                    <td class="td-autosize hover-button-td">
                                        <div class="d-flex align-items-center text-lowercase">
                                            12:15 AM
                                        </div>
                                    </td>
                                    <td class="td-autosize hover-button-td">
                                        <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Tom Cruise', 'https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/AS29/6-profile_pic_29px.png', '19', 'no', '')">
                                            <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/AS29/6-profile_pic_29px.png" />
                                            </span>
                                            <div id="previewProfilePic"></div>
                                            <span class="ml-2 text-black">Tom Cruise</span>
                                        </span>
                                    </td>
                                    <td class="client_page_note_row hover-button-td notes-sec-color-black">
                                        <div class="d-flex align-items-center text-capital">
                                            ergerg
                                        </div>
                                    </td>
                                    <td class="td-autosize hover-button-td">
                                        <div class="d-flex align-items-center">
                                            Accident
                                        </div>
                                    </td>
                                </tr>
                                <tr class="">
                                    <td class="td-autosize" scope="row">3</td>
                                    <td class="td-autosize hover-button-td">
                                        <div class="d-flex align-items-center">
                                            Aug 6, 2023
                                        </div>
                                    </td>
                                    <td class="td-autosize hover-button-td">
                                        <div class="d-flex align-items-center text-lowercase">
                                            5:34 PM
                                        </div>
                                    </td>
                                    <td class="td-autosize hover-button-td">
                                        <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                            <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                            </span>
                                            <div id="previewProfilePic"></div>
                                            <span class="ml-2 text-black">Usama Nawaz</span>
                                        </span>
                                    </td>
                                    <td class="client_page_note_row hover-button-td notes-sec-color-black">
                                        <div class="d-flex align-items-center text-capital">
                                            Test 2
                                        </div>
                                    </td>
                                    <td class="td-autosize hover-button-td">
                                        <div class="d-flex align-items-center">
                                            Accident
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Table;