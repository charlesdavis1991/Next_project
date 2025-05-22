import { event } from 'jquery';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

export default function NoteEventModal({ Aba_utbmsData, handleShowModal, showEventModal, eventLog, fetchEventLogData }) {
  
  const origin = process.env.REACT_APP_BACKEND_URL;  
  const [selectedGroup, setSelectedGroup] = useState("");
  const [formData, setFormData] = useState({
    click_key_id: '',
    record_id: '',
    date: '',
    time: '',
    firm: '',
    abautbms_id: '',
    note: ''
  }); 

  useEffect(() => {
    console.log('MODAL ROW ----',eventLog)
    // Initialize form data with eventLog when the modal opens
    if (eventLog) {
      setFormData({
        click_key_id: eventLog.click_key?.id || '',
        record_id: eventLog.click_record?.id || '',
        date: eventLog.click_record?.created_at 
          ? new Date(eventLog.click_record.created_at)
              .toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
              .replace(/^0+/, '') 
          : '',
        time: eventLog.click_record?.created_at 
          ? new Date(eventLog.click_record.created_at)
              .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) 
          : '',
        firm: eventLog.firm || 'Usama Associates',
        abautbms_id: eventLog.click_key_abautbms?.id || '',
        note: eventLog.note[0]?.note || ''
      });

      // Initialize selected group based on eventLog data
      const initialGroup = Aba_utbmsData.find(obj => obj.id === eventLog.click_key_abautbms?.id)?.bill_code_category;
      setSelectedGroup(initialGroup || Object.keys(groupedCategories)[0] || "");
    }
  }, [eventLog, Aba_utbmsData]);

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    console.log('SUBMIT')
    e.preventDefault();
    try {      
      const token = localStorage.getItem('token');      
      await axios.post(origin + '/api/click_key_abautbms_api/', formData,{
        headers: {
          Authorization: token,
        },
  
      });
      fetchEventLogData();
      handleShowModal();
    } catch (error) {
      console.log('Error saving form data:', error);
    }
  };

  const groupedCategories = Aba_utbmsData.reduce((acc, obj) => {
    if (!acc[obj.bill_code_category]) {
      acc[obj.bill_code_category] = [];
    }
    acc[obj.bill_code_category].push(obj);
    return acc;
  }, {});

  return (
    <Modal show={showEventModal} onHide={handleShowModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Click Key ABAUTBMS</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="clickkey_abautbms_form" onSubmit={handleSubmit}>
          <Form.Control type="hidden" name="click_key_id" value={formData.click_key_id} onChange={handleInputChange} />
          <Form.Control type="hidden" name="record_id" value={formData.record_id} onChange={handleInputChange} />

          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column sm={3} className="text-left text-grey">Date</Form.Label>
            <Col sm={9}>
              <Form.Control type="text" name="date" value={formData.date} onChange={handleInputChange} disabled />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column sm={3} className="text-left text-grey">Time</Form.Label>
            <Col sm={9}>
              <Form.Control type="text" name="time" value={formData.time} onChange={handleInputChange} disabled />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column sm={3} className="text-left text-grey">Firm</Form.Label>
            <Col sm={9}>
              <Form.Control type="text" name="firm" value={formData.firm} onChange={handleInputChange} disabled />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column sm={3} className="text-left text-grey">Select Group Code</Form.Label>
            <Col sm={9}>
              <Form.Control as="select" name="groupedDropdown" value={selectedGroup} onChange={handleGroupChange}>
                {Object.keys(groupedCategories).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column sm={3} className="text-left text-grey">Select ABAUTBMS</Form.Label>
            <Col sm={9}>
              <Form.Control as="select" name="abautbms_id" value={formData.abautbms_id} onChange={handleInputChange}>
                {selectedGroup && groupedCategories[selectedGroup].map((obj) => (
                  <option key={obj.id} value={obj.id}>{`${obj.bill_code} ${obj.bill_code_name}`}</option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column sm={3} className="text-left text-grey">Note</Form.Label>
            <Col sm={9}>
              <Form.Control as="textarea" name="note" value={formData.note} onChange={handleInputChange} />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleShowModal}>Cancel</Button>
        <Button variant="success" type="submit" form="clickkey_abautbms_form">Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
