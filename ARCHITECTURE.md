# Architecture & Technical Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (React Frontend)                       │
│                    (http://localhost:3000)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Dashboard  │  │  Components  │  │   State Management   │   │
│  │   Grid View  │  │  - Charts    │  │   (useState hooks)   │   │
│  │              │  │  - Widgets   │  │                      │   │
│  │              │  │  - Lists     │  │                      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                          │                                         │
│                          │ REST API Calls                          │
│                          │ (Axios HTTP Client)                     │
│                          ▼                                         │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │
                ┌───────────────────────┐
                │   CORS Middleware      │
                │   & Security Headers   │
                └───────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SERVER (Express Backend)                        │
│                   (http://localhost:5000)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   API Routes │  │   Middleware │  │   Data Processing    │   │
│  │  /api/...    │  │  - Helmet    │  │  - Aggregation       │   │
│  │              │  │  - Compression
│  │              │  │  - CORS      │  │  - Filtering         │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                          │                                         │
│                          │ HTTP Requests                           │
│                          │ (Axios)                                 │
│                          ▼                                         │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │
                ┌───────────────────────┐
                │   ServiceNow REST API  │
                │   Authentication      │
                │   (Bearer Token)      │
                └───────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│         ServiceNow Instance (Cloud)                               │
│  https://dev347055.service-now.com/api/now/table/incident        │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Incident Database                                            │ │
│  │ - All incident records                                       │ │
│  │ - Fields: number, priority, category, assignment_group etc  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Fetching Incidents

```
Frontend Component (Mount)
    ↓
useEffect Hook
    ↓
API Call: fetchIncidents()
    ↓
Axios GET /api/incidents
    ↓
Express Route Handler
    ↓
ServiceNow API Query
    ↓
Process & Return Data
    ↓
Frontend setState
    ↓
Re-render Component
    ↓
Display Charts/Data
```

### 2. Updating Work Notes

```
User Clicks Button
    ↓
handleUpdateWorkNotes()
    ↓
POST /api/incidents/update-work-notes
    ↓
Express Route Handler
    ↓
Query: Get incidents with empty assignment_group
    ↓
Loop through incidents
    ↓
PATCH each incident with new work_notes
    ↓
Collect results
    ↓
Return updated list
    ↓
Frontend setState
    ↓
Show success message
    ↓
Reload incident list
```

## Database Schema (ServiceNow Incident Table)

```javascript
{
  sys_id: String,              // System ID (unique)
  number: String,              // Incident number (INC0001234)
  short_description: String,   // Brief description
  description: String,         // Detailed description
  priority: String,            // 1-5 (Critical to Low)
  category: String,            // Issue category
  subcategory: String,         // Sub-category
  assignment_group: String,    // Team assigned
  assigned_to: String,         // Individual assignee
  state: String,               // Current state (New, In Progress, Resolved)
  impact: String,              // Business impact
  urgency: String,             // Urgency level
  created_on: DateTime,        // Creation timestamp
  created_by: String,          // Creator
  updated_on: DateTime,        // Last updated
  work_notes: String,          // Internal notes
  comments: String,            // Customer comments
  close_notes: String,         // Closure notes
  // ... many more fields
}
```

## API Response Format

### Standard Success Response

```javascript
{
  success: true,
  data: [
    // Response data
  ]
}
```

### Standard Error Response

```javascript
{
  success: false,
  message: "User-friendly error message",
  error: "Detailed error for logging"
}
```

## Frontend Component Architecture

### React Component Hierarchy

```
App
├── Header
│   ├── Title
│   └── Description
├── Main Container
│   ├── Dashboard Grid
│   │   ├── PriorityChart
│   │   │   ├── useEffect (fetch data)
│   │   │   ├── Pie Chart (ChartJS)
│   │   │   └── Loading/Error States
│   │   │
│   │   ├── CategoryReport
│   │   │   ├── useEffect (fetch data)
│   │   │   ├── Bar Chart (ChartJS)
│   │   │   └── Loading/Error States
│   │   │
│   │   ├── AssignmentGroupWidget
│   │   │   ├── useEffect (fetch data)
│   │   │   ├── Horizontal Bar Chart
│   │   │   └── Loading/Error States
│   │   │
│   │   ├── IncidentsList
│   │   │   ├── useEffect (fetch data)
│   │   │   ├── Incidents List with Pagination
│   │   │   ├── Refresh Button
│   │   │   └── Stats Cards
│   │   │
│   │   └── EmptyAssignmentWidget
│   │       ├── useEffect (fetch data)
│   │       ├── Incidents List
│   │       ├── Update Button
│   │       └── Success/Error Messages
│   │
│   └── Footer
```

## State Management

Each component manages its own state using React hooks:

```javascript
// Example from PriorityChart.js
const [chartData, setChartData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Load data on mount
useEffect(() => {
  loadData();
}, []);
```

### State Types

| State | Type | Purpose |
|-------|------|---------|
| `chartData` | Object | Chart configuration and data |
| `loading` | Boolean | Loading indicator |
| `error` | String | Error message |
| `incidents` | Array | List of incidents |
| `updating` | Boolean | Update operation state |
| `successMessage` | String | Success notification |

## Styling Architecture

### CSS Cascade

```
index.css (Global)
    ↓
Dashboard.css (Components)
    ↓
Incidents.css (Enhanced)
    ↓
Component Inline Styles
```

### Responsive Breakpoints

```javascript
// Desktop (1200px+)
@media (min-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

// Tablet (768px - 1024px)
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

// Mobile (<768px)
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

## API Integration Details

### Authentication Flow

```
1. Store Credentials in .env
   SERVICENOW_USERNAME=username
   SERVICENOW_PASSWORD=password

2. Backend loads from .env
   const username = process.env.SERVICENOW_USERNAME;
   const password = process.env.SERVICENOW_PASSWORD;

3. Use Basic Authentication
   auth: {
     username: username,
     password: password
   }

4. ServiceNow validates credentials
   - Valid → Return data
   - Invalid → Return 401 Unauthorized
   - Invalid → Return 401 Unauthorized
```

### Error Handling Hierarchy

```
API Call
    ↓
┌─ Network Error?
│  └─ Catch error, show message
│
├─ HTTP Error (4xx, 5xx)?
│  └─ Return error response
│
├─ Invalid Data?
│  └─ Show validation error
│
└─ Success (200)
   └─ Process and return data
```

## Performance Optimization Strategies

### Current Optimizations

1. **Response Compression** - Gzip compression
2. **Efficient Rendering** - React functional components
3. **Data Limiting** - 5000 records per request
4. **Error Boundaries** - Try-catch blocks
5. **Lazy Loading** - Load data on demand

### Future Optimizations

1. **Caching Layer** - Redis for frequently accessed data
2. **Database Caching** - Local DB for offline support
3. **Code Splitting** - Dynamic imports
4. **Memoization** - useMemo, useCallback
5. **Virtual Scrolling** - For large lists
6. **WebSocket** - Real-time updates

## Security Architecture

### Security Layers

```
Frontend (Browser)
    ↓
CORS Policy ← Verified Origin
    ↓
Express Server
    ↓
Helmet.js ← HTTP Headers
    ↓
Input Validation
    ↓
Authentication (API Key)
    ↓
Authorization Check
    ↓
Data Processing
    ↓
Error Handling (No sensitive data)
    ↓
ServiceNow API
```

### Security Headers (Helmet.js)

```javascript
app.use(helmet());
// Adds:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY
// - X-XSS-Protection: 1; mode=block
// - Strict-Transport-Security
// - Content-Security-Policy
```

## Deployment Architecture

### Development Environment

```
localhost:3000 (Frontend)
    ↓
localhost:5000 (Backend)
    ↓
dev347055.service-now.com (ServiceNow)
```

### Production Environment

```
yourdomain.com (Frontend - Static)
    ↓
yourdomain.com/api (Backend - Dynamic)
    ↓
dev347055.service-now.com (ServiceNow)
```

## Monitoring & Logging

### Backend Logging

```javascript
console.log('Server running on port ${PORT}');
console.error('Error fetching incidents:', error.message);
console.error(`Failed to update incident ${incident.number}:`, error.message);
```

### Frontend Error Tracking

```javascript
catch (error) {
  console.error('Error fetching incidents:', error);
  setError('Failed to fetch incidents');
}
```

## Scalability Considerations

### Current Limitations

- No pagination (loads 5000 records)
- No caching
- No database layer
- No real-time updates

### Scaling Strategies

1. **Add Pagination** - Load data in chunks
2. **Implement Caching** - Redis/MongoDB
3. **Add Queue System** - Bull for background jobs
4. **WebSocket** - Real-time data updates
5. **Load Balancer** - Multiple backend instances
6. **CDN** - Serve frontend from CDN
7. **Database** - Store processed data locally

---

This architecture provides a solid foundation for a scalable, maintainable ServiceNow integration platform.
