import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import axios from "axios";
import "../NewEditCaseProviderModal.css";
import ContactPanel from "../../../common/ContactPanel";
import CaseProviderModalForm from "./CaseProviderModalForm";
import ContactPanelForTreatment from "../../../TreatmentPage/components/ContactPanelForTreatment";

function mixColorWithWhite(hex, percentage) {
  const whitePercentage = (100 - percentage) / 100;

  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Mix each channel with white
  r = Math.floor(r + (255 - r) * whitePercentage);
  g = Math.floor(g + (255 - g) * whitePercentage);
  b = Math.floor(b + (255 - b) * whitePercentage);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const TreatmentLocation = ({
  formData,
  onChange,
  specialitie,
  generateDoc,
  setStateNewShow,
}) => {
  const origin = process.env.REACT_APP_BACKEND_URL;

  const PanelGenereateButtons = [
    {
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "p-l-6 p-r-5",
      style: { height: "25px" },
      onClick: (id, name) => {
        generateDoc(id, name);
      },
    },
  ];

  // useImperativeHandle(ref, () => ({
  //   saveData: async () => {
  //     if (!name) {
  //       alert("Required name field cannot be blank.");
  //       return;
  //     }
  //     try {
  //       const response = await axios.post(
  //         origin + "/api/treatment/edit-contact-info/",
  //         {
  //           location_id: contactId,
  //           name: name,
  //           address1: address1,
  //           address2: address2,
  //           city: city,
  //           state: state,
  //           zip: zip,
  //           phone: phoneNumber,
  //           fax: fax,
  //           email: email,
  //           website: website,
  //         }
  //       );
  //       console.log("Response data:", response?.data); // Detailed logging
  //       if (response?.data) {
  //         setContact(response?.data);
  //       }
  //       return response.data;
  //       // handleClose();
  //     } catch (error) {
  //       console.error("Error updating data:", error);
  //       // alert("Failed to update data: " + error?.message); // Providing feedback to the user
  //       throw error;
  //     }
  //   },
  // }));

  return (
    <form>
      <div className={`has-speciality-color-${specialitie?.id} row m-0`}>
        <div className="col-4 p-l-5 m-r-0" style={{ maxWidth: "265px" }}>
          <div style={{ width: "fit-content", maxWidth: "265px" }}>
            <div
              style={{
                backgroundColor: specialitie?.color,
                height: "25px",
                fontSize: "16px",
                fontWeight: "600",
                width: "255px",
                paddingLeft: "5px",
              }}
              className="text-white "
            >
              {specialitie?.name}
            </div>
            <ContactPanelForTreatment
              id={formData?.id}
              panel_name={"TREATMENT LOCATION"}
              pageName={"treatment"}
              websiteURL={formData?.website}
              className="m-b-5"
              dynamic_label={"Company Name"}
              name={formData?.name}
              address1={formData?.address1}
              address2={formData?.address2}
              email={formData?.email}
              phone_number={formData?.phone_number}
              city={formData?.city}
              state={formData?.state}
              zip_code={formData?.zip}
              fax_number={formData?.fax}
              buttonData={PanelGenereateButtons}
              genrate_doc_address="Medical Provider Location"
              specialitie={specialitie}
            />
          </div>
        </div>
        <div className="col-7" style={{ minWidth: "calc(100% - 265px)" }}>
          <CaseProviderModalForm
            formData={formData}
            onChange={onChange}
            setStateNewShow={setStateNewShow}
          />
        </div>
      </div>
    </form>
  );
};
export default TreatmentLocation;
