import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecipeList from '../screens/RecipeList';
import RecipeDetail from '../screens/RecipeDetail';
import AddRecipe from '../screens/AddRecipe';
import EditRecipe from '../screens/EditRecipe';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF6B35',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="SignIn" 
        component={SignInScreen}
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen}
        options={{ title: 'Sign Up' }}
      />
      <Stack.Screen 
        name="RecipeList" 
        component={RecipeList}
        options={{ title: 'My Recipes' }}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetail}
        options={({ route }) => ({ 
          title: route.params?.title || 'Recipe Details'
        })}
      />
      <Stack.Screen 
        name="AddRecipe" 
        component={AddRecipe} 
        options={{ title: 'Add Recipe' }} 
      />
      <Stack.Screen 
        name="EditRecipe" 
        component={EditRecipe} 
        options={{ title: 'Edit Recipe' }} 
      />
    </Stack.Navigator>
  );
}