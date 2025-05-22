import React, { useState, useEffect, useContext, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, Col, Row, } from 'react-bootstrap';
import AutoCompleteSearch from '../../Insurance/AutoCompleteSearch';
import api from "../../../api/api";
import { ClientDataContext } from '../shared/DataContext';
import { getClientId, getCaseId, getToken } from '../../../Utils/helper';
import { useSelector } from 'react-redux';
import "../../../../public/BP_resources/css/client-4.css";
import axios from 'axios';

// import AutoCompleteSearch from './AutoCompleteSearch';

const InsuranceModal = ({ handleClose, show }) => {
    const origin = process.env.REACT_APP_BACKEND_URL;
    const currentCase = getCaseId();
    const client = getClientId();
    const token = localStorage.getItem("token");
    const accessToken = getToken()
    const [loading, setLoading] = useState(false);


    const [statesAbrs, setStatesAbrs] = useState([]); 
    const [insuranceTypes, setInsuranceTypes] = useState([]); 
    const [selectedCompanyId , setSelectedComponyId] = useState('')

    const [searchedCompany, setSearchedCompany] = useState([])
    const [searchedAdjuster, setSearchedAdjuster] = useState([])
    const searchType = useRef('')
    const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm();

    const { isClientDataUpdated, setIsClientDataUpdated } = useContext(ClientDataContext);

    const fetchSatesData = async () => {
        try {
            const response = await axios.get(`${origin}/api/states/`, {
                headers: {
                    Authorization: token,
                },
            });
            if (response.status === 200) {
                setStatesAbrs(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };


    //   Formting phone number an fax number 
    const formatNumber = (inputVal) => {
        inputVal = inputVal.replace(/\D/g, '');
        // Insert formatting characters
        inputVal = '(' + inputVal.substring(0, 3) + ') ' + inputVal.substring(3, 6) + '-' + inputVal.substring(6, 10);
        // Update input value
        return inputVal

    }

    const selectedInsuranceTypeId = parseInt(watch('insurance_type_id'));

   // Handling Searching 
  const handleSearch =  async(event,type)=>{
    searchType.current = type
    let companies=[]
    let adjusters=[]


    if (event.target.value.length >= 2) {
      if (type === "company") {
        const response = await axios.get(`${origin}/api/insurances/search/`);
        companies = response.data.data.filter(insurance => 
          // Check if the insurance type matches the selected insurance type
          parseInt(insurance.insurance_type) === selectedInsuranceTypeId && (
            insurance?.company_name?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.adjuster_firstname?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.adjuster_lastname?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.address1?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.address2?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.city?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.state?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.zip?.toLowerCase().startsWith(event.target.value.toLowerCase())
          )
        );
      } else if (type === "adjuster") {
        const response = await axios.get(`${origin}/api/general/search_filter_adjuster_directoires/` , {
          params:{
            company_id: selectedCompanyId ? selectedCompanyId:""
          }
        });
        console.log(response)
        adjusters = response.data.data.filter(insurance => 
          (
            insurance?.company_name.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.adjuster_firstname?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.adjuster_lastname?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.address1?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.address2?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.city?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.state?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.zip?.toLowerCase().startsWith(event.target.value.toLowerCase())
          )
        );
      }
    }

     setSearchedCompany(companies)
     setSearchedAdjuster(adjusters)
    
  }

    const fetchCaseTypesData = async () => {
        try {
            const response = await axios.get(`${origin}/api/general/insurance_types/`, {
                headers: {
                    Authorization: token,
                },
            });
            if (response.status === 200) {
                setInsuranceTypes(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSatesData();
        fetchCaseTypesData();
    }, [origin]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(`${origin}/api/client-page/add_insurance/${client}/${currentCase}/`, data, {
                headers: {
                    Authorization: token,
                },
            })
        }
        catch (error) {
            console.error(error)

        }
        setIsClientDataUpdated(!isClientDataUpdated)
        setLoading(false);
        reset()
        handleClose()
    };

    const handleSelectedInsurance = (id) => {
        if (searchType.current == "company") {
            let selectedCompany = searchedCompany.filter(insurance => insurance.id == id)
            selectedCompany = { ...selectedCompany[0] }
            setValue('phone_number', formatNumber(selectedCompany?.phone))
            setValue('fax', formatNumber(selectedCompany?.fax))
            setValue('email', selectedCompany?.email)
            setValue('company_name', selectedCompany?.company_name)
            setValue('website', selectedCompany?.website)
            setValue('address_1', selectedCompany?.address1)
            setValue('address_2', selectedCompany?.address2)
            setValue('zip', selectedCompany?.zip)
            setValue('city', selectedCompany?.city)
            const stateObj = statesAbrs.find(state => state.StateAbr === selectedCompany?.state);
              if (stateObj) {
                  setValue('state', stateObj.StateAbr);
              } else {
                  console.warn("State abbreviation not found in statesAbrs");
              }
            setValue('extension', selectedCompany?.extension);
            setSelectedComponyId(selectedCompany?.company_id)

            setSearchedCompany([])
        }

        if (searchType.current == "adjuster") {
            let selectedAdjuster = searchedAdjuster.filter(insurance => insurance.id == id)
            selectedAdjuster = { ...selectedAdjuster[0] }
            setValue('adjuster_fname', selectedAdjuster?.adjuster_firstname)
            setValue('adjuster_lname', selectedAdjuster?.adjuster_lastname)

            setSearchedAdjuster([])
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} centered dialogClassName='modal-dialog-centered INS-max-width-1000px custom-insurance-dialog'>
                <Modal.Header  className="modal-header text-center bg-primary-fixed" style={{ padding: "5px" }}>
                    <Modal.Title className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500 modal-title h4">Add Client Insurance Coverage</Modal.Title>
                </Modal.Header>
                <div className='pr-2 pl-2'>
                    <Modal.Body className="panel-popups-body">
                        <Form id="addinsurance_form" onSubmit={handleSubmit(onSubmit)}>
                            <Row className='p-b-5'>
                                <Col className='p-0' md={4}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter Policy #'
                                        {...register('policy_number')}
                                    >

                                    </Form.Control>
                                </Col>
                                <Col className='pl-4 pr-4' md={4}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter Claim #'
                                        {...register('claim_number')}
                                    >

                                    </Form.Control>
                                </Col>
                                <Col className='p-0' md={4}>
                                    <Form.Select
                                        {...register('insurance_type_id')}
                                        required
                                        className={`form-control ${errors.state && 'is-invalid'}`}
                                    >   <option key="" value="">Select Coverage Type</option>
                                        {insuranceTypes?.map(insuranceType => (
                                            <option key={insuranceType.id} value={insuranceType.id}>
                                                {insuranceType.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='p-b-5'>
                                <Col className="p-0" md={12}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Type Insurance Company Name to add from library"
                                        onKeyUp={() => handleSearch(event, 'company')}
                                        disabled={!selectedInsuranceTypeId}

                                    />
                                    {searchedCompany.length > 0 && <AutoCompleteSearch searchedInsurances={searchedCompany} selectedInsurance={handleSelectedInsurance} isCompany={true} />}
                                </Col>
                            </Row>
                            <Row className='p-b-5'>
                                <Col className='p-0' md={4}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter company name'
                                        {...register('company_name')}
                                    >

                                    </Form.Control>
                                </Col>
                                <Col className='pl-4 pr-4' md={4}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter website'
                                        {...register('website')}
                                    >

                                    </Form.Control>
                                </Col>
                                <Col className='p-0' md={4}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter phone no'
                                        {...register('phone_number')}
                                    >

                                    </Form.Control>
                                </Col>
                            </Row>
                            <Row className='p-b-5'>
                                <Col className='p-0' md={4}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter Fax'
                                        {...register('fax')}
                                    >

                                    </Form.Control>
                                </Col>
                                <Col className=' pl-4 pr-4' md={4}>
                                    <Form.Control
                                        type="email"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter Email'
                                        {...register('email')}
                                    >

                                    </Form.Control>
                                </Col>
                                <Col className='p-0' md={4}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter Extension'
                                        {...register('extension')}
                                    >

                                    </Form.Control>
                                </Col>
                            </Row>
                      
                            <Row className='p-b-5'>
                                <Col className='p-0' md={6}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter Address 1'
                                        {...register('address_1')}

                                    >

                                    </Form.Control>
                                </Col>

                                <Col className='pl-4 pr-0' md={6}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter Address 2'
                                        {...register('address_2')}

                                    >

                                    </Form.Control>
                                </Col>
                            </Row>
                            <Row className='p-b-5'>
                                <Col className='p-0' md={4}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter City'
                                        {...register('city')}

                                    >

                                    </Form.Control>
                                </Col>
                                <Col className=' pl-4 pr-4' md={4}>
                                    <Form.Select
                                        {...register('state')}
                                        className={`form-control ${errors.state && 'is-invalid'}`}
                                    >   <option key="" value="">Select State</option>
                                        {statesAbrs?.map(state => (
                                            <option key={state.id} value={state.StateAbr}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col className='p-0' md={4}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter ZIP'
                                        {...register('zip')}
                                    >

                                    </Form.Control>
                                </Col>
                            </Row>
                       
                            <Row className='p-b-5'>
                                <Col className="p-b-5 p-0" md={12}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Type Adjuster Name to add from library"
                                        onKeyUp={() => handleSearch(event, 'adjuster')}
                                        disabled = {!selectedCompanyId}

                                    />
                                    {searchedAdjuster.length > 0 && <AutoCompleteSearch searchedInsurances={searchedAdjuster} selectedInsurance={handleSelectedInsurance} isAdjuster={true} />}
                                </Col>
                            </Row>
                            <Row className='p-b-5'>
                                <Col className='p-0' md={6}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter Adjuster First Name'
                                        {...register('adjuster_fname')}
                                    >

                                    </Form.Control>
                                </Col>

                                <Col className='pl-4 pr-0' md={6}>
                                    <Form.Control
                                        type="text"
                                        onKeyUp={(event) => { }}
                                        placeholder='Enter Adjuster Last Name'
                                        {...register('adjuster_lname')}
                                    >
                                    </Form.Control>
                                </Col>
                            </Row>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} className="INS-float-margin;">
                            Cancel
                        </Button>
                        <Button variant="success" type="submit" form="addinsurance_form">
                            {loading ? 'Saving..' : 'Save'}
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
}

export default InsuranceModal;


