import Dashboard from "@/components/dashboard/Dashboard";
import PosLayout from "@/core/layout/PosLayout";

export default function DashboardScreen() {
  return <PosLayout>{(theme) => <Dashboard theme={theme} />}</PosLayout>;
}
