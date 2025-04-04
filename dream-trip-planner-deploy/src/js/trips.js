/**
 * Dream Trip Planner - Trips Module
 * Handles trip data management and operations
 */

class TripManager {
    constructor() {
        this.trips = [];
        this.currentTrip = null;
    }

    /**
     * Load all trips for the current user
     * @returns {Promise} - Resolved with loaded trips
     */
    async loadTrips() {
        try {
            const response = await apiService.getTrips();
            
            if (response.success) {
                this.trips = response.data;
                return { success: true, trips: this.trips };
            }
            
            return { success: false, message: 'Failed to load trips' };
        } catch (error) {
            console.error('Load trips error:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Get a single trip by ID
     * @param {string} tripId - Trip ID
     * @returns {Promise} - Resolved with trip data
     */
    async getTrip(tripId) {
        try {
            const response = await apiService.getTrip(tripId);
            
            if (response.success) {
                this.currentTrip = response.data;
                return { success: true, trip: this.currentTrip };
            }
            
            return { success: false, message: 'Failed to load trip' };
        } catch (error) {
            console.error('Get trip error:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Create a new trip
     * @param {Object} tripData - Trip data
     * @returns {Promise} - Resolved with created trip
     */
    async createTrip(tripData) {
        try {
            // Generate itinerary based on start and end dates
            tripData.itinerary = this.generateItinerary(tripData.startDate, tripData.endDate);
            
            const response = await apiService.createTrip(tripData);
            
            if (response.success) {
                this.trips.push(response.data);
                return { success: true, trip: response.data };
            }
            
            return { success: false, message: 'Failed to create trip' };
        } catch (error) {
            console.error('Create trip error:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Update an existing trip
     * @param {string} tripId - Trip ID
     * @param {Object} tripData - Updated trip data
     * @returns {Promise} - Resolved with updated trip
     */
    async updateTrip(tripId, tripData) {
        try {
            const response = await apiService.updateTrip(tripId, tripData);
            
            if (response.success) {
                // Update local trip data
                const index = this.trips.findIndex(trip => trip._id === tripId);
                if (index !== -1) {
                    this.trips[index] = response.data;
                }
                
                if (this.currentTrip && this.currentTrip._id === tripId) {
                    this.currentTrip = response.data;
                }
                
                return { success: true, trip: response.data };
            }
            
            return { success: false, message: 'Failed to update trip' };
        } catch (error) {
            console.error('Update trip error:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Get the current trip
     * @returns {Object|null} - The current trip or null if none is selected
     */
    getCurrentTrip() {
        return this.currentTrip;
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
        try {
            const response = await apiService.addActivity(tripId, dayIndex, timeOfDay, activity);
            
            if (response.success) {
                // Update the current trip if it's the one being modified
                if (this.currentTrip && this.currentTrip._id === tripId) {
                    this.currentTrip = response.trip;
                }
                
                // Update the trip in the trips array
                const tripIndex = this.trips.findIndex(trip => trip._id === tripId);
                if (tripIndex !== -1) {
                    this.trips[tripIndex] = response.trip;
                }
                
                return { success: true, trip: response.trip };
            }
            
            return { success: false, message: response.message };
        } catch (error) {
            console.error('Add activity error:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Delete a trip
     * @param {string} tripId - Trip ID
     * @returns {Promise} - Resolved when deletion is complete
     */
    async deleteTrip(tripId) {
        try {
            const response = await apiService.deleteTrip(tripId);
            
            if (response.success) {
                // Remove from local trips array
                this.trips = this.trips.filter(trip => trip._id !== tripId);
                
                // Clear current trip if it was deleted
                if (this.currentTrip && this.currentTrip._id === tripId) {
                    this.currentTrip = null;
                }
                
                return { success: true };
            }
            
            return { success: false, message: 'Failed to delete trip' };
        } catch (error) {
            console.error('Delete trip error:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Get all trips
     * @returns {Array} - Array of trips
     */
    getAllTrips() {
        return this.trips;
    }

    /**
     * Get current trip
     * @returns {Object|null} - Current trip or null
     */
    getCurrentTrip() {
        return this.currentTrip;
    }

    /**
     * Set current trip
     * @param {string} tripId - Trip ID
     * @returns {Object|null} - Set trip or null if not found
     */
    setCurrentTrip(tripId) {
        const trip = this.trips.find(trip => trip._id === tripId);
        this.currentTrip = trip || null;
        return this.currentTrip;
    }

    /**
     * Generate itinerary based on start and end dates
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Array} - Array of day objects
     */
    generateItinerary(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const itinerary = [];
        
        // Calculate number of days
        const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        
        // Generate day objects
        for (let i = 0; i < dayCount; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            
            itinerary.push({
                date: date.toISOString(),
                activities: {
                    morning: [],
                    afternoon: [],
                    evening: []
                }
            });
        }
        
        return itinerary;
    }

    /**
     * Add activity to trip itinerary
     * @param {string} tripId - Trip ID
     * @param {number} dayIndex - Day index
     * @param {string} timeOfDay - Time of day (morning, afternoon, evening)
     * @param {Object} activity - Activity data
     * @returns {Promise} - Resolved when activity is added
     */
    async addActivity(tripId, dayIndex, timeOfDay, activity) {
        if (!this.currentTrip || this.currentTrip._id !== tripId) {
            await this.getTrip(tripId);
        }
        
        if (!this.currentTrip) {
            return { success: false, message: 'Trip not found' };
        }
        
        // Add activity to itinerary
        this.currentTrip.itinerary[dayIndex].activities[timeOfDay].push(activity);
        
        // Update trip in database
        return this.updateTrip(tripId, this.currentTrip);
    }

    /**
     * Update activity in trip itinerary
     * @param {string} tripId - Trip ID
     * @param {number} dayIndex - Day index
     * @param {string} timeOfDay - Time of day (morning, afternoon, evening)
     * @param {number} activityIndex - Activity index
     * @param {Object} activity - Updated activity data
     * @returns {Promise} - Resolved when activity is updated
     */
    async updateActivity(tripId, dayIndex, timeOfDay, activityIndex, activity) {
        if (!this.currentTrip || this.currentTrip._id !== tripId) {
            await this.getTrip(tripId);
        }
        
        if (!this.currentTrip) {
            return { success: false, message: 'Trip not found' };
        }
        
        // Update activity in itinerary
        this.currentTrip.itinerary[dayIndex].activities[timeOfDay][activityIndex] = activity;
        
        // Update trip in database
        return this.updateTrip(tripId, this.currentTrip);
    }

    /**
     * Delete activity from trip itinerary
     * @param {string} tripId - Trip ID
     * @param {number} dayIndex - Day index
     * @param {string} timeOfDay - Time of day (morning, afternoon, evening)
     * @param {number} activityIndex - Activity index
     * @returns {Promise} - Resolved when activity is deleted
     */
    async deleteActivity(tripId, dayIndex, timeOfDay, activityIndex) {
        if (!this.currentTrip || this.currentTrip._id !== tripId) {
            await this.getTrip(tripId);
        }
        
        if (!this.currentTrip) {
            return { success: false, message: 'Trip not found' };
        }
        
        // Remove activity from itinerary
        this.currentTrip.itinerary[dayIndex].activities[timeOfDay].splice(activityIndex, 1);
        
        // Update trip in database
        return this.updateTrip(tripId, this.currentTrip);
    }

    /**
     * Add expense to trip
     * @param {string} tripId - Trip ID
     * @param {Object} expense - Expense data
     * @returns {Promise} - Resolved when expense is added
     */
    async addExpense(tripId, expense) {
        if (!this.currentTrip || this.currentTrip._id !== tripId) {
            await this.getTrip(tripId);
        }
        
        if (!this.currentTrip) {
            return { success: false, message: 'Trip not found' };
        }
        
        // Add expense to trip
        this.currentTrip.expenses.push(expense);
        
        // Update trip in database
        return this.updateTrip(tripId, this.currentTrip);
    }

    /**
     * Delete expense from trip
     * @param {string} tripId - Trip ID
     * @param {number} expenseIndex - Expense index
     * @returns {Promise} - Resolved when expense is deleted
     */
    async deleteExpense(tripId, expenseIndex) {
        if (!this.currentTrip || this.currentTrip._id !== tripId) {
            await this.getTrip(tripId);
        }
        
        if (!this.currentTrip) {
            return { success: false, message: 'Trip not found' };
        }
        
        // Remove expense from trip
        this.currentTrip.expenses.splice(expenseIndex, 1);
        
        // Update trip in database
        return this.updateTrip(tripId, this.currentTrip);
    }

    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @returns {string} - Formatted date (e.g., "Monday, May 1, 2023")
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    /**
     * Format currency for display
     * @param {number} amount - Amount
     * @returns {string} - Formatted currency (e.g., "$100.00")
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD' 
        }).format(amount);
    }
}

// Create and export trip manager instance
const tripManager = new TripManager();
