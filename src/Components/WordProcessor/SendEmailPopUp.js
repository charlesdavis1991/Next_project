import React, {
    useState,
    useEffect

} from "react";
import './wordprocessor.css'
import { getLoggedInUserId, getCaseId, getClientId } from "../../Utils/helper";

import api, { api_without_cancellation } from "../../api/api";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import avatar from "../../../public/bp_assets/img/avatar_new.svg"


function SendEmailPopUp({
    emailPopUp,
    handleCloseEmailPopUp,
    attachPdfToCaseFile,
    container,
    docName

}) {
    const [clientData, setClientData] = useState({});
    const [userData, setUserData] = useState({});

    const origin = process.env.REACT_APP_BACKEND_URL
    const [loading, setLoading] = useState(false);

    const [copyCheck, setCopyCheck] = useState(true);
    const [subject, setSubject] = useState("Please see the attached document");
    const [emailText, setEmailText] = useState("");


    const updatePdfDoc = async() => {
        const content =
                await container.current?.documentEditor.saveAsBlob("Docx");
        const renamedFile = new File([content], `${docName}.docx`, { type: content.type });

        const formData = new FormData();
        formData.append("file", renamedFile);
        try {
            const response = await api.post(
              `${origin}/api/documents/word-to-pdf/`,
              formData,
              {
                headers: {
                'Content-Type': 'multipart/form-data'
        },
              }
            );
            const { data } = response.data;
            const pdfBlob = new Blob(
              [Uint8Array.from(atob(data), (c) => c.charCodeAt(0))],
              { type: "application/pdf" }
            );
            return pdfBlob
        }  catch (error) {
            console.error("Error printing document:", error);
            return renamedFile
          }}




    const sendEmail = async() =>{
        setLoading(true);

        const content = await updatePdfDoc();
        const renamedFile = new File([content], `${docName}.pdf`, { type: content.type });

        if(copyCheck){
            attachPdfToCaseFile()
        }
        const url = `${origin}/api/client-page/send-email-to-client/${getClientId()}/`;


        const formData = new FormData();
        formData.append("to",clientData?.primary_email?.email);
        formData.append("subject", subject);
        formData.append("body", emailText);
        formData.append("reply", true);
        formData.append("file", renamedFile);


        try {
            const response = await api_without_cancellation.post(url, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                },
                  }
            );
            const responseData = response.data;
            setLoading(false);
            handleCloseEmailPopUp();
        } catch (error) {
            console.error('Error making POST request:', error);
            setLoading(false);
        }
    }
 


    const fetchClientPage = async () => {
        try {
          const response = await api_without_cancellation.get(
            `${origin}/api/get-client-by-id/?client_id=${getClientId()}`,
        
          );
    
          if (response.status == 200) {
            const client_data =  response.data.client
            const user_data = response.data.user
            setClientData(client_data);
            setUserData(user_data);
            setEmailText(`Dear ${client_data?.first_name} ${client_data?.last_name},

Please see the attached document.

Thank you,
${user_data?.first_name} ${user_data?.last_name}`)

          }
        } catch (error) {
          console.error("Failed to fetch client data:", error);
        }
      };

    useEffect(() => {
        fetchClientPage();
      
      }, []);


    return (
        <>
        <Modal show={emailPopUp} onHide={handleCloseEmailPopUp} centered dialogClassName="modal-dialog modal-dialog-centered">
            
            <Modal.Header className="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
                                <h5 className='modal-title mx-auto font-size-20 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500'>
                                    SEND EMAIL TO {clientData?.profile_pic ? (
                                        <div className="ic ic-17 m-t-5 m-b-5">
                                            <img
                                                className={`rounded-circle object-fit-cover theme-ring`}
                                                src={clientData?.profile_pic }
                                                alt="Profile"

                                            />
                                        </div>
                                    ) : (
                                        <div className="ic ic-17 m-t-5 m-b-5">
                                            <img
                                                className={`rounded-circle object-fit-cover `}
                                                src = {avatar}
                                            />
                                        </div>
                                    )} 
                                    
                                    {clientData?.first_name} {clientData?.last_name}
                                    </h5>
                            </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email Subject Greeting:</Form.Label>
                        <Form.Control
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}

                        />
                        </Form.Group>
                        <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                        >
                        <Form.Label>Type Email:</Form.Label>
                        <Form.Control as="textarea"
                        style={{ height: "150px" }}
                        
                        value = {emailText}
                        onChange={(e) => setEmailText(e.target.value)}

                        />
                        </Form.Group>
                        <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                        >
                        <Form.Check
                        type="checkbox"
                        className="ml-2"
                        checked={copyCheck}
                        onChange={(e) => setCopyCheck(e.target.checked)}
                        label={`Save PDF copy of document to Client's Case File`}
                    />
                </Form.Group>

                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEmailPopUp}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={sendEmail}>
                    {loading ? "Sending.." : `Send`}
                    </Button>
                    </Modal.Footer>
                </Modal>
                </>

    )
}

export default SendEmailPopUp;
