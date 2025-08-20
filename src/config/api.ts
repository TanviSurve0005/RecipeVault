export const API_CONFIG = {
  // Set to 'graphql' or 'rest'
  mode: 'rest' as 'graphql' | 'rest',
  
  // API endpoints
  graphqlEndpoint: 'http://localhost:3000/graphql',
  restEndpoint: 'http://localhost:3001/api',
  
  // Timeout settings
  timeout: 10000,
};

// Helper to check current mode
export const isGraphQLMode = () => API_CONFIG.mode === 'graphql';
export const isRESTMode = () => API_CONFIG.mode === 'rest';