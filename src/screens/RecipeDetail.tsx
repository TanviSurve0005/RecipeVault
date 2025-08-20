import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { YStack, XStack, Card, H2, H3, H4, Paragraph, Separator, Text, Button, Image, Spinner } from 'tamagui';
import { RecipeDetailScreenProps } from '../types/navigation';
import { recipeApi } from '../services/recipeApi';
import { Recipe } from '../types/Recipe';

// Fixed icon components that accept size and color props
const ClockIcon = ({ size = 16, color = 'currentColor' }) => (
  <Text fontSize={size} color={color}>⏱</Text>
);

const UsersIcon = ({ size = 16, color = 'currentColor' }) => (
  <Text fontSize={size} color={color}>👥</Text>
);

const ChefHatIcon = ({ size = 16, color = 'currentColor' }) => (
  <Text fontSize={size} color={color}>👨‍🍳</Text>
);

export default function RecipeDetail() {
  const route = useRoute<RecipeDetailScreenProps['route']>();
  const { id } = route.params;
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const recipeData = await recipeApi.getById(id);
      setRecipe(recipeData);
      setError(null);
    } catch (err) {
      setError('Failed to load recipe');
      console.error('Error loading recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '$background' }}>
        <YStack space="$4" alignItems="center">
          <Spinner size="large" color="$blue10" />
          <H4 color="$gray11">Loading recipe...</H4>
        </YStack>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '$background' }}>
        <YStack space="$4" alignItems="center" padding="$4">
          <H4 color="$red10">Error loading recipe</H4>
          <Paragraph color="$gray11" textAlign="center">{error}</Paragraph>
          <Button onPress={loadRecipe} marginTop="$4">
            Try Again
          </Button>
        </YStack>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '$background' }}>
        <YStack space="$4" alignItems="center">
          <H4 color="$gray11">Recipe not found</H4>
          <Paragraph color="$gray9">The recipe you're looking for doesn't exist.</Paragraph>
        </YStack>
      </View>
    );
  }

  // Parse cook time to extract just the number part for display
  const cookTimeMinutes = recipe.cookTime ? parseInt(recipe.cookTime) || 0 : 0;
  const prepTime = Math.floor(cookTimeMinutes * 0.6); // 60% of total time as prep
  const cookTime = Math.floor(cookTimeMinutes * 0.4); // 40% of total time as cooking

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '$gray2' }}>
      <YStack>
        {/* Recipe Image Header */}
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: recipe.imageUrl || 'https://placehold.co/600x400/e2e8f0/e2e8f0' }}
            width="100%"
            height={300}
            resizeMode="cover"
          />
          <View style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            padding: 16,
            backgroundColor: 'rgba(0,0,0,0.7)'
          }}>
            <H2 color="white" style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 5 }}>
              {recipe.title || 'Untitled Recipe'}
            </H2>
            <Paragraph color="$gray3" marginTop="$2">
              {recipe.description || 'A delicious recipe'}
            </Paragraph>
          </View>
        </View>

        <YStack padding="$4" space="$5">
          {/* Recipe Meta Information */}
          <Card elevate size="$4" bordered>
            <XStack space="$6" justifyContent="center" padding="$4">
              <YStack alignItems="center" space="$2">
                <ClockIcon size={20} color="$blue10" />
                <Text fontWeight="800" fontSize="$5">{prepTime || 20} min</Text>
                <Text color="$gray10">Prep time</Text>
              </YStack>
              <YStack alignItems="center" space="$2">
                <ClockIcon size={20} color="$blue10" />
                <Text fontWeight="800" fontSize="$5">{cookTime || 15} min</Text>
                <Text color="$gray10">Cook time</Text>
              </YStack>
              <YStack alignItems="center" space="$2">
                <UsersIcon size={20} color="$blue10" />
                <Text fontWeight="800" fontSize="$5">{recipe.servings || 4}</Text>
                <Text color="$gray10">Servings</Text>
              </YStack>
            </XStack>
          </Card>

          {/* Ingredients */}
          <Card elevate size="$4" bordered>
            <YStack padding="$4">
              <XStack alignItems="center" space="$2" marginBottom="$4">
                <ChefHatIcon size={18} color="$blue10" />
                <H3 color="$gray12">Ingredients</H3>
              </XStack>
              <Separator marginBottom="$4" />
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <YStack space="$3">
                  {recipe.ingredients.map((ingredient: string, index: number) => (
                    <XStack key={index} space="$3" alignItems="center">
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '$blue8' }} />
                      <Text flex={1} fontSize="$5" color="$gray11">{ingredient}</Text>
                    </XStack>
                  ))}
                </YStack>
              ) : (
                <Text color="$gray9">No ingredients listed</Text>
              )}
            </YStack>
          </Card>

          {/* Instructions */}
          <Card elevate size="$4" bordered>
            <YStack padding="$4">
              <H3 color="$gray12" marginBottom="$4">Instructions</H3>
              <Separator marginBottom="$4" />
              {recipe.instructions && recipe.instructions.length > 0 ? (
                <YStack space="$4">
                  {recipe.instructions.map((instruction: string, index: number) => (
                    <XStack key={index} space="$4">
                      <View style={{ 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        width: 30, 
                        height: 30, 
                        borderRadius: 15, 
                        backgroundColor: '$blue8'
                      }}>
                        <Text color="white" fontWeight="800">{index + 1}</Text>
                      </View>
                      <YStack flex={1} space="$2">
                        <Text fontWeight="600" color="$gray12">Step {index + 1}</Text>
                        <Text color="$gray11" lineHeight="$1">{instruction}</Text>
                      </YStack>
                    </XStack>
                  ))}
                </YStack>
              ) : (
                <Text color="$gray9">No instructions available</Text>
              )}
            </YStack>
          </Card>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <Card elevate size="$4" bordered>
              <YStack padding="$4">
                <H3 color="$gray12" marginBottom="$4">Tags</H3>
                <XStack flexWrap="wrap" space="$2">
                  {recipe.tags.map((tag: string, index: number) => (
                    <View 
                      key={index} 
                      style={{ 
                        backgroundColor: '$blue3', 
                        paddingHorizontal: 12,
                        paddingVertical: 6, 
                        borderRadius: 16
                      }}
                    >
                      <Text fontSize="$3" color="$blue10" fontWeight="600">#{tag}</Text>
                    </View>
                  ))}
                </XStack>
              </YStack>
            </Card>
          )}

          {/* Created Date */}
          {recipe.createdAt && (
            <Text color="$gray9" fontSize="$2" textAlign="center" marginTop="$4">
              Added on {new Date(recipe.createdAt).toLocaleDateString()}
            </Text>
          )}
        </YStack>
      </YStack>
    </ScrollView>
  );
}