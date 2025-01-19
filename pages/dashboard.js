import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";
import SalesLineChart from "@/components/SalesLineChart";
import SalesPieChart from "@/components/SalesPieChart";
import styles from "@/styles/Dashboard.module.scss";
import { getError } from "@/utils/shared/getError";
import { Skeleton, useMediaQuery } from "@mui/material";
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
            style={{ height: isMobile ? "330px" : "400px" }}
          >
            <div className={styles.row}>
              <h1 className={styles["chart-title"]}>Monthly/Daily Sales</h1>
              <SalesLineChart />
            </div>
          </div>
          <div
            className={styles.chart}
            style={{ height: isMobile ? "330px" : "400px" }}
          >
            <div className={styles.row}>
              <h1 className={styles["chart-title"]}>Top 10 Most Sold Items</h1>
              <SalesPieChart />
            </div>
          </div>
        </div>
        <div className={styles["expiring-products"]}>
          <h1 style={{color: "#173363"}}>Stock Report</h1>
          {loading ? (
            <Skeleton height="calc(100dvh - 520px)" />
          ) : (
            <div className={styles["table-container"]}>
              <table className="responsiveTable">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Code</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    return (
                      <tr key={product._id}>
                        <td data-label="Product">
                          <div className={styles.prod}>
                            <img
                              className={styles.prod_image}
                              src={
                                product.image.length > 0
                                  ? product.image
                                  : "image-thumbnail.jpg"
                              }
                              alt=""
                            />
                            <span className={styles.prod_title}>
                              {product.designation}
                            </span>
                          </div>
                        </td>
                        <td data-label="Code">{product.code}</td>
                        <td data-label="Qty">
                          <span
                            className={
                              product.qty <= 5
                                ? styles.prod_danger
                                : styles.prod_warning
                            }
                          >
                            {product.qty}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Layout>
    </DisconnectedGuard>
  );
}
