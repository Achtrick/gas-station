import styles from "@/styles/StockManager.module.scss";
import { getError } from "@/utils/shared/getError";
import { QrCode } from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { ModalSizes } from "./types/ModalSizes";
import { StockActions } from "./types/StockActions";
import XHr from "./ui-components/XHr";
import XModal from "./ui-components/XModal";
import XQrCode from "./ui-components/XQrCode";

function StockManager({ stockAction, onClose, qrCode }) {
  const { enqueueSnackbar } = useSnackbar();
  const qtyInput = useRef();

  const [product, setProduct] = useState(null);
  const [_qrCode, setQrCode] = useState("");
  const [qty, setQty] = useState("");

  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (stockAction) {
      if (qrCode) {
        setQrCode(qrCode);
      } else {
        setQrCodeOpen(true);
      }
    } else {
      cleanup();
    }
  }, [stockAction]);

  useEffect(() => {
    if (_qrCode) {
      getProduct();
    }
  }, [_qrCode]);

  useEffect(() => {
    if (!loadingProduct) {
      qtyInput.current?.focus();
    }
  }, [loadingProduct]);

  const getProduct = async () => {
    setLoadingProduct(true);
    try {
      const { data } = await axios.get(`api/products/${_qrCode}`);
      setProduct(data);
      setLoadingProduct(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingProduct(false);
    }
  };

  const executeTransaction = async () => {
    setLoadingAction(true);
    try {
      const { data } = await axios.post(`api/sales/add`, {
        _id: product._id,
        qty: qty,
        type: stockAction,
      });
      enqueueSnackbar(data.message, { variant: "success" });
      cleanup();
      setLoadingAction(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingAction(false);
    }
  };

  const cleanup = () => {
    setQrCode("");
    setQty("");
    setProduct(null);
  };

  return (
    <>
      {qrCodeOpen ? (
        <XQrCode
          closeAction={() => setQrCodeOpen(false)}
          onSuccess={(data) => {
            setQrCode(data[0].rawValue);
            setQrCodeOpen(false);
          }}
        />
      ) : null}
      <XModal
        open={stockAction !== null}
        title={stockAction === StockActions.PLUS ? "I bought" : "I sold"}
        onClose={onClose}
        size={ModalSizes.MEDIUM}
        hideControls={true}
      >
        <div className={styles.container}>
          <div className={styles.qrcode}>
            <input
              type="text"
              name="code"
              placeholder="code"
              className="defaultInput"
              value={_qrCode}
              onChange={(e) => setQrCode(e.target.value)}
            />
            <IconButton
              className={styles.qrcodeButton}
              color="black"
              onClick={() => setQrCodeOpen(true)}
            >
              <QrCode />
            </IconButton>
          </div>
          {product ? (
            <>
              <div className={styles.product}>
                <img src={product.image} />
                <div className={styles.productInfo}>
                  <p>{product.designation}</p>
                  <p>({product.qty}) items in stock</p>
                </div>
              </div>
              <XHr color="var(--first-color)" width="100%" />
              <div className={styles.form}>
                <input
                  ref={qtyInput}
                  type="text"
                  name="qty"
                  placeholder="qty"
                  className="defaultInput"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
                <Button
                  color="black"
                  style={{ color: "white", width: "100px" }}
                  variant="contained"
                  disabled={loadingAction}
                  onClick={executeTransaction}
                >
                  {loadingAction ? (
                    <CircularProgress size={"25px"} color="white" />
                  ) : (
                    "confirm"
                  )}
                </Button>
              </div>
            </>
          ) : loadingProduct ? (
            <Skeleton variant="rectangular" width="100%" height="300px" />
          ) : (
            <img src="/product-placeholder.webp" />
          )}
        </div>
      </XModal>
    </>
  );
}

export default StockManager;
