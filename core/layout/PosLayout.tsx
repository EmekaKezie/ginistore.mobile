import { ReactNode } from "react";
import { MD3Theme, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type TProps = {
  children: (theme: MD3Theme) => ReactNode;
};
export default function PosLayout(props: TProps) {
  const theme = useTheme();

  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      {props.children(theme)}
    </SafeAreaView>
  );
}
