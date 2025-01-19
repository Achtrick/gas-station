import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";
import XDatePicker from "@/components/ui-components/XDatePicker";
import styles from "@/styles/Reports.module.scss";
import { getError } from "@/utils/shared/getError";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import { IconButton, Skeleton, Tooltip } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";

function Reports(props) {
  const reportsRef = useRef();
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

  return (
    <DisconnectedGuard>
      <Layout>
        <div className={styles.container}>
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
            <ReactToPrint
              trigger={() => (
                <Tooltip title="export">
                  <IconButton style={{ color: "#333" }}>
                    <IosShareOutlinedIcon />
                  </IconButton>
                </Tooltip>
              )}
              content={() => reportsRef.current}
            />
          </div>
          <div className={styles.body}>
            {loading ? (
              <Skeleton height="calc(100%)" />
            ) : (
              <>
                <div className={styles.tableContainer}>
                  <table className="responsiveTable">
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
                      {sales.map((sale) => {
                        return (
                          <tr key={sale._id}>
                            <td data-label="Product">{sale.product}</td>
                            <td data-label="Category">{sale.category}</td>
                            <td data-label="Sub-Category">
                              {sale.subCategory}
                            </td>
                            <td data-label="Qty">{sale.qty}</td>
                            <td data-label="Created">
                              {moment(sale.createdAt).format(
                                "DD-MM-YYYY  HH:mm"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div ref={reportsRef} className={styles.reportsPrintContent}>
                  <p>
                    Sales from "{moment(startDate).format("DD-MM-YYYY")}" to "
                    {moment(endDate).format("DD-MM-YYYY")}"
                  </p>
                  <hr />
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
                      {sales.map((sale) => {
                        return (
                          <tr key={sale._id}>
                            <td>{sale.product}</td>
                            <td>{sale.category}</td>
                            <td>{sale.subCategory}</td>
                            <td>{sale.qty}</td>
                            <td>
                              {moment(sale.createdAt).format(
                                "DD-MM-YYYY  HH:mm"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </Layout>
    </DisconnectedGuard>
  );
}

export default Reports;
