import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import api from "../api/api";

function WitnessDetailsModal({
  show,
  handleClose,
  witnessData,
  setStatusUpdate,
}) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Modal show={show} onHide={handleClose} centered className="modal-600w">
      <Modal.Header className="text-center p-0 bg-primary popup-heading-color justify-content-center">
        <h5 className="mx-auto modal-title font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500">
          {activeTab === 0 ? " Witness Information" : ""}
          {activeTab === 1 ? "    Witness Contact Home" : ""}
          {activeTab === 2 ? "   Witness Contact Work" : ""}
        </h5>
      </Modal.Header>
      {activeTab === 0 && (
        <p className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center">
          Input and edit your Witness's information here.
        </p>
      )}{" "}
      {activeTab === 1 && (
        <p className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center">
          Input and edit your witness’s home contact information here.
        </p>
      )}{" "}
      {activeTab === 2 && (
        <p className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center">
          Input and edit your witness’s work contact information here.
        </p>
      )}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 0 ? (
        <WitnessDetail handleClose={handleClose} witnessData={witnessData} />
      ) : (
        ""
      )}
      {activeTab === 1 ? (
        <WitnessContact
          handleClose={handleClose}
          witnessData={witnessData}
          setStatusUpdate={setStatusUpdate}
        />
      ) : (
        ""
      )}
      {activeTab === 2 ? (
        <WitnessContactWork
          handleClose={handleClose}
          witnessData={witnessData}
        />
      ) : (
        ""
      )}
    </Modal>
  );
}

export default WitnessDetailsModal;

const Tabs = ({ activeTab, setActiveTab }) => {
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <>
      <div className="d-flex justify-content-center w-100 mb-2">
        <div className="d-flex align-items-center justify-content-between p-1 rounded-pill text-muted ">
          <button
            style={{
              boxShadow: activeTab === 0 ? "0px 0px 5px  gray" : "none",
            }}
            className={`btn btn-light mr-2 flex-fill rounded-pill text-sm ${
              activeTab === 0 ? "bg-white" : "bg-transparent"
            }`}
            onClick={() => handleTabClick(0)}
          >
            Witness Information
          </button>

          <button
            style={{
              boxShadow: activeTab === 1 ? "0px 0px 5px  gray" : "none",
            }}
            className={`btn btn-light mr-2 flex-fill rounded-pill text-sm ${
              activeTab === 1 ? "bg-white" : "bg-transparent"
            }`}
            onClick={() => handleTabClick(1)}
          >
            Witness Contact Home
          </button>
          <button
            style={{
              boxShadow: activeTab === 2 ? "0px 0px 5px  gray" : "none",
            }}
            className={`btn btn-light  flex-fill rounded-pill text-sm ${
              activeTab === 2 ? "bg-white" : "bg-transparent"
            }`}
            onClick={() => handleTabClick(2)}
          >
            Witness Contact Work
          </button>
        </div>
      </div>
    </>
  );
};

