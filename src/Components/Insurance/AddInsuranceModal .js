import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, Row, Col} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import AutoCompleteSearch from './AutoCompleteSearch';
import api from '../../api/api';


const AddInsuranceModal = ({ show, handleClose,handleInsuranceSubmit, client, otherParties=[], defendants=[], insuranceTypes=[], states=[], litigation }) => {
  const { register,setValue,reset, handleSubmit,watch, formState: { errors } } = useForm();
  const dispatch = useDispatch()
  const [searchedInsurances,setSerachInsurances] = useState([])
  let search_input = ''
 

  const onSubmit = async (data) => {
    
    await  handleInsuranceSubmit(data)
    reset()
     
  };


//   Formting phone number an fax number 
 const formatNumber = (inputVal)=> {
    inputVal = inputVal.replace(/\D/g, '');
    // Insert formatting characters
    inputVal = '(' + inputVal.substring(0, 3) + ') ' + inputVal.substring(3, 6) + '-' + inputVal.substring(6, 10);
    // Update input value
    return inputVal
       
}

function handleChange(event,inputType) {
   if(inputType == "phoneNumber")
    {
        let formattedValue = formatNumber(event.target.value);
        setValue('phoneNumber', formattedValue);
    }
    if (inputType == "fax")
        {
        let formattedValue = formatNumber(event.target.value);
        setValue('fax', formattedValue);
        }
}


const fetchData = async (search) => {
  
  try {
    const response = await api.get(`/api/insurances/search/`);
    const searchedData = response.data.data.filter(insurance=>
      insurance.company_name.toLowerCase().startsWith(search.toLowerCase()) ||  insurance.address1.toLowerCase().startsWith(search.toLowerCase())
      ||  insurance.address2.toLowerCase().startsWith(search.toLowerCase()) ||  insurance.city.toLowerCase().startsWith(search.toLowerCase())
      ||  insurance.state.toLowerCase().startsWith(search.toLowerCase()) ||  insurance.zip.toLowerCase().startsWith(search.toLowerCase())
    )
    setSerachInsurances(searchedData);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    // setDataLoading(false);
  }
};


// Handler for Searching Insurances
const handleSearchInsurances =  (event)=>{
  
   search_input = event.target.value
   if (search_input.length > 0)
    {
       fetchData(search_input)
    }else{
      setSerachInsurances([])
    }
}



// populate the fields when insurnce from the search Insurances is selected
const handleSelectedInsurance = (id)=>{
  let selectedInsurance = searchedInsurances.filter(insurance=> insurance.id == id)
  selectedInsurance = {...selectedInsurance[0]}
  setValue('address1',selectedInsurance.address1)
  setValue('address2',selectedInsurance.address2)
  setValue('city',selectedInsurance.city)
  setValue('phoneNumber',formatNumber(selectedInsurance.phone))
  setValue('fax',formatNumber(selectedInsurance.fax))
  setValue('policyNumber',selectedInsurance.policy_number)
  setValue('zip',selectedInsurance.zip)
  setValue('claimNumber',selectedInsurance.claim_number)
  setValue('insuranceTypeId',selectedInsurance.insurance_type)
  setValue('extension',selectedInsurance.extension)
  setValue('email',selectedInsurance.email)
  setValue('companyName',selectedInsurance.company_name)
  setValue('state',selectedInsurance.state)
  setSerachInsurances([])

}

 
      return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="modal-dialog-centered INS-max-width-1000px custom-insurance-dialog">
        <div className='p-2-p'>
          <Modal.Header className="text-center">
            <Modal.Title className="mx-auto">Add Client Insurance</Modal.Title>
            <Button variant="close" onClick={handleClose} aria-label="Close"></Button>
          </Modal.Header>
          <Modal.Body className="panel-popups-body">
            <Form id="addinsurance_form" onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="p-0" md={12}>
                  <Form.Control
                    type="text"
                    onKeyUp={() => handleSearchInsurances(event)}
                    placeholder="Type insurance company name to search directory then click an entry"
                    className={`mb-1 ${errors.insuranceCompany && 'is-invalid'}`}
                    {...register('insuranceCompany')}
                  />
      
                  {searchedInsurances.length > 0 && <AutoCompleteSearch searchedInsurances={searchedInsurances} selectedInsurance={handleSelectedInsurance} isCompany={true} />}
                </Col>
              </Row>
              <Row className="align-items-center ss-m-bottom">
                <Col md={2} className='p-0'>
                  <p className="text-secondary INS-color-black Text-w-NW-INS">Insurance Company Name:</p>
                </Col>
                <Col md={4} className='p-0'>
                  <Form.Control
                    type="text"
                    placeholder="Enter Insurance Company Name"
                    {...register('companyName')}
                    className={`form-control ${errors.companyName && 'is-invalid'}`}
                  />
                  {errors.companyName && <div className="invalid-feedback">{errors.companyName.message}</div>}
                </Col>
                <Col className="ps-3" md={2}>
                  <p className="text-secondary INS-color-black">Entity:</p>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Select
                    {...register('insuranceEntity')}
                    className={`form-control ${errors.insuranceEntity && 'is-invalid'}`}
                  >
                    {client && 
                      <option key={client.id} value={`${client.model_name}, ${client.id}`}>
                        {client.first_name} {client.last_name} (Client)
                      </option>
                    }
                    {otherParties && otherParties?.map(other => (
                      <option key={other.id} value={`${other.model_name}, ${other.id}`}>
                        {other.first_name} {other.last_name} (Other Party)
                      </option>
                    ))}
                    {defendants && defendants?.map(defendant => (
                      <option key={defendant.id} value={`${defendant.model_name}, ${defendant.id}`}>
                        {defendant.first_name} {defendant.last_name} (Defendant)
                      </option>
                    ))}
                  </Form.Select>
                  {errors.insuranceEntity && <div className="invalid-feedback">{errors.insuranceEntity.message}</div>}
                </Col>
              </Row>
              <Row className="align-items-center ss-m-bottom">
                <Col md={2} className='p-0'>
                  <p className="text-secondary INS-color-black Text-w-NW-INS">Address 1 :</p>
                </Col>
                <Col md={4} className='p-0'>
                  <Form.Control
                    type="text"
                    placeholder="Address 1"
                    className={`form-control ${errors.address1 && 'is-invalid'}`}
                    {...register('address1')}
                  />
                  {errors.address1 && <div className="invalid-feedback">{errors.address1.message}</div>}
                </Col>
                <Col className="ps-3" md={2}>
                  <p className="text-secondary INS-color-black">Type:</p>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Select
                    {...register('insuranceTypeId')}
                    className={`form-control ${errors.insuranceTypeId && 'is-invalid'}`}
                  >
                    {insuranceTypes && insuranceTypes?.map(insuranceType => {
                      if (!insuranceType?.state || (insuranceType?.state && insuranceType?.state?.id === litigation?.state?.id)) {
                        return (
                          <option key={insuranceType?.id} value={insuranceType?.id}>
                            {insuranceType?.name}
                          </option>
                        );
                      }
                      return null;
                    })}
                  </Form.Select>
                  {errors.insuranceTypeId && <div className="invalid-feedback">{errors.insuranceTypeId.message}</div>}
                </Col>
              </Row>
              <Row className="align-items-center ss-m-bottom">
                <Col className="p-0" md={2}>
                  <p className="text-secondary INS-color-black Text-w-NW-INS">Address 2 :</p>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Address 2"
                    {...register('address2')}
                  />
                </Col>
                <Col className="ps-3" md={2}>
                  <p className="text-secondary INS-color-black Text-w-NW-INS">Policy # :</p>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Enter Policy #"
                    {...register('policyNumber')}
                    className={`form-control ${errors.policyNumber && 'is-invalid'}`}
                  />
                  {errors.policyNumber && <div className="invalid-feedback">{errors.policyNumber.message}</div>}
                </Col>
              </Row>
              <Row className="align-items-center ss-m-bottom">
                <Col className="p-0" md={2}>
                  <p className="text-secondary INS-color-black">City :</p>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    placeholder="City"
                    {...register('city')}
                    className={`form-control ${errors.city && 'is-invalid'}`}
                  />
                  {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
                </Col>
                <Col className="ps-3" md={2}>
                  <p className="text-secondary INS-color-black Text-w-NW-INS">Claim # :</p>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Enter Claim #"
                    {...register('claimNumber')}
                    className={`form-control ${errors.claimNumber && 'is-invalid'}`}
                  />
                  {errors.claimNumber && <div className="invalid-feedback">{errors.claimNumber.message}</div>}
                </Col>
              </Row>
              <Row className="align-items-center ss-m-bottom">
                <Col className="p-0" md={2}>
                  <p className="text-secondary INS-color-black">State :</p>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Select
                    {...register('state')}
                    className={`form-control ${errors.state && 'is-invalid'}`}
                  >
                    {states?.map(state => (
                      <option key={state.StateAbr} value={state.StateAbr}>
                        {state.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.state && <div className="invalid-feedback">{errors.state.message}</div>}
                </Col>
                <Col className="ps-3" md={2}>
                  <p className="text-secondary INS-color-black">Fax :</p>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    placeholder="(###) ###-####"
                    {...register('fax')}
                    onKeyUp={() => handleChange(event, "fax")}
                  />
                </Col>
              </Row>
              <Row className="align-items-center ss-m-bottom">
                <Col className="p-0" md={2}>
                  <p className="text-secondary">ZIP :</p>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    placeholder="ZIP"
                    {...register('zip')}
                    className={`form-control ${errors.zip && 'is-invalid'}`}
                  />
                  {errors.zip && <div className="invalid-feedback">{errors.zip.message}</div>}
                </Col>
              </Row>
              <Row className="align-items-center ss-m-bottom">
               
                  
                    <Col className="p-0" md={2}>
                      <p className="text-secondary INS-color-black">Phone :</p>
                    </Col>
                    <Col className="p-0" md={2}>
                      <Form.Control
                        type="text"
                        placeholder="(###) ###-####"
                        {...register('phoneNumber')}
                        className={`form-control ${errors.phoneNumber && 'is-invalid'}`}
                        onKeyUp={() => handleChange(event, "phoneNumber")}
                      />
                      {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber.message}</div>}
                    </Col>
                    <Col md={1} >
                      <span className=" text-black">Ext:</span>
                    </Col>
                    <Col md={1} className="pl-0 p-0 ">
                      <Form.Control
                        type="number"
                        placeholder="Extension"
                        {...register('extension')}
                        style={{paddingLeft:'5px',paddingRight:'5px'}}
                      />
                    </Col>
                  
               
              </Row>
              <Row className="align-items-center ss-m-bottom">
                <Col className="p-0" md={2}>
                  <p className="text-secondary INS-color-black">Email :</p>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    {...register('email')}
                    className={`form-control ${errors.email && 'is-invalid'}`}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </Col>
              </Row>
              <Row>
                <Col className="p-0" md={2}>
                  <p className="text-secondary INS-color-black">Website :</p>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Website"
                    {...register('website')}
                    className={`form-control`}
                  />
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} className="INS-float-margin;">
              Cancel
            </Button>
            <Button variant="success" type="submit" form="addinsurance_form">
              Save
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
      );
   
 
};

export default AddInsuranceModal;

