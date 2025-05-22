import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { deleteExpertCategory, updateExpertCategory } from "../../Redux/expertCategories/expertCategoriesSlice";

function ExpertCategoryPopup({ editCategory, handleClose, categoryData }) {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const caseSummary = useSelector((state) => state.caseData?.summary);
  const [form, setForm] = useState({
    id: null,
    name: "",
    for_firm: null,
  });

  useEffect(() => {
    if (categoryData && editCategory && caseSummary){
      setForm({
        id: categoryData.id,
        name: categoryData.name,
        for_firm: null,
      });
    }
  }, [editCategory, categoryData, caseSummary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    setError(null);
    try {
      const response = await axios.delete(
        `${origin}/api/expert-category/directory/?id=${categoryData.id}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 204) {
        handleClose();
        dispatch(
          deleteExpertCategory(categoryData.id)
        );
        setForm(initialState);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const response = await axios.patch(
        `${origin}/api/expert-category/directory/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        dispatch(
          updateExpertCategory({
            id: categoryData.id,
            updatedData: response.data.data,
          })
        );
        handleClose();
        setForm(initialState);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-container">
          <span class="loader"></span>
        </div>
      </div>
    );
  }
  return (
    <Modal
      show={editCategory}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered Law-firm-direct-max-width-900px"
    >
      <Modal.Header className="bg-primary text-center p-2">
        <h4 className="modal-title mx-auto text-white">Edit Expert Specialty</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center form-group">
          <div className="col-md-2 text-left">
            <span className="d-inline-block text-grey">Specialty Name</span>
          </div>
          <div className="col-md-10">
            <input
              type="text"
              placeholder="Enter Specialty"
              value={form.name}
              className="form-control"
              name="name"
              onChange={handleChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-0">
        <button
          type="button"
          class="btn btn-secondary float-left-margin-right-auto"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          class="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}
export default ExpertCategoryPopup;
