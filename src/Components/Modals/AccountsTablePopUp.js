import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

function AccountsTablePopUp({
  accountsPopUp,
  handleClose,
  handleDelete,
  handleSave,
  form,
}) {
  const { statesData } = useSelector((state) => state.states);
  const [firm, setFirm] = useState({
    attorneyprofile: { office_name: "" },
    main_contact: [
      {
        report_type_id: "",
        reporting_agency: "",
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
      },
    ],
    copilot_casetypes: { for_casetype: [] },
    do_copilot: false,
    pending: 0,
    referred: 0,
    complete: 0,
  });

  useEffect(() => {
    setFirm(form);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFirm((prevFirm) => {
      const newFirm = { ...prevFirm };
      if (name in newFirm.attorneyprofile) {
        newFirm.attorneyprofile[name] = value;
      } else if (name in newFirm.main_contact[0]) {
        newFirm.main_contact[0][name] = value;
      } else if (name === "do_copilot") {
        newFirm[name] = e.target.checked;
      } else {
        newFirm[name] = value;
      }
      return newFirm;
    });
  };

  const handleSaveClick = () => {
    handleSave(firm);
  };

  const handleDeleteClick = () => {
    handleDelete(firm);
  };

  return (
    <Modal
      show={accountsPopUp ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-1000p custom-insurance-dialog"
    >
      <div className="modal-content">
        <div className="modal-body">
          <div
            className="modal-header"
            style={{
              marginBottom: "20px",
              padding: 0,
            }}
          >
            <h4 className="modal-title mb-2 mx-auto">Adjuster</h4>
          </div>
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">
                <nobr>Office Name</nobr>
              </span>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                name="office_name"
                value={firm.attorneyprofile.office_name}
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
                value={firm.main_contact[0].address1}
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
                value={firm.main_contact[0].address2}
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
                  value={firm.main_contact[0].city}
                  className="form-control"
                  name="city"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 PRL15-B1">
                <select
                  name="state"
                  className="form-select form-control"
                  value={firm.main_contact[0].state}
                  onChange={handleChange}
                >
                  {statesData?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 PRL30px">
                <input
                  type="text"
                  placeholder="Zip"
                  value={firm.main_contact[0].zip}
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
                value={firm.main_contact[0].phone}
                className="form-control"
                name="phone"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-1 text-left">
              <span className="d-inline-block text-grey">Extension</span>
            </div>
            <div className="col-md-4 pl-0">
              <input
                type="number"
                placeholder="Extension"
                value={firm.main_contact[0].extension}
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
                value={firm.main_contact[0].fax}
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
                value={firm.main_contact[0].email}
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
                value={firm.main_contact[0].website}
                className="form-control"
                name="website"
                onChange={handleChange}
              />
            </div>
          </div>
          <div class="row align-items-center form-group">
            <div class="col-md-2 text-left">
              <span class="d-inline-block text-grey">Pending</span>
            </div>
            <div class="col-md-10">
              <input
                type="number"
                className="form-control"
                name="pending"
                value={firm.pending}
                onChange={handleChange}
              />
            </div>
          </div>
          <div class="row align-items-center form-group">
            <div class="col-md-2 text-left">
              <span class="d-inline-block text-grey">Referred</span>
            </div>
            <div class="col-md-10">
              <input
                type="number"
                className="form-control"
                name="referred"
                value={firm.referred}
                onChange={handleChange}
              />
            </div>
          </div>
          <div class="row align-items-center form-group">
            <div class="col-md-2 text-left">
              <span class="d-inline-block text-grey">Complete</span>
            </div>
            <div class="col-md-10">
              <input
                type="number"
                className="form-control"
                name="complete"
                value={firm.complete}
                onChange={handleChange}
              />
            </div>
          </div>
          <div class="row align-items-center form-group form-check">
            <div class="col-md-2 text-left">
              <span class="d-inline-block text-grey form-check-label">
                Copilot
              </span>
            </div>
            <div class="col-md-10">
              <input
                type="checkbox"
                className="form-check-input"
                name="do_copilot"
                checked={firm.do_copilot}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer"
        style={{border: "none"}}
        >
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
        </div>
      </div>
    </Modal>
  );
}

export default AccountsTablePopUp;
