import styles from "@/styles/components/XQrCode.module.scss";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";

function XQrCode({ closeAction, onSuccess }) {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      const backCameras = videoDevices.filter((device) =>
        device.label.toLowerCase().includes("back")
      );

      const backCamera = backCameras[0]

      setDeviceId(backCamera ? backCamera.deviceId : videoDevices[0]?.deviceId);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <Scanner
          allowMultiple={true}
          formats={[
            "aztec",
            "code_128",
            "code_39",
            "code_93",
            "codabar",
            "databar",
            "databar_expanded",
            "data_matrix",
            "dx_film_edge",
            "ean_13",
            "ean_8",
            "itf",
            "maxi_code",
            "micro_qr_code",
            "pdf417",
            "qr_code",
            "rm_qr_code",
            "upc_a",
            "upc_e",
            "linear_codes",
            "matrix_codes",
            "unknown",
          ]}
          onScan={onSuccess}
          constraints={{
            video: {
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 },
            },
          }}
          deviceId={deviceId}
        />
      </div>
      <div className={styles.actions}>
        <IconButton
          onClick={() => {
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
