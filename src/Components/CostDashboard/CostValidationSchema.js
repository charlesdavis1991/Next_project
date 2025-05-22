import * as Yup from "yup";

export const costValidationSchema = Yup.object({
  date: Yup.string().required("Required"),
  payee: Yup.string().required("Required").min(1, "Payee must not be empty"),
  invoice_number: Yup.string()
    .required("Required")
    .min(1, "Invoice number must not be empty"),
  amount: Yup.number()
    .moreThan(0, "Amount must be positive")
    .required("Required"),
  memo: Yup.string(),
  category: Yup.string().required("Required"),
});
