import { useAppSelector } from "@/redux/useReduxhooks";
import { View } from "react-native";
import { Divider, List, MD3Theme, Text } from "react-native-paper";

type Tprops = {
  theme: MD3Theme;
  refresh: boolean;
};

export default function AccountInfo({ theme, refresh }: Tprops) {
  const authStore = useAppSelector((state) => state.authReducer).auth;
  return (
    <View style={{ padding: 10 }}>
      <View
        style={{
          backgroundColor: (theme.colors as any).backgroundPaper,
          borderRadius: 10,
          paddingVertical: 5,
        }}>
        <List.Item
          title={
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.primary, fontWeight: 700 }}>
              Account Information
            </Text>
          }
        />

        <Divider />

        <List.Item
          title={
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.surfaceVariant }}>
              Full Name
            </Text>
          }
          description={
            <Text variant="bodyLarge" style={{ color: theme.colors.surface }}>
              {authStore.firstname} {authStore.lastname}
            </Text>
          }
        />

        <List.Item
          title={
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.surfaceVariant }}>
              Email
            </Text>
          }
          description={
            <Text variant="bodyLarge" style={{ color: theme.colors.surface }}>
              {authStore.email}
            </Text>
          }
        />

        <List.Item
          title={
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.surfaceVariant }}>
              Phone
            </Text>
          }
          description={
            <Text variant="bodyLarge" style={{ color: theme.colors.surface }}>
              ...
            </Text>
          }
        />

        <List.Item
          title={
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.surfaceVariant }}>
              Role
            </Text>
          }
          description={
            <Text variant="bodyLarge" style={{ color: theme.colors.surface }}>
              {authStore.role_name}
            </Text>
          }
        />
      </View>
    </View>
  );
}
