import React, { useEffect, useRef, useState } from "react";

const ROW_HEIGHT = 330;

const InboxPlaceholderRows = ({ inboxTab, inboxTabsCount }) => {
  const containerRef = useRef(null);
  const [placeholderCount, setPlaceholderCount] = useState(0);

  useEffect(() => {
    const calculatePlaceholders = () => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - 20; // Adjust margin if needed
        const totalRows = Math.ceil(availableHeight / ROW_HEIGHT);
        setPlaceholderCount(totalRows);
      }
    };

    calculatePlaceholders();
    window.addEventListener("resize", calculatePlaceholders);
    return () => window.removeEventListener("resize", calculatePlaceholders);
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {Array.from({ length: placeholderCount }).map((_, i) => (
        <div
          key={i}
          className="w-full px-0"
          style={{
            position: "relative",
            height: `${ROW_HEIGHT}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: i % 2 === 0 ? "var(--primary-2)" : "var(--primary-4)",
          }}
        ></div>
      ))}
    </div>
  );
};

export default InboxPlaceholderRows;
