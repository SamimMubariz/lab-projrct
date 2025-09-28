// auth.js - Authentication utility functions

function initializeUserDatabase() {
    if (!localStorage.getItem('users')) {
        const users = [
            {
                id: 1,
                email: 'admin@lab.edu',
                password: 'admin123',
                name: 'System Administrator',
                role: 'admin',
                department: 'IT',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                email: 'prof@lab.edu',
                password: 'prof123',
                name: 'Dr. Sarah Johnson',
                role: 'professor',
                department: 'Chemistry',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                email: 'student@lab.edu',
                password: 'student123',
                name: 'John Smith',
                role: 'student',
                department: 'Biology',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function authenticateUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.email === email && u.password === password);
}

function loginUser(user) {
    const session = {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department
        },
        loginTime: new Date().toISOString(),
        token: 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    };
    localStorage.setItem('currentSession', JSON.stringify(session));
    return session;
}

function isLoggedIn() {
    const session = localStorage.getItem('currentSession');
    if (!session) return false;
    
    const sessionData = JSON.parse(session);
    const loginTime = new Date(sessionData.loginTime);
    const hoursDiff = (new Date() - loginTime) / (1000 * 60 * 60);
    return hoursDiff < 24;
}

function logoutUser() {
    localStorage.removeItem('currentSession');
    window.location.href = 'index.html';
}

function getCurrentUser() {
    const session = localStorage.getItem('currentSession');
    return session ? JSON.parse(session).user : null;
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function requireRole(requiredRole) {
    if (!requireAuth()) return false;
    
    const user = getCurrentUser();
    if (user.role !== requiredRole && user.role !== 'admin') {
        alert('Access denied. Required role: ' + requiredRole);
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}