function WitnessDetail({ handleClose, witnessData }) {
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const initialValues = {
    witness_for: "demo,1",
    age: witnessData?.age || "",
    birthday: formatDate(witnessData?.witness_birthday),
    gender: witnessData?.witness_gender || "",
    rep_letter_date: formatDate(witnessData?.RepLetterSent),
    contact_confirm: formatDate(witnessData?.contact_confirmed_date),
    relationship: witnessData?.relationship ? "true" : "false",
  };

  const [loading, setLoading] = useState(false);

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await api.post(`/api/editWitnessDetails/`, {
          witness_id: witnessData?.id,
          witness_for: values.witness_for,
          age: values.age,
          birthday: values.birthday,
          gender: values.gender,
          rep_letter_date: values.rep_letter_date,
          contact_confirm: values.contact_confirm,
          relationship: values.relationship,
        });
        handleClose();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <div>
      <Modal.Body>
        <Form id="editwitnessdetailForm" onSubmit={handleSubmit}>
          <Form.Group as={Row} className="align-items-center mt-2 mb-3">
            <Form.Label column md={2} className="text-left text-grey">
              For:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                as="select"
                name="witness_for"
                value={values.witness_for}
                onChange={handleChange}
              >
                <option value="Client, 3">Lakeasha Johnson (Client)</option>
                <option value="OtherParty, 13"> (Other Party)</option>
                <option value="OtherParty, 12"> (Other Party)</option>
                <option value="OtherParty, 11">None None (Other Party)</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column md={2} className="text-left text-grey">
              Age:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                placeholder="Enter witness age"
                name="age"
                value={values.age}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column md={2} className="text-left text-grey">
              Birthday:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="date"
                name="birthday"
                value={values.birthday}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column md={2} className="text-left text-grey">
              Gender:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                placeholder="Enter witness gender"
                name="gender"
                value={values.gender}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column md={2} className="text-left text-grey">
              Rep Letter:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="date"
                name="rep_letter_date"
                value={values.rep_letter_date}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column md={2} className="text-left text-grey">
              Contact:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="date"
                name="contact_confirm"
                value={values.contact_confirm}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column md={2} className="text-left text-grey">
              Relationship to Client:
            </Form.Label>
            <Col md={9} className="ml-2">
              <Form.Check
                type="checkbox"
                name="relationship"
                label=""
                checked={values.relationship}
                onChange={(e) =>
                  setFieldValue(
                    "relationship",
                    e.target.checked ? "true" : "false"
                  )
                }
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-between pt-4">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          {loading ? <div className="loader-small mr-2"></div> : "Save"}
        </Button>
      </Modal.Footer>
    </div>
  );
}

