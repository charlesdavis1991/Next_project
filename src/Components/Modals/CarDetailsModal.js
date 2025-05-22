import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useIsClassPresent from "../../Hooks/useIsClassPresent";
import {
  setCarInfo,
  updateAttachedCarInfo,
} from "../../Redux/accident/accidentSlice";
import api from "../../api/api";
import { getCaseId, getClientId } from "../../Utils/helper";

export default function CarDetailsModal() {
  const modalRef = React.useRef();
  const isModalOpen = useIsClassPresent(modalRef, "show");
  const dispatch = useDispatch();

  const carInfo = useSelector((state) => state.accident?.carInfo);
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      make: carInfo?.make || null,
      model: carInfo?.model || null,
      year: carInfo?.year || null,
      mileage: carInfo?.mileage || null,
      color: carInfo?.color || null,
      value: carInfo?.value || null,
    },
    onSubmit: (values) => {
      const filteredData = Object.keys(values).reduce((acc, key) => {
        if (values[key] !== null) {
          acc[key] = values[key];
        }
        return acc;
      }, {});
      const vehicle_id = carInfo?.id;
      api
        .put(
          `/api/accidents/${getClientId()}/${getCaseId()}/vehicles/${vehicle_id}/info/`,
          filteredData
        )
        .then((response) => {
          const responseData = response.data?.data;
          const keysToUpdate = Object.keys(responseData);
          const updatedData = keysToUpdate.reduce((acc, key) => {
            acc[key] = responseData[key];
            return acc;
          }, {});
          dispatch(updateAttachedCarInfo({ vehicle_id, ...updatedData }));
          document.getElementById("vehicle-description-modal-close").click();
        })
        .catch((error) => {
          console.log(error);
          document.getElementById("vehicle-description-modal-close").click();
        });
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!isModalOpen) {
      dispatch(
        setCarInfo({
          vehicle_id: null,
          make: "",
          model: "",
          year: "",
          mileage: "",
          color: "",
          value: "",
        })
      );
    }
  }, [isModalOpen]);

  return (
    <div
      className="modal has-mobile-modal generic-popup fade bd-example-modal-lg zoom-in"
      id="defendant-car-modal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref={modalRef}
    >
      <div
        className="modal-dialog modal-dialog-centered car-accident-max-width-600px"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header text-center">
            <h5 className="modal-title mx-auto">Defendant Car Details</h5>
          </div>
          <div className="modal-body">
            <form
              id="vehicle_info1_form"
              // action="{% url 'bp-edit_vehicle' client.id case.id %}"
              // method="post"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="vehicle_id" defaultValue="" />
              <div className="row align-items-center mb-1">
                <div className="col-md-2 ">
                  <p className="text-secondary">
                    <nobr>Make :</nobr>
                  </p>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    name="make"
                    placeholder="Enter car make"
                    className="form-control"
                    value={values.make}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-2">
                  <p className="text-secondary">
                    <nobr>Model :</nobr>
                  </p>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    name="model"
                    placeholder="Enter car model"
                    className="form-control"
                    value={values.model}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-2">
                  <p className="text-secondary">
                    <nobr>Year :</nobr>
                  </p>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    name="year"
                    placeholder="Enter car year"
                    className="form-control"
                    value={values.year}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-2">
                  <p className="text-secondary">
                    <nobr>Mileage :</nobr>
                  </p>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    name="mileage"
                    placeholder="Enter mileage"
                    className="form-control"
                    value={values.mileage}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-2">
                  <p className="text-secondary">
                    <nobr>Color :</nobr>
                  </p>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    name="color"
                    placeholder="Enter car color"
                    className="form-control"
                    value={values.color}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-2">
                  <p className="text-secondary">
                    <nobr>Value :</nobr>
                  </p>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    name="value"
                    placeholder="Enter car value"
                    className="form-control"
                    value={values.value}
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
              id="vehicle-description-modal-close"
            >
              Cancel
            </button>
            <button
              form="vehicle_info1_form"
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
