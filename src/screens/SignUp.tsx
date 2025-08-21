import { Button, Input, YStack, Text, XStack } from 'tamagui';
import { useState } from 'react';
import { SignUpScreenProps } from '../types/navigation';

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    console.log('Sign Up attempted with:', { username, email, password });
    navigation.navigate('RecipeList');
  };

  const handleNavigateToSignIn = () => {
    navigation.navigate('SignIn');
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
          Create Your Account
        </Text>
        <Text fontSize="$4" textAlign="center" color="#718096" marginBottom="$6">
          Join us to start your journey
        </Text>

        {/* Inputs with Clean Design */}
        <Input
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
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

        {/* Prominent Sign Up Button */}
        <Button
          onPress={handleSignUp}
          backgroundColor="#ED8936"
          color="white"
          borderRadius="$3"
          paddingVertical="$4"
          hoverStyle={{ backgroundColor: '#DD6B20' }}
          marginBottom="$4"
        >
          Sign Up
        </Button>

        {/* Sign In Link */}
        <XStack justifyContent="center">
          <Text fontSize="$4" color="#718096">Already have an account?</Text>
          <Button
            onPress={handleNavigateToSignIn}
            paddingHorizontal="$2"
            fontSize="$4"
            color="#ED8936"
          >
            Sign In
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
}