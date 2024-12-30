import styles from "@/styles/components/XQrCode.module.scss";
import { Close, Light } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
function XQrCode({ closeAction, onSuccess }) {
  const [ready, setReady] = useState(false);
  const [hasFlashLight, setHasFlashLight] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);

  var html5QrCode;

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "environment" },
      })
      .then((mediaStream) => {
        const track = mediaStream.getVideoTracks()[0];
        if (track.getCapabilities().torch) {
          setHasFlashLight(true);
        }
      });

    Html5Qrcode.getCameras().then((devices) => {
      if (devices) {
        setReady(true);
      }
    });
  }, []);

  useEffect(() => {
    if (ready) {
      html5QrCode = new Html5Qrcode("reader");

      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 60,
          qrbox: { width: 250, height: 250 },
        },
        async (qrCode) => {
          html5QrCode
            .applyVideoConstraints({
              fps: 60,
              qrbox: { width: 250, height: 250 },
              advanced: [{ torch: false }],
            })
            .then(() => {
              html5QrCode.stop();
              onSuccess(qrCode);
            });
        }
      );
    }
  }, [ready]);

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <div id="reader" className={styles.reader}></div>
      </div>
      <div className={styles.actions}>
        <IconButton
          onClick={async () => {
            const config = {
              fps: 60,
              qrbox: { width: 250, height: 250 },
            };
            if (hasFlashLight) {
              config["advanced"] = [{ torch: false }];
            }
            html5QrCode.applyVideoConstraints(config).then(() => {
              setIsFlashlightOn(false);
              html5QrCode.stop();
              closeAction();
            });
          }}
          color="black"
        >
          <Close />
        </IconButton>
        {hasFlashLight ? (
          <IconButton
            onClick={async () => {
              html5QrCode
                .applyVideoConstraints({
                  fps: 60,
                  qrbox: { width: 250, height: 250 },
                  advanced: [{ torch: !isFlashlightOn }],
                })
                .then(() => {
                  setIsFlashlightOn(!isFlashlightOn);
                });
            }}
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
