import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
interface ImageObject {
  image_path: string;
}

interface RecipeCardProps {
  item: {
    id: number;
    images: ImageObject[];
  };
}

const AppProfileCard: React.FC<RecipeCardProps> = ({ item }) => {
  const DetailPush = () => {
    router.push({
      pathname: "/CardDetailScreen",
      params: { id: item.id, inProfile: "1" },
    });
  };

  const imageUrl = item.images
    ? `http://192.168.1.125:8000/${item.images[0].image_path}`
    : "Path_To_A_Default_Image";

  return (
    <TouchableOpacity onPress={DetailPush}>
      <Image
        style={styles.image}
        source={{ uri: imageUrl }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 180,
    height: 150,
    borderRadius: 20,
  },
});

export default AppProfileCard;
