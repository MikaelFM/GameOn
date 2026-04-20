import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

import AuthRoutes from "./auth.routes";
import UserTabRoutes from "./user.routes";
import OwnerTabRoutes from "./owner.routes";

export default function Routes() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <AuthRoutes />;
  }

  if (user.role === "owner") {
    return <OwnerTabRoutes />;
  }

  return <UserTabRoutes />;
}
``;
