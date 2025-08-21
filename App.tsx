import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './src/lib/apollo';
import config from './tamagui.config';
import RootNavigator from './src/navigation/RootNavigator';

// Deep linking configuration
const linking = {
  prefixes: ['myapp://', 'http://localhost:8081', 'https://myapp.com'],
  config: {
    screens: {
      SignIn: 'signin',
      SignUp: 'signup',
      RecipeList: 'recipes',
      RecipeDetail: 'recipe/:id',
      AddRecipe: 'add',
      EditRecipe: 'edit/:id',
    },
  },
};

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <TamaguiProvider config={config}>
        <NavigationContainer linking={linking}>
          <StatusBar style="auto" />
          <RootNavigator />
        </NavigationContainer>
      </TamaguiProvider>
    </ApolloProvider>
  );
}