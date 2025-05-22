import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { mediaRoute } from "../../../Utils/helper";
import avatarImage from "./../../../assets/images/avatar.svg";
import axios from "axios";  // Replaced jQuery with Axios
import useWebSocket, { ReadyState } from "react-use-websocket";  // Importing useWebSocket hook
import { getToken } from "../../../Utils/helper"; // Assuming this utility function exists
const ChatDocumentModal = ({ showModal, handleClose,caseInfo, docId, docName, userId, caseId, clientId }) => {
  // const [firmUsers, setFirmUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for chat
  const [message, setMessage] = useState(""); // Message content
  const [isLoading, setIsLoading] = useState(true); // For loading state
  const [loggedInUserId, setLoggedInUserId] = useState(null); // Logged-in user ID
  const [showMessageModal, setShowMessageModal] = useState(false); // Controls message modal visibility
  const firmUsers = [
    [caseInfo?.firm_user1, caseInfo?.firm_user2],
    [caseInfo?.firm_user3, caseInfo?.firm_user4],
    [caseInfo?.firm_user5, caseInfo?.firm_user6]
  ].filter(pair => pair.some(user => user)); // Filter out pairs with no users
  console.log("==================")
  console.log(firmUsers)
  console.log("==================")
  const profileImageURL = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  // WebSocket URL
  const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
  const ws_path = `${ws_scheme}://websockets.simplefirm.com/30/32/${clientId}/${caseId}/`;

  // Use WebSocket hook
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(ws_path, {
    share: true,  // Sharing the WebSocket connection
    shouldReconnect: () => true,  // Reconnect automatically if connection closes
  });

  // Handle WebSocket Connection State
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      console.log("WebSocket connection established");
    } else if (readyState === ReadyState.CLOSED) {
      console.log("WebSocket connection closed");
    } else if (readyState === ReadyState.CONNECTING) {
      console.log("WebSocket connecting...");
    }
  }, [readyState]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastJsonMessage) {
      console.log(`Received message: ${JSON.stringify(lastJsonMessage)}`);
      handleReceiveMessage(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  // Fetch firm users when modal opens
  useEffect(() => {
    if (showModal) {
      fetchFirmUsers();
    }
  }, [showModal]);

  // Handle receiving message
  const handleReceiveMessage = (data) => {
    const { message, sent_by, thread_id, user_name, profile_pic } = data;
    console.log("Received WebSocket data:", data);
    // Handle received data (e.g., update chat window)
  };
  // Fetch firm users from the server using Axios
  const fetchFirmUsers = async () => {
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const accessToken = getToken(); // Get access token for authorization if required

    setIsLoading(true); // Start loading state
    try {
      const response = await axios.get(`${origin}/api/get_firm_users_notes/`, {
        params: { user_id: userId }, // Pass userId as query parameter
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,  // Optional Authorization header
        },
      });
      setFirmUsers(response.data.firm_users_notes); // Store firm users data
      setLoggedInUserId(response.data.logged_in_user_id); // Store logged-in user ID
    } catch (error) {
      console.error("Error fetching firm users:", error);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  // Handle sending a message via WebSocket
  const handleSendMessage = async () => {
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const accessToken = getToken(); // Get access token for authorization if required

    if (!selectedUser || !message) {
      alert("Please select a user and enter a message.");
      return;
    }
    try {
      // First Axios call to get the thread info
      const response = await axios.get(`${origin}/api/get-thread-info/`, {
        params: {
          user_id: selectedUser.id, // Pass the selected user's ID
          current_user_id: userId, // Pass the current user's ID
          is_provider_thread: "no", // Adjust as necessary
          client_id: clientId || "", // Pass client_id if needed
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,  // Optional Authorization header
        },
      });
      const THREAD_ID = response.data.data;

      // Prepare the WebSocket message
      const CHATMESSAGE = `${message} doc_name: ${docName} doc_id: ${docId}`;
      const data = {
        message: CHATMESSAGE,
        sent_by: loggedInUserId, // Logged-in user
        send_to: selectedUser.id, // Recipient ID
        thread_id: THREAD_ID,
        user_name: `${selectedUser.first_name} ${selectedUser.last_name}`,
        profile_pic: selectedUser.profile_pic || profileImageURL,
      };

      // Send the message via WebSocket using sendJsonMessage
      sendJsonMessage(data);
      alert("Message sent successfully!");

      // Close the message modal and the document modal
      setShowMessageModal(false);
      handleClose();
    } catch (error) {
      console.error("Error fetching thread ID:", error);
    }
  };

  // Render user card with avatar, name, and radio button for selection
  const renderUserCard = (user, index) => {
      if (!user) return null;
      return (
          <div key={user.id} className="col-12 col-md-6 mb-3">
              <div className="d-flex align-items-center">
                  <img src={user.profile_pic_29p?
                      mediaRoute(user.profile_pic_29p)
                      : avatarImage}
                      alt={`${user.user.first_name} ${user.user.last_name}`} 
                    
                    style={{ width: "20px", height: "20px", borderRadius: "50%", margin:"0px 10px" }}
                  />
                  
                  <div className="flex-grow-1">{`${user.user.first_name} ${user.user.last_name}`}</div>
                  <div className="custom-control custom-checkbox">
                      <input type="checkbox" className="custom-control-input" id={`user_checkbox_${user.id}`} onChange={() => handleCheckboxChange(user.id)} />
                      <label className="custom-control-label" htmlFor={`user_checkbox_${user.id}`}></label>
                  </div>
              </div>
          </div>
      );
  };

  // Render nothing if modal is closed
  if (!showModal) return null;

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      centered
      size="lg"
      style={{
        zIndex: 1000000,
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
      }}
    >
      {/* Updated Modal Header */}
      <Modal.Header
        style={{
          backgroundColor: "#003366", // Dark blue background
          padding: "0px",
        }}
      >
        <Modal.Title
          className="text-center w-100"
          style={{
            backgroundColor: "#003366", // Match the previous dark blue header
            color: "white", // White text
            padding: "12px", // Padding for proper alignment
            fontSize: "16px", // Consistent font size
          }}
        >
          CHAT A DOCUMENT LINK TO:
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Header within the Body */}
        <div className="text-center mb-3">
                    <h5 className="client-contact-title text-center" style={{ backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "4px", margin: "0 auto", maxWidth: "350px" }}>
                        FIRM USERS ASSIGNED TO CASE
                    </h5>
                </div>

                <div className="container-fluid">
                    {firmUsers.map((pair, index) => (
                        <div key={index} className="row mb-3">
                            {renderUserCard(pair[0])}
                            {renderUserCard(pair[1])}
                        </div>
                    ))}
                    <div className="">
                        <h5                         className="client-contact-title text-center" style={{ backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "4px", margin: "0 auto", maxWidth: "350px" }}>
                            Other Firm Users
                        </h5>
                    </div>
                </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="success"
          onClick={() => setShowMessageModal(true)}
          disabled={!selectedUser}
        >
          Send Chat With a Link To This Document
        </Button>
      </Modal.Footer>

      {/* Second Modal: Send Message */}
      {showMessageModal && (
        <Modal
          show={showMessageModal}
          onHide={() => setShowMessageModal(false)}
          centered
          style={{
            zIndex: 1000001,
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Send a link for this document to {selectedUser.first_name} {selectedUser.last_name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              placeholder="Type your message"
              className="w-100"
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMessageModal(false)}>
              Close
            </Button>
            <Button variant="success" onClick={handleSendMessage}>
              Send Document Link
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Modal>
  );
};

ChatDocumentModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  docId: PropTypes.string.isRequired,
  docName: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  clientId: PropTypes.number, // Optional client ID if needed
};

export default ChatDocumentModal;
