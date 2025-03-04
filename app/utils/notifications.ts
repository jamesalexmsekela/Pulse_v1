// app/utils/notifications.ts
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    // Get existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    // If permissions are not already granted, ask for them
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notifications!');
      return;
    }
    // Get the Expo push token
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Push Token:", token);
  } else {
    alert('Must use physical device for Push Notifications');
  }
  return token;
}
