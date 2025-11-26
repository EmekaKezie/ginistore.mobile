import Login from "@/components/auth/Login";
import AuthLayout from "@/core/layout/AuthLayout";

export default function LoginScreen() {
  return <AuthLayout>{(theme) => <Login theme={theme} />}</AuthLayout>;
}
