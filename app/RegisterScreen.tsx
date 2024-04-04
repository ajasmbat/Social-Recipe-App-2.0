import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Button,
  TextInput,
  ImageBackground,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Formik } from "formik";

import AppText from "../components/AppText";
import * as AppleAuthentication from "expo-apple-authentication";
import { login, loginApple, register } from "../api/postRequest";
import Colors from "../config/Colors";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { router } from "expo-router";
import * as Yup from "yup";
import { UserAuthData } from "../types/dataTypes";
import useApi from "../hooks/useApi";
import AppError from "../components/AppError";

function RegisterScreen() {
  const { state, dispatch } = useContext(AppContext);

  const sendRegisterApi = useApi(register);
  const sendLoginApi = useApi(login);

  async function sendRegister2(values: UserAuthData) {
    sendRegisterApi.request(values).then((response: any) => {
      if (response.ok) {
        dispatch({ type: "SET_ACCESS", payload: response.data.access_token });
        dispatch({ type: "SET_USER", payload: response.data.user_id });
        router.replace("/");
      }
    });
  }

  async function sendLogin(values: UserAuthData) {
    sendLoginApi.request(values).then((response: any) => {
      if (response.ok) {
        dispatch({ type: "SET_ACCESS", payload: response.data.access_token });
        dispatch({ type: "SET_USER", payload: response.data.user_id });
        router.replace("/");
      }
    });
  }

  async function appleLogin() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      loginApple(credential)
        .then((response: any) => {
          dispatch({ type: "SET_ACCESS", payload: response.data.access_token });
          dispatch({ type: "SET_USER", payload: response.data.user_id });

          router.replace("/");
        })
        .catch((error) => {
          console.error("Error in loginApple: ", error);
        });
    } catch (e) {
      console.log(e);
    }
  }

  const UserSchema = Yup.object().shape({
    username: Yup.string().required("Username is Required"),
    password: Yup.string()
      .required("Password is Required")
      .min(8, "Most Be Greater Than 8 Letters"),
  });

  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  return (
    <>
      {backgroundLoaded ? null : (
        <ActivityIndicator
          size={"large"}
          color={Colors.black}
          style={{
            position: "absolute",
            zIndex: 2,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: Colors.background,
          }}
        />
      )}

      <AppError
        setError={sendRegisterApi.setError}
        error={sendRegisterApi.error}
      />

      <AppError setError={sendLoginApi.setError} error={sendLoginApi.error} />

      <ImageBackground
        style={styles.container}
        source={require("../assets/background.jpg")}
        onLoad={() => setBackgroundLoaded(true)}
      >
        <View style={styles.cont}>
          <Formik
            initialValues={{ username: "", password: "", register: true }}
            onSubmit={(values) => {
              if (values.register) {
                sendRegister2(values);
              } else {
                sendLogin(values);
              }
            }}
            validationSchema={UserSchema}
          >
            {({ handleChange, handleSubmit, errors, touched, values }) => (
              <>
                <View>
                  <TextInput
                    style={styles.text}
                    placeholder={"UserName"}
                    placeholderTextColor={Colors.gray}
                    autoCorrect={false}
                    onChangeText={handleChange("username")}
                  />

                  {errors.username ? (
                    <AppText
                      moreStyles={{ color: Colors.red, alignSelf: "center" }}
                    >
                      {errors.username}
                    </AppText>
                  ) : null}
                </View>

                <View>
                  <TextInput
                    style={styles.text}
                    placeholder={"Password"}
                    placeholderTextColor={Colors.gray}
                    secureTextEntry
                    textContentType="password"
                    onChangeText={handleChange("password")}
                  />
                  {errors.password ? (
                    <AppText
                      moreStyles={{ color: Colors.red, alignSelf: "center" }}
                    >
                      {errors.password}
                    </AppText>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    values.register = true;
                    handleSubmit();
                  }}
                >
                  <AppText moreStyles={{ color: Colors.white, fontSize: 20 }}>
                    Register
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    values.register = false;
                    handleSubmit();
                  }}
                >
                  <AppText moreStyles={{ color: Colors.white, fontSize: 20 }}>
                    Login
                  </AppText>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          {Platform.OS == "ios" ? (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={25}
              style={styles.applebutton}
              onPress={appleLogin}
            />
          ) : null}
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cont: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    backgroundColor: Colors.gray,
    gap: 15,
    padding: 20,
    borderRadius: 25,
  },
  icon: {
    borderRadius: 40,
    marginRight: 10,
  },
  text: {
    backgroundColor: Colors.black,
    color: "white",
    width: 200,
    padding: 10,
    borderRadius: 40,
    marginVertical: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.black,
    color: Colors.white,
    width: 200,
    height: 50,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  applebutton: {
    width: 200,
    height: 50,
  },
});

export default RegisterScreen;
