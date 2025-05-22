import React from "react";
import styled from "styled-components";

function mixColorWithWhite(hex, percentage) {
  const whitePercentage = (100 - percentage) / 100;

  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Mix each channel with white
  r = Math.floor(r + (255 - r) * whitePercentage);
  g = Math.floor(g + (255 - g) * whitePercentage);
  b = Math.floor(b + (255 - b) * whitePercentage);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const Corners = styled.a`
  position: relative;

  ${({ speciality, isActive, isPreviousActive }) =>
    `
       
  &::after,&::before {
    content: "";
    position: absolute;
    top: 0;
    width: 0;
    display: block;
    z-index: 3;
  }
    &::before{
     right: 100%;
     border-left: 5px solid transparent;
     border-top: 25px solid ${mixColorWithWhite(speciality.color, 50)};
     ${isActive ? "border-top: 0; border-bottom: 25px solid " + speciality.color + ";" : ""}
    }
  &::after {
    left: 100%;
    border-right: 5px solid transparent;
    ${
      isPreviousActive
        ? `border-top: 25px solid ${isActive ? speciality.color : mixColorWithWhite(speciality.color, 50)};
           border-bottom: 0;`
        : `border-bottom: 25px solid ${isActive ? speciality.color : mixColorWithWhite(speciality.color, 50)};
           border-top: 0;`
    }
    /* Add more specific z-index when this is the previously selected tab */
    ${isPreviousActive ? `z-index: 4;` : ``}
  }
    `}
`;

function Specialities({
  specialitie,
  onSpecialtyChange,
  isActive,
  isPreviousActive,
}) {
  console.log(specialitie);
  return (
    <span className={`has-speciality-color-${specialitie?.id}`}>
      <Corners
        speciality={specialitie}
        isActive={isActive}
        isPreviousActive={isPreviousActive}
        className={` d-flex align-items-center justify-content-center ${isActive ? "bg-speciality" : "bg-speciality-50"}`}
        onClick={() => onSpecialtyChange(specialitie?.id)}
        style={{
          cursor: "pointer",
          backgroundColor: isActive
            ? specialitie?.color
            : mixColorWithWhite(specialitie.color, 50),
          height: "25px",
          width: "25px",
          color: "white",
          fontWeight: "700",
          fontSize: "16px",
          zIndex: isActive ? 5 : 3,
          marginRight: "5px",
        }}
      >
        {specialitie?.name[0]}
      </Corners>
    </span>
  );
}

export default Specialities;
