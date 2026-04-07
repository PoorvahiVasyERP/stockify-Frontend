import * as Yup from "yup";

export const productSchema = Yup.object({
  productName: Yup.string().required("Product Name is required"),

  productDescription: Yup.string(),

  productPrice: Yup.number()
    .typeError("Price is required")
    .min(0, "Price cannot be negative")
    .required("Price must be a number"),

  quantity: Yup.number()
    .typeError("Quantity is required")
    .min(0, "Quantity cannot be negative")
    .required("Quantity must be a number")
});
