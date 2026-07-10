import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Header({ avatarUri, showBack = true }) {
  return (
    <View style={styles.header}>
      {showBack ? (
        <Pressable onPress={() => router.back()}>
          <Text>Back</Text>
        </Pressable>
      ) : null}
      <Image
        source={require("../assets/images/Logo.png")}
        style={styles.headerImage}
      />
      <Pressable onPress={() => router.navigate("/profile")}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarSmall} />
        ) : (
          <View style={styles.placeholderSmall}></View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignContent: "space-evenly",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    paddingTop: 15,
    paddingBottom: 5,
    borderBottomColor: "#BBBBBB",
    borderBottomWidth: 1,
  },
  headerImage: {
    width: 220,
    height: 100,
    resizeMode: "contain",
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 75,
  },
  placeholderSmall: {
    width: 40,
    height: 40,
    borderRadius: 75,
    backgroundColor: "#DDDDDD",
  },
});
