// app/services/imageService.ts
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { storage } from "../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MediaType } from "expo-image-picker";

export const pickImage = async (): Promise<string | null> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission required", "Access to media library is required!");
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 1,
  });
  if ("canceled" in result && result.canceled) {
    return null;
  }
  if ("assets" in result && result.assets.length > 0) {
    return result.assets[0].uri;
  }
  return null;
};

// Upload function accepts a folder parameter for distinguishing storage paths
export const uploadImage = async (
  uri: string,
  folder: string,
  uniqueSuffix: string
): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    // Dynamic storage reference using the folder name and unique suffix
    const storageRef = ref(storage, `${folder}/${uniqueSuffix}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    throw new Error("Image upload failed: " + error.message);
  }
};
