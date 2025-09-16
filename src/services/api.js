const API_BASE_URL = 'https://cliniscribe.onrender.com/api';

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
      body: user, 
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
    try {
      const data = await this.request(`/history/${userId}`);
      return data.history || data;
    } catch (error) {
      console.error('Error fetching consultation history:', error);
      return [];
    }
  }

  async getConsultationById(id) {
    return this.request(`/history/entry/${id}`);
  }

  async updateRecoveryStatus(consultationId, isResolved, recoveryNotes = '', followUpRequired = false) {
    return this.request(`/history/recovery/${consultationId}`, {
      method: 'PUT',
      body: { isResolved, recoveryNotes, followUpRequired }
    });
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

  async sendFollowUpEmail({ to, name, yesUrl, noUrl, followUpDate }) {
    const subject = 'Cliniscribe: Your Follow-up Check';
    const html = `
      <div style="font-family:Arial, sans-serif; line-height:1.6;">
        <p>Hello ${name || 'there'},</p>
        <p>It's time for your follow-up on your recent health assessment.</p>
        <p>Are you feeling better now?</p>
        <p>
          <a href="${yesUrl}" style="background:#16a34a;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">YES</a>
          &nbsp;&nbsp;
          <a href="${noUrl}" style="background:#dc2626;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">NO</a>
        </p>
        ${followUpDate ? `<p><small>Scheduled follow-up: ${new Date(followUpDate).toLocaleString()}</small></p>` : ''}
        <p>— Cliniscribe</p>
      </div>
    `;
    return this.request('/email/send', {
      method: 'POST',
      body: { to, subject, html },
    });
  }

  async transcribeAudio(file) {
    const url = `${API_BASE_URL}/stt/transcribe`;
    const form = new FormData();
    form.append('audio', file, file.name || 'audio.webm');
    const resp = await fetch(url, {
      method: 'POST',
      body: form,
      credentials: 'include',
    });
    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      throw new Error(data.error || 'Transcription error');
    }
    return resp.json();
  }

  // Dashboard methods
  async getDashboardStats(userId) {
    try {
      const consultations = await this.getConsultationHistory(userId);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const thisMonthConsultations = consultations.filter(consultation => {
        const consultationDate = new Date(consultation.createdAt || consultation.date);
        return consultationDate.getMonth() === currentMonth &&
               consultationDate.getFullYear() === currentYear;
      }).length;

      const healthScore = this.calculateHealthScore(consultations);

      return {
        totalConsultations: consultations.length,
        thisMonthConsultations,
        healthScore
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalConsultations: 0,
        thisMonthConsultations: 0,
        healthScore: 'Good'
      };
    }
  }

  async getRecentConsultations(userId, limit = 5) {
    try {
      const consultations = await this.getConsultationHistory(userId);
      return consultations
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, limit)
        .map(consultation => ({
          id: consultation.id || consultation._id,
          title: consultation.symptoms?.substring(0, 50) + '...' || 'Consultation',
          date: consultation.createdAt || consultation.date
        }));
    } catch (error) {
      console.error('Error fetching recent consultations:', error);
      return [];
    }
  }

  calculateHealthScore(consultations) {
    if (!consultations || consultations.length === 0) {
      return 'Good';
    }

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const recentConsultations = consultations.filter(consultation => {
      const consultationDate = new Date(consultation.createdAt || consultation.date);
      return consultationDate >= lastMonth;
    });

    const consultationFrequency = recentConsultations.length;

    if (consultationFrequency === 0) {
      return 'Excellent';
    } else if (consultationFrequency <= 2) {
      return 'Good';
    } else if (consultationFrequency <= 5) {
      return 'Fair';
    } else {
      return 'Poor';
    }
  }
}

export default new ApiService();

