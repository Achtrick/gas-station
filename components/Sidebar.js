import styles from "@/styles/Sidebar.module.scss";
import { Close } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InventoryIcon from "@mui/icons-material/Inventory";
import MenuIcon from "@mui/icons-material/Menu";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { Drawer, IconButton } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
function Sidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const logout = () => {
    dispatch({ type: "USER_LOGOUT" });
  };

  const active = (route) => {
    return route === router.pathname;
  };

  return (
    <>
      <section className={`${styles.container} ${styles.closed}`}>
        <section className={styles.navigation}>
          <IconButton style={{ color: "#000000" }} onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Link
            href={"/dashboard"}
            className={active("/dashboard") ? styles.active : ""}
          >
            <QueryStatsIcon />
          </Link>
          <Link
            href={"/categories"}
            className={active("/categories") ? styles.active : ""}
          >
            <DashboardIcon />
          </Link>
          <Link
            href={"/subcategories"}
            className={active("/subcategories") ? styles.active : ""}
          >
            <WidgetsIcon />
          </Link>
          <Link
            href={"/products"}
            className={active("/products") ? styles.active : ""}
          >
            <InventoryIcon />
          </Link>
        </section>
        <IconButton style={{ color: "#000000" }} onClick={logout}>
          <ExitToAppIcon />
        </IconButton>
      </section>
      <Drawer open={open} anchor="left">
        <section className={`${styles.container} ${styles.open}`}>
          <section className={styles.navigation}>
            <IconButton style={{ color: "#000000" }} onClick={toggleSidebar}>
              <Close />
            </IconButton>
            <Link
              href={"/dashboard"}
              className={active("/dashboard") ? styles.active : ""}
            >
              <i>
                <QueryStatsIcon />
              </i>
              Dashboard
            </Link>
            <Link
              href={"/categories"}
              className={active("/categories") ? styles.active : ""}
            >
              <i>
                <DashboardIcon />
              </i>
              Categories
            </Link>
            <Link
              href={"/subcategories"}
              className={active("/subcategories") ? styles.active : ""}
            >
              <i>
                <WidgetsIcon />
              </i>
              SubCategories
            </Link>
            <Link
              href={"/products"}
              className={active("/products") ? styles.active : ""}
            >
              <i>
                <InventoryIcon />
              </i>
              Products
            </Link>
          </section>
          <IconButton style={{ color: "#000000" }} onClick={logout}>
            <ExitToAppIcon />
          </IconButton>
        </section>
      </Drawer>
    </>
  );
}

export default Sidebar;
