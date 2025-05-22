import React, { useEffect, useState, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import AssignTodoModal from "../Modals/assignTodoModal";
import NotesTableComponent from "./NotesTableComponent";
import NotesImportPopup from "../Modals/notesImportPopup";
import axios from "axios";
import { addNote } from "../../Redux/notes/notesSlice";
import "../../../public/BP_resources/css/notes.css";
import { getCaseId, getClientId } from "../../Utils/helper";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
import { debounce } from "lodash";
import ActionBarComponent from "../common/ActionBarComponent";

const NotesCategoryDropdown = ({
  handleNoteCreateFormSubmission,
  NoteDescription,
}) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  // const currentCase = useSelector((state) => state?.caseData?.current);
  const currentCaseId = getCaseId();
  // const client = useSelector((state) => state?.client?.current);
  const clientId = getClientId();
  // const tabsPage = useSelector((state) => state.caseData?.pages);
  const [tabsPage, setTabsPage] = useState([]);
  // Function to fetch tabsPage data from the backend
  const fetchTabsPage = async () => {
    try {
      const { data } = await axios.get(
        origin + "/api/notes/notes-categories-per-case/" + currentCaseId + "/"
      );

      setTabsPage(data);
    } catch (error) {
      console.error("Failed to fetch tabsPage:", error);
    }
  };
  useEffect(() => {
    fetchTabsPage();
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Case");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCategoryClick = (item) => {
    setSelectedCategory(item);
    toggleDropdown(); // Close the dropdown after selection
  };

  return (
    <div
      className="col-12 col-md-auto col-right mb-0 d-flex flex-column justify-content-between"
      style={{ paddingRight: "0px", paddingLeft: "3px" }}
    >
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "25px" }}
      >
        <span className="notes-category-label" style={{ marginLeft: "2px" }}>
          Category:
        </span>
        <div className="dropdown notes-category-wrapper m-l-5">
          <button
            className="dropdown-toggle footer-select notes-category text-left d-flex align-items-center height-25"
            type="button"
            onClick={toggleDropdown}
            aria-expanded={isOpen}
            id="dropdownMenuLink"
            aria-haspopup="true"
          >
            <span className="d-flex align-items-center text-truncate">
              <img
                src={
                  media_origin +
                    tabsPage.find((item) => item.name === selectedCategory)
                      ?.page_icon ||
                  "https://simplefirm-bucket.s3.amazonaws.com/static/images/case-icon-color_gIGzPMA.svg"
                }
                className="mr-1 notes-sec-width-19px-height-19px"
              />
              {selectedCategory || "Case"}
            </span>
            <span className="ic ic-17 height-100 has-no-after ic-arrow text-primary d-flex align-items-center justify-content-center ml-auto">
              <svg
                width="34"
                height="17"
                viewBox="0 0 34 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </button>
          {isOpen && (
            <div
              className="dropdown-menu w-100 p-0 d-block"
              aria-labelledby="dropdownMenuLink"
              id="note_category"
            >
              {tabsPage.map(
                (item) =>
                  item.is_notes_category && (
                    <a
                      key={item.id}
                      className="dropdown-item height-25"
                      onClick={() => handleCategoryClick(item.name)}
                    >
                      {item.page_icon ? (
                        <img
                          src={media_origin + item.page_icon}
                          className="mr-1 notes-sec-width-19px-height-19px"
                        />
                      ) : (
                        <i className="ic ic-notes ic-19 m-r-5"></i>
                      )}
                      {item.name}
                    </a>
                  )
              )}
            </div>
          )}
        </div>
      </div>
      <div style={{ paddingRight: "0px", height: "45px" }}>
        <button
          className="btn btn-primary rounded-0 skewed-button   control-btn h-100 mt-0"
          onClick={() =>
            handleNoteCreateFormSubmission(selectedCategory, NoteDescription)
          }
          type="button"
        >
          <span className="font-weight-bold pr-2 text-gold   z-skew-text margin-b-08">
            +
          </span>
          <span className="btn-text-holder text-left z-skew-text font-weight-bold">
            Save New Note
          </span>
        </button>
      </div>
    </div>
  );
};

