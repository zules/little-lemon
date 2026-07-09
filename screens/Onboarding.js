import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Onboarding() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const validateForm = () => {
    if (!firstName) {
      setFirstNameError("First name is required.");
      setButtonEnabled(false);
      return;
    }
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(firstName.trim())) {
      setFirstNameError(
        "First name can only contain letters, spaces, hyphens, and apostrophes.",
      );
      setButtonEnabled(false);
      return;
    }
    if (!email.trim()) {
      setEmailError("Email is required.");
      setFirstNameError("");
      setButtonEnabled(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email.");
      setFirstNameError("");
      setButtonEnabled(false);
      return;
    }
    setEmailError("");
    setFirstNameError("");
    setButtonEnabled(true);
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/Logo.png")}
            style={styles.headerImage}
          />
        </View>
        <View style={styles.loginTop}>
          <Text style={styles.loginText}>Let us get to know you</Text>
        </View>
        <View style={styles.login}>
          <Text style={styles.loginText}>First Name</Text>
          <TextInput
            style={styles.loginField}
            value={firstName}
            onChangeText={setFirstName}
            onBlur={validateForm}
          />
          {firstNameError ? (
            <Text style={styles.errorText}>{firstNameError}</Text>
          ) : null}
          <Text style={styles.loginText}>Email</Text>
          <TextInput
            style={styles.loginField}
            value={email}
            onChangeText={setEmail}
            onBlur={validateForm}
            keyboardType="email-address"
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>
        <View style={styles.loginBottom}>
          <Pressable
            style={[
              styles.button,
              !buttonEnabled ? styles.buttonDisabled : null,
            ]}
          >
            <Text
              style={[
                styles.loginText,
                buttonEnabled ? { color: "white" } : null,
              ]}
            >
              Next
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loginField: {
    borderColor: "#425353",
    borderWidth: 3,
    borderRadius: 8,
  },
  loginText: {
    fontSize: 28,
    color: "#425353",
    textAlign: "center",
    paddingVertical: 5,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1d5c48",
    paddingHorizontal: 40,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: "#c3caca",
  },
  header: {
    flex: 0.24,
    backgroundColor: "#d6dbe0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerImage: {
    width: 320,
    height: 180,
    resizeMode: "contain",
  },
  loginTop: {
    flex: 0.55,
    paddingTop: 40,
    backgroundColor: "#c3caca",
  },
  loginBottom: {
    backgroundColor: "#e9e9e9",
    paddingVertical: 45,
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
  login: {
    paddingVertical: 40,
    backgroundColor: "#c3caca",
    paddingHorizontal: 40,
  },
});
