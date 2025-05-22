import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditVehicleLocation, updateAttachedCarContact } from "../../Redux/accident/accidentSlice";
import useIsClassPresent from "../../Hooks/useIsClassPresent";
import api from "../../api/api";
import { getCaseId, getClientId } from "../../Utils/helper";

export default function VehicleLocationModal() {
  const modalRef = React.useRef();
  const isModalOpen = useIsClassPresent(modalRef, 'show');
  const dispatch = useDispatch();

  const states = useSelector((state) => state.clientProvider?.states);
  const editVehicleLocation = useSelector(
    (state) => state.accident?.editVehicleLocation
  );

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      id: editVehicleLocation?.id || null,
      vehicle_id: editVehicleLocation?.vehicle_id || null,
      name: editVehicleLocation?.name || "",
      suffix: editVehicleLocation?.suffix || null,
      first_name: editVehicleLocation?.first_name || null,
      middle_name: editVehicleLocation?.middle_name || null,
      last_name: editVehicleLocation?.last_name || null,
      title: editVehicleLocation?.title || null,
      address1: editVehicleLocation?.address1 || null,
      address2: editVehicleLocation?.address2 || null,
      city: editVehicleLocation?.city || null,
      state: editVehicleLocation?.state || null,
      zip: editVehicleLocation?.zip || null,
      phone_number: editVehicleLocation?.phone_number || null,
      email: editVehicleLocation?.email || null,
      fax: editVehicleLocation?.fax || null,
      website: editVehicleLocation?.website || null,
      phone_ext: editVehicleLocation?.phone_ext || null,
      longitude: editVehicleLocation?.longitude || null,
      latitude: editVehicleLocation?.latitude || null,
      for_firm: editVehicleLocation?.for_firm || null,
    },
    onSubmit: (values) => {
      const { vehicle_id, id, ...data } = values;
      const filteredData = Object.keys(data).reduce((acc, key) => {
        if (data[key] !== null) {
          acc[key] = data[key];
        }
        return acc;
      }, {});
      api.put(`/api/accidents/${getClientId()}/${getCaseId()}/vehicles/${vehicle_id}/contact/`, filteredData)
      .then((response) => {
        const responseData = response.data?.data;
        const keysToUpdate = Object.keys(responseData);
        const updatedData = keysToUpdate.reduce((acc, key) => {
          acc[key] = responseData[key];
          return acc;
        }, {});
        dispatch(updateAttachedCarContact({vehicle_id, ...updatedData}));
        console.log(response);
        document.getElementById("vehicle-location-modal-close").click();
      }).catch((error) => {
        console.error(error);
        document.getElementById("vehicle-location-modal-close").click();
      });
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if(!isModalOpen){
      dispatch(setEditVehicleLocation({
        id: null,
        vehicle_id: null,
        name: "",
        suffix: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        title: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        phone_number: "",
        email: "",
        fax: "",
        website: "",
        phone_ext: "",
        longitude: null,
        latitude: null,
        for_firm: null,
      }));
    }
  }, [isModalOpen]);

  return (
    <div
      className="modal has-mobile-modal generic-popup fade bd-example-modal-lg zoom-in"
      id="vehicle-location-modal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="vehicle-location-modal"
      aria-hidden="true"
      ref={modalRef}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-1"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header text-center">
            <h5 className="modal-title mx-auto">Vehicle Location</h5>
          </div>
          <div className="modal-body">
            <form
              id="vehicle_contacts_form"
              // action="{% url 'bp-edit_vehicle' client.id case.id %}"
              // method="post"
              onSubmit={handleSubmit}
            >
              <input
                type="hidden"
                name="vehicle_id"
                value={editVehicleLocation?.vehicle_id}
              />
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    {/* Name of */}Location
                  </span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Location Name"
                    className="form-control"
                    name="name"
                    value={values.name}
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
                    className="form-control"
                    name="address1"
                    value={values.address1}
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
                    placeholder="Enter Address 2"
                    className="form-control"
                    name="address2"
                    value={values.address2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center form-group CC-CSZ-1">
                <div className="col-md-4 mb-3 mb-md-0">
                  <input
                    type="text"
                    placeholder="Enter City"
                    className="form-control"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <select
                    name="state"
                    id=""
                    className="form-select form-control"
                    value={values.state}
                    onChange={handleChange}
                  >
                    {states?.map((state) => (
                      <option
                        value={state.StateAbr}
                        key={state.StateAbr}
                        selected={state.StateAbr === values.state}
                      >
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Enter Zip"
                    className="form-control"
                    name="zip"
                    value={values.zip}
                    onChange={handleChange}
                  />
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
                    // onkeyup="formatPhoneNumber(this)"
                    className="form-control"
                    name="phone_number"
                    value={values.phone_number}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 text-left">
                  <span className="d-inline-block text-grey">Ext.</span>
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    placeholder="Extension"
                    className="form-control"
                    name="phone_ext"
                    value={values.phone_ext}
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
                    className="form-control"
                    name="fax"
                    value={values.fax}
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
                    className="form-control"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
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
              id="vehicle-location-modal-close"
            >
              Cancel
            </button>
            <button
              form="vehicle_contacts_form"
              type="submit"
              className="btn btn-success"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
