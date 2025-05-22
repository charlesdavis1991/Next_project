import React, { useEffect, useRef, useState } from "react";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import avatarImage from "../../assets/images/avatar.svg";
import { addNote } from "../../Redux/notes/notesSlice";
import { api_without_cancellation } from "../../api/api";
import { getCaseId, getClientId } from "../../Utils/helper";
import NoteAddModalTreatment from "./NotesAddModalTreatment";
import "./notesTreatment.css";

function TreatmentNotesSection({
  entity_type = "Insurance",
  instanceFor = "",
  record_id,
  module,
  pagePanels = 4,
  caseProvider = {},
}) {
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;

  const [showNotes, setShowNotes] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const notesSectionRef = useRef(null);
  const { isLoading, isError, pages } = useSelector((state) => state.notes);

  const handleProfilePic = (note) => {
    let profilePicUrl;

    try {
      profilePicUrl = note.created_by?.bp_attorneystaff_userprofile
        ?.profile_pic_29p
        ? media_origin +
          note.created_by.bp_attorneystaff_userprofile.profile_pic_29p
        : note.created_by?.bp_attorneystaff_userprofile?.profile_pic_19p
          ? media_origin +
            note.created_by.bp_attorneystaff_userprofile.profile_pic_19p
          : avatarImage;
    } catch (error) {
      console.log("ERROR PROFILE PIC", error);
      profilePicUrl = avatarImage;
    }
    return profilePicUrl;
  };

  const regex = /\d+/g;
  const { pathname } = useLocation();
  const numbers = pathname.match(regex);
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

  const refetchData = async ({ entity_type, record_id }) => {
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

  const handleFormSubmission = async (category, description) => {
    await dispatch(
      addNote({
        client_id: instanceFor === "Treatment" ? getClientId() : URLParams[0],
        case_id: instanceFor === "Treatment" ? getCaseId() : URLParams[1],
        category: category,
        entity_type: entity_type,
        record_id: record_id,
        description: description,
      })
    );
    // Refetching the updated Data after Post Request
    refetchData({ entity_type: entity_type, record_id: record_id });

    // Hidding the Modal in Form Submission
    setShowNotes(false);
  };

  const handleClick = () => {
    setShowNotes(true);
  };

  const handleClose = () => {
    setShowNotes(false);
  };

  function getPanelClassName() {
    if (pagePanels === 4 && module === "Defendants") {
      return "notes-height-for-defendants";
    } else if (pagePanels === 4 && instanceFor === "Defendants") {
      return "notes-height-for-defendants";
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

  // Keep rowsToFill calculation for empty state
  const [rowsToFill, setRowsToFill] = useState(7);

  useEffect(() => {
    const handleResize = () => {
      if (notesSectionRef.current) {
        const tableHeight = notesSectionRef.current.clientHeight;
        console.log(tableHeight);
        const rowHeight = 21; // Each row is 25px
        const existingRows = data?.length || 0;
        const calculatedRowsToFill =
          Math.ceil(tableHeight / rowHeight) - existingRows;
        setRowsToFill(calculatedRowsToFill > 0 ? calculatedRowsToFill : 0);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [notesSectionRef, data]);

  return (
    <>
      <div
        className={`position-relative ${getPanelClassName()} d-flex-1 p-0 position-relative z-index-1`}
        onClick={handleClick}
        ref={notesSectionRef}
        style={{
          overflow: "auto", // Enable scrolling
          maxHeight: "100%", // Ensure it doesn't exceed parent height
          scrollbarWidth: "none",
        }}
      >
        <table className="table table-borderless table-striped table-treatment has-height-25">
          <tbody className="tbody-panels" style={{ zIndex: "2" }}>
            {data && data.length > 0 ? (
              // If we have data, render the notes
              <>
                {data.map((note, index) => (
                  <tr
                    key={index}
                    className={`height-25-treatment ${index % 2 === 0 ? "bg-speciality-2" : "bg-speciality-4"}`}
                  >
                    <td className="serial-number height-21 td-autosize width-36">
                      {index + 1}
                    </td>
                    <td
                      className="td-autosize height-21"
                      id="new-notes-treatment-padding-imp"
                    >
                      {format(note.created_at, "MMMM dd, yyyy")}
                    </td>
                    <td
                      className="td-autosize height-21"
                      id="new-notes-treatment-padding-imp"
                    >
                      {format(note.created_at, "h:mm a")}
                    </td>
                    <td
                      className="td-autosize height-21"
                      id="new-notes-treatment-padding-imp"
                    >
                      <span
                        className="d-flex align-items-center"
                        style={{
                          gap: "5px",
                        }}
                      >
                        <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          <Image
                            src={handleProfilePic(note)}
                            alt=""
                            className=""
                          />
                        </span>

                        {note.created_by.first_name +
                          " " +
                          note.created_by.last_name}
                      </span>
                    </td>
                    <td
                      className="client_page_note_row height-21 INS-color-white-space-word-wrap"
                      style={{ textAlign: "left" }}
                    >
                      {entity_type} Note: {note.description}
                    </td>
                  </tr>
                ))}
                {Array.from({
                  length: Math.max(1, rowsToFill),
                }).map((_, index) => (
                  <tr
                    key={`filler-${index}`}
                    className={`height-25-treatment fake-rows-new-provider ${
                      index % 2 === 0 ? "bg-speciality-4" : "bg-speciality-2"
                    }`}
                  >
                    <td colSpan={12}></td>
                  </tr>
                ))}
              </>
            ) : (
              // If no data, fill with empty rows
              Array.from({ length: Math.max(1, rowsToFill) }).map(
                (_, index) => (
                  <tr
                    key={index}
                    className={`height-25-treatment fake-rows-new-provider height-25-treatment ${index % 2 === 0 ? "bg-speciality-2" : "bg-speciality-4"}`}
                  >
                    <td colSpan={12}></td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {showNotes && (
        <NoteAddModalTreatment
          show={showNotes}
          data={data}
          handleFormSubmission={handleFormSubmission}
          handleClose={handleClose}
          pages={pages}
          pannel={entity_type}
          module={module}
          caseProvider={caseProvider}
        />
      )}
    </>
  );
}

// Add CSS to your notesTreatment.css file or make sure these styles are applied:
/*

*/

export default TreatmentNotesSection;
