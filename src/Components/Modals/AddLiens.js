import React,{ useState, useEffect, useRef } from 'react'
import { Modal, Button, Form, Row, Col  } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";
import updatePanelApi from '../SettlementDashboard/api/updatePanelApi';
import { currencyFormat, getCaseId,getClientId } from '../../Utils/helper';

const AddLiens = ({show,handleClose,insurances,updateLienStates,hi_paid_total,medpay_total}) => {
        const [selectedLabel1, setSelectedLabel1] = useState("Select Insurance");
        const [selectedLabel2, setSelectedLabel2] = useState("");
        const [selectedLabel3, setSelectedLabel3] = useState("");
        const [selectedIcon1, setSelectedIcon1] = useState(null);
        const [selectedIcon2, setSelectedIcon2] = useState(null);
        const [isOpen1, setIsOpen1] = useState(false);
        const dropdownRef1 = useRef(null);
        // Close dropdown when clicking outside
        useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
            setIsOpen1(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
        }, []);
        const handleDropdownToggle1 = () => {
            setIsOpen1((prev) => !prev);
        };
    
        const handleSelection1 = (e,value, label1, label2, label3, iconClass1,iconClass2) => {
            e.stopPropagation();
            formik.setFieldValue("insurance_id", value);
            setSelectedLabel1(label1);
            setSelectedLabel2(label2);
            setSelectedLabel3(label3);
            setSelectedIcon1(iconClass1);
            setSelectedIcon2(iconClass2);
            setIsOpen1(false);
        };
    
    const formik = useFormik({
        initialValues: {
            insurance_id: "",
            totalpaid: 0.00,
            liens: 0.00,
            lienfinal: 0.00,
            reduction: 0.00,
        },
        validationSchema: Yup.object({
            insurance_id: Yup.string(),
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
            case_id: getCaseId(),
            client_id:getClientId(),
            ...transformedValues,
        };
        const res = await updatePanelApi(payload,"insurance-lien/create");
        console.log(res);
        updateLienStates();
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
            dialogClassName="custom-insurance-dialog justify-content-center "
            >

                <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Add Insurance Lien</div></div>
                    <Modal.Body style={{padding:"5px"}}>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group controlId="insurances" className="row">
                            <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0'>
                                Insurance
                            </Form.Label>
                            <Col sm={10}>
                            {/* <Form.Control
                                as="select"
                                name="insurance_id"
                                value={formik.values.insurance_id}
                                {...formik.getFieldProps("insurance_id")}
                                isInvalid={formik.touched.insurance_id && !!formik.errors.insurance_id}
                            >
                                <option value="" disabled>
                                    Select Insurance
                                </option>
                                {insurances?.map((insurance, index) => (
                                <option
                                    key={index}
                                    value={`${insurance?.id}`}
                                >
                                    {insurance?.company} {insurance?.insurance_type}
                                </option>
                                ))}
                            </Form.Control> */}
                            <div className="d-flex align-items-center">
                                <div className="dropdown-container custom-select-state-entity" ref={dropdownRef1}>
                                    <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle1} style={{ padding: "0px" }}>

                                        {selectedIcon1 && <i className={`ic ic-19 ${selectedIcon1} m-r-5 m-l-10`}></i>}
                                        <span style={{padding:!selectedIcon1 ? "5px 10px" : ""}}>{selectedLabel1?.trim()}</span>
                                        {selectedIcon2?.trim()!="" && <i className={`ic ic-19 ${selectedIcon2} m-r-5 m-l-5`}></i>}
                                        <span >{selectedLabel2?.trim()}</span>
                                        {formik.values.insurance_id!="" && <i className={`ic ic-19 ic-insurance m-r-5 m-l-5`}></i>}
                                        <span >{selectedLabel3}</span>
                                        {isOpen1 && (
                                            <ul className="dropdown-list" style={{ marginTop: "25px",top:"0px" }}>
                                                {insurances?.map((insurance, index) => (
                                                    <>
                                                    {insurance?.insurance_lien_count < 1 ? 
                                                    <li
                                                        key={index}
                                                        onClick={(e) => handleSelection1(
                                                            e,
                                                            `${insurance?.id}`,
                                                            `${insurance?.for_client?.first_name || ''} ${insurance?.for_client?.last_name || ''}`,
                                                            `${insurance?.defendant_liability_insurance_id[0]?.first_name || ''} ${insurance?.defendant_liability_insurance_id[0]?.last_name || ''}`,
                                                            `${insurance?.insurance_type || ''} : ${ insurance?.company || ''}`,
                                                            insurance?.for_client ? "ic-client" : "",
                                                            insurance?.defendant_liability_insurance_id.length > 0 ? "ic-defendants" : ""
                                                        )}
                                                    >
                                                        
                                                        {insurance?.for_client && 
                                                        <>
                                                            {insurance?.for_client?.profile_pic_19 ? <img src={insurance?.for_client?.profile_pic_19} className='ic-19'/> :
                                                            <>
                                                            <div class="icon-container" style={{ display: 'flex', height: '19px', width: '19px', marginRight: '5px' }}>
                                                                <i class="height-i-25 ic ic-client-avatar"></i>
                                                                <div class="border-overlay"></div>
                                                            </div>
                                                            </>
                                                            }
                                                            <span>{insurance?.for_client?.first_name} {insurance?.for_client?.last_name}</span>
                                                        </>
                                                        }
                                                        {insurance?.defendant_liability_insurance_id.length > 0 && 
                                                        <>
                                                            <i className={`ic ic-19 ic-defendants m-r-5 m-l-5`}></i>
                                                            <span>{insurance?.defendant_liability_insurance_id[0]?.first_name} {insurance?.defendant_liability_insurance_id[0]?.last_name}</span>
                                                        </>
                                                        }
                                                        <i className={`ic ic-19 ic-insurance m-r-5 m-l-5`}></i>
                                                        <span> {insurance?.insurance_type || ''} : { insurance?.company || ''} </span>
                                                        
                                                    </li> :
                                                    <li key={index} className='gray-list-item'>
                                                        {insurance?.for_client && 
                                                        <>
                                                            {insurance?.for_client?.profile_pic_19 ? <img src={insurance?.for_client?.profile_pic_19} className='ic-19'/> :
                                                            <>
                                                            <div class="icon-container" style={{ display: 'flex', height: '19px', width: '19px', marginRight: '5px' }}>
                                                                <i class="height-i-25 ic ic-client-avatar"></i>
                                                                <div class="border-overlay"></div>
                                                            </div>
                                                            </>
                                                            }
                                                            <span>{insurance?.for_client?.first_name} {insurance?.for_client?.last_name}</span>
                                                        </>
                                                        }
                                                        {insurance?.defendant_liability_insurance_id.length > 0 && 
                                                        <>
                                                            <i className={`ic ic-19 ic-defendants m-r-5 m-l-5`}></i>
                                                            <span>{insurance?.defendant_liability_insurance_id[0]?.first_name} {insurance?.defendant_liability_insurance_id[0]?.last_name}</span>
                                                        </>
                                                        }
                                                        <i className={`ic ic-19 ic-insurance m-r-5 m-l-5`}></i>
                                                        <span> {insurance?.insurance_type || ''} : { insurance?.company || ''} </span>
                                                    </li>
                                                    }
                                                    </>

                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.insurance_id}
                            </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="m-b-5 align-items-center">
                            <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0'>
                            HI Paid Total:
                            </Form.Label>
                            <Col sm={10} className="p-l-25 monospace-font d-flex align-items-center height-25 rounded-0 height-25 rounded-0">{currencyFormat(hi_paid_total)}</Col>
                        </Form.Group>
                        <Form.Group as={Row} className="m-b-5 align-items-center">
                            <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0'>
                            Medpay/Pip Total:
                            </Form.Label>
                            <Col sm={10} className="p-l-25 monospace-font d-flex align-items-center height-25 rounded-0 height-25 rounded-0">{currencyFormat(medpay_total)}</Col>
                        </Form.Group>

                        <Form.Group as={Row} className="m-b-5">
                            <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0'>
                            Total Paid:
                            </Form.Label>
                            <Col sm={10} className="p-l-15">
                            <Form.Control
                                type="text"
                                name="totalpaid"
                                className="monospace-font height-25 rounded-0 height-25 rounded-0"
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

                        <Form.Group as={Row} className="m-b-5" >
                            <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0'>
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
                            <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0'>
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
                            <Form.Label column sm={2} className='whitespace-SETTLE p-t-0 p-b-0'>
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
                        <div className="d-flex justify-content-between">
                            <div>
                                <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                                Cancel
                                </Button>
                            </div>
                            <div>
                                <Button variant='success' type="submit" disabled={(formik.values.insurance_id == "" || formik.values.totalpaid == "" || formik.values.liens == "" || formik.values.lienfinal == "" || formik.values.reduction == "")} className="m-l-5 bg-success height-25" style={{padding:"0px 12px"}}>
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

export default AddLiens