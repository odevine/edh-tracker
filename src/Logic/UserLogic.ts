import { createUsers, updateUsers } from "@/graphql/mutations";
import { getUsers } from "@/graphql/queries";
import { AuthUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";

import { CreateUsersInput, UpdateUsersInput, Users } from "@/API";

const client = generateClient();

/**
 * Retrieves or creates a user profile based on the provided user object.
 * @param {AuthUser} user - The authenticated user object.
 * @returns {Promise<Users | null>} The user profile object or null in case of errors.
 */
export async function getCurrentUserProfile(
  user: AuthUser,
): Promise<Users | null> {
  if (!user || !user.userId) {
    console.error("Invalid or missing user object");
    return null; // Return early if user object is not valid
  }

  try {
    const userProfileResponse = await client.graphql({
      query: getUsers,
      variables: { id: user.userId },
    });

    if (userProfileResponse.data && userProfileResponse.data.getUsers) {
      return userProfileResponse.data.getUsers as Users;
    } else {
      console.log(
        `No user profile found for ${user.userId}, creating new user profile`,
      );
      return await createUserProfile(user);
    }
  } catch (error) {
    console.error("Error retrieving or creating user information:", error);
    return null; // Handle errors appropriately in your application context
  }
}

/**
 * Creates a new user profile with default data.
 * @param {AuthUser} user - The authenticated user object.
 * @returns {Promise<Users>} The newly created user profile.
 */
async function createUserProfile(user: AuthUser): Promise<Users> {
  const newUser: CreateUsersInput = {
    id: user.userId,
    displayName: user.username, // Assuming username exists
    // Add other necessary initial fields or defaults
  };

  try {
    const newUserProfileResponse = await client.graphql({
      query: createUsers,
      variables: { input: newUser },
    });

    if (
      newUserProfileResponse.data &&
      newUserProfileResponse.data.createUsers
    ) {
      return newUserProfileResponse.data.createUsers as Users;
    } else {
      throw new Error("Failed to create a new user profile.");
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error; // Re-throw to handle it in the caller
  }
}

/**
 * Updates an existing user profile with the provided data.
 * @param {string} userId - The ID of the user to update.
 * @param {UpdateUsersInput} updateData - The data to update the user profile with.
 * @returns {Promise<Users | null>} The updated user profile or null in case of errors.
 */
export async function updateUserProfile(
  userId: string,
  updateData: UpdateUsersInput,
): Promise<Users | null> {
  if (!userId) {
    console.error("Invalid or missing user ID");
    return null; // Return early if the user ID is not valid
  }

  try {
    const updatedUserProfileResponse = await client.graphql({
      query: updateUsers,
      variables: { input: updateData },
    });

    if (
      updatedUserProfileResponse.data &&
      updatedUserProfileResponse.data.updateUsers
    ) {
      return updatedUserProfileResponse.data.updateUsers as Users;
    } else {
      console.log(`No user profile found for ${userId}, or update failed`);
      return null;
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null; // Handle errors appropriately in your application context
  }
}
