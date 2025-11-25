import { useRef, useState } from "react";
import { StyleSheet, View, findNodeHandle } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import Modal from "react-native-modal";
import { captureRef } from "react-native-view-shot";
import { WebView } from "react-native-webview";

export default function HomeScreen() {
  const theme = useTheme();

  const viewRef = useRef<View>(null);
  const htmlRef = useRef<View>(null);

  const [isVisible, setIsVisible] = useState(false);

  const openSheet = () => setIsVisible(true);
  const closeSheet = () => setIsVisible(false);
  //const router = useRouter();

  const html = `
    <html>
      <body style="padding:20px; font-family:Arial">
        <h1>My View Content</h1>
        <p>This is exported as an image</p>
      </body>
    </html>
  `;

  const shareHTMLasImage = async () => {
    try {
      const node = findNodeHandle(htmlRef.current);
      if (!node) return;

      const uri = await captureRef(node, {
        format: "png",
        quality: 1,
      });

      await Sharing.shareAsync(uri);
    } catch (err) {
      console.log("Error capturing:", err);
    }
  };

  const generatePDF = async () => {
    const html = `
    <h1>My View Content</h1>
    <p>This is exported as a PDF</p>
  `;

    const { uri } = await Print.printToFileAsync({ html });
    console.log("PDF saved to:", uri);

    await Sharing.shareAsync(uri);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        gap: 5,
      }}>
      <Button onPress={generatePDF}>Share as PDF</Button>
      {/* <Button onPress={shareImage}>Share as Image</Button> */}

      <View style={{ flex: 1, padding: 20 }}>
        <View
          ref={htmlRef}
          style={{
            width: 300,
            height: 300,
            backgroundColor: "white",
            overflow: "hidden",
          }}>
          <WebView
            source={{ html }}
            style={{ flex: 1, backgroundColor: "white" }}
          />
        </View>

        <Button mode="contained" onPress={shareHTMLasImage}>
          Share HTML as Image
        </Button>
      </View>

      <Button mode="contained" onPress={openSheet}>
        Open Share Sheet
      </Button>

      <Modal
        isVisible={isVisible}
        onBackdropPress={closeSheet} // tap outside to close
        onSwipeComplete={closeSheet} // swipe down to close
        swipeDirection="down"
        style={styles.modal}>
        <View style={styles.sheet}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
            Share this report
          </Text>

          <Button mode="contained" onPress={() => console.log("Share Image")}>
            Share as Image
          </Button>
          <Button mode="contained" onPress={() => console.log("Share PDF")}>
            Share as PDF
          </Button>
          <Button onPress={closeSheet}>Cancel</Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  modal: { justifyContent: "flex-end", margin: 0 },
  sheet: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
