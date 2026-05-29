import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchIncidents = async () => {
  try {
    const response = await apiClient.get('/incidents');
    return response.data;
  } catch (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }
};

export const fetchIncidentsByPriority = async () => {
  try {
    const response = await apiClient.get('/incidents/priority');
    return response.data;
  } catch (error) {
    console.error('Error fetching incidents by priority:', error);
    throw error;
  }
};

export const fetchIncidentsByCategory = async () => {
  try {
    const response = await apiClient.get('/incidents/category');
    return response.data;
  } catch (error) {
    console.error('Error fetching incidents by category:', error);
    throw error;
  }
};

export const fetchIncidentsByAssignmentGroup = async () => {
  try {
    const response = await apiClient.get('/incidents/assignment-group');
    return response.data;
  } catch (error) {
    console.error('Error fetching incidents by assignment group:', error);
    throw error;
  }
};

export const fetchEmptyAssignmentIncidents = async () => {
  try {
    const response = await apiClient.get('/incidents/empty-assignment');
    return response.data;
  } catch (error) {
    console.error('Error fetching empty assignment incidents:', error);
    throw error;
  }
};

export const updateWorkNotes = async () => {
  try {
    const response = await apiClient.post('/incidents/update-work-notes');
    return response.data;
  } catch (error) {
    console.error('Error updating work notes:', error);
    throw error;
  }
};
