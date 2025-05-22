import React, { useState } from "react";
import api from "../../api/api";
import ButtonLoader from "../Loaders/ButtonLoader";

const UploadPhotoModalBody = (props) => {
  const [formData, setFormData] = useState({
    photo_page: "",
    date_taken: "",
    uploaded_date: "",
    upload_title: "",
    upload_description: "",
    uploaded_photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setFormData((prevData) => ({ ...prevData, uploaded_photo: files }));
  };
const [loading, setloading] = useState(false)
  const handleSubmit = async (e) => {
    setloading(true)
    e.preventDefault();
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
  
    // Ensure formData.uploaded_photo is an array
    if (formData.uploaded_photo && formData.uploaded_photo.length) {
      for (let i = 0; i < formData.uploaded_photo.length; i++) {
        const formDataToSend = new FormData();
        formDataToSend.append("photo_page", formData.photo_page);
        formDataToSend.append("date_taken", formData.date_taken);
        formDataToSend.append("uploaded_date", formData.uploaded_date);
        formDataToSend.append("upload_title", formData.upload_title);
        formDataToSend.append("upload_description", formData.upload_description);
        formDataToSend.append("uploaded_photo", formData.uploaded_photo[i]); // Append each file
  
        console.log("Sending formData for photo index:", i);
  
        try {
          const response = await api.post(`/api/photo/${props.client_id}/${props.case_id}/`, formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Photo upload response:", response.data);
        if (i === formData.uploaded_photo.length - 1) {
          const res = await api.get(`/api/photo/${props.client_id}/${props.case_id}/`);
          props.setUnsortedPhotos(res.data.unsorted_photos);
        }
          
  
          await delay(1000); // Delay to throttle requests
        } catch (error) {
          console.error("Error during the upload process:", error);
        }
      }
      setloading(false)
      props.hideModal();

    } else {
      console.error("No photos selected for upload.");
    }
  }


  return (
    <>
      <div className="modal-header text-center">
        <h5 className="modal-title mx-auto">Upload Photo</h5>
      </div>
      <div className="modal-body">
        <form id="upload_new_photo_form" onSubmit={handleSubmit}>
          <div className="row align-items-center mb-1">
            <div className="col-md-3">
              <p className="text-secondary">Select Page :</p>
            </div>
            <div className="col-md-9">
            <select
                name="photo_page"
                value={formData.photo_page}
                onChange={handleInputChange}
                id=""
                className="form-control"
              >
                <option value="">---</option>
                {props?.pages?.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row align-items-center mb-1">
            <div className="col-md-3 ">
              <p className="text-secondary">Select Image :</p>
            </div>
            <div className="col-md-9">
              <input
                type="file"
                name="uploaded_photo"
                onChange={handleFileChange}
                multiple
                style={{ border: "none" }}
              />
            </div>
          </div>
          <div className="row align-items-center mb-1 ">
            <div className="col-md-3 ">
              <p className="text-secondary">Date Taken :</p>
            </div>
            <div className="col-md-9">
              <input
                type="date"
                name="date_taken"
                placeholder="Date Taken"
                className="form-control"
                min="1000-01-01"
                max="9999-12-31"
                value={formData.date_taken}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="row align-items-center mb-1 ">
            <div className="col-md-3">
              <p className="text-secondary">Upload Date :</p>
            </div>
            <div className="col-md-9">
              <input
                type="date"
                name="uploaded_date"
                placeholder="Upload Date"
                className="form-control"
                min="1000-01-01"
                max="9999-12-31"
                value={formData.uploaded_date}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="row align-items-center mb-1 ">
            <div className="col-md-3">
              <p className="text-secondary">Title :</p>
            </div>
            <div className="col-md-9">
              <input
                type="text"
                name="upload_title"
                placeholder="Title of image"
                className="form-control"
                value={formData.upload_title}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="row align-items-center mb-1 ">
            <div className="col-md-3">
              <p className="text-secondary">Description :</p>
            </div>
            <div className="col-md-9">
              <input
                type="text"
                name="upload_description"
                placeholder="Description"
                className="form-control"
                value={formData.upload_description}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </div>
      <div className="modal-footer border-0 justify-content-between pt-0">
        <button
          type="button"
          className="btn btn-secondary"
          data-dismiss="modal"
          onClick={props.hideModal}
          style={{ height: "38px", width: "70px" }}
        >
          Cancel
        </button>
        <button
          form="upload_new_photo_form"
          type="submit"
          className="btn btn-success"
          style={{ minHeight: "38px", minWidth: "70px" }}
        >{loading?<ButtonLoader/>:"Save"}
          
        </button>
      </div>
    </>
  );
};

export default UploadPhotoModalBody;
