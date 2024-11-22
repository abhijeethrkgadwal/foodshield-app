import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Flex } from 'native-base';
import colors from '@app/theme/colors';
import { SCREENS } from '@app/constants';
import Home from '@app/screens/home';
import { ICONS } from '@app/assets/svgs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Scan from '@app/screens/scan';
import Result from '@app/screens/result';

const Tab = createBottomTabNavigator();

const screenOptions = {
    headerShown: false,
    tabBarActiveTintColor: colors.green,
    tabBarInactiveTintColor: colors.black,
    tabBarLabelStyle: {
        fontFamily: "Poppins-Regular",
        fontSize: 12,
    },
    tabBarStyle: {
        backgroundColor: colors.white,
        borderTopWidth: 0,
        paddingTop: 5,
        paddingBottom: 0,
        height: 70,
    },

};

const Stack = createNativeStackNavigator()

const HomeScreen = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={"MainScreen"} component={Home} />
            <Stack.Screen name={SCREENS.SCAN} component={Scan} options={{unmountOnBlur: true}}/>
            <Stack.Screen name={SCREENS.RESULT} component={Result} />
        </Stack.Navigator>
    )
}

const UserBottomTabs = () => {
    return (
        <Flex flex={1} safeAreaBottom bgColor={colors.white} >
            <Tab.Navigator screenOptions={screenOptions}>
                <Tab.Screen
                    name={SCREENS.HOME}
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color }) => <ICONS.Home color={color} />
                    }}
                />
                <Tab.Screen
                    name={SCREENS.RECOMMENDED}
                    component={Home}
                    options={{
                        tabBarIcon: ({ color }) => <ICONS.Checkmark color={color} />
                    }}
                    listeners={{
                        tabPress: e => {
                            e.preventDefault();
                        },
                    }}
                />
                <Tab.Screen
                    name={SCREENS.HISTORY}
                    component={Home}
                    options={{
                        tabBarIcon: ({ color }) => <ICONS.History color={color} />
                    }}
                    listeners={{
                        tabPress: e => {
                            e.preventDefault();
                        },
                    }}
                />
                <Tab.Screen
                    name={SCREENS.CART}
                    component={Home}
                    options={{
                        tabBarIcon: ({ color }) => <ICONS.Cart color={color} />
                    }}
                    listeners={{
                        tabPress: e => {
                            e.preventDefault();
                        },
                    }}
                />
                <Tab.Screen
                    name={SCREENS.PROFILE}
                    component={Home}
                    options={{
                        tabBarIcon: ({ color }) => <ICONS.User color={color} />
                    }}
                    listeners={{
                        tabPress: e => {
                            e.preventDefault();
                        },
                    }}
                />
            </Tab.Navigator>

        </Flex>
    )
}

export default UserBottomTabs