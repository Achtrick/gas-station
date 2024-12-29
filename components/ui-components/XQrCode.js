import styles from "@/styles/components/XQrCode.module.scss";
import { Close, Light } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
function XQrCode({ closeAction, onSuccess }) {
  const [ready, setReady] = useState(false);
  const [stream, setStream] = useState(null);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);

  var html5QrCode;

  useEffect(() => {
    const reader = document.getElementById("reader");
    if (reader) {
      setReady(true);
    }
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
          onSuccess(qrCode);
          html5QrCode.stop();
        }
      );
    }
  }, [ready]);

  const toggleFlashlight = async () => {
    try {
      if (!stream) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setStream(mediaStream);
        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        if (capabilities.torch) {
          await track.applyConstraints({ advanced: [{ torch: true }] });
          setIsFlashlightOn(true);
        } else {
          track.stop();
          setStream(null);
          alert("Flashlight is not supported on this device.");
        }
      } else {
        const track = stream.getVideoTracks()[0];
        await track.applyConstraints({ advanced: [{ torch: false }] });
        track.stop();
        setStream(null);
        setIsFlashlightOn(false);
      }
    } catch (err) {
      alert(
        "Failed to toggle flashlight. Make sure you're using a supported device."
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <div className={styles.overlay}></div>
        <div id="reader" className={styles.reader}></div>
      </div>
      <div className={styles.actions}>
        {ready ? (
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
