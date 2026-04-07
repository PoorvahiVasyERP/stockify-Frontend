import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../../services/ApiService";
import Input from "../../Input/Input";
import "../Form.css";
import { productSchema } from "../../../validation/ProductValidation";
import { toast } from "react-toastify";
import Comment from "../CommentBox/Comment";

export default function ProductModalForm({ onSuccess, editProduct }) {
  const [error, setErrors] = useState({});
  const [showCommentBox, setShowCommentBox] = useState(false);


  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    quantity: "",
  });

  useEffect(() => {
    if (editProduct) {
      setForm({
        productName: editProduct.productName || "",
        productDescription: editProduct.productDescription || "",
        productPrice: editProduct.productPrice || "",
        quantity: editProduct.quantity || "",
      });
    } else {
      setForm({
        productName: "",
        productDescription: "",
        productPrice: "",
        quantity: "",
      });
    }
  }, [editProduct]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productSchema.validate(form, { abortEarly: false });
      setErrors({});

      let response;
      if (editProduct) {
        response = await updateProduct(editProduct.productId, form);
        toast.success(response.data.message || "Product updated successfully");
      } else {
        response = await createProduct(form);
        toast.success(response.data.message || "Product added successfully");
      }
      onSuccess();
    } catch (err) {
      if (err.inner) {
        const newErrors = {};
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      }
      else {
        const errorMessage = err?.response?.data?.message || err?.message || "Something went wrong.";
        toast.error(errorMessage);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <Input
        label="Product Name"
        name="productName"
        value={form.productName}
        onChange={handleChange}
        placeholder="Enter product name"
        leftIcon="fa-tag"
        error={error.productName}
      />

      <Input
        label="Description"
        name="productDescription"
        value={form.productDescription}
        onChange={handleChange}
        placeholder="Enter description"
        leftIcon="fa-align-left"
        error={error.productDescription}
        multiline
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <Input
          label="Price"
          name="productPrice"
          type="number"
          value={form.productPrice}
          onChange={handleChange}
          placeholder="Enter price"
          leftIcon="fa-indian-rupee-sign"
          error={error.productPrice}
        />

        <Input
          label="Quantity"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Enter quantity"
          leftIcon="fa-box"
          error={error.quantity}
        />
      </div>

      <button type="submit" className="btn-submit">
        {editProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}
