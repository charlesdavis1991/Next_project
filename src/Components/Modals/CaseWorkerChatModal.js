import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { sendChatMessage } from "../../Redux/case/actions";

const CaseWorkerChatModal = (props) => {
  const [formData, setFormData] = useState({
    includeGreeting: true,
    chatSubjectGreeting: `}:`,
    typeMessage: "",
  });

  const [isSending, setIsSending] = useState(false);

//   const handleCheckboxChange = (e) => {
//     const checkbox = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       includeGreeting: checkbox.checked,
//     }));
//   };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { chat_message: formData.typeMessage, worker_id: props.data?.firm_user?.user?.id };
    // Handle form submission logic here

    // Close the modal
    setIsSending(true);
    sendChatMessage(data, () => {
     
        props.handleOpen();
        setIsSending(false);
        setFormData((prevFormData) => ({
          ...prevFormData,
          typeMessage: "",
        }));
      })
  };

  return (
    <Modal
      show={props.isOpen}
      centered
      size="md"
      onHide={props.handleOpen}
      className="chatModal"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header
        className=" p-0  popup-heading-color justify-content-center"
        style={{ backgroundColor: "#19395f" }}
      >
        <Modal.Title className="d-flex justify-content-between  mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500">
          Send Chat Message to &nbsp;
          {props.data?.firm_user?.profile_pic_29p ? (
            <div className="ic ic-29">
              <img
                className="rounded-circle h-100 w-100 object-fit-cover m-b-5"
                src={props.data?.firm_user?.profile_pic_29p}
              />
            </div>
          ) : (
            <div className="ic ic-29">
              <img
                className={`output-${props.data?.firm_user?.user?.id} rounded-circle h-100 w-100 object-fit-cover m-b-5`}
                // src={require("path_to_avatar_new.svg")}
                src=""
              />
            </div>
          )}
          &nbsp;
          {props.data?.firm_user?.user.first_name} {props.data?.firm_user?.user.last_name}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* <div className="d-flex align-items-center gap-2 float-right">
            <input
              className="form-check-input-sm "
              type="checkbox"
              id={`exampleCheckbox-${props.data?.user?.id}`}
              checked={formData.includeGreeting}
              onChange={handleCheckboxChange}
            />
            <label
              htmlFor={`exampleCheckbox-${props.data?.user?.id}`}
              className="m-0"
            >
              Include chat subject greeting
            </label>
          </div> */}
          {/* <Form.Group controlId="chatSubjectGreeting">
            <Form.Label>Chat Subject Greeting:</Form.Label>
            <Form.Control
              type="text"
              className="borderRaduis"
              name="chatSubjectGreeting"
              value={``}
              onChange={handleInputChange}
            //   disabled={!formData.includeGreeting}
            />
          </Form.Group> */}
          <Form.Group controlId="typeMessage" className="my-2">
            <Form.Label>Type Message:</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              className="chatMessage borderRaduis"
              name="typeMessage"
              required
              value={formData?.typeMessage}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="padding-1rem d-flex justify-content-between ">
          <Button variant="secondary" onClick={props.handleOpen}>
            Close
          </Button>
          <Button variant="success" type="submit" disabled={isSending}>
            {isSending ? "Sending Message" : "Send Chat Message"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CaseWorkerChatModal;
