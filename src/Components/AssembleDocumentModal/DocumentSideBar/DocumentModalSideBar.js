import React, { useState, useRef, useEffect } from "react";
import "./DocumentSidebar.css";
import BottomContentSideBar from "./BottomContentSideBar";
import PropTypes from "prop-types";
import { getCaseId, mediaRoute } from "../../../Utils/helper";
import incidentIcon from "../../../assets/images/incident.svg";
import "./BottomContentSideBar.css";
import ButtonLoader from "../../Loaders/ButtonLoader";

function UserProfile({ clientInfo }) {

  return (
    <>
      <div className="user-profile-document-popup-img m-r-5">
        {clientInfo?.profile_pic_29p ? (
          <img
            src={clientInfo.profile_pic_29p}
            alt="Profile avatar"
            className=""
          />
        ) : (
          <i className="ic ic-avatar ic-29 has-avatar-icon"></i>
        )}
      </div>
      {/* <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
        {clientInfo?.profile_pic_29p && (
          <img
            src={clientInfo.profile_pic_29p}
            alt="Profile avatar"
            className="invisible"
          />
        )}
      </span> */}
      <span className="text-black user_name">
        <span className="clientTabFont d-block">
          {clientInfo
            ? `${clientInfo.last_name}, ${clientInfo.first_name}`
            : "Client Info"}
        </span>
      </span>
    </>
  );
}

