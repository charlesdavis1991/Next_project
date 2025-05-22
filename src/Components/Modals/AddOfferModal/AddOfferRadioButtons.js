import React,{useRef,useEffect,useState} from 'react';
import { Form, Row, Col } from 'react-bootstrap';


const OfferForm = ({ formik, offerCombinations,combination }) => {
    const [selectedLabel1, setSelectedLabel1] = useState("Offeree Name");
    const [selectedIcon1, setSelectedIcon1] = useState(null);
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

    const handleSelection1 = (e,value, label, iconClass) => {
        e.stopPropagation();
        formik.setFieldValue("by_entity", value);
        setSelectedLabel1(label);
        setSelectedIcon1(iconClass);
        setIsOpen1(false);
    };


    const [selectedLabel2, setSelectedLabel2] = useState("Select Offeror");
    const [selectedIcon2, setSelectedIcon2] = useState(null);
    const [isOpen2, setIsOpen2] = useState(false);
    const dropdownRef2 = useRef(null);
    // Close dropdown when clicking outside
    useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setIsOpen2(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);
    const handleDropdownToggle2 = () => {
        setIsOpen2((prev) => !prev);
    };

    const handleSelection2 = (e,value, label, iconClass) => {
        e.stopPropagation();
        
        formik.setFieldValue("entity", value);
        setSelectedLabel2(label);
        setSelectedIcon2(iconClass);
        if(iconClass === "ic-defendants"){
            formik.setFieldValue("by_entity", `${combination?.client?.id},${combination?.client_insurance?.id || -9999}, client`);
            setSelectedLabel1(`${combination?.client?.first_name || ''} ${combination?.client?.last_name || ''}`);
            setSelectedIcon1("ic-client");
        }
        else if(iconClass === "ic-client"){
            formik.setFieldValue("by_entity", `${combination?.defendant?.id},${combination?.defendant_insurance?.id || -9999}, defendant`);
            setSelectedLabel1( 
                combination?.defendant?.defendantType?.name === "Private Individual" 
                ? `${combination?.defendant?.first_name || ''} ${combination?.defendant?.last_name || ''}`
                : `${combination?.defendant?.entity_name || ''}${combination?.defendant_insurance ? ` : ${combination?.defendant_insurance?.company || ''}` : ''}`
            );
            setSelectedIcon1("ic-defendants");
        }
        setIsOpen2(false);
    };
    return (
        <>
        <div className="d-flex m-t-5 m-b-5 align-items-center">
            <span className={`d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 add-offer-input-label text-end ${combination ? "" : "disabled-dropdown"}`}>
                Select Offeror and Offeree:
            </span>

            <div className={`dropdown-container w-50 custom-select-state-entity ${combination ? "" : "disabled-dropdown"}`} ref={dropdownRef2}>
                <div className="form-select form-control d-flex align-items-center height-25  rounded-0" onClick={handleDropdownToggle2} style={{ padding: "0px" }}>
                    {selectedIcon2 && <i className={`ic ic-19 ${selectedIcon2} m-r-5 m-l-10`}></i>}
                    <span className={`${selectedLabel2 ? "color-primary" : "text-grey"}font-weight-semibold`} style={{padding:!selectedIcon2 ? "5px 10px" : ""}}>{selectedLabel2}</span>
                    {isOpen2 && (
                        <ul className="dropdown-list color-primary font-weight-semibold" style={{ marginTop: "25px",top:"0px" }}>
                                <li

                                    onClick={(e) => handleSelection2(
                                        e,
                                        `${combination?.client?.id},${combination?.client_insurance?.id || -9999}, client`,
                                        `${combination?.client?.first_name || ''} ${combination?.client?.last_name || ''}`,
                                        "ic-client"
                                    )}
                                >
                                    <i className={`ic ic-19 ic-client m-r-5`}></i>
                                    {combination?.client?.first_name || ''} {combination?.client?.last_name || ''}
                                    
                                </li>
                                <li

                                    onClick={(e) => handleSelection2(
                                        e,
                                        `${combination?.defendant?.id},${combination?.defendant_insurance?.id || -9999}, defendant`,
                                        combination?.defendant?.defendantType?.name === "Private Individual" 
                                            ? `${combination?.defendant?.first_name || ''} ${combination?.defendant?.last_name || ''}`
                                            : `${combination?.defendant?.entity_name || ''}${combination?.defendant_insurance ? ` : ${combination?.defendant_insurance?.company || ''}` : ''}`,
                                        "ic-defendants"
                                    )}
                                >
                                    <i className={`ic ic-19 ic-defendants m-r-5`}></i>
                                    {combination?.defendant?.defendantType?.name === "Private Individual"
                                        ? `${combination?.defendant?.first_name || ''} ${combination?.defendant?.last_name || ''}`
                                        : `${combination?.defendant?.entity_name || ''}`}
                                    {combination?.defendant_insurance && ` : ${combination?.defendant_insurance?.company || ''}`}
                                </li>

                        </ul>
                    )}
                </div>
            </div>
            <div className={`dropdown-container w-50 ${combination ? "" : "disabled-dropdown"}`} ref={dropdownRef1}>
                <div className="d-flex align-items-center height-25 rounded-0" style={{ padding: "0px",border:"none" }}>
                    {selectedIcon1 && <i className={`ic ic-19 ${selectedIcon1} m-r-5 m-l-10`}></i>}
                    <span className={`${selectedLabel1 ? "color-primary" : "text-grey"}font-weight-semibold`} style={{padding:!selectedIcon1 ? "5px 10px" : ""}}>{selectedLabel1}</span>
                    {/* {isOpen1 && (
                        <ul className="dropdown-list color-primary font-weight-semibold" style={{ marginTop: "25px",top:"0px" }}>
                            {offerCombinations?.defendant_combinations?.map((combination, index) => (
                                <li

                                    onClick={(e) => handleSelection1(
                                        e,
                                        `${combination?.defendant?.id},${combination?.insurance?.id || -9999}, defendant`,
                                        combination?.defendant?.defendantType?.name === "Private Individual" 
                                            ? `${combination?.defendant?.first_name || ''} ${combination?.defendant?.last_name || ''}`
                                            : `${combination?.defendant?.entity_name || ''}${combination?.insurance?.length > 0 ? ` : ${combination?.insurance[0]?.company || ''}` : ''}`,
                                        "ic-defendants"
                                    )}
                                >
                                    <i className={`ic ic-19 ic-defendants m-r-5`}></i>
                                    {combination?.defendant?.defendantType?.name === "Private Individual"
                                        ? `${combination?.defendant?.first_name || ''} ${combination?.defendant?.last_name || ''}`
                                        : `${combination?.defendant?.entity_name || ''}`}
                                    {combination?.insurance?.length > 0 && ` : ${combination?.insurance[0]?.company || ''}`}
                                </li>
                            ))}
                            {offerCombinations?.client_combinations?.map((combination, index) => (
                                <li

                                    onClick={(e) => handleSelection1(
                                        e,
                                        `${combination?.client?.id},${combination?.insurance?.id}, client`,
                                        `${combination?.client?.first_name || ''} ${combination?.client?.last_name || ''} ${combination?.insurance ? ` : ${combination?.insurance?.company || ''}` : ''}`,
                                        "ic-client"
                                    )}
                                >
                                    <i className={`ic ic-19 ic-client m-r-5`}></i>
                                    {combination?.client?.first_name || ''} {combination?.client?.last_name || ''}
                                    {combination?.insurance ? ` : ${combination?.insurance?.company || ''}` : ''}
                                </li>
                            ))}
                        </ul>
                    )}
                    {isOpen1 && (
                        <ul className="dropdown-list text-grey font-weight-semibold" style={{ marginTop: "25px",top:"0px" }}>
                                <li

                                    onClick={(e) => handleSelection1(
                                        e,
                                        `${combination?.defendant?.id},${combination?.defendant_insurance?.id || -9999}, defendant`,
                                        combination?.defendant?.defendantType?.name === "Private Individual" 
                                            ? `${combination?.defendant?.first_name || ''} ${combination?.defendant?.last_name || ''}`
                                            : `${combination?.defendant?.entity_name || ''}${combination?.defendant_insurance ? ` : ${combination?.defendant_insurance?.company || ''}` : ''}`,
                                        "ic-defendants"
                                    )}
                                >
                                    <i className={`ic ic-19 ic-defendants m-r-5`}></i>
                                    {combination?.defendant?.defendantType?.name === "Private Individual"
                                        ? `${combination?.defendant?.first_name || ''} ${combination?.defendant?.last_name || ''}`
                                        : `${combination?.defendant?.entity_name || ''}`}
                                    {combination?.defendant_insurance && ` : ${combination?.defendant_insurance?.company || ''}`}
                                </li>

                                <li

                                    onClick={(e) => handleSelection1(
                                        e,
                                        `${combination?.client?.id},${combination?.client_insurance?.id || -9999}, client`,
                                        `${combination?.client?.first_name || ''} ${combination?.client?.last_name || ''} ${combination?.client_insurance ? ` : ${combination?.client_insurance?.company || ''}` : ''}`,
                                        "ic-client"
                                    )}
                                >
                                    <i className={`ic ic-19 ic-client m-r-5`}></i>
                                    {combination?.client?.first_name || ''} {combination?.client?.last_name || ''}
                                    {combination?.client_insurance ? ` : ${combination?.client_insurance?.company || ''}` : ''}
                                </li>

                        </ul>
                    )} */}
                </div>
            </div>
        </div>
        </>
    );
};

export default OfferForm;
