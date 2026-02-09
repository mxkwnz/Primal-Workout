(function () {
    var token = localStorage.getItem('token');
    var role = localStorage.getItem('userRole') || '';
    var username = localStorage.getItem('username') || 'Profile';
    var navLinks = document.getElementById('nav-links');
    var burger = document.getElementById('nav-burger');
    var profileDropdown = document.getElementById('profile-dropdown');
    var dropdownToggle = document.getElementById('profile-dropdown-toggle');
    var themeBtn = document.getElementById('theme-toggle');

    function applyTheme() {
        var theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.classList.toggle('theme-light', theme === 'light');
        if (themeBtn) themeBtn.textContent = theme === 'light' ? 'Dark Theme' : 'Light Theme';
    }
    applyTheme();
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            var theme = localStorage.getItem('theme') || 'dark';
            var next = theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', next);
            applyTheme();
        });
    }

    if (navLinks) {
        var guestItems = navLinks.querySelectorAll('.nav-guest');
        var profileWrap = document.getElementById('nav-profile-wrap');
        var manageUsersLink = document.getElementById('nav-manage-users');
        if (profileWrap) {
            if (token) {
                profileWrap.classList.remove('hidden');
                if (dropdownToggle) dropdownToggle.textContent = username + ' ▾';
                if (manageUsersLink) {
                    if (role === 'admin') {
                        manageUsersLink.style.display = '';
                        manageUsersLink.href = 'admin.html';
                    } else if (role === 'moderator') {
                        manageUsersLink.style.display = '';
                        manageUsersLink.href = 'moderator.html';
                    } else {
                        manageUsersLink.style.display = 'none';
                    }
                }
            } else {
                profileWrap.classList.add('hidden');
            }
        }
        // Treat "logged in" as having a visible profile dropdown
        var isLoggedIn = !!token && profileWrap && !profileWrap.classList.contains('hidden');

        if (guestItems.length) {
            guestItems.forEach(function (el) {
                el.classList.toggle('hidden', isLoggedIn);
            });
        }

        // Hide auth-only pages (e.g., Calendar, History) for guests
        ['calendar.html', 'history.html'].forEach(function (href) {
            var link = navLinks.querySelector('a[href="' + href + '"]');
            if (link && link.parentElement) {
                link.parentElement.classList.toggle('hidden', !isLoggedIn);
            }
        });
    }

    if (burger && navLinks) {
        burger.addEventListener('click', function () {
            burger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
        document.addEventListener('click', function (e) {
            if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
                burger.classList.remove('open');
                navLinks.classList.remove('open');
            }
        });
    }

    if (dropdownToggle && profileDropdown) {
        dropdownToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('open');
        });
        document.addEventListener('click', function () {
            profileDropdown.classList.remove('open');
        });
    }

    var logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
            window.location.href = 'main.html';
        });
    }
})();
