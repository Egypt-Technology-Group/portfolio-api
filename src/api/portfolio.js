import apiClient from './client';

/**
 * Generic fetcher for portfolio collections
 */
const fetchCollection = async (collection) => {
  const response = await apiClient.get(`/${collection}`);
  if (response.success && response.data?.success) {
    return response.data.data;
  }
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error || 'Failed to fetch data');
};

export const getProjects = () => fetchCollection('projects');
export const getArticles = () => fetchCollection('articles');
export const getSkills = () => fetchCollection('skills');
export const getTestimonials = () => fetchCollection('testimonials');
export const getAbout = () => fetchCollection('about');
export const getHero = () => fetchCollection('hero');
export const getServices = () => fetchCollection('services');
export const getSettings = () => fetchCollection('settings');
