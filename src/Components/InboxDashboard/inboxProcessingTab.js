import React from "react";
import { useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import Carousel from "react-bootstrap/Carousel";

const InboxProcessingTab = (props) => {
  const inboxDocPanels = useSelector((state) => state.inbox.inboxDocPanels);

  const convertDatetimeToDate = (datetime) => {
    const dateObject = new Date(datetime);
    const formattedDate = dateObject.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  };
  const convertDatetimeToTime = (datetime) => {
    const dateObject = new Date(datetime);
    const formattedTime = dateObject.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return formattedTime;
  };

  return (
    <div class="processing-images">
      {inboxDocPanels
        ? inboxDocPanels?.map((doc_panel, index) => (
            <div class="col-md-2 inbox-doc-parent w-100">
              <div class="single-document single-document-2 p-t-0 w-100">
                <div class="confirmation-modal" id="confirmationMessageModal">
                  <div class="modal-dialog modal-dialog-centered inbox-confirmation-modal">
                    <div class="modal-content inbox-confirmation-content">
                      <div class="modal-body"></div>
                    </div>
                  </div>
                </div>
                <div className="row m-0 display-flex-inbox inbox-doc-panel">
                  {doc_panel?.image_s ? (
                    <div
                      class="inbox-document-holder p-0 box-1 m-0"
                      style={{
                        border: "5px solid white",
                      }}
                      id="colc"
                    >
                      <div
                        id="carouselExampleControls{{doc_panel.document.id}}"
                        class="carousel slide doc-img-pad"
                        data-ride="carousel"
                      >
                        <div class="carousel-inner">
                          {/* <div class="d-flex align-items-center">
                                                    <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                                    {doc_panel?.document?.created_by?.bp_userprofile?.account_type == 'Attorney'
                                                        && doc_panel?.document?.created_by?.bp_userprofile?.bp_attorney_userprofile?.profile_pic
                                                        && <img class="output-3 theme-ring" src={doc_panel?.document?.created_by?.bp_userprofile?.bp_attorney_userprofile?.profile_pic?.url} />
                                                    }
                                                    {!doc_panel?.document?.created_by?.bp_userprofile?.account_type == 'Attorney'
                                                        && doc_panel?.document?.created_by?.bp_attorneystaff_userprofile?.profile_pic
                                                        && <img class="output-3 theme-ring" src={doc_panel?.document?.created_by?.bp_attorneystaff_userprofile?.profile_pic?.url} />
                                                    }
                                                    </span>
                                                    <span class="ml-2 text-black text-black-2 whitespace-nowrap">
                                                        {doc_panel?.document?.created_by?.first_name} {doc_panel?.document?.created_by?.last_name}
                                                        Usama Nawaz
                                                    </span>
                                                </div> */}
                          {/* <div>
                                                    <span class="text-grey">Uploaded </span>
                                                    {convertDatetimeToDate(doc_panel?.document?.created)} {convertDatetimeToTime(doc_panel?.document?.created)}
                                                    {doc_panel?.document?.created.date} {doc_panel?.document?.created?.time}
                                                </div> */}
                          {/* <div>
                                                    {doc_panel?.document?.file_name}
                                                </div> */}
                          <Carousel>
                            {doc_panel?.images?.map((image) => (
                              <Carousel.Item>
                                <div
                                  class="doc-image mx-auto my-0 text-center"
                                  id="dummy-height-330"
                                >
                                  <div
                                    className="loader"
                                    style={{
                                      position: "absolute",
                                      top: "40%",
                                      left: "40%",
                                      transform: "translate(-40%, -40%)",
                                    }}
                                  ></div>
                                  <img src={image?.url} text="First slide" />
                                </div>
                              </Carousel.Item>
                            ))}
                          </Carousel>
                        </div>
                        <a
                          class="carousel-control-prev carousel-control-prev-2"
                          href="#carouselExampleControls{{doc_panel.document.id}}"
                          role="button"
                          data-slide="prev"
                        >
                          <svg
                            width="34"
                            height="17"
                            viewBox="0 0 34 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          <span class="sr-only">Previous</span>
                        </a>
                        <a
                          class="carousel-control-next carousel-control-next-2"
                          href="#carouselExampleControls{{doc_panel.document.id}}"
                          role="button"
                          data-slide="next"
                        >
                          <svg
                            width="34"
                            height="17"
                            viewBox="0 0 34 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          <span class="sr-only">Next</span>
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

export default InboxProcessingTab;
