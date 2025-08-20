interface Ingredient {
  name: string;
  amount?: string;
}

interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  category: string;
}

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Pancakes',
    ingredients: [{ name: 'Flour', amount: '1 cup' }],
    steps: ['Mix ingredients', 'Cook on pan'],
    category: 'breakfast'
  }
];

export const resolvers = {
  Query: {
    recipes: (): Recipe[] => mockRecipes,
    recipe: (_: unknown, args: { id: string }): Recipe | undefined => {
      return mockRecipes.find(r => r.id === args.id);
    }
  }
};