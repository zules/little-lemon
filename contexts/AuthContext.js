import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
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

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("@onboarding_completed", "true");
    setIsOnboardingCompleted(true);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("@onboarding_completed");
    setIsOnboardingCompleted(false);
  };

  const value = { isLoading, isOnboardingCompleted, finishOnboarding, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
