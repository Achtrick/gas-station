import styles from "@/styles/components/XQrCode.module.scss";
import { Close, Light } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
function XQrCode({ closeAction, onSuccess }) {
  const [cameraId, setCameraId] = useState("");
  const [stream, setStream] = useState(null);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);

  var html5QrCode;

  useEffect(() => {
    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        setCameraId(devices[devices.length - 1].id);
      }
    });

    return async () => {
      if (isFlashlightOn) {
        await toggleFlashlight();
      }
      setTimeout(() => {
        html5QrCode?.stop();
      }, 500);
    };
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
          if (isFlashlightOn) {
            await toggleFlashlight();
          }
          setTimeout(() => {
            html5QrCode?.stop();
            onSuccess(qrCode);
          }, 500);
        }
      );
    }
  }, [cameraId]);

  const toggleFlashlight = async () => {
    try {
      if (!stream) {
        // Start accessing the camera
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Use the rear camera
        });
        setStream(mediaStream);

        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        if (capabilities.torch) {
          await track.applyConstraints({ advanced: [{ torch: true }] });
          setIsFlashlightOn(true);
        } else {
          alert("Flashlight is not supported on this device.");
        }
      } else {
        // Turn off the flashlight
        const track = stream.getVideoTracks()[0];
        await track.applyConstraints({ advanced: [{ torch: false }] });
        track.stop(); // Stop the camera
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
        <div id="reader" className={styles.reader}></div>
      </div>
      <div className={styles.actions}>
        <IconButton
          onClick={() => {
            html5QrCode?.stop();
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
      </div>
    </div>
  );
}

export default XQrCode;
