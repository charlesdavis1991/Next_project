import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import api from "../../api/api";

const WitnessContactHomeModal = ({ show, handleClose, witnessData }) => {
  const initialValues = {
    first_name: "",
    last_name: "",
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
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
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
        })
        .catch((error) => {
          setLoading(false);
        });
    },
  });
  return (
    <Modal show={show} onHide={handleClose} centered className="modal-650w">
      <Modal.Header className="text-center p-0 bg-primary justify-content-center">
        <Modal.Title className="mx-auto font-size-24 height-35 font-weight-semibold text-white text-uppercase font-weight-500">
          Witness Contact Work
        </Modal.Title>
      </Modal.Header>
      <p className="p-l-10 p-r-10 p-t-5 p-b-5 text-center client-popup-border ">
        Input and edit your witness’s work contact information here.
      </p>

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
                placeholder="Enter employer name"
                value={`${values.first_name} ${values.last_name}`}
                onChange={(e) => {
                  const [firstName, lastName] = e.target.value.split(" ");
                  handleChange({
                    target: { name: "first_name", value: firstName },
                  });
                  handleChange({
                    target: { name: "last_name", value: lastName },
                  });
                }}
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
                className="City-Width-OP-2"
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
    </Modal>
  );
};

export default WitnessContactHomeModal;
