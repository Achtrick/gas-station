import styles from "@/styles/Layout.module.scss";
import Sidebar from "./Sidebar";
import XLoader from "./ui-components/XLoader";

function Layout({ loading, children }) {
  return (
    <>
      {loading ? <XLoader /> : null}
      <section className={styles.container}>
        <Sidebar />
        <section className={styles.content}>{children}</section>
      </section>
    </>
  );
}

export default Layout;
