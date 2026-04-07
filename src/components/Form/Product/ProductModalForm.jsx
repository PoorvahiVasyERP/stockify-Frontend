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
      else{
        const errorMessage = err?.response?.data?.message || err?.message || "Something went wrong.";
        toast.error(errorMessage);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit} className="product-form">
      <Input
        label="Product Name"
        name="productName"
        value={form.productName}
        onChange={handleChange}
        placeholder="Enter product name"
      />
      {error.productName && <p className="error">{error.productName}</p>}

      <Input
        label="Description"
        name="productDescription"
        value={form.productDescription}
        onChange={handleChange}
        placeholder="Enter description"
      />
      {error.productDescription && <p className="error">{error.productDescription}</p>}

      <Input
        label="Price"
        name="productPrice"
        type="number"
        value={form.productPrice}
        onChange={handleChange}
        placeholder="Enter price"
      />
      {error.productPrice && <p className="error">{error.productPrice}</p>}

      <Input
        label="Quantity"
        name="quantity"
        type="number"
        value={form.quantity}
        onChange={handleChange}
        placeholder="Enter quantity"
      />
      {error.quantity && <p className="error">{error.quantity}</p>}

      <button type="submit" className="btn-submit">
        {editProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}
