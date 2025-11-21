import { router } from "expo-router";
import { Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const theme = useTheme();
  //const router = useRouter();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}>
      <Button
        mode="contained"
        onPress={() => {
          router.push("/login" as any);
        }}>
        Click
      </Button>
    </SafeAreaView>
  );
}
