import React,{ useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";
import updatePanelApi from '../SettlementDashboard/api/updatePanelApi';
import { getCaseId,getClientId } from '../../Utils/helper';
import SelectStateModal from '../TreatmentPage/modals/state-modal/SelectStateModal';
import axios from 'axios';
import { getToken } from '../../Utils/helper';
import { useSelector } from 'react-redux';

const AddOtherLienPopup = ({handleClose, handleDisableSaveBtn, addOtherLienObj}) => {
    const caseSummary = useSelector((state) => state?.caseData?.summary);
    const { updateOtherLiensStates, updateClientProceedStates } = addOtherLienObj;
    const [statesAbrs, setStatesAbrs] = useState([]); 
    const [stateShow, setStateShow] = useState(false);
    const handleStateShow = () => setStateShow(!stateShow);
    const fetchSatesData = async () => {
        try {
            const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
            const accessToken = getToken();
            const response = await axios.get(`${origin}/api/states/`, {
            headers:{
                Authorization:accessToken,
            }
            });
            if (response.status === 200) {
            setStatesAbrs(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const [state, setState] = useState("");

    const handleStateChange = (state) => {
        setState(state.StateAbr);
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            final: 0.00,
            original: 0.00,
            reduction: 0.00,
            note:""
        },
        validationSchema: Yup.object({
            name: Yup.string(),
            note: Yup.string().nullable(),
            final: Yup.number()
                .required("Final is required")
                .min(0, "Final must be positive"),
            original: Yup.number()
                .required("Original is required")
                .min(0, "Original must be positive"),
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
            amount:parseFloat(transformedValues["final"]),
            original:parseFloat(transformedValues["original"]),
            reduction:parseFloat(transformedValues["reduction"]),
            name:transformedValues["name"],
            note:transformedValues["note"],
        };
        const res = await updatePanelApi(payload,"other-lien/create");
        console.log(res);
        updateOtherLiensStates();
        updateClientProceedStates();
        handleClose();
        },
    });
    useEffect(()=>{
        fetchSatesData();
    },[])
    useEffect(()=>{
        if((formik.values.name == "" || formik.values.original == "" || formik.values.final == "" || formik.values.reduction == "")){
            handleDisableSaveBtn(true);
            return;
        }
        handleDisableSaveBtn(false);

    },[ formik.values.name, formik.values.original, formik.values.final, formik.values.reduction])
    return (  
        <>
        <div className='m-t-15 m-b-15'>
            <span className='d-block text-center text-primary font-weight-600'>Input Additional Liens for the case.</span>
            <span className='d-block text-center text-primary font-weight-600'>These are liens not accounted for in other places on the Settle page.</span>
        </div>
        <div className={`d-flex align-items-center justify-content-center text-uppercase height-25 font-weight-semibold m-b-5 selected-option`}>
            <span className='text-uppercase'>Input Additional Lien For {caseSummary.for_client.first_name} {caseSummary.for_client.last_name}'s Case</span>
        </div>
        <Form className='other-lien-form side-padding-100' onSubmit={formik.handleSubmit}>
            <div className="d-flex m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 other-lien-input-label text-end">
                    Name:
                </span>
                <div className='d-flex-1'>
                    <Form.Control
                        type="text"
                        name="name"
                        className='height-25 rounded-0'
                        {...formik.getFieldProps("name")}
                        isInvalid={formik.touched.name && formik.errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.name}
                    </Form.Control.Feedback>
                </div>
            </div>
            <div className="d-flex m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 other-lien-input-label text-end">
                    First Name:
                </span>
                <div className="d-flex-1 p-r-5">
                    <input
                        type="text"
                        placeholder="Enter First Name"
                        className="form-control rounded-0 height-25"
                    />
                </div>
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 other-lien-input-label text-end">
                    Last Name:
                </span>
                <div className="d-flex-1">
                    <input
                        type="text"
                        placeholder="Enter Last Name"
                        className="form-control rounded-0 height-25"
                    />
                </div>
            </div>


            <div className="d-flex m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 other-lien-input-label text-end">
                    Address 1:
                </span>
                <div className="d-flex-1 p-r-5">
                    <input
                        type="text"
                        placeholder="Enter Address 1"
                        className="form-control rounded-0 height-25"
                    />
                </div>
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 other-lien-input-label text-end">
                    Address 2:
                </span>
                <div className="d-flex-1">
                    <input
                        type="text"
                        placeholder="Enter Address 2"
                        className="form-control rounded-0 height-25"
                    />
                </div>
            </div>

            <div className='d-flex m-b-5 align-items-center'>
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 other-lien-input-label text-end">
                    City:
                </span>
                <div className="d-flex-1 p-r-5">
                    <input
                        type="text"
                        placeholder="Enter city"
                        className="form-control rounded-0 height-25"
                    />
                </div>
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end">
                    State:
                </span>
                <div class="d-flex-1 p-r-5">
                    <div className="position-relative height-25 custom-select-new-provider">
                        <div
                            className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                            onClick={handleStateShow}>
                            <span id="selectedOption">
                            {state ? (
                                <div className="d-flex align-items-center">
                                <svg
                                    style={{
                                    width: "15px",
                                    height: "15px",
                                    fill: "var(--primary-80)",
                                    color: "var(--primary-80)",
                                    stroke: "var(--primary-80)",
                                    }}
                                    className={`icon icon-state-${state}`}
                                >
                                    <use xlinkHref={`#icon-state-${state}`}></use>
                                </svg>
                                {state}
                                </div>
                            ) : (
                                "Select State"
                            )}
                            </span>
                        </div>
                    </div>
                </div>
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end">
                    Zip:
                </span>
                <div className="d-flex-1">
                    <input
                        type="text"
                        placeholder="Zip"
                        className="form-control rounded-0 height-25"
                    />
                </div>
            </div>



            <div className="d-flex m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 other-lien-input-label text-end">
                    Original:
                </span>
                <div className='d-flex-1'>
                <Form.Control
                    type="text"
                    name="original"
                    className="monospace-font height-25 rounded-0"
                    value={formik.values.original ? `$ ${formik.values.original}` : "$ "}
                    onFocus={(e) => {
                        formik.setFieldValue("original", ""); // Clear only the numeric value on click
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

                        formik.setFieldValue("original", value); // Update Formik state
                    }}
                    onBlur={(e) => {
                        if (!formik.values.original) {
                            formik.setFieldValue("original", "0.00"); // Keep "$ " in place if empty
                        }
                    }}
                    isInvalid={formik.touched.original && !!formik.errors.original}
                />
                    <Form.Control.Feedback type="invalid">{formik.errors.original}</Form.Control.Feedback>
                </div>
            </div>

            <div className="d-flex m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 other-lien-input-label text-end">
                Reduction:
                </span>
                <div className='d-flex-1'>
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

            <div className="d-flex m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 other-lien-input-label text-end">
                    Final:
                </span>
                <div className='d-flex-1'>
                <Form.Control
                    type="text"
                    name="final"
                    className="monospace-font height-25 rounded-0"
                    value={formik.values.final ? `$ ${formik.values.final}` : "$ "}
                    onFocus={() => {
                        formik.setFieldValue("final", ""); // Clear only the numeric value on click
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

                        formik.setFieldValue("final", value); // Update Formik state
                    }}
                    onBlur={() => {
                        if (!formik.values.final) {
                            formik.setFieldValue("final", "0.00"); // Keep "$ " in place if empty
                        }
                    }}
                    isInvalid={formik.touched.final && !!formik.errors.final}
                />
                    <Form.Control.Feedback type="invalid">{formik.errors.final}</Form.Control.Feedback>
                </div>
            </div>

            <div className="d-flex m-b-5 align-items-center">
                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 other-lien-input-label text-end">
                    Note:
                </span>
                <div className='d-flex-1'>
                    <Form.Control
                        type="text"
                        name="note"
                        className='height-25 rounded-0'
                        {...formik.getFieldProps("note")}
                        isInvalid={formik.touched.note && formik.errors.note}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.note}
                    </Form.Control.Feedback>
                </div>
            </div>
        </Form> 
        {stateShow && (
            <SelectStateModal
                show={stateShow}
                handleClose={handleStateShow}
                onChange={handleStateChange}
                statesData={statesAbrs}
            />
        )}
        </> 
    )
}

export default AddOtherLienPopup