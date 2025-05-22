import React, { useRef, useState, useEffect } from "react";

function InboxPanelFileName({ text, maxWidth, suffix = ".pdf" }) {
  const textRef = useRef(null);
  const [truncatedText, setTruncatedText] = useState(text);

  //   useEffect(() => {
  //     const calculateAndApplyMaxWidths = () => {

  //       const fileName = document.querySelectorAll(".file-name-doc");

  //       if (fileName.length === 0) return;

  //       let fileNameMaxWidth = 120;
  //       fileName.forEach((col) => {
  //         const textWidth = col.scrollWidth;
  //         console.log(textWidth);

  //         if (textWidth > fileNameMaxWidth) {
  //           fileNameMaxWidth = textWidth;
  //         }
  //       });

  //       console.log(fileNameMaxWidth);

  //       fileName.forEach((col) => {
  //         col.style.width = `${fileNameMaxWidth}px`;
  //       });
  //     };

  //     calculateAndApplyMaxWidths();
  //   }, [text]);

  //   useEffect(() => {
  //     if (textRef.current) {
  //       const fullTextWidth = textRef.current.scrollWidth;
  //       console.log(fullTextWidth);

  //       // If the full text width is less than or equal to maxWidth, set truncatedText to full text
  //       if (fullTextWidth <= maxWidth) {
  //         setTruncatedText(text); // No truncation needed
  //         return;
  //       }

  //       const container = document.createElement("span");
  //       container.style.visibility = "hidden";
  //       container.style.position = "absolute";
  //       container.style.whiteSpace = "nowrap";
  //       container.style.fontWeight = "600";
  //       document.body.appendChild(container);

  //       let truncated = text;
  //       container.textContent = `${truncated}...${suffix}`;

  //       // Truncate the text until it fits within maxWidth
  //       while (container.offsetWidth > maxWidth && truncated.length > 0) {
  //         truncated = truncated.slice(0, -1);
  //         container.textContent = `${truncated}...${suffix}`;
  //       }

  //       // Set the truncated text with ellipsis and suffix
  //       setTruncatedText(`${truncated}...${suffix}`);
  //       document.body.removeChild(container);
  //     }
  //   }, [text, maxWidth, suffix]);

  return (
    <span
      className="m-l-5 m-r-5 d-flex  align-items-center file-name-doc"
      ref={textRef}
      style={{
        overflow: "hidden",
        textOverflow: "clip",
        whiteSpace: "nowrap",
        fontWeight: "600",
        width: `auto`,
        maxWidth: " max-content",
        display: "inline-block",
      }}
    >
      <span className="d-flex align-items-center m-r-5">
        <i className="ic ic-19 cursor-pointer img-19px ic-file-colored"></i>
      </span>

      {truncatedText}
    </span>
  );
}

export default InboxPanelFileName;
