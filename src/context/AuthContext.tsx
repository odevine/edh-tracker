// Context/AuthContext.tsx
import {
  AuthFlowType,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { navigate } from "raviger";
import { PropsWithChildren, createContext, useEffect, useState } from "react";

import { AWS_COGNITO_CLIENT_ID } from "@/constants";
import { cognitoClient } from "@/lib";

interface AuthContextType {
  userId: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  accessToken: string | null;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUserId = localStorage.getItem("userId");

    if (storedAccessToken && storedRefreshToken && storedUserId) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUserId(storedUserId);

      try {
        const payload = JSON.parse(atob(storedAccessToken.split(".")[1]));
        const groups: string[] = payload["cognito:groups"] || [];
        setIsAdmin(groups.includes("admin"));
      } catch {
        console.warn("failed to decode JWT during session restore");
      }

      // 👇 TRY refreshing session to validate token and get new one if needed
      refreshSession().catch((err) => {
        console.warn("token refresh failed", err);
        signOut();
      });
    }

    setIsInitializing(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: AWS_COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);
    const authResult = response.AuthenticationResult;
    if (!authResult) {
      throw new Error("login failed");
    }

    const { AccessToken, RefreshToken } = authResult;

    let userId: string;
    let groups: string[];
    let isAdmin = false;
    try {
      const payload = JSON.parse(atob(AccessToken!.split(".")[1]));
      userId = payload.sub;
      groups = payload["cognito:groups"] || [];
      isAdmin = groups.includes("admin");
    } catch {
      throw new Error("invalid access token");
    }

    // Store tokens after login
    localStorage.setItem("accessToken", AccessToken!);
    localStorage.setItem("refreshToken", RefreshToken!);
    localStorage.setItem("userId", userId);

    setAccessToken(AccessToken!);
    setRefreshToken(RefreshToken!);
    setUserId(userId);
    setIsAdmin(isAdmin);

    navigate("/users");
  };

  const signOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null);
    setIsAdmin(false);

    navigate("/");
  };

  const refreshSession = async () => {
    const storedRefreshToken =
      refreshToken || localStorage.getItem("refreshToken");
    if (!storedRefreshToken) {
      throw new Error("no refresh token available");
    }

    const command = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: AWS_COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: storedRefreshToken,
      },
    });

    const response = await cognitoClient.send(command);
    const authResult = response.AuthenticationResult;

    if (authResult?.AccessToken) {
      localStorage.setItem("accessToken", authResult.AccessToken);
      setAccessToken(authResult.AccessToken);

      try {
        const payload = JSON.parse(atob(authResult.AccessToken.split(".")[1]));
        const groups: string[] = payload["cognito:groups"] || [];
        setIsAdmin(groups.includes("admin"));
      } catch {
        console.warn("failed to decode JWT after refresh");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        accessToken,
        signIn,
        signOut,
        refreshSession,
        isAdmin,
        isInitializing,
        isAuthenticated: !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
