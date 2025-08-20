import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  RecipeList: undefined;
  RecipeDetail: { id: string };
  AddRecipe: undefined;
  EditRecipe: { id: string }; // Add this if you need edit functionality
};

export type RecipeListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RecipeList'
>;

// Add the missing RecipeListScreenProps
export type RecipeListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RecipeList'
>;

export type RecipeDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RecipeDetail'
>;

export type AddRecipeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AddRecipe'
>;

// Add EditRecipeScreenProps if needed
export type EditRecipeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EditRecipe'
>;