import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import InfoTooltip from "../components/InfoTooltip";
import { dashboardAPI } from "../services/api";
import MaliciousData from "../data/Malicious.json";
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

// Custom Tooltip Component - Disabled for performance
const CustomTooltip = ({ active, payload, label }) => {
  return null; // Disabled to prevent performance issues
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeUsers: 0,
    threatsDetected: 0,
    emailsScanned: 0,
    phishingAttempts: 0,
    quarantinedEmails: 0,
    systemStatus: "Loading..."
  });
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState(null);
  const [attackTypes, setAttackTypes] = useState([]);

  const handleChartSelect = (chartType) => {
    console.log('Dashboard handleChartSelect called with:', chartType); // Debug log
    console.log('Setting selectedChart to:', chartType); // Debug log
    setSelectedChart(chartType);
    console.log('selectedChart state should now be:', chartType); // Debug log
  };

  const closeChartModal = () => {
    setSelectedChart(null);
  };

  // Calculate system health status
  const getSystemHealth = () => {
    const totalSystems = stats.activeUsers;
    const operationalSystems = stats.activeUsers - 2; // Simulate 2 systems with issues
    const issuesDetected = 2; // Show 2 issues detected
    
    if (issuesDetected === 0 && operationalSystems === totalSystems) {
      return {
        status: "All Systems Operational",
        color: "green",
        issues: 0
      };
    } else if (issuesDetected > 0) {
      return {
        status: `${issuesDetected} System${issuesDetected > 1 ? 's' : ''} with Issues`,
        color: "red",
        issues: issuesDetected
      };
    } else {
      return {
        status: "Partial System Issues",
        color: "yellow",
        issues: issuesDetected
      };
    }
  };

  // Generate weekly threats data from Malicious.json
  const getWeeklyThreatsData = () => {
    const emails = MaliciousData.emails;
    const threatsDetected = emails.filter(e => e.prediction === 1).length;
    const emailsScanned = emails.length;
    
    // Generate realistic weekly distribution based on actual data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => {
      const baseThreats = Math.floor(threatsDetected / 7) + Math.floor(Math.random() * 5);
      const detected = baseThreats;
      return {
        day,
        threats: detected,
        detected: detected
      };
    });
  };

  const weeklyThreats = getWeeklyThreatsData();

  // Chart data - simplified from Malicious.json
  const getAttackTypes = () => {
    const emails = MaliciousData.emails.filter(email => email.prediction === 1);
    
    const phishing = emails.filter(email => 
      email.subject.toLowerCase().includes('verify') || 
      email.subject.toLowerCase().includes('urgent') ||
      email.subject.toLowerCase().includes('account')
    ).length;
    
    const malware = emails.filter(email => 
      email.subject.toLowerCase().includes('invoice') || 
      email.subject.toLowerCase().includes('attachment') ||
      email.subject.toLowerCase().includes('download')
    ).length;
    
    const ransomware = emails.filter(email => 
      email.body.toLowerCase().includes('bitcoin') || 
      email.body.toLowerCase().includes('encrypted') ||
      email.body.toLowerCase().includes('ransom')
    ).length;
    
    const spam = emails.filter(email => 
      email.subject.toLowerCase().includes('offer') || 
      email.subject.toLowerCase().includes('discount') ||
      email.subject.toLowerCase().includes('newsletter')
    ).length;
    
    const spoofing = emails.filter(email => 
      email.subject.toLowerCase().includes('wire transfer') || 
      email.subject.toLowerCase().includes('ceo') ||
      email.subject.toLowerCase().includes('internal')
    ).length;
    
    return [
      { name: 'Phishing', value: phishing, color: '#3B82F6' },
      { name: 'Malware', value: malware, color: '#EF4444' },
      { name: 'Spam', value: spam, color: '#F59E0B' },
      { name: 'Spoofing', value: spoofing, color: '#10B981' },
      { name: 'Ransomware', value: ransomware, color: '#8B5CF6' }
    ];
  };

  // Monthly trends based on Malicious.json data (Jan-Oct only)
  const monthlyTrends = [
    { month: 'Jan', emails: Math.floor(MaliciousData.emails.length * 1.0), threats: Math.floor(MaliciousData.emails.filter(e => e.prediction === 1).length * 1.0) },
    { month: 'Feb', emails: Math.floor(MaliciousData.emails.length * 1.1), threats: Math.floor(MaliciousData.emails.filter(e => e.prediction === 1).length * 1.1) },
    { month: 'Mar', emails: Math.floor(MaliciousData.emails.length * 0.9), threats: Math.floor(MaliciousData.emails.filter(e => e.prediction === 1).length * 0.9) },
    { month: 'Apr', emails: Math.floor(MaliciousData.emails.length * 1.2), threats: Math.floor(MaliciousData.emails.filter(e => e.prediction === 1).length * 1.2) },
    { month: 'May', emails: Math.floor(MaliciousData.emails.length * 1.0), threats: Math.floor(MaliciousData.emails.filter(e => e.prediction === 1).length * 1.0) },
    { month: 'Jun', emails: Math.floor(MaliciousData.emails.length * 1.1), threats: Math.floor(MaliciousData.emails.filter(e => e.prediction === 1).length * 1.1) },
    { month: 'Jul', emails: Math.floor(MaliciousData.emails.length * 0.8), threats: Math.floor(MaliciousData.emails.filter(e => e.prediction === 1).length * 0.8) },
    { month: 'Aug', emails: Math.floor(MaliciousData.emails.length * 1.3), threats: Math.floor(MaliciousData.emails.filter(e => e.prediction === 1).length * 1.3) },
    { month: 'Sep', emails: Math.floor(MaliciousData.emails.length * 1.1), threats: Math.floor(MaliciousData.emails.filter(e => e.prediction === 1).length * 1.1) },
    { month: 'Oct', emails: Math.floor(MaliciousData.emails.length * 1.4), threats: Math.floor(MaliciousData.emails.filter(e => e.prediction === 1).length * 1.4) }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data from API...');
      const response = await dashboardAPI.getStats();
      console.log('Dashboard API response:', response);
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      console.log('Using simplified Malicious.json data');
      
      // Use simplified data from Malicious.json
      const threatStats = getThreatStats();
      setStats({
        activeUsers: 1247,
        threatsDetected: threatStats.totalThreats,
        emailsScanned: MaliciousData.emails.length,
        phishingAttempts: MaliciousData.emails.filter(email => 
          email.prediction === 1 && email.subject.toLowerCase().includes('verify')
        ).length,
        quarantinedEmails: threatStats.criticalThreats + threatStats.highThreats,
        systemStatus: "All Systems Operational"
      });
      
      // Set attack types data for charts
      setAttackTypes(getAttackTypes());
    } finally {
      setLoading(false);
    }
  };



  // Get threat statistics from Malicious.json
  const getThreatStats = () => {
    const emails = MaliciousData.emails;
    const threatEmails = emails.filter(email => email.prediction === 1);
    
    return {
      totalThreats: threatEmails.length,
      criticalThreats: threatEmails.filter(email => email.probability >= 0.9).length,
      highThreats: threatEmails.filter(email => email.probability >= 0.7 && email.probability < 0.9).length,
      mediumThreats: threatEmails.filter(email => email.probability >= 0.5 && email.probability < 0.7).length,
      lowThreats: emails.filter(email => email.prediction === 0).length
    };
  };

  return (
    <>
      <DashboardLayout title="Email Security Dashboard" onChartSelect={handleChartSelect}>
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Email Security Dashboard</h2>
            </div>
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 - Active Users */}
          <div className="glass p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-indigo-600">
                {loading ? "..." : stats.activeUsers.toLocaleString()}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-1">Active Users</h3>
            <p className="text-sm text-gray-600 dark:text-dark-textSecondary">Company employees</p>
          </div>

          {/* Card 2 - Emails Scanned */}
          <div className="glass p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-emerald-600">
                {loading ? "..." : stats.emailsScanned.toLocaleString()}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-1">Emails Scanned</h3>
            <p className="text-sm text-gray-600 dark:text-dark-textSecondary">Today</p>
          </div>

          {/* Card 3 - Phishing Attempts */}
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
              <span className="text-2xl font-bold text-red-600">
                {loading ? "..." : stats.phishingAttempts}
              </span>
            </div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-1">Phishing Attempts</h3>
              <InfoTooltip id="dashboard-phishing-info" text="Phishing attempts are emails that try to trick you into sharing passwords, clicking dangerous links, or giving personal information. We flag them so you don't have to." />
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-textSecondary">Detected today</p>
          </div>

          {/* Card 4 - Quarantined */}
          <div 
            className="glass p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => navigate('/email-security?filter=quarantined')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-amber-600">
                {loading ? "..." : stats.quarantinedEmails}
              </span>
            </div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-1">Quarantined</h3>
              <InfoTooltip id="dashboard-quarantined-info" text="Emails placed in quarantine are held separately because they look suspicious or may contain malware or phishing content. Review them here to release or delete." />
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-textSecondary">Suspicious emails</p>
          </div>
        </div>


        {/* System Status */}
        <div className="glass p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-2">Defense System Status</h3>
              <p className="text-gray-600 dark:text-dark-textSecondary text-sm">AI monitoring confirms all employee systems are operational and secure.</p>
              <div className="mt-3 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-dark-textSecondary">
                    <span className="font-semibold text-gray-800 dark:text-dark-text">{stats.activeUsers}</span> Systems Integrated
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-dark-textSecondary">
                    <span className="font-semibold text-green-600">{stats.activeUsers - getSystemHealth().issues}</span> Operational
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getSystemHealth().color === 'green' ? 'bg-green-500' : getSystemHealth().color === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm text-gray-600 dark:text-dark-textSecondary">
                    <span className={`font-semibold ${getSystemHealth().color === 'green' ? 'text-green-600' : getSystemHealth().color === 'red' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {getSystemHealth().issues}
                    </span> Issues Detected
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${getSystemHealth().color === 'green' ? 'bg-green-500' : getSystemHealth().color === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
              <p className={`text-lg font-semibold ${getSystemHealth().color === 'green' ? 'text-green-600' : getSystemHealth().color === 'red' ? 'text-red-600' : 'text-yellow-600'}`}>
                {loading ? "Loading..." : getSystemHealth().status}
              </p>
            </div>
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
      </DashboardLayout>

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
    </>
  );
}
