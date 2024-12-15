import styles from "@/styles/components/XQrCode.module.scss";
import { Close, Light } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
function XQrCode({ closeAction, onSuccess }) {
  const [cameraId, setCameraId] = useState("");
  const [stream, setStream] = useState(null);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);

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
      alert("Error toggling flashlight:", JSON.stringify(err));
      alert(
        "Failed to toggle flashlight. Make sure you're using a supported device."
      );
    }
  };

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
          await html5QrCode.getRunningTrackCapabilities();
          if (html5QrCode.setTorchState) {
            await html5QrCode.setTorchState(false);
          }
          onSuccess(qrCode);
          html5QrCode.stop();
        },
        async () => {
          await html5QrCode.getRunningTrackCapabilities();
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
      <div className={styles.close}>
        <IconButton
          onClick={() => {
            toggleFlashlight();
          }}
          color="black"
        >
          <Light />
        </IconButton>
      </div>
    </div>
  );
}

export default XQrCode;
