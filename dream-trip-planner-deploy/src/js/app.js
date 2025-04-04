/**
 * Dream Trip Planner - Main Application
 * Handles UI interactions and application flow
 */

// DOM Elements
const elements = {
    // Navigation
    mainNav: document.getElementById('main-nav'),
    authLinks: document.getElementById('auth-links'),
    userLinks: document.getElementById('user-links'),
    usernameDisplay: document.getElementById('username-display'),
    loginNavBtn: document.getElementById('login-nav-btn'),
    registerNavBtn: document.getElementById('register-nav-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Sections
    authSection: document.getElementById('auth-section'),
    tripListSection: document.getElementById('trip-list-section'),
    tripCreationSection: document.getElementById('trip-creation-section'),
    tripDetailsSection: document.getElementById('trip-details-section'),
    
    // Auth Forms
    loginTab: document.getElementById('login-tab'),
    registerTab: document.getElementById('register-tab'),
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    loginError: document.getElementById('login-error'),
    registerError: document.getElementById('register-error'),
    loginBtnText: document.getElementById('login-btn-text'),
    loginBtnLoading: document.getElementById('login-btn-loading'),
    registerBtnText: document.getElementById('register-btn-text'),
    registerBtnLoading: document.getElementById('register-btn-loading'),
    
    // Trip List
    tripsContainer: document.getElementById('trips-container'),
    noTripsMessage: document.getElementById('no-trips-message'),
    newTripBtn: document.getElementById('new-trip-btn'),
    
    // Trip Creation
    tripForm: document.getElementById('trip-form'),
    destinationsContainer: document.getElementById('destinations-container'),
    addDestinationBtn: document.querySelector('.add-destination'),
    backToTripsBtn: document.getElementById('back-to-trips'),
    createTripBtnText: document.getElementById('create-trip-btn-text'),
    createTripBtnLoading: document.getElementById('create-trip-btn-loading'),
    
    // Trip Details
    tripDetailName: document.getElementById('trip-detail-name'),
    tripDetailDates: document.getElementById('trip-detail-dates'),
    tripDetailDestinations: document.getElementById('trip-detail-destinations'),
    tripDetailType: document.getElementById('trip-detail-type'),
    backToTripsFromDetailsBtn: document.getElementById('back-to-trips-from-details'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    itineraryTab: document.getElementById('itinerary-tab'),
    budgetTab: document.getElementById('budget-tab'),
    photosTab: document.getElementById('photos-tab'),
    exportTab: document.getElementById('export-tab'),
    itineraryContainer: document.getElementById('itinerary-container'),
    
    // Expense Management
    expenseForm: document.getElementById('expense-form'),
    expensesList: document.getElementById('expenses-list'),
    totalBudget: document.getElementById('total-budget'),
    budgetProgress: document.getElementById('budget-progress'),
    
    // Photo Management
    photoForm: document.getElementById('photo-form'),
    photoUpload: document.getElementById('photo-upload'),
    photoCaption: document.getElementById('photo-caption'),
    photosGrid: document.getElementById('photos-grid'),
    
    // Export Options
    exportPdf: document.getElementById('export-pdf'),
    exportHtml: document.getElementById('export-html'),
    exportJson: document.getElementById('export-json'),
    
    // Activity Modal
    activityModal: document.getElementById('activity-modal'),
    activityForm: document.getElementById('activity-form'),
    cancelActivityBtn: document.getElementById('cancel-activity')
};

// Templates
const templates = {
    tripCard: document.getElementById('trip-card-template'),
    day: document.getElementById('day-template'),
    activity: document.getElementById('activity-template'),
    expense: document.getElementById('expense-template'),
    photo: document.getElementById('photo-template')
};

// Current state
let currentTripId = null;
let currentDayIndex = null;
let currentTimeOfDay = null;
let currentActivityIndex = null;
// Load user's trips
async function loadUserTrips() {
    try {
        const result = await tripManager.loadTrips();
        
        if (result.success) {
            renderTripList();
            showSection(elements.tripListSection);
        } else {
            console.error('Failed to load trips:', result.message);
        }
    } catch (error) {
        console.error('Error loading trips:', error);
    }
}

// Render trip list
function renderTripList() {
    const trips = tripManager.getAllTrips();
    
    // Clear container
    elements.tripsContainer.innerHTML = '';
    
    if (trips.length === 0) {
        // Show no trips message
        elements.noTripsMessage.classList.remove('hidden');
        return;
    }
    
    // Hide no trips message
    elements.noTripsMessage.classList.add('hidden');
    
    // Render each trip
    trips.forEach(trip => {
        const tripCard = templates.tripCard.content.cloneNode(true);
        
        // Set trip data
        tripCard.querySelector('.trip-name').textContent = trip.name;
        tripCard.querySelector('.trip-dates').textContent = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;
        tripCard.querySelector('.trip-destinations').textContent = trip.destinations.join(', ');
        
        // Set up view button
        tripCard.querySelector('.view-trip').addEventListener('click', () => {
            viewTrip(trip._id);
        });
        
        elements.tripsContainer.appendChild(tripCard);
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

// Show trip creation form
function showTripCreation() {
    // Reset form
    elements.tripForm.reset();
    
    // Clear destinations except the first one
    const destinationInputs = elements.destinationsContainer.querySelectorAll('.destination');
    for (let i = 1; i < destinationInputs.length; i++) {
        destinationInputs[i].parentElement.remove();
    }
    
    // Show trip creation section
    showSection(elements.tripCreationSection);
}

// Show trip list
function showTripList() {
    showSection(elements.tripListSection);
}

// Add destination field to trip form
function addDestinationField() {
    const destinationField = document.createElement('div');
    destinationField.className = 'flex items-center mb-2';
    destinationField.innerHTML = `
        <input type="text" class="destination w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter a destination" required>
        <button type="button" class="remove-destination ml-2 text-red-600 hover:text-red-800">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add remove button functionality
    destinationField.querySelector('.remove-destination').addEventListener('click', function() {
        this.parentElement.remove();
    });
    
    elements.destinationsContainer.appendChild(destinationField);
}

// Handle trip form submission
async function handleTripFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('trip-name').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const tripType = document.getElementById('trip-type').value;
    
    // Get destinations
    const destinationInputs = document.querySelectorAll('.destination');
    const destinations = Array.from(destinationInputs)
        .map(input => input.value)
        .filter(value => value.trim() !== '');
    
    // Create trip data
    const tripData = {
        name,
        startDate,
        endDate,
        tripType,
        destinations
    };
    
    // Show loading state
    elements.createTripBtnText.classList.add('hidden');
    elements.createTripBtnLoading.classList.remove('hidden');
    
    try {
        // Create trip
        const result = await tripManager.createTrip(tripData);
        
        if (result.success) {
            // Show trip list
            showTripList();
            renderTripList();
        } else {
            console.error('Failed to create trip:', result.message);
            alert('Failed to create trip: ' + result.message);
        }
    } catch (error) {
        console.error('Error creating trip:', error);
        alert('An unexpected error occurred. Please try again.');
    } finally {
        // Hide loading state
        elements.createTripBtnText.classList.remove('hidden');
        elements.createTripBtnLoading.classList.add('hidden');
    }
}

// View trip details
async function viewTrip(tripId) {
    try {
        const result = await tripManager.getTrip(tripId);
        
        if (result.success) {
            currentTripId = tripId;
            renderTripDetails(result.trip);
            showSection(elements.tripDetailsSection);
        } else {
            console.error('Failed to load trip:', result.message);
            alert('Failed to load trip: ' + result.message);
        }
    } catch (error) {
        console.error('Error loading trip:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

// Render trip details
function renderTripDetails(trip) {
    // Set trip header info
    elements.tripDetailName.textContent = trip.name;
    elements.tripDetailDates.textContent = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;
    elements.tripDetailDestinations.textContent = trip.destinations.join(', ');
    elements.tripDetailType.textContent = formatTripType(trip.tripType);
    
    // Render itinerary (default tab)
    renderItinerary();
    
    // Switch to itinerary tab
    switchTab('itinerary');
}

// Format trip type for display
function formatTripType(tripType) {
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
    // Update tab buttons
    elements.tabButtons.forEach(button => {
        if (button.getAttribute('data-tab') === tabName) {
            button.classList.add('border-blue-500');
            button.classList.remove('text-gray-500');
        } else {
            button.classList.remove('border-blue-500');
            button.classList.add('text-gray-500');
        }
    });
    
    // Hide all tab content
    elements.itineraryTab.classList.add('hidden');
    elements.budgetTab.classList.add('hidden');
    elements.photosTab.classList.add('hidden');
    elements.exportTab.classList.add('hidden');
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    
    // Render tab content if needed
    if (tabName === 'itinerary') {
        renderItinerary();
    } else if (tabName === 'budget') {
        renderBudget();
    } else if (tabName === 'photos') {
        renderPhotos();
    }
}

// Render itinerary
function renderItinerary() {
    const trip = tripManager.getCurrentTrip();
    
    if (!trip) return;
    
    // Clear container
    elements.itineraryContainer.innerHTML = '';
    
    // Render each day
    trip.itinerary.forEach((day, dayIndex) => {
        const dayCard = templates.day.content.cloneNode(true);
        
        // Set day title
        const date = new Date(day.date);
        const dayTitle = `Day ${dayIndex + 1} - ${date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        })}`;
        dayCard.querySelector('.day-title').textContent = dayTitle;
        
        // Set up add activity buttons
        const addButtons = dayCard.querySelectorAll('.add-activity-btn');
        addButtons.forEach(button => {
            const timeOfDay = button.getAttribute('data-time');
            button.addEventListener('click', () => {
                openActivityModal(timeOfDay, dayIndex);
            });
        });
        
        // Render activities for each time of day
        renderActivities(dayCard, day.activities.morning, 'morning', dayIndex);
        renderActivities(dayCard, day.activities.afternoon, 'afternoon', dayIndex);
        renderActivities(dayCard, day.activities.evening, 'evening', dayIndex);
        
        elements.itineraryContainer.appendChild(dayCard);
    });
}

// Render activities for a time of day
function renderActivities(dayCard, activities, timeOfDay, dayIndex) {
    const container = dayCard.querySelector(`.${timeOfDay}-activities`);
    const noActivitiesMsg = container.querySelector('.no-activities');
    
    if (activities.length === 0) {
        // Show no activities message
        if (noActivitiesMsg) {
            noActivitiesMsg.classList.remove('hidden');
        }
        return;
    }
    
    // Hide no activities message
    if (noActivitiesMsg) {
        noActivitiesMsg.classList.add('hidden');
    }
    
    // Render each activity
    activities.forEach((activity, activityIndex) => {
        const activityItem = templates.activity.content.cloneNode(true);
        
        // Set activity data
        activityItem.querySelector('.activity-text').textContent = activity.text;
        
        // Set up notes if present
        const notesElement = activityItem.querySelector('.activity-notes');
        if (activity.notes) {
            notesElement.textContent = activity.notes;
            notesElement.classList.remove('hidden');
        }
        
        // Set up link if present
        const linkElement = activityItem.querySelector('.activity-link');
        if (activity.link) {
            linkElement.href = activity.link;
            linkElement.classList.remove('hidden');
        }
        
        // Set up edit button
        activityItem.querySelector('.edit-activity').addEventListener('click', () => {
            openActivityModal(timeOfDay, dayIndex, activityIndex);
        });
        
        // Set up delete button
        activityItem.querySelector('.delete-activity').addEventListener('click', () => {
            deleteActivity(timeOfDay, dayIndex, activityIndex);
        });
        
        container.appendChild(activityItem);
    });
}

// Open activity modal
function openActivityModal(timeOfDay, dayIndex, activityIndex = null) {
    const modal = elements.activityModal;
    modal.classList.remove('hidden');
    
    const form = elements.activityForm;
    const textInput = document.getElementById('activity-text');
    const notesInput = document.getElementById('activity-notes');
    const linkInput = document.getElementById('activity-link');
    
    // Clear form
    form.reset();
    
    // If editing existing activity
    if (activityIndex !== null) {
        const trip = tripManager.getCurrentTrip();
        const activity = trip.itinerary[dayIndex].activities[timeOfDay][activityIndex];
        textInput.value = activity.text;
        notesInput.value = activity.notes || '';
        linkInput.value = activity.link || '';
    }
    
    // Store current context in form data attributes
    form.setAttribute('data-time', timeOfDay);
    form.setAttribute('data-day', dayIndex);
    form.setAttribute('data-index', activityIndex !== null ? activityIndex : '');
    
    // Set current state
    currentTimeOfDay = timeOfDay;
    currentDayIndex = dayIndex;
    currentActivityIndex = activityIndex;
}

// Close activity modal
function closeActivityModal() {
    elements.activityModal.classList.add('hidden');
}

// Handle activity form submit
async function handleActivityFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const timeOfDay = form.getAttribute('data-time');
    const dayIndex = parseInt(form.getAttribute('data-day'));
    const activityIndex = form.getAttribute('data-index') !== '' ? parseInt(form.getAttribute('data-index')) : null;
    
    const text = document.getElementById('activity-text').value;
    const notes = document.getElementById('activity-notes').value;
    const link = document.getElementById('activity-link').value;
    
    const activity = {
        text,
        notes: notes || '',
        link: link || ''
    };
    
    try {
        let result;
        
        // If editing existing activity
        if (activityIndex !== null) {
            result = await tripManager.updateActivity(currentTripId, dayIndex, timeOfDay, activityIndex, activity);
        } else {
            // Add new activity
            result = await tripManager.addActivity(currentTripId, dayIndex, timeOfDay, activity);
        }
        
        if (result.success) {
            // Close modal
            closeActivityModal();
            
            // Re-render itinerary
            renderItinerary();
        } else {
            console.error('Failed to save activity:', result.message);
            alert('Failed to save activity: ' + result.message);
        }
    } catch (error) {
        console.error('Error saving activity:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

// Delete activity
async function deleteActivity(timeOfDay, dayIndex, activityIndex) {
    if (!confirm('Are you sure you want to delete this activity?')) {
        return;
    }
    
    try {
        const result = await tripManager.deleteActivity(currentTripId, dayIndex, timeOfDay, activityIndex);
        
        if (result.success) {
            // Re-render itinerary
            renderItinerary();
        } else {
            console.error('Failed to delete activity:', result.message);
            alert('Failed to delete activity: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting activity:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

// Render budget
function renderBudget() {
    const trip = tripManager.getCurrentTrip();
    
    if (!trip) return;
    
    // Calculate total expenses
    const total = trip.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    
    // Update total display
    elements.totalBudget.textContent = formatCurrency(total);
    
    // Update progress bar (placeholder for now)
    elements.budgetProgress.style.width = '50%';
    
    // Render expenses list
    renderExpenses();
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
    }).format(amount);
}

// Render expenses
function renderExpenses() {
    const trip = tripManager.getCurrentTrip();
    
    if (!trip) return;
    
    // Clear container
    elements.expensesList.innerHTML = '';
    
    if (trip.expenses.length === 0) {
        elements.expensesList.innerHTML = '<p class="text-gray-500 text-center">No expenses added yet.</p>';
        return;
    }
    
    // Render each expense
    trip.expenses.forEach((expense, index) => {
        const expenseItem = templates.expense.content.cloneNode(true);
        
        const categoryElement = expenseItem.querySelector('.expense-category');
        categoryElement.textContent = formatExpenseCategory(expense.category);
        categoryElement.setAttribute('data-category', expense.category);
        
        expenseItem.querySelector('.expense-description').textContent = expense.description;
        expenseItem.querySelector('.expense-amount').textContent = formatCurrency(expense.amount);
        
        // Set up delete button
        expenseItem.querySelector('.delete-expense').addEventListener('click', () => {
            deleteExpense(index);
        });
        
        elements.expensesList.appendChild(expenseItem);
    });
}

// Format expense category
function formatExpenseCategory(category) {
    const categories = {
        'transport': 'Transport',
        'accommodation': 'Accommodation',
        'food': 'Food & Drinks',
        'activities': 'Activities',
        'shopping': 'Shopping',
        'other': 'Other'
    };
    
    return categories[category] || category;
}

// Handle expense form submit
async function handleExpenseFormSubmit(e) {
    e.preventDefault();
    
    const category = document.getElementById('expense-category').value;
    const amount = document.getElementById('expense-amount').value;
    const description = document.getElementById('expense-description').value;
    
    const expense = {
        category,
        amount: parseFloat(amount),
        description,
        date: new Date().toISOString()
    };
    
    try {
        const result = await tripManager.addExpense(currentTripId, expense);
        
        if (result.success) {
            // Reset form
            e.target.reset();
            
            // Re-render budget
            renderBudget();
        } else {
            console.error('Failed to add expense:', result.message);
            alert('Failed to add expense: ' + result.message);
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

// Delete expense
async function deleteExpense(index) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }
    
    try {
        const result = await tripManager.deleteExpense(currentTripId, index);
        
        if (result.success) {
            // Re-render budget
            renderBudget();
        } else {
            console.error('Failed to delete expense:', result.message);
            alert('Failed to delete expense: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

// Render photos
function renderPhotos() {
    const trip = tripManager.getCurrentTrip();
    
    if (!trip) return;
    
    // Clear container
    elements.photosGrid.innerHTML = '';
    
    if (trip.photos.length === 0) {
        elements.photosGrid.innerHTML = '<p class="text-gray-500 text-center col-span-full">No photos added yet.</p>';
        return;
    }
    
    // Render each photo
    trip.photos.forEach((photo, index) => {
        const photoItem = templates.photo.content.cloneNode(true);
        
        const imgElement = photoItem.querySelector('img');
        imgElement.src = photo.url;
        imgElement.alt = photo.caption || 'Trip photo';
        
        const captionElement = photoItem.querySelector('.photo-caption');
        if (photo.caption) {
            captionElement.textContent = photo.caption;
        } else {
            captionElement.classList.add('hidden');
        }
        
        // Set up delete button
        photoItem.querySelector('.delete-photo').addEventListener('click', () => {
            deletePhoto(index);
        });
        
        elements.photosGrid.appendChild(photoItem);
    });
}

// Handle photo upload
function handlePhotoUpload(e) {
    // This would typically upload to a server, but for this demo we'll use a placeholder
    const file = e.target.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async function(event) {
        const photoUrl = event.target.result;
        const caption = document.getElementById('photo-caption').value;
        
        const photo = {
            url: photoUrl,
            caption,
            date: new Date().toISOString()
        };
        
        try {
            // In a real app, we would upload the photo to a server first
            // and then save the URL to the trip
            const trip = tripManager.getCurrentTrip();
            trip.photos.push(photo);
            
            const result = await tripManager.updateTrip(currentTripId, trip);
            
            if (result.success) {
                // Reset form
                document.getElementById('photo-form').reset();
                
                // Re-render photos
                renderPhotos();
            } else {
                console.error('Failed to add photo:', result.message);
                alert('Failed to add photo: ' + result.message);
            }
        } catch (error) {
            console.error('Error adding photo:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };
    
    reader.readAsDataURL(file);
}

// Delete photo
async function deletePhoto(index) {
    if (!confirm('Are you sure you want to delete this photo?')) {
        return;
    }
    
    try {
        const trip = tripManager.getCurrentTrip();
        trip.photos.splice(index, 1);
        
        const result = await tripManager.updateTrip(currentTripId, trip);
        
        if (result.success) {
            // Re-render photos
            renderPhotos();
        } else {
            console.error('Failed to delete photo:', result.message);
            alert('Failed to delete photo: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting photo:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

// Export as PDF
function exportAsPDF() {
    alert('PDF export functionality would be implemented here.');
    // In a real app, this would generate a PDF using a library like jsPDF
}

// Export as HTML
function exportAsHTML() {
    alert('HTML export functionality would be implemented here.');
    // In a real app, this would generate HTML content for download
}

// Export as JSON
function exportAsJSON() {
    const trip = tripManager.getCurrentTrip();
    
    if (!trip) return;
    
    // Create a JSON blob
    const blob = new Blob([JSON.stringify(trip, null, 2)], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);