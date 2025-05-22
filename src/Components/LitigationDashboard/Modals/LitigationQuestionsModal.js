import React, { useEffect, useState } from "react";
import "../../../../public/BP_resources/css/litigation.css";
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

export default function LitigationQuestionsModal({showPopup, handleClose}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin = node_env === 'production' ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [states, setStates] = useState([]);

  return (
    <Modal
    show={showPopup ? true : false}
    onHide={handleClose}
    centered
    dialogClassName="modal-lg lit-max-width-1000px"
    className="generic-popup fade bd-example-modal-lg zoom-in overflow-scroll"
  >
    <Modal.Header className="text-center">
      <Modal.Title>Discovery questions and answers</Modal.Title>
    </Modal.Header>
    
    <Modal.Body className="pt-0 pr-0 pb-0">
      <div className="row pt-4 pb-2">
        <div className="col-12 text-center">
          <p className="text-label text-grey">Number of questions</p>
          <h3>5</h3>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-3">
          <ul className="list-unstyled m-0 pt-3" id="leftNav">
            <li><a href="#messageRowOne" className="text-black">Question 1</a></li>
            <li><a href="#messageRowTwo" className="text-black">Question 2</a></li>
            <li><a href="#messageRowThree" className="text-black">Question 3</a></li>
            <li><a href="#messageRowFour" className="text-black">Question 4</a></li>
            <li><a href="#messageRowFive" className="text-black">Question 5</a></li>
          </ul>
        </div>
        
        <div className="col-md-9">
          <div data-spy="scroll" data-target="#leftNav" data-offset="0" className="scrollspy-wrapper pb-3 pr-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="row" id={`messageRow${num}`}>
                <div className="col-12">
                  <label htmlFor={`inputQuestion${num}`} className="fw-bold text-grey m-t-5">Question {num}:</label>
                  <textarea
                    autoSize
                    className="form-control autosize"
                    id={`inputQuestion${num}`}
                    style={{height:"100px"}}
                    defaultValue={`REQUEST NO. ${num}: Any and all WRITINGS, including, but not limited to, medical reports and bills, physicians', hospitals', or other health care providers' invoices or statements which reflect, refer to or tend to establish any and all physical and mental injuries YOU claim to have suffered as a result of the INCIDENT sued upon herein.`}
                  />
                </div>
                <div className="k-separator mt-4 mb-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal.Body>
    
    <Modal.Footer className="justify-content-between">
      <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      
      <div className="ml-auto d-flex">
        <Button variant="primary" className="m-l-5" onClick={() => downloadQuestion('')}>Download Questions</Button>
        <Button variant="primary" className="m-l-5" onClick={() => downloadQuestion('wp')}>Open in Word Processor</Button>
        <Button type="submit" className="btn btn-primary m-l-5">Save</Button>
      </div>
    </Modal.Footer>
  </Modal>
  );
}
