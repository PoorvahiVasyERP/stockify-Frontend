import { useEffect, useState } from "react";
import DataTable from "../../components/Datatable/Datatable";
import Modal from "../../components/Modal/Modal";
import SalesForm from "../../components/Form/Sales/SalesForm";
import { getSales } from "../../services/ApiService";
import { toast } from "react-toastify";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await getSales();
      setSales(res.data.data || []);
    } catch (err) {
      console.error(err);
       toast.error(err?.response?.data?.message || err?.message || "Error fetching sales");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleModalSuccess = () => {
    setShowModal(false);
    fetchProducts();
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleAddClick = () => {
    setShowModal(true);
  };

  const columns = [
    {
      header: "Sr.No.",
      accessor: (_, index) => index + 1,
    },
    {
      header: "Name",
      accessor: (row) => row.product?.productName,
    },
    {
      header: "Quantity",
      accessor: (row) => row.quantity,
    },
    {
      header: "Total Price",
      accessor: (row) => row.total,
    },
    {
      header: "Purchased On",
      accessor: (row) => row.createdOn,
    },
  ];

  return (
    <>
      <h1>Sales List</h1>

      <button className="btn-add-product" onClick={handleAddClick}>
        Add Sales
      </button>

      <DataTable columns={columns} data={sales} />

      <Modal isOpen={showModal} onClose={handleModalClose} title="Add Sales">
        <SalesForm onSuccess={handleModalSuccess} />
      </Modal>
    </>
  );
}