function WitnessContact({ handleClose, witnessData, setStatusUpdate }) {
  const initialValues = {
    first_name: witnessData?.witness_first_name,
    last_name: witnessData?.witness_last_name,
    address1: witnessData?.witness_contact_home?.address1,
    address2: witnessData?.witness_contact_home?.address2,
    state: witnessData?.witness_contact_home?.state,
    city: witnessData?.witness_contact_home?.city,
    zip: witnessData?.witness_contact_home?.zip,
    phone: witnessData?.witness_contact_home?.phone_number,
    email: witnessData?.witness_contact_home?.email,
    fax: witnessData?.witness_contact_home?.fax,
  };
  const [loading, setLoading] = useState(false);
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      api
        .post(`/api/editWitnessHomeContact/`, {
          witness_id: witnessData?.id,
          first_name: values.first_name,
          last_name: values.last_name,
          address1: values.address1,
          address2: values.address2,
          state: values.state,
          city: values.city,
          zip: values.zip,
          phone: values.phone,
          email: values.email,
          fax: values.fax,
        })
        .then((response) => {
          handleClose();
          setLoading(false);
          setStatusUpdate(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    },
  });
  return (
    <div>
      <Modal.Body>
        <Form
          id="editWitnessHomeContactForm"
          action="/30/editWitnessHomeContact"
          method="post"
        >
          <Form.Control
            type="hidden"
            name="csrfmiddlewaretoken"
            value="8viOMbv2PBqxXw3SoMvjy3j1Apew4FVaYAmqisWEVXILHTJ6K3N1OWFUPFCcf8ge"
          />
          <Form.Control type="text" name="witness_id" hidden />

          <Form.Group as={Row} className="align-items-center">
            <Form.Label column md={2} className="text-left text-grey">
              First Name:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="first_name"
                placeholder="Enter first name"
                value={values.first_name}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Last Name:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="last_name"
                placeholder="Enter last name"
                value={values.last_name}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Add margin-top to create space */}
          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Address 1:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="address1"
                placeholder="Enter Address 1"
                value={values.address1}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Add margin-top to create space */}
          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Address 2:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="address2"
                placeholder="Enter Address 2"
                value={values.address2}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Add margin-top to create space */}
          <Form.Group as={Row} className="align-items-center mt-3">
            <Col md={5} className="d-flex align-items-center">
              <Form.Label className="text-grey m-r-70">City:</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="Enter City"
                className=""
                value={values.city}
                onChange={handleChange}
              />
            </Col>
            <Col md={4} className="d-flex State-Align-3-New align-items-center">
              <Form.Label className="text-grey mr-1 ">State:</Form.Label>
              <Form.Control
                as="select"
                name="state"
                value={values.state}
                onChange={handleChange}
              >
                <option disabled selected>
                  Select Counsel Type
                </option>
                <option value="CA">California</option>

                <option value="AZ">Arizona</option>

                <option value="TX">Texas</option>

                <option value="MT">Montana</option>

                <option value="NY">New York</option>

                <option value="AL">Alabama</option>

                <option value="AK">Alaska</option>

                <option value="AR">Arkansas</option>

                <option value="CO">Colorado</option>

                <option value="CT">Connecticut</option>

                <option value="DE">Delaware</option>

                <option value="DC">District of Columbia</option>

                <option value="GA">Georgia</option>

                <option value="HI">Hawaii</option>

                <option value="ID">Idaho</option>

                <option value="IL">Illinois</option>

                <option value="IN">Indiana</option>

                <option value="IA">Iowa</option>

                <option value="KS">Kansas</option>

                <option value="KY">Kentucky</option>

                <option value="LA">Louisiana</option>

                <option value="ME">Maine</option>

                <option value="MD">Maryland</option>

                <option value="MA">Massachusetts</option>

                <option value="MI">Michigan</option>

                <option value="MN">Minnesota</option>

                <option value="MS">Mississippi</option>

                <option value="MO">Missouri</option>

                <option value="NE">Nebraska</option>

                <option value="NV">Nevada</option>

                <option value="NH">New Hampshire</option>

                <option value="NJ">New Jersey</option>

                <option value="NM">New Mexico</option>

                <option value="NC">North Carolina</option>

                <option value="ND">North Dakota</option>

                <option value="OH">Ohio</option>

                <option value="OK">Oklahoma</option>

                <option value="OR">Oregon</option>

                <option value="PA">Pennsylvania</option>

                <option value="RI">Rhode Island</option>

                <option value="SC">South Carolina</option>

                <option value="SD">South Dakota</option>

                <option value="TN">Tennessee</option>

                <option value="UT">Utah</option>

                <option value="VT">Vermont</option>

                <option value="VA">Virginia</option>

                <option value="WA">Washington</option>

                <option value="WV">West Virginia</option>

                <option value="WI">Wisconsin</option>

                <option value="WY">Wyoming</option>

                <option value="FL">Florida</option>
              </Form.Control>
            </Col>
            <Col md={3} className="d-flex align-items-center">
              <Form.Label className="text-grey mr-1">ZIP:</Form.Label>
              <Form.Control
                type="text"
                name="zip"
                placeholder="Enter Zip"
                value={values.zip}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Add margin-top to create space */}
          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Phone:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="phone"
                placeholder="(###) ###-####"
                value={values.phone}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Add margin-top to create space */}
          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Fax:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="fax"
                placeholder="(###) ###-####"
                value={values.fax}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Add margin-top to create space */}
          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Email:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="email"
                placeholder="Enter Email"
                value={values.email}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-between pt-4">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          {loading ? (
            <div className="loader-small mr-2"></div>
          ) : (
            " Save Witness Home Contact Information"
          )}
        </Button>
      </Modal.Footer>
    </div>
  );
}

