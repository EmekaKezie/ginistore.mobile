import { onDecrement, onIncrement } from "@/redux/slices/testSlice";
import { useAppDispatch, useAppSelector } from "@/redux/useReduxhooks";
import { router } from "expo-router";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const theme = useTheme();
  const store = useAppSelector((state) => state.testReducer);
  const dispatch = useAppDispatch();
  //const router = useRouter();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}>
      <Text>{store.counter}</Text>
      <Button mode="contained" onPress={() => dispatch(onIncrement())}>
        Increment
      </Button>
      <Button mode="contained" onPress={() => dispatch(onDecrement())}>
        Decrement
      </Button>
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
