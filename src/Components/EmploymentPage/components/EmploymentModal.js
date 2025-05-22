import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { useForm } from "react-hook-form";

function EmploymentModal({ show, handleClose, handleEmploymentAddedOrEdited, states }) {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();
  const origin = process.env.REACT_APP_BACKEND_URL;

  const caseId = getCaseId();
  const clientId = getClientId();

  // Reset the form data and close the modal
  const handleModalClose = () => {
    reset(); // Reset form fields using react-hook-form reset
    handleClose();  // Call the parent close function
  };

  // Function to format phone numbers
  const formatNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // Handle input changes to format phone numbers
  const handleInputChange = (event, fieldName) => {
    const formattedValue = formatNumber(event.target.value);
    setValue(fieldName, formattedValue, { shouldValidate: true });
  };

  
  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      await axios.post(`${origin}/api/employment/list/${clientId}/${caseId}/`, formData);
      handleEmploymentAddedOrEdited();  // Refresh data in parent component
      handleModalClose();  // Close the modal
    } catch (err) {
      console.error("Failed to submit the form", err);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose} 
      centered
      dialogClassName="modal-lg Employment-max-width-1000px employment-modal"
    >
      <Modal.Header closeButton className="text-center p-0 bg-primary popup-heading-color justify-content-center">
        <Modal.Title className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500">
          Add Employment
        </Modal.Title>
      </Modal.Header>
      <p className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center">
        Add your Employment's information here.
      </p>
      <Modal.Body>
        <Form id="addEmploymentForm" onSubmit={handleSubmit(onSubmit)}>
          {/* Employer Name */}
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Employer Name:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Employer Name"
                {...register("employer_name")}
              />
              {errors.employer_name && <span className="text-danger">{errors.employer_name.message}</span>}
            </div>

            {/* Title */}
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Title:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Title"
                {...register("title")}
              />
            </div>
          </div>

          {/* Description and Wages Lost */}
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Description:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Description"
                {...register("description")}
              />
            </div>

            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Wages Lost:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Wages Lost"
                {...register("wages_lost")}
              />
            </div>
          </div>

          {/* Disability Information */}
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Disability Lost:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Disability Lost"
                {...register("disability_lost")}
              />
            </div>

            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Claim Number:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Claim Number"
                {...register("disability_claim_number")}
              />
            </div>
          </div>

          {/* More Disability Information */}
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Disability Lien:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Disability Lien"
                {...register("disability_lien")}
              />
            </div>

            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Disability Finals:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Disability Final"
                {...register("disability_final")}
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Name:</span>
            </div>
            <div className="col-md-10">
              <Form.Control
                type="text"
                placeholder="Name"
                {...register("name")}
              />
            </div>
          </div>

          {/* Name Details */}
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">First Name:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="First Name"
                {...register("first_name")}
              />
            </div>

            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Last Name:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Last Name"
                {...register("last_name")}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Address 1:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Address 1"
                {...register("address1")}
              />
            </div>

            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Address 2:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Address 2"
                {...register("address2")}
              />
            </div>
          </div>

          {/* City, State, Zip */}
          <div className="row align-items-center form-group d-flex">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">City:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="City"
                {...register("city")}
              />
            </div>

            <div className="col-md-1 text-left">
              <span className="d-inline-block text-grey">State:</span>
            </div>
            <div className="col-md-2">
              <Form.Control as="select" {...register("state")}>
                <option value="">Select a State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </Form.Control>
            </div>

            <div className="col-md-1 text-left">
              <span className="d-inline-block text-grey">Zip:</span>
            </div>
            <div className="col-md-2">
              <Form.Control
                type="text"
                placeholder="Zip"
                {...register("zip")}
              />
            </div>
          </div>

          {/* Phone and Fax */}
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Phone:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="(###) ###-####"
                {...register("phone")}
                onChange={(e) => handleInputChange(e, "phone")}
              />
            </div>

            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Extension:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Extension"
                {...register("extension")}
              />
            </div>
          </div>

          {/* Fax and Email */}
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Fax:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="(###) ###-####"
                {...register("fax")}
                onChange={(e) => handleInputChange(e, "fax")}
              />
            </div>

            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Email:</span>
            </div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Email"
                {...register("email")}
              />
            </div>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-between pt-4">
        <Button variant="secondary" onClick={handleModalClose}>
          Cancel
        </Button>
        <Button
          form="addEmploymentForm"
          type="submit"
          className="btn btn-success save-btn-popup popup-heading-color"
          style={{ backgroundColor: "#009900", boxShadow: "0 0 0 9999px #009900 inset" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Employment Information"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EmploymentModal;
