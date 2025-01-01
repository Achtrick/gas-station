import styles from "@/styles/Chart.module.scss";
import { getError } from "@/utils/shared/getError";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

function SalesPieChart(props) {
  const isMobile = useMediaQuery("(max-width:800px)");
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("product");
  const [mostSoldData, setMostSoldData] = useState(null);

  const getSales = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("api/kpi/most-sold", { type: type });
      setMostSoldData(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    getSales();
  }, [type]);

  return (
    <div className={styles.container}>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: isMobile ? "320px" : "500px",
            height: isMobile ? "280px" : "400px",
          }}
        >
          <CircularProgress />
        </div>
      ) : mostSoldData ? (
        <>
          <div className={styles.option}>
            <a
              onClick={() => {
                setLoading(true);
                setType("product");
              }}
              style={{
                borderBottom:
                  type === "product"
                    ? "2px solid #00c7cb"
                    : "2px solid transparent",
              }}
            >
              Product
            </a>
            <a
              onClick={() => {
                setLoading(true);
                setType("category");
              }}
              style={{
                borderBottom:
                  type === "category"
                    ? "2px solid #00c7cb"
                    : "2px solid transparent",
              }}
            >
              Category
            </a>
            <a
              onClick={() => {
                setLoading(true);
                setType("subCategory");
              }}
              style={{
                borderBottom:
                  type === "subCategory"
                    ? "2px solid #00c7cb"
                    : "2px solid transparent",
              }}
            >
              Sub-category
            </a>
          </div>
          <PieChart
            width={isMobile ? 320 : 500}
            height={isMobile ? 280 : 400}
            series={[
              {
                ...mostSoldData,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -45,
                cx: 150,
                cy: 150,
              },
            ]}
          />
        </>
      ) : (
        <img
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          src="data-fail.webp"
        />
      )}
    </div>
  );
}

export default SalesPieChart;
