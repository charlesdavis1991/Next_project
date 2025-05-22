import React, { useEffect,useState,useRef } from "react";
import { Modal, Button, Form, Row, Col} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { currencyFormat } from "../../Utils/helper";
import { getClientId } from "../../Utils/helper";
import { getCaseId } from "../../Utils/helper";
import deletePanelEntity from "../SettlementDashboard/api/deletePanelEntity";
import updatePanelApi from "../SettlementDashboard/api/updatePanelApi";

const EditFeesPopup = ({ show, handleClose, fee, currentCombination, feesCombinationList, feesPercentages, action, updateFeesState, initialOffers }) => {
  const numArray = [10, 15, 20, 25, 30, 33, 35, 40, 45, 50]
  const formik = useFormik({
    initialValues: {
      percentage: fee?.percentage || "",
      amount: fee?.amount || 0,
      draft1_checked: fee?.draft1_checked || false,
      final_checked: fee?.final_checked || false,
      note: fee?.note || "",
      proceed: ""
    },
    validationSchema: Yup.object({
      percentage: Yup.string(),
      amount: Yup.number()
        .required("Amount is required.")
        .min(0, "Amount must be positive."),
      note: Yup.string().nullable(),
      proceed: Yup.string(),
    }),
    onSubmit: async (values) => {
      let document_type = []
      if (values.final_checked) document_type.push("final")
      if (values.draft1_checked) document_type.push("draft1")
      const amountPercentage = (values.amount/selectedLabel3?.demand) * 100 || 0.00;
      const payload = {
        check: action === "ADD" ? "False" : `${fee?.id}`,
        client_id: parseInt(getClientId()),
        case_id: parseInt(getCaseId()),
        amount: `${values.amount}`,
        percentage:parseFloat(amountPercentage).toFixed(2),
        party_details:"",
        // party_details: action === "ADD" ? values.proceed : `${currentCombination?.related_party?.id},${currentCombination?.insurance?.id},${currentCombination?.type}`,
        document_type: JSON.stringify(document_type),
        note: values.note,
        offer_id:selectedLabel3?.id
      };
      console.log(payload);
      const res = await updatePanelApi(payload,"edit-fees");
      updateFeesState();
      handleClose();
    },
  });

  const handleDeleteFee = async (id, panel) => {
    const payload = {
      panel_name: panel,
      record_id: id
    }
    const res = await deletePanelEntity(payload)
    updateFeesState();
    handleClose();
  }

  useEffect(() => {
    if (fee) {
      formik.setValues({
        percentage: fee?.percentage || "",
        amount: fee?.amount || 0,
        draft1: fee?.draft1_checked || false,
        final: fee?.final_checked || false,
        note: fee?.note || "",
        proceed: ""
      });
    }
  }, [fee]);
  useEffect(() => {
      if (!show) {
          $('.modal').hide();
      }
  }, [show]);
  const handlePercentageChange = (percentage, amount) => {
    formik.setFieldValue("percentage", percentage);
    formik.setFieldValue("amount", amount);
  };

  const handleCustomChange = (customValue) => {
    const calculatedAmount = action == "ADD" ? (feesPercentages[feesPercentages.length - 1] * 2 * customValue) / 100 : (fee?.amount * customValue) / 100;
    formik.setFieldValue("amount", calculatedAmount);
  };

  const [selectedLabel1, setSelectedLabel1] = useState("Select Insurance");
  const [selectedLabel2, setSelectedLabel2] = useState("");
  const [selectedIcon1, setSelectedIcon1] = useState(null);
  const [selectedIcon2, setSelectedIcon2] = useState(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const dropdownRef1 = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
  const handleClickOutside = (event) => {
      if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
      setIsOpen1(false);
      }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
      document.removeEventListener("mousedown", handleClickOutside);
  };
  }, []);
  const handleDropdownToggle1 = () => {
      setIsOpen1((prev) => !prev);
  };

  const handleSelection1 = (e,value, label1,label2, iconClass1, iconClass2) => {
      e.stopPropagation();
      formik.setFieldValue("proceed", value);
      setSelectedLabel1(label1);
      setSelectedLabel2(label2);
      setSelectedIcon1(iconClass1);
      setSelectedIcon2(iconClass2);
      setIsOpen1(false);
  };


  const [selectedLabel3, setSelectedLabel3] = useState(null);
  const [isOpen3, setIsOpen3] = useState(false);
  const dropdownRef3 = useRef(null);
  const handleDropdownToggle3 = () => {
      console.log("open false")
      setIsOpen3((prev) => !prev);
  };

  const handleSelection3 = (e,offer) => {
      
      e.stopPropagation();
      console.log(offer);
      setSelectedLabel3(offer);
      const amount = offer?.demand ? parseFloat((offer?.demand * fee?.percentage) / 100.00).toFixed(2) : 0.00;
      formik.setFieldValue("amount",amount);
      setIsOpen3(false);
  };
  // Close dropdown when clicking outside
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (dropdownRef3.current && !dropdownRef3.current.contains(event.target)) {
              setIsOpen3(false);
          }
      };
      
  
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
      document.removeEventListener("mousedown", handleClickOutside);
  };
  }, []);

  useEffect(()=>{
    console.log(fee)
    setSelectedLabel3(fee?.offer)
  },[show])

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      dialogClassName="custom-fee-dialog justify-content-center"
    >
      <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>{action === "ADD" ? 'Add' : 'Edit'} Fee</div></div>

      <Modal.Body style={{padding:"5px"}}>
        <Form className="position-relative" onSubmit={formik.handleSubmit}>
        {/* <span className="m-b-5 d-inline-block">{fee.checkID && "Check Request has been submitted no edits can be made."}</span> */}
          {/* Party Section */}
          {action === "ADD" && (
            <Row className="m-b-5">
              <Col sm={2} className="fw-bold d-flex align-items-center text-grey">
                Proceed:
              </Col>
              <div  className="d-flex align-items-center col-sm-10">
                  <div className="dropdown-container custom-select-state-entity" ref={dropdownRef1}>
                      <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle1} style={{ padding: "0px" }}>
                          {selectedIcon1 && <i className={`ic ic-19 ${selectedIcon1} m-r-5 m-l-10`}></i>}
                          <span style={{padding:!selectedIcon1 ? "5px 10px" : ""}}>{selectedLabel1}</span>
                          {selectedIcon2 && <i className={`ic ic-19 ${selectedIcon2} m-r-5 m-l-10`}></i>}
                          <span style={{padding:!selectedIcon2 ? "5px 10px" : ""}}>{selectedLabel2}</span>
                          {isOpen1 && (
                              <ul className="dropdown-list" style={{ marginTop: "25px",top:"0px" }}>
                                  {feesCombinationList?.map((combo, index) => (
                                      <li
                                          key={index}
                                          onClick={(e) =>{ 
                                            let label1 =""
                                            if(combo.type == "defendant" ){
                                              label1 = `Defendant: ${
                                                combo?.related_party?.defendantType?.name === "Private Individual"
                                                    ? `${combo?.related_party?.first_name} ${combo?.related_party?.last_name}`
                                                    : combo?.related_party?.entity_name
                                              }`;
                                            } else{
                                              label1 = `Client: ${combo?.related_party?.first_name || ''} ${combo?.related_party?.last_name || ''}`;
                                            }
                                            const label2 = `Insurance: ${combo.insurance?.company || 'No Insurance'}`;
                                            handleSelection1(
                                              e,
                                              `${combo?.related_party?.id || ''}, ${combo?.insurance?.id || ''}, ${combo.type}`,
                                              label1,
                                              label2,
                                              combo.type === "defendant" ? "ic-defendants" : "ic-client",
                                              "ic-insurance"
                                          )}}
                                      >
                                          <i className={`ic ic-19 ${combo.type === "defendant" ? "ic-defendants" : "ic-client"} m-r-5`}></i>
                                          {combo.type === 'defendant'
                                            ? `Defendant: ${
                                                combo?.related_party?.defendantType?.name === "Private Individual"
                                                    ? `${combo?.related_party?.first_name} ${combo?.related_party?.last_name}`
                                                    : combo?.related_party?.entity_name
                                            }`
                                            : `Client: ${combo?.related_party?.first_name || ''} ${combo?.related_party?.last_name || ''}`
                                            }
                                            <i className={`ic ic-19 ic-insurance m-l-10 m-r-5`}></i> Insurance: {combo.insurance?.company || 'No Insurance'}
                                      </li>
                                  ))}
                              </ul>
                          )}
                      </div>
                  </div>
              </div>
            </Row>
          )}

