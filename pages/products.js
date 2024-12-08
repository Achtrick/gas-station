import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";

export default function Products() {
  return (
    <DisconnectedGuard>
      <Layout>Products</Layout>
    </DisconnectedGuard>
  );
}
