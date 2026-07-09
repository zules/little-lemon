import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import SplashScreen from "../screens/SplashScreen";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const isCompleted = await AsyncStorage.getItem("@onboarding_completed");
        setIsOnboardingCompleted(isCompleted === "true");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack>
      <Stack.Protected guard={isOnboardingCompleted}>
        <Stack.Screen name="profile" />
      </Stack.Protected>
      <Stack.Protected guard={!isOnboardingCompleted}>
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}
