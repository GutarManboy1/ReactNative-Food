import avatar from '@/assets/images/avatar.png';
import { CreateUserPrams, SignInParams } from '@/type';
import { Account, Avatars, Client, Databases, ID, Storage } from 'react-native-appwrite';

// this is all the configs for the Appwrite client

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT, // Your Appwrite Endpoint
  platform: "com.reactnativefood.app", // Your app bundle ID
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID, // Your Appwrite Project ID
  databaseID: '69706612002a36e03a96',
  userCollectionId: 'user', //i can't get the usercollection id on appwrite dashboard
};

// this is to create a new Appwrite client instance for the application

export const client = new Client();

// the exclamation mark (!) is used to assert that the value is not null or undefined
client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform);

  // this is to create instances of the Appwrite services we will use in the application
  // a new Account service instance for user authentication and management
  // a new Database service instance for interacting with the Appwrite database
  // a new Avatars service instance for generating user avatars

export const account = new Account(client);
export const database = new Databases(client);
export const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserPrams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) {
      throw new Error('Account creation failed');
    }

    await signIn({ email, password });

    const avatarUrl = avatars.getInitials(name);

    return await database.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        email,
        name,
        avatar: avatarUrl,
        accountId: newAccount.$id,
      }
    );

  } catch (error) {
    throw new Error('Error creating user account: ' + error);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error('Error signing in: ' + error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await Databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.userCollectionId,
      [Databases.Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0]; //this will return the first document that matches the query
    
  } catch (error) {
    throw new Error('Error fetching current user: ' + error);
  }
}