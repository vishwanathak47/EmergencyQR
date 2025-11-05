# Netlify Function Directory

This directory contains serverless functions that can be deployed to Netlify. These are optional and not required for the main application since the backend is hosted on Render.

## Available Functions

- `health-check.js`: A simple health check endpoint accessible at `/.netlify/functions/health-check`
  - Returns basic status information
  - Can be used to verify the frontend deployment

## Adding New Functions

To add a new function:

1. Create a new .js file in this directory
2. Export a handler function
3. Deploy to Netlify
4. Access at /.netlify/functions/your-function-name

Example function structure:
```javascript
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Your response here" })
  };
};
```

Note: These serverless functions are separate from your main backend on Render and are optional.