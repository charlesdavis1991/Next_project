import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row, Stack, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { format } from "date-fns";

const selectedTasks = [
  {
    id: 1,
    taskText:
      "Complete the project documentation for the new feature release, ensuring all API endpoints are covered.",
    dueBy: "2024-10-20T14:30:00Z", // ISO format with 'Z' for UTC
    assignedUser: {
      firstName: "Michael",
      lastName: "Brown",
      imgUrl: "https://example.com/images/michael_brown.jpg",
    },
  },
  {
    id: 2,
    taskText:
      "Prepare a set of presentation slides for the upcoming stakeholder meeting, including financial forecasts and product updates.",
    dueBy: "2024-10-22T09:00:00Z", // Valid date and time
    assignedUser: {
      firstName: "Emily",
      lastName: "Davis",
      imgUrl: "https://example.com/images/emily_davis.jpg",
    },
  },
  {
    id: 3,
    taskText:
      "Identify and resolve critical bugs in the application’s user interface, focusing on improving load times and responsiveness.",
    dueBy: "2024-10-18T16:45:00Z", // Proper date and time string
    assignedUser: {
      firstName: "Robert",
      lastName: "Miller",
      imgUrl: "https://example.com/images/robert_miller.jpg",
    },
  },
];

export function CheckListConfirmModal({ show, handleClose }) {
  const [currentData, setCurrentData] = useState();
  const origin = process.env.REACT_APP_BACKEND_URL;

  const renderDate = (dueBy) => {
    const dateObject = new Date(dueBy);

    if (isNaN(dateObject.getTime())) {
      return <>Invalid date format</>;
    }

    const formattedDate = format(dateObject, "yyyy-MM-dd");
    const formattedTime = format(dateObject, "HH:mm:ss");
    return (
      <>
        {formattedDate} <br /> {formattedTime}
      </>
    );
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="text-center py-3 px-4 border-bottom">
        <h5 className="font-w-bold mx-auto" style={{ fontSize: "15px" }}>
          You assigned {selectedTasks.length} tasks to {selectedTasks.length}{" "}
          cases
        </h5>
      </Modal.Header>
      <div className="p-4">
        {/* <Modal.Body> */}
        <Table striped hover responsive className="edit-checklist-modal">
          <thead>
            <tr>
              <th className="text-capitalize">Case</th>
              <th className="text-capitalize">Task</th>
              <th className="text-capitalize">Assigned</th>
              <th className="text-capitalize">Due By</th>
            </tr>
          </thead>
          <tbody>
            {selectedTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.taskText}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={task.assignedUser.imgUrl}
                      className="border me-3"
                      style={{
                        width: "19px",
                        height: "19px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      alt={`${task.assignedUser.firstName} ${task.assignedUser.lastName}`} // Improved alt text
                    />
                    <span>
                      {task.assignedUser.firstName} {task.assignedUser.lastName}
                    </span>
                  </div>
                </td>
                <td>{renderDate(task.dueBy)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* </Modal.Body> */}
        {/* <Modal.Footer> */}
        <div className="d-flex justify-content-center pt-3">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>
        {/* <Button onClick={handleClose}>Assign task</Button> */}
        {/* </Modal.Footer> */}
      </div>
    </Modal>
  );
}
