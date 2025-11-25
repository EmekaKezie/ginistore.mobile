import BrandName from "@/core/brand/BrandName";
import AuthLayout from "@/core/layout/AuthLayout";
import { onLogin } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/useReduxhooks";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  Button,
  HelperText,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import * as Yup from "yup";
import { apiLogin } from "../apis/authApis";
import {
  AUTH_STORE_EMAIL,
  AUTH_STORE_ID,
  AUTH_STORE_PASSWORD,
  AUTH_STORE_TOKEN,
  getStorage,
  setStorage,
} from "../core/storage/authStorage";
import { IApiResponse } from "../types/IApp";
import { IAuth, IAuthStore, ILogin } from "../types/IAuth";

export default function LoginScreen() {
  const dispatch = useAppDispatch();

  const [biometricCompactible, setBiometricCompactible] = useState(false);
  const [biometricTypes, setBiometricTypes] = useState<
    LocalAuthentication.AuthenticationType[]
  >([]);
  const [biometricEnrolled, setBiometricEnrolled] = useState(false);
  const [biometricTitle, setBiometricTitle] = useState("");
  const [biometricSubtitle, setBiometricSubtitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInitStorage, setHasInitStorage] = useState(false);

  useEffect(() => {
    handleBiometricSupport();
    handleInitialStorage();
  }, []);

  const handleInitialStorage = async () => {
    const email = await getStorage(AUTH_STORE_EMAIL);
    const password = await getStorage(AUTH_STORE_PASSWORD);

    if (email && password) setHasInitStorage(true);
  };

  const handleBiometricSupport = async () => {
    const compactible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      setBiometricTitle("Fingerprint Required");
      setBiometricSubtitle("Use your fingerprint to securely log in");
    } else if (
      types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
    ) {
      setBiometricTitle("Face ID Required");
      setBiometricSubtitle("Use Face ID to securely log in");
    } else {
      setBiometricTitle("");
      setBiometricSubtitle("");
    }

    setBiometricCompactible(compactible);
    setBiometricTypes(types);
    setBiometricEnrolled(enrolled);
  };

  const biometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptSubtitle: biometricSubtitle,
        promptMessage: biometricTitle,
      });

      if (result.success) {
        const payload: ILogin = {
          email: (await getStorage(AUTH_STORE_EMAIL)) || "",
          password: (await getStorage(AUTH_STORE_PASSWORD)) || "",
          login_method: "classic",
        };

        await handleClassicLogin(payload);
      }
    } catch (error) {
    } finally {
    }
  };

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
        await setStorage(AUTH_STORE_EMAIL, values.email);
        await setStorage(AUTH_STORE_PASSWORD, values.password);
        await setStorage(AUTH_STORE_TOKEN, res?.data?.token);
        await setStorage(AUTH_STORE_ID, res?.data?.store_id);

        const authStore: IAuthStore = {
          isAuthenticated: true,
          auth: res.data,
        };
        dispatch(onLogin(authStore));

        router.navigate("/pos" as any);
      } else {
        console.log("falied", res.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {(theme) => (
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
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
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
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                    />
                    <HelperText
                      type="error"
                      visible={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
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
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}>
                    <View style={{ flexGrow: 1 }}>
                      <Button
                        mode="contained"
                        contentStyle={{ paddingVertical: 5 }}
                        labelStyle={{ fontWeight: "700", fontSize: 16 }}
                        style={{ borderRadius: 50 }}
                        onPress={() => formik.handleSubmit()}>
                        Login
                      </Button>
                    </View>
                    <View>
                      {hasInitStorage &&
                        biometricCompactible &&
                        biometricEnrolled &&
                        biometricTypes.includes(
                          LocalAuthentication.AuthenticationType.FINGERPRINT
                        ) && (
                          <IconButton
                            icon="fingerprint"
                            size={40}
                            onPress={biometricLogin}
                          />
                        )}

                      {hasInitStorage &&
                        biometricCompactible &&
                        biometricEnrolled &&
                        biometricTypes.includes(
                          LocalAuthentication.AuthenticationType
                            .FACIAL_RECOGNITION
                        ) && (
                          <IconButton
                            icon="face-recognition"
                            size={40}
                            onPress={biometricLogin}
                          />
                        )}
                    </View>
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
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.primary }}>
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
        </View>
      )}
    </AuthLayout>
  );
}
