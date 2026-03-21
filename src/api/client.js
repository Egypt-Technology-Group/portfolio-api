import axios from 'axios';

// Get base URL from environment
let baseURL = import.meta.env.VITE_API_ENDPOINT || '';

// Fix: Ensure baseURL is a full URL if it looks like a domain
if (baseURL && !baseURL.startsWith('http') && baseURL.includes('.')) {
  baseURL = 'https://' + baseURL;
}

// Remove trailing slash
baseURL = baseURL.replace(/\/$/, '');

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  },
  // Allow credentials if needed for CORS
  withCredentials: false
});

// Request interceptor - log requests in development
apiClient.interceptors.request.use(
  (config) => {
    console.log('[API Request]', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - normalize response format
apiClient.interceptors.response.use(
  (response) => {
    // For successful responses, return in expected format
    return {
      success: true,
      data: response.data,
      error: null
    };
  },
  (error) => {
    // For errors, return in expected format
    let errorMessage = 'Network error';
    
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      errorMessage = 'Request timed out';
    } else if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.message || error.response.data?.error || `${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      // Request made but no response - likely CORS or network issue
      console.error('[API Network Error]', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        message: 'No response received - check CORS, network, or if backend is running'
      });
      errorMessage = `No response from server - Backend may be offline or blocking CORS. Checked: ${error.config?.baseURL}${error.config?.url}`;
    } else {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      data: null,
      error: errorMessage
    };
  }
);

export default apiClient;
