// ML API Service - Calls Python ML Backend
// This service connects your React frontend to your colleague's Python ML code

const ML_API_BASE_URL = 'http://localhost:8000/api/ml';

class MLAPIService {
  constructor() {
    this.baseURL = ML_API_BASE_URL;
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('ML API health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }

  async analyzeEmail(emailData) {
    try {
      console.log('🔍 Sending email to Python ML API for analysis...');
      
      const response = await fetch(`${this.baseURL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: emailData.sender,
          receiver: emailData.receiver,
          subject: emailData.subject,
          body: emailData.body
        })
      });

      if (!response.ok) {
        throw new Error(`ML API error: ${response.status} ${response.statusText}`);
      }

      const analysisResult = await response.json();
      console.log('✅ ML Analysis completed:', analysisResult);
      
      return analysisResult;
    } catch (error) {
      console.error('❌ ML API analysis failed:', error);
      throw error;
    }
  }

  async analyzeBatchEmails(emails) {
    try {
      console.log(`🔍 Sending ${emails.length} emails to Python ML API for batch analysis...`);
      
      const response = await fetch(`${this.baseURL}/analyze-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails })
      });

      if (!response.ok) {
        throw new Error(`ML API error: ${response.status} ${response.statusText}`);
      }

      const batchResult = await response.json();
      console.log('✅ Batch ML Analysis completed:', batchResult);
      
      return batchResult.results;
    } catch (error) {
      console.error('❌ ML API batch analysis failed:', error);
      throw error;
    }
  }

  async analyzeFile(filePath) {
    try {
      console.log('🔍 Sending file to Python ML API for analysis...');
      
      const response = await fetch(`${this.baseURL}/analyze-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_path: filePath })
      });

      if (!response.ok) {
        throw new Error(`ML API error: ${response.status} ${response.statusText}`);
      }

      const fileAnalysis = await response.json();
      console.log('✅ File Analysis completed:', fileAnalysis);
      
      return fileAnalysis;
    } catch (error) {
      console.error('❌ ML API file analysis failed:', error);
      throw error;
    }
  }

  async loadSampleData() {
    try {
      console.log('📊 Loading sample data from Python ML API...');
      
      const response = await fetch(`${this.baseURL}/load-sample-data`);

      if (!response.ok) {
        throw new Error(`ML API error: ${response.status} ${response.statusText}`);
      }

      const sampleData = await response.json();
      console.log('✅ Sample data loaded:', sampleData);
      
      return sampleData.results;
    } catch (error) {
      console.error('❌ ML API sample data loading failed:', error);
      throw error;
    }
  }

  // Fallback method if Python ML API is not available
  async analyzeEmailFallback(emailData) {
    console.log('⚠️ Using fallback analysis (Python ML API not available)');
    
    // Simple fallback analysis
    const subject = emailData.subject.toLowerCase();
    const body = emailData.body.toLowerCase();
    
    let threatType = 'Safe';
    let threatLevel = 'Low';
    let probability = 0.1;
    let reasoning = 'Email appears to be safe';
    
    // Simple threat detection
    if (subject.includes('urgent') || subject.includes('verify')) {
      threatType = 'Phishing';
      threatLevel = 'High';
      probability = 0.8;
      reasoning = 'Phishing attempt detected - urgent language';
    } else if (subject.includes('invoice') || subject.includes('attachment')) {
      threatType = 'Malware';
      threatLevel = 'Critical';
      probability = 0.9;
      reasoning = 'Malware threat detected - suspicious attachment';
    } else if (body.includes('bitcoin') || body.includes('encrypted')) {
      threatType = 'Ransomware';
      threatLevel = 'Critical';
      probability = 0.95;
      reasoning = 'Ransomware threat detected';
    }
    
    return {
      sender: emailData.sender,
      receiver: emailData.receiver,
      subject: emailData.subject,
      body: emailData.body,
      prediction: probability >= 0.5 ? 1 : 0,
      probability: probability,
      threatType: threatType,
      threatLevel: threatLevel,
      confidence: probability,
      reasoning: reasoning,
      analysis_timestamp: new Date().toISOString(),
      features: {
        sender_domain_suspicious: emailData.sender.includes('external') || emailData.sender.includes('unknown'),
        subject_urgent: subject.includes('urgent'),
        body_suspicious: body.includes('click here') || body.includes('verify'),
        has_external_links: body.includes('http'),
        content_length: emailData.body.length,
        subject_length: emailData.subject.length
      }
    };
  }
}

// Create and export the service instance
const mlAPIService = new MLAPIService();

export default mlAPIService;
export { MLAPIService };
