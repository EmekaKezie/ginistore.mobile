import { useAppSelector } from "@/redux/useReduxhooks";
import {
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { IconButton, MD3Theme, Text } from "react-native-paper";

type Tprops = {
  theme: MD3Theme;
};
export default function Dashboard({ theme }: Tprops) {
  const authStore = useAppSelector((state) => state.authReducer).auth;

  const salesData = [1200, 1500, 1100, 1800, 2000, 1700, 1900];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View
      style={{
        //flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: theme.colors.secondary,
      }}>
      <View
        style={{
          //borderWidth: 2,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <View>
            <Text
              variant="titleLarge"
              style={{
                color: theme.dark
                  ? theme.colors.surfaceVariant
                  : theme.colors.surfaceDisabled,
                //fontWeight: 700,
              }}>
              Welcome, {authStore.firstname}
            </Text>

            <Text
              variant="bodySmall"
              style={{
                color: theme.dark
                  ? theme.colors.surfaceDisabled
                  : theme.colors.surfaceVariant,
                //fontWeight: 700,
              }}>
              {authStore.role_name} | {authStore.store_name}
            </Text>
          </View>
          <IconButton icon={"refresh-circle"} iconColor="#fff" size={25}/>
        </View>
        <View style={{ paddingTop: 5, paddingBottom: 20 }}>
          <Text
            style={{
              color: (theme.colors as any).warning,
              fontWeight: 700,
              paddingTop: 10,
              paddingBottom: 5,
            }}>
            Today's sales revenue
          </Text>
          <Text
            variant="headlineLarge"
            style={{ color: "#fff", fontWeight: 700 }}>
            N234,569.45
          </Text>
        </View>
        {/* <View
          style={{
            //borderWidth: 1,
            //backgroundColor: (theme.colors as any).info,
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}>
          <Text style={{ color: "#fff" }}>Shortcuts</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <IconButton
                icon={"home"}
                size={25}
                style={{
                  backgroundColor: theme.colors.surfaceDisabled,
                }}
              />
              <Text variant="bodySmall">Point of sale</Text>
            </View>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <IconButton
                icon={"home"}
                size={25}
                style={{
                  backgroundColor: theme.colors.surfaceDisabled,
                }}
              />
              <Text variant="bodySmall">Point of sale</Text>
            </View>
          </View>
        </View> */}
      </View>

      <ScrollView
        style={{
          //   borderWidth: 2,
          //   borderColor: "red",
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          backgroundColor: theme.colors.background,
        }}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginBottom: 10 }}>
            Sales Revenue (Last 7 Days)
          </Text>
          <LineChart
            data={{
              labels: days,
              datasets: [
                {
                  data: salesData,
                },
              ],
            }}
            width={Dimensions.get("window").width - 40} // chart width
            height={220} // chart height
            yAxisLabel="$"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: theme.dark
                ? (theme.colors as any).backgroundPaper
                : "#fff",
              backgroundGradientFrom: theme.dark
                ? (theme.colors as any).primary
                : "#fff",
              backgroundGradientTo: theme.dark
                ? (theme.colors as any).primary
                : "#fff",
              decimalPlaces: 0, // no decimal
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              labelColor: (opacity = 1) => theme.colors.surface,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#0d6efd",
              },
            }}
            bezier // smooth curve
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
