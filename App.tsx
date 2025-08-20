import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { ApolloProvider } from '@apollo/client'; // Import ApolloProvider
import { apolloClient } from './src/lib/apollo'; // Import your Apollo Client
import config from './tamagui.config';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <ApolloProvider client={apolloClient}> {/* Wrap with ApolloProvider */}
      <TamaguiProvider config={config}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <RootNavigator />
        </NavigationContainer>
      </TamaguiProvider>
    </ApolloProvider>
  );
}