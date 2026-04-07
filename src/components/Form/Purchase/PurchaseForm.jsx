import { useState, useEffect } from "react";
import { getProduct, createPurchase } from "../../../services/ApiService";
import Input from "../../Input/Input";
import "../Form.css";
import { purchaseSchema } from "../../../validation/PurchaseValidation";
import { toast } from "react-toastify";

export default function PurchaseForm({ onSuccess }) {
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    productId: "",
    productName: "",
    productPrice: "",
    quantity: "",
    total: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProduct();
      setProducts(response.data.data);
      console.log(response.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch products");
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = products.find((p) => p.productId === parseInt(productId));

    if (product) {
      setSelectedProduct(product);
      setForm({
        ...form,
        productId: product.productId,
        productName: product.productName,
        productPrice: product.productPrice,
        quantity: "",
        total: "",
      });
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    const total = quantity ? (quantity * form.productPrice).toFixed(2) : "";
    setForm({
      ...form,
      quantity,
      total,
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productId || !form.quantity) {
      toast.error("Please select a product and enter quantity");
      return;
    }

    try {
      await purchaseSchema.validate(form, { abortEarly: false });
      const payload = {
        productId: parseInt(form.productId),
        quantity: parseInt(form.quantity),
        price: parseFloat(form.productPrice),
      };

      console.log("Sending payload:", payload);
      console.log("Product found:", selectedProduct);
      const response = await createPurchase(payload);
      toast.success(response.data.message || "Purchase added successfully");
      setForm({
        productId: "",
        productName: "",
        productPrice: "",
        quantity: "",
        total: "",
      });
      setSelectedProduct(null);
      onSuccess();
    } catch (err) {
  console.error("Error:", err);

  if (err.inner) {
    const validationErrors = {};
    err.inner.forEach((e) => {
      validationErrors[e.path] = e.message;
    });
    setErrors(validationErrors);
  } else {
    toast.error(
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong"
    );
  }
}}

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <select 
          className="product-form-select"
          onChange={handleProductChange}
          defaultValue=""
        >
          <option value="" disabled>
            {" "}
            Select Product
          </option>
          {products.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.productName}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Product Name"
        name="productName"
        value={form.productName}
        onChange={handleChange}
        placeholder="Enter product name"
        readOnly
      />

      <Input
        label="Price"
        name="productPrice"
        type="number"
        value={form.productPrice}
        onChange={handleChange} 
        placeholder="Enter price"
        readOnly
      />

      <Input
        label="Quantity"
        name="quantity"
        type="number"
        value={form.quantity}
        onChange={handleQuantityChange}
        placeholder="Enter quantity"
      />
      {errors.quantity && <p className="error">{errors.quantity}</p>}

      <Input
        label="Total"
        name="total"
        type="number"
        value={
          form.productPrice && form.quantity
            ? (form.productPrice * form.quantity).toFixed(2)
            : ""
        }
        disabled
        placeholder="Total"
        readOnly
      />

      <button type="submit" className="btn-submit">
        {"Save Purchase"}
      </button>
    </form>
  );
}
