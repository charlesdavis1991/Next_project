import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Form, Col, Row, Tab } from 'react-bootstrap';
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";

export default function LitigationSOLModal({
  showPopup,
  handleClose,
  handleSave,
  handleDelete,
  solId, 
  removed,
  filing_date,
  satisfied,
}) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const methods = useForm();
  const { handleSubmit, register, setValue, watch, formState: { errors } } = methods;
  const [loading, setLoading] = useState(false);
  const { setLitigationDataUpdated } = useContext(ClientDataContext);

  useEffect(() => {
    // Set initial values for the form fields
    setValue('satisfied', satisfied);
    setValue('removed', removed);
    setValue('filing-date', filing_date);
  }, [  removed, filing_date, satisfied,])

  const onSubmit = async (data) => {
    const url = `${origin}/api/litigation-page/solcase/${solId}/`;
    setLoading(true);

    const satisfied = watch("satisfied");
    const removed = watch("removed");
    const filing_date = watch("filing-date");

    const requestBody = {
      satisfied: satisfied,
      removed: removed,
      filing_date_added: filing_date
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
            <div class="row mb-1">
              <div class="col-md-10">
                <p class="text-secondary">Satisfied</p>
              </div>
              <div class="col-md-2">
                <input type="checkbox" {...register('satisfied')} id="" className="form-control" defaultValue={satisfied}/>
              </div>
            </div>
            <div class="row mb-1">
              <div class="col-md-10">
                <p class="text-secondary">Removed</p>
              </div>
              <div class="col-md-2">
                <input type="checkbox" {...register('removed')} id="" className="form-control" defaultValue={removed}/>
              </div>
            </div>
            <div class="row mb-1">
              <div class="col-md-10">
                <p class="text-secondary">Filing date</p>
              </div>
              <div class="col-md-2">
                <input type="checkbox" {...register('filing-date')} id="" className="form-control" defaultValue={filing_date}/>
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
