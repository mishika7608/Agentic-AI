import React from 'react';
import PriorityChart from './components/PriorityChart';
import AssignmentGroupWidget from './components/AssignmentGroupWidget';
import CategoryReport from './components/CategoryReport';
import EmptyAssignmentWidget from './components/EmptyAssignmentWidget';
import IncidentsList from './components/IncidentsList';
import './styles/Dashboard.css';
import './styles/Incidents.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>ServiceNow Dashboard</h1>
          <p>Incident Management & Analytics</p>
        </div>
      </header>

      <main className="app-main">
        <div className="dashboard-grid">
          <section className="widget-section">
            <PriorityChart />
          </section>

          <section className="widget-section">
            <CategoryReport />
          </section>

          <section className="widget-section">
            <AssignmentGroupWidget />
          </section>

          <section className="widget-section full-width">
            <IncidentsList />
          </section>

          <section className="widget-section full-width">
            <EmptyAssignmentWidget />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 ServiceNow Incident Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
