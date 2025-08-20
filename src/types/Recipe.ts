// Base Recipe Interface
export interface BaseRecipe {
  _id?: string;
  id?: string; // For GraphQL compatibility
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  servings: number;
  imageUrl?: string;
  tags?: string[];
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// REST API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  total?: number;
  pagination?: {
    page: number;
    pages: number;
  };
}

export interface RecipesResponse extends ApiResponse<BaseRecipe[]> {
  count: number;
  total: number;
  pagination: {
    page: number;
    pages: number;
  };
}

// GraphQL Response Types
export interface GraphQLResponse<T> {
  data: T;
  errors?: any[];
}

export interface RecipeQueryResponse {
  recipe: BaseRecipe;
}

export interface RecipesQueryResponse {
  recipes: BaseRecipe[];
}

// Unified Recipe type for frontend
export type Recipe = BaseRecipe;

// Form Data Type
export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  servings: number;
  imageUrl?: string;
  tags?: string[];
  isPublic?: boolean;
}