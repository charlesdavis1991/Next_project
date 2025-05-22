import React, { useState } from 'react';
import '../../../../public/BP_resources/css/client-4.css';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import ModalBodyChat from './chatClientModal';
import ModalBodyDocs from './docsModalBody';
import ModalBodyPhotos from './photosClientModal';
import ModalBodyDiscovery from './discoveryClientModal';
import InjuryPageClient from '../../../Modules/clientInjuryPage';
import NavBarclient from '../../Navbars/clientPreviewNavbar';
import { userLogoutAPI } from '../../../Providers/main';
import {
    getCaseId,
    getClientId,
    removeToken,
    getToken,
} from '../../../Utils/helper';
import { persistor } from '../../../Redux/store';
import { useNavigate } from "react-router";
import active from "../../../../public/bp_assets/img/icon-active-sidebar.svg"

const ClientPortalModalBody = () => {
    const [activeKey, setActiveKey] = useState('chat');
    const navigate = useNavigate();

    const handleSelect = (eventKey) => {
        if (eventKey !== activeKey) {
            setActiveKey(eventKey);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        userLogoutAPI(getClientId(), getCaseId());
        removeToken();
        persistor.pause();
        persistor.flush().then(() => {
            return persistor.purge();
        });
        navigate("/");
        window.location.reload();
    };

    return (
        <div className="mt-1 overflow-hidden">
            <Tab.Container activeKey={activeKey} onSelect={handleSelect}>
                <Row>
                    <Col md={12}>
                        <NavBarclient flaggedPageName="Client-Portal" />
                    </Col>
                </Row>
                <Row>
                    <Col md={1}>
                        <Nav className="flex-column" defaultActiveKey={'chat'}>
                            <Nav.Link eventKey="chat">
                                <div className={` justify-content-center nav-item-content ${activeKey === 'chat' ? 'active' : ''}`}>
                                    <div><i className="ic ic-19 ic-chat-3d m-r-6"></i></div>
                                    Chat
                                    {activeKey === 'chat' && <span className="active-indicator"><img class="" src={active} height={4} width={8} /></span>}
                                </div>
                            </Nav.Link>
                            <Nav.Link eventKey="injury">
                                <div className="nav-item-content justify-content-center">
                                    <img src="https://simplefirm-bucket.s3.amazonaws.com/static/images/injuries-icon-color_V7G2kdz.svg" alt='injury' className="m-r-10" />
                                    Injury
                                    {activeKey === 'injury' && <span className="active-indicator"><img class="" src={active} height={4} width={8} /></span>}
                                </div>
                            </Nav.Link>
                            <Nav.Link eventKey="docs">
                                <div className="nav-item-content justify-content-center">
                                    <img src="https://simplefirm-bucket.s3.amazonaws.com/static/images/documents-icon-color_b6TvcB7.svg" alt='injury' className="m-r-10" />
                                    Docs
                                    {activeKey === 'docs' && <span className="active-indicator"><img class="" src={active} height={4} width={8} /></span>}

                                </div>
                            </Nav.Link>
                            <Nav.Link eventKey="photos">
                                <div className="nav-item-content justify-content-center">
                                    <img src="https://simplefirm-bucket.s3.amazonaws.com/static/images/photo-icon-color_2CyRX1a.svg" alt='injury' className="m-r-10" />
                                    Photos
                                    {activeKey === 'photos' && <span className="active-indicator"><img class="" src={active} height={4} width={8} /></span>}
                                </div>
                            </Nav.Link>
                            <Nav.Link eventKey="discovery">
                                <div className="nav-item-content justify-content-center">
                                    <img src="https://simplefirm-bucket.s3.amazonaws.com/static/images/discovery-icon-color_97Wb0rd.svg" alt='injury' className="m-r-10" />
                                    Discovery
                                    {activeKey === 'discovery' && <span className="active-indicator"><img class="" src={active} height={4} width={8} /></span>}
                                </div>
                            </Nav.Link>
                            <Nav.Link eventKey="logout">
                                <div className="nav-item-content" onClick={handleLogout}>
                                    <div style={{ display: "gird" }}>
                                        <div>Log Out</div>
                                        <i className="ic ic-23 ic-logout2 mt-3"></i>
                                    </div>
                                </div>
                            </Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={10}>
                        <Tab.Content style={{ marginLeft: '2rem', width: "120%" }} >
                            <Tab.Pane eventKey="chat">
                                <ModalBodyChat />
                            </Tab.Pane>
                            <Tab.Pane eventKey="injury">
                                <InjuryPageClient />
                            </Tab.Pane>
                            <Tab.Pane eventKey="photos">
                                <ModalBodyPhotos />
                            </Tab.Pane>
                            <Tab.Pane eventKey="docs">
                                <ModalBodyDocs />
                            </Tab.Pane>
                            <Tab.Pane eventKey="discovery">
                                <ModalBodyDiscovery />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    )
}

export default ClientPortalModalBody;


