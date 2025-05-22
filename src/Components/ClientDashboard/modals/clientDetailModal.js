import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from "axios";
import { getCaseId, getClientId } from '../../../Utils/helper';

const ModalBodyDetail = () => {
    const [LoginHistory, setLoginHistory] = useState([]);
    const [isSending, setIsSending] = useState(false);  // To track button state
    const origin = process.env.REACT_APP_BACKEND_URL;
    const node_env = process.env.NODE_ENV;
    const media_origin = node_env === 'production' ? "" : process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('token');
    const currentCaseId = getCaseId();
    const clientId = getClientId();

    // Fetch client login history
    const fetchClientLoginDetail = async () => {
        try {
            const response = await axios.get(
                `${origin}/api/client/login_details/${clientId}/`,
                {
                    headers: { Authorization: token },
                }
            );
            setLoginHistory(response.data);
        } catch (error) {
            console.error("Failed to fetch client data:", error);
        }
    };

    useEffect(() => {
        fetchClientLoginDetail();
    }, [clientId, currentCaseId]);


    const resendCredentials = async () => {
        setIsSending(true);  // Disable button while sending
        const messageBanner = document.getElementById("messageBanner");
        const messageText = document.getElementById("messageText");
    
        // Reset any previous message and hide the banner
        messageBanner.classList.remove('alert-success', 'alert-danger');
        messageText.innerText = ''; 
        messageBanner.style.display = 'none';
    
        try {
            const response = await axios.post(
                `${origin}/api/client-page/updateClientCredentials/${clientId}/${currentCaseId}/`,
                {},
                {
                    headers: { Authorization: token }
                }
            );
            const { message, client_email } = response.data;
    
            // Show alert with message
            alert(`${message} ${client_email}`);
    
            // Update message banner with success message
            messageBanner.classList.add('alert-success');
            messageText.innerText = `${message} ${client_email}`;
            messageBanner.style.display = 'block'; // Show banner
        } catch (error) {
            console.error("Failed to send credentials:", error);
    
            // Show alert for error
            alert("Failed to send credentials.");
    
            // Update message banner with error message
            messageBanner.classList.add('alert-danger');
            messageText.innerText = "Failed to send credentials.";
            messageBanner.style.display = 'block'; // Show banner
        } finally {
            setIsSending(false);  // Enable button after sending
        }
    };
    
    
    return (
        <div id="detail-client" style={{ maxHeight: '80%', overflow: 'auto' }}>
            <div className="Custom-Container-CP1">
                <div className="d-flex justify-content-between align-items-center mt-3">
                <div class="alert message-banner mr-auto" id="messageBanner" role="alert">
                    <span id="messageText"></span>
                </div>
                <button 
                    type="button" 
                    className="btn btn-primary ml-auto mb-1" 
                    id="resendCredentialsBtn" 
                    onClick={resendCredentials}
                    disabled={isSending}
                >
                    {isSending ? 'Sending...' : 'Resend login credentials'}
                </button>

                </div>

                <div>
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="padding-75">#</th>
                                <th className="padding-75">Client</th>
                                <th className="padding-75">Logged in at</th>
                                <th className="padding-75">IP Address</th>
                            </tr>
                        </thead>
                        {LoginHistory.length ? (
                            <tbody>
                                {LoginHistory.map((info, index) => (
                                    <tr key={index}>
                                        <th className="padding-75" scope="row">{info.id}</th>
                                        <td className="padding-75">{info.user}</td>
                                        <td className="padding-75">{info.logged_in_at}</td>
                                        <td className="padding-75">{info.ip_address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No Data Available</td>
                            </tr>
                        )}
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default ModalBodyDetail;
