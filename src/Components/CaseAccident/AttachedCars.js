import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCarInfo,
  setEditVehicleLocation,
  setPropertyDamage,
} from "../../Redux/accident/accidentSlice";
import { formatPhoneToDashes } from "../../Utils/helper";
import ContactFax from "../common/ContactFax";
import PanelActionBarComponent from "../common/PanelActionBarComponent";
import ContactPanel from "../common/ContactPanel";
import InformationPanel from "../common/InformationPanel";
import NotesPanel from "../NotesPanelSection/NotesPanel";
import GenrateDocument from "../GenrateDocument/GenrateDocument";
import DocumentRow from "../DocumentRow/DocumentRow";

export const AttachedCars = () => {
  const dispatch = useDispatch();
  const accidentData = useSelector((state) => state.accident.current);
  const [showDocument, setShowDocument] = useState(false);
  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);
  const handleGenrateDocument = (instanceId) => {
 
    console.log("HGD instance id == :: ", instanceId);
    setInstanceIdForGenragteDoc(instanceId);
    setShowDocument(true);
  };
  return (
    <>
      {accidentData &&
        accidentData?.attchedCars?.map((vehicleInfo, idx) => (
          <div className="report" key={vehicleInfo?.id}>
            <PanelActionBarComponent
              id={vehicleInfo?.id}
              page_name={"Accident"}
              title={""}
              first_name={vehicleInfo?.make}
              last_name={vehicleInfo?.model}
              report_type_name={"Vehicle"}
            />
            <div className="flex-row d-flex" style={{ overflow: "hidden" }}>
              <div className="row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels">
                <div data-toggle="modal" data-target="#vehicle-location-modal">
                  <ContactPanel
                    id={vehicleInfo?.id}
                    panel_name="Vehicle Location"
                    title={""}
                    name={vehicleInfo?.contact?.name}
                    address1={vehicleInfo?.contact?.address1}
                    address2={vehicleInfo?.contact?.address2}
                    city={vehicleInfo?.contact?.city}
                    state={vehicleInfo?.contact?.state}
                    zip_code={vehicleInfo?.contact?.zip}
                    phone_number={vehicleInfo?.contact?.phone_number}
                    ext={vehicleInfo?.contact?.phone_ext}
                    fax_number={vehicleInfo?.contact?.fax}
                    email={vehicleInfo?.contact?.email}
                    onSelectReport={() => {
                      document
                        .getElementById("vehicle-location-modal")
                        .classList.add("show");
                      console.log("vehicle", vehicleInfo?.contact);
                      dispatch(
                        setEditVehicleLocation({
                          ...vehicleInfo?.contact,
                          vehicle_id: vehicleInfo.id,
                        })
                      );
                    }}
                    buttonData={[
                      {
                        id: "email-button",
                        iconClassName: "ic ic-19 ic-email-3d",
                        buttonText: vehicleInfo?.contact?.email,
                        className:
                          "overflow-hidden info_email m-b-5 p-l-6 p-r-6",
                        style: { height: "25px" },
                        onClick: () => console.log("Email clicked"),
                      },
                      {
                        id: "generate-document-button",
                        iconClassName: "ic ic-19 ic-generate-document",
                        buttonText: "Generate Document",
                        className: "p-l-6 p-r-5",
                        style: { height: "25px" },
                        onClick: (id) => handleGenrateDocument(id),
                      },
                    ]}
                    className="m-t-5"
                  />
                </div>
                <div data-toggle="modal" data-target="#defendant-car-modal">
                  <InformationPanel
                    id={vehicleInfo?.id}
                    panel_name="Car Information"
                    data={[
                      { label: "Make", value: vehicleInfo?.make },
                      { label: "Model", value: vehicleInfo?.model },
                      { label: "Year", value: vehicleInfo?.year },
                      { label: "Mileage", value: vehicleInfo?.mileage },
                      { label: "Color", value: vehicleInfo?.color },
                      { label: "Value", value: vehicleInfo?.value },
                    ]}
                    onSelectReport={() => {
                      dispatch(
                        setCarInfo({
                          id: vehicleInfo?.id,
                          make: vehicleInfo?.make,
                          model: vehicleInfo?.model,
                          year: vehicleInfo?.year,
                          mileage: vehicleInfo?.mileage,
                          color: vehicleInfo?.color,
                          value: vehicleInfo?.value,
                        })
                      );
                    }}
                    hasBtn={false}
                    panelClassName="m-t-5"
                  />
                </div>
                <div data-toggle="modal" data-target="#vehicle-damage-modal">
                  <InformationPanel
                    id={vehicleInfo?.id}
                    panel_name="Car Information"
                    data={[
                      {
                        label: "Property Damage Estimate",
                        value: vehicleInfo?.propDamEst || 0,
                      },
                      {
                        label: "Property Damage Final",
                        value: vehicleInfo?.propDamFinal || 0,
                      },
                    ]}
                    onSelectReport={() => {
                      dispatch(
                        setPropertyDamage({
                          id: vehicleInfo?.id,
                          prop_damage_estimate: vehicleInfo?.propDamEst,
                          prop_damage_final: vehicleInfo?.propDamFinal,
                        })
                      );
                    }}
                    hasBtn={false}
                    panelClassName="m-t-5"
                  />
                </div>
              </div>
              {/* Notes Panel Func */}
              {vehicleInfo &&
              <NotesPanel
                entity_type={"Accident"}
                record_id={vehicleInfo?.record_id}
                module={"Accident"}
                pagePanels={0}
              />}
            </div>
            {/* Document Row Functionality */}
            <div className="row documents-wrapper m-t-5">
              <div className="col-12">
                <div className="height-25">
                  <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
                    &nbsp;Document Row
                  </h4>
                </div>
                {vehicleInfo &&
                <DocumentRow
                  clientProvider={vehicleInfo?.record_id}
                  page="Accident"
                />}
              </div>
            </div>
          </div>
        ))}
      {showDocument && (
        <GenrateDocument
          show={true}
          handleClose={() => setShowDocument(false)}
          PageEntity="Accident"
          instanceId={instanceIdForGenrateDoc}
        />
      )}
      {/* {accidentData &&
        accidentData?.attchedCars?.map((vehicle, index) => ( */}
      {/* <div className="border-box has-checklist rounded-0 m-t-5">
            <div className="expandable-section"> */}
      {/* Checklist Section */}
      {/* <div className="checklist-section-wrapper position-absolute top-0 right-0 z-index-9">
                <div className="skew-box" />
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
                            width={17}
                            height={50}
                            viewBox="0 0 17 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                        <span className="checklist-text">
                          Accident <br />
                          Checklist
                        </span>
                        <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center">
                          <svg
                            width={17}
                            height={50}
                            viewBox="0 0 17 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                              fill="currentColor"
                            />
                            <path
                              d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                              fill="currentColor"
                            />
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
              </div> */}
      {/* Main Data */}
      {/* <div className="row d-block d-md-flex no-gutters has-title-bg m-b-5">
                <div className="col-lg-auto p-0"> */}
      {/* Panel Name */}
      {/* <div className="top-header-wrap">
                    <div className="panel-icon">
                      <i className="ic ic-accident ic-25" />
                    </div>

                    <div className="top-header height-25 d-flex">
                      <div className="top-head d-flex align-items-center top-tt">
                        <div className="d-flex align-items-center">
                          <h2 className="d-flex align-items-center">
                            <small className="font-weight-bold">
                              {vehicle.make} {vehicle.model}
                            </small>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row no-gutters equal-column-wrapper position-relative insurance-cols car-acc-pans-2">
                    <div className="d-md-flex"> */}
      {/* First Contact Panel; */}
      {/* <div
                        className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1"
                        style={{ width: "255px" }}
                      >
                        <div className="information-wrapper">
                          <div
                            data-toggle="modal"
                            onClick={() => {
                              document
                                .getElementById("vehicle-location-modal")
                                .classList.add("show");
                              console.log("vehicle", vehicle.contact);
                              dispatch(
                                setEditVehicleLocation({
                                  ...vehicle?.contact,
                                  vehicle_id: vehicle.id,
                                })
                              );
                            }}
                            data-target="#vehicle-location-modal"
                          >
                            <div className="text-left p-l-5 p-r-5">
                              <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                Vehicle Location
                              </p>
                              {vehicle.contact && (
                                <>
                                  <div>
                                    <p className="colFont m-0 font-weight-semibold info_address">
                                      {vehicle.contact.address1 ? (
                                        vehicle.contact.address1.trim() + ", "
                                      ) : (
                                        <span className="text-primary-20">
                                          Address
                                        </span>
                                      )}
                                      {vehicle.contact.address2}
                                    </p>
                                    <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                                      {vehicle.contact.city ? (
                                        `${vehicle.contact.city.trim()}, `
                                      ) : (
                                        <span className="text-primary-20">
                                          City{" "}
                                        </span>
                                      )}
                                      {vehicle.contact.state ? (
                                        `${vehicle.contact.state} `
                                      ) : (
                                        <span className="text-primary-20">
                                          State{" "}
                                        </span>
                                      )}
                                      {vehicle.contact.zip ? (
                                        vehicle.contact.zip
                                      ) : (
                                        <span className="text-primary-20">
                                          Zip
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                  <p className="colFont info_phone_number text-black">
                                    {vehicle.contact.phone_number ? (
                                      <>
                                        {formatPhoneToDashes(
                                          `${vehicle.contact.phone_number} `
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-primary-20">
                                        (###) ###-####
                                      </span>
                                    )}
                                    {vehicle.contact.phone_ext && (
                                      <>
                                        {vehicle.contact.phone_ext}
                                        <small className="ml-1 text-grey">
                                          ext.
                                        </small>
                                      </>
                                    )}
                                  </p>
                                  <ContactFax faxNumber={vehicle.contact.fax} />
                                </>
                              )}
                            </div>
                          </div>
                          <div>
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5" />
                              {vehicle.contact.email}
                            </a>
                          </div>
                          <div className="mt-auto">
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
                            >
                              <i className="ic ic-19 ic-generate-document m-r-5" />
                              Generate Document
                            </a>
                          </div>
                        </div>
                      </div> */}

      {/* Car Info */}
      {/* <div
                        className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1"
                        style={{ width: "255px" }}
                      >
                        <div className="information-wrapper">
                          <div
                            data-toggle="modal"
                            data-target="#defendant-car-modal"
                            onClick={() => {
                              dispatch(
                                setCarInfo({
                                  id: vehicle.id,
                                  make: vehicle.make,
                                  model: vehicle.model,
                                  year: vehicle.year,
                                  mileage: vehicle.mileage,
                                  color: vehicle.color,
                                  value: vehicle.value,
                                })
                              );
                            }}
                          >
                            <div className="text-left p-l-5 p-r-5">
                              <div className="information-wrapper">
                                <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                  Car Information
                                </p>
                                <div className="row mb-0 colFont">
                                  <div className="col text-left">
                                    <span className="d-inline-block">
                                      Make:
                                    </span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p>{vehicle.make}</p>
                                  </div>
                                </div>
                                <div className="row mb-0 colFont">
                                  <div className="col text-left">
                                    <span className="d-inline-block">
                                      Model:
                                    </span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p>{vehicle.model}</p>
                                  </div>
                                </div>
                                <div className="row mb-0 colFont">
                                  <div className="col text-left">
                                    <span className="d-inline-block">
                                      Year:
                                    </span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p>{vehicle.year}</p>
                                  </div>
                                </div>
                                <div className="row mb-0 colFont">
                                  <div className="col text-left">
                                    <span className="d-inline-block">
                                      Mileage:
                                    </span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p>{vehicle.mileage}</p>
                                  </div>
                                </div>
                                <div className="row mb-0 colFont">
                                  <div className="col text-left">
                                    <span className="d-inline-block">
                                      Color:
                                    </span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p>{vehicle.color}</p>
                                  </div>
                                </div>
                                <div className="row mb-0 colFont">
                                  <div className="col text-left">
                                    <span className="d-inline-block">
                                      Value:
                                    </span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p>{vehicle.value}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
      {/* </div> */}
      {/* Second Panel */}
      {/* <div className="d-flex">
                     
                      <div
                        className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1"
                        data-toggle="modal"
                        data-target="#vehicle-damage-modal"
                        style={{ width: "255px" }}
                        onClick={() => {
                          dispatch(
                            setPropertyDamage({
                              id: vehicle.id,
                              prop_damage_estimate: vehicle.propDamEst,
                              prop_damage_final: vehicle.propDamFinal,
                            })
                          );
                        }}
                      >
                        <div className="text-left p-l-5 p-r-5">
                          <div className="information-wrapper">
                            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                              Car Information
                            </p>
                            <div className="row mb-0 colFont">
                              <div className="col text-left">
                                <span className="d-inline-block">
                                  Property Damage Estimate:
                                </span>
                              </div>
                              <div className="col-auto text-left font-weight-semibold">
                                <p>${vehicle.propDamEst || 0}</p>
                              </div>
                            </div>
                            <div className="row mb-0 colFont">
                              <div className="col text-left">
                                <span className="d-inline-block">
                                  Property Damage Final:
                                </span>
                              </div>
                              <div className="col-auto text-left font-weight-semibold">
                                <p>${vehicle.propDamFinal || 0}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="dynamic-width col-auto d-flex flex-column hidden-panel p-0 p-r-5 width-250 flex-g-1"
                        data-toggle="modal"
                        data-target="#vehicle-description-modal"
                        style={{ width: "255px" }}
                      >
                        <div className="text-left p-l-5 p-r-5">
                          <div className="information-wrapper">
                            <p className="columnsTitle text-primary font-weight-semibold text-uppercase"></p>
                            <div className="row mb-0 colFont">
                              <div className="col text-left">
                                <span className="d-inline-block" />
                              </div>
                              <div className="col-auto text-left font-weight-semibold">
                                <p />
                              </div>
                            </div>
                            <div className="row mb-0 colFont">
                              <div className="col text-left">
                                <span className="d-inline-block" />
                              </div>
                              <div className="col-auto text-left font-weight-semibold">
                                <p />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
      {/* </div>
                </div> */}

      {/* Notes */}
      {/* <div className="d-flex-1 p-0 position-relative z-index-1">
                  <div
                    className="fields-wrap overflow-hidden h-210p"
                    data-toggle="modal"
                    data-target="#individual_notes_modal"
                    onclick="show_notes(this, 'Car1' , 'Car', '1', 'Accident')"
                  >
                    <div
                      className="tab-pane"
                      id="custom-nav-todo"
                      role="tabpanel"
                      aria-labelledby="custom-nav-todo-tab"
                    >
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="table-responsive table--no-card border-0 has-alternate-grey">
                            <div className="fake-rows has-head-25">
                              <div className="fake-row" />
                              <div className="fake-row" />
                              <div className="fake-row" />
                              <div className="fake-row" />
                              <div className="fake-row" />
                            </div>
                            <p className="p-0 height-25 d-flex justify-content-center text-center text-white line-height-25 has-notes-title">
                              Vehicle Notes
                            </p>
                            <div className="table-responsive">
                              <table className="table table-borderless table-striped table-earning">
                                <tbody className="tbody-panels"></tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
      {/* </div> */}

      {/* Document Row */}
      {/* <div className="row documents-wrapper m-b-15">
                <div className="col-12">
                  <div className="mr-lg-3 background-main-10 height-25">
                    <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center">
                      Accident Quick-Access Document Row
                    </h4>
                  </div>
                  <div className="row no-gutters flex-row position-relative pr-lg-3">
                    <div className="col p-0">
                      <div className="d-md-flex justify-content-start w-100">
                        <div className="icon-text-boxes d-flex flex-wrap w-100 quick-doc-row">
                          <div
                            className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-2-12-5 dz-clickable"
                            id="no-vertical-border"
                          >
                            <p className="date" />
                            <span className="icon-wrap">
                              <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                            </span>

                            <p className="name text-lg-grey">
                              1. Defendant Prop
                            </p>
                          </div>
                        </div>
                        <div className="upload-icon-wrap">
                          <div className="upload-icon">
                            <i className="ic ic-64 ic-upload-document cursor-pointer" />
                            To Page
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
      {/* ))} */}
    </>
  );
};
