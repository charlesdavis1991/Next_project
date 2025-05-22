import React,{useEffect} from 'react'
import { Modal, Button, Form, Row, Col  } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";
import updatePanelApi from '../SettlementDashboard/api/updatePanelApi';
import deletePanelEntity from '../SettlementDashboard/api/deletePanelEntity';

const EditLiens = ({show,handleClose, lien, updateLienStates,updateClientProceedStates}) => {
    const formik = useFormik({
        initialValues: {
            totalpaid: parseFloat(lien?.totalpaid || 0.0).toFixed(2),
            liens: parseFloat(lien?.liens || 0.0).toFixed(2),
            lienfinal: parseFloat(lien?.lienfinal || 0.0).toFixed(2),
            reduction: parseFloat(lien?.reduction || 0.0).toFixed(2),
        },
        validationSchema: Yup.object({
            totalpaid: Yup.number()
                .required("Total Paid is required")
                .min(0, "Total Paid must be positive"),
            liens: Yup.number()
                .required("Leins is required")
                .min(0, "Leins must be positive"),
            lienfinal: Yup.number()
                .required("Final Lien is required")
                .min(0, "Final Lien must be positive"),
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
            insurance_lien_id: lien.id,
            ...transformedValues, // Use the transformed values
        };
        const res = await updatePanelApi(payload,"insurance-lien/edit");
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
                totalpaid: parseFloat(lien?.totalpaid || 0.0).toFixed(2),
                liens: parseFloat(lien?.liens || 0.0).toFixed(2),
                lienfinal: parseFloat(lien?.lienfinal || 0.0).toFixed(2),
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
                <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Edit {lien?.insuranceID?.insurance_type} Lien</div></div>
                
                    <Modal.Body style={{padding:"5px"}}>
                    <Form onSubmit={formik.handleSubmit}>
                    {/* <span>{lien?.checkID && "Check Request has been submitted no edits can be made."}</span> */}
                        <Form.Group as={Row} className="m-b-5">
                            <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0 text-grey'>
                            Total Paid:
                            </Form.Label>
                            <Col sm={10} className="p-l-15">
                            <Form.Control
                                type="text"
                                name="totalpaid"
                                className="monospace-font height-25 rounded-0"
                                value={formik.values.totalpaid ? `$ ${formik.values.totalpaid}` : "$ "}
                                onFocus={(e) => {
                                    formik.setFieldValue("totalpaid", ""); // Clear only the numeric value on click
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

                                    formik.setFieldValue("totalpaid", value); // Update Formik state
                                }}
                                onBlur={(e) => {
                                    if (!formik.values.totalpaid) {
                                        formik.setFieldValue("totalpaid", "0.00"); // Keep "$ " in place if empty
                                    }
                                }}
                                isInvalid={formik.touched.totalpaid && !!formik.errors.totalpaid}
                            />
                                <Form.Control.Feedback type="invalid">{formik.errors.totalpaid}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="m-b-5">
                            <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0 text-grey'>
                            Liens:
                            </Form.Label>
                            <Col sm={10} className="p-l-15">
                            <Form.Control
                                type="text"
                                name="liens"
                                className="monospace-font height-25 rounded-0"
                                value={formik.values.liens ? `$ ${formik.values.liens}` : "$ "}
                                onFocus={() => {
                                    formik.setFieldValue("liens", ""); // Clear only the numeric value on click
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

                                    formik.setFieldValue("liens", value); // Update Formik state
                                }}
                                onBlur={() => {
                                    if (!formik.values.liens) {
                                        formik.setFieldValue("liens", "0.00"); // Keep "$ " in place if empty
                                    }
                                }}
                                isInvalid={formik.touched.liens && !!formik.errors.liens}
                            />
                                <Form.Control.Feedback type="invalid">{formik.errors.liens}</Form.Control.Feedback>
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
                            Final Liens:
                            </Form.Label>
                            <Col sm={10} className="p-l-15">
                            <Form.Control
                                type="text"
                                name="lienfinal"
                                className="monospace-font height-25 rounded-0"
                                value={formik.values.lienfinal ? `$ ${formik.values.lienfinal}` : "$ "}
                                onFocus={() => {
                                    formik.setFieldValue("lienfinal", ""); // Clear only the numeric value on click
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

                                    formik.setFieldValue("lienfinal", value); // Update Formik state
                                }}
                                onBlur={() => {
                                    if (!formik.values.lienfinal) {
                                        formik.setFieldValue("lienfinal", "0.00"); // Keep "$ " in place if empty
                                    }
                                }}
                                isInvalid={formik.touched.lienfinal && !!formik.errors.lienfinal}
                            />
                                <Form.Control.Feedback type="invalid">{formik.errors.lienfinal}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        
                        {/* <Form.Group as={Row} className="m-b-5">
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
                                <Button variant="danger" className="height-25" style={{padding:"0px 12px"}} onClick={()=>handleDeleteLien(lien.id,"Lien Insurance")}>
                                Delete
                                </Button>
                            </div>
                            <div>
                                <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button variant='success' type="submit" disabled={(formik.values.totalpaid == "" || formik.values.liens == "" || formik.values.lienfinal == "" || formik.values.reduction == "")} className="m-l-5 bg-success height-25" style={{padding:"0px 12px"}}>
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

export default EditLiens