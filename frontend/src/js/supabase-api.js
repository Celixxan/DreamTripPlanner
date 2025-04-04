// Supabase API Integration for Dream Trip Planner

// Initialize Supabase client with your Supabase URL and anon key
const supabaseUrl = 'https://gzpkmribdfnsrbdmoxxr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6cGttcmliZGZuc3JiZG1veHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NjE2NTYsImV4cCI6MjA1OTMzNzY1Nn0.Pvfwv7b1B8rdN4uRUwT-QJPf2U6NugVr6gwYnDLmbG4';

// Initialize Supabase client
let supabase;

// Function to initialize Supabase client
function initSupabase() {
    if (typeof window.supabaseClient !== 'undefined') {
        supabase = window.supabaseClient;
        return true;
    } else if (typeof window.supabase !== 'undefined') {
        try {
            supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
            window.supabaseClient = supabase;
            return true;
        } catch (error) {
            console.error('Error initializing Supabase client:', error);
            return false;
        }
    }
    return false;
}

// Try to initialize immediately
initSupabase();

// Check if Supabase is configured and initialized
function usingSupabase() {
    // Try to initialize if not already done
    if (!supabase) {
        initSupabase();
    }
    return supabase && supabaseUrl && supabaseKey && supabaseUrl.includes('supabase.co');
}

// User Authentication
async function registerUser(username, email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username
                }
            }
        })
        
        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error registering user:', error.message)
        return { success: false, error: error.message }
    }
}

async function loginUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        
        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error logging in:', error.message)
        return { success: false, error: error.message }
    }
}

async function logoutUser() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Error logging out:', error.message)
        return { success: false, error: error.message }
    }
}

// Expose all API functions globally
window.api = {
    usingSupabase,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    createTrip,
    getUserTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    addDestination,
    updateDestination,
    deleteDestination
};

async function getCurrentUser() {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    } catch (error) {
        console.error('Error getting current user:', error.message)
        return null
    }
}

// Trip Management
async function createTrip(tripData) {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('User not authenticated')
        
        const { data, error } = await supabase
            .from('trips')
            .insert([{
                ...tripData,
                user_id: user.id
            }])
            .select()
        
        if (error) throw error
        return { success: true, trip: data[0] }
    } catch (error) {
        console.error('Error creating trip:', error.message)
        return { success: false, error: error.message }
    }
}

async function getUserTrips() {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('User not authenticated')
        
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .eq('user_id', user.id)
            .order('start_date', { ascending: true })
        
        if (error) throw error
        return { success: true, trips: data }
    } catch (error) {
        console.error('Error fetching trips:', error.message)
        return { success: false, error: error.message }
    }
}

async function getTripById(tripId) {
    try {
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .eq('id', tripId)
            .single()
        
        if (error) throw error
        return { success: true, trip: data }
    } catch (error) {
        console.error('Error fetching trip:', error.message)
        return { success: false, error: error.message }
    }
}

async function updateTrip(tripId, tripData) {
    try {
        const { data, error } = await supabase
            .from('trips')
            .update(tripData)
            .eq('id', tripId)
            .select()
        
        if (error) throw error
        return { success: true, trip: data[0] }
    } catch (error) {
        console.error('Error updating trip:', error.message)
        return { success: false, error: error.message }
    }
}

async function deleteTrip(tripId) {
    try {
        const { error } = await supabase
            .from('trips')
            .delete()
            .eq('id', tripId)
        
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Error deleting trip:', error.message)
        return { success: false, error: error.message }
    }
}

// Itinerary Management
async function addActivity(tripId, dayIndex, timeOfDay, activity) {
    try {
        // First get the trip to access its itinerary
        const { success, trip } = await getTripById(tripId)
        if (!success) throw new Error('Could not find trip')
        
        // Create or update the itinerary structure
        const itinerary = trip.itinerary || []
        
        // Ensure the day exists
        if (!itinerary[dayIndex]) {
            itinerary[dayIndex] = {
                morning: [],
                afternoon: [],
                evening: []
            }
        }
        
        // Add the activity to the appropriate time slot
        itinerary[dayIndex][timeOfDay].push(activity)
        
        // Update the trip with the new itinerary
        const updateResult = await updateTrip(tripId, { itinerary })
        return updateResult
    } catch (error) {
        console.error('Error adding activity:', error.message)
        return { success: false, error: error.message }
    }
}

async function removeActivity(tripId, dayIndex, timeOfDay, activityIndex) {
    try {
        // First get the trip to access its itinerary
        const { success, trip } = await getTripById(tripId)
        if (!success) throw new Error('Could not find trip')
        
        // Create or update the itinerary structure
        const itinerary = trip.itinerary || []
        
        // Check if the day and time slot exist
        if (itinerary[dayIndex] && itinerary[dayIndex][timeOfDay]) {
            // Remove the activity
            itinerary[dayIndex][timeOfDay].splice(activityIndex, 1)
            
            // Update the trip with the modified itinerary
            const updateResult = await updateTrip(tripId, { itinerary })
            return updateResult
        } else {
            throw new Error('Invalid day or time slot')
        }
    } catch (error) {
        console.error('Error removing activity:', error.message)
        return { success: false, error: error.message }
    }
}

// Budget Management
export async function updateBudget(tripId, budget) {
    try {
        const { data, error } = await supabase
            .from('trips')
            .update({ budget })
            .eq('id', tripId)
            .select()
        
        if (error) throw error
        return { success: true, trip: data[0] }
    } catch (error) {
        console.error('Error updating budget:', error.message)
        return { success: false, error: error.message }
    }
}

// Fallback to localStorage if Supabase is not configured
function isSupabaseConfigured() {
    return supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY'
}

// Export a function to check if we're using Supabase or localStorage
export function usingSupabase() {
    return isSupabaseConfigured()
}
