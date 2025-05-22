import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row, Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RenderProgress from "./RenderProgress";
import ModalCheckList from "./ModalCheckList";
import CheckModalHeadList from "./CheckModalHeadList";
import axios from "axios";
import { CheckListConfirmModal } from "./CheckListConfirmModal";

export function MyVerticallyCenteredModal({
  show,
  handleClose,
  duration,
  selectedCheck,
}) {
  const [currentData, setCurrentData] = useState();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditClose = () => setEditModalShow(false);
  const handleEditShow = () => setEditModalShow(true);
  useEffect(() => {
    if (selectedCheck) {
      fetchDetail();
    }
  }, [selectedCheck]);
  const fetchDetail = async () => {
    try {
      const data = {
        case_type: selectedCheck.caseType,
        duration,
        page_name: selectedCheck.pageName,
      };
      const response = await axios.post(
        `${origin}/api/checklists/get/case/type/list/`,
        data,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setCurrentData(response.data.cases);
    } catch (error) {
      console.log("Error fetching case type data:", error);
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          handleClose();
          handleEditShow();
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          style={{
            backgroundColor: "#043363",
          }}
          closeButton
          className="text-center py-2 px-4"
        >
          <h5 className=" text-white font-w-bold font-14 mx-auto">
            Checklist Completion Task Generator
          </h5>
        </Modal.Header>
        <Modal.Body className="heck-list-modal">
          <Form>
            <div>
              Checklist Completion Task Generator These are the ten cases with
              the lowest completion percentage on the Case page. Send a task to
              the people assigned to this case with the tools below.
            </div>
            <div className="pt-2">
              All tasks will begin with “Review this case and address the Case
              checklist items and complete any available items on that list.”
              Additional instructions can be entered in the below input field
            </div>
            <div
              className="p-2 d-flex justify-content-around align-items-center"
              style={{
                backgroundColor: "#6885a1",
              }}
            >
              <div className="text-white">
                <span className="fw-bold ">data.name</span> Additional
                Instructions for Each Task
              </div>
              <span className="text-white">Case Workers</span>
            </div>
            <CheckModalHeadList selectedCheck={selectedCheck} />
            <div
              className="p-2 d-flex  align-items-center"
              style={{
                backgroundColor: "#6885a1",
              }}
            >
              <div className="text-white fw-bold px-4">client</div>
              <span className="text-white fw-bold px-4">Case </span>
            </div>
            <ModalCheckList data={currentData} selectedCheck={selectedCheck} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              handleClose();
              handleEditShow();
            }}
          >
            Assign task
          </Button>
        </Modal.Footer>
      </Modal>
      <CheckListConfirmModal
        handleClose={handleEditClose}
        show={editModalShow}
        // selectedTasks={selectedTasks}
      />
    </>
  );
}
