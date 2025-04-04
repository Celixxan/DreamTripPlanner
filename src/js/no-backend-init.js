/**
 * Dream Trip Planner - Flexible Backend Initializer
 * This file initializes the application for deployment with either Supabase or localStorage
 */

import * as apiManager from './api-manager.js';

// Function to initialize the application
async function initApp() {
    // Initialize the API manager to determine which backend to use
    await apiManager.initializeApi();
    
    // Update the backend badge
    const backendType = apiManager.getBackendType();
    document.getElementById('backend-badge').textContent = `Using ${backendType}`;
    
    // Check if user is logged in and update UI
    await updateAuthUI();
    
    // Set up tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.getAttribute('data-tab'));
        });
    });
    
    // Set up new trip button
    document.getElementById('new-trip-btn').addEventListener('click', showTripCreation);
    
    // Set up back to trips buttons
    document.getElementById('back-to-trips').addEventListener('click', showTripList);
    document.getElementById('back-to-trips-from-details').addEventListener('click', showTripList);
    
    // Set up add destination button
    document.querySelector('.add-destination').addEventListener('click', addDestinationField);
    
    // Set up trip form submission
    document.getElementById('trip-form').addEventListener('submit', handleTripFormSubmit);
    
    // Auth Tab Switching
    document.getElementById('login-tab').addEventListener('click', () => {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-tab').classList.add('border-blue-500');
        document.getElementById('login-tab').classList.remove('text-gray-500');
        document.getElementById('register-tab').classList.remove('border-blue-500');
        document.getElementById('register-tab').classList.add('text-gray-500');
    });

    document.getElementById('register-tab').addEventListener('click', () => {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
        document.getElementById('register-tab').classList.add('border-blue-500');
        document.getElementById('register-tab').classList.remove('text-gray-500');
        document.getElementById('login-tab').classList.remove('border-blue-500');
        document.getElementById('login-tab').classList.add('text-gray-500');
    });

    // Nav Auth Buttons
    document.getElementById('login-nav-btn').addEventListener('click', () => {
        document.getElementById('login-tab').click();
        document.getElementById('auth-section').classList.remove('hidden');
        document.getElementById('trip-list-section').classList.add('hidden');
        document.getElementById('trip-creation-section').classList.add('hidden');
        document.getElementById('trip-details-section').classList.add('hidden');
    });

    document.getElementById('register-nav-btn').addEventListener('click', () => {
        document.getElementById('register-tab').click();
        document.getElementById('auth-section').classList.remove('hidden');
        document.getElementById('trip-list-section').classList.add('hidden');
        document.getElementById('trip-creation-section').classList.add('hidden');
        document.getElementById('trip-details-section').classList.add('hidden');
    });

    // Login Form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorElement = document.getElementById('login-error');
        
        // Validate inputs
        if (!email || !password) {
            errorElement.textContent = 'Please fill in all fields';
            errorElement.classList.remove('hidden');
            return;
        }
        
        // Show loading state
        const loginBtn = document.getElementById('login-btn-text');
        const loginLoading = document.getElementById('login-btn-loading');
        loginBtn.classList.add('hidden');
        loginLoading.classList.remove('hidden');
        
        try {
            // Attempt login
            const result = await apiManager.loginUser(email, password);
            
            // Hide loading state
            loginBtn.classList.remove('hidden');
            loginLoading.classList.add('hidden');
            
            if (result.success) {
                // Login successful
                errorElement.classList.add('hidden');
                await updateAuthUI();
            } else {
                // Login failed
                errorElement.textContent = result.error || 'Login failed. Please check your credentials.';
                errorElement.classList.remove('hidden');
            }
        } catch (error) {
            // Error handling
            loginBtn.classList.remove('hidden');
            loginLoading.classList.add('hidden');
            errorElement.textContent = error.message || 'An unexpected error occurred';
            errorElement.classList.remove('hidden');
        }
    });

    // Register Form
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const errorElement = document.getElementById('register-error');
        
        // Validate inputs
        if (!username || !email || !password || !confirmPassword) {
            errorElement.textContent = 'Please fill in all fields';
            errorElement.classList.remove('hidden');
            return;
        }
        
        if (password !== confirmPassword) {
            errorElement.textContent = 'Passwords do not match';
            errorElement.classList.remove('hidden');
            return;
        }
        
        // Show loading state
        const registerBtn = document.getElementById('register-btn-text');
        const registerLoading = document.getElementById('register-btn-loading');
        registerBtn.classList.add('hidden');
        registerLoading.classList.remove('hidden');
        
        try {
            // Attempt registration
            const result = await apiManager.registerUser(username, email, password);
            
            // Hide loading state
            registerBtn.classList.remove('hidden');
            registerLoading.classList.add('hidden');
            
            if (result.success) {
                // Registration successful
                errorElement.classList.add('hidden');
                // Switch to login tab
                switchTab('login');
                // Show success message
                const loginError = document.getElementById('login-error');
                loginError.textContent = 'Registration successful! Please log in.';
                loginError.classList.remove('hidden');
                loginError.classList.remove('text-red-500');
                loginError.classList.add('text-green-500');
            } else {
                // Registration failed
                errorElement.textContent = result.error || 'Registration failed. Please try again.';
                errorElement.classList.remove('hidden');
            }
        } catch (error) {
            // Error handling
            registerBtn.classList.remove('hidden');
            registerLoading.classList.add('hidden');
            errorElement.textContent = error.message || 'An unexpected error occurred';
            errorElement.classList.remove('hidden');
        }
    });

    // Logout Button
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await apiManager.logoutUser();
        await updateAuthUI();
    });

    // Check if user is already logged in
    if (await apiManager.getCurrentUser()) {
        // Update UI for logged in state
        document.getElementById('auth-links').classList.add('hidden');
        document.getElementById('user-links').classList.remove('hidden');
        document.getElementById('username-display').textContent = (await apiManager.getCurrentUser()).username;
        
        // Show trip list section
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('trip-list-section').classList.remove('hidden');
        
        // Load trips
        loadUserTrips();
    }
}

