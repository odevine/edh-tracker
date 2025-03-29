import { useAuthenticator } from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";
import { DateTime } from "luxon";
import { navigate } from "raviger";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { UpdateUserInput, User } from "@/API";
import { useApp } from "@/context";
import { createUserFn, getAllUsersFn, updateUserFn } from "@/logic";

// Define the type for the user profile context
interface UserContextType {
  isAdmin: boolean;
  authenticatedUser: AuthUser | null;
  allUserProfiles: User[];
  currentUserProfile: User | null;
  updateUserProfile: (updatedUser: UpdateUserInput) => Promise<void>;
  usersLoading: boolean;
  signOutUser: () => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// UserProvider component
export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  const { addAppMessage } = useApp();
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [allUserProfiles, setAllUserProfiles] = useState<User[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(
    null,
  );
  const [usersLoading, setUsersLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setUsersLoading(true);
      fetchUsers();
      updateLastOnline(user.userId);
    } else {
      setUsersLoading(false);
    }
  }, [user]);

  const signOutUser = () => {
    signOut();
    setCurrentUserProfile(null);
    navigate("/");
    addAppMessage({
      content: "user signed out",
      severity: "info",
    });
  };

  const fetchUsers = async () => {
    try {
      const users = await getAllUsersFn();
      const allUsersResponse = users ?? [];
      setAllUserProfiles(allUsersResponse);
      let currentUserProfile =
        allUsersResponse.filter((u) => u.id === user.userId)[0] ?? null;
      if (!currentUserProfile) {
        console.log("no profile found, generating new profile");
        currentUserProfile = await createUserFn(user);
        setAllUserProfiles((prevState) => [...prevState, currentUserProfile]);
      }
      setCurrentUserProfile(currentUserProfile);
    } catch (error) {
      addAppMessage({
        title: "failed to fetch user profiles",
        content: "check console for more details",
        severity: "error",
      });
      setAllUserProfiles([]);
      setCurrentUserProfile(null);
    } finally {
      setUsersLoading(false);
    }
  };

  const updateLastOnline = (userId: string) => {
    const currentDateTime = DateTime.local().toFormat(
      "yyyy-MM-dd'T'HH:mm:ss.SSSZZ",
    );
    updateUserFn({ id: userId, lastOnline: currentDateTime }).then(
      (updatedProfile) => {
        if (updatedProfile) {
          setCurrentUserProfile(updatedProfile);
          setAllUserProfiles((prevState) =>
            prevState.map((u) =>
              u.id === updatedProfile.id ? updatedProfile : u,
            ),
          );
        }
      },
    );
  };

  const updateUserProfile = async (updatedUser: UpdateUserInput) => {
    const userResponse = await updateUserFn(updatedUser);
    if (userResponse) {
      addAppMessage({
        content: "user profile has been updated",
        severity: "success",
      });
      setAllUserProfiles((prevState) =>
        prevState.map((u) => (u.id === updatedUser.id ? userResponse : u)),
      );
      if (updatedUser.id === user.userId) {
        setCurrentUserProfile(userResponse);
      }
    } else {
      addAppMessage({
        title: "failed to update user profile",
        content: "check console for more details",
        severity: "error",
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        isAdmin: currentUserProfile?.role?.includes("admin") ?? false,
        authenticatedUser: user,
        allUserProfiles,
        currentUserProfile,
        updateUserProfile,
        usersLoading,
        signOutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Export the useUser hook to access the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
