// Example Netlify Function to check API health
// Access at /.netlify/functions/health-check
exports.handler = async (event, context) => {
  try {
    const apiUrl = process.env.VITE_SERVER_URL || 'https://emergencyqr-jtlp.onrender.com/api';
    
    // Just return success - you can modify this to actually ping your API
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'ok',
        message: 'Frontend is working',
        timestamp: new Date().toISOString(),
        apiEndpoint: apiUrl
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};