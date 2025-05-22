import React,{useEffect} from 'react'
import { Form, Button } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";
import updatePanelApi from '../SettlementDashboard/api/updatePanelApi';
import { getCaseId, getClientId, currencyFormat } from '../../Utils/helper';

const AddClientProceedPopup = ({handleClose, handleDisableSaveBtn, addClientProceedObj}) => {
    const { updateClientProceedStates, total_settlement,clientProceeds, amount_after_lien_deductions } = addClientProceedObj;
    const {
        checks,
        clientProceedFinalAmount,
    } = clientProceeds;
    // const offerAmount = currentOffer?.demand || 0.00;
    // const checkAmountsTotal = checks?.reduce((acc,check) => parseFloat(acc) + parseFloat(check?.amount || 0.00),0);
    const formik = useFormik({
        initialValues: {
            amount: "",
            name_on_check: "",
            check: "False"
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
            // cost_id: check?.id,
            ...transformedValues, // Use the transformed values
        };
        const res = await updatePanelApi(payload,"edit-clientproceeds");
        updateClientProceedStates();
        handleClose();
        },
    });
    // useEffect(()=>{
    //     if(formik.values.amount == "" || formik.values.name_on_check == ""){
    //         handleDisableSaveBtn(true);
    //         return;
    //     }
    //     handleDisableSaveBtn(false);

    // },[ formik.values.amount, formik.values.name_on_check ])
    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <div className="d-flex m-b-5 align-items-center side-padding-100 m-t-5">
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 client-proceed-input-label text-end">
                        Name On Check:
                    </span>
                    <div className='d-flex-1'>
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
                    </div>
                </div>
                <div className="d-flex m-b-5 align-items-center side-padding-100">
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 client-proceed-input-label text-end">
                        Amount:
                    </span>
                    <div className='d-flex-1'>
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
                            // onBlur={() => {
                            //     if (!formik.values.amount) {
                            //         formik.setFieldValue("amount", "0.00"); // Keep "$ " in place if empty
                            //     }
                            // }}
                            isInvalid={formik.touched.amount && !!formik.errors.amount}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.amount}</Form.Control.Feedback>
                    </div>
                </div>
                <div className="p-l-0 d-flex align-items-center justify-content-center m-b-5">
                    <div className="d-flex justify-content-center">
                    <Button variant="success" onClick={async ()=>{        
                            const payload = {
                                case_id:getCaseId(),
                                client_id:getClientId(),
                                amount: formik.values.amount,
                                name_on_check: formik.values.name_on_check,
                                check: "False"
                            };
                            const res = await updatePanelApi(payload,"edit-clientproceeds");
                            updateClientProceedStates();
                            handleDisableSaveBtn(false);
                            formik.resetForm();
                    }} 
                        className="height-25" style={{padding:"0px 12px"}} disabled={formik.values.amount=="" || formik.values.name_on_check==""}>
                            Add Check
                        </Button>
                    </div>
                </div>
                
                <div>
                    <div className="litigation-sec-action-bar">
                        <div className="w-100 height-25" style={{ height: "25px" }}>
                            <div className="d-flex justify-content-center align-items-center height-25">
                                <span className='text-uppercase m-l-5 text-white font-weight-bold text-center'>Checks</span>
                            </div>
                        </div>
                    </div>
                    <div className="table--no-card rounded-0 border-0 w-100 proceed-checks-table">
                        <table className="table table-borderless table-striped table-earning settlement-table position-relative">
                            <thead className='position-sticky top-0'>
                                <tr id="settle-tb-header" className="settle-t-4">
                                    <th className=""></th>
                                    <th className="text-left">Name on Check</th>
                                    <th className="td-autosize">Check Amount</th>
                                </tr>
                            </thead>
                            <tbody id="body-table">
                                {checks?.map((check,index)=>                        
                                <tr className="height-25">                  
                                    <td className="">{index + 1}</td>
                                    <td className='provider-col text-left'>{check?.name_on_check}</td>
                                    <td className="monospace-font td-autosize dollar-amount-value text-right" data-value={check?.amount || 0.00}>{currencyFormat(check?.amount || 0.00)}</td>
                                </tr>)
                                }
                                { 
                                !isNaN(total_settlement)  && <tr className="height-25">
                                    <td className="height-25 text-capitalize text-right whitespace-SETTLE primary-clr-25" colSpan={2}>
                                        Total Settlement:
                                    </td>
                                    <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value td-autosize" data-value={total_settlement}>
                                        {currencyFormat(total_settlement)}
                                    </td>
                                </tr>
                                }
                                { 
                                !isNaN(amount_after_lien_deductions)  && <tr className="height-25">
                                    <td className="height-25 text-capitalize text-right whitespace-SETTLE primary-clr-25" colSpan={2}>
                                        Total Client Proceeds:
                                    </td>
                                    <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value td-autosize" data-value={amount_after_lien_deductions}>
                                        {currencyFormat(amount_after_lien_deductions)}
                                    </td>
                                </tr>
                                }

                                { <tr className="height-25">
                                    <td className="height-25 text-capitalize text-right whitespace-SETTLE primary-clr-25" colSpan={2}>
                                        Client Proceeds Remaining to be Distributed:
                                    </td>
                                    <td className="height-25 monospace-font text-right font-weight-bold dollar-amount-value td-autosize" data-value={clientProceedFinalAmount || 0.00}>
                                        {currencyFormat(clientProceedFinalAmount || 0.00)}
                                    </td>
                                </tr>
                                }
                                {
                                    checks?.length < 9 && Array(7 - checks.length).fill(null).map((_, index) => (
                                        <tr key={index}>
                                            <td colSpan={9}></td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
                

            </Form>
        </>
    )
}

export default AddClientProceedPopup