import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";
import XActionMenu from "@/components/ui-components/XActionMenu";
import XHr from "@/components/ui-components/XHr";
import styles from "@/styles/Categories.module.scss";
import { getError } from "@/utils/shared/getError";
import DashboardIcon from "@mui/icons-material/Dashboard";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";

export default function Categories() {
  const { enqueueSnackbar } = useSnackbar();
  const submitButton = useRef();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    name: "",
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("api/categories/get");
      setCategories(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const clearFormData = async () => {
    setFormData({ _id: null, name: "" });
  };

  const submitForm = () => {
    submitButton.current.click();
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("api/categories/save", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      setLoading(false);
      clearFormData();
      await getCategories();
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const remove = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("api/categories/remove", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      setLoading(false);
      clearFormData();
      await getCategories();
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <DisconnectedGuard>
      <Layout loading={loading}>
        <XActionMenu
          add={{ disabled: false, action: clearFormData }}
          save={{ disabled: false, action: submitForm }}
          remove={{ disabled: !formData._id, action: remove }}
        />
        <section className={styles.container}>
          <div className={styles.dataform}>
            <form onSubmit={save}>
              <DashboardIcon style={{ width: "60px", height: "60px" }} />
              <input
                required
                type="text"
                name="name"
                placeholder="name"
                className="defaultInput"
                value={formData.name}
                onChange={onChange}
              />
              <button
                ref={submitButton}
                type="submit"
                style={{ display: "none" }}
              ></button>
            </form>
          </div>
          <XHr color={"var(--first-color)"} />
          <div className={styles.datagrid}>
            <table className="defaultTable">
              <thead>
                <tr>
                  <th>name</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  return (
                    <tr
                      key={category._id}
                      onClick={() => setFormData(category)}
                      style={
                        category._id === formData._id
                          ? {
                              backgroundColor: "var(--first-color)",
                              color: "white",
                            }
                          : null
                      }
                    >
                      <td data-label="Name">{category.name}</td>
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
