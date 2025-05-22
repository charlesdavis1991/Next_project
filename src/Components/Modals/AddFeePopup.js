import React, { useEffect,useState,useRef } from "react";
import { Modal, Button, Form, Row, Col} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { currencyFormat } from "../../Utils/helper";
import { getClientId } from "../../Utils/helper";
import { getCaseId } from "../../Utils/helper";
import updatePanelApi from "../SettlementDashboard/api/updatePanelApi";

const AddFeePopup = ({ handleClose, handleDisableSaveBtn, addFeeObj }) => {
    const {initialOffers, feesPercentages, updateFeesState } = addFeeObj;
    const numArray = [10, 15, 20, 25, 30, 33, 35, 40, 45, 50]
    const formik = useFormik({
        initialValues: {
        percentage:"",
        amount:  0.00,
        draft1_checked: false,
        final_checked: false,
        note: "",
        // proceed: ""
        },
        validationSchema: Yup.object({
        percentage: Yup.string(),
        amount: Yup.number()
            .required("Amount is required.")
            .min(0, "Amount must be positive."),
        note: Yup.string().nullable(),
        // proceed: Yup.string(),
        }),
        onSubmit: async (values) => {
        let document_type = []
        if (values.final_checked) document_type.push("final")
        if (values.draft1_checked) document_type.push("draft1")
        const amountPercentage = (values.amount/selectedLabel1?.demand) * 100 || 0.00;
        const payload = {
            check:"False",
            client_id: parseInt(getClientId()),
            case_id: parseInt(getCaseId()),
            amount: `${values.amount}`,
            party_details: "",
            document_type: JSON.stringify(document_type),
            note: values.note,
            percentage:parseFloat(amountPercentage).toFixed(2),
            offer_id:selectedLabel1?.id
        };
        console.log(payload);
        const res = await updatePanelApi(payload,"edit-fees");
        updateFeesState();
        handleClose();
        },
    });

    const handlePercentageChange = (percentage, amount) => {
        formik.setFieldValue("percentage", percentage);
        formik.setFieldValue("amount", amount);
    };

    const handleCustomChange = (customValue) => {
        const calculatedAmount = (feesPercentages[feesPercentages.length - 1] * 2 * customValue) / 100;
        formik.setFieldValue("amount", calculatedAmount);
    };

    const [selectedLabel1, setSelectedLabel1] = useState(null);
    const [isOpen1, setIsOpen1] = useState(false);
    const dropdownRef1 = useRef(null);
    const handleDropdownToggle1 = () => {
        setIsOpen1((prev) => !prev);
    };

    const handleSelection1 = (e,offer) => {  
        e.stopPropagation();
        setSelectedLabel1(offer);
        setIsOpen1(false);
    };
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
                setTimeout(() => {
                    setIsOpen1(false);
                }, 150); // short delay
            }
        };
        
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);
    useEffect(()=>{
        if(!selectedLabel1 || formik.values.amount == "" || formik.values.percentage == ""){
            handleDisableSaveBtn(true);
            return;
        }
        handleDisableSaveBtn(false);

    },[selectedLabel1, formik.values.amount, formik.values.percentage ])
    return (
        <div>
                {   initialOffers?.length == 0 &&
                    <div className='d-flex align-items-center justify-content-center'>
                        <p className='text-uppercase font-weight-semibold' style={{color:"var(--primary) !important"}}>No Initial Offers or Demands Input</p>
                    </div>
                }
                { 
                    initialOffers?.length > 0 &&
                    <div className={`d-flex m-t-5 m-b-5 align-items-center justify-content-center side-padding-100`}>
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 fee-input-label text-end">
                            Select Initial Offer or Demand:
                        </span>
                        <div className="dropdown-container custom-select-state-entity w-100" ref={dropdownRef1}>
                            <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle1} style={{ padding: "0px" }}>
                                <div className={`${selectedLabel1 ? "color-primary" : "text-grey"} font-weight-semibold`} style={{padding:"5px"}}>
                                    <div className="d-flex align-items-center text-grey font-weight-600">
                                        {   
                                            !selectedLabel1 && 
                                            "Select Offeree and Offeror"
                                        }
                                        {   selectedLabel1 &&
                                            <i className={`ic ic-19 ${selectedLabel1?.by_defendant ? "ic-defendants" : "ic-client"} m-r-5`}></i>
                                        }
                                        {   selectedLabel1 &&
                                        
                                            selectedLabel1?.by_defendant?.defendantType ?
                                                selectedLabel1?.by_defendant?.defendantType?.name === "Private Individual" ?
                                                `${selectedLabel1?.by_defendant?.first_name || ''} ${selectedLabel1?.by_defendant?.last_name || ''}` :
                                                `${selectedLabel1?.by_defendant?.entity_name || ''}`
                                            :
                                                `${selectedLabel1?.by_entity_client.first_name || ''} ${selectedLabel1?.by_entity_client.last_name || ''}`
                                        }
                                        &nbsp;
                                        {selectedLabel1 && "To"}
                                        &nbsp;
                                        {   selectedLabel1 &&
                                            <i className={`ic ic-19 ${selectedLabel1?.defendant ? "ic-defendants" : "ic-client"} m-r-5 m-l-5`}></i>
                                        }
                                        {   selectedLabel1 &&
                                            selectedLabel1?.defendant?.defendantType ?
                                                selectedLabel1?.defendant?.defendantType?.name === "Private Individual" ?
                                                `${selectedLabel1?.defendant?.first_name || ''} ${selectedLabel1?.defendant?.last_name || ''}` :
                                                `${selectedLabel1?.defendant?.entity_name || ''}`
                                            :
                                                `${selectedLabel1?.entity_client.first_name || ''} ${selectedLabel1?.entity_client.last_name || ''}`
                                        }
                                        &nbsp;
                                        { selectedLabel1 && "Counter Offer "}
                                        &nbsp; 
                                        { selectedLabel1 &&
                                            currencyFormat(selectedLabel1?.demand)
                                        }
                                    </div>
                                </div>
                                {isOpen1 && (
                                    <ul className="dropdown-list color-primary font-weight-600" style={{ marginTop: "25px",top:"0px" }}>
                                        {initialOffers?.map((offer, index) => (
                                            <li
                                                key={index}
                                                style={{ zIndex: 9999 }}
                                                className='dropdown-list-item'
                                                onMouseDown={(e)=>handleSelection1(e,offer?.offers_list[0])}
                                            >
                                                {   
                                                    !offer?.offers_list[0] && 
                                                    "Select Offeree and Offeror"
                                                }
                                                {   offer?.offers_list[0] &&
                                                    <i className={`ic ic-19 ${offer?.offers_list[0]?.by_defendant ? "ic-defendants" : "ic-client"} m-r-5`}></i>
                                                }
                                                {   offer?.offers_list[0] &&
                                                
                                                offer?.offers_list[0]?.by_defendant ?  offer?.offers_list[0]?.by_defendant?.defendantType?.name === "Private Individual" ? 
                                                `${offer?.offers_list[0]?.by_defendant?.first_name || ''} ${offer?.offers_list[0]?.by_defendant?.last_name || ''}` :
                                                `${offer?.offers_list[0]?.by_defendant?.entity_name || ''}` : `${ offer?.offers_list[0]?.by_entity_client?.first_name } ${ offer?.offers_list[0]?.by_entity_client?.last_name }`
                                                }
                                                &nbsp;
                                                {offer?.offers_list[0] && "To"}
                                                &nbsp;
                                                {   offer?.offers_list[0] &&
                                                    <i className={`ic ic-19 ${offer?.offers_list[0]?.defendant ? "ic-defendants" : "ic-client"} m-r-5 m-l-5`}></i>
                                                }
                                                {   offer?.offers_list[0] &&
                                                    offer?.offers_list[0]?.defendant ?  offer?.offers_list[0]?.defendant?.defendantType?.name === "Private Individual" ? 
                                                    `${offer?.offers_list[0]?.defendant?.first_name || ''} ${offer?.offers_list[0]?.defendant?.last_name || ''}` :
                                                    `${offer?.offers_list[0]?.defendant?.entity_name || ''}` : `${ offer?.offers_list[0]?.entity_client?.first_name } ${ offer?.offers_list[0]?.entity_client?.last_name }`
                                                }
                                                &nbsp;
                                                { offer?.offers_list[0] && "Counter Offer "}
                                                &nbsp; 
                                                { offer?.offers_list[0] &&
                                                    currencyFormat(offer?.offers_list[0]?.demand)
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                }
            <Form className="fee-form side-padding-100" onSubmit={formik.handleSubmit}>
                {/* Percentage Section */}
                <div className={`d-flex ${!selectedLabel1 ? "disabled-dropdown" : ""}`}>
                    <span className="d-inline-block white-space-nowrapping text-grey m-r-5 fee-input-label text-end">
                    Percentage:
                    </span>
                    <div className="d-flex-1" style={{marginLeft:"2px"}}>
                        <div>
                            {numArray.map((percentage, index) => {
                            const percentageAmount = selectedLabel1?.demand ? (selectedLabel1?.demand * percentage) / 100 : 0.00;
                            return (
                                <div
                                key={percentage}
                                className="d-flex align-items-center m-b-5"
                                >
                                <Form.Check
                                    style={{ width: "50%" }}
                                    type="radio"
                                    label={`${percentage}%`}
                                    name="percentage"
                                    className="monospace-font"
                                    value={percentage}
                                    onChange={() =>
                                    handlePercentageChange(percentage, percentageAmount)
                                    }
                                    disabled={!selectedLabel1}
                                    checked={formik.values.percentage == percentage}
                                />
                                <span style={{ width: "50%" }} className="ms-3 monospace-font">{currencyFormat(percentageAmount)}</span>
                                </div>
                            );
                            })}
                            <div className="d-flex align-items-center m-b-5 radio-btn">

                            <Form.Check
                                type="radio"
                                label=""
                                name="percentage"
                                value="custom"
                                disabled={!selectedLabel1}
                                onChange={() => handlePercentageChange("custom", formik.values.amount)}
                                checked={formik.values.percentage === "custom"}
                                className="me-2monospace-font"
                            />
                            <Form.Control
                                type="number"
                                min={0}
                                className="form-control me-2 monospace-font height-25 rounded-0"
                                style={{ width: "80px !important", marginRight: "5px" }}
                                onChange={(e) => handleCustomChange(parseFloat(e.target.value))}
                                disabled={formik.values.percentage !== "custom"}
                            />

                            <span className="monospace-font" style={{ transform: "translateX(165px)" }}>Custom</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Amount Section */}
                <div className={`d-flex m-b-5 amount-btn align-items-center ${!selectedLabel1 ? "disabled-dropdown" : ""}`}>
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 fee-input-label text-end">
                        Amount:
                    </span>
                    <div className="d-flex-1">
                        <div class="d-flex align-items-center">
                            <Form.Control
                                type="text"
                                name="amount"
                                className="monospace-font height-25 rounded-0"
                                value={formik.values.amount ? `$ ${formik.values.amount}` : "$ "}
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
                                    formik.setFieldValue("amount", value || ""); // Update Formik state
                                }}
                                isInvalid={formik.touched.amount && !!formik.errors.amount}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.amount}
                            </Form.Control.Feedback>
                            <div className="d-flex m-l-5">
                                <input
                                    type="checkbox"
                                    name="draft1_checked"
                                    checked={formik.values.draft1_checked} // Bind the value
                                    onChange={(e) => formik.setFieldValue("draft1_checked", e.target.checked)}
                                />
                                <span className='m-l-5 m-r-5'>Draft</span>
                                <input
                                    type="checkbox"
                                    name="final_checked"
                                    checked={formik.values.final_checked} // Bind the value
                                    onChange={(e) => formik.setFieldValue("final_checked", e.target.checked)}
                                />
                                <span className='m-l-5 m-r-5'>Final</span>
                                {/* <Form.Check
                                type="checkbox"
                                className="mr-2"
                                label="Draft"
                                name="draft1_checked"
                                checked={formik.values.draft1_checked} // Bind the value
                                onChange={(e) => formik.setFieldValue("draft1_checked", e.target.checked)}
                                />
                                <Form.Check
                                type="checkbox"
                                label="Final"
                                name="final_checked"
                                checked={formik.values.final_checked} // Bind the value
                                onChange={(e) => formik.setFieldValue("final_checked", e.target.checked)}
                                /> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Note Section */}
                <div className={`d-flex m-b-5 align-items-center ${!selectedLabel1 ? "disabled-dropdown" : ""}`}>
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 fee-input-label text-end">
                        Note:
                    </span>
                    <div className="d-flex-1">
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
        </div>
            
    );
};

export default AddFeePopup;
