var API_URL = window.API_URL;

// DOM Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginContainer = document.getElementById('login-form');
const registerContainer = document.getElementById('register-form');
const navLogin = document.getElementById('nav-login');
const navRegister = document.getElementById('nav-register');
const userGreeting = document.getElementById('user-greeting');
const workoutList = document.getElementById('workout-list');
const logoutBtn = document.getElementById('logout-btn');
const premiumFeatures = document.getElementById('premium-features');
const generateForm = document.getElementById('generateForm');
const upgradeSection = document.getElementById('upgrade-section');
const upgradeBtn = document.getElementById('upgrade-btn');

// State
let currentUser = null;
let token = localStorage.getItem('token');

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Theme handling is centralized in nav.js.
    // Here we only decide where to send the user based on auth state.
    if (token) {
        fetchUserProfile();
    } else {
        showAuth();
        var params = new URLSearchParams(window.location.search);
        if (params.get('reason') === 'login') {
            showAuthError('Please log in to continue.');
        }
    }
});

// Navigation
document.getElementById('show-register').addEventListener('click', function() {
    showAuthError('');
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
});

document.getElementById('show-login').addEventListener('click', function() {
    showAuthError('');
    registerContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

navLogin.addEventListener('click', () => {
    if (!token) {
        showAuth();
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }
});

navRegister.addEventListener('click', () => {
    if (!token) {
        showAuth();
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
    }
});

logoutBtn.addEventListener('click', logout);
if (upgradeBtn) upgradeBtn.addEventListener('click', upgradeToPremium);

// Email validation: valid format e.g. user@domain.com, user@site.ru (reject qwerty@.com)
function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/.test((email || '').trim());
}

function showAuthError(msg) {
    var el = document.getElementById('auth-error');
    if (el) {
        el.textContent = msg || '';
        el.classList.toggle('hidden', !msg);
    }
}

async function login(e) {
    e.preventDefault();
    showAuthError('');
    var email = document.getElementById('login-email').value.trim();
    var password = document.getElementById('login-password').value;
    if (!email || !password) {
        showAuthError('Please enter email and password.');
        return;
    }
    if (!isValidEmail(email)) {
        showAuthError('Please enter a valid email (e.g. example@domain.com or user@site.ru).');
        return;
    }
    try {
        var res = await fetch(API_URL + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });
        var data = await res.json();
        if (res.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            if (data.role) localStorage.setItem('userRole', data.role);
            if (data.username) localStorage.setItem('username', data.username);
            currentUser = data;
            // After successful login, redirect to the main app
            // (or onboarding if profile is not completed yet).
            await fetchUserProfile();
        } else {
            showAuthError(data.message || 'Invalid email or password.');
        }
    } catch (err) {
        console.error(err);
        showAuthError('Connection error. Please try again.');
    }
}

async function register(e) {
    e.preventDefault();
    showAuthError('');
    var username = (document.getElementById('reg-username').value || '').trim();
    var email = (document.getElementById('reg-email').value || '').trim();
    var password = document.getElementById('reg-password').value;
    if (!username || !email || !password) {
        showAuthError('Please fill in all fields.');
        return;
    }
    if (username.length < 2) {
        showAuthError('Username must be at least 2 characters.');
        return;
    }
    if (!isValidEmail(email)) {
        showAuthError('Please enter a valid email (e.g. example@domain.com or user@site.ru).');
        return;
    }
    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters.');
        return;
    }
    try {
        var res = await fetch(API_URL + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, email: email, password: password })
        });
        var data = await res.json();
        if (res.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            if (data.role) localStorage.setItem('userRole', data.role);
            if (data.username) localStorage.setItem('username', data.username);
            currentUser = data;
            window.location.href = 'onboarding.html';
        } else {
            showAuthError(data.message || 'Registration failed.');
        }
    } catch (err) {
        console.error(err);
        showAuthError('Connection error. Please try again.');
    }
}

function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    showAuth();
    window.location.href = 'main.html';
}

