import { UserAuthData } from "../types/dataTypes";
import apiClient from "./client";

interface Image {
  uri: string;
}

interface PostData {
  title: string;
  recipeSteps: string[];
  images: Image[];
}

const postRecipe = (data: PostData, token: string | null): Promise<any> => {
  const formData = new FormData();

  formData.append("title", data.title);
  data.recipeSteps.forEach((step, index) => {
    formData.append(`steps`, step);
  });

  data.images.forEach((image, index) => {
    const blob: object = {
      name: "image.jpg",
      uri: image.uri,
      type: "image/jpg",
    };
    formData.append("images", blob as Blob);
  });

  const endpoint = "/post_recipe/";

  return apiClient.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    },
  });
};

const register = (data: UserAuthData): Promise<any> => {
  const endpoint = "/create_user/";
  return apiClient.post(endpoint, data);
};

const login = (data: UserAuthData): Promise<any> => {
  const endpoint = "/token/";
  const formData = new FormData();

  formData.append("username", data.username);
  formData.append("password", data.password);

  return apiClient.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const loginApple = (data: any): Promise<any> => {
  const endpoint = "/login_apple/";

  return apiClient.post(endpoint, data);
};

const follow_user = (userid: number, token: string): Promise<any> => {
  const endpoint = "/follow_user/?otheruserid=" + userid;

  return apiClient.post(
    endpoint,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

export { postRecipe, loginApple, register, follow_user, login };
