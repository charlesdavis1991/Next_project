import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPropertyDamage,
  updateAttachedCarInfo,
} from "../../Redux/accident/accidentSlice";
import useIsClassPresent from "../../Hooks/useIsClassPresent";
import { getCaseId, getClientId } from "../../Utils/helper";
import api from "../../api/api";

export default function VehicleDescriptionModal() {
  const modalRef = React.useRef();
  const isModalOpen = useIsClassPresent(modalRef, "show");

  const dispatch = useDispatch();
  const propertyDamage = useSelector((state) => state.accident?.propertyDamage);
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      prop_damage_estimate: propertyDamage?.prop_damage_estimate || "",
      prop_damage_final: propertyDamage?.prop_damage_final || "",
    },
    onSubmit: (values) => {
      // console.log(JSON.stringify(propertyDamage, null, 2));
      const vehicle_id = propertyDamage?.id;
      api
        .put(
          `/api/accidents/${getClientId()}/${getCaseId()}/vehicles/${vehicle_id}/damage/`,
          values
        )
        .then((response) => {
          const responseData = response.data?.data;
          const keysToUpdate = Object.keys(responseData);
          const updatedData = keysToUpdate.reduce((acc, key) => {
            if (key === "prop_damage_estimate") {
              acc["propDamEst"] = responseData[key];
            } else if (key === "prop_damage_final") {
              acc["propDamFinal"] = responseData[key];
            } else {
              acc[key] = responseData[key];
            }
            return acc;
          }, {});
          document.getElementById("vehicle-damage-modal-close").click();
          dispatch(updateAttachedCarInfo({ vehicle_id, ...updatedData }));
        })
        .catch((error) => {
          console.log(error);
          document.getElementById("vehicle-damage-modal-close").click();
        });
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!isModalOpen) {
      dispatch(
        setPropertyDamage({
          vehicle_id: null,
          prop_damage_estimate: "",
          prop_damage_final: "",
        })
      );
    }
  }, [isModalOpen]);

  return (
    <div
      className="modal has-mobile-modal generic-popup fade bd-example-modal-lg zoom-in"
      id="vehicle-damage-modal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="vehicle-damage-modal"
      aria-hidden="true"
      ref={modalRef}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered car-accident-max-width-600px"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header text-center">
            <h5 className="modal-title mx-auto">
              Vehicle Description and Notes
            </h5>
          </div>
          <div className="modal-body">
            <form
              id="vehicle_info2_form"
              // action="{% url 'bp-edit_vehicle' client.id case.id %}"
              // method="post"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="vehicle_id" defaultValue="" />
              <div className="row align-items-center mb-1">
                <div className="col-md-4 ">
                  <p className="text-secondary">
                    <nobr>Property Damage Est. :</nobr>
                  </p>
                </div>
                <div className="col-md-8">
                  <input
                    type="text"
                    name="prop_damage_estimate"
                    placeholder="Enter Property Damage Estimate"
                    className="form-control"
                    value={values.prop_damage_estimate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-4 ">
                  <p className="text-secondary">
                    <nobr>Property Damage Final :</nobr>
                  </p>
                </div>
                <div className="col-md-8">
                  <input
                    type="text"
                    name="prop_damage_final"
                    placeholder="Enter Property Damage final"
                    className="form-control"
                    value={values.prop_damage_final}
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
              id="vehicle-damage-modal-close"
            >
              Cancel
            </button>
            <button
              form="vehicle_info2_form"
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
