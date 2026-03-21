import apiClient from './client';

/**
 * Submit contact form payload to backend
 *
 * @param {Object} payload - { name, email, subject, message }
 * @returns {Promise}
 */
export const submitContactForm = async (payload) => {
  const response = await apiClient.post('/contact', payload);
  return response;
};