{/* 
          {action === "EDIT" && <Row className="m-b-5">
            <Col sm={2} className="fw-bold text-grey">
              Party:
            </Col>
            <Col sm={5} className="fw-bold">
              {
              fee?.offer?.defendant && `Defendant: ${fee?.offer?.defendant.defendantType?.name == "Private Individual" ? 
              (fee?.offer?.defendant?.first_name + ' ' + fee?.offer?.defendant?.last_name) : fee?.offer?.defendant?.entity_name}` }
              {fee?.offer?.entity_client && `Client: ${fee?.offer?.entity_client?.first_name || ''} ${fee?.offer?.entity_client?.last_name || ''}` }
            </Col>
            <Col sm={5} className="fw-bold p-l-0">
              Insurance: {fee?.offer?.insurance?.company || 'No Insurance'}
            </Col>
          </Row>
          } */}

          {   initialOffers?.length == 0 &&
              <div className='d-flex align-items-center justify-content-center'>
                  <p className='text-uppercase font-weight-semibold' style={{color:"var(--primary) !important"}}>No Initial Offers or Demands Input</p>
              </div>
          }
          { 
          initialOffers?.length > 0 &&
              <div className={`d-flex m-t-5 m-b-5 align-items-center justify-content-center`}>
                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end fee-label">
                      Select Negotiation:
                  </span>
                  <div className="dropdown-container custom-select-state-entity w-100" ref={dropdownRef3}>
                      <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle3} style={{ padding: "0px" }}>
                          <div style={{padding:"5px"}}>
                              <div className={`${selectedLabel3 ? "color-primary" : "text-grey"} font-weight-semibold d-flex align-items-center`}>
                                          {   
                                              !selectedLabel3 && 
                                              "Select Negotiation"
                                          }
                                          {   selectedLabel3 &&
                                              <i className={`ic ic-19 ${selectedLabel3?.defendant ? "ic-defendants" : "ic-client"} m-r-5 m-l-5`}></i>
                                          }
                                          {   selectedLabel3 &&
                                              selectedLabel3?.defendant ?  selectedLabel3?.defendant?.defendantType?.name === "Private Individual" ? 
                                              `${selectedLabel3?.defendant?.first_name || ''} ${selectedLabel3?.defendant?.last_name || ''}` :
                                              `${selectedLabel3?.defendant?.entity_name || ''}` : `${ selectedLabel3?.entity_client?.first_name } ${ selectedLabel3?.entity_client?.last_name }`
                                          }
                                          &nbsp;
                                          {selectedLabel3 && "VS"}
                                          &nbsp;
                                          {   selectedLabel3 &&
                                              <i className={`ic ic-19 ${selectedLabel3?.by_defendant ? "ic-defendants" : "ic-client"} m-r-5`}></i>
                                          }
                                          {   selectedLabel3 &&
                                          
                                          selectedLabel3?.by_defendant ?  selectedLabel3?.by_defendant?.defendantType?.name === "Private Individual" ? 
                                          `${selectedLabel3?.by_defendant?.first_name || ''} ${selectedLabel3?.by_defendant?.last_name || ''}` :
                                          `${selectedLabel3?.by_defendant?.entity_name || ''}` : `${ selectedLabel3?.by_entity_client?.first_name } ${ selectedLabel3?.by_entity_client?.last_name }`
                                          }

                                          &nbsp;
                                          { selectedLabel3 && "Offer "}
                                          &nbsp; 
                                          { selectedLabel3 &&
                                              currencyFormat(selectedLabel3?.demand)
                                          }
                              </div>
                          </div>
                          {isOpen3 && (
                              <ul className="dropdown-list color-primary font-weight-600" style={{ marginTop: "25px",top:"0px" }}>
                                  {initialOffers?.map((offer, index) => (
                                      <li
                                          key={index}
                                          style={{ zIndex: 9999 }}
                                          className='dropdown-list-item'
                                          onMouseDown={(e)=>handleSelection3(e,offer?.offers_list[0])}
                                      >
                                          {   
                                              !offer?.offers_list[0] && 
                                              "Select Negotiation"
                                          }
                                          {   offer?.offers_list[0] &&
                                              <i className={`ic ic-19 ${offer?.offers_list[0]?.defendant ? "ic-defendants" : "ic-client"} m-r-5 m-l-5`}></i>
                                          }
                                          {   offer?.offers_list[0] &&
                                              offer?.offers_list[0]?.defendant ?  offer?.offers_list[0]?.defendant?.defendantType?.name === "Private Individual" ? 
                                              `${offer?.offers_list[0]?.defendant?.first_name || ''} ${offer?.offers_list[0]?.defendant?.last_name || ''}` :
                                              `${offer?.offers_list[0]?.defendant?.entity_name || ''}` : `${ offer?.offers_list[0]?.entity_client?.first_name } ${ offer?.offers_list[0]?.entity_client?.last_name }`
                                          }
                                          &nbsp;
                                          {offer?.offers_list[0] && "VS"}
                                          &nbsp;
                                          {   offer?.offers_list[0] &&
                                              <i className={`ic ic-19 ${offer?.offers_list[0]?.by_defendant ? "ic-defendants" : "ic-client"} m-r-5`}></i>
                                          }
                                          {   offer?.offers_list[0] &&
                                          
                                          offer?.offers_list[0]?.by_defendant ?  offer?.offers_list[0]?.by_defendant?.defendantType?.name === "Private Individual" ? 
                                          `${offer?.offers_list[0]?.by_defendant?.first_name || ''} ${offer?.offers_list[0]?.by_defendant?.last_name || ''}` :
                                          `${offer?.offers_list[0]?.by_defendant?.entity_name || ''}` : `${ offer?.offers_list[0]?.by_entity_client?.first_name } ${ offer?.offers_list[0]?.by_entity_client?.last_name }`
                                          }

                                          &nbsp;
                                          { offer?.offers_list[0] && "Offer "}
                                          &nbsp; 
                                          { offer?.offers_list[0] &&
                                              currencyFormat(offer?.offers_list[0]?.demand)
                                          }
                                      </li>
                                  ))}
                              </ul>
                          )}
                      </div>
                  </div>
              </div>
          }
          

          {/* Percentage Section */}
          <div className="d-flex m-t-5">
            <span className="d-inline-block white-space-nowrapping text-grey m-r-5 text-end fee-label">
                Percentage:
            </span>
            <div className="d-flex-1" style={{marginLeft:"2px"}}>
              <div>
                {numArray.map((percentage, index) => {
                  const percentageAmount = action === "EDIT" ? selectedLabel3?.demand ? (selectedLabel3?.demand * percentage) / 100 : 0.00 : 0.00;
                  // const percentageAmount = action === "EDIT" ? (fee?.amount * percentage) / 100 : feesPercentages[index]
                  return (
                    <div
                      key={percentage}
                      className="d-flex align-items-center m-b-5 radio-btn"
                    >
                      <Form.Check
                        style={{ width: "50%" }}
                        type="radio"
                        label={`${percentage}%`}
                        name="percentage"
                        className="monospace-font"
                        value={percentage}
                        onChange={() =>
                          handlePercentageChange(percentage, percentageAmount)
                        }
                        disabled={action === "ADD" && (formik.values.proceed === "" || formik.errors.proceed)}
                        checked={formik.values.percentage == percentage}
                      />
                      <span style={{ width: "50%" }} className="ms-3 monospace-font">{currencyFormat(percentageAmount)}</span>
                    </div>
                  );
                })}
                <div className="d-flex align-items-center m-b-5 radio-btn">

                  <Form.Check
                    type="radio"
                    label=""
                    name="percentage"
                    value="custom"
                    disabled={action === "ADD" && (formik.values.proceed === "" || formik.errors.proceed)}
                    onChange={() => handlePercentageChange("custom", formik.values.amount)}
                    checked={formik.values.percentage === "custom"}
                    className="me-2monospace-font"
                  />
                  <Form.Control
                    type="number"
                    min={0}
                    className="form-control me-2 monospace-font height-25 rounded-0"
                    style={{ width: "80px !important", marginRight: "5px" }}
                    onChange={(e) => handleCustomChange(parseFloat(e.target.value))}
                    disabled={formik.values.percentage !== "custom"}
                  />

                  <span className="monospace-font" style={{ transform: "translateX(165px)" }}>Custom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Section */}
          <div className="d-flex m-b-5 align-items-center">
            <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end fee-label">
                Amount:
            </span>
            <div className="d-flex">
            <Form.Control
            type="text"
            name="amount"
            className="monospace-font height-25 rounded-0"
            value={formik.values.amount ? `$ ${formik.values.amount}` : "$ "} 
            onChange={(e) => {
                let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and '.'

                // Ensure only one decimal point
                if ((value.match(/\./g) || []).length > 1) {
                    value = value.substring(0, value.lastIndexOf("."));
                }

                // Restrict to 2 decimal places
                if (value.includes(".")) {
                    let parts = value.split(".");
                    if (parts[1].length > 2) {
                        parts[1] = parts[1].substring(0, 2);
                    }
                    value = parts.join(".");
                }

                formik.setFieldValue("amount", value || ""); // Update Formik state
            }}
            isInvalid={formik.touched.amount && !!formik.errors.amount}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.amount}
            </Form.Control.Feedback>
              <div className="d-flex m-l-5 align-items-center">
                <input
                  type="checkbox"
                  name="draft1_checked"
                  checked={formik.values.draft1_checked} // Bind the value
                  onChange={(e) => formik.setFieldValue("draft1_checked", e.target.checked)} // Update value manually
              />
              <span className='m-l-5 m-r-5'>Draft</span>
              <input
                  type="checkbox"
                  name="final_checked"
                  checked={formik.values.final_checked} // Bind the value
                  onChange={(e) => formik.setFieldValue("final_checked", e.target.checked)} // Update value manually
              />
              <span className='m-l-5 m-r-5'>Final</span>
                {/* <Form.Check
                  type="checkbox"
                  className="mr-2"
                  label="Draft"
                  name="draft1_checked"
                  checked={formik.values.draft1_checked} // Bind the value
                  onChange={(e) => formik.setFieldValue("draft1_checked", e.target.checked)} // Update value manually
                />
                <Form.Check
                  type="checkbox"
                  label="Final"
                  name="final_checked"
                  checked={formik.values.final_checked} // Bind the value
                  onChange={(e) => formik.setFieldValue("final_checked", e.target.checked)} // Update value manually
                /> */}
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="d-flex m-t-5 m-b-5 align-items-center">
            <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end fee-label">
                Note:
            </span>
            <div className="d-flex-1">
              <Form.Control
                type="text"
                name="note"
                className='height-25 rounded-0'
                {...formik.getFieldProps("note")}
                isInvalid={formik.touched.note && formik.errors.note}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.note}
              </Form.Control.Feedback>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between">
            <div>
              <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                Cancel
              </Button>

            </div>
            <div>

              <Button type="submit" variant="success" className="m-l-5 bg-success height-25" style={{padding:"0px 12px"}} disabled={action === "ADD" ? (formik.values.proceed === "" || formik.errors.proceed || formik.values.amount == '') : action === "EDIT" ? (formik.values.amount == '') : false}>
              Save and Close
              </Button>
            </div>
          </div>
          <div className=" position-absolute del-btn-firm">
              <Button
              style={{
                  marginRight: "5px",
                  padding:"0px 12px"
              }}
              className="height-25"
              variant="danger"
              onClick={() => handleDeleteFee(fee.id, "Fees")}
              >
              Delete
              </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditFeesPopup;
