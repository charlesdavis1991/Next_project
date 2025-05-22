import React from 'react';
import { useState,useRef,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import AutoCompleteSearch from '../../Insurance/AutoCompleteSearch';
import api from '../../../api/api';
import { getCaseId, getClientId } from '../../../Utils/helper';
import { createInsurance } from '../../../Redux/insurance/insuranceSlice';



const AddWitnessInsuranceModal = ({ show, handleClose, handleInsuranceSubmit,currentWitnessId, client, otherParties = [], witnesses = [], insuranceTypes = [], states = [], litigation }) => {
  const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm();
  const [openDropdown,setOpenDropDown] = useState(false)
  const[searchedCompany,setSearchedCompany] = useState([])
  const[searchedAdjuster,setSearchedAdjuster] = useState([])
  const searchType = useRef('')
  const dropdownRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    // const witnesses_ids = document.querySelector(".witness-ids").value
    await dispatch(createInsurance({client_id:getClientId(),case_id:getCaseId(),data:{...data,witnesses_ids:currentWitnessId}}))
    handleClose()
    handleInsuranceSubmit()

  };



  //   Formting phone number an fax number 
  const formatNumber = (inputVal) => {
    inputVal = inputVal.replace(/\D/g, '');
    // Insert formatting characters
    inputVal = '(' + inputVal.substring(0, 3) + ') ' + inputVal.substring(3, 6) + '-' + inputVal.substring(6, 10);
    // Update input value
    return inputVal

  }

  // Handling Searching 
  const handleSearch =  async(event,type)=>{
    searchType.current = type
    let companies=[]
    let adjusters=[]
    if (event.target.value.length > 0)
     {
        if(type == "company")
          {
              const response = await api.get(`/api/insurances/search/`);
              companies = response.data.data.filter(insurance=>
              insurance.company_name.toLowerCase().startsWith(event.target.value.toLowerCase()) ||  insurance.address1.toLowerCase().startsWith(event.target.value.toLowerCase())
              ||  insurance.address2.toLowerCase().startsWith(event.target.value.toLowerCase()) ||  insurance.city.toLowerCase().startsWith(event.target.value.toLowerCase())
              ||  insurance.state.toLowerCase().startsWith(event.target.value.toLowerCase()) ||  insurance.zip.toLowerCase().startsWith(event.target.value.toLowerCase())
            )
          }else if (type=="adjuster")
            {
              const response = await api.get(`/api/insurances/search/adjuster/`);
              adjusters = response.data.data.filter(insurance=>
              insurance.company_name.toLowerCase().startsWith(event.target.value.toLowerCase()) ||  insurance.address1.toLowerCase().startsWith(event.target.value.toLowerCase())
              ||  insurance.address2.toLowerCase().startsWith(event.target.value.toLowerCase()) ||  insurance.city.toLowerCase().startsWith(event.target.value.toLowerCase())
              ||  insurance.state.toLowerCase().startsWith(event.target.value.toLowerCase()) ||  insurance.zip.toLowerCase().startsWith(event.target.value.toLowerCase())
        )
            }
     }

     setSearchedCompany(companies)
     setSearchedAdjuster(adjusters)
    
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

// let no=0
//   function select_multiple_witnesses(this_el) {
//     var id = this_el.getAttribute('data-id');
//     var name = this_el.textContent.trim();

//     var witnessNamesInput = this_el.closest('.dropdown-content-defendant').parentElement.querySelector(".defendant-names");
//     var witnessIdsInput = this_el.closest('.dropdown-content-defendant').parentElement.querySelector(".witness-ids");
//     var names = witnessNamesInput.value.trim();
//     var ids = witnessIdsInput.value.trim();

//     if (names && ids) {
     
//       names = names.split(", ");
//       ids = ids.split(",");
//     } else {
     
//       names = [];
//       ids = [];
//     }

//     var index = names.indexOf(name);
//     if (index === -1) {
//       names.push(name);
//       ids.push(id);
//       witnessNamesInput.value = names.join(", ");
//       witnessIdsInput.value = ids.join(",");
//       this_el.classList.add("selected");
//       // document.getElementById("witness-names-container").insertAdjacentHTML('beforeend', '<span class="witness-tag" data-id="'+id+'">'+name+'<span class="remove-witness">x</span></span>');
//     } else {
//       names.splice(index, 1);
//       ids.splice(index, 1);
//       witnessNamesInput.value = names.join(", ");
//       witnessIdsInput.value = ids.join(",");
//       this_el.classList.remove("selected");
//       var tagToRemove = document.querySelector("#witness-names-container [data-id='" + id + "']");
//       if (tagToRemove) {
//         tagToRemove.remove();
//       }
//     }
//   }


  const handleSelectedInsurance = (id)=>{
    if(searchType.current == "company")
      {
        let selectedCompany = searchedCompany.filter(insurance=> insurance.id == id)
        selectedCompany = {...selectedCompany[0]}
        setValue('phoneNumber',formatNumber(selectedCompany?.phone))
        setValue('fax',formatNumber(selectedCompany?.fax))
        setValue('email',selectedCompany?.email)
        setValue('companyName',selectedCompany?.company_name)
        setValue('website',selectedCompany?.website)
        setValue('address1',selectedCompany?.address1)
        setValue('address2',selectedCompany?.address2)
        setValue('zip',selectedCompany?.zip)
        setValue('city',selectedCompany?.city)
        setValue('state',selectedCompany?.state)
        setValue('extension',selectedCompany?.extension)

        setSearchedCompany([])
      }

      if(searchType.current == "adjuster")
        {
          let selectedAdjuster = searchedAdjuster.filter(insurance=> insurance.id == id)
          selectedAdjuster = {...selectedAdjuster[0]}
          setValue('adjuster_fname',selectedAdjuster?.adjuster_firstname)
          setValue('adjuster_lname',selectedAdjuster?.adjuster_lastname)

          setSearchedAdjuster([])
        }
  }

 
  // useEffect(() => {
  //   if (dropdownRef.current) {
  //     const listItems = dropdownRef.current.querySelectorAll('li');
  //     for (let i = 0; i < listItems.length; i++) {
  //        const this_el = listItems[i]
  //         const id = this_el.getAttribute('data-id'); // Perform your logic here
  //         if(id == currentWitnessId)
  //         {
  //           var name = this_el.textContent.trim();
          
        
  //           var witnessNamesInput = this_el.closest('.dropdown-content-defendant').parentElement.querySelector(".defendant-names");
            
  //           var witnessIdsInput = this_el.closest('.dropdown-content-defendant').parentElement.querySelector(".witness-ids");
           
  //           var names = witnessNamesInput.value.trim();
      
  //           var ids = witnessIdsInput.value.trim();
        
        
  //           if (names && ids) {
         
  //             names = names.split(", ");
              
  //             ids = ids.split(",");
             
  //           } else {
             
  //             names = [];
  //             ids = [];
  //           }
        
  //           var index = names.indexOf(name);
  //           if (index === -1) {
  //             names.push(name);
  //             ids.push(id);
  //             witnessNamesInput.value = names.join(", ");
  //             witnessIdsInput.value = ids.join(",");
  //             this_el.classList.add("selected");
  //             // document.getElementById("witness-names-container").insertAdjacentHTML('beforeend', '<span class="witness-tag" data-id="'+id+'">'+name+'<span class="remove-witness">x</span></span>');
  //           } 
  //         }
       
  //     };
  //   }
  // }, []);

  const [currentWitnessName , setCurrentWitnessName ] = useState(' ')

  useEffect(()=>{
    witnesses.map(witness=>{
          if(witness.id == currentWitnessId)
          {
            const name = `${witness.witness_first_name} ${witness.witness_last_name}`

            setCurrentWitnessName(name)
          }
    })
 },[])

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="modal-dialog-centered INS-max-width-1000px custom-insurance-dialog">
      <div>
        <Modal.Header className="text-center bg-primary-fixed" style={{padding:"5px",color:"#ffffff"}}>
          <Modal.Title className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500 modal-title h4">ADD CLIENT INSURANCE COVERAGE</Modal.Title>
          <Button variant="close" onClick={handleClose} aria-label="Close"></Button>
        </Modal.Header>
        <Modal.Body className="panel-popups-body">
          <Form id="addinsurance_form" onSubmit={handleSubmit(onSubmit)}>
            <Row className='custom-margin-bottom'>
              <Col md={3} style={{display:"flex",alignItems:"center"}}>
               <p className="text-secondary text-darker">Insurance for Witnesses :</p>
              </Col>
              <Col md={9}>
                {/* <div className="dropdown-defendant form-control">
                  <input
                    type="text"
                    className="defendant-names"
                    placeholder="select a defendant"
                    onClick={()=> setOpenDropDown(!openDropdown)}
                    readOnly
                    style={{border: "none"}}
                  />
                  <input
                    type="hidden"
                    ref={hiddenInputRef}
                    className="defendant-ids"
                  />
                  <span className="dropdown-arrow"  onClick={()=> setOpenDropDown(!openDropdown)}></span>
                  <div ref={dropdownRef} className={`dropdown-content-defendant ${openDropdown ? 'd-block': ''}`}>
                    <ul className="defendant-list ">
                      {defendants && defendants.map((defendant, index) => (
                        <li key={index} data-id={defendant.id}
                         onClick={() => select_multiple_defendant(event.target)}>
                          {defendant?.first_name} {defendant?.last_name}
                          </li>
                      ))}
                    </ul>
                  </div>
                </div> */}
                <Form.Control type='text' value={currentWitnessName} disabled/>
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter Policy#"
                  {...register('policyNumber')}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter Claim#"
                  {...register('claimNumber')}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  as="select"
                  className={`custom-margin-bottom`}
                  {...register('insuranceTypeId')}
                >
                  <option value="" disabled selected>Select Coverage Type for ({currentWitnessName})</option>
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
                </Form.Control>
              </Col>
            </Row>
            <Row className="custom-margin-bottom">
              <Col md={12}>
                <Form.Control
                  type="text"
                  placeholder="Type Insurance Company Name to add from library"
                  onKeyUp={()=> handleSearch(event,'company')}
                 
                />
                 { searchedCompany?.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedCompany} selectedInsurance={handleSelectedInsurance} isCompany={true}/>}
              </Col>
            </Row>
           

            <Row className="align-items-center custom-margin-bottom">
              <Col md={4} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  placeholder="Enter company name"
                  {...register('companyName')}
                />
              </Col>
              <Col md={4} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  placeholder="Enter website"
                  {...register('website')}
                />
              </Col>
              <Col md={4} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  {...register('phoneNumber')}
                  onKeyUp={() => handleChange(event,'phoneNumber')}
                />
              </Col>
              <Col md={4} className=''>
                <Form.Control
                  type="text"
                  placeholder="Enter Fax"
                  onKeyUp={() => handleChange(event,'fax')}
                  {...register('fax')}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter Email"
                  {...register('email')}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter extension"
                  {...register('extension')}
                />
              </Col>
            </Row>
           

            <Row className="align-items-center custom-margin-bottom">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Enter Address 1"
                  {...register('address1')}
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Enter Address 2"
                  {...register('address2')}
                />
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom ">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter City"
                  {...register('city')}
                />
              </Col>
              <Col md={4}>
                <Form.Select
                  {...register('state')}
                  className={`custom-margin-bottom ${errors.state && 'is-invalid'}`}
                >
                  <option value=''  disabled selected>Select State</option>
                  {states?.map(state => (
                    <option key={state.StateAbr} value={state.StateAbr}>
                      {state.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter ZIP"
                  {...register('zip')}
                />
              </Col>
            </Row>
            

            <Row className="custom-margin-bottom">
              <Col md={12}>
                <Form.Control
                  type="text"
                  placeholder="Type Adjuster Name to add from library"
                  onKeyUp={()=> handleSearch(event,'adjuster')}
                  
                />
                 { searchedAdjuster.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedAdjuster} selectedInsurance={handleSelectedInsurance}/>}
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Enter Adjuster First Name"
                  {...register('adjuster_fname')}
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Enter Adjuster Last Name"
                  {...register('adjuster_lname')}
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


    //OLD UI
    // <Modal show={show} onHide={handleClose} centered dialogClassName="modal-dialog-centered INS-max-width-1000px custom-insurance-dialog">
    //   <div className='p-2-p'>
    //     <Modal.Header className="text-center">
    //       <Modal.Title className="mx-auto">Add Client Insurance Coverage</Modal.Title>
    //       <Button variant="close" onClick={handleClose} aria-label="Close"></Button>
    //     </Modal.Header>
    //     <Modal.Body className="panel-popups-body">
    //       <Form id="addinsurance_form" onSubmit={handleSubmit(onSubmit)}>
    //         <Row className='custom-margin-bottom'>
    //           <Col md={3}>
    //             <p className="text-secondary text-darker">Insurance for Witnesses :</p>
    //           </Col>
    //           <Col md={9}>
    //             <div className="dropdown-defendant form-control">
    //               <input
    //                 type="text"
    //                 className="defendant-names"
    //                 placeholder="select a witness"
    //                 onClick={()=> setOpenDropDown(!openDropdown)}
    //                 readOnly
    //                 style={{border: "none"}}
    //               />
    //               <input
    //                 type="hidden"
    //                 ref={hiddenInputRef}
    //                 className="witness-ids"
    //               />
    //               <span className="dropdown-arrow"  onClick={()=> setOpenDropDown(!openDropdown)}></span>
    //               <div ref={dropdownRef} className={`dropdown-content-defendant ${openDropdown ? "d-block" : ""}`}>
    //                 <ul className="defendant-list">
    //                   {witnesses && witnesses.map((witness, index) => (
    //                     <li key={index} data-id={witness.id}
    //                      onClick={() => select_multiple_witnesses(event.target)}>
    //                       {witness?.witness_first_name} {witness?.witness_last_name}
    //                       </li>
    //                   ))}
    //                 </ul>
    //               </div>
    //             </div>
    //           </Col>
    //         </Row>
    //         <Row className="align-items-center custom-margin-bottom">
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Policy#"
    //               {...register('policyNumber')}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Claim#"
    //               {...register('claimNumber')}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               as="select"
    //               className={`custom-margin-bottom ${errors.insuranceTypeId && "is-invalid"}`}
    //               {...register('insuranceTypeId' ,  {required : true})}
    //             >
    //               <option value="" disabled selected>Select Coverage Type</option>
    //               {insuranceTypes && insuranceTypes?.map(insuranceType => {
    //                 if (!insuranceType.state || (insuranceType.state && insuranceType.state.id === litigation.state.id)) {
    //                   return (
    //                     <option key={insuranceType.id} value={insuranceType.id}>
    //                       {insuranceType.name}
    //                     </option>
    //                   );
    //                 }
    //                 return null;
    //               })}
    //             </Form.Control>
    //           </Col>
    //         </Row>
    //         <Row className="custom-margin-bottom">
    //           <Col md={12}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Type Insurance Company Name to add from library"
    //               onKeyUp={()=> handleSearch(event,'company')}
                 
    //             />
    //              { searchedCompany.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedCompany} selectedInsurance={handleSelectedInsurance} isCompany={true}/>}
    //           </Col>
    //         </Row>
    //         <div className="k-separator mt-3 mb-3"></div>

    //         <Row className="align-items-center">
    //           <Col md={4} className="custom-margin-bottom">
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter company name"
    //               {...register('companyName')}
    //             />
    //           </Col>
    //           <Col md={4} className="custom-margin-bottom">
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter website"
    //               {...register('website')}
    //             />
    //           </Col>
    //           <Col md={4} className="custom-margin-bottom">
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter phone number"
    //               {...register('phoneNumber')}
    //               onKeyUp={() => handleChange(event,'phoneNumber')}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Fax"
    //               onKeyUp={() => handleChange(event,'fax')}
    //               {...register('fax')}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Email"
    //               {...register('email')}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter extension"
    //               {...register('extension')}
    //             />
    //           </Col>
    //         </Row>
    //         <div className="k-separator mt-3 mb-3"></div>

    //         <Row className="align-items-center custom-margin-bottom">
    //           <Col md={6}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Address 1"
    //               {...register('address1')}
    //             />
    //           </Col>
    //           <Col md={6}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Address 2"
    //               {...register('address2')}
    //             />
    //           </Col>
    //         </Row>
    //         <Row className="align-items-center">
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter City"
    //               {...register('city')}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Select
    //               {...register('state')}
    //               className={`custom-margin-bottom ${errors.state && 'is-invalid'}`}
    //             >
    //               {states?.map(state => (
    //                 <option key={state.StateAbr} value={state.StateAbr}>
    //                   {state.name}
    //                 </option>
    //               ))}
    //             </Form.Select>
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter ZIP"
    //               {...register('zip')}
    //             />
    //           </Col>
    //         </Row>
    //         <div className="k-separator mt-3 mb-3"></div>

    //         <Row className="custom-margin-bottom">
    //           <Col md={12}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Type Adjuster Name to add from library"
    //               onKeyUp={()=> handleSearch(event,'adjuster')}
                  
    //             />
    //              { searchedAdjuster.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedAdjuster} selectedInsurance={handleSelectedInsurance}/>}
    //           </Col>
    //         </Row>
    //         <Row className="align-items-center custom-margin-bottom">
    //           <Col md={6}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Adjuster First Name"
    //               {...register('adjuster_fname')}
    //             />
    //           </Col>
    //           <Col md={6}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Adjuster Last Name"
    //               {...register('adjuster_lname')}
    //             />
    //           </Col>
    //         </Row>
    //       </Form>
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button variant="secondary" onClick={handleClose} className="INS-float-margin;">
    //         Cancel
    //       </Button>
    //       <Button variant="success" type="submit" form="addinsurance_form">
    //         Save
    //       </Button>
    //     </Modal.Footer>
    //   </div>
    // </Modal>
  );


};

export default AddWitnessInsuranceModal;

