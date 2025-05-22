import React, { useState } from "react";
import CarAccidentModal from "./CarAccidentModal";
import { useSelector } from "react-redux";
import { VehicleNotesTable } from "./VehicleNotesTable";
import InformationPanel from "../common/InformationPanel";
import ContactPanel from "../common/ContactPanel";
import TextPanel from "../common/TextPanel";
import GenrateDocument from "../GenrateDocument/GenrateDocument";
import DefaultThumbnail from "../common/defaultPhotoSlot";
import DocumentRow from "../DocumentRow/DocumentRow";
import { Modal } from "react-bootstrap";
import "./accident-car-case.css";
import NotesPanel from "../NotesPanelSection/NotesPanel";

export const CarCase = () => {
  const accidentData = useSelector((state) => state.accident.current);
  const accidentDefendants = useSelector((state) => state.accident?.defendants);
  const [modalOpen, setModalOpen] = useState(false);
  const [showTab, setShowTab] = useState(null);
  const [showVehicleNotes, setShowVehicleNotes] = useState(false);
  const notes = useSelector((state) => state.accident?.notes);
  const [showDocument, setShowDocument] = useState(false);
  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);

  function yesNo(value) {
    return value ? "Yes" : "No";
  }

  const openDialog = (type) => {
    setModalOpen(!modalOpen);
    setShowTab(type);
  };
  const showNotes = () => {
    const newDiv = document.createElement("div");
    newDiv.className = "modal-backdrop show";
    setModalOpen(!modalOpen);
    setShowVehicleNotes(!showVehicleNotes);
    document.body.classList.add("modal-open", "has-blurred-bg");
    document.body.appendChild(newDiv);
  };

  const handleClose = () => {
    setModalOpen(false);
    setShowTab(null);
    setShowVehicleNotes(false);
  };
  const open = useSelector((state) => state?.open?.open);
 

  const handleGenrateDocument = (instanceId) => {
    console.log("HGD instance id == :: ", instanceId);
    setInstanceIdForGenragteDoc(instanceId);
    setShowDocument(true);
  };

  const AccidentInfoData = [
    { label: "Ambulance", value: yesNo(accidentData?.ambulance) },
    { label: "Emergency Room", value: yesNo(accidentData?.emergencyRoom) },
    { label: "Loss of Consciousness", value: yesNo(accidentData?.lossOfConc) },
    { label: "Report Taken", value: yesNo(accidentData?.reportTaken) },
    {
      label: "Weather",
      value: `${accidentData?.dry ? "Dry" : ""} 
              ${accidentData?.wet ? "Wet" : ""} 
              ${accidentData?.raining ? "Raining" : ""} 
              ${accidentData?.fog ? "Fog" : ""} 
              ${accidentData?.cloudy ? "Cloudy" : ""}`
        .trim()
        .replace(/\s+/g, ", "),
    },
  ];

  const AccidentLocationBtnData = [
    {
      id: "email-button",
      iconClassName: "ic ic-19 ic-email-3d",
      buttonText: accidentData?.contact?.email,
      className: "p-l-6 p-r-6 m-b-5",
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
  ];

  const AccidentDefendantInfo =
    accidentDefendants?.length > 0
      ? accidentDefendants.map((defendant) => ({
          label: `${defendant?.first_name} ${defendant?.last_name}`,
          value: `${parseInt(defendant.fault_percent)}%`,
        }))
      : [];

  return (
    <>
      <div className="row no-gutters flex-nowrap top-panel-parent p-r-5 p-l-5">
        <div className="col-auto p-0 flex-g-1 m-b-5">
          {/* Accident Panels */}
          <div className="d-flex flex-row" style={{ overflow: "hidden" }}>
            <div className="row no-gutters equal-column-wrapper position-relative">
              <div className="col-auto d-flex p-0 top-content-panels flex-g-1 p-t-5">
                <InformationPanel
                  id={accidentData?.id}
                  panel_name="Accident Information"
                  data={AccidentInfoData}
                  hasBtn={false}
                  onSelectReport={() => openDialog("accidentInfo")}
                />

                <ContactPanel
                  id={accidentDefendants?.id}
                  panel_name="Accident Location"
                  name={accidentData?.contact?.name}
                  address1={accidentData?.contact?.address1}
                  address2={accidentData?.contact?.address2}
                  city={accidentData?.contact?.city}
                  state={accidentData?.contact?.state}
                  zip_code={accidentData?.contact?.zip}
                  phone_number={accidentData?.contact?.phone_number}
                  ext={accidentData?.contact?.phone_ext}
                  fax_number={accidentData?.contact?.fax}
                  email={accidentData?.contact?.email}
                  onSelectReport={() => openDialog("accidentLocation")}
                  buttonData={AccidentLocationBtnData}
                />

                <TextPanel
                  object={{
                    statement_summary: accidentData?.accident_description,
                  }}
                  panel_name="Accident Description"
                  className="info-div-witness-statement-summary"
                  onSelect={() => {
                    openDialog("accidentDesc");
                  }}
                  primaryText="Click to add Accident Description"
                />

                <TextPanel
                  object={{
                    statement_summary: accidentData?.description,
                  }}
                  panel_name="Location Description"
                  className="info-div-witness-statement-summary"
                  onSelect={() => {
                    openDialog("locationDesc");
                  }}
                  primaryText="Click to add Location Description"
                />

                <InformationPanel
                  id={accidentData?.id}
                  panel_name="Defendants At-Fault"
                  data={AccidentDefendantInfo}
                  hasBtn={false}
                  onSelectReport={() => openDialog("defendantsFault")}
                />
              </div>
            </div>
            {accidentData &&
            <NotesPanel
              entity_type={"Accident"}
              record_id={accidentData?.id}
              module={"Accident"}
              pagePanels={0}
            />
}
          </div>
        </div>
        <div className="panel-pictures d-flex-2 p-0 position-relative z-index-1 p-t-5 m-b-5 p-l-5">
          {/* Accident Photos */}
          <div className="row justify-content-md-end no-gutters case-photos flex-not-wrap f-gap-05">
            {accidentDefendants && accidentDefendants.length > 0 ? (
              accidentDefendants.map((defendant) => (
                <>
                  {defendant.photos && defendant.photos.length > 0 ? (
                    defendant.photos.map((photo, idx) => (
                      <div className={`image-${idx + 1}`}>
                        <div className="img-cover-block img-box">
                          {photo.image ? (
                            <img
                              src={photo.image}
                              className="img-cover object-center d-flex"
                              style={{
                                maxHeight: "181px",
                                maxWidth: "255px",
                                width: "auto",
                                height: "auto",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <DefaultThumbnail
                              height="181px"
                              width="255px"
                              cloudSnowColor="var(--primary-10)"
                              colorSunMountain="var(--primary-15)"
                              borderColor="var(--primary-20)"
                              photoData={photo}
                            />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <DefaultThumbnail
                      height="181px"
                      width="255px"
                      cloudSnowColor="var(--primary-10)"
                      colorSunMountain="var(--primary-15)"
                      borderColor="var(--primary-20)"
                    />
                  )}
                </>
              ))
            ) : (
              <DefaultThumbnail
                height="181px"
                width="255px"
                cloudSnowColor="var(--primary-10)"
                colorSunMountain="var(--primary-15)"
                borderColor="var(--primary-20)"
              />
            )}
          </div>
        </div>
      </div>
      <div className="row documents-wrapper m-t-5">
        <div className="col-12">
          <div className="height-25">
            <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
              Accident Document Row
            </h4>
          </div>
         {accidentData && <DocumentRow clientProvider={accidentData?.id} page="Accident" />}
        </div>
      </div>
      {/* <div
        className="expandable-section position-relative"
        style={{ zIndex: open ? "0" : "" }}
      > */}
      {/* <div className="checklist-section-wrapper position-absolute top-0 right-0 z-index-9">
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
        </div> */}

      {/* <div className="row d-block d-md-flex no-gutters has-title-bg flex-lg-nowrap">
          <div className="col-lg-9 p-0 panels-side"> */}
      {/* <div className="top-header-wrap">
              <div className="panel-icon">
                <i className="ic ic-accident ic-25"></i>
              </div>
              <div className="top-header height-25 d-flex">
                <div className="top-head d-flex align-items-center top-tt">
                  <div className="d-flex align-items-center">
                    <h2 className="d-flex align-items-center">
                      <small className="font-weight-bold">
                        {accidentData && accidentData?.accident_type?.name && (
                          <>{accidentData.accident_type.name}</>
                        )}
                      </small>
                    </h2>
                  </div>
                </div>
              </div>
            </div> */}

      {/* <div className="row no-gutters details-panel"> */}

      {/* Accident Info */}
      {/* <div
                className="panel-detail accident-info p-t-5"
                style={{ paddingBottom: "35px" }}
                onClick={() => openDialog("accidentInfo")}
              >
                <h5 className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                  Accident Information
                </h5>

                <div className="panel-body">
                  <div className="data-row">
                    <p className="colFont text-black d-flex justify-content-between">
                      <span>Ambulance</span>
                      <strong>{yesNo(accidentData?.ambulance)}</strong>
                    </p>
                  </div>
                  <div className="data-row">
                    <p className="colFont text-black d-flex justify-content-between">
                      <span>Emergency Room</span>
                      <strong>{yesNo(accidentData?.emergencyRoom)}</strong>
                    </p>
                  </div>
                  <div className="data-row">
                    <p className="colFont text-black d-flex justify-content-between">
                      <span>Loss of Consciousness</span>
                      <strong>{yesNo(accidentData?.lossOfConc)}</strong>
                    </p>
                  </div>
                  <div className="data-row">
                    <p className="colFont text-black d-flex justify-content-between">
                      Report Taken
                      <strong>{yesNo(accidentData?.reportTaken)}</strong>
                    </p>
                  </div>
                  <div
                    className="d-flex flex-column justify-content-start"
                    style={{
                      padding: "0px 5px",
                    }}
                  >
                    {accidentData?.dry &&
                      accidentData?.wet &&
                      accidentData?.raining &&
                      accidentData?.fog &&
                      accidentData?.cloudy && (
                        <>
                          <p className="font-weight-bold">Weather: &nbsp;</p>
                          <p className="ml-2">
                            {accidentData?.dry && <span>Dry, </span>}
                            {accidentData?.wet && <span>Wet, </span>}
                            {accidentData?.raining && <span>Raining, </span>}
                            {accidentData?.fog && <span>Fog, </span>}
                            {accidentData?.cloudy && <span>Cloudy</span>}
                          </p>
                        </>
                      )}
                  </div>
                </div>
              </div> */}

      {/* Accident Location */}
      {/* <div
                className="panel-detail p-t-5 p-b-5"
                onClick={() => openDialog("accidentLocation")}
              >
                <div>
                  <h5 className="columnsTitle text-primary">
                    Accident Location
                  </h5>
                  {accidentData && accidentData?.contact && (
                    <div>
                      <p className="colFont m-0 font-weight-semibold info_address">
                        {accidentData.contact.address1 ? (
                          accidentData.contact.address1.trim() + ", "
                        ) : (
                          <span className="text-primary-20">Address</span>
                        )}
                        {accidentData.contact.address2}
                      </p>
                      <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                        {accidentData.contact.city ? (
                          `${accidentData.contact.city.trim()}, `
                        ) : (
                          <span className="text-primary-20">City </span>
                        )}
                        {accidentData.contact.state ? (
                          `${accidentData.contact.state} `
                        ) : (
                          <span className="text-primary-20">State </span>
                        )}
                        {accidentData.contact.zip ? (
                          accidentData.contact.zip
                        ) : (
                          <span className="text-primary-20">Zip</span>
                        )}
                      </p>
                      <p
                        className="colFont m-0"
                        style={{
                          visibility: "hidden",
                        }}
                      >
                        DUMMY TEXT TO KEEP THE HEIGHT
                      </p>
                      <p
                        className="colFont m-0"
                        style={{
                          visibility: "hidden",
                        }}
                      >
                        DUMMY TEXT TO KEEP THE HEIGHT
                      </p>
                      <p
                        className="colFont m-0"
                        style={{
                          visibility: "hidden",
                        }}
                      >
                        DUMMY TEXT TO KEEP THE HEIGHT
                      </p>
                      <p
                        className="colFont m-0"
                        style={{
                          visibility: "hidden",
                        }}
                      >
                        DUMMY TEXT TO KEEP THE HEIGHT
                      </p>
                    </div>
                  )}
                </div>
                <a
                  href="#"
                  className="btn btn-generate font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center m-t-5"
                >
                  <i className="ic ic-19 ic-generate-document m-r-5"></i>
                  Generate Document
                </a>
              </div> */}

      {/* Accident Description */}
      {/* <div
                className="panel-detail accident-description p-t-5 p-b-5"
                onClick={() => openDialog("accidentDesc")}
              >
                <h5 className="columnsTitle text-primary">
                  Accident Description
                </h5>
                <div
                  className="panel-body"
                  style={{
                    height: "156px",
                  }}
                >
                  <div className="data-row">
                    {accidentData?.accident_description ? (
                      <p>{accidentData?.accident_description}</p>
                    ) : (
                      <span className="text-primary-20">
                        Click to add an accident description
                      </span>
                    )}
                  </div>
                </div>
              </div> */}

      {/* Location Description */}
      {/* <div
                className="panel-detail location-description p-t-5 p-b-5"
                onClick={() => openDialog("locationDesc")}
              >
                <h5 className="columnsTitle text-primary">
                  Location Description
                </h5>
                <div
                  className="panel-body"
                  style={{
                    height: "156px",
                  }}
                >
                  <div className="data-row">
                    {accidentData?.description ? (
                      <p>{accidentData?.description}</p>
                    ) : (
                      <span className="text-primary-20">
                        Click to add a location description
                      </span>
                    )}
                  </div>
                </div>
              </div> */}

      {/* Defendants at Fault */}
      {/* <div
                className="panel-detail defendants-fault p-t-5 p-b-5"
                onClick={() => openDialog("defendantsFault")}
              >
                <h5 className="columnsTitle text-primary">
                  Defendants At-Fault
                </h5>
                <div
                  className="panel-body"
                  style={{
                    height: "140px",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                  }}
                >
                  {accidentDefendants && accidentDefendants?.length > 0 ? (
                    accidentDefendants?.map((defendant) => (
                      <div className="data-row" key={defendant.id}>
                        <p className="colFont text-black d-flex justify-content-between">
                          {defendant?.first_name} {defendant?.last_name}
                          <strong>{parseInt(defendant.fault_percent)}%</strong>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No defendants found</p>
                  )}
                </div>
              </div> */}

      {/* Photo Panel */}
      {/* <div className="panel-detail photo p-t-5 p-b-5">
                <h5 className="columnsTitle text-primary"></h5>
                <div className="panel-body">
                  {accidentDefendants && accidentDefendants?.length > 0 ? (
                    accidentDefendants?.map((defendant) => (
                      <div key={defendant.id}>
                        {defendant?.photos && defendant?.photos.length > 0 ? (
                          defendant?.photos.map((photo) => (
                            <img
                              src={photo?.image}
                              alt="defendant"
                              className="defendant-photo"
                              key={photo.id}
                              role="button"
                              data-toggle="modal"
                              data-target="#images-gallery-modal"
                            />
                          ))
                        ) : (
                          <div className="h-100 d-flex justify-content-center align-items-center">
                            <div className="defendant-placeholder">
                              <svg
                                width="255px"
                                height="157px"
                                viewBox="10 2 4 22"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <g>
                                    <path
                                      d="M8,13L12,18L10,18L9,17L8,18L7,17L6,18L4,18L8,13Z"
                                      style={{
                                        fill: "rgb(220,225,230)",
                                        fillRule: "nonzero",
                                      }}
                                    />
                                    <path
                                      d="M1,20L8,13L15,20"
                                      style={{
                                        fill: "none",
                                        fillRule: "nonzero",
                                        stroke: "rgb(165,175,190)",
                                        strokeWidth: 2,
                                      }}
                                    />
                                    <path
                                      d="M23,20L19,16L12,23"
                                      style={{
                                        fill: "none",
                                        fillRule: "nonzero",
                                        stroke: "rgb(165,175,190)",
                                        strokeWidth: 2,
                                      }}
                                    />
                                    <path
                                      d="M8.508,5C7.729,5 7.132,5.482 6.762,6.109C5.99,5.876 5.296,6.344 5.113,7.16C4.499,7.348 4,7.828 4,8.5C4,9.323 4.677,10 5.5,10L10.5,10C11.323,10 12,9.323 12,8.5C12,7.718 11.371,7.105 10.604,7.043C10.55,5.918 9.645,5 8.508,5Z"
                                      style={{
                                        fill: "rgb(220,225,230)",
                                        fillRule: "nonzero",
                                      }}
                                    />
                                    <path
                                      d="M17.212,5.339C17.114,5.183 16.886,5.183 16.788,5.339L16.282,6.149C16.274,6.162 16.261,6.172 16.245,6.177C16.23,6.182 16.213,6.181 16.198,6.173L15.353,5.724C15.19,5.637 14.993,5.751 14.986,5.936L14.953,6.87C14.952,6.892 14.943,6.913 14.928,6.928C14.913,6.943 14.892,6.952 14.87,6.953L13.936,6.986C13.751,6.992 13.637,7.19 13.724,7.353L14.173,8.199C14.181,8.213 14.182,8.229 14.177,8.245C14.172,8.26 14.162,8.274 14.149,8.282L13.339,8.788C13.183,8.886 13.183,9.114 13.339,9.212L14.149,9.718C14.163,9.726 14.172,9.74 14.177,9.755C14.182,9.77 14.181,9.787 14.173,9.802L13.724,10.647C13.637,10.81 13.751,11.008 13.936,11.014L14.87,11.047C14.892,11.048 14.913,11.057 14.928,11.072C14.943,11.087 14.952,11.108 14.953,11.13L14.986,12.064C14.993,12.249 15.19,12.363 15.353,12.276L16.198,11.827C16.213,11.819 16.23,11.818 16.245,11.823C16.261,11.828 16.274,11.838 16.282,11.851L16.788,12.661C16.886,12.817 17.114,12.817 17.212,12.661L17.717,11.852C17.726,11.838 17.74,11.828 17.756,11.822C17.77,11.817 17.787,11.819 17.801,11.827L18.647,12.276C18.81,12.363 19.008,12.249 19.014,12.064L19.047,11.13C19.048,11.108 19.057,11.087 19.072,11.072C19.087,11.057 19.108,11.048 19.13,11.047L20.064,11.014C20.249,11.008 20.363,10.81 20.276,10.647L19.827,9.801C19.819,9.787 19.818,9.771 19.823,9.755C19.828,9.74 19.838,9.726 19.851,9.718L20.661,9.212C20.817,9.114 20.817,8.886 20.661,8.788L19.851,8.282C19.838,8.274 19.828,8.26 19.823,8.245C19.818,8.229 19.819,8.213 19.827,8.199L20.276,7.353C20.363,7.19 20.249,6.992 20.064,6.986L19.13,6.953C19.108,6.952 19.087,6.943 19.072,6.928C19.057,6.913 19.048,6.892 19.047,6.87L19.014,5.936C19.008,5.751 18.81,5.637 18.647,5.724L17.802,6.173C17.787,6.181 17.77,6.182 17.755,6.177C17.74,6.172 17.726,6.162 17.718,6.149L17.212,5.339Z"
                                      style={{
                                        fill: "rgb(165,175,190)",
                                        fillRule: "nonzero",
                                      }}
                                    />
                                    <circle
                                      cx={17}
                                      cy={9}
                                      r={2}
                                      style={{ fill: "white" }}
                                    />
                                  </g>
                                </g>
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="h-100 d-flex justify-content-center align-items-center">
                      <div className="defendant-placeholder">
                        <svg
                          width="255px"
                          height="157px"
                          viewBox="10 2 4 22"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <g>
                              <path
                                d="M8,13L12,18L10,18L9,17L8,18L7,17L6,18L4,18L8,13Z"
                                style={{
                                  fill: "rgb(220,225,230)",
                                  fillRule: "nonzero",
                                }}
                              />
                              <path
                                d="M1,20L8,13L15,20"
                                style={{
                                  fill: "none",
                                  fillRule: "nonzero",
                                  stroke: "rgb(165,175,190)",
                                  strokeWidth: 2,
                                }}
                              />
                              <path
                                d="M23,20L19,16L12,23"
                                style={{
                                  fill: "none",
                                  fillRule: "nonzero",
                                  stroke: "rgb(165,175,190)",
                                  strokeWidth: 2,
                                }}
                              />
                              <path
                                d="M8.508,5C7.729,5 7.132,5.482 6.762,6.109C5.99,5.876 5.296,6.344 5.113,7.16C4.499,7.348 4,7.828 4,8.5C4,9.323 4.677,10 5.5,10L10.5,10C11.323,10 12,9.323 12,8.5C12,7.718 11.371,7.105 10.604,7.043C10.55,5.918 9.645,5 8.508,5Z"
                                style={{
                                  fill: "rgb(220,225,230)",
                                  fillRule: "nonzero",
                                }}
                              />
                              <path
                                d="M17.212,5.339C17.114,5.183 16.886,5.183 16.788,5.339L16.282,6.149C16.274,6.162 16.261,6.172 16.245,6.177C16.23,6.182 16.213,6.181 16.198,6.173L15.353,5.724C15.19,5.637 14.993,5.751 14.986,5.936L14.953,6.87C14.952,6.892 14.943,6.913 14.928,6.928C14.913,6.943 14.892,6.952 14.87,6.953L13.936,6.986C13.751,6.992 13.637,7.19 13.724,7.353L14.173,8.199C14.181,8.213 14.182,8.229 14.177,8.245C14.172,8.26 14.162,8.274 14.149,8.282L13.339,8.788C13.183,8.886 13.183,9.114 13.339,9.212L14.149,9.718C14.163,9.726 14.172,9.74 14.177,9.755C14.182,9.77 14.181,9.787 14.173,9.802L13.724,10.647C13.637,10.81 13.751,11.008 13.936,11.014L14.87,11.047C14.892,11.048 14.913,11.057 14.928,11.072C14.943,11.087 14.952,11.108 14.953,11.13L14.986,12.064C14.993,12.249 15.19,12.363 15.353,12.276L16.198,11.827C16.213,11.819 16.23,11.818 16.245,11.823C16.261,11.828 16.274,11.838 16.282,11.851L16.788,12.661C16.886,12.817 17.114,12.817 17.212,12.661L17.717,11.852C17.726,11.838 17.74,11.828 17.756,11.822C17.77,11.817 17.787,11.819 17.801,11.827L18.647,12.276C18.81,12.363 19.008,12.249 19.014,12.064L19.047,11.13C19.048,11.108 19.057,11.087 19.072,11.072C19.087,11.057 19.108,11.048 19.13,11.047L20.064,11.014C20.249,11.008 20.363,10.81 20.276,10.647L19.827,9.801C19.819,9.787 19.818,9.771 19.823,9.755C19.828,9.74 19.838,9.726 19.851,9.718L20.661,9.212C20.817,9.114 20.817,8.886 20.661,8.788L19.851,8.282C19.838,8.274 19.828,8.26 19.823,8.245C19.818,8.229 19.819,8.213 19.827,8.199L20.276,7.353C20.363,7.19 20.249,6.992 20.064,6.986L19.13,6.953C19.108,6.952 19.087,6.943 19.072,6.928C19.057,6.913 19.048,6.892 19.047,6.87L19.014,5.936C19.008,5.751 18.81,5.637 18.647,5.724L17.802,6.173C17.787,6.181 17.77,6.182 17.755,6.177C17.74,6.172 17.726,6.162 17.718,6.149L17.212,5.339Z"
                                style={{
                                  fill: "rgb(165,175,190)",
                                  fillRule: "nonzero",
                                }}
                              />
                              <circle
                                cx={17}
                                cy={9}
                                r={2}
                                style={{ fill: "white" }}
                              />
                            </g>
                          </g>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div> */}
      {/* </div>
          </div> */}

      {/* Notes table */}
      {/* <div className="sec-notes col-lg-3 mt-4 p-0 position-relative notes-side">
            <div
              className="fields-wrap"
              data-toggle="modal"
              data-target="#individual_notes_modal"
              // onClick={showNotes}
            >
              <div
                className="tab-pane"
                id="custom-nav-todo"
                role="tabpanel"
                aria-labelledby="custom-nav-todo-tab"
              >
                <div className="col-lg-12">
                  <div className="row">
                    <div className="table--no-card border-0 has-alternate-grey w-100">
                      {notes && notes.length > 0 ? (
                        <div className="notes-table">
                          <VehicleNotesTable />
                        </div>
                      ) : (
                        <div className="fake-rows has-head-25">
                          <div className="fake-row"></div>
                          <div className="fake-row"></div>
                          <div className="fake-row"></div>
                          <div className="fake-row"></div>
                          <div className="fake-row"></div>
                        </div>
                      )}
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
                      <p className="date"></p>
                      <span className="icon-wrap">
                        <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer"></i>
                      </span>
                      <p className="name text-lg-grey">1. Defendant Prop</p>
                    </div>
                  </div>
                  <div className="upload-icon-wrap">
                    <div className="upload-icon">
                      <i className="ic ic-64 ic-upload-document cursor-pointer"></i>
                      To Page
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      {/* </div> */}
      {showDocument && (
        <GenrateDocument
          show={true}
          handleClose={() => setShowDocument(false)}
          PageEntity="Accident"
          instanceId={instanceIdForGenrateDoc}
        />
      )}
      {modalOpen && (
        <Modal
          show={modalOpen}
          onHide={handleClose}
          id="accident-info-modal"
          tabIndex={-1}
          role="dialog"
          size="lg"
          centered
          aria-labelledby="edit-case-dates-modal"
          style={{ maxWidth: "5120px" }}
          className="universal-document-modal accident-car-case-modal-width"
        >
          <Modal.Body
            className="modal-2xl modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              {showTab && (
                <CarAccidentModal handleClose={handleClose} showTab={showTab} />
              )}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
