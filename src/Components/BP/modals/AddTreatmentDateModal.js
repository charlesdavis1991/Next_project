import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function AddTreatmentDateModal({ show, handleClose, caseProviderID, setAllTreatmentDates }) {
    const origin = process.env.REACT_APP_BACKEND_URL;
    const [treatmentDate, setTreatmentDate] = useState('');
    const [treatmentNotes, setTreatmentNotes] = useState('');

    const addTreatmentDate = async () => {
        try {
            const response = await axios.post(`${origin}/api/treatment/add_treatment_date/`, {
                case_provider_id: caseProviderID,
                new_treatment_date: treatmentDate,
                new_treatment_notes: treatmentNotes,
            });
            if (response.data) {
                setAllTreatmentDates(prevDates => [...prevDates, response.data]);
            }
            setTreatmentDate = ''
            setTreatmentNotes = ''
            handleClose();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Body>
                <div className="modal-header">
                    <h5 className="modal-title mx-auto" id="addTreatmentDate1">Add Treatment Date</h5>
                    <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <div className="mb-3">
                        <label htmlFor="treatment_date1" className="fw-bold">Treatment Date</label>
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Treatment Date"
                            value={treatmentDate}
                            onChange={e => setTreatmentDate(e.target.value)}
                            id="new_treatment_date"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="treatment_note1" className="fw-bold">Treatment Note</label>
                        <textarea
                            placeholder="Treatment Note"
                            className="form-control"
                            value={treatmentNotes}
                            onChange={e => setTreatmentNotes(e.target.value)}
                            id="new_treatment_notes"
                        ></textarea>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary footer-btn" onClick={handleClose}>Cancel</button>
                    <button type="button" className="btn btn-success" onClick={addTreatmentDate}>Save</button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default AddTreatmentDateModal;
