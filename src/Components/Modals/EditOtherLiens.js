import React,{useEffect} from 'react'
import { Modal, Button, Form, Row, Col  } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";
import updatePanelApi from '../SettlementDashboard/api/updatePanelApi';
import deletePanelEntity from '../SettlementDashboard/api/deletePanelEntity';

const EditOtherLiens = ({show,handleClose, lien,updateLienStates,updateClientProceedStates}) => {
    const formik = useFormik({
        initialValues: {
            name: lien?.name || "",
            note:lien?.note || "",
            original: parseFloat(lien?.original || 0.0).toFixed(2),
            amount: parseFloat(lien?.amount || 0.0).toFixed(2),
            reduction: parseFloat(lien?.reduction || 0.0).toFixed(2),
        },
        validationSchema: Yup.object({
            name: Yup.string(),
            note: Yup.string().nullable(),
            amount: Yup.number()
                .required("Final Lien is required")
                .min(0, "Final Lien must be positive"),
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
            other_lien_id: lien.id,
            ...transformedValues, // Use the transformed values
        };
        const res = await updatePanelApi(payload,"other-lien/edit");
        console.log(res);
        updateLienStates();
        handleClose();
        },
    });
    const handleDeleteLien = async (id,panel) =>{
        const payload = {
            panel_name:panel,
            record_id:id
        }
        const res = await deletePanelEntity(payload);
        updateClientProceedStates();
        updateLienStates();
        handleClose();
    }
    useEffect(() => {
        if (lien && show) { // Only update values when the modal opens
            formik.setValues({
                name: lien?.name || "",
                note:lien?.note || "",
                original: parseFloat(lien?.original || 0.0).toFixed(2),
                amount: parseFloat(lien?.amount || 0.0).toFixed(2),
                reduction: parseFloat(lien?.reduction || 0.0).toFixed(2),
            });
        }
    }, [lien, show]); // Re-run when `lien` or `show` changes
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
            <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Edit Other Lien</div></div>
            <Modal.Body style={{padding:"5px"}}>
            <Form onSubmit={formik.handleSubmit}>
            {/* <span>{lien?.checkID && "Check Request has been submitted no edits can be made."}</span> */}
                <Form.Group as={Row} className="m-b-5">
                    <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0 text-grey'>
                    Name:
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            name="name"
                            className="height-25 rounded-0"
                            {...formik.getFieldProps("name")}
                            isInvalid={formik.touched.name && formik.errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.name}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-b-5">
                    <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0 text-grey'>
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
                    <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0 text-grey'>
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
                    <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0 text-grey'>
                    Final Lien:
                    </Form.Label>
                    <Col sm={10} className="p-l-15">
                    <Form.Control
                        type="text"
                        name="amount"
                        className="monospace-font height-25 rounded-0"
                        value={formik.values.amount ? `$ ${formik.values.amount}` : "$ "}
                        onFocus={() => {
                            formik.setFieldValue("amount", ""); // Clear only the numeric value on click
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

                            formik.setFieldValue("amount", value); // Update Formik state
                        }}
                        onBlur={() => {
                            if (!formik.values.amount) {
                                formik.setFieldValue("amount", "0.00"); // Keep "$ " in place if empty
                            }
                        }}
                        isInvalid={formik.touched.amount && !!formik.errors.amount}
                    />
                        <Form.Control.Feedback type="invalid">{formik.errors.amount}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-b-5">
                    <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0 text-grey'>
                    Note:
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
                
                {/* <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2} className='whitespace-SETTLE'>
                    Remaining:
                    </Form.Label>
                    <Col sm={10} className="p-l-15 monospace-font d-flex align-items-center">
                    
                    {currencyFormat(
                        (
                            parseFloat(formik.values.totalpaid || 0)
                        ) 
                            - 
                        ( 
                            parseFloat(formik.values.lien || 0) + 
                            parseFloat(formik.values.reduction || 0)
                        )
                    )}

                    </Col>
                </Form.Group> */}

                <div className="d-flex justify-content-between">
                    <div>
                        <Button variant="danger"  className="height-25" style={{padding:"0px 12px"}} onClick={()=>handleDeleteLien(lien.id,"Other Lien")}>
                        Delete
                        </Button>
                    </div>
                    <div>
                    <Button variant="secondary"  className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                        Close
                        </Button>
                        <Button variant='success' type="submit" disabled={(formik.values.name == "" || formik.values.original == "" || formik.values.amount == "" || formik.values.reduction == "")} className="m-l-5 bg-success height-25" style={{padding:"0px 12px"}}>
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

export default EditOtherLiens