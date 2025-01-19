import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";
import { ModalSizes } from "@/components/types/ModalSizes";
import XActionMenu from "@/components/ui-components/XActionMenu";
import XAutoComplete from "@/components/ui-components/XAutoComplete";
import XHr from "@/components/ui-components/XHr";
import XPagination from "@/components/ui-components/XPagination";
import styles from "@/styles/Scategories.module.scss";
import { getError } from "@/utils/shared/getError";
import { Clear, Search } from "@mui/icons-material";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { IconButton } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";

export default function SubCategories() {
  const searchField = useRef();

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

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.post("api/categories/get");
      setCategories(data);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const getSubCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("api/subcategories/get", {
        page: page + 1,
        searchTerm: searchTerm,
      });

      setSubCategories(data.subCategories);
      setCount(data.count);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const clearFormData = async () => {
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

  const onPaginationChange = (e, page) => {
    setPage(page - 1);
  };

  const search = () => {
    setSearchTerm(searchField.current.value);
    clearFormData();
  };

  const resetSearch = () => {
    searchField.current.value = "";
    setSearchTerm("");
    clearFormData();
  };

  useEffect(() => {
    !categories.length && getCategories();
    getSubCategories();
  }, [searchTerm, page]);

  return (
    <DisconnectedGuard>
      <Layout
        loading={loading}
        modal={{
          size: ModalSizes.SMALL,
          loading: loading,
          open: modalOpen,
          title: "delete sub-category",
          content:
            "if you delete the sub-category, all products under it will be deleted !",
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
              <XAutoComplete
                value={formData.category}
                options={categories}
                formData={formData}
                setFormData={setFormData}
                optionDisplayExpr="name"
                optionValueExpr="_id"
                attributeKey={"category"}
                placeholder="Category"
                required={true}
              />
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
          <div className={styles.pagination}>
            <XPagination
              page={page}
              count={count}
              onChange={onPaginationChange}
            />
            <div className={styles.searchField}>
              <input
                className="defaultInput"
                placeholder="name..."
                ref={searchField}
              />
              <div className={styles.buttons}>
                <IconButton
                  style={{
                    color: "var(--first-color)",
                    visibility: !!searchTerm ? "visible" : "hidden",
                  }}
                  onClick={resetSearch}
                >
                  <Clear />
                </IconButton>
                <IconButton
                  style={{ color: "var(--first-color)" }}
                  onClick={search}
                >
                  <Search />
                </IconButton>
              </div>
            </div>
          </div>
          <div className={styles.datagrid}>
            <table className="responsiveTable">
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
