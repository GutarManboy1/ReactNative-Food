import { user } from '@/assets/icons/user.png';
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT, // Your Appwrite Endpoint
  platform: "ReactNative-Food", // Your Appwrite Project bundle ID
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID, // Your Appwrite Project ID
  databaseID: '69706612002a36e03a96',
  userCollectionId: 'user',
};
