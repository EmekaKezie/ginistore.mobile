import { useCallback, useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { Avatar, MD3Theme } from "react-native-paper";
import AccountInfo from "./AccountInfo";
import AccountSetting from "./AccountSetting";
import StoreSetting from "./StoreSetting";

type Tprops = {
  theme: MD3Theme;
};
export default function Account({ theme }: Tprops) {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefresh(true);

    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          padding: 15,
        }}>
        <Avatar.Icon size={80} icon={"account-circle-outline"} />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }>
        <AccountInfo theme={theme} refresh={refresh} />

        <AccountSetting theme={theme} refresh={refresh} />

        <StoreSetting theme={theme} refresh={refresh} />
      </ScrollView>
    </View>
  );
}
