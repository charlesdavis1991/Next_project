import React, { useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import './CounselContactModal.css';
import api from '../../../api/api';

const CounselContactModal = ({ show, handleClose,states=[],opposingcounselcontact,counselTypeId,opposingCounselId }) => {
    const { register, handleSubmit,setValue } = useForm();

    const formatNumber = (number) => {
        if (!number) return "";
        return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    };
    const formatInput = (inputVal)=> {
   
        inputVal = inputVal.replace(/\D/g, '');
        // Insert formatting characters
        inputVal = '(' + inputVal.substring(0, 3) + ') ' + inputVal.substring(3, 6) + '-' + inputVal.substring(6, 10);
        // Update input value
        return inputVal
           
      } 

    const onSubmit = async (data) => {
        try {
            console.log("Counsel data = ", data);
            // Perform the PUT request
            const response = await api.put("/api/client/edit-counsel/", data);
            console.log("Response:", response.data);
            handleClose()
        } catch (error) {
            // Handle errors
            console.error("Error submitting data:", error);
        }
    };


    useEffect(()=>{
        console.log("Opposing Counsel Contact = ",opposingcounselcontact)
       setValue('name',opposingcounselcontact?.name)
       setValue('address1',opposingcounselcontact?.address1)
       setValue('address2',opposingcounselcontact?.address2)
       setValue('city',opposingcounselcontact?.city)
       setValue('state',opposingcounselcontact?.state)
       setValue('zip',opposingcounselcontact?.zip)
       setValue('phone',formatNumber(opposingcounselcontact?.phone_number))
       setValue('fax',formatNumber(opposingcounselcontact?.fax))
       setValue('email',opposingcounselcontact?.email)
       setValue('opposingcounsel_id',opposingCounselId && opposingCounselId)
       setValue('counsel_type_id',counselTypeId && counselTypeId)
       
    },[opposingcounselcontact])


    function handleChange(event,inputType) {
        let formattedValue = formatInput(event.target.value);
        setValue(`${inputType}`, formattedValue);
    }

    return (
        <Modal show={show} onHide={handleClose} centered  dialogClassName="modal-dialog-centered max-800p custom-insurance-dialog" >
            <Modal.Header closeButton>
                <Modal.Title className="mx-auto">Counsel Contact</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form  onSubmit={handleSubmit(onSubmit)} id="counsel_contacts_form">
                   <input type="hidden" {...register("opposingcounsel_id")} />
                   <input type="hidden" {...register("counsel_type_id")} />
                   <input type="hidden" {...register("block_name")} value={'firm_block'}/>
                    <Row className="align-items-center form-group mx-0">
                            <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey">Name</span>
                            </Col>
                            <Col md={10}>
                               <Form.Control type="text" placeholder="Enter name" {...register("name")} />
                            </Col>
                    </Row>  
                    <Row className="align-items-center form-group mx-0">
                            <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey">Address 1</span>
                            </Col>
                            <Col md={10}>
                            <Form.Control type="text" placeholder="Enter Address 1" {...register("address1")} />
                            </Col>
                    </Row>       
                    <Row className="align-items-center form-group mx-0">
                            <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey">Address 2</span>
                            </Col>
                            <Col md={10}>
                            <Form.Control type="text" placeholder="Enter Address 1" {...register("address2")} />
                            </Col>
                    </Row>       
                    <Row className="align-items-center form-group mx-0">
                    <Col md={2}>
                            
                        </Col>
                    <Col md={10}>
                    <Row>
                    <Col md={4}>
                            <Form.Control type="text" placeholder="Enter City" {...register("city")} />
                        </Col>
                        <Col md={4} className="d-flex">
                            <Form.Control as="select" className="form-control City-Width-OP" {...register("state")}>
                                {states?.map(state => (
                                    <option key={state.StateAbr} value={state.StateAbr}>
                                        {state.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>
                        <Col md={4}>
                            <Form.Control type="text" placeholder="Enter Zip" {...register("zip")} />
                        </Col>
                    </Row>
                    </Col>    
                    </Row>

                    <Row className="align-items-center form-group mx-0">
                        <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey">Phone</span>
                            </Col>
                        <Col md={10}>
                            <Form.Control type="text" placeholder="(###) ###-####" {...register("phone")} onKeyUp={(e) => handleChange(e,'phone')} />
                        </Col>
                    </Row>

                    <Row className="align-items-center form-group mx-0">
                        <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey">Fax</span>
                        </Col>
                        <Col md={10}>
                            <Form.Control type="text" placeholder="(###) ###-####" {...register("fax")} />
                        </Col>
                    </Row>

                    <Row className="align-items-center form-group mx-0">
                        <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey">Email</span>
                        </Col>
                        <Col md={10}>
                            <Form.Control type="text" placeholder="Enter Email" {...register("email")} />
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-between pt-4">
                <Button variant="secondary" form="counsel_contacts_form" onClick={handleClose}>Cancel</Button>
                <Button variant="success" form="counsel_contacts_form" type="submit">Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CounselContactModal;
