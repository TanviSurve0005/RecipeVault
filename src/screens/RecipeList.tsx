import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { YStack, XStack, Card, H2, H3, H4, Paragraph, Text, Button, Image, Spinner } from 'tamagui';
import { RecipeListScreenProps } from '../types/navigation';
import { recipeApi } from '../services/recipeApi';
import { Recipe } from '../types/Recipe';

// Simple icon components
const ClockIcon = () => <Text>⏱</Text>;
const UsersIcon = () => <Text>👥</Text>;
const EditIcon = () => <Text>✏️</Text>;
const DeleteIcon = () => <Text>🗑️</Text>;
const AddIcon = () => <Text>➕</Text>;

export default function RecipeList() {
  const navigation = useNavigation<RecipeListScreenProps['navigation']>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async (pageNum = 1, shouldAppend = false) => {
    try {
      setLoading(true);
      const { recipes: newRecipes, total: totalCount } = await recipeApi.getAll(pageNum, 10);
      
      if (shouldAppend) {
        setRecipes(prev => [...prev, ...newRecipes]);
      } else {
        setRecipes(newRecipes);
      }
      
      setTotal(totalCount);
      setHasMore(newRecipes.length > 0 && recipes.length + newRecipes.length < totalCount);
      setError(null);
    } catch (err) {
      setError('Failed to load recipes');
      console.error('Error loading recipes:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadRecipes(1, false);
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await recipeApi.delete(id);
      setRecipes(recipes.filter(recipe => recipe.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      console.error('Error deleting recipe:', err);
      alert('Failed to delete recipe');
    }
  };

  const loadMoreRecipes = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadRecipes(nextPage, true);
    }
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <Card elevate bordered padding="$0" marginBottom="$4" overflow="hidden" backgroundColor="$background">
      <TouchableOpacity
        onPress={() => navigation.navigate('RecipeDetail', { id: item.id! })}
        activeOpacity={0.7}
      >
        <XStack>
          <Image
            source={{ uri: item.imageUrl || 'https://placehold.co/120x120/e2e8f0/6b7280' }}
            width={120}
            height={120}
            resizeMode="cover"
          />
          <YStack padding="$3" flex={1} justifyContent="space-between">
            <YStack>
              <H4 numberOfLines={1} color="$gray12" marginBottom="$1">
                {item.title || 'Untitled Recipe'}
              </H4>
              {item.description && (
                <Paragraph 
                  numberOfLines={2} 
                  color="$gray11" 
                  fontSize="$3"
                  marginBottom="$2"
                >
                  {item.description}
                </Paragraph>
              )}
            </YStack>
            
            <XStack space="$3" alignItems="center">
              {item.cookTime && (
                <XStack alignItems="center" space="$1">
                  <ClockIcon />
                  <Text color="$gray9" fontSize="$2">{item.cookTime.split(' ')[0]}m</Text>
                </XStack>
              )}
              {item.servings > 0 && (
                <XStack alignItems="center" space="$1">
                  <UsersIcon />
                  <Text color="$gray9" fontSize="$2">{item.servings}</Text>
                </XStack>
              )}
            </XStack>
          </YStack>
        </XStack>
      </TouchableOpacity>
      
      <XStack space="$2" padding="$3" borderTopWidth={1} borderTopColor="$gray3" justifyContent="flex-end">
        <Button
          size="$2"
          chromeless
          onPress={() => navigation.navigate('EditRecipe', { id: item.id! })}
          icon={<EditIcon />}
          color="$blue10"
        >
          Edit
        </Button>
        <Button
          size="$2"
          chromeless
          onPress={() => handleDeleteRecipe(item.id!)}
          icon={<DeleteIcon />}
          color="$red10"
        >
          Delete
        </Button>
      </XStack>
    </Card>
  );

  const renderFooter = () => {
    if (loading) {
      return (
        <YStack alignItems="center" padding="$4">
          <Spinner size="small" color="$blue10" />
          <Text color="$gray9" marginTop="$2">Loading more recipes...</Text>
        </YStack>
      );
    }
    
    if (hasMore) {
      return (
        <Button 
          onPress={loadMoreRecipes} 
          marginVertical="$4"
          alignSelf="center"
          icon={<AddIcon />}
          backgroundColor="$blue8"
          color="white"
        >
          Load More Recipes
        </Button>
      );
    }
    
    if (recipes.length > 0) {
      return (
        <Text textAlign="center" color="$gray9" marginVertical="$4">
          You've reached the end of your recipes!
        </Text>
      );
    }
    
    return null;
  };

  if (loading && recipes.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '$background' }}>
        <YStack space="$4" alignItems="center">
          <Spinner size="large" color="$blue10" />
          <H4 color="$gray11">Loading your recipes...</H4>
        </YStack>
      </View>
    );
  }

  if (error && recipes.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '$background' }}>
        <YStack space="$4" alignItems="center" padding="$4">
          <H4 color="$red10">Error loading recipes</H4>
          <Paragraph color="$gray11" textAlign="center">{error}</Paragraph>
          <Button onPress={() => loadRecipes(1, false)} marginTop="$4">
            Try Again
          </Button>
        </YStack>
      </View>
    );
  }

  return (
    <YStack padding="$4" flex={1} backgroundColor="$gray2">
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
        <YStack>
          <H2 color="$gray12">My Recipes</H2>
          <Text color="$gray9">{total} recipe{total !== 1 ? 's' : ''}</Text>
        </YStack>
        <Button
          onPress={() => navigation.navigate('AddRecipe')}
          backgroundColor="$green8"
          color="white"
          icon={<AddIcon />}
        >
          Add Recipe
        </Button>
      </XStack>

      {recipes.length === 0 ? (
        <Card elevate bordered padding="$6" alignItems="center" marginTop="$8">
          <Text fontSize="$8" marginBottom="$3">🍳</Text>
          <H4 color="$gray11" textAlign="center" marginBottom="$2">
            No recipes yet
          </H4>
          <Paragraph color="$gray9" textAlign="center" marginBottom="$4">
            Start by adding your first delicious recipe!
          </Paragraph>
          <Button
            onPress={() => navigation.navigate('AddRecipe')}
            backgroundColor="$green8"
            color="white"
            icon={<AddIcon />}
          >
            Create Your First Recipe
          </Button>
        </Card>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id!}
          renderItem={renderRecipeItem}
          onEndReached={loadMoreRecipes}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </YStack>
  );
}