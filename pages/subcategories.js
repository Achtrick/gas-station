import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";
import { ModalSizes } from "@/components/ui-components/ModalSizes";
import XActionMenu from "@/components/ui-components/XActionMenu";
import XHr from "@/components/ui-components/XHr";
import styles from "@/styles/Scategories.module.scss";
import { getError } from "@/utils/shared/getError";
import WidgetsIcon from "@mui/icons-material/Widgets";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";

export default function SubCategories() {
  const { enqueueSnackbar } = useSnackbar();
  const submitButton = useRef();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    category: "",
    name: "",
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.get("api/categories/get");
      setCategories(data);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const getSubCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("api/subcategories/get");
      setSubCategories(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const clearFormData = async () => {
    document
      .getElementsByClassName("MuiAutocomplete-clearIndicator")[0]
      ?.click();
    setFormData({ _id: null, name: "", category: "" });
  };

  const submitForm = () => {
    submitButton.current.click();
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("api/subcategories/save", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      setLoading(false);
      clearFormData();
      await getSubCategories();
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const remove = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("api/subcategories/remove", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      setLoading(false);
      clearFormData();
      setModalOpen(false);
      await getSubCategories();
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
    getSubCategories();
  }, []);

  return (
    <DisconnectedGuard>
      <Layout
        loading={loading}
        modal={{
          size: ModalSizes.SMALL,
          loading: loading,
          open: modalOpen,
          title: "delete sub-category",
          confirmAction: remove,
          cancelAction: () => setModalOpen(false),
          onClose: () => setModalOpen(false),
        }}
      >
        <XActionMenu
          add={{ disabled: false, action: clearFormData }}
          save={{ disabled: false, action: submitForm }}
          remove={{ disabled: !formData._id, action: () => setModalOpen(true) }}
        />
        <section className={styles.container}>
          <div className={styles.dataform}>
            <form onSubmit={save}>
              <WidgetsIcon style={{ width: "60px", height: "60px" }} />
              <select
                required
                className="defaultSelect"
                name="category"
                value={formData.category}
                onChange={onChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
                  <th>category</th>
                </tr>
              </thead>
              <tbody>
                {subCategories.map((subCategory) => {
                  return (
                    <tr
                      key={subCategory._id}
                      onClick={() =>
                        setFormData({
                          ...subCategory,
                          category: subCategory.category._id,
                        })
                      }
                      style={
                        subCategory._id === formData._id
                          ? {
                              backgroundColor: "var(--first-color)",
                              color: "white",
                            }
                          : null
                      }
                    >
                      <td data-label="Name">{subCategory.name}</td>
                      <td data-label="Category">{subCategory.category.name}</td>
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
