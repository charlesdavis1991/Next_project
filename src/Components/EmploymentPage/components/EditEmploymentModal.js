import React, { useEffect } from "react";
import { Modal, Button, Form, Col, Row, Nav, Tab } from "react-bootstrap";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";

function EditEmploymentModal({
  object,
  handleClose,
  onFetchEmployment,
  show,
  activeTab,
  states,
}) {
  // Initialize React Hook Form
  const methods = useForm();
  const { reset, handleSubmit, register, watch, setValue } = methods;

  // Watching fields for value changes
  const employmentPhoneValue = watch("employment_phone");
  const employmentFaxValue = watch("employment_fax");
  const supervisorPhoneValue = watch("supervisor_phone");
  const supervisorFaxValue = watch("supervisor_fax");
  const managerPhoneValue = watch("manager_phone");
  const managerFaxValue = watch("manager_fax");
  const disabilityLienPhoneValue = watch("disability_lien_phone");
  const disabilityLienFaxValue = watch("disability_lien_fax");

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

  const origin = process.env.REACT_APP_BACKEND_URL;

  // Prefill the form with existing data when object is provided
  useEffect(() => {
    if (object) {
      reset({
        employment_id: object?.id || "",
        employer_name: object?.employer_name || "",
        employer_job_title: object?.job_title || "",
        employer_job_description: object?.job_description || "",
        wages_lost: object?.wages_lost || "",
        disability_lost: object?.disability_lost || "",
        disability_claim_number: object?.disability_claim_number || "",
        disability_lien: object?.disability_lien || "",
        disability_final: object?.disability_final || "",
        employment_contact_name: object?.employment_contact?.name || "",
        employment_address1: object?.employment_contact?.address1 || "",
        employment_address2: object?.employment_contact?.address2 || "",
        employment_city: object?.employment_contact?.city || "",
        employment_state: object?.employment_contact?.state || "",
        employment_zip: object?.employment_contact?.zip || "",
        employment_phone: object?.employment_contact?.phone_number || "",
        employment_extension: object?.employment_contact?.phone_ext || "",
        employment_fax: object?.employment_contact?.fax || "",
        employment_email: object?.employment_contact?.email || "",
        supervisor_first_name: object?.supervisor?.first_name || "",
        supervisor_last_name: object?.supervisor?.last_name || "",
        supervisor_address1: object?.supervisor?.address1 || "",
        supervisor_address2: object?.supervisor?.address2 || "",
        supervisor_city: object?.supervisor?.city || "",
        supervisor_state: object?.supervisor?.state || "",
        supervisor_zip: object?.supervisor?.zip || "",
        supervisor_phone: object?.supervisor?.phone_number || "",
        supervisor_extension: object?.supervisor?.phone_ext || "",
        supervisor_fax: object?.supervisor?.fax || "",
        supervisor_email: object?.supervisor?.email || "",
        manager_first_name: object?.manager?.first_name || "",
        manager_last_name: object?.manager?.last_name || "",
        manager_address1: object?.manager?.address1 || "",
        manager_address2: object?.manager?.address2 || "",
        manager_city: object?.manager?.city || "",
        manager_state: object?.manager?.state || "",
        manager_zip: object?.manager?.zip || "",
        manager_phone: object?.manager?.phone_number || "",
        manager_extension: object?.manager?.phone_ext || "",
        manager_fax: object?.manager?.fax || "",
        manager_email: object?.manager?.email || "",
        disability_lien_name: object?.disability_lien_contact?.name || "",
        disability_lien_address1: object?.disability_lien_contact?.address1 || "",
        disability_lien_address2: object?.disability_lien_contact?.address2 || "",
        disability_lien_city: object?.disability_lien_contact?.city || "",
        disability_lien_state: object?.disability_lien_contact?.state || "",
        disability_lien_zip: object?.disability_lien_contact?.zip || "",
        disability_lien_phone: object?.disability_lien_contact?.phone_number || "",
        disability_lien_extension: object?.disability_lien_contact?.phone_ext || "",
        disability_lien_fax: object?.disability_lien_contact?.fax || "",
        disability_lien_email: object?.disability_lien_contact?.email || "",
      });
    }
  }, [object, reset]);

  // Handle form submission and update data
  const onSubmit = async (data) => {
    try {
      await axios.patch(`${origin}/api/employment/update/${data.employment_id}/`, data);
      onFetchEmployment();
      handleClose();
    } catch (error) {
      console.error("Error updating employment:", error);
    }
  };

  // Handle employment deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`${origin}/api/employment/delete/${object.id}/`);
      onFetchEmployment();
      handleClose();
    } catch (error) {
      console.error("Error deleting employment:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered max-800p custom-insurance-dialog"
        id="employment-edit-modal"
      >
        <div style={{ height: "550px" }}>
          <Modal.Header className="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
              id="modal_title"
            >
              Employment
            </Modal.Title>
          </Modal.Header>
          <p className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center">
            Input and edit your Employment's information here.
          </p>
          <Modal.Body>
            <div className="custom-tab custom-margin-top">
              <Tab.Container defaultActiveKey="employment-employer-tab">
                <Nav variant="tabs" className="justify-content-around">
                  <Nav.Link eventKey="employment-employer-tab">Employer</Nav.Link>
                  <Nav.Link eventKey="employment-supervisor-tab">Supervisor</Nav.Link>
                  <Nav.Link eventKey="employment-manager-tab">Manager</Nav.Link>
                  <Nav.Link eventKey="employment-disability_lien-tab">Disability Lien</Nav.Link>
                  <Nav.Link eventKey="employment-information-tab">Employment Info.</Nav.Link>
                </Nav>
                <Form
                  className="d-flex flex-column justify-content-between"
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ height: "434px" }}
                  id="editEmploymentContactForm"
                >
                  <div className="custom-margin-top">
                    <Tab.Content>
                      <Tab.Pane eventKey="employment-employer-tab">
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">Name:</span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Name"
                                  className="form-control"
                                  {...register("employment_contact_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control"
                                  {...register("employment_address1")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control"
                                  {...register("employment_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City:
                                </span>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  placeholder="Enter City"
                                  className="form-control"
                                  {...register("employment_city")}
                                  // {...register("employment_state")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State:
                                </span>
                              </div>
                              <div className="col-md-3">
                              <Form.Control as="select" {...register("employment_state")}>
                                <option value="">Select State</option>
                                {states.map((state) => (
                                  <option key={state.id} value={state.name}>
                                    {state.name}
                                  </option>
                                ))}
                              </Form.Control>
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control"
                                  {...register("employment_zip")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Phone:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("employment_phone")}
                                  value={employmentPhoneValue || ""}
                                  onChange={(e) => handleInputChange(e, "employment_phone")}
                                />
                              </div>
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Extension:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("employment_extension")}
                                />
                              </div>
                            </div>


                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Fax:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("employment_fax")}
                                  value={employmentFaxValue || ""}
                                  onChange={(e) => handleInputChange(e, "employment_fax")}
                                />
                              </div>
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Email:
                                </span>
                              </div>
                              <div className="col-md-4">
                              <input
                                  type="text"
                                  placeholder="Enter Email"
                                  className="form-control"
                                  {...register("employment_email")}
                                />
                              </div>
                            </div>

                          </Col>
                        </Row>
                      </Tab.Pane>

                      <Tab.Pane eventKey="employment-supervisor-tab">
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  First Name:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="Enter First Name"
                                  className="form-control"
                                  {...register("supervisor_first_name")}
                                />
                              </div>

                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Last Name:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="Enter Last Name"
                                  className="form-control"
                                  {...register("supervisor_last_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control"
                                  {...register("supervisor_address1")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control"
                                  {...register("supervisor_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City:
                                </span>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  placeholder="Enter City"
                                  className="form-control"
                                  {...register("supervisor_city")}
                                  // {...register("supervisor_state")}

                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State:
                                </span>
                              </div>
                              <div className="col-md-3">
                              <Form.Control as="select" {...register("supervisor_state")}>
                                <option value="">Select State</option>
                                {states.map((state) => (
                                  <option key={state.id} value={state.name}>
                                    {state.name}
                                  </option>
                                ))}
                              </Form.Control>
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control"
                                  {...register("supervisor_zip")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Phone:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("supervisor_phone")}
                                  value={supervisorPhoneValue || ""}
                                  onChange={(e) => handleInputChange(e, "supervisor_phone")}
                                />
                              </div>
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Extension:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("supervisor_extension")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Fax:
                                </span>
                              </div>
                              <div className="col-md-4">
                              <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("supervisor_fax")}
                                  value={supervisorFaxValue || ""}
                                  onChange={(e) => handleInputChange(e, "supervisor_fax")}
                                />
                              </div>
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Email:
                                </span>
                              </div>
                              <div className="col-md-4">
                              <input
                                  type="text"
                                  placeholder="Enter Email"
                                  className="form-control"
                                  {...register("supervisor_email")}
                                />
                              </div>
                            </div>

                          </Col>
                        </Row>
                      </Tab.Pane>

                      <Tab.Pane eventKey="employment-manager-tab">
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  First Name:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="Enter First Name"
                                  className="form-control"
                                  {...register("manager_first_name")}
                                />
                              </div>

                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Last Name:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="Enter Last Name"
                                  className="form-control"
                                  {...register("manager_last_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control"
                                  {...register("manager_address1")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control"
                                  {...register("manager_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City:
                                </span>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  placeholder="Enter City"
                                  className="form-control"
                                  {...register("manager_city")}
                                  // {...register("manager_state")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State:
                                </span>
                              </div>
                              <div className="col-md-3">
                              <Form.Control as="select" {...register("manager_state")}>
                                <option value="">Select State</option>
                                {states.map((state) => (
                                  <option key={state.id} value={state.name}>
                                    {state.name}
                                  </option>
                                ))}
                              </Form.Control>
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control"
                                  {...register("manager_zip")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Phone:
                                </span>
                              </div>
                              <div className="col-md-4">
                              <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("manager_phone")}
                                  value={managerPhoneValue || ""}
                                  onChange={(e) => handleInputChange(e, "manager_phone")}
                                />
                              </div>
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Extension:
                                </span>
                              </div>
                              <div className="col-md-4">
                              <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("manager_extension")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Fax:
                                </span>
                              </div>
                              <div className="col-md-4">
                              <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("manager_fax")}
                                  value={managerFaxValue || ""}
                                  onChange={(e) => handleInputChange(e, "manager_fax")}
                                />
                              </div>
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Email:
                                </span>
                              </div>
                              <div className="col-md-4">
                              <input
                                  type="text"
                                  placeholder="Enter Email"
                                  className="form-control"
                                  {...register("manager_email")}
                                />
                              </div>
                            </div>

                          </Col>
                        </Row>
                      </Tab.Pane>

                      <Tab.Pane eventKey="employment-disability_lien-tab">
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Name:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Name"
                                  className="form-control"
                                  {...register("disability_lien_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control"
                                  {...register("disability_lien_address1")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control"
                                  {...register("disability_lien_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City:
                                </span>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  placeholder="Enter City"
                                  className="form-control"
                                  {...register("disability_lien_city")}
                                  // {...register("disability_lien_state")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State:
                                </span>
                              </div>
                              <div className="col-md-3">
                              <Form.Control as="select" {...register("disability_lien_state")}>
                                <option value="">Select State</option>
                                {states.map((state) => (
                                  <option key={state.id} value={state.name}>
                                    {state.name}
                                  </option>
                                ))}
                              </Form.Control>
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control"
                                  {...register("disability_lien_zip")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Phone:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("disability_lien_phone")}
                                  value={disabilityLienPhoneValue || ""}
                                  onChange={(e) => handleInputChange(e, "disability_lien_phone")}
                                />
                              </div>
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Extension:
                                </span>
                              </div>
                              <div className="col-md-4">
                              <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("disability_lien_extension")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Fax:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("disability_lien_fax")}
                                  value={disabilityLienFaxValue || ""}
                                  onChange={(e) => handleInputChange(e, "disability_lien_fax")}
                                />
                              </div>
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                Email:
                                </span>
                              </div>
                              <div className="col-md-4">
                              <input
                                  type="text"
                                  placeholder="Enter Email"
                                  className="form-control"
                                  {...register("disability_lien_email")}
                                />
                              </div>
                            </div>

                          </Col>
                        </Row>
                      </Tab.Pane>

                      <Tab.Pane eventKey="employment-information-tab">
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Employer Name:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Employer Name"
                                  className="form-control"
                                  {...register("employer_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Title:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Title"
                                  className="form-control"
                                  {...register("employer_job_title")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Description:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Description"
                                  className="form-control"
                                  {...register("employer_job_description")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Wages Lost:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Wages Lost"
                                  className="form-control"
                                  {...register("wages_lost")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Disability Lost:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="Disability Lost"
                                  className="form-control"
                                  {...register("disability_lost")}
                                />
                              </div>
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Claim Number:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="Claim Number"
                                  className="form-control ph-fax-format"
                                  {...register("disability_claim_number")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom p-1">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Disability Lien:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="Disability Lien"
                                  className="form-control"
                                  {...register("disability_lien")}
                                />
                              </div>
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Disability Final:
                                </span>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="Disability Final"
                                  className="form-control ph-fax-format"
                                  {...register("disability_final")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                  <div className="d-flex justify-content-between custom-margin-top p-2">
                  <Button
                      variant="secondary"
                      onClick={handleClose}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                      Delete
                    </Button>
                    <Button variant="success" type="submit">
                      Save Employment Contact Information
                    </Button>
                  </div>
                </Form>
              </Tab.Container>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </FormProvider>
  );
}

export default EditEmploymentModal;
