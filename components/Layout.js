import styles from "@/styles/Layout.module.scss";
import Sidebar from "./Sidebar";
import XLoader from "./ui-components/XLoader";
import XModal from "./ui-components/XModal";
import XQrCode from "./ui-components/XQrCode";

function Layout({ loading, children, modal, scanner }) {
  return (
    <>
      <XModal
        open={modal?.open ?? false}
        title={modal?.title}
        cancelAction={modal?.cancelAction}
        confirmAction={modal?.confirmAction}
        formId={modal?.formId}
        hideControls={modal?.hideControls}
        loading={modal?.loading}
        size={modal?.size}
        onClose={modal?.onClose}
      >
        {modal?.content}
      </XModal>
      {loading ? <XLoader /> : null}
      {scanner?.open ? (
        <XQrCode
          closeAction={scanner?.closeAction}
          onSuccess={scanner?.onSuccess}
        />
      ) : null}
      <section className={styles.container}>
        <Sidebar />
        <section className={styles.content}>{children}</section>
      </section>
    </>
  );
}

export default Layout;
