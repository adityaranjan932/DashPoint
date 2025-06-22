import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// createApiClient function
const createApiClient = () => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error) => {      // Only logout on 401 if it's actually an auth issue, not a network error
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message?.toLowerCase() || '';

        // Only logout if it's actually a token/auth issue
        if (errorMessage.includes('token') ||
          errorMessage.includes('expired') ||
          errorMessage.includes('invalid') ||
          errorMessage.includes('unauthorized')) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');

          // Use a timeout to prevent immediate redirect during page load
          setTimeout(() => {
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
              window.location.href = '/login';
            }
          }, 100);
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

// Authentication API
export const authAPI = {
  // loginUser function
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // registerUser function
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // logoutUser function
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // verifyToken function
  verifyToken: async () => {
    const response = await apiClient.get('/auth/verify');
    return response.data;
  }
};

// Sticky Notes API
export const stickyNotesAPI = {
  // getAllNotes function
  getAll: async () => {
    const response = await apiClient.get('/sticky-notes');
    return response.data;
  },

  // createNote function
  create: async (noteData) => {
    const response = await apiClient.post('/sticky-notes', noteData);
    return response.data;
  },

  // updateNote function
  update: async (id, noteData) => {
    const response = await apiClient.put(`/sticky-notes/${id}`, noteData);
    return response.data;
  },

  // deleteNote function
  delete: async (id) => {
    const response = await apiClient.delete(`/sticky-notes/${id}`);
    return response.data;
  }
};

// Todo API
export const todoAPI = {
  // getAllTodos function
  getAll: async () => {
    const response = await apiClient.get('/todos');
    return response.data;
  },

  // createTodo function
  create: async (todoData) => {
    const response = await apiClient.post('/todos', todoData);
    return response.data;
  },

  // updateTodo function
  update: async (id, todoData) => {
    const response = await apiClient.put(`/todos/${id}`, todoData);
    return response.data;
  },

  // deleteTodo function
  delete: async (id) => {
    const response = await apiClient.delete(`/todos/${id}`);
    return response.data;
  }
};

// Weather API
export const weatherAPI = {
  // getCurrentWeather function
  getCurrentWeather: async (location) => {
    const response = await apiClient.get(`/weather/current/city?city=${location}`);
    return response.data;
  },

  // getWeatherByCoords function
  getWeatherByCoords: async (lat, lon) => {
    const response = await apiClient.get(`/weather/current?lat=${lat}&lon=${lon}`);
    return response.data;
  }
};

