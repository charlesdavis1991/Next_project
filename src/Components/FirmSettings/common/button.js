import React from "react";

const Button = ({
  text,
  onClick,
  className,
  type = "button",
  isFileUpload = false,
  onFileChange,
}) => {
  const handleClick = () => {
    if (isFileUpload) {
      document.getElementById("hiddenFileInput").click();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <button
        style={{ fontSize: "14px" }}
        type={type}
        className={`btn ${className}`}
        onClick={handleClick}
      >
        {text}
      </button>

      {isFileUpload && (
        <input
          type="file"
          id="hiddenFileInput"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
      )}
    </>
  );
};

export default Button;
