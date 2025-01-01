import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";
import SalesLineChart from "@/components/SalesLineChart";
import SalesPieChart from "@/components/SalesPieChart";
import styles from "@/styles/Dashboard.module.scss";
import { useMediaQuery } from "@mui/material";

export default function Dashboard() {
  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <DisconnectedGuard>
      <Layout>
        <div className={styles.container}>
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
      </Layout>
    </DisconnectedGuard>
  );
}
