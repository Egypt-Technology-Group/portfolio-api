/**
 * Hardened generic fetch wrapper for backend integration
 */
export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const baseURL = import.meta.env.VITE_API_ENDPOINT || '';
  const timeout = 10000; // 10s timeout

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const headers = { 'Content-Type': 'application/json' };
  
  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    signal: controller.signal
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await window.fetch(`${baseURL}${endpoint}`, config);
    clearTimeout(id);

    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (response.ok) {
      return {
        success: true,
        data,
        error: null
      };
    }

    return {
      success: false,
      data: null,
      error: data?.message || data || `Error: ${response.status} ${response.statusText}`
    };

  } catch (err) {
    clearTimeout(id);
    let errorMessage = 'Network error or request timeout';
    
    if (err.name === 'AbortError') {
      errorMessage = 'Request timed out';
    } else if (err.message) {
      errorMessage = err.message;
    }

    return {
      success: false,
      data: null,
      error: errorMessage
    };
  }
}

export default apiClient;
