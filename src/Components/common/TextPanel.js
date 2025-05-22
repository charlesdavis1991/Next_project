import React from "react";

function TextPanel({
  object,
  panel_name,
  className,
  onSelect,
  primaryText = "",
}) {
  return (
    <div className={`${className}`} onClick={onSelect}>
      <div className=" ">
        <div>
          <p
            className="columnsTitle text-center text-primary font-weight-semibold text-uppercase d-flex align-items-center justify-content-center "
            style={{ backgroundColor: "var(--primary-15)", height: "25px" }}
          >
            {panel_name}
          </p>
          {object?.statement_summary ? (
            object.statement_summary.length > 200 ? (
              <span title={object.statement_summary}>
                {object.statement_summary.slice(0, 200) + "..."}
              </span>
            ) : (
              <span>{object.statement_summary}</span>
            )
          ) : (
            <p className="text-primary-50">
              {primaryText.length > 0 ? primaryText : "Statement Summary"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TextPanel;
