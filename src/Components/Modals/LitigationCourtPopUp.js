import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
import { useSelector } from "react-redux";

function LitigationCourtPopUp({ showPopup, CourtData, handleClose}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [courts, setCourts] = useState([]);
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [searchCourt, setCourtSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noCourts, setNoCourts] = useState(false);
  const litigationID = CourtData?.litigation_id || null;
  const { setLitigationDashboardDataUpdated } = useContext(ClientDataContext);
  const [form, setForm] = useState({
    court_id: CourtData?.data?.id || null,
    court_contact: {
      name: CourtData?.court_contact?.name || "",
      address1: CourtData?.court_contact?.address1 || "",
      address2: CourtData?.court_contact?.address2 || "",
      phone_number: CourtData?.court_contact?.phone_number || null,
      fax: CourtData?.court_contact?.fax || null,
      email: CourtData?.court_contact?.email || "",
      website: CourtData?.court_contact?.website || "",
      city: CourtData?.court_contact?.city || "",
      state: CourtData?.court_contact?.state || "",
      zip: CourtData?.court_contact?.zip || "",
    },
    court_title1: CourtData?.court_title1 || "",
    court_title2: CourtData?.court_title2 || "",
    court_name: CourtData?.court_name || "",
  });
  const { statesData } = useSelector((state) => state.states);

  const getCourts = async () => {
    const stateAbr = CourtData?.state?.StateAbr || null;
    const county = CourtData?.county?.name || null;
    const jurisdictionType = CourtData?.jurisdiction_type?.id || null;
    const jurisdiction = CourtData?.jurisdiction_obj?.id || null;
    try {
      setLoading(true);
      const response = await axios.get(
        `${origin}/api/get/court/directory/?jurisdiction=${jurisdiction}&state=${stateAbr}&county=${county}&type=${jurisdictionType}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (
        Array.isArray(response.data.data) &&
        response.data.data.length === 0
      ) {
        setNoCourts(true);
      } else {
        setCourts(response.data.data);
        setNoCourts(false);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (showPopup) {
      getCourts();
    }
  }, [CourtData, showPopup]);

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

  const handleSelectCourt = (court) => {
    setForm((prevForm) => ({
      ...prevForm,
      court_id: court.id,
      court_contact: {
        name: court?.court_name,
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
      court_title1: court?.court_title_1,
      court_title2: court?.court_title_2,
      court_name: court?.court_name,
    }));

    setCourtSearch(court?.court_name);
    setFilteredCourts([]);
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
    if (CourtData?.litigation_id) {
      try {
        const response = await axios.patch(
          `${origin}/api/litigation-page/litigation/contacts-update/${CourtData?.litigation_id}/`,
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
        console.log("error", error);
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      show={showPopup}
      onHide={handleClose}
      dialogClassName="modal-dialog-2 modal-dialog-centered"
    >
      <Modal.Header className="p-2 bg-primary">
        <h5 className="modal-title mx-auto text-white">Court Info</h5>
      </Modal.Header>
      {litigationID ? (
        <>
          <Modal.Body className="min-h-400">
            {noCourts && (
              <div className="mb-2 text-red">
                No Court for current State, County and Jurisdiction.
              </div>
            )}
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
                {filteredCourts.map((court) => (
                  <li
                    key={court.id}
                    className="list-group-item"
                    onClick={() => {
                      handleSelectCourt(court);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {court?.court_name}
                  </li>
                ))}
              </ul>
            )}
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Court Name</nobr>
                </span>
              </div>
              <div className="col-md-10">
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
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Court Title</span>
              </div>
              <div className="col-md-10 d-flex p-0">
                <span className="col-md-6">
                  <input
                    type="text"
                    placeholder="Title 1"
                    value={form?.court_title1}
                    className="form-control bg-white"
                    name="court_title1"
                    onChange={handleChange}
                  />
                </span>
                <span className="col-md-6">
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
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Address</span>
              </div>
              <div className="col-md-10 d-flex p-0">
                <span className="col-md-6">
                  <input
                    type="text"
                    placeholder="Address 1"
                    value={
                      form?.court_contact?.address1 &&
                      form.court_contact.address1 !== "nan"
                        ? form.court_contact.address1
                        : ""
                    }
                    className="form-control bg-white"
                    name="court_contact.address1"
                    onChange={handleChange}
                  />
                </span>
                <span className="col-md-6">
                  <input
                    type="text"
                    placeholder="Address 2"
                    value={
                      form?.court_contact?.address2 &&
                      form.court_contact.address2 !== "nan"
                        ? form.court_contact.address2
                        : ""
                    }
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
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Phone & Fax</span>
              </div>
              <div className="col-md-10 d-flex p-0">
                <span className="col-md-6">
                  <input
                    type="text"
                    placeholder="Phone"
                    value={
                      form?.court_contact?.phone_number &&
                      form.court_contact.phone_number !== "nan"
                        ? form.court_contact.phone_number
                        : ""
                    }
                    className="form-control bg-white"
                    name="court_contact.phone_number"
                    onChange={handleChange}
                  />
                </span>
                <span className="col-md-6">
                  <input
                    type="text"
                    placeholder="Fax"
                    value={
                      form?.court_contact?.fax &&
                      form.court_contact.fax !== "nan"
                        ? form.court_contact.fax
                        : ""
                    }
                    className="form-control bg-white"
                    name="court_contact.fax"
                    onChange={handleChange}
                  />
                </span>
              </div>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey text-nowrap">
                  Email & Website
                </span>
              </div>
              <div className="col-md-10 d-flex p-0">
                <span className="col-md-6">
                  <input
                    type="text"
                    placeholder="Email"
                    value={
                      form?.court_contact?.email &&
                      form.court_contact.email !== "nan"
                        ? form.court_contact.email
                        : ""
                    }
                    className="form-control bg-white"
                    name="court_contact.email"
                    onChange={handleChange}
                  />
                </span>
                <span className="col-md-6">
                  <input
                    type="text"
                    placeholder="Website"
                    value={
                      form?.court_contact?.website &&
                      form.court_contact.website !== "nan"
                        ? form.court_contact.website
                        : ""
                    }
                    className="form-control bg-white"
                    name="court_contact.website"
                    onChange={handleChange}
                  />
                </span>
              </div>
            </div>
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
        </>
      ) : (
        <>
          <Modal.Body className="min-h-400 d-flex justify-content-center align-items-center">
            <div className="text-red mb-4">Create a Litigation First</div>
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
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}

export default LitigationCourtPopUp;
