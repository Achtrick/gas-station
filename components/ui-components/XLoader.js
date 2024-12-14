import styles from "@/styles/components/XLoader.module.scss";
import { CircularProgress } from "@mui/material";
function XLoader() {
  return (
    <div className={styles.container}>
      <CircularProgress size={30} style={{ color: "var(--first-color)" }} />
    </div>
  );
}

export default XLoader;
