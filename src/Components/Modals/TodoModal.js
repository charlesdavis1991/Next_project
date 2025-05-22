import React from "react";
import { Modal } from "react-bootstrap";
import TodoModalBody from "./TodoModalBody";

const TodoModal = (props) => {
  const handlePostTodo = (data) => {
    console.log(data, "kjkjkj");
  };

  const customModalStyle = {};
  return (
    <div>
      <Modal
        {...props}
        size="md"
        className="tabsModal"
        // fullscreen={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <TodoModalBody
          hideModal={props.onHide}
          selectedData={props?.selectedData}
          todoTabs={props?.todoTabs}
          handlePostTodo={handlePostTodo}
          atorneyStaff={props?.atorneyStaff}
        />
      </Modal>
    </div>
  );
};

export default TodoModal;
