// Blood Bank API Client
// Live backend URL (Render)
const API_BASE_URL = 'https://bloodbank-backend-1.onrender.com';

class BloodBankAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Include cookies for session management
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, finalOptions);
            const data = await response.json();
            return { success: response.ok, data, status: response.status };
        } catch (error) {
            console.error('API request failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Authentication endpoints
    async login(email, password) {
        return await this.request('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(payload) {
        // payload: { name, email, password, user_type }
        return await this.request('/api/register', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async verifyOtp(email, otp) {
        return await this.request('/api/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp })
        });
    }

    async logout() {
        return await this.request('/api/logout', {
            method: 'POST'
        });
    }

    async getCurrentUser() {
        return await this.request('/api/user');
    }

    // Customer appointment submission
    async submitCustomerAppointment(appointmentData) {
        return await this.request('/api/submit-customer', {
            method: 'POST',
            body: JSON.stringify(appointmentData)
        });
    }

    // Health check
    async healthCheck() {
        return await this.request('/api/health');
    }
}

// Initialize API client
const api = new BloodBankAPI();

// Utility functions for forms
function showMessage(message, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = isError ? 'error-message' : 'success-message';
    messageDiv.style.cssText = `
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
        ${isError ? 'background-color: #fee; border: 1px solid #f00; color: #c00;' : 'background-color: #efe; border: 1px solid #0a0; color: #060;'}
    `;
    
    // Find a container to append the message
    const container = document.querySelector('form') || document.querySelector('.container') || document.body;
    container.insertBefore(messageDiv, container.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => messageDiv.remove(), 5000);
}

// Handle login form
function handleLoginForm() {
    const loginForm = document.querySelector('#loginForm, form[action*="login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');
            
            const result = await api.login(email, password);
            
            if (result.success) {
                showMessage('Login successful! Redirecting...');
                // Admin still goes to dashboard; all others go to home
                setTimeout(() => {
                    if (result.data.user_type === 'admin') {
                        window.location.href = 'admin_dashboard.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1500);
            } else {
                showMessage(result.data?.error || 'Login failed', true);
            }
        });
    }
}

// Handle customer appointment form
function handleCustomerAppointmentForm() {
    const appointmentForm = document.querySelector('#customerForm, form[action*="customer"]');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(appointmentForm);
            const appointmentData = {
                name: formData.get('name'),
                email: formData.get('email'),
                age: formData.get('age'),
                gender: formData.get('gender'),
                appointment_date: formData.get('appointment_date'),
                time_slot: formData.get('time_slot')
            };
            
            const result = await api.submitCustomerAppointment(appointmentData);
            
            if (result.success) {
                showMessage(result.data.message);
                appointmentForm.reset();
            } else {
                showMessage(result.data?.message || 'Failed to submit appointment', true);
            }
        });
    }
}

// Initialize form handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    handleLoginForm();
    handleCustomerAppointmentForm();
    
    // Check API health on page load
    api.healthCheck().then(result => {
        if (!result.success) {
            console.warn('API health check failed:', result.error);
        }
    });
});

// Export API instance for use in other scripts
window.BloodBankAPI = api;