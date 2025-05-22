import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../public/BP_resources/css/global-modals.css";
import toDoIcon from "../../../../public/BP_resources/images/icon/to-do-icon.svg";
import { setComponentLoadingEffect } from "../../../Redux/common/Loader/action";
import { v4 as uuidv4 } from "uuid";
import api from "../../../api/api";

import { addEvent, searchUserInEventTab } from "../../../Providers/main";
import { getCaseId } from "../../../Utils/helper";
import { Nav, Tab } from "react-bootstrap";
import ClientSelection from "../../Calendar/Components/ClientsSelection";
import OtherFirmUsers from "../../Calendar/Components/OtherFirmUsers";
import CalendarSearchBox from "../../Calendar/Components/SearchBar";
import ClientDetailsHeading from "../../Calendar/Components/ClientDetailsHeading";
import SelectComponent from "../../Calendar/Components/CustomSelect";
import "../../Calendar/Components/customStyle.css";
import { safeToISOString } from "../../Calendar/Util/format";
import "./eventModal.css";
import { Padding } from "@mui/icons-material";

const EventModal = ({
  show,
  currentEvents,
  setCurrentEvents,
  setShow,
  setRefresh,
  litigationEventType,
  litigationEvent,
  firmUserList,
  overallProviders,
  caseList,
  treatmentDayInfo,
  todoCategoryType,
  caseProviderList,
}) => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("litigationAct");
  const [error, setError] = useState({ error: false, errorMsg: "No error " });
  const [firmUsers, setFirmUser] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [uniqueIdUsers, setUniqueIdUsers] = useState([]);
  const [caseProvider, setCaseProvider] = useState(caseProviderList);
  const [treatmentDayInformation, setTreatmentDayInformation] =
    useState(treatmentDayInfo);
  const [assignedFirmUsers, setAssignedFirmUsers] = useState([]);
  const [uniqueIdFirmUsers, setUniqueIdFirmUsers] = useState([]);
  const [filterlitigationEvents, setFilterLitigationEvents] =
    useState(litigationEvent);

  const [search, setSearch] = useState("");
  const isLoading = useSelector(
    (state) => state?.loadEffect?.componentLoadStates?.calendarProviders
  );
  const [caseSummary, setCaseSummary] = useState(
    useSelector((state) => state?.caseData?.summary)
  );
  const [client, setClient] = useState(
    useSelector((state) => state?.caseData?.summary?.for_client)
  );
  const [caseId, setCaseId] = useState(getCaseId());
  const [searchResults, setSearchResults] = useState([]);
  const caseDataCurrentCase = useSelector((state) => state?.caseData?.current);
  const [currentCase, setCurrentCase] = useState([]);
  const [successBtnFlag, setSuccessBtnFlag] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const case_users = [
    currentCase?.firm_user1,
    currentCase?.firm_user2,
    currentCase?.firm_user3,
  ];
  const case_users1 = [
    currentCase?.firm_user4,
    currentCase?.firm_user5,
    currentCase?.firm_user6,
  ];

  const [eventData, setEventData] = useState({
    case_id: caseId,
    for_provider: "",
    litigationActDescription: "",
    treatmentDayDescription: "",
    todoDescription: "",
    litigation_event_type: "",
    litigation_event: "",
    category_type: "",
    event_type: null,
    todoDate: null,
    treatmentDate: null,
    litigationDate: null,
  });

  useEffect(() => {
    setCaseProvider(caseProviderList);
  }, [caseProviderList]);
  useEffect(() => {
    setTreatmentDayInformation(treatmentDayInfo);
  }, [treatmentDayInfo]);

  useEffect(() => {
    setCurrentCase(caseDataCurrentCase);
    notesFirmUsersAPI(caseDataCurrentCase?.id);
  }, []);
  async function notesFirmUsersAPI(currentCaseId) {
    try {
      const response = await api.get("api/notes_firm_users/", {
        params: { case_id: currentCaseId },
      });

      setFirmUser(response.data);
    } catch (e) {
      console.error(e);
    }
  }

  const parseDate = (dateString) => {
    try {
      if (dateString == null || dateString == "") return;
      const [month, day, year] = dateString?.split("/");
      return new Date(year, month - 1, day);
    } catch (err) {
      return;
    }
  };

  useEffect(() => {
    setSearchResults([]);
    if (search) {
      fetchSearchData();
    }
  }, [search]);

  const fetchSearchData = async () => {
    try {
      if (search.trim().length < 3) {
        return;
      }

      const response = await searchUserInEventTab(search);
      if (response.data.length === 0) {
        return;
      }

      setAssignedUsers([]);
      setUniqueIdUsers([]);
      setSearchResults(response.data);
    } catch (e) {
      setSearchResults([]);
      setCaseId(null);
      console.log(e.toString());
      setErrorMsg(e.toString());
    }
  };

  useEffect(() => {
    setFilterLitigationEvents(
      litigationEvent?.filter(
        (i) =>
          parseInt(i?.event_type_id?.id) ===
          parseInt(eventData.litigation_event_type)
      )
    );

    setEventData((prevState) => ({
      ...prevState,
      litigation_event: "",
    }));
  }, [eventData.litigation_event_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setEventData((prevState) => ({
      ...prevState,
      [name]: date,
    }));
  };
  useEffect(() => {
    if (selectedTab === "litigationAct") {
      setSuccessBtnFlag(
        eventData.litigationActDescription.trim().length > 0 &&
          eventData.case_id !== "" &&
          eventData.litigation_event_type !== "" &&
          eventData.litigation_event !== "" &&
          eventData.litigationDate !== null
      );
    } else if (selectedTab === "todo") {
      setSuccessBtnFlag(
        eventData.todoDescription.trim().length > 0 &&
          eventData.case_id !== "" &&
          eventData.category_type !== "" &&
          eventData.todoDate !== null
      );
    } else if (selectedTab === "treatmentDay") {
      setSuccessBtnFlag(
        eventData.treatmentDayDescription.trim().length > 0 &&
          eventData.for_provider !== "" &&
          eventData.treatmentDate !== null
      );
    }
  }, [eventData, selectedTab]);

  const setToNoon = (date) => {
    const newDate = new Date(date);
    newDate.setHours(12, 0, 0, 0); // Set time to 12:00:00 PM
    return newDate;
  };

  const handleSubmit = async () => {
    try {
      if (!successBtnFlag) {
        setError({
          error: true,
          errorMsg: "Please fill out all required fields.",
        });
        return;
      }
      setError({ error: false, errorMsg: "No errors" });
      const dataWithFirmUser = [];
      let dataToAppend = {};
      let formattedEventData = {
        case_id: caseId,
        firm_users: [
          ...new Set(uniqueIdUsers.concat(uniqueIdFirmUsers)),
        ].filter((id) => id != null),
      };

      if (selectedTab === "litigationAct") {
        formattedEventData = {
          ...formattedEventData,
          name: eventData.litigationActDescription,
          event_id: eventData.litigation_event,
          event_type_id: eventData.litigation_event_type,
          event_type: "Litigation Events",
          date: setToNoon(eventData.litigationDate),
        };
        dataToAppend = {
          id: uuidv4(),
          title2:
            litigationEventType.find(
              (i) => i.id === eventData.litigation_event_type
            )?.litigation_event_type || "",
          title: `${litigationEventType.find((i) => i.id === eventData.litigation_event_type)?.litigation_event_type || ""} ${client?.first_name || ""} ${client?.last_name || ""}, ${caseSummary?.case_type?.name || ""}`,
          eventType: "litigationAct",
          caseType: caseSummary?.case_type?.name,
          clientFirstName: client?.first_name,
          clientLastName: client?.last_name,
          start: safeToISOString(setToNoon(eventData.litigationDate), true),
          allDay: true,
        };
      } else if (selectedTab === "todo") {
        formattedEventData = {
          ...formattedEventData,
          notes: eventData.todoDescription,
          todo_type: eventData.category_type,
          event_type: "ToDo Events",
          due_date: setToNoon(eventData.todoDate),
        };
        for (var i = 0; i < formattedEventData?.firm_users.length; i++) {
          dataToAppend = {
            id: uuidv4(),
            title2: eventData.todoDescription,
            title: `${
              todoCategoryType?.find((i) => {
                i.id == eventData.category_type;
              })?.tab_name ||
              eventData.todoDescription ||
              ""
            } ${client?.first_name || ""} ${client?.last_name || ""}, ${caseSummary?.case_type?.name || ""}`,
            eventType: "todo",
            clientFirstName: client?.first_name,
            clientLastName: client?.last_name,
            caseType: caseSummary?.case_type?.name,
            start: safeToISOString(setToNoon(eventData.todoDate)),
            allDay: true,
          };
          dataWithFirmUser.push(dataToAppend);
        }
      } else if (selectedTab === "treatmentDay") {
        formattedEventData = {
          for_provider: parseInt(eventData.for_provider),
          case_id: getCaseId(),
          description: eventData.treatmentDayDescription,
          event_type: "Treatment Dates",
          date: setToNoon(eventData.treatmentDate),
        };
        let clientDetails = {};

        overallProviders?.forEach((j) => {
          if (clientDetails?.id) return {};

          caseList?.forEach((k) => {
            if (eventData.for_provider == j?.id && j?.for_case == k?.id) {
              clientDetails = {
                for_provider: eventData?.for_provider,
                first_name: k?.for_client?.first_name,
                last_name: k?.for_client?.last_name,
                case_summary: k?.case_type?.name,
                id: eventData?.id,
              };
              return;
            }
          });
        });

        dataToAppend = {
          id: uuidv4(),
          title2: eventData.treatmentDayDescription,
          title: `${eventData.treatmentDayDescription || ""} ${caseProviderList?.find((i) => i.id === parseInt(eventData.for_provider))?.specialty?.name || ""} appt: ${clientDetails?.first_name || ""} ${clientDetails?.last_name || ""}, ${caseSummary?.case_type?.name || ""}`,
          eventType: "treatmentDates",
          caseType: clientDetails?.caseSummary,
          provider: caseProviderList?.find(
            (i) => i.id === parseInt(eventData.for_provider)
          ),
          clientFirstName: clientDetails?.first_name,
          clientLastName: clientDetails?.last_name,
          start: safeToISOString(setToNoon(eventData.treatmentDate)),
          allDay: true,
        };
      }
      await addEvent(formattedEventData);
      console.log(formattedEventData);

      if (selectedTab == "todo") {
        setCurrentEvents((prevEvents) => [...prevEvents, ...dataWithFirmUser]);
      } else {
        setCurrentEvents((prevEvents) => [...prevEvents, dataToAppend]);
      }
      setShow(false);
      dispatch(setComponentLoadingEffect("detailBar", true));

      setTimeout(() => {
        dispatch(setComponentLoadingEffect("detailBar", false));
      }, 100);
    } catch (error) {
      console.error("Error submitting form:", error);
      console.log("Error submitting form:", error);
      dispatch(setComponentLoadingEffect("calendarProviders", false));
      setError({ error: true, errorMsg: error.toString() });
    }
  };

  return (
    <div
      className={`modal generic-popup bd-example-modal-lg fade zoom-in ${show ? "show" : ""}`}
      style={{
        display: show ? "block" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 99999,
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-maxwidth1170 align-items-center">
        <div
          className="modal-content"
          id="no-border-popup"
          style={{ height: "670px", justifyContent: "center" }}
        >
          <div className="modal-header text-center p-0 bg-primary-5 popup-heading-color justify-content-center">
            <h5 className="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase text-primary font-weight-500 d-flex align-items-center modal-title-with-icon">
              <img src={toDoIcon} alt="Event Icon" />
              {selectedTab === "litigationAct"
                ? "ADD LITIGATION ACT"
                : selectedTab === "todo"
                  ? "ADD TODO EVENT"
                  : selectedTab === "search"
                    ? "SELECT CASE"
                    : "ADD TREATMENT DAY"}
            </h5>
          </div>

          <div 
          className="align-items-center" 
          style={{
            paddingTop: "10px",
          }}
          >
          <Tab.Container defaultActiveKey={"litigationAct"}>
              <div>
                <Nav 
                variant="tabs" 
                // className="justify-content-around" 
                style={{
                  width: "100%",
                  margin: "0 auto",
                  backgroundColor: "#f9f9f9",
                }}
                >
                  <Nav.Link
                    className="nav-item nav-link Pad8 tab-item"
                    eventKey="search"
                    style={{
                      padding: "10px 15px",
                    }}
                    onClick={() => {
                      setSelectedTab("search");
                      setError({ error: false, errorMsg: "No error" });
                    }}
                  >
                    Select Case
                  </Nav.Link>
                  <Nav.Link
                    className="nav-item nav-link Pad8 tab-item"
                    eventKey="litigationAct"
                    style={{
                      padding: "10px 15px",
                    }}
                    onClick={() => {
                      setSelectedTab("litigationAct");
                      setError({ error: false, errorMsg: "No error" });
                    }}
                  >
                    Litigation Act
                  </Nav.Link>
                  <Nav.Link
                    className="nav-item nav-link Pad8 tab-item"
                    eventKey="todo"
                    style={{
                      padding: "10px 15px",
                    }}
                    onClick={() => {
                      setSelectedTab("todo");
                      setError({ error: false, errorMsg: "No error" });
                    }}
                  >
                    TODO Event
                  </Nav.Link>
                  <Nav.Link
                    className="nav-item nav-link Pad8 tab-item"
                    eventKey="treatmentDay"
                    style={{
                      padding: "10px 15px",
                    }}
                    onClick={() => {
                      setSelectedTab("treatmentDay");
                      setError({ error: false, errorMsg: "No error" });
                    }}
                  >
                    Treatment Date
                  </Nav.Link>
                </Nav>
              </div>
            </Tab.Container>

            <div
              className="modal-body d-flex "
              style={{
                minHeight: "560px",
                overflowX: "hidden",
              }}
            >
              <div className="col-2">
                <ClientDetailsHeading
                  client={client}
                  caseSummary={caseSummary}
                  parseDate={parseDate}
                  errorMsg={errorMsg}
                  selectedTab={selectedTab}
                />
              </div>
              <div
                style={{
                  borderLeft: "0.5px solid black",
                  // height: '100%',
                }}
              ></div>
              <div className="col-10">
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <p style={{ border: "none", height: "25px" }}>
                    {selectedTab === "litigationAct" ? (
                      "Enter the litigation act details in the input field below. Select the date for the act. Then select the litigation type, litigation event and click the green 'Add Litigation Act' button."
                    ) : selectedTab === "todo" ? (
                      "Type the todo description in the input field below. Select the due date for the todo. Then select the category type and case workers, and click the green 'Add TODO Event' button."
                    ) : selectedTab === "treatmentDay" ? (
                      <span style={{ display: "block" }}>
                        {
                          "Provide details of the treatment day in the text area below. Select the treatment date and case provider, and click the green 'Add Treatment Day' button."
                        }
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "block",
                          marginLeft: "3px",
                          marginRight: "16px",
                        }}
                      >
                        Kindly search through the dropdown menu and select the
                        case that best matches your requirements based on the
                        detailed information provided
                      </span>
                    )}
                  </p>
                </div>

                {/* Select Case Tab */}
                {selectedTab === "search" && (
                  <div
                    style={{
                      // backgroundColor: "var(--primary)"
                      // border: "0.5px solid black",
                      paddingTop: "3%",
                      paddingLeft: "4px",
                      // height: "25px",
                    }}
                  >
                    <CalendarSearchBox
                      onClick={fetchSearchData}
                      setSearch={setSearch}
                      setCaseProvider={setCaseProvider}
                      searchResults={searchResults}
                      setClient={setClient}
                      setCaseSummary={setCaseSummary}
                      setCaseId={setCaseId}
                      setCurrentCase={setCurrentCase}
                      setAssignedUsers={setAssignedUsers}
                      setUniqueIdUsers={setUniqueIdUsers}
                    />
                  </div>
                )}

                <div className="d-flex flex-wrap justify-content-between align-items-start">
                  <div
                    className="d-flex flex-grow-1 flex-column mr-4"
                    style={{ border: "none", paddingTop: "1%", height: "25px ! important", }}
                  >
                    {/* Input Dropdown Fields in the Same Row */}
                    {selectedTab === "litigationAct" && (
                      <div className="d-flex flex-row my-2">
                        <div
                          className="d-flex align-items-center my-14 text-muted text-display-6 mx-2"
                          // style={{ fontSize: "0.9rem" }}
                        >
                          Litigation Type:
                          <div className="m-r-5 m-l-5">
                            <SelectComponent
                              options={litigationEventType?.map((type) => ({
                                value: type?.id,
                                label: type?.litigation_event_type,
                              }))}
                              value={eventData.litigation_event_type}
                              onChange={(value) =>
                                handleChange({
                                  target: {
                                    name: "litigation_event_type",
                                    value,
                                  },
                                })
                              }
                              placeholder="Select Option"
                              isLoading={isLoading}
                              style={{ height: "25px", marginBottom: "33px" }}
                            />
                          </div>
                        </div>

                        <div
                          className="d-flex align-items-center my-14 text-muted mx-2 my-2"
                          // style={{ fontSize: "0.9rem" }}
                        >
                          Litigation Events:
                          <div className="m-r-5 m-l-5">
                            <SelectComponent
                              options={filterlitigationEvents?.map((type) => ({
                                value: type?.id,
                                label: type?.event_name,
                              }))}
                              value={eventData.litigation_event}
                              onChange={(value) =>
                                handleChange({
                                  target: { name: "litigation_event", value },
                                })
                              }
                              placeholder="Select Option"
                              isLoading={isLoading}
                              style={{ height: "25px", textAlign: "center", }}
                            />
                          </div>
                        </div>

                        <div
                          className="d-flex align-items-center my-2 mx-2"
                          // style={{ fontSize: "0.9rem" }}
                        >
                          Date:
                          <div className="m-r-5 m-l-5">
                            <DatePicker
                              selected={eventData.litigationDate}
                              onChange={(date) =>
                                handleDateChange("litigationDate", date)
                              }
                              placeholderText="Select Litigation Date"
                              className="form-control h-25px"
                              dateFormat="MM/dd/yyyy"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedTab === "todo" && (
                      <div className="d-flex flex-row my-2">
                        <div
                          className="d-flex align-items-center my-14 text-muted text-display-6 mx-2"
                          // style={{ fontSize: "0.9rem" }}
                        >
                          Category Type:
                          <div className="m-r-5 m-l-5">
                            <SelectComponent
                              options={todoCategoryType?.map((type) => ({
                                value: type?.id,
                                label: type?.tab_name,
                              }))}
                              value={eventData.category_type}
                              onChange={(value) =>
                                handleChange({
                                  target: { name: "category_type", value },
                                })
                              }
                              placeholder="Select Option"
                              isLoading={isLoading}
                              style={{ height: "25px" }}
                            />
                          </div>
                        </div>

                        <div
                          className="d-flex align-items-center my-2 mx-2"
                          // style={{ fontSize: "0.9rem" }}
                        >
                          Due Date:
                          <div className="m-r-5 m-l-5">
                            <DatePicker
                              selected={eventData.todoDate}
                              onChange={(date) =>
                                handleDateChange("todoDate", date)
                              }
                              placeholderText="Select Due Date"
                              className="form-control h-25px"
                              dateFormat="MM/dd/yyyy"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedTab === "treatmentDay" && (
                      <div className="d-flex flex-row my-2">
                        <div
                          className="d-flex align-items-center my-14 text-muted text-display-6 mx-2"
                          // style={{ fontSize: "0.9rem" }}
                        >
                          Case Provider:
                          <div className="m-r-5 m-l-5">
                            <SelectComponent
                              minWidth="300px"
                              options={caseProvider?.map((provider) => ({
                                value: provider?.id,
                                label: provider?.name,
                              }))}
                              value={eventData.for_provider}
                              onChange={(value) =>
                                handleChange({
                                  target: { name: "for_provider", value },
                                })
                              }
                              placeholder="Select Option"
                              isLoading={isLoading}
                              style={{ height: "25px" }}
                            />
                          </div>
                        </div>

                        <div
                          className="d-flex align-items-center my-2 mx-2"
                          // style={{ fontSize: "0.9rem" }}
                        >
                          Treatment Date:
                          <div className="m-r-5 m-l-5">
                            <DatePicker
                              selected={eventData.treatmentDate}
                              onChange={(date) =>
                                handleDateChange("treatmentDate", date)
                              }
                              placeholderText="Select Treatment Date"
                              className="form-control h-25px"
                              dateFormat="MM/dd/yyyy"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Input Text Area */}
                    {selectedTab === "litigationAct" && (
                      <div style={{ border: "none" }}>
                        <textarea
                          className="assign_todo_textarea form-control"
                          required
                          name="litigationActDescription"
                          placeholder="Input Litigation Act details..."
                          value={eventData.litigationActDescription}
                          onChange={handleChange}
                          style={{
                            height: "25px",
                            overflow: "hidden",
                            // fontSize: "0.9rem",
                            width: "98%",
                          }}
                        />
                      </div>
                    )}

                    {selectedTab === "todo" && (
                      <div style={{ border: "none" }}>
                        <textarea
                          className="assign_todo_textarea form-control"
                          required
                          name="todoDescription"
                          placeholder="Input a Case Note, New To-Do..."
                          value={eventData.todoDescription}
                          onChange={handleChange}
                          style={{
                            height: "25px",
                            overflow: "hidden",
                            // fontSize: "0.9rem",
                            width: "98%",
                          }}
                        />
                      </div>
                    )}

                    {selectedTab === "treatmentDay" && (
                      <div style={{ border: "none" }}>
                        <textarea
                          className="assign_todo_textarea form-control"
                          required
                          name="treatmentDayDescription"
                          placeholder="Input Treatment Day details..."
                          value={eventData.treatmentDayDescription}
                          onChange={handleChange}
                          style={{
                            height: "25px",
                            overflow: "hidden",
                            // fontSize: "0.9rem",
                            width: "98%",
                          }}
                        />
                      </div>
                    )}

                    {/* Client Selection and Other Firm Users in TODO Tab */}
                    {selectedTab === "todo" && (
                      <>
                        <div
                          className="align-items-center mt-2 mb-2"
                          style={{ width: "100%" }}
                        >
                          <ClientSelection
                            case_users={case_users}
                            case_users1={case_users1}
                            uniqueIdUsers={uniqueIdUsers}
                            assignedUsers={assignedUsers}
                            setAssignedUsers={setAssignedUsers}
                            setUniqueIdUsers={setUniqueIdUsers}
                          />
                        </div>

                        <div
                          className="align-items-center mt-2 mb-2"
                          style={{ width: "100%" }}
                        >
                          <OtherFirmUsers
                            notesFirmUsers={firmUsers}
                            uniqueIdFirmUsers={uniqueIdFirmUsers}
                            assignedFirmUsers={assignedFirmUsers}
                            setAssignedFirmUsers={setAssignedFirmUsers}
                            setUniqueIdFirmUsers={setUniqueIdFirmUsers}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error.error && selectedTab !== "search" && (
              <p className="d-flex justify-content-center text-danger display-6">
                {error.errorMsg}
              </p>
            )}
          </div>
          <div className="modal-footer border-0 mt-0 pt-0">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShow(false);
              }}
            >
              Close
            </button>
            <button
              type="button"
              className={`btn btn-success ${!successBtnFlag ? "disabled" : ""}`}
              style={{
                visibility: selectedTab == "search" ? "hidden" : "visible",
              }}
              onClick={handleSubmit}
              disabled={!successBtnFlag}
            >
              {selectedTab === "litigationAct"
                ? "Add Litigation Act"
                : selectedTab === "todo"
                  ? "Add ToDo Event"
                  : "Add Treatment Date"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
