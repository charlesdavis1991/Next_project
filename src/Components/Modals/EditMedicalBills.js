import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import chevronRight from '../../../public/BP_resources/images/icon/chevron_right.svg'
import deletePanelEntity from '../SettlementDashboard/api/deletePanelEntity';
import updatePanelApi from '../SettlementDashboard/api/updatePanelApi';
import { currencyFormat } from '../../Utils/helper';

const EditMedicalBills = ({show,handleClose,setData, medicalBill,updateMedicalStates}) => {
    const formik = useFormik({
        initialValues: {
            amount: parseFloat(medicalBill.amount || 0.0).toFixed(2),
            ins_paid: parseFloat(medicalBill.ins_paid || 0.0).toFixed(2),
            write_off: parseFloat(medicalBill.write_off || 0.0).toFixed(2),
            medpaypaip: parseFloat(medicalBill.medpaypaip || 0.0).toFixed(2),
            reduction: parseFloat(medicalBill.reduction || 0.0).toFixed(2),
            patient_paid: parseFloat(medicalBill.patient_paid || 0.0).toFixed(2),
            liens: parseFloat(medicalBill.liens || 0.0).toFixed(2),
        },
        validationSchema: Yup.object({
            amount: Yup.number()
                .required("Amount is required")
                .min(0, "Amount must be positive"),
            ins_paid: Yup.number()
                .required("INS PAID is required")
                .min(0, "INS PAID must be positive"),
            write_off: Yup.number()
                .required("Write-off is required")
                .min(0, "Write-off must be positive"),
            medpaypaip: Yup.number()
                .required("MedPayPaip is required")
                .min(0, "MedPayPaip must be positive"),
            reduction: Yup.number()
                .required("Reduction is required")
                .min(0, "Reduction must be positive"),
            patient_paid: Yup.number()
                .required("Patient-Paid is required")
                .min(0, "Patient-Paid must be positive"),
            liens: Yup.number()
                .required("Liens is required")
                .min(0, "Liens must be positive"),
        }),
        onSubmit: async (values) => {
            // Convert all values to strings
        const transformedValues = Object.fromEntries(
            Object.entries(values).map(([key, value]) => [key, value.toString()])
        );

        const payload = {
            check: medicalBill?.id, // Keep 'check' as it is
            ...transformedValues, // Use the transformed values
        };
        const res = await updatePanelApi(payload, "edit-medical-bill");
        console.log(res);
        // // Update the state with the updated medical bill
        // setData((prevData) =>
        //     prevData.map((bill) =>
        //         bill.id === res.data.id ? res.data : bill
        //     )
        // );
        updateMedicalStates();
        handleClose();
        },
    });

    const handleDeleteMedBill = async (id, panel) => {
        const payload = {
        panel_name: panel,
        record_id: id,
        };
        const res = await deletePanelEntity(payload);
        updateMedicalStates();
        handleClose();
    };

    useEffect(() => {
        if (medicalBill && show) {
        // Only update values when the modal opens
        formik.setValues({
            amount: parseFloat(medicalBill.amount || 0.0).toFixed(2),
            ins_paid: parseFloat(medicalBill.ins_paid || 0.0).toFixed(2),
            write_off: parseFloat(medicalBill.write_off || 0.0).toFixed(2),
            medpaypaip: parseFloat(medicalBill.medpaypaip || 0.0).toFixed(2),
            reduction: parseFloat(medicalBill.reduction || 0.0).toFixed(2),
            patient_paid: parseFloat(medicalBill.patient_paid || 0.0).toFixed(2),
            liens: parseFloat(medicalBill.liens || 0.0).toFixed(2),
        });
        }
    }, [medicalBill, show]); // Re-run when `medicalBill` or `show` changes

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
        <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Edit Medical Bills</div></div>
        
            <Modal.Body style={{padding:"5px"}}>
            <Form onSubmit={formik.handleSubmit}>
            {/* <span>{medicalBill.checkID && "Check Request has been submitted no edits can be made."}</span> */}
                <Form.Group as={Row} className="">
                    <Form.Label column sm={3} className="p-t-0 p-b-0 text-grey">
                    Original Bill:
                    </Form.Label>
                    <Col sm={9} className="p-l-15 d-flex justify-content-between align-items-center">
                    <Form.Control
                        type="text"
                        name="amount"
                        className="monospace-font text-end med-bill-input height-25 rounded-0"
                        value={formik.values.amount ? `$ ${formik.values.amount}` : "$ "}
                        onFocus={(e) => {
                            formik.setFieldValue("amount", ""); // Clear only the numeric value on click
                            const calculateLiens = () => {
                                return (parseFloat( 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
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
                            const calculateLiens = () => {
                                return (parseFloat(value || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
                        }}
                        onBlur={(e) => {
                            if (!formik.values.amount) {
                                formik.setFieldValue("amount", "0.00"); // Keep "$ " in place if empty

                            }
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
                        }}
                        isInvalid={formik.touched.amount && !!formik.errors.amount}
                    />
                    <div>
                        <img src={chevronRight} className='ic-19' />
                    </div>
                    <span className='monospace-font text-end med-bill-input'>{currencyFormat(formik.values.amount)}</span>
                        <Form.Control.Feedback type="invalid">{formik.errors.amount}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-t-5">
                    <Form.Label column sm={3} className='whitespace-SETTLE p-t-0 p-b-0 text-grey'>
                    Insurance Paid:
                    </Form.Label>
                    <Col sm={9} className="p-l-15 d-flex justify-content-between align-items-center">
                    <Form.Control
                        type="text"
                        name="ins_paid"
                        className="monospace-font text-end med-bill-input height-25 rounded-0"
                        value={formik.values.ins_paid ? `$ ${formik.values.ins_paid}` : "$ "}
                        onFocus={() => {
                            formik.setFieldValue("ins_paid", ""); // Clear only the numeric value on click
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - ( parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
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

                            formik.setFieldValue("ins_paid", value); // Update Formik state
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(value || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
                        }}
                        onBlur={() => {
                            if (!formik.values.ins_paid) {
                                formik.setFieldValue("ins_paid", "0.00"); // Keep "$ " in place if empty

                            }
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
                        }}
                        isInvalid={formik.touched.ins_paid && !!formik.errors.ins_paid}
                    />
                    <div>
                        <img src={chevronRight} className='ic-19' />
                    </div>
                    <span className='monospace-font text-end med-bill-input'>{currencyFormat(formik.values.ins_paid)}</span>
                        <Form.Control.Feedback type="invalid">{formik.errors.ins_paid}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-t-5">
                    <Form.Label column sm={3} className="p-t-0 p-b-0 text-grey">
                    Ins. Write-off:
                    </Form.Label>
                    <Col sm={9} className="p-l-15 d-flex justify-content-between align-items-center">
                    <Form.Control
                        type="text"
                        name="write_off"
                        className="monospace-font text-end med-bill-input height-25 rounded-0"
                        value={formik.values.write_off ? `$ ${formik.values.write_off}` : "$ "}
                        onFocus={() => {
                            formik.setFieldValue("write_off", ""); // Clear only the numeric value on click
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
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

                            formik.setFieldValue("write_off", value); // Update Formik state
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(value || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
                        }}
                        onBlur={() => {
                            if (!formik.values.write_off) {
                                formik.setFieldValue("write_off", "0.00"); // Keep "$ " in place if empty

                            }
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
                        }}
                        isInvalid={formik.touched.write_off && !!formik.errors.write_off}
                    />
                    <div>
                        <img src={chevronRight} className='ic-19' />
                    </div>
                    <span className='monospace-font text-end med-bill-input'>{currencyFormat(formik.values.write_off)}</span>
                        <Form.Control.Feedback type="invalid">{formik.errors.write_off}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-t-5">
                    <Form.Label column sm={3} className="p-t-0 p-b-0 text-grey">
                    MedPay / Pip:
                    </Form.Label>
                    <Col sm={9} className="p-l-15 d-flex justify-content-between align-items-center">
                    <Form.Control
                        type="text"
                        name="medpaypaip"
                        className="monospace-font text-end med-bill-input height-25 rounded-0"
                        value={formik.values.medpaypaip ? `$ ${formik.values.medpaypaip}` : "$ "}
                        onFocus={() => {
                            formik.setFieldValue("medpaypaip", ""); // Clear only the numeric value on click
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
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

                            formik.setFieldValue("medpaypaip", value); // Update Formik state
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(value || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
                        }}
                        onBlur={() => {
                            if (!formik.values.medpaypaip) {
                                formik.setFieldValue("medpaypaip", "0.00"); // Keep "$ " in place if empty

                            }
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
                        }}
                        isInvalid={formik.touched.medpaypaip && !!formik.errors.medpaypaip}
                    />
                    <div>
                        <img src={chevronRight} className='ic-19' />
                    </div>
                    <span className='monospace-font text-end med-bill-input'>{currencyFormat(formik.values.medpaypaip)}</span>
                        <Form.Control.Feedback type="invalid">{formik.errors.medpaypaip}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-t-5">
                    <Form.Label column sm={3} className="p-t-0 p-b-0 text-grey">
                    Client Paid:
                    </Form.Label>
                    <Col sm={9} className="p-l-15 d-flex justify-content-between align-items-center">
                    <Form.Control
                        type="text"
                        name="patient_paid"
                        className="monospace-font text-end med-bill-input height-25 rounded-0"
                        value={formik.values.patient_paid ? `$ ${formik.values.patient_paid}` : "$ "}
                        onFocus={() => {
                            formik.setFieldValue("patient_paid", ""); // Clear only the numeric value on click
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
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

                            formik.setFieldValue("patient_paid", value); // Update Formik state
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(value || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
                        }}
                        onBlur={() => {
                            if (!formik.values.patient_paid) {
                                formik.setFieldValue("patient_paid", "0.00"); // Keep "$ " in place if empty

                            }
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
                        }}
                        isInvalid={formik.touched.patient_paid && !!formik.errors.patient_paid}
                    />
                    <div>
                        <img src={chevronRight} className='ic-19' />
                    </div>
                    <span className='monospace-font text-end med-bill-input'>{currencyFormat(formik.values.patient_paid)}</span>
                        <Form.Control.Feedback type="invalid">{formik.errors.patient_paid}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-t-5">
                    <Form.Label column sm={3} className="p-t-0 p-b-0 text-grey">
                    Reduction:
                    </Form.Label>
                    <Col sm={9} className="p-l-15 d-flex justify-content-between align-items-center">
                    <Form.Control
                        type="text"
                        name="reduction"
                        className="monospace-font text-end med-bill-input height-25 rounded-0"
                        value={formik.values.reduction ? `$ ${formik.values.reduction}` : "$ "}
                        onFocus={() => {
                            formik.setFieldValue("reduction", ""); // Clear only the numeric value on click
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
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
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(value || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
                        }}
                        onBlur={() => {
                            if (!formik.values.reduction) {
                                formik.setFieldValue("reduction", "0.00"); // Keep "$ " in place if empty
                            }
                            const calculateLiens = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.reduction || 0)));
                            };
                            formik.setFieldValue("liens", calculateLiens());
                        }}
                        isInvalid={formik.touched.reduction && !!formik.errors.reduction}
                    />
                    <span className='color-primary'>Calculated: </span>
                    <span className='monospace-font text-end med-bill-input'>{currencyFormat(formik.values.reduction)}</span>
                        <Form.Control.Feedback type="invalid">{formik.errors.reduction}</Form.Control.Feedback>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} className="m-t-5 m-b-5">
                    <Form.Label column sm={3} className="p-t-0 p-b-0 text-grey">
                        Lien:
                    </Form.Label>
                    <Col sm={9} className="p-l-15 d-flex justify-content-between align-items-center">
                        <span className='monospace-font text-end med-bill-input' style={{paddingRight:"12px"}}>
                            {currencyFormat(parseFloat(formik.values.liens || 0))}
                        </span>
                        <Form.Control
                        type="text"
                        name="liens"
                        className="monospace-font text-end med-bill-input height-25 rounded-0"
                        value={formik.values.liens ? `$ ${formik.values.liens}` : "$ "}
                        onFocus={() => {
                            formik.setFieldValue("liens", ""); // Clear only the numeric value on click
                            const calculateReduction = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0)));
                            };
                            formik.setFieldValue("reduction", calculateReduction());
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

                            const calculateReduction = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(value || 0)));
                            };
                            formik.setFieldValue("reduction", calculateReduction());
                        }}
                        onBlur={() => {
                            if (!formik.values.liens) {
                                formik.setFieldValue("liens", "0.00"); // Keep "$ " in place if empty
                            }
                            const calculateReduction = () => {
                                return (parseFloat(formik.values.amount || 0) - (parseFloat(formik.values.ins_paid || 0) + parseFloat(formik.values.write_off || 0) + parseFloat(formik.values.medpaypaip || 0) + parseFloat(formik.values.patient_paid || 0) + parseFloat(formik.values.liens || 0)));
                            };
                            formik.setFieldValue("reduction", calculateReduction());
                        }}
                        isInvalid={formik.touched.liens && !!formik.errors.liens}
                    />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.liens}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center">
                    {/* <Button variant="danger" onClick={()=>handleDeleteMedBill(medicalBill.id,"Providers")}>
                        Delete
                    </Button> */}
                    <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                        Cancel
                        </Button>
                    <div>
                    <div>

                        <Button variant='success' type="submit" disabled={(formik.values.amount == "" || formik.values.ins_paid == "" || formik.values.write_off == "" || formik.values.medpaypaip == "" || formik.values.reduction == "" || formik.values.patient_paid == "")} className="m-l-5 bg-success height-25" style={{padding:"0px 12px"}}>
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

export default EditMedicalBills;
