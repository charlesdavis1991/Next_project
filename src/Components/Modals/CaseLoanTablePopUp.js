import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteCaseLoan, updateCaseLoan } from "../../Redux/case-loan/caseLoan";

function CaseLoanTablePopUp({ caseLoanPopup, handleClose, loanData }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const { statesData } = useSelector((state) => state.states);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
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
    if (loanData && loanData.contact) {
      setForm({
        company_name: loanData?.loan_company || "",
        address1: loanData?.contact?.address1 || "",
        address2: loanData?.contact?.address2 || "",
        city: loanData?.contact?.city || "",
        state: loanData?.contact?.state || "",
        zip: loanData?.contact?.zip || "",
        phone: loanData?.contact?.phone_number || "",
        extension: loanData?.contact?.phone_ext || "",
        fax: loanData?.contact?.fax || "",
        email: loanData?.contact?.email || "",
        website: loanData?.contact?.website || "",
      });
    }
  }, [loanData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleDeleteLoan = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/add/case/loan/${clientId}/${currentCaseId}/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
          data: {
            id: loanData.id,
          },
        }
      );
      dispatch(deleteCaseLoan(loanData.id));
      handleClose();
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
  };

  const handleSaveClick = async () => {
    try {
      const updatedLoan = {
        ...loanData,
        id: loanData.id,
        loan_company: form.company_name,
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
          `${origin}/api/add/case/loan/${clientId}/${currentCaseId}/`,
          updatedLoan,
          {
            headers: {
              Authorization: tokenBearer,
            },
          }
        );
        dispatch(
          updateCaseLoan({
            id: loanData.id,
            updatedData: response.data.data,
          })
        );
        handleClose();
      } catch (error) {
        console.error("Error updating insurance company:", error.message);
        console.error("Error Response:", error.response); // Add this line to get more details about the error
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={caseLoanPopup ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-1100px"
    >
      <Modal.Header className="bg-primary p-2">
        <h4 className="modal-title text-white mx-auto">Case Loan</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Company Name</nobr>
            </span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              placeholder="Enter Company Name"
              value={form.company_name}
              className="form-control"
              name="company_name"
              onChange={handleChange}
            />
            <input
              type="hidden"
              placeholder="Enter Company Name"
              value={form.block_name}
              className="form-control"
              name="block_name"
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
                {form.state?.length ? null : (
                  <option value="">select state</option>
                )}
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

        <div class="row align-items-center form-group">
          <div class="col-md-2 text-left">
            <span class="d-inline-block text-grey">Email</span>
          </div>
          <div class="col-md-10">
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

        <div class="row align-items-center form-group">
          <div class="col-md-2 text-left">
            <span class="d-inline-block text-grey">Website</span>
          </div>
          <div class="col-md-10">
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
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          className="btn btn-secondary h-35px"
          data-dismiss="modal"
          onClick={handleClose}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDeleteLoan}
        >
          Delete
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSaveClick}
        >
          {loading ? "Submitting..." : "Save"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default CaseLoanTablePopUp;
