import avatar from '@/assets/images/avatar.png';
import { CreateUserPrams, SignInParams } from '@/type';
import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

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
    console.log("createUser: creating account...");
    const newAccount = await account.create(ID.unique(), email, password, name);
    console.log("createUser: account created:", newAccount.$id);

    if (!newAccount) {
      throw new Error('Account creation failed');
    }

    console.log("createUser: signing in...");
    await signIn({ email, password });
    console.log("createUser: signed in successfully");

    console.log("createUser: generating avatar URL...");
    const avatarUrl = `${appwriteConfig.endpoint}/avatars/initials?name=${encodeURIComponent(name)}&project=${appwriteConfig.projectId}`;
    console.log("createUser: avatar URL:", avatarUrl);

    console.log("createUser: creating database document...");
    console.log("Database ID:", appwriteConfig.databaseID);
    console.log("Collection ID:", appwriteConfig.userCollectionId);

    const doc = await database.createDocument(
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
    console.log("createUser: document created:", doc.$id);
    return doc;

  } catch (error) {
    console.error("createUser error:", error);
    throw new Error('Error creating user account: ' + error);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    // Delete any existing session first to avoid "session is active" error
    try {
      await account.deleteSession('current');
    } catch {
      // No existing session, that's fine
    }

    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error('Error signing in: ' + error);
  }
};

export const getCurrentUser = async () => {
  try {
    console.log("getCurrentUser: fetching account...");
    const currentAccount = await account.get();
    console.log("getCurrentUser: account found:", currentAccount.$id);

    if (!currentAccount) throw new Error('No account found');

    console.log("getCurrentUser: querying database for user document...");
    console.log("Database ID:", appwriteConfig.databaseID);
    console.log("Collection ID:", appwriteConfig.userCollectionId);

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    console.log("getCurrentUser: found documents:", currentUser.documents.length);

    if (currentUser.documents.length > 0) {
      return currentUser.documents[0];
    }

    // No user document found - create one from account info
    console.log("getCurrentUser: creating user document...");
    const avatarUrl = `${appwriteConfig.endpoint}/avatars/initials?name=${encodeURIComponent(currentAccount.name || currentAccount.email)}&project=${appwriteConfig.projectId}`;
    return await database.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        email: currentAccount.email,
        name: currentAccount.name || currentAccount.email,
        avatar: avatarUrl,
        accountId: currentAccount.$id,
      }
    );

  } catch (error) {
    console.error("getCurrentUser error:", error);
    throw new Error('Error fetching current user: ' + error);
  }
}