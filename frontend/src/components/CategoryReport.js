import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { fetchIncidentsByCategory } from '../utils/api';
import '../styles/Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CategoryReport = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchIncidentsByCategory();
        
        if (response.success) {
          const labels = Object.keys(response.data).slice(0, 10);
          const data = Object.values(response.data).slice(0, 10);
          
          setChartData({
            labels,
            datasets: [{
              label: 'Incident Count',
              data,
              backgroundColor: [
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
                '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
                '#F8B88B', '#A9DFBF'
              ],
              borderColor: '#fff',
              borderWidth: 1,
              borderRadius: 4
            }]
          });
        }
        setError(null);
      } catch (err) {
        setError('Failed to load category data');
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
      <h3>Incidents by Category</h3>
      {chartData && (
        <Bar 
          data={chartData} 
          options={{
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default CategoryReport;
