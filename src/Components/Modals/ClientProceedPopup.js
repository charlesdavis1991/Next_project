import React,{useEffect} from 'react'
import { Modal, Button, Form, Row, Col  } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";
import updatePanelApi from '../SettlementDashboard/api/updatePanelApi';
import { getCaseId, getClientId } from '../../Utils/helper';
import deletePanelEntity from '../SettlementDashboard/api/deletePanelEntity';

const ClientProceedPopup = ({show,handleClose,action,check,updateClientProceedStates}) => {
    const formik = useFormik({
        initialValues: {
            amount: parseFloat(check?.amount || 0.0).toFixed(2),
            name_on_check: check?.name_on_check || "",
            check: check?.id ? "True" : "False"
        },
        validationSchema: Yup.object({
            name_on_check: Yup.string(),
            amount: Yup.number()
                .required("Amount is required")
                .min(0, "Amount must be positive"),
        }),
        onSubmit: async (values) => {
            // Convert all values to strings
        const transformedValues = Object.fromEntries(
            Object.entries(values).map(([key, value]) => [key, value.toString()])
        );

        const payload = {
            case_id:getCaseId(),
            client_id:getClientId(),
            cost_id: check?.id,
            ...transformedValues, // Use the transformed values
        };
        console.log(payload);
        const res = await updatePanelApi(payload,"edit-clientproceeds");
        console.log(res);
        updateClientProceedStates();
        handleClose();
        },
    });
    const handleDeleteClientProceed = async (id,panel) =>{
        const payload = {
            panel_name:panel,
            record_id:id
        }
        const res = await deletePanelEntity(payload)
        updateClientProceedStates();
        handleClose();
    }
    useEffect(() => {
        if (check && show) { // Only update values when the modal opens
            formik.setValues({
                amount: parseFloat(check?.amount || 0.0).toFixed(2),
                name_on_check: check?.name_on_check || "",
                check: check?.id ? "True" : "False"
            });
        }
    }, [check, show]); // Re-run when `lien` or `show` changes
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

                <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>{action == "ADD" ? "Add Client Proceed" : "Edit Client Proceed"}</div></div>
                
                    <Modal.Body style={{padding:"5px"}}>
                    <Form onSubmit={formik.handleSubmit}>
                    {/* <span>{check?.checkID && "Check Request has been submitted no edits can be made."}</span> */}
                        <Form.Group as={Row} className="m-b-5">
                            <Form.Label column sm={3} className='whitespace-SETTLE p-t-0 p-b-0 text-grey'>
                            Name On Check:
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    className='height-25 rounded-0'
                                    name="name_on_check"
                                    {...formik.getFieldProps("name_on_check")}
                                    isInvalid={formik.touched.name_on_check && formik.errors.name_on_check}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.name_on_check}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="m-b-5">
                            <Form.Label column sm={3} className='p-t-0 p-b-0 text-grey'>
                            Amount:
                            </Form.Label>
                            <Col sm={9} className="p-l-15">
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

                        {/* <Form.Group as={Row} className="m-b-5">
                            <Form.Label column sm={2}>
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
                                {action === "EDIT" && <Button className="height-25" style={{padding:"0px 12px"}} variant="danger" onClick={()=>handleDeleteClientProceed(check.id,"Client Proceeds")}>
                                    Delete
                                </Button>}
                                {action === "ADD" && <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                                    Cancel
                                </Button>}
                            </div>
                            <div>
                                {action === "EDIT" && <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                                    Cancel
                                </Button>}
                                <Button variant='success' type="submit" disabled={(formik.values.amount == "" || formik.values.name_on_check == "" )} className="height-25 bg-success m-l-5" style={{padding:"0px 12px"}}>
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

export default ClientProceedPopup