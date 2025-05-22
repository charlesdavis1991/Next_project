import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import useGetAutoTaskDetails, {
  useAddAutoTasks,
} from "../hooks/useAutoTaskTabApi";

const AddAutoTaskModal = ({
  show,
  handleClose,
  data,
  pageSlots,
  onPageIdChange,
  refetch,
}) => {
  const [selectedCaseTypes, setSelectedCaseTypes] = useState([]);
  const [attorneyType, setAttorneyType] = useState();
  const [category, setCategory] = useState("Tasks");
  const [taskDescription, setTaskDescription] = useState("");
  const [triggerStage, setTriggerStage] = useState();
  const [triggerStatus, setTriggerStatus] = useState();
  const [blockStage, setBlockStage] = useState();
  const [blockStatus, setBlockStatus] = useState();
  const [pageSlot, setPageSlot] = useState();
  const [repeat, setRepeat] = useState();
  const [noOfDaysToRepeat, setNoOfDaysToRepeat] = useState();
  const [pageId, setPageId] = useState();
  const [pageSlotId, setPageSlotId] = useState();
  const [textToChange, setTextToChange] = useState("");

  const oddCaseTypes = data?.case_types.filter((_, index) => index % 2 === 0);
  const evenCaseTypes = data?.case_types.filter((_, index) => index % 2 !== 0);
  const { saveAutoTasks } = useAddAutoTasks();

  const handleCaseTypeChange = (id) => {
    setSelectedCaseTypes((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((typeId) => typeId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handlePageIdChange = (e) => {
    const newPageId = e.target.value;
    setPageId(newPageId);
    onPageIdChange(newPageId);
  };

  const handleSubmit = async () => {
    console.log("Submitted Data:", {
      selectedCaseTypes,
      attorneyType,
      category,
      taskDescription,
      triggerStage,
      triggerStatus,
      blockStage,
      blockStatus,
      pageSlot,
      repeat,
      noOfDaysToRepeat,
      pageId,
      pageSlotId,
      textToChange,
    });
    await saveAutoTasks({
      case_types: selectedCaseTypes,
      is_repeated: repeat === "true" ? "True" : "False",
      is_slot_full: pageSlot === "true" ? "True" : "False",
      searchable_text: textToChange,
      todo_document_page: pageId,
      todo_document_slot: pageSlotId,
      description: taskDescription,
      repeat: noOfDaysToRepeat,
      todo_page: category,
      user_type: attorneyType === undefined ? null : attorneyType,
      todo_stage: triggerStage,
      todo_status: triggerStatus,
      block_todo_stage: blockStage,
      block_todo_status: blockStatus,
    });
    refetch();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "15px" }}>Add Auto Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span class="d-inline-block text-grey">Case Types: </span>
          </div>
          <div className="col-md-10">
            <div className="row flex-nowrap m-0 top-checkboxes">
              {/* One with Case type odd */}
              <div className="col-md-12 col-lg-7 pl-0">
                {oddCaseTypes?.map((caseType) => (
                  <div className="checkbox-wrapper" key={caseType.id}>
                    <input
                      type="checkbox"
                      className="repeated_checkbox"
                      id={`repeated_${caseType.id}`}
                      checked={selectedCaseTypes.includes(caseType.id)}
                      onChange={() => handleCaseTypeChange(caseType.id)}
                    />
                    <label
                      className="ml-2 text-left mb-0"
                      htmlFor={`repeated_${caseType.id}`}
                    >
                      {caseType.name}
                    </label>
                  </div>
                ))}
              </div>

              {/* Case Type Even */}
              <div className="col-md-12 col-lg-5 pl-0">
                {evenCaseTypes?.map((caseType) => (
                  <div className="checkbox-wrapper" key={caseType.id}>
                    <input
                      type="checkbox"
                      className="repeated_checkbox"
                      id={`repeated_${caseType.id}`}
                      checked={selectedCaseTypes.includes(caseType.id)}
                      onChange={() => handleCaseTypeChange(caseType.id)}
                    />
                    <label
                      className="ml-2 text-left mb-0"
                      htmlFor={`repeated_${caseType.id}`}
                    >
                      {caseType.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span class="d-inline-block text-grey">Repeat: </span>
          </div>
          <div className="col-md-2">
            <div className="d-flex f-gap-20">
              <label className="mb-0">
                <input
                  type="radio"
                  name="is_repeated"
                  id="is_repeated_yes"
                  value={true}
                  checked={repeat === "true"}
                  onChange={(e) => setRepeat(e.target.value)}
                />{" "}
                Yes
              </label>
              <label class="mb-0">
                <input
                  type="radio"
                  name="is_repeated"
                  id="is_repeated_no"
                  value={false}
                  checked={repeat === "false"}
                  onChange={(e) => setRepeat(e.target.value)}
                />{" "}
                No
              </label>
            </div>
          </div>
          <div className="col-md-8">
            <div className="d-flex f-gap-05 align-items-center">
              <span className="d-inline-block text-nowrap text-grey">
                Enter No. of Days to Repeat Task:{" "}
              </span>
              <input
                type="number"
                value={noOfDaysToRepeat}
                name="repeat"
                id="repeat"
                placeholder="Enter Repeat"
                class="form-control"
                onChange={(e) => setNoOfDaysToRepeat(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span class="d-inline-block text-grey">For: </span>
          </div>
          <div className="col-md-4">
            <select
              value={attorneyType}
              onChange={(e) => setAttorneyType(e.target.value)}
              className="form-select"
            >
              <option value="">Select Attorney Type</option>
              {data?.attorney_user_types.map((attorney) => (
                <option key={attorney.id} value={attorney.id}>
                  {attorney.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 text-right">
            <span class="d-inline-block text-grey">Category: </span>
          </div>
          <div className="col-md-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              <option value="">Select Category</option>
              {data?.todo_types.map((todo) => (
                <option key={todo.id} value={todo.id}>
                  {todo.tab_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span class="d-inline-block text-grey">Task Description: </span>
          </div>
          <div className="col-md-10">
            <textarea
              type="text"
              row="2"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              name="variable_description"
              id="variable_description"
              class="form-control textarea"
              placeholder="Enter Todo Description"
            ></textarea>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span class="d-inline-block text-grey">Trigger By: </span>
          </div>
          <div className="col-md-5">
            <select
              value={triggerStage}
              onChange={(e) => setTriggerStage(e.target.value)}
              className="form-select"
            >
              <option value="">Select a Stage</option>
              {data?.stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
            <select
              value={triggerStatus}
              onChange={(e) => setTriggerStatus(e.target.value)}
              className="form-select"
            >
              <option value="">Select a Status</option>
              {data?.statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span class="d-inline-block text-grey">Blocked By: </span>
          </div>
          <div className="col-md-5">
            <select
              value={blockStage}
              onChange={(e) => setBlockStage(e.target.value)}
              className="form-select"
            >
              <option value="">Select a Stage</option>
              {data?.stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
            <select
              value={blockStatus}
              onChange={(e) => setBlockStatus(e.target.value)}
              className="form-select"
            >
              <option value="">Select a Status</option>
              {data?.statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span class="d-inline-block text-grey">Page Slot: </span>
          </div>
          <div className="col-md-2">
            <div className="d-flex f-gap-20">
              <label className="mb-0">
                <input
                  type="radio"
                  name="is_page"
                  id="is_page_yes"
                  value={true}
                  checked={pageSlot === "true"}
                  onChange={(e) => setPageSlot(e.target.value)}
                />{" "}
                Full
              </label>
              <label class="mb-0">
                <input
                  type="radio"
                  name="is_page_slot"
                  id="is_page_slot_no"
                  value={false}
                  checked={pageSlot === "false"}
                  onChange={(e) => setPageSlot(e.target.value)}
                />{" "}
                Empty
              </label>
            </div>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span class="d-inline-block text-grey">Document Trigger: </span>
          </div>
          <div className="col-md-5">
            <select
              value={pageId}
              onChange={handlePageIdChange}
              className="form-select"
            >
              <option value="">Select a Page</option>
              {data?.pages_with_photoslots.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
            <select
              value={pageSlotId}
              onChange={(e) => setPageSlotId(e.target.value)}
              className="form-select"
            >
              <option value="">Select a Page Slot</option>
              {pageSlots?.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.slot_name === null ? "Available" : slot.slot_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span class="d-inline-block text-grey">Text to be Checked: </span>
          </div>
          <div class="col-md-10">
            <input
              type="text"
              row="2"
              value={textToChange}
              name="text_description"
              id="searchable_text"
              class="form-control"
              placeholder="Enter text to be checked"
              onChange={(e) => setTextToChange(e.target.value)}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Save Automatic Task Template
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAutoTaskModal;
