import { apiLogin } from "@/apis/authApis";
import BrandName from "@/core/brand/BrandName";
import {
  AUTH_EMAIL,
  AUTH_PASSWORD,
  AUTH_TOKEN,
  getStorage,
  setStorage,
} from "@/core/storage/authStorage";
import { onLogin } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/useReduxhooks";
import { IApiResponse } from "@/types/IApp";
import { IAuth, IAuthStore, ILogin } from "@/types/IAuth";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { ActivityIndicator, MD3Theme, Modal, Portal } from "react-native-paper";

type Tprops = {
  theme: MD3Theme;
  biometricTitle: string;
  biometricSubtitle: string;
};

export default function LoginBiometrics({
  theme,
  biometricTitle,
  biometricSubtitle,
}: Tprops) {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    biometricLogin();
  }, []);

  const biometricLogin = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptSubtitle: biometricSubtitle,
      promptMessage: biometricTitle,
    });

    if (result.success) {
      const payload: ILogin = {
        email: (await getStorage(AUTH_EMAIL)) || "",
        password: (await getStorage(AUTH_PASSWORD)) || "",
        login_method: "classic",
      };

      await handleClassicLogin(payload);
    }
  };

  const handleClassicLogin = async (values: ILogin) => {
    setLoading(true);
    try {
      const res: IApiResponse<IAuth> = await apiLogin(values);
      if (res?.status === "success") {
        await setStorage(AUTH_EMAIL, values.email);
        await setStorage(AUTH_PASSWORD, values.password);
        await setStorage(AUTH_TOKEN, res?.data?.token);

        const authStore: IAuthStore = {
          isAuthenticated: true,
          auth: res.data,
        };
        dispatch(onLogin(authStore));

        //router.navigate("/pos" as any);
        router.navigate("/(navtabs)" as const);
      } else {
        Alert.alert("Failed", res.message);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Something went wrong. Please check your internet and try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <View style={{ paddingVertical: 20, paddingHorizontal: 15 }}>
        <BrandName />
      </View>

      {loading && (
        <Portal>
          <Modal
            visible={loading}
            dismissable={false}
            contentContainerStyle={{}}>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,1)", // Transparent black
                justifyContent: "center",
                alignItems: "center",
              }}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          </Modal>
        </Portal>
      )}
    </View>
  );
}
