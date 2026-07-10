import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import {
  filterMenuDb,
  getMenuDb,
  initializeDb,
  saveToMenuDb,
} from "../lib/database";
const CATEGORIES = ["starters", "mains", "desserts", "drinks", "specials"];

export default function Home() {
  const { user, updateUser, signOut } = useAuth();
  const [menu, setMenu] = useState([]);
  const [activeCats, setActiveCats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(id);
  }, [searchTerm]);

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

  useEffect(() => {
    (async () =>
      setMenu(await filterMenuDb(activeCats, debouncedSearchTerm)))();
  }, [activeCats, debouncedSearchTerm]);

  function toggleCategory(cat) {
    if (activeCats.includes(cat)) {
      setActiveCats(activeCats.filter((i) => i !== cat));
    } else {
      setActiveCats([...activeCats, cat]);
    }
  }

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

  const CategoryButton = ({ cat, isSelected }) => {
    return (
      <Pressable onPress={() => toggleCategory(cat)}>
        <View style={[styles.catButton, isSelected && styles.catButtonActive]}>
          <Text style={styles.catText}>
            {cat?.charAt(0).toUpperCase() + cat?.slice(1)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Header avatarUri={user?.avatar} showBack={false} />

      <FlatList
        ListHeaderComponent={
          <>
            <View style={{ backgroundColor: "#165337", padding: 15 }}>
              <Text style={{ fontSize: 38, color: "#ddd020" }}>
                Little Lemon
              </Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ gap: 20 }}>
                  <Text style={{ fontSize: 22, color: "#eee" }}>Chicago</Text>
                  <Text style={{ width: 180, fontSize: 14, color: "#eee" }}>
                    We are a family owned Mediterranean restaurant, focused on
                    traditional recipes served with a modern twist.
                  </Text>
                </View>
                <Image
                  source={require("../assets/images/hero-image.png")}
                  style={{ height: 140, width: 140, borderRadius: 20 }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#dbdbdb",
                  borderRadius: 20,
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <Ionicons name="search" size={28} />
                <TextInput
                  style={{ flex: 1 }}
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
              </View>
            </View>
            <ScrollView
              horizontal
              style={{ padding: 10 }}
              contentContainerStyle={{ gap: 10, paddingEnd: 20 }}
              showsHorizontalScrollIndicator={false}
            >
              {CATEGORIES.map((cat) => (
                <CategoryButton
                  cat={cat}
                  isSelected={activeCats.includes(cat)}
                  key={cat}
                />
              ))}
            </ScrollView>
          </>
        }
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
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
  catButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  catButtonActive: {
    backgroundColor: "#dbd800",
  },
  catText: {
    fontWeight: "800",
    color: "#103624",
  },
});
