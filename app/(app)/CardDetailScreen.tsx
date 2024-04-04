import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getRecipeDetailed } from "../../api/getRequest";
import useApi from "../../hooks/useApi";
import AppText from "../../components/AppText";
import { RecipeDataType } from "../../types/dataTypes";
import Colors from "../../config/Colors";
import ImageView from "react-native-image-viewing";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../../context/AppContext";

export default function CardDetailScreen() {
  const { id, inProfile } = useLocalSearchParams<{
    id: string;
    inProfile: string;
  }>();

  const { state, dispatch } = useContext(AppContext);

  const [visible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const openImageView = (imageIndex: number) => {
    setIndex(imageIndex);
    setIsVisible(true);
  };

  const closeImageView = () => {
    setIsVisible(false);
  };

  const goBack = () => {
    router.back();
  };

  const goToProfile = () => {
    if (state.user == getRecipeApi.data?.owner_id) {
      router.replace({
        pathname: "ProfileScreen",
      });
    } else {
      if (inProfile) {
        router.back();
      } else {
        router.replace({
          pathname: "OtherProfileScreen",
          params: { userid: getRecipeApi.data?.owner_id },
        });
      }
    }
  };

  const getRecipeApi = useApi<RecipeDataType>(getRecipeDetailed);
  useEffect(() => {
    getRecipeApi.request(id);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {getRecipeApi.loading ? (
        <AppText>Loading...</AppText>
      ) : (
        <>
          <TouchableOpacity onPress={() => openImageView(index)}>
            {imageLoaded ? null : (
              <ActivityIndicator
                style={[styles.image, { position: "absolute", zIndex: 2 }]}
                size={"large"}
                color={Colors.secondary}
              />
            )}

            <Image
              source={{
                uri:
                  getRecipeApi.data?.images &&
                  getRecipeApi.data.images.length > 0
                    ? "http://192.168.1.125:8000/" +
                      getRecipeApi.data.images[0].image_path
                    : " ",
              }}
              style={styles.image}
              onLoad={() => setImageLoaded(true)}
              resizeMode="cover"
            />

            <ImageView
              images={(getRecipeApi.data?.images ?? []).map((image) => ({
                uri: "http://192.168.1.125:8000/" + image.image_path,
              }))}
              imageIndex={index}
              visible={visible}
              onRequestClose={closeImageView}
            />
          </TouchableOpacity>

          <FlatList
            ListHeaderComponent={
              <AppText moreStyles={styles.title}>
                {getRecipeApi.data?.title}
              </AppText>
            }
            ListFooterComponent={
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  gap: 10,
                  paddingBottom: 70,
                  marginTop: 20,
                }}
                onPress={goToProfile}
              >
                {imageLoaded ? null : (
                  <ActivityIndicator
                    style={[
                      styles.profileimage,
                      { position: "absolute", zIndex: 2 },
                    ]}
                    size={"large"}
                    color={Colors.black}
                  />
                )}

                <Image
                  source={{
                    uri:
                      getRecipeApi.data?.images &&
                      getRecipeApi.data.images.length > 0
                        ? "http://192.168.1.125:8000/" +
                          getRecipeApi.data.images[0].image_path
                        : " ",
                  }}
                  style={styles.profileimage}
                  onLoad={() => setImageLoaded(true)}
                  resizeMode="cover"
                />

                <AppText>Sam</AppText>
              </TouchableOpacity>
            }
            data={getRecipeApi.data?.steps}
            contentContainerStyle={{
              gap: 20,
              marginTop: 20,
              backgroundColor: Colors.white,
              padding: 20,
              borderRadius: 20,
            }}
            scrollEnabled
            renderItem={({ item, index }) => (
              <View>
                <AppText>
                  {index + 1}. {item.description}
                </AppText>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
            <FontAwesomeIcon icon={faChevronLeft} size={20} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 500,
    width: "100%",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  title: {
    alignSelf: "center",
    fontSize: 20,
    fontFamily: "Montserrat",
  },
  steps: {
    fontSize: 20,
  },

  goBackButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 100,
    color: Colors.black,
    overflow: "hidden",
  },
  profileimage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
});
