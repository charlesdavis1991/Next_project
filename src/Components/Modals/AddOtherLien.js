import React,{useEffect} from 'react'
import { Modal, Button, Form, Row, Col  } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";
import updatePanelApi from '../SettlementDashboard/api/updatePanelApi';
import { getCaseId,getClientId } from '../../Utils/helper';

const AddOtherLien = ({show,handleClose}) => {
    const formik = useFormik({
        initialValues: {
            name: "",
            final: 0.00,
            original: 0.00,
            reduction: 0.00,
            note:""
        },
        validationSchema: Yup.object({
            name: Yup.string(),
            note: Yup.string().nullable(),
            final: Yup.number()
                .required("Final is required")
                .min(0, "Final must be positive"),
            original: Yup.number()
                .required("Original is required")
                .min(0, "Original must be positive"),
            reduction: Yup.number()
                .required("Reduction is required")
                .min(0, "Reduction must be positive"),
        }),
        onSubmit: async (values) => {
            // Convert all values to strings
        const transformedValues = Object.fromEntries(
            Object.entries(values).map(([key, value]) => [key, value.toString()])
        );

        const payload = {
            case_id: getCaseId(),
            client_id:getClientId(),
            ...transformedValues,
        };
        const res = await updatePanelApi(payload,"other-lien/create");
        console.log(res);
        handleClose();
        },
    });
    useEffect(() => {
        if (!show) {
            $('.modal').hide();
        }
    }, [show]);
    return (
        <>
            <Modal
            show={show}
            onHide={handleClose}
            centered
            size="lg"
            dialogClassName="medical-bill-dialog justify-content-center "
            >
            <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Add Other Lien</div></div>
            <Modal.Body style={{padding:"5px"}}>
            <Form onSubmit={formik.handleSubmit}>

                <Form.Group as={Row} className="m-b-5">
                    <Form.Label column sm={2} className='p-t-0 p-b-0'>
                    Name
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            name="name"
                            className='height-25 rounded-0'
                            {...formik.getFieldProps("name")}
                            isInvalid={formik.touched.name && formik.errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.name}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-b-5 m-t-5">
                    <Form.Label column sm={2} className='p-t-0 p-b-0'>
                    Original:
                    </Form.Label>
                    <Col sm={10} className="p-l-15">
                    <Form.Control
                        type="text"
                        name="original"
                        className="monospace-font height-25 rounded-0"
                        value={formik.values.original ? `$ ${formik.values.original}` : "$ "}
                        onFocus={(e) => {
                            formik.setFieldValue("original", ""); // Clear only the numeric value on click
                        }}
                        onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and '.'

                            // Ensure only one decimal point
                            if ((value.match(/\./g) || []).length > 1) {
                                value = value.substring(0, value.lastIndexOf("."));
                            }

                            // Restrict to 2 decimal places
                            if (value.includes(".")) {
                                let parts = value.split(".");
                                if (parts[1].length > 2) {
                                    parts[1] = parts[1].substring(0, 2);
                                }
                                value = parts.join(".");
                            }

                            formik.setFieldValue("original", value); // Update Formik state
                        }}
                        onBlur={(e) => {
                            if (!formik.values.original) {
                                formik.setFieldValue("original", "0.00"); // Keep "$ " in place if empty
                            }
                        }}
                        isInvalid={formik.touched.original && !!formik.errors.original}
                    />
                        <Form.Control.Feedback type="invalid">{formik.errors.original}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-b-5">
                    <Form.Label column sm={2} className='p-t-0 p-b-0'>
                    Reduction:
                    </Form.Label>
                    <Col sm={10} className="p-l-15">
                    <Form.Control
                        type="text"
                        name="reduction"
                        className="monospace-font height-25 rounded-0"
                        value={formik.values.reduction ? `$ ${formik.values.reduction}` : "$ "}
                        onFocus={() => {
                            formik.setFieldValue("reduction", ""); // Clear only the numeric value on click
                        }}
                        onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and '.'

                            // Ensure only one decimal point
                            if ((value.match(/\./g) || []).length > 1) {
                                value = value.substring(0, value.lastIndexOf("."));
                            }

                            // Restrict to 2 decimal places
                            if (value.includes(".")) {
                                let parts = value.split(".");
                                if (parts[1].length > 2) {
                                    parts[1] = parts[1].substring(0, 2);
                                }
                                value = parts.join(".");
                            }

                            formik.setFieldValue("reduction", value); // Update Formik state
                        }}
                        onBlur={() => {
                            if (!formik.values.reduction) {
                                formik.setFieldValue("reduction", "0.00"); // Keep "$ " in place if empty
                            }
                        }}
                        isInvalid={formik.touched.reduction && !!formik.errors.reduction}
                    />
                        <Form.Control.Feedback type="invalid">{formik.errors.reduction}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-b-5">
                    <Form.Label column sm={2} className='p-t-0 p-b-0'>
                    Final:
                    </Form.Label>
                    <Col sm={10} className="p-l-15">
                    <Form.Control
                        type="text"
                        name="final"
                        className="monospace-font height-25 rounded-0"
                        value={formik.values.final ? `$ ${formik.values.final}` : "$ "}
                        onFocus={() => {
                            formik.setFieldValue("final", ""); // Clear only the numeric value on click
                        }}
                        onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and '.'

                            // Ensure only one decimal point
                            if ((value.match(/\./g) || []).length > 1) {
                                value = value.substring(0, value.lastIndexOf("."));
                            }

                            // Restrict to 2 decimal places
                            if (value.includes(".")) {
                                let parts = value.split(".");
                                if (parts[1].length > 2) {
                                    parts[1] = parts[1].substring(0, 2);
                                }
                                value = parts.join(".");
                            }

                            formik.setFieldValue("final", value); // Update Formik state
                        }}
                        onBlur={() => {
                            if (!formik.values.final) {
                                formik.setFieldValue("final", "0.00"); // Keep "$ " in place if empty
                            }
                        }}
                        isInvalid={formik.touched.final && !!formik.errors.final}
                    />
                        <Form.Control.Feedback type="invalid">{formik.errors.final}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-b-5">
                    <Form.Label column sm={2} className='p-t-0 p-b-0'>
                    Note
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            name="note"
                            className='height-25 rounded-0'
                            {...formik.getFieldProps("note")}
                            isInvalid={formik.touched.note && formik.errors.note}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.note}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <div className="d-flex justify-content-between">
                    <div>
                        <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                        Cancel
                        </Button>
                    </div>
                    <div>
                        <Button variant='success' type="submit" disabled={(formik.values.name == "" || formik.values.original == "" || formik.values.final == "" || formik.values.reduction == "")} className="m-l-5 bg-success height-25" style={{padding:"0px 12px"}}>
                        Save and Close
                        </Button>
                    </div>
                </div>
            </Form>
            </Modal.Body> 
            </Modal>
        </>
    )
}

export default AddOtherLien