import React, { useState, useEffect, useReducer } from "react";
import TableFirmSettings from "../../common/table-firm-settings";
import api, { api_without_cancellation } from "../../../../api/api";
import {  mediaRoute } from "../../../../Utils/helper";

import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useDocumentModal } from "../../../common/CustomModal/CustomModalContext";

const CourtForms = () => {
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [courtForms, setCourtForms] = useState([]);
  const { showDocumentModal } = useDocumentModal();


  const initialState = {

    show: false,
    status: "",

  };


  const handleDocPreview = (doc) => {
    // console.log("document for preview = ", doc);
    showDocumentModal("document", mediaRoute(doc.upload), doc);
  };


  const fetchCourtForms = async () => {
    try {
      const response = await api_without_cancellation.get(
        origin +
        `/api/documents/get-courtforms/`
      );
      if (response.status == 200) {
        setCourtForms(response.data.data)
      }
    } catch (error) {
      console.log("Failed to fetch Litigation Data:", error);
    }
  };


 

  useEffect(() => {
    fetchCourtForms();
  }, []);

  function reducer(state, action) {
    switch (action.type) {

      case "SHOW_MODAL":
        return { ...state, show: true, status: action.payload };
      case "HIDE_MODAL":
        return { ...state, show: false };

      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFileUpload = async (event,court_form_id) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("court_form_id", court_form_id);

    try {
    const response = await api_without_cancellation.post(
      `${origin}/api/documents/upload-courtform-pdf/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if(response.status == 200){
      console.log("File Uploaded")
      fetchCourtForms()
    }
  } catch (error) {
    console.log("Failed to fetch Litigation Data:", error);
  }
  };




  return (
    <>
      <TableFirmSettings>

        <thead>
          <tr>
            <th></th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>
              Name
            </th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>Form</th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>
              Jurisdiction
            </th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>States</th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>
              Counties
            </th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}></th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}></th>

          </tr>
        </thead>
        <tbody>
          {courtForms &&
            courtForms?.map((item, idx) => {
              return (
                <tr style={{ height: "37px" }}>
                  <td
                    style={{ fontSize: "13px" }}

                  >
                    {idx + 1}
                  </td>
                  <td
                    style={{
                      fontSize: "13px",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                    }}
                  >
                    {item?.court_form_name}
                  </td>
                  <td style={{
                      fontSize: "13px",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                    }}>{item?.court_form_code}</td>
                    <td
                    style={{
                    fontSize: "13px",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                  }}
                  >
                    {item?.for_jurisdiction_types?.map(state => state.name).join(", ")}

                  </td>
                  <td
                   style={{
                    fontSize: "13px",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                  }}
                  >
                    {item?.for_states?.map(state => state.name).join(", ")}

                  </td>
                  <td
                    style={{
                    fontSize: "13px",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                  }}
                  >
                    {item?.for_counties?.map(state => state.name).join(", ")}

                  </td>
                  
                  <td>
                    {item?.background_pdf ? (
                        <i className="ic-generate-document-pdf ic ic-19"
                        onClick={() => handleDocPreview(item?.background_pdf)}
                        ></i>
                       
                    ) : (
                      <>
                       <input
                          type="file"
                          id={`upload-file-${item?.id}`}
                          style={{ display: "none" }}
                          onChange={(e) => handleFileUpload(e, item?.id)}
                        />

                      <label htmlFor={`upload-file-${item?.id}`} style={{ cursor: "pointer" }}>
                      <i className="ic-pdf-icon-grey ic ic-19"></i>
                      </label>
                      </>
                     
                    )}
                  </td>
                  <td style={{
                      fontSize: "13px",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                      color: "red"
                    }}>
                  {
                    item?.page_numbers > 0 ? (
                      item?.page_numbers !== item?.background_pdf?.page_count ? (
                        item?.background_pdf?.page_count
                      ) : null
                    ) : null
                  }



                  </td>

                </tr>
              );
            })}
        </tbody>
      </TableFirmSettings>


      {
        <Modal
          show={state.show}
          onHide={() => dispatch({ type: "HIDE_MODAL" })}
        >
          <Modal.Header closeButton>
            <Modal.Title dangerouslySetInnerHTML={{ __html: state.status }} className="modal-title h4 justify-content-center text-center">

            </Modal.Title>
          </Modal.Header>
          <Modal.Footer style={{ borderTop: 'none' }}>
            <Button
              variant="secondary"
              className="mx-auto"
              onClick={() => dispatch({ type: "HIDE_MODAL" })}
            >
              Dismiss
            </Button>
          </Modal.Footer>
        </Modal>

      }
    </>
  );
};

export default CourtForms;