export default function NotesSectionDashboard() {
  // const currentCase = useSelector((state) => state?.caseData?.current);
  const currentCaseId = getCaseId();
  // const client = useSelector((state) => state?.client?.current);
  const clientId = getClientId();

  // const { isClientDataUpdated, setIsClientDataUpdated } = useContext(ClientDataContext);
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;

  // M2024/06/01 12:01AM
  // Fecthing the Notes data
  const [NotesTableData, setNotesTableData] = useState([]);
  const [TableTabsPage, setTableTabsPage] = useState([]);

  const fetchNotesTableData = async (clientId, currentCaseId) => {
    try {
      const { data } = await axios.get(
        `${origin}/api/notes/notes_table_data/${clientId}/${currentCaseId}/`
      );
      setNotesTableData(data);
    } catch (error) {
      console.error("Failed to fetch notes table data:", error);
    }
  };

  const fetchTableTabsPage = async (clientId, currentCaseId) => {
    try {
      const { data } = await axios.get(
        `${origin}/api/notes/notes_table_tabs/${clientId}/${currentCaseId}/`
      );
      setTableTabsPage(data);
    } catch (error) {
      console.error("Failed to fetch tabs page data:", error);
    }
  };

  const debouncedFetchNotesTableData = debounce(fetchNotesTableData, 300);
  const debouncedFetchTableTabsPage = debounce(fetchTableTabsPage, 300);

  useEffect(() => {
    debouncedFetchTableTabsPage(clientId, currentCaseId);
    debouncedFetchNotesTableData(clientId, currentCaseId);
  }, [clientId, currentCaseId]);

  const dispatch = useDispatch();
  //U2024/23/5/9:51PM
  const [showNewTaskAssignPopup, setShowNewTaskAssignPopup] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);
  function assignButtonClickHandler() {
    setShowNewTaskAssignPopup(!showNewTaskAssignPopup);
  }
  // U2024/31/5/3:19AM
  function notesImportPopupHandler() {
    setShowImportPopup(!showImportPopup);
  }

  const [NoteDescription, setNoteDescription] = useState("");
  const handleNoteDescOnchange = (event) => {
    setNoteDescription(event.target.value);
  };

  // M2024/31/05 9:46PM
  const handleNoteCreateFormSubmission = async (category, description) => {
    const currentDate = new Date();
    await dispatch(
      addNote({
        client_id: clientId,
        case_id: currentCaseId,
        category: category,
        entity_type: "None",
        record_id: 0,
        description: description,
        created_at: currentDate.toLocaleString(),
      })
    );
    // Refetching the updated Data after Post Request
    debouncedFetchTableTabsPage(clientId, currentCaseId);
    debouncedFetchNotesTableData(clientId, currentCaseId);

    // Emptying the Input
    setNoteDescription("");
  };

  // Scrolling  when Note has been selected from the search page
  const noteComponentRef = useRef(null);
  const searchNoteId = useSelector((state) => state.searchS.searchNoteId);
  const [notesDataLoad, setNotesDataLoad] = useState(false);
  useEffect(() => {
    if (notesDataLoad) {
      if (noteComponentRef.current) {
        noteComponentRef.current.scrollIntoView({ behavior: "smooth" });
        setNotesDataLoad(false);
      } else {
        setNotesDataLoad(false);
      }
    }
  }, [notesDataLoad]);

  const buttonsConfig = [
    {
      label: "Import",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addNotes",
      onClick: () => setShowImportPopup(!showImportPopup),
    },
  ];
  const header_name = useSelector((state) => state.header_name?.header_name);
  const open = useSelector((state) => state?.open?.open);

  return (
      <div className="notes-section-wrapper pt-0" ref={noteComponentRef}>
        <div
          className="action-bar-wrapper heigh-35 position-relative mr-0 "
          style={{ zIndex: open ? "0" : "" }}
        >
          <ActionBarComponent
            src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/notes-icon-color.svg"
            page_name={"Notes"}
            buttons={buttonsConfig}
          />
          <NotesImportPopup
            showImportPopup={showImportPopup}
            handleClose={notesImportPopupHandler}
          />
        </div>
        {/* <div className="action-bar-wrapper heigh-35 position-relative mr-0 ">
          <div
            className="action-bar client-BarAlign d-flex m-b-5 m-t-5"
            style={{ left: 148 }}
          >
            <span className="page-icon">
              <img
                className="translate-note-icon"
                src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/notes-icon-color.svg"
              />
            </span>
            <div className="text-wrapper text-white d-flex align-items-center ">
              <h2 className="text-white">Notes</h2>
            </div>
            <div className="btn-wrapper">
              <button
                className="btn btn-primary rounded-0"
                type="button"
                onClick={()=>setShowImportPopup(!showImportPopup)}
                style={{marginRight:'69px'}}
              >
                <span className="font-weight-bold pr-2 text-gold">+</span>
                Import
              </button>
            </div>
              <NotesImportPopup showImportPopup={showImportPopup} handleClose={notesImportPopupHandler} />
          </div>
        </div> */}
        <div
          className="notes-section h-100 px-0"
          id="notes_section_main_div"
        >
          <form
            method="POST"
            className="p-t-5 "
            id="notes-form"
            action="/30/addNotes/3/4/"
            style={{
              paddingRight: "0px",
              maxHeight: "80px",
              height: "80px",
              marginBottom: "5px",
            }}
          >
            <div
              className="footer-line footer-line-h skew-btn-margin"
              style={{ marginRight: "5px" }}
            >
              <button
                form="notes-form"
                type="button"
                style={{ height: "75px", padding: "0px 15px" }}
                onClick={() =>
                  handleNoteCreateFormSubmission("Critical", NoteDescription)
                }
                className="ml-0 rounded-0 text-capital"
              >
                <span className="btn-text-holder text-left transform-skewY-0">
                  Critical Case Note
                </span>
              </button>
            </div>
            <div className="footer-line footer-line-h skew-btn-margin">
              <button
                form="notes-form"
                type="button"
                style={{ height: "75px", padding: "0px 15px" }}
                className="ml-2 rounded-0"
                onClick={() =>
                  handleNoteCreateFormSubmission("Status", NoteDescription)
                }
              >
                <span className="btn-text-holder text-left transform-skewY-0">
                  Update Case Status
                </span>
              </button>
            </div>
            <div className="footer-line footer-line-h skew-btn-margin">
              <button
                form="notes-form"
                type="button"
                style={{ height: "75px", padding: "0px 15px" }}
                className="ml-2 rounded-0"
                onClick={assignButtonClickHandler}
              >
                <span className="font-weight-bold pr-2 text-gold margin-b-08 transform-skewX-12">
                  +
                </span>
                <span className="btn-text-holder text-left transform-skewY-0">
                  {" "}
                  Assign New Task
                </span>
              </button>
            </div>

            <div className="notes-text-area primary-border-2 ml-0 ">
              <textarea
                onfocus="AddNoteInputRecord()"
                onclick="addClickRecord(40, '1', false)"
                onChange={handleNoteDescOnchange}
                id="w3review"
                className="note_assign_text "
                required=""
                name="description"
                placeholder="Input a Case Note, New To-Do, or Update the Case Status…"
                value={NoteDescription}
              />
            </div>
            <NotesCategoryDropdown
              handleNoteCreateFormSubmission={handleNoteCreateFormSubmission}
              NoteDescription={NoteDescription}
            />
          </form>
          <form method="POST" id="todo-form">
            {/* <textarea id="todo-note" hidden="" name="note"></textarea> */}
            <div className="footer-line">
              <AssignTodoModal
                show={showNewTaskAssignPopup}
                handleClose={assignButtonClickHandler}
              />
              <nav
                id="other-parties-page"
                style={{
                  zIndex: open ? "0" : "",
                  position: open ? "relative" : "",
                }}
              >
                <div className="notetable pl-0">
                  <div className="custom-tab">
                    <NotesTableComponent
                      NotesTableData={NotesTableData}
                      fetchNotesTableData={fetchNotesTableData}
                      TableTabsPage={TableTabsPage}
                      fetchTableTabsPage={fetchTableTabsPage}
                      setNotesDataLoad={setNotesDataLoad}
                    />
                  </div>
                </div>
              </nav>
            </div>
          </form>
        </div>
      </div>
  );
}
