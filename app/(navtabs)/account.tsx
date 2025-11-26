import Account from "@/components/account/Account";
import PosLayout from "@/core/layout/PosLayout";

export default function AccountScreen() {
  return <PosLayout>{(theme) => <Account theme={theme} />}</PosLayout>;
}
