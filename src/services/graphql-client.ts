import { GraphQLClient } from "graphql-request";

export function getGqlClient() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";
  
  const client = new GraphQLClient(apiUrl, {
    errorPolicy: 'all', // Return both data and errors
    requestMiddleware: (request) => {
      // Add debug logging if enabled
      if (process.env.NEXT_PUBLIC_DEBUG_GRAPHQL === 'true') {
        console.log('GraphQL Request:', {
          query: request.query,
          variables: request.variables,
          url: request.url
        });
      }
      return request;
    },
    responseMiddleware: (response) => {
      // Add debug logging if enabled
      if (process.env.NEXT_PUBLIC_DEBUG_GRAPHQL === 'true') {
        console.log('GraphQL Response:', response);
      }
      
      // Check for null data responses that might indicate resolver issues
      if (response && response.data && Object.values(response.data).some(value => value === null)) {
        console.warn('GraphQL response contains null values:', response.data);
      }
      
      return response;
    }
  });
  
  return client;
}