function WitnessContactWork({ handleClose, witnessData }) {
  const initialValues = {
    employer_name: "",
    address1: "",
    address2: "",
    state: "",
    city: "",
    zip: "",
    phone: "",
    email: "",
    fax: "",
  };
  const [loading, setLoading] = useState(false);
  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    // enableReinitialize: true,
    onSubmit: async (values) => {
      const nameParts = values.employer_name.trim().split(" ");
      const firstName =
        nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0];
      const lastName =
        nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

      setLoading(true);
      api
        .post(`/api/editWitnessHomeContact/`, {
          witness_id: witnessData?.id,
          first_name: firstName,
          last_name: lastName,
          address1: values.address1,
          address2: values.address2,
          state: values.state,
          city: values.city,
          zip: values.zip,
          phone: values.phone,
          email: values.email,
          fax: values.fax,
        })
        .then((response) => {
          handleClose();
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    },
  });

  return (
    <div>
      <Modal.Body>
        <Form
          id="editWitnessHomeContactForm"
          action="/30/editWitnessHomeContact"
          method="post"
        >
          <Form.Control
            type="hidden"
            name="csrfmiddlewaretoken"
            value="8viOMbv2PBqxXw3SoMvjy3j1Apew4FVaYAmqisWEVXILHTJ6K3N1OWFUPFCcf8ge"
          />
          <Form.Control type="text" name="witness_id" hidden />

          <Form.Group as={Row} className="align-items-center">
            <Form.Label column md={2} className="text-left text-grey">
              Employer:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="employer_name"
                placeholder="Enter Employer Name"
                value={values.employer_name}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>

          {/* Add margin-top to create space */}
          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Address 1:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="address1"
                placeholder="Enter Address 1"
                value={values.address1}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>

          {/* Add margin-top to create space */}
          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Address 2:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="address2"
                placeholder="Enter Address 2"
                value={values.address2}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>

          {/* Add margin-top to create space */}
          <Form.Group as={Row} className="align-items-center mt-3">
            <Col md={5} className="d-flex align-items-center">
              <Form.Label className="text-grey m-r-70">City:</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="Enter City"
                className=""
                value={values.city}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={4} className="d-flex State-Align-3-New align-items-center">
              <Form.Label className="text-grey mr-1 ">State:</Form.Label>
              <Form.Control
                as="select"
                name="state"
                value={values.state}
                onChange={handleChange}
                required
              >
                <option disabled selected>
                  Select State
                </option>
                <option value="CA">California</option>

                <option value="AZ">Arizona</option>

                <option value="TX">Texas</option>

                <option value="MT">Montana</option>

                <option value="NY">New York</option>

                <option value="AL">Alabama</option>

                <option value="AK">Alaska</option>

                <option value="AR">Arkansas</option>

                <option value="CO">Colorado</option>

                <option value="CT">Connecticut</option>

                <option value="DE">Delaware</option>

                <option value="DC">District of Columbia</option>

                <option value="GA">Georgia</option>

                <option value="HI">Hawaii</option>

                <option value="ID">Idaho</option>

                <option value="IL">Illinois</option>

                <option value="IN">Indiana</option>

                <option value="IA">Iowa</option>

                <option value="KS">Kansas</option>

                <option value="KY">Kentucky</option>

                <option value="LA">Louisiana</option>

                <option value="ME">Maine</option>

                <option value="MD">Maryland</option>

                <option value="MA">Massachusetts</option>

                <option value="MI">Michigan</option>

                <option value="MN">Minnesota</option>

                <option value="MS">Mississippi</option>

                <option value="MO">Missouri</option>

                <option value="NE">Nebraska</option>

                <option value="NV">Nevada</option>

                <option value="NH">New Hampshire</option>

                <option value="NJ">New Jersey</option>

                <option value="NM">New Mexico</option>

                <option value="NC">North Carolina</option>

                <option value="ND">North Dakota</option>

                <option value="OH">Ohio</option>

                <option value="OK">Oklahoma</option>

                <option value="OR">Oregon</option>

                <option value="PA">Pennsylvania</option>

                <option value="RI">Rhode Island</option>

                <option value="SC">South Carolina</option>

                <option value="SD">South Dakota</option>

                <option value="TN">Tennessee</option>

                <option value="UT">Utah</option>

                <option value="VT">Vermont</option>

                <option value="VA">Virginia</option>

                <option value="WA">Washington</option>

                <option value="WV">West Virginia</option>

                <option value="WI">Wisconsin</option>

                <option value="WY">Wyoming</option>

                <option value="FL">Florida</option>
              </Form.Control>
            </Col>
            <Col md={3} className="d-flex align-items-center">
              <Form.Label className="text-grey mr-1">ZIP:</Form.Label>
              <Form.Control
                type="text"
                name="zip"
                placeholder="Enter Zip"
                value={values.zip}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>

          {/* Add margin-top to create space */}
          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Phone:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="phone"
                placeholder="(###) ###-####"
                value={values.phone}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>

          {/* Add margin-top to create space */}
          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Fax:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="fax"
                placeholder="(###) ###-####"
                value={values.fax}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>

          {/* Add margin-top to create space */}
          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Email:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="email"
                placeholder="Enter Email"
                value={values.email}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-between pt-4">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          {loading ? (
            <div className="loader-small mr-2"></div>
          ) : (
            "Save Witness Work Contact Information"
          )}
        </Button>
      </Modal.Footer>
    </div>
  );
}
