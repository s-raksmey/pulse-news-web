import { GraphQLClient } from "graphql-request";

function getApiUrl(): string {
  // Check for explicit environment variable first
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('🔗 Using configured API URL:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Try to detect the environment and construct appropriate URL
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    
    // If we're on localhost, assume development environment
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const devUrl = "http://localhost:4000/graphql";
      console.log('🔗 Development environment detected, using:', devUrl);
      return devUrl;
    }
    
    // For production, try to construct API URL based on current domain
    // This assumes the API is on the same domain but different port or subdomain
    const productionUrl = `${protocol}//api.${hostname}/graphql`;
    console.log('🔗 Production environment detected, trying:', productionUrl);
    return productionUrl;
  }

  // Server-side fallback
  const fallbackUrl = "http://localhost:4000/graphql";
  console.log('🔗 Server-side fallback:', fallbackUrl);
  return fallbackUrl;
}

export function getGqlClient() {
  const apiUrl = getApiUrl();
  
  const client = new GraphQLClient(apiUrl, {
    errorPolicy: 'all', // Return both data and errors
    requestMiddleware: (request) => {
      // Add debug logging if enabled
      if (process.env.NEXT_PUBLIC_DEBUG_GRAPHQL === "true") {
        let parsedBody: unknown = undefined;
        if (typeof request.body === "string") {
          try {
            parsedBody = JSON.parse(request.body);
          } catch {
            parsedBody = request.body;
          }
        }

        console.log("GraphQL Request:", {
          url: request.url,
          body: parsedBody,
        });
      }
      return request;
    },
    responseMiddleware: (response) => {
      // Add debug logging if enabled
      if (process.env.NEXT_PUBLIC_DEBUG_GRAPHQL === "true") {
        console.log("GraphQL Response:", response);
      }

      const data =
        response && "data" in response
          ? response.data
          : response && "response" in response
          ? response.response?.data
          : undefined;

      // Check for null data responses that might indicate resolver issues
      if (data && Object.values(data).some((value) => value === null)) {
        console.warn("GraphQL response contains null values:", data);
      }
    },
  });
  
  return client;
}
