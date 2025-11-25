import PosLayout from "@/core/layout/PosLayout";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function DashboardScreen() {
  return (
    <PosLayout>
      {(theme) => (
        <View style={{ flex: 1 }}>
          <Text>Dashboard</Text>
        </View>
      )}
    </PosLayout>
  );
}