async function upgradeToPremium() {
    if (!confirm('Are you sure you want to upgrade to Premium?')) return;

    try {
        const res = await fetch(`${API_URL}/users/upgrade`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();

        console.log('Upgrade response:', data); // Debugging

        if (res.ok) {
            alert('Upgraded to Premium successfully!');
            // Update local user state
            // Re-fetch profile to be sure
            fetchUserProfile();
        } else {
            alert(data.message || 'Upgrade failed');
        }
    } catch (err) {
        console.error(err);
        alert('Error upgrading user');
    }
}

// Data Fetching
async function fetchUserProfile() {
    try {
        const res = await fetch(`${API_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
            currentUser = data; // updates user with profile details
            // If onboarding is done, send user to full dashboard.
            // Otherwise continue onboarding flow.
            if (data.onboardingCompleted) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'onboarding.html';
            }
        } else {
            logout();
        }
    } catch (err) {
        console.error(err);
        logout();
    }
}

async function fetchWorkouts() {
    try {
        const res = await fetch(`${API_URL}/workouts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
            displayWorkouts(data);
        }
    } catch (err) {
        console.error(err);
    }
}

async function generateWorkoutPlan(e) {
    e.preventDefault();
    if (!currentUser) return;

    // Gather stats from the generate form
    const age = document.getElementById('gen-age').value;
    const height = document.getElementById('gen-height').value;
    const weight = document.getElementById('gen-weight').value;
    const goalWeight = document.getElementById('gen-goal-weight').value;
    const gender = document.getElementById('gen-gender').value;
    const goal = document.getElementById('gen-goal').value;

    try {
        const res = await fetch(`${API_URL}/workouts/generate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                age, height, weight, goalWeight, goal, gender,
                // Using passed values directly, not from profile
            })
        });
        const data = await res.json();

        if (res.ok) {
            alert('Custom Workout Generated!');
            fetchWorkouts(); // Refresh list
        } else {
            alert(data.message || 'Generation failed');
        }
    } catch (err) {
        console.error(err);
        alert('Error generating workout');
    }
}

// UI Helpers
function showAuth() {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    var guestItems = document.querySelectorAll('.nav-guest');
    var profileWrap = document.getElementById('nav-profile-wrap');
    if (guestItems.length) guestItems.forEach(function(el) { el.classList.remove('hidden'); });
    if (profileWrap) profileWrap.classList.add('hidden');
}

function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    var guestItems = document.querySelectorAll('.nav-guest');
    var profileWrap = document.getElementById('nav-profile-wrap');
    var dropdownToggle = document.getElementById('profile-dropdown-toggle');
    var manageUsers = document.getElementById('nav-manage-users');
    if (guestItems.length) guestItems.forEach(function(el) { el.classList.add('hidden'); });
    if (profileWrap) profileWrap.classList.remove('hidden');
    if (dropdownToggle) dropdownToggle.textContent = (currentUser.username || 'Profile') + ' \u25BE';
    if (manageUsers) manageUsers.style.display = (currentUser.role === 'admin') ? '' : 'none';

    userGreeting.textContent = 'Welcome, ' + currentUser.username + ' (' + currentUser.role + ')!';

    if (['premium', 'moderator', 'admin'].includes(currentUser.role)) {
        premiumFeatures.classList.remove('hidden');
        upgradeSection.classList.add('hidden');
    } else {
        premiumFeatures.classList.add('hidden');
        upgradeSection.classList.remove('hidden');
    }

    fetchWorkouts();
}

function displayWorkouts(workouts) {
    workoutList.innerHTML = '';
    if (!workouts || workouts.length === 0) {
        workoutList.innerHTML = '<p class="muted-text">No workouts found. Pick a plan from Workout Plans.</p>';
        return;
    }
    workouts.forEach(function(workout) {
        var card = document.createElement('div');
        card.className = 'workout-card';
        var exercisesHtml = '';
        if (workout.exercises && workout.exercises.length > 0) {
            exercisesHtml = '<ul class="workout-exercise-list">';
            workout.exercises.forEach(function(ex) {
                exercisesHtml += '<li><strong>' + (ex.name || '') + '</strong>: ' + (ex.sets || '') + ' sets × ' + (ex.reps || '') + ' (Rest: ' + (ex.rest || 60) + 's)</li>';
            });
            exercisesHtml += '</ul>';
        }
        card.innerHTML =
            '<h4>' + (workout.name || '') + ' <small>' + (workout.accessLevel || 'free') + '</small></h4>' +
            '<p class="workout-desc">' + (workout.description || '') + '</p>' +
            '<p class="workout-meta"><strong>Goal:</strong> ' + (workout.target || '').replace(/_/g, ' ') + ' &nbsp;|&nbsp; <strong>Difficulty:</strong> ' + (workout.difficulty || '').replace(/_/g, ' ') + '</p>' +
            exercisesHtml;
        workoutList.appendChild(card);
    });
}

// Event Listeners
loginForm.addEventListener('submit', login);
registerForm.addEventListener('submit', register);
generateForm.addEventListener('submit', generateWorkoutPlan);
