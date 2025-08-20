import { Recipe, RecipeFormData, RecipesResponse, ApiResponse } from '../types/Recipe';
import { API_CONFIG } from '../config/api';

const REST_BASE_URL = API_CONFIG.restEndpoint;

// Generic REST API request function
async function restRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${REST_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status} ${response.statusText}`);
  }

  return data;
}

// Normalize recipe data for consistent frontend usage
const normalizeRecipe = (recipe: any): Recipe => ({
  ...recipe,
  id: recipe._id || recipe.id, // Ensure we always have an id field
});

// REST API functions
export const restApi = {
  // Get all recipes with optional search and pagination
  getAll: async (page = 1, limit = 10, search = ''): Promise<{ recipes: Recipe[]; total: number }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    
    const response = await restRequest<RecipesResponse>(`/recipes?${params}`);
    return {
      recipes: response.data.map(normalizeRecipe),
      total: response.total || 0
    };
  },

  // Get single recipe
  getById: async (id: string): Promise<Recipe> => {
    const response = await restRequest<ApiResponse<Recipe>>(`/recipes/${id}`);
    return normalizeRecipe(response.data);
  },

  // Create new recipe
  create: async (recipeData: RecipeFormData): Promise<Recipe> => {
    const response = await restRequest<ApiResponse<Recipe>>('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
    return normalizeRecipe(response.data);
  },

  // Update recipe
  update: async (id: string, recipeData: Partial<RecipeFormData>): Promise<Recipe> => {
    const response = await restRequest<ApiResponse<Recipe>>(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recipeData),
    });
    return normalizeRecipe(response.data);
  },

  // Delete recipe
  delete: async (id: string): Promise<void> => {
    await restRequest(`/recipes/${id}`, {
      method: 'DELETE',
    });
  },

  // Get recipes by tag
  getByTag: async (tag: string): Promise<Recipe[]> => {
    const response = await restRequest<ApiResponse<Recipe[]>>(`/recipes/tag/${encodeURIComponent(tag)}`);
    return response.data.map(normalizeRecipe);
  },
};