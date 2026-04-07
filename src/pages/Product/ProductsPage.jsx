import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import DataTable from "../../components/Datatable/Datatable";
import {
  getProduct,
  deleteProduct,
  uploadExcel,
  downloadExcel,
} from "../../services/ApiService";
import Modal from "../../components/Modal/Modal";
import ProductModalForm from "../../components/Form/Product/ProductModalForm";
import "./Product.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CommentBox from "../../components/CommentBox/CommentBox";
import Button from "../../components/Button/Button";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentProduct, setCommentProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const res = await getProduct();
      setProducts(res.data.data || []);
      console.log("Fetched products:", res.data.data);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error fetching products",
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleModalSuccess = () => {
    setEditProduct(null);
    setShowModal(false);
    fetchProducts();
  };

  const handleModalClose = () => {
    setEditProduct(null);
    setShowModal(false);
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteProduct(id);
      toast.success(response.data.message || "Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error deleting product",
      );
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadExcel(file);
      toast.success(res.data?.message || "Products uploaded successfully");
      await fetchProducts();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload file",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDownloadClick = async () => {
    setDownloading(true);
    try {
      const res = await downloadExcel();

      const blob = new Blob([res.data], {
        type:
          res.headers["content-type"] ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const disposition = res.headers["content-disposition"];
      let filename = "products.xlsx";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to download file",
      );
    } finally {
      setDownloading(false);
    }
  };

  const columns = [
    { header: "Sr.No.", accessor: (_, index) => index + 1 },
    { header: "Name", accessor: (row) => row.productName },
    { header: "Description", accessor: (row) => row.productDescription },
    { header: "Price", accessor: (row) => row.productPrice },
    { header: "Quantity", accessor: (row) => row.quantity },
    {
      header: "Actions",
      accessor: (row) => (
        <>
          <Button variant="edit" onClick={() => handleEditClick(row)}>
            Edit
          </Button>
          <Button
            variant="delete"
            onClick={() => handleDelete(row.productId)}
          >
            Delete
          </Button>
          <Button
            variant="comment"
            onClick={() => {
              setCommentProduct(row);
              setShowCommentModal(true);
            }}
          >
            Comment
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <h1>Products List</h1>
      <Button variant="add" onClick={() => setShowModal(true)}>
        Add Product
      </Button>
      <Button
        variant="upload"
        onClick={handleUploadClick}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Excel"}
      </Button>
      <Button
        variant="download"
        onClick={handleDownloadClick}
        disabled={downloading}
      >
        {downloading ? "Downloading..." : "Download Excel"}
      </Button>
      <input
        type="file"
        accept=".xls,.xlsx"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <DataTable columns={columns} data={products} />
      {createPortal(
        <Modal
          isOpen={showModal}
          onClose={handleModalClose}
          title={editProduct ? "Edit Product" : "Add Product"}
        >
          <ProductModalForm
            onSuccess={handleModalSuccess}
            editProduct={editProduct}
          />
        </Modal>,
        document.body,
      )}
      {createPortal(
        <Modal
          isOpen={showCommentModal}
          onClose={() => {
            setShowCommentModal(false);
            setCommentProduct(null);
          }}
          title="Comments"
        >
          {commentProduct && (
            <CommentBox
              moduleType="PRODUCT"
              moduleId={commentProduct.productId}
            />
          )}
        </Modal>,
        document.body,
      )}
    </>
  );
}
