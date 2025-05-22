import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableLoader from "../Loaders/tableLoader";
import "./injuries.css";
import { getCaseId, getClientId, getToken } from "../../Utils/helper";

import {
  addInjury,
  addPreexistingInjuries,
  modifyInjutries,
  modifyPreexistInjutries,
  updateInjuries,
} from "../../Redux/injuries/actions";
import ChatWithProviderModal from "./ChatProviderModal";
import FinalModal from "./FinalModal";
import ProviderDocumentModal from "./ProviderDocumentModal";
import NoProviderModal from "./NoProviderModal";
import DocumentPreviewModal from "./DocumentPreview.jsx";
import Warning from "./Warning.jsx";
import NotesSectionDashboard from "../NotesSectionDashboard/main";
import PageChecklist from "../common/PageChecklist";
import ActionBarComponent from "../common/ActionBarComponent.js";

const InjuryDashboard = ({ injuriesData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNoOpen, setIsNoOpen] = useState(false);
  const [finalModalOpen, setFinalModalOpen] = useState(false);
  const [selectedInjuryId, setSelectedInjuryId] = useState(null);
  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [docPreviewModal, setDocPreviewModal] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const handleClick = (docId) => {
    setSelectedDocId(docId);
    setDocPreviewModal(true);
  };

  const handleClickClose = () => {
    setDocPreviewModal(false);
  };

  const handleNoProviderOpen = () => {
    setIsNoOpen(!isNoOpen);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleFinalModalOpen = (injuryId) => {
    setSelectedInjuryId(injuryId);
    setFinalModalOpen(true);
  };

  const handleFinalModalClose = () => {
    setFinalModalOpen(false);
  };

  const handleProviderModalOpen = (provider, detailId, injuryId) => {
    setSelectedProvider(provider);
    setSelectedDetailId(detailId);
    setSelectedInjuryId(injuryId);
    setProviderModalOpen(true);
  };

  const handleProviderModalClose = () => {
    setProviderModalOpen(false);
  };

  const handleWarningModalClose = () => {
    setShowWarningModal(false);
  };

  const { loading } = useSelector((state) => state.injuries);
  const dispatch = useDispatch();

  const origin = process.env.REACT_APP_BACKEND_URL;

  const addBodyPart = (bodyPart, image) => {
    addInjury({ body_part: bodyPart, client: false }, dispatch).then((res) => {
      if (res?.message === "Injury has details, cannot remove") {
        setShowWarningModal(true);
      } else {
        dispatch(
          modifyInjutries({
            redInjuries: res?.red_injuries,
            selectedPart: bodyPart,
            image: image,
            injuries: res?.injuries,
          })
        );
      }
    });
  };

  const handlePreexistingInjuries = (bodyPart, image) => {
    addPreexistingInjuries({
      injury_name: bodyPart,
      case_id: getCaseId(),
      client_id: getClientId(),
    }).then((res) => {
      dispatch(
        modifyPreexistInjutries({
          selectedPart: bodyPart,
        })
      );
    });
  };

  const addProviderFields = async (formData) => {
    try {
      const caseId = getCaseId();
      const clientId = getClientId();
      const response = await fetch(
        origin +
          `/api/injuries/${selectedInjuryId}/add-details/?case_id=${caseId}&client_id=${clientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        dispatch(updateInjuries(data.injuries));
        handleFinalModalClose();
      } else {
        console.log("Failed to update injury details: " + data.detail);
      }
    } catch (error) {
      console.error("Error updating injury details:", error);
    }
  };

  function mixColorWithWhite(hex, percentage) {
    const whitePercentage = (100 - percentage) / 100;

    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.floor(r + (255 - r) * whitePercentage);
    g = Math.floor(g + (255 - g) * whitePercentage);
    b = Math.floor(b + (255 - b) * whitePercentage);

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  const formatPhoneNumber = (phoneNumberString) => {
    let cleaned = phoneNumberString.replace(/\D/g, "");
    let areaCode = cleaned.substring(0, 3);
    let firstThree = cleaned.substring(3, 6);
    let lastFour = cleaned.substring(6, 10);
    return `(${areaCode}) ${firstThree}-${lastFour}`;
  };
  console.log(injuriesData);
  const data = [
    {
      bgColor: "green",
      name: "Provider Treating",
    },
    {
      bgColor: "red",
      name: "No Provider",
    },
    {
      bgColor: "orange",
      name: "Client Marked",
    },
    {
      bgColor: "4392D3",
      name: "Found in Records",
    },
    {
      bgColor: "pink",
      name: "Pre-Existing as of Incident Date",
    },
  ];
  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <>
      {/*{loading && <TableLoader />}*/}
      <div class="main-content red">
        {/* Top Bar */}
        <ActionBarComponent
          src="/BP_resources/images/injuries-icon-color.svg"
          page_name={"Injuries"}
          isChecklist={true}
          injuries={data}
        />
        {/* <div class="action-bar anti-action-bar client-BarAlign anti-client-BarAlign  topbarMargin has-checklist d-flex mb-5 ">
          <span class="page-icon">
            <img
              class="translate-note-icon"
              src="/BP_resources/images/injuries-icon-color.svg"
            />
          </span>
          <div
            class="text-wrapper text-white d-flex align-items-center p-l-5"
            id="padding-right-10"
          >
            <h2 class="text-white mb-0">Injuries</h2>
          </div>
          <div class="injury-legend" id="other-parties-page">
            <div class="d-flex flex-wrap">
              <div class="d-flex align-items-center m-r-15-i">
                <div class="background-color-green-width-14px-height-14px-margin-right-5px"></div>
                <span> Provider Treating </span>
              </div>
              <div class="d-flex align-items-center m-r-15-i">
                <div class="background-color-red-width-14px-height-14px-margin-right-5px"></div>
                <span> No Provider </span>
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <div class="d-flex align-items-center m-r-15-i">
                <div class="background-color-orange-width-14px-height-14px-margin-right-5px"></div>
                <span> Client Marked </span>
              </div>
              <div class="d-flex align-items-center m-r-15-i">
                <div class="background-color-4392D3-width-14px-height-14px-margin-right-5px"></div>
                <span> Found in Records </span>
              </div>
              <div class="d-flex align-items-center m-r-15-i">
                <div class="background-color-pink-width-14px-height-14px-margin-right-5px"></div>
                <span>Pre-Existing as of Incident Date</span>
              </div>
            </div>
          </div>
          <PageChecklist entity={"Injury"} />
        </div> */}

        {/* Main page */}
        {loading && <TableLoader />}
        {!loading && (
          <div className="injury-content-wrapper">
            <div class="row">
              <div class="col-12">
                <div class="p-l-5">
                  <h4
                    class="client-contact-title text-center "
                    style={{ marginTop: "15px" }}
                  >
                    Check the Client's Injured Body Parts
                  </h4>
                </div>
                {/* Skeleton */}
                <div class="col-lg-12 m-b-5 m-t-5">
                  <div class="row injury-main-container h-100">
                    <div class="col-lg-6 col-sm-12">
                      <div class="row">
                        <div
                          className="col-md-6 col-sm-12 p-0 injury-img-none"
                          id="body-svg-images"
                        >
                          {/* Render the base image */}
                          <img
                            src={`https://d1jidr14kflwe7.cloudfront.net/static/${injuriesData?.base_img}`}
                            className="svg-base height-500px"
                            alt="Base Image"
                          />

                          {/* Iterate over the body parts data */}
                          {injuriesData?.body_url?.map((url) => (
                            <React.Fragment key={url[1]}>
                              {injuriesData?.pre_existing_injuries?.includes(
                                url[1]
                              ) ? (
                                // ||
                                // injuriesData?.injuries_selected_or_found_earlier.includes(
                                //   url[1]
                                // )
                                <img
                                  src={`https://d1jidr14kflwe7.cloudfront.net/static/${url[0].pink}`}
                                  id={`${url[1].replace(/\s/g, "_")}_pink`}
                                  alt="Responsive image"
                                  className="svg max-height-500px-display-inherit"
                                />
                              ) : (
                                <img
                                  // src={`https://d1jidr14kflwe7.cloudfront.net/static/${url[0].pink}`}
                                  id={`${url[1].replace(/\s/g, "_")}_pink`}
                                  alt="Responsive image"
                                  className="svg max-height-500px-display-none"
                                />
                              )}
                              {injuriesData?.blue_injuries?.includes(url[1]) ? (
                                <img
                                  src={`https://d1jidr14kflwe7.cloudfront.net/static/${url[0].blue}`}
                                  id={url[1]}
                                  alt="Responsive image"
                                  className="svg max-height-500px-display-inherit"
                                />
                              ) : injuriesData?.red_injuries?.includes(
                                  url[1]
                                ) ? (
                                <img
                                  src={`https://d1jidr14kflwe7.cloudfront.net/static/${url[0].red}`}
                                  id={url[1]}
                                  alt="Responsive image"
                                  className="svg max-height-500px-display-inherit"
                                />
                              ) : injuriesData?.orange_injuries?.includes(
                                  url[1]
                                ) ? (
                                <img
                                  src={`https://d1jidr14kflwe7.cloudfront.net/static/${url[0].orange}`}
                                  id={url[1]}
                                  alt="Responsive image"
                                  className="svg max-height-500px-display-inherit"
                                />
                              ) : (
                                injuriesData?.green_injuries?.includes(
                                  url[1]
                                ) && (
                                  <img
                                    src={`https://d1jidr14kflwe7.cloudfront.net/static/${url[0].green}`}
                                    id={url[1]}
                                    alt="Responsive image"
                                    className="svg max-height-500px-display-inherit"
                                  />
                                )
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="col-md-6 col-sm-12 p-0">
                          <section className="text-overlay injires display-flex-justify-content-space-between-width-100">
                            <form id="form1">
                              <input
                                type="text"
                                name="body_part"
                                id="body_part"
                                hidden
                              />
                            </form>
                            <div className="checklist max-height-500px-display-flex-flex-direction-column-flex-wrap-wrap">
                              {injuriesData?.body_parts_1?.map(
                                ([bodyPart, displayName]) => (
                                  <div
                                    className="d-flex align-items-center"
                                    key={bodyPart}
                                  >
                                    <div className="width-custom">
                                      <input
                                        type="checkbox"
                                        onClick={(e) =>
                                          addBodyPart(bodyPart, "skeleton")
                                        }
                                        id={bodyPart}
                                        name={bodyPart}
                                        value={bodyPart}
                                        checked={injuriesData?.selected_body_parts?.includes(
                                          bodyPart
                                        )}
                                        className={`${
                                          injuriesData?.blue_injuries?.includes(
                                            bodyPart
                                          )
                                            ? "blue-accent-color"
                                            : injuriesData?.red_injuries?.includes(
                                                  bodyPart
                                                )
                                              ? "red-accent-color"
                                              : injuriesData?.orange_injuries?.includes(
                                                    bodyPart
                                                  )
                                                ? "orange-accent-color"
                                                : injuriesData?.green_injuries?.includes(
                                                      bodyPart
                                                    )
                                                  ? "green-accent-color"
                                                  : ""
                                        }`}
                                      />
                                      <label
                                        htmlFor={bodyPart}
                                        className="ml-2"
                                      >
                                        {displayName}
                                      </label>
                                    </div>
                                    <div className="m-r-10">
                                      <input
                                        type="checkbox"
                                        id={`${bodyPart}_pink`}
                                        name={bodyPart}
                                        value={`${bodyPart}_pink`}
                                        onChange={() =>
                                          handlePreexistingInjuries(bodyPart)
                                        }
                                        checked={
                                          injuriesData?.injuries_selected_or_found_earlier?.includes(
                                            bodyPart
                                          ) ||
                                          injuriesData?.pre_existing_injuries?.includes(
                                            bodyPart
                                          )
                                        }
                                        className={` ${
                                          injuriesData?.injuries_selected_or_found_earlier?.includes(
                                            bodyPart
                                          )
                                            ? "pink-accent-color-v2"
                                            : ""
                                        } ${
                                          injuriesData?.pre_existing_injuries?.includes(
                                            bodyPart
                                          )
                                            ? "pink-accent-color"
                                            : ""
                                        }   hover-event-img`}
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                            </div>

                            <div className="checklist max-height-500px-display-flex-flex-direction-column-flex-wrap-wrap">
                              {injuriesData?.body_parts_2?.map(
                                ([body_part, display_name]) => (
                                  <div
                                    className="d-flex align-items-center"
                                    key={body_part}
                                  >
                                    <div className="width-custom">
                                      {injuriesData?.selected_body_parts?.includes(
                                        body_part
                                      ) ? (
                                        <input
                                          className={`${
                                            injuriesData?.blue_injuries?.includes(
                                              body_part
                                            )
                                              ? "blue-accent-color"
                                              : injuriesData?.red_injuries?.includes(
                                                    body_part
                                                  )
                                                ? "red-accent-color"
                                                : injuriesData?.orange_injuries?.includes(
                                                      body_part
                                                    )
                                                  ? "orange-accent-color"
                                                  : injuriesData?.green_injuries?.includes(
                                                        body_part
                                                      )
                                                    ? "green-accent-color"
                                                    : ""
                                          }`}
                                          type="checkbox"
                                          onClick={(e) =>
                                            addBodyPart(body_part, "skeleton")
                                          }
                                          id={body_part}
                                          name={body_part}
                                          value={body_part}
                                          checked
                                        />
                                      ) : (
                                        <input
                                          type="checkbox"
                                          id={body_part}
                                          name={body_part}
                                          value={body_part}
                                          onClick={(e) =>
                                            addBodyPart(body_part, "skeleton")
                                          }
                                        />
                                      )}
                                      <label
                                        htmlFor={body_part}
                                        className="ml-2"
                                      >
                                        {display_name}
                                      </label>
                                    </div>
                                    <div className="m-r-10">
                                      <input
                                        type="checkbox"
                                        id={`${body_part}_pink`}
                                        name={body_part}
                                        value={`${body_part}_pink`}
                                        onChange={() =>
                                          handlePreexistingInjuries(body_part)
                                        }
                                        checked={
                                          injuriesData?.injuries_selected_or_found_earlier?.includes(
                                            body_part
                                          ) ||
                                          injuriesData?.pre_existing_injuries?.includes(
                                            body_part
                                          )
                                        }
                                        className={` ${
                                          injuriesData?.injuries_selected_or_found_earlier?.includes(
                                            body_part
                                          )
                                            ? "pink-accent-color-v2"
                                            : ""
                                        } ${
                                          injuriesData?.pre_existing_injuries?.includes(
                                            body_part
                                          )
                                            ? "pink-accent-color"
                                            : ""
                                        }   hover-event-img`}
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>

                    {/* Spinal Cord */}
                    <div className="spinal-cord-div col-lg-6 col-sm-12">
                      <div className="row">
                        <div
                          className="col-md-6 col-sm-12 p-0 injury-img-none"
                          id="spine-svg-images"
                        >
                          <img
                            src={`https://d1jidr14kflwe7.cloudfront.net/static/${injuriesData?.spine_img}`}
                            className="svg-base height-500px"
                            alt="Spine"
                          />

                          {injuriesData?.spine_url?.map((url) => {
                            //console.log(url[1], "0m0m0m");
                            return (
                              <React.Fragment key={url[1]}>
                                {injuriesData?.pre_existing_injuries?.includes(
                                  url[1]
                                ) ||
                                injuriesData?.injuries_selected_or_found_earlier?.includes(
                                  url[1]
                                ) ? (
                                  <img
                                    src={`https://d1jidr14kflwe7.cloudfront.net/static/${url[0].pink}`}
                                    id={`${url[1].replace(/\s/g, "_")}_pink`}
                                    alt="Responsive image"
                                    className="svg max-height-500px-display-inherit"
                                  />
                                ) : (
                                  <img
                                    src={`https://d1jidr14kflwe7.cloudfront.net/static/${url[0].pink}`}
                                    id={`${url[1].replace(/\s/g, "_")}_pink`}
                                    alt="Responsive image"
                                    className="svg max-height-500px-display-none"
                                  />
                                )}
                                {injuriesData?.blue_injuries?.includes(
                                  url[1]
                                ) ? (
                                  <img
                                    src={`https://d1jidr14kflwe7.cloudfront.net/static/${url[0].blue}`}
                                    id={url[1]}
                                    alt="Responsive image"
                                    className="svg max-height-500px-display-inherit"
                                  />
                                ) : injuriesData?.red_injuries?.includes(
                                    url[1]
                                  ) ? (
                                  <img
                                    src={`https://d1jidr14kflwe7.cloudfront.net/static/${url[0].red}`}
                                    id={url[1]}
                                    alt="Responsive image"
                                    className="svg max-height-500px-display-inherit"
                                  />
                                ) : injuriesData?.orange_injuries?.includes(
                                    url[1]
                                  ) ? (
                                  <img
                                    src={`https://d1jidr14kflwe7.cloudfront.net/static/${url[0].orange}`}
                                    id={url[1]}
                                    alt="Responsive image"
                                    className="svg max-height-500px-display-inherit"
                                  />
                                ) : (
                                  injuriesData?.green_injuries?.includes(
                                    url[1]
                                  ) && (
                                    <img
                                      src={`https://d1jidr14kflwe7.cloudfront.net/static/${url[0].green}`}
                                      id={url[1]}
                                      alt="Responsive image"
                                      className="svg max-height-500px-display-inherit"
                                    />
                                  )
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <section className="text-overlay injires display-flex-justify-content-space-between">
                            <div className="checklist max-height-500px-display-flex-flex-direction-column-flex-wrap-wrap">
                              {injuriesData?.spine_parts_1?.map(
                                ([body_part, display_name]) => (
                                  <div
                                    key={body_part}
                                    id="spinal-checkboxes"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="width-custom-2">
                                      {injuriesData?.selected_spine_parts?.includes(
                                        body_part
                                      ) ? (
                                        <input
                                          className={`${
                                            injuriesData?.blue_injuries?.includes(
                                              body_part
                                            )
                                              ? "blue-accent-color"
                                              : injuriesData?.red_injuries?.includes(
                                                    body_part
                                                  )
                                                ? "red-accent-color"
                                                : injuriesData?.orange_injuries?.includes(
                                                      body_part
                                                    )
                                                  ? "orange-accent-color"
                                                  : injuriesData?.green_injuries?.includes(
                                                        body_part
                                                      )
                                                    ? "green-accent-color"
                                                    : ""
                                          }`}
                                          type="checkbox"
                                          onClick={(e) =>
                                            addBodyPart(body_part, "spine")
                                          }
                                          id={body_part}
                                          name={body_part}
                                          value={body_part}
                                          checked
                                        />
                                      ) : (
                                        <input
                                          type="checkbox"
                                          onClick={(e) =>
                                            addBodyPart(body_part, "spine")
                                          }
                                          id={body_part}
                                          name={body_part}
                                          value={body_part}
                                        />
                                      )}
                                      <label
                                        htmlFor={body_part}
                                        className="ml-2"
                                      >
                                        {display_name}
                                      </label>
                                    </div>
                                    <div className="m-r-10">
                                      {injuriesData?.injuries_selected_or_found_earlier?.includes(
                                        body_part
                                      ) ? (
                                        <input
                                          className="pink-accent-color-v2"
                                          type="checkbox"
                                          id={body_part}
                                          name={body_part}
                                          value={`${body_part}_pink`}
                                          onChange={() =>
                                            handlePreexistingInjuries(body_part)
                                          }
                                          checked
                                        />
                                      ) : injuriesData?.pre_existing_injuries?.includes(
                                          body_part
                                        ) ? (
                                        <input
                                          className="pink-accent-color"
                                          type="checkbox"
                                          id={body_part}
                                          name={body_part}
                                          value={`${body_part}_pink`}
                                          checked
                                          onChange={() =>
                                            handlePreexistingInjuries(body_part)
                                          }
                                        />
                                      ) : (
                                        <input
                                          className="pink-accent-color hover-event-img"
                                          type="checkbox"
                                          id={body_part}
                                          name={body_part}
                                          value={`${body_part}_pink`}
                                          onChange={() =>
                                            handlePreexistingInjuries(body_part)
                                          }
                                        />
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                            <div className="checklist max-height-500px-display-flex-flex-direction-column-flex-wrap-wrap">
                              {injuriesData?.spine_parts_2?.map(
                                ([body_part, display_name]) => (
                                  <div
                                    key={body_part}
                                    className="d-flex align-items-center"
                                  >
                                    <div className="width-custom-3">
                                      {injuriesData?.selected_spine_parts?.includes(
                                        body_part
                                      ) ? (
                                        <input
                                          className={`${
                                            injuriesData?.blue_injuries?.includes(
                                              body_part
                                            )
                                              ? "blue-accent-color"
                                              : injuriesData?.red_injuries?.includes(
                                                    body_part
                                                  )
                                                ? "red-accent-color"
                                                : injuriesData?.orange_injuries?.includes(
                                                      body_part
                                                    )
                                                  ? "orange-accent-color"
                                                  : injuriesData?.green_injuries?.includes(
                                                        body_part
                                                      )
                                                    ? "green-accent-color"
                                                    : ""
                                          }`}
                                          type="checkbox"
                                          onClick={(e) =>
                                            addBodyPart(body_part, "spine")
                                          }
                                          id={body_part}
                                          name={body_part}
                                          value={body_part}
                                          checked
                                        />
                                      ) : (
                                        <input
                                          type="checkbox"
                                          onClick={(e) =>
                                            addBodyPart(body_part, "spine")
                                          }
                                          id={body_part}
                                          name={body_part}
                                          value={body_part}
                                        />
                                      )}
                                      <label
                                        htmlFor={body_part}
                                        className="ml-2"
                                      >
                                        {display_name}
                                      </label>
                                    </div>
                                    <div className="pink-accent-container">
                                      {injuriesData?.injuries_selected_or_found_earlier?.includes(
                                        body_part
                                      ) ? (
                                        <input
                                          className="pink-accent-color-v2"
                                          type="checkbox"
                                          id={body_part}
                                          name={body_part}
                                          value={`${body_part}_pink`}
                                          onChange={() =>
                                            handlePreexistingInjuries(body_part)
                                          }
                                          checked
                                        />
                                      ) : injuriesData?.pre_existing_injuries?.includes(
                                          body_part
                                        ) ? (
                                        <input
                                          className="pink-accent-color"
                                          type="checkbox"
                                          id={body_part}
                                          name={body_part}
                                          value={`${body_part}_pink`}
                                          checked
                                          onChange={() =>
                                            handlePreexistingInjuries(body_part)
                                          }
                                        />
                                      ) : (
                                        <input
                                          className="pink-accent-color hover-event-img"
                                          type="checkbox"
                                          id={body_part}
                                          name={body_part}
                                          value={`${body_part}_pink`}
                                          onChange={() =>
                                            handlePreexistingInjuries(body_part)
                                          }
                                        />
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Bottom Section */}
                <div className="col-lg-12 px-0">
                  <div className="table-responsive table--no-card border-0">
                    <table className="table table-borderless table-striped table-earning injuires-table has-height-25">
                      <thead>
                        <tr id="tb-header">
                          <th className=""></th>
                          <th className="">Body Part</th>
                          <th className="text-center">Medical Provider</th>
                          <th className="text-center">PHONE</th>
                          <th className="">
                            <div className="d-flex align-items-center">
                              <div className="align-self-center">Record</div>
                            </div>
                          </th>
                          <th className="w-100 text-center">
                            NOTES REGARDING SPECIFIC BODY PARTS AND INJURIES
                          </th>
                        </tr>
                      </thead>
                      <tbody id="injuries-table">
                        {injuriesData?.injuries?.map((injury) => {
                          // Check if there are injury details available
                          if (
                            injury.injury_details &&
                            injury.injury_details.length > 0
                          ) {
                            return injury.injury_details.map((detail) => {
                              const specialtyColor =
                                detail?.provider?.specialty?.color;
                              const backgroundColor = mixColorWithWhite(
                                specialtyColor,
                                10
                              );

                              return (
                                <tr
                                  className={`hover has-speciality-color-${detail?.provider?.specialty?.id}`}
                                  //onClick={() => handleFinalModalOpen(injury.id)}
                                  data-body-part={injury?.body_part?.name}
                                  injury-id={injury?.id}
                                  id={`injury_row${injury?.id}`}
                                  key={`injury_row${injury?.id}_${detail?.id}`} // Adding detail id to ensure unique keys
                                >
                                  <td
                                    className="td-autosize"
                                    onClick={() =>
                                      handleFinalModalOpen(injury.id)
                                    }
                                  >
                                    <div>{injury?.id}</div>
                                  </td>
                                  <td
                                    className="td-autosize"
                                    onClick={() =>
                                      handleFinalModalOpen(injury.id)
                                    }
                                  >
                                    <div>{injury?.body_part?.name}</div>
                                  </td>
                                  <td
                                    className={`provider-field td-autosize td_provider_name_${injury.id} bg-speciality-10`}
                                    id="provider-td"
                                    onClick={handleOpen}
                                  >
                                    <div
                                      className="d-flex"
                                      style={{
                                        backgroundColor: backgroundColor,
                                      }}
                                    >
                                      <div
                                        className={`td_name_${injury?.id} d-flex align-items-center p-1 h-100 m-r-5 text-center justify-content-center font-weight-600 color-white`}
                                        style={{
                                          background: `${detail?.provider?.specialty?.color}`,
                                        }}
                                        id="max-h-25"
                                      >
                                        <div>
                                          {detail?.provider?.specialty?.name?.charAt(
                                            0
                                          )}
                                        </div>
                                      </div>
                                      <div className="align-self-center">
                                        <div>
                                          {
                                            detail?.provider?.location?.added_by
                                              ?.providerprofile?.office_name
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    className={`td-autosize td_phone_${injury.id}`}
                                    onClick={() =>
                                      handleFinalModalOpen(injury.id)
                                    }
                                  >
                                    <div>
                                      {detail?.provider?.location?.phone
                                        ? formatPhoneNumber(
                                            detail?.provider?.location?.phone
                                          )
                                        : ""}
                                    </div>
                                  </td>
                                  <td
                                    className={`td-autosize td_file_${injury.id}`}
                                  >
                                    <div
                                      key={detail.id}
                                      className="d-flex justify-content-center align-items-center"
                                    >
                                      {detail.doc ? (
                                        <img
                                          src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/documents-icon-color.svg"
                                          alt="document-icon"
                                          height="24px"
                                          onClick={() =>
                                            handleClick(detail.doc.id)
                                          }
                                        />
                                      ) : (
                                        <img
                                          className="gray-scale-1 load-provider-doc-modal"
                                          alt="document-icon"
                                          src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/documents-icon-color.svg"
                                          height="24px"
                                          onClick={() =>
                                            handleProviderModalOpen(
                                              detail.provider,
                                              detail.id,
                                              injury.id
                                            )
                                          }
                                        />
                                      )}
                                    </div>
                                  </td>
                                  <td className={`w-100 td_note_${injury.id}`}>
                                    <div>{detail?.note}</div>
                                  </td>
                                </tr>
                              );
                            });
                          } else {
                            // If there are no details for this injury, display a placeholder row with the body part name
                            return (
                              <tr
                                //onClick={() => handleFinalModalOpen(injury.id)}
                                className={`hover has-speciality-color-`}
                                data-body-part={injury?.body_part}
                                injury-id={injury?.id}
                                id={`injury_row${injury?.id}`}
                                key={`injury_row${injury?.id}`}
                              >
                                <td
                                  className="td-autosize"
                                  onClick={() =>
                                    handleFinalModalOpen(injury.id)
                                  }
                                >
                                  <div>{injury?.id}</div>
                                </td>
                                <td
                                  className="td-autosize"
                                  onClick={() =>
                                    handleFinalModalOpen(injury.id)
                                  }
                                >
                                  <div>{injury?.body_part?.name}</div>
                                </td>
                                <td
                                  className={`provider-field td-autosize td_provider_name_${injury.id}`}
                                  id="provider-td"
                                  onClick={handleOpen}
                                ></td>
                                <td
                                  className={`td-autosize td_phone_${injury.id}`}
                                  onClick={() =>
                                    handleFinalModalOpen(injury.id)
                                  }
                                ></td>
                                <td
                                  className={`td-autosize td_file_${injury.id}`}
                                >
                                  <div className="d-flex justify-content-center align-items-center">
                                    <img
                                      className="gray-scale-1 load-provider-doc-modal"
                                      alt="document-icon"
                                      src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/documents-icon-color.svg"
                                      height="24px"
                                      onClick={() =>
                                        handleNoProviderOpen(
                                          injury.provider,
                                          injury.detail_id
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                                <td
                                  className={`w-100 td_note_${injury.id}`}
                                ></td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ paddingTop: "15px" }}>
              <NotesSectionDashboard />
            </div>
          </div>
        )}

        <ChatWithProviderModal handleOpen={handleOpen} isOpen={isOpen} />
        <FinalModal
          show={finalModalOpen}
          handleClose={handleFinalModalClose}
          injuryId={selectedInjuryId}
          onSave={addProviderFields}
        />
        {selectedProvider && (
          <ProviderDocumentModal
            show={providerModalOpen}
            handleClose={handleProviderModalClose}
            provider={selectedProvider}
            processedPageSlots={injuriesData?.processed_page_slots || []}
            injuryId={selectedInjuryId}
            detailId={selectedDetailId}
          />
        )}
        <NoProviderModal handleOpen={handleNoProviderOpen} isOpen={isNoOpen} />
        <DocumentPreviewModal
          show={docPreviewModal}
          handleClose={handleClickClose}
          docId={selectedDocId}
          caseId={injuriesData?.case}
          page={injuriesData?.page}
          dropdown_events={injuriesData?.dropdown_events}
          dropdown_pages={injuriesData?.dropdown_pages}
        />

        <Warning
          show={showWarningModal}
          handleClose={handleWarningModalClose}
        />
      </div>
    </>
  );
};

export default InjuryDashboard;
