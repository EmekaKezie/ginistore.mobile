import { useAppSelector } from "@/redux/useReduxhooks";
import { useState } from "react";
import {
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import PagerView from "react-native-pager-view";
import { IconButton, MD3Theme, ProgressBar, Text } from "react-native-paper";

type Tprops = {
  theme: MD3Theme;
};
export default function Dashboard({ theme }: Tprops) {
  const authStore = useAppSelector((state) => state.authReducer).auth;

  const salesData = [1200, 1500, 1100, 1800, 2000, 1700, 1900];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const topProducts = [
    { name: "iPhone 15", amount: 3500 },
    { name: "Samsung Galaxy S23", amount: 3100 },
    { name: "AirPods Pro", amount: 2200 },
    { name: "MacBook Pro", amount: 1800 },
    { name: "Apple Watch Series 9", amount: 1500 },
  ];

  const topCategories = [
    { name: "Electronics", amount: 9200 },
    { name: "Accessories", amount: 4800 },
    { name: "Home Appliances", amount: 3300 },
    { name: "Fashion", amount: 2600 },
    { name: "Sports", amount: 1800 },
  ];

  // Colors for progress bars
  const colors = ["#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0"];

  const [page, setPage] = useState(0);

  // Convert amount → normalized percentage
  const normalize = (list: any[]) => {
    const max = Math.max(...list.map((x) => x.amount));
    return list.map((x) => ({ ...x, progress: x.amount / max }));
  };

  const productsData = normalize(topProducts);
  const categoriesData = normalize(topCategories);

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
          <IconButton icon={"refresh-circle"} iconColor="#fff" size={25} />
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

        <View style={{ paddingHorizontal: 20, height: 500 }}>
          <PagerView
            style={{ height: 300 }}
            initialPage={0}
            onPageSelected={(e) => setPage(e.nativeEvent.position)}>
            <View
              key="1"
              style={{
                borderRadius: 10,
                padding: 20,
                backgroundColor: (theme.colors as any).backgroundPaper,
              }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 17, marginBottom: 20 }}>
                Top 5 Selling Products
              </Text>
              <View>
                {productsData?.map((item, i) => (
                  <View key={i} style={{ marginBottom: 16 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                      <Text style={{ fontSize: 15, fontWeight: "600" }}>
                        {i + 1}. {item.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#666",
                          marginBottom: 4,
                        }}>
                        ${item.amount}
                      </Text>
                    </View>
                    <ProgressBar
                      progress={item.progress}
                      color={colors[i]}
                      style={{ height: 7, borderRadius: 10 }}
                    />
                  </View>
                ))}
              </View>
            </View>

            <View
              key="2"
              style={{
                borderRadius: 10,
                padding: 20,
                backgroundColor: (theme.colors as any).backgroundPaper,
              }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 17, marginBottom: 20 }}>
                Top 5 Selling Categories
              </Text>
              <View>
                {categoriesData?.map((item, i) => (
                  <View key={i} style={{ marginBottom: 16 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                      <Text style={{ fontSize: 15, fontWeight: "600" }}>
                        {i + 1}. {item.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#666",
                          marginBottom: 4,
                        }}>
                        ${item.amount}
                      </Text>
                    </View>
                    <ProgressBar
                      progress={item.progress}
                      color={colors[i]}
                      style={{ height: 7, borderRadius: 10 }}
                    />
                  </View>
                ))}
              </View>
            </View>
          </PagerView>

          {/* Page Indicators */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingVertical: 10,
            }}>
            {[0, 1].map((i) => (
              <View
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 5,
                  backgroundColor:
                    page === i
                      ? theme.colors.primary
                      : theme.colors.surfaceDisabled,
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
