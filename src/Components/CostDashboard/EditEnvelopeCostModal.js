import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../api/api";

const EditEnvelopeModal = ({ show, onHide, envelopeCost, onUpdate }) => {
  const formik = useFormik({
    initialValues: {
      amount: parseFloat(envelopeCost?.amount),
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
    <Modal show={show} onHide={onHide} centered>
      <div style={{ width: '500px' }}>
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
            <Form.Group as={Col} style={{position: 'relative'}} className="mb-3">
              <Form.Label>
                Edit Envelope Amount:
              </Form.Label>
              <Form.Control
                type="number"
                name="amount"
                style={{paddingLeft: '24px'}}
                {...formik.getFieldProps("amount")}
                isInvalid={formik.touched.amount && formik.errors.amount}
              />
              <span className="font-monospace" style={{position: 'absolute', top: '36px', left: '28px', fontSize: '15px', color: '#495057'}}>$</span>
              <Form.Control.Feedback type="invalid">
                {formik.errors.amount}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="formHorizontalCheck">
              <Form.Check
                label="Apply Automatically"
                name="appliedAutomatically"
                checked={formik.values.appliedAutomatically}
                onChange={formik.handleChange}
              />
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
      </div >
    </Modal>
  );
};

export default EditEnvelopeModal;
