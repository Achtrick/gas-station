import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";

export default function Subcategories() {
  return (
    <DisconnectedGuard>
      <Layout>Subcategories</Layout>
    </DisconnectedGuard>
  );
}
