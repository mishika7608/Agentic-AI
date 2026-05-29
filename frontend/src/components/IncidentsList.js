import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader, RefreshCw } from 'lucide-react';
import { fetchIncidents } from '../utils/api';
import '../styles/Dashboard.css';

const IncidentsList = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const response = await fetchIncidents();
      
      if (response.success) {
        setIncidents(response.data.slice(0, 10));
        setTotalCount(response.data.length);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load incidents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="widget-loading"><Loader size={24} /> Loading incidents...</div>;

  return (
    <div className="incidents-summary-widget">
      <div className="widget-header">
        <h3>
          <AlertCircle size={20} /> Recent Incidents
        </h3>
        <button 
          className="btn-icon" 
          onClick={loadIncidents}
          title="Refresh"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="incidents-stats">
        <div className="stat-card">
          <span className="stat-label">Total Incidents</span>
          <span className="stat-value">{totalCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Displayed</span>
          <span className="stat-value">{incidents.length}</span>
        </div>
      </div>

      <div className="incidents-list">
        {incidents.map((incident) => (
          <div key={incident.sys_id} className="incident-row">
            <div className="incident-info">
              <p className="incident-number-text">{incident.number}</p>
              <p className="incident-description">{incident.short_description || 'No description'}</p>
            </div>
            <div className="incident-status">
              <span className={`status-badge status-${incident.priority}`}>
                Priority: {incident.priority || 'Unknown'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentsList;
