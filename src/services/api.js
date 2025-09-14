const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async loginWithGoogle(user) {
    return this.request('/auth/google', {
      method: 'POST',
      body: { user },
    });
  }

  // For simple email/password login (fallback)
  async login(email, password) {
    // This is a fallback - the backend only supports Google auth currently
    throw new Error('Please use Google authentication');
  }

  // Symptom analysis methods
  async analyzeSymptoms(symptoms, userId = 'user123', location = null) {
    return this.request('/symptom', {
      method: 'POST',
      body: {
        userId,
        inputType: 'text',
        symptoms,
        location,
        advice: {
          likelyCondition: 'Analyzing...',
          confidence: '0%'
        }
      },
    });
  }

  // History methods
  async getConsultationHistory(userId = 'user123') {
    return this.request(`/history/${userId}`);
  }

  async getConsultationById(id) {
    return this.request(`/history/entry/${id}`);
  }

  // Maps methods
  async getNearbyFacilities(location) {
    return this.request('/maps/nearby', {
      method: 'POST',
      body: { location },
    });
  }

  // Video methods
  async generateHealthVideo(symptoms) {
    return this.request('/video/generate', {
      method: 'POST',
      body: { symptoms },
    });
  }
}

export default new ApiService();