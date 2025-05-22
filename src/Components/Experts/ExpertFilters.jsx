import React from "react";

const EXPERT_TYPES = [
  { id: "all", label: "All" },
  { id: "Client", label: "Plaintiff" },
  { id: "Defendant", label: "Defendant" },
  { id: "OtherParty", label: "Other Parties" }
];

const ExpertFilter = ({ activeType = "all", onTypeChange }) => {
  return (
    <div
      style={{ marginLeft: "0px" }}
      className="d-flex"
    >
      {EXPERT_TYPES.map((type, index) => {
        const isActive = activeType === type.id;
        const isPreviousActive = index > 0 && activeType === EXPERT_TYPES[index - 1].id;

        return (
          <span
            key={type.id}
            className={`d-flex TreatmentPage-all-trapezium align-items-center justify-content-center text-nowrap ${isActive ? "active" : ""}`}
            onClick={() => onTypeChange(type.id)}
            style={{
              cursor: "pointer",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              backgroundColor: isActive ? "var(--primary)" : "var(--primary-60)",
              height: "25px",
              paddingLeft: "5px",
              paddingRight: "5px",
              zIndex: isPreviousActive ? 1 : 2,
              marginLeft: index === 0 ? "0" : "0",
              position: "relative"
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && onTypeChange(type.id)}
            aria-pressed={isActive}
          >
            {type.label}
          </span>
        );
      })}
    </div>
  );
};

export default React.memo(ExpertFilter);