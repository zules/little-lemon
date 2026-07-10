import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { getMenuDb, initializeDb, saveToMenuDb } from "../lib/database";

export default function Home() {
  const { user, updateUser, signOut } = useAuth();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    (async () => {
      await initializeDb();
      const menuDbItems = await getMenuDb();
      if (menuDbItems.length > 0) {
        setMenu(menuDbItems);
      } else {
        try {
          const response = await fetch(
            "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json",
          );
          const json = await response.json();
          await saveToMenuDb(json.menu);
          setMenu(json.menu);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, []);

  const SingleMenuItem = ({ name, description, price, image }) => {
    const imgU = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`;
    const [imgFailed, setImgFailed] = useState(false);
    const imageSize = 70;
    return (
      <View style={styles.menuItemView}>
        <View style={{ width: "75%" }}>
          <Text style={styles.itemName}>{name}</Text>
          <Text style={styles.itemDescription}>{description}</Text>
          <Text style={styles.itemPrice}>${Number(price).toFixed(2)}</Text>
        </View>
        {image && !imgFailed ? (
          <Image
            source={{ uri: imgU }}
            style={{ width: imageSize, height: imageSize }}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <View
            style={{
              backgroundColor: "grey",
              width: imageSize,
              height: imageSize,
            }}
          >
            <Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>
              No image
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView>
      <Header avatarUri={user?.avatar} showBack={false} />
      <FlatList
        data={menu}
        renderItem={({ item }) => (
          <SingleMenuItem
            name={item?.name}
            description={item?.description}
            price={item?.price}
            image={item?.image}
          />
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  itemName: {
    fontSize: 14,
    fontWeight: "800",
  },
  itemDescription: {
    color: "#8f8f8f",
    fontSize: 14,
  },
  itemPrice: {
    color: "#8f8f8f",
    fontSize: 14,
    fontWeight: "600",
  },
  menuItemView: {
    flexDirection: "row",
    width: "100%",
    paddingTop: 15,
    paddingBottom: 5,
    borderBottomColor: "#BBBBBB",
    borderBottomWidth: 1,
    gap: 10,
    paddingHorizontal: 20,
  },
});
