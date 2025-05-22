import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import { getCaseId, getClientId } from "../../Utils/helper";
import api from "../../api/api";

const initialValues = {
  file_number: "",
  counsel_type_id: "1",
  firm_name: "",
  firm_website: "",
  firm_phone: "",
  firm_fax: "",
  firm_email: "",
  firm_extension: "",
  firm_address1: "",
  firm_address2: "",
  firm_city: "",
  firm_state: "CA",
  firm_zip: "",
  counsel_first_name: "",
  counsel_last_name: "",
  counsel_phone: "",
  counsel_fax: "",
  counsel_email: "",
  counsel_extension: "",
  counsel_address1: "",
  counsel_address2: "",
  counsel_city: "",
  counsel_state: "CA",
  counsel_zip: ""
};

const prepareData = (values) => {
  const data = { ...values };
  Object.keys(data).forEach((key) => {
    if (data[key] === "") {
      data[key] = null;
    }
  });
  return data;
};

const AddInsuranceModal = ({ show, handleClose, witnessData }) => {
  console.log({ witnessData });
  const [loading, setLoading] = useState(false);
  const { values, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues: initialValues,

    onSubmit: async (values) => {
      setLoading(true);
      const preparedData = prepareData(values);
      api
        .post(`/api/addWitnessCounsel/${getClientId()}/${getCaseId()}/`, {
          witness_id: witnessData?.id,
          ...preparedData
        })
        .then((response) => {
          closeModal();
          resetForm();
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  });
  const closeModal = () => {
    resetForm();
    handleClose();
  };
  return (
    <Modal show={show} onHide={closeModal} centered className="modal-1000w">
      <Modal.Header closeButton>
        <h5 className="mx-auto">Add Witness Counsel</h5>
      </Modal.Header>
      <Modal.Body>
        <Form id="addDefendantForm" onSubmit={handleSubmit}>
          <Row className="align-items-center mb-2">
            <Col md={3}>
              <p className="text-secondary color-000">
                <nobr>Cousnel For Witness :</nobr>
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
            <Col md={6}>
              <Form.Control
                type="number"
                placeholder="Enter file #"
                name="file_number"
                value={values.file_number}
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Control
                as="select"
                name="counsel_type_id"
                value={values.counsel_type_id}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Counsel Type
                </option>
                <option value="1">Type 1</option>
                <option value="2">Type 2</option>
              </Form.Control>
            </Col>
          </Row>
          <h5 style={{ paddingBottom: "2px" }}>Firm Information</h5>
          <Row className="align-items-center mb-2 ">
            <Col md={12}>
              <Form.Control
                type="text"
                placeholder="Enter counsel name or firm name to add from library "
                name="website"
                value={values.website}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="align-items-center mb-2">
            <Col md={4}>
              <Form.Control
                type="text"
                name="firm_name"
                placeholder="Enter name"
                value={values.firm_name}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                name="firm_website"
                placeholder="Enter website"
                value={values.firm_website}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                name="firm_phone"
                placeholder="Enter phone"
                value={values.firm_phone}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="align-items-center mb-2">
            <Col md={4}>
              <Form.Control
                type="text"
                name="firm_fax"
                placeholder="Enter fax"
                value={values.firm_fax}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Control
                type="text"
                name="firm_email"
                placeholder="Enter email"
                value={values.firm_email}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                name="firm_extension"
                placeholder="Enter extension"
                value={values.firm_extension}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <hr />
          <Row className="align-items-center mb-2">
            <Col md={6}>
              <Form.Control
                type="text"
                name="firm_address1"
                placeholder="Enter address 1"
                value={values.firm_address1}
                onChange={handleChange}
              />
            </Col>

            <Col md={6}>
              <Form.Control
                type="text"
                name="firm_address2"
                placeholder="Enter address 2"
                value={values.firm_address2}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="align-items-center ">
            <Col md={4}>
              <Form.Control
                type="text"
                name="firm_city"
                placeholder="Enter city"
                value={values.firm_city}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Control
                as="select"
                name="firm_state"
                value={values.firm_state}
                onChange={handleChange}
              >
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
                name="firm_zip"
                placeholder="Enter firm zip"
                value={values.firm_zip}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <hr />

          <h5 style={{ paddingBottom: "2px", marginTop: "-10px" }}>
            Counsel Information
          </h5>
          <Row className="align-items-center mb-2">
            <Col md={12}>
              <Form.Control
                type="text"
                name="insurance_entity"
                placeholder="Enter counsel name to add from library "
                value={values.insurance_entity}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="align-items-center mb-2">
            <Col md={4}>
              <Form.Control
                type="text"
                name="counsel_first_name"
                placeholder="Enter first name"
                value={values.counsel_first_name}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                name="counsel_last_name"
                placeholder="Enter last name"
                value={values.counsel_last_name}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                name="counsel_phone"
                placeholder="Enter phone"
                value={values.counsel_phone}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="align-items-center mb-2">
            <Col md={4}>
              <Form.Control
                type="text"
                name="counsel_fax"
                placeholder="Enter fax"
                value={values.counsel_fax}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                name="counsel_email"
                placeholder="Enter email"
                value={values.counsel_email}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                name="counsel_extension"
                placeholder="Enter extension"
                value={values.counsel_extension}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="align-items-center mb-2">
            <Col md={6}>
              <Form.Control
                type="text"
                name="counsel_address1"
                placeholder="Enter address 1"
                value={values.counsel_address1}
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Control
                type="text"
                name="counsel_address2"
                placeholder="Enter address 2"
                value={values.counsel_address2}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="align-items-center mb-2">
            <Col md={4}>
              <Form.Control
                type="text"
                name="counsel_city"
                placeholder="Enter city"
                value={values.counsel_city}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                as="select"
                name="counsel_state"
                value={values.counsel_state}
                onChange={handleChange}
              >
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
                name="counsel_zip"
                placeholder="Enter zip"
                value={values.counsel_zip}
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
