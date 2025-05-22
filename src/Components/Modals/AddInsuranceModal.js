import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import { getCaseId, getClientId } from "../../Utils/helper";
import api from "../../api/api";

const AddInsuranceModal = ({ show, handleClose, witnessData }) => {
  const [loading, setLoading] = useState(false);
  const initialValues = {
    policy_number: "",
    claim_number: "",
    insurance_type_id: "",
    coverage_type: "2",
    company_name: "",
    website: "",
    phone_number: "",
    fax: "",
    email: "",
    extension: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "CA",
    zip: "",
    adjuster_fname: "",
    adjuster_lname: "",
    adjuster_name: ""
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    touched,
    errors,
    resetForm
  } = useFormik({
    initialValues,
    // validate,
    onSubmit: async (values) => {
      setLoading(true);
      api
        .post(`/api/addWitnessInsurance/${getClientId()}/${getCaseId()}/`, {
          witness: witnessData?.id,
          insurance_type_id: values.coverage_type,
          policy_number: values.policy_number,
          coverage_type: values.coverage_type,
          claim_number: values.claim_number,
          company_name: values.company_name,
          website: values.website,
          phone_number: values.phone_number,
          fax: values.fax,
          email: values.email,
          extension: values.extension,
          address_1: values.address_1,
          address_2: values.address_2,
          city: values.city,
          state: values.state,
          zip: values.zip,
          adjuster_name: values.adjuster_name,
          adjuster_fname: values.adjuster_fname,
          adjuster_lname: values.adjuster_lname
        })
        .then((response) => {
          closeModal();
          setLoading(false);
          resetForm();
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  });

  const handlePhoneNumberChange = (event) => {
    const formattedPhoneNumber = formatPhoneNumber(event.target.value);
    setFieldValue("phone_number", formattedPhoneNumber);
  };

  const handleInsuranceEntityChange = (event) => {
    const newValue = event.target.value;
    const newValueWithId = `${newValue},5`;
    setFieldValue("insurance_entity", newValueWithId);
  };
  const closeModal = () => {
    resetForm();
    handleClose();
  };
  return (
    <Modal show={show} onHide={closeModal} centered className="modal-1000w">
      <Modal.Header closeButton>
        <h5 className="mx-auto">Add Witness Insurance Coverage</h5>
      </Modal.Header>
      <Modal.Body>
        <Form id="addDefendantForm" onSubmit={handleSubmit}>
          <Row className="align-items-center mb-2">
            <Col md={3}>
              <p className="text-secondary color-000">
                <nobr>Insurance for Witness :</nobr>
              </p>
            </Col>
            <Col md={9}>
              <Form.Control as="select" name="counsel_state">
                <option value="policy3">
                  {witnessData?.witness_first_name}{" "}
                  {witnessData?.witness_last_name}
                </option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="align-items-center mb-2">
            <Col md={4}>
              <Form.Control
                type="number"
                placeholder="Enter Policy #"
                name="policy_number"
                value={values.policy_number}
                onChange={handleChange}
                style={{ backgroundColor: "transparent" }}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="number"
                placeholder="Enter Claim #"
                name="claim_number"
                value={values.claim_number}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                as="select"
                name="coverage_type"
                value={values.coverage_type}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Coverage Type
                </option>
                <option value="2">Car Insurance</option>
                <option value="3">House Insurance</option>
              </Form.Control>
              {touched.coverage_type && errors.coverage_type ? (
                <div className="invalid-feedback">{errors.coverage_type}</div>
              ) : null}
            </Col>
          </Row>

          <Row className="align-items-center mb-2">
            <Col md={12}>
              <Form.Control
                type="text"
                placeholder="Type Insurance Company Name to add from library"
                name="InsuranceCompanyName"
                onChange={handleChange}
              />
            </Col>
          </Row>

          <hr />
          <Row className="align-items-center mb-2">
            <Col md={4}>
              <Form.Control
                type="text"
                name="company_name"
                placeholder="Enter company name"
                value={values.company_name}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                name="website"
                placeholder="Enter website"
                value={values.website}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                name="phone_number"
                placeholder="Enter phone number"
                value={values.phone_number}
                onChange={handlePhoneNumberChange}
              />
            </Col>
          </Row>

          <Row className="align-items-center mb-2">
            <Col md={4}>
              <Form.Control
                type="text"
                name="fax"
                placeholder="Enter fax"
                value={values.fax}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Control
                type="text"
                name="email"
                placeholder="Enter email"
                value={values.email}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                name="extension"
                placeholder="Enter extension"
                value={values.extension}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <hr />
          <Row className="align-items-center mb-2">
            <Col md={6}>
              <Form.Control
                type="text"
                name="address_1"
                placeholder="Enter address 1"
                value={values.address_1}
                onChange={handleChange}
              />
            </Col>

            <Col md={6}>
              <Form.Control
                type="text"
                name="address_2"
                placeholder="Enter address 2"
                value={values.address_2}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="align-items-center mb-2">
            <Col md={4}>
              <Form.Control
                type="text"
                name="city"
                placeholder="Enter City"
                value={values.city}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Control
                as="select"
                name="state"
                value={values.state}
                onChange={handleChange}
              >
                <option value="" disabled>
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
            <Col md={4}>
              <Form.Control
                type="number"
                name="zip"
                placeholder="Enter Zip"
                value={values.zip}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <hr />
          <Row className="align-items-center mb-2">
            <Col md={12}>
              <Form.Control
                type="text"
                name="adjuster_name"
                placeholder="Type adjuster Name to add from library"
                value={values.adjuster_name}
                onChange={(event) => {
                  handleChange(event);
                  handleInsuranceEntityChange(event);
                }}
              />
            </Col>
          </Row>

          <Row className="align-items-center mb-2">
            <Col md={6}>
              <Form.Control
                type="text"
                name="adjuster_fname"
                placeholder="Enter adjuster first name"
                value={values.adjuster_fname}
                onChange={handleChange}
              />
            </Col>

            <Col md={6}>
              <Form.Control
                type="text"
                name="adjuster_lname"
                placeholder="Enter adjuster last name"
                value={values.adjuster_lname}
                onChange={handleChange}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          {loading ? <div className="loader-small mr-2"></div> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddInsuranceModal;
