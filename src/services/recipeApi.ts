import { Recipe, RecipeFormData } from '../types/Recipe';
import { isGraphQLMode, isRESTMode } from '../config/api';
import { graphqlApi } from '../api/graphql/queries';
import { restApi } from './restApi';

// Unified API service that switches between GraphQL and REST
export const recipeApi = {
  // Get all recipes
  getAll: async (page = 1, limit = 10, search = ''): Promise<{ recipes: Recipe[]; total: number }> => {
    if (isGraphQLMode()) {
      return graphqlApi.getAll();
    } else if (isRESTMode()) {
      return restApi.getAll(page, limit, search);
    }
    throw new Error('API mode not configured');
  },

  // Get single recipe
  getById: async (id: string): Promise<Recipe> => {
    if (isGraphQLMode()) {
      return graphqlApi.getById(id);
    } else if (isRESTMode()) {
      return restApi.getById(id);
    }
    throw new Error('API mode not configured');
  },

  // Create new recipe
  create: async (recipeData: RecipeFormData): Promise<Recipe> => {
    if (isGraphQLMode()) {
      return graphqlApi.create(recipeData);
    } else if (isRESTMode()) {
      return restApi.create(recipeData);
    }
    throw new Error('API mode not configured');
  },

  // Update recipe
  update: async (id: string, recipeData: Partial<RecipeFormData>): Promise<Recipe> => {
    if (isGraphQLMode()) {
      return graphqlApi.update(id, recipeData);
    } else if (isRESTMode()) {
      return restApi.update(id, recipeData);
    }
    throw new Error('API mode not configured');
  },

  // Delete recipe
  delete: async (id: string): Promise<void> => {
    if (isGraphQLMode()) {
      return graphqlApi.delete(id);
    } else if (isRESTMode()) {
      return restApi.delete(id);
    }
    throw new Error('API mode not configured');
  },
};

// Export both APIs for direct access if needed
export { graphqlApi, restApi };