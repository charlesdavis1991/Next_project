import React, { useState } from 'react';
import PanelActionBarComponent from '../common/PanelActionBarComponent';
import ContactPanel from '../common/ContactPanel';
import InformationPanel from '../common/InformationPanel';
import NotesPanel from '../NotesPanelSection/NotesPanel';
import DocumentRow from '../DocumentRow/DocumentRow';
import { currencyFormat, formatDateForPanelDisplay } from '../../Utils/helper';
import CaseLoanModal from './CaseLoanModal';
import GenrateDocument from '../../Components/GenrateDocument/GenrateDocument';

const PanelEntity = ({loan,updateLoans}) => {
    const [showGenDocPopup, setShowGenDocPopup] = useState(false);
    const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);
    const [dropdownName, setDropdownName] = useState("");

    const handleGenrateDocument = (instanceId, dropDownName) => {
        console.log("FUNCTION IS CALLED");
        console.log("HGD instance id == :: ", instanceId);
        console.log("dropDownName", dropDownName);
        setDropdownName(dropDownName);
        setInstanceIdForGenragteDoc(instanceId);
        setShowGenDocPopup(true);
    };
    const buttonsConfig = [
        // {
        //   label: "Insurance",
        //   icon: "+",
        //   className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
        //   dataToggle: "modal",
        //   dataTarget: "#addInsurance",
        //   onClick: () => handeInsuranceShow(object.id),
        // },
        // {
        //   label: "Counsel",
        //   icon: "+",
        //   className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
        //   dataToggle: "modal",
        //   dataTarget: "#addCounsel",
        //   onClick: () => handeCounselShow(object.id),
        // },
    ];
    const LenderButtonsConfig = [
        {
            iconClassName: "ic ic-19 ic-generate-document",
            buttonText: "Generate Document",
            className: "p-l-6 p-r-5",
            style: {
            height: "25px",
            backgroundColor: "var(--primary-10)",
            borderColor: "var(--primary)",
            color: "var(--primary)",
            },
            onClick: handleGenrateDocument,
        },
    ];
    const LenderCompanyButtonsConfig = [
        {
            iconClassName: "ic ic-19 ic-generate-document",
            buttonText: "Generate Document",
            className: "p-l-6 p-r-5",
            style: {
            height: "25px",
            backgroundColor: "var(--primary-10)",
            borderColor: "var(--primary)",
            color: "var(--primary)",
            },
            onClick: handleGenrateDocument,
        },
    ];
    const [activeTab,setActiveTab] = useState("");
    const [showEditModal,setShowEditModal] = useState(false);
    return (
        <>
            <div className="expert caseloan-expert" key={loan?.id}>
                <PanelActionBarComponent
                    id={loan?.id}
                    title={"Lending Company"}
                    object={loan}
                    buttons={buttonsConfig}
                    page_name={"Loans"}
                    hasGradient={true}
                />
                <div className="d-flex">
                <div className="d-grid leins-container-four">
                    <div className="liens-container-item">
                    <ContactPanel
                        id={loan?.id}
                        panel_name={"Lender"}
                        className=""
                        pageName='Case Loans'
                        buttonData={LenderButtonsConfig}
                        onSelectObject={() =>{
                            setActiveTab("lender");
                            setShowEditModal(true);
                        }}
                        // dynamic_label="Full Name"
                        phone_number={loan?.contact?.phone_number}
                        email={loan?.contact?.email}
                        name={loan?.contact?.name}
                        address1={loan?.contact?.address1}
                        address2={loan?.contact?.address2}
                        city={loan?.contact?.city}
                        state={loan?.contact?.state}
                        zip_code={loan?.contact?.zip}
                        ext={loan?.contact?.phone_ext}
                        websiteURL={loan?.contact?.website}
                        genrate_doc_address={"Lender Address"}
                    />
                    </div>
                    <div className="liens-container-item">
                    <ContactPanel
                        id={loan?.id}
                        panel_name={"Lending Company"}
                        className=""
                        onSelectObject={() =>{
                            setActiveTab("lender_company");
                            setShowEditModal(true);
                        }}
                        pageName='Case Loans'
                        name={loan?.lending_company_contact?.name}
                        dynamic_label={"Company Name"}
                        buttonData={LenderCompanyButtonsConfig}
                        phone_number={loan?.lending_company_contact?.phone_number}
                        email={loan?.lending_company_contact?.email}
                        address1={loan?.lending_company_contact?.address1}
                        address2={loan?.lending_company_contact?.address2}
                        city={loan?.lending_company_contact?.city}
                        state={loan?.lending_company_contact?.state}
                        zip_code={loan?.lending_company_contact?.zip}
                        ext={loan?.lending_company_contact?.phone_ext}
                        genrate_doc_address={"Lender Company Address"}
                        websiteURL={loan?.lending_company_contact?.website}
                    />

                    </div>
                    <div className="liens-container-item">
                    <InformationPanel
                        panel_name={"Loan Details"}
                        className=""
                        data={[
                            {
                                label: "Fees",
                                value: `${ currencyFormat(loan?.fees) }`,
                            },
                            {
                                label: "Disbursed",
                                value: `${currencyFormat(loan?.current_amount_verified)}`,
                            },
                            {
                                label: "Interest",
                                value: `${loan?.interest} %`,
                            },
                            {
                                label: "Payoff Estimate",
                                value: `${currencyFormat(loan?.amount_estimate)}`,
                            },
                            {
                                label: "Payoff Est. Date",
                                value: `${ formatDateForPanelDisplay(loan?.date_verified) }`,
                            },
                            {
                                label: "Final Payoff",
                                value: `${currencyFormat(loan?.final_amount)}`,
                            }
                        ]}
                        onSelectReport={()=>{
                            setActiveTab("loan_details");
                            setShowEditModal(true);
                        }}
                    />
                    </div>
                    <div className="liens-container-item">
                    <InformationPanel
                        panel_name={"Company OwnerShip Amount"}
                        className=""
                        data={[
                            // {
                            //     label: ":",
                            //     value: ``,
                            // },
                            // {
                            //     label: "",
                            //     value: ``,
                            // },
                            // {
                            //     label: "Interest:",
                            //     value: `$ 200.00`,
                            // },
                            // {
                            //     label: "Payoff Estimate:",
                            //     value: `$ 200.00`,
                            // },
                            // {
                            //     label: "Payoff Est. Date",
                            //     value: "3/05/2024",
                            // },
                            // {
                            //     label: "Final Payoff:",
                            //     value: `$ 900.00`,
                            // }
                        ]}
                        onSelectReport={()=>{
                            setActiveTab("company_ownership_amount")
                            setShowEditModal(true);
                        }}
                    />
                    </div>
                </div>
                <div className="d-flex d-flex-1 p-l-5 m-b-5 overflow-hidden">
                    <NotesPanel
                    entity_type={"Loans"}
                    record_id={loan?.id}
                    module={"Loans"}
                    notesName={"Loans"}
                    />
                </div>
                </div>
                <div className="row documents-wrapper">
                <div className="col-12">
                    <div className="height-25">
                    <h4
                        className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case font-weight-semibold text-center client-contact-title"
                        style={{ background: "var(--primary-15)" }}
                    >
                        &nbsp;Document Row
                    </h4>
                    </div>
                    <DocumentRow clientProvider={loan} page="Loans" />
                </div>
                </div>
            </div>
            {showGenDocPopup && 
                <GenrateDocument
                    PageEntity={"Loans"}
                    show={showGenDocPopup}
                    handleClose={()=>setShowGenDocPopup(false)}
                    instanceId={instanceIdForGenrateDoc}
                    dropdownName={dropdownName}
                />
            }
            <CaseLoanModal 
                activeTab={activeTab} 
                show={showEditModal} 
                handleClose={()=>setShowEditModal(false)} 
                updateLoans={updateLoans} 
                loan={loan} 
            />
        </>
    )
}

export default PanelEntity