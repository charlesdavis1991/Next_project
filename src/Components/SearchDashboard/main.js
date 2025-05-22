import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import TabsTable from "./tabsTable";
import Table1 from "./table1";
import { useDispatch, useSelector } from "react-redux";
import { AddNotes } from "../../Providers/main";
import NoteModal from "../Modals/noteModal";
import TableLoader from "../Loaders/tableLoader";
import {
  setCurrentSearchStatus,
  setsearchAlphabet,
  searchGlobal,
  setSearchText,
  setSearchResult,
  setShowAssignTodoModal,
  setCurrentCase,
  setshowAssignTodoModalMessage,
} from "../../Redux/search/searchSlice";
import { setTabsResultCount } from "../../Redux/actions";
import api from "../../api/api";
import { getCaseId } from "../../Utils/helper";
import axios from "axios";
import AssignTodoSearchModal from "../Modals/assignTodoSearchModal";
import ActionBarComponent from "../common/ActionBarComponent";

const SearchDashboard = (props) => {
  const dispatch = useDispatch();
  const currentSearchStatus = useSelector(
    (state) => state.searchS.currentSearchStatus
  );
  const showAssignTodoModal = useSelector(
    (state) => state.searchS.showAssignTodoModal
  );
  const searchTableLoader = useSelector((state) => state.searchTableLoader);
  const searchText = useSelector((state) => state.searchS.searchText);
  const [noteModalShow, setNoteModalShow] = useState(false);
  const [noteModalContent, setNoteModalContent] = useState("");
  const [tabsPage, setTabsPage] = useState([]);
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const handleSearchNameChange = (input) => {
    dispatch(setCurrentSearchStatus("tabs"));
    dispatch(setsearchAlphabet(true));
    dispatch(setSearchText(input));
    dispatch(setSearchResult({}));
    dispatch(
      setTabsResultCount({
        invoice: 0,
        incident: 0,
        "incident-date": 0,
        check: 0,
        "client-name": 0,
        "client-email": 0,
        "client-SSN": 0,
        "client-phone": 0,
        "client-birthday": 0,
        defendant: 0,
        "defendant-phone": 0,
        witness: 0,
        claim: 0,
        "court-case": 0,
        otherparty: 0,
        address: 0,
        notes: 0,
        document: 0,
      })
    );
    dispatch(
      searchGlobal({ name: input, tab_name: "alphabets", token: token })
    );
  };

  useEffect(() => {
    dispatch(
      searchGlobal({ name: searchText, tab_name: "alphabets", token: token })
    );
  }, []);

  const addNotesHandler = (type, case_id, client_id, note) => {
    let category = "note";
    if (type == "update") {
      category = "Status";
    } else if (type == "critical") {
      category = "Critical";
    } else {
      category = type;
    }

    if (note != "") {
      AddNotes(note, category, case_id, client_id).then((res) => {
        window.document.getElementById(
          "case-note-" + case_id.toString()
        ).value = "";
        if (type == "update") {
          setNoteModalContent("Status Note saved to file");
        } else if (type == "critical") {
          setNoteModalContent("Critical Note saved to file");
        } else {
          setNoteModalContent(`${type} Note saved to file`);
        }

        setNoteModalShow(!noteModalShow);
      });
    } else {
    }
  };

  // Getting categores for NoteCategoryDropdown.js
  const fetchTabsPage = async () => {
    try {
      const { data } = await axios.get(
        origin + "/api/notes/notes-categories-per-case/" + getCaseId() + "/"
      );
      setTabsPage(data);
      // console.log("Response from options request = ",data)
    } catch (error) {
      console.log("Failed to fetch tabsPage:", error);
    }
  };

  useEffect(() => {
    fetchTabsPage();
  }, []);

  const open = useSelector((state) => state?.open?.open);
  return (
    <>
      {showAssignTodoModal && (
        <AssignTodoSearchModal
          show={showAssignTodoModal}
          handleClose={() => {
            dispatch(setShowAssignTodoModal(false)),
              dispatch(setCurrentCase("")),
              dispatch(setshowAssignTodoModalMessage(""));
          }}
        />
      )}
      {searchTableLoader && (
        <>
          <div className="your-div-class">
            <TableLoader />
          </div>
        </>
      )}
      <div className="top-panel-wrapper"></div>
      {/* <div className="action-bar client-BarAlign main-action-bar  d-flex m-b-5 m-t-5 vertical-align-middle">
        <span className="page-icon">
          <img src="/BP_resources/images/icon/discovery-icon-color.svg" />
        </span>
        <div className="text-wrapper text-white d-flex align-items-center p-l-5 ">
          <h2 className="text-white">Search</h2>
        </div>
        <div className="d-flex-1 position-relative z-index-1 text-white ">
          
        </div>
      </div> */}
      <ActionBarComponent
        src="/BP_resources/images/icon/discovery-icon-color.svg"
        page_name="Search"
      />

      <div className="main-content search-main-content mt-1 invisible-scrollbar overflow-hidden">
        <div className="alphabets-filters-container">
          <div
            className="d-flex align-items-center w-100 p-5-x alpha alphabets-filters-wrapper"
            style={{ height: "25px", marginBottom: "5px" }}
          >
            <h5 className="col-auto p-0 text-white">
              OPEN CLIENTS BY LAST NAME:
            </h5>
            <ul className="search-by-alphabets d-flex-1 list-unstyled height-25">
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("A")}
                  className="nav-link"
                >
                  A
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("B")}
                  className="nav-link"
                >
                  B
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("C")}
                  className="nav-link"
                >
                  C
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("D")}
                  className="nav-link"
                >
                  D
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("E")}
                  className="nav-link"
                >
                  E
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("F")}
                  className="nav-link"
                >
                  F
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("G")}
                  className="nav-link"
                >
                  G
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("H")}
                  className="nav-link"
                >
                  H
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("I")}
                  className="nav-link"
                >
                  I
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("J")}
                  className="nav-link"
                >
                  J
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("K")}
                  className="nav-link"
                >
                  K
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("L")}
                  className="nav-link"
                >
                  L
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("M")}
                  className="nav-link"
                >
                  M
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("N")}
                  className="nav-link"
                >
                  N
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("O")}
                  className="nav-link"
                >
                  O
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("P")}
                  className="nav-link"
                >
                  P
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("Q")}
                  className="nav-link"
                >
                  Q
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("R")}
                  className="nav-link"
                >
                  R
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("S")}
                  className="nav-link"
                >
                  S
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("T")}
                  className="nav-link"
                >
                  T
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("U")}
                  className="nav-link"
                >
                  U
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("V")}
                  className="nav-link"
                >
                  V
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("W")}
                  className="nav-link"
                >
                  W
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("X")}
                  className="nav-link"
                >
                  X
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("Y")}
                  className="nav-link"
                >
                  Y
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleSearchNameChange("Z")}
                  className="nav-link"
                >
                  Z
                </a>
              </li>
            </ul>
          </div>
        </div>
        <Navbar />
        <div
          className="section__content section__content--p30 has-full-height search-section__content"
          style={{ zIndex: open ? "0" : "" }}
        >
          <div className="container-fluid h-100 p-0">
            <div className="row no-gutters h-100">
              <div className="col-lg-12 top-head p-0 ">
                <div
                  className="tab-content search-results-tab position-relative"
                  id="nav-tabContent"
                >
                  <div
                    className="tab-pane fade show active overflow-y-hidden"
                    id="nav-client"
                    role="tabpanel"
                    aria-labelledby="nav-client-tab"
                  >
                    <div
                      style={{ border: "0px" }}
                      className="table-responsive skew-nav-tabs table--no-card m-b-40 invisible-scrollbar search-nav-table-wrapper"
                    >
                      <TabsTable
                        addNotesHandler={addNotesHandler}
                        tabsPage={tabsPage}
                      />

                      {/* <Table1 addNotesHandler={addNotesHandler}/> */}
                    </div>
                    <div class="col-12 mt-auto">
                      <footer class="footer bg-primary-20 text-lg">
                        <div class="container-fluid">
                          <div class="row">
                            <div class="col-sm-12 text-center">
                              Simple Firm © <script>2024</script> practice
                              management system
                            </div>
                          </div>
                        </div>
                      </footer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NoteModal
        content={noteModalContent}
        show={noteModalShow}
        onHide={() => setNoteModalShow(false)}
      />
    </>
  );
};

export default SearchDashboard;
