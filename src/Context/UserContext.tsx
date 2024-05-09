import { useAuthenticator } from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Users } from "@/API";
import { getAllUsers } from "@/Logic";

// Define the type for the user profile context
interface UserProfileContextType {
  allUserProfiles: Users[];
  currentUserProfile: Users | null;
  setCurrentUserProfile: React.Dispatch<React.SetStateAction<Users | null>>;
  usersLoading: boolean;
  authenticatedUser: AuthUser | null;
}

// Create the context
const UserContext = createContext<UserProfileContextType | undefined>(
  undefined,
);

// UserProvider component
export const UserProvider = (props: PropsWithChildren) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [allUserProfiles, setAllUserProfiles] = useState<Users[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<Users | null>(
    null,
  );
  const [usersLoading, setUsersLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setUsersLoading(true);
      getAllUsers()
        .then((userProfiles) => {
          const allUsers = userProfiles ?? [];
          setAllUserProfiles(allUsers);
          const currentUser = allUsers.filter(
            (profile) => profile.id === user.userId,
          )[0];
          setCurrentUserProfile(currentUser ?? null);
          setUsersLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user profiles", error);
          setUsersLoading(false);
        });
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        allUserProfiles,
        currentUserProfile,
        setCurrentUserProfile,
        usersLoading,
        authenticatedUser: user,
      }}
    >
      {props.children}
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
