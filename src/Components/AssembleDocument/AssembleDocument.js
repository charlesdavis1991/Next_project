import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Nav, Tab } from "react-bootstrap";
import api, { api_without_cancellation } from "../../api/api";
import axios from "axios";
import { getCaseId, getClientId, getLoggedInUserId, mediaRoute } from "../../Utils/helper";
import GenericModalComponent from "../common/Modal/Modal";
import { useFooter } from "../common/shared/FooterContext";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
import AssembleDocumentModal from "../AssembleDocumentModal";


function AssembleDocument({
  handleClose,
  show,
  activeTab

}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCaseId = getCaseId();
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);

  const { showAssembleDocumentModal } = useDocumentModal();


  const handleDocPreview = (doc) => {
    // console.log("document for preview = ", doc);
    handleClose()
    console.log(selectedDocs)
    var assemble_docs = JSON.stringify(selectedDocs)
    console.log(assemble_docs)

    showAssembleDocumentModal(assemble_docs);
  };


  const isSaveDisabled = useMemo(() => {
    return (
      selectedDocs.length < 1
    );


  }, [selectedDocs]);

  const handleCheckboxChange = useCallback(
    (doc) => {
      setSelectedDocs((prevDocs) =>
        prevDocs.includes(doc.id)
          ? prevDocs.filter((id) => id !== doc.id) // Remove the ID if already selected
          : [...prevDocs, doc.id] // Add the ID if not selected
      );
    },
    [setSelectedDocs]
  );


  const fetchData = async () => {

    try {
      const response = await api_without_cancellation.get(
        `${origin}/api/doc-page/doc-page-popup-api/`,
        {
          params: {
            page_id: activeTab,
            case_id: currentCaseId ? currentCaseId : "",
          },
        }
      );
      if (response.status === 200) {
        console.log("docs", response.data)
        setDocuments(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };



  useEffect(() => {
    fetchData()

  }, []);




  const bodyContent = useMemo(
    () => (
      <>
        <div className="custom-tab mt-3">

          <div class="table-responsive table--no-card rounded-0 border-0" style={{ height: "540px", overflowY: "scroll" }}>
            <table class="table table-borderless table-striped table-earning has-height-25 generate-doc-table">
              <thead>
                <tr>
                  <th scope="col" class="width-1"></th>
                  <th></th>
                  <th>Category</th>
                  <th>Page Slot Number</th>
                  <th>Page Slot Name</th>
                  <th>Name</th>
                  <th>Pages</th>

                </tr>
              </thead>
              <tbody id="table-body-cat" className="generate-doc-body">
                {documents
                  ?.filter((obj) => obj.page_count) // Filter out objects where page_count is falsy (null, undefined, 0, etc.)
                  .map((obj, index) => (
                    <tr key={obj.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="form-check justify-content-center">
                          <input
                            className="form-check-input template-checkbox"
                            type="checkbox"
                            checked={selectedDocs.includes(obj.id)}
                            onChange={() => handleCheckboxChange(obj)}
                          />
                        </div>
                      </td>
                      <td className="text-nowrap">{obj.page_name ? obj.page_name : ""}</td>
                      <td className="text-nowrap">{obj.document_slot ? obj.document_slot.slot_number : ""}</td>
                      <td className="text-nowrap">{obj.document_slot ? obj.document_slot.slot_name : ""}</td>
                      <td className="text-nowrap">{obj.file_name ? obj.file_name : ""}</td>
                      <td className="text-nowrap">{obj.page_count ? obj.page_count : ""}</td>
                    </tr>
                  ))}
              </tbody>

            </table>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-1">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="ml-2"
          >
            Cancel
          </Button>
          <div className="d-flex space-x-5">
            <Button
              variant="primary"
              onClick={() => handleDocPreview()}
              disabled={
                isSaveDisabled
              }
            >
              Assemble Documents
            </Button>

          </div>
        </div>
      </>
    ),
    [
      handleClose,
      documents,
      selectedDocs
    ]
  );

  return (
    <GenericModalComponent
      show={show}
      handleClose={handleClose}
      title={
        <>
          <i className="ic ic-29 ic-generate-document m-r-5"></i> Select
          Documents To Assemble
        </>
      }
      height="659px"
      bodyContent={bodyContent}
      dialogClassName="modal-dialog-centered genrate-docs-modal"
      titleClassName="mx-auto d-flex align-items-center justify-content-center font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
      headerClassName="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center"
    />
  );
}

export default AssembleDocument;
