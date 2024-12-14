import styles from "@/styles/components/XQrCode.module.scss";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
function XQrCode({ closeAction, onSuccess }) {
  const [cameraId, setCameraId] = useState("");

  useEffect(() => {
    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        setCameraId(devices[0].id);
      }
    });
  }, []);

  useEffect(() => {
    const reader = document.getElementById("reader");
    reader.style.width = "100%";
    reader.style.height = "100%";
  }, []);

  useEffect(() => {
    if (cameraId.length) {
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCode.start(cameraId, null, (qrCode) => {
        onSuccess(qrCode);
        html5QrCode.stop();
      });
    }
  }, [cameraId]);

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <div className={styles.overlay}></div>
        <div id="reader" className={styles.reader}></div>
      </div>
      <div className={styles.close}>
        <IconButton onClick={closeAction} color="black">
          <Close />
        </IconButton>
      </div>
    </div>
  );
}

export default XQrCode;
