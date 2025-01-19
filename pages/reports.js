import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";
import XDatePicker from "@/components/ui-components/XDatePicker";
import styles from "@/styles/Reports.module.scss";
import { getError } from "@/utils/shared/getError";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import { IconButton, Skeleton, Tooltip } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

function Reports(props) {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(moment().startOf("week"));
  const [endDate, setEndDate] = useState(moment().endOf("week"));
  const [sales, setSales] = useState([]);

  useEffect(() => {
    getReport();
  }, [startDate, endDate]);

  const getReport = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post("api/sales/get", {
        startDate: startDate,
        endDate: endDate,
      });

      setSales(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const title = `Sales Report: ${moment(startDate).format(
      "DD-MM-YYYY"
    )} to ${moment(endDate).format("DD-MM-YYYY")}`;

    doc.setFontSize(16);
    doc.text(title, 13, 20);
    doc.setFontSize(12);

    doc.add;
    doc.autoTable({
      startY: 30,
      head: [["Product", "Category", "Sub-Category", "Qty", "Date"]],
      body: sales.map((sale) => [
        sale.product,
        sale.category,
        sale.subCategory,
        sale.qty,
        moment(sale.createdAt).format("DD-MM-YYYY  HH:mm"),
      ]),
    });

    doc.save(
      `SalesReport_${moment(startDate).format("DD-MM-YYYY")}_to_${moment(
        endDate
      ).format("DD-MM-YYYY")}.pdf`
    );
  };

  return (
    <DisconnectedGuard>
      <Layout>
        <div className={styles.container}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <ArticleOutlinedIcon style={{ width: "35px", height: "35px" }} />
            <h1 className={styles.title}>Reports</h1>
          </div>
          <div className={styles.header}>
            <div className={styles.datepickers}>
              <XDatePicker
                label="Start Date"
                value={startDate}
                onChange={(date) => setStartDate(date)}
              />
              &nbsp;&nbsp;
              <XDatePicker
                label="End Date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
              />
            </div>
            &nbsp;
            <Tooltip title="Export as PDF">
              <IconButton style={{ color: "#333" }} onClick={downloadPDF}>
                <IosShareOutlinedIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className={styles.body}>
            {loading ? (
              <Skeleton height="calc(100%)" />
            ) : (
              <div className={styles.tableContainer}>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Sub-Category</th>
                      <th>Qty</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale._id}>
                        <td data-label="Product">{sale.product}</td>
                        <td data-label="Category">{sale.category}</td>
                        <td data-label="Sub-Category">{sale.subCategory}</td>
                        <td data-label="Qty">{sale.qty}</td>
                        <td data-label="Created-At">
                          {moment(sale.createdAt).format("DD-MM-YYYY  HH:mm")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </DisconnectedGuard>
  );
}

export default Reports;
