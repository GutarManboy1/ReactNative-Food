import { SplashScreen, Stack } from "expo-router";
import "./globals.css";
import {useFonts} from "expo-font";
import { useEffect } from "react";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://b47f7a547d432a274fffe7f0b7f4ba56@o4509309294870528.ingest.de.sentry.io/4510775765827664',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {

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
});

// this file has the fonts for the app and are being  loaded before the app starts and exported in the constants file. the font is in the assests folder within the file folder