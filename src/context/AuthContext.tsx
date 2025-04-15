// Context/AuthContext.tsx
import {
  AuthFlowType,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { navigate } from "raviger";
import { PropsWithChildren, createContext, useEffect, useState } from "react";

import { AWS_COGNITO_CLIENT_ID } from "@/constants";
import { cognitoClient } from "@/lib";

interface NewPasswordChallenge {
  email: string;
  session: string;
}

interface AuthContextType {
  userId: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  completeNewPasswordChallenge: (newPassword: string) => Promise<void>;
  newPasswordChallenge?: NewPasswordChallenge;
  forgotPassword: (email: string) => Promise<void>;
  confirmForgotPassword: (
    email: string,
    code: string,
    newPassword: string,
  ) => Promise<void>;
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
  const [newPasswordChallenge, setNewPasswordChallenge] = useState<
    NewPasswordChallenge | undefined
  >(undefined);

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

      // try refreshing session to validate token and get new one if needed
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

    // check if cognito requires the user to set a new password
    if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
      // store the necessary state and let the ui prompt for the new password
      setNewPasswordChallenge({
        email,
        // session token required for the challenge response
        session: response.Session!,
      });
      return;
    }

    const authResult = response.AuthenticationResult;
    if (!authResult) {
      throw new Error("login failed");
    }

    const { AccessToken, RefreshToken } = authResult;
    let userId: string;
    let groups: string[] = [];
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
    localStorage.removeItem("lightThemeColor");
    localStorage.removeItem("darkThemeColor");
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null);
    setIsAdmin(false);

    navigate("/");
  };

  const completeNewPasswordChallenge = async (newPassword: string) => {
    if (!newPasswordChallenge) {
      throw new Error("no password change challenge pending");
    }

    const command = new RespondToAuthChallengeCommand({
      ChallengeName: "NEW_PASSWORD_REQUIRED",
      ClientId: AWS_COGNITO_CLIENT_ID,
      ChallengeResponses: {
        USERNAME: newPasswordChallenge.email,
        NEW_PASSWORD: newPassword,
      },
      Session: newPasswordChallenge.session,
    });

    const response = await cognitoClient.send(command);
    const authResult = response.AuthenticationResult;
    if (!authResult) {
      throw new Error("password change failed");
    }

    // parse the token and update state as before
    const { AccessToken, RefreshToken } = authResult;
    let userId: string;
    let groups: string[] = [];
    let isAdmin = false;

    try {
      const payload = JSON.parse(atob(AccessToken!.split(".")[1]));
      userId = payload.sub;
      groups = payload["cognito:groups"] || [];
      isAdmin = groups.includes("admin");
    } catch {
      throw new Error("invalid access token");
    }

    // store tokens and update the authentication state
    localStorage.setItem("accessToken", AccessToken!);
    localStorage.setItem("refreshToken", RefreshToken!);
    localStorage.setItem("userId", userId);

    setAccessToken(AccessToken!);
    setRefreshToken(RefreshToken!);
    setUserId(userId);
    setIsAdmin(isAdmin);

    // clear the pending challenge after completion
    setNewPasswordChallenge(undefined);

    navigate("/users");
  };

  const forgotPassword = async (email: string) => {
    const command = new ForgotPasswordCommand({
      ClientId: AWS_COGNITO_CLIENT_ID,
      Username: email,
    });
    await cognitoClient.send(command);
  };

  const confirmForgotPassword = async (
    email: string,
    code: string,
    newPassword: string,
  ) => {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: AWS_COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });
    await cognitoClient.send(command);
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
        completeNewPasswordChallenge,
        forgotPassword,
        confirmForgotPassword,
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