UserProfile.propTypes = {
  clientInfo: PropTypes.shape({
    profile_pic_29p: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
};

function PageInfo({ page, documentSlot }) {
  const { page_icon = "", name = "" } = page || {};
  console.log(page_icon)
  return (
    <>
      {page_icon && <img src={page_icon} width="20" alt="" />}
      <p className="ml-1">{name}: {documentSlot?.slot_number}. {documentSlot?.slot_name}</p>
    </>
  );
}

PageInfo.propTypes = {
  page: PropTypes.shape({
    page_icon: PropTypes.string,
    name: PropTypes.string,
  }),
};

const DocumentModalSideBar = ({
  documentData,
  pages,
  slotsData,
  onRefetchSlotsData,
  deletePages,
  addPageBreak,
  fileName,
  docName,
  setDocName,
  saveDocument,
  saveLoading,
  state,
  dispatch,
  selectedPages,
  addPageNumbers,
  setFullPreview,
  fullPreview,
  createFullPreview,
  pageAdded,
  removePageNumbers,
  deleteFPPages
}) => {
  const {
    id: docId,
    for_client: clientInfo,
    for_case: caseInfo,
    file_name,
    docDate,
    attached_by: attachUser,
    document_slot: documentSlot,
  } = documentData;

  const clientId = clientInfo?.id;
  const caseId = caseInfo?.id;
  const userId = attachUser?.id
    ? attachUser.id
    : localStorage.getItem("loggedInUser") || null;

  const [showMenuBar, setShowMenuBar] = useState(false);
  const [panelMenuBar, setPanelMenuBar] = useState(false);

  const [showDocLinkModal, setShowDocLinkModal] = useState(false);
  const handShowDocLinkModal = () => setShowDocLinkModal(true);
  const handleShowDocLinkModalClose = () => setShowDocLinkModal(false);

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    chatDoc: false,
    taskLink: false,
    docReview: false,
  });
  const dropdownRefs = {
    chatDoc: useRef(null),
    taskLink: useRef(null),
    docReview: useRef(null),
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const toggleDropdown = (dropdownName) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }));
  };
  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    switch (name) {
      case "textbox1":
        dispatch({ type: "SET_TEXTBOX1", payload: value });
        break;
      case "textbox2":
        dispatch({ type: "SET_TEXTBOX2", payload: value });
        break;
      case "checked":
        dispatch({ type: "SET_CHECKED", payload: checked });
        break;
      case "fontsize":
        dispatch({ type: "SET_FONTSIZE", payload: value });
        break;
      case "align":
        dispatch({ type: "SET_ALIGN", payload: value });
        break;
      default:
        break;
    }

  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     Object.entries(dropdownRefs).forEach(([key, ref]) => {
  //       if (ref.current && !ref.current.contains(event.target)) {
  //         setDropdownOpen((prev) => ({ ...prev, [key]: false }));
  //       }
  //     });
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);


  const handleInsertPageBreak = () => {
    console.log(state, "state")
    let resultText = "";
    if (state.checked) {
      resultText += `${fileName}\n`; // Append the file name if checkbox is checked
    }
    if (state.textbox1) {
      resultText += `${state.textbox1}\n`; // Append the file name if checkbox is checked

    }
    if (state.textbox2) {
      resultText += `${state.textbox2}\n`; // Append the file name if checkbox is checked

    }
    if (resultText.trim() !== "") {
      addPageBreak(resultText); // Only call addPageBreak if resultText is not empty
    } else {
      console.log("No text to insert."); // Optional: Log or alert if no text is available
    }
  };

  return (
    <div className="right-sidebar d-flex flex-column" style={{ width: "17%" }}>
      <div className="bluish-effect"></div>
      <div className="d-flex flex-column justify-content-between h-100">
        <div className="top-content">
          <div
            className="client-name d-flex align-items-center side-bar-padding"
            style={{ height: "35px" }}
          >
            <UserProfile clientInfo={clientInfo} />
          </div>
          <div className="basic-info m-r-5 m-l-5">
            {/* Basic info content */}
            <div
              className="tile-row w-100 p-l-5 p-r-5 d-flex align-items-center justify-content-between"
              style={{ height: "21px" }}
            >
              <div
                className="d-flex align-items-center"
                style={{ height: "21px" }}
              >
                {caseInfo?.case_type?.casetype_icon && (
                  <span
                    className="ic-avatar ic-19 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center"
                    style={{ marginRight: "10px" }}
                  >
                    <img
                      style={{
                        width: "19px",
                        height: "19px",
                      }}
                      src={caseInfo?.case_type?.casetype_icon}
                      alt="icon"
                    />
                  </span>
                )}

                <p className="text-black font-weight-semibold d-block">
                  {caseInfo?.case_type?.name || "N/A"}
                </p>
              </div>
              <div
                className="d-flex align-items-center"
                style={{ height: "21px" }}
              >
                <span
                  className="ic-avatar ic-19 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center"
                  style={{ marginRight: "10px" }}
                >
                  <img
                    src={incidentIcon}
                    className=""
                    style={{
                      width: "19px",
                      height: "19px",
                    }}
                  />
                </span>

                <p className="font-weight-semibold">
                  {caseInfo?.incident_date || "N/A"}
                </p>
              </div>
            </div>


            {/* Other basic info fields */}

            <div className="d-flex align-items-center justify-content-between">
              <div
                className="tile-row d-flex align-items-center justify-content-start flex-wrap w-100 m-t-5 align-items-center"
                style={{ height: "21px" }}
              >
                <PageInfo page={documentSlot?.page || {}} documentSlot={documentSlot} />
              </div>
            </div>

          </div>

        </div>

        {
          fullPreview ? (
          <>
          <div className="side-bar-padding">
          <div>
                  <button
                    type="button"
                    className="btn btn-primary height-25 d-flex align-items-center justify-content-center w-100 mt-2"
                    onClick={deleteFPPages}
                    disabled={selectedPages.length == 0}

                  >
                    Delete Pages
                  </button>
            </div>

            <div>
              <input
                type="text"
                className="form-control col height-25 mt-2"
                value={docName}
                placeholder="Enter Document Name"
                onChange={(e) =>
                  setDocName(e.target.value)
                }
              />
            </div>


            <div>
              <button
                type="button"
                className="btn btn-primary height-25 d-flex align-items-center justify-content-center w-100 mt-2"
                onClick={saveDocument}
                disabled={docName ? false : true}

              >
                {
                  saveLoading ? (
                    <ButtonLoader />
                  ) : (
                    "Save New Document"
                  )
                }
              </button>
            </div>

            {
              pageAdded == false ? (<>
              <div>
              <div className="form-check mt-2 p-0" >
                <label className="form-check-label" >
                  Select Position
                </label>
                <select
                  className="form-select col-4 ml-2"
                  name="align"
                  id="align"
                  value={state.align}
                  onChange={handleChange}

                >
                  <option value="center">
                    Center
                  </option>
                  <option value="left">
                    Left
                  </option>
                  <option value="right">
                    Right
                  </option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="button"
                className="btn btn-primary height-25 d-flex align-items-center justify-content-center w-100 mt-2"
                onClick={addPageNumbers}

              >
                Add Page Numbers
              </button>
            </div>
              
              </>):(<>
              
            <div>
              <button
                type="button"
                className="btn btn-primary height-25 d-flex align-items-center justify-content-center w-100 mt-2"
                onClick={removePageNumbers}

              >
                Remove Page Numbers
              </button>
            </div>
              
              </>)
            }
            
          </div>
          <div
          className="d-flex flex-column"
          style={{ gap: window.innerWidth <= 1920 ? "0px" : "70px" }}
        >


          <BottomContentSideBar
            docId={docId}
            caseId={caseId}
            clientId={clientId}
          />
        </div>
          </>
          ) : (
            <>
              <div className="side-bar-padding">

                <div>
                  <button
                    type="button"
                    className="btn btn-primary height-25 d-flex align-items-center justify-content-center w-100 mt-2"
                    onClick={deletePages}
                    disabled={selectedPages.length == 0}

                  >
                    Delete Pages
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary height-25 d-flex align-items-center justify-content-center w-100 mt-2"
                    onClick={handleInsertPageBreak}
                  >
                    Insert Break Page
                  </button>
                </div>
                <div>
                  <input
                    type="text"
                    name="textbox1"
                    className="form-control col height-25 mt-2"
                    value={state.textbox1}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="textbox2"

                    className="form-control col height-25 mt-2"
                    value={state.textbox2}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <div className="form-check col mt-2 ml-1" >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="checked"

                      checked={state.checked}
                      onChange={handleChange} // Handle checkbox change
                    />
                    <label className="form-check-label" >
                      Insert File Name
                    </label>
                  </div>


                </div>
                <div>
                  <div className="form-check mt-2 p-0" >
                    <label className="form-check-label" >
                      Select Font Size
                    </label>
                    <select
                      className="form-select col-4 ml-2"
                      name="fontsize"
                      id="fontsize"
                      value={state.fontsize}
                      onChange={handleChange}

                    >
                      {fontSizes.map((font) => (
                        <option value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>




                <div>
                  <button
                    type="button"
                    className="btn btn-primary height-25 d-flex align-items-center justify-content-center w-100 mt-2"
                    onClick={createFullPreview}

                  >
                    Full Preview
                  </button>
                </div>

              </div>
              <div
          className="d-flex flex-column"
          style={{ gap: window.innerWidth <= 1920 ? "0px" : "70px" }}
        >


        </div>
            </>
          )
        }



      </div>
      
    </div>
  );
};

DocumentModalSideBar.propTypes = {
  documentData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    for_client: PropTypes.object,
    for_case: PropTypes.shape({
      case_type: PropTypes.shape({
        name: PropTypes.string,
        casetype_icon: PropTypes.string,
      }),
      incident_date: PropTypes.string,
    }),
    file_name: PropTypes.string,
    docDate: PropTypes.string,
    attached_by: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      profile_pic_29p: PropTypes.string,
    }),
    document_slot: PropTypes.object,
  }).isRequired,
  pages: PropTypes.array.isRequired,
  slotsData: PropTypes.array.isRequired,
};

export default DocumentModalSideBar;
