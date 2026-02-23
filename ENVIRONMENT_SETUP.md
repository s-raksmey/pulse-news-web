# Environment Setup Guide

## GraphQL API Configuration

The web application needs to connect to the GraphQL API server. The API endpoint is configured via environment variables.

### Development Setup

For local development, create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your settings
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
NEXT_PUBLIC_DEBUG_GRAPHQL=true
```

### Production Setup

For production deployment, set the `NEXT_PUBLIC_API_URL` environment variable to your actual API server URL:

```bash
# Example production URLs:
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/graphql
NEXT_PUBLIC_API_URL=https://your-server-url.com/graphql
NEXT_PUBLIC_API_URL=https://pulse-news-api.herokuapp.com/graphql
```

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | GraphQL API endpoint URL | `http://localhost:4000/graphql` | Yes |
| `NEXT_PUBLIC_DEBUG_GRAPHQL` | Enable GraphQL request/response logging | `false` | No |

### Auto-Detection

If `NEXT_PUBLIC_API_URL` is not set, the application will try to auto-detect the correct API URL:

1. **Development**: If running on localhost, uses `http://localhost:4000/graphql`
2. **Production**: Tries to construct API URL as `https://api.{current-domain}/graphql`

### Troubleshooting

If categories are not loading in the navigation menu:

1. **Check the debug panel** (top-right corner) for API connection status
2. **Open browser console** (F12) to see GraphQL request logs
3. **Verify API URL** is correct for your environment
4. **Test API directly** by visiting the GraphQL endpoint in your browser

### Common Issues

**Issue**: "No categories found in response"
**Solution**: Check that `NEXT_PUBLIC_API_URL` points to the correct server

**Issue**: CORS errors in console
**Solution**: Ensure the API server's CORS configuration includes your web app's domain

**Issue**: Network errors
**Solution**: Verify the API server is running and accessible from your web app environment
