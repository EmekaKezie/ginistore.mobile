import {
    onToggleBiometricLogin,
    onToggleBiometricSale,
} from "@/redux/slices/settingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/useReduxhooks";
import { View } from "react-native";
import { Divider, List, MD3Theme, Switch, Text } from "react-native-paper";

type Tprops = {
  theme: MD3Theme;
  refresh: boolean;
};

export default function AccountSetting({ theme, refresh }: Tprops) {
  const settingStore = useAppSelector((state) => state.settingReducer);
  const dispatch = useAppDispatch();


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
              Account Setting
            </Text>
          }
        />

        <Divider />

        <List.Item
          title={
            <Text variant="bodyLarge" style={{ color: theme.colors.surface }}>
              Login with fingerprint
            </Text>
          }
          description={
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.surfaceVariant }}>
              Require fingerprint to access your account
            </Text>
          }
          right={() => (
            <Switch
              value={settingStore.biometricLogin}
              onValueChange={() => {
                dispatch(onToggleBiometricLogin(!settingStore.biometricLogin));
              }}
            />
          )}
        />

        <List.Item
          title={
            <Text variant="bodyLarge" style={{ color: theme.colors.surface }}>
              Confirm POS Sale with fingerprint
            </Text>
          }
          description={
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.surfaceVariant }}>
              Require fingerpring to confirm sales on Point-Of-Sale
            </Text>
          }
          right={() => (
            <Switch
              value={settingStore.biometricSale}
              onValueChange={() => {
                dispatch(onToggleBiometricSale(!settingStore.biometricSale));
              }}
            />
          )}
        />
      </View>
    </View>
  );
}
