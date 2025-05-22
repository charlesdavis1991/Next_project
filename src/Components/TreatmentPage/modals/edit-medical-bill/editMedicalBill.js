import { useFormik } from "formik";
import React, { useEffect, useState, useRef } from "react";
import { Col, Modal, Nav, Row, Tab, Form, Button } from "react-bootstrap";
import * as Yup from "yup";
import { currencyFormat, inputCurrencyFormat } from "../../../../Utils/helper";
import deletePanelEntity from "../../../SettlementDashboard/api/deletePanelEntity";
import updatePanelApi from "../../../SettlementDashboard/api/updatePanelApi";
import "./editMedicalBill.css";
import chevronRight from "../../../../../public/BP_resources/images/icon/chevron_right.svg";
import chevronLeft from "../../../../../public/BP_resources/images/icon/chevron_left.svg";

function EditMedicalBillModal({
  show,
  handleClose,
  medicalBill,
  refetchAll,
  specialitie,
  tfData,
}) {
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const [type, setType] = useState("editMedicalBill");
  const [calculatedReduction, setCalculatedReduction] = useState("0.00");
  console.log(tfData);
  const formik = useFormik({
    initialValues: {
      amount: parseFloat(medicalBill.amount || 0.0).toFixed(2),
      ins_paid: parseFloat(medicalBill.ins_paid || 0.0).toFixed(2),
      write_off: parseFloat(medicalBill.write_off || 0.0).toFixed(2),
      medpaypaip: parseFloat(medicalBill.medpaypaip || 0.0).toFixed(2),
      reduction: parseFloat(medicalBill.reduction || 0.0).toFixed(2),
      patient_paid: parseFloat(medicalBill.patient_paid || 0.0).toFixed(2),
      liens: parseFloat(medicalBill.liens || 0.0).toFixed(2),
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .min(0, "Amount must be positive"),
      ins_paid: Yup.number()
        .required("INS PAID is required")
        .min(0, "INS PAID must be positive"),
      write_off: Yup.number()
        .required("Write-off is required")
        .min(0, "Write-off must be positive"),
      medpaypaip: Yup.number()
        .required("MedPayPaip is required")
        .min(0, "MedPayPaip must be positive"),
      reduction: Yup.number()
        .required("Reduction is required")
        .min(0, "Reduction must be positive"),
      patient_paid: Yup.number()
        .required("Patient-Paid is required")
        .min(0, "Patient-Paid must be positive"),
      liens: Yup.number()
        .required("Liens is required")
        .min(0, "Liens must be positive"),
    }),
    onSubmit: async (values) => {
      // Convert all values to strings
      const transformedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value.toString()])
      );
      console.log(transformedValues);

      const payload = {
        check: medicalBill?.id, // Keep 'check' as it is
        ...transformedValues, // Use the transformed values
      };
      const res = await updatePanelApi(payload, "edit-medical-bill");
      console.log(res);
      // // Update the state with the updated medical bill
      // setData((prevData) =>
      //     prevData.map((bill) =>
      //         bill.id === res.data.id ? res.data : bill
      //     )
      // );
      refetchAll();
      handleClose();
    },
  });

  // useEffect(() => {
  //   if (medicalBill && show) {
  //     // Only update values when the modal opens
  //     formik.setValues({
  //       amount: parseFloat(medicalBill.amount || 0.0).toFixed(2),
  //       ins_paid: parseFloat(medicalBill.ins_paid || 0.0).toFixed(2),
  //       write_off: parseFloat(medicalBill.write_off || 0.0).toFixed(2),
  //       medpaypaip: parseFloat(medicalBill.medpaypaip || 0.0).toFixed(2),
  //       reduction: parseFloat(medicalBill.reduction || 0.0).toFixed(2),
  //       patient_paid: parseFloat(medicalBill.patient_paid || 0.0).toFixed(2),
  //     });
  //   }
  // }, [medicalBill, show]); // Re-run when `medicalBill` or `show` changes

  useEffect(() => {
    if (medicalBill && show) {
      // Only update values when the modal opens
      formik.setValues({
        amount: parseFloat(medicalBill.amount || 0.0).toFixed(2),
        ins_paid: parseFloat(medicalBill.ins_paid || 0.0).toFixed(2),
        write_off: parseFloat(medicalBill.write_off || 0.0).toFixed(2),
        medpaypaip: parseFloat(medicalBill.medpaypaip || 0.0).toFixed(2),
        reduction: parseFloat(medicalBill.reduction || 0.0).toFixed(2),
        patient_paid: parseFloat(medicalBill.patient_paid || 0.0).toFixed(2),
        liens: parseFloat(medicalBill.liens || 0.0).toFixed(2),
      });
      setCalculatedReduction(
        parseFloat(medicalBill.reduction || 0.0).toFixed(2)
      );
    }
  }, [medicalBill, show]);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isFocused3, setIsFocused3] = useState(false);
  const [isFocused4, setIsFocused4] = useState(false);
  const [isFocused5, setIsFocused5] = useState(false);
  const [isFocused6, setIsFocused6] = useState(false);
  const [isFocused7, setIsFocused7] = useState(false);

  const handleDeleteMedBill = async (id, panel) => {
    const payload = {
      panel_name: panel,
      record_id: id,
    };
    const res = await deletePanelEntity(payload);
    refetchAll();
    handleClose();
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        // style={{
        //   maxWidth: "670px",
        // }}
        dialogClassName="max-700 modal-dialog-centered "
        contentClassName="custom-modal-new-provider"
        size="lg"
      >
        <div
          className={`has-speciality-color-${specialitie?.id}`}
          style={{ minHeight: medicalBill?.checkID ? "270px" : "270px" }}
        >
          <Modal.Header className="text-center bg-speciality height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <span
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "25px",
                height: "25px",
                fontSize: "16px",
                fontWeight: "600",
                color: "white",
              }}
            >
              {specialitie && specialitie?.name[0]}
            </span>
            <Modal.Title
              className="mx-auto height-25  font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center"
              id="modal_title"
              style={{ fontSize: "14px", fontWeight: "600" }}
            >
              Edit Medical Bill
              {medicalBill
                ? " For " + medicalBill?.providerprofile_office_name
                : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              minHeight: medicalBill?.checkID ? "270px" : "270px",
              padding: "0px",
            }}
          >
            <div className="custom-tab">
              <Tab.Container defaultActiveKey={"editMedicalBill"}>
                <div className="">
                  <Tab.Content>
                    <Tab.Pane
                      style={{
                        minHeight: "150px",
                      }}
                      eventKey="editMedicalBill"
                    >
                      <Form onSubmit={formik.handleSubmit}>
                        <Row
                          style={{ paddingLeft: "0px", paddingRight: "0px" }}
                          className="mx-0"
                        >
                          <Col md={12} className="p-0">
                            <div className="row mx-0 pl-0 pr-0 align-items-center custom-margin-bottom">
                              <div className="col-md-12 pl-0 text-left  pr-0">
                                <table
                                  className="table table-borderless   has-height-25"
                                  data-toggle="modal"
                                  data-target="#medical-provider-charges"
                                  id="tf_provider_table"
                                >
                                  <thead>
                                    <tr className="height-25">
                                      <th
                                        style={{
                                          minWidth: "130px",
                                          maxWidth: "130px",
                                          width: "130px",
                                          background: "var(--primary-10)",
                                        }}
                                        className="text-center  btn-primary-lighter-default color-primary c-font-weight-600"
                                      ></th>
                                      <th
                                        style={{
                                          textTransform: "uppercase",
                                          background: "var(--primary-10)",
                                          // width: "1%",
                                          minWidth: "240px",
                                          width: "240px",
                                          maxWidth: "240px",
                                        }}
                                        className="text-center  btn-primary-lighter-default color-primary c-font-weight-600"
                                      >
                                        [Treatment First Icon] Values
                                      </th>
                                      <th
                                        style={{
                                          textTransform: "uppercase",
                                          background: "var(--primary-10)",
                                          // width: "1%",
                                          // minWidth: "355px",
                                          minWidth: "180px",
                                          width: "180px",
                                          maxWidth: "180px",
                                        }}
                                        className="text-center  btn-primary-lighter-default color-primary c-font-weight-600"
                                      >
                                        Provider Billing
                                      </th>
                                      <th
                                        style={{
                                          textTransform: "uppercase",
                                          background: "var(--primary-10)",
                                          // width: "1%",
                                          // minWidth: "355px",
                                        }}
                                        className="text-center  btn-primary-lighter-default color-primary c-font-weight-600"
                                      >
                                        Calculated Reduction
                                      </th>
                                    </tr>
                                  </thead>
                                  {/* <tbody>
                                    <tr>
                                      <td>
                                        <div
                                          // style={{ maxWidth: "48px" }}
                                          style={{
                                            color: "var(--primary)",
                                            background: "var(--primary-15)",
                                            fontWeight: "600",
                                            paddingLeft: "5px",
                                            paddingRight: "5px",
                                            minWidth: "115px",
                                            maxWidth: "115px",
                                          }}
                                          className="d-inline-block height-25 d-flex align-items-center text-nowrap"
                                        >
                                          <span
                                            //   style={{ color: "var(--primary-25)" }}
                                            className="d-inline-block text-nowrap"
                                          >
                                            Original Bill
                                          </span>
                                        </div>
                                      </td>
                                      <td></td>
                                      <td>
                                        <div
                                          // style={{ minWidth: "459px", maxWidth: "459px" }}
                                          className="col-md-3 height-25"
                                        >
                                          <input
                                            type="text"
                                            name="amount"
                                            className="form-control rounded-0 p-0 p-l-5 p-r-5 height-25 monospace-font text-end"
                                            value={
                                              formik.values.amount
                                                ? `${inputCurrencyFormat(formik.values.amount)}`
                                                : "$ "
                                            }
                                            onFocus={(e) => {
                                              formik.setFieldValue(
                                                "amount",
                                                ""
                                              ); // Clear only the numeric value on click
                                              const calculateLiens = () => {
                                                return (
                                                  parseFloat(0) -
                                                  (parseFloat(
                                                    formik.values.ins_paid || 0
                                                  ) +
                                                    parseFloat(
                                                      formik.values.write_off ||
                                                        0
                                                    ) +
                                                    parseFloat(
                                                      formik.values
                                                        .medpaypaip || 0
                                                    ) +
                                                    parseFloat(
                                                      formik.values
                                                        .patient_paid || 0
                                                    ) +
                                                    parseFloat(
                                                      formik.values.reduction ||
                                                        0
                                                    ))
                                                );
                                              };
                                              formik.setFieldValue(
                                                "liens",
                                                calculateLiens()
                                              );
                                            }}
                                            onChange={(e) => {
                                              let value =
                                                e.target.value.replace(
                                                  /[^0-9.]/g,
                                                  ""
                                                ); // Allow only numbers and '.'

                                              // Ensure only one decimal point
                                              if (
                                                (value.match(/\./g) || [])
                                                  .length > 1
                                              ) {
                                                value = value.substring(
                                                  0,
                                                  value.lastIndexOf(".")
                                                );
                                              }

                                              // Restrict to 2 decimal places
                                              if (value.includes(".")) {
                                                let parts = value.split(".");
                                                if (parts[1].length > 2) {
                                                  parts[1] = parts[1].substring(
                                                    0,
                                                    2
                                                  );
                                                }
                                                value = parts.join(".");
                                              }

                                              formik.setFieldValue(
                                                "amount",
                                                value
                                              ); // Update Formik state
                                              const calculateLiens = () => {
                                                return (
                                                  parseFloat(value || 0) -
                                                  (parseFloat(
                                                    formik.values.ins_paid || 0
                                                  ) +
                                                    parseFloat(
                                                      formik.values.write_off ||
                                                        0
                                                    ) +
                                                    parseFloat(
                                                      formik.values
                                                        .medpaypaip || 0
                                                    ) +
                                                    parseFloat(
                                                      formik.values
                                                        .patient_paid || 0
                                                    ) +
                                                    parseFloat(
                                                      formik.values.reduction ||
                                                        0
                                                    ))
                                                );
                                              };
                                              formik.setFieldValue(
                                                "liens",
                                                calculateLiens()
                                              );
                                            }}
                                            onBlur={(e) => {
                                              if (!formik.values.amount) {
                                                formik.setFieldValue(
                                                  "amount",
                                                  "0.00"
                                                ); // Keep "$ " in place if empty
                                              }
                                              const calculateLiens = () => {
                                                return (
                                                  parseFloat(
                                                    formik.values.amount || 0
                                                  ) -
                                                  (parseFloat(
                                                    formik.values.ins_paid || 0
                                                  ) +
                                                    parseFloat(
                                                      formik.values.write_off ||
                                                        0
                                                    ) +
                                                    parseFloat(
                                                      formik.values
                                                        .medpaypaip || 0
                                                    ) +
                                                    parseFloat(
                                                      formik.values
                                                        .patient_paid || 0
                                                    ) +
                                                    parseFloat(
                                                      formik.values.reduction ||
                                                        0
                                                    ))
                                                );
                                              };
                                              formik.setFieldValue(
                                                "liens",
                                                calculateLiens()
                                              );
                                            }}
                                            isInvalid={
                                              formik.touched.amount &&
                                              !!formik.errors.amount
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            width: "140px",
                                            textAlign: "center",
                                          }}
                                        >
                                          <img
                                            src={chevronRight}
                                            className="ic-19"
                                          />
                                        </div>
                                        <span className="monospace-font text-end med-bill-input">
                                          {currencyFormat(formik.values.amount)}
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody> */}
                                </table>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <Row
                          style={{ paddingLeft: "5px", paddingRight: "5px" }}
                          className="mx-0"
                        >
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div
                                // style={{ maxWidth: "48px" }}
                                style={{
                                  color: "var(--primary)",
                                  background: "var(--primary-15)",
                                  fontWeight: "600",
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                  minWidth: "115px",
                                  maxWidth: "115px",
                                }}
                                className="d-inline-block height-25 d-flex align-items-center text-nowrap"
                              >
                                <span
                                  //   style={{ color: "var(--primary-25)" }}
                                  className="d-inline-block text-nowrap"
                                >
                                  Original Bill
                                </span>
                              </div>
                              <span
                                className="text-end monospace-font"
                                style={{
                                  minWidth: "240px",
                                  width: "240px",
                                  maxWidth: "240px",
                                  height: "25px",
                                }}
                              >
                                {currencyFormat(tfData?.original)}
                              </span>
                              <div
                                // style={{ minWidth: "180px", maxWidth: "180px" }}
                                className="col-md-3 height-25"
                              >
                                <input
                                  type="text"
                                  name="amount"
                                  className="form-control rounded-0 p-0 p-l-5 p-r-5 height-25 monospace-font text-end"
                                  value={
                                    isFocused
                                      ? `$ ${formik.values.amount}` // Raw value while typing
                                      : inputCurrencyFormat(
                                          formik.values.amount || "0.00"
                                        )
                                  }
                                  onFocus={(e) => {
                                    setIsFocused(true); // Set focus state
                                    formik.setFieldValue("amount", ""); // Clear only the numeric value on click
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    ); // Allow only numbers and '.'

                                    // Ensure only one decimal point
                                    if ((value.match(/\./g) || []).length > 1) {
                                      value = value.substring(
                                        0,
                                        value.lastIndexOf(".")
                                      );
                                    }

                                    // Restrict to 2 decimal places
                                    if (value.includes(".")) {
                                      let parts = value.split(".");
                                      if (parts[1].length > 2) {
                                        parts[1] = parts[1].substring(0, 2);
                                      }
                                      value = parts.join(".");
                                    }

                                    formik.setFieldValue("amount", value); // Update Formik state
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(value || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  onBlur={(e) => {
                                    setIsFocused(false); // Reset focus state
                                    if (!formik.values.amount) {
                                      formik.setFieldValue("amount", "0.00"); // Keep "$ " in place if empty
                                    }
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  isInvalid={
                                    formik.touched.amount &&
                                    !!formik.errors.amount
                                  }
                                />
                              </div>
                              <div
                                style={{
                                  width: "140px",
                                  textAlign: "center",
                                }}
                              >
                                <img src={chevronRight} className="ic-19" />
                              </div>
                              <span className="monospace-font text-end med-bill-input">
                                {currencyFormat(formik.values.amount)}
                              </span>
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.amount}
                              </Form.Control.Feedback>
                            </div>
                          </Col>
                        </Row>

                        <Row
                          style={{ paddingLeft: "5px", paddingRight: "5px" }}
                          className="mx-0"
                        >
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div
                                // style={{ maxWidth: "48px" }}
                                style={{
                                  color: "var(--primary)",
                                  background: "var(--primary-15)",
                                  fontWeight: "600",
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                  minWidth: "115px",
                                  maxWidth: "115px",
                                }}
                                className="d-inline-block height-25 d-flex align-items-center text-nowrap"
                              >
                                <span
                                  //   style={{ color: "var(--primary-25)" }}
                                  className="d-inline-block text-nowrap"
                                >
                                  Insurance Paid
                                </span>
                              </div>
                              <span
                                className="text-end monospace-font"
                                style={{
                                  minWidth: "240px",
                                  width: "240px",
                                  maxWidth: "240px",
                                  height: "25px",
                                }}
                              >
                                {currencyFormat(tfData?.hi_paid)}
                              </span>
                              <div
                                // style={{ minWidth: "459px", maxWidth: "459px" }}
                                className="col-md-3 height-25"
                              >
                                <input
                                  className="form-control rounded-0 p-0 p-l-5 p-r-5 height-25 monospace-font text-end"
                                  type="text"
                                  name="ins_paid"
                                  value={
                                    isFocused2
                                      ? `$ ${formik.values.ins_paid}` // Raw value while typing
                                      : inputCurrencyFormat(
                                          formik.values.ins_paid || "0.00"
                                        )
                                  }
                                  // value={
                                  //   formik.values.ins_paid
                                  //     ? `${inputCurrencyFormat(formik.values.ins_paid)}`
                                  //     : "$ "
                                  // }
                                  onFocus={() => {
                                    setIsFocused2(true); // Set focus state
                                    formik.setFieldValue("ins_paid", ""); // Clear only the numeric value on click
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.write_off || 0
                                        ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    ); // Allow only numbers and '.'

                                    // Ensure only one decimal point
                                    if ((value.match(/\./g) || []).length > 1) {
                                      value = value.substring(
                                        0,
                                        value.lastIndexOf(".")
                                      );
                                    }

                                    // Restrict to 2 decimal places
                                    if (value.includes(".")) {
                                      let parts = value.split(".");
                                      if (parts[1].length > 2) {
                                        parts[1] = parts[1].substring(0, 2);
                                      }
                                      value = parts.join(".");
                                    }

                                    formik.setFieldValue("ins_paid", value); // Update Formik state
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(value || 0) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  onBlur={() => {
                                    setIsFocused2(false); // Reset focus state
                                    if (!formik.values.ins_paid) {
                                      formik.setFieldValue("ins_paid", "0.00"); // Keep "$ " in place if empty
                                    }
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  isInvalid={
                                    formik.touched.ins_paid &&
                                    !!formik.errors.ins_paid
                                  }
                                />
                              </div>
                              <div
                                style={{
                                  width: "140px",
                                  textAlign: "center",
                                }}
                              >
                                <img src={chevronRight} className="ic-19" />
                              </div>
                              <span className="monospace-font text-end med-bill-input">
                                {currencyFormat(formik.values.ins_paid)}
                              </span>
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.ins_paid}
                              </Form.Control.Feedback>
                            </div>
                          </Col>
                        </Row>

                        <Row
                          style={{ paddingLeft: "5px", paddingRight: "5px" }}
                          className="mx-0"
                        >
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div
                                // style={{ maxWidth: "48px" }}
                                style={{
                                  color: "var(--primary)",
                                  background: "var(--primary-15)",
                                  fontWeight: "600",
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                  minWidth: "115px",
                                  maxWidth: "115px",
                                }}
                                className="d-inline-block height-25 d-flex align-items-center text-nowrap"
                              >
                                <span
                                  //   style={{ color: "var(--primary-25)" }}
                                  className="d-inline-block text-nowrap"
                                >
                                  Ins. Write-off
                                </span>
                              </div>
                              <span
                                className="text-end monospace-font"
                                style={{
                                  minWidth: "240px",
                                  width: "240px",
                                  maxWidth: "240px",
                                  height: "25px",
                                }}
                              >
                                {currencyFormat(tfData?.hi_reduction)}
                              </span>
                              <div
                                // style={{ minWidth: "459px", maxWidth: "459px" }}
                                className="col-md-3 height-25"
                              >
                                <input
                                  className="form-control rounded-0 p-0 p-l-5 p-r-5 height-25 monospace-font text-end"
                                  type="text"
                                  name="write_off"
                                  value={
                                    isFocused3
                                      ? `$ ${formik.values.write_off}` // Raw value while typing
                                      : inputCurrencyFormat(
                                          formik.values.write_off || "0.00"
                                        )
                                  }
                                  // value={
                                  //   formik.values.write_off
                                  //     ? `${inputCurrencyFormat(formik.values.write_off)}`
                                  //     : "$ "
                                  // }
                                  onFocus={() => {
                                    setIsFocused3(true); // Set focus state
                                    formik.setFieldValue("write_off", ""); // Clear only the numeric value on click
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    ); // Allow only numbers and '.'

                                    // Ensure only one decimal point
                                    if ((value.match(/\./g) || []).length > 1) {
                                      value = value.substring(
                                        0,
                                        value.lastIndexOf(".")
                                      );
                                    }

                                    // Restrict to 2 decimal places
                                    if (value.includes(".")) {
                                      let parts = value.split(".");
                                      if (parts[1].length > 2) {
                                        parts[1] = parts[1].substring(0, 2);
                                      }
                                      value = parts.join(".");
                                    }

                                    formik.setFieldValue("write_off", value); // Update Formik state
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(value || 0) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  onBlur={() => {
                                    setIsFocused3(false); // Reset focus state
                                    if (!formik.values.write_off) {
                                      formik.setFieldValue("write_off", "0.00"); // Keep "$ " in place if empty
                                    }
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  isInvalid={
                                    formik.touched.write_off &&
                                    !!formik.errors.write_off
                                  }
                                />
                              </div>
                              <div
                                style={{
                                  width: "140px",
                                  textAlign: "center",
                                }}
                              >
                                <img src={chevronRight} className="ic-19" />
                              </div>
                              <span className="monospace-font text-end med-bill-input">
                                {currencyFormat(formik.values.write_off)}
                              </span>
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.write_off}
                              </Form.Control.Feedback>
                            </div>
                          </Col>
                        </Row>

                        <Row
                          style={{ paddingLeft: "5px", paddingRight: "5px" }}
                          className="mx-0"
                        >
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div
                                // style={{ maxWidth: "48px" }}
                                style={{
                                  color: "var(--primary)",
                                  background: "var(--primary-15)",
                                  fontWeight: "600",
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                  minWidth: "115px",
                                  maxWidth: "115px",
                                }}
                                className="d-inline-block height-25 d-flex align-items-center text-nowrap"
                              >
                                <span
                                  //   style={{ color: "var(--primary-25)" }}
                                  className="d-inline-block text-nowrap"
                                >
                                  MedPay / Pip
                                </span>
                              </div>
                              <span
                                className="text-end monospace-font"
                                style={{
                                  minWidth: "240px",
                                  width: "240px",
                                  maxWidth: "240px",
                                  height: "25px",
                                }}
                              >
                                {currencyFormat(tfData?.mp_paid)}
                              </span>
                              <div
                                // style={{ minWidth: "459px", maxWidth: "459px" }}
                                className="col-md-3 height-25"
                              >
                                <input
                                  className="form-control rounded-0 p-0 p-l-5 p-r-5 height-25 monospace-font text-end"
                                  type="text"
                                  name="medpaypaip"
                                  value={
                                    isFocused4
                                      ? `$ ${formik.values.medpaypaip}` // Raw value while typing
                                      : inputCurrencyFormat(
                                          formik.values.medpaypaip || "0.00"
                                        )
                                  }
                                  // value={
                                  //   formik.values.medpaypaip
                                  //     ? `${inputCurrencyFormat(formik.values.medpaypaip)}`
                                  //     : "$ "
                                  // }
                                  onFocus={() => {
                                    setIsFocused4(true); // Set focus state
                                    formik.setFieldValue("medpaypaip", ""); // Clear only the numeric value on click
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    ); // Allow only numbers and '.'

                                    // Ensure only one decimal point
                                    if ((value.match(/\./g) || []).length > 1) {
                                      value = value.substring(
                                        0,
                                        value.lastIndexOf(".")
                                      );
                                    }

                                    // Restrict to 2 decimal places
                                    if (value.includes(".")) {
                                      let parts = value.split(".");
                                      if (parts[1].length > 2) {
                                        parts[1] = parts[1].substring(0, 2);
                                      }
                                      value = parts.join(".");
                                    }

                                    formik.setFieldValue("medpaypaip", value); // Update Formik state
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(value || 0) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  onBlur={() => {
                                    setIsFocused4(false); // Reset focus state
                                    if (!formik.values.medpaypaip) {
                                      formik.setFieldValue(
                                        "medpaypaip",
                                        "0.00"
                                      ); // Keep "$ " in place if empty
                                    }
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  isInvalid={
                                    formik.touched.medpaypaip &&
                                    !!formik.errors.medpaypaip
                                  }
                                />
                              </div>
                              <div
                                style={{
                                  width: "140px",
                                  textAlign: "center",
                                }}
                              >
                                <img src={chevronRight} className="ic-19" />
                              </div>
                              <span className="monospace-font text-end med-bill-input">
                                {currencyFormat(formik.values.medpaypaip)}
                              </span>
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.medpaypaip}
                              </Form.Control.Feedback>
                            </div>
                          </Col>
                        </Row>

                        <Row
                          style={{ paddingLeft: "5px", paddingRight: "5px" }}
                          className="mx-0"
                        >
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div
                                // style={{ maxWidth: "48px" }}
                                style={{
                                  color: "var(--primary)",
                                  background: "var(--primary-15)",
                                  fontWeight: "600",
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                  minWidth: "115px",
                                  maxWidth: "115px",
                                }}
                                className="d-inline-block height-25 d-flex align-items-center text-nowrap"
                              >
                                <span
                                  //   style={{ color: "var(--primary-25)" }}
                                  className="d-inline-block text-nowrap"
                                >
                                  Client Paid
                                </span>
                              </div>
                              <span
                                className="text-end monospace-font"
                                style={{
                                  minWidth: "240px",
                                  width: "240px",
                                  maxWidth: "240px",
                                  height: "25px",
                                }}
                              >
                                {currencyFormat(tfData?.patient_payment_value)}
                              </span>
                              <div
                                // style={{ minWidth: "459px", maxWidth: "459px" }}
                                className="col-md-3 height-25"
                              >
                                <input
                                  className="form-control rounded-0 p-0 p-l-5 p-r-5 height-25 monospace-font text-end"
                                  type="text"
                                  name="patient_paid"
                                  value={
                                    isFocused5
                                      ? ` $ ${formik.values.patient_paid}` // Raw value while typing
                                      : inputCurrencyFormat(
                                          formik.values.patient_paid || "0.00"
                                        )
                                  }
                                  // value={
                                  //   formik.values.patient_paid
                                  //     ? `${inputCurrencyFormat(formik.values.patient_paid)}`
                                  //     : "$ "
                                  // }
                                  onFocus={() => {
                                    setIsFocused5(true); // Set focus state
                                    formik.setFieldValue("patient_paid", ""); // Clear only the numeric value on click
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    ); // Allow only numbers and '.'

                                    // Ensure only one decimal point
                                    if ((value.match(/\./g) || []).length > 1) {
                                      value = value.substring(
                                        0,
                                        value.lastIndexOf(".")
                                      );
                                    }

                                    // Restrict to 2 decimal places
                                    if (value.includes(".")) {
                                      let parts = value.split(".");
                                      if (parts[1].length > 2) {
                                        parts[1] = parts[1].substring(0, 2);
                                      }
                                      value = parts.join(".");
                                    }

                                    formik.setFieldValue("patient_paid", value); // Update Formik state
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(value || 0) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  onBlur={() => {
                                    setIsFocused5(false); // Reset focus state
                                    if (!formik.values.patient_paid) {
                                      formik.setFieldValue(
                                        "patient_paid",
                                        "0.00"
                                      ); // Keep "$ " in place if empty
                                    }
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  isInvalid={
                                    formik.touched.patient_paid &&
                                    !!formik.errors.patient_paid
                                  }
                                />
                              </div>
                              <div
                                style={{
                                  width: "140px",
                                  textAlign: "center",
                                }}
                              >
                                <img src={chevronRight} className="ic-19" />
                              </div>
                              <span className="monospace-font text-end med-bill-input">
                                {currencyFormat(formik.values.patient_paid)}
                              </span>
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.patient_paid}
                              </Form.Control.Feedback>
                            </div>
                          </Col>
                        </Row>

                        <Row
                          style={{ paddingLeft: "5px", paddingRight: "5px" }}
                          className="mx-0"
                        >
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div
                                // style={{ maxWidth: "48px" }}
                                style={{
                                  color: "var(--primary)",
                                  background: "var(--primary-15)",
                                  fontWeight: "600",
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                  minWidth: "115px",
                                  maxWidth: "115px",
                                }}
                                className="d-inline-block height-25 d-flex align-items-center text-nowrap"
                              >
                                <span
                                  //   style={{ color: "var(--primary-25)" }}
                                  className="d-inline-block text-nowrap"
                                >
                                  Reduction
                                </span>
                              </div>
                              <span
                                className="text-end monospace-font"
                                style={{
                                  minWidth: "240px",
                                  width: "240px",
                                  maxWidth: "240px",
                                  height: "25px",
                                }}
                              >
                                {currencyFormat(tfData?.reduction)}
                              </span>
                              <div
                                // style={{ minWidth: "459px", maxWidth: "459px" }}
                                className="col-md-3 height-25"
                              >
                                <input
                                  className="form-control rounded-0 p-0 p-l-5 p-r-5 height-25 monospace-font text-end"
                                  type="text"
                                  name="reduction"
                                  value={
                                    isFocused6
                                      ? `$ ${formik.values.reduction}` // Raw value while typing
                                      : inputCurrencyFormat(
                                          formik.values.reduction || "0.00"
                                        )
                                  }
                                  // value={
                                  //   formik.values.reduction
                                  //     ? `${inputCurrencyFormat(formik.values.reduction)}`
                                  //     : "$ "
                                  // }
                                  onFocus={() => {
                                    setIsFocused6(true); // Set focus state
                                    formik.setFieldValue("reduction", ""); // Clear only the numeric value on click
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    ); // Allow only numbers and '.'

                                    // Ensure only one decimal point
                                    if ((value.match(/\./g) || []).length > 1) {
                                      value = value.substring(
                                        0,
                                        value.lastIndexOf(".")
                                      );
                                    }

                                    // Restrict to 2 decimal places
                                    if (value.includes(".")) {
                                      let parts = value.split(".");
                                      if (parts[1].length > 2) {
                                        parts[1] = parts[1].substring(0, 2);
                                      }
                                      value = parts.join(".");
                                    }

                                    formik.setFieldValue("reduction", value); // Update Formik state
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(value || 0))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  onBlur={() => {
                                    setIsFocused6(false); // Reset focus state
                                    if (!formik.values.reduction) {
                                      formik.setFieldValue("reduction", "0.00"); // Keep "$ " in place if empty
                                    }
                                    const calculateLiens = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(
                                            formik.values.reduction || 0
                                          ))
                                      );
                                    };
                                    formik.setFieldValue(
                                      "liens",
                                      calculateLiens()
                                    );
                                  }}
                                  isInvalid={
                                    formik.touched.reduction &&
                                    !!formik.errors.reduction
                                  }
                                />
                              </div>
                              <div
                                style={{
                                  cursor: "pointer",
                                }}
                                className="d-flex align-items-center"
                                onClick={() => {
                                  formik.setFieldValue(
                                    "reduction",
                                    calculatedReduction
                                  );

                                  // Also update liens to match
                                  const calculateLiens = () => {
                                    return (
                                      parseFloat(formik.values.amount || 0) -
                                      (parseFloat(formik.values.ins_paid || 0) +
                                        parseFloat(
                                          formik.values.write_off || 0
                                        ) +
                                        parseFloat(
                                          formik.values.medpaypaip || 0
                                        ) +
                                        parseFloat(
                                          formik.values.patient_paid || 0
                                        ) +
                                        parseFloat(calculatedReduction || 0))
                                    );
                                  };

                                  console.log(calculateLiens());
                                  formik.setFieldValue(
                                    "liens",
                                    calculateLiens()
                                  );
                                }}
                              >
                                <div
                                  style={{
                                    width: "20px",
                                    textAlign: "center",
                                  }}
                                >
                                  <img src={chevronLeft} className="ic-19" />
                                </div>
                                <span
                                  style={{
                                    width: "120px",
                                    textAlign: "center",
                                  }}
                                  className="color-primary"
                                  // onClick={() => {
                                  //   formik.setFieldValue(
                                  //     "reduction",
                                  //     calculatedReduction
                                  //   );

                                  //   // Also update liens to match
                                  //   const calculateLiens = () => {
                                  //     return (
                                  //       parseFloat(formik.values.amount || 0) -
                                  //       (parseFloat(formik.values.ins_paid || 0) +
                                  //         parseFloat(
                                  //           formik.values.write_off || 0
                                  //         ) +
                                  //         parseFloat(
                                  //           formik.values.medpaypaip || 0
                                  //         ) +
                                  //         parseFloat(
                                  //           formik.values.patient_paid || 0
                                  //         ) +
                                  //         parseFloat(calculatedReduction || 0))
                                  //     );
                                  //   };

                                  //   console.log(calculateLiens());
                                  //   formik.setFieldValue(
                                  //     "liens",
                                  //     calculateLiens()
                                  //   );
                                  // }}
                                >
                                  Copy Calculated:{" "}
                                </span>
                              </div>
                              <span className="monospace-font text-end med-bill-input">
                                {currencyFormat(calculatedReduction)}
                              </span>
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.reduction}
                              </Form.Control.Feedback>
                            </div>
                          </Col>
                        </Row>

                        <Row
                          style={{ paddingLeft: "5px", paddingRight: "5px" }}
                          className="mx-0"
                        >
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div
                                // style={{ maxWidth: "48px" }}
                                style={{
                                  color: "var(--primary)",
                                  background: "var(--primary-15)",
                                  fontWeight: "600",
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                  minWidth: "115px",
                                  maxWidth: "115px",
                                }}
                                className="d-inline-block height-25 d-flex align-items-center text-nowrap"
                              >
                                <span
                                  //   style={{ color: "var(--primary-25)" }}
                                  className="d-inline-block text-nowrap"
                                >
                                  Lien
                                </span>
                              </div>
                              <span
                                className="text-end monospace-font"
                                style={{
                                  minWidth: "240px",
                                  width: "240px",
                                  maxWidth: "240px",
                                  height: "25px",
                                }}
                              >
                                {currencyFormat(tfData?.liens)}
                              </span>
                              <div
                                style={{ minWidth: "465px", maxWidth: "465px" }}
                                className="col-md-6 pr-0 d-flex align-items-center height-25"
                              >
                                <span
                                  className="col-md-3 whitespace-nowrap p-l-0 p-r-5 monospace-font text-end med-bill-input"
                                  style={{
                                    marginRight: "15px",
                                    maxWidth: "172.5px",
                                    minWidth: "172.5px",
                                  }}
                                >
                                  {currencyFormat(
                                    parseFloat(formik.values.liens || 0)
                                  )}
                                </span>
                                <span
                                  style={{
                                    width: "140px",
                                    textAlign: "center",
                                  }}
                                  className="color-primary"
                                >
                                  {/* Copy Calculated:{" "} */}
                                </span>
                                <input
                                  className="form-control rounded-0 p-0 p-l-5 p-r-5 height-25 monospace-font text-end"
                                  type="text"
                                  name="liens"
                                  style={{
                                    maxWidth: "120px",
                                    minWidth: "120px",
                                  }}
                                  // value={
                                  //   formik.values.liens
                                  //     ? `${inputCurrencyFormat(formik.values.liens)}`
                                  //     : "$ "
                                  // }
                                  value={
                                    isFocused7
                                      ? `$ ${formik.values.liens}` // Raw value while typing
                                      : inputCurrencyFormat(
                                          formik.values.liens || "0.0"
                                        )
                                  }
                                  onFocus={() => {
                                    setIsFocused7(true); // Set focus state
                                    console.log(formik.values.liens);
                                    formik.setFieldValue("liens", ""); // Clear only the numeric value on click
                                    const calculateReduction = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ))
                                      );
                                    };
                                    // formik.setFieldValue(
                                    //   "reduction",
                                    //   calculateReduction()
                                    // );
                                    setCalculatedReduction(
                                      calculateReduction()
                                    );
                                  }}
                                  onChange={(e) => {
                                    console.log(e.target.value);
                                    let value = e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    ); // Allow only numbers and '.'

                                    // Ensure only one decimal point
                                    if ((value.match(/\./g) || []).length > 1) {
                                      value = value.substring(
                                        0,
                                        value.lastIndexOf(".")
                                      );
                                    }

                                    // Restrict to 2 decimal places
                                    if (value.includes(".")) {
                                      let parts = value.split(".");
                                      if (parts[1].length > 2) {
                                        parts[1] = parts[1].substring(0, 2);
                                      }
                                      value = parts.join(".");
                                    }

                                    formik.setFieldValue("liens", value); // Update Formik state

                                    const calculateReduction = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(value || 0))
                                      );
                                    };
                                    // formik.setFieldValue(
                                    //   "reduction",
                                    //   calculateReduction()
                                    // );
                                    setCalculatedReduction(
                                      calculateReduction()
                                    );
                                  }}
                                  onBlur={() => {
                                    setIsFocused7(false); // Reset focus state
                                    console.log(formik.values?.liens);
                                    if (!formik.values.liens) {
                                      formik.setFieldValue("liens", "0.00"); // Keep "$ " in place if empty
                                    }
                                    const calculateReduction = () => {
                                      return (
                                        parseFloat(formik.values.amount || 0) -
                                        (parseFloat(
                                          formik.values.ins_paid || 0
                                        ) +
                                          parseFloat(
                                            formik.values.write_off || 0
                                          ) +
                                          parseFloat(
                                            formik.values.medpaypaip || 0
                                          ) +
                                          parseFloat(
                                            formik.values.patient_paid || 0
                                          ) +
                                          parseFloat(formik.values.liens || 0))
                                      );
                                    };
                                    // formik.setFieldValue(
                                    //   "reduction",
                                    //   calculateReduction()
                                    // );
                                    setCalculatedReduction(
                                      calculateReduction()
                                    );
                                  }}
                                  isInvalid={
                                    formik.touched.liens &&
                                    !!formik.errors.liens
                                  }
                                />
                              </div>
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.liens}
                              </Form.Control.Feedback>
                            </div>
                          </Col>
                        </Row>

                        <div className="d-flex p-l-5 p-r-5 justify-content-between align-items-center">
                          <Button
                            variant="secondary"
                            className="height-25 d-flex align-items-center"
                            onClick={handleClose}
                          >
                            Close
                          </Button>
                          <div>
                            <Button
                              variant="success"
                              type="submit"
                              disabled={
                                formik.values.amount == "" ||
                                formik.values.ins_paid == "" ||
                                formik.values.write_off == "" ||
                                formik.values.medpaypaip == "" ||
                                formik.values.reduction == "" ||
                                formik.values.patient_paid == ""
                                // medicalBill.checkID
                              }
                              className="height-25 d-flex align-items-center"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </Form>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>
            </div>
          </Modal.Body>
          {/* {type === "editMedicalBill" && (
            <Modal.Footer
              className="p-0 mt-0 padding-outside-btn-new-provider d-flex justify-content-between align-items-center"
              style={{ borderTop: "none" }}
            ></Modal.Footer>
          )} */}
        </div>
      </Modal>
    </>
  );
}

export default React.memo(EditMedicalBillModal);
