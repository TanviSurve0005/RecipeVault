import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { gql } from '@apollo/client'; // Add gql import

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// Define types for the request
interface GraphQLRequest {
  query: string;
  variables?: {
    id?: string;
    [key: string]: any;
  };
  operationName?: string;
}

// Mock link that provides actual recipe data
const mockLink = new HttpLink({
  uri: '/graphql',
  fetch: (uri, options) => {
    const body = JSON.parse(options?.body as string) as GraphQLRequest;
    const variables = body.variables;
    
    // Handle different queries
    if (body.query.includes('GetRecipe') && variables?.id) {
      // Return mock recipe data based on ID
      const mockRecipes = {
        '1': {
          id: '1',
          title: 'Spaghetti Carbonara',
          description: 'Classic Italian pasta dish with eggs, cheese, and pancetta',
          ingredients: [
            '400g spaghetti',
            '200g pancetta or guanciale',
            '4 large eggs',
            '50g pecorino cheese',
            '50g parmesan cheese',
            'Black pepper',
            'Salt'
          ],
          instructions: [
            'Bring a large pot of salted water to boil and cook spaghetti al dente',
            'Cut pancetta into small cubes and cook until crispy',
            'Whisk eggs and grated cheeses together with black pepper',
            'Drain pasta, reserving some pasta water',
            'Combine hot pasta with pancetta and egg mixture, stirring quickly',
            'Add pasta water to create a creamy sauce',
            'Serve immediately with extra cheese and pepper'
          ],
          cookTime: '20 minutes',
          servings: 4,
          createdAt: new Date('2024-01-15').toISOString(),
        },
        '2': {
          id: '2',
          title: 'Chicken Curry',
          description: 'Spicy and flavorful Indian-style chicken curry',
          ingredients: [
            '500g chicken breast, cubed',
            '2 onions, finely chopped',
            '3 tomatoes, pureed',
            '2 tbsp curry powder',
            '1 tbsp garam masala',
            '1 cup coconut milk',
            '2 tbsp oil',
            'Salt to taste'
          ],
          instructions: [
            'Heat oil in a pan and sauté onions until golden brown',
            'Add chicken and cook until no longer pink',
            'Add curry powder and cook for 2 minutes',
            'Add tomato puree and cook until oil separates',
            'Add coconut milk and simmer for 15 minutes',
            'Finish with garam masala and serve with rice'
          ],
          cookTime: '30 minutes',
          servings: 4,
          createdAt: new Date('2024-01-20').toISOString(),
        }
      };

      // Type-safe access to mockRecipes
      const recipeId = variables.id as keyof typeof mockRecipes;
      const recipe = mockRecipes[recipeId] || null;
      
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              recipe: recipe
            },
          }),
          {
            status: recipe ? 200 : 404,
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
          },
        ),
      );
    }
    
    // Default response for other queries
    return Promise.resolve(
      new Response(
        JSON.stringify({
          data: null,
        }),
        {
          status: 404,
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        },
      ),
    );
  },
});

// Optional: Add authentication headers if needed
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    }
  };
});

// Create Apollo Client with mock data
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, mockLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'ignore',
    },
  },
});

// Pre-populate cache with some recipes
apolloClient.writeQuery({
  query: gql`
    query GetRecipes {
      recipes {
        id
        title
        description
      }
    }
  `,
  data: {
    recipes: [
      {
        id: '1',
        title: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta dish',
      },
      {
        id: '2',
        title: 'Chicken Curry',
        description: 'Spicy and flavorful curry',
      },
    ],
  },
});