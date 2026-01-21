import { View, Text } from "react-native";
import React from "react";
import { Redirect, Slot } from "expo-router";

export default function _layout() {
  // slot needs to be imported from expo router. it renders the child route components. so everything inside the tabs layout will be rendered here
  const isAuthenticated = false; // Replace with your authentication logic
  
  if (!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;
  return <Slot />;
}
