import React, { useState, useEffect } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import axios from "axios";
import { getCaseId, getClientId } from "../../Utils/helper";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteExpert,
  updateExpertData,
} from "../../Redux/experts-table/expertsSlice";

function ExpertTablePopUp({ ExpertTablePopUp, handleClose, expert }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const { statesData } = useSelector((state) => state.states);
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("fields");
  const [expertCategories, setExpertCategories] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    extension: "",
    fax: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    if (expert && ExpertTablePopUp) {
      getExperCategories();
      setForm({
        id: expert?.id,
        title: expert?.title || "",
        first_name: expert?.first_name || "",
        last_name: expert?.last_name || "",
        address1: expert?.contactID?.address1 || "",
        address2: expert?.contactID?.address2 || "",
        city: expert?.contactID?.city || "",
        state: expert?.contactID?.state || "",
        zip: expert?.contactID?.zip || "",
        phone: expert?.contactID?.phone_number || "",
        extension: expert?.contactID?.phone_ext || "",
        fax: expert?.contactID?.fax || "",
        email: expert?.contactID?.email || "",
        website: expert?.contactID?.website || "",
        expert_categoryID: expert?.expert_categoryID?.map((item) => item.id),
      });
    }
  }, [expert, ExpertTablePopUp]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const getExperCategories = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/expert-category/directory/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      console.log(response.data.data);
      setExpertCategories(response.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleSaveClick = async () => {
    try {
      const response = await axios.patch(
        `${origin}/api/add/directory/expert/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      dispatch(
        updateExpertData({
          id: expert.id,
          updatedData: response.data.data,
        })
      );
      handleClose();
    } catch (error) {
      console.error("Error updating expert:", error.message);
      console.error("Error Response:", error.response); // Add this line to get more details about the error
    }
  };

  const handleDeleteButton = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/add/directory/expert/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: expert.id,
          },
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 204) {
        dispatch(deleteExpert(expert.id));
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
  };

  const handleExpertCategoryChange = (e) => {
    const id = parseInt(e.target.value);
    if (e.target.checked) {
      setForm((prevForm) => ({
        ...prevForm,
        expert_categoryID: [...prevForm.expert_categoryID, id],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        expert_categoryID: prevForm.expert_categoryID.filter(
          (category) => category !== id
        ),
      }));
    }
  };

  return (
    <Modal
      show={ExpertTablePopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-1100px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Expert</h4>
      </Modal.Header>
      <Modal.Body style={{ height: "600px" }}>
        <Tab.Container
          activeKey={activeTab}
          onSelect={(key) => {
            setActiveTab(key);
          }}
        >
          <Nav variant="tabs" className="mb-2 justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="fields">Expert</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="specialty">Specialty</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane
              eventKey="fields"
              style={{ overflowY: "auto", overflowX: "hidden" }}
            >
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">First Name</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    value={form.first_name}
                    className="form-control"
                    name="first_name"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Last Name</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    value={form.last_name}
                    className="form-control"
                    name="last_name"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>Title</nobr>
                  </span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Title"
                    value={form.title}
                    className="form-control"
                    name="title"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Address 1</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Address 1"
                    value={form.address1}
                    className="form-control"
                    name="address1"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Address 2</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Address 2"
                    value={form.address2}
                    className="form-control"
                    name="address2"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey dispay-none-LFD "></span>
                </div>

                <div className="col-md-10 row">
                  <div className="col-md-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={form.city}
                      className="form-control"
                      name="city"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4 PRL15-B1">
                    <select
                      name="state"
                      className="form-select form-control"
                      value={form.state}
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
                  <div className="col-md-4 PRL30px">
                    <input
                      type="text"
                      placeholder="Zip"
                      value={form.zip}
                      className="form-control"
                      name="zip"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Phone</span>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Phone"
                    value={form.phone}
                    className="form-control"
                    name="phone"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 text-left">
                  <span className="d-inline-block text-grey">Ext.</span>
                </div>
                <div className="col-md-4 pl-0">
                  <input
                    type="number"
                    placeholder="Extension"
                    value={form.extension}
                    className="form-control"
                    name="extension"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Fax</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter fax"
                    value={form.fax}
                    className="form-control"
                    name="fax"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Email</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Email"
                    value={form.email}
                    className="form-control"
                    name="email"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Website</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Website"
                    value={form.website}
                    className="form-control"
                    name="website"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane
              eventKey="specialty"
              style={{ overflowY: "auto", overflowX: "hidden" }}
            >
              <div>
                <div
                  style={{
                    maxHeight: "515px",
                    overflowY: "scroll",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "10px",
                    height: "auto",
                  }}
                >
                  {expertCategories?.length > 0 ? (
                    expertCategories.map((category, index) => (
                      <div key={index} className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            value={category.id}
                            style={{ accentColor: "grey" }}
                            onChange={handleExpertCategoryChange}
                            checked={form.expert_categoryID?.includes(
                              category.id
                            )}
                          />
                          {category?.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="d-flex justify-content-center mt-4">No Expert Categories Available</div>
                  )}
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          className="btn btn-secondary h-35px"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDeleteButton}
        >
          Delete
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSaveClick}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ExpertTablePopUp;
