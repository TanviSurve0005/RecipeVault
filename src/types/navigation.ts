import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  RecipeList: undefined;
  RecipeDetail: { 
    id: string;
    title?: string; // Made title optional to match RootNavigator options
  };
  AddRecipe: undefined;
  EditRecipe: { id: string }; 
};

// Navigation prop for RecipeList
export type RecipeListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RecipeList'
>;

// Screen props for SignIn
export type SignInScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignIn'
>;

// Screen props for SignUp
export type SignUpScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUp'
>;

// Screen props for RecipeList
export type RecipeListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RecipeList'
>;

// Screen props for RecipeDetail
export type RecipeDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RecipeDetail'
>;

// Screen props for AddRecipe
export type AddRecipeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AddRecipe'
>;

// Screen props for EditRecipe
export type EditRecipeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EditRecipe'
>;