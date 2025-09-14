// Placeholder User entity for development
// Replace with your actual backend implementation

export class User {
  static async me() {
    // Mock implementation for development
    // Replace with your actual API call
    return {
      id: '1',
      full_name: 'Game User',
      email: 'game@example.com'
    };
  }

  static async loginWithRedirect(redirectUrl) {
    // Mock implementation for development
    // Replace with your actual authentication
    console.log('Redirecting to login:', redirectUrl);
    // For demo purposes, set a mock user
    localStorage.setItem('userName', 'Game User');
    window.location.href = redirectUrl;
  }
}