import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";

import AuthRoutes from "./auth.routes";
import UserTabRoutes from "./user.routes";
import OwnerTabRoutes from "./owner.routes";

export default function Routes() {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#2B9D48" />
      </View>
    );
  }

  if (!user) {
    return <AuthRoutes />;
  }

  if (user.role === "owner") {
    return <OwnerTabRoutes />;
  }

  return <UserTabRoutes />;
}
