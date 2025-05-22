import React, { useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useCheckRequestModal } from "./CheckRequestModalContext";
import api from "../../api/api";
import { useUpdateTrigger } from "./TriggerUpdateContext"; // Import the useModal hook
import { getCaseId, getClientId } from "../../Utils/helper";

const CheckRequestModal = () => {
  const { isVisible, modalData, hideModal } = useCheckRequestModal();
  const { toggleTriggerUpdate } = useUpdateTrigger();
  const [errorMessage, setErrorMessage] = useState("");
  const confirmCostCheckRequest = async (clientId, caseId, costId) => {
    try {
      const response = await api.post(
        `api/check-request/${getClientId()}/${getCaseId()}/costs/${costId}/`,
      );
      if (!response.status.toString().startsWith("2")) {
        let errorMessage = "Check request failed";
        try {
          const errorData = await response.data;
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (error) {
          console.error("Error parsing API error response:", error);
        }
        setErrorMessage(errorMessage);
        return;
      }

      setErrorMessage("");
      toggleTriggerUpdate();
      hideModal(); // Close modal on success
    } catch (error) {
      setErrorMessage(error.message || "An unknown error occurred");
    }
  };
  return (
    <Modal show={isVisible} onHide={hideModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Check Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage ? (
          <Alert variant="danger">Error creating a check.</Alert>
        ) : (
          <></>
        )}
        <div className="mb-3">
          <p>
            Payee: <span>{modalData.payee}</span>
          </p>
        </div>
        <div className="mb-3">
          <p>
            Amount: <span>{modalData.amount}</span>
          </p>
        </div>
        <div className="mb-3">
          <p>
            Memo: <span>{modalData.memo}</span>
          </p>
        </div>
        <div className="mb-3">
          <p>
            Invoice Number: <span>{modalData.invoice_number}</span>
          </p>
        </div>
        <div>Do you want to confirm the check request?</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            await confirmCostCheckRequest(
              modalData.clientId,
              modalData.caseId,
              modalData.costId,
            );
            hideModal();
          }}
        >
          Request
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckRequestModal;
