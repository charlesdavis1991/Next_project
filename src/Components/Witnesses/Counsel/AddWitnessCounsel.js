import React from "react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import api from "../../../api/api";
import { getCaseId, getClientId } from "../../../Utils/helper";





// RK:08-09-2024 :: 2:40 am 
function AddWitnessCounsel({ handleClose,handleFacth , witnesses = [], currentWitnessId}) {
  const { register, setValue, reset, handleSubmit, watch, formState: { errors },
  } = useForm();

  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCaseId = getCaseId()
  const clientId = getClientId()
  const [counselTypes, setCounselTypes] = useState([])
  const [openDropdown, setOpenDropDown] = useState(false);
  const [selectedWitnesses, setSelectedWitnesses] = useState([]);
  const [currentWitnessName , setCurrentWitnessName ] = useState(' ')
  const [statesAbrs, setStatesAbrs] = useState([]);
  

 
  const fecthCounselTypes = async() =>{
    try {   
        const response = await api.get(`${origin}/api/defendants/counsel_types/`)
        if (response.status === 200){
            setCounselTypes(response.data)
        }
    } catch (error) {
        console.log(error)
    }
  }

  const fetchSatesData = async () => {
    try {
      const response = await api.get(`${origin}/api/states/`);
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };



  const setCurrentDefendant = () => {
    if (witnesses) {
      const matchedWitness = witnesses.find(d => d.id === currentWitnessId);
      if (matchedWitness) {
        setSelectedWitnesses([matchedWitness]);
      }
    }return;
  };

  useEffect(()=> {
    fetchSatesData();
    fecthCounselTypes()
    setCurrentDefendant()
  }, [])


  const selectMultipleWitnesses = (event, witness) => {
    event.stopPropagation();
    const updatedSelectedWitnesses = [...selectedWitnesses];
    const index = updatedSelectedWitnesses.findIndex(
      (d) => d.id === witness.id
    );

    if (index > -1) {
      updatedSelectedWitnesses.splice(index, 1);
    } else {
      updatedSelectedWitnesses.push(witness);
    }

    setSelectedWitnesses(updatedSelectedWitnesses);
  };


  const formatNumber = (inputVal) => {
    inputVal = inputVal.replace(/\D/g, '');
    // Insert formatting characters
    inputVal = '(' + inputVal.substring(0, 3) + ') ' + inputVal.substring(3, 6) + '-' + inputVal.substring(6, 10);
    // Update input value
    return inputVal

  }

  function handleChange(event, inputType) {
    if (inputType == "firm_phone") {
      let formattedValue = formatNumber(event.target.value);
      setValue("firm_phone", formattedValue);
    }
    if (inputType == "firm_fax") {
      let formattedValue = formatNumber(event.target.value);
      setValue("firm_fax", formattedValue);
    }
    if (inputType == "counsel_phone") {
      let formattedValue = formatNumber(event.target.value);
      setValue("counsel_phone", formattedValue);
    }
    if (inputType == "counsel_fax") {
      let formattedValue = formatNumber(event.target.value);
      setValue("counsel_fax", formattedValue);
    }
  }





  const onSubmit = async(data) => {
    const cleanedData = {
        ...data,
        witness_ids: selectedWitnesses.map((def)=> def.id) ,
        counsel_type_id : data.counsel_type_id? data.counsel_type_id : null
    }

    console.log(cleanedData)

    try {
        const response  = await api.post(`${origin}/api/addWitnessCounsel/${clientId}/${currentCaseId}/`, cleanedData)
        if (response.status === 200){
            handleClose()
            handleFacth()
        }
    } catch (error) {
        console.log(error)
    }
  };

  

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
    <Modal
    show={true}
    onHide={handleClose}
    centered
    dialogClassName="modal-dialog-centered INS-max-width-1000px custom-insurance-dialog"
  >
    <div>
      <Modal.Header className="text-center bg-primary-fixed" style={{padding:"5px",color:"#ffffff"}} >
        <Modal.Title className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500 modal-title h4">
          ADD PREVIOUS CLIENT COUNSEL
        </Modal.Title>
        <Button
          variant="close"
          onClick={handleClose}
          aria-label="Close"
        ></Button>
      </Modal.Header>
      <Modal.Body className="panel-popups-body">
        <Form id="addCounsel_form" onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-2">
            <Col md={3} className="d-flex align-items-center">
              <p className="text-secondary text-darker">
                Counsel for Witness :
              </p>
            </Col>
            <Col md={9}>
              {/* <div className="dropdown-defendant form-control">
                <input
                  type="text"
                  className="defendant-names"
                  placeholder="Select a Defendant"
                  onClick={() => setOpenDropDown(!openDropdown)}
                  readOnly
                  value={selectedDefendants
                    .map((d) => `${d.first_name} ${d.last_name}`)
                    .join(", ")}

                  style={{border: "none"}}
                />
                <input
                  type="hidden"
                  className="defendant-ids"
                  value={selectedDefendants.map((d) => d.id).join(",")}
                />
                <span
                  className="dropdown-arrow"
                  onClick={() => setOpenDropDown(!openDropdown)}
                ></span>
                <div
                  className={`dropdown-content-defendant ${openDropdown ? "d-block" : ""}`}
                >
                  <ul className="defendant-list">
                    {defendants &&
                      defendants.map((defendant, index) => (
                        <li
                          key={index}
                          data-id={defendant.id}
                          onClick={(event) =>
                            selectMultipleDefendant(event, defendant)
                          }
                          className={
                            selectedDefendants.find(
                              (d) => d.id === defendant.id
                            )
                              ? "selected"
                              : ""
                          }
                        >
                          {defendant.first_name} {defendant.last_name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div> */}
                <Form.Control type='text' value={currentWitnessName} disabled/>
            </Col>
          </Row>
          <Row className="align-items-center custom-margin-bottom">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Enter File #"
                {...register("file_number")}
              />
            </Col>
            <Col md={6}>
              <select  className={`form-select ${errors.counsel_type_id && "is-invalid"}`} {...register("counsel_type_id")}>
                <option value={''} className="form-control">Select Counsel Type for ({currentWitnessName})</option>
                      {counselTypes && counselTypes?.map((counsel , index)=>(
                          <option key={counsel.id} value={counsel.id} >{counsel.name}</option>
                      ))
                      }
              </select>
            </Col>
          </Row>
          <p className="font-weight-bold mb-1 mt-1">Frim Information</p>
          <Row>
            <Col md={12}>
              <Form.Control placeholder="Type Counsel Name or Firm Name to add from library" />
            </Col>
          </Row>

          <Row className="align-items-center  mt-2">
            <Col md={4} className="custom-margin-bottom">
              <Form.Control
                type="text"
                placeholder="Enter Name"
                className={`form-control ${errors.firm_name && "is-invalid"}`}
                {...register("firm_name" )}
              />
            </Col>
            <Col md={4} className="custom-margin-bottom">
              <Form.Control
                type="text"
                placeholder="Enter website"
                {...register("frim_website")}
              />
            </Col>
            <Col md={4} className="custom-margin-bottom">
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                {...register("firm_phone")}
                onKeyUp={() => handleChange(event, "firm_phone")}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter Fax"
                onKeyUp={() => handleChange(event, "firm_fax")}
                {...register("firm_fax")}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter Email"
                {...register("firm_email")}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter extension"
                {...register("firm_extension")}
              />
            </Col>
          </Row>

          <Row className="align-items-center custom-margin-bottom  mt-2">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Enter Address 1"
                {...register("firm_address1")}
              />
            </Col>
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Enter Address 2"
                {...register("firm_address2")}
              />
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter City"
                {...register("firm_city")}
              />
            </Col>
            <Col md={4}>
              <Form.Select
                {...register("firm_state")}
              //   className={`form-control ${errors.state && "is-invalid"}`}
              >
                <option value=''  disabled selected>Select State</option>
                {statesAbrs?.map((state) => (
                  <option
                    key={state.StateAbr}
                    value={state.StateAbr}
                  >
                    {state.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter ZIP"
                {...register("firm_zip")}
              />
            </Col>
          </Row>

          <div className="k-separator mt-2 mb-2"></div>
          <p className="font-weight-bold mb-1 mt-1">Counsel Information</p>

          <Row>
            <Col md={12}>
              <Form.Control placeholder="Type Counsel Name or Firm Name to add from library" />
            </Col>
          </Row>

          <Row className="align-items-center  mt-2">
            <Col md={4} className="custom-margin-bottom">
              <Form.Control
                type="text"
                placeholder="Enter First name"
                {...register("counsel_first_name")}
              />
            </Col>
            <Col md={4} className="custom-margin-bottom">
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                {...register("counsel_last_name")}
              />
            </Col>
            <Col md={4} className="custom-margin-bottom">
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                {...register("counsel_phone")}
                onKeyUp={() => handleChange(event, "counsel_phone")}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter Fax"
                onKeyUp={() => handleChange(event, "counsel_fax")}
                {...register("counsel_fax")}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter Email"
                {...register("counsel_email")}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter extension"
                {...register("counsel_extension")}
              />
            </Col>
          </Row>

          <Row className="align-items-center custom-margin-bottom mt-2">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Enter Address 1"
                {...register("counsel_address1")}
              />
            </Col>
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Enter Address 2"
                {...register("counsel_address2")}
              />
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter City"
                {...register("counsel_city")}
              />
            </Col>
            <Col md={4}>
              <Form.Select
                {...register("counsel_state")}
              >
                <option value=''  disabled selected>Select State</option>
                {statesAbrs?.map((state) => (
                  <option
                    key={state.StateAbr}
                    value={state.StateAbr}
                   
                  >
                    {state.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter ZIP"
                {...register("counsel_zip")}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          className="INS-float-margin;"
        >
          Cancel
        </Button>
        <Button variant="success" type="submit" form="addCounsel_form">
          Save
        </Button>
      </Modal.Footer>
    </div>
  </Modal>

    //OLD UI
    // <Modal
    //   show={true}
    //   onHide={handleClose}
    //   centered
    //   dialogClassName="modal-dialog-centered INS-max-width-1000px custom-insurance-dialog"
    // >
    //   <div className="p-2-p">
    //     <Modal.Header className="text-center">
    //       <Modal.Title className="mx-auto">
    //         Add Previous Client Counsel
    //       </Modal.Title>
    //       <Button
    //         variant="close"
    //         onClick={handleClose}
    //         aria-label="Close"
    //       ></Button>
    //     </Modal.Header>
    //       <Form id="addCounsel_witness_form" onSubmit={handleSubmit(onSubmit)}>
    //     <Modal.Body className="panel-popups-body">
    //         <Row className="mb-2">
    //           <Col md={3}>
    //             <p className="text-secondary text-darker">
    //               Counsel for Witnesses :
    //             </p>
    //           </Col>
    //           <Col md={9}>
    //             <div className="dropdown-defendant form-control">
    //               <input
    //                 type="text"
    //                 className="defendant-names"
    //                 placeholder="Select a Witness"
    //                 onClick={() => setOpenDropDown(!openDropdown)}
    //                 readOnly
    //                 value={selectedWitnesses
    //                   .map((d) => `${d.witness_first_name} ${d.witness_last_name}`)
    //                   .join(", ")}

    //                 style={{border: "none"}}
    //               />
    //               <input
    //                 type="hidden"
    //                 className="witness-ids"
    //                 value={selectedWitnesses.map((d) => d.id).join(",")}
    //               />
    //               <span
    //                 className="dropdown-arrow"
    //                 onClick={() => setOpenDropDown(!openDropdown)}
    //               ></span>
    //               <div
    //                 className={`dropdown-content-defendant ${openDropdown ? "d-block" : ""}`}
    //               >
    //                 <ul className="defendant-list">
    //                   {witnesses &&
    //                     witnesses.map((witness, index) => (
    //                       <li
    //                         key={index}
    //                         data-id={witness.id}
    //                         onClick={(event) =>
    //                           selectMultipleWitnesses(event, witness)
    //                         }
    //                         className={
    //                           selectedWitnesses.find(
    //                             (d) => d.id === witness.id
    //                           )
    //                             ? "selected"
    //                             : ""
    //                         }
    //                       >
    //                         {witness.witness_first_name} {witness.witness_last_name}
    //                       </li>
    //                     ))}
    //                 </ul>
    //               </div>
    //             </div>
    //           </Col>
    //         </Row>
    //         <Row className="align-items-center custom-margin-bottom">
    //           <Col md={6}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter File #"
    //               {...register("file_number")}
    //             />
    //           </Col>
    //           <Col md={6}>
    //             <select  className={`form-control ${errors.counsel_type_id && "is-invalid"}`} {...register("counsel_type_id" , {required :true})}>
    //               <option value={''} className="form-control">Select Counsel Type</option>
    //                     {counselTypes && counselTypes?.map((counsel , index)=>(
    //                         <option key={counsel.id} value={counsel.id} >{counsel.name}</option>
    //                     ))
    //                     }
    //             </select>
    //           </Col>
    //         </Row>
    //         <p className="font-weight-bold mb-1 mt-1">Frim Information</p>
    //         <Row>
    //           <Col md={12}>
    //             <Form.Control placeholder="Type Counsel Name or Firm Name to add from library" />
    //           </Col>
    //         </Row>

    //         <Row className="align-items-center  mt-2">
    //           <Col md={4} className="custom-margin-bottom">
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Name"
    //               className={`form-control ${errors.firm_name && "is-invalid"}`}
    //               {...register("firm_name" ,  {required : true})}
    //             />
    //           </Col>
    //           <Col md={4} className="custom-margin-bottom">
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter website"
    //               {...register("frim_website")}
    //             />
    //           </Col>
    //           <Col md={4} className="custom-margin-bottom">
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter phone number"
    //               {...register("firm_phone")}
    //               onKeyUp={() => handleChange(event, "firm_phone")}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Fax"
    //               onKeyUp={() => handleChange(event, "firm_fax")}
    //               {...register("firm_fax")}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Email"
    //               {...register("firm_email")}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter extension"
    //               {...register("firm_extension")}
    //             />
    //           </Col>
    //         </Row>

    //         <Row className="align-items-center custom-margin-bottom  mt-2">
    //           <Col md={6}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Address 1"
    //               {...register("firm_address1")}
    //             />
    //           </Col>
    //           <Col md={6}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Address 2"
    //               {...register("firm_address2")}
    //             />
    //           </Col>
    //         </Row>
    //         <Row className="align-items-center">
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter City"
    //               {...register("firm_city")}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Select
    //               {...register("firm_state")}
    //             //   className={`form-control ${errors.state && "is-invalid"}`}
    //             >
    //               {statesAbrs?.map((state) => (
    //                 <option
    //                   key={state.StateAbr}
    //                   value={state.StateAbr}
    //                   selected={state.StateAbr == "AZ"}
    //                 >
    //                   {state.name}
    //                 </option>
    //               ))}
    //             </Form.Select>
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter ZIP"
    //               {...register("firm_zip")}
    //             />
    //           </Col>
    //         </Row>

    //         <div className="k-separator mt-2 mb-2"></div>
    //         <p className="font-weight-bold mb-1 mt-1">Counsel Information</p>

    //         <Row>
    //           <Col md={12}>
    //             <Form.Control placeholder="Type Counsel Name or Firm Name to add from library" />
    //           </Col>
    //         </Row>

    //         <Row className="align-items-center  mt-2">
    //           <Col md={4} className="custom-margin-bottom">
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter First name"
    //               {...register("counsel_first_name")}
    //             />
    //           </Col>
    //           <Col md={4} className="custom-margin-bottom">
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Last Name"
    //               {...register("counsel_last_name")}
    //             />
    //           </Col>
    //           <Col md={4} className="custom-margin-bottom">
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter phone number"
    //               {...register("counsel_phone")}
    //               onKeyUp={() => handleChange(event, "counsel_phone")}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Fax"
    //               onKeyUp={() => handleChange(event, "counsel_fax")}
    //               {...register("counsel_fax")}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Email"
    //               {...register("counsel_email")}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter extension"
    //               {...register("counsel_extension")}
    //             />
    //           </Col>
    //         </Row>

    //         <Row className="align-items-center custom-margin-bottom mt-2">
    //           <Col md={6}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Address 1"
    //               {...register("counsel_address1")}
    //             />
    //           </Col>
    //           <Col md={6}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter Address 2"
    //               {...register("counsel_address2")}
    //             />
    //           </Col>
    //         </Row>
    //         <Row className="align-items-center">
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter City"
    //               {...register("counsel_city")}
    //             />
    //           </Col>
    //           <Col md={4}>
    //             <Form.Select
    //               {...register("counsel_state")}
    //             >
    //               {statesAbrs?.map((state) => (
    //                 <option
    //                   key={state.StateAbr}
    //                   value={state.StateAbr}
    //                   selected={state.StateAbr == "AZ"}
    //                 >
    //                   {state.name}
    //                 </option>
    //               ))}
    //             </Form.Select>
    //           </Col>
    //           <Col md={4}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Enter ZIP"
    //               {...register("counsel_zip")}
    //             />
    //           </Col>
    //         </Row>
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button
    //         variant="secondary"
    //         onClick={handleClose}
    //         className="INS-float-margin;"
    //       >
    //         Cancel
    //       </Button>
    //       <Button variant="success" type="submit" form="addCounsel_witness_form">
    //         Save
    //       </Button>
    //     </Modal.Footer>
    //     </Form>
    //   </div>
    // </Modal>
  );
}

export default AddWitnessCounsel;
