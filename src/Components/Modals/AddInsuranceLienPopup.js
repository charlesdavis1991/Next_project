import React,{ useState, useEffect, useRef } from 'react'
import { Form, Row, Col  } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";
import updatePanelApi from '../SettlementDashboard/api/updatePanelApi';
import { currencyFormat, getCaseId,getClientId } from '../../Utils/helper';

const AddInsuranceLienPopup = ({handleClose, handleDisableSaveBtn, addInsuranceLienObj}) => {
    const { show, insurances,updateLienStates, hi_paid_total, medpay_total } = addInsuranceLienObj;
    const [selectedLabel1, setSelectedLabel1] = useState(null);
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
    useEffect(()=>{
        if((formik.values.insurance_id == "" || formik.values.totalpaid == "" || formik.values.liens == "" || formik.values.lienfinal == "" || formik.values.reduction == "")){
            handleDisableSaveBtn(true);
            return;
        }
        handleDisableSaveBtn(false);

    },[selectedLabel1, formik.values.totalpaid, formik.values.liens, formik.values.lienfinal, formik.values.reduction])
    return (
        <>
            <div className="d-flex m-b-5 align-items-center side-padding-100 m-t-5">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-lien-amount-input-label text-end">
                    Health Insurance Paid:
                </span>
                <div className="d-flex-1 dollar-amount-value monospace-font" data-value={hi_paid_total}>{currencyFormat(hi_paid_total)}</div>
            </div>
            <div className="d-flex m-b-5 align-items-center side-padding-100">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-lien-amount-input-label text-end">
                    Medical Payments / Personal Injury Protection Paid Total:
                </span>
                <div className="d-flex-1 dollar-amount-value monospace-font" data-value={medpay_total}>{currencyFormat(medpay_total)}</div>
            </div>
            <Form className='insurance-lien-form side-padding-100' onSubmit={formik.handleSubmit}>
                <div className="d-flex m-b-5 align-items-center">
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-lien-input-label text-end">
                        Insurance:
                    </span>
                    <div className='d-flex-1'>
                        <div className="d-flex align-items-center">
                            <div className="dropdown-container custom-select-state-entity" ref={dropdownRef1}>
                                <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle1} style={{ padding: "0px" }}>

                                    {selectedIcon1 && <i className={`ic ic-19 ${selectedIcon1} m-r-5 m-l-10`}></i>}
                                    <span className={`${selectedLabel1 ? "color-primary" : "text-grey"} font-weight-semibold`} style={{padding:!selectedIcon1 ? "5px 10px" : ""}}>
                                        {selectedLabel1 ? selectedLabel1?.trim() : "Select Insurance"}</span>
                                    {selectedIcon2?.trim()!="" && <i className={`ic ic-19 ${selectedIcon2} m-r-5 m-l-5`}></i>}
                                    <span className={`${selectedLabel2 ? "color-primary" : "text-grey"} font-weight-semibold`}>{selectedLabel2?.trim()}</span>
                                    {formik.values.insurance_id!="" && <i className={`ic ic-19 ic-insurance m-r-5 m-l-5`}></i>}
                                    <span className={`${selectedLabel3 ? "color-primary" : "text-grey"} font-weight-semibold`}>{selectedLabel3}</span>
                                    {isOpen1 && (
                                        <ul className="dropdown-list color-primary font-weight-600" style={{ marginTop: "25px",top:"0px" }}>
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
                    </div>
                </div>

                <div className={`d-flex m-b-5 align-items-center ${formik.values.insurance_id == "" ? "disabled-dropdown" : ""}`}>
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-lien-input-label text-end">
                    Total Paid:
                    </span>
                    <div className="d-flex-1">
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
                    </div>
                </div>

                <div className={`d-flex m-b-5 align-items-center ${formik.values.insurance_id == "" ? "disabled-dropdown" : ""}`} >
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-lien-input-label text-end">
                    Liens:
                    </span>
                    <div className="d-flex-1">
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
                    </div>
                </div>

                <div className={`d-flex m-b-5 align-items-center ${formik.values.insurance_id == "" ? "disabled-dropdown" : ""}`}>
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-lien-input-label text-end">
                        Reduction:
                    </span>
                    <div className="d-flex-1">
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
                    </div>
                </div>

                <div className={`d-flex m-b-5 align-items-center ${formik.values.insurance_id == "" ? "disabled-dropdown" : ""}`}>
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-lien-input-label text-end">
                    Final Liens:
                    </span>
                    <div className="d-flex-1">
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
                    </div>
                </div>
            </Form>
        </>
    )
}

export default AddInsuranceLienPopup