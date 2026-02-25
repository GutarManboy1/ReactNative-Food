import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import useAuthStore from "@/store/auth.store";
import { images } from "@/constants";
import { account } from "@/lib/appwrite";
import CustomButton from "@/components/CustomButton";

const ProfileRow = ({
  icon,
  label,
  value,
  onPress,
}: {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    className="flex-row items-center py-4 border-b border-gray-100"
    onPress={onPress}
    disabled={!onPress}
  >
    <Image
      source={icon}
      className="size-6"
      resizeMode="contain"
      tintColor="#5D5F6D"
    />
    <Text className="paragraph-medium text-dark-100 ml-4 flex-1">{label}</Text>
    {value && <Text className="paragraph-medium text-gray-200">{value}</Text>}
  </TouchableOpacity>
);

const profile = () => {
  const { user, setIsAuthenticated, setUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="pb-28 px-5 pt-5">
        {/* Header */}
        <Text className="small-bold uppercase text-primary">Profile</Text>
        <Text className="paragraph-bold text-dark-100 mt-0.5">
          Your Account
        </Text>

        {/* Avatar & Name */}
        <View className="items-center mt-8 mb-6">
          <Image
            source={images.avatar}
            className="size-24 rounded-full"
            resizeMode="cover"
          />
          <Text className="h3-bold text-dark-100 mt-4">
            {user?.name || "Guest"}
          </Text>
          <Text className="paragraph-medium text-gray-200 mt-1">
            {user?.email || ""}
          </Text>
        </View>

        {/* Info Rows */}
        <View className="mt-4">
          <ProfileRow
            icon={images.person}
            label="Full Name"
            value={user?.name || "Guest"}
          />
          <ProfileRow
            icon={images.envelope}
            label="Email"
            value={user?.email || "N/A"}
          />
          <ProfileRow
            icon={images.phone}
            label="Phone"
            value={user?.phone || "Not set"}
          />
          <ProfileRow
            icon={images.location}
            label="Delivery Address"
            value="Tokyo"
          />
        </View>

        {/* Logout Button */}
        <View className="mt-10">
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            style="!bg-red-500"
            leftIcon={
              <Image
                source={images.logout}
                className="size-5 mr-2"
                resizeMode="contain"
                tintColor="#ffffff"
              />
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
