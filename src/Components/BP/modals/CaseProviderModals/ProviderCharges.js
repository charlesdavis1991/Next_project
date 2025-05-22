import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Modal, Button } from "react-bootstrap";
import Avatar from "../../../../assets/images/avatar.png";
import axios from "axios";
import { getCaseId, getClientId, getToken } from "../../../../Utils/helper";
import "../NewEditCaseProviderModal.css";
import { use } from "react";

function mixColorWithWhite(hex, percentage) {
  const whitePercentage = (100 - percentage) / 100;

  let r = parseInt(hex?.slice(1, 3), 16);
  let g = parseInt(hex?.slice(3, 5), 16);
  let b = parseInt(hex?.slice(5, 7), 16);

  // Mix each channel with white
  r = Math.floor(r + (255 - r) * whitePercentage);
  g = Math.floor(g + (255 - g) * whitePercentage);
  b = Math.floor(b + (255 - b) * whitePercentage);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const ProviderCharges = ({
  caseProviderId,
  specialitie,
  contact,
  formData,
  onChange,
  firmName,
}) => {
  // Hasnat

  const origin = process.env.REACT_APP_BACKEND_URL;
  // const caseID = parseInt(localStorage.getItem("case_id"));
  // const clientID = parseInt(localStorage.getItem("client_id"));
  // const token = localStorage.getItem("token");
  // const [providerAmount, setProviderAmount] = useState("");
  // const [providerInsPaid, setProviderInsPaid] = useState("");
  // const [providerWriteOff, setProviderWriteOff] = useState("");
  // const [providerMedPay, setProviderMedPay] = useState("");
  // const [providerReduction, setProviderReduction] = useState("");
  // const [providerPatientPaid, setProviderPatientPaid] = useState("");
  // const [providerFinalAmount, setProviderFinalAmount] = useState("");
  // const [providerLiens, setProviderLiens] = useState("");
  // const [firmName, setFirmName] = useState();

  // // console.log(firmName.attorneyprofile.office_name);

  // useEffect(() => {
  //   async function fetchFirmName() {
  //     const response = await axios.get(
  //       `${origin}/api/cases/${clientID}/${caseID}/summary/`,
  //       { headers: { Authorization: token } }
  //     );
  //     console.log(response?.data);
  //     setFirmName(response?.data);
  //   }

  //   fetchFirmName();
  // }, []);

  // useEffect(() => {
  //   console.log("caseProviderId has been updated:", caseProviderId);
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${origin}/api/treatment/medical-provider-charges/${caseProviderId}/`
  //       );
  //       const data = response.data;
  //       console.log("charges:", data);
  //       console.log("Type of providerAmount:", typeof data?.providerAmount);
  //       setProviderAmount(parseFloat(data?.providerAmount).toFixed(2));
  //       setProviderInsPaid(parseFloat(data?.providerInsPaid).toFixed(2));
  //       setProviderWriteOff(parseFloat(data?.providerWriteOff).toFixed(2));
  //       setProviderMedPay(parseFloat(data?.providerMedPay).toFixed(2));
  //       setProviderReduction(parseFloat(data?.providerReduction).toFixed(2));
  //       setProviderPatientPaid(parseFloat(data?.providerPatientPaid).toFixed(2));
  //       setProviderFinalAmount(parseFloat(data?.providerFinalAmount).toFixed(2));
  //       setProviderLiens(parseFloat(data?.providerLiens).toFixed(2));
  //     } catch (error) {
  //       console.error("Error fetching data", error);
  //     }
  //   };

  //   fetchData();
  // }, [caseProviderId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${origin}/api/treatment/medical-provider-charges/${caseProviderId}/`
        );
        const data = response.data;

        // Update parent state through onChange
        onChange({
          providerAmount: parseFloat(data?.providerAmount).toFixed(2),
          providerInsPaid: parseFloat(data?.providerInsPaid).toFixed(2),
          providerWriteOff: parseFloat(data?.providerWriteOff).toFixed(2),
          providerMedPay: parseFloat(data?.providerMedPay).toFixed(2),
          providerReduction: parseFloat(data?.providerReduction).toFixed(2),
          providerPatientPaid: parseFloat(data?.providerPatientPaid).toFixed(2),
          providerFinalAmount: parseFloat(data?.providerFinalAmount).toFixed(2),
          providerLiens: parseFloat(data?.providerLiens).toFixed(2),
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [caseProviderId]);

  // useEffect(() => {
  //   calculateFinalAmount();
  // }, [
  //   providerAmount,
  //   providerInsPaid,
  //   providerWriteOff,
  //   providerMedPay,
  //   providerReduction,
  //   providerPatientPaid,
  // ]);

  // const calculateFinalAmount = () => {
  //   const total =
  //     parseFloat(providerAmount) -
  //     parseFloat(providerInsPaid) +
  //     parseFloat(providerWriteOff) +
  //     parseFloat(providerMedPay) +
  //     parseFloat(providerReduction) +
  //     parseFloat(providerPatientPaid);
  //   setProviderLiens(total.toFixed(2));
  // };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   const floatValue = parseFloat(value).toFixed(2);

  //   switch (name) {
  //     case "provider-amount":
  //       setProviderAmount(floatValue);
  //       break;
  //     case "provider-ins_paid":
  //       setProviderInsPaid(floatValue);
  //       break;
  //     case "provider-write_off":
  //       setProviderWriteOff(floatValue);
  //       break;
  //     case "provider-medpaypaip":
  //       setProviderMedPay(floatValue);
  //       break;
  //     case "provider-reduction":
  //       setProviderReduction(floatValue);
  //       break;
  //     case "provider-patient_paid":
  //       setProviderPatientPaid(floatValue);
  //       break;
  //     default:
  //       break;
  //   }
  //   //setTimeout(calculateFinalAmount, 0);
  //   calculateFinalAmount;
  // };

  // useImperativeHandle(ref, () => ({
  //   save: async () => {
  //     const total =
  //       parseFloat(providerAmount) +
  //       parseFloat(providerInsPaid) +
  //       parseFloat(providerWriteOff) +
  //       parseFloat(providerMedPay) +
  //       parseFloat(providerReduction) +
  //       parseFloat(providerPatientPaid);
  //     const formattedTotal = total.toFixed(2);
  //     setProviderFinalAmount(formattedTotal);

  //     try {
  //       const response = await axios.post(
  //         `${origin}/api/treatment/medical-provider-charges-edit/`,
  //         {
  //           caseProviderId,
  //           "provider-amount": parseFloat(providerAmount).toFixed(2),
  //           "provider-ins_paid": parseFloat(providerInsPaid).toFixed(2),
  //           "provider-write_off": parseFloat(providerWriteOff).toFixed(2),
  //           "provider-medpaypaip": parseFloat(providerMedPay).toFixed(2),
  //           "provider-reduction": parseFloat(providerReduction).toFixed(2),
  //           "provider-patient_paid": parseFloat(providerPatientPaid).toFixed(2),
  //           provider_final_amount: formattedTotal,
  //         }
  //       );

  //       console.log("Submit response:", response.data);
  //       handleClose();
  //     } catch (error) {
  //       console.error("Error submitting data", error);
  //     }
  //   },
  // }));
  useEffect(() => {
    const total =
      parseFloat(formData?.providerInsPaid) +
      parseFloat(formData?.providerWriteOff) +
      parseFloat(formData?.providerMedPay) +
      parseFloat(formData?.providerReduction) +
      parseFloat(formData?.providerPatientPaid) -
      parseFloat(formData?.providerAmount);

    onChange({
      ...formData,
      providerLiens: total.toFixed(2),
    });
  }, [
    formData?.providerAmount,
    formData?.providerInsPaid,
    formData?.providerWriteOff,
    formData?.providerMedPay,
    formData?.providerReduction,
    formData?.providerPatientPaid,
  ]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const floatValue = parseFloat(value).toFixed(2);

    const fieldMap = {
      "provider-amount": "providerAmount",
      "provider-ins_paid": "providerInsPaid",
      "provider-write_off": "providerWriteOff",
      "provider-medpaypaip": "providerMedPay",
      "provider-reduction": "providerReduction",
      "provider-patient_paid": "providerPatientPaid",
    };

    onChange({
      ...formData,
      [fieldMap[name]]: floatValue,
    });
  };

  return (
    <div>
      <div className="row align-items-end form-group">
        <div className="col-3 text-left text-nowrap ">
          <span
            style={{
              fontWeight: "600",
              fontSize: "14px",
              color: "rgb(102, 102, 102)",
            }}
            className="d-block  height-25"
          >
            {firmName?.for_client?.created_by?.office_name}
          </span>
          <div
            style={{
              backgroundColor: mixColorWithWhite(specialitie?.color, 10),
            }}
            className="d-flex align-items-center justify-content-left align-items-center height-25"
          >
            <div
              className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
              style={{ backgroundColor: specialitie?.color }}
            >
              {specialitie?.name[0]}
            </div>

            <div
              // speciality={specialitiesList}
              className="d-flex p-l-5 p-r-5 align-items-center text-lg mb-0  height-25 align-self-center"
            >
              {contact.name}
            </div>
          </div>
        </div>
        <div className="col-9">
          <div className="row pr-3">
            <div style={{ marginRight: "5px" }}>
              <span className="d-block top-label">Original</span>

              <input
                style={{ width: "90px", backgroundColor: "#e9ecef" }}
                type="text"
                name="orignal"
                // placeholder="$999,999.99"
                value={formData?.providerAmount}
                className="Treatment-page-modal-form-control border-0 text-grey"
                readonly
              />

              {/* <div className="form-group mb-0">
                <div className="input-group-charge"> */}
              {/* <div className=" input-group-text-charge pr-1">$</div> */}

              <input
                style={{ width: "90px" }}
                type="number"
                name="provider-amount"
                // value={formData?.providerAmount}
                onChange={handleInputChange}
                // placeholder="999,999.99"
                className="Treatment-page-modal-form-control "
              />
              {/* </div>
              </div> */}
            </div>
            <div style={{ marginRight: "5px" }}>
              <span className="d-block top-label">HI Paid</span>
              {
                /* <div className="form-group">
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text border-0 text-grey">$</div>
                  </div> */
                <input
                  style={{ width: "90px", backgroundColor: "#e9ecef" }}
                  type="text"
                  name="ins_paid"
                  // placeholder="$999,999.99"
                  value={formData?.providerInsPaid}
                  className="Treatment-page-modal-form-control border-0 text-grey"
                  readonly
                />
                /* </div>
              </div> */
              }
              <div className="form-group mb-0">
                <div className="input-group-charge">
                  {/* <div className="input-group-text-charge pr-1">$</div> */}
                  <input
                    style={{ width: "90px" }}
                    type="number"
                    name="provider-ins_paid"
                    onChange={handleInputChange}
                    className="Treatment-page-modal-form-control "
                  />
                </div>
              </div>
            </div>
            <div style={{ marginRight: "5px" }}>
              <span className="d-block top-label">HI Reduction</span>

              <input
                style={{ width: "90px", backgroundColor: "#e9ecef" }}
                type="text"
                name="ins_reduction"
                // placeholder="$999,999.99"
                value={formData?.providerWriteOff}
                className="Treatment-page-modal-form-control border-0 text-grey"
                readonly
              />
              <div className="form-group  mb-0">
                <div className="input-group-charge">
                  {/* <div className="input-group-text-charge pr-1">$</div> */}

                  <input
                    style={{ width: "90px" }}
                    type="number"
                    name="provider-write_off"
                    onChange={handleInputChange}
                    className="Treatment-page-modal-form-control "
                  />
                </div>
              </div>
            </div>
            <div style={{ marginRight: "5px" }}>
              <span className="d-block top-label">MP / PIP</span>

              <input
                style={{ width: "90px", backgroundColor: "#e9ecef" }}
                type="text"
                name="medpaypaip"
                // placeholder="$999,999.99"
                value={formData?.providerMedPay}
                className="Treatment-page-modal-form-control border-0 text-grey"
                readonly
              />

              <div className="form-group  mb-0">
                <div className="input-group-charge">
                  {/* <div className="input-group-text-charge pr-1">$</div> */}
                  <input
                    style={{ width: "90px" }}
                    type="number"
                    name="provider-medpaypaip"
                    // value={formData?.providerMedPay}
                    onChange={handleInputChange}
                    className="Treatment-page-modal-form-control"
                  />
                </div>
              </div>
            </div>
            <div style={{ marginRight: "5px" }}>
              <span className="d-block top-label">Reduc.</span>
              <input
                style={{ width: "90px", backgroundColor: "#e9ecef" }}
                type="text"
                name="reduction"
                // placeholder="$999,999.99"
                value={formData?.providerReduction}
                className="Treatment-page-modal-form-control border-0 text-grey"
                readonly
              />

              <div className="form-group  mb-0">
                <div className="input-group-charge">
                  {/* <div className="input-group-text-charge pr-1">$</div> */}

                  <input
                    style={{ width: "90px" }}
                    type="number"
                    name="provider-reduction"
                    onChange={handleInputChange}
                    className="Treatment-page-modal-form-control "
                  />
                </div>
              </div>
            </div>
            <div style={{ marginRight: "5px" }}>
              <span className="d-block top-label">Client Paid</span>

              <input
                style={{ width: "90px", backgroundColor: "#e9ecef" }}
                // placeholder="$999,999.99"
                type="text"
                name="patient_paid"
                value={formData?.providerPatientPaid}
                className="Treatment-page-modal-form-control border-0 text-grey"
                readonly
              />

              <div className="form-group  mb-0">
                <div className="input-group-charge">
                  {/* <div className="input-group-text-charge pr-1">$</div> */}

                  <input
                    style={{ width: "90px" }}
                    type="number"
                    name="provider-patient_paid"
                    onChange={handleInputChange}
                    className="Treatment-page-modal-form-control "
                  />
                </div>
              </div>
            </div>
            <div style={{ marginRight: "5px" }}>
              <span className="d-block top-label">Lien</span>

              <input
                style={{ width: "90px", backgroundColor: "#e9ecef" }}
                type="text"
                name="final_amount"
                // placeholder="$999,999.99"
                value={formData?.providerLiens}
                className="Treatment-page-modal-form-control border-0 text-grey"
                readOnly
              />

              <div className="form-group  mb-0">
                <div className="input-group-charge">
                  {/* <div className="input-group-text-charge pr-1">$</div> */}

                  <input
                    style={{ width: "90px", backgroundColor: "#e9ecef" }}
                    type="number"
                    name="provider_final_amount"
                    onChange={handleInputChange}
                    className="Treatment-page-modal-form-control "
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div style={{ marginRight: "5px" }}>
              <span className="d-block top-label">Final Amount</span>

              <input
                style={{ width: "90px", backgroundColor: "#e9ecef" }}
                // placeholder="$999,999.99"
                type="text"
                name="final"
                value={formData?.providerFinalAmount}
                className="Treatment-page-modal-form-control border-0 text-grey"
                readonly
              />

              <div className="form-group  mb-0">
                <div className="input-group-charge">
                  {/* <div className="input-group-text-charge no-border pr-1">
                    $
                  </div> */}

                  <input
                    style={{ width: "90px", backgroundColor: "#e9ecef" }}
                    type="number"
                    name="final"
                    onChange={handleInputChange}
                    className="Treatment-page-modal-form-control "
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCharges;
