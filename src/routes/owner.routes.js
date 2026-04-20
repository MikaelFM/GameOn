import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import OwnerHome from "../pages/OwnerPages/OwnerHome/index.js";
import OwnerSchedules from "../pages/OwnerPages/OwnerSchedules/index.js";
import OwnerClients from "../pages/OwnerPages/OwnerClients/index.js";
import OwnerProfile from "../pages/Profile";

const Tab = createBottomTabNavigator();

export default function OwnerTabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#2B9D48",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          position: "absolute",
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={OwnerHome}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="schedules"
        component={OwnerSchedules}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="clients"
        component={OwnerClients}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Feather name="clipboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={OwnerProfile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
