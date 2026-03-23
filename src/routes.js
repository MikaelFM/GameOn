import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Schedules from "./pages/Schedules";
import Options from "./pages/SignUp/options";
import FormUser from "./pages/SignUp/formUser";
import FormOwner from "./pages/SignUp/formOwner";

import { Feather } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabRoutes() {
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
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            return <Feather name="home" size={size} color={color}></Feather>;
          },
        }}
      />
      <Tab.Screen
        name="search"
        component={Search}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            return <Feather name="search" size={size} color={color}></Feather>;
          },
        }}
      />
      <Tab.Screen
        name="schedules"
        component={Schedules}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <Feather name="calendar" size={size} color={color}></Feather>
            );
          },
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            return <Feather name="user" size={size} color={color}></Feather>;
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function Routes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="options" component={Options} />
      <Stack.Screen name="formUser" component={FormUser} />
      <Stack.Screen name="formOwner" component={FormOwner} />
      <Stack.Screen name="tabs" component={TabRoutes} />
    </Stack.Navigator>
  );
}
