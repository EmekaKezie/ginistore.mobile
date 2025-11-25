import { Tabs } from "expo-router";
import { Icon, useTheme } from "react-native-paper";

export default function NavTabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          color: theme.colors.onSurfaceVariant,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashbaord",
          tabBarIcon: () => <Icon source="view-dashboard-outline" size={25} />,
        }}
      />
      <Tabs.Screen
        name="pos"
        options={{
          title: "Point of Sale",
          
          headerShown: false,
          tabBarIcon: () => <Icon source={"shopping-outline"} size={25} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Settings",
          tabBarIcon: () => <Icon source="cog" size={25} />,
        }}
      />
    </Tabs>
  );
}
