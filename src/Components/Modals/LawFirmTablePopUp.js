import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Nav, Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import {
  deleteLawFirm,
  updateLawFirm,
} from "../../Redux/law-firm/lawFirmSlice";

const initialState = {
  law_first_name: "",
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
  offices: [],
};

function LawFirmTablePopUp({ lawFirmPopUp, handleClose, selectedFirm }) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("firm");
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (selectedFirm) {
      setForm({
        law_first_name: selectedFirm?.office_name || "",
        address1: selectedFirm?.contact?.address1 || "",
        address2: selectedFirm?.contact?.address2 || "",
        city: selectedFirm?.contact?.city || "",
        state: selectedFirm?.contact?.state || "",
        zip: selectedFirm?.contact?.zip || "",
        phone: selectedFirm?.contact?.phone_number || "",
        extension: selectedFirm?.contact?.phone_ext || "",
        fax: selectedFirm?.contact?.fax || "",
        email: selectedFirm?.contact?.email || "",
        website: selectedFirm?.contact?.website || "",
        offices: [],
      });
    }
  }, [selectedFirm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleOfficeChange = (index, event) => {
    const { name, value } = event.target;
    const updatedEntries = [...form.offices];
    updatedEntries[index][name] = value;
    setForm((prevForm) => ({ ...prevForm, offices: updatedEntries }));
  };

  const addEntry = () => {
    setForm((prevForm) => ({
      ...prevForm,
      offices: [
        ...prevForm.offices,
        {
          address1: "",
          address2: "",
          city: "",
          state: "",
          zip: "",
          phone: "",
          extension: "",
          fax: "",
          email: "",
        },
      ],
    }));
  };

  const removeEntry = (index) => {
    const updatedEntries = form.offices.filter((_, i) => i !== index);
    setForm((prevForm) => ({ ...prevForm, offices: updatedEntries }));
  };

  const handleSaveClick = async () => {
    const updatedFirm = {
      firm_id: selectedFirm.id,
      office_name: form.law_first_name,
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      state: form.state,
      zip: form.zip,
      phone_number: form.phone,
      phone_ext: form.extension,
      fax: form.fax,
      email: form.email,
      website: form.website,
    };
    try {
      const response = await axios.patch(
        `${origin}/api/add/law/firm/${clientId}/${currentCaseId}/`,
        updatedFirm,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        dispatch(
          updateLawFirm({
            id: selectedFirm.id,
            updatedData: response.data.data,
          })
        );
        handleClose();
      }
    } catch (error) {
      console.error("Error updating insurance company:", error.message);
      console.error("Error Response:", error.response); // Add this line to get more details about the error
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/add/law/firm/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: selectedFirm.id,
          },
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status == 200) {
        dispatch(deleteLawFirm(selectedFirm.id));
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
  };

  return (
    <Modal
      show={lawFirmPopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-width-1700px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Edit Law Firm</h4>
      </Modal.Header>
      <Modal.Body>
        <nav>
          <div
            className="nav nav-tabs justify-content-center"
            id="nav-tab"
            role="tablist"
          >
            <a
              className="nav-item nav-link active tab-item"
              id="contact-link"
              data-toggle="tab"
              href="#contact-tabE"
              role="tab"
              aria-controls="contact-tab"
              aria-selected="false"
              style={{ maxWidth: "120px", marginRight: "0px" }}
            >
              Contact
            </a>
            <a
              className="nav-item nav-link tab-item"
              id="offices-link"
              data-toggle="tab"
              href="#offices-tabE"
              role="tab"
              aria-controls="offices-tab"
              aria-selected="false"
              style={{ maxWidth: "120px", marginLeft: "0px" }}
            >
              Offices
            </a>
          </div>
        </nav>
        <div className="row" style={{ height: "400px" }}>
          <div className="col-3">
            <div className="row align-items-center">
              <div className="col-md-3 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Firm Name</nobr>
                </span>
              </div>
              <div className="col-md-9">
                <span>{form.law_first_name}</span>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-md-3 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Address 1</nobr>
                </span>
              </div>
              <div className="col-md-9">
                <span>{form.address1}</span>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-md-3 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Address 2</nobr>
                </span>
              </div>
              <div className="col-md-9">
                <span>{form.address2}</span>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-md-3 text-left">
                <span className="d-inline-block text-grey"></span>
              </div>
              <div className="col-md-9">
                <span>
                  <nobr>
                    {form.city && `${form.city}`}
                    {form.state && `, ${form.state}`}
                    {form.zip && `, ${form.zip}`}
                  </nobr>
                </span>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-md-3 text-left">
                <span className="d-inline-block text-grey">Phone</span>
              </div>
              <div className="col-md-9">
                <span className="row col-12">
                  <p className="mr-1">{form.phone}</p>
                  {form.extension && (
                    <>
                      <p className="text-grey mr-1">ext</p>
                      <p>{form.extension}</p>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-md-3 text-left">
                <span className="d-inline-block text-grey">Fax</span>
              </div>
              <div className="col-md-9">
                <span>{form.fax}</span>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-md-3 text-left">
                <span className="d-inline-block text-grey">Email</span>
              </div>
              <div className="col-md-9">
                <span>{form.email}</span>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-md-3 text-left">
                <span className="d-inline-block text-grey">Website</span>
              </div>
              <div className="col-md-9">
                <span>{form.website}</span>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-md-3 text-left">
                <span className="d-inline-block text-grey">Attorneys</span>
              </div>
              <div className="col-md-9">
                <span></span>
              </div>
            </div>
          </div>
          <div
            className="tab-content mt-2 col-9"
            style={{ borderLeft: "1px solid" }}
          >
            <div
              className="tab-pane fade show active"
              id="contact-tabE"
              role="tabpanel"
              aria-labelledby="contact-link"
              style={{ overflowX: "hidden" }}
            >
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>Firm Name</nobr>
                  </span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Law Firm Name"
                    value={form.law_first_name}
                    className="form-control"
                    name="law_first_name"
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
                  <span className="d-inline-block text-grey"></span>
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
                    placeholder="Enter Fax"
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
            </div>
            <div
              className="tab-pane fade"
              id="offices-tabE"
              role="tabpanel"
              aria-labelledby="offices-link"
              style={{ overflowX: "hidden" }}
            >
              <div>
                <div className="w-100">
                  <div className="row align-items-center form-group">
                    <div className="col-md-1 text-left">
                      <span className="d-inline-block text-grey">
                        <nobr>Main Office</nobr>
                      </span>
                    </div>
                    <div className="col-md-5">
                      <input
                        type="text"
                        placeholder="Enter Address 1"
                        value={form.address1}
                        className="form-control"
                        name="address1"
                        readOnly
                      />
                    </div>
                    <div className="col-md-5">
                      <input
                        type="text"
                        placeholder="Address 2"
                        value={form.address2}
                        className="form-control"
                        name="address2"
                        readOnly
                      />
                    </div>
                    <div className="col-md-1"></div>
                  </div>

                  <div className="row align-items-center form-group">
                    <div className="col-md-1 text-left">
                      <span className="d-inline-block"></span>
                    </div>
                    <div className="col-md-10 row">
                      <div className="col-md-4">
                        <input
                          type="text"
                          placeholder="City"
                          value={form.city}
                          className="form-control"
                          name="city"
                          readOnly
                        />
                      </div>
                      <div className="col-md-4 PRL15-B1">
                        <input
                          type="text"
                          placeholder="State"
                          value={form.state?.name}
                          className="form-control"
                          name="state"
                          readOnly
                        />
                      </div>
                      <div className="col-md-4 PRL30px">
                        <input
                          type="text"
                          placeholder="Zip"
                          value={form.zip}
                          className="form-control"
                          name="zip"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-1"></div>
                  </div>

                  <div className="row align-items-center form-group">
                    <div className="col-md-1 text-left">
                      <span className="d-inline-block"></span>
                    </div>
                    <div className="col-md-10 row">
                      <div className="col-md-4">
                        <div className="row">
                          <div className="col-md-8">
                            <input
                              type="text"
                              placeholder="Enter Phone"
                              value={form.phone}
                              className="form-control"
                              name="phone"
                              readOnly
                            />
                          </div>
                          <div className="col-md-4">
                            <input
                              type="number"
                              placeholder="ext"
                              value={form.extension}
                              className="form-control"
                              name="extension"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 PRL15-B1">
                        <input
                          type="text"
                          placeholder="Enter Fax"
                          value={form.fax}
                          className="form-control"
                          name="fax"
                          readOnly
                        />
                      </div>
                      <div className="col-md-4 PRL30px">
                        <input
                          type="text"
                          placeholder="Enter Email"
                          value={form.email}
                          className="form-control"
                          name="email"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-1"></div>
                  </div>
                </div>
              </div>
              {form.offices?.map((office, index) => (
                <div className="w-100">
                  <div className="row align-items-center form-group">
                    <div className="col-md-1 text-left">
                      <span className="d-inline-block text-grey">
                        Address {index + 1}
                      </span>
                    </div>
                    <div className="col-md-5">
                      <input
                        type="text"
                        placeholder="Enter Address 1"
                        value={office.address1}
                        className="form-control"
                        name="address1"
                        onChange={handleOfficeChange}
                      />
                    </div>
                    <div className="col-md-5">
                      <input
                        type="text"
                        placeholder="Address 2"
                        value={office.address2}
                        className="form-control"
                        name="address2"
                        onChange={handleOfficeChange}
                      />
                    </div>
                    <div className="col-md-1 justify-content-center align-items-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => removeEntry(index)}
                      >
                        x
                      </button>
                    </div>
                  </div>

                  <div className="row align-items-center form-group">
                    <div className="col-md-1 text-left">
                      <span className="d-inline-block"></span>
                    </div>
                    <div className="col-md-10 row">
                      <div className="col-md-4">
                        <input
                          type="text"
                          placeholder="City"
                          value={office.city}
                          className="form-control"
                          name="city"
                          onChange={handleOfficeChange}
                        />
                      </div>
                      <div className="col-md-4 PRL15-B1">
                        <select
                          name="state"
                          className="form-select form-control"
                          value={office.state}
                          onChange={handleOfficeChange}
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
                          value={office.zip}
                          className="form-control"
                          name="zip"
                          onChange={handleOfficeChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-1"></div>
                  </div>

                  <div className="row align-items-center form-group">
                    <div className="col-md-1 text-left">
                      <span className="d-inline-block"></span>
                    </div>
                    <div className="col-md-10 row">
                      <div className="col-md-4">
                        <div className="row">
                          <div className="col-md-8">
                            <input
                              type="text"
                              placeholder="Enter Phone"
                              value={office.phone}
                              className="form-control"
                              name="phone"
                              onChange={handleOfficeChange}
                            />
                          </div>
                          <div className="col-md-4">
                            <input
                              type="number"
                              placeholder="ext"
                              value={office.extension}
                              className="form-control"
                              name="extension"
                              onChange={handleOfficeChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 PRL15-B1">
                        <input
                          type="text"
                          placeholder="Enter Fax"
                          value={office.fax}
                          className="form-control"
                          name="fax"
                          onChange={handleOfficeChange}
                        />
                      </div>
                      <div className="col-md-4 PRL30px">
                        <input
                          type="text"
                          placeholder="Enter Email"
                          value={office.email}
                          className="form-control"
                          name="email"
                          onChange={handleOfficeChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-1"></div>
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-end form-group">
                <div className="col-2">
                  <button
                    type="button"
                    className="btn btn-primary my-2"
                    onClick={addEntry}
                  >
                    <span style={{ color: "gold", paddingRight: "6px" }}>
                      +
                    </span>{" "}
                    Office
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
          onClick={handleDeleteClick}
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

export default LawFirmTablePopUp;
