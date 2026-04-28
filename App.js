import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/contexts/AuthContext";
import Routes from "./src/routes/routes.js";
import { initLocation } from "./src/services/locationService";

export default function App() {
  useEffect(() => { initLocation(); }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
