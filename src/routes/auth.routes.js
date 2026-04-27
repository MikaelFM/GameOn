import { createStackNavigator } from "@react-navigation/stack";

import Login from "../pages/Login";
import Options from "../pages/SignUp/options";
import Cadastro from "../pages/SignUp/formUser";
import QuadraForm from "../pages/OwnerPages/QuadraForm/index.js";

const Stack = createStackNavigator();

export default function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="options" component={Options} />
      <Stack.Screen name="formUser" component={Cadastro} />
      <Stack.Screen name="formOwner" component={QuadraForm} />
    </Stack.Navigator>
  );
}
