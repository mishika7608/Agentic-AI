const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();
const axios = require('axios');
const agent = require('./agent');

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());

// Initialize ServiceNow API client - Try Bearer token first
const createServiceNowClient = () => {
  return axios.create({
    baseURL: process.env.SERVICENOW_URL,

    auth: {
      username: process.env.SERVICENOW_USERNAME,
      password: process.env.SERVICENOW_PASSWORD
    },

    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },

    timeout: 15000
  });
};

let serviceNowAPI = createServiceNowClient();

// Add response interceptor for debugging
serviceNowAPI.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Authentication failed. Check your ServiceNow credentials.');
      console.error('Username:', process.env.SERVICENOW_USERNAME);
      console.error('URL:', process.env.SERVICENOW_URL);
      console.error('Error details:', error.response?.data);
    }
    return Promise.reject(error);
  }
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    servicenow_url: process.env.SERVICENOW_URL
  });
});

// Fetch all incidents
app.get('/api/incidents', async (req, res) => {
  try {
    const response = await serviceNowAPI.get('', {
      params: {
        sysparm_limit: 5000,
        sysparm_query: 'ORDERBYDESCsys_created_on'
      }
    });
    
    res.json({
      success: true,
      data: response.data.result
    });
  } catch (error) {
    console.error('Error fetching incidents:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incidents',
      error: error.message
    });
  }
});

// Get incidents by priority
app.get('/api/incidents/priority', async (req, res) => {
  try {
    const response = await serviceNowAPI.get('', {
      params: {
        sysparm_limit: 5000,
        sysparm_query: 'ORDERBYDESCsys_created_on'
      }
    });
    
    const incidents = response.data.result;
    const priorityMap = {};
    
    incidents.forEach(incident => {
      const priority = incident.priority || 'Unknown';
      priorityMap[priority] = (priorityMap[priority] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: priorityMap
    });
  } catch (error) {
    console.error('Error fetching incidents by priority:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incidents by priority',
      error: error.message
    });
  }
});

// Get incidents by category
app.get('/api/incidents/category', async (req, res) => {
  try {
    const response = await serviceNowAPI.get('', {
      params: {
        sysparm_limit: 5000
      }
    });
    
    const incidents = response.data.result;
    const categoryMap = {};
    
    incidents.forEach(incident => {
      const category = incident.category || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: categoryMap
    });
  } catch (error) {
    console.error('Error fetching incidents by category:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incidents by category',
      error: error.message
    });
  }
});

// Get incidents by assignment group (monthly)
app.get('/api/incidents/assignment-group', async (req, res) => {
  try {
    const response = await serviceNowAPI.get('', {
      params: {
        sysparm_limit: 5000
      }
    });
    
    const incidents = response.data.result;
    const groupMap = {};
    
    incidents.forEach(incident => {
      const group = incident.assignment_group || 'Unassigned';
      groupMap[group] = (groupMap[group] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: groupMap
    });
  } catch (error) {
    console.error('Error fetching incidents by assignment group:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incidents by assignment group',
      error: error.message
    });
  }
});

// Get incidents with empty assignment group
app.get('/api/incidents/empty-assignment', async (req, res) => {
  try {
    const response = await serviceNowAPI.get('', {
      params: {
        sysparm_limit: 5000,
        sysparm_query: 'assignment_groupISEMPTY'
      }
    });
    
    res.json({
      success: true,
      data: response.data.result
    });
  } catch (error) {
    console.error('Error fetching incidents with empty assignment:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incidents with empty assignment group',
      error: error.message
    });
  }
});

// Use external agent module to perform updates
// The agent implementation lives in `backend/agent.js` and exposes `executeUpdateAgent(serviceNowAPI)`

// API Endpoint: Update work notes for incidents with empty assignment group
app.post('/api/incidents/update-work-notes', async (req, res) => {
  try {
    console.log('📨 Request received: Update Work Notes');
    
    // Run the agent module
    const agentResult = await agent.executeUpdateAgent(serviceNowAPI);
    
    // Send response to client
    const statusCode = agentResult.success ? 200 : 500;
    res.status(statusCode).json(agentResult);
    
  } catch (error) {
    console.error('Error in update-work-notes endpoint:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to execute update agent',
      error: error.message
    });
  }
});

// Agent Status Endpoint: Check if agent is running
app.get('/api/agent/status', (req, res) => {
  res.json({
    success: true,
    agentStatus: 'Ready',
    agentType: 'Incident Assignment Updater',
    description: 'Automated agent for updating work notes on incidents with empty assignment groups',
    capabilities: [
      'Fetch incidents with empty assignment groups',
      'Batch update work notes',
      'Log all operations',
      'Return comprehensive results'
    ],
    endpoint: 'POST /api/incidents/update-work-notes',
    lastCheck: new Date().toISOString()
  });
});

// Agent Info Endpoint: Get agent configuration
app.get('/api/agent/info', (req, res) => {
  res.json({
    success: true,
    agentName: 'Incident Assignment Update Agent',
    version: '1.0.0',
    purpose: 'Automatically update work notes for incidents without assignment groups',
    updateMessage: "We are going to update Assignment group as 'Incident Management'",
    features: [
      'Real-time incident fetching',
      'Batch processing',
      'Error handling and logging',
      'Progress tracking',
      'Detailed response reporting'
    ],
    authentication: 'ServiceNow Basic Auth (username/password)',
    createdAt: '2026-05-24T00:00:00Z'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
