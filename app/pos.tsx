import PointOfSale from "@/components/pos/PointOfSale";
import PosLayout from "@/core/layout/PosLayout";

export default function PosScreen() {
  return <PosLayout>{(theme) => <PointOfSale theme={theme} />}</PosLayout>;
}
