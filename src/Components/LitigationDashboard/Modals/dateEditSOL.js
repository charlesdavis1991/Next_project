import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Form, Col, Row, Tab } from 'react-bootstrap';
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";

export default function LitigationDateSOLModal({
  showPopup,
  handleClose,
  handleSave,
  handleDelete,
  solId
}) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const methods = useForm();
  const { handleSubmit, register, setValue, watch, formState: { errors } } = methods;
  const [loading, setLoading] = useState(false);
  const { setLitigationDataUpdated } = useContext(ClientDataContext);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
};

  const onSubmit = async (data) => {
    const url = `${origin}/api/litigation-page/solcase/${solId}/`;
    setLoading(true);

    const date = watch("date");
    const formatted_date = formatDate(date);

    const requestBody = {
      claim_form_filing_date: formatted_date
    }

    try {
      const response = await axios.patch(url, requestBody, {
        headers: {
          Authorization: token,
        },
      });
      setLoading(false);
      setLitigationDataUpdated(true);
      handleClose()
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <Modal
      show={showPopup ? true : false}
      onHide={handleClose}
      centered
      dialogClassName="modal-dialog modal-dialog-centered"
    >
      <FormProvider {...methods}>
        <div class="modal-content">
          <div class="modal-header text-center">
            <h4 class="modal-title mx-auto">Edit Filing Date</h4>
          </div>
          <div class="modal-body">
            <div class="row align-items-center mb-1">
              <div class="col-md-4">
                <p class="text-secondary">Enter Filing Date:</p>
              </div>
              <div class="col-md-8">
                <input type="date" {...register('date')} id="date_input" className="form-control" min="1000-01-01" max="9999-12-31" />
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 justify-content-between pt-0">
            <button type="button" class="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="button" class="btn btn-success" onClick={onSubmit}>
              {loading ? 'Saving..' : 'Save'}
            </button>
          </div>
        </div>
      </FormProvider>
    </Modal>
  );
}
