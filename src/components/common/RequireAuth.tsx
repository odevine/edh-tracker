// components/RequireAuth.tsx
import { Redirect } from "raviger";
import { PropsWithChildren } from "react";

import { useAuth } from "@/context";

export const RequireAuth = ({ children }: PropsWithChildren<{}>) => {
  const { isAuthenticated, accessToken } = useAuth();

  // optional: handle "checking auth" state here if needed
  if (!accessToken) {
    return <Redirect to="/" />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
};
