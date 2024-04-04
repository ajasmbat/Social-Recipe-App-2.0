interface RecipeDataType {
  id: number;
  owner_id: number;
  title: string;
  steps: { description: string }[];
  images: { image_path: string }[];
}

interface UserAuthData {
  username: string;
  password: string;
}

interface GetProfileSchema {
  id: number;
  profile_picture_path: string;
  username: string;
  recipes: {
    id: number;
    title: string;
    images: {
      image_path: string;
    }[];
  }[];
  following_count: number;
  followers_count: number;
  recipe_count: number;
  is_following: string;
}

interface FollowType {
  status: string;
}

interface FollowListSchema {
  id: number;
  profile_picture_path: string;
  username: string;
}

export {
  RecipeDataType,
  UserAuthData,
  GetProfileSchema,
  FollowType,
  FollowListSchema,
};
