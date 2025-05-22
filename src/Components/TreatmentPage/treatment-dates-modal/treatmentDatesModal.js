import React, { useEffect, useState, useRef } from "react";
import { Col, Modal, Nav, Row, Tab, Button } from "react-bootstrap";
import axios, { all } from "axios"; // Added missing import
import mixColorWithWhite, {
  formatDateForInput,
  formatDateForInputDisplayVisits,
} from "../utils/helperFn";
import "./treatmentDatesModal.css";
import { useGetProviderInfo } from "../hooks/useGetProviderInfo";
import TreatmentDatesNewRow from "./treatmentDatesRowModal";
import { api_without_cancellation } from "../../../api/api";
import IncidentIcon from "../../../assets/images/incident.svg";

function TreatmentDatesModal({
  show,
  handleClose,
  caseProvider,
  specialitie,
  firmName,
}) {
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const [type, setType] = useState("addTreatmentDate");
  const dropdownRef = useRef(null);
  const [selectedSpecialtyProvider, setSelectedSpecialtyProvider] =
    useState("");
  const [dropdownOpenManual, setDropdownOpenManual] = useState(false);

  // Create combined options for the dropdown
  const dropdownOptions = React.useMemo(() => {
    if (!caseProvider || !specialitie || !Array.isArray(specialitie)) {
      return [];
    }

    const defaultSpecialty = {
      id: "null",
      name: "No Speciality",
      color: "#19395f",
      secondary_color: "#75889f",
    };

    return caseProvider.map((provider) => {
      let matchedSpecialty;

      if (provider.specialty === null) {
        // Use the default specialty object when provider.specialty is null
        matchedSpecialty = defaultSpecialty;
      } else {
        // Find matching specialty from the specialitie array
        matchedSpecialty = specialitie.find(
          (spec) => spec.id === provider.specialty
        );
      }

      const specialtyName = matchedSpecialty ? matchedSpecialty.name : "";
      const providerName = provider.providerprofile_office_name || "";

      return {
        id: provider.id,
        label: `${specialtyName} - ${providerName}`,
        provider: provider,
        specialty: matchedSpecialty,
      };
    });

    // return caseProvider.map((provider) => {
    //   const matchedSpecialty = specialitie.find(
    //     (spec) =>
    //       spec.id === provider.specialty || spec.id === provider.specialty
    //   );

    //   const specialtyName = matchedSpecialty ? matchedSpecialty.name : "";
    //   const providerName = provider.providerprofile_office_name || "";

    //   return {
    //     id: provider.id,
    //     label: `${specialtyName} - ${providerName}`,
    //     provider: provider,
    //     specialty: matchedSpecialty,
    //   };
    // });
  }, [caseProvider, specialitie]);

  const handleDropdownChange = (special) => {
    setSelectedSpecialtyProvider(special);
    setDropdownOpenManual(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpenManual(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // This function will calculate and apply the maximum width for specialty and provider columns
    const calculateAndApplyMaxWidths = () => {
      // Don't run if the dropdown isn't open
      if (!dropdownOpenManual) return;

      const specialtyColumns = document.querySelectorAll(".specialty-name");
      const providerColumns = document.querySelectorAll(
        ".provider-col-provider"
      );
      const dropdownProvider = document.querySelectorAll(
        ".dropdown-width-menu-items" // Fixed class selector
      );

      if (specialtyColumns.length === 0 || providerColumns.length === 0) return;

      // Calculate the maximum width needed for specialty names
      let specialtyMaxWidth = 162;
      specialtyColumns.forEach((col) => {
        // Get the actual text width
        const textWidth = col.scrollWidth;
        if (textWidth > specialtyMaxWidth) {
          specialtyMaxWidth = textWidth;
        }
      });

      // Calculate the maximum width needed for provider names
      let providerMaxWidth = 364;
      providerColumns.forEach((col) => {
        const colWidth = col.scrollWidth;
        if (colWidth > providerMaxWidth) {
          providerMaxWidth = colWidth;
        }
      });

      const totalRequiredWidth = specialtyMaxWidth + providerMaxWidth;

      // Use either the total required width or 526, whichever is larger
      const dropdownWidth = Math.max(totalRequiredWidth, 526);
      // Apply the maximum widths to all specialty and provider columns
      specialtyColumns.forEach((col) => {
        col.parentElement.style.width = `${specialtyMaxWidth}px`;
      });

      providerColumns.forEach((col) => {
        col.style.width = `${providerMaxWidth}px`;
      });
      dropdownProvider.forEach((dropdown) => {
        dropdown.style.maxWidth = `${dropdownWidth}px`;
        dropdown.style.minWidth = `${dropdownWidth}px`;
      });
    };

    // Run the calculation after the dropdown renders
    if (dropdownOpenManual) {
      // Use a small timeout to ensure the DOM is fully rendered
      setTimeout(calculateAndApplyMaxWidths, 50);
    }
  }, [dropdownOpenManual, dropdownOptions]);

  const [addTreatmentDate, setAddTreatmentDate] = useState({
    date: "",
    treatmentNote: "",
  });
  const [allTreatmentDates, setAllTreatmentDates] = useState([]);
  const [firmNameData, setFirmNameData] = useState({
    date: formatDateForInput(firmName?.incident_date) ?? "",
  });

  // Make sure useGetProviderInfo returns the expected structure or handle nulls properly

  // const providerId = selectedSpecialtyProvider?.id || null;

  // const { data } = useGetProviderInfo(providerId);

  // useEffect(() => {
  //   async function fetchTfAllTreatmentDates() {
  //     try {
  //       const { data } = await axios.get(
  //         origin +
  //           "/api/treatment/case-providers/all-treatment-dates/" +
  //           selectedSpecialtyProvider?.id +
  //           "/"
  //       );
  //       setAllTreatmentDates(data);
  //     } catch (error) {
  //       console.error("Error fetching treatment dates:", error);
  //     }
  //   }

  //   if (selectedSpecialtyProvider?.id) {
  //     fetchTfAllTreatmentDates();
  //   }
  // }, [selectedSpecialtyProvider?.id, origin]); // Added origin to dependencies

  const handleDatesSave = async () => {
    try {
      const response = await Promise.all(
        allTreatmentDates.map((treatment) =>
          api_without_cancellation.post(`/api/treatment/add_treatment_date/`, {
            case_provider_id:
              treatment?.selectedSpecialtyProvider?.provider?.id,
            new_treatment_date: treatment.date,
            new_treatment_notes: treatment.description,
          })
        )
      );

      const allSuccess = response.every(
        (res) => res.status >= 200 && res.status < 300
      );

      if (allSuccess) {
        setAllTreatmentDates([]);
        setAddTreatmentDate({
          date: "",
          treatmentNote: "",
        });
        handleClose("true");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const addTreatmentDatesData = async () => {
    setAllTreatmentDates((prevDates) => [
      ...prevDates,
      {
        selectedSpecialtyProvider: selectedSpecialtyProvider,
        date: addTreatmentDate.date,
        description: addTreatmentDate.treatmentNote,
      },
    ]);
    setAddTreatmentDate({
      date: "",
      treatmentNote: "",
    });
    // try {
    //   const response = await axios.post(
    //     `${origin}/api/treatment/add_treatment_date/`,
    //     {
    //       case_provider_id: selectedSpecialtyProvider?.id,
    //       new_treatment_date: addTreatmentDate?.date?.split("T")[0], // Fixed from data to date
    //       new_treatment_notes: addTreatmentDate.treatmentNote,
    //     }
    //   );
    //   if (response.data) {
    //     console.log("Response:", response.data);
    //     setAllTreatmentDates((prevDates) => [...prevDates, response.data]);
    //   }
    //   setAddTreatmentDate({
    //     date: "",
    //     treatmentNote: "",
    //   });
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

  const addTreatmentDatesDataIncident = async () => {
    setAllTreatmentDates((prevDates) => [
      ...prevDates,
      {
        selectedSpecialtyProvider: selectedSpecialtyProvider,
        date: firmNameData.date,
        description: "",
      },
    ]);
  };

  const [isFocused, setIsFocused] = React.useState(false);
  console.log(allTreatmentDates);
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="max-1024 modal-dialog-centered "
        contentClassName="custom-modal-new-provider"
        size="lg"
      >
        <div style={{ minHeight: "320px" }}>
          <Modal.Header className="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center"
              id="modal_title"
              style={{ fontSize: "14px", fontWeight: "600" }}
            >
              Add Treatment Dates{" "}
              {selectedSpecialtyProvider
                ? " For " + selectedSpecialtyProvider?.label
                : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ minHeight: "270px", padding: "0px" }}>
            <div className="custom-tab">
              <Tab.Container defaultActiveKey={"addTreatmentDate"}>
                {/* <Nav
                  variant="tabs"
                  className="justify-content-around"
                  style={{ marginTop: "5px", marginBottom: "5px" }}
                > */}
                {/* <Nav.Link
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite apply-before"
                    eventKey="addTreatmentDate"
                    onClick={() => setType("addTreatmentDate")}
                  >
                    Add Treatment Date
                  </Nav.Link> */}
                {/* <Nav.Link
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite"
                    eventKey="editDate"
                    onClick={() => setType("editDate")}
                  >
                    Edit Date Clicked
                  </Nav.Link>

                  <Nav.Link
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite apply-after"
                    eventKey="editVisits"
                    onClick={() => setType("editVisits")}
                  >
                    Edit Visits
                  </Nav.Link> */}
                {/* </Nav> */}
                <div className="">
                  <Tab.Content>
                    <Tab.Pane
                      style={{
                        minHeight: "260px",
                      }}
                      eventKey="addTreatmentDate"
                    >
                      <Row
                        style={{ paddingLeft: "5px", paddingRight: "5px" }}
                        className="mx-0"
                      >
                        <Col md={12} className="p-0 p-t-5">
                          <div className="row mx-0 justify-content-center align-items-center custom-margin-bottom">
                            <div
                              ref={dropdownRef}
                              className="col-md-4 height-25 p-l-0 pr-0 custom-select-new-provider dropdown-width-menu-items"
                              style={{
                                width: "526px",
                                minWidth: "526px",
                              }}
                            >
                              <div
                                className={`${selectedSpecialtyProvider?.specialty ? "p-l-0" : "p-l-5"} dropdown-button form-control p-0 rounded-0 height-25 d-flex align-items-center`}
                                style={{
                                  backgroundColor:
                                    selectedSpecialtyProvider?.specialty
                                      ?.secondary_color,
                                }}
                                onClick={() =>
                                  setDropdownOpenManual((prev) => !prev)
                                }
                              >
                                <span id="selectedOption">
                                  {selectedSpecialtyProvider ? (
                                    <div className="d-flex align-items-center">
                                      <div
                                        className="d-flex align-items-center"
                                        style={{
                                          backgroundColor:
                                            selectedSpecialtyProvider?.specialty
                                              ?.color,
                                          fontWeight: "600",
                                          fontSize: "14px",
                                          height: "25px",
                                        }}
                                      >
                                        <span
                                          className="m-r-5 d-flex align-items-center justify-content-center text-white"
                                          style={{
                                            width: "25px",
                                            height: "25px",
                                            minWidth: "25px",
                                            backgroundColor: mixColorWithWhite(
                                              selectedSpecialtyProvider?.color,
                                              10
                                            ),
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                          }}
                                        >
                                          {selectedSpecialtyProvider?.specialty
                                            ?.name?.[0] || ""}
                                        </span>
                                        <span className="specialty-name text-white p-r-5">
                                          {
                                            selectedSpecialtyProvider.specialty
                                              ?.name
                                          }
                                        </span>
                                      </div>
                                      <div
                                        // className="provider-col-provider"
                                        style={{
                                          // height: "25px",
                                          backgroundColor:
                                            selectedSpecialtyProvider?.specialty
                                              ?.secondary_color,
                                          fontWeight: "600",
                                          fontSize: "14px",
                                          display: "flex",
                                          alignItems: "center",
                                          paddingLeft: "5px",
                                          paddingRight: "5px",
                                        }}
                                      >
                                        {
                                          selectedSpecialtyProvider?.provider
                                            ?.providerprofile_office_name
                                        }
                                      </div>
                                    </div>
                                  ) : (
                                    "Select Specialty & Provider"
                                  )}
                                </span>
                              </div>

                              {/* Dropdown menu */}
                              {dropdownOpenManual && (
                                <div
                                  className="dropdown-menu p-0 mt-0"
                                  style={{
                                    width: "100%",
                                    border: "1px solid #ced4da",
                                    maxHeight: "185px",
                                    overflowY: "auto",
                                    scrollbarWidth: "none",
                                  }}
                                >
                                  <div className="specialty-provider-container">
                                    {dropdownOptions?.map((special) => (
                                      <div
                                        key={special.id}
                                        className="d-flex specialty-provider-row"
                                        onClick={() =>
                                          handleDropdownChange(special)
                                        }
                                        style={{ cursor: "pointer" }}
                                      >
                                        <div
                                          className="specialty-col-provider"
                                          style={{
                                            backgroundColor:
                                              special?.specialty?.color,
                                            fontWeight: "600",
                                            fontSize: "14px",
                                            height: "25px",
                                            display: "flex",
                                            alignItems: "center",
                                            minWidth: "162px",
                                          }}
                                        >
                                          <span
                                            className="m-r-5 d-flex align-items-center justify-content-center text-white"
                                            style={{
                                              width: "25px",
                                              height: "25px",
                                              minWidth: "25px",
                                              backgroundColor:
                                                special?.specialty?.color,
                                              fontWeight: "bold",
                                              fontSize: "16px",
                                            }}
                                          >
                                            {special?.specialty?.name?.[0] ||
                                              ""}
                                          </span>
                                          <span className="specialty-name text-white">
                                            {special.specialty?.name}
                                          </span>
                                        </div>
                                        <div
                                          className="provider-col-provider"
                                          style={{
                                            height: "25px",
                                            backgroundColor: mixColorWithWhite(
                                              special?.specialty?.color,
                                              10
                                            ),
                                            fontWeight: "600",
                                            fontSize: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            paddingLeft: "8px",
                                            minWidth: "364px",
                                          }}
                                        >
                                          {
                                            special?.provider
                                              ?.providerprofile_office_name
                                          }
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <Row
                        style={{ paddingLeft: "5px", paddingRight: "5px" }}
                        className="mx-0"
                      >
                        <Col md={12} className="p-0">
                          <div className="row mx-0 align-items-center custom-margin-bottom">
                            <div className="col-md-3 p-l-0 height-25 pr-0">
                              <input
                                type={isFocused ? "date" : "text"}
                                style={{ color: "black" }}
                                className="form-control height-25 p-0 p-l-5 rounded-0"
                                placeholder="Date: mm/dd/yyyy"
                                value={addTreatmentDate.date}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() =>
                                  !addTreatmentDate.date && setIsFocused(false)
                                }
                                onChange={(e) =>
                                  setAddTreatmentDate({
                                    ...addTreatmentDate,
                                    date: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div
                              className="col-md-8 height-25 p-r-5"
                              style={{ maxWidth: "617px" }}
                            >
                              <input
                                type="text"
                                placeholder="Notes: Treatment Note"
                                onFocus={(e) => {
                                  e.target.placeholder = "";
                                  e.target.style.color = "black";
                                }}
                                onBlur={(e) => {
                                  e.target.placeholder =
                                    "Notes: Treatment Note";
                                }}
                                style={{ color: "var(--primary-25)" }}
                                className="form-control height-25 p-0 p-l-5 rounded-0"
                                value={addTreatmentDate.treatmentNote}
                                onChange={(e) =>
                                  setAddTreatmentDate({
                                    ...addTreatmentDate,
                                    treatmentNote: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="d-flex justify-content-end align-items-center height-25 ">
                              <button
                                className="btn btn-primary border-no height-25 d-flex align-items-center"
                                onClick={addTreatmentDatesData}
                                disabled={
                                  !addTreatmentDate.date ||
                                  !selectedSpecialtyProvider
                                }
                                style={{
                                  cursor:
                                    !addTreatmentDate.date ||
                                    !selectedSpecialtyProvider
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                <span className="font-weight-bold pr-2 text-gold margin-b-08">
                                  +
                                </span>
                                Treatment Date
                              </button>
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <Row
                        style={{ paddingLeft: "5px", paddingRight: "5px" }}
                        className="mx-0"
                      >
                        <Col md={12} className="p-0">
                          <div className="row mx-0 align-items-center custom-margin-bottom">
                            <div className="col-md-2 d-flex align-items-center p-l-0 height-25 pr-0">
                              <span className="d-flex align-items-center m-r-5">
                                <img
                                  src={firmName?.case_type?.casetype_icon}
                                  className="ic-19 d-flex align-items-center"
                                />
                              </span>
                              <span
                                className=""
                                style={{
                                  fontWeight: "600",
                                  fontSize: "14px",
                                }}
                              >
                                {firmName?.case_type?.name}
                              </span>
                            </div>
                            <div className="col-md-2 d-flex justify-content-end align-items-center p-l-0 height-25 p-r-5">
                              <span className="d-flex align-items-center m-r-5">
                                <img
                                  src={IncidentIcon}
                                  className="ic-19 d-flex align-items-center"
                                />
                              </span>
                              <span
                                className=""
                                style={{
                                  fontWeight: "600",
                                  fontSize: "14px",
                                }}
                              >
                                {firmName?.incident_date}
                              </span>
                            </div>
                            <div
                              className="col-md-6 p-l-0 height-25 p-r-5"
                              style={{
                                minWidth: "532px",
                              }}
                            >
                              <input
                                type="date"
                                style={{ color: "black" }}
                                className="form-control height-25 p-0 p-l-5 rounded-0"
                                value={firmNameData.date}
                                onChange={(e) =>
                                  setFirmNameData({
                                    ...firmNameData,
                                    date: e.target.value,
                                  })
                                }
                                readOnly
                              />
                            </div>
                            <div className="d-flex justify-content-end align-items-center height-25 ">
                              <button
                                className="btn btn-primary border-no height-25 d-flex align-items-center"
                                onClick={addTreatmentDatesDataIncident}
                                disabled={
                                  firmNameData.date === "" ||
                                  !selectedSpecialtyProvider
                                }
                                style={{
                                  cursor:
                                    firmNameData.date === "" ||
                                    !selectedSpecialtyProvider
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                <span className="font-weight-bold pr-2 text-gold margin-b-08">
                                  +
                                </span>
                                Treatment Date
                              </button>
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <Row className="mx-0">
                        <div
                          style={{
                            height: "200px",
                            overflowY: "auto",
                            width: "100%",
                            scrollbarWidth: "none",
                          }}
                        >
                          <table
                            className="table table-borderless table-striped table-treatment has-specialty-icon has-height-25"
                            id="treatment-summary-table"
                            style={{ width: "100%" }}
                          >
                            <thead
                              style={{
                                position: "sticky",
                                top: "0",
                              }}
                            >
                              <tr id="tb-header">
                                <th
                                  style={{
                                    maxWidth: "fit-content",
                                    width: "110px",
                                  }}
                                  className="td-autosize text-center color-grey-2"
                                >
                                  Medical Provider
                                </th>
                                <th
                                  style={{ width: "35px" }}
                                  className="td-autosize"
                                  id="dates-new-provider-padding"
                                >
                                  Date
                                </th>
                                <th
                                  id="dates-new-provider-padding"
                                  className="text-center color-grey-2 td-autosize"
                                >
                                  Records
                                </th>
                                <th className="text-center color-grey-2">
                                  Treatment Note
                                </th>
                              </tr>
                            </thead>
                            <tbody
                              style={{
                                maxHeight: "165px",
                                overflowY: "auto",
                                width: "100%",
                                scrollbarWidth: "none",
                              }}
                            >
                              {allTreatmentDates.map((td) => (
                                <TreatmentDatesNewRow
                                  key={td.id}
                                  treatmentDate={td}
                                  // specialitie={
                                  //   selectedSpecialtyProvider?.specialty
                                  // }
                                  // contact={{
                                  //   name: selectedSpecialtyProvider?.provider
                                  //     ?.providerprofile_office_name,
                                  // }}
                                  // setAllTreatmentDates={setAllTreatmentDates}
                                />
                              ))}
                              {Array.from({
                                length: 7 - allTreatmentDates.length,
                              }).map((_, index) => (
                                <tr
                                  key={index}
                                  className="fake-rows-new-provider height-25"
                                >
                                  <td colSpan={12}></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>
            </div>
          </Modal.Body>
          {type === "addTreatmentDate" && (
            <Modal.Footer
              className="p-0 mt-0 padding-outside-btn-new-provider"
              style={{ borderTop: "none" }}
            >
              <Button
                className="button-padding-footer-new-provider d-flex align-items-center justify-content-center "
                variant="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant={"primary"}
                disabled={allTreatmentDates.length === 0}
                style={{
                  cursor:
                    allTreatmentDates.length === 0 ? "not-allowed" : "pointer",
                }}
                onClick={handleDatesSave}
                className="button-padding-footer-new-provider d-flex align-items-center justify-content-center "
              >
                Save
              </Button>
            </Modal.Footer>
          )}
        </div>
      </Modal>
    </>
  );
}

export default React.memo(TreatmentDatesModal);
