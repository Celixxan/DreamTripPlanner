// API Manager - Handles switching between Supabase and localStorage
// Access the global mockApi and supabaseApi objects

// Determine which API to use
let api = mockApi;

// Initialize the API
export async function initializeApi() {
    // Check if Supabase is configured
    if (supabaseApi.usingSupabase()) {
        console.log('Using Supabase as backend');
        api = supabaseApi;
    } else {
        console.log('Using localStorage as backend');
        api = mockApi;
    }
}

// Explicitly set which backend to use
export function setBackend(backendType) {
    if (backendType === 'supabase') {
        console.log('Explicitly setting backend to Supabase');
        api = supabaseApi;
        return true;
    } else if (backendType === 'localStorage') {
        console.log('Explicitly setting backend to localStorage');
        api = mockApi;
        return true;
    }
    return false;
}

// Get the current backend type
export function getBackendType() {
    if (api === supabaseApi) {
        return 'Supabase Mode';
    } else {
        return 'localStorage Mode';
    }
}

// Export all API functions, delegating to the appropriate implementation
export async function registerUser(username, email, password) {
    return api.registerUser(username, email, password);
}

export async function loginUser(email, password) {
    return api.loginUser(email, password);
}

export async function logoutUser() {
    return api.logoutUser();
}

export async function getCurrentUser() {
    return api.getCurrentUser();
}

export async function createTrip(tripData) {
    return api.createTrip(tripData);
}

export async function getUserTrips() {
    return api.getUserTrips();
}

export async function getTripById(tripId) {
    return api.getTripById(tripId);
}

export async function updateTrip(tripId, tripData) {
    return api.updateTrip(tripId, tripData);
}

export async function deleteTrip(tripId) {
    return api.deleteTrip(tripId);
}

export async function addActivity(tripId, dayIndex, timeOfDay, activity) {
    return api.addActivity(tripId, dayIndex, timeOfDay, activity);
}

export async function removeActivity(tripId, dayIndex, timeOfDay, activityIndex) {
    return api.removeActivity(tripId, dayIndex, timeOfDay, activityIndex);
}

export async function updateBudget(tripId, budget) {
    return api.updateBudget(tripId, budget);
}

// Helper function to check which backend we're using
export function getBackendType() {
    return supabaseApi.usingSupabase() ? 'Supabase' : 'LocalStorage';
}
