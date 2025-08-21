import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, FlatList, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { YStack, XStack, Card, H2, H3, H4, Paragraph, Text, Button, Image, Spinner, Input } from 'tamagui';
import { RecipeListScreenProps } from '../types/navigation';
import { recipeApi } from '../services/recipeApi';
import { Recipe } from '../types/Recipe';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';

// Enhanced icon components
const ClockIcon = () => <Ionicons name="time-outline" size={16} color="#666" />;
const UsersIcon = () => <Ionicons name="people-outline" size={16} color="#666" />;
const EditIcon = () => <Ionicons name="create-outline" size={16} color="#007AFF" />;
const DeleteIcon = () => <Ionicons name="trash-outline" size={16} color="#FF3B30" />;
const AddIcon = () => <Ionicons name="add-circle" size={20} color="white" />;
const SearchIcon = () => <Ionicons name="search" size={20} color="white" marginRight="$8"/>;
const CloseIcon = () => <Ionicons name="close" size={24} color="white" />;

const { width } = Dimensions.get('window');
const isSmallDevice = width < 550;

export default function RecipeList() {
  const navigation = useNavigation<RecipeListScreenProps['navigation']>();
  const route = useRoute();
  const headerHeight = useHeaderHeight();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    loadRecipes();

    navigation.setOptions({
      headerRight: () => (
        <Button
          size="$5"
          circular
          onPress={() => setShowSearch(true)}
          icon={<SearchIcon />}
          backgroundColor="rgba(255,255,255,0.25)"
          hoverStyle={{ backgroundColor: 'rgba(255,255,255,0.35)', transform: [{ scale: 1.05 }] }}
          pressStyle={{ backgroundColor: 'rgba(255,255,255,0.4)', transform: [{ scale: 0.95 }] }}
          animation="quick"
        />
      ),
      headerStyle: {
        backgroundColor: '#FF6B35',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: '800',
        fontSize: 20,
      },
    });
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchQuery, recipes]);

  useEffect(() => {
    if (showSearch) {
      navigation.setOptions({
        headerTitle: () => (
          <Input
            placeholder="Search recipes by name or tags..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            width={isSmallDevice ? '80%' : '85%'}
            backgroundColor="rgba(255,255,255,0.95)"
            borderRadius="$6"
            padding="$3"
            fontSize={isSmallDevice ? 14 : 16}
            borderWidth={0}
            placeholderTextColor="#666"
            focusStyle={{ borderWidth: 1, borderColor: '#FF6B35' }}
            paddingHorizontal={isSmallDevice ? '$2' : '$3'}
          />
        ),
        headerRight: () => (
          <Button
            size="$5"
            circular
            onPress={() => { setShowSearch(false); setSearchQuery(''); }}
            icon={<CloseIcon />}
            backgroundColor="rgba(255,255,255,0.25)"
            hoverStyle={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
            pressStyle={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
            animation="quick"
          />
        ),
      });
    } else {
      navigation.setOptions({
        headerTitle: 'RecipeVault',
        headerRight: () => (
          <Button
            size="$5"
            circular
            onPress={() => setShowSearch(true)}
            icon={<SearchIcon />}
            backgroundColor="rgba(255,255,255,0.25)"
            hoverStyle={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
            pressStyle={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
            animation="quick"
          />
        ),
      });
    }
  }, [showSearch, searchQuery, isSmallDevice]);

  const loadRecipes = async (pageNum = 1, shouldAppend = false) => {
    try {
      setLoading(true);
      const { recipes: newRecipes, total: totalCount } = await recipeApi.getAll(pageNum, 10);
      shouldAppend ? setRecipes(prev => [...prev, ...newRecipes]) : setRecipes(newRecipes);
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

  const filterRecipes = () => {
    if (!searchQuery.trim()) {
      setFilteredRecipes(recipes);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const query = searchQuery.toLowerCase().trim();
    const filtered = recipes.filter(recipe =>
      (recipe.title && recipe.title.toLowerCase().includes(query)) ||
      (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(query))) ||
      (recipe.description && recipe.description.toLowerCase().includes(query))
    );
    setFilteredRecipes(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setSearchQuery('');
    setShowSearch(false);
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
    if (hasMore && !loading && !isSearching) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadRecipes(nextPage, true);
    }
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <YStack flex={1} alignItems="center" justifyContent="center" padding={isSmallDevice ? '$3' : '$4'}>
      <Card elevate bordered padding="$0" marginBottom="$5" overflow="hidden" width={isSmallDevice ? '90%' : '92%'}
        borderRadius="$8"
        backgroundColor="white"
        shadowColor="#000"
        shadowOpacity={0.15}
        shadowRadius={10}
        animation="bouncy"
      >
        <TouchableOpacity activeOpacity={0.85}>
          <XStack>
            <Image
              source={{ uri: item.imageUrl || 'https://placehold.co/120x120/e2e8f0/6b7280' }}
              width={isSmallDevice ? 150 : 180}
              height={isSmallDevice ? '100%' : 180} // Adjusted to 100% of card height on mobile
              resizeMode="cover"
              borderTopLeftRadius={12}
              borderBottomLeftRadius={12}
            />
            <YStack paddingLeft="$5" paddingTop="$3" flex={1} justifyContent="space-between">
              <YStack>
                <YStack>
                  <H4 color="$gray12" marginBottom={isSmallDevice ? '$2' : '$1'} fontWeight="700" fontSize={isSmallDevice ? '$3' : undefined}
                    numberOfLines={isSmallDevice ? undefined : 1}> {/* Full name on mobile, truncated on web */}
                    {item.title || 'Untitled Recipe'}
                  </H4>
                </YStack>
                <TouchableOpacity
                  onPress={() => navigation.navigate('RecipeDetail', { id: item.id! })}
                  activeOpacity={0.7}
                >
                  {item.description && (
                    <Paragraph numberOfLines={2} color="$gray11" fontSize={isSmallDevice ? '$1' : '$2'} marginBottom="$2">
                      {item.description}
                    </Paragraph>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <XStack flexWrap="wrap" marginBottom="$2">
                      {item.tags.map((tag, index) => (
                        <Text key={index} backgroundColor="#E6F9EE" color="#026e06" paddingVertical="$1" paddingHorizontal="$2"
                          borderRadius="$5" fontSize="$3" marginRight="$2" marginBottom="$1" shadowOpacity={0.05}>
                          #{tag}
                        </Text>
                      ))}
                    </XStack>
                  )}
                  <XStack space="$3" alignItems="center" marginBottom="$2">
                    {item.cookTime && (
                      <XStack alignItems="center" space="$1">
                        <ClockIcon />
                        <Text color="$gray9" fontSize="$4">{item.cookTime.split(' ')[0]}m</Text>
                      </XStack>
                    )}
                    {item.servings > 0 && (
                      <XStack alignItems="center" space="$1">
                        <UsersIcon />
                        <Text color="$gray9" fontSize="$4">{item.servings}</Text>
                      </XStack>
                    )}
                  </XStack>
                </TouchableOpacity>
              </YStack>
              <XStack space={isSmallDevice ? '$1' : '$2'} paddingLeft={isSmallDevice ? '$1' : '$2'} paddingBottom={isSmallDevice ? '$1' : '$2'} justifyContent={isSmallDevice ? 'flex-start' : 'flex-end'}>
                <Button size="$2" chromeless onPress={() => navigation.navigate('EditRecipe', { id: item.id! })} icon={<EditIcon />}>
                  Edit
                </Button>
                <Button size="$2" chromeless onPress={() => handleDeleteRecipe(item.id!)} icon={<DeleteIcon />}>
                  Delete
                </Button>
              </XStack>
            </YStack>
          </XStack>
        </TouchableOpacity>
      </Card>
    </YStack>
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
    if (hasMore && !isSearching) {
      return (
        <Button onPress={loadMoreRecipes} marginVertical="$5" alignSelf="center" icon={<AddIcon />}
          backgroundColor="#4A90E2" color="white" borderRadius="$8"
          hoverStyle={{ backgroundColor: '#5AA0F2', transform: [{ scale: 1.05 }] }}
          pressStyle={{ backgroundColor: '#3A7AD2', transform: [{ scale: 0.95 }] }}
          shadowColor="#000" shadowOpacity={0.2} shadowRadius={6}
        >Load More Recipes</Button>
      );
    }
    if (recipes.length > 0 && isSearching && filteredRecipes.length === 0) {
      return <Text textAlign="center" color="$gray9" marginVertical="$4">No recipes found matching your search.</Text>;
    }
    if (recipes.length > 0 && !isSearching) {
      return <Text textAlign="center" color="$gray9" marginVertical="$4">✨ You've reached the end of your recipes!</Text>;
    }
    return null;
  };

  if (loading && recipes.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FB' }}>
        <YStack space="$4" alignItems="center">
          <Spinner size="large" color="$blue10" />
          <H4 color="$gray11">Loading your recipes...</H4>
        </YStack>
      </View>
    );
  }

  if (error && recipes.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FB' }}>
        <YStack space="$4" alignItems="center" padding="$4">
          <H4 color="$red10">Error loading recipes</H4>
          <Paragraph color="$gray11" textAlign="center">{error}</Paragraph>
          <Button onPress={() => loadRecipes(1, false)} marginTop="$4" backgroundColor="#FF6B35" color="white" borderRadius="$6" shadowOpacity={0.2}>Try Again</Button>
        </YStack>
      </View>
    );
  }

  return (
    <YStack padding="$4" flex={1} backgroundColor="#F8F9FB">
      <XStack justifyContent="center" alignItems="center" marginBottom="$5">
        <YStack flex={1} alignItems='center'>
          <H2 color="$gray12" fontWeight="800" marginBottom="$1">My Recipes</H2>
          <Text color="$gray9">{isSearching ? `${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''} found` : `${total} recipe${total !== 1 ? 's' : ''}`}</Text>
        </YStack>
        <Button onPress={() => navigation.navigate('AddRecipe')} backgroundColor="#FF6B35" color="white"
          borderRadius="$8" paddingHorizontal="$8" paddingVertical="$8" height="$5" fontSize="$5" fontWeight="700"
          icon={<AddIcon />} shadowColor="#000" shadowOpacity={0.25} shadowRadius={8}
          hoverStyle={{ transform: [{ scale: 1.05 }], backgroundColor: '#FF8E53' }}
          pressStyle={{ transform: [{ scale: 0.95 }], backgroundColor: '#E55A2B' }}
        >Add Recipe</Button>
      </XStack>

      {recipes.length === 0 ? (
        <Card elevate bordered padding="$6" alignItems="center" marginTop="$8" borderRadius="$8" shadowOpacity={0.1}>
          <Text fontSize="$9" marginBottom="$3">🍳</Text>
          <H4 color="$gray11" textAlign="center" marginBottom="$2">No recipes yet</H4>
          <Paragraph color="$gray9" textAlign="center" marginBottom="$4">Start by adding your first delicious recipe!</Paragraph>
          <Button onPress={() => navigation.navigate('AddRecipe')} backgroundColor="#FF6B35" color="white"
            borderRadius="$8" paddingHorizontal="$6" height="$5" fontSize="$5" fontWeight="700"
            icon={<AddIcon />} shadowOpacity={0.2}
            hoverStyle={{ transform: [{ scale: 1.05 }], backgroundColor: '#FF8E53' }}
            pressStyle={{ transform: [{ scale: 0.95 }], backgroundColor: '#E55A2B' }}
          >Create Your First Recipe</Button>
        </Card>
      ) : (
        <FlatList
          data={isSearching ? filteredRecipes : recipes}
          keyExtractor={(item) => item.id!}
          renderItem={renderRecipeItem}
          onEndReached={isSearching ? undefined : loadMoreRecipes}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FF6B35" />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </YStack>
  );
}