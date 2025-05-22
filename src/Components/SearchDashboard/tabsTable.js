import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useLayoutEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import ClientModal from "../Modals/clientModal";
import EmailModal from "../Modals/emailModal";
import TextModal from "../Modals/textModal";
import { useSelector } from "react-redux";
import bdayIcon from "../../assets/images/birthdayicon.svg";
import TableLoader from "../Loaders/tableLoader";
import NotesTodosBtns from "./notesTodosBtns";
import {
  formatDateForPanelDisplay,
  getCaseId,
  getClientId,
  mediaRoute,
  setCaseId,
  setClientId,
  formatPhoneNumberAndRemoveDashes,
} from "../../Utils/helper";
// import NotesCategoryDropdown from "./NotesCategoryDropdown";
import { useDispatch } from "react-redux";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
import incidentIcon from "../../assets/images/incident.svg";
import {
  setHasData,
  setCurrentCase,
  setShowAssignTodoModal,
  setshowAssignTodoModalMessage,
  setSearchRecordId,
  setSearchNoteId,
  setSearchDocument,
} from "../../Redux/search/searchSlice";
import {
  fetchAllPages,
  fetchCurrentCase,
  setCaseSummary,
} from "../../Redux/caseData/caseDataSlice";
import { fetchCaseSummary } from "../../api/case";
import api from "../../api/api";
import "./to-do-buttons.css";

