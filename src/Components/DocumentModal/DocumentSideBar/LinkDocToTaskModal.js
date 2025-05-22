import React, { useState, useEffect } from "react";
import { Button, Table, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import axios from "axios";
import { getToken } from "../../../Utils/helper"; // Assuming this utility function exists
import avatarImage from "./../../../assets/images/avatar.svg";
import { mediaRoute } from "../../../Utils/helper";

const LinkDocToTaskModal = ({ showModal, handleClose, docId, caseId }) => {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [selectedTasks, setSelectedTasks] = useState([]); // State to store selected tasks
  const [isTasksLoading, setIsTasksLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  // Fetch tasks when the modal is open
  useEffect(() => {
    if (showModal && docId && caseId) {
      const fetchTasks = async () => {
        const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
        const accessToken = getToken(); // Get access token for authorization if required
        try {
          setIsTasksLoading(true);
          setError(null); // Reset error state

          // Fetch data from backend
          const response = await axios.get(`${origin}/api/todos/${caseId}/`, {
            params: { doc_id: docId }, // Pass docId as query parameter
            headers: {
              'Content-Type': 'application/json',
              Authorization: accessToken,  // Optional Authorization header
            },
          });

          // Log the response
          console.log("Backend Response:", response.data);

          // Access 'todos' key for task data
          const fetchedTasks = response.data.todos || [];

          if (fetchedTasks.length === 0) {
            setError("No tasks found");
            setTasks([]);
          } else {
            const taskList = fetchedTasks.map((task) => ({
              id: task.id,
              createdBy: `${task.created_by?.first_name || ''} ${task.created_by?.last_name || ''}`,
              createdByPic: task.todo_for?.profile_pic || '/media/images/attorneys/default_avatar.svg',
              taskType: task.todo_type?.name || 'N/A',
              dueDate: task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Due Date',
              assignedTo: `${task.todo_for?.user?.first_name || 'Unknown'} ${task.todo_for?.user?.last_name || ''}`,
              notes: task.notes || "No task details",
              docs: task.docs,
              docsCount: task.docs.length
            }));

            setTasks(taskList);
            setError(null);
          }

          setIsTasksLoading(false);
        } catch (err) {
          console.error("Error fetching tasks:", err);
          setError("Error fetching tasks");
          setIsTasksLoading(false);
        }
      };

      fetchTasks();
    } else if (!docId) {
      setError("Document ID is missing");
    } else if (!caseId) {
      setError("Case ID is missing");
    }
  }, [showModal, docId, caseId]);

  // Handle task selection
  const handleTaskSelection = (taskId) => {
    setSelectedTasks((prevSelected) => {
      if (prevSelected.includes(taskId)) {
        // If the task is already selected, remove it
        return prevSelected.filter((id) => id !== taskId);
      } else {
        // If the task is not selected, add it
        return [...prevSelected, taskId];
      }
    });
  };

  // Link document to selected tasks
  const handleLinkDocument = async () => {
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const accessToken = getToken(); // Get access token for authorization if required
    try {
      const response = await axios.get(`${origin}/30/LinkDocToToDo/`, {
        params: {
          todo_id: JSON.stringify(selectedTasks),
          doc_id: docId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,  // Optional Authorization header
        },

      });

      console.log("Link Response:", response.data);
      alert("Document linked successfully!");

      // Close modal and refresh or reset as needed
      handleClose();
    } catch (error) {
      console.error("Error linking document:", error);
      alert("Failed to link document.");
    }
  };

  // If the modal is not open, don't render anything
  if (!showModal) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          backgroundColor: "white",
          padding: "20px",
          zIndex: 1000,
          borderRadius: "8px",
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            paddingBottom: "10px",
            borderBottom: "2px solid #003366",
            marginBottom: "20px",
            marginLeft: "-21px",
            marginTop: "-21px",
            marginRight: "-22px",
            textAlign: "center",
            backgroundColor: "#19395f",
          }}
        >
          <h4 style={{ color: "white", marginBottom: 0, paddingTop: "11px" }}>
            CHECK BOX TO LINK DOCUMENT WITH AN OPEN TASK AS A RELEVANT DOCUMENT:
          </h4>
        </div>

        {/* Display error if present */}
        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

        {/* Tasks Table */}
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            marginBottom: "20px",
          }}
        >
          {isTasksLoading ? (
            <p>Loading tasks...</p>
          ) : (
            <Table
              bordered
              hover
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#003366", color: "white" }}>
                  <th>INPUT BY</th>
                  <th>TASK</th>
                  <th>RELEVANT DOCS</th>
                  <th>ASSIGNED TO</th>
                  <th>DUE BY</th>
                  <th>LINK</th>
                </tr>
              </thead>
              <tbody style={{ margin: "2px" }}>
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            // src={`${origin}${task.createdByPic}`}
                            
                            src ={task.createdByPic?
                              mediaRoute(task?.createdByPic)
                              : avatarImage}
                            alt="profile pic"
                            className="rounded-circle"
                            width="20"
                            height="25"
                          />
                          <span className="ml-2">{task.createdBy}</span>
                        </div>
                      </td>
                      <td>{task.taskType}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                          {Array(task.docsCount)
                            .fill()
                            .map((_, i) => (
                              <i
                                key={i}
                                className="ic ic-23 ic-file-colored cursor-pointer ml-1 mr-1"
                              ></i>
                            ))}
                        </div>
                      </td>
                      <td>{task.assignedTo}</td>
                      <td>{task.dueDate}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => handleTaskSelection(task.id)}
                          checked={selectedTasks.includes(task.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No tasks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={handleClose}
            style={{
              backgroundColor: "#6c757d",
              border: "none",
              padding: "8px 16px",
              fontSize: "14px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLinkDocument} // Call the function to link document
            variant="success"
          >
            Link Document
          </Button>
        </div>
      </div>

      {/* Background overlay */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(25, 57, 95, 0.5)",
          zIndex: 999,
        }}
      ></div>
    </>
  );
};

LinkDocToTaskModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  docId: PropTypes.string.isRequired, // Pass docId to fetch the related documents
  caseId: PropTypes.string.isRequired, // Pass caseId to fetch related tasks
};

export default LinkDocToTaskModal;
