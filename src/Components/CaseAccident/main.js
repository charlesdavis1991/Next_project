import React, { useState, useEffect } from "react";
import "./index.css";
import { CarCase } from "./CarCase";
import { useDispatch, useSelector } from "react-redux";
import {
  getCaseId,
  getClientId,
  fetchShakespeareStatus,
} from "../../Utils/helper";
import { fetchAccidentData } from "../../Redux/accident/accidentSlice";
import api from "../../api/api";
import { AttachedCars } from "./AttachedCars";
import NotesSectionDashboard from "../NotesSectionDashboard/main";
import ActionBarComponent from "../common/ActionBarComponent";

const CaseAccident = () => {
  const dispatch = useDispatch();

  const accidentData = useSelector((state) => state.accident.current);
  const clientId = getClientId();
  const caseId = getCaseId();
  useEffect(() => {
    dispatch(fetchAccidentData(clientId, caseId));
    // api.put(`/api/accidents/${clientId}/${caseId}/`, {
    //   caraccident_id: accidentData.id,
    //   acc_description: "Acc Description",
    // }).then((res) => {
    //   console.log(res);
    // }).catch((err) => {
    //   console.log(err);
    // });
    fetchShakespeareStatus(caseId, clientId, "Accident", dispatch);
    document.body.classList.add("accident-page");
    document.body.classList.remove("case-page");
    document.body.classList.remove("client-page");
    document.body.classList.remove("photos-page");
  }, []);

  const data = [
    {
      label: "Client PD",
      value: "$232300",
    },
    {
      label: "Defendant PD",
      value: "example 1",
    },
    {
      label: "Defendant At-Fault",
      value: "%",
    },
  ];
  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <div className="main-content m-r-5">
      <ActionBarComponent
        src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/car-accident-icon-color.svg"
        page_name={"Car Accident"}
        caseAccident={data}
      />
      {/* <div
        className="action-bar main-action-bar client-BarAlign anti-action-bar case-accident-bar anti-client-BarAlign d-flex m-b-5 margin-left-12 pr-15"
        style={{ left: 148 }}
      >
        <span className="page-icon ml-0">
          <img
            className="translate-note-icon"
            src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/car-accident-icon-color.svg"
          />
        </span>
        <div className="text-wrapper text-white d-flex align-items-center p-l-5">
          <h2 className="text-white mb-0">Car Accident</h2>
          <span className="mx-2 text-white">|</span>
          <ul className="info-list text-white d-flex list-unstyled">
            <li>
              <span className="label">Client PD</span>
              <span className="value">$232300</span>
            </li>
            <li>
              <span className="label">Defendant PD</span>
              <span className="value">example 1</span>
            </li>
            <li>
              <span className="label">Defendant At-Fault</span>
              <span className="value">%</span>
            </li>
          </ul>
        </div>
        <div className="mobile-action-btns ml-auto">
          <button
            className="btn btn-primary rounded-0 position-relative z-index-1 ml-auto height-25 d-flex align-items-center mr-1"
            id="actionbarToggleBtn"
          >
            <span className="font-weight-bold pr-2 text-gold">+</span>Actions
          </button>
        </div>
      </div> */}
      <div
        className="container-fluid overflow-hidden ML5px"
        style={{ paddingRight: "0px" }}
      >
        <div className="row">
          <div className="col-12">
            {/* <div className="border-box has-checklist rounded-0 mr-15 m-t-5 d-none">
              <div className="expandable-section">
                <div className="checklist-section-wrapper position-absolute top-0 right-0 z-index-9">
                  <div className="skew-box"></div>
                  <div className="checklist-section">
                    <div className="dropdown">
                      <button
                        className="dropdown-toggle text-darker d-flex align-items-center justify-content-end w-100"
                        id="myDropdown"
                        type="button"
                        data-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <div className="nt-box"></div>
                        <span className="d-flex align-items-center">
                          <span className="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center text-brightgreen">
                            <svg
                              width="17"
                              height="50"
                              viewBox="0 0 17 50"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                          <span className="checklist-text">
                            Accident <br />
                            Checklist
                          </span>
                          <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center">
                            <svg
                              width="17"
                              height="50"
                              viewBox="0 0 17 50"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                        </span>
                      </button>
                      <div
                        aria-labelledby="myDropdown"
                        className="dropdown-menu dropdown-menu-right dropdown-content"
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="row d-block d-md-flex no-gutters has-title-bg m-b-5">
                  <div className="col-lg-auto p-0">
                    <div className="top-header-wrap">
                      <div className="panel-icon">
                        <i className="ic ic-accident ic-25"></i>
                      </div>
                      <div className="top-header height-25 d-flex">
                        <div className="top-head d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <h2 className="d-flex align-items-center">
                              <small className="font-weight-bold">
                                Side-Swipe Accident
                              </small>
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row no-gutters equal-column-wrapper position-relative insurance-cols car-acc-pans-1">
                      <div className="d-lg-flex">
                        <div
                          className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1"
                          style={{ width: "299px" }}
                        >
                          <div className="information-wrapper h-100">
                            <div
                              data-toggle="modal"
                              onclick="car_accident_contact_modal(this)"
                              data-target="#caraccident-location-modal"
                              data-id="1"
                              data-name="New Location"
                              data-add1="aa"
                              data-add2="bbbb"
                              data-city="LOS ANGELES"
                              data-state="AZ"
                              data-zip="1201"
                              data-phone=""
                              data-phone_ext="None"
                              data-fax=""
                              data-email="None"
                            >
                              <div className="text-left p-l-5 p-r-5">
                                <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                  Accident Location
                                </p>
                                <div>
                                  <p className="colFont m-0 font-weight-semibold info_address">
                                    aa, bbbb
                                  </p>
                                  <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                                    LOS ANGELES, AZ 1201
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div></div>
                            <div className="mt-auto">
                              <a
                                href="#"
                                className="btn btn-primary-lighter btn-white-hover font-weight-semibold text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
                              >
                                <i className="ic ic-19 ic-generate-document m-r-5"></i>
                                Generate Document
                              </a>
                            </div>
                          </div>
                        </div>
                        <div
                          className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1"
                          style={{ width: "299px" }}
                        >
                          <div className="information-wrapper h-100">
                            <div
                              data-toggle="modal"
                              onclick="location_description_modal(this)"
                              data-target="#location-description-modal"
                              data-id="1"
                              data-location_desc="222"
                              data-accident_desc="1111"
                              data-accident_type_id="2"
                              data-accident_type="Side-Swipe Accident"
                            >
                              <div className="text-left p-l-5 p-t-5">
                                <div className="form-group m-b-5">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Location Description"
                                    value="222"
                                  />
                                </div>
                                <div className="form-group m-b-5">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Accident Description"
                                    value="1111"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="form-group m-b-0 mt-auto">
                              <select className="form-select pointer-cursor p-2 letter-template-bckgrnd w-100 text-center">
                                <option>Red-Light Violation</option>

                                <option selected="">Side-Swipe Accident</option>

                                <option>Rear-End Collision</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-lg-flex">
                        <div
                          className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1"
                          data-toggle="modal"
                          data-target="#description-notes-modal"
                          onclick="notes_description_modal(this)"
                          data-id="1"
                          data-ambulance="True"
                          data-emergencyroom="False"
                          data-lossofconc="True"
                          data-reporttaken="False"
                          data-dry="False"
                          data-wet="True"
                          data-raining="True"
                          data-fog="True"
                          data-cloudy="True"
                          style={{ width: "299px" }}
                        >
                          <div className="text-left p-l-5 p-r-5">
                            <div className="information-wrapper h-100">
                              <p className="columnsTitle text-primary text-center text-centerfont-weight-semibold text-uppercase">
                                Accident Information
                              </p>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block">
                                    Ambulance
                                  </span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>Yes </p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block">
                                    Emergency Room
                                  </span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>No</p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block">
                                    Loss of Consciousness
                                  </span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>Yes</p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block">
                                    Report Taken
                                  </span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>No</p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block">Dry</span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>No</p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block">Wet</span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>Yes</p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block">
                                    Raining
                                  </span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>Yes</p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block">Fog</span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>Yes</p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block">Cloudy</span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>Yes</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="dynamic-width col-auto d-flex flex-column hidden-panel p-0 p-r-5 width-250 flex-g-1"
                          data-toggle="modal"
                          data-target="#description-notes-modal"
                          style={{ width: "299px" }}
                        >
                          <div className="text-left  p-l-5 p-r-5">
                            <div className="information-wrapper h-100">
                              <p className="columnsTitle text-primary font-weight-semibold text-uppercase"></p>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block"></span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p></p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block"></span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p></p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block"></span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p></p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block"></span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p></p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex-1 p-0 position-relative z-index-1">
                    <div className="fields-wrap overflow-hidden h-210p">
                      <div
                        className="tab-pane"
                        id="custom-nav-todo"
                        role="tabpanel"
                        aria-labelledby="custom-nav-todo-tab"
                      >
                        <div className="col-lg-12">
                          <div className="row">
                            <div className="table-responsive table--no-card border-0 has-alternate-grey">
                              <div
                                className="fake-rows has-head-25"
                                data-toggle="modal"
                                data-target="#individual_notes_modal"
                                onclick="show_notes(this, 'CarAccident1' , 'CarAccident', '1', 'Accident')"
                              >
                                <div className="fake-row"></div>
                                <div className="fake-row"></div>
                                <div className="fake-row"></div>
                                <div className="fake-row"></div>
                                <div className="fake-row"></div>
                              </div>
                              <p className="p-0 height-25 d-flex justify-content-center text-center text-white line-height-25">
                                Accident Notes
                              </p>
                              <div className="table-responsive">
                                <table
                                  className="table table-borderless table-striped table-earning"
                                  data-toggle="modal"
                                  data-target="#individual_notes_modal"
                                  onclick="show_notes(this, 'CarAccident1' , 'CarAccident', '1', 'Accident')"
                                >
                                  <tbody className="tbody-panels">
                                    <tr>
                                      <td className="td-autosize serial-number"></td>
                                      <td className="td-autosize">
                                        Apr 18, 2024
                                      </td>
                                      <td className="td-autosize">2:42 p.m.</td>
                                      <td className="td-autosize">
                                        <div className=" d-flex align-items-center">
                                          <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></span>
                                          <span className="ml-2 text-black">
                                            Aqeel Dev
                                          </span>
                                        </div>
                                      </td>
                                      <td className="client_page_note_row Exp-color-white-space-word-wrap">
                                        Accident Information Note: Test
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="td-autosize serial-number"></td>
                                      <td className="td-autosize">
                                        Jan 20, 2024
                                      </td>
                                      <td className="td-autosize">8:26 p.m.</td>
                                      <td className="td-autosize">
                                        <div className=" d-flex align-items-center">
                                          <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></span>
                                          <span className="ml-2 text-black">
                                            Usama Nawaz
                                          </span>
                                        </div>
                                      </td>
                                      <td className="client_page_note_row Exp-color-white-space-word-wrap">
                                        Accident Information Note: 85
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="td-autosize serial-number"></td>
                                      <td className="td-autosize">
                                        Dec 03, 2023
                                      </td>
                                      <td className="td-autosize">
                                        12:17 a.m.
                                      </td>
                                      <td className="td-autosize">
                                        <div className=" d-flex align-items-center">
                                          <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></span>
                                          <span className="ml-2 text-black">
                                            Usama Nawaz
                                          </span>
                                        </div>
                                      </td>
                                      <td className="client_page_note_row Exp-color-white-space-word-wrap">
                                        Accident Information Note:
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="td-autosize serial-number"></td>
                                      <td className="td-autosize">
                                        Dec 03, 2023
                                      </td>
                                      <td className="td-autosize">
                                        12:16 a.m.
                                      </td>
                                      <td className="td-autosize">
                                        <div className=" d-flex align-items-center">
                                          <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></span>
                                          <span className="ml-2 text-black">
                                            Usama Nawaz
                                          </span>
                                        </div>
                                      </td>
                                      <td className="client_page_note_row Exp-color-white-space-word-wrap">
                                        Accident Information Note: testing mz
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="border-box has-checklist rounded-0">
              <CarCase />
              <AttachedCars />
              <NotesSectionDashboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseAccident;
