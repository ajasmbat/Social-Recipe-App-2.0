import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../../components/AppText";
import { AppContext } from "../../context/AppContext";
import useApi from "../../hooks/useApi";
import { get_profile } from "../../api/getRequest";
import Colors from "../../config/Colors";
import { FollowType, GetProfileSchema } from "../../types/dataTypes";
import AppProfileCard from "../../components/AppProfileCard";
import { router, useLocalSearchParams } from "expo-router";
import { follow_user } from "../../api/postRequest";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function AccountScreen() {
  const { state, dispatch } = useContext(AppContext);

  const { userid } = useLocalSearchParams<{ userid: string }>();

  function Logout() {
    dispatch({ type: "LOGOUT" });
  }

  const getUserProfileApi = useApi<GetProfileSchema>(get_profile);

  const sendFollowApi = useApi<FollowType>(follow_user);

  const sendFollow = () => {
    sendFollowApi.request(userid, state.access).then(() => {
      getUserProfileApi.request(userid, state.access);
    });
  };

  useEffect(() => {
    getUserProfileApi.request(userid, state.access);
  }, []);

  const header = () => (
    <>
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} size={20} />
      </TouchableOpacity>

      <View style={styles.profilebox}>
        <Image
          style={styles.image}
          source={{
            uri: getUserProfileApi.data?.profile_picture_path
              ? "http://192.168.1.125:8000/" +
                getUserProfileApi.data?.profile_picture_path
              : " ",
          }}
        />
        <View style={{ gap: 20, alignItems: "center" }}>
          <AppText>{getUserProfileApi.data?.username}</AppText>
          <AppText>We Can Add Bio In Future</AppText>
          <TouchableOpacity onPress={sendFollow}>
            {getUserProfileApi.data?.is_following ? (
              <View
                style={[styles.followButton, { backgroundColor: Colors.blue }]}
              >
                <AppText moreStyles={{ fontSize: 20, color: Colors.white }}>
                  UnFollow
                </AppText>
              </View>
            ) : (
              <View style={styles.followButton}>
                <AppText moreStyles={{ fontSize: 20 }}>Follow</AppText>
              </View>
            )}
          </TouchableOpacity>
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
            const item = { id: getUserProfileApi.data?.id, followers: true };
            router.push({
              pathname: "FollowListScreen",
              params: { id: item.id, followers: true },
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
          renderItem={({ item, index }) => {
            return <AppProfileCard item={item} />;
          }}
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

  followButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.black,
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 20,
    width: 120,
    padding: 10,
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
