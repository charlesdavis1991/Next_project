import React, { useState } from 'react';
import { Button, Nav, Tab, Form, Row, Col, Dropdown } from "react-bootstrap";

const FileUpload = ({setSelectedFile}) => {
  // State to store the selected file
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  return (
    <div className="col-lg-12  mt-3">
        <Form.Group controlId="formFile" className="ml-3" as={Row}>
        <Col xs={6}>

        <Form.Label>Upload Document</Form.Label>
        <Form.Control type="file" onChange={(e) => handleFileChange(e)}  /></Col>
      </Form.Group>
    </div>
  );
};

export default FileUpload;
