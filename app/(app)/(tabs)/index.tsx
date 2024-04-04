import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import AppText from "../../../components/AppText";

import AppCommunityCard from "../../../components/AppCommunityCard";
import AppPlusButton from "../../../components/AppPlusButton";
import Colors from "../../../config/Colors";
import { router } from "expo-router";
import useApi from "../../../hooks/useApi";
import { getRecipe } from "../../../api/getRequest";

import { RecipeDataType } from "../../../types/dataTypes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Headers = () => (
  <View
    style={{
      justifyContent: "center",
      gap: 20,
      marginBottom: 30,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <TextInput
        placeholder="Search for recipes..."
        style={styles.searchInput}
      />

      <TouchableOpacity>
        <FontAwesomeIcon icon={faSearch} size={35} style={styles.searchIcon} />
      </TouchableOpacity>
    </View>
  </View>
);

function CommunityScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    getRecipeApi.request();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const getRecipeApi = useApi<RecipeDataType[]>(getRecipe);

  useEffect(() => {
    getRecipeApi.request();
  }, []);

  return (
    <View style={styles.container}>
      <Headers />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollcontainer}
        data={getRecipeApi.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <AppCommunityCard item={item} />}
      />
      <AppPlusButton
        positionStyles={styles.button}
        color={Colors.white}
        size={50}
        onPress={() => router.navigate("PostScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: 20,
  },
  searchInput: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,

    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "80%",
    fontSize: 20,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.75,
  },

  searchIcon: {
    shadowColor: Colors.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.75,
  },

  scrollcontainer: {
    gap: 30,
  },

  button: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
});

export default CommunityScreen;
