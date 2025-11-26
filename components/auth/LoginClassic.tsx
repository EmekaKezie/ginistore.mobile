import BrandName from "@/core/brand/BrandName";
import { onLogin } from "@/redux/slices/authSlice";
import { onToggleBiometricLogin } from "@/redux/slices/settingSlice";
import { useAppDispatch } from "@/redux/useReduxhooks";
import { router } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { Alert, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import {
  ActivityIndicator,
  Button,
  HelperText,
  MD3Theme,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import * as Yup from "yup";
import { apiLogin } from "../../apis/authApis";
import {
  AUTH_EMAIL,
  AUTH_PASSWORD,
  AUTH_TOKEN,
  getStorage,
  setStorage,
} from "../../core/storage/authStorage";
import { IApiResponse } from "../../types/IApp";
import { IAuth, IAuthStore, ILogin } from "../../types/IAuth";

type Tprops = {
  theme: MD3Theme;
};

export default function LoginClassic({ theme }: Tprops) {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const handleClassicLogin = async (values: ILogin) => {
    setLoading(true);
    try {
      values = {
        ...values,
        email: values.email,
        password:
          "6105f4e00b39948849b8c2fd8f945259d7c02ffe3a5adbe78461b935cd5f",
      };

      const res: IApiResponse<IAuth> = await apiLogin(values);
      if (res?.status === "success") {
        const authEmail = await getStorage(AUTH_EMAIL);
        const authPassword = await getStorage(AUTH_PASSWORD);

        if (!authEmail || !authPassword) {
          handleSecureStorage(values.email, values.password, res?.data?.token);
          handleAuthStorage(res.data);
          setBottomSheetOpen(true);
        } else {
          handleSecureStorage(values.email, values.password, res?.data?.token);
          handleAuthStorage(res.data);
          router.navigate("/(navtabs)" as const);
        }

        //router.navigate("/pos" as any);
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

  const handleSecureStorage = async (
    email: string,
    password: string,
    token: string
  ) => {
    await setStorage(AUTH_EMAIL, email);
    await setStorage(AUTH_PASSWORD, password);
    await setStorage(AUTH_TOKEN, token);
  };

  const handleAuthStorage = (auth: IAuth) => {
    const authStore: IAuthStore = {
      isAuthenticated: true,
      auth: auth,
    };
    dispatch(onLogin(authStore));
  };

  const handleAcceptBiometricSetup = () => {
    setBottomSheetOpen(true);
    router.navigate("/(navtabs)" as const);
  };

  const handleRejectBiometricSetup = () => {
    dispatch(onToggleBiometricLogin(true));
    router.navigate("/(navtabs)" as const);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 15,
        display: "flex",
      }}>
      <View style={{ paddingVertical: 20 }}>
        <BrandName />
      </View>
      <View
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center", // vertical centering
          gap: 5,
        }}>
        <View style={{ marginBottom: 30, alignItems: "center" }}>
          <Text
            variant="headlineMedium"
            style={{
              color: theme.colors.secondary,
              fontWeight: 700,
            }}>
            Login to your account
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.primary,
              fontWeight: 600,
            }}>
            Provide your email and password to continue
          </Text>
        </View>

        <Formik
          initialValues={{
            email: "",
            password: "",
            login_method: "classic",
          }}
          validationSchema={Yup.object({
            email: Yup.string().required("Email is required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={(values: ILogin) => handleClassicLogin(values)}>
          {(formik) => (
            <View>
              <View style={{}}>
                <TextInput
                  mode="outlined"
                  label="Email"
                  value={formik.values.email}
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                />
                <HelperText
                  type="error"
                  visible={
                    formik.touched.email && Boolean(formik.errors.email)
                  }>
                  {formik.errors.email}
                </HelperText>
              </View>

              <View style={{}}>
                <TextInput
                  mode="outlined"
                  label="Password"
                  secureTextEntry
                  value={formik.values.password}
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                />
                <HelperText
                  type="error"
                  visible={
                    formik.touched.password && Boolean(formik.errors.password)
                  }>
                  {formik.errors.password}
                </HelperText>
              </View>
              <View style={{ marginBottom: 30, marginLeft: "auto" }}>
                <Text
                  style={{
                    //color: (theme.colors as any).info,
                    fontWeight: 700,
                  }}>
                  Forgot Password?
                </Text>
              </View>
              <View>
                <Button
                  mode="contained"
                  contentStyle={{ paddingVertical: 5 }}
                  labelStyle={{ fontWeight: "700", fontSize: 16 }}
                  style={{ borderRadius: 50 }}
                  onPress={() => formik.handleSubmit()}>
                  Login
                </Button>
              </View>
            </View>
          )}
        </Formik>

        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            justifyContent: "center",
          }}>
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
            Don't have an account yet?{" "}
          </Text>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.error, fontWeight: 700 }}>
            Create Account
          </Text>
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

      {bottomSheetOpen && (
        <ReactNativeModal
          isVisible={bottomSheetOpen}
          // onBackdropPress={openBottomSheet} // tap outside to close
          // onSwipeComplete={closeBottomSheet} // swipe down to close
          swipeDirection="down"
          style={{ justifyContent: "flex-end", margin: 0 }}>
          <View
            style={{
              backgroundColor: "white",
              padding: 10,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <Text
              variant="titleMedium"
              style={{
                textAlign: "center",
                padding: 20,
                color: theme.colors.surfaceVariant,
              }}>
              Would you like to setup your biometrics for future login
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                paddingHorizontal: 20,
              }}>
              <Button
                mode="outlined"
                textColor={theme.colors.error}
                theme={{ colors: { outline: theme.colors.error } }}
                style={{ flex: 1 }}
                onPress={handleRejectBiometricSetup}>
                No. Do it later
              </Button>

              <Button
                mode="outlined"
                textColor={theme.colors.primary}
                style={{ flex: 1 }}
                onPress={handleAcceptBiometricSetup}>
                Yes. Set it up
              </Button>
            </View>
          </View>
        </ReactNativeModal>
      )}
    </View>
  );
}
