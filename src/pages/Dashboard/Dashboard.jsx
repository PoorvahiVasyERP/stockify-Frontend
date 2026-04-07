import { useState, useEffect } from "react";
import { getProduct } from "../../services/ApiService";
import "./Dashboard.css";

export default function Dashboard({ totalProducts, totalStock, totalValue }) {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalValue: "Rs.0",
    lowStockCount: 0,
  });

  const LOW_STOCK_THRESHOLD = 10; // Products with quantity below this are considered low stock

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProduct();
        const productsData = res.data.data || [];
        setProducts(productsData);

        // Calculate stats
        const totalProducts = productsData.length;
        const totalStock = productsData.reduce(
          (sum, product) => sum + (product.quantity || 0),
          0,
        );
        const totalValueRaw = productsData
          .reduce(
            (sum, product) =>
              sum + (product.quantity || 0) * (product.productPrice || 0),
            0,
          )
          .toFixed(2);
        const totalValue = `₹${Math.round(totalValueRaw / 1000)}K`;
        const lowStockCount = productsData.filter(
          (product) => (product.quantity || 0) < LOW_STOCK_THRESHOLD,
        ).length;

        setStats({
          totalProducts,
          totalStock,
          totalValue: `Rs.${totalValue}`,
          lowStockCount,
        });
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="dashboard">
      <h3 className="dashboard-title">INVENTORY STATS</h3>
      <div className="cards-contain">
        <div className="row">
          <div className="col-md-3">
            <div className="cards cards-teal">
              <div className="cards-info">
                <h3>TOTAL PRODUCTS</h3>
                <p>{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="cards cards-purple">
              <div className="cards-info">
                <h3>TOTAL STOCK</h3>
                <p>{stats.totalStock}</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="cards cards-blue">
              <div className="cards-info">
                <h3>TOTAL VALUE</h3>
                <p>{stats.totalValue}</p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}
