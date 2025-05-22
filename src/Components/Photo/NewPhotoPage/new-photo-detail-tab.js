import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDocumentModal } from "../../common/CustomModal/CustomModalContext";
import HeaderSection from "../../DocPage/new-tab/headerSection";
import { PhotoDetailedCard } from "./components/photo-detailed-view-card";

const CARD_WIDTH = 255;
const GAP = 5;

const NewPhotoDetailedTab = ({ data, activeTab, refetchData, tabData }) => {
  const containerRef = useRef(null);
  const [cardsPerRow, setCardsPerRow] = useState(1);
  const { showDocumentModal, documentData } = useDocumentModal();

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
    const flatDocs = [];

    if (data === undefined || data === null) {
      return [];
    }
    data?.forEach((section) => {
      const sectionName = section.page?.name || "Unsorted";
      const isPanels = section?.page?.panels || false;
      const sectionIcon =
        section.page?.page_icon ||
        "https://simplefirm-bucket.s3.amazonaws.com/static/images/documents-icon-color_b6TvcB7.svg";

      const docIdToPanelMap = new Map();

      section?.panels?.forEach((panel) => {
        panel.photos?.forEach((photo) => {
          docIdToPanelMap.set(photo.id, {
            panelName: panel?.panel_name || "",
            panelId: panel?.id,
            specialty: panel?.specialty || null,
          });
        });
      });
      section?.page_docs?.forEach((photo) => {
        const panelInfo = docIdToPanelMap.get(photo.id);
        flatDocs.push({
          ...photo,
          sectionName,
          sectionIcon,
          isPanels: isPanels,
          panelName: panelInfo?.panelName || null,
          panelId: panelInfo?.panelId || null,
          specialty: panelInfo?.specialty || null,
        });
      });
    });

    const result = [];
    let idx = 0;
    while (idx < flatDocs.length) {
      const rowDocs = flatDocs?.slice(idx, idx + cardsPerRow);
      const sectionGroups = {};

      rowDocs?.forEach((photo) => {
        const key = photo.sectionName;
        if (!sectionGroups[key]) {
          sectionGroups[key] = {
            icon: photo.sectionIcon,
            isPanels: photo.isPanels,
            panelName: photo.panelName,
            panelId: photo.panelId,
            specialty: photo.specialty,
            photos: [],
          };
        }
        sectionGroups[key].photos.push(photo);
      });

      result.push(sectionGroups);
      idx += cardsPerRow;
    }

    return result;
  }, [cardsPerRow, data]);

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

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {rows.map((rowGroup, rowIndex) => (
        <div key={rowIndex} style={{ marginBottom: 5 }}>
          <div style={{ display: "flex", gap: GAP }}>
            {Object.entries(rowGroup).map(([sectionName, page], groupIndex) => (
              <div
                key={groupIndex}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <HeaderSection name={sectionName} icon={page.icon} />

                <div style={{ display: "flex", gap: GAP }}>
                  {page?.photos.map((photo) => (
                    <PhotoDetailedCard
                      key={photo.id}
                      photo={photo}
                      slot={photo?.photo_slot}
                      handleDocPreview={handleDocPreview}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewPhotoDetailedTab;
