import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { reportsAPI } from '../services/api'
import MaliciousData from '../data/Malicious.json'

export default function Reports() {
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Weekly Security Activity Report",
      type: "Weekly Report", 
      generatedOn: "September 28, 2025",
      status: "Ready",
      size: "1.8 MB",
      threats: 8,
      emailsScanned: 4200,
      downloadUrl: '/reports/weekly-w4-sep-2025.pdf'
    },
    {
      id: 2,
      title: "Organization Security Summary - September 2025",
      type: "Monthly Summary",
      generatedOn: "September 30, 2025",
      status: "Ready",
      size: "2.3 MB",
      threats: 23,
      emailsScanned: 15420,
      downloadUrl: '/reports/org-sep-2025.pdf'
    },
    {
      id: 3,
      title: "Threat Detection Report",
      type: "Threat Analysis",
      generatedOn: "September 30, 2025", 
      status: "Ready",
      size: "0.9 MB",
      threats: 5,
      emailsScanned: 1200,
      downloadUrl: '/reports/phishing-summary-sep-2025.pdf'
    }
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
    
    // Cleanup function to remove any notifications when component unmounts
    return () => {
      const existingNotifications = document.querySelectorAll('[data-download-notification]');
      existingNotifications.forEach(notification => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      });
    };
  }, []);

  const fetchReports = async () => {
    try {
      // Try real API call first
      const response = await reportsAPI.getReports();
      setReports(response);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      // Keep the existing demo data as fallback
    } finally {
      setLoading(false);
    }
  };


  // Helper function to get threat level from probability
  const getThreatLevelFromProbability = (probability) => {
    if (probability >= 0.98) return 'Critical';
    if (probability >= 0.90) return 'High';
    if (probability >= 0.75) return 'Medium';
    return 'Low';
  };

  // Helper function to categorize email types
  const getEmailTypeFromContent = (email) => {
    const subject = email.subject.toLowerCase();
    const body = email.body.toLowerCase();
    
    if (subject.includes('encrypt') || body.includes('encrypt') || body.includes('bitcoin') || body.includes('ransom')) {
      return 'Ransomware';
    }
    if (subject.includes('verify') || subject.includes('account') || body.includes('verify') || body.includes('click')) {
      return 'Phishing';
    }
    if (subject.includes('invoice') || subject.includes('payment') || body.includes('payment') || body.includes('wire')) {
      return 'Financial Fraud';
    }
    if (subject.includes('offer') || subject.includes('deal') || body.includes('discount') || body.includes('limited time')) {
      return 'Spam';
    }
    if (subject.includes('download') || subject.includes('attachment') || body.includes('download') || body.includes('virus')) {
      return 'Malware';
    }
    if (subject.includes('newsletter') || subject.includes('subscribe') || body.includes('newsletter')) {
      return 'Spam';
    }
    return 'Spoofing';
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

  const handleDownload = async (report) => {
    // Clean up any existing notifications first
    const existingNotifications = document.querySelectorAll('[data-download-notification]');
    existingNotifications.forEach(notification => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    });

    console.log('Downloading report:', report.title);
    
    // Show download notification
    const notification = document.createElement('div');
    notification.setAttribute('data-download-notification', 'true');
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
(EXECUTIVE SUMMARY) Tj
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
(RECOMMENDATIONS) Tj
0 -20 Td
/F1 10 Tf
(1. Implement advanced email filtering for phishing attempts) Tj
0 -15 Td
(2. Enhance ransomware protection and backup systems) Tj
0 -15 Td
(3. Provide security awareness training for users) Tj
0 -15 Td
(4. Monitor financial fraud attempts closely) Tj
0 -15 Td
(5. Update spam filters for better detection) Tj
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

  const handleGenerateNew = () => {
    // Show generating notification
    const generatingNotification = document.createElement('div');
    generatingNotification.innerHTML = `
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
        🔄 Generating new report...
      </div>
    `;
    document.body.appendChild(generatingNotification);
    
    // Get current data breakdown
    const breakdown = getDetailedBreakdown();
    const currentDate = new Date();
    const reportDate = currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    // Generate new report with current data
    const newReport = {
      id: reports.length + 1,
      title: `Security Report - ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      type: "Monthly",
      generatedOn: reportDate,
      status: "Completed",
      size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
      threats: breakdown.maliciousEmails,
      emailsScanned: breakdown.totalEmails,
      isGenerated: true // Mark as generated report
    };
    
    // Simulate report generation delay
    setTimeout(() => {
      // Remove generating notification
      if (document.body.contains(generatingNotification)) {
        document.body.removeChild(generatingNotification);
      }
      
      // Add new report to the list
      setReports(prevReports => [newReport, ...prevReports]);
      
      // Show success notification
      const successNotification = document.createElement('div');
      successNotification.innerHTML = `
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
          ✅ New report generated! ${breakdown.maliciousEmails} threats detected
        </div>
      `;
      document.body.appendChild(successNotification);
      
      // Remove success notification after 4 seconds
      setTimeout(() => {
        if (document.body.contains(successNotification)) {
          document.body.removeChild(successNotification);
        }
      }, 4000);
      
    }, 2000); // 2 second delay to simulate processing
  };

  return (
    <DashboardLayout title="Security Reports">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <h2 className='text-3xl font-bold text-gray-800 dark:text-dark-text'>Security Reports</h2>
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
    </DashboardLayout>
  )
}
