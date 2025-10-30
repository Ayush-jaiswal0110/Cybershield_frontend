// API service for backend integration
import axiosInstance from './axiosInstance';

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await axiosInstance.post('/api/auth/logout');
    return response.data;
  },
  
  verifyToken: async () => {
    const response = await axiosInstance.get('/api/auth/verify');
    return response.data;
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await axiosInstance.get('/api/dashboard/stats');
    return response.data;
  },
  
  getRecentThreats: async () => {
    const response = await axiosInstance.get('/api/dashboard/recent-threats');
    return response.data;
  },
  
  scanEmails: async () => {
    const userEmail = localStorage.getItem('user_email') || 'harpriya.sandhu@gmail.com';
    const response = await axiosInstance.post('/api/dashboard/scan-emails', { email: userEmail });
    return response.data;
  }
};

// Email Security API
export const emailSecurityAPI = {
  getQuarantinedEmails: async (opts = {}) => {
    // Support server-side pagination: page, pageSize, and optional search
    const { page = 1, pageSize = 50, search = '' } = opts;
    const response = await axiosInstance.get('/email/quarantined', {
      params: { page, pageSize, search }
    });
    return response.data;
  },
  
  releaseEmail: async (emailId) => {
    const response = await axiosInstance.post('/email/release', { emailId });
    return response.data;
  },
  
  deleteEmail: async (emailId) => {
    const response = await axiosInstance.post('/email/delete', { emailId });
    return response.data;
  },
  
  bulkRelease: async (emailIds) => {
    const response = await axiosInstance.post('/email/bulk-release', { emailIds });
    return response.data;
  },
  
  bulkDelete: async (emailIds) => {
    const response = await axiosInstance.post('/email/bulk-delete', { emailIds });
    return response.data;
  },
  
  scanEmail: async (emailData) => {
    const response = await axiosInstance.post('/email/scan', emailData);
    return response.data;
  }
};

// Reports API
export const reportsAPI = {
  getReports: async () => {
    const response = await axiosInstance.get('/reports');
    return response.data;
  },
  
  generateReport: async (reportType, dateRange) => {
    const response = await axiosInstance.post('/reports/generate', { 
      type: reportType, 
      dateRange 
    });
    return response.data;
  },
  
  downloadReport: async (reportId, format = 'pdf') => {
    const response = await axiosInstance.get(`/reports/${reportId}/download?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  deleteReport: async (reportId) => {
    const response = await axiosInstance.delete(`/reports/${reportId}`);
    return response.data;
  }
};

// Settings API
export const settingsAPI = {
  getSettings: async () => {
    const response = await axiosInstance.get('/settings');
    return response.data;
  },
  
  updateSettings: async (settings) => {
    const response = await axiosInstance.put('/settings', settings);
    return response.data;
  },
  
  getEmailPolicies: async () => {
    const response = await axiosInstance.get('/settings/email-policies');
    return response.data;
  },
  
  updateEmailPolicies: async (policies) => {
    const response = await axiosInstance.put('/settings/email-policies', policies);
    return response.data;
  }
};

// User Management API
export const userAPI = {
  getUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },
  
  createUser: async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  },
  
  updateUser: async (userId, userData) => {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  },
  
  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  }
};

// Analytics API
export const analyticsAPI = {
  getThreatAnalytics: async (dateRange) => {
    const response = await axiosInstance.get('/analytics/threats', {
      params: { dateRange }
    });
    return response.data;
  },
  
  getEmailAnalytics: async (dateRange) => {
    const response = await axiosInstance.get('/analytics/emails', {
      params: { dateRange }
    });
    return response.data;
  },
  
  getComplianceMetrics: async (dateRange) => {
    const response = await axiosInstance.get('/analytics/compliance', {
      params: { dateRange }
    });
    return response.data;
  }
};
