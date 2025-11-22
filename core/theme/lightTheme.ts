import { MD3LightTheme } from "react-native-paper";

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#4E5E75",
    primaryLight: "#d3e3fd",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(240, 219, 255)",
    onPrimaryContainer: "rgb(44, 0, 81)",

    secondary: "#082651",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(237, 221, 246)",
    onSecondaryContainer: "rgb(33, 24, 42)",

    tertiary: "rgb(128, 81, 88)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 217, 221)",
    onTertiaryContainer: "rgb(50, 16, 23)",

    error: "#D32F2F",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",

    info: "#4C85F8",

    success: "#28a745",

    warning: "#FFAB00",

    background: "#F6F9FD",
    backgroundPaper: "#FFFFFF",
    onBackground: "rgb(29, 27, 30)",

    surface: "#1F1F1F",
    onSurface: "rgb(29, 27, 30)",
    surfaceVariant: "#5E5E5E",
    onSurfaceVariant: "rgb(74, 69, 78)",

    outline: "rgb(124, 117, 126)",
    outlineVariant: "rgb(204, 196, 206)",

    shadow: "rgb(0, 0, 0)",

    scrim: "rgb(0, 0, 0)",

    inverseSurface: "rgb(50, 47, 51)",
    inverseOnSurface: "rgb(245, 239, 244)",
    inversePrimary: "rgb(220, 184, 255)",

    elevation: {
      level0: "transparent",
      level1: "rgb(248, 242, 251)",
      level2: "rgb(244, 236, 248)",
      level3: "rgb(240, 231, 246)",
      level4: "rgb(239, 229, 245)",
      level5: "rgb(236, 226, 243)",
    },

    surfaceDisabled: "rgba(29, 27, 30, 0.12)",
    onSurfaceDisabled: "rgba(29, 27, 30, 0.38)",

    backdrop: "rgba(51, 47, 55, 0.4)",
  },
};

export default lightTheme;
