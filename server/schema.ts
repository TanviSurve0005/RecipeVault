export const typeDefs = `#graphql
  type Ingredient {
    name: String!
    amount: String
  }

  type Recipe {
    id: ID!
    title: String!
    ingredients: [Ingredient!]!
    steps: [String!]!
    category: String!
  }

  type Query {
    recipes: [Recipe!]!
    recipe(id: ID!): Recipe
  }
`;