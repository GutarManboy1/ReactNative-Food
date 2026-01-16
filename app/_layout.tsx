import { SplashScreen, Stack } from "expo-router";
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
  });

  useEffect(() => {
    if (errors) throw errors;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, errors]);

  return <Stack screenOptions={{headerShown:false}} />;
}

// this file has the fonts for the app and are being  loaded before the app starts and exported in the constants file. the font is in the assests folder within the file folder