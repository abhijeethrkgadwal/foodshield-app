import "react-native-gesture-handler";
import { useFonts } from 'expo-font';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeBaseProvider } from "native-base";
import theme from "@app/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "@app/navigation";

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
      <NativeBaseProvider theme={theme}>
        <SafeAreaProvider>
          <Navigation/>
        </SafeAreaProvider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
