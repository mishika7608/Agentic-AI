import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { fetchIncidentsByPriority } from '../utils/api';
import '../styles/Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const PriorityChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchIncidentsByPriority();
        
        if (response.success) {
          const labels = Object.keys(response.data);
          const data = Object.values(response.data);
          
          setChartData({
            labels,
            datasets: [{
              label: 'Incidents by Priority',
              data,
              backgroundColor: [
                '#FF6B6B',
                '#FFA500',
                '#FFD93D',
                '#6BCB77',
                '#4D96FF',
                '#B19CD9'
              ],
              borderColor: '#fff',
              borderWidth: 2
            }]
          });
        }
        setError(null);
      } catch (err) {
        setError('Failed to load priority data');
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
      <h3>Incidents by Priority</h3>
      {chartData && <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />}
    </div>
  );
};

export default PriorityChart;
