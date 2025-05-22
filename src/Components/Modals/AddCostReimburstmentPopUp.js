import React,{useEffect} from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import updatePanelApi from '../SettlementDashboard/api/updatePanelApi';
import { getCaseId, getClientId,getCurrentDate,formatToYYYYMMDD } from '../../Utils/helper';
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { currencyFormat, formatDate } from "../../Utils/helper";
import deletePanelEntity from "../SettlementDashboard/api/deletePanelEntity";

const AddCostReimburstmentPopUp = ({show, handleClose, updateStates, action, costReimburse,total, remainingToBeReimburse, costsReimbursements,setCurrentCostReimbursement}) => {

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            amount: costReimburse?.amount ? parseFloat(costReimburse?.amount || 0.00).toFixed(2) : "",
            payee: costReimburse?.payee || "",
            memo: costReimburse?.memo || "",
            invoice_number: costReimburse?.invoice_number || "",
            date_due: costReimburse?.date_due ? formatToYYYYMMDD(costReimburse?.date_due) :  '', 
        },
        validationSchema: Yup.object({
            payee: Yup.string().nullable(),
            memo: Yup.string().nullable(),
            invoice_number: Yup.string().nullable(),
            date_due:Yup.date(),
            amount: Yup.number()
                .required("Amount is required")
                .min(0, "Amount must be positive"),
        }),
        onSubmit: async (values) => {
            const dateWithZeros = (date) => {
                if(date == "") return '';
                const d = new Date(date);
                const month = String(d.getMonth() + 1);
                const day = String(d.getDate());
                const year = d.getFullYear();
                return `${year}-${month}-${day}`;
            };
            // Convert all values to strings
        const transformedValues = Object.fromEntries(
            Object.entries(values).map(([key, value]) => [key, value.toString()])
        );
        const payload = {
            case_id:getCaseId(),
            client_id:getClientId(),
            date_due: transformedValues.date_due ? dateWithZeros(transformedValues.date_due) : null,
            amount: transformedValues.amount,
            payee: transformedValues.payee,
            memo: transformedValues.memo,
            invoice_number: transformedValues.invoice_number
        };
        let res = "";
        if(costReimburse?.id){
            payload.cost_reimbursement_id = costReimburse?.id;
            res = await updatePanelApi(payload,"cost-reimbursement/edit");
        }
        else{
            res = await updatePanelApi(payload,"cost-reimbursement/create");
        }
        console.log(res);
        updateStates();
        handleClose();
        },
    });  
    const handleDeleteCheck = async (id, panel) => {
    const payload = {
        panel_name: panel,
        record_id: id
    }
    const res = await deletePanelEntity(payload)
    setCurrentCostReimbursement(null)
    formik.resetForm()
    updateStates();
    }  
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
        dialogClassName="cost-reimburse-dialog justify-content-center ">
        <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>{action=="ADD" ? 'Add' : 'Edit'} Firm Cost Reimbursement Check</div></div>
        <Modal.Body style={{padding:"5px"}}>

            <Form className="position-relative" onSubmit={formik.handleSubmit}>
            
            <div style={{margin:"0px -5px"}}>
                <div className="litigation-sec-action-bar">
                    <div className="w-100 height-25" style={{ height: "25px" }}>
                        <div className="d-flex justify-content-center align-items-center height-25">
                            <span className='text-uppercase m-l-5 text-white font-weight-bold text-center'>Checks</span>
                        </div>
                    </div>
                </div>
                <div className='table--no-card rounded-0 border-0'>
                    <table class="table table-borderless table-striped table-earning">
                    <thead>
                        <tr id="settle-tb-header" class="settle-t-3">
                            <th></th>
                            <th class="text-left">Description</th>
                            <th class="text-end td-autosize">Check Amount</th>
                            
                        </tr>
                    </thead>
                        <tbody id="body-table">
                                { 
                                <tr className="height-25 font-weight-semibold">
                                    
                                    <td className="text-capitalize text-right" colSpan={3}>
                                        <span className="primary-clr-25">Total Costs:&nbsp;</span>
                                        <span className="monospace-font dollar-amount-value text-right font-weight-semibold" style={{color: total > 0 ? "#000" : "var(--primary-25)"}} data-value={total}>{currencyFormat(total)}</span>
                                    </td>
                                </tr>
                                }
                                {
                                costsReimbursements?.map((check,index)=>                        
                                    <tr className="height-25 font-weight-semibold" style={{height:"25px",background:check?.id === costReimburse?.id && "var(--primary-50)",cursor:"pointer"}} 
                                        onClick={()=>{
                                        setCurrentCostReimbursement(check)
                                    }}>    
                                        <td>{index+1}</td>              
                                        <td class="text-left" colSpan={2}>
                                            <div className='d-flex' style={{width:"fit-content"}}>
                                            <span className="td-autosize provider-col">
                                                
                                                <span>{ formatDate(check?.date_due) }</span>&nbsp;
                                                <span>Firm Reimbursement Check for</span>&nbsp;
                                                <span className='monospace-font dollar-amount-value' data-value={check?.amount || 0.00}>{ currencyFormat(check?.amount) }</span>
                                            </span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                                }
                                { 
                                costsReimbursements.length > 0 && 
                                <tr className="height-25 font-weight-semibold">
                                    <td className="text-capitalize text-right" colSpan={3}>
                                        <span className="primary-clr-25">Remaining to be Reimbursed:&nbsp;</span>
                                        <span className="monospace-font dollar-amount-value text-right font-weight-semibold" style={{color: remainingToBeReimburse > 0 ? "#000" : "var(--primary-25)"}} data-value={remainingToBeReimburse}>{currencyFormat(remainingToBeReimburse)}</span>
                                    </td>
                                </tr>
                                }
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="d-flex m-t-5 m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 cost-reimburse-label text-end">
                    Check Date:
                </span>
                <div className="d-flex-1">
                    <Form.Control
                        type="date"
                        className="height-25 rounded-0"
                        name="date_due"
                        {...formik.getFieldProps("date_due")}
                        style={{ appearance: "none" }}
                        onClick={(e) => e.target.showPicker()}
                        isInvalid={formik.touched.date_due && formik.errors.date_due}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.date_due}
                    </Form.Control.Feedback>
                </div>
            </div>

            <div className="d-flex m-t-5 m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 cost-reimburse-label text-end">
                Payee:
                </span>
                <div className="d-flex-1">
                    <Form.Control
                        type="text"
                        name="payee"
                        className="height-25 rounded-0"
                        {...formik.getFieldProps("payee")}
                        isInvalid={formik.touched.payee && formik.errors.payee}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.payee}
                    </Form.Control.Feedback>
                </div>
            </div>

            {/* <Form.Group as={Row} className="m-b-5">
                <Form.Label column sm={3} className="whitespace-SETTLE p-t-0 p-b-0 text-grey">
                Invoice Number:
                </Form.Label>
                <Col sm={9}>
                    <Form.Control
                        type="text"
                        name="invoice_number"
                        className="height-25 rounded-0"
                        {...formik.getFieldProps("invoice_number")}
                        isInvalid={formik.touched.invoice_number && formik.errors.invoice_number}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.invoice_number}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group> */}

            <div className="d-flex m-t-5 m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 cost-reimburse-label text-end">
                    Amount:
                </span>
                <div className="d-flex-1">
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
                        formik.setFieldValue("amount", ""); // Keep "$ " in place if empty
                    }
                }}
                isInvalid={formik.touched.amount && !!formik.errors.amount}
            />

                    <Form.Control.Feedback type="invalid">
                        {formik.errors.amount}
                    </Form.Control.Feedback>
                </div>
            </div>

            <div className="d-flex m-t-5 m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 cost-reimburse-label text-end">
                    Memo:
                </span> 
                <div className="d-flex-1">
                    <Form.Control
                        type="text"
                        name="memo"
                        className="height-25 rounded-0"
                        {...formik.getFieldProps("memo")}
                        isInvalid={formik.touched.memo && formik.errors.memo}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.memo}
                    </Form.Control.Feedback>
                </div>
            </div>
            <div className="d-flex justify-content-between">
                <Button
                style={{
                    marginRight: "5px",
                    padding:"0px 12px"
                }}
                className="height-25"
                variant="secondary"
                onClick={handleClose}
                >
                Cancel
                </Button>

                <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
                >

                <Button variant="success" disabled={!costReimburse || (formik.values.amount == "")} type="submit" className="bg-success height-25" style={{padding:"0px 12px"}}>
                Save and Close
                </Button>
                </div>
            </div>
            
            <div className=" position-absolute del-btn-firm">
                <Button
                style={{
                    marginRight: "5px",
                    padding:"0px 12px"
                }}
                className="height-25"
                variant="danger"
                disabled={!costReimburse}
                onClick={() => handleDeleteCheck(costReimburse.id, "Cost Reimbursement")}
                >
                Delete
                </Button>
            </div>
            
            </Form>
        </Modal.Body>
    </Modal>
    )
}

export default AddCostReimburstmentPopUp