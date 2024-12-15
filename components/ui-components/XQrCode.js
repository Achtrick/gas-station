import styles from "@/styles/components/XQrCode.module.scss";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
function XQrCode({ closeAction, onSuccess }) {
  const [cameraId, setCameraId] = useState("");

  var html5QrCode;

  useEffect(() => {
    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        alert(JSON.stringify(devices));
        setCameraId(devices[devices.length - 1].id);
      }
    });
  }, []);

  useEffect(() => {
    const reader = document.getElementById("reader");
    reader.style.width = "100%";
    reader.style.height = "100%";
  }, []);

  useEffect(() => {
    if (!!cameraId) {
      html5QrCode = new Html5Qrcode("reader");
      html5QrCode.start(
        cameraId,
        null,
        async (qrCode) => {
          if (html5QrCode.setTorchState) {
            await html5QrCode.setTorchState(false);
          }
          onSuccess(qrCode);
          html5QrCode.stop();
        },
        async () => {
          if (html5QrCode.setTorchState) {
            await html5QrCode.setTorchState(true);
          }
        }
      );
    }
  }, [cameraId]);

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <div className={styles.overlay}></div>
        <div id="reader" className={styles.reader}></div>
      </div>
      <div className={styles.close}>
        <IconButton
          onClick={() => {
            html5QrCode.stop();
            closeAction();
          }}
          color="black"
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
}

export default XQrCode;
