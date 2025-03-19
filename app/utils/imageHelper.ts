// app/utils/imageHelper.ts
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { storage } from "./firebaseConfig"; // Ensure firebaseConfig exports storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Opens the image picker and returns the selected image URI.
 * Returns null if the user cancels or if permissions are not granted.
 */
export const pickImage = async (): Promise<string | null> => {
  // Request permission to access the media library
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission required", "Permission to access the media library is required!");
    return null;
  }

  // Launch the image library using an array for media types.
  // We cast the array as unknown first to satisfy TypeScript.
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
  });

  // Check if the user canceled the picker
  if ("canceled" in result && result.canceled) {
    return null;
  }

  // For successful results, use the assets array to get the uri.
  if ("assets" in result && result.assets.length > 0) {
    return result.assets[0].uri;
  }
  return null;
};

/**
 * Uploads an image to Firebase Storage and returns its download URL.
 * @param uri The local URI of the image to upload.
 * @param userId The current user's UID, used to form a unique storage path.
 * @returns The download URL of the uploaded image.
 */
export const uploadImageAsync = async (uri: string, userId: string): Promise<string> => {
  try {
    // Fetch the image from the local URI and convert it to a blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create a reference in Firebase Storage (e.g., under "profilePictures/{userId}")
    const storageRef = ref(storage, `profilePictures/${userId}`);

    // Upload the blob to Firebase Storage
    await uploadBytes(storageRef, blob);

    // Get and return the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    throw new Error("Image upload failed: " + error.message);
  }
};
