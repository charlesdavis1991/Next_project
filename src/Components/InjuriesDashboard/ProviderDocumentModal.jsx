import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId, getToken } from "../../Utils/helper";
import { updateInjuries } from "../../Redux/injuries/actions";

const ProviderDocumentModal = ({ show, handleClose, provider, processedPageSlots, injuryId, detailId }) => {
  const dispatch = useDispatch();

  const [selectedDocId, setSelectedDocId] = useState(null);

  const handleDocSelect = (event) => {
    setSelectedDocId(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!selectedDocId) {
      console.log('No document selected');
      return;
    }

    const formData = new FormData();
    formData.append('provider_doc_id', selectedDocId);

    const origin = process.env.REACT_APP_BACKEND_URL;

    try {
      const caseId = getCaseId();
      const clientId = getClientId();
      const response = await fetch(origin + `/api/injuries/attach-doc-to-injury-provider/${injuryId}/${detailId}/?case_id=${caseId}&client_id=${clientId}`, {
        method: 'POST',
        headers: {
          Authorization: getToken(),
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(
          updateInjuries(data.injuries)
        );
        handleClose();
      } else {
        console.error('Failed to attach document');
      }
    } catch (error) {
      console.error('Error attaching document:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header className="text-center height-35 p-0 bg-primary rounder-0 border-0 text-white" closeButton>
        <Modal.Title className="mx-auto">Link a Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <div className="d-flex flex-column align-items-center">
          {processedPageSlots.filter(slot => slot.provider.id === provider.id && slot.doc).map(slot => (
            <div key={slot.doc?.id} className="col-12 col-md-3 col-xl icon-text-box text-center">
              <Form.Check
                type="radio"
                id={`doc-${slot.doc?.id}`}
                name="provider_doc_id"
                value={slot.doc?.id}
                label={
                  <>
                    {slot.doc?.created && (
                    <p className="date">{new Date(slot.doc.created).toLocaleDateString()}</p>
                    )}
                    <span className="icon-wrap">
                      <i className="ic ic-35 ic-file-colored cursor-pointer"></i>
                    </span>
                    <p className="name">{slot.page_slot.slot_name || slot.doc?.file_name}</p>
                  </>
                }
                onChange={handleDocSelect}
              />
            </div>
          ))}
          </div>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="success" type="submit">Attach</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProviderDocumentModal;
