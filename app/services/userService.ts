// app/services/userService.ts
import { db } from "../utils/firebaseConfig";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { UserProfile } from "../models/User";

// Create a new user profile in Firestore.
// This function writes a new document to the "users" collection with the given user profile data.
export const createUserProfile = async (userProfile: UserProfile) => {
  // The document ID will be the user's UID.
  await setDoc(doc(db, "users", userProfile.id), userProfile);
};

// Retrieve a user profile from Firestore by user ID.
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
};

// Update an existing user profile with the given updates.
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  await updateDoc(doc(db, "users", userId), updates);
};

// Delete a user profile from Firestore.
export const deleteUserProfile = async (userId: string) => {
  await deleteDoc(doc(db, "users", userId));
};

/**
 * Retrieves an array of user profiles for given user IDs.
 * @param userIds - An array of user IDs.
 * @returns A promise that resolves with an array of UserProfile objects.
 */
export const getUserProfiles = async (userIds: string[]): Promise<UserProfile[]> => {
  const profiles = await Promise.all(
    userIds.map(async (userId) => {
      const docSnap = await getDoc(doc(db, "users", userId));
      if (docSnap.exists()) {
        // Get the data and override the id with the userId from the loop.
        const data = docSnap.data() as UserProfile;
        const { id, ...rest } = data;
        return { id: userId, ...rest };
      }
      return null;
    })
  );
  // Filter out any null values with a type guard.
  return profiles.filter((p): p is UserProfile => p !== null);
};