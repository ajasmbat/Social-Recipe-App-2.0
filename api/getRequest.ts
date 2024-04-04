import apiClient from "./client";

const getRecipe = (): Promise<any> => {
  const endpoint = "/get_recipe/";

  return apiClient.get(endpoint);
};

const getRecipeDetailed = (id: number): Promise<any> => {
  const endpoint = `/get_recipe_detailed/?recipe_id=${id}`;

  return apiClient.get(endpoint);
};

const get_user_profile = (token: string | null): Promise<any> => {
  const endpoint = "/get_user_profile/";

  return apiClient.get(
    endpoint,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

const get_profile = (userid: number, token: string): Promise<any> => {
  const endpoint = "/get_profile/";

  return apiClient.get(
    endpoint,
    { accountid: userid },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

const get_follower_list = (userid: number, token: string): Promise<any> => {
  const endpoint = "/get_follower_list/";

  return apiClient.get(
    endpoint,
    { userid: userid },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

const get_following_list = (userid: number, token: string): Promise<any> => {
  const endponint = "/get_following_list/";

  return apiClient.get(
    endponint,
    { userid: userid },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

export {
  getRecipe,
  getRecipeDetailed,
  get_user_profile,
  get_profile,
  get_follower_list,
  get_following_list,
};
