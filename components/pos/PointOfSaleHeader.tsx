import { MD3Theme, Text } from "react-native-paper";

type Tprops = {
  theme: MD3Theme;
};

export default function PointOfSaleHeader({ theme }: Tprops) {
  return (
    <Text
      variant="headlineSmall"
      style={{ color: theme.colors.surfaceVariant, fontWeight: 700 }}>
      Point of Sale
    </Text>
  );
}
