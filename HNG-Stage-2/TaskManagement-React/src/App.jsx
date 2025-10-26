import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, X, LogOut, Plus, Edit2, Trash2, Menu, XCircle } from 'lucide-react';

// Utility Functions
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const getStoredData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStoredData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in max-w-md`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-80">
        <X size={18} />
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [session, setSession] = useState(null);
  const [toast, setToast] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedSession = getStoredData('ticketapp_session');
    const storedTickets = getStoredData('ticketapp_tickets', []);
    const storedUsers = getStoredData('ticketapp_users', [
      { id: '1', email: 'demo@example.com', password: 'demo123', name: 'Demo User' }
    ]);

    setSession(storedSession);
    setTickets(storedTickets);
    setUsers(storedUsers);

    if (storedSession) {
      setCurrentPage('dashboard');
    }
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const sessionData = { userId: user.id, email: user.email, name: user.name, token: generateId() };
      setStoredData('ticketapp_session', sessionData);
      setSession(sessionData);
      setCurrentPage('dashboard');
      showToast('Login successful! Welcome back.', 'success');
      return true;
    }
    showToast('Invalid email or password. Please try again.', 'error');
    return false;
  };

  const signup = (email, password, name) => {
    if (users.find(u => u.email === email)) {
      showToast('Email already exists. Please use a different email.', 'error');
      return false;
    }
    const newUser = { id: generateId(), email, password, name };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setStoredData('ticketapp_users', updatedUsers);
    
    const sessionData = { userId: newUser.id, email: newUser.email, name: newUser.name, token: generateId() };
    setStoredData('ticketapp_session', sessionData);
    setSession(sessionData);
    setCurrentPage('dashboard');
    showToast('Account created successfully! Welcome aboard.', 'success');
    return true;
  };

  const logout = () => {
    localStorage.removeItem('ticketapp_session');
    setSession(null);
    setCurrentPage('landing');
    showToast('You have been logged out successfully.', 'success');
  };

  const addTicket = (ticket) => {
    const newTicket = { ...ticket, id: generateId(), createdAt: new Date().toISOString() };
    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    setStoredData('ticketapp_tickets', updatedTickets);
    showToast('Ticket created successfully!', 'success');
  };

  const updateTicket = (id, updatedData) => {
    const updatedTickets = tickets.map(t => t.id === id ? { ...t, ...updatedData, updatedAt: new Date().toISOString() } : t);
    setTickets(updatedTickets);
    setStoredData('ticketapp_tickets', updatedTickets);
    showToast('Ticket updated successfully!', 'success');
  };

  const deleteTicket = (id) => {
    const updatedTickets = tickets.filter(t => t.id !== id);
    setTickets(updatedTickets);
    setStoredData('ticketapp_tickets', updatedTickets);
    showToast('Ticket deleted successfully!', 'success');
  };

  const navigateTo = (page) => {
    if ((page === 'dashboard' || page === 'tickets') && !session) {
      setCurrentPage('login');
      showToast('Your session has expired — please log in again.', 'error');
      return;
    }
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      
      {currentPage === 'landing' && <LandingPage onNavigate={navigateTo} />}
      {currentPage === 'login' && <LoginPage onLogin={login} onNavigate={navigateTo} />}
      {currentPage === 'signup' && <SignupPage onSignup={signup} onNavigate={navigateTo} />}
      {currentPage === 'dashboard' && <Dashboard tickets={tickets} session={session} onNavigate={navigateTo} onLogout={logout} />}
      {currentPage === 'tickets' && <TicketManagement tickets={tickets} onAdd={addTicket} onUpdate={updateTicket} onDelete={deleteTicket} onNavigate={navigateTo} onLogout={logout} session={session} />}
    </div>
  );
};

// Landing Page Component
const LandingPage = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-indigo-600">TicketFlow</h1>
            <nav className="hidden md:flex gap-6">
              <button onClick={() => onNavigate('login')} className="text-gray-600 hover:text-indigo-600 transition">Login</button>
              <button onClick={() => onNavigate('signup')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Get Started</button>
            </nav>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-3">
              <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} className="text-gray-600 hover:text-indigo-600 transition text-left">Login</button>
              <button onClick={() => { onNavigate('signup'); setMobileMenuOpen(false); }} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Get Started</button>
            </nav>
          )}
        </div>
      </header>

      <section className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Manage Your Tickets with Ease</h2>
            <p className="text-xl sm:text-2xl mb-8 text-indigo-100">Streamline your workflow with our powerful ticket management system. Track, organize, and resolve tickets efficiently.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => onNavigate('signup')} className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">Get Started Free</button>
              <button onClick={() => onNavigate('login')} className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition text-lg">Login</button>
            </div>
          </div>
        </div>
        
        <div className="absolute top-10 right-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-400 opacity-20 rounded-full"></div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-bold text-center mb-4">Why Choose TicketFlow?</h3>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">Everything you need to manage tickets effectively in one powerful platform.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h4 className="text-2xl font-semibold mb-4">Easy Tracking</h4>
              <p className="text-gray-600">Keep track of all your tickets in one centralized dashboard with real-time status updates.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Edit2 className="text-blue-600" size={32} />
              </div>
              <h4 className="text-2xl font-semibold mb-4">Quick Updates</h4>
              <p className="text-gray-600">Update ticket status and details instantly with our intuitive interface.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="text-purple-600" size={32} />
              </div>
              <h4 className="text-2xl font-semibold mb-4">Smart Notifications</h4>
              <p className="text-gray-600">Stay informed with instant notifications and never miss important updates.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 opacity-20 rounded-full blur-3xl"></div>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h3 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Get Started?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Join thousands of teams already using TicketFlow to manage their tickets efficiently.</p>
          <button onClick={() => onNavigate('signup')} className="bg-indigo-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition text-lg">Create Your Account</button>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; 2025 TicketFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Login Page Component
const LoginPage = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 opacity-30 rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Login to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => onNavigate('signup')} className="text-indigo-600 font-semibold hover:underline">
                Sign up
              </button>
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700 font-semibold mb-1">Demo Credentials:</p>
            <p className="text-sm text-gray-600">Email: demo@example.com</p>
            <p className="text-sm text-gray-600">Password: demo123</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => onNavigate('landing')} className="text-gray-600 hover:text-indigo-600 transition">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// Signup Page Component
const SignupPage = ({ onSignup, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSignup(email, password, name);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden py-12">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 opacity-30 rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Sign up to get started with TicketFlow</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={() => onNavigate('login')} className="text-indigo-600 font-semibold hover:underline">
                Login
              </button>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => onNavigate('landing')} className="text-gray-600 hover:text-indigo-600 transition">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ tickets, session, onNavigate, onLogout }) => {
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-indigo-600">TicketFlow</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 hidden sm:inline">Welcome, {session?.name}</span>
              <button onClick={onLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition">
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h2>
          <p className="text-xl text-gray-600">Overview of your ticket management system</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Open Tickets</h3>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800">{openTickets}</p>
            <p className="text-sm text-gray-500 mt-2">Awaiting attention</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-amber-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Edit2 className="text-amber-600" size={24} />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800">{inProgressTickets}</p>
            <p className="text-sm text-gray-500 mt-2">Being worked on</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-gray-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Closed</h3>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-gray-600" size={24} />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800">{closedTickets}</p>
            <p className="text-sm text-gray-500 mt-2">Resolved tickets</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Manage Your Tickets</h3>
            <p className="text-indigo-100 mb-6 text-lg">Create, view, edit, and delete tickets with our comprehensive ticket management system.</p>
            <button onClick={() => onNavigate('tickets')} className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Go to Ticket Management
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; 2025 TicketFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Ticket Management Component
const TicketManagement = ({ tickets, onAdd, onUpdate, onDelete, onNavigate, onLogout, session }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'open', priority: 'medium' });
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const resetForm = () => {
    setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
    setErrors({});
    setShowForm(false);
    setEditingTicket(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!['open', 'in_progress', 'closed'].includes(formData.status)) {
      newErrors.status = 'Status must be one of: open, in_progress, closed';
    }
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (editingTicket) {
        onUpdate(editingTicket.id, formData);
      } else {
        onAdd(formData);
      }
      resetForm();
    }
  };

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description || '',
      status: ticket.status,
      priority: ticket.priority || 'medium'
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    onDelete(id);
    setDeleteConfirm(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-indigo-600">TicketFlow</h1>
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate('dashboard')} className="text-gray-600 hover:text-indigo-600 transition hidden sm:inline">
                Dashboard
              </button>
              <span className="text-gray-600 hidden sm:inline">{session?.name}</span>
              <button onClick={onLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition">
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Ticket Management</h2>
            <p className="text-xl text-gray-600">Create, view, edit, and delete your tickets</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Plus size={20} />
            New Ticket
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">{editingTicket ? 'Edit Ticket' : 'Create New Ticket'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="Enter ticket title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="Enter ticket description"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                  {editingTicket ? 'Update Ticket' : 'Create Ticket'}
                </button>
                <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Tickets Yet</h3>
            <p className="text-gray-600 mb-6">Create your first ticket to get started.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Ticket
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map(ticket => (
              <div key={ticket.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex-1 pr-4">{ticket.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                </div>

                {ticket.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{ticket.description}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Priority: <span className="font-semibold capitalize">{ticket.priority || 'medium'}</span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(ticket)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(ticket.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-8">Are you sure you want to delete this ticket? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; 2025 TicketFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App