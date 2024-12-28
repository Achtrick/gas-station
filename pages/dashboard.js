import DisconnectedGuard from "@/components/guards/disconnectedGuard";
import Layout from "@/components/Layout";

export default function Dashboard() {
  return (
    <DisconnectedGuard>
      <Layout></Layout>
    </DisconnectedGuard>
  );
}
