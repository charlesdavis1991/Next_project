import React from "react";

function PaymentTable({ tfAccounting, type }) {
  function formatCurrency(amount) {
    if (!amount && amount !== 0) return "0.00";
    const number = typeof amount === "string" ? parseFloat(amount) : amount;

    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getAmountColor(amount) {
    if (!amount || parseFloat(amount) === 0) {
      return "var(--primary-25)";
    }
    return "black";
  }
  return (
    <>
      <td className=" text-end monospace-font height-25 p-r-5 p-l-5">
        <p className="height-25 p-r-5 p-l-5" id="client_prov_amount92">
          <span
            style={{
              color: getAmountColor(
                type === "tf" ? tfAccounting?.original : tfAccounting?.amount
              ),
            }}
          >
            ${" "}
            {type === "tf"
              ? formatCurrency(tfAccounting?.original)
              : formatCurrency(tfAccounting?.amount)}
          </span>
        </p>
      </td>
      <td className=" text-end monospace-font height-25">
        <p className="height-25 p-r-5 p-l-5" id="client_prov_ins_paid92">
          <span
            style={{
              color: getAmountColor(
                type === "tf" ? tfAccounting?.hi_paid : tfAccounting?.ins_paid
              ),
            }}
          >
            {type === "tf"
              ? "$ " + formatCurrency(tfAccounting?.hi_paid)
              : "$ " + formatCurrency(tfAccounting?.ins_paid)}
          </span>
        </p>
      </td>
      <td className=" text-end monospace-font height-25">
        <p className="height-25 p-r-5 p-l-5" id="client_prov_write_off92">
          <span
            style={{
              color: getAmountColor(
                type === "tf"
                  ? tfAccounting?.hi_reduction
                  : tfAccounting?.write_off
              ),
            }}
          >
            ${" "}
            {type === "tf"
              ? formatCurrency(tfAccounting?.hi_reduction)
              : formatCurrency(tfAccounting?.write_off)}
          </span>
        </p>
      </td>
      <td className=" text-end monospace-font height-25">
        <p className="height-25 p-r-5 p-l-5" id="client_prov_medpaypaip92">
          <span
            style={{
              color: getAmountColor(
                type === "tf" ? tfAccounting?.mp_paid : tfAccounting?.medpaypaip
              ),
            }}
          >
            ${" "}
            {type === "tf"
              ? formatCurrency(tfAccounting?.mp_paid)
              : formatCurrency(tfAccounting?.medpaypaip)}
          </span>
        </p>
      </td>
      <td className=" text-end monospace-font height-25">
        <p className="height-25 p-r-5 p-l-5" id="client_prov_reduction92">
          <span
            style={{
              color: getAmountColor(
                type === "tf"
                  ? tfAccounting?.reduction
                  : tfAccounting?.reduction
              ),
            }}
          >
            ${" "}
            {type === "tf"
              ? formatCurrency(tfAccounting?.reduction)
              : formatCurrency(tfAccounting?.reduction)}
          </span>
        </p>
      </td>
      <td className=" text-end monospace-font height-25">
        <p
          className="text-lg height-25 p-r-5 p-l-5"
          id="client_prov_patient_paid92"
        >
          <span
            style={{
              color: getAmountColor(
                type === "tf"
                  ? tfAccounting?.patient_payment_value
                  : tfAccounting?.patient_paid
              ),
            }}
          >
            ${" "}
            {type === "tf"
              ? formatCurrency(tfAccounting?.patient_payment_value)
              : formatCurrency(tfAccounting?.patient_paid)}
          </span>{" "}
        </p>
      </td>
      <td className=" text-end monospace-font height-25">
        <p
          className="font-weight-bold height-25 p-r-5 p-l-5"
          id="client_prov_final_amount92"
        >
          <span
            style={{
              color: getAmountColor(
                type === "tf" ? tfAccounting?.liens : tfAccounting?.liens
              ),
            }}
          >
            ${" "}
            {type === "tf"
              ? formatCurrency(tfAccounting?.liens)
              : formatCurrency(tfAccounting?.liens)}
          </span>{" "}
        </p>
      </td>
      <td className=" text-end monospace-font height-25">
        <p
          className="font-weight-bold height-25 p-r-5 p-l-5"
          id="client_prov_final92"
        >
          <span
            style={{
              color:
                type === "tf"
                  ? getAmountColor(tfAccounting?.final)
                  : "var(--primary-25)",
            }}
          >
            $ {type !== "tf" ? formatCurrency(tfAccounting?.final) : null}
          </span>
        </p>
      </td>
    </>
  );
}

export default PaymentTable;
