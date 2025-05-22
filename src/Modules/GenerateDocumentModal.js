import React, { useEffect, useState } from "react";
import { Modal, Button, Nav, Tab, Table } from "react-bootstrap";
import { getCaseId, getClientId } from "../Utils/helper";
import api from "../api/api";
function updateControls(type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
  console.log(
    "updateControls called with:",
    type,
    arg1,
    arg2,
    arg3,
    arg4,
    arg5,
    arg6,
    arg7,
    arg8
  );
}

function openDocWordProcessor(
  arg1,
  arg2,
  arg3,
  arg4,
  arg5,
  arg6,
  arg7,
  arg8,
  arg9,
  arg10,
  arg11,
  arg12
) {
  console.log(
    "openDocWordProcessor called with:",
    arg1,
    arg2,
    arg3,
    arg4,
    arg5,
    arg6,
    arg7,
    arg8,
    arg9,
    arg10,
    arg11,
    arg12
  );
}

function DownloadWordToPdf(
  arg1,
  arg2,
  arg3,
  arg4,
  arg5,
  arg6,
  arg7,
  arg8,
  arg9,
  arg10,
  arg11,
  arg12
) {
  console.log(
    "DownloadWordToPdf called with:",
    arg1,
    arg2,
    arg3,
    arg4,
    arg5,
    arg6,
    arg7,
    arg8,
    arg9,
    arg10,
    arg11,
    arg12
  );
}

function downloadDoc(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
  console.log(
    "downloadDoc called with:",
    arg1,
    arg2,
    arg3,
    arg4,
    arg5,
    arg6,
    arg7,
    arg8
  );
}

function PrintDoc(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
  console.log(
    "PrintDoc called with:",
    arg1,
    arg2,
    arg3,
    arg4,
    arg5,
    arg6,
    arg7,
    arg8
  );
}

const dummyData = {
  templates: [
    {
      id: 1,
      name: "Template 1",
      copilot: "Yes",
      pages: 5,
      uploaded: "2024-05-01",
      lastGenerated: "2024-05-20",
      firm: "Firm A",
      taskFor: "Task 1",
    },
    {
      id: 2,
      name: "Template 2",
      copilot: "No",
      pages: 3,
      uploaded: "2024-04-15",
      lastGenerated: "2024-05-15",
      firm: "Firm B",
      taskFor: "Task 2",
    },
    {
      id: 3,
      name: "Template 3",
      copilot: "Yes",
      pages: 10,
      uploaded: "2024-03-10",
      lastGenerated: "2024-05-10",
      firm: "Firm C",
      taskFor: "Task 3",
    },
  ],
  drafts: [
    { id: 1, name: "Draft 1", lastAccessed: "2024-05-18", task: "Task 4" },
    { id: 2, name: "Draft 2", lastAccessed: "2024-05-17", task: "Task 5" },
    { id: 3, name: "Draft 3", lastAccessed: "2024-05-16", task: "Task 6" },
  ],
};

function GenerateDocumentModal({ show, handleClose, witnessData }) {
  const dropdownId = 1;
  const pageId = witnessData?.tabs_page?.[0]?.id || 0;
  const caseId = getCaseId();
  const clientId = getClientId();

  const [generateData, setGenerateData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (pageId && caseId && clientId) {
      api
        .get(
          `/30/GetDLTemplateFromDropdown/?dropdown_id=${dropdownId}&page_id=${pageId}&case_id=${caseId}&client_id=${clientId}`
        )
        .then((response) => {
          setGenerateData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log({ error });
          setLoading(false);
        });
    }
  }, [dropdownId, pageId, caseId, clientId]);
  return (
    <Modal show={show} onHide={handleClose} centered className="modal-1200w">
      <Modal.Header className="text-center p-0 bg-primary popup-heading-color justify-content-center">
        <Modal.Title className="mx-auto font-size-24 height-35 d-flex justify-content-center align-items-center font-weight-semibold popup-heading-color font-weight-500">
          <i className="ic ic-29 ic-generate-document m-r-5"></i>Generate
          Document
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="gdft">
          <Nav variant="tabs" className="mb-3">
            <Nav.Link
              eventKey="gdft"
              onClick={() =>
                updateControls("gd", "", "", "3", "", "", "", "", "-1")
              }
            >
              Generate Document From Template
            </Nav.Link>

            <Nav.Link
              eventKey="dd"
              onClick={() =>
                updateControls("dd", "", "", "3", "", "", "", "", "-1")
              }
            >
              Document Drafts
            </Nav.Link>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="gdft" style={{ height: "300px" }}>
              <div className="table-responsive table--no-card rounded-0 border-0">
                <Table className="table-borderless table-striped table-earning has-height-25">
                  <thead>
                    <tr>
                      <th scope="col" className="width-1"></th>
                      <th></th>
                      <th>Template Name</th>
                      <th>Copilot</th>
                      <th className="text-center">Pages</th>
                      <th className="text-center">Uploaded</th>
                      <th className="text-center width-25">Last Generated</th>
                      <th className="text-center width-25">Firm</th>
                      <th></th>
                      <th>Task For</th>
                    </tr>
                  </thead>
                  <tbody id="table-body-cat">
                    {generateData?.data?.map((template) => (
                      <tr key={template.doc_id}>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: "center" }}>
                          {template.user_name}
                        </td>
                        <td>{template.copilot_name}</td>
                        <td className="text-center">{template.pages}</td>
                        <td className="text-center">{template.created}</td>
                        <td className="text-center width-25">
                          {template.last_generated}
                        </td>
                        <td className="text-center width-25">
                          {template.firm}
                        </td>
                        <td></td>
                        <td>{template.taskFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="dd" style={{ height: "300px" }}>
              <div className="table-responsive table--no-card rounded-0 border-0">
                <Table className="table-borderless table-striped table-earning has-height-25">
                  <thead>
                    <tr>
                      <th scope="col" className="width-1"></th>
                      <th></th>
                      <th>Document Name</th>
                      <th className="text-center">Last Accessed</th>
                      <th></th>
                      <th>Assign Document Generation Task</th>
                    </tr>
                  </thead>
                  <tbody id="table-body-cat">
                    {generateData?.document_drafts?.map((draft) => (
                      <tr key={draft.id}>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: "center" }}>
                          {draft.document_name}
                        </td>
                        <td className="text-center">{draft.lastAccessed}</td>
                        <td></td>
                        <td>{draft.task}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button
          variant="secondary"
          className="footer-btn"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <div className="d-flex" id="generatePopUpControls">
          <Button
            className="btn btn-primary d-flex align-items-center m-r-5"
            onClick={() =>
              openDocWordProcessor(
                "",
                "",
                "",
                "all",
                "",
                "",
                "3",
                "",
                "",
                "",
                "",
                "-1"
              )
            }
          >
            Open Selected Docs in Tabs
          </Button>
          <Button
            className="btn btn-primary d-flex align-items-center m-r-5"
            onClick={() =>
              DownloadWordToPdf(
                "",
                "",
                "",
                "all",
                "",
                "",
                "3",
                "",
                "",
                "",
                "",
                "-1"
              )
            }
          >
            Download Selected as PDFs
          </Button>
          <Button
            className="btn btn-primary d-flex align-items-center m-r-5"
            onClick={() => downloadDoc("", "", "3", "", "", "", "", "-1")}
          >
            Download Selected as Docs
          </Button>
          <Button
            className="btn btn-primary d-flex align-items-center m-r-5"
            onClick={() => PrintDoc("", "", "3", "", "", "", "", "-1")}
          >
            Print Selected
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default GenerateDocumentModal;
