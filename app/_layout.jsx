import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import SplashScreen from "../screens/SplashScreen";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { isLoading, isOnboardingCompleted } = useAuth();
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isOnboardingCompleted}>
        <Stack.Screen name="home" />
        <Stack.Screen name="profile" />
      </Stack.Protected>
      <Stack.Protected guard={!isOnboardingCompleted}>
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}
