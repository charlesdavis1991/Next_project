import React, { useEffect, useRef, useState } from "react";
import PendingRequests from "./PendingRequests";
import CopilotedFIrms from "./CopilotedFIrms";
import api from "../../api/api"

import { Nav, Tab } from "react-bootstrap";

const YourCopliotFirms = () => {
  const [requestCount, setRequestCount] = useState(0);
  const [firms, setFirms] = useState(null);
  const [loading, setLoading] = useState(true);
  const origin = process.env.REACT_APP_BACKEND_URL;

  const fetchtCopliotFirms = async () => {
    setLoading(true)
    try {
      const response = await api.get(`${origin}/api/copilot-firms/`);
      if (response.status === 200) {
        setFirms(response.data.data);
    
      }
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchtCopliotFirms();
  }, [])

return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="copliotfirms">
    
    <Nav variant="tabs" className="justify-content-around">
          
          <Nav.Link eventKey="copliotfirms">Co Pilot Firms</Nav.Link>
          <Nav.Link eventKey="pendingfirms">Firms CoPiloting Me  {requestCount > 0 ? (<span className="badge badge-primary ml-1">{requestCount}</span>):(null)}

          </Nav.Link>

    </Nav>
    <Tab.Content>
      
        <Tab.Pane eventKey="copliotfirms" className="copilot-tab-pane">
        <CopilotedFIrms  firms={firms}  loading={loading} />
        </Tab.Pane>
        <Tab.Pane eventKey="pendingfirms"  className="copilot-tab-pane" >
                <PendingRequests setRequestCount={setRequestCount} fetchCoPilotedFirms={fetchtCopliotFirms} />
        </Tab.Pane>
    
    </Tab.Content>
        
      
  </Tab.Container>)
}
export default YourCopliotFirms;