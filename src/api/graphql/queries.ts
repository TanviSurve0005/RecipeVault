import { Recipe, RecipeFormData } from '../../types/Recipe';
import { API_CONFIG } from '../../config/api';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Initialize Apollo Client
export const apolloClient = new ApolloClient({
  uri: API_CONFIG.graphqlEndpoint,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});

// GraphQL Queries and Mutations
const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      title
      description
      ingredients
      instructions
      cookTime
      servings
      imageUrl
      tags
      isPublic
      createdAt
      updatedAt
    }
  }
`;

const GET_RECIPE = gql`
  query GetRecipe($id: ID!) {
    recipe(id: $id) {
      id
      title
      description
      ingredients
      instructions
      cookTime
      servings
      imageUrl
      tags
      isPublic
      createdAt
      updatedAt
    }
  }
`;

const CREATE_RECIPE = gql`
  mutation CreateRecipe($input: RecipeInput!) {
    createRecipe(input: $input) {
      id
      title
      description
      ingredients
      instructions
      cookTime
      servings
      imageUrl
      tags
      isPublic
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($id: ID!, $input: RecipeInput!) {
    updateRecipe(id: $id, input: $input) {
      id
      title
      description
      ingredients
      instructions
      cookTime
      servings
      imageUrl
      tags
      isPublic
      updatedAt
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id)
  }
`;

// GraphQL API functions
export const graphqlApi = {
  // Get all recipes
  getAll: async (): Promise<{ recipes: Recipe[]; total: number }> => {
    const { data } = await apolloClient.query({
      query: GET_RECIPES,
      fetchPolicy: 'network-only',
    });

    return {
      recipes: data.recipes,
      total: data.recipes.length
    };
  },

  // Get single recipe
  getById: async (id: string): Promise<Recipe> => {
    const { data } = await apolloClient.query({
      query: GET_RECIPE,
      variables: { id },
      fetchPolicy: 'network-only',
    });

    return data.recipe;
  },

  // Create new recipe
  create: async (recipeData: RecipeFormData): Promise<Recipe> => {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_RECIPE,
      variables: { input: recipeData },
    });

    return data.createRecipe;
  },

  // Update recipe
  update: async (id: string, recipeData: Partial<RecipeFormData>): Promise<Recipe> => {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_RECIPE,
      variables: { id, input: recipeData },
    });

    return data.updateRecipe;
  },

  // Delete recipe
  delete: async (id: string): Promise<void> => {
    await apolloClient.mutate({
      mutation: DELETE_RECIPE,
      variables: { id },
    });
  },
};