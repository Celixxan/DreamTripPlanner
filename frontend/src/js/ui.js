// UI Helper Functions for Dream Trip Planner

// UI Manager for handling UI updates and interactions
const uiManager = {
    // Show a notification to the user
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle text-green-500' : 
                              type === 'error' ? 'fa-exclamation-circle text-red-500' : 
                              'fa-info-circle text-blue-500'} mr-3 text-xl"></i>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },
    
    // Update the UI based on authentication state
    updateAuthUI: function(isLoggedIn) {
        const authSection = document.getElementById('auth-section');
        const mainContent = document.getElementById('main-content');
        const userDropdown = document.getElementById('user-dropdown');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (isLoggedIn) {
            // Hide authentication forms
            authSection.classList.add('hidden');
            // Show main content
            mainContent.classList.remove('hidden');
            // Update user dropdown
            if (userDropdown) {
                userDropdown.classList.remove('hidden');
                const currentUser = window.utils.getCurrentUser();
                if (currentUser && currentUser.username) {
                    const usernameElement = document.getElementById('username');
                    if (usernameElement) {
                        usernameElement.textContent = currentUser.username;
                    }
                }
            }
        } else {
            // Show authentication forms
            authSection.classList.remove('hidden');
            // Hide main content
            mainContent.classList.add('hidden');
            // Hide user dropdown
            if (userDropdown) {
                userDropdown.classList.add('hidden');
            }
            // Show login form by default
            if (loginForm && registerForm) {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            }
        }
    },
    
    // Toggle between login and register forms
    toggleAuthForms: function() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm && registerForm) {
            loginForm.classList.toggle('hidden');
            registerForm.classList.toggle('hidden');
        }
    },
    
    // Clear form inputs
    clearForm: function(formId) {
        const form = document.getElementById(formId);
        if (form) {
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                input.value = '';
            });
        }
    },
    
    // Show loading spinner
    showLoading: function() {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loadingOverlay.innerHTML = `
            <div class="bg-white p-5 rounded-lg shadow-lg">
                <div class="spinner"></div>
                <p class="mt-3 text-center">Loading...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    },
    
    // Hide loading spinner
    hideLoading: function() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }
};

// Make UI manager available globally
window.ui = uiManager;
