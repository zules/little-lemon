import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const isCompleted = await AsyncStorage.getItem("@onboarding_completed");
        setIsOnboardingCompleted(isCompleted === "true");
        const storedUser = await AsyncStorage.getItem("@user");
        if (storedUser) setUser(JSON.parse(storedUser));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const finishOnboarding = async ({ firstName, email }) => {
    const userData = { firstName, email };
    await AsyncStorage.setItem("@user", JSON.stringify(userData));
    await AsyncStorage.setItem("@onboarding_completed", "true");
    setUser(userData);
    setIsOnboardingCompleted(true);
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(["@onboarding_completed", "@user"]);
    setUser(null);
    setIsOnboardingCompleted(false);
  };

  const updateUser = async (updates) => {
    const next = { ...user, ...updates };
    await AsyncStorage.setItem("@user", JSON.stringify(next));
    setUser(next);
  };

  const value = {
    isLoading,
    isOnboardingCompleted,
    user,
    finishOnboarding,
    signOut,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
