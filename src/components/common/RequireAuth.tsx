import { Redirect } from "raviger";
import { PropsWithChildren } from "react";

import { LoadingBackdrop } from "@/components";
import { useAuth } from "@/context";

export const RequireAuth = ({ children }: PropsWithChildren<{}>) => {
  const { isAuthenticated, accessToken, isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingBackdrop />;
  }

  if (!isAuthenticated || !accessToken) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
};
