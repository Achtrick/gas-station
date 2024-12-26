import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import XPagination from "@/components/ui-components/XPagination";
import styles from "@/styles/Dashboard.module.scss"; // Adjust path if needed
import axios from "axios"; // Ensure axios is installed
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [mostSoldData, setMostSoldData] = useState({
    categories: [],
    subcategories: [],
    products: [],
  });

  const getProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/dashboard/get", {
        page: page + 1,
      });
      setProducts(data.products);
      setCount(data.count);

      // Aggregate data for most sold items
      const categorySales = {};
      const subcategorySales = {};
      const productSales = {};

      data.products.forEach((product) => {
        // Category aggregation
        if (!categorySales[product.category]) {
          categorySales[product.category] = product.qty;
        } else {
          categorySales[product.category] += product.qty;
        }

        // Subcategory aggregation
        if (!subcategorySales[product.subCategory.name]) {
          subcategorySales[product.subCategory.name] = product.qty;
        } else {
          subcategorySales[product.subCategory.name] += product.qty;
        }

        // Product aggregation
        if (!productSales[product.designation]) {
          productSales[product.designation] = product.qty;
        } else {
          productSales[product.designation] += product.qty;
        }
      });

      // Sort and extract the top 5
      const sortedCategories = Object.entries(categorySales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      const sortedSubcategories = Object.entries(subcategorySales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      const sortedProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      setMostSoldData({
        categories: sortedCategories,
        subcategories: sortedSubcategories,
        products: sortedProducts,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const onPaginationChange = (e, page) => {
    setPage(page - 1);
  };

  useEffect(() => {
    getProducts();
  }, [page]);

  // Chart Data Preparation for Most Sold
  const chartDataMostSold = {
    labels: [
      ...mostSoldData.categories.map((item) => `Category: ${item[0]}`),
      ...mostSoldData.subcategories.map((item) => `Sub: ${item[0]}`),
      ...mostSoldData.products.map((item) => `Product: ${item[0]}`),
    ],
    datasets: [
      {
        label: "Most Sold (Qty)",
        data: [
          ...mostSoldData.categories.map((item) => item[1]),
          ...mostSoldData.subcategories.map((item) => item[1]),
          ...mostSoldData.products.map((item) => item[1]),
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
      },
    ],
  };

  return (
    <DisconnectedGuard>
      <Layout loading={loading}>
        <section className={styles.container}>
          {/* Bar Charts */}
          <div className={styles.chartsContainer}>
            <div className={styles.chart}>
              <Bar
                data={chartDataMostSold}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                  scales: { x: { beginAtZero: true }, y: { beginAtZero: true } },
                }}
              />
            </div>
            <div className={styles.chart}>
              <Bar
                data={{
                  labels: products.map((product) => product.designation),
                  datasets: [
                    {
                      label: "Quantities",
                      data: products.map((product) => product.qty),
                      backgroundColor: "rgba(75, 192, 192, 0.6)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                  scales: { x: { beginAtZero: true }, y: { beginAtZero: true } },
                }}
              />
            </div>
          </div>
          <div className={styles.pagination}>
            <XPagination
              page={page}
              count={count}
              onChange={onPaginationChange}
            />
          </div>
          <div className={styles.datagrid}>
            <table className="defaultTable">
              <thead>
                <tr>
                  <th>id</th>
                  <th>designation</th>
                  <th>qty</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  // Determine the row class based on the qty
                  let rowClass = "";
                  if (product.qty <= 5) {
                    rowClass = styles.danger; // CSS class for danger
                  } else if (product.qty > 5 && product.qty <= 10) {
                    rowClass = styles.warning; // CSS class for warning
                  }

                  return (
                    <tr key={product._id} className={rowClass}>
                      <td data-label="Id">{product._id}</td>
                      <td data-label="Designation">{product.designation}</td>
                      <td data-label="Qty">{product.qty}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </Layout>
    </DisconnectedGuard>
  );
}
