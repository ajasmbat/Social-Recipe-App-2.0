import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useApi from "../../hooks/useApi";
import { get_follower_list, get_following_list } from "../../api/getRequest";
import { FollowListSchema, UserAuthData } from "../../types/dataTypes";
import { AppContext } from "../../context/AppContext";
import AppText from "../../components/AppText";
import Colors from "../../config/Colors";

interface item {
  id: string;
  root: string;
}

const UserCard = ({ item }: { item: FollowListSchema }) => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.gray,
        flexDirection: "row",
        gap: 20,
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: 20,
        padding: 10,
      }}
      onPress={() => {
        if (state.user == item.id) {
          router.replace({
            pathname: "ProfileScreen",
            params: { userid: item.id },
          });
        } else {
          router.replace({
            pathname: "OtherProfileScreen",
            params: { userid: item.id },
          });
        }
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 100 }}
        source={{
          uri: item.profile_picture_path
            ? "http://192.168.1.125:8000/" + item.profile_picture_path
            : " ",
        }}
      />
      <AppText moreStyles={{ fontSize: 25 }}>{item.username}</AppText>
    </TouchableOpacity>
  );
};

const FollowListScreen = () => {
  const item = useLocalSearchParams();
  const { state } = useContext(AppContext);

  const getFollowersApi = useApi<FollowListSchema[]>(get_follower_list);
  const getFollowingApi = useApi<FollowListSchema[]>(get_following_list);

  const fetchFollowers = () => getFollowersApi.request(item.id, state.access);

  const fetchFollowing = () => getFollowingApi.request(item.id, state.access);

  useEffect(() => {
    if (item.followers) {
      fetchFollowers();
    } else {
      fetchFollowing();
    }
  }, []);

  return (
    <FlatList
      data={item.followers ? getFollowersApi.data : getFollowingApi.data}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ gap: 20, padding: 20 }}
      renderItem={({ item }) => <UserCard item={item} />}
    />
  );
};

export default FollowListScreen;

const styles = StyleSheet.create({});
