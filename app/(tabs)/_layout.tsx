import { View, Image, Text } from "react-native";
import React from "react";
import { Redirect, Slot, Tabs } from "expo-router";
import useAuthStore from "@/store/auth.store";

import { TabBarIconProps } from "@/type";
import { images } from "@/constants";
import clsx from "clsx";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
  <View className="tab-icon">
    <Image
      source={icon}
      className="size-7"
      resizeMode="contain"
      tintColor={focused ? "#FE8C00" : "#5D5F6D"}
    />
    <Text
      className={clsx(
        "text-sm font-bold",
        focused ? "text-primary" : "text-gray-400",
      )}
    >
      {title}
    </Text>
  </View>
);

export default function TabLayout() {
  // slot needs to be imported from expo router. it renders the child route components. so everything inside the tabs layout will be rendered here
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          height: 80,
          marginHorizontal: 20,
          position: "absolute",
          bottom: 40,
          backgroundColor: "white",
          shadowColor: '1A1A1A', 
          shadowOffset: {width:0, height:2}, 
          shadowOpacity: 0.2, 
          shadowRadius: 4, 
          elevation: 5
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Home" icon={images.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Search" icon={images.search} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Cart" icon={images.bag} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Profile" icon={images.person} focused={focused} />
          ),
        }}
      />
      
    </Tabs>
  );
}
