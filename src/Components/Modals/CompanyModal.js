import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import api from "../../api/api";

const CompanyModal = ({ show, handleClose, witnessData, setStatusUpdate }) => {
  const initialValues = {
    coverage_type: witnessData?.coverage_type,
    company: witnessData?.company,
    address1: witnessData?.witness_contact_home?.address1,
    address2: witnessData?.witness_contact_home?.address2,
    state: witnessData?.witness_contact_home?.state,
    city: witnessData?.witness_contact_home?.city,
    zip: witnessData?.witness_contact_home?.zip,
    phone: witnessData?.witness_contact_home?.phone_number,
    email: witnessData?.witness_contact_home?.email,
    fax: witnessData?.witness_contact_home?.fax,
    website_url: witnessData?.website_url,
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
          coverage_type: values.coverage_type,
          company: values.company,
          address1: values.address1,
          address2: values.address2,
          state: values.state,
          city: values.city,
          zip: values.zip,
          phone: values.phone,
          email: values.email,
          fax: values.fax,
          website_url: values.website_url,
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
    <Modal show={show} onHide={handleClose} centered className="modal-650w">
      <Modal.Header className="text-center p-0 bg-primary justify-content-center">
        <Modal.Title className="mx-auto font-size-24 height-35 font-weight-semibold text-white text-uppercase font-weight-500">
          COMPANY
        </Modal.Title>
      </Modal.Header>
      <p className="p-l-10 p-r-10 p-t-5 p-b-5 text-center client-popup-border ">
        Input and edit the information about the insurance company here.
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
          <Col md={12}>
            <Form.Control
              type="text"
              name="coverage_type"
              placeholder="Type insurance company name to search directory then click an entry"
              value={values.coverage_type}
              onChange={handleChange}
              required
            />
          </Col>
          <Form.Group as={Row} className="align-items-center">
            <Form.Label column md={2} className="text-left text-grey">
              Coverage Type:
            </Form.Label>
            <Col md={10}>
              <Form.Control as="select" name="counsel_state">
                <option value="policy3">
                  {witnessData?.witness_first_name}
                  {witnessData?.witness_last_name}
                </option>
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Company:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="company"
                placeholder="Enter company"
                value={values.company}
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
          <Form.Group as={Row} className="align-items-center mt-3">
            <Form.Label column md={2} className="text-left text-grey">
              Website URL:
            </Form.Label>
            <Col md={10}>
              <Form.Control
                type="text"
                name="website_url"
                placeholder="www.insurancecompany.com"
                value={values.website_url}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-between pt-4">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            style={{ marginLeft: "3px", background: "red" }}
          >
            Delete defendant
          </Button>
        </div>
        <Button variant="success" onClick={handleSubmit}>
          {loading ? (
            <div className="loader-small mr-2"></div>
          ) : (
            " Save Witness Home Contact Information"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompanyModal;
