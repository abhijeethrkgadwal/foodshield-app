import "react-native-gesture-handler";
import { useFonts } from 'expo-font';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "@app/navigation";
import { EmbedderProvider } from "@app/ai/EmbedderProvider";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("./src/assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-Medium": require("./src/assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Regular": require("./src/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("./src/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <EmbedderProvider>
          <Navigation/>
        </EmbedderProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
