import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDocumentModal } from "../../common/CustomModal/CustomModalContext";
import HeaderSection from "../../DocPage/new-tab/headerSection";
import api, { api_without_cancellation } from "../../../api/api";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { BrokenPreviewImage, photoName } from "./components/photo-view-card";
import { Img } from "react-image";

const CARD_WIDTH = 255;
const GAP = 5;

function mixColorWithWhite(hex, percentage) {
  const whitePercentage = (100 - percentage) / 100;

  let r = parseInt(hex?.slice(1, 3), 16);
  let g = parseInt(hex?.slice(3, 5), 16);
  let b = parseInt(hex?.slice(5, 7), 16);

  // Mix each channel with white
  r = Math.floor(r + (255 - r) * whitePercentage);
  g = Math.floor(g + (255 - g) * whitePercentage);
  b = Math.floor(b + (255 - b) * whitePercentage);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const NewPhotoShownOnPage = ({ data, activeTab, refetchData, tabData }) => {
  const containerRef = useRef(null);
  const fileInputRef = useRef();
  const [cardsPerRow, setCardsPerRow] = useState(1);
  const { showDocumentModal, documentData } = useDocumentModal();
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateLayout = () => {
      const width = el.getBoundingClientRect().width;
      const perRow = Math.floor((width + GAP) / (CARD_WIDTH + GAP));
      setCardsPerRow(perRow || 1);
    };

    const observer = new ResizeObserver(updateLayout);
    observer.observe(el);

    updateLayout();

    return () => observer.disconnect();
  }, []);

  const rows = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const allSlots = [];

    // Process each section
    data.forEach((section) => {
      const sectionName = section.page?.name || "Unsorted";
      const isPanelsEnabled = section.page?.panels || false;
      const sectionIcon =
        section.page?.page_icon ||
        "https://simplefirm-bucket.s3.amazonaws.com/static/images/documents-icon-color_b6TvcB7.svg";

      // Get the page slots template
      const pageSlots = section.page_slots || [];

      // If panels are enabled, each panel should have its own set of slots
      // if (isPanelsEnabled && section.panels && section.panels.length > 0) {
      //   // For each panel, create its own set of slots
      //   section.panels.forEach((panel) => {
      //     // Each panel gets its own set of slots based on the page_slots template
      //     panel.slots = panel.slots || [];

      //     // If panel doesn't have slots defined, we'll create them based on the page template
      //     if (panel.slots.length === 0) {
      //       pageSlots.forEach((templateSlot) => {
      //         // Create a new slot for this panel based on the template
      //         if (templateSlot.slot_number !== 0) {
      //           // Skip slot_number 0
      //           const newSlot = { ...templateSlot, panel_id: panel.id };
      //           panel.slots.push(newSlot);
      //         }
      //       });
      //     }

      //     // Now process each panel's slots
      //     panel.slots.forEach((slotInfo) => {
      //       // Create the slot object
      //       const slot = {
      //         slotInfo,
      //         sectionName,
      //         sectionIcon,
      //         isPanels: true,
      //         panelName: panel.panel_name || null,
      //         panelId: panel.id || null,
      //         specialty: panel.specialty || null,
      //         photo: null,
      //         isAttached: false,
      //       };

      //       // Check if this slot has a matching photo
      //       const matchingPhoto = panel.photos?.find(
      //         (photo) => photo.photo_slot?.id === slotInfo.id
      //       );
      //       if (matchingPhoto) {
      //         slot.photo = matchingPhoto;
      //         slot.isAttached = true;
      //       }

      //       allSlots.push(slot);
      //     });

      //     const pageLevelSlots = pageSlots.filter((s) => s.slot_number === 0);
      //     pageLevelSlots.forEach((templateSlot) => {
      //       const slot = {
      //         slotInfo: templateSlot,
      //         sectionName,
      //         sectionIcon,
      //         isPanels: false,
      //         panelName: null,
      //         panelId: null,
      //         specialty: null,
      //         photo: null,
      //         isAttached: false,
      //       };

      //       // Check for existing photo in page_docs
      //       const matchingDoc = section.page_docs?.find(
      //         (doc) => doc.photo_slot?.id === templateSlot.id
      //       );
      //       if (matchingDoc) {
      //         slot.photo = matchingDoc;
      //         slot.isAttached = true;
      //       }

      //       allSlots.push(slot);
      //     });
      //   });
      // }

      console.log("Data", data);
      if (isPanelsEnabled && section.panels && section.panels.length > 0) {
        // First add PAGE-LEVEL slots (slot_number 0)
        const pageLevelSlots = pageSlots.filter((s) => s.slot_number === 0);
        pageLevelSlots.forEach((templateSlot) => {
          const slot = {
            slotInfo: templateSlot,
            sectionName,
            sectionIcon,
            isPanels: false, // Mark as page-level
            panelName: null,
            panelId: null,
            specialty: null,
            photo: null,
            isAttached: false,
          };

          // Check for existing photo in page_docs (page-level attachments)
          const matchingDoc = section.page_docs?.find(
            (doc) => doc.photo_slot?.id === templateSlot.id
          );
          if (matchingDoc) {
            slot.photo = matchingDoc;
            slot.isAttached = true;
          }

          allSlots.push(slot);
        });

        // Then process PANEL slots (non-zero slots)
        section.panels.forEach((panel) => {
          panel.slots = panel.slots || [];

          // Initialize panel slots excluding slot_number 0
          if (panel.slots.length === 0) {
            pageSlots.forEach((templateSlot) => {
              if (templateSlot.slot_number !== 0) {
                // Skip slot_number 0
                const newSlot = { ...templateSlot, panel_id: panel.id };
                panel.slots.push(newSlot);
              }
            });
          }

          // Process panel's slots
          panel.slots.forEach((slotInfo) => {
            const slot = {
              slotInfo,
              sectionName,
              sectionIcon,
              isPanels: true,
              panelName: panel.panel_name || null,
              panelId: panel.id || null,
              specialty: panel.specialty || null,
              photo: null,
              isAttached: false,
            };

            // Check if this slot has a matching photo
            const matchingPhoto = panel.photos?.find(
              (photo) => photo.photo_slot?.id === slotInfo.id
            );
            if (matchingPhoto) {
              slot.photo = matchingPhoto;
              slot.isAttached = true;
            }

            allSlots.push(slot);
          });
        });
      } else {
        // If no panels, create slots directly for the page
        pageSlots.forEach((slotInfo) => {
          const slot = {
            slotInfo,
            sectionName,
            sectionIcon,
            isPanels: false,
            panelName: null,
            panelId: null,
            specialty: null,
            photo: null,
            isAttached: false,
          };

          // Check if this slot has a matching document
          const matchingDoc = section.page_docs?.find(
            (doc) => doc.photo_slot?.id === slotInfo.id
          );
          if (matchingDoc) {
            slot.photo = matchingDoc;
            slot.isAttached = true;
          }

          allSlots.push(slot);
        });
      }
    });
    // Group slots into rows based on cardsPerRow
    const result = [];
    let currentIndex = 0;

    while (currentIndex < allSlots.length) {
      const rowSlots = allSlots.slice(currentIndex, currentIndex + cardsPerRow);
      const sectionGroups = {};

      rowSlots.forEach((slot) => {
        // Use only the section name as the key
        const key = slot.sectionName;

        if (!sectionGroups[key]) {
          sectionGroups[key] = {
            icon: slot.sectionIcon,
            isPanels: slot.isPanels,
            // Don't include panel specific info in the section group
            sectionName: slot.sectionName,
            slots: [],
          };
        }

        // But keep the panel information with each slot
        sectionGroups[key].slots.push({
          slotInfo: slot.slotInfo,
          photo: slot.photo,
          isAttached: slot.isAttached,
          // Keep the panel info with each slot
          panelId: slot.panelId,
          panelName: slot.panelName,
          specialty: slot.specialty,
        });
      });

      result.push(sectionGroups);
      currentIndex += cardsPerRow;
    }

    return result;
  }, [cardsPerRow, data]);

  const handleFileChange = async (event, slot) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await api_without_cancellation.post(
          `${origin}/api/upload_photo/${getClientId()}/${getCaseId()}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const result = await response.data;

        const res = await api_without_cancellation.post(
          "/api/attach_photo_to_page/",
          {
            page_id: slot?.slotInfo?.page?.id,
            case_id: getCaseId(),
            slot_id: slot?.slotInfo?.id,
            photo_id: result?.doc?.id,
            panel_id: slot?.panelId,
          }
        );
        if (res.status === 200) {
          refetchData();
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleFileChange2 = async (event, slot) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await api_without_cancellation.post(
          `${origin}/api/upload_photo/${getClientId()}/${getCaseId()}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const result = await response.data;

        const res = await api_without_cancellation.post(
          "/api/attach_photo_to_page/",
          {
            page_id: null,
            case_id: getCaseId(),
            slot_id: null,
            photo_id: result?.doc?.id,
            panel_id: null,
          }
        );
        if (res.status === 200) {
          refetchData();
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleDocPreview = (photo) => {
    showDocumentModal(
      "photo",
      photo.image,
      photo,
      tabData,
      refetchData,
      photo.case_thumbnail
    );
  };

  const [width, setWidth] = useState("");
  const divRef = useRef(null);
  const [cardWidth, setCardWidth] = useState("255px");

  useEffect(() => {
    if (divRef.current) {
      const width = divRef.current.getBoundingClientRect().width;
      setWidth(width);
    }
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {rows.map((rowGroup, rowIndex) => {
        return (
          <div key={rowIndex} style={{ marginBottom: 5 }}>
            <div style={{ display: "flex", gap: GAP }}>
              {Object.entries(rowGroup).map(
                ([sectionName, page], groupIndex) => {
                  return (
                    <div
                      key={groupIndex}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <HeaderSection name={sectionName} icon={page?.icon} />

                      <div style={{ display: "flex", gap: GAP }}>
                        {page?.slots?.map((slot, index) => {
                          if (slot?.isAttached === true) {
                            return (
                              <div
                                className="d-flex flex-column align-items-center justify-content-center"
                                // style={{ marginRight: "5px" }}
                              >
                                {sectionName === "Treatment" && (
                                  <div
                                    className="has-primary-font-detail-view-card"
                                    style={{
                                      display: "flex",
                                      justifyContent:
                                        slot?.panelName === null
                                          ? slot?.slotInfo?.slot_number === 0
                                            ? "center"
                                            : "flex-start"
                                          : "flex-start",
                                      alignItems: "center",
                                      // padding: "0px 10px",
                                      background: slot?.specialty?.color
                                        ? mixColorWithWhite(
                                            slot?.specialty?.color,
                                            10
                                          )
                                        : "var(--primary-15)",
                                      color: "var(--primary)",
                                      width: "255px",
                                      minWidth: "255px",
                                      maxWidth: "255px",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      height: "25px",
                                      textTransform: "uppercase",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {slot?.panelName !== null && (
                                      <>
                                        <span
                                          className="d-flex m-r-5 align-items-center justify-content-center"
                                          style={{
                                            width: "25px",
                                            height: "25px",
                                            background:
                                              slot?.specialty?.color || "#000", // fallback color
                                            color: "white",
                                            minWidth: "25px",
                                          }}
                                        >
                                          {slot?.specialty?.name?.[0] || "?"}
                                        </span>
                                        <span
                                          style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            height: "25px",
                                            textTransform: "uppercase",
                                            alignContent: "center",
                                          }}
                                        >
                                          {slot?.panelName}
                                        </span>
                                      </>
                                    )}

                                    {slot?.panelName === null && (
                                      <>
                                        {slot?.slotInfo?.slot_number !== 0 && (
                                          <span
                                            className="d-flex m-r-5 align-items-center justify-content-center"
                                            style={{
                                              width: "25px",
                                              height: "25px",
                                              background:
                                                slot?.specialty?.color ||
                                                "var(--primary)", // fallback color
                                              color: "white",
                                              minWidth: "25px",
                                            }}
                                          >
                                            {slot?.specialty?.name?.[0] || "?"}
                                          </span>
                                        )}
                                        <span
                                          className="m-l-2"
                                          style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            height: "25px",
                                            textTransform: "uppercase",
                                            alignContent: "center",
                                          }}
                                        >
                                          {slot?.slotInfo?.slot_name}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                )}
                                {sectionName !== "Treatment" && (
                                  <div
                                    className="has-primary-font-detail-view-card"
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      padding: "0px 10px",
                                      background: "var(--primary-15)",
                                      color: "var(--primary)",
                                      width: "255px",
                                      minWidth: "255px",
                                      maxWidth: "255px",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      height: "25px",
                                      textTransform: "uppercase",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {sectionName
                                      ? slot.panelName ||
                                        (slot?.slotInfo?.slot_number === 0 &&
                                          slot?.slotInfo?.slot_name) ||
                                        (slot?.slotInfo?.slot_name === null &&
                                          "Available") ||
                                        slot?.slotInfo?.slot_name ||
                                        "Unattached Photo"
                                      : "Unattached Photo"}
                                  </div>
                                )}
                                <div
                                  className={`font-weight-semibold cursor-pointer detailed-empty-card`}
                                  id="no-vertical-border"
                                  onClick={() => handleDocPreview(slot?.photo)}
                                  key={slot?.photo.id}
                                  style={{
                                    width: "255px",
                                    minWidth: "255px",
                                    maxWidth: "255px",
                                    minHeight: "255px",
                                    height: "255px",
                                    border: "none",
                                  }}
                                >
                                  <div
                                    title={
                                      slot?.photo.title ||
                                      slot?.slotInfo?.slot_name
                                    }
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                    }}
                                  >
                                    <span
                                      className="icon- wrap"
                                      style={{
                                        display: "inline-block",
                                        marginRight: "5px",
                                        marginTop: "2px",
                                      }}
                                    >
                                      <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
                                    </span>
                                    <p className="name new-view-title">
                                      {slot?.slotInfo?.slot_number}.{" "}
                                      {photoName(
                                        slot?.photo?.title,
                                        slot?.slotInfo?.slot_name
                                      )}
                                    </p>
                                  </div>
                                  <div
                                    ref={divRef}
                                    id={`${slot?.photo.id}-${slot?.photo.title || slot?.slotInfo?.slot_name}`}
                                    className="detailed-empty-card-img-div"
                                    style={{
                                      height: "220px",
                                    }}
                                  >
                                    {slot?.photo?.image || width ? (
                                      <Img
                                        src={slot?.photo?.image}
                                        unloader={<BrokenPreviewImage />}
                                        style={{
                                          height: 190,
                                          width: width * 0.78,
                                          objectFit: "contain",
                                        }}
                                      />
                                    ) : (
                                      <BrokenPreviewImage />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div
                                className="d-flex flex-column align-items-center justify-content-center"
                                // style={{ marginRight: "5px" }}
                              >
                                {sectionName === "Treatment" && (
                                  <div
                                    className="has-primary-font-detail-view-card"
                                    style={{
                                      display: "flex",
                                      justifyContent:
                                        slot?.panelName === null
                                          ? slot?.slotInfo?.slot_number === 0
                                            ? "center"
                                            : "flex-start"
                                          : "flex-start",
                                      alignItems: "center",
                                      // padding: "0px 10px",
                                      background: slot?.specialty?.color
                                        ? mixColorWithWhite(
                                            slot?.specialty?.color,
                                            10
                                          )
                                        : "var(--primary-15)",
                                      color: "var(--primary)",
                                      width: "255px",
                                      minWidth: "255px",
                                      maxWidth: "255px",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      height: "25px",
                                      textTransform: "uppercase",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {slot?.panelName !== null && (
                                      <>
                                        <span
                                          className="d-flex m-r-5 align-items-center justify-content-center"
                                          style={{
                                            width: "25px",
                                            height: "25px",
                                            background:
                                              slot?.specialty?.color || "#000", // fallback color
                                            color: "white",
                                            minWidth: "25px",
                                          }}
                                        >
                                          {slot?.specialty?.name?.[0] || "?"}
                                        </span>
                                        <span
                                          style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            height: "25px",
                                            textTransform: "uppercase",
                                            alignContent: "center",
                                          }}
                                        >
                                          {slot?.panelName}
                                        </span>
                                      </>
                                    )}

                                    {slot?.panelName === null && (
                                      <>
                                        {slot?.slotInfo?.slot_number !== 0 && (
                                          <span
                                            className="d-flex m-r-5 align-items-center justify-content-center"
                                            style={{
                                              width: "25px",
                                              height: "25px",
                                              background:
                                                slot?.specialty?.color ||
                                                "var(--primary)", // fallback color
                                              color: "white",
                                              minWidth: "25px",
                                            }}
                                          >
                                            {slot?.specialty?.name?.[0] || ""}
                                          </span>
                                        )}
                                        <span
                                          className="m-l-2"
                                          style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            height: "25px",
                                            textTransform: "uppercase",
                                            alignContent: "center",
                                          }}
                                        >
                                          {slot?.slotInfo?.slot_name}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                )}
                                {sectionName !== "Treatment" && (
                                  <div
                                    className="has-primary-font-detail-view-card"
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      padding: "0px 10px",
                                      background: "var(--primary-15)",
                                      color: "var(--primary)",
                                      width: "255px",
                                      minWidth: "255px",
                                      maxWidth: "255px",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      height: "25px",
                                      textTransform: "uppercase",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {sectionName
                                      ? slot.panelName ||
                                        (slot?.slotInfo?.slot_number === 0 &&
                                          slot?.slotInfo?.slot_name) ||
                                        (slot?.slotInfo?.slot_name === null &&
                                          "Available") ||
                                        slot?.slotInfo?.slot_name ||
                                        "Unattached Photo"
                                      : "Unattached Photo"}
                                  </div>
                                )}

                                <div
                                  className="d-flex flex-column align-items-center justify-content-center"
                                  style={{
                                    width: "255px",
                                    height: "255px",
                                    cursor: "pointer",
                                    background: "var(--primary-4)",
                                  }}
                                  onClick={() =>
                                    document
                                      .getElementById(
                                        `file-upload-${rowIndex}-${groupIndex}-${index}`
                                      )
                                      ?.click()
                                  }
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file) {
                                      handleFileChange(
                                        { target: { files: [file] } },
                                        slot
                                      );
                                    }
                                  }}
                                >
                                  <i className="ic ic-60 ic-placeholder-grey cursor-pointer m-t-10"></i>
                                  <p className="text-lg-grey m-t-5">
                                    Click or Drag to Upload
                                  </p>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id={`file-upload-${rowIndex}-${groupIndex}-${index}`} // unique ID
                                    style={{ display: "none" }}
                                    onChange={(e) => handleFileChange(e, slot)}
                                  />
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  );
                }
              )}

              {rows.length === rowIndex + 1 && activeTab === "all" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "255px",
                  }}
                >
                  <HeaderSection
                    name={"Unsorted"}
                    icon={
                      "https://simplefirm-bucket.s3.amazonaws.com/static/images/documents-icon-color_b6TvcB7.svg"
                    }
                  />

                  <div style={{ display: "flex", gap: GAP }}>
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <div
                        className="has-primary-font-detail-view-card"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "0px 10px",
                          background: "var(--primary-15)",
                          color: "var(--primary)",
                          width: "255px",
                          minWidth: "255px",
                          maxWidth: "255px",
                          fontSize: "14px",
                          fontWeight: "600",
                          height: "25px",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        Save to Case
                      </div>

                      <div
                        style={{
                          background: "var(--primary-4)",
                        }}
                        className="d-flex flex-column align-items-center justify-content-center"
                      >
                        <div
                          className="d-flex flex-column align-items-center justify-content-center"
                          style={{
                            width: "255px",
                            height: "255px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            document
                              .getElementById(
                                `file-upload-${"unsorted"}-${"icon"}`
                              )
                              ?.click()
                          }
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file) {
                              handleFileChange2({ target: { files: [file] } });
                            }
                          }}
                        >
                          <i className="ic ic-60 ic-placeholder-grey cursor-pointer m-t-10"></i>
                          <p className="text-lg-grey m-t-5">
                            Click or Drag to Upload
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            id={`file-upload-${"unsorted"}-${"icon"}`} // unique ID
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange2(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {activeTab === "unsorted" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "255px",
          }}
        >
          <HeaderSection
            name={"Unsorted"}
            icon={
              "https://simplefirm-bucket.s3.amazonaws.com/static/images/documents-icon-color_b6TvcB7.svg"
            }
          />

          <div style={{ display: "flex", gap: GAP }}>
            <div className="d-flex flex-column align-items-center justify-content-center">
              <div
                className="has-primary-font-detail-view-card"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0px 10px",
                  background: "var(--primary-15)",
                  color: "var(--primary)",
                  width: "255px",
                  minWidth: "255px",
                  maxWidth: "255px",
                  fontSize: "14px",
                  fontWeight: "600",
                  height: "25px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Save to Case
              </div>

              <div
                style={{
                  background: "var(--primary-4)",
                }}
                className="d-flex flex-column align-items-center justify-content-center"
              >
                <div
                  className="d-flex flex-column align-items-center justify-content-center"
                  style={{
                    width: "255px",
                    height: "255px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    document
                      .getElementById(`file-upload-${"unsorted"}-${"icon"}`)
                      ?.click()
                  }
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      handleFileChange2({ target: { files: [file] } });
                    }
                  }}
                >
                  <i className="ic ic-60 ic-placeholder-grey cursor-pointer m-t-10"></i>
                  <p className="text-lg-grey m-t-5">Click or Drag to Upload</p>
                  <input
                    type="file"
                    accept="image/*"
                    id={`file-upload-${"unsorted"}-${"icon"}`} // unique ID
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange2(e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPhotoShownOnPage;
