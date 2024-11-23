import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SCREENS } from "@app/constants";
import colors from "@app/theme/colors";
import Onboarding from "@app/screens/onboarding";
import UserBottomTabs from "./user-bottom-tabs";
import Result from "@app/screens/result";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.gray,
  },
};

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
};

const Navigation = () => {

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={SCREENS.ONBOARDING} component={Onboarding} />
        <Stack.Screen name={SCREENS.USER_BOTTOM_TABS} component={UserBottomTabs} />
        <Stack.Screen name={SCREENS.RESULT} component={Result} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
