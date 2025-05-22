import React, { useEffect, useRef, useState } from "react";
import DatesGapDropdown from "./DatesGapDropdown";
import styled from "styled-components";
import "./TreatmentPage.css";
import EditDeleteModal from "../Components/TreatmentPage/modals/edit-delete-modal-date/edit-detete-panel-for-dates-view";
import {
  formatDateForInputTreatment,
  formatDateForInputTreatmentShowcase,
} from "../Components/TreatmentPage/utils/helperFn";

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
const LightBgParagraph = styled.p`
  background-color: ${({ speciality }) =>
    mixColorWithWhite(speciality?.color, 10)} !important;
`;

const TreatmentDatesPageTable = ({
  treatmentDateData,
  setTreatmentDateData2,
  activeSpecialty,
  refetchTreatment,
}) => {
  console.log(treatmentDateData);

  const [fakeRows, setFakeRows] = useState([]);
  const tableWrapperRef = useRef(null);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (treatmentDate) => {
    setShow(true);
    setSelectedDate(treatmentDate);
  };

  const filteredData = React.useMemo(() => {
    if (!treatmentDateData) return [];

    if (activeSpecialty === "all") {
      return treatmentDateData;
    }

    return treatmentDateData.filter(
      (item) =>
        String(item?.client_provider?.specialty?.id) === String(activeSpecialty)
    );
  }, [treatmentDateData, activeSpecialty]);

  const fillTable = () => {
    const tableWrapper = tableWrapperRef.current;
    const tableBody = document.getElementById("table-body");

    if (tableWrapper && tableBody) {
      const tableHeight = tableWrapper.clientHeight;
      const rowHeight = tableBody.firstChild?.offsetHeight || 25;
      const existingRows = filteredData?.length || 0;
      const rowsToFill = Math.ceil(tableHeight / rowHeight) - existingRows;

      setFakeRows(
        rowsToFill > 0
          ? Array.from({ length: rowsToFill }, (_, i) => ({ id: `empty-${i}` }))
          : []
      );
    }
  };

  useEffect(() => {
    const variableMedBillWidth = () => {
      const providerColumns = [
        ...document.querySelectorAll(".provier-column-dates-treatment"),
      ];
      const datesColumn = [
        ...document.querySelectorAll(".dates-column-dates-treatment"),
      ];
      if (providerColumns.length === 0 || datesColumn.length === 0) return;
      if (treatmentDateData) {
        let providerMaxWidth = 355;
        providerColumns.forEach((col) => {
          const colWidth = col.offsetWidth;
          if (colWidth > providerMaxWidth) {
            providerMaxWidth = colWidth;
          }
        });
        providerColumns.forEach((col) => {
          col.style.minWidth = `${providerMaxWidth}px`;
          col.style.width = `${providerMaxWidth}px`;
        });

        let dateMaxWidth = 91;
        datesColumn.forEach((col) => {
          const colWidth = col.offsetWidth;
          if (colWidth > dateMaxWidth) {
            dateMaxWidth = colWidth;
          }
        });
        datesColumn.forEach((col) => {
          col.style.minWidth = `${dateMaxWidth}px`;
          col.style.width = `${dateMaxWidth}px`;
        });
      }
    };

    // setMaxColumnWidth(calculateMaxWidth());
    variableMedBillWidth();
  }, [treatmentDateData]);

  useEffect(() => {
    fillTable();
    window.addEventListener("resize", fillTable);
    return () => window.removeEventListener("resize", fillTable);
  }, [filteredData]);

  console.log(filteredData);

  return (
    <div
      ref={tableWrapperRef}
      style={{ height: "100%", overflowY: "auto", width: "100%" }}
    >
      <table
        className="table-striped"
        style={{ width: "100%", tableLayout: "auto", whiteSpace: "nowrap" }}
      >
        <thead
          style={{ backgroundColor: "var(--primary-15)", padding: "0px" }}
          className="text-white text-center color-primary c-font-weight-600"
        >
          <tr style={{ height: "25px" }}>
            <th
              className="provier-column-dates-treatment"
              style={{
                width: "1%",
                minWidth: "355px",
                padding: "0px",
                paddingLeft: "5px",
              }}
              scope="col"
            >
              MEDICAL PROVIDER
            </th>
            <th
              style={{ padding: "0px", width: "91px" }}
              className="dates-column-dates-treatment"
              scope="col"
            >
              DATE
            </th>
            <th style={{ padding: "0px", width: "68px" }} scope="col">
              RECORD
            </th>
            <th style={{ padding: "0px" }} scope="col">
              <div className="d-flex justify-content-center">
                <p className="">SHOW GAPS BEYOND</p>
                <DatesGapDropdown />
              </div>
            </th>
            <th style={{ padding: "0px" }} scope="col">
              TREATMENT NOTE
            </th>
          </tr>
        </thead>
        <tbody id="table-body">
          {filteredData.map((treatmentDateData, index) => (
            <>
              <tr
                className={`${index % 2 === 0 ? "bg-primary-2 hover-background-row" : "bg-primary-4 hover-background-row"} `}
                // className={index % 2 === 0 ? "bg-primary-2" : "bg-primary-4"}
                style={{ height: "25px", textAlign: "left", cursor: "default" }}
                key={`${treatmentDateData?.client_provider?.id}-${treatmentDateData?.treatment_date?.id}-${index}`}
                onClick={() => handleShow(treatmentDateData)}
              >
                <td
                  className="provier-column-dates-treatment pl-0 pt-0 pb-0"
                  style={{
                    paddingRight: "5px",
                    // backgroundColor:
                    //   treatmentDateData?.client_provider?.specialty
                    //     ?.secondary_color,
                  }}
                >
                  <LightBgParagraph
                    speciality={
                      treatmentDateData?.client_provider?.specialty || {
                        color: "#19395f",
                        secondary_color: "#75889f",
                      }
                    }
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ height: "25px" }}
                    >
                      <span
                        className="d-inline-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor:
                            treatmentDateData?.client_provider?.specialty
                              ?.color || "#19395f",
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "white",
                          height: "25px",
                          width: "25px",
                        }}
                      >
                        {treatmentDateData?.client_provider?.specialty?.name[0]}
                      </span>
                      <span
                        style={{
                          paddingLeft: "5px",
                          paddingRight: "5px",
                          fontWeight: "600",
                        }}
                        className=""
                      >
                        {
                          treatmentDateData?.client_provider?.treatment_location
                            ?.name
                        }
                      </span>
                    </div>
                  </LightBgParagraph>
                </td>
                <td style={{ fontWeight: "600" }}>
                  {formatDateForInputTreatmentShowcase(
                    treatmentDateData?.treatment_date?.date
                  )}
                </td>
                <td style={{ fontWeight: "600" }}>
                  {treatmentDateData?.client_provider?.recordCost}
                </td>
                <td style={{ fontWeight: "600" }}>
                  {treatmentDateData?.gap ? "Yes" : "No"}
                </td>
                <td style={{ fontWeight: "600" }}>
                  {treatmentDateData?.treatment_date?.description}
                </td>
              </tr>
            </>
          ))}
          {fakeRows.map((row, index) => (
            <tr
              className={index % 2 === 0 ? "bg-primary-2" : "bg-primary-4"}
              key={row.id}
            >
              <td colSpan="5" style={{ height: "25px" }}></td>
            </tr>
          ))}
        </tbody>
      </table>

      {show && (
        <EditDeleteModal
          treatmentDateData={treatmentDateData}
          date={selectedDate?.treatment_date}
          show={show}
          handleClose={handleClose}
          setAllTreatmentDates={setTreatmentDateData2}
          key={selectedDate?.treatment_date?.id}
          caseProvider={{
            providerprofile_office_name:
              selectedDate?.client_provider?.treatment_location?.name,
          }}
          refetchTreatment={refetchTreatment}
        />
      )}
    </div>
  );
};

export default React.memo(TreatmentDatesPageTable);
