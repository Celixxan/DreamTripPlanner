/**
 * Dream Trip Planner - Authentication Module
 * Handles user authentication, registration, and session management
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthInitialized = false;
        this.authChangeCallbacks = [];
        
        // Initialize auth state from local storage
        this.init();
    }

    /**
     * Initialize authentication state
     */
    async init() {
        try {
            const token = localStorage.getItem('dreamTripToken');
            
            if (token) {
                // Try to get current user data with the stored token
                const response = await apiService.getCurrentUser();
                if (response.success && response.data) {
                    this.currentUser = response.data;
                }
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
            // Clear invalid token
            localStorage.removeItem('dreamTripToken');
        } finally {
            this.isAuthInitialized = true;
            this.notifyAuthChange();
        }
    }

    /**
     * Register a new user
     * @param {string} username - Username
     * @param {string} email - Email address
     * @param {string} password - Password
     * @returns {Promise} - Resolved with registration result
     */
    async register(username, email, password) {
        try {
            const response = await apiService.register({ username, email, password });
            
            if (response.success) {
                this.currentUser = response.user;
                this.notifyAuthChange();
            }
            
            return response;
        } catch (error) {
            console.error('Registration error:', error);
            return { 
                success: false, 
                message: error.message || 'Registration failed. Please try again.' 
            };
        }
    }

    /**
     * Login user
     * @param {string} email - Email address
     * @param {string} password - Password
     * @returns {Promise} - Resolved with login result
     */
    async login(email, password) {
        try {
            const response = await apiService.login({ email, password });
            
            if (response.success) {
                this.currentUser = response.user;
                this.notifyAuthChange();
            }
            
            return response;
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                message: error.message || 'Login failed. Please check your credentials.' 
            };
        }
    }

    /**
     * Logout user
     * @returns {Promise} - Resolved when logout is complete
     */
    async logout() {
        try {
            await apiService.logout();
            this.currentUser = null;
            this.notifyAuthChange();
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Check if user is logged in
     * @returns {boolean} - True if user is logged in
     */
    isLoggedIn() {
        return !!this.currentUser;
    }

    /**
     * Get current user
     * @returns {Object|null} - Current user or null if not logged in
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Register a callback to be called when auth state changes
     * @param {Function} callback - Function to call on auth state change
     */
    onAuthChange(callback) {
        this.authChangeCallbacks.push(callback);
        
        // Call immediately if auth is already initialized
        if (this.isAuthInitialized) {
            callback(this.isLoggedIn(), this.currentUser);
        }
    }

    /**
     * Notify all registered callbacks of auth state change
     */
    notifyAuthChange() {
        this.authChangeCallbacks.forEach(callback => {
            callback(this.isLoggedIn(), this.currentUser);
        });
    }
}

// Create and export auth manager instance
const authManager = new AuthManager();
