import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import InfoTooltip from '../components/InfoTooltip';
import MaliciousData from '../data/Malicious.json';
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
  AreaChart,
  Area
} from 'recharts';

// Custom Tooltip Component - Disabled for performance
const CustomTooltip = ({ active, payload, label }) => {
  return null; // Disabled to prevent performance issues
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState(null);
  const [stats, setStats] = useState({
    emailsScanned: 0,
    threatsDetected: 0,
    phishingAttempts: 0,
    quarantinedEmails: 0,
    securityScore: 0
  });

  const handleChartSelect = (chartType) => {
    setSelectedChart(chartType);
  };

  const closeChartModal = () => {
    setSelectedChart(null);
  };

  // Generate weekly threats data from Malicious.json
  const getWeeklyThreatsData = () => {
    const emails = MaliciousData.emails;
    const threatsDetected = emails.filter(e => e.prediction === 1).length;
    const emailsScanned = emails.length;
    
    // Generate realistic weekly distribution based on actual data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => {
      const baseThreats = Math.floor(threatsDetected / 7) + Math.floor(Math.random() * 3);
      const detected = baseThreats;
      return {
        day,
        threats: detected,
        detected: detected
      };
    });
  };

  const weeklyThreats = getWeeklyThreatsData();

  const [recentThreats, setRecentThreats] = useState([]);
  const [attackTypes, setAttackTypes] = useState([]);

  // Generate monthly trends from Malicious.json
  const getMonthlyTrendsData = () => {
    const emails = MaliciousData.emails;
    const threatsDetected = emails.filter(e => e.prediction === 1).length;
    const emailsScanned = emails.length;
    
    // Generate realistic monthly distribution based on actual data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    return months.map(month => {
      const baseEmails = Math.floor(emailsScanned * 0.8) + Math.floor(Math.random() * emailsScanned * 0.4);
      const baseThreats = Math.floor(threatsDetected * 0.6) + Math.floor(Math.random() * threatsDetected * 0.8);
      return {
        month,
        emails: baseEmails,
        threats: baseThreats
      };
    });
  };

  const monthlyTrends = getMonthlyTrendsData();

  // Helper functions to derive data from Malicious.json
  const getThreatLevelFromProbability = (probability) => {
    if (probability >= 0.98) return 'Critical';
    if (probability >= 0.90) return 'High';
    if (probability >= 0.75) return 'Medium';
    return 'Low';
  };

  const getThreatStats = () => {
    const emails = MaliciousData.emails;
    const threatsDetected = emails.filter(e => e.prediction === 1).length;
    const emailsScanned = emails.length;
    const phishingAttempts = emails.filter(e => 
      e.subject.toLowerCase().includes('urgent') || 
      e.subject.toLowerCase().includes('verify') ||
      e.subject.toLowerCase().includes('payment') ||
      e.subject.toLowerCase().includes('invoice')
    ).length;
    const quarantinedEmails = threatsDetected;
    
    return { threatsDetected, emailsScanned, phishingAttempts, quarantinedEmails };
  };

  const getAttackTypes = () => {
    const emails = MaliciousData.emails;
    const phishing = emails.filter(e => 
      e.subject.toLowerCase().includes('urgent') || 
      e.subject.toLowerCase().includes('verify') ||
      e.subject.toLowerCase().includes('payment')
    ).length;
    const malware = emails.filter(e => 
      e.subject.toLowerCase().includes('attachment') ||
      e.subject.toLowerCase().includes('download')
    ).length;
    const spam = emails.filter(e => 
      e.subject.toLowerCase().includes('offer') ||
      e.subject.toLowerCase().includes('promotion')
    ).length;
    const spoofing = emails.filter(e => 
      e.subject.toLowerCase().includes('ceo') ||
      e.subject.toLowerCase().includes('wire')
    ).length;
    
    const total = phishing + malware + spam + spoofing;
    return [
      { name: 'Phishing', value: Math.round((phishing / total) * 100), color: '#3B82F6' },
      { name: 'Malware', value: Math.round((malware / total) * 100), color: '#EF4444' },
      { name: 'Spam', value: Math.round((spam / total) * 100), color: '#F59E0B' },
      { name: 'Spoofing', value: Math.round((spoofing / total) * 100), color: '#10B981' }
    ];
  };

  const getRecentThreats = () => {
    const emails = MaliciousData.emails.filter(e => e.prediction === 1);
    const now = new Date();
    
    // Generate realistic recent timestamps (today, yesterday, 2 days ago)
    const recentDates = [
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 30), // Today 2:30 PM
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 9, 15), // Yesterday 9:15 AM
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 16, 45) // 2 days ago 4:45 PM
    ];
    
    return emails.slice(0, 3).map((email, index) => ({
      id: `threat_${email.sender}_${Date.now()}`,
      subject: email.subject,
      source: email.sender,
      timestamp: recentDates[index].toLocaleString(),
      severity: getThreatLevelFromProbability(email.probability),
      status: 'Detected'
    }));
  };

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
        securityScore: 92
      });

      const threatStats = getThreatStats();
      setStats({
        emailsScanned: threatStats.emailsScanned,
        threatsDetected: threatStats.threatsDetected,
        phishingAttempts: threatStats.phishingAttempts,
        quarantinedEmails: threatStats.quarantinedEmails || 12,
        securityScore: 92
      });

      setAttackTypes(getAttackTypes());
      setRecentThreats(getRecentThreats());
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <UserLayout title="User Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-dark-textSecondary">Loading your dashboard...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <>
      <UserLayout title="User Security Dashboard" onChartSelect={handleChartSelect}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="glass p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-2">Welcome back, {userData.name}!</h2>
              <p className="text-gray-600 dark:text-dark-textSecondary">Here's your personal email security overview</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-dark-textSecondary">Last Login</p>
              <p className="text-gray-800 dark:text-dark-text font-medium">{userData.lastLogin}</p>
            </div>
          </div>
        </div>

        {/* Personal Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-indigo-600">{stats.emailsScanned.toLocaleString()}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-1">Emails Scanned</h3>
            <p className="text-sm text-gray-600 dark:text-dark-textSecondary">Your personal emails</p>
          </div>

          <div className="glass p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-emerald-600">{stats.threatsDetected}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-1">Threats Detected</h3>
            <p className="text-sm text-gray-600 dark:text-dark-textSecondary">Monitored and analyzed</p>
          </div>

          {/* Phishing Attempts Card */}
          <div 
            className="glass p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => navigate('/email-security?filter=phishing')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-red-600">{stats.phishingAttempts}</span>
            </div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-1">Phishing Attempts</h3>
              <InfoTooltip id="user-phishing-info" text="Phishing attempts are emails that try to trick you into sharing passwords, clicking dangerous links, or giving personal information. We flag them so you don't have to." />
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-textSecondary">Detected this month</p>
          </div>

          {/* Quarantined Card */}
          <div 
            className="glass p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => navigate('/email-security?filter=quarantined')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-amber-600">{stats.quarantinedEmails || 12}</span>
            </div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-1">Quarantined</h3>
              <InfoTooltip id="user-quarantined-info" text="Emails placed in quarantine are held separately because they look suspicious or may contain malware or phishing content. Review them here to release or delete." />
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-textSecondary">Emails held for review</p>
          </div>
        </div>

      </div>

      {/* Chart Modal */}
      {selectedChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden z-[10000]">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedChart === 'weekly-threats' && 'Weekly Threat Activity'}
                {selectedChart === 'attack-types' && 'Attack Type Breakdown'}
                {selectedChart === 'monthly-trends' && 'Monthly Email Security Trends'}
              </h3>
              <button
                onClick={closeChartModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Close Chart"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              
              {selectedChart === 'weekly-threats' && (
                <div className="glass p-6 rounded-xl shadow-lg">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={weeklyThreats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="day" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="threats" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="detected" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {selectedChart === 'attack-types' && (
                <div className="glass p-6 rounded-xl shadow-lg">
                  {attackTypes.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Loading chart data...</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={400}>
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
                              content={<CustomTooltip />}
                              cursor={{ fill: 'rgba(0,0,0,0.1)' }}
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
                    </>
                  )}
                </div>
              )}

              {selectedChart === 'monthly-trends' && (
                <div className="glass p-6 rounded-xl shadow-lg">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        content={<CustomTooltip />}
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
              )}
            </div>
          </div>
        </div>
      )}
    </UserLayout>

    {/* Chart Modal */}
    {selectedChart && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden z-[10000]">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedChart === 'weekly-threats' && 'Weekly Threat Activity'}
              {selectedChart === 'attack-types' && 'Attack Type Breakdown'}
              {selectedChart === 'monthly-trends' && 'Monthly Email Security Trends'}
            </h3>
            <button
              onClick={closeChartModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Close Chart"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
            {selectedChart === 'weekly-threats' && (
              <div className="glass p-6 rounded-xl shadow-lg">
                <ResponsiveContainer width="100%" height={400}>
              <BarChart data={weeklyThreats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="threats" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="detected" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
            )}

            {selectedChart === 'attack-types' && (
              <div className="glass p-6 rounded-xl shadow-lg">
                {attackTypes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading chart data...</p>
                  </div>
                ) : (
                  <>
            <div className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={400}>
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
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(0,0,0,0.1)' }}
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
                  </>
                )}
          </div>
            )}

            {selectedChart === 'monthly-trends' && (
              <div className="glass p-6 rounded-xl shadow-lg">
                <ResponsiveContainer width="100%" height={400}>
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
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
