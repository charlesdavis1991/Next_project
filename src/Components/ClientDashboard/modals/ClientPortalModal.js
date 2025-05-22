import React, { useState } from 'react';
import { Modal, Nav, Tab, Table } from 'react-bootstrap';
import '../../../../public/BP_resources/css/client-4.css';
import ModalBodyDetail from './clientDetailModal';
import ClientPortalModalBody from './previewPortalModal';

const PreviewPortalModal = ({ handleClose, show }) => {

  return (
    <div>
      <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="previewPortalModalLabel" centered>
        <Modal.Header>
          <Modal.Title id="previewPortalModalLabel">Client Portal</Modal.Title>
          <button type="button" className="close" onClick={handleClose} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body className="modal-body-popup">
          <div style={{maxHeight: '99%',overflow:'auto'}}>
            <Tab.Container id="myTabs" defaultActiveKey={"client-portal"} >
              <div className='custom-class-client-pordal-nav'>
                <Nav variant="tabs" className="justify-content-around">
                  <Nav.Link
                    className="nav-item nav-link Pad8 tab-item"
                    eventKey="client-portal"
                  >
                    Preview Client Portal
                  </Nav.Link>
                  <Nav.Link
                    className="nav-item nav-link Pad8 tab-item"
                    eventKey="detail"
                  >
                    Client Details
                  </Nav.Link>
                </Nav>
              </div>
              <Tab.Content>
                <Tab.Pane eventKey="client-portal">
                  <ClientPortalModalBody />
                </Tab.Pane>
                <Tab.Pane eventKey="detail">
                  <ModalBodyDetail />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PreviewPortalModal;