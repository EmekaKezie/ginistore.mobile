import {
  AUTH_EMAIL,
  AUTH_PASSWORD,
  getStorage,
} from "@/core/storage/authStorage";
import { useAppSelector } from "@/redux/useReduxhooks";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { MD3Theme } from "react-native-paper";
import LoginBiometrics from "./LoginBiometrics";
import LoginClassic from "./LoginClassic";

type Tprops = {
  theme: MD3Theme;
};

export default function Login({ theme }: Tprops) {
  const settingStore = useAppSelector((state) => state.settingReducer);
  const [biometricCompactible, setBiometricCompactible] = useState(false);
  const [biometricTypes, setBiometricTypes] = useState<
    LocalAuthentication.AuthenticationType[]
  >([]);
  const [biometricEnrolled, setBiometricEnrolled] = useState(false);
  const [hasInitStorage, setHasInitStorage] = useState(false);

  useEffect(() => {
    handleInitialStorage();
    handleBiometricSupport();
  }, []);

  const handleInitialStorage = async () => {
    const email = await getStorage(AUTH_EMAIL);
    const password = await getStorage(AUTH_PASSWORD);

    if (email && password) setHasInitStorage(true);
  };

  const handleBiometricSupport = async () => {
    const compactible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    setBiometricCompactible(compactible);
    setBiometricTypes(types);
    setBiometricEnrolled(enrolled);
  };

  const handleRenderContent = () => {
    if (!hasInitStorage || !settingStore.biometricLogin) {
      return <LoginClassic theme={theme} />;
    }

    if (
      settingStore.biometricLogin &&
      hasInitStorage &&
      biometricCompactible &&
      biometricEnrolled &&
      biometricTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      )
    ) {
      return (
        <LoginBiometrics
          theme={theme}
          biometricTitle={"Face ID Required"}
          biometricSubtitle={"Use Face ID to securely log in"}
        />
      );
    } else if (
      settingStore.biometricLogin &&
      hasInitStorage &&
      biometricCompactible &&
      biometricEnrolled &&
      biometricTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      )
    ) {
      return (
        <LoginBiometrics
          theme={theme}
          biometricTitle={"Fingerprint Required"}
          biometricSubtitle={"Use Face ID to securely log in"}
        />
      );
    } else return <LoginClassic theme={theme} />;
  };
  return <View style={{ flex: 1 }}>{handleRenderContent()}</View>;
}
