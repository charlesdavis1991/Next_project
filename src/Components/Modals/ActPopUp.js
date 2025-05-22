import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Nav, Tab } from "react-bootstrap";
import axios from "axios";
import { deleteAct, updateAct } from "../../Redux/act-table/actsSlice";

function ActPopUp({ editAct, handleClose, actData }) {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();

  // State for related fields
  const [statuses, setStatuses] = useState([]);
  const [workUnits, setWorkUnits] = useState([]);
  const [pages, setPages] = useState([]);

  // State for work unit filters
  const [workUnitSearchTerm, setWorkUnitSearchTerm] = useState("");
  const [filterFilled, setFilterFilled] = useState(false);
  const [filterAny, setFilterAny] = useState(false);
  const [filterAll, setFilterAll] = useState(false);
  const [filterEmpty, setFilterEmpty] = useState(false);
  const [filterValued, setFilterValued] = useState(false);
  const [filterExtraCredit, setFilterExtraCredit] = useState(false);
  const [filterBlocking, setFilterBlocking] = useState(false);
  const [filterAllPageChecklist, setFilterAllPageChecklist] = useState(false);

  const [triggerMissingTerm, setTriggerMissingTerm] = useState("");
  const [triggerBlockTerm, setTriggerBlockTerm] = useState("");
  const [triggerTerm, setTriggerTerm] = useState("");
  const [blockTerm, setBlockTerm] = useState("");
  const [triggerIfNotAllTerm, setTriggerIfNotAllTerm] = useState("");

  const [stages, setStages] = useState([]);

  const [form, setForm] = useState({
    id: null,
    act_name: "",
    group: false,
    page: "",
    order: 0,
    trigger_status_if_not_all: null,
    work_units: [],
    trigger_status_if_missing: [],
    block_status_if_missing: [],
    trigger_status: [],
    block_status: [],
    block_stage: [],
    trigger_stage: [],
  });

  useEffect(() => {
    if (editAct && actData) {
      setForm({
        id: actData?.id || null,
        act_name: actData?.act_name || "",
        group: actData?.group || false,
        page: actData?.page?.id || "",
        work_units: actData?.work_units?.map((workUnit)=>workUnit.id) || [],
        trigger_status_if_missing: actData?.trigger_status_if_missing?.map((status)=>status.id) || [],
        block_status_if_missing: actData?.block_status_if_missing?.map((status)=>status.id) || [],
        trigger_status: actData?.trigger_status?.map((status)=>status.id) || [],
        block_status: actData?.block_status?.map((status)=>status.id) || [],
        order: actData?.order || 0,
        trigger_status_if_not_all:
          actData?.trigger_status_if_not_all?.id || null,
        block_stage: actData?.block_stage?.map((stage)=>stage.id) || [],
        trigger_stage: actData?.trigger_stage?.map((stage)=>stage.id) || [],
      });
      fetchStatuses();
      fetchWorkUnits();
      fetchPages();
      getStagesData();
    }
  }, [editAct, actData]);

  const fetchStatuses = async () => {
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

  const fetchWorkUnits = async () => {
    try {
      const response = await axios.get(`${origin}/api/workunits/directory/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setWorkUnits(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPages = async () => {
    try {
      const response = await axios.get(`${origin}/api/getPages/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setPages(response.data.data);
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

  const handleIntChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: parseInt(value),
    }));
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/acts/directory/?id=${actData.id}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 204) {
        handleClose();
        dispatch(deleteAct(actData.id));
      }
    } catch (err) {
      console.log(err.message || "Something went wrong");
      handleClose();
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.patch(
        `${origin}/api/acts/directory/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        dispatch(
          updateAct({
            id: actData.id,
            updatedData: response.data.data,
          })
        );
        handleClose();
      }
    } catch (err) {
      console.log(err.message || "Something went wrong");
      handleClose();
    }
  };

  // Filter trigger_status_if_missing statuses based on search term
  const filteredTriggerMissingStatuses = statuses?.filter((status) => {
    return status?.name
      .toLowerCase()
      .includes(triggerMissingTerm.toLowerCase());
  });

  // Filter block_status_if_missing statuses based on search term
  const filteredTriggerBlockStatuses = statuses?.filter((status) => {
    return status?.name.toLowerCase().includes(triggerBlockTerm.toLowerCase());
  });
  // Filter trigger_status statuses based on search term
  const filteredTriggerStatuses = statuses?.filter((status) => {
    return status?.name.toLowerCase().includes(triggerTerm.toLowerCase());
  });
  // Filter block_status statuses based on search term
  const filteredBlockStatuses = statuses?.filter((status) => {
    return status?.name.toLowerCase().includes(blockTerm.toLowerCase());
  });

  // Filter trigger_status_if_not_all statuses based on search term
  const filteredTriggerIfNotAll = statuses?.filter((status) => {
    return status?.name
      .toLowerCase()
      .includes(triggerIfNotAllTerm.toLowerCase());
  });

  // Handle checkbox toggle for statuses
  const handleStatusToggle = (field, statusId) => {
    setForm((prevForm) => {
      const updatedStatuses = prevForm[field].includes(statusId)
        ? prevForm[field].filter((id) => id !== statusId)
        : [...prevForm[field], statusId];
      return {
        ...prevForm,
        [field]: updatedStatuses,
      };
    });
  };

  // Filter work units based on search term and filters
  const filteredWorkUnits = workUnits?.filter((workUnit) => {
    const matchesSearch = workUnit.wu_name
      .toLowerCase()
      .includes(workUnitSearchTerm.toLowerCase());

    const matchesFilters =
      (!filterFilled || workUnit.filled) &&
      (!filterAny || workUnit.any) &&
      (!filterAll || workUnit.all) &&
      (!filterEmpty || workUnit.empty) &&
      (!filterValued || workUnit.valued) &&
      (!filterExtraCredit || workUnit.is_extra_credit) &&
      (!filterBlocking || workUnit.blocking) &&
      (!filterAllPageChecklist || workUnit.is_all_page_checklist);

    return matchesSearch && matchesFilters;
  });

  // Handle checkbox toggle for work units
  const handleWorkUnitToggle = (workUnitId) => {
    const updatedWorkUnits = form.work_units.includes(workUnitId)
      ? form.work_units.filter((id) => id !== workUnitId)
      : [...form.work_units, workUnitId];
    setForm({
      ...form,
      work_units: updatedWorkUnits,
    });
  };

  return (
    <Modal
      show={editAct}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-1100px"
    >
      <Modal.Header className="bg-primary text-center p-2">
        <h4 className="modal-title mx-auto text-white">Edit Act</h4>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="act">
          <Nav variant="tabs" className="justify-content-center mb-2">
            <Nav.Item>
              <Nav.Link eventKey="act">Act</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="work_units">Work Units</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="trigger-missing">
                Trigger Status if Missing
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="block-missing">
                Block Status if Missing
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="trigger">Trigger Status</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="block">Block Status</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="stage">Trigger/Block Stage</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content style={{ height: "600px" }}>
            <Tab.Pane className="overflow-hidden" eventKey="act">
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Name</span>
                </div>
                <div className="col-10">
                  <input
                    type="text"
                    placeholder="Enter Name"
                    name="act_name"
                    value={form.act_name}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-3 text-left">
                  <span className="d-inline-block text-grey">Group</span>
                </div>
                <div className="col-9">
                  <input
                    type="checkbox"
                    name="group"
                    checked={form.group}
                    onChange={handleChange}
                    className="form-check-input"
                    style={{ accentColor: "grey" }}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Page</span>
                </div>
                <div className="col-10">
                  <select
                    name="page"
                    value={form.page || ""}
                    onChange={(e) => handleIntChange(e)}
                    className="form-control"
                  >
                    <option value="">Select Page</option>
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Order</span>
                </div>
                <div className="col-10">
                  <input
                    type="number"
                    placeholder="Enter Order"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">
                    Trigger Status if not All
                  </span>
                </div>
                <div className="col-10">
                  <input
                    type="text"
                    placeholder="Search by status name"
                    value={triggerIfNotAllTerm}
                    onChange={(e) => setTriggerIfNotAllTerm(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-2"></div>
                <div className="col-10">
                  <div
                    style={{
                      maxHeight: "350px",
                      minHeight: "35px",
                      overflowY: "scroll",
                      border: "1px solid #ccc",
                      padding: "10px",
                      display: "grid",
                      gap: "10px",
                      height: "auto",
                    }}
                  >
                    {filteredTriggerIfNotAll?.map((item, index) => (
                      <label key={index} className="form-check-label">
                        <input
                          type="checkbox"
                          name="trigger_status_if_not_all"
                          value={item.id}
                          checked={form?.trigger_status_if_not_all === item.id}
                          onChange={() => {
                            setForm((prevForm) => ({
                              ...prevForm,
                              trigger_status_if_not_all:
                                prevForm.trigger_status_if_not_all === item.id
                                  ? null
                                  : item.id,
                            }));
                          }}
                          style={{
                            marginRight: "5px",
                            accentColor: "grey",
                          }}
                        />
                        {item.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane className="overflow-hidden" eventKey="work_units">
              {/* Search Filter */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search by work unit name"
                  value={workUnitSearchTerm}
                  onChange={(e) => setWorkUnitSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Work Unit Filters */}
              <div className="row mb-3 ml-3">
                <div className="col-3">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      checked={filterFilled}
                      onChange={(e) => setFilterFilled(e.target.checked)}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    Filled
                  </label>
                </div>
                <div className="col-3">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      checked={filterAny}
                      onChange={(e) => setFilterAny(e.target.checked)}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    Any
                  </label>
                </div>
                <div className="col-3">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      checked={filterAll}
                      onChange={(e) => setFilterAll(e.target.checked)}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    All
                  </label>
                </div>
                <div className="col-3">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      checked={filterEmpty}
                      onChange={(e) => setFilterEmpty(e.target.checked)}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    Empty
                  </label>
                </div>
              </div>
              <div className="row mb-3 ml-3">
                <div className="col-3">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      checked={filterValued}
                      onChange={(e) => setFilterValued(e.target.checked)}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    Valued
                  </label>
                </div>
                <div className="col-3">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      checked={filterExtraCredit}
                      onChange={(e) => setFilterExtraCredit(e.target.checked)}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    Extra Credit
                  </label>
                </div>
                <div className="col-3">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      checked={filterBlocking}
                      onChange={(e) => setFilterBlocking(e.target.checked)}
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    Blocking
                  </label>
                </div>
                <div className="col-3">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      checked={filterAllPageChecklist}
                      onChange={(e) =>
                        setFilterAllPageChecklist(e.target.checked)
                      }
                      className="form-check-input"
                      style={{ accentColor: "grey" }}
                    />
                    All Page Checklist
                  </label>
                </div>
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
                  {filteredWorkUnits?.map((workUnit) => (
                    <div key={workUnit.id} className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="work_units"
                          value={workUnit.id}
                          className="form-check-input"
                          style={{ accentColor: "grey" }}
                          checked={form.work_units.some(
                            (id) => id === workUnit.id
                          )}
                          onChange={() => handleWorkUnitToggle(workUnit.id)}
                        />
                        {workUnit.wu_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Selected Work Units */}
              <div>
                <h5>Selected Work Units</h5>
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
                  {form.work_units?.map((workUnitId) => {
                    const workUnit = workUnits?.find(
                      (wu) => wu.id === workUnitId
                    );
                    return (
                      <div key={workUnitId} className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            name="work_units"
                            value={workUnitId}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={true}
                            onChange={() => handleWorkUnitToggle(workUnitId)}
                          />
                          {workUnit?.wu_name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane className="overflow-hidden" eventKey="trigger-missing">
              {/* Search Filter */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search by status name"
                  value={triggerMissingTerm}
                  onChange={(e) => setTriggerMissingTerm(e.target.value)}
                  className="form-control"
                />
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
                  {filteredTriggerMissingStatuses?.map((status) => (
                    <div key={status.id} className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="trigger_status_if_missing"
                          value={status.id}
                          className="form-check-input"
                          style={{ accentColor: "grey" }}
                          checked={form.trigger_status_if_missing.some(
                            (id) => id === status.id
                          )}
                          onChange={() =>
                            handleStatusToggle(
                              "trigger_status_if_missing",
                              status.id
                            )
                          }
                        />
                        {status?.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Selected Statuses */}
              <div>
                <h5>Selected Statuses</h5>
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
                  {form.trigger_status_if_missing?.map((statusId) => {
                    const status = statuses?.find((s) => s.id === statusId);
                    return (
                      <div key={statusId} className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            name="trigger_status_if_missing"
                            value={statusId}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={true}
                            onChange={() =>
                              handleStatusToggle(
                                "trigger_status_if_missing",
                                statusId
                              )
                            }
                          />
                          {status?.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane className="overflow-hidden" eventKey="block-missing">
              {/* Search Filter */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search by status name"
                  value={triggerBlockTerm}
                  onChange={(e) => setTriggerBlockTerm(e.target.value)}
                  className="form-control"
                />
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
                  {filteredTriggerBlockStatuses?.map((status) => (
                    <div key={status.id} className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="block_status_if_missing"
                          value={status.id}
                          className="form-check-input"
                          style={{ accentColor: "grey" }}
                          checked={form.block_status_if_missing.some(
                            (id) => id === status.id
                          )}
                          onChange={() =>
                            handleStatusToggle(
                              "block_status_if_missing",
                              status.id
                            )
                          }
                        />
                        {status?.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Selected Statuses */}
              <div>
                <h5>Selected Statuses</h5>
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
                  {form.block_status_if_missing?.map((statusId) => {
                    const status = statuses?.find((s) => s.id === statusId);
                    return (
                      <div key={statusId} className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            name="block_status_if_missing"
                            value={statusId}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={true}
                            onChange={() =>
                              handleStatusToggle(
                                "block_status_if_missing",
                                statusId
                              )
                            }
                          />
                          {status?.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane className="overflow-hidden" eventKey="trigger">
              {/* Search Filter */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search by status name"
                  value={triggerTerm}
                  onChange={(e) => setTriggerTerm(e.target.value)}
                  className="form-control"
                />
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
                  {filteredTriggerStatuses?.map((status) => (
                    <div key={status.id} className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="trigger_status"
                          value={status.id}
                          className="form-check-input"
                          style={{ accentColor: "grey" }}
                          checked={form.trigger_status.some(
                            (id) => id === status.id
                          )}
                          onChange={() =>
                            handleStatusToggle("trigger_status", status.id)
                          }
                        />
                        {status?.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Selected Statuses */}
              <div>
                <h5>Selected Statuses</h5>
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
                  {form.trigger_status?.map((statusId) => {
                    const status = statuses?.find((s) => s.id === statusId);
                    return (
                      <div key={statusId} className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            name="trigger_status"
                            value={statusId}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={true}
                            onChange={() =>
                              handleStatusToggle("trigger_status", statusId)
                            }
                          />
                          {status?.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane className="overflow-hidden" eventKey="block">
              {/* Search Filter */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search by status name"
                  value={blockTerm}
                  onChange={(e) => setBlockTerm(e.target.value)}
                  className="form-control"
                />
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
                  {filteredBlockStatuses?.map((status) => (
                    <div key={status.id} className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          name="block_status"
                          value={status.id}
                          className="form-check-input"
                          style={{ accentColor: "grey" }}
                          checked={form.block_status.some(
                            (id) => id === status.id
                          )}
                          onChange={() =>
                            handleStatusToggle("block_status", status.id)
                          }
                        />
                        {status?.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Selected Statuses */}
              <div>
                <h5>Selected Statuses</h5>
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
                  {form.block_status?.map((statusId) => {
                    const status = statuses?.find((s) => s.id === statusId);
                    return (
                      <div key={statusId} className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            name="block_status"
                            value={statusId}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={true}
                            onChange={() =>
                              handleStatusToggle("block_status", statusId)
                            }
                          />
                          {status?.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Tab.Pane>
            
            <Tab.Pane className="overflow-hidden" eventKey="stage">
              <div className="row align-items-start form-group">
                <div className="col-2 text-left text-grey">Trigger Stage</div>
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
                            name="trigger_stage"
                            value={stage.id}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={form.trigger_stage?.some(
                              (id) => id === stage.id
                            )}
                            onChange={() =>
                              handleStatusToggle("trigger_stage", stage.id)
                            }
                          />
                          {stage.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="row align-items-start form-group mt-3">
                <div className="col-2 text-left text-grey">Block Status</div>
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
                            name="block_stage"
                            value={stage.id}
                            className="form-check-input"
                            style={{ accentColor: "grey" }}
                            checked={form.block_stage?.some(
                              (id) => id === stage.id
                            )}
                            onChange={() =>
                              handleStatusToggle("block_stage", stage.id)
                            }
                          />
                          {stage.name}
                        </label>
                      </div>
                    ))}
                  </div>
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

export default ActPopUp;
