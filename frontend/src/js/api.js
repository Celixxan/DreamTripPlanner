/**
 * Dream Trip Planner - API Service
 * Handles all communication with the backend API
 */

class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api';
        this.token = localStorage.getItem('dreamTripToken');
    }

    /**
     * Set authentication token for API requests
     * @param {string} token - JWT token
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('dreamTripToken', token);
    }

    /**
     * Clear authentication token
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('dreamTripToken');
    }

    /**
     * Get request headers with authentication
     * @returns {Object} - Headers object
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    /**
     * Handle API response
     * @param {Response} response - Fetch API response
     * @returns {Promise} - Resolved with response data or rejected with error
     */
    async handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    }

    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise} - Resolved with user data and token
     */
    async register(userData) {
        const response = await fetch(`${this.baseUrl}/auth/register`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(userData)
        });

        const data = await this.handleResponse(response);
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    /**
     * Login user
     * @param {Object} credentials - User login credentials
     * @returns {Promise} - Resolved with user data and token
     */
    async login(credentials) {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(credentials)
        });

        const data = await this.handleResponse(response);
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    /**
     * Logout user
     * @returns {Promise} - Resolved when logout is complete
     */
    async logout() {
        this.clearToken();
        return { success: true };
    }

    /**
     * Get current user data
     * @returns {Promise} - Resolved with user data
     */
    async getCurrentUser() {
        const response = await fetch(`${this.baseUrl}/auth/me`, {
            headers: this.getHeaders()
        });

        return this.handleResponse(response);
    }

    /**
     * Get all trips for current user
     * @returns {Promise} - Resolved with trips data
     */
    async getTrips() {
        const response = await fetch(`${this.baseUrl}/trips`, {
            headers: this.getHeaders()
        });

        return this.handleResponse(response);
    }

    /**
     * Get a single trip by ID
     * @param {string} tripId - Trip ID
     * @returns {Promise} - Resolved with trip data
     */
    async getTrip(tripId) {
        const response = await fetch(`${this.baseUrl}/trips/${tripId}`, {
            headers: this.getHeaders()
        });

        return this.handleResponse(response);
    }

    /**
     * Create a new trip
     * @param {Object} tripData - Trip data
     * @returns {Promise} - Resolved with created trip data
     */
    async createTrip(tripData) {
        const response = await fetch(`${this.baseUrl}/trips`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(tripData)
        });

        return this.handleResponse(response);
    }

    /**
     * Update an existing trip
     * @param {string} tripId - Trip ID
     * @param {Object} tripData - Updated trip data
     * @returns {Promise} - Resolved with updated trip data
     */
    async updateTrip(tripId, tripData) {
        const response = await fetch(`${this.baseUrl}/trips/${tripId}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(tripData)
        });

        return this.handleResponse(response);
    }

    /**
     * Delete a trip
     * @param {string} tripId - Trip ID
     * @returns {Promise} - Resolved when deletion is complete
     */
    async deleteTrip(tripId) {
        const response = await fetch(`${this.baseUrl}/trips/${tripId}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });

        return this.handleResponse(response);
    }
}

// Create and export API service instance
const apiService = new ApiService();
