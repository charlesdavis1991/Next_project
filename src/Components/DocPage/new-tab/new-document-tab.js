import React, { useRef, useState, useEffect, useMemo } from "react";
import HeaderSection from "./headerSection";
import { useDocumentModal } from "../../common/CustomModal/CustomModalContext";
import axios from "axios";
import { DetailedViewCard } from "../DetailedViewCards";

const CARD_WIDTH = 255;
const GAP = 5;

const NewDocumentTab = ({ data, refetchData }) => {
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
        panel.documents?.forEach((doc) => {
          docIdToPanelMap.set(doc.id, {
            panelName: panel?.panel_name || "",
            panelId: panel?.id,
            specialty: panel?.specialty || null,
          });
        });
      });
      section?.page_docs?.forEach((doc) => {
        const panelInfo = docIdToPanelMap.get(doc.id);
        flatDocs.push({
          ...doc,
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

      rowDocs?.forEach((doc) => {
        const key = doc.sectionName;
        if (!sectionGroups[key]) {
          sectionGroups[key] = {
            icon: doc.sectionIcon,
            isPanels: doc.isPanels,
            panelName: doc.panelName,
            panelId: doc.panelId,
            specialty: doc.specialty,
            docs: [],
          };
        }
        sectionGroups[key].docs.push(doc);
      });

      result.push(sectionGroups);
      idx += cardsPerRow;
    }

    return result;
  }, [cardsPerRow, data]);

  const handleDocPreview = (doc) => {
    console.log(`Previewing document with ID: ${doc?.id}`);
    console.log("DOC DATA", doc);
    axios
      .get(`${origin}/api/attorney-staff/${doc.attached_by?.id}/profile-image/`)
      .then((response) => {
        doc.attached_by.profile_pic_29p = mediaRoute(
          response.data.profile_image
        );
      })
      .catch((error) => {
        console.error(`Error fetching profile image: ${error}`);
      });

    showDocumentModal("document", doc.upload, doc, refetchData);
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
                  {page?.docs.map((doc, docIndex) => (
                    <DetailedViewCard
                      key={doc.id}
                      doc={doc}
                      slot={doc?.document_slot}
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

export default NewDocumentTab;
