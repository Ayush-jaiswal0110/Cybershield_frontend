import React, { useState, useEffect } from 'react';
import UserLayout from '../components/UserLayout';
import InfoTooltip from '../components/InfoTooltip';
import MaliciousData from '../data/Malicious.json';

export default function UserAlerts() {
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  console.log('UserAlerts component rendered');

  // Helper functions to derive data from Malicious.json
  const getThreatLevelFromProbability = (probability) => {
    if (probability >= 0.98) return 'Critical';
    if (probability >= 0.90) return 'High';
    if (probability >= 0.75) return 'Medium';
    return 'Low';
  };

  const getThreatTypeFromEmail = (email) => {
    const subject = email.subject.toLowerCase();
    if (subject.includes('urgent') || subject.includes('verify') || subject.includes('payment')) {
      return 'Phishing';
    } else if (subject.includes('attachment') || subject.includes('download')) {
      return 'Malware';
    } else if (subject.includes('offer') || subject.includes('promotion')) {
      return 'Spam';
    } else if (subject.includes('ceo') || subject.includes('wire')) {
      return 'Spoofing';
    } else if (subject.includes('encrypt') || subject.includes('ransom')) {
      return 'Ransomware';
    }
    return 'Phishing'; // Default
  };

  const generateAlertsFromMaliciousData = () => {
    return MaliciousData.emails.filter(e => e.prediction === 1).map((email, index) => {
      // Create more realistic status distribution
      const statuses = ['Active', 'Resolved', 'Blocked', 'Quarantined'];
      const statusWeights = [0.6, 0.2, 0.15, 0.05]; // 60% Active, 20% Resolved, 15% Blocked, 5% Quarantined
      
      let randomValue = Math.random();
      let cumulativeWeight = 0;
      let selectedStatus = 'Active';
      
      for (let i = 0; i < statuses.length; i++) {
        cumulativeWeight += statusWeights[i];
        if (randomValue <= cumulativeWeight) {
          selectedStatus = statuses[i];
          break;
        }
      }
      
      return {
        id: `AL-${1000 + index}`,
        threatScore: email.probability,
        severity: getThreatLevelFromProbability(email.probability).toUpperCase(),
        subject: email.subject,
        source: email.sender,
        type: getThreatTypeFromEmail(email),
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
        status: selectedStatus,
        description: `Suspicious email detected: ${email.subject}`
      };
    });
  };

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    setAlerts(generateAlertsFromMaliciousData());
  }, []);


  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = selectedSeverity === 'All' || alert.severity === selectedSeverity;
    const matchesType = selectedType === 'All' || alert.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || alert.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      alert.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSeverity && matchesType && matchesStatus && matchesSearch;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-700';
      case 'MEDIUM': return 'bg-orange-100 text-orange-700';
      case 'LOW': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Blocked': return 'bg-blue-100 text-blue-700';
      case 'Quarantined': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <UserLayout title="Email Security Alerts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Email Security Alerts</h2>
          <button 
            onClick={() => {
              // Create CSV content
              const csvHeaders = 'ID,Subject,Source,Type,Severity,Threat Score,Time,Status\n';
              const csvRows = filteredAlerts.map(alert => 
                `${alert.id},"${alert.subject}","${alert.source}","${alert.type}","${alert.severity}",${alert.threatScore},"${alert.timestamp}","${alert.status}"`
              ).join('\n');
              
              const csvContent = csvHeaders + csvRows;
              
              // Create and download CSV file
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', `security-alerts-${new Date().toISOString().split('T')[0]}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // Show success notification
              const notification = document.createElement('div');
              notification.innerHTML = `
                <div style="
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  background: #10b981;
                  color: white;
                  padding: 12px 20px;
                  border-radius: 8px;
                  z-index: 9999;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                ">
                  📊 CSV exported successfully! ${filteredAlerts.length} alerts downloaded
                </div>
              `;
              document.body.appendChild(notification);
              
              setTimeout(() => {
                if (document.body.contains(notification)) {
                  document.body.removeChild(notification);
                }
              }, 3000);
            }}
            className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="glass p-6 rounded-xl shadow-lg relative z-50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 dark:text-dark-textSecondary font-medium text-sm">Severity:</label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 relative z-50"
                style={{ zIndex: 9999 }}
              >
                <option value="All">All</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-gray-700 dark:text-dark-textSecondary font-medium text-sm">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 relative z-50"
                style={{ zIndex: 9999 }}
              >
                <option value="All">All</option>
                <option value="Phishing">Phishing</option>
                <option value="Malware">Malware</option>
                <option value="Spam">Spam</option>
                <option value="Account">Account</option>
                <option value="Ransomware">Ransomware</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-gray-700 dark:text-dark-textSecondary font-medium text-sm">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 relative z-50"
                style={{ zIndex: 9999 }}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Resolved">Resolved</option>
                <option value="Blocked">Blocked</option>
                <option value="Quarantined">Quarantined</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-gray-700 dark:text-dark-textSecondary font-medium text-sm">Search:</label>
              <input
                type="text"
                placeholder="Search subject/source"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="glass rounded-xl shadow-lg overflow-hidden relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-surface dark:to-dark-card">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-dark-text font-semibold text-sm">Subject</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-dark-text font-semibold text-sm">Source</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-dark-text font-semibold text-sm">Type</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-dark-text font-semibold text-sm">Severity</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-dark-text font-semibold text-sm">Threat Score</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-dark-text font-semibold text-sm">Time</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-dark-text font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-gray-200 dark:border-dark-border hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-dark-surface dark:hover:to-dark-card transition-all duration-200">
                    <td className="px-4 py-3 text-gray-800 dark:text-dark-text font-medium text-sm max-w-xs truncate" title={alert.subject}>
                      {alert.subject}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-dark-text font-medium text-sm max-w-xs truncate" title={alert.source}>
                      {alert.source}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-dark-text font-medium text-sm">{alert.type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-dark-text font-medium text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        alert.threatScore >= 0.98 ? 'bg-red-100 text-red-700' :
                        alert.threatScore >= 0.90 ? 'bg-orange-100 text-orange-700' :
                        alert.threatScore >= 0.75 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {(alert.threatScore * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-textSecondary text-xs">{alert.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-dark-textSecondary text-sm">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">{alerts.length}</p>
              </div>
              <InfoTooltip 
                text="All security threats detected (Active, Resolved, Blocked, Quarantined)."
                variant="light"
              >
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </InfoTooltip>
            </div>
          </div>

          <div className="glass p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-dark-textSecondary text-sm">High Severity</p>
                <p className="text-2xl font-bold text-red-600">{alerts.filter(a => a.severity === 'HIGH').length}</p>
              </div>
              <InfoTooltip 
                text="Serious threats requiring immediate attention."
                variant="light"
              >
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </InfoTooltip>
            </div>
          </div>

          <div className="glass p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-dark-textSecondary text-sm">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{alerts.filter(a => a.status === 'Active').length}</p>
              </div>
              <InfoTooltip 
                text="Unresolved threats needing your attention."
                variant="light"
              >
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </InfoTooltip>
            </div>
          </div>

          <div className="glass p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-dark-textSecondary text-sm">Critical Threats</p>
                <p className="text-2xl font-bold text-red-600">{alerts.filter(a => a.severity === 'CRITICAL').length}</p>
              </div>
              <InfoTooltip 
                text="Highest risk threats."
                variant="light"
              >
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </InfoTooltip>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