// YouTube API
export const youtubeAPI = {
  // Get all saved videos
  getAll: async (page = 1, limit = 20) => {
    const response = await apiClient.get(`/youtube/videos?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Save a new video
  create: async (videoData) => {
    const response = await apiClient.post('/youtube/videos', videoData);
    return response.data;
  },

  // Update a saved video
  update: async (id, videoData) => {
    const response = await apiClient.put(`/youtube/videos/${id}`, videoData);
    return response.data;
  },

  // Delete a saved video
  delete: async (id) => {
    const response = await apiClient.delete(`/youtube/videos/${id}`);
    return response.data;
  },

  // Get video details from YouTube API
  getVideoDetails: async (videoId) => {
    const response = await apiClient.get(`/youtube/video/${videoId}`);
    return response.data;
  },

  // Search YouTube videos
  searchVideos: async (query, maxResults = 10, order = 'relevance') => {
    const response = await apiClient.get(`/youtube/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}&order=${order}`);
    return response.data;
  }
};

// Content API
export const contentAPI = {
  // Get all saved content
  getAll: async (page = 1, limit = 20) => {
    const response = await apiClient.get(`/content-extraction?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Save new content
  create: async (contentData) => {
    const response = await apiClient.post('/content-extraction', contentData);
    return response.data;
  },

  // Update saved content
  update: async (id, contentData) => {
    const response = await apiClient.put(`/content-extraction/${id}`, contentData);
    return response.data;
  },

  // Delete saved content
  delete: async (id) => {
    const response = await apiClient.delete(`/content-extraction/${id}`);
    return response.data;
  },

  // Extract content from URL
  extractContent: async (url) => {
    const response = await apiClient.post('/content-extraction/extract', { url });
    return response.data;
  }
};

// Collections API
export const collectionsAPI = {
  // getCollections function
  getCollections: async (page = 1, limit = 20, search = '') => {
    const response = await apiClient.get('/collections', {
      params: { page, limit, search }
    });
    return response.data;
  },
  // getCollection function
  getCollection: async (id) => {
    const response = await apiClient.get(`/collections/${id}`);
    return response.data;
  },

  // getCollectionWithItems function
  getCollectionWithItems: async (id) => {
    const response = await apiClient.get(`/collections/${id}/items`);
    return response.data;
  },

  // createCollection function
  createCollection: async (collectionData) => {
    const response = await apiClient.post('/collections', collectionData);
    return response.data;
  },

  // updateCollection function
  updateCollection: async (id, collectionData) => {
    const response = await apiClient.put(`/collections/${id}`, collectionData);
    return response.data;
  },

  // deleteCollection function
  deleteCollection: async (id) => {
    const response = await apiClient.delete(`/collections/${id}`);
    return response.data;
  },

  // addItemToCollection function
  addItemToCollection: async (collectionId, itemType, itemId) => {
    const response = await apiClient.post(`/collections/${collectionId}/items`, {
      itemType,
      itemId
    });
    return response.data;
  },

  // removeItemFromCollection function
  removeItemFromCollection: async (collectionId, itemType, itemId) => {
    const response = await apiClient.delete(`/collections/${collectionId}/items/${itemType}/${itemId}`);
    return response.data;
  },

  // getCollectionsForItem function
  getCollectionsForItem: async (itemType, itemId) => {
    const response = await apiClient.get(`/collections/item/${itemType}/${itemId}`);
    return response.data;
  }
};

// Universal AI Agent API
export const universalAIAPI = {  // Summarize text using Universal AI Agent
  summarizeText: async (textContent, summaryLength = 'medium') => {
    const response = await apiClient.post('/ai/universal/summarize-text', {
      text_content: textContent,
      summary_length: summaryLength
    });
    return response.data;
  },

  // Summarize YouTube video using Universal AI Agent
  summarizeYouTube: async (youtubeUrl, summaryLength = 'medium') => {
    const response = await apiClient.post('/ai/universal/summarize-youtube', {
      youtube_url: youtubeUrl,
      summary_length: summaryLength
    });
    return response.data;
  },

  // Chat with Universal AI Agent
  chat: async (prompt) => {
    const response = await apiClient.post('/ai/universal/chat', {
      prompt
    });
    return response.data;
  }
};

// Enhanced YouTube API with AI summarization
export const enhancedYouTubeAPI = {
  // Get video details with optional AI summary
  getVideoDetailsWithSummary: async (videoId, generateSummary = false, summaryLength = 'medium') => {
    const response = await apiClient.get(`/youtube/video-enhanced/${videoId}?generateSummary=${generateSummary}&summaryLength=${summaryLength}`);
    return response.data;
  },

  // Create video with optional AI summary
  createWithSummary: async (videoData, generateSummary = false, summaryLength = 'medium') => {
    const response = await apiClient.post('/youtube/videos-enhanced', {
      ...videoData,
      generateSummary,
      summaryLength
    });
    return response.data;
  }
};

// Enhanced Content API with AI summarization
export const enhancedContentAPI = {
  // Extract content with AI summarization
  extractWithSummary: async (url, options = {}) => {
    const {
      extractImages = false,
      extractLinks = false,
      maxContentLength = 10000,
      generateSummary = false,
      summaryLength = 'medium'
    } = options;

    const response = await apiClient.post('/content-extraction/extract-enhanced', {
      url,
      extractImages,
      extractLinks,
      maxContentLength,
      generateSummary,
      summaryLength
    });
    return response.data;
  }
};