// Load user trips and render trip list
async function loadUserTrips() {
    try {
        const result = await apiManager.getUserTrips();
        
        if (result.success) {
            renderTripList(result.trips);
        } else {
            console.error('Failed to load trips:', result.message);
        }
    } catch (error) {
        console.error('Error loading trips:', error);
    }
}

// Render trip list
function renderTripList(trips) {
    const tripsContainer = document.getElementById('trips-container');
    const noTripsMessage = document.getElementById('no-trips-message');
    
    // Clear existing content
    tripsContainer.innerHTML = '';
    
    if (!trips || trips.length === 0) {
        // Show no trips message
        tripsContainer.classList.add('hidden');
        noTripsMessage.classList.remove('hidden');
        return;
    }
    
    // Hide no trips message
    tripsContainer.classList.remove('hidden');
    noTripsMessage.classList.add('hidden');
    
    // Create trip cards
    trips.forEach(trip => {
        const tripCard = document.getElementById('trip-card-template').content.cloneNode(true);
        
        // Set trip data
        tripCard.querySelector('.trip-name').textContent = trip.name;
        tripCard.querySelector('.trip-dates').textContent = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;
        tripCard.querySelector('.trip-destinations').textContent = trip.destinations.join(', ');
        
        // Set up view button
        tripCard.querySelector('.view-trip').addEventListener('click', () => {
            viewTrip(trip._id);
        });
        
        tripsContainer.appendChild(tripCard);
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// View trip details
async function viewTrip(tripId) {
    try {
        const result = await apiManager.getTrip(tripId);
        
        if (result.success) {
            // Show trip details section
            document.getElementById('trip-list-section').classList.add('hidden');
            document.getElementById('trip-details-section').classList.remove('hidden');
            
            // Render trip details
            renderTripDetails(result.trip);
        } else {
            console.error('Failed to load trip:', result.message);
            alert('Failed to load trip details. Please try again.');
        }
    } catch (error) {
        console.error('Error viewing trip:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

// Render trip details
function renderTripDetails(trip) {
    // Set trip details
    document.getElementById('trip-detail-name').textContent = trip.name;
    document.getElementById('trip-detail-dates').textContent = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;
    document.getElementById('trip-detail-destinations').textContent = `Destinations: ${trip.destinations.join(', ')}`;
    document.getElementById('trip-detail-type').textContent = `Trip Type: ${formatTripType(trip.tripType)}`;
    
    // Switch to itinerary tab by default
    switchTab('itinerary');
    
    // Render itinerary
    renderItinerary(trip);
}

// Format trip type for display
function formatTripType(tripType) {
    if (!tripType) return 'Not specified';
    
    const types = {
        'city-break': 'City Break',
        'beach': 'Beach Vacation',
        'adventure': 'Adventure',
        'cultural': 'Cultural',
        'relaxation': 'Relaxation',
        'other': 'Other'
    };
    
    return types[tripType] || tripType;
}

// Switch between tabs in trip details
function switchTab(tabName) {
    // Hide all tabs
    document.getElementById('itinerary-tab').classList.add('hidden');
    document.getElementById('budget-tab').classList.add('hidden');
    document.getElementById('photos-tab').classList.add('hidden');
    document.getElementById('export-tab').classList.add('hidden');
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-blue-500');
        btn.classList.add('text-gray-500');
    });
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('border-blue-500');
    document.querySelector(`[data-tab="${tabName}"]`).classList.remove('text-gray-500');
    
    // Load tab content
    if (tabName === 'itinerary') {
        const currentTrip = apiManager.getCurrentTrip();
        if (currentTrip) {
            renderItinerary(currentTrip);
        }
    } else if (tabName === 'budget') {
        // renderBudget();
    } else if (tabName === 'photos') {
        // renderPhotos();
    }
}

// Show trip creation form
function showTripCreation() {
    document.getElementById('trip-list-section').classList.add('hidden');
    document.getElementById('trip-creation-section').classList.remove('hidden');
    document.getElementById('trip-details-section').classList.add('hidden');
    
    // Reset form
    document.getElementById('trip-form').reset();
    
    // Clear destination fields except the first one
    const destinationsContainer = document.getElementById('destinations-container');
    while (destinationsContainer.children.length > 1) {
        destinationsContainer.removeChild(destinationsContainer.lastChild);
    }
}

// Show trip list
function showTripList() {
    document.getElementById('trip-list-section').classList.remove('hidden');
    document.getElementById('trip-creation-section').classList.add('hidden');
    document.getElementById('trip-details-section').classList.add('hidden');
    
    // Reload trips
    loadUserTrips();
}

// Update authentication UI based on login status
async function updateAuthUI() {
    const currentUser = await apiManager.getCurrentUser();
    const authLinks = document.getElementById('auth-links');
    const userLinks = document.getElementById('user-links');
    const authSection = document.getElementById('auth-section');
    const tripSection = document.getElementById('trip-section');
    const usernameDisplay = document.getElementById('username-display');
    
    if (currentUser) {
        // User is logged in
        authLinks.classList.add('hidden');
        userLinks.classList.remove('hidden');
        authSection.classList.add('hidden');
        tripSection.classList.remove('hidden');
        usernameDisplay.textContent = currentUser.username || currentUser.email;
        
        // Load user's trips
        await loadUserTrips();
    } else {
        // User is not logged in
        authLinks.classList.remove('hidden');
        userLinks.classList.add('hidden');
        authSection.classList.remove('hidden');
        tripSection.classList.add('hidden');
    }
}

// Add destination field
function addDestinationField() {
    const destinationsContainer = document.getElementById('destinations-container');
    const newField = document.createElement('div');
    newField.className = 'flex items-center mb-2';
    newField.innerHTML = `
        <input type="text" class="destination w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Enter a destination" required>
        <button type="button" class="remove-destination ml-2 text-red-500 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </button>
    `;
    
    // Add event listener to remove button
    newField.querySelector('.remove-destination').addEventListener('click', () => {
        destinationsContainer.removeChild(newField);
    });
    
    destinationsContainer.appendChild(newField);
}

// Handle trip form submission
async function handleTripFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('trip-name').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const tripType = document.getElementById('trip-type').value;
    
    // Get destinations
    const destinationInputs = document.querySelectorAll('.destination');
    const destinations = Array.from(destinationInputs).map(input => input.value).filter(value => value.trim() !== '');
    
    // Create trip data
    const tripData = {
        name,
        startDate,
        endDate,
        tripType,
        destinations,
        budget: 0,
        expenses: [],
        notes: ''
    };
    
    try {
        // Show loading state
        const createBtn = document.querySelector('#trip-form button[type="submit"]');
        createBtn.disabled = true;
        document.getElementById('create-trip-btn-text').classList.add('hidden');
        document.getElementById('create-trip-btn-loading').classList.remove('hidden');
        
        // Create trip
        const result = await apiManager.createTrip(tripData);
        
        if (result.success) {
            // Show trip list
            showTripList();
        } else {
            alert('Failed to create trip: ' + result.message);
        }
    } catch (error) {
        console.error('Error creating trip:', error);
        alert('An unexpected error occurred. Please try again.');
    } finally {
        // Reset loading state
        const createBtn = document.querySelector('#trip-form button[type="submit"]');
        createBtn.disabled = false;
        document.getElementById('create-trip-btn-text').classList.remove('hidden');
        document.getElementById('create-trip-btn-loading').classList.add('hidden');
    }
}

// Render itinerary for a trip
function renderItinerary(trip) {
    const itineraryContainer = document.getElementById('itinerary-container');
    itineraryContainer.innerHTML = '';
    
    if (!trip.itinerary || trip.itinerary.length === 0) {
        itineraryContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No itinerary available for this trip.</p>';
        return;
    }
    
    // Create day cards for each day in the itinerary
    trip.itinerary.forEach((day, dayIndex) => {
        const dayCard = document.createElement('div');
        dayCard.className = 'bg-white rounded-lg shadow p-4 mb-4';
        
        // Day header
        const dayHeader = document.createElement('div');
        dayHeader.className = 'border-b pb-2 mb-4';
        dayHeader.innerHTML = `
            <h3 class="text-lg font-bold">${day.date ? formatDate(day.date) : `Day ${dayIndex + 1}`}</h3>
        `;
        
        // Morning activities
        const morningSection = document.createElement('div');
        morningSection.className = 'mb-4';
        morningSection.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-700">Morning</h4>
                <button class="add-activity-btn text-blue-600 hover:text-blue-800 text-sm" data-day="${dayIndex}" data-time="morning">
                    <i class="fas fa-plus mr-1"></i>Add Activity
                </button>
            </div>
            <div class="morning-activities pl-4 border-l-2 border-yellow-400 space-y-2">
                ${renderActivities(trip._id, dayIndex, 'morning', day.activities?.morning || [])}
            </div>
        `;
        
        // Afternoon activities
        const afternoonSection = document.createElement('div');
        afternoonSection.className = 'mb-4';
        afternoonSection.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-700">Afternoon</h4>
                <button class="add-activity-btn text-blue-600 hover:text-blue-800 text-sm" data-day="${dayIndex}" data-time="afternoon">
                    <i class="fas fa-plus mr-1"></i>Add Activity
                </button>
            </div>
            <div class="afternoon-activities pl-4 border-l-2 border-orange-400 space-y-2">
                ${renderActivities(trip._id, dayIndex, 'afternoon', day.activities?.afternoon || [])}
            </div>
        `;
        
        // Evening activities
        const eveningSection = document.createElement('div');
        eveningSection.className = 'mb-4';
        eveningSection.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-700">Evening</h4>
                <button class="add-activity-btn text-blue-600 hover:text-blue-800 text-sm" data-day="${dayIndex}" data-time="evening">
                    <i class="fas fa-plus mr-1"></i>Add Activity
                </button>
            </div>
            <div class="evening-activities pl-4 border-l-2 border-purple-400 space-y-2">
                ${renderActivities(trip._id, dayIndex, 'evening', day.activities?.evening || [])}
            </div>
        `;
        
        // Append all sections to the day card
        dayCard.appendChild(dayHeader);
        dayCard.appendChild(morningSection);
        dayCard.appendChild(afternoonSection);
        dayCard.appendChild(eveningSection);
        
        // Add event listeners to the add activity buttons
        dayCard.querySelectorAll('.add-activity-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                showAddActivityModal(trip._id, parseInt(btn.getAttribute('data-day')), btn.getAttribute('data-time'));
            });
        });
        
        // Append the day card to the itinerary container
        itineraryContainer.appendChild(dayCard);
    });
}

// Render activities for a specific time of day
function renderActivities(tripId, dayIndex, timeOfDay, activities) {
    if (!activities || activities.length === 0) {
        return `<p class="no-activities text-gray-500 text-sm">No activities planned for ${timeOfDay}.</p>`;
    }
    
    return activities.map((activity, activityIndex) => `
        <div class="activity-item bg-gray-50 rounded p-3">
            <div class="flex justify-between">
                <div class="flex-1">
                    <p class="activity-text font-medium">${activity.title}</p>
                    ${activity.notes ? `<p class="activity-notes text-gray-600 text-sm mt-1">${activity.notes}</p>` : ''}
                    ${activity.link ? `<a href="${activity.link}" target="_blank" class="activity-link text-blue-600 text-sm mt-1 block"><i class="fas fa-link mr-1"></i>View Link</a>` : ''}
                </div>
                <div class="flex space-x-2">
                    <button class="edit-activity text-blue-600 hover:text-blue-800" data-trip="${tripId}" data-day="${dayIndex}" data-time="${timeOfDay}" data-index="${activityIndex}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-activity text-red-600 hover:text-red-800" data-trip="${tripId}" data-day="${dayIndex}" data-time="${timeOfDay}" data-index="${activityIndex}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Show modal for adding a new activity
function showAddActivityModal(tripId, dayIndex, timeOfDay) {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    backdrop.id = 'activity-modal';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'bg-white rounded-lg shadow-xl p-6 w-full max-w-md';
    modal.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 mb-4">Add Activity</h3>
        <form id="activity-form" class="space-y-4">
            <input type="hidden" id="activity-trip-id" value="${tripId}">
            <input type="hidden" id="activity-day-index" value="${dayIndex}">
            <input type="hidden" id="activity-time" value="${timeOfDay}">
            
            <div>
                <label for="activity-title" class="block text-gray-700 mb-2">Activity Title</label>
                <input type="text" id="activity-title" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            
            <div>
                <label for="activity-notes" class="block text-gray-700 mb-2">Notes (optional)</label>
                <textarea id="activity-notes" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
            </div>
            
            <div>
                <label for="activity-link" class="block text-gray-700 mb-2">Link (optional)</label>
                <input type="url" id="activity-link" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex justify-end space-x-3">
                <button type="button" id="cancel-activity" class="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                    <span id="save-activity-text">Save Activity</span>
                    <span id="save-activity-loading" class="hidden">
                        <i class="fas fa-spinner fa-spin ml-2"></i>
                    </span>
                </button>
            </div>
        </form>
    `;
    
    // Append modal to backdrop
    backdrop.appendChild(modal);
    
    // Append backdrop to body
    document.body.appendChild(backdrop);
    
    // Add event listeners
    document.getElementById('cancel-activity').addEventListener('click', () => {
        document.body.removeChild(backdrop);
    });
    
    document.getElementById('activity-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        document.getElementById('save-activity-text').classList.add('hidden');
        document.getElementById('save-activity-loading').classList.remove('hidden');
        
        // Get form data
        const tripId = document.getElementById('activity-trip-id').value;
        const dayIndex = parseInt(document.getElementById('activity-day-index').value);
        const timeOfDay = document.getElementById('activity-time').value;
        const title = document.getElementById('activity-title').value;
        const notes = document.getElementById('activity-notes').value;
        const link = document.getElementById('activity-link').value;
        
        // Create activity object
        const activity = {
            title,
            notes: notes || '',
            link: link || ''
        };
        
        try {
            // Add activity to trip
            const result = await tripManager.addActivity(tripId, dayIndex, timeOfDay, activity);
            
            if (result.success) {
                // Close modal
                document.body.removeChild(backdrop);
                
                // Refresh itinerary
                renderItinerary(result.trip);
            } else {
                alert('Failed to add activity: ' + result.message);
            }
        } catch (error) {
            console.error('Error adding activity:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            // Reset loading state
            document.getElementById('save-activity-text').classList.remove('hidden');
            document.getElementById('save-activity-loading').classList.add('hidden');
        }
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export functions that might be needed by other modules
export { updateAuthUI, loadUserTrips };
