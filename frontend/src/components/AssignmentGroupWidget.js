import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { fetchIncidentsByAssignmentGroup } from '../utils/api';
import '../styles/Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AssignmentGroupWidget = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchIncidentsByAssignmentGroup();
        
        if (response.success) {
          const labels = Object.keys(response.data);
          const data = Object.values(response.data);
          
          setChartData({
            labels,
            datasets: [{
              label: 'Incident Count',
              data,
              backgroundColor: '#4D96FF',
              borderColor: '#2563EB',
              borderWidth: 1,
              borderRadius: 4
            }]
          });
        }
        setError(null);
      } catch (err) {
        setError('Failed to load assignment group data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="widget-loading">Loading...</div>;
  if (error) return <div className="widget-error">{error}</div>;

  return (
    <div className="chart-widget">
      <h3>Incidents by Assignment Group</h3>
      {chartData && (
        <Bar 
          data={chartData} 
          options={{
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            scales: {
              x: {
                beginAtZero: true
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default AssignmentGroupWidget;
