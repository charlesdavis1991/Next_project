import React, { useEffect, useState, useContext } from "react";
import { Modal, Form, Tab, Nav, Button, Row, Col, FormControl } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { getCaseId, getClientId, getToken } from "../../Utils/helper";
import api from "../../api/api";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
import axios from "axios";
// RK:08-09-2024 :: 1:40 am
const AddWitnessModal = ({
  show,
  handleClose,
  setStatusUpdate,
  retainedByList,
  setReducer,
  reducerValue,
}) => {
  const { register, handleSubmit, reset , watch , setValue } = useForm();
  const [forEntity, setForEntity] = useState(null);
  const [forRecordId, setForRecordId] = useState(null);
  const [dummy, setDummy] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isClientDataUpdated, setIsClientDataUpdated, isPanelChecklistUpdated, setIsPanelChecklistUpdated } = useContext(ClientDataContext);
  const accessToken = getToken()
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const [statesAbrs, setStatesAbrs] = useState([]); 

  
  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/` , {
        headers: {
          Authorization: accessToken,
        },
      });
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSatesData()
  }, [])
  


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

  const PhoneValue = watch('phone')
  const FaxValue = watch('fax')

  const handlePhoneInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("phone", formattedValue, { shouldValidate: true });
  };

  const handleFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("fax", formattedValue, { shouldValidate: true });
  };


  const stripNumberFormatting = (number) => {
    return number.replace(/[^\d]/g, "");
  };

  const onSubmit = async (data) => {
    const cleanedData = {
      ...data,
      RepLetterSent: data.RepLetterSent ? new Date(data.RepLetterSent).toISOString() : null,
      contact_confirmed_date: data.contact_confirmed_date ? new Date(data.contact_confirmed_date).toISOString() : null,
      witness_birthday: data.witness_birthday ? new Date(data.witness_birthday).toISOString() : null,

      witness_for_entity: forEntity || " ",
      witness_for_record_id: forRecordId || null,
      phone: data?.phone ? stripNumberFormatting(data?.phone) : null,
      fax: data?.fax ? stripNumberFormatting(data?.fax) : null,
      dummy: dummy

    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${origin}/api/witnesses/add_witness/${getClientId()}/${getCaseId()}/`,
        cleanedData,
        {
          headers: {
            'Content-Type': 'application/json',  
            Authorization: accessToken, 
          }
        }
      );
      if (response.status === 200) {
        setIsClientDataUpdated(!isClientDataUpdated);
        setIsPanelChecklistUpdated(!isPanelChecklistUpdated);
        closeModal();
        setReducer(reducerValue)
        setStatusUpdate(true);
      }
    } catch (error) {
      console.log("Error at create witnesses :: ", error);
    } finally {
      setLoading(false);
    }
    
  };

  const closeModal = () => {
    reset();
    handleClose();
  };

  const handleSelectRetainedByChange = (event) => {
    const selectedValue = event.target.value;
    const [Entity, id] = selectedValue.split(",");

    console.log("Full Name:", Entity);
    console.log("ID:", id);

    setForEntity(Entity);
    setForRecordId(id);
  };

  return (
    <Modal show={show} onHide={closeModal} centered className="modal-1000w">
      <div style={{ height: "515px" }}>
        <Modal.Header className="bg-primary-fixed p-0">
          <Modal.Title
            className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
            id="modal_title"
          >
            Add New Witness
          </Modal.Title>
        </Modal.Header>
        <Form id="addDefendantForm" onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body style={{ height: "395px" }}>
            <Tab.Container defaultActiveKey={"Witness"}>
              <Nav variant="tabs" className="justify-content-around">
                <Nav.Link eventKey="Witness">Witness</Nav.Link>
                <Nav.Link eventKey="WitnessDetails">Witness Details</Nav.Link>
                <Nav.Link eventKey="WitnessStatementSummary">
                  Witness Statement Summary
                </Nav.Link>
              </Nav>
              <div className="mt-3">
                <Tab.Content>
                  <Tab.Pane eventKey="Witness">
                    <Col md={12}>
                      <Row className="align-items-center mb-1">
                        <Col md={1}>
                          <p className="text-secondary color-000">
                            <nobr>Dummy:</nobr>
                          </p>  
                          
                        </Col>
                        <Col md={1}>
                          <input
                              type="checkbox"
                              {...register("dummy")}
                              onChange={(e)=> setDummy(e.target.checked)}
                            />
                        </Col>
                      </Row>
                    </Col>
                    <Col md={12}>
                      <Row className="align-items-center mb-1">
                        <Col md={1}>
                          <p className="text-secondary color-000">
                            <nobr>First Name:</nobr>
                          </p>
                        </Col>
                        <Col md={5}>
                          <Form.Control
                            type="text"
                            placeholder="Enter First Name"
                            {...register("first_name")}
                          />
                        </Col>
                        <Col md={1}>
                          <p className="text-secondary color-000">
                            <nobr>Last Name:</nobr>
                          </p>
                        </Col>
                        <Col md={5}>
                          <Form.Control
                            type="text"
                            placeholder="Enter Last Name"
                            {...register("last_name")}
                          />
                        </Col>
                      </Row>
                      <Row className="align-items-center mb-1">
                        <Col md={1}>
                          <p className="text-secondary color-000">
                            <nobr>Address 1:</nobr>
                          </p>
                        </Col>
                        <Col md={5}>
                          <Form.Control
                            type="text"
                            placeholder="Enter Address 1"
                            {...register("address1")}
                          />
                        </Col>
                        <Col md={1}>
                          <p className="text-secondary color-000">
                            <nobr>Address 2:</nobr>
                          </p>
                        </Col>
                        <Col md={5}>
                          <Form.Control
                            type="text"
                            placeholder="Enter Address 2"
                            {...register("address2")}
                          />
                        </Col>
                      </Row>
                      <Row className="align-items-center mb-1">
                        <Col md={1}>
                          <p className="text-secondary color-000">Fax:</p>
                        </Col>
                        <Col md={5}>
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            {...register("fax")}
                            value={FaxValue || ""}
                            onChange={handleFaxInputChange}
                          />
                        </Col>
                        <Col md={1}>
                          <p className="text-secondary color-000">City:</p>
                        </Col>
                        <Col md={5}>
                          <Form.Control
                            type="text"
                            placeholder="Enter City"
                            {...register("city")}
                          />
                        </Col>
                      </Row>
                      <Row className="align-items-center mb-1">
                        <Col md={1}>
                          <p className="text-secondary color-000">Email:</p>
                        </Col>
                        <Col md={5}>
                          <Form.Control
                            type="email"
                            placeholder="Enter Email"
                            {...register("email")}
                          />
                        </Col>
                        <Col md={1}>
                          <p className="text-secondary color-000">State:</p>
                        </Col>
                        <Col md={5}>
                          <Form.Select
                            {...register("state")}
                            className={"custom-margin-bottom"}
                          >
                            <option value="" disabled selected>
                              Select State
                            </option>
                            {statesAbrs?.map((state) => (
                              <option
                                key={state.StateAbr}
                                value={state.StateAbr}
                              >
                                {state.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="align-items-center mb-1">
                        <Col md={1}>
                          <p className="text-secondary color-000">Phone:</p>
                        </Col>
                        <Col md={2}>
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            {...register("phone")}
                            value={PhoneValue || ""}
                            onChange={handlePhoneInputChange}
                          />
                        </Col>
                        <Col md={1}>
                          <p className="text-secondary color-000">Ext:</p>
                        </Col>
                        <Col md={2}>
                          <Form.Control
                            type="number"
                            placeholder="Extension"
                            {...register("extension")}
                          />
                        </Col>
                        <Col md={1}>
                          <p className="text-secondary color-000">ZIP:</p>
                        </Col>
                        <Col md={5}>
                          <Form.Control
                            type="text"
                            placeholder="Enter ZIP"
                            {...register("zip")}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Tab.Pane>
                  <Tab.Pane eventKey="WitnessDetails">
                  <Col md={12} className="p-0">
                      <Row className="mx-0 mb-1">
                        <Col md={2} className="text-left">
                          <span className="d-inline-block text-secondary">For:</span>
                        </Col>
                        <Col md={10}>
                          <Form.Select onChange={handleSelectRetainedByChange}>
                            <option value=" ">-----------</option>
                            {retainedByList &&
                              retainedByList.clients.map((client) => (
                                <option
                                  key={`Client, ${client.id}`}
                                  value={`Client, ${client.id}`}
                                  selected={forEntity === "Client" && forRecordId === client.id}
                                >
                                  {client.first_name} {client.last_name} (Client)
                                </option>
                              ))}
                            {retainedByList &&
                              retainedByList.defendants.map((defendant) => (
                                <option
                                  key={`Defendant, ${defendant.id}`}
                                  value={`Defendant, ${defendant.id}`}
                                  selected={forEntity === "Defendant" && forRecordId === defendant.id}
                                >
                                  {defendant.first_name} {defendant.last_name} (Defendant)
                                </option>
                              ))}
                            {retainedByList &&
                              retainedByList.otherParties.map((otherParty) => (
                                <option
                                  key={`OtherParty, ${otherParty.id}`}
                                  value={`OtherParty, ${otherParty.id}`}
                                  selected={
                                    forEntity === "OtherParty" && forRecordId === otherParty.id
                                  }
                                >
                                  {otherParty.party_first_name} {otherParty.party_last_name} (Other Party)
                                </option>
                              ))}
                          </Form.Select>
                        </Col>
                      </Row>

                      <Row className="mx-0 mb-1">
                        <Col md={2} className="text-left">
                          <span className="d-inline-block text-secondary">DOB:</span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="date"
                            placeholder=""
                            {...register("witness_birthday")}
                          />
                        </Col>
                      </Row>

                      <Row className="mx-0 mb-1">
                        <Col md={2} className="text-left">
                          <span className="d-inline-block text-secondary">Gender:</span>
                        </Col>
                        <Col md={10}>
                          <Form.Select {...register("witness_gender")}>
                            <option value="">-----</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </Form.Select>
                        </Col>
                      </Row>

                      <Row className="mx-0 mb-1">
                        <Col md={2} className="text-left">
                          <span className="d-inline-block text-secondary">Rep Letter:</span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="date"
                            placeholder=""
                            {...register("RepLetterSent")}
                          />
                        </Col>
                      </Row>

                      <Row className="mx-0 mb-1">
                        <Col md={2} className="text-left">
                          <span className="d-inline-block text-secondary">Contact:</span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="date"
                            placeholder=""
                            {...register("contact_confirmed_date")}
                          />
                        </Col>
                      </Row>
                    </Col>

                  </Tab.Pane>

                  <Tab.Pane eventKey="WitnessStatementSummary">
                    <Col md={12}>
                      <p className="text-secondary color-000">
                        <nobr>Summary:</nobr>
                      </p>

                      <textarea
                        style={{ height: "240px", resize: "none" }}
                        className="form-control"
                        placeholder="Enter Summary"
                        {...register("statement_summary")}
                      />
                    </Col>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? <div className="loader-small mr-2"></div> : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </div>
    </Modal>
  );
};

export default AddWitnessModal;
