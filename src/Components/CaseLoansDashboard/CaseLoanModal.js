import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Col, Row} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { formatDateForModalFields ,formatDateForSubmission, getToken } from '../../Utils/helper';
import GenericTabs from '../common/GenericTab';
import axios from 'axios';
import editLoanApi from "./common/editLoanApi";
import deleteEditLoanApi from "./common/deleteEditLoanApi";

const CaseLoanModal = ({ show, handleClose,updateLoans, loan={}, activeTab }) => {
    console.log("Active Tab: ",activeTab);
    const { register,setValue, handleSubmit,watch, reset ,formState: { errors } } = useForm();
    const [statesAbrs, setStatesAbrs] = useState([]);
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const accessToken = getToken();
    const [caseLoanTab,setCaseLoanTab] = useState(activeTab);
    const handleTabChange = (tab) => {
        setCaseLoanTab(tab)
    };
    const tabsData =[
    {   
        id: "lender", 
        label: "Lender", 
        onClick: () => handleTabChange("lender"),
        className: caseLoanTab === "lender" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: caseLoanTab === "lender" ? "var(--primary) !important" : "var(--primary-70) !important",
        leftHand:true,
        activeColor: 'white',
    },
    {   
        id: "lender_company", 
        label: "Lender Company", 
        onClick: () => handleTabChange("lender_company"),
        className: caseLoanTab === "lender_company" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: caseLoanTab === "lender_company" ? "var(--primary) !important" : "var(--primary-70) !important",
        leftHand:true,
        activeColor: 'white',
    },
    {   
        id: "loan_details", 
        label: "Loan Details", 
        onClick: () => handleTabChange("loan_details"),
        className: caseLoanTab === "loan_details" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: caseLoanTab === "loan_details" ? "var(--primary) !important" : "var(--primary-70) !important",
        leftHand:true,
        activeColor: 'white',
    },
    {   
        id: "company_ownership_amount", 
        label: "Company Ownership Amount", 
        onClick: () => handleTabChange("company_ownership_amount"),
        className: caseLoanTab === "company_ownership_amount" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: caseLoanTab === "company_ownership_amount" ? "var(--primary) !important" : "var(--primary-70) !important",
        leftHand:true,
        activeColor: 'white',
    },

    ]
    const fetchSatesData = async () => {
    try {
        const response = await axios.get(`${origin}/api/states/` , {
        headers: {
            Authorization: accessToken,
        },
        });
        if (response.status === 200) {
        setStatesAbrs(response.data);
        }
    } catch (error) {
        console.log(error);
    }
    };

    const formatNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, "");
        const phoneNumberLength = phoneNumber.length;

        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };
    
    useEffect(()=>{
        fetchSatesData();
        // Setting the Lender Company Fields
        setValue("lender_company_name",loan?.lending_company_contact?.name || '' )
        setValue("lender_address1_2",loan?.lending_company_contact?.address1 || '' )
        setValue("lender_address2_2",loan?.lending_company_contact?.address2 || '' )
        setValue("lender_city_2",loan?.lending_company_contact?.city || '' )
        setValue("lender_fax_2",loan?.lending_company_contact?.fax && formatNumber(loan?.lending_company_contact?.fax) || '' )
        setValue("lender_phone_2",loan?.lending_company_contact?.phone_number && formatNumber(loan?.lending_company_contact?.phone_number) || '' )
        setValue("lender_zip_2",loan?.lending_company_contact?.zip || '' )
        setValue("lender_state_2",loan?.lending_company_contact?.state || '' )
        setValue("lender_email_2",loan?.lending_company_contact?.email || '' )
        setValue("extension_2",loan?.lending_company_contact?.phone_ext || '' )


        //  Setting the Lender Fields
        setValue("lender_address1",loan?.contact?.address1 || '' )
        setValue("lender_address2",loan?.contact?.address2 || '' )
        setValue("lender_city",loan?.contact?.city || '' )
        setValue("lender_email",loan?.contact?.email || '' )
        setValue("lender_fax",loan?.contact?.fax && formatNumber(loan?.contact?.fax) || '' )
        setValue("lender_fname",loan?.contact?.first_name || '' )
        setValue("lender_lname",loan?.contact?.last_name || '' )
        setValue("lender_phone",loan?.contact?.phone_number && formatNumber(loan?.contact?.phone_number) || '' )
        setValue("lender_state",loan?.contact?.state || '' )
        setValue("lender_zip",loan?.contact?.zip || '' )
        setValue("extension",loan?.contact?.phone_ext || '' )

        if(loan?.date_verified !=null)
        {
            setValue("payoff_estimate_date", formatDateForModalFields(loan?.date_verified) )
        }else{
            setValue("payoff_estimate_date", '' )
        }
        if(loan?.date_disbursed !=null)
        {
            setValue("loan_date_disbursed", formatDateForModalFields(loan?.date_disbursed) )
        }else{
            setValue("loan_date_disbursed", '' )
        }
        setValue("current_amount_verified",loan?.current_amount_verified || '')
        setValue("fees",loan?.fees || '')
        setValue("interest",loan?.interest || '')
        setValue("payoff_estimate",loan?.amount_estimate || '')
        setValue("final_payoff",loan?.final_amount || '')

    },[])  

    function handleChange(event,inputType) {
        let formattedValue = formatNumber(event.target.value);
        setValue(`${inputType}`, formattedValue);
    }
    const onSubmit = async (data) => {
        // Clone the data to avoid mutating original reference
        let formData = { ...data };
    
        // Add conditional loan case ID based on tab
        if (caseLoanTab === 'lender') {
            formData.lender_loancase_id = loan?.id;
        } else if (caseLoanTab === 'lender_company') {
            formData.lendingcompany_loancase_id = loan?.id;
    
            // Copy over values
            formData.lender_address1 = formData.lender_address1_2;
            formData.lender_address2 = formData.lender_address2_2;
            formData.lender_city = formData.lender_city_2;
            formData.lender_fax = formData.lender_fax_2;
            formData.lender_phone = formData.lender_phone_2;
            formData.lender_zip = formData.lender_zip_2;
            formData.lender_state = formData.lender_state_2;
            formData.lender_email = formData.lender_email_2;
            formData.extension = formData.extension_2;
        } else if (caseLoanTab === 'loan_details') {
            formData.loan_detail_id = loan?.id;
        }
    
        // Format dates
        formData.date_disbursed = formData.date_disbursed
            ? formatDateForSubmission(formData.date_disbursed)
            : null;
    
        formData.payoff_estimate_date = formData.payoff_estimate_date
            ? formatDateForSubmission(formData.payoff_estimate_date)
            : null;
    
        // Remove all keys that include _ (underscore) in their names
        Object.keys(formData).forEach((key) => {
            if (key.includes('_2')) {
                delete formData[key];
            }
        });
    
        console.log(formData);
    
        await editLoanApi(formData);
        updateLoans();
        handleClose();
    };
    const SelectedLenderCompanyState = watch("lender_state_2");
    const SelectedLenderState = watch("lender_state");
    const handleDeleteLoan = async ()=>{
        const res = await deleteEditLoanApi(loan?.id);
        console.log(res);
        updateLoans();
        handleClose();
    }
    useEffect(() => {
        if (activeTab) {
            setCaseLoanTab(activeTab);
        }
    }, [activeTab]);
    
    return (
        <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="insurance-modal-dialog modal-dialog-centered modal-800p"
        centered
    >
        <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Edit Case Loans</div></div>
        <Modal.Body className='p-0'>
        <div className="custom-tab m-t-5">
            <GenericTabs tabsData={tabsData} height={25} currentTab={caseLoanTab} popupTabs={true} />
            <Form id="insurance_contacts_form" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" name="csrfmiddlewaretoken" value="O2Ft8rMsd5q4FU1rvKFz2PGxAwffHBfGDcOH0reVbGCMGC8pPPACv1qfqaC3huT1" />
            <input type="text" name="block_name" hidden value="" />
            <input type="text" name="insurance_id" hidden value="" />
            <div className="m-t-5" style={{height:"145px"}}>
                <div>
                {caseLoanTab ==="lender_company" &&
                <>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                        <Col md={2} className="text-left p-l-5">
                            <span className="d-inline-block text-grey contact_name_title">Name :</span>
                        </Col>
                        <Col md={10} className='p-r-5 p-l-0'>
                            <Form.Control type="text" 
                            className='height-25 p-0 p-l-5 rounded-0'
                            placeholder="Enter Company Name" 
                            {...register("lender_company_name")} />
                        </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                        <span className="d-inline-block text-grey">Address 1 :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                        <Form.Control 
                        type="text" 
                        className='height-25 p-0 p-l-5 rounded-0'
                        placeholder="Address 1"  
                        {...register("lender_address1_2")} />
                    </Col>
                    <Col md={2} className="text-left p-l-0 p-r-0">
                        <span className="d-inline-block text-grey">Address 2 :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                        <Form.Control 
                        type="text" 
                        className='height-25 p-0 p-l-5 rounded-0'
                        placeholder="Address 2" 
                        {...register("lender_address2_2")}  />
                    </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="d-flex p-l-5">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-70">City :</span>
                    </Col>  
                    <Col md={2} className='p-l-0'>
                        <Form.Control 
                        type="text"  
                        placeholder="City" 
                        className='form-control height-25 p-0 p-l-5 rounded-0'
                        {...register("lender_city_2")} />
                    </Col>
                    <Col md={4} className="d-flex p-l-0 p-r-0 custom-select-state-entity">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">State :</span>
                        <Form.Control as="select"  className="form-control City-Width-OP height-25 p-0 p-l-5 rounded-0" {...register("lender_company_state")}
                        value={SelectedLenderCompanyState || ""}
                        onChange={(e) => setValue("lender_state_2", e.target.value)}
                        >
                        <option  value="">
                            Select state
                            </option>
                        {statesAbrs?.map(state => (
                        <option key={state.StateAbr} value={state.StateAbr}>
                            {state.name}
                        </option>
                        ))}
                        
                        </Form.Control>
                    </Col>
                    <Col md={4} className="d-flex p-r-5">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-15">Zip :</span>
                        <Form.Control 
                        type="text"  
                        placeholder="Zip" 
                        className='height-25 p-0 p-l-5 rounded-0'
                        {...register("lender_zip_2")} />
                    </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                        <span className="d-inline-block text-grey">Phone :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                        <Form.Control 
                        type="text" 
                        placeholder="(###) ###-####" 
                        className='height-25 p-0 p-l-5 rounded-0'
                        onKeyUp={(e)=> handleChange(e,"lender_phone_2")} 
                        {...register("lender_phone_2")} />
                    </Col>
                    <Col md={2} className="text-left p-l-0 p-r-0" >
                        <span className="d-inline-block text-grey">Extension :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                    <Form.Control
                        type="text"
                        placeholder="Extension"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("extension_2")}
                        />
                    </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom m-0">
                    <Col md={2} className="text-left p-l-5">
                        <span className="d-inline-block text-grey">Fax :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                        <Form.Control 
                        type="text" 
                        placeholder="(###) ###-####" 
                        className='height-25 p-0 p-l-5 rounded-0'
                        onKeyUp={(e)=> handleChange(e,"lender_fax_2")} 
                        {...register("lender_fax_2")}/>
                    </Col>
                    <Col md={2} className="text-left p-l-0 p-r-0">
                        <span className="d-inline-block text-grey">Email :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                        <Form.Control
                        type="text" 
                        className='height-25 p-0 p-l-5 rounded-0'
                        placeholder="Enter Email"  
                        {...register("lender_email_2")} />
                    </Col>
                    {/* <Col md={2} className="text-left">
                        <span className="d-inline-block text-grey Text-w-NW-INS">Website URL :</span>
                    </Col>
                    <Col md={4}>
                        <Form.Control type="text" placeholder="www.insurancewebsite.com " {...register("insurance_website")} />
                    </Col> */}
                    </Row>
                </> 
                }
                {caseLoanTab ==="lender" && 
                <>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                        <Col md={2} className="text-left p-l-5">
                            <span className="d-inline-block text-grey Text-w-NW-INS">First Name :</span>
                        </Col>
                        <Col md={4} className='p-l-0'>
                            <Form.Control
                            type="text"
                            placeholder="Enter First Name"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("lender_fname")}
                            />
                        </Col>
                        <Col md={2} className="text-left p-r-0 p-l-0">
                            <span className="d-inline-block text-grey Text-w-NW-INS">Last Name :</span>
                        </Col>
                        <Col md={4} className='p-r-5'>
                            <Form.Control
                            type="text"
                            placeholder="Enter Last Name"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("lender_lname")}
                            />
                        </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                        <Col md={2} className="text-left p-l-5">
                            <span className="d-inline-block text-grey">Address 1 :</span>
                        </Col>
                        <Col md={4} className='p-l-0'>
                            <Form.Control
                            type="text"
                            placeholder="Address 1"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("lender_address1")}
                            />
                        </Col>
                        <Col md={2} className="text-left p-l-0 p-r-0" >
                            <span className="d-inline-block text-grey">Address 2 :</span>
                        </Col>
                        <Col md={4} className='p-r-5'>
                            <Form.Control
                            type="text"
                            placeholder="Address 2"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("lender_address2")}
                            />
                        </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                        <Col md={2} className="d-flex p-l-5">
                            <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-70">City :</span>
                        </Col>  
                        <Col md={2} className='p-l-0'>
                            <Form.Control 
                                type="text" 
                                placeholder="City" 
                                className="form-control height-25 p-0 p-l-5 rounded-0" 
                                {...register("lender_city")} />
                        </Col>
                        <Col md={4} className="d-flex p-l-0 p-r-0 custom-select-state-entity">
                            <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">State :</span>
                            <Form.Control 
                                as="select"
                                className="form-control height-25 p-0 p-l-5 rounded-0 City-Width-OP" 
                                {...register("lender_state")}
                                value={SelectedLenderState || ""}
                                onChange={(e) => setValue("lender_state", e.target.value)}
                                >
                                <option  value="">
                                        Select state
                                        </option>
                                {statesAbrs?.map(state => (
                                <option key={state.StateAbr} value={state.StateAbr}>
                                    {state.name}
                                </option>
                            ))}
                                
                            </Form.Control>
                        </Col>
                        <Col md={4} className="d-flex p-r-5">
                            <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-15">Zip :</span>
                            <Form.Control 
                                type="text"  
                                placeholder="Zip" 
                                className='height-25 p-0 p-l-5 rounded-0'
                                {...register("lender_zip")} />
                        </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                        <Col md={2} className="text-left p-l-5">
                            <span className="d-inline-block text-grey">Phone :</span>
                        </Col>
                        <Col md={4} className='p-l-0'>
                            <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            onKeyUp={(e) => handleChange(e,"lender_phone")}
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("lender_phone")}
                            />
                        </Col>
                        <Col md={2} className="text-left p-l-0 p-r-0">
                            <span className="d-inline-block text-grey">Extension :</span>
                        </Col>
                        <Col md={4} className='p-r-5'>
                            <Form.Control
                            type="text"
                            placeholder="Extension"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("extension")}
                            />
                        </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom m-0">
                        <Col md={2} className="text-left p-l-5">
                            <span className="d-inline-block text-grey">Fax :</span>
                        </Col>
                        <Col md={4} className='p-l-0'>
                            <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            onKeyUp={(e) => handleChange(e,"lender_fax")}
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("lender_fax")}
                            />
                        </Col>
                        <Col md={2} className="text-left p-l-0">
                            <span className="d-inline-block text-grey">Email :</span>
                        </Col>
                        <Col md={4} className='p-r-5'>
                            <Form.Control
                            type="text"
                            placeholder="Enter Email"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("lender_email")}
                            />
                        </Col>
                    </Row>
                </>
                }

                {caseLoanTab ==="loan_details" && 
                <>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                        <Col md={2} className="text-left p-l-5 white-space-nowrap">
                            <span className="d-inline-block text-grey">Loan Amount :</span>
                        </Col>
                        <Col md={10} className='p-l-0 p-r-5'>
                            <Form.Control
                            type="number"
                            step="0.01"
                            placeholder="Loan Amount"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("current_amount_verified")}
                            />
                        </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                        <Col md={2} className="text-left p-l-5 white-space-nowrap">
                            <span className="d-inline-block text-grey">Date Disbursed:</span>
                        </Col>
                        <Col md={10} className='p-l-0 p-r-5'>
                            <Form.Control
                                type="date"
                                className="form-control height-25 p-0 p-l-5 rounded-0"
                                {...register("loan_date_disbursed")}
                            />
                        </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                        <Col md={2} className="text-left p-l-5 white-space-nowrap">
                            <span className="d-inline-block text-grey">Interest:</span>
                        </Col>
                        <Col md={4} className='p-l-0'>
                            <Form.Control
                            type="text"
                            placeholder="Interest"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("interest")}
                            />
                        </Col>
                        <Col md={2} className="text-left p-l-5 white-space-nowrap">
                            <span className="d-inline-block text-grey">Fees:</span>
                        </Col>
                        <Col md={4} className='p-l-15 p-r-5'>
                            <Form.Control
                            type="number"
                            placeholder="Enter Liability Limit"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("fees")}
                            />
                        </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                        <Col md={2} className="text-left p-l-5 white-space-nowrap">
                            <span className="d-inline-block text-grey">Payoff Estimate :</span>
                        </Col>
                        <Col md={4} className='p-l-0'>
                            <Form.Control
                            type="number"
                            step="0.01"
                            placeholder="Enter Payoff Estimate"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("payoff_estimate")}
                            />
                        </Col>
                        <Col md={2} className="text-left p-l-5 white-space-nowrap">
                            <span className="d-inline-block text-grey">Payoff Est. Date :</span>
                        </Col>
                        <Col md={4} className='p-l-15 p-r-5'>
                            <Form.Control
                            type="date"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("payoff_estimate_date")}
                            />
                        </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0 mb-0">
                        <Col md={2} className="text-left p-l-5 white-space-nowrap">
                            <span className="d-inline-block text-grey">Final Payoff :</span>
                        </Col>
                        <Col md={10} className='p-l-0 p-r-5'>
                            <Form.Control
                            type="number"
                            step="0.01"
                            placeholder="Final Amount"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("final_payoff")}
                            />
                        </Col>
                    </Row>
                </>
                }

                </div>
            </div>
            </Form>
        </div>
        <div className="d-flex justify-content-between align-items-center p-l-5 p-t-5 p-b-5 p-r-5">
            <Button variant="danger" className="height-25" style={{padding:"0px 12px"}}  onClick={handleDeleteLoan}>
                Delete
            </Button>
            <div>
                <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                    Cancel
                </Button>
                <Button form="insurance_contacts_form" type="submit"  className="m-l-5 bg-success height-25" style={{padding:"0px 12px"}}>
                    Save
                </Button>
            </div>
        </div>
        </Modal.Body>

        {/* <Modal.Footer className="border-0 justify-content-between pt-4">
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="danger"  onClick={() => {
            deleteInsuranceHandler(insurance.id);
            handleClose();
        }}>Delete</Button>
        <Button form="insurance_contacts_form" type='submit' className="btn popup-heading-color save-btn-popup">Save</Button>
        </Modal.Footer> */}

        
        
    </Modal>
    )
}

export default CaseLoanModal