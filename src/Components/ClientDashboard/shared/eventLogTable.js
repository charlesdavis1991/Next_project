import React from "react";

const EventLogTable = () => {
    return (
        <>
            <div class="table--no-card rounded-0 border-0 w-100" id="table-height-event">
                <table class="table table-borderless table-striped table-shared has-height-25">
                    <thead>
                        <tr>
                            <th class="table-col-1 note-col-1 x1" scope="col"></th>
                            <th class="note-col-2 x2">Date</th>
                            <th class="note-col-3 x3">Time</th>
                            <th class="pl-42 td-autosize note-col-4 x4">User</th>
                            <th class="notes-col note-col-5 x5">Event</th>
                            <th class="note-col-7 x6">Code Category</th>
                            <th class="note-col-7 x7">Category Name</th>
                            <th class="note-col-7 x8">Code</th>
                            <th class="note-col-7 x9">Code Name</th>
                            <th class="note-col-7 x10">Code Description</th>
                            <th class="note-col-6 x11">Page</th>
                        </tr>
                    </thead>
                    <tbody class="fixed_column_width" id="event-log-tab-tbody">
                        <tr class="" data-toggle="modal" data-target="#clickkey_abautbms-modal" onclick="click_key_abautbms_func(51,1 )">
                            <td class="" scope="row">1</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    7:49 PM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    User logged in.
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A100
                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">
                                    Activity Codes

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A101

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Plan and Prepare for

                                </div>
                            </td>
                            <td class="hover-button-td" >
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Login Page
                                </div>
                            </td>
                        </tr>
                        <tr class="">
                            <td class="" scope="row">2</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    7:49 PM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">

                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td" >
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Logout Page
                                </div>
                            </td>
                        </tr>
                        <tr class="" data-toggle="modal" data-target="#clickkey_abautbms-modal" onclick="click_key_abautbms_func(51,1 )">
                            <td class="" scope="row">3</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    7:49 PM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    User logged in.
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A100
                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">
                                    Activity Codes

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A101

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Plan and Prepare for

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Login Page
                                </div>
                            </td>
                        </tr>
                        <tr class="">
                            <td class="" scope="row">4</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    6:29 PM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">

                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td" >
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Logout Page
                                </div>
                            </td>
                        </tr>
                        <tr class="">
                            <td class="" scope="row">5</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    6:24 PM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">

                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Logout Page
                                </div>
                            </td>
                        </tr>
                        <tr class="" data-toggle="modal" data-target="#clickkey_abautbms-modal" onclick="click_key_abautbms_func(51,1 )">
                            <td class="" scope="row">6</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    4:24 PM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    User logged in.
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A100
                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">
                                    Activity Codes

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A101

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Plan and Prepare for

                                </div>
                            </td>
                            <td class="hover-button-td" >
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Login Page
                                </div>
                            </td>
                        </tr>
                        <tr class="">
                            <td class="" scope="row">7</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    4:24 PM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">

                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td" >
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Logout Page
                                </div>
                            </td>
                        </tr>
                        <tr class="" data-toggle="modal" data-target="#clickkey_abautbms-modal" onclick="click_key_abautbms_func(51,1 )">
                            <td class="" scope="row">8</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    4:24 PM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    User logged in.
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A100
                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">
                                    Activity Codes

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A101

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Plan and Prepare for

                                </div>
                            </td>
                            <td class="hover-button-td" >
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Login Page
                                </div>
                            </td>
                        </tr>
                        <tr class="" data-toggle="modal" data-target="#clickkey_abautbms-modal" onclick="click_key_abautbms_func(51,1 )">
                            <td class="" scope="row">9</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    12:16 PM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    User logged in.
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A100
                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">
                                    Activity Codes

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A101

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Plan and Prepare for

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Login Page
                                </div>
                            </td>
                        </tr>
                        <tr class="" data-toggle="modal" data-target="#clickkey_abautbms-modal" onclick="click_key_abautbms_func(51,1 )">
                            <td class="" scope="row">10</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    10:49 AM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    User logged in.
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A100
                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">
                                    Activity Codes

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A101

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Plan and Prepare for

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Login Page
                                </div>
                            </td>
                        </tr>
                        <tr class="">
                            <td class="" scope="row">11</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    10:48 AM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">

                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td" >
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Logout Page
                                </div>
                            </td>
                        </tr>
                        <tr class="" data-toggle="modal" data-target="#clickkey_abautbms-modal" onclick="click_key_abautbms_func(51,1 )">
                            <td class="" scope="row">12</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    9:59 AM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    User logged in.
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A100
                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">
                                    Activity Codes

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A101

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Plan and Prepare for

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">


                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Login Page
                                </div>
                            </td>
                        </tr>
                        <tr class="" data-toggle="modal" data-target="#clickkey_abautbms-modal" onclick="click_key_abautbms_func(51,1 )">
                            <td class="" scope="row">13</td>
                            <td class=" hover-button-td">
                                <div class="d-flex align-items-center">
                                    Feb 2, 2024
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center text-lowercase">
                                    9:23 AM
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <span class="d-flex align-items-center" onclick="openNoteMessageModal(event, 'Usama Nawaz', 'https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg', '3', 'no', '')">
                                    <span class="ic-avatar ic-29 has-avatar-icon has-cover-img">
                                        <img class="output-3 theme-ring" src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" />
                                    </span>
                                    <div id="previewProfilePic"></div>
                                    <span class="ml-2 text-black">Usama Nawaz</span>
                                </span>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    User logged in.
                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A100
                                </div>
                            </td>

                            <td class="td-autosize  hover-button-td">
                                <div class="d-flex align-items-center">
                                    Activity Codes

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    A101

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Plan and Prepare for

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">

                                </div>
                            </td>
                            <td class="hover-button-td">
                                <div class="d-flex align-items-center">
                                    Login Page
                                </div>
                            </td>
                        </tr></tbody>
                </table>
            </div>
        </>
    )
}

export default EventLogTable;