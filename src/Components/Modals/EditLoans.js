import React,{useEffect} from 'react'
import { Modal, Button, Form, Row, Col  } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";
import { formatDate, formatDateForModalFields,getCurrentDate } from '../../Utils/helper';
import updatePanelApi from '../SettlementDashboard/api/updatePanelApi';

const EditLoans = ({show, handleClose, setData, loan,updateLoansState}) => {
    console.log(loan)
    const formik = useFormik({
        initialValues: {
            application_date: loan.application_date ? formatDateForModalFields(loan.application_date) : getCurrentDate(),
            current_amount_verified: parseFloat(loan.current_amount_verified || 0.0).toFixed(2),
            date_verified: loan.date_verified ? formatDateForModalFields(loan.date_verified) : getCurrentDate(),
            final_amount: parseFloat(loan.final_amount || 0.0).toFixed(2),
        },
        validationSchema: Yup.object({
            application_date: Yup.date()
                .required("Disbursed is required"),
            current_amount_verified: Yup.number()
                .required("Current Amount is required")
                .min(0, "Current Amount must be positive"),
            date_verified: Yup.date()
                .required("Verified is required"),
            final_amount: Yup.number()
                .required("Final Amount is required")
                .min(0, "Final Amount must be positive"),
        }),
        
        onSubmit: async (values) => {
        const dateWithZeros = (date) => {
            const d = new Date(date);
            const month = String(d.getMonth() + 1).padStart(2, '0'); 
            const day = String(d.getDate()).padStart(2, '0'); 
            const year = d.getFullYear();
            return `${month}/${day}/${year}`;
        };
        const payload = {
            check: loan.id,
            application_date: dateWithZeros(values.application_date),
            current_amount: values.current_amount_verified,
            date_verified: dateWithZeros(values.date_verified),
            final_amount: parseFloat(values.final_amount).toFixed(2),
            rough: loan.settle_rough || "",
            rough_check: loan.settle_rough_check,
            plan: loan?.settle_plan || "",
            plan_check: loan.settle_plan_check,
            payment: loan.settle_payment || "",
            payment_check: loan.settle_payment_check,
        };
        const res = await updatePanelApi(payload,"edit-case-loan");
        updateLoansState();
        handleClose();
        },
    });
    useEffect(() => {
        if (loan && show) {  // Only update when modal is shown
            formik.setValues({
                application_date: loan.application_date ? formatDateForModalFields(loan.application_date) : getCurrentDate(),
                current_amount_verified: parseFloat(loan.current_amount_verified || 0.0).toFixed(2),
                date_verified: loan.date_verified ? formatDateForModalFields(loan.date_verified) : getCurrentDate(),
                final_amount: parseFloat(loan.final_amount || 0.0).toFixed(2),
            });
        }
    }, [loan, show]);  // Run effect when `loan` or `show` changes

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
    dialogClassName="loan-check-dialog justify-content-center "
    >
  <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Edit Loans</div></div>
        
            <Modal.Body style={{padding:"5px"}}>
            <Form onSubmit={formik.handleSubmit}>
            {/* <span >{loan.checkID && "Check Request has been submitted no edits can be made."}</span> */}
                <Form.Group as={Row} className="m-b-5">
                    <Form.Label column sm={3} className='p-t-0 p-b-0 text-grey'>
                    Disbursed
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="date"
                            className='height-25 rounded-0'
                            name="application_date"
                            {...formik.getFieldProps("application_date")}
                            style={{ appearance: "none" }}
                            onClick={(e) => e.target.showPicker()}
                            isInvalid={formik.touched.application_date && formik.errors.application_date}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.application_date}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-b-5">
                    <Form.Label style={{whiteSpace:"nowrap"}} column sm={3} className='p-t-0 p-b-0 text-grey'>
                    Current Amount
                    </Form.Label>
                    
                    <Col sm={9} className="p-l-15">
                    <Form.Control
                        type="text"
                        name="current_amount_verified"
                        className="monospace-font height-25 rounded-0"
                        value={formik.values.current_amount_verified ? `$ ${formik.values.current_amount_verified}` : "$ "}
                        onFocus={() => {
                            formik.setFieldValue("current_amount_verified", ""); // Clear only the numeric value on click
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

                            formik.setFieldValue("current_amount_verified", value); // Update Formik state
                        }}
                        onBlur={() => {
                            if (!formik.values.current_amount_verified) {
                                formik.setFieldValue("current_amount_verified", "0.00"); // Keep "$ " in place if empty
                            }
                        }}
                        isInvalid={formik.touched.current_amount_verified && !!formik.errors.current_amount_verified}
                    />
                        <Form.Control.Feedback type="invalid">
                        {formik.errors.current_amount_verified}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-b-5">
                    <Form.Label column sm={3} className='p-t-0 p-b-0 text-grey'>
                    Verified
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="date"
                            className='height-25 rounded-0'
                            name="date_verified"
                            {...formik.getFieldProps("date_verified")}
                            style={{ appearance: "none" }}
                            onClick={(e) => e.target.showPicker()}
                            isInvalid={formik.touched.date_verified && formik.errors.date_verified}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.date_verified}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-b-5">
                    <Form.Label column sm={3} className='p-t-0 p-b-0 text-grey'>
                    Final Amount
                    </Form.Label>
                    <Col sm={9} className="p-l-15">
                    <Form.Control
                        type="text"
                        name="final_amount"
                        className="monospace-font height-25 rounded-0"
                        value={formik.values.final_amount ? `$ ${formik.values.final_amount}` : "$ "}
                        onFocus={() => {
                            formik.setFieldValue("final_amount", ""); // Clear only the numeric value on click
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

                            formik.setFieldValue("final_amount", value); // Update Formik state
                        }}
                        onBlur={() => {
                            if (!formik.values.final_amount) {
                                formik.setFieldValue("final_amount", "0.00"); // Keep "$ " in place if empty
                            }
                        }}
                        isInvalid={formik.touched.final_amount && !!formik.errors.final_amount}
                    />
                        <Form.Control.Feedback type="invalid">
                        {formik.errors.final_amount}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                

                <div className="d-flex justify-content-between align-items-center">
                    <span>To delete a loan entry, delete it from the loans page.</span>
                    <div>
                        <div>
                            <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                            Cancel
                            </Button>
                            <Button variant='success' type="submit" disabled={(formik.values.current_amount_verified == "" || formik.values.final_amount == "")} className="height-25 m-l-5 bg-success" style={{padding:"0px 12px"}}>
                            Save and Close
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
            </Modal.Body>
        
    </Modal>
        </>
    )
}

export default EditLoans