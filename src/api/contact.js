import apiClient from './client';

/**
 * Submit contact form payload to backend
 * 
 * @param {Object} payload - { name, email, subject, message }
 * @returns {Promise}
 */
export const submitContactForm = async (payload) => {
  if (!import.meta.env.VITE_API_ENDPOINT) {
    const warning = 'VITE_API_ENDPOINT is not defined. API call will likely fail.';
    return {
      success: false,
      data: null,
      error: warning
    };
  }

  return apiClient('/contact', { body: payload });
};
