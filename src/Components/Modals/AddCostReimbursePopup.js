import React,{useEffect} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form,Button } from "react-bootstrap";
import updatePanelApi from '../SettlementDashboard/api/updatePanelApi';
import { formatDate, getCaseId, getClientId,currencyFormat } from '../../Utils/helper';
import { useSelector } from "react-redux";


const AddCostReimbursePopUp = ({handleClose, handleDisableSaveBtn, addCostReimburseObj }) => {
    const caseSummary = useSelector((state) => state?.caseData?.summary);
    const currentCase = useSelector((state) => state?.caseData?.current);
    const { updateStates, costsReimbursements, costReimbursementsFinalAmount, costFinalAmount } = addCostReimburseObj;
    const formik = useFormik({
        initialValues: {
            amount: "",
            payee: (currentCase?.firm_addresses?.address1 || currentCase?.firm_addresses?.address1) ? currentCase?.for_client?.created_by?.office_name : "",
            memo: `Costs for ${caseSummary.for_client.first_name} ${caseSummary.for_client.last_name} DOI: ${formatDate(caseSummary.incident_date)}`,
            invoice_number: "",
            date_due: "", 
        },
        validationSchema: Yup.object({
            payee: Yup.string(),
            memo: Yup.string().nullable(),
            invoice_number: Yup.string(),
            date_due:Yup.date().nullable(),
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
            date_due: null,
            amount: transformedValues.amount,
            payee: transformedValues.payee,
            memo: transformedValues.memo,
            invoice_number: transformedValues.invoice_number
        };
        const res = await updatePanelApi(payload,"cost-reimbursement/create");
        updateStates();
        handleDisableSaveBtn(false);
        formik.resetForm();
        },
    });    
    // useEffect(()=>{
    //     if(formik.values.amount == ""){
    //         handleDisableSaveBtn(true);
    //         return;
    //     }
    //     handleDisableSaveBtn(false);

    // },[ formik.values.amount ])
    console.log(formik.errors)
    return (
        <>
        <div className='m-t-15 m-b-15'>
            <span className='d-block text-center text-primary font-weight-600'>Input Cost Reimbursement Checks.</span>
            <span className='d-block text-center text-primary font-weight-600'>These Cost Reimbursement Checks will show on the Settle Page as deductions from the Total Costs.</span>
        </div>
        <div className={`d-flex align-items-center justify-content-center text-uppercase height-25 font-weight-semibold m-b-5 selected-option`}>
            <span className='text-uppercase'>Input Cost Reimbursement Checks to the Firm {caseSummary.for_client.first_name} {caseSummary.for_client.last_name}'s Case</span>
        </div>     
        <Form className="cost-reimburse-form side-padding-100" onSubmit={formik.handleSubmit}>
            {/* <div className="d-flex m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end">
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
            </div> */}
            <div className="d-flex m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end">
                    Amount:
                </span>
                <div className="d-flex-1 m-r-5">
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
                // onBlur={() => {
                //     if (!formik.values.amount) {
                //         formik.setFieldValue("amount", ""); // Keep "$ " in place if empty
                //     }
                // }}
                isInvalid={formik.touched.amount && !!formik.errors.amount}
            />

                    <Form.Control.Feedback type="invalid">
                        {formik.errors.amount}
                    </Form.Control.Feedback>
                </div>
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end">
                    Payee:
                </span>
                <div className="d-flex-1 m-r-5">
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
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end">
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
                <Button type="submit" variant="success" className="height-25 add-check-btn m-l-5" style={{padding:"0px 12px"}} disabled={formik.values.amount==""}>
                    Save
                </Button>
            </div>



            {/* <div className="d-flex m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end">
                    Invoice Number:
                </span>
                <div className="d-flex-1">
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
                </div>
            </div> */}

        </Form>
        <div>
            <div className="litigation-sec-action-bar">
                <div className="w-100 height-25" style={{ height: "25px" }}>
                    <div className="d-flex justify-content-center align-items-center height-25">
                        <span className='text-uppercase m-l-5 text-white font-weight-bold text-center'>Total costs and firm Reimbursement checks issued</span>
                    </div>
                </div>
            </div>
            <div className="table--no-card rounded-0 border-0 w-100 cost-reimburse-table">
                <table className="table table-borderless table-striped table-earning settlement-table position-relative">
                    <thead className='position-sticky top-0'>
                        <tr id="settle-tb-header" className="settle-t-4">
                            <th className=""></th>
                            <th className="text-left"></th>
                            <th className="td-autosize">Total</th>
                        </tr>
                    </thead>
                    <tbody id="body-table">
                        { 
                            <tr className="height-25">
                                <td className=""></td>
                                <td className="text-capitalize text-left"> 
                                    <span className="text-black">Total Costs:</span>
                                </td>
                                <td className="height-25 monospace-font text-right dollar-amount-value td-autosize" data-value={ parseFloat(parseFloat(costFinalAmount || 0.00)).toFixed(2) }>
                                    {currencyFormat(parseFloat(costFinalAmount || 0.00))}
                                </td>                           
                            </tr>
                        }
                        {costsReimbursements?.map((costReimburse,index)=>                        
                        <tr className="height-25">                  
                            <td className="">{index + 1}</td>
                            <td className='text-left'>
                                <span className="">
                                    
                                    {costReimburse?.date_due && <span className='m-r-5'>{ formatDate(costReimburse?.date_due) }</span>}
                                    <span>Firm Reimbursement Check for</span>&nbsp;
                                    <span className='monospace-font dollar-amount-value' data-value={costReimburse?.amount || 0.00}>{ currencyFormat(costReimburse?.amount) }</span>
                                </span>
                            </td>
                            <td className="monospace-font td-autosize dollar-amount-value text-right" data-value={costReimburse?.amount || 0.00}>{currencyFormat(costReimburse?.amount || 0.00)}</td>
                        </tr>)
                        }
                        { 
                            <tr className="height-25">
                                <td className="text-capitalize text-right primary-clr-25" colSpan={2}>
                                Remaining to be Reimbursed to {caseSummary.for_client.created_by.office_name}:
                                </td>
                                <td className="height-25 monospace-font text-right dollar-amount-value td-autosize" data-value={parseFloat(parseFloat(costFinalAmount || 0.00) - parseFloat(costReimbursementsFinalAmount || 0.00)).toFixed(2) }>
                                    {currencyFormat(parseFloat(costFinalAmount || 0.00) - parseFloat(costReimbursementsFinalAmount || 0.00))}
                                </td>
                                
                            </tr>
                        }
                        {
                            costsReimbursements?.length < 7 && Array(6 - costsReimbursements.length).fill(null).map((_, index) => (
                                <tr key={index}>
                                    <td colSpan={3}></td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}

export default AddCostReimbursePopUp