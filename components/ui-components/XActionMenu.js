import styles from "@/styles/components/XActionMenu.module.scss";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MenuIcon from "@mui/icons-material/Menu";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

function XActionMenu({ add, save, remove }) {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button onClick={add.action} className={open ? styles.visible : null}>
          <AddIcon />
        </button>
        {!remove.disabled ? (
          <button
            onClick={remove.action}
            className={open ? styles.visible : null}
          >
            <DeleteForeverIcon />
          </button>
        ) : null}
        <button onClick={save.action} className={open ? styles.visible : null}>
          <SaveIcon />
        </button>
      </div>
      <button
        id="action-menu"
        onClick={toggleMenu}
        className={open ? styles.active : null}
      >
        <MenuIcon id="action-menu" />
      </button>
    </div>
  );
}

export default XActionMenu;