const TabsTable = ({ tabsPage = [], addNotesHandler }) => {
  const defaltImagePath = "bp_assets/img/avatar.png";
  const DOIImage = "bp_assets/img/incident.svg";
  const navigate = useNavigate();
  // Redux
  const searchResult = useSelector((state) => state.searchS.searchResult);
  const currentTab = useSelector((state) => state.searchS.currentTab);
  const searchRecordId = useSelector((state) => state.searchS.searchRecordId);
  const hasData = useSelector((state) => state.searchS.hasData);
  const [data, setData] = useState([]);
  const [searchResultData, setSearchResultData] = useState([]);
  const [fakeRows, setFakeRows] = useState([]);
  const dispatch = useDispatch();
  const textareaRefs = useRef({});
  const [notes, setNotes] = useState({});
  const firmUserPreferences = useSelector(
    (state) => state.searchS.firmUserPreferences
  );

  const [checkedPreferences, setCheckedPreferences] = useState([]);
  const [checkedRenderingPreferences, setCheckedRenderingPreferences] =
    useState([]);
  const [isBirthdayChecked, setIsBirthdayChecked] = useState(false);
  const removalRef = useRef(false);
  const dropdownOpen = useRef(false);
  const emptyRowsRef = useRef([]);
  const [maxHeight, setMaxHeight] = useState(42);

  const toggleDropDown = (state) => {
    dropdownOpen.current = state;
  };

  const getTrueFields = (preferences) => {
    return Object.entries(preferences)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => ({ [key]: value }));
  };

  useEffect(() => {
    if (firmUserPreferences) {
      const trueFields = getTrueFields(firmUserPreferences);
      setCheckedPreferences(trueFields);
    }
  }, [firmUserPreferences]);

  // Sorting functions for sorting the usePrefrences array
  // Define the sort order mapping
  const sortOrder = [
    "SRincidentdate", // 0. Incident Date
    "srcasestage", // 1. Case Stage
    "sropendate", // 2. Open Date
    "srcloseddate", // 3. Closed Date
    "srlastaccessed", // 4. Last Accessed Date
    "srmainemail", // 5. Client Email
    "srmainphone", // 6. Client Phone
    "srclientbday", // 7. Client Birthday
  ];

  // Function to sort the array based on the custom order
  const sortArrayByCustomOrder = (arr) => {
    return arr?.sort((a, b) => {
      const keyA = Object.keys(a)[0];
      const keyB = Object.keys(b)[0];

      // Get the index of the keys in the sortOrder array
      const indexA = sortOrder.indexOf(keyA);
      const indexB = sortOrder.indexOf(keyB);

      // If the key is not found in sortOrder, treat it as last in the order
      const normalizedIndexA = indexA === -1 ? sortOrder.length : indexA;
      const normalizedIndexB = indexB === -1 ? sortOrder.length : indexB;

      return normalizedIndexA - normalizedIndexB;
    });
  };

  // Setting  and checking if birthday key exist in the FirmUserPrefernces table to set it second in the order
  useEffect(() => {
    if (checkedPreferences.length > 0 && !removalRef.current) {
      let updatedPreferences;
      const exists = checkedPreferences?.some((obj) =>
        obj.hasOwnProperty("srclientbday")
      );
      setIsBirthdayChecked(exists);
      if (exists) {
        // Remove the object with 'srclientbday'
        // updatedPreferences = checkedPreferences.filter(
        //   (obj) => !obj.hasOwnProperty("srclientbday")
        // );
        // Sort the array
        const sortedArray = sortArrayByCustomOrder(checkedPreferences);
        setCheckedRenderingPreferences(sortedArray);
      } else {
        // Sort the array
        const sortedArray = sortArrayByCustomOrder(checkedPreferences);
        setCheckedRenderingPreferences(sortedArray);
      }
    }
  }, [checkedPreferences]);

  useEffect(() => {
    let found = false;
    if (searchResult) {
      setSearchResultData(searchResult);
      for (const [key, value] of Object.entries(searchResult)) {
        if (key == currentTab) {
          if (value?.length == 0) {
            dispatch(setHasData(false));
            break;
          } else {
            setData(value);
            found = true;
            break;
          }
        }
      }
    }
    if (!found) {
      setData([]);
      dispatch(setHasData(false));
    }
  }, [currentTab, searchResult]);

  // useEffect(() => {
  //   let found = false;
  //   if (searchResultData) {
  //     for (const [key, value] of Object.entries(searchResultData)) {
  //       console.log("key", key);
  //       console.log("value", value);
  //       if (key == currentTab) {
  //         if (value?.length == 0) {
  //           dispatch(setHasData(false));
  //           break;
  //         } else {
  //           setData(value);
  //           found = true;
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   if (
  //     !found &&
  //     Object.keys(searchResultData).length > 0 &&
  //     data.length === 0
  //   ) {
  //     setData([]);
  //     dispatch(setHasData(false));
  //   }
  // }, [currentTab, searchResultData]);

  // States
  const [customModalShow, setcustomModalShow] = useState(false);
  const [textModalShow, setTextModalShow] = useState(false);
  const [emailModalShow, setEmailModalShow] = useState(false);
  const { isClientDataUpdated, setIsClientDataUpdated } =
    useContext(ClientDataContext);

  const openCase = (record) => {
    if (dropdownOpen.current) {
      console.log("Drop is open so can,t redirect");
      return;
    }
    let client_id = record?.case_data?.for_client.id;
    let case_id = record?.case_data.id;
    setIsClientDataUpdated(!isClientDataUpdated);
    if (client_id != getClientId() || case_id != getCaseId()) {
      api.get(
        `/api/switch_client/${client_id}/${case_id}/Flagged%20Cases%20Page/`
      );
      dispatch(fetchCurrentCase(client_id, case_id));
      fetchCaseSummary(client_id, case_id)
        .then((data) => {
          dispatch(setCaseSummary(data));
          dispatch(fetchAllPages(case_id));
          setClientId(client_id);
          setCaseId(case_id);
          if (
            currentTab == "client-phone" ||
            currentTab == "client-name" ||
            currentTab == "client-email" ||
            currentTab == "client-SSN" ||
            currentTab == "client-birthday"
          ) {
            navigate(`/bp-client/${client_id}/${case_id}`, {
              replace: true,
            });
          } else if (
            currentTab == "client-lastname" ||
            currentTab == "incident-date"
          ) {
            navigate(`/bp-case/${client_id}/${case_id}`, {
              replace: true,
            });
          } else if (currentTab == "invoice") {
            navigate(`/bp-costs/${client_id}/${case_id}`, {
              replace: true,
            });
          } else if (currentTab == "court-case") {
            navigate(`/bp-litigation/${client_id}/${case_id}`, {
              replace: true,
            });
          } else if (
            currentTab == "defendant-phone" ||
            currentTab == "defendant"
          ) {
            dispatch(setSearchRecordId(record?.defendent_record_id));
            navigate(`/bp-defendants/${client_id}/${case_id}`, {
              replace: true,
            });
          } else if (currentTab == "witness") {
            dispatch(setSearchRecordId(record?.witness_id));
            navigate(`/bp-witnesses/${client_id}/${case_id}`, {
              replace: true,
            });
          } else if (currentTab == "notes") {
            if (record?.page_url) {
              dispatch(setSearchNoteId(record?.note_id));
              navigate(`/${record.page_url}/${client_id}/${case_id}`, {
                replace: true,
              });
            } else {
              dispatch(setSearchNoteId(record?.note_id));
              navigate(`/bp-case/${client_id}/${case_id}`, {
                replace: true,
              });
            }
          } else if (currentTab == "document") {
            if (record?.document_slot) {
              dispatch(setSearchDocument(record.doc));
              navigate(
                `/${record?.doc.document_slot.page.page_url}/${client_id}/${case_id}`,
                {
                  replace: true,
                }
              );
            } else {
              dispatch(setSearchDocument(record.doc));
              navigate(`/bp-documents/${client_id}/${case_id}`, {
                replace: true,
              });
            }
          } else if (currentTab == "address") {
            if (record?.page == "defendant") {
              dispatch(setSearchRecordId(record?.defendant_id));
              navigate(`/bp-defendants/${client_id}/${case_id}`, {
                replace: true,
              });
            } else if (record?.page == "witness") {
              dispatch(setSearchRecordId(record?.witness_id));
              navigate(`/bp-witnesses/${client_id}/${case_id}`, {
                replace: true,
              });
            } else if (record?.page == "otherparty") {
              // Write the code for when the page is done for otherparty. Now the page is not yet been live
            } else if (record?.page == "case") {
              navigate(`/bp-case/${client_id}/${case_id}`, {
                replace: true,
              });
            }
          } else if (currentTab == "claim") {
            dispatch(setSearchRecordId(record?.insurance.id));
            navigate(`/bp-insurance/${client_id}/${case_id}`, {
              replace: true,
            });
          }
        })
        .catch((err) => {
          console.log("Error occurred", err);
        });
    } else {
      if (
        currentTab == "client-phone" ||
        currentTab == "client-name" ||
        currentTab == "client-email" ||
        currentTab == "client-SSN" ||
        currentTab == "client-birthday"
      ) {
        navigate(`/bp-client/${client_id}/${case_id}`, {
          replace: true,
        });
      } else if (
        currentTab == "client-lastname" ||
        currentTab == "incident-date"
      ) {
        navigate(`/bp-case/${client_id}/${case_id}`, {
          replace: true,
        });
      } else if (currentTab == "invoice") {
        navigate(`/bp-costs/${client_id}/${case_id}`, {
          replace: true,
        });
      } else if (currentTab == "court-case") {
        navigate(`/bp-litigation/${client_id}/${case_id}`, {
          replace: true,
        });
      } else if (currentTab == "defendant-phone" || currentTab == "defendant") {
        dispatch(setSearchRecordId(record?.defendent_record_id));
        navigate(`/bp-defendants/${client_id}/${case_id}`, {
          replace: true,
        });
      } else if (currentTab == "witness") {
        dispatch(setSearchRecordId(record?.witness_id));
        navigate(`/bp-witnesses/${client_id}/${case_id}`, {
          replace: true,
        });
      } else if (currentTab == "notes") {
        if (record?.page_url) {
          dispatch(setSearchNoteId(record?.note_id));
          navigate(`/${record.page_url}/${client_id}/${case_id}`, {
            replace: true,
          });
        } else {
          dispatch(setSearchNoteId(record?.note_id));
          navigate(`/bp-case/${client_id}/${case_id}`, {
            replace: true,
          });
        }
      } else if (currentTab == "document") {
        if (record?.document_slot) {
          dispatch(setSearchDocument(record.doc));
          navigate(
            `/${record?.doc.document_slot.page.page_url}/${client_id}/${case_id}`,
            {
              replace: true,
            }
          );
        } else {
          dispatch(setSearchDocument(record.doc));
          navigate(`/bp-documents/${client_id}/${case_id}`, {
            replace: true,
          });
        }
      } else if (currentTab == "address") {
        if (record?.page == "defendant") {
          dispatch(setSearchRecordId(record?.defendant_id));
          navigate(`/bp-defendants/${client_id}/${case_id}`, {
            replace: true,
          });
        } else if (record?.page == "witness") {
          dispatch(setSearchRecordId(record?.witness_id));
          navigate(`/bp-witnesses/${client_id}/${case_id}`, {
            replace: true,
          });
        }
      } else if (currentTab == "claim") {
        dispatch(setSearchRecordId(record?.insurance.id));
        navigate(`/bp-insurance/${client_id}/${case_id}`, {
          replace: true,
        });
      } else if (record?.page == "case") {
        navigate(`/bp-case/${client_id}/${case_id}`, {
          replace: true,
        });
      }
    }
  };

  // handlind Assign Todo Task functionality
  const handleAssignTask = (data) => {
    dispatch(setCurrentCase(data.case_data));
    dispatch(setShowAssignTodoModal(true));
    if (notes.hasOwnProperty(`textarea${data.id}`)) {
      dispatch(setshowAssignTodoModalMessage(notes[`textarea${data.id}`]));
    }
  };

  // handle values for textAreas
  const handleTextareaChange = (e, textareaId) => {
    setNotes({ ...notes, [textareaId]: e.target.value });
  };

  const handleNoteCreateFormSubmission = async (
    category,
    textAreaId,
    case_id,
    client_id
  ) => {
    if (textareaRefs.current[`textarea${textAreaId}`]) {
      addNotesHandler(
        category,
        case_id,
        client_id,
        textareaRefs.current[`textarea${textAreaId}`].value
      );
      setNotes({ ...notes, [`textarea${textAreaId}`]: "" });
    }
  };

  const getTextValue = (type, case_id, client_id, textareaId) => {
    if (textareaRefs.current[`textarea${textareaId}`]) {
      addNotesHandler(
        type,
        case_id,
        client_id,
        textareaRefs.current[`textarea${textareaId}`].value
      );
      setNotes({ ...notes, [`textarea${textareaId}`]: "" });
    }
  };

  // Calculate fake rows for no data div
  useEffect(() => {
    const handleResize = () => {
      if (!hasData) {
        const targetElement = document.getElementById("fake-rows-space");
        const viewportHeight = window.innerHeight;
        const elementPosition = targetElement?.getBoundingClientRect();
        const tableHeight = tableRef.current
          ? tableRef.current.clientHeight
          : 0;
        const spaceAfterElement = viewportHeight - tableHeight;
        let total_row = Math.ceil(spaceAfterElement / 52);
        total_row > 5 && (total_row -= 5);
        if (total_row > 0) {
          const fakeRows = [...Array(total_row).keys()];
          setFakeRows(fakeRows);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("DOMContentLoaded", handleResize);
    window.addEventListener("load", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("DOMContentLoaded", handleResize);
      window.removeEventListener("load", handleResize);
    };
  }, [hasData]);

  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef(null);

  useEffect(() => {
    const calculateAdditionalRows = () => {
      requestAnimationFrame(() => {
        const rowHeight = maxHeight;
        const viewportHeight = window.innerHeight;
        const existingRowsHeight = rowHeight * data.length;

        const availableHeight = viewportHeight - 166 - 60 - existingRowsHeight;

        let additionalRows = 1;
        if (availableHeight > 0) {
          additionalRows = Math.floor(availableHeight / rowHeight);
        }

        setAdditionalRows(additionalRows);
      });
    };

    calculateAdditionalRows();

    window.addEventListener("resize", calculateAdditionalRows);

    return () => {
      window.removeEventListener("resize", calculateAdditionalRows);
    };
  }, [data, hasData, maxHeight]);

  const childRefs = useRef([]);
  const handleParentButtonClick = (index, case_id, client_id, textareaId) => {
    // Call the child function using the ref
    if (childRefs.current[index]) {
      const selectedCategoryFromChild =
        childRefs.current[index].childFunction();
      getTextValue(selectedCategoryFromChild, case_id, client_id, textareaId);
    }
  };

  let divIndex = 1;
  let zIndexCounter = 2000; // Starting high zIndex

  function setConsistentColumnWidths() {
    const gridContainers = document.querySelectorAll(".case-info-td");
    if (!gridContainers?.length) return;

    gridContainers?.forEach((container) => {
      // Step 1: Get the grid style and identify the number of columns
      const gridStyle = window.getComputedStyle(container);
      const columns = gridStyle
        ?.getPropertyValue("grid-template-columns")
        ?.split(" ")?.length;

      // Step 2: Initialize an array to store the maximum width for each column
      const columnWidths = new Array(columns)?.fill(0); // Store maximum width for each column
      const columnItems = new Array(columns)?.fill(0); // Store item count for each column

      // Step 3: Get all grid items (children of the container)
      const gridItems = Array.from(container.children); // Get all grid items

      // Step 4: Calculate the maximum width and item count for each column
      gridItems?.forEach((item, index) => {
        const columnIndex = index % columns; // Determine which column the item belongs to
        const contentWidth = item.getBoundingClientRect().width; // Get the width of the content

        // Track the maximum width for each column
        columnWidths[columnIndex] = Math.max(
          columnWidths[columnIndex],
          contentWidth
        );

        // Count the number of items in each column
        columnItems[columnIndex]++;
      });
      // Step 5: Apply the maximum width to all grid items in  the respective columns
      gridItems.forEach((item, index) => {
        const columnIndex = index % columns; // Determine which column the item belongs to

        // Apply the calculated maximum width for that column to the current item
        // item.style.width = `${columnWidths[columnIndex]}px`;
        item.style.width = `170px`;
      });
    });
  }
  useLayoutEffect(() => {
    setConsistentColumnWidths();
    window.addEventListener("resize", () => {
      setConsistentColumnWidths();
    });
    return () => window.addEventListener("resize", setConsistentColumnWidths);
  }, []);
  useLayoutEffect(() => {
    if (data?.length > 0) {
      setTimeout(() => {
        setConsistentColumnWidths();
      }, 500);
    }
  }, [data]);
  // Function to calculate the maximum row height
  const recalculateMaxHeight = () => {
    const calculatedMaxHeight = emptyRowsRef?.current?.reduce((max, row) => {
      if (row) {
        return Math.max(max, row.offsetHeight);
      }
      return max;
    }, 42); // Default minimum height
    setMaxHeight(calculatedMaxHeight);
  };
  // Use useLayoutEffect to ensure DOM is updated before measuring heights
  useLayoutEffect(() => {
    recalculateMaxHeight();
    window.addEventListener("resize", () => {
      recalculateMaxHeight();
    });
    return () => window.addEventListener("resize", recalculateMaxHeight);
  }, []);

  useLayoutEffect(() => {
    if (data?.length > 0) {
      setTimeout(() => {
        recalculateMaxHeight();
      }, 500);
    }
  }, [data]);
  console.log("DATA", data);
  return (
    <>
      {hasData == false ? (
        <div id="fake-rows-space" className="m-t-5">
          {fakeRows?.map((value, index) => (
            <tr
              key={index}
              style={{ height: "52px", width: "100%" }}
              className="search-row fake-row-2 p-5"
            >
              <td style={{ width: "25vw" }}></td>
              <td style={{ width: "25vw" }}></td>
              <td style={{ width: "25vw" }}></td>
              <td style={{ width: "25vw" }}></td>
            </tr>
          ))}
        </div>
      ) : data && data?.length < 1 ? (
        <TableLoader />
      ) : (
        <div className="search-table-content">
          <table
            className="table-borderless table-striped  theme-colored fake-rows-2  has-height-25 table-earning table-earning-search fixed-table-header"
            ref={tableRef}
            id="main-table"
            style={{ tableLayout: "auto", width: "100%" }}
          >
            <thead>
              {data?.length > 0 && (
                <tr>
                  <th
                    class=""
                    style={{ width: "0.0%", maxWidth: "36.5px" }}
                  ></th>
                  <th className="text-center" style={{ width: "0%" }}>
                    CASE
                  </th>

                  <th class="text-center result-col">RESULT</th>

                  <th class="text-center" style={{ width: "0%" }}>
                    NOTES AND TODOS
                  </th>
                </tr>
              )}
            </thead>
            <tbody className="table-padding">
              {data
                ? data?.map((record, index) => (
                    <tr
                      className="fake-row-2"
                      style={{
                        height: "52px",
                        position: "relative",
                        zIndex: zIndexCounter--,
                        borderSpacing: 0,
                        borderCollapse: "collapse",
                      }}
                      ref={(el) => (emptyRowsRef.current[index] = el)}
                    >
                      <td
                        style={{ cursor: "pointer", color: "#808080" }}
                        className="td-autosize table-padding text-center width-36"
                        onClick={() => openCase(record)}
                      >
                        &nbsp;&nbsp; {index + 1}
                      </td>
                      {/* <td
                      className="table-padding"
                      style={{ cursor: "pointer" }}
                      onClick={() => openCase(record)}
                    >
                      <div className="dynamic-layout">
                        <div className="first-section">
                          <div className="d-flex align-items-center row-21px">
                            <span className="index-no">{divIndex++}</span>
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mr-5px">
                              {record?.case_data?.for_client
                                ?.profile_pic_19p && (
                                <img
                                  src={mediaRoute(
                                    record["case_data"]["for_client"][
                                      "profile_pic_19p"
                                    ]
                                  )}
                                  class="output-3 theme-ring"
                                />
                              )}
                            </span>
                            <span className=" text-black text-black-2 whitespace-nowrap font-600">
                              {record?.case_data?.for_client?.last_name &&
                                record["case_data"]["for_client"]["last_name"]}
                              ,{" "}
                              {record?.case_data?.for_client?.first_name &&
                                record["case_data"]["for_client"]["first_name"]}
                            </span>
                          </div>
                          {isBirthdayChecked && (
                            <div className="d-flex align-items-center row-21px">
                              <span className="index-no">{divIndex++}</span>
                              <span className=" d-flex align-items-center text-grey mr-5px">
                                <img
                                  className="img-19px"
                                  src={bdayIcon}
                                  alt="icon"
                                />
                              </span>
                              <span
                                style={{ textWrap: "nowrap" }}
                                className="font-600"
                              >
                                {record?.case_data?.for_client?.birthday &&
                                  record["case_data"]["for_client"]["birthday"]}
                              </span>
                            </div>
                          )}

                          <div
                            key={index}
                            className="d-flex align-items-center row-21px"
                          >
                            <span className="index-no">{divIndex++}</span>
                            <div className="search-Flex-1">
                              {record?.case_data?.case_type?.casetype_icon && (
                                <img
                                  className="img-19px mr-5px"
                                  src={mediaRoute(
                                    record["case_data"]["case_type"][
                                      "casetype_icon"
                                    ]
                                  )}
                                />
                              )}
                              <p className="MR8H19 height-21 font-600">
                                {record?.case_data?.case_type?.name &&
                                  record["case_data"]["case_type"]["name"]}
                              </p>
                            </div>
                          </div>
                          {checkedRenderingPreferences?.length <= 2
                            ? checkedRenderingPreferences?.map(
                                (check, index) => (
                                  <>{renderField(record, check, divIndex++)}</>
                                )
                              )
                            : checkedRenderingPreferences
                                ?.slice(0, 2)
                                .map((check, index) => (
                                  <>{renderField(record, check, divIndex++)}</>
                                ))}
                        </div>

                        <div className="second-section">
                          {checkedRenderingPreferences
                            ?.slice(2)
                            .map((check, index) => (
                              <>{renderField(record, check, divIndex++)}</>
                            ))}
                        </div>
                      </div>
                    </td> */}

                      <td
                        className="table-padding"
                        style={{ cursor: "pointer" }}
                        onClick={() => openCase(record)}
                      >
                        <div
                          className="dynamic-layout case-info-td"
                          data-fields={
                            checkedRenderingPreferences?.reduce(
                              (count, pref) => {
                                const prefKey = Object.keys(pref)[0];
                                return sortOrder.includes(prefKey)
                                  ? count + 1
                                  : count;
                              },
                              0
                            ) || 0
                          }
                        >
                          {record?.case_data?.for_client && (
                            <div className="case-field d-flex align-items-center row-21px m-r-0 p-0">
                              {record.case_data.for_client.profile_pic_19p ? (
                                <img
                                  src={mediaRoute(
                                    record.case_data.for_client.profile_pic_19p
                                  )}
                                  className="output-3 theme-ring img-19px m-r-5"
                                />
                              ) : (
                                <img
                                  src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg"
                                  className="output-3 theme-ring img-19px m-r-5"
                                  style={{
                                    border: "1px solid var(--primary-50)",
                                    backgroundColor: "white",
                                  }}
                                />
                              )}
                              {record.case_data.for_client.last_name},{" "}
                              {record.case_data.for_client.first_name}
                            </div>
                          )}

                          {isBirthdayChecked ? (
                            record?.case_data?.for_client?.birthday ? (
                              <div className="case-field d-flex align-items-center row-21px m-r-0 p-0">
                                <img
                                  className="img-19px mr-5px"
                                  src={bdayIcon}
                                  alt="Birthday Icon"
                                  style={{ filter: "contrast(0.5)" }}
                                />
                                {/* <span className="font-600"> */}
                                {record.case_data.for_client.birthday}
                                {/* </span> */}
                              </div>
                            ) : (
                              <div className="case-field d-flex align-items-center row-21px m-r-0 p-0">
                                <img
                                  className="img-19px mr-5px"
                                  src={bdayIcon}
                                  alt="Birthday Icon"
                                  style={{ filter: "contrast(0.5)" }}
                                />
                              </div>
                            )
                          ) : null}

                          {record?.case_data?.case_type ? (
                            <div
                              key={`case-type-${divIndex}`}
                              className="case-field d-flex align-items-center row-21px m-r-0 p-0"
                            >
                              {record.case_data.case_type.casetype_icon && (
                                <img
                                  className="img-19px mr-5px"
                                  style={{ filter: "contrast(0.5)" }}
                                  src={mediaRoute(
                                    record.case_data.case_type.casetype_icon
                                  )}
                                />
                              )}
                              {/* <p className="MR8H19 height-21 font-600"> */}
                              {record.case_data.case_type.name}
                              {/* </p> */}
                            </div>
                          ) : (
                            <div
                              key={`case-type-${divIndex}`}
                              className="case-field d-flex align-items-center row-21px m-r-0 p-0"
                            ></div>
                          )}

                          {checkedRenderingPreferences?.length <= 2
                            ? checkedRenderingPreferences?.map((check, index) =>
                                renderField(record, check, divIndex++)
                              )
                            : checkedRenderingPreferences
                                ?.slice(0, 2)
                                ?.map((check, index) =>
                                  renderField(record, check, divIndex++)
                                )}

                          {checkedRenderingPreferences
                            ?.slice(2)
                            ?.map((check, index) =>
                              renderField(record, check, divIndex++)
                            )}
                        </div>
                      </td>

                      <td
                        className="td-autosize text-left text-center table-padding"
                        style={{ cursor: "pointer" }}
                        onClick={() => openCase(record)}
                      >
                        <div
                          style={{ textWrap: "wrap" }}
                          dangerouslySetInnerHTML={{ __html: record?.result }}
                        />
                      </td>

                      <td
                        className="text-center notes_todos_row_padding table-padding"
                        id="notes_todos_row_padding"
                      >
                        <div className="d-flex justify-content-end align-items-center">
                          {/* <NotesCategoryDropdown
                          handleNoteCreateFormSubmission={
                            handleNoteCreateFormSubmission
                          }
                          textAreaId={record?.id}
                          case_id={record?.case_data?.id}
                          client_id={record?.case_data?.for_client?.id}
                          tabsPage={tabsPage}
                          toggleDropDownParent={toggleDropDown}
                          ref={(el) => (childRefs.current[index] = el)}
                        />
                        <div
                          className="height-100"
                          style={{ marginLeft: "-8px", marginRight: "0px" }}
                        >
                          <form
                            id="notes-form p-r-0-i"
                            style={{ paddingLeft: "0px", height: "47px" }}
                            className="input-text-note"
                          >
                            <div
                              className="notes-text-area height-100 MRL15Px primary-border-2"
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                              }}
                            >
                              <input
                                hidden
                                type="text"
                                id="category"
                                name="category"
                                className="testSearch-margin-right-0px"
                              />
                              <textarea
                                id={
                                  record
                                    ? "case-note-" + record.id.toString()
                                    : "case-note"
                                }
                                required
                                name="description"
                                placeholder="Input a text for a note"
                                className="form-control d-inline-block height-100 ML5PX-PLC border-0 w-300p px-0 anti-skew"
                                ref={(el) =>
                                  (textareaRefs.current[
                                    `textarea${record?.id}`
                                  ] = el)
                                }
                                value={notes[`textarea${record?.id}`]}
                                onChange={(e) =>
                                  handleTextareaChange(
                                    e,
                                    `textarea${record?.id}`
                                  )
                                }
                              ></textarea>
                            </div>
                          </form>
                        </div> */}

                          {/* Five Buttons */}
                          <NotesTodosBtns
                            onClickSaveNotes={() =>
                              handleParentButtonClick(
                                index,
                                record?.case_data?.id,
                                record?.case_data?.for_client?.id,
                                record?.id
                              )
                            }
                            onClickCritical={() =>
                              getTextValue(
                                "critical",
                                record?.case_data?.id,
                                record?.case_data?.for_client?.id,
                                record?.id
                              )
                            }
                            onClickUpdate={() =>
                              getTextValue(
                                "update",
                                record?.case_data?.id,
                                record?.case_data?.for_client?.id,
                                record?.id
                              )
                            }
                            onClickTask={() => handleAssignTask(record)}
                            onClickEvent={() => {}}
                            checkedRenderingPreferences={
                              checkedRenderingPreferences
                            }
                            sortOrder={sortOrder}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                : null}
              {[...Array(additionalRows)]?.map((_, index) => (
                <tr
                  key={`additional-${index}`}
                  className="fake-row-2"
                  style={{ height: `${maxHeight || 42}px` }}
                >
                  <td colSpan="4" className="table-padding">
                    &nbsp;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ClientModal
        show={customModalShow}
        onHide={() => setcustomModalShow(false)}
      />
      <EmailModal
        show={emailModalShow}
        onHide={() => setEmailModalShow(false)}
      />
      <TextModal show={textModalShow} onHide={() => setTextModalShow(false)} />
    </>
  );
};

export default TabsTable;

const renderField = (record, check, divIndex) => {
  const fieldKey = Object.keys(check)[0]; // Extract the key from the object
  switch (fieldKey) {
    // case 'srclientbday':
    //   return (
    //     <div className="d-flex align-items-center row-21px">

    //     <span className=" d-flex align-items-center text-grey mr-5px">
    //       <img className="img-19px" src={bdayIcon} alt="icon" />
    //     </span>
    //     <span style={{textWrap : "nowrap"}}>
    //       {record?.case_data?.for_client?.birthday &&
    //         record["case_data"]["for_client"]["birthday"]}
    //     </span>
    //   </div>
    //   )
    case "SRincidentdate":
      return (
        <div className="case-field d-flex align-items-center row-21px m-r-0 p-0">
          {/* <span className="index-no">{divIndex}</span>
          <p className="text-darker d-flex align-items-center "> */}
          <span className=" d-flex align-items-center text-grey mr-5px">
            <img
              className="img-19px"
              style={{ filter: "contrast(0.5)" }}
              src={incidentIcon}
              alt="incident-icon"
            />
          </span>
          {/* <span style={{ textWrap: "nowrap" }} className="font-600"> */}
          {record?.case_data?.incident_date &&
            record["case_data"]["incident_date"]}
          {/* </span> */}
          {/* </p> */}
        </div>
      );
    case "srcasestage":
      return (
        <div className="case-field d-flex align-items-center row-21px m-r-0 p-0">
          {/* {record?.case_data?.auto_case_stage_names?.length > 0 && (
            <span className=" d-flex align-items-center text-grey mr-5px">
              {record?.case_data?.auto_case_stage_names?.join(", ")}
            </span>
          )} */}
          {/* <span className="index-no">{divIndex}</span>
          <p className="text-darker d-flex align-items-center "> */}
          {/* <span className=" d-flex align-items-center text-grey mr-5px">
            <p>Case Stage</p>
          </span>
          {/* <span
              style={{ textWrap: "nowrap" }}
              className="primary-color font-600"
            > */}
          {record?.case_data?.auto_case_stage_names &&
            record["case_data"]["auto_case_stage_names"][
              record?.case_data?.auto_case_stage_names?.length - 1
            ]}
          {/* </span> */}
          {/* </p> */}
        </div>
      );
    case "sropendate":
      return (
        <div className="case-field d-flex align-items-center row-21px m-r-0 p-0">
          {/* <span className="index-no">{divIndex}</span>
          <p className="text-darker d-flex align-items-center "> */}
          <span className=" d-flex align-items-center text-grey mr-5px">
            <p className="color-green">OPEN</p>
          </span>
          {/* <span style={{ textWrap: "nowrap" }} className="font-600"> */}
          {record?.case_data?.date_open &&
            formatDateForPanelDisplay(record["case_data"]["date_open"])}
          {/* </span> */}
          {/* </p> */}
        </div>
      );
    case "srcloseddate":
      return (
        <div className="case-field d-flex align-items-center row-21px m-r-0 p-0">
          {/* <span className="index-no">{divIndex}</span>
          <p className="text-darker d-flex align-items-center "> */}
          <span className=" d-flex align-items-center text-grey mr-5px">
            CLOSED
          </span>
          {/* <span style={{ textWrap: "nowrap" }} className="font-600"> */}
          {record?.case_data?.date_closed &&
            formatDateForPanelDisplay(record["case_data"]["date_closed"])}
          {/* </span> */}
          {/* </p> */}
        </div>
      );
    case "srlastaccessed":
      return (
        <div className="case-field d-flex align-items-center row-21px m-r-0 p-0">
          {/* <span className="index-no">{divIndex}</span>
          <p className="text-darker d-flex align-items-center "> */}
          <span className=" d-flex align-items-center text-grey mr-5px">
            <p>LA</p>
          </span>
          {/* <span style={{ textWrap: "nowrap" }} className="font-600"> */}
          {record?.case_data?.last_accessed_date &&
            formatDateForPanelDisplay(
              record["case_data"]["last_accessed_date"]
            )}
          {/* </span> */}
          {/* </p> */}
        </div>
      );
    case "srmainemail":
      return (
        <div
          className="case-field d-flex align-items-center row-21px m-r-0 p-0"
          style={{ width: "180px" }}
        >
          {/* <span className="index-no">{divIndex}</span>
          <p
            className="text-darker d-flex align-items-center "
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          > */}
          <span className=" d-flex align-items-center text-grey mr-5px">
            <i className="ic ic-19 ic-email-3d"></i>
          </span>
          {/* <span
              style={{
                textWrap: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              className="font-600"
            > */}
          {record?.case_data?.for_client?.birthday &&
            record["case_data"]["for_client"]["email"]}
          {/* </span> */}
          {/* </p> */}
        </div>
      );
    case "srmainphone":
      return (
        <div className="case-field d-flex align-items-center row-21px m-r-0 p-0">
          {/* <span className="index-no">{divIndex}</span>
          <p className="text-darker d-flex align-items-center "> */}
          <span className=" d-flex align-items-center text-grey">
            <i className="ic ic-19 ic-sms-3d m-r-5 mr-1"></i>
          </span>
          {/* <span style={{ textWrap: "nowrap" }} className="font-600"> */}
          {record?.case_data?.for_client?.phone &&
            formatPhoneNumberAndRemoveDashes(
              record["case_data"]["for_client"]["phone"]
            )}
          {/* </span> */}
          {/* </p> */}
        </div>
      );
    default:
      return null; // Handle cases where key is not recognized
  }
};
