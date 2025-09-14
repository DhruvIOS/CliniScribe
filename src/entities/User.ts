// Placeholder User entity for development
// Replace with your actual backend implementation

export interface UserData {
  id: string;
  full_name: string;
  email: string;
}

export class User {
  static async me(): Promise<UserData> {
    // Mock implementation for development
    // Replace with your actual API call
    return {
      id: '1',
      full_name: 'Game User',
      email: 'game@example.com'
    };
  }

  static async loginWithRedirect(redirectUrl: string): Promise<void> {
    // Mock implementation for development
    // Replace with your actual authentication
    console.log('Redirecting to login:', redirectUrl);
    // For demo purposes, set a mock user
    localStorage.setItem('userName', 'Game User');
    window.location.href = redirectUrl;
  }
}