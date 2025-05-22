import { Button, Modal } from "react-bootstrap";
import InputWithOutLabels from "../../common/InputWithoutLabel";
import React, { useEffect, useState } from "react";
import SelectDropdown from "../../common/select-dropdown";
import { useAddTeam, useDeleteTeam, useEditTeam } from "../hooks/useTeamTabApi";

const AddEditTeamModal = ({
  show,
  handleClose,
  refetch,
  dropdownData,
  editData,
  isEdit = false,
}) => {
  const [teamName, setTeamName] = useState("");
  const [position1, setPosition1] = useState("");
  const [position2, setPosition2] = useState("");
  const [position3, setPosition3] = useState("");
  const [position4, setPosition4] = useState("");
  const [position5, setPosition5] = useState("");
  const [position6, setPosition6] = useState("");
  const { addTeam } = useAddTeam();
  const { editTeam } = useEditTeam();

  const { deleteTeam } = useDeleteTeam();

  useEffect(() => {
    if (isEdit && editData) {
      setTeamName(editData.team_name || "");
      setPosition1(editData?.firm_user1?.id || "");
      setPosition2(editData?.firm_user2?.id || "");
      setPosition3(editData?.firm_user3?.id || "");
      setPosition4(editData?.firm_user4?.id || "");
      setPosition5(editData?.firm_user5?.id || "");
      setPosition6(editData?.firm_user6?.id || "");
    }
  }, [isEdit, editData]);

  const handleDelete = async () => {
    await deleteTeam(editData?.id);
    refetch();
    handleClose();
  };

  const handleSubmit = async () => {
    if (!isEdit) {
      await addTeam({
        team_name: teamName,
        user_type1: position1,
        user_type2: position2,
        user_type3: position3,
        user_type4: position4,
        user_type5: position5,
        user_type6: position6,
      });
      refetch();
      handleClose();
    } else {
      await editTeam({
        team_id: editData?.id,
        team_name: teamName,
        user_type1: position1,
        user_type2: position2,
        user_type3: position3,
        user_type4: position4,
        user_type5: position5,
        user_type6: position6,
      });
      refetch();
      handleClose();
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "15px", textAlign: "center" }}>
          {isEdit ? "Edit Case Management Team" : "Add Case Management Team"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row m-b-5 align-items-center">
          <div className="col-md-2 text-right">
            <label for="team_name" className="mb-0">
              Team Name:
            </label>
          </div>
          <div className="col-md-10">
            <InputWithOutLabels
              type={"text"}
              placeholder={"Enter Team Name"}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
        </div>
        <div className="position-rows-parent">
          <div className="position-row m-b-5 d-flex align-items-center ">
            <div class="position-label col-2 text-right">Position 1:</div>
            <SelectDropdown
              value={position1}
              onChange={(e) => setPosition1(e.target.value)}
              options={dropdownData}
            />
            <div class="position-label col-2 text-right">Position 4:</div>
            <SelectDropdown
              value={position4}
              onChange={(e) => setPosition4(e.target.value)}
              options={dropdownData}
            />
          </div>
          <div className="position-row m-b-5 d-flex align-items-center ">
            <div class="position-label col-2 text-right">Position 2:</div>
            <SelectDropdown
              value={position2}
              onChange={(e) => setPosition2(e.target.value)}
              options={dropdownData}
            />
            <div class="position-label col-2 text-right">Position 5:</div>
            <SelectDropdown
              value={position5}
              onChange={(e) => setPosition5(e.target.value)}
              options={dropdownData}
            />
          </div>
          <div className="position-row m-b-5 d-flex align-items-center ">
            <div class="position-label col-2 text-right">Position 3:</div>
            <SelectDropdown
              value={position3}
              onChange={(e) => setPosition3(e.target.value)}
              options={dropdownData}
            />
            <div class="position-label col-2 text-right">Position 6:</div>
            <SelectDropdown
              value={position6}
              onChange={(e) => setPosition6(e.target.value)}
              options={dropdownData}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        {isEdit && !editData?.default_cocounsel_team && (
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Button variant="success" onClick={handleSubmit}>
          {isEdit
            ? "Update Case Management Team"
            : "Add New Case Management Team"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditTeamModal;
