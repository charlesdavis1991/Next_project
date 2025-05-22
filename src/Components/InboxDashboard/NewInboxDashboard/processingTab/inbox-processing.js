import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import DocPanelItem from "./doc-panel-item";

const TILE_HEIGHT = 330;

const InboxProcessingTabNew = () => {
  const inboxDocPanels = useSelector((state) => state.inbox.inboxDocPanels);
  const containerRef = useRef(null);
  const [layout, setLayout] = useState({ cols: 0, tileWidth: 0, rows: 0 });

  useEffect(() => {
    const calculateLayout = () => {
      const container = containerRef.current;
      if (container) {
        const width = container.clientWidth;
        const cols = Math.floor(width / 200);
        const tileWidth = width / cols;
        const rows = Math.ceil(
          (window.innerHeight - container.getBoundingClientRect().top) /
            TILE_HEIGHT
        );

        setLayout({ cols, tileWidth, rows });
      }
    };

    calculateLayout();
    window.addEventListener("resize", calculateLayout);
    return () => window.removeEventListener("resize", calculateLayout);
  }, []);

  const { cols, tileWidth, rows } = layout;
  const totalTiles = rows * cols;
  const panelsToShow = inboxDocPanels || [];
  return (
    <div
      ref={containerRef}
      className="processing-images"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-start",
        height: "100%",
      }}
    >
      {[...Array(totalTiles)].map((_, index) => {
        const hasPanel = panelsToShow[index];

        return (
          <div
            key={`tile-${index}`}
            style={{
              width: `${tileWidth}px`,
              height: `${TILE_HEIGHT}px`,
              backgroundColor:
                (Math.floor(index / cols) + (index % cols)) % 2 === 0
                  ? "var(--primary-2)"
                  : "var(--primary-4)",
              boxSizing: "border-box",
              padding: "0",
              margin: "0",
            }}
          >
            {hasPanel && (
              <div style={{ width: "100%", height: "100%" }}>
                <DocPanelItem docPanel={hasPanel} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InboxProcessingTabNew;
