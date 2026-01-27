import { View, Text } from "react-native";
import React from "react";
import { Redirect, Slot } from "expo-router";

import useAuthStore from "@/store/auth.store";

export default function TabLayout() {
  // slot needs to be imported from expo router. it renders the child route components. so everything inside the tabs layout will be rendered here
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;
  return <Slot />;
}
