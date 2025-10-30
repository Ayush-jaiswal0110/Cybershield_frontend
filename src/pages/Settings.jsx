import React from 'react'
import DashboardLayout from '../components/DashboardLayout'

export default function Settings() {
  return (
    <DashboardLayout title="System Configuration">
      <div className='glass p-8 rounded-xl shadow-lg'>
        <h2 className='text-3xl font-bold mb-6 text-gray-800'>System Configuration</h2>
        <p className='text-gray-600 mb-8 text-lg'>Configure security thresholds, integrations, and tenant settings for optimal email protection.</p>
        
        {/* Placeholder for settings sections */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold text-lg">Security Thresholds</h3>
                <p className="text-gray-600 text-sm">Configure threat detection sensitivity levels</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
              <p className="text-gray-700 text-sm">Adjust phishing detection sensitivity, malware scanning thresholds, and spam filtering rules to match your organization's security requirements.</p>
            </div>
          </div>
          
          <div className="glass p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold text-lg">API Integrations</h3>
                <p className="text-gray-600 text-sm">Manage third-party service connections</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
              <p className="text-gray-700 text-sm">Connect with Gmail, Microsoft 365, Slack, and other services to enhance email security monitoring and threat intelligence.</p>
            </div>
          </div>
          
          <div className="glass p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold text-lg">User Management</h3>
                <p className="text-gray-600 text-sm">Configure user roles and permissions</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
              <p className="text-gray-700 text-sm">Set up user roles, access levels, and administrative permissions to ensure proper security governance across your organization.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
