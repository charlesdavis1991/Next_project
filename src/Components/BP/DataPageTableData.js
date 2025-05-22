import React, { useEffect } from "react";
import styled from "styled-components";

const SpecialityContainer = styled.div`
  border-box: box-sizing;
  margin-bottom: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const TopHeader = styled.div`
  background-color: ${({ speciality }) =>
    mixColorWithWhite(speciality?.color, 10)};
`;

const LightBgParagraph = styled.p`
  background-color: ${({ speciality }) =>
    mixColorWithWhite(speciality?.color, 10)} !important;
`;

const TopHead = styled.div`
  background-color: ${({ speciality }) => speciality?.color};

  &::before,
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    z-index: 0;
    height: 25px;
    background-color: ${({ speciality }) => speciality?.color};
  }

  &::before {
    width: 14px;
    left: -12px;
    transform-origin: bottom left;
    transform: skew(-11.31deg);
  }

  &::after {
    width: 14px;
    right: -11px; // Positioning on the opposite side
    transform-origin: bottom right;
    transform: skew(11.31deg); // Mirror skew effect
  }
`;

const CheckListSection = styled.div`
  background-color: ${({ speciality }) => speciality?.color} !important;

  &::after {
    border-top-color: ${({ speciality }) => speciality?.color} !important;
  }
`;

const TreatmentButton = styled.a`
  background-color: ${({ speciality }) => speciality?.color} !important;
  color: #fff !important;
`;

function mixColorWithWhite(hex, percentage) {
  const whitePercentage = (100 - percentage) / 100;

  let r = parseInt(hex?.slice(1, 3), 16);
  let g = parseInt(hex?.slice(3, 5), 16);
  let b = parseInt(hex?.slice(5, 7), 16);

  // Mix each channel with white
  r = Math.floor(r + (255 - r) * whitePercentage);
  g = Math.floor(g + (255 - g) * whitePercentage);
  b = Math.floor(b + (255 - b) * whitePercentage);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const StyledSpan = styled.span`
  background-color: ${({ speciality }) => speciality?.color} !important;
`;

const StyledParagraph = styled.p`
  background-color: ${({ speciality }) =>
    speciality?.secondary_color} !important;
`;

function DataPageTableData({
  treatmentDateData,
  specialitie,
  caseProvider,
  handleShow,
}) {
  return (
    <>
      {treatmentDateData?.gap === true ? (
        <tr
          id="client_provider_treatment_date specialty-panel-2"
          data-toggle="modal"
          data-target="#case-provider-edit-modal"
          onClick={handleShow}
          className="color-black specialty-panel-2"
        >
          <td
            className=" pr-3 vertical-padding-5 color-black text-nowrap position-relative"
            width="50px;"
          >
            <span className="position-absolute gap-text-span">
              {treatmentDateData?.treatment_date?.days} Day Treatment gap From:{" "}
              {treatmentDateData?.treatment_date?.first_date} To:{" "}
              {treatmentDateData?.treatment_date?.second_date}{" "}
            </span>
          </td>
          <td
            className="vertical-padding-5 color-black text-nowrap"
            width="15px;"
          ></td>

          <td className="vertical-padding-5 color-black text-nowrap"></td>
          <td className="vertical-padding-5 color-black"></td>

          <td className="pt-2 pb-0 text-left width-30"></td>
        </tr>
      ) : (
        <tr
          id="client_provider_treatment_date"
          data-toggle="modal"
          data-target="#case-provider-edit-modal"
          onclick="treatmentmodalinfo(this)"
          data-table_id="92"
          data-treatment_date_id1="116"
          data-description="aa"
          data-date="Aug. 2, 2024, midnight"
          data-client_provider_id="92"
          className="color-black  specialty-panel-2"
          onClick={handleShow}
        >
          {/*}    <td className="d-flex align-items-center justify-content-center">
                        <span className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"></span>
            </td>*/}
          <td
            className="client-location-class text-nowrap has-speciality-color-2"
            width="50px;"
          >
            <div className="title-col-row height-25  ">
              <div className="d-flex align-items-center justify-content-left align-items-center height-25">
                <StyledSpan
                  speciality={specialitie}
                  className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
                >
                  {specialitie?.name[0]}
                </StyledSpan>

                <StyledParagraph
                  speciality={specialitie}
                  className="d-flex p-l-5 p-r-5 align-items-center text-lg mb-0 
                                 height-25 align-self-center"
                  style={{ width: "100%" }}
                >
                  {treatmentDateData?.client_provider?.treatment_location?.name}
                </StyledParagraph>
              </div>
            </div>
          </td>
          <td className="client-location-class" width="15px;">
            {treatmentDateData?.treatment_date?.date}
          </td>
          <td className="client-location-class line-height-26"></td>
          <td className="client-location-class line-height-26"></td>

          <td className="py-2 width-30 vertical-padding-5">
            {treatmentDateData?.treatment_date?.description}
          </td>
        </tr>
      )}
    </>
  );
}

export default DataPageTableData;
