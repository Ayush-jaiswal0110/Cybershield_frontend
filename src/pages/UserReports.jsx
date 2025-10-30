import React, { useState, useEffect } from 'react';
import UserLayout from '../components/UserLayout';
import MaliciousData from '../data/Malicious.json';

export default function UserReports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([
    {
      id: 1,
      title: 'My Email Security Summary - September 2025',
      type: 'Monthly Summary',
      generatedOn: 'September 30, 2025',
      size: '2.4 MB',
      status: 'Ready',
      emailsScanned: 1950,
      threats: 28,
      downloadUrl: '/reports/personal-sep-2025.pdf'
    },
    {
      id: 2,
      title: 'Weekly Security Activity Report',
      type: 'Weekly Report',
      generatedOn: 'September 28, 2025',
      size: '1.8 MB',
      status: 'Ready',
      emailsScanned: 485,
      threats: 7,
      downloadUrl: '/reports/weekly-w4-sep-2025.pdf'
    },
    {
      id: 3,
      title: 'Threat Detection Report',
      type: 'Threat Analysis',
      generatedOn: 'September 25, 2025',
      size: '1.2 MB',
      status: 'Ready',
      emailsScanned: 1200,
      threats: 15,
      downloadUrl: '/reports/phishing-summary-sep-2025.pdf'
    }
  ]);

  // Cleanup function
  useEffect(() => {
    return () => {
      const existingNotifications = document.querySelectorAll('[data-user-download-notification]');
      existingNotifications.forEach(notification => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      });
    };
  }, []);

  // Generate current data breakdown
  const getCurrentData = () => {
    const maliciousEmails = MaliciousData.emails.filter(email => email.prediction === 1);
    const legitimateEmails = MaliciousData.emails.filter(email => email.prediction === 0);
    
    return {
      totalEmails: MaliciousData.emails.length,
      maliciousEmails: maliciousEmails.length,
      legitimateEmails: legitimateEmails.length,
      threatRate: ((maliciousEmails.length / MaliciousData.emails.length) * 100).toFixed(1)
    };
  };

  // Generate detailed breakdown data
  const getDetailedBreakdown = () => {
    const maliciousEmails = MaliciousData.emails.filter(email => email.prediction === 1);
    const legitimateEmails = MaliciousData.emails.filter(email => email.prediction === 0);
    
    const threatBreakdown = {};
    const severityBreakdown = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    
    maliciousEmails.forEach(email => {
      const type = getEmailTypeFromContent(email);
      const severity = getThreatLevelFromProbability(email.probability);
      
      threatBreakdown[type] = (threatBreakdown[type] || 0) + 1;
      severityBreakdown[severity]++;
    });
    
    return {
      totalEmails: MaliciousData.emails.length,
      maliciousEmails: maliciousEmails.length,
      legitimateEmails: legitimateEmails.length,
      threatBreakdown,
      severityBreakdown
    };
  };

  // Helper functions for threat analysis
  const getEmailTypeFromContent = (email) => {
    const content = email.content.toLowerCase();
    if (content.includes('phishing') || content.includes('verify') || content.includes('urgent')) return 'Phishing';
    if (content.includes('ransomware') || content.includes('encrypt') || content.includes('bitcoin')) return 'Ransomware';
    if (content.includes('financial') || content.includes('payment') || content.includes('invoice')) return 'Financial Fraud';
    if (content.includes('spam') || content.includes('promotion') || content.includes('offer')) return 'Spam';
    return 'Suspicious Activity';
  };

  const getThreatLevelFromProbability = (probability) => {
    if (probability >= 0.9) return 'Critical';
    if (probability >= 0.7) return 'High';
    if (probability >= 0.5) return 'Medium';
    return 'Low';
  };

  // PDF download handler (same as admin)
  const handleDownload = (report) => {
    // Clean up any existing notifications first
    const existingNotifications = document.querySelectorAll('[data-user-download-notification]');
    existingNotifications.forEach(notification => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    });

    console.log('Downloading report:', report.title);
    
    // Show download notification
    const notification = document.createElement('div');
    notification.setAttribute('data-user-download-notification', 'true');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3b82f6;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        📥 Downloading ${report.title}...
      </div>
    `;
    document.body.appendChild(notification);
    
    // Get detailed breakdown data
    const breakdown = getDetailedBreakdown();
    
    // Create detailed PDF content
    const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 800
>>
stream
BT
/F1 14 Tf
100 750 Td
(${report.title}) Tj
0 -25 Td
/F1 10 Tf
(${report.type} - Generated: ${report.generatedOn}) Tj
0 -40 Td
/F1 12 Tf
(PERSONAL SECURITY SUMMARY) Tj
0 -20 Td
/F1 10 Tf
(Total Emails Analyzed: ${breakdown.totalEmails.toLocaleString()}) Tj
0 -15 Td
(Malicious Emails Detected: ${breakdown.maliciousEmails}) Tj
0 -15 Td
(Legitimate Emails: ${breakdown.legitimateEmails}) Tj
0 -15 Td
(Threat Detection Rate: ${((breakdown.maliciousEmails / breakdown.totalEmails) * 100).toFixed(1)}%) Tj
0 -40 Td
/F1 12 Tf
(THREAT BREAKDOWN BY TYPE) Tj
0 -20 Td
/F1 10 Tf
${Object.entries(breakdown.threatBreakdown).map(([type, count]) => 
  `(${type}: ${count} emails (${((count / breakdown.maliciousEmails) * 100).toFixed(1)}%)) Tj 0 -15 Td`
).join('')}
0 -30 Td
/F1 12 Tf
(THREAT SEVERITY DISTRIBUTION) Tj
0 -20 Td
/F1 10 Tf
${Object.entries(breakdown.severityBreakdown).map(([severity, count]) => 
  `(${severity}: ${count} threats (${((count / breakdown.maliciousEmails) * 100).toFixed(1)}%)) Tj 0 -15 Td`
).join('')}
0 -30 Td
/F1 12 Tf
(PERSONAL SECURITY RECOMMENDATIONS) Tj
0 -20 Td
/F1 10 Tf
(1. Be cautious with suspicious email attachments) Tj
0 -15 Td
(2. Verify sender identity before clicking links) Tj
0 -15 Td
(3. Report suspicious emails to IT security) Tj
0 -15 Td
(4. Keep your email client updated) Tj
0 -15 Td
(5. Use strong, unique passwords) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000825 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
1200
%%EOF
    `;
    
    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Remove notification after download
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 2000);
  };

  // Generate new report
  const handleGenerateNew = () => {
    const notification = document.createElement('div');
    notification.setAttribute('data-user-download-notification', 'true');
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
        ✅ New report generated successfully!
      </div>
    `;
    document.body.appendChild(notification);
    
    const currentData = getCurrentData();
    const currentDate = new Date();
    const newReport = {
      id: reports.length + 1,
      title: `My Email Security Summary - ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      type: 'Monthly Summary',
      generatedOn: currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
      status: 'Ready',
      emailsScanned: currentData.totalEmails,
      threats: currentData.maliciousEmails,
      downloadUrl: `/reports/personal-${currentDate.toLocaleDateString('en-US', { month: 'short' }).toLowerCase()}-${currentDate.getFullYear()}.pdf`,
      isGenerated: true
    };
    
    setReports(prevReports => [newReport, ...prevReports]);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  // Delete report
  const handleDeleteReport = (reportId) => {
    setReports(prevReports => prevReports.filter(report => report.id !== reportId));
  };

  return (
    <UserLayout title="Security Reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Security Reports</h2>
          <button
            onClick={handleGenerateNew}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Generate New Report
          </button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div 
              key={report.id}
              className="glass p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-dark-border hover:border-indigo-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-gray-800 dark:text-dark-text font-semibold text-lg mb-2">{report.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-dark-textSecondary">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {report.generatedOn}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                      {report.size}
                    </span>
                    <span className="flex items-center text-green-600 font-medium">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {report.status}
                    </span>
                  </div>
                </div>
                {report.isGenerated && (
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-dark-textSecondary mb-2">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {report.emailsScanned.toLocaleString()} emails scanned
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    {report.threats} threats detected
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-dark-textSecondary">
                  Report Type: {report.type}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => handleDownload(report)}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Download Report
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="glass p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">Report Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{reports.length}</div>
              <div className="text-sm text-gray-600 dark:text-dark-textSecondary">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {reports.reduce((sum, report) => sum + report.emailsScanned, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-dark-textSecondary">Emails Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {reports.reduce((sum, report) => sum + report.threats, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-dark-textSecondary">Threats Detected</div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
