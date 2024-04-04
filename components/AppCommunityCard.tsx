import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, PureComponent } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import Colors from "../config/Colors";
import AppText from "./AppText";
import { router } from "expo-router";
import { RecipeDataType } from "../types/dataTypes";

interface props {
  item: RecipeDataType;
}
export default function AppCommunityCard({ item }: props) {
  const [isLiked, setIsLiked] = useState(false);

  const LikeButtonPress = () => {
    setIsLiked(!isLiked);
    console.log("Post Like");
  };

  const DetailPush = () => {
    router.push({
      pathname: "/CardDetailScreen",
      params: { id: item.id, userid: item.owner_id },
    });
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const [profileimageLoaded, setProfileImageLoaded] = useState(false);

  return (
    <TouchableOpacity onPress={DetailPush}>
      <View style={styles.post}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            margin: 10,
          }}
        >
          {profileimageLoaded ? null : (
            <ActivityIndicator
              style={[
                styles.postProfileImage,
                { position: "absolute", zIndex: 2 },
              ]}
              size={"large"}
              color={Colors.black}
            />
          )}
          <Image
            source={{
              uri:
                item.images && item.images.length > 0
                  ? "http://192.168.1.125:8000/" + item.images[0].image_path
                  : " ",
            }}
            style={styles.postProfileImage}
            resizeMode="cover"
            onLoad={() => setProfileImageLoaded(true)} // This will be called when the image is loaded
          />

          <AppText>Sam</AppText>
        </View>
        <View>
          {imageLoaded ? null : (
            <ActivityIndicator
              style={[styles.postImage, { position: "absolute", zIndex: 2 }]}
              size={"large"}
              color={Colors.black}
            />
          )}

          <Image
            source={{
              uri:
                item.images && item.images.length > 0
                  ? "http://192.168.1.125:8000/" + item.images[0].image_path
                  : " ",
            }}
            style={styles.postImage}
            onLoad={() => setImageLoaded(true)}
          />
        </View>

        <View style={styles.postText}>
          <AppText moreStyles={{ fontSize: 18 }}>{item.title}</AppText>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
              }}
            >
              <TouchableOpacity onPress={LikeButtonPress}>
                <FontAwesomeIcon
                  size={28}
                  icon={faHeart}
                  color={isLiked ? "red" : "grey"}
                />
              </TouchableOpacity>

              <FontAwesomeIcon size={28} icon={faComment} color={"black"} />
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <AppText>32 Likes</AppText>
              <AppText>-</AppText>
              <AppText>4 Comments</AppText>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  post: {
    backgroundColor: Colors.white,
    flex: 1,
    width: "100%",
    justifyContent: "center",
    height: 500,
  },

  postProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "white",
  },

  postProfileText: {},
  postImage: {
    height: 300,
    width: "99%",
    backgroundColor: "white",
    borderRadius: 25,
    alignSelf: "center",
    margin: 1,
  },
  postText: {
    display: "flex",
    paddingHorizontal: 20,
    justifyContent: "space-evenly",
    height: 100,
    padding: 5,
  },
});
