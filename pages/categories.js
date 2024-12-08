import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";
import XHr from "@/components/ui-components/XHr";
import styles from "@/styles/Categories.module.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Button, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";

export default function Categories() {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    designation: "",
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const { data } = await axios.post("api/products/add", formData);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  return (
    <DisconnectedGuard>
      <Layout>
        <section className={styles.container}>
          <div className={styles.dataform}>
            <form id="form" onSubmit={save}>
              <DashboardIcon style={{ width: "100px", height: "100px" }} />
              <input
                required
                type="text"
                name="designation"
                placeholder="designation"
                className="defaultInput"
                onChange={onChange}
              />
              <br />
              <Button
                disabled={loading}
                type="submit"
                form="form"
                style={{
                  background: "black",
                  color: "#ffffff",
                  height: "35px",
                  width: "80px",
                }}
                variant="contained"
              >
                {loading ? (
                  <CircularProgress style={{ color: "white" }} size={20} />
                ) : (
                  "save"
                )}
              </Button>
            </form>
          </div>
          <XHr color={"#000000"} />
          <div className={styles.datagrid}>
            <table className="defaultTable">
              <thead>
                <th colSpan={2}>designation</th>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
                <tr>
                  <td data-label="Designation">fake</td>
                  <td data-label="Action">delete</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </Layout>
    </DisconnectedGuard>
  );
}
