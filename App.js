import "react-native-gesture-handler";
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeBaseProvider } from "native-base";
import theme from "@app/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "@app/navigation";

const queryClient = new QueryClient();


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
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <NativeBaseProvider theme={theme}>
          <SafeAreaProvider>
            <Navigation/>
          </SafeAreaProvider>
        </NativeBaseProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
