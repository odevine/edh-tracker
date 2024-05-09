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
import { getCurrentUserProfile } from "@/Logic";

// Define the type for the user profile context
interface UserProfileContextType {
  userProfile: Users | null;
  setUserProfile: React.Dispatch<React.SetStateAction<Users | null>>;
  loading: boolean;
  authenticatedUser: AuthUser | null;
}

// Create the context
const UserContext = createContext<UserProfileContextType | undefined>(
  undefined,
);

// UserProvider component
export const UserProvider = (props: PropsWithChildren) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [userProfile, setUserProfile] = useState<Users | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getCurrentUserProfile(user)
        .then((profile) => {
          setUserProfile(profile);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user profile:", error);
          setUserProfile(null);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ userProfile, setUserProfile, loading, authenticatedUser: user }}
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
