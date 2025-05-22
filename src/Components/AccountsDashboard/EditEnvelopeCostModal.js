import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../api/api";

const EditEnvelopeModal = ({ show, onHide, envelopeCost, onUpdate }) => {
  const formik = useFormik({
    initialValues: {
      amount: envelopeCost?.amount || 0,
      appliedAutomatically: envelopeCost?.appliedAutomatically ?? true,
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive"),
      appliedAutomatically: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
      };
      try {
        const response = await api.post(
          `api/cost-envelope/${envelopeCost?.for_case ?? 0}/`,
          payload,
        );
        if (onUpdate && response.data && response.data.updatedEnvelopeCost) {
          onUpdate(response.data.updatedEnvelopeCost);
        }
      } catch (error) {
      } finally {
        onHide();
      }
    },
  });

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header style={{ backgroundColor: 'var(--primary)' }} closeButton>
        <Modal.Title style={{
            color: "white",
            textAlign: "center",
            fontSize: "15px",
            fontWeight: "bold",
            width: "100%",
            margin: "-10px 0px",
          }}>Add/Edit Envelope Cost</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>

        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Edit Envelope Amount:
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="number"
                name="amount"
                {...formik.getFieldProps("amount")}
                isInvalid={formik.touched.amount && formik.errors.amount}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.amount}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalCheck">
            <Col sm={{ span: 9, offset: 3 }}>
              <Form.Check
                label="Apply Automatically"
                name="appliedAutomatically"
                checked={formik.values.appliedAutomatically}
                onChange={formik.handleChange}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="success" type="submit">
            Edit Envelope Cost
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditEnvelopeModal;
