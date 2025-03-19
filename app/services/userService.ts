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
