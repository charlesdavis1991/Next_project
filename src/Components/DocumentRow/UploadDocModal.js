import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import api from "../../api/api";
import { getCaseId, getClientId } from "../../Utils/helper";
import DocumentFetchingLoader from "../Loaders/DocumentFetchingLoader";
import ButtonLoader from "../Loaders/ButtonLoader";
import "./document.css"



const styles = {
  dropzone: {
    padding: '20px',
    textAlign: 'center'
  },
  input: {
    display: 'none' // Hide the input element
  }
};

const UploadDocModal = ({
  show,
  handleClose,
  slot_id,
  panel_id,
  page_id,
  caseId,
  clientId,
  handleDocumentUpload,
  isDocumentTab,
  refetchLoading,
  refetchData
}) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentUser = useSelector((state) => state.chat?.currentUser);
  const [unattachedFiles, setUnattachedFiles] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const [attaching, setAttaching] = useState(false)
  const fileInput = useRef(null);
  const [selectedocId, setSelectedDocId] = useState('')
  const [fetchingUnattachedDocsLoading, setFetchingUnattachedDocsLoading] =
    useState(false);




  useEffect(() => {

    const fetchData = async () => {
      setFetchingUnattachedDocsLoading(true);
      try {
        const response = await api.get(
          `/api/get_unattached_doc/${getClientId()}/${getCaseId()}/`
        );
        setUnattachedFiles(response.data)
        const data = response.data;
        // let selectHtml = "";
        // data.forEach((item) => {
        //   const pageName = item.page_name || "Case Generally";
        //   selectHtml += `<tr class="doc-row" onclick="selectDoc(this,${item.id})"><td>${pageName}</td><td>${item.file_name}</td></tr>`;
        // });
        // setSelectHtml(selectHtml);
        setFetchingUnattachedDocsLoading(false)
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setFetchingUnattachedDocsLoading(false)
      }
    };

    if (show) {
      fetchData();
    }
  }, [show]);



  const handleFileChange = useCallback(async (acceptedFiles) => {
    setUploading(true)
    setAttaching(true)
    const formData = new FormData();
    let fileSizeInMB;
    acceptedFiles.forEach(file => {
      formData.append('file', file);
      fileSizeInMB = file.size / (1024 * 1024);
    });

    const response = await api.post(
      `/api/upload_doc/${getClientId()}/${getCaseId()}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const docId = response.data.docId;
    if (docId) {
      await attachDocument(docId, fileSizeInMB);
    }
    setUploading(false)

  }, [panel_id, page_id, slot_id]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileChange
  });


  const attachDocument = async (docId, fileSizeInMB) => {
    if (isDocumentTab) {
      setAttaching(true);
      try {
        await api.post("api/doc/attach/treatment/", {
          slot: slot_id,
          page_id: page_id, // Corrected the syntax here
          case_id: caseId,
          panels: false,
          doc_id: docId,
          ...(fileSizeInMB && { file_size: fileSizeInMB }),
        });
        // setIsAttaching(false);
        await refetchData(); // Await refetchData
        await handleDocumentUpload(); // Await handleDocumentUpload if it's async
      } catch (error) {
        console.log(error);
      } finally {
        setAttaching(false)
      }
    }
    else if (!isDocumentTab) {
      setAttaching(true);
      try {
        await api.post("api/doc/attach/treatment/", {
          panel_id: panel_id,
          slot: slot_id,
          page_id: page_id,
          case_id: caseId,
          panels: true,
          doc_id: docId,
          ...(fileSizeInMB && { file_size: fileSizeInMB }),
        });
        // setIsAttaching(false);
        await refetchData(); // Await refetchData
        await handleDocumentUpload(); // Await handleDocumentUpload if it's async
      } catch (error) {
        console.log(error);
      } finally {
        setAttaching(false)
      }
    }
    else {
      setAttaching(true);
      try {
        await api.post("api/doc/attach/treatment/", {
          panel_id: panel_id,
          slot: slot_id,
          page_id: page_id,
          case_id: caseId,
          panels: true,
          doc_id: docId,
          ...(fileSizeInMB && { file_size: fileSizeInMB }),
        });
        // setIsAttaching(false);
        await refetchData(); // Await refetchData
        await handleDocumentUpload(); // Await handleDocumentUpload if it's async
      } catch (error) {
        console.log(error);
      } finally {
        setAttaching(false)
      }
    }

  };

  return (
    <Modal show={show} onHide={handleClose} className="modal-1000w">
      <Modal.Header closeButton>
        {/* <Modal.Title>Upload and Attach Document</Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
        <div class="modal-header text-center height-35 p-0 bg-primary rounded-0 border-0">
          <h3 class="modal-title mx-auto text-white text-upper height-35">
            Upload Document to Slot
          </h3>
        </div>
        <div className="row">
          <div className="col-md-6 text-center mt-5"  {...getRootProps()} style={styles.dropzone}>
            <input
              type="file"
              {...getInputProps()}
              style={{ display: "none" }}
              onChange={handleFileChange}
              ref={fileInput}
            />
            <button
              class="btn btn-primary"
            // onClick={() => fileInput.current.click()}
            >
              {isUploading || refetchLoading ? (
                <div className="d-flex align-items-center">
                  <ButtonLoader />
                  <span style={{ marginLeft: "2px" }}>Uploading</span>
                </div>
              ) : " Upload a Document"}
            </button>
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}

          </div>
          <div className="col-md-6 DD-Scrollable">
            <table class="table table-borderless table-striped">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Document Name</th>
                </tr>
              </thead>

              {fetchingUnattachedDocsLoading ? <DocumentFetchingLoader /> : (
                <tbody>
                  {unattachedFiles.map((item, index) => (
                    <tr className={`doc-row ${selectedocId === item.id ? 'selectedDoc' : ''}`} key={index} onClick={() => setSelectedDocId(item.id)} style={{ cursor: "pointer" }}>
                      <td>{item?.page_name || "Case Generally"}</td>
                      <td>{item?.file_name}</td>
                    </tr>
                  ))}
                </tbody>
              )}

            </table>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            variant="success"
            disabled={attaching || refetchLoading}
            style={{ marginLeft: "5px" }}
            onClick={() => attachDocument(selectedocId)}
          >
            Attach Doc
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadDocModal;
