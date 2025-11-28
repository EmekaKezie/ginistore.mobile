import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function BrandNameWhite() {
  const theme = useTheme();
  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Text
        variant="headlineMedium"
        style={{
          color: (theme.colors as any).warning,
          fontWeight: 700,
        }}>
        Gini
      </Text>
      <Text
        variant="headlineMedium"
        style={{
          color: theme.colors.error,
          fontWeight: 700,
        }}>
        sto
      </Text>
      <Text
        variant="headlineMedium"
        style={{
          color: (theme.colors as any).success,
          fontWeight: 700,
        }}>
        re
      </Text>
    </View>
  );
}
