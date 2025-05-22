import React, { useEffect } from "react";
import Specialities from "../../BP/Specialities";

const SpecialtyFilters = ({
  specialitiesList,
  activeSpecialty,
  onSpecialtyChange,
  setMaxWidth,
}) => {
  const activeIndex =
    activeSpecialty === "all"
      ? -1
      : specialitiesList.findIndex((s) => s.id === activeSpecialty);

  useEffect(() => {
    const calculateAndApplyMaxWidths = () => {
      const specialtyColumns = document.querySelectorAll(
        ".specialty-name-items-width"
      );

      if (specialtyColumns.length === 0) return;
      let specialtyMaxWidth = 250;
      specialtyColumns.forEach((col) => {
        const textWidth = col.scrollWidth;
        if (textWidth > specialtyMaxWidth) {
          specialtyMaxWidth = textWidth;
        }
      });

      console.log(specialtyMaxWidth);
      setMaxWidth(specialtyMaxWidth);
    };

    calculateAndApplyMaxWidths();
  }, [specialitiesList]);

  return (
    <div
      style={{ marginLeft: "0px" }}
      className="d-flex specialty-name-items-width"
    >
      <span
        className={`d-flex TreatmentPage-all-trapezium align-items-center justify-content-center ${activeSpecialty === "all" ? "active" : ""}`}
        onClick={() => onSpecialtyChange("all")}
        style={{
          cursor: "pointer",
          color: "white",
          fontWeight: "700",
          fontSize: "16px",
          backgroundColor:
            activeSpecialty === "all" ? "var(--primary)" : "var(--primary-60)",
          height: "25px",
          paddingLeft: "10px",
          paddingRight: "10px",
          zIndex: 2,
        }}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === "Enter" && onSpecialtyChange("all")}
        aria-pressed={activeSpecialty === "all"}
      >
        All
      </span>

      {specialitiesList.map((specialitie, index) => {
        const isActive = activeSpecialty === specialitie.id;
        const isPreviousActive = index === activeIndex - 1;

        return (
          <Specialities
            key={specialitie.id}
            specialitie={specialitie}
            onSpecialtyChange={onSpecialtyChange}
            isActive={isActive}
            isPreviousActive={isPreviousActive}
          />
        );
      })}
    </div>
  );
};

export default React.memo(SpecialtyFilters);
