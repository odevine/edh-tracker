import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, createContext, useContext, useMemo } from "react";

import { useApp, useAuth } from "@/context";
import { fetchWithAuth } from "@/logic";
import { UpdateUserInput, User } from "@/types";

interface UserContextType {
  currentUserProfile: User | null;
  allUserProfiles: User[];
  updateUserProfile: (data: UpdateUserInput) => Promise<void>;
  usersLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  const { userId, accessToken, isInitializing } = useAuth();
  const { addAppMessage } = useApp();
  const queryClient = useQueryClient();

  // fetch all users
  const { data: allUsers = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetchWithAuth("/users", accessToken);
      if (!res.ok) throw new Error("failed to fetch users");
      return res.json();
    },
    enabled: !!accessToken && !isInitializing,
  });

  // get current user
  const currentUserProfile = useMemo(() => {
    return allUsers.find((u) => u.id === userId) ?? null;
  }, [allUsers, userId]);

  // update user
  const { mutateAsync: updateUserProfile } = useMutation({
    mutationFn: async (data: UpdateUserInput) => {
      if (!userId) {
        throw new Error("no user id");
      }
      const res = await fetchWithAuth(`/users/${userId}`, accessToken, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("failed to update user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addAppMessage({
        content: "user profile updated",
        severity: "success",
      });
    },
    onError: () => {
      addAppMessage({
        title: "update failed",
        content: "check console for more details",
        severity: "error",
      });
    },
  });

  return (
    <UserContext.Provider
      value={{
        currentUserProfile,
        allUserProfiles: allUsers,
        updateUserProfile,
        usersLoading: isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
};
