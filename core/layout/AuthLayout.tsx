import { ReactNode } from "react";
import { StatusBar } from "react-native";
import { MD3Theme, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type TProps = {
  children: (theme: MD3Theme) => ReactNode;
};
export default function AuthLayout(props: TProps) {
  const theme = useTheme();
  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]} // keep bottom safe
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: StatusBar.currentHeight,
      }}>
      {props.children(theme)}
    </SafeAreaView>
  );
}
