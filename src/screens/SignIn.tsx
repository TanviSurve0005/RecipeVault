import { Button, Input, YStack, Text, XStack } from 'tamagui';
import { useState } from 'react';
import { SignInScreenProps } from '../types/navigation';

export default function SignInScreen({ navigation }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    console.log('Sign In attempted with:', { email, password });
    navigation.navigate('RecipeList');
  };

  const handleNavigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <YStack flex={1} backgroundColor="#F5F7FA" alignItems="center" justifyContent="center" padding="$6">
      {/* Centered Card with Minimal Styling */}
      <YStack
        maxWidth={340}
        width="90%"
        padding="$6"
        backgroundColor="#FFFFFF"
        borderRadius="$4"
        borderWidth={1}
        borderColor="#E0E6ED"
      >
        {/* Welcome Text */}
        <Text fontSize="$8" fontWeight="bold" textAlign="center" color="#2D3748" marginBottom="$4">
          Welcome Back
        </Text>
        <Text fontSize="$4" textAlign="center" color="#718096" marginBottom="$6">
          Sign in to continue your experience
        </Text>

        {/* Inputs with Clean Design */}
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#A0AEC0"
          borderWidth={1}
          borderColor="#E0E6ED"
          padding="$4"
          borderRadius="$3"
          backgroundColor="#F9FAFB"
          focusStyle={{ borderColor: '#ED8936', borderWidth: 2 }}
          marginBottom="$4"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#A0AEC0"
          borderWidth={1}
          borderColor="#E0E6ED"
          padding="$4"
          borderRadius="$3"
          backgroundColor="#F9FAFB"
          focusStyle={{ borderColor: '#ED8936', borderWidth: 2 }}
          marginBottom="$5"
        />

        {/* Prominent Sign In Button */}
        <Button
          onPress={handleSignIn}
          backgroundColor="#ED8936" // Coral accent for pop
          color="white"
          borderRadius="$3"
          paddingVertical="$4"
          hoverStyle={{ backgroundColor: '#DD6B20' }}
          marginBottom="$4"
        >
          Sign In
        </Button>


        {/* Sign Up Link */}
        <XStack justifyContent="center">
          <Text fontSize="$4" color="#718096">Don’t have an account?</Text>
          <Button
            onPress={handleNavigateToSignUp}
            paddingHorizontal="$2"
            fontSize="$4"
            color="#ED8936"
          >
            Sign Up
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
}