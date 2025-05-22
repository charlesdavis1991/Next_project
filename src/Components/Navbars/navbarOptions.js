import React, { useState } from "react";
import DocumentUploadModal from "../Modals/documentUploadModal";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import { UploadDocumentsForInbox } from "../../Providers/main";
import { useDispatch, useSelector } from "react-redux";
import { setInboxRefreshDocuments } from "../../Redux/inbox/actions";
import { getClientId, getCaseId } from "../../Utils/helper";
import ModalComponent from "../NewCaseModal/ModalComponent";

const NavbarOptions = (props) => {
  const dispatch = useDispatch();
  const inboxRefreshDocuments = useSelector(
    (state) => state.inbox.inboxRefreshDocuments
  );
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFile, setUploadFile] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      console.log(
        "Dropped files:",
        files?.map((file) => file.name)
      );
      setUploadFile(files?.map((file) => file.name));
      setFileUploadModal(true);
      UploadDocumentsForInbox(
        files,
        getCaseId(),
        getClientId(),
        dispatch,
        inboxRefreshDocuments,
        setInboxRefreshDocuments,
        setUploadProgress
      );
    },
  });
  return (
    <>
      <div
        className="Header-margin-right-17px-margin-top-12px-position-relative-height-60px case-btn"
        style={{
          right: props.expanded ? "20px" : "20px",
          transition: props.expanded
            ? "right 0.3s ease-out"
            : "right 0.3s ease-in",
          left: "-10px",
        }}
      >
        <button
          data-toggle="modal"
          data-target="#add_new_client"
          className="inbox-icon inbox-icon-2 text-center"
          onClick={handleOpenModal}
        >
          <img
            className="height-41"
            src="/BP_resources/images/icon/add-new-case-logo-icon.svg"
            alt="John Doe"
          />
          <small
            className="d-block translatey-1"
            style={{ transform: "translateY(3px)" }}
          >
            Add New Case
          </small>
        </button>
        <ModalComponent show={showModal} onClose={handleCloseModal} />
      </div>
      <div
        style={{
          cursor: "pointer",
          right: props.expanded ? "20px" : "20px",
          transition: props.expanded
            ? "right 0.3s ease-out"
            : "right 0.3s ease-in",
          left: "-10px",
        }}
        {...getRootProps({ onClick: (event) => event.stopPropagation() })}
        className="Header-margin-right-25px-margin-top-12px-position-relative-height-60px inbox-btn"
      >
        <input {...getInputProps()} />
        <div className="dropzone Header-background-color-transparent-border-0px-height-30px-cursor-pointer-margin-0px-padding-0px-min-height-42px">
          <Link to={"/inbox/" + getClientId() + "/" + getCaseId()}>
            <div className="inbox-icon text-center">
              <img
                className="height-41"
                src="/BP_resources/images/icon/inbox-logo-icon.svg"
                alt="John Doe"
              />
              <small
                className="d-block translatey-1"
                style={{ transform: "translateY(3px)" }}
              >
                Inbox
              </small>
            </div>
          </Link>
        </div>
      </div>
      <DocumentUploadModal
        uploadFile={uploadFile}
        uploadProgress={uploadProgress}
        id="fileModal"
        show={fileUploadModal}
        onHide={() => setFileUploadModal(false)}
      />
    </>
  );
};

export default NavbarOptions;
