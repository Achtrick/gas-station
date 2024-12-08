import styles from "@/styles/Layout.module.scss";
import Sidebar from "./Sidebar";

function Layout(props) {
  return (
    <section className={styles.container}>
      <Sidebar />
      <section className={styles.content}>{props.children}</section>
    </section>
  );
}

export default Layout;
