import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

export default function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample data for charts
  const weeklyThreats = [
    { day: 'Mon', threats: 12, blocked: 11 },
    { day: 'Tue', threats: 19, blocked: 18 },
    { day: 'Wed', threats: 15, blocked: 14 },
    { day: 'Thu', threats: 25, blocked: 24 },
    { day: 'Fri', threats: 18, blocked: 17 },
    { day: 'Sat', threats: 8, blocked: 8 },
    { day: 'Sun', threats: 6, blocked: 6 }
  ];

  const attackTypes = [
    { name: 'Phishing', value: 45, color: '#3B82F6' },
    { name: 'Malware', value: 25, color: '#EF4444' },
    { name: 'Spam', value: 20, color: '#F59E0B' },
    { name: 'Spoofing', value: 10, color: '#10B981' }
  ];

  const monthlyTrends = [
    { month: 'Jan', emails: 1200, threats: 45 },
    { month: 'Feb', emails: 1350, threats: 52 },
    { month: 'Mar', emails: 1420, threats: 38 },
    { month: 'Apr', emails: 1580, threats: 67 },
    { month: 'May', emails: 1650, threats: 43 },
    { month: 'Jun', emails: 1720, threats: 58 },
    { month: 'Jul', emails: 1890, threats: 72 },
    { month: 'Aug', emails: 1950, threats: 65 }
  ];

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      const userEmail = localStorage.getItem('user_email') || 'user@CyberShield.com';
      const userName = localStorage.getItem('user') ? 
        JSON.parse(localStorage.getItem('user')).name : 
        userEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      setUserData({
        name: userName,
        email: userEmail,
        department: 'IT Security',
        joinDate: '2024-01-15',
        lastLogin: new Date().toLocaleDateString(),
        securityScore: 92,
        emailsScanned: 1950,
        threatsBlocked: 65,
        phishingAttempts: 28,
        malwareDetected: 15
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
                <p className="text-gray-600">{userData.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="text-gray-800 font-medium">{userData.lastLogin}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - User Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Security Score */}
            <div className="glass p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Score</h3>
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - userData.securityScore / 100)}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800">{userData.securityScore}%</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Excellent security posture</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="glass p-4 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Emails Scanned</p>
                    <p className="text-2xl font-bold text-indigo-600">{userData.emailsScanned.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="glass p-4 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Threats Blocked</p>
                    <p className="text-2xl font-bold text-red-600">{userData.threatsBlocked}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-xl">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="glass p-4 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Phishing Attempts</p>
                    <p className="text-2xl font-bold text-orange-600">{userData.phishingAttempts}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Weekly Threats Bar Chart */}
            <div className="glass p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Threat Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyThreats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Bar dataKey="threats" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="blocked" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Attack Types Pie Chart */}
            <div className="glass p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attack Type Breakdown</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={attackTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attackTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {attackTypes.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trends Area Chart */}
            <div className="glass p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Email Security Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="emails" 
                    stackId="1" 
                    stroke="#3B82F6" 
                    fill="url(#colorEmails)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="threats" 
                    stackId="2" 
                    stroke="#EF4444" 
                    fill="url(#colorThreats)" 
                  />
                  <defs>
                    <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
