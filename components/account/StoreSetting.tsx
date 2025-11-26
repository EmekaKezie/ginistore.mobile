import { ApiGetStoresByUserId, ApiSwitchStore } from "@/apis/storeApi";
import { AUTH_TOKEN, setStorage } from "@/core/storage/authStorage";
import { onLogin } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/useReduxhooks";
import { IApiResponse } from "@/types/IApp";
import { IAuth, IAuthStore } from "@/types/IAuth";
import { IStoreAccessView, ISwitchStore } from "@/types/IStore";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import {
  ActivityIndicator,
  Divider,
  List,
  MD3Theme,
  Modal,
  Portal,
  RadioButton,
  Text,
} from "react-native-paper";

type Tprops = {
  theme: MD3Theme;
  refresh: boolean;
};

export default function StoreSetting({ theme, refresh }: Tprops) {
  const authStore = useAppSelector((state) => state.authReducer).auth;
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [storeList, setStoreList] = useState<IStoreAccessView[]>([]);
  const [storeSelected, setStoreSelected] = useState<IStoreAccessView>();
  const [checked, setChecked] = useState("");
  const [switching, setSwitching] = useState<boolean>(false);

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchStores();
    }
  }, [refresh]);

  const fetchStores = async () => {
    setLoading(false);
    try {
      const res: IApiResponse<IStoreAccessView[]> = await ApiGetStoresByUserId(
        authStore.user_id
      );
      if (res?.status === "success") {
        setStoreList(res?.data);
        const active = res?.data?.find(
          (x) => x.store_id === authStore.store_id
        );
        setChecked(active?.store_id!);
      } else {
        console.log(res?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchStore = async (i: IStoreAccessView) => {
    setSwitching(true);
    try {
      const payload: ISwitchStore = {
        company_id: i.company_id,
        employee_id: i.employee_id,
        store_access_id: i.store_access_id,
        store_id: i.store_id,
      };

      const res: IApiResponse<IAuth> = await ApiSwitchStore(payload);
      if (res?.status === "success") {
        await setStorage(AUTH_TOKEN, res?.data?.token);
        setChecked(res?.data?.store_id);
        const authStore: IAuthStore = {
          isAuthenticated: true,
          auth: res.data,
        };
        dispatch(onLogin(authStore));
      } else {
        Alert.alert("Failed", res?.message || "");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again");
    } finally {
      setSwitching(false);
    }
  };

  const handleRenderContent = () => {
    if (loading) {
      return <Text>Loading stores</Text>;
    } else {
      if (storeList?.length < 1) {
        return <Text>"No store"</Text>;
      } else {
        return renderContent();
      }
    }
  };

  const renderContent = () => {
    return (
      <View
        style={{
          backgroundColor: (theme.colors as any).backgroundPaper,
          //   borderWidth: 1,
          //   borderColor: theme.colors.surfaceDisabled,
          borderRadius: 10,
          paddingTop: 5,
          paddingBottom: 15,
        }}>
        <List.Item
          title={
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.primary, fontWeight: 700 }}>
              Manage Store
            </Text>
          }
        />
        <Divider />

        {storeList?.map((i) => {
          return (
            <List.Item
              style={{
                paddingVertical: 0,
                height: 40, // reduce row height manually
              }}
              contentStyle={{
                paddingVertical: 0,
                marginVertical: 0,
              }}
              titleStyle={{
                marginVertical: 0,
              }}
              key={i?.store_id}
              title={
                <Text
                  variant="bodyLarge"
                  style={{ color: theme.colors.surface }}>
                  {i?.store_name}
                </Text>
              }
              left={() => (
                <RadioButton
                  value={i?.store_id}
                  status={checked === i?.store_id ? "checked" : "unchecked"}
                  onPress={() => {
                    setStoreSelected(i);
                    handleSwitchStore(i);
                  }}
                />
              )}
            />
          );
        })}
      </View>
    );
  };
  return (
    <View style={{ padding: 10 }}>
      {handleRenderContent()}

      {switching && (
        <Portal>
          <Modal
            visible={switching}
            dismissable={false}
            contentContainerStyle={{}}>
            <View
              style={{
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <View>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{ color: "#fff" }}>
                  Switching to {storeSelected?.store_name}
                </Text>
              </View>
            </View>
          </Modal>
        </Portal>
      )}
    </View>
  );
}
