import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";
import { ModalSizes } from "@/components/ui-components/ModalSizes";
import XActionMenu from "@/components/ui-components/XActionMenu";
import XHr from "@/components/ui-components/XHr";
import XPagination from "@/components/ui-components/XPagination";
import styles from "@/styles/Products.module.scss";
import { getError } from "@/utils/shared/getError";
import { Clear, Inventory, QrCode, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";

export default function Products() {
  const searchField = useRef();

  const { enqueueSnackbar } = useSnackbar();
  const submitButton = useRef();

  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    designation: "",
    code: "",
    image: "",
    buyingPrice: 0,
    sellingPrice: 0,
    qty: 0,
    subCategory: "",
  });

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getSubCategories = async () => {
    try {
      const { data } = await axios.post("api/subcategories/get");
      setSubCategories(data);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("api/products/get", {
        page: page + 1,
        searchTerm: searchTerm,
      });

      setProducts(data.products);
      setCount(data.count);
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
    setFormData({
      _id: null,
      designation: "",
      code: "",
      image: "",
      buyingPrice: 0,
      sellingPrice: 0,
      qty: 0,
      subCategory: "",
    });
  };

  const submitForm = () => {
    submitButton.current.click();
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("api/products/save", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      setLoading(false);
      clearFormData();
      await getProducts();
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const remove = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("api/products/remove", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      setLoading(false);
      clearFormData();
      setModalOpen(false);
      await getProducts();
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const onQrCodeSuccess = (qrCode) => {
    setFormData({ ...formData, code: qrCode });
    setQrCodeOpen(false);
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
    getProducts();
    getSubCategories();
  }, []);

  useEffect(() => {
    getProducts();
  }, [searchTerm, page]);

  return (
    <DisconnectedGuard>
      <Layout
        loading={loading}
        scanner={{
          open: qrCodeOpen,
          closeAction: () => setQrCodeOpen(false),
          onSuccess: onQrCodeSuccess,
        }}
        modal={{
          size: ModalSizes.SMALL,
          loading: loading,
          open: modalOpen,
          title: "delete product",
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
              <Inventory style={{ width: "60px", height: "60px" }} />
              <select
                required
                className="defaultSelect"
                name="subCategory"
                value={formData.subCategory}
                onChange={onChange}
              >
                <option value="">Select a sub-category</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
              <input
                required
                type="text"
                name="designation"
                placeholder="designation"
                className="defaultInput"
                value={formData.designation}
                onChange={onChange}
              />
              <div className={styles.qrcode}>
                <input
                  required
                  type="text"
                  name="code"
                  placeholder="code"
                  className="defaultInput"
                  value={formData.code}
                  onChange={onChange}
                />
                <IconButton
                  className={styles.qrcodeButton}
                  color="black"
                  onClick={() => setQrCodeOpen(true)}
                >
                  <QrCode />
                </IconButton>
              </div>
              <div className={styles.row}>
                <div
                  className="labeledInput"
                  style={{ width: "calc(50% - 5px)" }}
                >
                  <label>buying price</label>
                  <input
                    required
                    type="number"
                    name="buyingPrice"
                    placeholder="buyingPrice"
                    className="defaultInput"
                    value={formData.buyingPrice}
                    onChange={onChange}
                  />
                </div>
                <div
                  className="labeledInput"
                  style={{ width: "calc(50% - 5px)" }}
                >
                  <label>selling price</label>
                  <input
                    required
                    type="number"
                    name="sellingPrice"
                    placeholder="sellingPrice"
                    className="defaultInput"
                    value={formData.sellingPrice}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="labeledInput">
                <label>qty</label>
                <input
                  required
                  type="number"
                  name="qty"
                  placeholder="qty"
                  className="defaultInput"
                  value={formData.qty}
                  onChange={onChange}
                />
              </div>
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
            <table className="defaultTable">
              <thead>
                <tr>
                  <th>designation</th>
                  <th>sub-category</th>
                  <th>buying price</th>
                  <th>selling price</th>
                  <th>qty</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <tr
                      key={product._id}
                      onClick={() =>
                        setFormData({
                          ...product,
                          subCategory: product.subCategory._id,
                        })
                      }
                      style={
                        product._id === formData._id
                          ? {
                              backgroundColor: "var(--first-color)",
                              color: "white",
                            }
                          : null
                      }
                    >
                      <td data-label="Designation">{product.designation}</td>
                      <td data-label="Sub Category">
                        {product.subCategory.name}
                      </td>
                      <td data-label="Buying Price">{product.buyingPrice}</td>
                      <td data-label="Selling Price">{product.sellingPrice}</td>
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
