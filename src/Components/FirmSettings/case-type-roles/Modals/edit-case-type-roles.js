import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CaseWorkerRoleModal = ({
  show,
  handleClose,
  caseType,
  caseWorkerRoles,
  onRoleChange,
  handleSave,
  modalTitle = "Select the Case Worker Roles for Case Workers 1-6 on each Case Type",
  saveButtonText = "Save",
}) => {
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    if (caseType) {
      setSelectedRoles([
        {
          id: caseType.user_case_type_1?.id || 0,
          name: caseType.user_case_type_1?.name || "",
        },
        {
          id: caseType.user_case_type_2?.id || 0,
          name: caseType.user_case_type_2?.name || "",
        },
        {
          id: caseType.user_case_type_3?.id || 0,
          name: caseType.user_case_type_3?.name || "",
        },
        {
          id: caseType.user_case_type_4?.id || 0,
          name: caseType.user_case_type_4?.name || "",
        },
        {
          id: caseType.user_case_type_5?.id || 0,
          name: caseType.user_case_type_5?.name || "",
        },
        {
          id: caseType.user_case_type_6?.id || 0,
          name: caseType.user_case_type_6?.name || "",
        },
      ]);
    }
  }, [caseType]);

  const handleRoleChangeLocal = (roleId, roleName, index) => {
    const updatedRoles = [...selectedRoles];
    updatedRoles[index] = { id: parseInt(roleId, 10), name: roleName };
    setSelectedRoles(updatedRoles);
    onRoleChange(updatedRoles);
  };

  const saveChanges = () => {
    const updatedData = {
      id: caseType.id,
      user_case_type_1: selectedRoles[0],
      user_case_type_2: selectedRoles[1],
      user_case_type_3: selectedRoles[2],
      user_case_type_4: selectedRoles[3],
      user_case_type_5: selectedRoles[4],
      user_case_type_6: selectedRoles[5],
    };
    handleSave(updatedData);
  };

  return (
    <Modal size="lg" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center" style={{ fontSize: "15px" }}>
          {modalTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row col-12">
          <Form className="w-100">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="form-group mb-3 d-flex justify-content-center"
              >
                {/* First role dropdown */}
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ flex: 1 }}
                >
                  <Form.Label
                    style={{ height: "35px" }}
                    className="m-b-0 text-nowrap  d-flex align-items-center m-r-5"
                  >{`Case Worker Role ${index + 1}: `}</Form.Label>
                  <Form.Control
                    style={{ height: "35px" }}
                    as="select"
                    value={selectedRoles[index]?.id || ""}
                    onChange={(e) =>
                      handleRoleChangeLocal(
                        e.target.value,
                        e.target.options[e.target.selectedIndex].text,
                        index
                      )
                    }
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    {caseWorkerRoles?.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Form.Control>
                </div>

                {/* Second role dropdown */}
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ flex: 1, marginLeft: "10px" }}
                >
                  <Form.Label
                    style={{ height: "35px" }}
                    className="m-b-0 text-nowrap d-flex align-items-center m-r-5"
                  >{`Case Worker Role ${index + 4}: `}</Form.Label>
                  <Form.Control
                    style={{ height: "35px" }}
                    as="select"
                    value={selectedRoles[index + 3]?.id || ""}
                    onChange={(e) =>
                      handleRoleChangeLocal(
                        e.target.value,
                        e.target.options[e.target.selectedIndex].text,
                        index + 3
                      )
                    }
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    {caseWorkerRoles?.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Form.Control>
                </div>
              </div>
            ))}
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={saveChanges}>
          {saveButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CaseWorkerRoleModal;
