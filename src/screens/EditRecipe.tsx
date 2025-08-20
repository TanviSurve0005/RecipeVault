import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { YStack, XStack, Card, H2, H3, H4, Input, TextArea, Text, Button, Spacer } from 'tamagui';
import { Recipe, RecipeFormData } from '../types/Recipe';
import { recipeApi } from '../services/recipeApi';

// Simple icon components using emojis
const PlusIcon = () => <Text>➕</Text>;
const MinusIcon = () => <Text>➖</Text>;
const ClockIcon = () => <Text>⏱️</Text>;
const ServingIcon = () => <Text>👥</Text>;
const TagIcon = () => <Text>🏷️</Text>;
const ImageIcon = () => <Text>🖼️</Text>;

type EditRecipeRouteParams = {
  id: string;
};

export default function EditRecipe() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as EditRecipeRouteParams;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    cookTime: '',
    servings: 4,
    tags: [],
    isPublic: true
  });

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      setFetching(true);
      const recipe = await recipeApi.getById(id);
      
      // Convert the recipe to form data format
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: recipe.ingredients && recipe.ingredients.length > 0 
          ? recipe.ingredients 
          : [''],
        instructions: recipe.instructions && recipe.instructions.length > 0 
          ? recipe.instructions 
          : [''],
        cookTime: recipe.cookTime || '',
        servings: recipe.servings || 4,
        tags: recipe.tags || [],
        imageUrl: recipe.imageUrl || '',
        isPublic: recipe.isPublic !== undefined ? recipe.isPublic : true
      });
    } catch (err) {
      console.error('Error loading recipe:', err);
      Alert.alert('Error', 'Failed to load recipe');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (field: keyof RecipeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        instructions: newInstructions
      }));
    }
  };

  const handleTagsChange = (text: string) => {
    const tags = text.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a recipe title');
      return;
    }

    if (formData.ingredients.some(ing => !ing.trim())) {
      Alert.alert('Error', 'Please fill in all ingredients');
      return;
    }

    if (formData.instructions.some(inst => !inst.trim())) {
      Alert.alert('Error', 'Please fill in all instructions');
      return;
    }

    setLoading(true);
    try {
      await recipeApi.update(id, formData);
      Alert.alert('Success', 'Recipe updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      console.error('Error updating recipe:', error);
      Alert.alert('Error', 'Failed to update recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get tags as string for display, handling undefined case
  const tagsText = formData.tags?.join(', ') || '';

  if (fetching) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$gray2">
        <ActivityIndicator size="large" color="$blue10" />
        <Text marginTop="$3" color="$gray11">Loading recipe...</Text>
      </YStack>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#f8f9fa' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <YStack padding="$4" space="$4">
          {/* Header */}
          <YStack alignItems="center" marginBottom="$2">
            <H2 color="$blue10" fontWeight="800">Edit Recipe</H2>
            <Text color="$gray9" textAlign="center">
              Update your culinary masterpiece
            </Text>
          </YStack>

          {/* Recipe Title */}
          <Card elevate bordered padding="$4" backgroundColor="white">
            <YStack space="$3">
              <H4 color="$gray12" fontWeight="600">🍳 Recipe Title</H4>
              <Input
                placeholder="e.g., Creamy Tomato Basil Soup"
                value={formData.title}
                onChangeText={(text) => handleInputChange('title', text)}
                borderColor="$gray4"
                focusStyle={{ borderColor: '$blue8', borderWidth: 2 }}
                fontSize="$5"
                padding="$3"
                backgroundColor="$gray1"
              />
            </YStack>
          </Card>

          {/* Description */}
          <Card elevate bordered padding="$4" backgroundColor="white">
            <YStack space="$3">
              <H4 color="$gray12" fontWeight="600">📝 Description</H4>
              <TextArea
                placeholder="Describe your recipe... What makes it special?"
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                borderColor="$gray4"
                numberOfLines={4}
                focusStyle={{ borderColor: '$blue8', borderWidth: 2 }}
                fontSize="$4"
                padding="$3"
                backgroundColor="$gray1"
                minHeight={100}
              />
            </YStack>
          </Card>

          {/* Cook Time & Servings */}
          <Card elevate bordered padding="$4" backgroundColor="white">
            <YStack space="$4">
              <H4 color="$gray12" fontWeight="600">⏰ Details</H4>
              <XStack space="$4">
                <YStack flex={1} space="$2">
                  <XStack alignItems="center" space="$2">
                    <ClockIcon />
                    <Text color="$gray11" fontWeight="500">Cook Time</Text>
                  </XStack>
                  <Input
                    placeholder="35 minutes"
                    value={formData.cookTime}
                    onChangeText={(text) => handleInputChange('cookTime', text)}
                    borderColor="$gray4"
                    focusStyle={{ borderColor: '$blue8', borderWidth: 2 }}
                    padding="$3"
                    backgroundColor="$gray1"
                  />
                </YStack>
                <YStack flex={1} space="$2">
                  <XStack alignItems="center" space="$2">
                    <ServingIcon />
                    <Text color="$gray11" fontWeight="500">Servings</Text>
                  </XStack>
                  <Input
                    placeholder="4"
                    value={formData.servings.toString()}
                    onChangeText={(text) => handleInputChange('servings', parseInt(text) || 4)}
                    keyboardType="numeric"
                    borderColor="$gray4"
                    focusStyle={{ borderColor: '$blue8', borderWidth: 2 }}
                    padding="$3"
                    backgroundColor="$gray1"
                  />
                </YStack>
              </XStack>
            </YStack>
          </Card>

          {/* Ingredients */}
          <Card elevate bordered padding="$4" backgroundColor="white">
            <YStack space="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <H4 color="$gray12" fontWeight="600">🥕 Ingredients</H4>
                <Button 
                  size="$2" 
                  onPress={addIngredient} 
                  chromeless
                  icon={<PlusIcon />}
                  color="$green10"
                  fontWeight="600"
                >
                  Add
                </Button>
              </XStack>
              
              {formData.ingredients.map((ingredient, index) => (
                <XStack 
                  key={index} 
                  space="$2" 
                  alignItems="center" 
                  marginBottom="$3"
                  padding="$2"
                  backgroundColor={index % 2 === 0 ? '$gray1' : 'transparent'}
                  borderRadius="$3"
                >
                  <Text color="$blue9" fontWeight="600" width={24}>
                    {index + 1}.
                  </Text>
                  <Input
                    flex={1}
                    placeholder={`Ingredient ${index + 1} (e.g., 2 tbsp olive oil)`}
                    value={ingredient}
                    onChangeText={(text) => handleIngredientChange(index, text)}
                    borderColor="$gray4"
                    focusStyle={{ borderColor: '$blue8', borderWidth: 2 }}
                    padding="$3"
                    backgroundColor="white"
                  />
                  {formData.ingredients.length > 1 && (
                    <Button
                      size="$2"
                      onPress={() => removeIngredient(index)}
                      chromeless
                      icon={<MinusIcon />}
                      color="$red10"
                      padding="$2"
                    />
                  )}
                </XStack>
              ))}
            </YStack>
          </Card>

          {/* Instructions */}
          <Card elevate bordered padding="$4" backgroundColor="white">
            <YStack space="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <H4 color="$gray12" fontWeight="600">📋 Instructions</H4>
                <Button 
                  size="$2" 
                  onPress={addInstruction} 
                  chromeless
                  icon={<PlusIcon />}
                  color="$green10"
                  fontWeight="600"
                >
                  Add
                </Button>
              </XStack>
              
              {formData.instructions.map((instruction, index) => (
                <YStack 
                  key={index} 
                  space="$2" 
                  marginBottom="$4"
                  padding="$3"
                  backgroundColor={index % 2 === 0 ? '$gray1' : 'transparent'}
                  borderRadius="$3"
                >
                  <XStack alignItems="center" space="$3">
                    <Text
                      backgroundColor="$blue9"
                      color="white"
                      width={30}
                      height={30}
                      textAlign="center"
                      lineHeight={30}
                      borderRadius="$12"
                      fontWeight="800"
                      fontSize="$3"
                    >
                      {index + 1}
                    </Text>
                    <Text color="$gray11" fontWeight="500">Step {index + 1}</Text>
                    {formData.instructions.length > 1 && (
                      <Button
                        size="$2"
                        onPress={() => removeInstruction(index)}
                        chromeless
                        icon={<MinusIcon />}
                        color="$red10"
                        marginLeft="auto"
                        padding="$2"
                      />
                    )}
                  </XStack>
                  <TextArea
                    placeholder={`Describe step ${index + 1} in detail...`}
                    value={instruction}
                    onChangeText={(text) => handleInstructionChange(index, text)}
                    borderColor="$gray4"
                    numberOfLines={3}
                    focusStyle={{ borderColor: '$blue8', borderWidth: 2 }}
                    padding="$3"
                    backgroundColor="white"
                    minHeight={80}
                  />
                </YStack>
              ))}
            </YStack>
          </Card>

          {/* Tags */}
          <Card elevate bordered padding="$4" backgroundColor="white">
            <YStack space="$3">
              <XStack alignItems="center" space="$2">
                <TagIcon />
                <H4 color="$gray12" fontWeight="600">Tags</H4>
              </XStack>
              <Input
                placeholder="vegetarian, easy, dinner, italian (separate with commas)"
                value={tagsText}
                onChangeText={handleTagsChange}
                borderColor="$gray4"
                focusStyle={{ borderColor: '$blue8', borderWidth: 2 }}
                padding="$3"
                backgroundColor="$gray1"
              />
              <Text color="$gray8" fontSize="$2" fontStyle="italic">
                Add relevant tags to help others discover your recipe
              </Text>
            </YStack>
          </Card>

          {/* Image URL */}
          <Card elevate bordered padding="$4" backgroundColor="white">
            <YStack space="$3">
              <XStack alignItems="center" space="$2">
                <ImageIcon />
                <H4 color="$gray12" fontWeight="600">Image URL (Optional)</H4>
              </XStack>
              <Input
                placeholder="https://example.com/recipe-image.jpg"
                value={formData.imageUrl || ''}
                onChangeText={(text) => handleInputChange('imageUrl', text)}
                borderColor="$gray4"
                focusStyle={{ borderColor: '$blue8', borderWidth: 2 }}
                padding="$3"
                backgroundColor="$gray1"
              />
            </YStack>
          </Card>

          {/* Visibility Toggle */}
          <Card elevate bordered padding="$4" backgroundColor="white">
            <YStack space="$3">
              <H4 color="$gray12" fontWeight="600">👁️ Visibility</H4>
              <XStack alignItems="center" space="$3">
                <Button
                  flex={1}
                  onPress={() => handleInputChange('isPublic', true)}
                  backgroundColor={formData.isPublic ? "$blue8" : "$gray3"}
                  color={formData.isPublic ? "white" : "$gray11"}
                >
                  Public
                </Button>
                <Button
                  flex={1}
                  onPress={() => handleInputChange('isPublic', false)}
                  backgroundColor={!formData.isPublic ? "$blue8" : "$gray3"}
                  color={!formData.isPublic ? "white" : "$gray11"}
                >
                  Private
                </Button>
              </XStack>
              <Text color="$gray8" fontSize="$2">
                {formData.isPublic 
                  ? "Anyone can view this recipe" 
                  : "Only you can view this recipe"
                }
              </Text>
            </YStack>
          </Card>

          {/* Action Buttons */}
          <YStack space="$3" marginTop="$4">
            <Button
              onPress={handleSubmit}
              backgroundColor="$blue9"
              color="white"
              size="$5"
              height="$5"
              disabled={loading}
              icon={loading ? <ActivityIndicator color="white" /> : undefined}
              fontWeight="800"
              fontSize="$5"
            >
              {loading ? 'Updating Recipe...' : '💾 Update Recipe'}
            </Button>

            <XStack space="$3">
              <Button
                flex={1}
                onPress={() => navigation.goBack()}
                chromeless
                color="$gray11"
                borderColor="$gray5"
                borderWidth={1}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                onPress={loadRecipe}
                chromeless
                color="$orange10"
                borderColor="$orange5"
                borderWidth={1}
              >
                Reset Changes
              </Button>
            </XStack>
          </YStack>

          <Spacer size="$4" />
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}