import { createUser } from "@/graphql/mutations";
import { AuthUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";

import { CreateUserInput, UpdateUserInput, User } from "@/API";
import { updateUser } from "@/graphql/mutations";
import { getUser, listUsers } from "@/graphql/queries";

const client = generateClient();

export async function getAllUsersFn(): Promise<User[]> {
  try {
    const allUsersResponse = await client.graphql({
      query: listUsers,
    });

    if (allUsersResponse.data && allUsersResponse.data.listUsers) {
      return allUsersResponse.data.listUsers.items as User[];
    }
    return [];
  } catch (error) {
    console.error("Error retrieving users:", error);
    return []; // Handle errors appropriately in your application context
  }
}

export async function getCurrentUserProfileFn(
  user: AuthUser,
): Promise<User | null> {
  if (!user || !user.userId) {
    console.error("Invalid or missing user object");
    return null; // Return early if user object is not valid
  }

  try {
    const userProfileResponse = await client.graphql({
      query: getUser,
      variables: { id: user.userId },
    });

    if (userProfileResponse.data && userProfileResponse.data.getUser) {
      return userProfileResponse.data.getUser as User;
    } else {
      console.log(
        `no user profile found for ${user.userId}, creating new user profile`,
      );
      return await createUserFn(user);
    }
  } catch (error) {
    console.error("Error retrieving or creating user information:", error);
    return null; // Handle errors appropriately in your application context
  }
}

export async function createUserFn(user: AuthUser): Promise<User> {
  const newUser: CreateUserInput = {
    id: user.userId,
    displayName: user.username, // Assuming username exists
    // Add other necessary initial fields or defaults
  };

  try {
    const newUserProfileResponse = await client.graphql({
      query: createUser,
      variables: { input: newUser },
    });

    if (newUserProfileResponse.data && newUserProfileResponse.data.createUser) {
      return newUserProfileResponse.data.createUser as User;
    } else {
      throw new Error("Failed to create a new user profile.");
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error; // Re-throw to handle it in the caller
  }
}

export async function updateUserFn(
  updateData: UpdateUserInput,
): Promise<User | null> {
  try {
    const updatedUserProfileResponse = await client.graphql({
      query: updateUser,
      variables: { input: updateData },
    });

    if (
      updatedUserProfileResponse.data &&
      updatedUserProfileResponse.data.updateUser
    ) {
      return updatedUserProfileResponse.data.updateUser as User;
    } else {
      console.log(
        `no user profile found for ${updateData.id}, or update failed`,
      );
      return null;
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null; // Handle errors appropriately in your application context
  }
}
