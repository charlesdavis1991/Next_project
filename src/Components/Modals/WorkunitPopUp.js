import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Nav, Tab } from "react-bootstrap";
import axios from "axios";
import {
  deleteWorkunit,
  updateWorkunit,
} from "../../Redux/workunit-table/workunitSlice";

function WorkunitPopUp({ editWorkunit, handleClose, workunitData }) {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [statuses, setStatuses] = useState([]);
  const [statusSearchTerm, setStatusSearchTerm] = useState("");

  const [checklistData, setChecklistData] = useState([]);
  const [checklistSearchTerm, setChecklistSearchTerm] = useState("");
  const [filterChecklistBlocking, setFilterChecklistBlocking] = useState(false);

  const [panelChecklistData, setPanelChecklistData] = useState([]);
  const [panelChecklistSearchTerm, setPanelChecklistSearchTerm] = useState("");
  const [filterPanelChecklistBlocking, setFilterPanelChecklistBlocking] =
    useState(false);

  const [stages, setStages] = useState([]);

  const [form, setForm] = useState({
    id: null,
    wu_name: "",
    table: "",
    field: "",
    field_description: "",
    filled: false,
    any: false,
    all: false,
    empty: false,
    valued: false,
    more: "",
    less: "",
    max: "",
    min: "",
    related_name: "",
    is_extra_credit: false,
    blocking: false,
    is_all_page_checklist: false,
    blocked_status: [],
    checklists: [],
    panel_checklists: [],
    blocked_stage: [],
  });

  useEffect(() => {
    if (editWorkunit && workunitData) {
      console.log(workunitData);
      setForm({
        id: workunitData?.id || null,
        wu_name: workunitData?.wu_name || "",
        table: workunitData?.table || "",
        field: workunitData?.field || "",
        field_description: workunitData?.field_description || "",
        filled: workunitData?.filled || false,
        any: workunitData?.any || false,
        all: workunitData?.all || false,
        empty: workunitData?.empty || false,
        valued: workunitData?.valued || false,
        more: workunitData?.more || "",
        less: workunitData?.less || "",
        max: workunitData?.max || "",
        min: workunitData?.min || "",
        related_name: workunitData?.related_name || "",
        is_extra_credit: workunitData?.is_extra_credit || false,
        blocking: workunitData?.blocking || false,
        is_all_page_checklist: workunitData?.is_all_page_checklist || false,
        blocked_status: workunitData?.blocked_status || [],
        checklists: workunitData?.checklists || [],
        panel_checklists: workunitData?.panel_checklists || [],
        blocked_stage: workunitData?.blocked_stage || [],
      });
    }
    getStatusesData();
    getChecklistData();
    getPanelChecklistData();
    getStagesData();
  }, [editWorkunit, workunitData]);

  const getStatusesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/statuses/directory/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setStatuses(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getChecklistData = async () => {
    try {
      const response = await axios.get(`${origin}/api/checklists/directory/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setChecklistData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getPanelChecklistData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/panel-checklists/directory/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      setPanelChecklistData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getStagesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/stages/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setStages(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (field, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  // Filter checklistData based on search term and blocking filter
  const filteredChecklists = checklistData?.filter((checklist) => {
    const matchesSearch =
      checklist?.name
        .toLowerCase()
        .includes(checklistSearchTerm?.toLowerCase()) ||
      checklist?.page?.name
        .toLowerCase()
        .includes(checklistSearchTerm?.toLowerCase());
    const matchesBlocking = filterChecklistBlocking ? checklist.blocking : true;
    return matchesSearch && matchesBlocking;
  });

  // Handle checkbox toggle
  const handleChecklistToggle = (checklistId) => {
    const updatedChecklists = form.checklists?.includes(checklistId)
      ? form.checklists?.filter((id) => id !== checklistId)
      : [...form.checklists, checklistId];
    handleArrayChange("checklists", updatedChecklists);
  };

  // Handle blocked_stage toggle
  const handleStageToggle = (stageId) => {
    const updatedBlockedStage = form.blocked_stage?.includes(stageId)
      ? form.blocked_stage?.filter((id) => id !== stageId)
      : [...form.blocked_stage, stageId];
    handleArrayChange("blocked_stage", updatedBlockedStage);
  };

  // Filter panelChecklistData based on search term and blocking filter
  const filteredPanelChecklists = panelChecklistData?.filter((checklist) => {
    const matchesSearch =
      checklist.name
        .toLowerCase()
        .includes(panelChecklistSearchTerm.toLowerCase()) ||
      checklist?.panel_name?.name
        .toLowerCase()
        .includes(panelChecklistSearchTerm.toLowerCase());
    const matchesBlocking = filterPanelChecklistBlocking
      ? checklist.blocking
      : true;
    return matchesSearch && matchesBlocking;
  });

  // Handle panel checkbox toggle
  const handlePanelChecklistToggle = (checklistId) => {
    const updatedChecklists = form.panel_checklists.includes(checklistId)
      ? form.panel_checklists.filter((id) => id !== checklistId)
      : [...form.panel_checklists, checklistId];
    handleArrayChange("panel_checklists", updatedChecklists);
  };

  const filteredStatuses = statuses?.filter((status) => {
    const matchesSearch = status.name
      .toLowerCase()
      .includes(statusSearchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleStatusToggle = (statusId) => {
    const updatedStatuses = form.blocked_status?.includes(statusId)
      ? form.blocked_status.filter((id) => id !== statusId)
      : [...form.blocked_status, statusId];
    handleArrayChange("blocked_status", updatedStatuses);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/workunits/directory/?id=${workunitData.id}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 204) {
        handleClose();
        dispatch(deleteWorkunit(workunitData.id));
        setForm(initialState);
      }
    } catch (err) {
      console.log(err.message || "Something went wrong");
      handleClose();
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.patch(
        `${origin}/api/workunits/directory/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        dispatch(
          updateWorkunit({
            id: workunitData.id,
            updatedData: response.data.data,
          })
        );
        handleClose();
        setForm(initialState);
      }
    } catch (err) {
      console.log(err.message || "Something went wrong");
      handleClose();
    }
  };

  return (
    <Modal
      show={editWorkunit}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-900px"
    >
      <Modal.Header className="bg-primary text-center p-2">
        <h4 className="modal-title mx-auto text-white">Edit Work Unit</h4>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="workunit">
          <Nav variant="tabs" className="justify-content-center mb-2">
            <Nav.Item>
              <Nav.Link eventKey="workunit">WorkUnit</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="checklists">Checklists</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="panel_checklists">Panel Checklists</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="blocked_status">Blocked Status</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content style={{ height: "600px" }}>
            <Tab.Pane className="overflow-hidden" eventKey="workunit">
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Name</span>
                </div>
                <div className="col-10">
                  <input
                    type="text"
                    placeholder="Enter Name"
                    name="wu_name"
                    value={form.wu_name}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Table</span>
                </div>
                <div className="col-10">
                  <input
                    type="text"
                    placeholder="Enter Table"
                    name="table"
                    value={form.table}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Field</span>
                </div>
                <div className="col-10">
                  <input
                    type="text"
                    placeholder="Enter Field"
                    name="field"
                    value={form.field}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">
                    Field Description
                  </span>
                </div>
                <div className="col-10">
                  <input
                    type="text"
                    placeholder="Enter Field Description"
                    name="field_description"
                    value={form.field_description}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">More/Less</span>
                </div>
                <div className="col-5">
                  <input
                    type="text"
                    placeholder="Enter More than Value"
                    name="more"
                    value={form.more}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-5">
                  <input
                    type="text"
                    placeholder="Enter Less than Value"
                    name="less"
                    value={form.less}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Max/Min</span>
                </div>
                <div className="col-5">
                  <input
                    type="text"
                    placeholder="Enter Max Value"
                    name="max"
                    value={form.max}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-5">
                  <input
                    type="text"
                    placeholder="Enter Min Value"
                    name="min"
                    value={form.min}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-3"></div>
                <div className="col-9 row px-0">
                  <label htmlFor="filled" className="form-check-label col-3">
                    <input
                      type="checkbox"
                      name="filled"
                      id="filled"
                      checked={form.filled}
                      onChange={handleChange}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    Filled
                  </label>

                  <label htmlFor="any" className="form-check-label col-3">
                    <input
                      type="checkbox"
                      name="any"
                      id="any"
                      checked={form.any}
                      onChange={handleChange}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    Any
                  </label>

                  <label htmlFor="all" className="form-check-label col-3">
                    <input
                      type="checkbox"
                      name="all"
                      id="all"
                      checked={form.all}
                      onChange={handleChange}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    All
                  </label>

                  <label htmlFor="empty" className="form-check-label col-3">
                    <input
                      type="checkbox"
                      name="empty"
                      id="empty"
                      checked={form.empty}
                      onChange={handleChange}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    Empty
                  </label>
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-3 text-left"></div>
                <div className="col-9 row px-0">
                  <label htmlFor="valued" className="form-check-label col-3">
                    <input
                      type="checkbox"
                      name="valued"
                      id="valued"
                      checked={form.valued}
                      onChange={handleChange}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    Valued
                  </label>
                  <label
                    htmlFor="is-extra-credit"
                    className="form-check-label col-3"
                  >
                    <input
                      type="checkbox"
                      name="is_extra_credit"
                      id="is-extra-credit"
                      checked={form.is_extra_credit}
                      onChange={handleChange}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    Extra Credit
                  </label>

                  <label htmlFor="blocking" className="form-check-label col-3">
                    <input
                      type="checkbox"
                      name="blocking"
                      id="blocking"
                      checked={form.blocking}
                      onChange={handleChange}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    Blocking
                  </label>

                  <label
                    htmlFor="all-page-checklist"
                    className="form-check-label col-3"
                  >
                    <input
                      type="checkbox"
                      id="all-page-checklist"
                      name="is_all_page_checklist"
                      checked={form.is_all_page_checklist}
                      onChange={handleChange}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    All Page Checklist
                  </label>
                </div>
              </div>
              <div className="row align-items-start form-group">
                <div className="col-2 text-left text-grey">Blocked Status</div>
                <div className="col-10">
                  <div
                    className="form-control"
                    style={{
                      minHeight: "42px",
                      height: "auto",
                      maxHeight: "200px",
                      overflowY: "scroll",
                      border: "1px solid #ccc",
                      padding: "10px",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {stages?.map((stage) => (
                      <div key={stage.id} className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            name="blocked_stage"
                            value={stage.id}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={form.blocked_stage?.some(
                              (id) => id === stage.id
                            )}
                            onChange={() => handleStageToggle(stage.id)}
                          />
                          {stage.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane className="overflow-hidden" eventKey="checklists">
              {/* Search Filter */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search by checklist name or page name"
                  value={checklistSearchTerm}
                  onChange={(e) => setChecklistSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Blocking Filter Checkbox */}
              <div className="form-check mb-3 ml-2">
                <label htmlFor="filter-blocking" className="form-check-label">
                  <input
                    type="checkbox"
                    id="filter-blocking"
                    style={{ accentColor: "grey" }}
                    checked={filterChecklistBlocking}
                    onChange={(e) =>
                      setFilterChecklistBlocking(e.target.checked)
                    }
                    className="form-check-input"
                  />
                  Show only blocking checklists
                </label>
              </div>

              {/* Box 1: Filtered Results Grid */}
              <div className="mb-3">
                <h5>Filtered Results</h5>
                <div
                  className="form-control"
                  style={{
                    minHeight: "42px",
                    height: "auto",
                    maxHeight: "230px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {filteredChecklists?.map((checklist) => (
                    <div key={checklist.id} className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="checklists"
                          value={checklist.id}
                          className="form-check-input"
                          style={{ accentColor: "grey" }}
                          checked={form.checklists?.some(
                            (id) => id === checklist.id
                          )}
                          onChange={() => handleChecklistToggle(checklist.id)}
                        />
                        {checklist.name}
                        {checklist?.page?.name && ` - (${checklist.page.name})`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Selected Checklists */}
              <div>
                <h5>Selected Checklists</h5>
                <div
                  className="form-control"
                  style={{
                    minHeight: "42px",
                    height: "auto",
                    maxHeight: "230px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {form.checklists?.map((checklistId) => {
                    const checklist = checklistData?.find(
                      (c) => c.id === checklistId
                    );
                    return (
                      <div key={checklistId} className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            name="checklists"
                            value={checklistId}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={true}
                            onChange={() => handleChecklistToggle(checklistId)}
                          />
                          {checklist?.name}
                          {checklist?.page?.name &&
                            ` - (${checklist.page.name})`}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane className="overflow-hidden" eventKey="panel_checklists">
              {/* Search Filter */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search by panel checklist name or panel_name"
                  value={panelChecklistSearchTerm}
                  onChange={(e) => setPanelChecklistSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Blocking Filter Checkbox */}
              <div className="form-check mb-3 ml-2">
                <label
                  htmlFor="filter-panel-blocking"
                  className="form-check-label"
                >
                  <input
                    type="checkbox"
                    id="filter-panel-blocking"
                    style={{ accentColor: "grey" }}
                    checked={filterPanelChecklistBlocking}
                    onChange={(e) =>
                      setFilterPanelChecklistBlocking(e.target.checked)
                    }
                    className="form-check-input"
                  />
                  Show only blocking checklists
                </label>
              </div>

              {/* Box 1: Filtered Results Grid */}
              <div className="mb-3">
                <h5>Filtered Results</h5>
                <div
                  className="form-control"
                  style={{
                    minHeight: "42px",
                    height: "auto",
                    maxHeight: "230px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {filteredPanelChecklists?.map((checklist) => (
                    <div key={checklist.id} className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="panel_checklists"
                          value={checklist.id}
                          className="form-check-input"
                          style={{ accentColor: "grey" }}
                          checked={form.panel_checklists?.some(
                            (id) => id === checklist.id
                          )}
                          onChange={() =>
                            handlePanelChecklistToggle(checklist.id)
                          }
                        />
                        {checklist.name}
                        {checklist?.panel_name?.name &&
                          ` - (${checklist.panel_name.name})`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Selected Checklists */}
              <div className="mt-auto">
                <h5>Selected Checklists</h5>
                <div
                  className="form-control"
                  style={{
                    minHeight: "42px",
                    height: "auto",
                    maxHeight: "230px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {form.panel_checklists?.map((checklistId) => {
                    const checklist = panelChecklistData?.find(
                      (c) => c.id === checklistId
                    );
                    return (
                      <div key={checklistId} className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            name="panel_checklists"
                            value={checklistId}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={true}
                            onChange={() => handleChecklistToggle(checklistId)}
                          />
                          {checklist?.name}{" "}
                          {checklist?.panel_name?.name &&
                            `(${checklist.panel_name.name})`}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane className="overflow-hidden" eventKey="blocked_status">
              <div>
                <div
                  className="form-control"
                  style={{
                    minHeight: "42px",
                    height: "auto",
                    maxHeight: "580px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {statuses?.map((status) => (
                    <div key={status.id} className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="blocked_status"
                          value={status.id}
                          className="form-check-input"
                          style={{ accentColor: "grey" }}
                          checked={form.blocked_status.some(
                            (id) => id === status.id
                          )}
                          onChange={() => handleStatusToggle(status.id)}
                        />
                        {status.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          className="btn btn-secondary float-left-margin-right-auto"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}
export default WorkunitPopUp;
