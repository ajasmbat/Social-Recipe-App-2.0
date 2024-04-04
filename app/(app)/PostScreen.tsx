import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

import { FieldArray, Formik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCamera, faTrash } from "@fortawesome/free-solid-svg-icons";
import * as ImagePicker from "expo-image-picker";

import ImageView from "react-native-image-viewing";
import Colors from "../../config/Colors";
import { postRecipe } from "../../api/postRequest";

import AppText from "../../components/AppText";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import useApi from "../../hooks/useApi";

export default function PostScreen() {
  interface PostFormValues {
    title: string;
    recipeSteps: string[];
    images: { uri: string }[];
  }

  interface ImageValues {
    uri: string;
  }

  const postRecipeApi = useApi(postRecipe);

  const { state } = useContext(AppContext);

  const pickImage = async (
    setFieldValue: (field: string, value: string) => void,
    index: number
  ) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      for (let i = 0; i < result.assets.length; i++) {
        setFieldValue(`images[${index}].uri`, result.assets[i].uri);
        index++;
      }
    }
  };

  const [visible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const openImageView = (imageIndex: number) => {
    setIndex(imageIndex);
    setIsVisible(true);
    ``;
  };

  const closeImageView = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (values: PostFormValues) => {
    try {
      postRecipeApi.request(values, state.access).then((response: any) => {
        if (response.status === 200) {
          router.replace("/");
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const RecipeSchema = Yup.object().shape({
    title: Yup.string().required("Recipe name is Required"),
    recipeSteps: Yup.array()
      .of(Yup.string().required("Step is Required"))
      .min(1, ""),
    images: Yup.array()
      .of(
        Yup.object().shape({
          uri: Yup.string(),
        })
      )
      .min(1, "Image is Required"),
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.gray, marginTop: 20 }}>
      <Formik
        initialValues={{
          title: "",
          recipeSteps: [""],
          images: [],
        }}
        validationSchema={RecipeSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({
          handleChange,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View>
            <FieldArray
              name="images"
              render={(arrayHelpers) => (
                <View>
                  <View style={styles.imageCont}>
                    <TouchableOpacity
                      onPress={() =>
                        pickImage(setFieldValue, values.images.length)
                      }
                    >
                      <FontAwesomeIcon icon={faCamera} size={75} color="gray" />
                    </TouchableOpacity>

                    <FlatList
                      style={{ maxHeight: 200 }}
                      data={values.images}
                      horizontal
                      scrollEnabled
                      showsHorizontalScrollIndicator={false}
                      renderItem={({
                        item,
                        index,
                      }: {
                        item: ImageValues;
                        index: number;
                      }) => (
                        <TouchableOpacity onPress={() => openImageView(index)}>
                          <Image
                            source={{ uri: item.uri }}
                            style={styles.image}
                          />
                          <TouchableOpacity
                            style={{ position: "absolute", right: 0, top: 5 }}
                            onPress={() => {
                              arrayHelpers.remove(index);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              size={25}
                              color="black"
                            />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      )}
                    />
                    <ImageView
                      images={values.images.map((image: ImageValues) => ({
                        uri: image.uri,
                      }))}
                      imageIndex={index}
                      visible={visible}
                      onRequestClose={closeImageView}
                    />
                  </View>

                  {errors.images && touched.images ? (
                    <AppText moreStyles={styles.error}>{errors.images}</AppText>
                  ) : null}
                </View>
              )}
            />
            <View style={styles.titleCont}>
              <TextInput
                style={styles.titleInput}
                onChangeText={handleChange("title")}
                value={values.title}
                placeholder="Title"
              />
            </View>

            {errors.title && touched.title ? (
              <Text style={styles.error}>{errors.title}</Text>
            ) : null}

            <FieldArray
              name="recipeSteps"
              render={(arrayHelpers) => (
                <View>
                  <ScrollView
                    style={{
                      marginTop: 5,
                      marginBottom: 10,
                      maxHeight: 300,
                      borderBottomWidth: 1,
                    }}
                    contentContainerStyle={{
                      alignItems: "center",
                    }}
                  >
                    {values.recipeSteps.map((step, index) => (
                      <View
                        key={index}
                        style={{
                          alignItems: "center",
                          margin: 10,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <AppText
                            moreStyles={{ fontSize: 15, fontWeight: "100" }}
                          >
                            {index + 1}:{" "}
                          </AppText>
                          <TextInput
                            placeholder={`Step ${index + 1}`}
                            value={step}
                            onChangeText={handleChange(`recipeSteps.${index}`)}
                            style={styles.stepsInput}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              if (values.recipeSteps.length > 1) {
                                arrayHelpers.remove(index);
                              }
                            }}
                            style={{ marginLeft: 10 }}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              size={25}
                              color="gray"
                            />
                          </TouchableOpacity>
                        </View>
                        {errors.recipeSteps &&
                        errors.recipeSteps[index] &&
                        touched.recipeSteps ? (
                          <Text style={styles.error}>
                            {errors.recipeSteps[index]}
                          </Text>
                        ) : null}
                      </View>
                    ))}
                  </ScrollView>
                  {values.recipeSteps.length < 10 && (
                    <TouchableOpacity onPress={() => arrayHelpers.push("")}>
                      <AppText moreStyles={styles.button}>Add Step</AppText>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />

            <TouchableOpacity onPress={() => handleSubmit()}>
              <AppText moreStyles={styles.button}>Submit</AppText>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  imageCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginLeft: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    marginRight: 10,
  },
  titleCont: {
    alignItems: "center",
    borderBottomWidth: 1,
    padding: 20,
  },
  titleName: {
    fontSize: 20,
  },

  titleInput: {
    borderWidth: 1,
    borderRadius: 20,
    width: "80%",
    padding: 5,
    textAlign: "center",
  },
  stepsInput: {
    borderWidth: 1,
    borderRadius: 10,
    width: "80%",
    padding: 5,
  },
  button: {
    backgroundColor: Colors.black,
    alignSelf: "center",
    textAlign: "center",
    padding: 10,
    fontSize: 25,
    borderRadius: 20,
    width: 200,
    color: "white",
    overflow: "hidden",
    margin: 10,
  },
  error: {
    color: "red",
    margin: 10,
    alignSelf: "center",
  },
});
