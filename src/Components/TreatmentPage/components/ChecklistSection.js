import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PanelChecklistTreatment from "./PanelChecklist";

const CheckListSection = styled.div`
  background-color: ${({ speciality }) => speciality.color};
  position: relative;

  ${({ speciality }) =>
    `
       
  &::before {
    content: "";
    position: absolute;
    top: 0;
    width: 0;
    display: block;
    z-index: 3;
   
    
  }
    &::before{
     right: 100%;
  border-left: 10px solid transparent;
  border-top: 50px solid ${speciality.color};  // use border-bottom for trapezium
 
    }
 
    `}
`;

const CheckListComponent = (speciality) => {
  const [show, setShow] = React.useState(false);
  const [checklistData, setChecklistData] = useState(null);

  const trackedElementRef = useRef(null);

  return (
    <CheckListSection
      speciality={speciality.speciality}
      ref={trackedElementRef}
      style={{
        width: "196px",
        zIndex: "2",
        marginTop: "25px",
        ...(checklistData !== null &&
          show === true && { marginTop: `${200 + 25}px` }),
        ...(checklistData !== null && show === true && { zIndex: `3` }),
        // ...(topMargin !== null &&
        //   show === true && { top: `${topMargin - 195}px` }),
      }}
      className="CheckListSection"
    >
      <PanelChecklistTreatment
        entity={"Treatment"}
        entity_id={speciality?.provider?.id}
        setTopMargin={setChecklistData}
        setTopMarginShow={setShow}
      />
    </CheckListSection>
  );
};

export default React.memo(CheckListComponent);
