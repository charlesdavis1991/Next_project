// 05/24/2024---Hassnain Ali
import React, { useEffect, useRef, useState } from "react";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addNote, fetchNotes, fetchPages } from "../../Redux/notes/notesSlice";
import noImage from "../../assets/images/avatar.png";
import { useLocation } from "react-router-dom";
import NoteAddModal from "./NotesPannelModal";
import { api_without_cancellation } from "../../api/api";
import { format } from "date-fns";
import avatarImage from "./../../assets/images/avatar.svg";

function NotesPanel({
  entity_type = "Insurance",
  instanceFor = "",
  record_id,
  module,
  pagePanels = 4,
  notesName
}) {
  const NotesFakeRows = (className) => {
      const container = document.querySelector(`${className}`);
      const tables = [...document.querySelectorAll(".tbody-panels")];
      const notesPanels = [...document.querySelectorAll(".notes-panel-defendant")];
      if(container){
        notesPanels.forEach(notesPanel=>{
          notesPanel.style.height = `${container.offsetHeight - 5}px`;
        })
      }
      if(container && tables.length > 0) {
        // const constainerSibling = container.nextElementSibling;
        // constainerSibling.style.height = `${container.offsetHeight - 5}px`;
        tables.forEach((table)=>{
          if (!table || !table) return;
          const height = container.offsetHeight;
          const rowsCount = Math.ceil((height - 35) / 35);
          const rowsArray = new Array(rowsCount).fill("");
          table.innerHTML = rowsArray
            .map(() => `<tr><td></td></tr>`)
            .join("");
        });
      }
  };
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  // process.env.NODE_ENV !== "production"

  const [showNotes, setShowNotes] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  const { isLoading, isError, pages } = useSelector((state) => state.notes);

  const handleProfilePic = (note) => {
    let profilePicUrl;

    try {
      profilePicUrl = note.created_by?.bp_attorneystaff_userprofile
        ?.profile_pic_29p
        ? media_origin +
          note.created_by.bp_attorneystaff_userprofile.profile_pic_29p
        : avatarImage;
    } catch (error) {
      console.error("ERROR PROFILE PIC", error);
      profilePicUrl = avatarImage;
    }
    return profilePicUrl;
  };

  //   Extracting the client_id and case_id from URL which is expected to /some/client_id/case_id
  const regex = /\d+/g;
  const { pathname } = useLocation();
  // Use match method to find all numbers
  const numbers = pathname.match(regex);
  // Convert the array of string numbers to an array of integers
  const URLParams = numbers?.map(Number);

  const fetchData = async () => {
    try {
      const response = await api_without_cancellation.get(
        `/api/notes/${entity_type}/${record_id}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching notes panel data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [entity_type, record_id, module, pagePanels]);

  // useEffect(() => {
  //   dispatch(fetchNotes({entity_type:entity_type,record_id:record_id}));
  //   dispatch(fetchPages());
  // }, [record_id, entity_type]);

  const handleFormSubmission = async (category, description) => {
    await dispatch(
      addNote({
        client_id: URLParams[0],
        case_id: URLParams[1],
        category: category,
        entity_type: entity_type,
        record_id: record_id,
        description: description,
      })
    );
    // Refetching the updated Data after Post Request
    fetchNotes({ entity_type: entity_type, record_id: record_id });

    // Hidding the Modal in Form Submission
    setShowNotes(false);
  };

  const handleClick = () => {
    setShowNotes(true); // Show the modal when the component is clicked
  };

  const handleClose = () => {
    setShowNotes(false); // Hide the modal
  };

  function getPanelClassName() {
    if (pagePanels === 4 && module === "Defendants") {
      return "notes-height-for-defendants";
    } else if (pagePanels === 4 && instanceFor === "Defendants") {
      return "notes-height-for-defendants";
    } else if (pagePanels === 6 && module === "Insurance") {
      return "notes-height-for-lien-insurances";
    } else if (instanceFor === "Treatment") {
      return "notes-height-treatment";
    } else if (pagePanels === 3 && module === "Counsel") {
      return "notes-height-for-3p-counsel";
    } else if (pagePanels === 3 && module === "Experts") {
      return "notes-height-for-3p-experts";
    } else if (pagePanels === 4) {
      return "notes-height-for-4p";
    } else {
      return "notes-height-for-3p-litigation";
    }
  }

  //${pagePanels === 4 ? "notes-height-for-4p" : pagePanels === 3 && module !== "Counsel" ? "notes-height-for-3p" : "notes-height-for-3p-counsel"}
  useEffect(()=>{
    
    const handleResize = ()=>{
      NotesFakeRows(".leins-container-four");
      NotesFakeRows(".leins-container-six");
      NotesFakeRows(".leins-container-three");
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return ()=>{
      window.removeEventListener("resize", handleResize);
    }
  },[])
  return (
    <>
      {data.length > 0 ? (
        <div
          className={`position-relative ${getPanelClassName()} d-flex-1 p-0 position-relative z-index-1 p-t-5`}
          onClick={handleClick}
        >
          <div
            className="fields-wrap overflow-hidden h-100 "
            data-toggle="modal"
            style={{ zIndex: "2" }}
          >
            <div
              className="tab-pane h-100 "
              id="custom-nav-todo"
              role="tabpanel"
              aria-labelledby="custom-nav-todo-tab"
            >
              <div className="position-relative">
                <div
                  className="table-responsive table--no-card border-0 has-alternate-grey insurance-col-table panel-notes-section-height"
                  style={{ overflow: "hidden", marginTop:"-1px" }}
                >
                  <table className="table  table-borderless table-striped table-earning table-y-down1">
                    { 
                    <thead>
                      <tr class="litigation-notes-header">
                        <td colSpan={5} className="text-center">{notesName} Notes</td>
                      </tr>
                    </thead>}
                    <tbody className="tbody-panels " style={{ zIndex: "2" }}>
                      {data &&
                        data.length > 0 &&
                        data.map((note, index) => (
                          <tr className="">
                            <td className="serial-number td-autosize width-36">
                              {index + 1}
                            </td>
                            <td className="td-autosize">
                              {format(note.created_at, "MMMM dd, yyyy")}
                            </td>
                            <td className="td-autosize">
                              {format(note.created_at, "h:mm a")}
                            </td>
                            <td className="td-autosize">
                              <div className=" d-flex align-items-center">
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                  <Image
                                    src={handleProfilePic(note)}
                                    alt=""
                                    className=""
                                  />
                                </span>
                                <span className="ml-2 text-black">
                                  {note.created_by.first_name +
                                    " " +
                                    note.created_by.last_name}
                                </span>
                              </div>
                            </td>
                            <td
                              className="client_page_note_row INS-color-white-space-word-wrap"
                              style={{ textAlign: "left" }}
                            >
                              {entity_type} Note: {note.description}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div
            className="fields-wrap overflow-hidden"
            data-toggle="modal"
            style={{
              zIndex: "-2",
              position: "absolute",
              inset: "0",
              height: "100%",
            }}
          >
            <div
              className="tab-pane "
              id="custom-nav-todo"
              role="tabpanel"
              aria-labelledby="custom-nav-todo-tab"
            >
              <div
                className="table-responsive table--no-card border-0 has-alternate-grey insurance-col-table panel-notes-section-height"
                style={{ overflow: "hidden", marginTop:"-1px" }}
              >
                <table className="table  table-borderless table-striped table-earning table-y-down1">
                { 
                    <thead>
                      <tr class="litigation-notes-header">
                        <td colSpan={5} className="text-center">{notesName} Notes</td>
                      </tr>
                    </thead>}
                  <tbody
                    className="tbody-panels "
                    style={{ zIndex: "2", height: "100%" }}
                  >
                    <tr>
                      <td> </td>
                    </tr>
                    <tr>
                      <td> </td>
                    </tr>
                    <tr>
                      <td> </td>
                    </tr>
                    <tr>
                      <td> </td>
                    </tr>
                    {getPanelClassName() ===
                      "notes-height-for-3p-litigation" && (
                      <>
                        <tr>
                          <td> </td>
                        </tr>
                        <tr>
                          <td> </td>
                        </tr>
                      </>
                    )}
                    {getPanelClassName() === "notes-height-treatment" && (
                      <>
                        <tr>
                          <td> </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`${getPanelClassName()} d-flex-1 p-0 position-relative z-index-1  p-t-5`}
            onClick={handleClick}
            // style={{ overflow: "scroll", scrollbarWidth: "none", maxHeight: "350px"}}
          >
            <div
              className="fields-wrap overflow-hidden"
              data-toggle="modal"
              // data-target="#individual_notes_modal"
            >
              <div
                className="tab-pane "
                id="custom-nav-todo"
                role="tabpanel"
                aria-labelledby="custom-nav-todo-tab"
              >
                <div
                  className="table-responsive table--no-card border-0 has-alternate-grey insurance-col-table panel-notes-section-height"
                  style={{ overflow: "hidden", marginTop:"-1px" }}
                >
                  <table className="table table-borderless table-striped table-earning table-y-down1">
                  { 
                    <thead>
                      <tr class="litigation-notes-header">
                        <td colSpan={5} className="text-center">{notesName} Notes</td>
                      </tr>
                    </thead>}
                    <tbody className="tbody-panels">
                      <tr>
                        <td> </td>
                      </tr>
                      <tr>
                        <td> </td>
                      </tr>
                      <tr>
                        <td> </td>
                      </tr>
                      <tr>
                        <td> </td>
                      </tr>
                      <tr>
                        <td> </td>
                      </tr>
                      {getPanelClassName() ===
                        "notes-height-for-3p-litigation" && (
                        <>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                        </>
                      )}
                      {getPanelClassName() === "notes-height-treatment" && (
                        <>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showNotes && (
        <NoteAddModal
          show={showNotes}
          data={data}
          handleFormSubmission={handleFormSubmission}
          handleClose={handleClose}
          pages={pages}
          pannel={entity_type}
          module={module}
        />
      )}
    </>
  );
}

export default React.memo(NotesPanel);
