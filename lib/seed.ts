import { ID } from "react-native-appwrite";
import { appwriteConfig, database, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await database.listDocuments({
        databaseId: appwriteConfig.databaseID,
        collectionId,
    });

    await Promise.all(
        list.documents.map((doc) =>
            database.deleteDocument({
                databaseId: appwriteConfig.databaseID,
                collectionId,
                documentId: doc.$id,
            })
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles({ bucketId: appwriteConfig.bucketID });

    await Promise.all(
        list.files.map((file) =>
            storage.deleteFile({
                bucketId: appwriteConfig.bucketID,
                fileId: file.$id,
            })
        )
    );
}

async function uploadImageToStorage(imageUrl: string) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: blob.type,
        size: blob.size,
        uri: imageUrl,
    };

    const file = await storage.createFile({
        bucketId: appwriteConfig.bucketID,
        fileId: ID.unique(),
        file: fileObj,
    });

    // Construct the file view URL manually
    return `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketID}/files/${file.$id}/view?project=${appwriteConfig.projectId}`;
}

async function seed(): Promise<void> {
    // 1. Clear all
    await clearAll(appwriteConfig.categoriesCollectionId);
    await clearAll(appwriteConfig.customizationsCollectionId);
    await clearAll(appwriteConfig.menuCollectionId);
    await clearAll(appwriteConfig.menuCustomizationsCollectionId);
    await clearStorage();

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await database.createDocument({
            databaseId: appwriteConfig.databaseID,
            collectionId: appwriteConfig.categoriesCollectionId,
            documentId: ID.unique(),
            data: cat,
        });
        categoryMap[cat.name] = doc.$id;
    }

    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const doc = await database.createDocument({
            databaseId: appwriteConfig.databaseID,
            collectionId: appwriteConfig.customizationsCollectionId,
            documentId: ID.unique(),
            data: {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            },
        });
        customizationMap[cus.name] = doc.$id;
    }

    // 4. Create Menu Items
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
        const uploadedImage = await uploadImageToStorage(item.image_url);

        const doc = await database.createDocument({
            databaseId: appwriteConfig.databaseID,
            collectionId: appwriteConfig.menuCollectionId,
            documentId: ID.unique(),
            data: {
                name: item.name,
                description: item.description,
                image_url: uploadedImage,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            },
        });

        menuMap[item.name] = doc.$id;

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
            await database.createDocument({
                databaseId: appwriteConfig.databaseID,
                collectionId: appwriteConfig.menuCustomizationsCollectionId,
                documentId: ID.unique(),
                data: {
                    menu: doc.$id,
                    customizations: customizationMap[cusName],
                },
            });
        }
    }

    console.log("✅ Seeding complete.");
}

export default seed;