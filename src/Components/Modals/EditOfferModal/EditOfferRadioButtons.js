import React,{useRef,useEffect,useState} from 'react';
import { Form, Row, Col } from 'react-bootstrap';


const EditOfferRadioButtons = ({ formik, offerCombinations, selectBy, selectByIcon, selectTo, selectToIcon, offerTab,offerAccepted }) => {
    const [byEntity,setByEntity] = useState(selectBy);
    const [byIcon,setByIcon] = useState(selectByIcon);

    const [selectedLabel1, setSelectedLabel1] = useState("Select By");
    const [selectedIcon1, setSelectedIcon1] = useState("");

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

    const handleSelection1 = (e,value, label, iconClass,type) => {
        e.stopPropagation();
        if(offerTab !== "edit"){
            formik.setFieldValue("by_entity", value);
            setSelectedLabel1(label);
            setSelectedIcon1(iconClass);
            
            if(type=="by"){
                let entityValue = "";
                if(selectTo?.defendant?.id){
                    entityValue = `${selectTo?.defendant?.id},${selectTo?.insurance?.id || -9999}, defendant`
                }   
                else{
                    entityValue= `${selectTo?.client?.id},${selectTo?.insurance?.id}, client`
                }
                formik.setFieldValue("entity", entityValue);
            }
            else if(type=="to"){
                let entityValue = "";
                if(selectBy?.defendant?.id){
                    entityValue = `${selectBy?.defendant?.id},${selectBy?.insurance?.id || -9999}, defendant`
                }   
                else{
                    entityValue= `${selectBy?.client?.id},${selectBy?.insurance?.id}, client`
                }
                formik.setFieldValue("entity", entityValue);
            }
        }
        setIsOpen1(false);
    };

    const [toEntity,setToEntity] = useState(selectTo);
    const [toIcon,setToIcon] = useState(selectToIcon);

    const [selectedLabel2, setSelectedLabel2] = useState(selectTo);
    const [selectedIcon2, setSelectedIcon2] = useState(selectToIcon);
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
        // formik.setFieldValue("entity", value);
        setSelectedLabel2(label);
        setSelectedIcon2(iconClass);
        setIsOpen2(false);
    };


    return (
        <>
        <div className="d-flex m-b-5 align-items-center">
            <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 edit-offer-input-label text-end">
                Select Offeree and Offeror: to Select Offeror:
            </span>
            {
            offerTab == "edit" && 
            <>
                <div className={`dropdown-container w-50 custom-select-state-entity ${offerAccepted ? "disabled-dropdown" : ""}`} ref={dropdownRef2}>
                    <div className="form-select form-control d-flex align-items-center height-25  rounded-0" onClick={handleDropdownToggle2} style={{ padding: "0px" }}>
                        {toIcon && <i className={`ic ic-19 ${toIcon} m-r-5 m-l-10`}></i>}
                        <span className={`${toEntity ? "color-primary" : "text-grey"} font-weight-semibold`} style={{padding:!toIcon ? "5px 10px" : ""}}>
                            {toEntity?.defendant?.defendantType?.name === "Private Individual"
                                ? `${toEntity?.defendant?.first_name || ''} ${toEntity?.defendant?.last_name || ''}`
                                : `${toEntity?.defendant?.entity_name || ''}`}
                            {toEntity?.insurance?.length > 0 && `, ${toEntity?.insurance[0]?.company || ''}`}

                            {toEntity?.client?.first_name || ''} {toEntity?.client?.last_name || ''}
                            {toEntity?.insurance ? `, ${toEntity?.insurance?.company || ''}` : ''}
                        </span>
                        {isOpen2 && (
                            <ul className="dropdown-list color-primary font-weight-600" style={{ marginTop: "25px",top:"0px" }}>
                                {
                                selectToIcon == "ic-defendants" &&    
                                <li
                                        onClick={(e) => handleSelection2(
                                            e,
                                            `${selectTo?.defendant?.id},${selectTo?.insurance?.id || -9999}, defendant`,
                                            selectTo?.defendant?.defendantType?.name === "Private Individual" 
                                                ? `${selectTo?.defendant?.first_name || ''} ${selectTo?.defendant?.last_name || ''}`
                                                : `${selectTo?.defendant?.entity_name || ''}${selectTo?.insurance?.length > 0 ? `, ${selectTo?.insurance[0]?.company || ''}` : ''}`,
                                            "ic-defendants"
                                        )}
                                    >
                                        <i className={`ic ic-19 ic-defendants m-r-5`}></i>
                                        {selectTo?.defendant?.defendantType?.name === "Private Individual"
                                            ? `${selectTo?.defendant?.first_name || ''} ${selectTo?.defendant?.last_name || ''}`
                                            : `${selectTo?.defendant?.entity_name || ''}`}
                                        {selectTo?.insurance?.length > 0 && `, ${selectTo?.insurance[0]?.company || ''}`}
                                    </li>
                                }
                                {
                                selectToIcon == "ic-client" &&    <li
                                        onClick={(e) => handleSelection2(
                                            e,
                                            `${selectTo?.client?.id},${selectTo?.insurance?.id}, client`,
                                            `${selectTo?.client?.first_name || ''} ${selectTo?.client?.last_name || ''} ${selectTo?.insurance ? `, ${selectTo?.insurance?.company || ''}` : ''}`,
                                            "ic-client"
                                        )}
                                    >
                                        <i className={`ic ic-19 ic-client m-r-5`}></i>
                                        {selectTo?.client?.first_name || ''} {selectTo?.client?.last_name || ''}
                                        {selectTo?.insurance ? `, ${selectTo?.insurance?.company || ''}` : ''}
                                    </li>
                                }
                            </ul>
                        )}
                    </div>
                </div>
            </>
            }
            <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end m-l-5">
                Select Offeree:
            </span>
            <div className={`dropdown-container w-50 custom-select-state-entity ${offerAccepted ? "disabled-dropdown" : ""}`} ref={dropdownRef1}>
                <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle1} style={{ padding: "0px" }}>
                    {offerTab !== "edit" && selectedIcon1 && <i className={`ic ic-19 ${selectedIcon1} m-r-5 m-l-10`}></i>}
                    {offerTab == "edit" && byIcon && <i className={`ic ic-19 ${byIcon} m-r-5 m-l-10`}></i>}
                    {       offerTab == "edit" &&             
                        <span className={`${byEntity ? "color-primary" : "text-grey"} font-weight-semibold`} style={{padding: !byIcon ? "5px 10px" : ""}}>
                        { (byEntity?.defendant?.defendantType?.name === "Private Individual"
                            ? `${byEntity?.defendant?.first_name || ''} ${byEntity?.defendant?.last_name || ''}`
                            : `${byEntity?.defendant?.entity_name || ''}`)}
                        { (byEntity?.insurance?.length > 0 && `, ${byEntity?.insurance[0]?.company || ''}`)}

                        { byEntity?.client?.first_name || ''} {byEntity?.client?.last_name || ''}
                        { byEntity?.insurance ? ` ${byEntity?.insurance?.company ? `, ${byEntity?.insurance?.company}` : ''}` : ''}
                        </span>
                    }
                    {   offerTab !== "edit" &&
                        <span style={{padding:offerTab == "edit" ? !byIcon : !selectedIcon1 ? "5px 10px" : ""}}>
                            {offerTab !== "edit" && selectedLabel1}
                        </span>
                    }

                    {isOpen1 && (
                        <ul className="dropdown-list color-primary font-weight-600" style={{ marginTop: "25px",top:"0px" }}>
                            {
                                selectByIcon == "ic-defendants" && 
                                <li
                                    onClick={(e) => handleSelection1(
                                        e,
                                        `${selectBy?.defendant?.id},${selectBy?.insurance?.id || -9999}, defendant`,
                                        selectBy?.defendant?.defendantType?.name === "Private Individual" 
                                            ? `${selectBy?.defendant?.first_name || ''} ${selectBy?.defendant?.last_name || ''}`
                                            : `${selectBy?.defendant?.entity_name || ''}${selectBy?.insurance?.length > 0 ? `, ${selectBy?.insurance[0]?.company || ''}` : ''}`,
                                        "ic-defendants",
                                        "by"
                                    )}
                                >
                                    <i className={`ic ic-19 ic-defendants m-r-5`}></i>
                                    {selectBy?.defendant?.defendantType?.name === "Private Individual"
                                        ? `${selectBy?.defendant?.first_name || ''} ${selectBy?.defendant?.last_name || ''}`
                                        : `${selectBy?.defendant?.entity_name || ''}`}
                                    {selectBy?.insurance?.length > 0 && `, ${selectBy?.insurance[0]?.company || ''}`}
                                </li>
                            }
                            {
                                selectByIcon == "ic-client" &&   <li
                                    onClick={(e) => handleSelection1(
                                        e,
                                        `${selectBy?.client?.id},${selectBy?.insurance?.id}, client`,
                                        `${selectBy?.client?.first_name || ''} ${selectBy?.client?.last_name || ''} ${selectBy?.insurance ? `, ${selectBy?.insurance?.company || ''}` : ''}`,
                                        "ic-client",
                                        "by"
                                    )}
                                >
                                    <i className={`ic ic-19 ic-client m-r-5`}></i>
                                    {selectBy?.client?.first_name || ''} {selectBy?.client?.last_name || ''}
                                    {selectBy?.insurance ? `, ${selectBy?.insurance?.company || ''}` : ''}
                                </li>
                            }
                            {
                            offerTab !== "edit" && selectToIcon == "ic-defendants" &&    
                            <li
                                    onClick={(e) => handleSelection1(
                                        e,
                                        `${selectTo?.defendant?.id},${selectTo?.insurance?.id || -9999}, defendant`,
                                        selectTo?.defendant?.defendantType?.name === "Private Individual" 
                                            ? `${selectTo?.defendant?.first_name || ''} ${selectTo?.defendant?.last_name || ''}`
                                            : `${selectTo?.defendant?.entity_name || ''}${selectTo?.insurance?.length > 0 ? `, ${selectTo?.insurance[0]?.company || ''}` : ''}`,
                                        "ic-defendants",
                                        "to"
                                    )}
                                >
                                    <i className={`ic ic-19 ic-defendants m-r-5`}></i>
                                    {selectTo?.defendant?.defendantType?.name === "Private Individual"
                                        ? `${selectTo?.defendant?.first_name || ''} ${selectTo?.defendant?.last_name || ''}`
                                        : `${selectTo?.defendant?.entity_name || ''}`}
                                    {selectTo?.insurance?.length > 0 && `, ${selectTo?.insurance[0]?.company || ''}`}
                                </li>
                            }
                            {
                            offerTab !== "edit" && selectToIcon == "ic-client" &&    <li
                                    onClick={(e) => handleSelection1(
                                        e,
                                        `${selectTo?.client?.id},${selectTo?.insurance?.id}, client`,
                                        `${selectTo?.client?.first_name || ''} ${selectTo?.client?.last_name || ''} ${selectTo?.insurance ? `, ${selectTo?.insurance?.company || ''}` : ''}`,
                                        "ic-client",
                                        "to"
                                    )}
                                >
                                    <i className={`ic ic-19 ic-client m-r-5`}></i>
                                    {selectTo?.client?.first_name || ''} {selectTo?.client?.last_name || ''}
                                    {selectTo?.insurance ? `, ${selectTo?.insurance?.company || ''}` : ''}
                                </li>
                            }
                        </ul>
                    )}
                </div>
            </div>

        </div>
        </>
    );
};

export default EditOfferRadioButtons;
