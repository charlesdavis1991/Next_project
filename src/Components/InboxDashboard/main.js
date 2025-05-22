import React, { useEffect, useState, useRef } from "react";
import InboxActionBar from "./inboxActionBar";
import InboxTable from "./inboxTable";
import InboxEmptyTable from "./inboxEmptyTable";
import DocumentHistoryTable from "./documentHistoryTable";
import InboxProcessingTab from "./inboxProcessingTab";
import { useDispatch, useSelector } from "react-redux";
import InboxOcrFailedTab from "./inboxOcrFailedTab";
import InboxUnidentifiedTab from "./inboxUnidentifiedTab";
import InboxHeader from "./inboxHeader";
import { fetchInboxDefaultUserTypes } from "../../Providers/main";
import { setDefaultUserTypes } from "../../Redux/inbox/actions";
import { LinearProgress } from "@mui/material";

const InboxDashboard = (props) => {
  const scrolltoTop = () => {
    // Scroll to the top of the scrollable div
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const scrollableDivRef = useRef(null); // Add a ref for the scrollable div
  const dispatch = useDispatch();
  const inboxTabsCount = useSelector((state) => state.inbox.inboxTabsCount);
  console.log(inboxTabsCount);
  const inboxDocPanels = useSelector((state) => state.inbox.inboxDocPanels);
  const inboxTableLoader = useSelector((state) => state.inbox.inboxTableLoader);
  const inboxTab = useSelector((state) => state.inbox.inboxTab);
  const inboxFailedOcrDocuments = useSelector(
    (state) => state.inbox.inboxFailedOcrDocuments
  );
  const inboxProcessingDocuments = useSelector(
    (state) => state.inbox.inboxProcessingDocuments
  );
  const inboxAllDocuments = useSelector(
    (state) => state.inbox.inboxAllDocuments
  );
  const defaultUserTypes = useSelector((state) => state.inbox.defaultUserTypes);
  console.log("default user types: ", defaultUserTypes);

  useEffect(() => {
    const leftSidebarWidth = document
      .querySelector(".menu-sidebar")
      .getBoundingClientRect().width;
    const parentDocument = document.querySelector(".document-parent-div");
    parentDocument.style.left = `${leftSidebarWidth + 5}px`;

    fetchInboxDefaultUserTypes(dispatch, setDefaultUserTypes);
  }, []);

  return (
    <>
      <div className="top-panel-wrapper"></div>
      <div className="main-content overflow-y-hidden">
        <InboxActionBar />

        <InboxHeader
          scrolltoTop={scrolltoTop}
          maxItems={props.maxItems}
          setMaxItems={props.setMaxItems}
          itemNumber={props.itemNumber}
          setItemNumber={props.setItemNumber}
        />
        {/* {inboxTableLoader && <TableLoader />} */}
        <div
          ref={scrollableDivRef}
          className="container-fluid document-parent-div"
          style={{
            overflowY: inboxTabsCount[inboxTab] <= 1 ? "hidden" : "visible",
          }}
        >
          <div className="row">
            <div className="col-12 inbox-doc-parent">
              <div className="documents-row">
                <div className="custom-tab">
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="inbox-tab-all"
                      role="tabpanel"
                      aria-labelledby="inbox-tab-all"
                    >
                      <div className="single-document single-document-2">
                        {inboxTab == "unidentified" ? (
                          <>
                            {inboxDocPanels?.length == 0 &&
                              inboxTabsCount[inboxTab] == 0 && (
                                <InboxEmptyTable />
                              )}
                            {inboxDocPanels?.map((doc_panel) => (
                              <InboxUnidentifiedTab
                                setItemNumber={props.setItemNumber}
                                maxItems={props.maxItems}
                                setMaxItems={props.setMaxItems}
                                doc_panel={doc_panel}
                              />
                            ))}
                            {inboxDocPanels?.length == 0 &&
                              inboxTabsCount[inboxTab] == 0 && (
                                <InboxEmptyTable />
                              )}
                            {
                              <div className="row m-0 mb-2 ">
                                <div
                                  className="full-width-block p-l-0 pr-0"
                                  onclick="openModal(this,{{doc_panel.document.id}})"
                                  id="cold"
                                >
                                  <div className="table-responsive table-responsive-2 table--no-card m-b-40 position-relative has-tint-rows has-tint-h-272 has-tint-top-25 ">
                                    <table
                                      className="table table-earning t-b-0 position-relative fake-rows-2 table-striped"
                                      id="table-{{doc_panel.document.id}}-tab1"
                                    >
                                      <tbody
                                        style={{
                                          maxHeight: "100px !important",
                                          overflowY: "scroll",
                                        }}
                                      >
                                        {Array(
                                          Math.max(
                                            inboxTabsCount[inboxTab] == 1
                                              ? 1
                                              : 0,
                                            Math.min(
                                              5,
                                              inboxTabsCount[inboxTab]
                                            ) - (inboxDocPanels?.length || 0)
                                          )
                                        )
                                          .fill(0)
                                          .map((element) => (
                                            <tr
                                              index={element}
                                              id="dummy-height-330"
                                              className="tab-row table-fake-row position-relative"
                                            >
                                              <div className="position-absolute progress-bar-indeterminant">
                                                <LinearProgress
                                                  sx={{
                                                    backgroundColor:
                                                      "var(--primary-50)", // Background color of the track
                                                    "& .MuiLinearProgress-bar":
                                                      {
                                                        backgroundColor:
                                                          "var(--primary)", // Color of the progress bar
                                                      },
                                                  }}
                                                />
                                              </div>

                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            }
                          </>
                        ) : inboxTab == "completed" ? (
                          <>
                            {inboxDocPanels?.length == 0 &&
                              inboxTabsCount[inboxTab] == 0 && (
                                <InboxEmptyTable />
                              )}
                            {inboxDocPanels?.map((doc_panel) => (
                              <InboxUnidentifiedTab
                                setItemNumber={props.setItemNumber}
                                maxItems={props.maxItems}
                                setMaxItems={props.setMaxItems}
                                doc_panel={doc_panel}
                              />
                            ))}
                            {inboxDocPanels?.length == 0 &&
                              inboxTabsCount[inboxTab] == 0 && (
                                <InboxEmptyTable />
                              )}
                            {
                              <div className="row m-0 mb-2 ">
                                <div
                                  className="full-width-block p-l-0 pr-0"
                                  onclick="openModal(this,{{doc_panel.document.id}})"
                                  id="cold"
                                >
                                  <div className="table-responsive table-responsive-2 table--no-card m-b-40 position-relative has-tint-rows has-tint-h-272 has-tint-top-25 ">
                                    <table
                                      className="table table-earning t-b-0 position-relative fake-rows-2 table-striped"
                                      id="table-{{doc_panel.document.id}}-tab1"
                                    >
                                      <tbody
                                        style={{
                                          maxHeight: "100px !important",
                                          overflowY: "scroll",
                                        }}
                                      >
                                        {Array(
                                          Math.max(
                                            inboxTabsCount[inboxTab] == 1
                                              ? 1
                                              : 0,
                                            Math.min(
                                              5,
                                              inboxTabsCount[inboxTab]
                                            ) - (inboxDocPanels?.length || 0)
                                          )
                                        )
                                          .fill(0)
                                          .map((element) => (
                                            <tr
                                              index={element}
                                              id="dummy-height-330"
                                              className="tab-row table-fake-row position-relative"
                                            >
                                              <div className="position-absolute progress-bar-indeterminant">
                                                <LinearProgress
                                                  sx={{
                                                    backgroundColor:
                                                      "var(--primary-50)", // Background color of the track
                                                    "& .MuiLinearProgress-bar":
                                                      {
                                                        backgroundColor:
                                                          "var(--primary)", // Color of the progress bar
                                                      },
                                                  }}
                                                />
                                              </div>

                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            }
                          </>
                        ) : inboxTab == "ocr_failed" ? (
                          <>
                            {inboxDocPanels?.length == 0 &&
                              inboxTabsCount[inboxTab] == 0 && (
                                <InboxEmptyTable />
                              )}
                            {inboxDocPanels?.map((doc_panel, index) => (
                              <InboxOcrFailedTab
                                setItemNumber={props.setItemNumber}
                                maxItems={props.maxItems}
                                setMaxItems={props.setMaxItems}
                                index={index + 1}
                                doc_panel={doc_panel}
                              />
                            ))}
                            {inboxDocPanels?.length == 0 &&
                              inboxTabsCount[inboxTab] == 0 && (
                                <InboxEmptyTable />
                              )}
                            {
                              <div className="row m-0 mb-2 ">
                                <div
                                  className="full-width-block p-l-0 pr-0"
                                  onclick="openModal(this,{{doc_panel.document.id}})"
                                  id="cold"
                                >
                                  <div className="table-responsive table-responsive-2 table--no-card m-b-40 position-relative has-tint-rows has-tint-h-272 has-tint-top-25 ">
                                    <table
                                      className="table table-earning t-b-0 position-relative fake-rows-2 table-striped"
                                      id="table-{{doc_panel.document.id}}-tab1"
                                    >
                                      <tbody
                                        style={{
                                          maxHeight: "100px !important",
                                          overflowY: "scroll",
                                        }}
                                      >
                                        {Array(
                                          Math.max(
                                            inboxTabsCount[inboxTab] == 1
                                              ? 1
                                              : 0,
                                            Math.min(
                                              5,
                                              inboxTabsCount[inboxTab]
                                            ) - (inboxDocPanels?.length || 0)
                                          )
                                        )
                                          .fill(0)
                                          .map((element) => (
                                            <tr
                                              index={element}
                                              id="dummy-height-330"
                                              className="tab-row table-fake-row position-relative"
                                            >
                                              <div className="position-absolute progress-bar-indeterminant">
                                                <LinearProgress
                                                  sx={{
                                                    backgroundColor:
                                                      "var(--primary-50)", // Background color of the track
                                                    "& .MuiLinearProgress-bar":
                                                      {
                                                        backgroundColor:
                                                          "var(--primary)", // Color of the progress bar
                                                      },
                                                  }}
                                                />
                                              </div>

                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            }
                          </>
                        ) : inboxTab == "processing" ? (
                          <>
                            {inboxDocPanels?.length == 0 &&
                              inboxTabsCount[inboxTab] == 0 && (
                                <InboxEmptyTable />
                              )}
                            <InboxProcessingTab />
                          </>
                        ) : inboxTab == "document_history" ? (
                          <>
                            <DocumentHistoryTable />
                          </>
                        ) : (
                          <>
                            {!inboxTableLoader &&
                              inboxDocPanels &&
                              inboxTabsCount[inboxTab] > 0 && (
                                <>
                                  {inboxDocPanels?.map((doc_panel) => (
                                    <InboxTable
                                      maxItems={props.maxItems}
                                      setMaxItems={props.setMaxItems}
                                      setItemNumber={props.setItemNumber}
                                      inboxTab={inboxTab}
                                      doc_panel={doc_panel}
                                    />
                                  ))}
                                </>
                              )}
                            {
                              <div className="row m-0 mb-2 ">
                                <div
                                  className="full-width-block p-l-0 pr-0"
                                  onclick="openModal(this,{{doc_panel.document.id}})"
                                  id="cold"
                                >
                                  <div className="table-responsive table-responsive-2 table--no-card m-b-40 position-relative has-tint-rows has-tint-h-272 has-tint-top-25 ">
                                    <table className="table table-earning t-b-0 position-relative fake-rows-2 table-striped">
                                      <tbody
                                        style={{
                                          maxHeight: "100px",
                                          overflowY: "scroll",
                                        }}
                                      >
                                        {Array(
                                          Math.max(
                                            inboxTabsCount[inboxTab] == 1
                                              ? 1
                                              : 0,
                                            Math.min(
                                              5,
                                              inboxTabsCount[inboxTab]
                                            ) - (inboxDocPanels?.length || 0)
                                          )
                                        )
                                          .fill(0)
                                          .map((_, index) => (
                                            <tr
                                              key={`fake-row-${index}`}
                                              id="dummy-height-330"
                                              className="tab-row table-fake-row position-relative"
                                            >
                                              <div className="position-absolute progress-bar-indeterminant">
                                                <LinearProgress
                                                  sx={{
                                                    backgroundColor:
                                                      "var(--primary-50)", // Background color of the track
                                                    "& .MuiLinearProgress-bar":
                                                      {
                                                        backgroundColor:
                                                          "var(--primary)", // Color of the progress bar
                                                      },
                                                  }}
                                                />
                                              </div>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                              <td className="text-dark-grey text-center"></td>
                                            </tr>
                                          ))}
                                        {inboxTabsCount[inboxTab] === 1 &&
                                          Array(4)
                                            .fill(0)
                                            .map((_, index) => (
                                              <tr
                                                key={`extra-fake-row-${index}`}
                                                id="dummy-height-330"
                                                className="tab-row table-fake-row position-relative"
                                              >
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                              </tr>
                                            ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            }
                            {inboxDocPanels?.length == 0 &&
                              inboxTabsCount[inboxTab] == 0 && (
                                <InboxEmptyTable />
                              )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row m-0">
          <div className="col-lg-12 table-section"></div>
        </div>
      </div>
    </>
  );
};

export default InboxDashboard;
