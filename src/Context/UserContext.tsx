import { useAuthenticator } from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";
import { navigate } from "raviger";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { UpdateUsersInput, Users } from "@/API";
import { createUser, getAllUsers, updateUser } from "@/Logic";

// Define the type for the user profile context
interface UserContextType {
  authenticatedUser: AuthUser | null;
  allUserProfiles: Users[];
  currentUserProfile: Users | null;
  updateUserProfile: (updatedUser: UpdateUsersInput) => Promise<void>;
  usersLoading: boolean;
  signOutUser: () => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// UserProvider component
export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [allUserProfiles, setAllUserProfiles] = useState<Users[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<Users | null>(
    null,
  );
  const [usersLoading, setUsersLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setUsersLoading(true);
      fetchUsers();
    }
  }, [user]);

  const signOutUser = () => {
    signOut();
    setCurrentUserProfile(null);
    navigate("/");
  };

  const fetchUsers = async () => {
    try {
      const users = await getAllUsers();
      const allUsersResponse = users ?? [];
      setAllUserProfiles(allUsersResponse);
      let currentUserProfile =
        allUsersResponse.filter((u) => u.id === user.userId)[0] ?? null;
      if (!currentUserProfile) {
        console.log("No profile found, generating new profile");
        currentUserProfile = await createUser(user);
        setAllUserProfiles((prevState) => [...prevState, currentUserProfile]);
      }
      setCurrentUserProfile(currentUserProfile);
    } catch (error) {
      console.error("Failed to fetch decks:", error);
      setAllUserProfiles([]);
      setCurrentUserProfile(null);
    } finally {
      setUsersLoading(false);
    }
  };

  const updateUserProfile = async (updatedUser: UpdateUsersInput) => {
    const userResponse = await updateUser(updatedUser);
    if (userResponse) {
      setAllUserProfiles((prevState) =>
        prevState.map((u) => (u.id === updatedUser.id ? userResponse : u)),
      );
      if (updatedUser.id === user.userId) {
        setCurrentUserProfile(userResponse);
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
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
