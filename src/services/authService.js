// Fake Authentication Service
// Simulates real authentication with localStorage persistence

const STORAGE_KEY = 'dashboard_auth_user';
const SESSION_KEY = 'dashboard_session_id';

// Fake users database
const FAKE_USERS = [
  {
    id: 1,
    email: 'admin@dashboard.com',
    password: 'admin', // In real app, this would be hashed
    name: 'Admin Dashboard',
    role: 'admin',
    avatar: '👨‍💼',
    permissions: ['read', 'write', 'delete'],
    lastLogin: null,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    email: 'demo@dashboard.com', 
    password: 'demo',
    name: 'Demo User',
    role: 'viewer',
    avatar: '👤',
    permissions: ['read'],
    lastLogin: null,
    createdAt: '2024-01-15T00:00:00.000Z'
  }
];

class AuthService {
  constructor() {
    this.currentUser = null;
    this.sessionId = null;
  }

  // Simulate API delay for realistic UX
  async simulateApiDelay(min = 800, max = 1500) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Generate fake session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Authenticate user credentials
  async login({ email, password }) {
    await this.simulateApiDelay();

    // Find user in fake database
    const user = FAKE_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Create user session
    const sessionId = this.generateSessionId();
    const loginTime = new Date().toISOString();
    
    const userSession = {
      ...user,
      password: undefined, // Never store password in session
      sessionId,
      loginTime,
      lastLogin: loginTime,
      isActive: true
    };

    // Store in localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userSession));
      localStorage.setItem(SESSION_KEY, sessionId);
    } catch (error) {
      console.error('Failed to save session:', error);
      throw new Error('Failed to create session');
    }

    this.currentUser = userSession;
    this.sessionId = sessionId;

    return userSession;
  }

  // Logout and clear session
  logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
    
    this.currentUser = null;
    this.sessionId = null;
  }

  // Get current authenticated user
  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      const storedSessionId = localStorage.getItem(SESSION_KEY);

      if (!storedUser || !storedSessionId) {
        return null;
      }

      const user = JSON.parse(storedUser);
      
      // Validate session (in real app, check server-side)
      if (user.sessionId !== storedSessionId) {
        this.logout(); // Invalid session
        return null;
      }

      // Check if session expired (24 hours)
      const loginTime = new Date(user.loginTime);
      const now = new Date();
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        this.logout(); // Session expired
        return null;
      }

      this.currentUser = user;
      this.sessionId = storedSessionId;
      
      return user;
    } catch (error) {
      console.error('Error retrieving session:', error);
      this.logout(); // Clear corrupted data
      return null;
    }
  }

  // Update user data (except password)
  updateUser(userData) {
    if (!this.currentUser) {
      throw new Error('No active session');
    }

    const updatedUser = {
      ...this.currentUser,
      ...userData,
      password: undefined, // Never allow password update this way
      id: this.currentUser.id, // Prevent ID change
      sessionId: this.currentUser.sessionId, // Prevent session ID change
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      this.currentUser = updatedUser;
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user data');
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user && user.isActive;
  }

  // Get user permissions
  getUserPermissions() {
    const user = this.getCurrentUser();
    return user?.permissions || [];
  }

  // Check specific permission
  hasPermission(permission) {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }

  // Get session info
  getSessionInfo() {
    const user = this.getCurrentUser();
    if (!user) return null;

    return {
      sessionId: user.sessionId,
      loginTime: user.loginTime,
      userAgent: navigator.userAgent,
      lastActivity: new Date().toISOString()
    };
  }

  // Refresh session (extend expiry)
  refreshSession() {
    const user = this.getCurrentUser();
    if (!user) return false;

    const refreshedUser = {
      ...user,
      lastActivity: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshedUser));
      this.currentUser = refreshedUser;
      return true;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

// Helper functions for easy access
export const loginUser = (credentials) => authService.login(credentials);
export const logoutUser = () => authService.logout();
export const getCurrentUser = () => authService.getCurrentUser();
export const isAuthenticated = () => authService.isAuthenticated();
export const hasPermission = (permission) => authService.hasPermission(permission);