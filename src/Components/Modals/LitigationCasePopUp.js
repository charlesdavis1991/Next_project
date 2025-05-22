import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Modal, Nav, Tab } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
import { useSelector } from "react-redux";

function LitigationCasePopUp({
  caseInfo,
  showPopup,
  handleClose,
}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const token = localStorage.getItem("token");
  const clientId = getClientId();
  const currentCaseId = getCaseId();
  const [loading, setLoading] = useState(false);
  const { setLitigationDashboardDataUpdated } = useContext(ClientDataContext);
  const [state, setState] = useState(caseInfo?.state);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(
    caseInfo?.jurisdiction_obj?.id || null
  );
  const [selectedCounty, setSelectedCounty] = useState(
    caseInfo?.county?.id || null
  );
  const [searchTerm, setSearchTerm] = useState(caseInfo?.jurisdiction_obj?.name);
  const [searchCourt, setCourtSearch] = useState(caseInfo?.DirCourt?.court_name);
  const [searchDepartment, setDepartmentSearch] = useState(caseInfo?.DirDepartment?.department);
  const [counties, setCounties] = useState([]);
  const [jurisdictions, setJurisdictions] = useState([]);
  const [filteredJurisdictions, setFilteredJurisdictions] = useState([]);
  const [courts, setCourts] = useState([]);
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(
    caseInfo?.DirCourt || null
  );
  const [activeTab, setActiveTab] = useState("jurisdiction");
  const [change, setChange] = useState("");
  const [jurisdictionType, setJurisdictionType] = useState(
    caseInfo?.jurisdiction_type?.id ||
      caseInfo?.jurisdiction_obj?.jurisdiction_type?.id ||
      null
  );
  const { statesData } = useSelector((state) => state.states);
  const [form, setForm] = useState({
    for_case: currentCaseId || caseInfo?.for_case,
    for_client: clientId || for_client,
    case_short_name: caseInfo?.case_short_name || "",
    case_full_name: caseInfo?.case_full_name || "",
    case_number: caseInfo?.case_number || "",
    state: caseInfo?.state?.id || null,
    county: caseInfo?.county?.id || null,
    jurisdiction_obj: caseInfo?.jurisdiction_obj?.id || null,
    jurisdiction_type: caseInfo?.jurisdiction_type?.id ||
    caseInfo?.jurisdiction_obj?.jurisdiction_type?.id ||
    null,
    DirDepartment: caseInfo?.DirDepartment?.id || null,
    DirCourt: caseInfo?.DirCourt?.id || null,
    delete_sol_check: false,
    state_sol_check: false,
    court_name: caseInfo?.court_name || "",
    court_title1: caseInfo?.court_title1 || "",
    court_title2: caseInfo?.court_title2 || "",
    court_contact: {
      name: caseInfo?.court_contact?.name || "",
      address1: caseInfo?.court_contact?.address1 || "",
      address2: caseInfo?.court_contact?.address2 || "",
      phone_number: caseInfo?.court_contact?.phone_number || null,
      fax: caseInfo?.court_contact?.fax || null,
      email: caseInfo?.court_contact?.email || "",
      website: caseInfo?.court_contact?.website || "",
      city: caseInfo?.court_contact?.city || "",
      state: caseInfo?.court_contact?.state || "",
      zip: caseInfo?.court_contact?.zip || "",
    },
    department: caseInfo?.department || "",
    clerk_first_name: caseInfo?.clerk_first_name || "",
    clerk_last_name: caseInfo?.clerk_last_name || "",
    floor: caseInfo?.floor || "",
    room: caseInfo?.room || "",
    deps: caseInfo?.deps || "",
    clerk_contact: {
      name: caseInfo?.clerk_contact?.name || "",
      address1: caseInfo?.clerk_contact?.address1 || "",
      address2: caseInfo?.clerk_contact?.address2 || "",
      phone_number: caseInfo?.clerk_contact?.phone_number || "",
      fax: caseInfo?.clerk_contact?.fax || "",
      email: caseInfo?.clerk_contact?.email || "",
      website: caseInfo?.clerk_contact?.website || "",
      city: caseInfo?.clerk_contact?.city || "",
      state: caseInfo?.clerk_contact?.state || "",
      zip: caseInfo?.clerk_contact?.zip || "",
    },
  });

  // Fetch counties when state changes
  const getCounties = async () => {
    if (state?.id) {
      try {
        const response = await axios.get(
          `${origin}/api/litigation-page/County/?in_state=${state.id}`,
          {
            headers: { Authorization: token },
          }
        );
        setCounties(response.data);
      } catch (error) {
        console.error("Failed to fetch counties data:", error);
      }
    }
  };

  const getJurisdictions = async () => {
    try {
      setLoading(true);
      const stateAbr = state?.StateAbr || null;
      const response = await axios.get(
        `${origin}/api/get/jurisdiction/directory/?state=${stateAbr}&county=${selectedCounty}&type=${jurisdictionType}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setJurisdictions(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getCourts = async () => {
    const stateAbr = state?.StateAbr || "";
    try {
      setLoading(true);
      const response = await axios.get(
        `${origin}/api/get/court/directory/?jurisdiction=${selectedJurisdiction}&state=${stateAbr}&county=${selectedCounty}&type=${jurisdictionType}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setCourts(response.data.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const getDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${origin}/api/add/department/directory/${clientId}/${currentCaseId}/?court=${selectedCourt?.id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setDepartments(response.data.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCounties();
  }, [state]);

  useEffect(() => {
    getJurisdictions();
  }, [state, selectedCounty, jurisdictionType]);

  useEffect(() => {
    getCourts();
  }, [selectedCounty, state, selectedJurisdiction, jurisdictionType]);

  useEffect(() => {
    if (selectedCourt?.id) {
      getDepartments();
    }
  }, [selectedCourt]);

  const handleCheckboxChange = (name) => {
    setForm((prevForm) => ({
      ...prevForm,
      delete_sol_check:
        name === "delete_sol_check" ? !prevForm.delete_sol_check : false,
      state_sol_check:
        name === "state_sol_check" ? !prevForm.state_sol_check : false,
    }));
  };

  const handleJurisdictionTypeChange = (typeId) => {
    setForm((prevForm) => ({
      ...prevForm,
      jurisdiction_type: typeId,
      jurisdiction_obj: null,
      DirCourt: null,
      DirDepartment: null,
      court_name: "",
      court_title1: "",
      court_title2: "",
      court_contact: {
        name: "",
        address1: "",
        address2: "",
        phone_number: "",
        fax: "",
        email: "",
        website: "",
        city: "",
        state: "",
        zip: "",
      },
      department: "",
      clerk_first_name: "",
      clerk_last_name: "",
      floor: "",
      room: "",
      deps: "",
      clerk_contact: {
        name: "",
        address1: "",
        address2: "",
        phone_number: "",
        fax: "",
        email: "",
        website: "",
        city: "",
        state: "",
        zip: "",
      }
    }));
    setChange("Jurisdiction Type changed! ReSelect or Cancel");
    setJurisdictionType(typeId);
    setSelectedJurisdiction(null);
    setSelectedCourt(null);
    setSearchTerm("");
    setCourtSearch("");
    setDepartmentSearch("");
  };

  const handleStateChange = (stateId) => {
    const matchedState = stateId
      ? statesData.find((s) => s.id === parseInt(stateId))
      : null;
    setForm((prevForm) => ({
      ...prevForm,
      state: matchedState?.id || null,
      county: null,
      jurisdiction_obj: null,
      DirCourt: null,
      DirDepartment: null,
      court_name: "",
      court_title1: "",
      court_title2: "",
      court_contact: {
        name: "",
        address1: "",
        address2: "",
        phone_number: "",
        fax: "",
        email: "",
        website: "",
        city: "",
        state: "",
        zip: "",
      },
      department: "",
      clerk_first_name: "",
      clerk_last_name: "",
      floor: "",
      room: "",
      deps: "",
      clerk_contact: {
        name: "",
        address1: "",
        address2: "",
        phone_number: "",
        fax: "",
        email: "",
        website: "",
        city: "",
        state: "",
        zip: "",
      }
    }));
    setChange("State changed! ReSelect or Cancel");
    setSearchTerm("");
    setCourtSearch("");
    setDepartmentSearch("");
    setState(matchedState);
    setSelectedCounty(null);
    setSelectedCourt(null);
    setSelectedJurisdiction(null);
  };

  const handleCountyChange = (countyId) => {
    setForm((prevForm) => ({
      ...prevForm,
      county: countyId,
      jurisdiction_obj: null,
      DirCourt: null,
      DirDepartment: null,
      court_name: "",
      court_title1: "",
      court_title2: "",
      court_contact: {
        name: "",
        address1: "",
        address2: "",
        phone_number: "",
        fax: "",
        email: "",
        website: "",
        city: "",
        state: "",
        zip: "",
      },
      department: "",
      clerk_first_name: "",
      clerk_last_name: "",
      floor: "",
      room: "",
      deps: "",
      clerk_contact: {
        name: "",
        address1: "",
        address2: "",
        phone_number: "",
        fax: "",
        email: "",
        website: "",
        city: "",
        state: "",
        zip: "",
      }
    }));
    setChange("State changed! ReSelect or Cancel");
    setSearchTerm("");
    setSelectedCounty(countyId);
    setDepartmentSearch("");
    setCourtSearch("");
    setSelectedCourt(null);
    setSelectedJurisdiction(null);
  };

  const handleSelectJurisdiction = (jurisdiction) => {
    setForm((prevForm) => ({
      ...prevForm,
      jurisdiction_obj: jurisdiction.id,
      jurisdiction_type: jurisdiction?.jurisdiction_type?.id,
      DirCourt: null,
      DirDepartment: null,
      court_name: "",
      court_title1: "",
      court_title2: "",
      department: "",
      clerk_first_name: "",
      clerk_last_name: "",
      floor: "",
      room: "",
      deps: "",
      court_contact: {
        name: "",
        address1: "",
        address2: "",
        phone_number: "",
        fax: "",
        email: "",
        website: "",
        city: "",
        state: "",
        zip: "",
      },
      clerk_contact: {
        name: "",
        address1: "",
        address2: "",
        phone_number: "",
        fax: "",
        email: "",
        website: "",
        city: "",
        state: "",
        zip: "",
      }
    }));
    setChange("");
    setSelectedJurisdiction(jurisdiction?.id);
    setSearchTerm(jurisdiction.name);
    setDepartmentSearch("");
    setCourtSearch("");
    setSelectedCourt(null);
    setFilteredJurisdictions([]);
  };

  const handleSelectCourt = (court) => {
    setForm((prevForm) => ({
      ...prevForm,
      DirCourt: court.id,
      DirDepartment: null,
      court_name: court?.court_name,
      court_title1: court?.court_title_1,
      court_title2: court?.court_title_2,
      court_contact: {
        name: court?.court_contact?.name,
        address1: court?.court_contact?.address1,
        address2: court?.court_contact?.address2,
        phone_number: court?.court_contact?.phone_number,
        fax: court?.court_contact?.fax,
        email: court?.court_contact?.email,
        website: court?.court_contact?.website,
        city: court?.court_contact?.city,
        state: court?.court_contact?.state,
        zip: court?.court_contact?.zip,
      },
      department: "",
      clerk_first_name: "",
      clerk_last_name: "",
      floor: "",
      room: "",
      deps: "",
      clerk_contact: {
        name: "",
        address1: "",
        address2: "",
        phone_number: "",
        fax: "",
        email: "",
        website: "",
        city: "",
        state: "",
        zip: "",
      }
    }));
    setCourtSearch(court.court_name);
    setSelectedCourt(court);
    setFilteredCourts([]);
  };

  const handleSelectDepartment = (department) => {
    setForm((prevForm) => ({
      ...prevForm,
      DirDepartment: department.id,
      department: department?.department,
      clerk_first_name: department?.clerk_first_name,
      clerk_last_name: department?.clerk_last_name,
      floor: department?.floor,
      room: department?.room,
      deps: department?.deps,
      clerk_contact: {
        name: department?.department_contact?.name,
        address1: department?.department_contact?.address1,
        address2: department?.department_contact?.address2,
        phone_number: department?.department_contact?.phone_number,
        fax: department?.department_contact?.fax,
        email: department?.department_contact?.email,
        website: department?.department_contact?.website,
        city: department?.department_contact?.city,
        state: department?.department_contact?.state,
        zip: department?.department_contact?.zip,
      }
    }));
    setDepartmentSearch(department.department);
    setFilteredDepartments([]);
  };

  const handleDepartmentSearchChange = (e) => {
    const value = e.target.value;
    setDepartmentSearch(value);

    if (!value) {
      setFilteredDepartments([]);
      return;
    }

    const filtered = departments.filter((department) =>
      department?.department?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredDepartments(filtered);
  };

  const handleCourtSearchChange = (e) => {
    const value = e.target.value;
    setCourtSearch(value);

    if (!value) {
      setFilteredCourts([]);
      return;
    }

    const filtered = courts.filter((court) =>
      court.court_name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredCourts(filtered);
  };

  const handleJurisdictionSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value) {
      if (state?.id) {
        setFilteredJurisdictions(jurisdictions);
      } else {
        setFilteredJurisdictions([]);
      }
      return;
    }

    const filtered = jurisdictions?.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(value);
      let stateMatch = false;
      let countyMatch = false;
      let jurisdictionTypeMatch = false;

      // Check jurisdiction type if not selected
      if (!form?.jurisdiction_obj?.jurisdiction_type) {
        jurisdictionTypeMatch = item.jurisdictionType
          ?.toLowerCase()
          .includes(value);
      }

      // Check state if not selected
      if (!form?.state) {
        stateMatch = item.states?.some(
          (state) =>
            state.name?.toLowerCase().includes(value) ||
            state.StateAbr?.toLowerCase().includes(value)
        );
      }

      // Check county if not selected
      if (!form?.county) {
        countyMatch = item.counties?.some((county) =>
          county.name?.toLowerCase().includes(value)
        );
      }

      const circuitMatch = item.circuits?.some((circuit) =>
        circuit.circuit_name?.toLowerCase().includes(value)
      );

      const districtMatch = item.districts?.some((district) =>
        district.name?.toLowerCase().includes(value)
      );

      return (
        nameMatch ||
        jurisdictionTypeMatch ||
        stateMatch ||
        countyMatch ||
        circuitMatch ||
        districtMatch
      );
    });

    setFilteredJurisdictions(filtered);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Check if the field is nested (contains a dot)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prevForm => ({
        ...prevForm,
        [parent]: {
          ...prevForm[parent],
          [child]: value
        }
      }));
    } else {
      // Handle top-level fields
      setForm(prevForm => ({
        ...prevForm,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (caseInfo?.litigation_id) {
      try {
        const response = await axios.patch(
          `${origin}/api/litigation-page/litigations-update/${caseInfo?.litigation_id}/`,
          form,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.status === 200) {
          setLoading(false);
          setLitigationDashboardDataUpdated(true);
          handleClose();
        }
      } catch (error) {
        console.log("elor", error);
        setLoading(false);
      }
    } else {
      try {
        const response = await axios.post(
          `${origin}/api/litigation-page/litigations-create/`,
          form,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.status === 201) {
          setLoading(false);
          setLitigationDashboardDataUpdated(true);
          handleClose();
        }
      } catch (error) {
        console.log("elor", error);
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      show={showPopup}
      onHide={handleClose}
      dialogClassName="max-width-1500px modal-dialog-centered"
    >
      <Modal.Header className="p-2 bg-primary">
        <h5 className="modal-title mx-auto text-white">Case Info</h5>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
        >
          <Nav variant="tabs" className="mb-3 justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="jurisdiction">Jurisdiction</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="court">Court</Nav.Link>
            </Nav.Item>
            {selectedCourt && (
              <Nav.Item>
                <Nav.Link eventKey="dept">Department</Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item>
              <Nav.Link eventKey="case">Case Identification</Nav.Link>
            </Nav.Item>
          </Nav>
          <div className="row" style={{ height: "400px" }}>
            <div className="col-4">
              <div className="row align-items-center">
                <div className="col-4 text-left text-grey">
                  <nobr>Jurisdiction Type</nobr>
                </div>
                <div className="col-8">{caseInfo?.jurisdiction_type?.name}</div>
              </div>

              <div className="row align-items-center">
                <div className="col-4 text-left text-grey">State</div>
                <div className="col-8">{caseInfo?.state?.name}</div>
              </div>

              <div className="row align-items-center">
                <div className="col-4 text-left text-grey">County</div>
                <div className="col-8">{caseInfo?.county?.name}</div>
              </div>
              <div className="row align-items-center">
                <div className="col-4 text-left text-grey">Department</div>
                <div className="col-8">{caseInfo?.department}</div>
              </div>
              <div className="row align-items-center">
                <div className="col-4 text-left text-grey">Address</div>
                <div className="col-8">{/* Address */}</div>
              </div>
              <div className="row align-items-center">
                <div className="col-4 text-left text-grey">Case#</div>
                <div className="col-8">{caseInfo?.case_number}</div>
              </div>
              <div className="row align-items-center">
                <div className="col-4 text-left text-grey">
                  <nobr>Short Title</nobr>
                </div>
                <div className="col-8">{caseInfo?.case_short_name}</div>
              </div>
              <div className="row align-items-center">
                <div className="col-4 text-left text-grey">
                  <nobr>Long Title</nobr>
                </div>
                <div className="col-8">{caseInfo?.case_full_name}</div>
              </div>
            </div>
            <Tab.Content className="col-8" style={{ borderLeft: "1px solid" }}>
              <Tab.Pane eventKey="jurisdiction" className="overflow-hidden">
                <div className="text-center mb-2">
                  Select Jurisdiction Type, State and County to Screen the List
                  of Available Jurisdictions. A List of Jurisdictions Will
                  Appear After State is Selected.
                </div>
                <div className="row align-items-center form-group">
                  <div className="col-4">
                    <select
                      className="form-control"
                      value={form?.jurisdiction_type}
                      onChange={(e) =>
                        handleJurisdictionTypeChange(e.target.value)
                      }
                    >
                      <option value={null}>Type: Both</option>
                      <option value="1">Type: Federal</option>
                      <option value="2">Type: State</option>
                    </select>
                  </div>

                  <div className="col-4">
                    <select
                      className="form-control"
                      value={form?.state}
                      onChange={(e) => handleStateChange(e.target.value)}
                    >
                      <option value={null}>Select State</option>
                      {statesData?.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-4">
                    <select
                      className="form-control"
                      value={form?.county}
                      onChange={(e) => handleCountyChange(e.target.value)}
                    >
                      <option value={null}>Select County</option>
                      {counties?.map((county) => (
                        <option key={county.id} value={county.id}>
                          {county.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pb-2">
                  <input
                    type="text"
                    style={{
                      flex: 1,
                    }}
                    className="form-control"
                    placeholder="Search for Jurisdiction"
                    value={searchTerm}
                    onChange={handleJurisdictionSearchChange}
                  />
                </div>
                {change && <div className="text-red">{change}</div>}
                {filteredJurisdictions?.length > 0 && (
                  <ul
                    className="list-group position-absolute bg-white overflow-scroll"
                    style={{ zIndex: 1, width: "96%" }}
                  >
                    {filteredJurisdictions?.map((jurisdiction) => {
                      // Construct a display name using available fields
                      const displayName = [
                        jurisdiction.name ? `Name: ${jurisdiction.name}` : "",
                        jurisdiction?.jurisdiction_type
                          ? `Type: ${jurisdiction.jurisdiction_type.name}`
                          : "",

                        jurisdiction.circuits?.length > 0
                          ? `Circuits: ${jurisdiction.circuits?.map((circuit) => circuit.circuit_name).join(" | ")}`
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" - ");

                      const truncatedDisplayName =
                        displayName.length > 180
                          ? `${displayName.slice(0, 180)}...`
                          : displayName;

                      return (
                        <li
                          key={jurisdiction.id}
                          className="list-group-item"
                          onClick={() => {
                            handleSelectJurisdiction(jurisdiction);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {truncatedDisplayName || "Unnamed Jurisdiction"}{" "}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="court" className="overflow-hidden">
                <div className="mb-2">
                  <input
                    type="text"
                    style={{
                      flex: 1,
                    }}
                    className="form-control"
                    placeholder="Search for Court"
                    value={searchCourt}
                    onChange={handleCourtSearchChange}
                  />
                </div>
                {filteredCourts?.length > 0 && (
                  <ul
                    className="list-group position-absolute bg-white overflow-scroll"
                    style={{ zIndex: "1", width: "96%" }}
                  >
                    {filteredCourts?.map((court) => (
                      <li
                        key={court.id}
                        className="list-group-item"
                        onClick={() => {
                          handleSelectCourt(court);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {court.court_name}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="row align-items-center form-group">
                  <div className="col-2 text-left">
                    <span className="d-inline-block text-grey">
                      <nobr>Court Name</nobr>
                    </span>
                  </div>
                  <div className="col-10">
                    <input
                      type="text"
                      placeholder="Court Name"
                      value={form?.court_name}
                      className="form-control bg-white"
                      name="court_name"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row align-items-center form-group">
                  <div className="col-2 text-left">
                    <span className="d-inline-block text-grey">
                      Court Title
                    </span>
                  </div>
                  <div className="col-10 d-flex p-0">
                    <span className="col-6">
                      <input
                        type="text"
                        placeholder="Title 1"
                        value={form?.court_title1}
                        className="form-control bg-white"
                        name="court_title1"
                        onChange={handleChange}
                      />
                    </span>
                    <span className="col-6">
                      <input
                        type="text"
                        placeholder="Title 2"
                        value={form?.court_title2}
                        className="form-control bg-white"
                        name="court_title2"
                        onChange={handleChange}
                      />
                    </span>
                  </div>
                </div>
                <div className="row align-items-center form-group">
                  <div className="col-2 text-left">
                    <span className="d-inline-block text-grey">Address</span>
                  </div>
                  <div className="col-10 d-flex p-0">
                    <span className="col-6">
                      <input
                        type="text"
                        placeholder="Address 1"
                        value={form?.court_contact?.address1}
                        className="form-control bg-white"
                        name="court_contact.address1"
                        onChange={handleChange}
                      />
                    </span>
                    <span className="col-6">
                      <input
                        type="text"
                        placeholder="Address 2"
                        value={form?.court_contact?.address1}
                        className="form-control bg-white"
                        name="court_contact.address2"
                        onChange={handleChange}
                      />
                    </span>
                  </div>
                </div>
                <div className="row align-items-center form-group">
                  <div className="col-2">{/* just for the col-2 space */}</div>
                  <div className="col-10 d-flex p-0">
                    <div className="col-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={form?.court_contact?.city}
                        className="form-control"
                        name="court_contact.city"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-4">
                      <select
                        name="court_contact.state"
                        className="form-select form-control"
                        value={form?.court_contact?.state}
                        onChange={handleChange}
                      >
                        <option value="">Select State</option>
                        {statesData?.map((item) => (
                          <option key={item.id} value={item.StateAbr}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-4">
                      <input
                        type="text"
                        placeholder="Zip"
                        value={form?.court_contact?.zip}
                        className="form-control"
                        name="court_contact.zip"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row align-items-center form-group">
                  <div className="col-2 text-left">
                    <span className="d-inline-block text-grey">
                      Phone & Fax
                    </span>
                  </div>
                  <div className="col-10 d-flex p-0">
                    <span className="col-6">
                      <input
                        type="text"
                        placeholder="Phone"
                        value={form?.court_contact?.phone_number}
                        className="form-control bg-white"
                        name="court_contact.phone_number"
                        onChange={handleChange}
                      />
                    </span>
                    <span className="col-6">
                      <input
                        type="text"
                        placeholder="Fax"
                        value={form?.court_contact?.fax}
                        className="form-control bg-white"
                        name="court_contact.fax"
                        onChange={handleChange}
                      />
                    </span>
                  </div>
                </div>
                <div className="row align-items-center form-group">
                  <div className="col-2 text-left">
                    <span className="d-inline-block text-grey text-nowrap">
                      Email & Website
                    </span>
                  </div>
                  <div className="col-10 d-flex p-0">
                    <span className="col-6">
                      <input
                        type="text"
                        placeholder="Email"
                        value={form?.court_contact?.email}
                        className="form-control bg-white"
                        name="court_contact.email"
                        onChange={handleChange}
                      />
                    </span>
                    <span className="col-6">
                      <input
                        type="text"
                        placeholder="Website"
                        value={form?.court_contact?.website}
                        className="form-control bg-white"
                        name="court_contact.website"
                        onChange={handleChange}
                      />
                    </span>
                  </div>
                </div>
                {change && <div className="text-red">{change}</div>}
              </Tab.Pane>
              <Tab.Pane eventKey="dept" className="overflow-hidden">
                <div className="mb-3">
                  <input
                    type="text"
                    style={{
                      flex: 1,
                    }}
                    className="form-control"
                    placeholder="Search for Department"
                    value={searchDepartment}
                    onChange={handleDepartmentSearchChange}
                  />
                </div>
                {filteredDepartments?.length > 0 && (
                  <ul
                    className="list-group position-absolute bg-white w-100 overflow-scroll"
                    style={{ zIndex: 1, width: "96%" }}
                  >
                    {filteredDepartments?.map((department) => (
                      <li
                        key={department.id}
                        className="list-group-item"
                        onClick={() => {
                          handleSelectDepartment(department);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {department?.department}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="row align-items-center form-group">
                  <div className="col-2 text-left">
                    <span className="d-inline-block text-grey">
                      <nobr>Clerk Name</nobr>
                    </span>
                  </div>
                  <div className="col-5">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={form?.clerk_first_name}
                      className="form-control bg-white"
                      name="clerk_first_name"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-5">
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={form?.clerk_last_name}
                      className="form-control bg-white"
                      name="clerk_last_name"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row align-items-center form-group">
                  <div className="col-2 text-left">
                    <span className="d-inline-block text-grey">
                      <nobr>Department & Floor</nobr>
                    </span>
                  </div>
                  <div className="col-5">
                    <input
                      type="text"
                      placeholder="Department"
                      value={form?.department}
                      className="form-control bg-white"
                      name="department"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-5">
                    <input
                      type="text"
                      placeholder="Floor"
                      value={form?.floor}
                      className="form-control bg-white"
                      name="floor"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row align-items-center form-group">
                  <div className="col-2 text-left">
                    <span className="d-inline-block text-grey">
                      <nobr>Room & DEPS</nobr>
                    </span>
                  </div>
                  <div className="col-5">
                    <input
                      type="text"
                      placeholder="Room"
                      value={form?.room}
                      className="form-control bg-white"
                      name="room"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-5">
                    <input
                      type="text"
                      placeholder="DEPS"
                      value={form?.deps}
                      className="form-control bg-white"
                      name="deps"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {change && <div className="text-red">{change}</div>}
              </Tab.Pane>
              <Tab.Pane eventKey="case" className="overflow-hidden">
                <div className="row align-items-center form-group">
                  <div className="col-3 text-left">
                    <span className="d-inline-block text-grey">
                      Short Case Title
                    </span>
                  </div>
                  <div className="col-9">
                    <input
                      type="text"
                      className="form-control"
                      name="litigation_case_shortname"
                      placeholder="Enter Case Name"
                      value={form?.case_short_name || ""}
                      onChange={(e) =>
                        setForm((prevForm) => ({
                          ...prevForm,
                          case_short_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="row align-items-center form-group">
                  <div className="col-3 text-left">
                    <span className="d-inline-block text-grey">
                      Long Case Title
                    </span>
                  </div>
                  <div className="col-9">
                    <input
                      type="text"
                      className="form-control"
                      name="litigation_case_shortname"
                      placeholder="Enter Case Name"
                      value={form?.case_full_name || ""}
                      onChange={(e) =>
                        setForm((prevForm) => ({
                          ...prevForm,
                          case_full_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="row align-items-center form-group">
                  <div className="col-3 text-left">
                    <span className="d-inline-block text-grey">
                      Case Number
                    </span>
                  </div>
                  <div className="col-9">
                    <input
                      type="text"
                      className="form-control"
                      name="litigation_case_shortname"
                      placeholder="Enter Case Number"
                      value={form?.case_number || ""}
                      onChange={(e) =>
                        setForm((prevForm) => ({
                          ...prevForm,
                          case_number: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="row align-items-center form-group">
                  <div className="col-3">
                    <p className="text-grey">
                      Recalculate Statute of Limitations if State is changed
                    </p>
                  </div>
                  <div className="col-9 pl-4">
                    <input
                      type="checkbox"
                      name="state_sol_check"
                      style={{ accentColor: "grey", transform: "scale(1.5)" }}
                      checked={form.state_sol_check}
                      onChange={() => handleCheckboxChange("state_sol_check")}
                    />
                  </div>
                </div>
                <div className="row align-items-center form-group">
                  <div className="col-3">
                    <p className="text-grey">
                      Delete old statute entries on case
                    </p>
                  </div>
                  <div className="col-9 pl-4">
                    <input
                      type="checkbox"
                      name="delete_sol_check"
                      style={{ accentColor: "grey", transform: "scale(1.5)" }}
                      checked={form.delete_sol_check}
                      onChange={() => handleCheckboxChange("delete_sol_check")}
                    />
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-secondary h-35px"
          data-dismiss="modal"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSubmit}
        >
          {loading ? "Submitting..." : "Save"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default LitigationCasePopUp;
