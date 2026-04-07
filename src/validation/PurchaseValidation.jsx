import * as Yup from "yup";

export const purchaseSchema = Yup.object({
  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),
}); 