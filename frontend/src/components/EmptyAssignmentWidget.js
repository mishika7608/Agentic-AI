import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { fetchEmptyAssignmentIncidents, updateWorkNotes } from '../utils/api';
import '../styles/Dashboard.css';

const EmptyAssignmentWidget = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const response = await fetchEmptyAssignmentIncidents();
      
      if (response.success) {
        setIncidents(response.data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load incidents with empty assignment groups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWorkNotes = async () => {
    try {
      setUpdating(true);
      const response = await updateWorkNotes();
      
      if (response.success) {
        setSuccessMessage(`${response.data.length} incidents updated successfully`);
        setTimeout(() => setSuccessMessage(null), 5000);
        loadIncidents();
      }
    } catch (err) {
      setError('Failed to update work notes');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="widget-loading">Loading...</div>;

  return (
    <div className="empty-assignment-widget">
      <div className="widget-header">
        <h3>
          <AlertCircle size={20} /> Incidents with Empty Assignment Group
        </h3>
        <span className="badge">{incidents.length}</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">
          <CheckCircle size={18} /> {successMessage}
        </div>
      )}

      {incidents.length > 0 && (
        <>
          <div className="incidents-list">
            {incidents.slice(0, 5).map((incident) => (
              <div key={incident.sys_id} className="incident-item">
                <div className="incident-number">{incident.number}</div>
                <div className="incident-details">
                  <p className="incident-title">{incident.short_description || 'No description'}</p>
                  <p className="incident-meta">Priority: {incident.priority || 'Unknown'}</p>
                </div>
              </div>
            ))}
            {incidents.length > 5 && (
              <p className="incident-count">... and {incidents.length - 5} more</p>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={handleUpdateWorkNotes}
            disabled={updating}
          >
            {updating ? (
              <>
                <Loader size={16} /> Updating...
              </>
            ) : (
              `Update Work Notes (${incidents.length} incidents)`
            )}
          </button>
        </>
      )}

      {incidents.length === 0 && (
        <p className="no-data">All incidents have assignment groups assigned</p>
      )}
    </div>
  );
};

export default EmptyAssignmentWidget;
