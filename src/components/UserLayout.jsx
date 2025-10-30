import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function UserLayout({ children, title, onChartSelect }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.name || parsed.email?.split('@')[0] || 'User';
      }
      return 'User';
    } catch (error) {
      return 'User';
    }
  };

  const userName = getUserData();

  const handleChartSelect = (chartType) => {
    console.log('Chart selected:', chartType); // Debug log
    setIsMenuOpen(false);
    if (onChartSelect) {
      onChartSelect(chartType);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-surface">
      {/* Elegant sidebar */}
      <aside className="relative z-10 w-64 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl border-r border-gray-200 dark:border-dark-border shadow-xl p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CyberShield</h2>
          <p className="text-gray-600 dark:text-dark-textSecondary text-sm">CyberShield AI Defense System</p>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => navigate('/user-dashboard')}
            className={`flex items-center w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
              isActive('/user-dashboard') 
                ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-200' 
                : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-gray-700 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-300'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
            Dashboard
          </button>
          
          <button
            onClick={() => navigate('/user-reports')}
            className={`flex items-center w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
              isActive('/user-reports') 
                ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-200' 
                : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-gray-700 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-300'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Security Reports
          </button>
          
          <button
            onClick={() => navigate('/user-alerts')}
            className={`flex items-center w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
              isActive('/user-alerts') 
                ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-200' 
                : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-gray-700 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-300'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Email Security
          </button>
          
          {/* Analytics Section */}
          <div className="pt-2 border-t border-gray-200">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Data Visualization
            </div>
            
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center w-full text-left px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700 dark:text-white hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 font-medium focus:bg-gradient-to-r focus:from-blue-100 focus:to-purple-100 focus:text-blue-800"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Charts & Analytics
                <svg className={`w-4 h-4 ml-auto transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Analytics Dropdown */}
              {isMenuOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleChartSelect('weekly-threats');
                    }}
                    className="flex items-center w-full text-left px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-200 text-sm"
                  >
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Weekly Threat Activity
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleChartSelect('monthly-trends');
                    }}
                    className="flex items-center w-full text-left px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 transition-all duration-200 text-sm"
                  >
                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    Monthly Email Security Trends
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleChartSelect('attack-types');
                    }}
                    className="flex items-center w-full text-left px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-300 transition-all duration-200 text-sm"
                  >
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    Attack Type Breakdown
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-gray-700 dark:text-white hover:text-red-600 dark:hover:text-red-300 transition-all duration-300 font-medium"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Elegant top bar */}
        <header className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl border-b border-gray-200 dark:border-dark-border shadow-sm p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">{title}</h1>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-gray-600 dark:text-dark-textSecondary font-medium">{userName}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
