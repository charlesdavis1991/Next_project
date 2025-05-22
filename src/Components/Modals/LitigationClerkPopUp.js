import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Form, Col, Row, Tab } from 'react-bootstrap';
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";

function LitigationClerkPopUp({
  showPopup,
  handleClose,
  handleSave,
  handleDelete,
  litigation_id,
  contact_id,
  current_first_name,
  current_last_name,
  current_department,
  current_address1,
  current_address2,
  current_city,
  current_state,
  current_zip,
  current_phone,
  current_fax,
  current_email,
  states = []
}) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const methods = useForm();
  const { handleSubmit, register, setValue, watch, formState: { errors } } = methods;
  const [loading, setLoading] = useState(false);
  const { setLitigationDashboardDataUpdated } = useContext(ClientDataContext);

  useEffect(() => {
    // Set initial values for the form fields
    setValue('fname', current_first_name);
    setValue('lname', current_last_name);
    setValue('department', current_department);
    setValue('address1', current_address1);
    setValue('address2', current_address2);
    setValue('city', current_city);
    setValue('state', current_state);
    setValue('zip', current_zip);
    setValue('phone', current_phone);
    setValue('fax', current_fax);
    setValue('email', current_email);
  }, [current_department, current_first_name, current_last_name, current_address1, current_address2, current_city, current_state, current_zip, current_phone, current_fax, current_email])

  const onSubmit = async (data) => {
    const url = `${origin}/api/litigation-page/litigations-update/${litigation_id}/`;
    setLoading(true);


    const normalizeInput = (value) => value === "" ? null : value;

    const fname = normalizeInput(watch("fname"));
    const lname = normalizeInput(watch("lname"));
    const department = watch("department");
    const address1 = watch("address1");
    const address2 = watch("address2");
    const city = watch("city");
    const state = watch("state");
    const zip = watch("zip");
    const phone = watch("phone");
    const fax = watch("fax");
    const email = watch("email");

    const requestBody = {
      clerk_contact: {
        id: contact_id,
        address1: address1,
        address2: address2,
        city: city,
        state: state,
        zip: zip,
        phone_number: phone,
        email: email,
        fax: fax,
      },
      clerk_first_name: fname,
      clerk_last_name: lname,
      department: department
    }

    try {
      const response = await axios.patch(url, requestBody, {
        headers: {
          Authorization: token,
        },
      });

      setLoading(false);
      setLitigationDashboardDataUpdated(true);
      handleClose()
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handlePhoneInput = (e, name) => {
    let phoneNumber = e.target.value.replace(/\D/g, ''); // Remove non-digit characters

    // Enforce max 10 digits
    if (phoneNumber.length > 10) phoneNumber = phoneNumber.slice(0, 10);

    // Apply formatting for (123) 456-7890
    if (phoneNumber.length > 6) {
      phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    } else if (phoneNumber.length > 3) {
      phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else if (phoneNumber.length > 0) {
      phoneNumber = `(${phoneNumber}`;
    }

    setValue(name, phoneNumber); // Update the field with the formatted value
  };

  return (
    <Modal
      show={showPopup ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-2 modal-dialog-centered"
      centered
    >
      <FormProvider {...methods}>
        <div class="modal-content">
          <div class="modal-header text-center">
            <h5 class="modal-title mx-auto">Department Clerk Contact</h5>
          </div>
          <div class="modal-body">
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">

                  <div className="col-md-2 text-left">
                    <p className="text-secondary">Judge First Name :</p>
                  </div>
                  <div className="col-md-10">
                    <Form.Control
                      type="text"
                      placeholder="Enter Court title 1"
                      {...register("fname")}
                      defaultValue={current_first_name}
                      onChange={(e) => setValue('fname', e.target.value)}
                    >
                    </Form.Control>
                  </div>

                </div>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">

                  <div className="col-md-2 text-left">
                    <p className="text-secondary">Judge Last Name :</p>
                  </div>
                  <div className="col-md-10">
                    <Form.Control
                      type="text"
                      placeholder="Enter Court Title 2"
                      {...register("lname")}
                      defaultValue={current_last_name}
                      onChange={(e) => setValue('lname', e.target.value)}
                    >
                    </Form.Control>
                  </div>

                </div>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">

                  <div className="col-md-2 text-left">
                    <p className="text-secondary">Department :</p>
                  </div>
                  <div className="col-md-10">
                    <Form.Control
                      type="text"
                      placeholder="Enter department"
                      {...register("department")}
                      defaultValue={current_department}
                      onChange={(e) => setValue('department', e.target.value)}
                    >
                    </Form.Control>
                  </div>

                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-2 text-left">
                    <p className="text-secondary">Address 1 :</p>
                  </div>
                  <div className="col-md-4">
                    <Form.Control
                      type="text"
                      placeholder="Enter Address 1"

                      {...register("address1")}
                      defaultValue={current_address1}
                      onChange={(e) => setValue('address1', e.target.value)}
                    >
                    </Form.Control>
                  </div>
                  <div className="col-md-2 text-left">
                    <p className="text-secondary">Address 2 :</p>
                  </div>
                  <div className="col-md-4">
                    <Form.Control
                      type="text"
                      placeholder="Enter Address 2"
                      {...register("address2")}
                      defaultValue={current_address2}
                      onChange={(e) => setValue('address2', e.target.value)}
                    >
                    </Form.Control>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-1 text-left">
                    <span className="text-secondary">
                      City:
                    </span>
                  </div>
                  <div className="col-md-3">
                    <Form.Control
                      type="text"
                      {...register("city")}
                      defaultValue={current_city}
                      onChange={(e) => setValue('city', e.target.value)}
                      placeholder='City'
                    >

                    </Form.Control>
                  </div>
                  <div className="col-md-1 text-left">
                    <span className="text-secondary">
                      State:
                    </span>
                  </div>
                  <div className="col-md-3">
                    <Form.Select
                      {...register('state')}
                      defaultValue={current_state}
                      onChange={(e) => setValue('state', e.target.value)}
                      className={`form-control ${errors.state && 'is-invalid'}`}
                    >   <option key="" value="">-------</option>
                      {states?.map(state => (
                        <option key={state.id} value={state.StateAbr}>
                          {state.name}
                        </option>
                      ))}

                    </Form.Select>
                  </div>
                  <div className="col-md-1 text-left">
                    <span className="text-secondary">
                      Zip:
                    </span>
                  </div>
                  <div className="col-md-3">
                    <Form.Control
                      type="text"
                      {...register("zip")}
                      defaultValue={current_zip}
                      onChange={(e) => setValue('zip', e.target.value)}
                      placeholder='Zip#'
                    >

                    </Form.Control>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-1 text-left">
                    <p className="text-secondary">Phone:</p>
                  </div>
                  <div className="col-md-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter Phone"
                      {...register("phone")}
                      defaultValue={current_phone}
                      onChange={(e) => handlePhoneInput(e, 'phone')}
                      maxLength={14} // Allows for the formatted string with symbols
                      pattern="\(\d{3}\) \d{3}-\d{4}" // Regex pattern for (123) 456-7890 format
                    >
                    </Form.Control>
                  </div>


                  <div className="col-md-1 text-left">
                    <p className="text-secondary">Fax :</p>
                  </div>
                  <div className="col-md-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter fax"

                      {...register("fax")}
                      defaultValue={current_fax}
                      onChange={(e) => setValue('fax', e.target.value)}
                    >
                    </Form.Control>
                  </div>


                  <div className="col-md-1 text-left">
                    <p className="text-secondary">Email:</p>
                  </div>
                  <div className="col-md-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter email"
                      {...register("email")}
                      defaultValue={current_email}
                      onChange={(e) => setValue('email', e.target.value)}
                    >
                    </Form.Control>
                  </div>

                </div>
              </Col>
            </Row>
          </div>
          <div class="modal-footer border-0 justify-content-between pt-0">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-success" onClick={onSubmit}>
              {loading ? 'Saving..' : 'Save'}
            </button>
          </div>
        </div>
      </FormProvider>
    </Modal>
  );
}

export default LitigationClerkPopUp;