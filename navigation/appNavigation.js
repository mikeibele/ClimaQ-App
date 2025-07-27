// appNavigation.js
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../Screens/HomeScreen";
import WeatherDetailScreen from "../Screens/WeatherDetailScreen";

const Stack = createNativeStackNavigator();

function AppNavigation() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="WeatherDetailScreen" component={WeatherDetailScreen} />
        </Stack.Navigator>
    );
}

export default AppNavigation;
