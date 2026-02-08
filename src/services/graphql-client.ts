import { GraphQLClient } from "graphql-request";

export function getGqlClient() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";
  
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
