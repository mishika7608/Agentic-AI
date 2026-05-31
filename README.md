# ServiceNow Incident Dashboard

A responsive web application that integrates with ServiceNow to manage and visualize incident data in real-time.

## Features

### 📊 Dashboard Widgets
- **Priority Chart**: Pie chart showing incidents grouped by priority levels
- **Category Report**: Bar chart displaying incidents by category
- **Assignment Group Widget**: Monthly incident count per assignment group
- **Empty Assignment Widget**: Identifies and updates incidents with missing assignment groups

### 🔧 Key Functionality
- **REST API Integration**: Seamless connection to ServiceNow REST APIs
- **Real-time Data**: Fetch and display live incident data
- **Auto-Update**: Automatically update work notes for incidents with empty assignment groups
- **Mobile-Friendly**: Fully responsive design for all devices
- **Secure Authentication**: API key-based authentication with environment variables

## Project Structure

```
.
├── backend/                 # Express.js server
│   ├── server.js           # Main server file with API routes
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS styles
│   │   ├── utils/          # API utilities
│   │   ├── App.js          # Main App component
│   │   └── index.js        # React entry point
│   ├── public/             # Static files
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json with scripts
└── README.md               # This file
```

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Axios** - HTTP client for API calls
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Security middleware
- **Compression** - Response compression

### Frontend
- **React 18** - UI library
- **Chart.js** - Data visualization
- **React Chart.js 2** - React wrapper for Chart.js
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **CSS3** - Styling with responsive design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Clone/Navigate to the project directory**
   ```bash
   cd d:\MERN_proj\NewProj
   ```

2. **Install all dependencies**
   ```bash
   npm install-all
   ```
   
   Or manually:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   cd backend && npm install && cd ..
   ```

3. **Configure Environment Variables**
   
   Backend `.env` file (update with your ServiceNow credentials):
   ```
   PORT=5000
   SERVICENOW_URL=https://dev347055.service-now.com/api/now/table/incident
   SERVICENOW_USERNAME=your_servicenow_username
   SERVICENOW_PASSWORD=your_servicenow_password
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend on `http://localhost:3000`

## API Endpoints

### Backend Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/incidents` | Get all incidents |
| GET | `/api/incidents/priority` | Get incidents grouped by priority |
| GET | `/api/incidents/category` | Get incidents grouped by category |
| GET | `/api/incidents/assignment-group` | Get incidents grouped by assignment group |
| GET | `/api/incidents/empty-assignment` | Get incidents with empty assignment group |
| POST | `/api/incidents/update-work-notes` | Update work notes for empty assignment incidents |
| **POST** | **`/api/incidents/generate-resolution`** | **Generate & apply AI resolution plan to top incident** |
| GET | `/api/agent/status` | Get agent health and capabilities |
| GET | `/api/agent/info` | Get agent configuration details |

**NEW**: The Resolution Plan Agent automatically generates contextual resolution plans and updates incident work notes.

## Usage

### Viewing the Dashboard

1. Open your browser and navigate to `http://localhost:3000`
2. The dashboard will automatically load incident data from ServiceNow
3. View different charts and reports in real-time

### Updating Incidents

1. Go to the "Incidents with Empty Assignment Group" section
2. Click "Update Work Notes" button
3. All incidents with empty assignment groups will be updated with:
   > "We are going to update Assignment group as 'Incident Management'"

### Generating Resolution Plans (NEW)

The Resolution Plan Agent can be triggered to automatically:
1. Fetch the newest incident from ServiceNow
2. Generate a contextual resolution plan based on priority and category
3. Update the incident's work notes with the plan

**PowerShell Example:**
```powershell
$response = Invoke-RestMethod -Method Post `
  -Uri 'http://localhost:5000/api/incidents/generate-resolution' `
  -ContentType 'application/json'

Write-Host "Resolution plan applied to: $($response.incidentDetails.number)"
```

For complete documentation, see [RESOLUTION_AGENT_QUICK_REFERENCE.md](RESOLUTION_AGENT_QUICK_REFERENCE.md).

## Features in Detail

### 1. Priority Distribution
- Displays incidents by priority level
- Visual pie chart for easy identification of critical incidents
- Color-coded for quick reference

### 2. Category Analysis
- Bar chart showing incident distribution across categories
- Helps identify problem areas
- Top 10 categories displayed

### 3. Assignment Group Metrics
- Horizontal bar chart for assignment group performance
- Shows incident load per team
- Identifies underutilized and overloaded groups

### 4. Resolution Plan Agent (NEW)
- Automatically generates resolution plans for incidents
- Customizes plans based on incident priority and category
- Updates incident work notes via PATCH
- Provides detailed execution metrics and logging
- Supports hardware, software, network, and general issues

### 4. Empty Assignment Management
- Real-time identification of unassigned incidents
- Batch update capability
- Automatic work notes addition
- Success notification on update

## Security Features

- **API Key Protection**: Sensitive credentials stored in environment variables
- **CORS Protection**: Only allowed origins can access API
- **Helmet.js**: Additional HTTP headers security
- **Error Handling**: Proper error responses without sensitive data exposure

## Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1200px and above): Multi-column layout
- **Tablet** (768px - 1024px): Adaptive grid
- **Mobile** (Below 768px): Single-column stack

## Performance Optimization

- Response compression for faster load times
- Efficient data fetching with limits
- Optimized chart rendering
- Lazy loading of components

## Error Handling

The application includes comprehensive error handling:
- API connection errors
- Invalid response handling
- User-friendly error messages
- Automatic retry capabilities
- Detailed console logging for debugging

## Troubleshooting

### Issue: Cannot connect to ServiceNow
- Verify API key in `.env` file
- Check ServiceNow instance URL
- Ensure your IP is whitelisted in ServiceNow

### Issue: Blank Charts
- Check browser console for errors
- Verify API endpoint responses
- Clear browser cache and reload

### Issue: CORS Errors
- Ensure backend is running on `http://localhost:5000`
- Check CORS configuration in `backend/server.js`

## Future Enhancements

- [ ] User authentication
- [ ] Data export to CSV/PDF
- [ ] Custom date range filtering
- [ ] Advanced search capabilities
- [ ] Incident detail modal
- [ ] Real-time updates with WebSocket
- [ ] Database caching layer
- [ ] Mobile app version

## License

Proprietary - ServiceNow Integration

## Support

For issues or questions, contact the development team.

## Contributors

Created for efficient ServiceNow incident management and analytics.
