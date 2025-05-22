import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";

const BlockDataPopup = ({ data, showPopup, handleClose }) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const { setLitigationDashboardDataUpdated } = useContext(ClientDataContext);
  const [form, setForm] = useState({
    DefBlock: data?.DefBlock || "",
    PlaBlock: data?.PlaBlock || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (data?.litigation_id !== null) {
      try {
        const response = await axios.patch(
          `${origin}/api/litigation-page/litigation/contacts-update/${data?.litigation_id}/`,
          form,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.status === 200) {
          setLitigationDashboardDataUpdated(true);
          handleClose();
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <Modal show={showPopup} onHide={handleClose} dialogClassName="modal-dialog-centered w-600">
      <Modal.Header className="p-2 bg-primary">
        <h4 className="modal-title mx-auto text-white">Set Blocks</h4>
      </Modal.Header>

      <Modal.Body>
        <div className="row align-items-center justify-content-center mb-2">
          <span className="text-grey col-3 text-nowrap">Defendant Block: </span>
          <span className="col-9">
            <input
              type="text"
              name="DefBlock"
              value={form?.DefBlock}
              onChange={handleChange}
              className="form-control"
            />
          </span>
        </div>
        <div className="row align-items-center justify-content-center">
          <span className="text-grey col-3 text-nowrap">Plaintiff Block: </span>
          <span className="col-9">
            <input
              type="text"
              name="PlaBlock"
              value={form?.PlaBlock}
              onChange={handleChange}
              className="form-control"
            />
          </span>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          className="btn btn-secondary h-35px"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSubmit}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default BlockDataPopup;
