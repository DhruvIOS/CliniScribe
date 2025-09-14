// Placeholder Consultation entity for development
// Replace with your actual backend implementation

export class Consultation {
  static async create(data) {
    // Mock implementation for development
    // Replace with your actual API call
    const consultation = {
      id: Date.now().toString(),
      consultation_date: new Date().toISOString(),
      ...data,
      symptoms: data.symptoms || '',
    };

    // Store in localStorage for demo purposes
    const consultations = this.getStoredConsultations();
    consultations.unshift(consultation);
    localStorage.setItem('consultations', JSON.stringify(consultations));

    return consultation;
  }

  static async list(sortOrder = '-consultation_date', limit) {
    // Mock implementation for development
    // Replace with your actual API call
    const consultations = this.getStoredConsultations();

    // Sort by date (newest first for '-consultation_date')
    consultations.sort((a, b) => {
      if (sortOrder === '-consultation_date') {
        return new Date(b.consultation_date).getTime() - new Date(a.consultation_date).getTime();
      }
      return new Date(a.consultation_date).getTime() - new Date(b.consultation_date).getTime();
    });

    return limit ? consultations.slice(0, limit) : consultations;
  }

  static getStoredConsultations() {
    const stored = localStorage.getItem('consultations');
    return stored ? JSON.parse(stored) : [];
  }
}