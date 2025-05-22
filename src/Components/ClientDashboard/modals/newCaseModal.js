import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Nav, Form, Col, Row, Tab } from "react-bootstrap";
import api from "../../../api/api";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { useSelector } from "react-redux";
import axios from 'axios';

const AddClientModalBody = ({ handleClose, show }) => {

  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCase = getCaseId();
  const client = getClientId();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);


  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const [caseTypes, setCaseTypes] = useState([]); //state abrs
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchSatesData();
    fetchCaseTypesData();
  }, [origin]);


  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${origin}/api/client-page/add_client/${client}/${currentCase}`, data, {
        headers: {
          Authorization: token,
        },
      })
      reset()
      setLoading(false);
      handleClose()
    }
    catch (error) {
      console.error(error)

    }


  };

  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCaseTypesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/general/case_types/`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        setCaseTypes(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="modal-dialog-centered INS-max-width-1000px custom-insurance-dialog"
    >
      <div class="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
        <h5
          class="modal-title mx-auto font-size-24 height-40 font-weight-semibold popup-heading-color font-weight-500"
          id="avatarModalTitle"
        >
          ADD A NEW CLIENT
        </h5>
      </div>
      <p
        className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center"
        id=""
      >
        Input your new client's information here.
      </p>
      <Modal.Body className="panel-popups-body">
        <Form id="add_clientform" onSubmit={handleSubmit(onSubmit)}>
          <Row>
          </Row>
          <Row>
            <Col className="col-md-2 p-r-0 mb-2" md={2}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter First Name"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}
                {...register("first_name")}
              />
            </Col>
            <Col className="col-md-2 p-r-0 mb-2" md={2}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter Last Name"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}
                {...register("last_name")}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={1}>
              <Form.Control
                type="date"
                style={{ fontSize: '12px' }}
                onKeyUp={(event) => { }}
                {...register("incident_date")}
                className={`form-control height-25 p-1 `}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={1}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter Phone"
                {...register("phone")}
                className={`form-control height-25 p-1 `}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={2}>
              <Form.Control
                type="email"
                onKeyUp={(event) => { }}
                placeholder="Enter Email"
                style={{ fontSize: '12px' }}
                {...register("email")}
                className={`form-control height-25 p-1`}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={2}>
              <Form.Select
                {...register("case_type")}
                className={`form-control height-25 p-1`}
                style={{ fontSize: '12px' }}
                required
              >
                {" "}
                <option key="" value="">
                  Case Type
                </option>
                {caseTypes?.map((counsel) => (
                  <option key={counsel.id} value={counsel.id}>
                    {counsel.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col className="col-md-1 p-r-1 mb-2" md={2}>
              <Form.Control
                type="date"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                {...register("dob")}
                className={`form-control height-25 p-1`}
              />
            </Col>
          </Row>
          <Row>
            <Col className="col-md-2 p-r-0 mb-2" md={2}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter Address 1"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}
                {...register("address1")}
              />
            </Col>
            <Col className="col-md-2 p-r-0 mb-2" md={2}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter Address 2"
                className={`form-control height-25 p-1`}
                {...register("address2")}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={1}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter City"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}
                {...register("city")}
              />
            </Col>
            <Col className="col-md-2 p-r-0 mb-1" md={2}>
              <Form.Select
                {...register("state")}
                className={`form-control height-25 p-1`}
                style={{ fontSize: '12px' }}
              >
                {" "}
                <option key="" value="">
                  Select State
                </option>
                {statesAbrs?.map((state) => (
                  <option key={state.StateAbr} value={state.StateAbr}>
                    {state.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={1}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter Zip"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}
                {...register("post_code")}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={2}>
              <Form.Control
                type="text"
                placeholder="Enter Plaintiff insurance Company"
                style={{ fontSize: '12px' }}
                onKeyUp={(event) => { }}
                {...register("plaintiff_insurance")}
                className={`form-control height-25 p-1 `}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={1}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter Policy #"
                style={{ fontSize: '12px' }}
                {...register("policy")}
                className={`form-control height-25 p-1 `}
              />
            </Col>
            <Col className="col-md-1 p-r-1 mb-2" md={1}>
              <Form.Control
                type="email"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter Claim #"
                {...register("claim")}
                className={`form-control height-25 p-1`}
              />
            </Col>

          </Row>
          <Row>
            <Col className="col-md-2 p-r-0 mb-2" md={2}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter Defendant First Name"
                className={`form-control height-25 p-1`}
                {...register("defendant_first_name")}
              />
            </Col>
            <Col className="col-md-2 p-r-0 mb-2" md={2}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter Defendant Last Name"
                className={`form-control height-25 p-1`}
                {...register("defendant_last_name")}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={2}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter Address 1"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}
                {...register("defendant_address1")}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={2}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter Address 2"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}
                {...register("defendant_address2")}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={1}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter City"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}
                {...register("defendant_city")}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={1}>
              <Form.Select
                {...register("defendant_state")}
                className={`form-control height-25 p-1`}
                style={{ fontSize: '12px' }}
              >
                {" "}
                <option key="" value="">
                  Select State
                </option>
                {statesAbrs?.map((state) => (
                  <option key={state.StateAbr} value={state.StateAbr}>
                    {state.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={1}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter Zip"
                style={{ fontSize: '12px' }}
                {...register("defendant_post_code")}
                className={`form-control height-25 p-1 `}
              />
            </Col>
            <Col className="col-md-1 p-r-1 mb-2" md={1}>
              <Form.Control
                type="email"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter Defendant #"

                className={`form-control height-25 p-1`}
              />
            </Col>

          </Row>
          <Row>
            <Col className="col-md-2 p-r-0 mb-3" md={3}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter Defendant Insurance Company"
                className={`form-control height-25 p-1`}
                {...register("defendant_insurance")}
              />
            </Col>
            <Col className="col-md-2 p-r-0 mb-2" md={2}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter Policy #"
                className={`form-control height-25 p-1`}
                {...register("defendant_policy")}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={2}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter Claim #"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}
                {...register("defendant_claim")}
              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={2}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter Incident Report #"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}
                {...register("defendant_incident_report")}
              />
            </Col>
            <Col className="col-md-1 p-r-1 mb-3" md={3}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter Incident Reporting Agency #"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}
                {...register("defendant_reporting_agency")}
              />
            </Col>
          </Row>
          <Row>
            <Col className="col-md-2 p-r-0 mb-3" md={3}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter How Did You Hear About Us?"
                className={`form-control height-25 p-1`}

              />
            </Col>
            <Col className="col-md-2 p-r-0 mb-2" md={2}>
              <Form.Select

                className={`form-control height-25 p-1`}
                style={{ fontSize: '12px' }}
              >
                {" "}
                <option key="" value="">
                  Case Type
                </option>
                {caseTypes?.map((casetype) => {
                  return <option key={casetype.StateAbr} value={casetype.StateAbr}>
                    {casetype.name}
                  </option>
                })}
              </Form.Select>
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={2}>
              <Form.Control
                type="time"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}

              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-2" md={2}>
              <Form.Control
                type="date"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}

              />
            </Col>
            <Col className="col-md-1 p-r-1 mb-3" md={3}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter Source Name"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}

              />
            </Col>
          </Row>
          <Row>
            <Col className="col-md-2 p-r-0 mb-3" md={3}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter Ad location"
                className={`form-control height-25 p-1`}

              />
            </Col>
            <Col className="col-md-2 p-r-0 mb-3" md={3}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter Ad location Address 1"
                className={`form-control height-25 p-1`}

              />
            </Col>
            <Col className="col-md-2 p-r-0 mb-3" md={3}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter Ad location Address 2"
                className={`form-control height-25 p-1`}

              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-1" md={1}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                style={{ fontSize: '12px' }}
                placeholder="Enter City"
                className={`form-control height-25 p-1`}

              />
            </Col>
            <Col className="col-md-1 p-r-0 mb-1" md={1}>
              <Form.Select

                className={`form-control height-25 p-1`}
                style={{ fontSize: '12px' }}

              >
                {" "}
                <option key="" value="">
                  Select State
                </option>
                {statesAbrs?.map((state) => (
                  <option key={state.StateAbr} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col className="col-md-1 p-r-1 mb-1" md={1}>
              <Form.Control
                type="text"
                onKeyUp={(event) => { }}
                placeholder="Enter ZIP"
                style={{ fontSize: '12px' }}
                className={`form-control height-25 p-1`}

              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          className="INS-float-margin;"
        >
          Cancel
        </Button>
        <Button variant="success" type="submit" form="add_clientform">

          {loading ? 'Saving New Client Information..' : 'Save New Client Information'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddClientModalBody;
