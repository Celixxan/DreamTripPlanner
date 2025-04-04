/**
 * Dream Trip Planner - Mock API Service
 * This provides a frontend-only implementation that works without a Node.js backend
 * Uses localStorage to persist data
 */

class MockApiService {
    constructor() {
        this.initializeStorage();
    }

    /**
     * Initialize local storage with default data if needed
     */
    initializeStorage() {
        // Initialize users if not exists
        if (!localStorage.getItem('dreamTrip_users')) {
            localStorage.setItem('dreamTrip_users', JSON.stringify([]));
        }

        // Initialize trips if not exists
        if (!localStorage.getItem('dreamTrip_trips')) {
            localStorage.setItem('dreamTrip_trips', JSON.stringify([]));
        }

        // Initialize current user if not exists
        if (!localStorage.getItem('dreamTrip_currentUser')) {
            localStorage.setItem('dreamTrip_currentUser', JSON.stringify(null));
        }

        // Initialize token if not exists
        if (!localStorage.getItem('dreamTripToken')) {
            localStorage.setItem('dreamTripToken', '');
        }
    }

    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise} - Resolved with registration result
     */
    async register(userData) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem('dreamTrip_users'));
                    
                    // Check if email already exists
                    const existingUser = users.find(user => user.email === userData.email);
                    if (existingUser) {
                        return resolve({ 
                            success: false, 
                            message: 'Email already in use' 
                        });
                    }
                    
                    // Create new user
                    const newUser = {
                        _id: 'user_' + Date.now(),
                        username: userData.username,
                        email: userData.email,
                        password: userData.password, // In a real app, this would be hashed
                        createdAt: new Date().toISOString()
                    };
                    
                    // Add to users array
                    users.push(newUser);
                    localStorage.setItem('dreamTrip_users', JSON.stringify(users));
                    
                    // Set current user
                    const userToReturn = { ...newUser };
                    delete userToReturn.password; // Don't return password
                    
                    localStorage.setItem('dreamTrip_currentUser', JSON.stringify(userToReturn));
                    
                    // Generate mock token
                    const token = 'mock_token_' + Date.now();
                    localStorage.setItem('dreamTripToken', token);
                    
                    resolve({ 
                        success: true, 
                        message: 'Registration successful',
                        user: userToReturn,
                        token
                    });
                } catch (error) {
                    resolve({ 
                        success: false, 
                        message: 'Registration failed: ' + error.message 
                    });
                }
            }, 500); // 500ms delay to simulate network
        });
    }

    /**
     * Login user
     * @param {Object} credentials - Login credentials
     * @returns {Promise} - Resolved with login result
     */
    async login(credentials) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem('dreamTrip_users'));
                    
                    // Find user by email
                    const user = users.find(user => user.email === credentials.email);
                    
                    // Check if user exists and password matches
                    if (!user || user.password !== credentials.password) {
                        return resolve({ 
                            success: false, 
                            message: 'Invalid email or password' 
                        });
                    }
                    
                    // Set current user
                    const userToReturn = { ...user };
                    delete userToReturn.password; // Don't return password
                    
                    localStorage.setItem('dreamTrip_currentUser', JSON.stringify(userToReturn));
                    
                    // Generate mock token
                    const token = 'mock_token_' + Date.now();
                    localStorage.setItem('dreamTripToken', token);
                    
                    resolve({ 
                        success: true, 
                        message: 'Login successful',
                        user: userToReturn,
                        token
                    });
                } catch (error) {
                    resolve({ 
                        success: false, 
                        message: 'Login failed: ' + error.message 
                    });
                }
            }, 500); // 500ms delay to simulate network
        });
    }

    /**
     * Logout user
     * @returns {Promise} - Resolved when logout is complete
     */
    async logout() {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    // Clear current user and token
                    localStorage.setItem('dreamTrip_currentUser', JSON.stringify(null));
                    localStorage.setItem('dreamTripToken', '');
                    
                    resolve({ 
                        success: true, 
                        message: 'Logout successful' 
                    });
                } catch (error) {
                    resolve({ 
                        success: false, 
                        message: 'Logout failed: ' + error.message 
                    });
                }
            }, 300); // 300ms delay to simulate network
        });
    }

    /**
     * Get current user
     * @returns {Promise} - Resolved with current user data
     */
    async getCurrentUser() {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    const token = localStorage.getItem('dreamTripToken');
                    
                    if (!token) {
                        return resolve({ 
                            success: false, 
                            message: 'Not authenticated' 
                        });
                    }
                    
                    const currentUser = JSON.parse(localStorage.getItem('dreamTrip_currentUser'));
                    
                    if (!currentUser) {
                        return resolve({ 
                            success: false, 
                            message: 'User not found' 
                        });
                    }
                    
                    resolve({ 
                        success: true, 
                        data: currentUser 
                    });
                } catch (error) {
                    resolve({ 
                        success: false, 
                        message: 'Failed to get current user: ' + error.message 
                    });
                }
            }, 300); // 300ms delay to simulate network
        });
    }

    /**
     * Get all trips for current user
     * @returns {Promise} - Resolved with trips data
     */
    async getTrips() {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    const currentUser = JSON.parse(localStorage.getItem('dreamTrip_currentUser'));
                    
                    if (!currentUser) {
                        return resolve({ 
                            success: false, 
                            message: 'Not authenticated' 
                        });
                    }
                    
                    const allTrips = JSON.parse(localStorage.getItem('dreamTrip_trips'));
                    const userTrips = allTrips.filter(trip => trip.user === currentUser._id);
                    
                    resolve({ 
                        success: true, 
                        data: userTrips 
                    });
                } catch (error) {
                    resolve({ 
                        success: false, 
                        message: 'Failed to get trips: ' + error.message 
                    });
                }
            }, 500); // 500ms delay to simulate network
        });
    }

    /**
     * Get a single trip by ID
     * @param {string} tripId - Trip ID
     * @returns {Promise} - Resolved with trip data
     */
    async getTrip(tripId) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    const currentUser = JSON.parse(localStorage.getItem('dreamTrip_currentUser'));
                    
                    if (!currentUser) {
                        return resolve({ 
                            success: false, 
                            message: 'Not authenticated' 
                        });
                    }
                    
                    const allTrips = JSON.parse(localStorage.getItem('dreamTrip_trips'));
                    const trip = allTrips.find(trip => trip._id === tripId && trip.user === currentUser._id);
                    
                    if (!trip) {
                        return resolve({ 
                            success: false, 
                            message: 'Trip not found' 
                        });
                    }
                    
                    resolve({ 
                        success: true, 
                        data: trip 
                    });
                } catch (error) {
                    resolve({ 
                        success: false, 
                        message: 'Failed to get trip: ' + error.message 
                    });
                }
            }, 300); // 300ms delay to simulate network
        });
    }

    /**
     * Create a new trip
     * @param {Object} tripData - Trip data
     * @returns {Promise} - Resolved with created trip
     */
    async createTrip(tripData) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    const currentUser = JSON.parse(localStorage.getItem('dreamTrip_currentUser'));
                    
                    if (!currentUser) {
                        return resolve({ 
                            success: false, 
                            message: 'Not authenticated' 
                        });
                    }
                    
                    const allTrips = JSON.parse(localStorage.getItem('dreamTrip_trips'));
                    
                    // Create new trip
                    const newTrip = {
                        _id: 'trip_' + Date.now(),
                        ...tripData,
                        user: currentUser._id,
                        expenses: [],
                        photos: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    
                    // Initialize itinerary with days based on start and end dates
                    const startDate = new Date(tripData.startDate);
                    const endDate = new Date(tripData.endDate);
                    const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                    
                    newTrip.itinerary = [];
                    for (let i = 0; i < dayDiff; i++) {
                        const dayDate = new Date(startDate);
                        dayDate.setDate(startDate.getDate() + i);
                        
                        newTrip.itinerary.push({
                            date: dayDate.toISOString().split('T')[0],
                            activities: {
                                morning: [],
                                afternoon: [],
                                evening: []
                            }
                        });
                    }
                    
                    // Add to trips array
                    allTrips.push(newTrip);
                    localStorage.setItem('dreamTrip_trips', JSON.stringify(allTrips));
                    
                    resolve({ 
                        success: true, 
                        message: 'Trip created successfully',
                        data: newTrip
                    });
                } catch (error) {
                    resolve({ 
                        success: false, 
                        message: 'Failed to create trip: ' + error.message 
                    });
                }
            }, 500); // 500ms delay to simulate network
        });
    }

    /**
     * Add an activity to a trip's itinerary
     * @param {string} tripId - Trip ID
     * @param {number} dayIndex - Day index in the itinerary
     * @param {string} timeOfDay - Time of day (morning, afternoon, evening)
     * @param {Object} activity - Activity data
     * @returns {Promise} - Resolved with updated trip
     */
    async addActivity(tripId, dayIndex, timeOfDay, activity) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    const currentUser = JSON.parse(localStorage.getItem('dreamTrip_currentUser'));
                    
                    if (!currentUser) {
                        return resolve({ 
                            success: false, 
                            message: 'Not authenticated' 
                        });
                    }
                    
                    const allTrips = JSON.parse(localStorage.getItem('dreamTrip_trips'));
                    const tripIndex = allTrips.findIndex(trip => trip._id === tripId);
                    
                    if (tripIndex === -1) {
                        return resolve({ 
                            success: false, 
                            message: 'Trip not found' 
                        });
                    }
                    
                    const trip = allTrips[tripIndex];
                    
                    // Ensure the trip belongs to the current user
                    if (trip.user !== currentUser._id) {
                        return resolve({ 
                            success: false, 
                            message: 'Not authorized to modify this trip' 
                        });
                    }
                    
                    // Ensure the trip has an itinerary
                    if (!trip.itinerary) {
                        trip.itinerary = [];
                    }
                    
                    // Ensure the day exists
                    if (!trip.itinerary[dayIndex]) {
                        return resolve({ 
                            success: false, 
                            message: 'Day not found in itinerary' 
                        });
                    }
                    
                    // Ensure the day has activities
                    if (!trip.itinerary[dayIndex].activities) {
                        trip.itinerary[dayIndex].activities = {
                            morning: [],
                            afternoon: [],
                            evening: []
                        };
                    }
                    
                    // Ensure the time of day exists
                    if (!trip.itinerary[dayIndex].activities[timeOfDay]) {
                        trip.itinerary[dayIndex].activities[timeOfDay] = [];
                    }
                    
                    // Add the activity
                    trip.itinerary[dayIndex].activities[timeOfDay].push({
                        ...activity,
                        id: 'activity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        createdAt: new Date().toISOString()
                    });
                    
                    // Update the trip
                    trip.updatedAt = new Date().toISOString();
                    allTrips[tripIndex] = trip;
                    localStorage.setItem('dreamTrip_trips', JSON.stringify(allTrips));
                    
                    resolve({ 
                        success: true, 
                        message: 'Activity added successfully',
                        trip: trip
                    });
                } catch (error) {
                    resolve({ 
                        success: false, 
                        message: 'Failed to add activity: ' + error.message 
                    });
                }
            }, 500); // 500ms delay to simulate network
        });
    }

    /**
     * Update an existing trip
     * @param {string} tripId - Trip ID
     * @param {Object} tripData - Updated trip data
     * @returns {Promise} - Resolved with updated trip
     */
    async updateTrip(tripId, tripData) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    const currentUser = JSON.parse(localStorage.getItem('dreamTrip_currentUser'));
                    
                    if (!currentUser) {
                        return resolve({ 
                            success: false, 
                            message: 'Not authenticated' 
                        });
                    }
                    
                    const allTrips = JSON.parse(localStorage.getItem('dreamTrip_trips'));
                    const tripIndex = allTrips.findIndex(trip => trip._id === tripId && trip.user === currentUser._id);
                    
                    if (tripIndex === -1) {
                        return resolve({ 
                            success: false, 
                            message: 'Trip not found' 
                        });
                    }
                    
                    // Update trip
                    const updatedTrip = {
                        ...allTrips[tripIndex],
                        ...tripData,
                        updatedAt: new Date().toISOString()
                    };
                    
                    // Preserve the original ID and user
                    updatedTrip._id = tripId;
                    updatedTrip.user = currentUser._id;
                    
                    // Update in trips array
                    allTrips[tripIndex] = updatedTrip;
                    localStorage.setItem('dreamTrip_trips', JSON.stringify(allTrips));
                    
                    resolve({ 
                        success: true, 
                        message: 'Trip updated successfully',
                        data: updatedTrip
                    });
                } catch (error) {
                    resolve({ 
                        success: false, 
                        message: 'Failed to update trip: ' + error.message 
                    });
                }
            }, 500); // 500ms delay to simulate network
        });
    }

    /**
     * Delete a trip
     * @param {string} tripId - Trip ID
     * @returns {Promise} - Resolved when deletion is complete
     */
    async deleteTrip(tripId) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    const currentUser = JSON.parse(localStorage.getItem('dreamTrip_currentUser'));
                    
                    if (!currentUser) {
                        return resolve({ 
                            success: false, 
                            message: 'Not authenticated' 
                        });
                    }
                    
                    const allTrips = JSON.parse(localStorage.getItem('dreamTrip_trips'));
                    const filteredTrips = allTrips.filter(trip => !(trip._id === tripId && trip.user === currentUser._id));
                    
                    if (filteredTrips.length === allTrips.length) {
                        return resolve({ 
                            success: false, 
                            message: 'Trip not found' 
                        });
                    }
                    
                    // Update trips in storage
                    localStorage.setItem('dreamTrip_trips', JSON.stringify(filteredTrips));
                    
                    resolve({ 
                        success: true, 
                        message: 'Trip deleted successfully'
                    });
                } catch (error) {
                    resolve({ 
                        success: false, 
                        message: 'Failed to delete trip: ' + error.message 
                    });
                }
            }, 500); // 500ms delay to simulate network
        });
    }
}

// Create and export mock API service instance
const apiService = new MockApiService();
