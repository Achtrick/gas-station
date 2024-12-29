import styles from "@/styles/components/XQrCode.module.scss";
import { Close, Light } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
function XQrCode({ closeAction, onSuccess }) {
  const [cameraId, setCameraId] = useState("");
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);

  var html5QrCode;

  useEffect(() => {
    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        setCameraId(devices[devices.length - 1].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!!cameraId) {
      html5QrCode = new Html5Qrcode("reader");
      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 60,
          qrbox: { width: 250, height: 250 },
        },
        async (qrCode) => {
          onSuccess(qrCode);
          html5QrCode.stop();
        }
      );
    }
  }, [cameraId]);

  const toggleFlashlight = async () => {
    try {
      const capabilities = await html5QrCode.getRunningTrackCapabilities();
      if (capabilities.torch) {
        setIsFlashlightOn(!isFlashlightOn);
        await html5QrCode.applyVideoConstraints({
          fps: 60,
          qrbox: { width: 250, height: 250 },
          advanced: [{ torch: isFlashlightOn }],
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <div className={styles.overlay}></div>
        <div id="reader" className={styles.reader}></div>
      </div>
      <div className={styles.actions}>
        {!!cameraId ? (
          <>
            <IconButton
              onClick={() => {
                html5QrCode.stop();
                closeAction();
              }}
              color="black"
            >
              <Close />
            </IconButton>
            <IconButton
              onClick={() => {
                toggleFlashlight();
              }}
              style={{ color: isFlashlightOn ? "orange" : "black" }}
            >
              <Light />
            </IconButton>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default XQrCode;
