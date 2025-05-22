import React,{useEffect} from 'react'
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getCaseId, getClientId } from '../../Utils/helper';
import createCheckRequest from '../SettlementDashboard/common/createCheckRequest'
import { useFormik } from "formik";
import { Form, Col, Row } from 'react-bootstrap';
import * as Yup from "yup";

const SettlementCheckRequest = ({ show, handleClose, panelLabel , panelName, panelEntity,updateStates,finalAmount }) => {
    const client = useSelector((state) => state?.caseData?.summary?.for_client);
    const handleCheckRequest = async() => {
        const payload = {
            client_id: parseInt(getClientId()),
            case_id: parseInt(getCaseId()),
            provider_id: panelEntity.id,
            type: panelName
        }
        console.log(payload)
        const res = await createCheckRequest(payload)
        console.log(res)
        updateStates()
        handleClose()
    }
    const formik = useFormik({
        initialValues: {
            amount: parseFloat(finalAmount || 0.00).toFixed(2),  
            memo:`${client?.first_name} ${client?.last_name}` || '',
        },
        validationSchema: Yup.object({
            amount: Yup.number()
            .min(0, "Final amount must be positive"), 
            memo: Yup.string().nullable(),
        }),
        onSubmit: async (values) => {
            const payload = {
                client_id: parseInt(getClientId()),
                case_id: parseInt(getCaseId()),
                provider_id: panelEntity.id,
                amount:values.amount,
                memo: values.memo,
                type: panelName
            }
            console.log(payload)
            const res = await createCheckRequest(payload)
            console.log(res)
            updateStates()
            handleClose()
        },
    });
    useEffect(() => {
        if (panelEntity && show) { // Reset values when the modal opens
            formik.setValues({
                amount: parseFloat(finalAmount || 0.00).toFixed(2),  
                memo:`${client?.first_name} ${client?.last_name}` || '',
            });
        }
    }, [panelEntity, show]); // 🔹 Now updates when modal opens

    useEffect(() => {
        if (!show) {
            $('.modal').hide();
        }
    }, [show]);
    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            size="lg"
            dialogClassName="custom-check-dialog justify-content-center"
        >
            <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Confirm Check Request</div></div>

            <Modal.Body style={{padding:"5px"}}>
                    <div className='d-flex flex-column '>
                        <Form onSubmit={formik.handleSubmit}>
                            <Row className="m-b-5 d-flex align-items-center">
                                <Col sm={3}>Payee:</Col>
                                <Col sm={9}>{panelName === "loans" ? panelEntity.loan_company : panelName == "provider" ? panelEntity.treatment_location_name : panelName == "Costs" ? '' : ''}</Col>
                            </Row>                    
                            <Form.Group as={Row} controlId="amount" className="m-b-5 d-flex align-items-center">
                            <Form.Label column sm={3} className="fw-bold whitespace-nowrap p-t-0 p-b-0 height-25">
                                Final Amount
                            </Form.Label>
                            <Col sm={9} className="p-l-15">
                            <Form.Control
                                type="text"
                                name="amount"
                                className="monospace-font height-25 rounded-0"
                                value={formik.values.amount !== "" ? `$ ${formik.values.amount}` : "$ "}
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
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.amount}
                                </Form.Control.Feedback>
                            </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="m-b-5 d-flex align-items-center">
                            <Form.Label column sm={3} className='p-t-0 p-b-0 height-25'>
                                Memo
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="memo"
                                    className='height-25 rounded-0 '
                                    {...formik.getFieldProps("memo")}
                                    isInvalid={formik.touched.memo && formik.errors.memo}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.memo}
                                </Form.Control.Feedback>
                            </Col>
                            </Form.Group>
                            <span className='color-black d-inline-block m-b-5'>Do you want to confirm the check request?</span>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                                        Cancel
                                    </Button>
                                </div>
                                <div>
                                    <Button type='submit' variant="success" className="height-25 bg-success" style={{padding:"0px 12px"}}  disabled={formik.values.amount == "" || formik.values.amount == "0" || formik.values.amount == "0.00"} >
                                        Request
                                    </Button>
                                </div>
                            </div>
                        </Form>

                    </div>

            </Modal.Body>
            {/* <Modal.Footer className='mt-0'>
                <div>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </div>
                <div>
                    <Button type="submit" className="ms-2 m-l-5 bg-primary" disabled={formik.values.amount == "" || formik.values.amount == "0" || formik.values.amount == "0.00"} >
                        Request
                    </Button>
                </div>
            </Modal.Footer> */}
        </Modal>
    )
}

export default SettlementCheckRequest