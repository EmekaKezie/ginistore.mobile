import { MD3DarkTheme } from "react-native-paper";

const darkTheme = {
  ...MD3DarkTheme,

  colors: {
    ...MD3DarkTheme.colors,
    primary: "#8C9AB2",
    primaryLight: "#363F52",
    onPrimary: "rgb(71, 12, 122)",
    primaryContainer: "rgb(95, 43, 146)",
    onPrimaryContainer: "rgb(240, 219, 255)",

    secondary: "#C0C8D0",
    onSecondary: "rgb(54, 44, 63)",
    secondaryContainer: "rgb(77, 67, 87)",
    onSecondaryContainer: "rgb(237, 221, 246)",

    tertiary: "rgb(243, 183, 190)",
    onTertiary: "rgb(75, 37, 43)",
    tertiaryContainer: "rgb(101, 58, 65)",
    onTertiaryContainer: "rgb(255, 217, 221)",

    error: "#D32F2F",
    errorLight: "#fdd3d3",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",

    info: "#4C85F8",
    infoLight: "#d3e3fd",

    success: "#28a745",

    warning: "#FFAB00",

    background: "#121212",
    backgroundPaper: "#1A1A1A",
    onBackground: "#1A1D26",

    surface: "#E3E3E3",
    onSurface: "rgb(231, 225, 229)",
    surfaceVariant: "#ABABAB",
    onSurfaceVariant: "rgb(204, 196, 206)",
    surfaceDisabled: "#6D6D6D",
    onSurfaceDisabled: "rgba(231, 225, 229, 0.38)",

    outline: "rgb(150, 142, 152)",
    outlineVariant: "rgb(74, 69, 78)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(231, 225, 229)",
    inverseOnSurface: "rgb(50, 47, 51)",
    inversePrimary: "rgb(120, 69, 172)",
    elevation: {
      level0: "transparent",
      level1: "rgb(39, 35, 41)",
      level2: "rgb(44, 40, 48)",
      level3: "rgb(50, 44, 55)",
      level4: "rgb(52, 46, 57)",
      level5: "rgb(56, 49, 62)",
    },

    backdrop: "rgba(51, 47, 55, 0.4)",
  },
};

export default darkTheme;
