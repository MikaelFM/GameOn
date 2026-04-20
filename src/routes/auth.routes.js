import { createStackNavigator } from "@react-navigation/stack";

import Login from "../pages/Login";
import Options from "../pages/SignUp/options";
import Cadastro from "../pages/SignUp/formUser";
import FormOwner from "../pages/SignUp/formOwner";

const Stack = createStackNavigator();

export default function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="options" component={Options} />
      <Stack.Screen name="formUser" component={Cadastro} />
      <Stack.Screen name="formOwner" component={FormOwner} />
    </Stack.Navigator>
  );
}
