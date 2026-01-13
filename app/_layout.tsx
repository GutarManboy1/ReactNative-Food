import { Stack } from "expo-router";
import "./globals.css";
import {useFonts} from "expo-font";
import { useEffect } from "react";

export default function RootLayout() {

  const [fontsLoaded, errors] = useFonts({
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  })

  useEffect(() => {
    if (errors) {
      console.error("Error loading fonts:", errors);
    }
  }, [errors]);

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }
  return <Stack />;
}
