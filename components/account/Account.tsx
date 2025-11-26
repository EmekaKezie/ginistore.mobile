import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
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
    <View>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          padding: 15,
        }}>
        <Avatar.Icon size={80} icon={"account-circle-outline"} />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }>
        <AccountInfo theme={theme} refresh={refresh} />

        <AccountSetting theme={theme} refresh={refresh} />

        <StoreSetting theme={theme} refresh={refresh} />

        <View style={{ paddingVertical: 35 }}></View>
      </ScrollView>
    </View>
  );
}
