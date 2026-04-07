import { useEffect, useState } from "react";
import DataTable from "../../components/Datatable/Datatable";
import Modal from "../../components/Modal/Modal";
import PurchaseForm from "../../components/Form/Purchase/PurchaseForm";
import { getPurchase } from "../../services/ApiService";
import { toast } from "react-toastify";

export default function PurchasePage() {
  const [purchase, setPurchase] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await getPurchase();
      setPurchase(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.message || "Error fetching purchases");
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
      <h1>Purchase List</h1>

      <button className="btn-add-product" onClick={handleAddClick}>
        Add Purchase
      </button>

      <DataTable columns={columns} data={purchase} />

      <Modal isOpen={showModal} onClose={handleModalClose} title="Add purchase">
        <PurchaseForm onSuccess={handleModalSuccess} />
      </Modal>
    </>
  );
}
