import PosLayout from "@/core/layout/PosLayout";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function SettingScreen() {
  return (
    <PosLayout>
      {(theme) => (
        <View style={{ flex: 1 }}>
          <Text>Setting</Text>
        </View>
      )}
    </PosLayout>
  );
}
