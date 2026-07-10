import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user, updateUser, signOut } = useAuth();
  const [pageData, setPageData] = useState(user);

  const [phoneError, setPhoneError] = useState(null);

  const validatePhoneNumber = () => {
    const strictPhoneRegex = /^[0-9]{10}$/;
    if (!strictPhoneRegex.test(pageData?.phoneNumber)) {
      setPhoneError("Please provide a 10 digit phone number.");
      return;
    }
    setPhoneError(null);
  };

  const handleFormChange = (field, value) => {
    setPageData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const imagePicked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!imagePicked.canceled) {
      setPageData({ ...pageData, avatar: imagePicked.assets[0].uri });
    }
  };

  const removeImage = () => {
    setPageData({ ...pageData, avatar: null });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header avatarUri={pageData?.avatar} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentArea}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.h2}>Personal Information</Text>
        <Text style={styles.h3}>Avatar</Text>
        <View style={styles.horizontal}>
          {pageData?.avatar ? (
            <Image source={{ uri: pageData.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholder}>
              <Text>No Image</Text>
            </View>
          )}
          <Pressable style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonWhiteText}>Choose</Text>
          </Pressable>
          <Pressable style={styles.buttonSecondary} onPress={removeImage}>
            <Text style={styles.buttonSecondaryText}>Remove</Text>
          </Pressable>
        </View>
        <Text style={styles.h3}>First Name</Text>
        <TextInput
          style={styles.textField}
          value={pageData?.firstName ?? ""}
          onChangeText={(v) => handleFormChange("firstName", v)}
        />
        <Text style={styles.h3}>Last Name</Text>
        <TextInput
          style={styles.textField}
          value={pageData?.lastName ?? ""}
          onChangeText={(v) => handleFormChange("lastName", v)}
        />
        <Text style={styles.h3}>Email</Text>
        <TextInput
          style={styles.textField}
          value={pageData?.email ?? ""}
          onChangeText={(v) => handleFormChange("email", v)}
          keyboardType="email-address"
        />
        <Text style={styles.h3}>Phone Number</Text>
        {phoneError ? <Text style={{ color: "red" }}>{phoneError}</Text> : null}
        <TextInput
          style={styles.textField}
          value={pageData?.phoneNumber ?? ""}
          onChangeText={(v) => handleFormChange("phoneNumber", v)}
          keyboardType="phone-pad"
          onBlur={validatePhoneNumber}
        />
        <Text style={styles.h2}>Email notifications</Text>
        <Pressable
          onPress={() =>
            handleFormChange(
              "orderNotifications",
              !pageData?.orderNotifications,
            )
          }
          style={styles.horizontal}
        >
          <Ionicons
            name={pageData?.orderNotifications ? "checkbox" : "square-outline"}
            size={24}
            color={pageData?.orderNotifications ? "#1f4924" : "#dedede"}
          />
          <Text>Order statuses</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            handleFormChange(
              "passwordNotifications",
              !pageData?.passwordNotifications,
            )
          }
          style={styles.horizontal}
        >
          <Ionicons
            name={
              pageData?.passwordNotifications ? "checkbox" : "square-outline"
            }
            size={24}
            color={pageData?.passwordNotifications ? "#1f4924" : "#dedede"}
          />
          <Text>Password changes</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            handleFormChange(
              "specialOfferNotifications",
              !pageData?.specialOfferNotifications,
            )
          }
          style={styles.horizontal}
        >
          <Ionicons
            name={
              pageData?.specialOfferNotifications
                ? "checkbox"
                : "square-outline"
            }
            size={24}
            color={pageData?.specialOfferNotifications ? "#1f4924" : "#dedede"}
          />
          <Text>Special offers</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            handleFormChange(
              "newsletterNotifications",
              !pageData?.newsletterNotifications,
            )
          }
          style={styles.horizontal}
        >
          <Ionicons
            name={
              pageData?.newsletterNotifications ? "checkbox" : "square-outline"
            }
            size={24}
            color={pageData?.newsletterNotifications ? "#1f4924" : "#dedede"}
          />
          <Text>Newsletter</Text>
        </Pressable>
        <Pressable style={styles.buttonLogOut} onPress={signOut}>
          <Text style={{ textAlign: "center", fontWeight: "500" }}>
            Log Out
          </Text>
        </Pressable>
        <View
          style={[styles.horizontal, { marginBottom: 40, alignSelf: "center" }]}
        >
          <Pressable
            style={styles.buttonSecondary}
            onPress={() => {
              setPageData(user);
              router.back();
            }}
          >
            <Text style={styles.buttonSecondaryText}>Discard Changes</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              updateUser(pageData);
              router.back();
            }}
          >
            <Text style={styles.buttonWhiteText}>Save Changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textField: {
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 2,
    width: "100%",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    justifyContent: "flex-start",
    padding: 0,
  },
  h2: {
    fontSize: 20,
    fontWeight: "600",
  },
  h3: {
    fontSize: 14,
    color: "#BBBBBB",
    padding: 0,
    fontWeight: "600",
  },
  contentArea: {
    padding: 10,
    gap: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 75,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 75,
    backgroundColor: "#DDDDDD",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#1f4924",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  buttonLogOut: {
    backgroundColor: "#e2d13b",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    width: "90%",
    marginVertical: 30,
    alignSelf: "center",
  },
  buttonSecondary: {
    borderRadius: 0,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderColor: "#b4b4b4",
    borderWidth: 1,
  },
  buttonWhiteText: {
    color: "white",
  },
  buttonSecondaryText: {
    color: "#b4b4b4",
  },
});
