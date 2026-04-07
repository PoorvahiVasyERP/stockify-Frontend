import * as Yup from "yup";

export const warehouseSchema = Yup.object({
  warehouseName: Yup.string().required("Warehouse Name is required"),
  warehouseCode: Yup.string().required("Warehouse Code is required"),
});
