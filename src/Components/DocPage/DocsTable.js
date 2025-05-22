import React from "react";
import { mediaRoute } from "../../Utils/helper";
import ButtonLoader from "../Loaders/ButtonLoader";
import TabData from "./TabData";
import {
  DetailedEmptyCard,
  DetailedUploadCard,
  DetailedUploadCardWithoutPanelsWithoutSlots,
  DetailedViewCard,
} from "./DetailedViewCards";
import {
  DefaultEmptyCard,
  DefaultUploadCard,
  DefaultUploadCardWithoutPanelsWithoutSlots,
  DefaultViewCard,
  DefaultViewCard2,
} from "./defaultViewCard";
import {
  UpdatedEmptyCard,
  UpdatedUploadCard,
  UpdatedUploadCardWithoutPanelsWithoutSlots,
  UpdatedViewCard,
} from "./UpdatedViewCards";

const DocsTable = ({
  data,
  specialtyRefs,
  widestWidth,
  handleDocPreview,
  handleDrop,
  handleUploadPopup,
  isSlotUploading,
  isDragging,
  refetchLoading,
  handleDropwithOutpanlesWithoutslots,
  handleUploadPopupwithoutSlots,
  isDragginguploadingbutton,
  uploadbuttonLoadingid,
  unAttachedDocuments,
  loading,
  refetchData,
  pageView,
}) => {
  return (
    <>
      {data?.map((page, index) => {
        if (page?.page?.show_on_sidebar === true) {
          if (page?.page?.name === "Treatment") {
            return (
              <React.Fragment key={index}>
                <div className="m-b-5 flex-nowrap align-items-center">
                  <div className="panel-icon" style={{ marginRight: "0px" }}>
                    <img
                      src={page?.page?.page_icon}
                      className="ic ic-19 d-flex align-items-center justify-content-center"
                    />
                  </div>
                  <div
                    className="panel-color"
                    style={{
                      background: "var(--primary)",
                      left: "25px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ height: 0, width: "10px" }} />
                    <h4
                      className="d-flex align-items-center m-l-5 "
                      style={{ color: "white", height: "max-content" }}
                    >
                      <small
                        className="font-weight-600 anti-skew"
                        style={{ textDecoration: "none" }}
                      >
                        {page?.page?.name}
                      </small>
                    </h4>
                  </div>
                </div>
                {/* height 80vh */}
                <div key={index}>
                  {page?.panels?.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="document-panel-wrapper m-b-0 m-t-5"
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{
                          cursor: "default",
                          background: item?.specialty?.secondary_color,
                          width: "100%",
                          height: "25px",
                          fontWeight: 600,
                        }}
                      >
                        <div
                          style={{
                            width: "25px",
                            minWidth: "25px",
                            height: "25px",
                            backgroundColor: item?.specialty?.color,
                            color: "white",
                            fontSize: "16px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <p
                            style={{
                              textTransform: "uppercase",
                              textAlign: "center",
                              margin: "0 auto",
                              fontWeight: "bold",
                            }}
                          >
                            {item?.specialty?.name[0]}
                          </p>
                        </div>
                        <p
                          style={{
                            color: "black !important",
                            fontSize: "14px",
                            margin: "0",
                            padding: "0 5px",
                            textTransform: "sentencecase",
                          }}
                        >
                          {item?.panel_name || item?.specialty?.name}
                        </p>
                      </div>
                      <div className="tbdocument redtd2 flex-row m-0">
                        <div className="col Doc-display-justify-content-background-color-transparent p-0">
                          <div
                            className="icon-text-boxes d-flex flex-wrap w-100 e-template-row  m-t-5"
                            style={{
                              marginRight: pageView === "default" ? "5px" : 0,
                              height:
                                pageView === "detailed"
                                  ? "322px"
                                  : pageView === "updated"
                                    ? "152px"
                                    : "auto",
                            }}
                          >
                            {page?.page_slots?.slice(0, 9).map((slot) => {
                              const attachedDocs = item?.documents?.filter(
                                (doc) =>
                                  doc?.document_slot?.id === slot?.id &&
                                  doc?.document_slot?.slot_number !== 0
                              );
                              return (
                                <React.Fragment key={slot.id}>
                                  {attachedDocs?.length > 0
                                    ? attachedDocs.map((doc) =>
                                        pageView === "default" ? (
                                          <DefaultViewCard
                                            key={doc.id}
                                            doc={doc}
                                            slot={slot}
                                            handleDocPreview={handleDocPreview}
                                          />
                                        ) : pageView === "detailed" ? (
                                          <DetailedViewCard
                                            key={doc.id}
                                            doc={doc}
                                            slot={slot}
                                            handleDocPreview={handleDocPreview}
                                          />
                                        ) : (
                                          <UpdatedViewCard
                                            key={doc.id}
                                            doc={doc}
                                            slot={slot}
                                            handleDocPreview={handleDocPreview}
                                          />
                                        )
                                      )
                                    : slot.slot_number !== 0 &&
                                      pageView === "default" && (
                                        <DefaultEmptyCard
                                          slot={slot}
                                          page={page}
                                          item={item}
                                          isDragging={isDragging}
                                          refetchLoading={refetchLoading}
                                          handleDrop={handleDrop}
                                          handleUploadPopup={handleUploadPopup}
                                          isSlotUploading={isSlotUploading}
                                        />
                                        //  :
                                        // pageView === 'updated' ?
                                        //   <UpdatedEmptyCard
                                        //     slot={slot}
                                        //     page={page}
                                        //     item={item}
                                        //     isDragging={isDragging}
                                        //     refetchLoading={refetchLoading}
                                        //     handleDrop={handleDrop}
                                        //     handleUploadPopup={handleUploadPopup}
                                        //     isSlotUploading={isSlotUploading}
                                        //   /> :
                                        //   <DetailedEmptyCard
                                        //     slot={slot}
                                        //     page={page}
                                        //     item={item}
                                        //     isDragging={isDragging}
                                        //     refetchLoading={refetchLoading}
                                        //     handleDrop={handleDrop}
                                        //     handleUploadPopup={handleUploadPopup}
                                        //     isSlotUploading={isSlotUploading}
                                        //   />
                                      )}
                                </React.Fragment>
                              );
                            })}
                            {/* {page?.page_slots?.slice(0, 8).map((slot) => {
                              const emptyWindows = item?.documents?.filter(
                                (doc) => doc?.document_slot?.id === slot?.id
                              );
                              return pageView === 'default' || emptyWindows?.length > 0 ? null : <div style={{ flex: 1 }} key={slot.id} />;
                            })} */}
                            {pageView === "default" ? (
                              <DefaultUploadCard
                                page={page}
                                item={item}
                                isDragginguploadingbutton={
                                  isDragginguploadingbutton
                                }
                                uploadbuttonLoadingid={uploadbuttonLoadingid}
                                handleDropwithOutpanlesWithoutslots={
                                  handleDropwithOutpanlesWithoutslots
                                }
                                handleUploadPopupwithoutSlots={
                                  handleUploadPopupwithoutSlots
                                }
                              />
                            ) : pageView === "detailed" ? (
                              <DetailedUploadCard
                                page={page}
                                item={item}
                                isDragginguploadingbutton={
                                  isDragginguploadingbutton
                                }
                                uploadbuttonLoadingid={uploadbuttonLoadingid}
                                handleDropwithOutpanlesWithoutslots={
                                  handleDropwithOutpanlesWithoutslots
                                }
                                handleUploadPopupwithoutSlots={
                                  handleUploadPopupwithoutSlots
                                }
                              />
                            ) : (
                              <UpdatedUploadCard
                                page={page}
                                item={item}
                                isDragginguploadingbutton={
                                  isDragginguploadingbutton
                                }
                                uploadbuttonLoadingid={uploadbuttonLoadingid}
                                handleDropwithOutpanlesWithoutslots={
                                  handleDropwithOutpanlesWithoutslots
                                }
                                handleUploadPopupwithoutSlots={
                                  handleUploadPopupwithoutSlots
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(page?.panels === null || page?.panels?.length === 0) &&
                  page?.page_slots?.length > 0 ? (
                    pageView === "default" ? (
                      <DefaultUploadCardWithoutPanelsWithoutSlots
                        page={page}
                        isDragginguploadingbutton={isDragginguploadingbutton}
                        handleDropwithOutpanlesWithoutslots={
                          handleDropwithOutpanlesWithoutslots
                        }
                        handleUploadPopupwithoutSlots={
                          handleUploadPopupwithoutSlots
                        }
                      />
                    ) : pageView === "detailed" ? (
                      <DetailedUploadCardWithoutPanelsWithoutSlots
                        page={page}
                        item={null}
                        isDragginguploadingbutton={isDragginguploadingbutton}
                        uploadbuttonLoadingid={uploadbuttonLoadingid}
                        handleDropwithOutpanlesWithoutslots={
                          handleDropwithOutpanlesWithoutslots
                        }
                        handleUploadPopupwithoutSlots={
                          handleUploadPopupwithoutSlots
                        }
                      />
                    ) : (
                      <UpdatedUploadCardWithoutPanelsWithoutSlots
                        page={page}
                        item={null}
                        isDragginguploadingbutton={isDragginguploadingbutton}
                        uploadbuttonLoadingid={uploadbuttonLoadingid}
                        handleDropwithOutpanlesWithoutslots={
                          handleDropwithOutpanlesWithoutslots
                        }
                        handleUploadPopupwithoutSlots={
                          handleUploadPopupwithoutSlots
                        }
                      />
                    )
                  ) : (
                    ""
                  )}

                  {unAttachedDocuments().length > 0 && (
                    // <>
                    //   <div className="d-flex align-items-center w-100 skewed-primary-gradient-custom p-5-x alpha  ">
                    //     <div
                    //       className="col-auto p-0 text-white"
                    //       style={{
                    //         marginLeft: "34px",
                    //         fontWeight: "600",
                    //         fontSize: "14px",
                    //       }}
                    //     >
                    //       &#160;
                    //     </div>
                    //   </div>
                    <>
                      <div className="m-l-7 m-b-5 flex-nowrap align-items-center">
                        <div
                          className="panel-color"
                          style={{
                            background: "var(--primary)",
                            left: "25px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              height: 0,
                              width: "10px",
                              height: "max-content",
                            }}
                          />
                          <h4
                            className="d-flex align-items-center  m-l-5"
                            style={{ color: "white" }}
                          >
                            <small className="font-weight-600 anti-skew">
                              Unattached Documents
                            </small>
                          </h4>
                        </div>
                      </div>
                      <div
                        // className="icon-text-boxes d-flex flex-wrap w-100 e-template-row m-t-5"
                        className="w-100 m-t-5 unattached-documents-container"
                        style={{
                          marginRight: "5px",
                          justifyContent: "end",
                          height: "auto",
                          ...(pageView !== "default" && {
                            display: "flex",
                            justifyContent: "flex-start",
                            flexWrap: "wrap",
                          }),
                        }}
                      >
                        {unAttachedDocuments().map((document) =>
                          pageView === "default" ? (
                            <DefaultViewCard2
                              key={document.id}
                              doc={document}
                              slot={undefined}
                              handleDocPreview={handleDocPreview}
                            />
                          ) : pageView === "detailed" ? (
                            <DetailedViewCard
                              key={document.id}
                              doc={document}
                              slot={undefined}
                              handleDocPreview={handleDocPreview}
                              modifiedView={true}
                            />
                          ) : (
                            <UpdatedViewCard
                              key={document.id}
                              doc={document}
                              slot={undefined}
                              handleDocPreview={handleDocPreview}
                              modifiedView={true}
                            />
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
              </React.Fragment>
            );
          } else if (page?.page?.name !== "Treatment") {
            return (
              <div key={index}>
                <div className="m-l-7 m-b-5 flex-nowrap align-items-center">
                  <div className="panel-icon" style={{ marginRight: "0px" }}>
                    <img
                      src={page?.page?.page_icon}
                      height={19}
                      width={19}
                      className="ic ic-19 d-flex align-items-center justify-content-center"
                    />
                  </div>
                  <div
                    className="panel-color"
                    style={{
                      background: "var(--primary)",
                      left: "25px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ height: 0, width: "10px" }} />
                    <h4
                      className="d-flex align-items-center  m-l-5"
                      style={{ color: "white", height: "max-content" }}
                    >
                      <small className="font-weight-600 anti-skew">
                        {page?.page?.name}
                      </small>
                    </h4>
                  </div>
                </div>
                <TabData
                  data={page || []}
                  loading={loading}
                  all={true}
                  refetchData={refetchData}
                  pageView={pageView}
                />
              </div>
            );
          }
          return null;
        }
      })}
    </>
  );
};

export default DocsTable;
