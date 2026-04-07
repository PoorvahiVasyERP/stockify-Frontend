import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getWarehouse, createWarehouse } from "../../../services/ApiService";
import Input from "../../Input/Input";
import { warehouseSchema } from "../../../validation/WarehouseValidation";
import "../Form.css";
import "./WarehouseForm.css";

export default function WarehouseForm({ onSuccess }) {
  const [errors, setErrors] = useState({});
  const [warehouse, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [form, setForm] = useState({
    warehouseId: "",
    warehouseName: "",
    warehouseCode: "",
  });

  useEffect(() => { 
    fetchWarehouse();
  }, []);

  const fetchWarehouse = async () => {
    try {
      const response = await getWarehouse();
      setWarehouses(response.data.data);
      console.log(response.data.data);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch warehouses",
      );
    }
  };

  const handleWarehouseChange = (e) => {
    const warehouseId = e.target.value;
    const warehouse = warehouses.find(
      (w) => w.warehouseId === parseInt(warehouseId),
    );

    if (warehouse) {
      setSelectedWarehouse(warehouse);
      setForm({
        ...form,
        warehouseId: warehouse.warehouseId,
        warehouseName: warehouse.warehouseName,
        warehouseCode: warehouse.warehouseCode,
      });
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.warehouseId || !form.warehouseName) {
      toast.error("Please select a warehouse and enter warehouse name");
      return;
    }

    try {
      await warehouseSchema.validate(form, { abortEarly: false });

      const payload = {
        warehouseId: parseInt(form.warehouseId),
        warehouseName: form.warehouseName,
        warehouseCode: form.warehouseCode,
      };

      const response = await createWarehouse(payload);

      toast.success(response.data.message || "Warehouse added successfully");

      setForm({
        warehouseId: "",
        warehouseName: "",
        warehouseCode: "",
      });

      setSelectedWarehouse(null);
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
            "Something went wrong",
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="warehouse-form">

      <Input
        label="Warehouse Name"
        name="warehouseName"
        value={form.warehouseName}
        onChange={handleChange}
        placeholder="Enter warehouse name"
        readOnly
      />

      <Input
        label="Warehouse Code"
        name="warehouseCode"
        value={form.warehouseCode}
        onChange={handleChange}
        placeholder="Enter warehouse code"
        readOnly
      />
      <button type="submit" className="btn-submit">
        {"Save Warehouse"}
      </button> 
    </form>
  );
}
