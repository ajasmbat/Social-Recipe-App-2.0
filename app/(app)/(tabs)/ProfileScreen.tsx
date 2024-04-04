import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useCallback, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../../../components/AppText";
import { AppContext } from "../../../context/AppContext";
import useApi from "../../../hooks/useApi";
import { get_user_profile } from "../../../api/getRequest";
import Colors from "../../../config/Colors";
import { GetProfileSchema } from "../../../types/dataTypes";
import AppProfileCard from "../../../components/AppProfileCard";
import { router, useFocusEffect } from "expo-router";

export default function AccountScreen() {
  const { state, dispatch } = useContext(AppContext);
  const [reloadKey, setReloadKey] = useState(0);

  function Logout() {
    dispatch({ type: "LOGOUT" });
  }

  const getUserProfileApi = useApi<GetProfileSchema>(get_user_profile);

  const fetchUserProfile = () => {
    getUserProfileApi.request(state.access);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const header = () => (
    <>
      <TouchableOpacity style={styles.editbox} onPress={Logout}>
        <AppText>Edit Account</AppText>
        <MaterialCommunityIcons name="account-edit" color={"black"} size={20} />
      </TouchableOpacity>

      <View style={styles.profilebox}>
        <Image
          style={styles.image}
          source={{
            uri: getUserProfileApi.data?.profile_picture_path
              ? "http://192.168.1.125:8000/" +
                getUserProfileApi.data?.profile_picture_path
              : "",
          }}
        />
        <View>
          <AppText>{getUserProfileApi.data?.username}</AppText>
          <AppText>We Can Add Bio In Future</AppText>
        </View>
      </View>

      <View style={styles.followbox}>
        <TouchableOpacity style={styles.centerText}>
          <AppText>{getUserProfileApi.data?.recipe_count}</AppText>

          <AppText>Recipes</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.centerText}
          onPress={() => {
            const item = { id: getUserProfileApi.data?.id, root: null };
            router.push({
              pathname: "FollowListScreen",
              params: { id: item.id, root: item.root },
            });
          }}
        >
          <AppText>{getUserProfileApi.data?.following_count}</AppText>
          <AppText>Following</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.centerText}
          onPress={() => {
            const item = {
              id: getUserProfileApi.data?.id,
              followers: true,
            };
            router.push({
              pathname: "FollowListScreen",
              params: { id: item.id, followers: item.followers },
            });
          }}
        >
          <AppText>{getUserProfileApi.data?.followers_count}</AppText>
          <AppText>Followers</AppText>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {getUserProfileApi.loading ? (
        <ActivityIndicator size={"large"} color={Colors.black} />
      ) : (
        <FlatList
          ListHeaderComponent={header}
          data={getUserProfileApi.data?.recipes}
          numColumns={2} // Set the number of columns
          columnWrapperStyle={styles.recipecardbox}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => <AppProfileCard item={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,

    alignItems: "stretch",
    paddingTop: 50,
  },
  editbox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
  },

  image: {
    width: 150,
    height: 150,
    marginVertical: 10,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 25,
  },
  profilebox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
    padding: 20,
  },

  followbox: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 20,
  },
  centerText: {
    justifyContent: "center",
    alignItems: "center",
  },
  recipecardbox: {
    marginTop: 20,
    gap: 20,
  },
});
