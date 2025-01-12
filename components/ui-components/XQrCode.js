import styles from "@/styles/components/XQrCode.module.scss";
import { Close, Light } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
function XQrCode({ closeAction, onSuccess }) {
  const [ready, setReady] = useState(false);
  const [hasFlashLight, setHasFlashLight] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);

  var html5QrCode;

  // useEffect(() => {
  //   Html5Qrcode.getCameras().then((devices) => {
  //     if (devices) {
  //       setReady(true);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   if (ready) {
  //     html5QrCode = new Html5Qrcode("reader");

  //     html5QrCode.start(
  //       { facingMode: "environment" },
  //       {
  //         fps: 60,
  //         qrbox: { width: 250, height: 250 },
  //       },
  //       (qrCode) => {
  //         html5QrCode.stop().then(() => {
  //           onSuccess(qrCode);
  //         });
  //       }
  //     );
  //   }
  // }, [ready]);

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        {/* <div id="reader" className={styles.reader}></div> */}
        <Scanner allowMultiple={true} formats={['aztec' ,
    'code_128' ,
    'code_39' ,
    'code_93' ,
    'codabar' ,
    'databar' ,
    'databar_expanded' ,
    'data_matrix' ,
    'dx_film_edge' ,
    'ean_13' ,
    'ean_8' ,
    'itf' ,
    'maxi_code' ,
    'micro_qr_code' ,
    'pdf417' ,
    'qr_code' ,
    'rm_qr_code' ,
    'upc_a' ,
    'upc_e' ,
    'linear_codes' ,
    'matrix_codes' ,
    'unknown']} onScan={(result) => console.log(result)} />;
      </div>
      <div className={styles.actions}>
        <IconButton
          onClick={() => {
            html5QrCode.stop().then(() => {
              closeAction();
            });
          }}
          color="black"
        >
          <Close />
        </IconButton>
        {hasFlashLight ? (
          <IconButton
            onClick={() => {}}
            style={{ color: isFlashlightOn ? "orange" : "black" }}
          >
            <Light />
          </IconButton>
        ) : null}
      </div>
    </div>
  );
}

export default XQrCode;
