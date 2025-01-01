import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";
import SalesLineChart from "@/components/SalesLineChart";
import SalesPieChart from "@/components/SalesPieChart";
import styles from "@/styles/Dashboard.module.scss";
import { getError } from "@/utils/shared/getError";
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const isMobile = useMediaQuery("(max-width:800px)");
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("api/kpi/expiring-products");

      setProducts(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <DisconnectedGuard>
      <Layout>
        <div className={styles["charts-container"]}>
          <div
            className={styles.chart}
            style={{ height: isMobile ? "280px" : "400px" }}
          >
            <SalesLineChart />
          </div>
          <div
            className={styles.chart}
            style={{ height: isMobile ? "280px" : "400px" }}
          >
            <SalesPieChart />
          </div>
        </div>
        <div className={styles["expiring-products"]}>
          <table className="defaultTable">
            <thead>
              <tr>
                <th>designation</th>
                <th>qty</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                return (
                  <tr key={product._id}>
                    <td data-label="Designation">{product.designation}</td>
                    <td data-label="Qty">{product.qty}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Layout>
    </DisconnectedGuard>
  );
}
