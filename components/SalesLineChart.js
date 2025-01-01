import styles from "@/styles/Chart.module.scss";
import { getError } from "@/utils/shared/getError";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { DAYS, MONTHS, TimeSpan } from "./types/TimeSpan";

function SalesLineChart(props) {
  const isMobile = useMediaQuery("(max-width:800px)");
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(TimeSpan.MONTHLY);
  const [salesData, setSalesData] = useState(null);

  const getSales = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("api/kpi/sales", { type: type });
      setSalesData(data);
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
        <CircularProgress />
      ) : salesData ? (
        <>
          <div className={styles.option}>
            <a
              onClick={() => {
                setLoading(true);
                setType(TimeSpan.DAILY);
              }}
              style={{
                borderBottom:
                  type === TimeSpan.DAILY
                    ? "2px solid #00c7cb"
                    : "2px solid transparent",
              }}
            >
              daily
            </a>
            <a
              onClick={() => {
                setLoading(true);
                setType(TimeSpan.MONTHLY);
              }}
              style={{
                borderBottom:
                  type === TimeSpan.MONTHLY
                    ? "2px solid #00c7cb"
                    : "2px solid transparent",
              }}
            >
              Monthly
            </a>
          </div>
          <LineChart
            width={isMobile ? 320 : 500}
            height={isMobile ? 280 : 300}
            series={[
              {
                data: salesData,
                label: "Sales",
                area: true,
                showMark: true,
              },
            ]}
            xAxis={[
              {
                scaleType: "point",
                data: type === TimeSpan.DAILY ? DAYS : MONTHS,
              },
            ]}
            sx={{
              [`& .${lineElementClasses.root}`]: {
                display: "none",
              },
            }}
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

export default SalesLineChart;
