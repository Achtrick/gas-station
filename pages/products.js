import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";
import { ModalSizes } from "@/components/types/ModalSizes";
import XActionMenu from "@/components/ui-components/XActionMenu";
import XAutoComplete from "@/components/ui-components/XAutoComplete";
import XHr from "@/components/ui-components/XHr";
import XPagination from "@/components/ui-components/XPagination";
import styles from "@/styles/Products.module.scss";
import { getError } from "@/utils/shared/getError";
import { compressImage } from "@/utils/shared/helpers";
import { Clear, Inventory, QrCode, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "./_app";

export default function Products() {
  const { updateLayoutData } = useContext(Context);

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
    qty: "",
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

  const getProducts = async (showLoader = true) => {
    showLoader && setLoading(true);
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
    setFormData({
      _id: null,
      designation: "",
      code: "",
      image: "",
      qty: "",
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
    setFormData({ ...formData, code: qrCode[0].rawValue });
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
    !subCategories.length && getSubCategories();
    getProducts();
  }, [searchTerm, page]);

  useEffect(() => {
    getProducts(false);
  }, [updateLayoutData]);

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
          <div className={styles.row} style={{ justifyContent: "flex-start" }}>
            <Inventory style={{ width: "35px", height: "35px" }} />
            <h1 className={styles.title}>Products</h1>
          </div>
          <div className={styles.dataform}>
            <form onSubmit={save}>
              <div className={styles.row}>
                <div className={styles.col_6}>
                  <XAutoComplete
                    value={formData.subCategory}
                    options={subCategories}
                    formData={formData}
                    setFormData={setFormData}
                    optionDisplayExpr="name"
                    optionValueExpr="_id"
                    attributeKey={"subCategory"}
                    placeholder="Sub-Category"
                    required={true}
                  />
                </div>
                <div className={styles.col_6}>
                  <input
                    required
                    type="text"
                    name="designation"
                    placeholder="designation"
                    className="defaultInput"
                    value={formData.designation}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.col_6}>
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
                </div>
                <div className={styles.col_6}>
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
              </div>
              <input
                id="image-input"
                type="file"
                className="defaultInput"
                hidden
                accept="image/*"
                onChange={async (e) => {
                  e.target.files[0] &&
                    setFormData({
                      ...formData,
                      image: await compressImage(e.target.files[0]),
                    });
                }}
              />
              <label htmlFor="image-input">
                <img
                  src={
                    formData.image.length > 0
                      ? formData.image
                      : "/image-thumbnail.jpg"
                  }
                  alt={formData.name}
                />
              </label>
              <button
                ref={submitButton}
                type="submit"
                style={{ display: "none" }}
              ></button>
            </form>
          </div>
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
                  <th>Image</th>
                  <th>designation</th>
                  <th>sub-category</th>
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
                      <td data-label="Image" className={styles.prod_image}>
                        <img
                          src={
                            product.image.length > 0
                              ? product.image
                              : "image-thumbnail.jpg"
                          }
                          alt=""
                        />
                      </td>
                      <td data-label="Designation">{product.designation}</td>
                      <td data-label="Sub Category">
                        {product.subCategory.name}
                      </td>
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
