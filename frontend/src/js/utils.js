// Utility functions for Dream Trip Planner

// Format date to display in a user-friendly format
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format currency with 2 decimal places
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Deep clone an object
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('dreamTrip_currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    const userJson = localStorage.getItem('dreamTrip_currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Export utility functions
window.utils = {
    formatDate,
    formatCurrency,
    generateId,
    deepClone,
    isLoggedIn,
    getCurrentUser
};
