import React from 'react'
import styled from 'styled-components';

const StyledParagraph = styled.p`
    color: ${({ speciality }) => speciality.color} !important;
`;

function BillRecived({ record_date, contact, specialitie, get_providers_edit_modal, handleShow }) {

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }
    
    return (
        <div className="col-auto c-width-lg-255 w-contact-box d-flex flex-column p-r-5 p-md-r-0">
            <div className="information-wrapper information-wrapper-ch" id="billing_request_info">
                <div data-toggle="modal" data-target="#case-provider-edit-modal"
                    onClick={handleShow}>
                    <div className="text-left has-white-hover p-l-5 p-r-5 p-md-r-0 p-md-l-0">
                        <p
                            className="columnsTitle text-center color-primary
                            font-weight-semibold text-uppercase">
                            Bills Received {record_date ? formatDate(record_date.split("T")[0]) : record_date}
                        </p>
                        <p className="columnsTitle text-truncated">
                            {contact.name ? contact.name : <span class="text-primary-20">Company Name</span>}
                        </p>

                        <div className="mb-0">
                            <p className="text-lg text-black info_address">
                                {contact.address1 ? contact.address1 : <span class="text-primary-20">Address,</span>}
                                {contact.address2 ? contact.address2 : <span class="text-primary-20"></span>}
                            </p>
                            <p className="text-lg text-black info_city_state_zip">
                                {contact.city ? `${contact.city}, ` : <span class="text-primary-20">City, </span>}
                                {contact.state ? <span style={{ marginRight: '16px' }}>{contact.state}</span> : 
                                <span class="color-primary">State,</span>}
                                {contact.zip ? contact.zip : <span class="text-primary-20">Zip</span>}
                            </p>
                        </div>
                        <div className="mb-0">
                            <p className="colText colFont info_phone_number mb-0">
                                {
                                    contact.phone_number ?
                                        `(${contact.phone_number.slice(0, 3)}) ${contact.phone_number.slice(3, 6)}-${contact.phone_number.slice(6, 10)}` :
                                        <span className="text-primary-20">(###) ###-####</span>
                                }

                            </p>
                            <p className="colText colFont info_fax mb-0">
                                {
                                    contact.fax ?
                                        <>({contact.fax.slice(0, 3)}) {contact.fax.slice(3, 6)}-{contact.fax.slice(6, 10)}</> :
                                        <span className="text-primary-20"> (###) ###-####</span>
                                }
                                <small className="ml-2 text-grey">fax</small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <a href="#" onclick="templatePopUp('','','','92','','','',4)"
                    className="btn btn-primary-lighter-default btn-white-hover font-weight-semibold c-border-style c-btn-width
                    btn-primary-10 text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5">
                    <i className="ic ic-19 ic-generate-document m-r-5"></i>
                    Generate Document
                </a>
                <a href="#"
                    className="m-t-5 btn btn-primary-lighter-default btn-white-hover font-weight-semibold c-border-style c-btn-width
                    btn-primary-10 text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5">
                    <i className="ic ic-19 ic-email-3d m-r-5"></i>
                    {contact.email ? <span className="email-text">{contact.email}</span> : 
                    <span className="text-primary-20">email@address.com</span>}
                </a>
            </div>
        </div>
    )
}

export default BillRecived
