import React, { useEffect, useState } from "react";
import { dateCustom } from "../../Utils/date";
import Button from "./shared/button";
import check from "../../../public/BP_resources/images/icon/checkmark.svg";
import activeEmail from "../../../public/BP_resources/images/icon/emailactive.svg";
import mail from "../../../public/BP_resources/images/icon/mailbox.svg";
import "../../../public/BP_resources/css/client-main.css"
import "../../../public/BP_resources/css/client-4.css";

const ContactInfo = ({ headingToShow, data, type, buttonText, buttonStyleClass, modalButtonShowValue, modalEditShowValue, modalToShow, topMargin, primary_phone, primary_email_id, mail_contact_id }) => {
    const handleButtonShowModal = () => {
        modalButtonShowValue(true);
    }

    const handleEditShowModal = () => {
        modalEditShowValue(true);
    }

    // Formating phone number if exist
    const formatPhoneNumber = (number) => {
        if (!number) return null;
        const areaCode = number.slice(0, 3);
        const firstPart = number.slice(3, 6);
        const secondPart = number.slice(6);
        return `(${areaCode}) ${firstPart}-${secondPart}`;
    };

    const truncateName = (item, truncate_size = 12) => {



        if (item && item.length > truncate_size) {
            return <span title={item}>
                {item.slice(0, truncate_size - 2) + "..."}
            </span>
        }
        else if (item) {
            return <span>{item}</span>;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '');
        const day = String(date.getDate()).padStart(2, '');
        return `${month}/${day}/${year}`;
    };

    const renderPhoneNumbers = (phone_numbers) => {
        const [primaryPhoneShow, setPrimaryPhoneShow] = useState(null);

        useEffect(() => {
            const matchedPhone = phone_numbers?.find(phone => phone?.currentId === primary_phone);
            if (matchedPhone) {
                setPrimaryPhoneShow(matchedPhone.phone_number);
            }
        }, [phone_numbers, primary_phone]);

        return (
            <div
                className="client-contact-phone-col height-63 text-left"
                onClick={handleEditShowModal}
            >
                {phone_numbers?.map((item, index) => (
                    <div key={index} className="client-identification-row">
                        <div className="col-value colFonts min-h-0 mb-0 height-21 d-flex">
                            {item?.phone_number ? (
                                <>
                                    <div className="colFonts text-left col-title-image min-h-0 mb-0">
                                        {item?.phone_number}
                                    </div>
                                    <div className="col-value colFonts min-h-0 mb-0 ">
                                        {item?.phone_number === primary_phone?.phone_number && item?.currentId === primary_phone?.primary_id && (
                                            <img src={check} alt='primary' className="ic-19 ml-2" />
                                        )}
                                    </div>
                                </>
                            ) : (
                                <span className="text-primary-20">(###) ###-####</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };


    const renderEmailAddresses = (Emails) => {
        const [primaryEmailShow, setPrimaryEmailShow] = useState(null);

        useEffect(() => {
            const matchedEmail = Emails?.find(email => email?.currentId === primary_email_id);
            if (matchedEmail) {
                setPrimaryEmailShow(matchedEmail?.email);
            }
        }, [Emails, primary_email_id]);
        return (
            <div
                className="client-emails_block height-63 text-left"
                onClick={handleEditShowModal}
            >
                {Emails?.map((item, index) => (
                    <div key={index} className="client-identification-row-email">
                        <div className="col-value colFonts min-h-0 mb-0 height-21 d-flex" >
                            {item?.email ? (
                                <>
                                    <div className="colFonts text-left col-title-image min-h-0 mb-0">
                                        {item?.email}
                                    </div>
                                    <div className="col-value colFonts min-h-0 mb-0 ">
                                        {item?.currentId === primary_email_id && (
                                            <img src={activeEmail} alt='primary' className="ic-19" />
                                        )}
                                    </div>
                                </>
                            ) : (
                                <span className="text-primary-20 ">email@xyz.com</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderHomeAddress = (Address) => {
        const [mailSignal, setMailSignal] = useState(false);

        useEffect(() => {
            if (Address?.currentId === mail_contact_id) {
                setMailSignal(true);
            } else {
                setMailSignal(false);
            }
        }, [Address?.currentId, mail_contact_id]); // Proper dependencies
        return (
            <div className="client-home-address_block height-63" onClick={handleEditShowModal}>
                <div className="client-identification-row">
                    <div className="colFonts min-h-0 mb-0 height-21 d-flex">
                        {Address?.first_name && Address?.last_name ? (
                            <div className="colFonts text-left col-title-image min-h-0 mb-0">
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{Address?.first_name}</span>{' '}
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{Address?.last_name}</span>
                            </div>
                        ) : (
                            <div className="text-primary-20 ">First Last</div>
                        )}
                        <div className="col-value colFonts min-h-0 mb-0 ">
                            {Address && mailSignal ? <span><img src={mail} alt='mail' className="ic-19" /></span> : null}
                        </div>
                    </div>
                </div>
                <div className="client-identification-row text-left">
                    <div>
                        <p className="colFont info_home_address text-black">
                            {Address?.address1 || Address?.address2 ? (
                                <>
                                    <div className="col-value colFonts text-left col-title min-h-0 mb-0">
                                        {Address?.address1 && (
                                            <span>{Address?.address1}</span>
                                        )}
                                        {Address?.address2 && (
                                            <span>{Address?.address1 && ","} {truncateName(Address?.address2, 12)}</span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-primary-20 ">Address</div>
                            )}
                            {Address?.city ? (
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{truncateName(Address?.city, 12)}, </span>
                            ) : (
                                <span className="text-primary-20 ">City, </span>
                            )}
                            {Address?.state ? (
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{Address?.state + " "}</span>
                            ) : (
                                <span className="text-primary-20 ">State </span>
                            )}
                            {Address?.zip ? (
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{truncateName(Address?.zip, 7)}</span>
                            ) : (
                                <span className="text-primary-20 ">Zip</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderHomeAddress2 = (Address) => {
        const [mailSignal, setMailSignal] = useState(false);

        useEffect(() => {
            if (Address?.currentId === mail_contact_id) {
                setMailSignal(true);
            } else {
                setMailSignal(false);
            }
        }, [Address?.currentId, mail_contact_id]);
        return (
            <div className="client-home-address_block height-63" onClick={handleEditShowModal}>
                <div className="client-identification-row">
                    <div className="colFonts min-h-0 mb-0 height-21 d-flex">
                        <div className="colFonts text-left col-title-image min-h-0 mb-0">

                            <span style={Address?.first_name ? { fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" } : { color: "var(--primary-20)" }}>{Address?.first_name || "First"}</span>{' '}
                            <span style={Address?.last_name ? { fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" } : { color: "var(--primary-20)" }}>{Address?.last_name || "Last"}</span>
                        </div>
                        <div className="col-value colFonts min-h-0 mb-0 ">
                            {Address && mailSignal ? <span><img src={mail} alt='mail' className="ic-19" /></span> : null}
                        </div>
                    </div>
                </div>
                <div className="client-identification-row text-left">
                    <div>
                        <p className="colFont info_home_address text-black">
                            {Address?.address1 || Address?.address2 ? (
                                <>
                                    <div className="col-value colFonts text-left col-title min-h-0 mb-0">
                                        {Address?.address1 && (
                                            <span>{Address?.address1}</span>
                                        )}
                                        {Address?.address2 && (
                                            <span>{Address?.address1 && ","} {truncateName(Address?.address2, 12)}</span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-primary-20 ">Address</div>
                            )}
                            {Address?.city ? (
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{truncateName(Address?.city, 12)}, </span>
                            ) : (
                                <span className="text-primary-20 ">City, </span>
                            )}
                            {Address?.state ? (
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{Address?.state + " "}</span>
                            ) : (
                                <span className="text-primary-20 ">State </span>
                            )}
                            {Address?.zip ? (
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{truncateName(Address?.zip, 7)}</span>
                            ) : (
                                <span className="text-primary-20 ">Zip</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderClientIdentification = (identification) => {
        return (
            <div className="client-identification_block height-63" onClick={handleEditShowModal}>
                <div className="client-identification-row">
                    <div className=" colFonts min-h-0 mb-0 height-21 d-flex">
                        <div className="colFonts text-left col-title min-h-0 mb-0">Title:</div>
                        <div className="col-value colFonts min-h-0 mb-0">
                            {identification?.title ? (
                                <>
                                    <div className="col-value colFonts min-h-0 mb-0">
                                        {identification?.title}
                                    </div>
                                </>
                            ) : (
                                <div className="text-primary-20 ">Mr./Mrs./Ms.</div>
                            )}
                        </div>
                    </div>
                    <div className=" colFonts min-h-0 mb-0 height-21 d-flex">
                        <div className="colFonts text-left col-title min-h-0 mb-0 font-weight-400-client">Birthday:</div>
                        <div className="col-value colFonts min-h-0 mb-0">
                            {identification?.birthday ? (
                                <>
                                    <div className="col-value colFonts min-h-0 mb-0">
                                        {formatDate(identification?.birthday)}
                                    </div>
                                </>
                            ) : (
                                <div className="text-primary-20 ">dd/mm/yyyy</div>
                            )}
                        </div>
                    </div>
                    <div className=" colFonts min-h-0 mb-0 height-21 d-flex">
                        <div className="colFonts text-left col-title min-h-0 mb-0 font-weight-400-client">License:</div>
                        <div className="col-value colFonts min-h-0 mb-0">
                            {identification?.license ? (
                                <>
                                    <div className="col-value colFonts min-h-0 mb-0">
                                        {truncateName(identification?.license, 9)}
                                    </div>
                                </>
                            ) : (
                                <div className="text-primary-20">X############</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSpouseContact = (spouseContact) => {
        return (
            <div className="client-home-address_block height-63" onClick={handleEditShowModal}>
                <div className="client-identification-row text-left">
                    <div>
                        {spouseContact?.name ? (
                            <h5 style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{spouseContact?.name}</h5>
                        ) : (
                            <div className="text-primary-20 ">First Last</div>
                        )}
                        <p className="colFont info_home_address text-black">
                            {spouseContact?.address1 || spouseContact?.address2 ? (
                                <>
                                    <div className="col-value colFonts text-left col-title min-h-0 mb-0">
                                        {spouseContact?.address1 && (
                                            <span>{spouseContact?.address1}</span>
                                        )}
                                        {spouseContact?.address2 && (
                                            <span>{spouseContact?.address1 && ","} {truncateName(spouseContact?.address2, 12)}</span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-primary-20 ">Address</div>
                            )}
                            {spouseContact?.city ? (
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{truncateName(spouseContact?.city, 12)},</span>
                            ) : (
                                <span className="text-primary-20 ">City,</span>
                            )}
                            {spouseContact?.state ? (
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{spouseContact?.state + " "}</span>
                            ) : (
                                <span className="text-primary-20 ">State </span>
                            )}
                            {spouseContact?.zip ? (
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{truncateName(spouseContact?.zip, 7)}</span>
                            ) : (
                                <span className="text-primary-20 ">Zip</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderSpouseInformation = (spouseInfo) => {
        return (
            <div className="spouse-information_block height-63" onClick={handleEditShowModal}>
                <div className="client-identification-row">
                    <div className="colFonts min-h-0 mb-0 height-21 d-flex">
                        <div className="colFonts text-left col-title min-h-0 mb-0 font-weight-400-client">Marital Status</div>
                        <div className="col-value colFonts min-h-0 mb-0">
                            {spouseInfo?.relationship}
                        </div>
                    </div>
                    <div className="colFonts min-h-0 mb-0 height-21 d-flex">
                        <div className="colFonts text-left col-title min-h-0 mb-0 font-weight-400-client">Discuss:</div>
                        <div className="col-value colFonts min-h-0 mb-0">
                            {spouseInfo?.discuss ? (
                                <div>
                                    {spouseInfo?.discuss === true ? <span className="color-green">Yes</span> : <span className="colorgrey-2">No</span>}
                                </div>
                            ) : (
                                <div className="text-primary-20">Not Clear</div>
                            )}
                        </div>
                    </div>
                    <div className=" colFonts min-h-0 mb-0 height-21 d-flex">
                        <div className="colFonts text-left col-title min-h-0 mb-0 font-weight-400-client">Phone:</div>
                        <div className="col-value colFonts min-h-0 mb-0">
                            {spouseInfo?.phone ? (
                                `${spouseInfo?.phone}`
                            ) : (
                                <span className="text-primary-20">(###) ###-####</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderEmergencyContact = (emergencyContact) => {
        return (
            <div className="client-home-address_block height-63" onClick={handleEditShowModal}>
                <div className="client-identification-row text-left">
                    <div>
                        {emergencyContact?.name ? (
                            <h5 style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>
                                <span className="client-identification-row">{emergencyContact?.first_name + " "}</span>
                                <span className="client-identification-row">{emergencyContact?.last_name}</span>
                            </h5>
                        ) : (
                            <div className="text-primary-20 ">First Last</div>
                        )}
                        <p className="colFont info_home_address text-black">
                            {emergencyContact?.address1 || emergencyContact?.address2 ? (
                                <>
                                    <div className="col-value colFonts text-left col-title min-h-0 mb-0">
                                        {emergencyContact?.address1 && (
                                            <span>{emergencyContact?.address1}</span>
                                        )}
                                        {emergencyContact?.address2 && (
                                            <span>{emergencyContact?.address1 && ","} {truncateName(emergencyContact?.address2, 12)}</span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-primary-20 ">Address</div>
                            )}
                            {emergencyContact?.city ? (
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{truncateName(emergencyContact?.city, 12)},</span>
                            ) : (
                                <span className="text-primary-20">City,</span>
                            )}
                            {emergencyContact?.state ? (
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{emergencyContact?.state + " "}</span>
                            ) : (
                                <span className="text-primary-20">State </span>
                            )}
                            {emergencyContact?.zip ? (
                                <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{truncateName(emergencyContact?.zip, 7)}</span>
                            ) : (
                                <span className="text-primary-20">Zip</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const renderEmergencyInformation = (emergencyInfo) => {
        return (
            <div className="spouse-information_block height-63" onClick={handleEditShowModal}>
                <div className="client-identification-row">
                    <div className=" colFonts min-h-0 mb-0 height-21 d-flex">
                        <div className="colFonts text-left col-title min-h-0 mb-0 font-weight-400-client">Relationship:</div>
                        <div className="col-value colFonts min-h-0 mb-0 ">
                            {truncateName(emergencyInfo?.relation || "")}
                        </div>
                    </div>
                    <div className=" colFonts min-h-0 mb-0 height-21 d-flex">
                        <div className="colFonts text-left col-title min-h-0 mb-0 font-weight-400-client">Discuss:</div>
                        <div className="col-value colFonts min-h-0 mb-0 font-weight-semibold">
                            {emergencyInfo?.discuss ? (
                                <div>
                                    {emergencyInfo?.discuss === true ? <span className="color-green font-weight-semibold ">Yes</span> : <span className="colorgrey-2 font-weight-semibold">No</span>}
                                </div>
                            ) : (
                                <div className="text-primary-20">Not Clear</div>
                            )}
                        </div>
                    </div>
                    <div className="colFonts min-h-0 mb-0 height-21 d-flex">
                        <div className="colFonts text-left col-title min-h-0 mb-0 font-weight-400-client">Phone: </div>
                        <div className="col-value colFonts min-h-0 mb-0 font-weight-bold">
                            {emergencyInfo?.phone ? (
                                `${emergencyInfo?.phone}`
                            ) : (
                                <span className="text-primary-20">(###) ###-####</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderNames = (names) => {
        return (
            <div>
                <div className="client-address-wrapper-row row no-gutters justify-content-end">
                    <div className="col client-contact-phone-col client-contact-col c-name Client-H-109">
                        <div className="">
                            <div className="background-white client-name-panel" data-toggle="modal" data-target="#edit-client-information-modal">
                                <div className="client-identification-row d-flex">
                                    <div className="colFonts text-left min-h-0 mb-0 font-weight-400-client">First:</div>
                                    <div className="col-value colFonts min-h-0 mb-0">
                                        {names?.first_name}
                                    </div>
                                </div>
                                <div className="client-identification-row d-flex">
                                    <div className="colFonts text-left min-h-0 mb-0 font-weight-400-client">Middle:</div>
                                    <div className="col-value colFonts min-h-0 mb-0">
                                        {names?.middle_name}
                                    </div>
                                </div>
                                <div className="client-identification-row d-flex">
                                    <div className="colFonts text-left min-h-0 mb-0 font-weight-400-client">Last:</div>
                                    <div className="col-value colFonts min-h-0 mb-0">
                                        {names?.last_name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const renderContent = () => {
        switch (type) {
            case 'phoneNumbers':
                return renderPhoneNumbers(data);
            case 'emailAddresses':
                return renderEmailAddresses(data);
            case 'homeAddress':
                return renderHomeAddress(data);
            case 'homeAddress2':
                return renderHomeAddress2(data);
            case 'clientIdentification':
                return renderClientIdentification(data);
            case 'spouseContact':
                return renderSpouseContact(data);
            case 'spouseInformation':
                return renderSpouseInformation(data);
            case 'emergencyContact':
                return renderEmergencyContact(data);
            case 'emergencyInformation':
                return renderEmergencyInformation(data);
            case 'names':
                return renderNames(data);
            default:
                return null;
        }
    };

    return (
        <div className="min-w-260px-client">
            <div className="row">
                <div className="col-12">
                    <h4 className="client-contact-title text-center">{headingToShow}</h4>
                </div>
            </div>
            <div>
                {renderContent()}
            </div>
            <div>
                <div onClick={handleButtonShowModal}>
                    <Button
                        showButton={true}
                        icon={buttonStyleClass}
                        buttonText={buttonText}
                        border={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default ContactInfo;
