# Quick Start Guide

## 🚀 Getting Started

This guide will help you set up and run the ServiceNow Incident Dashboard application.

### Prerequisites

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher) or **yarn**
- **Git** (optional)

### Step 1: Navigate to Project Directory

```bash
cd d:\MERN_proj\NewProj
```

### Step 2: Install Dependencies

#### Option A: Install All at Once
```bash
npm install-all
```

#### Option B: Manual Installation
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Verify Environment Configuration

Check that `backend/.env` contains your ServiceNow credentials:

```env
PORT=5000
SERVICENOW_URL=https://dev347055.service-now.com/api/now/table/incident
SERVICENOW_API_KEY=now_VZCdT_gWcKjihEWdVltkYMwuA00NXQ79cO58RSmuiWD66D4t6e6CJepoSUj2RrJOJ--tQ1dx887LSspNpczKWw
NODE_ENV=development
```

### Step 4: Start the Application

From the root directory, run:

```bash
npm run dev
```

This will start both:
- **Backend Server**: http://localhost:5000
- **Frontend App**: http://localhost:3000

Wait for both to start, then open your browser to `http://localhost:3000`

## 📊 Dashboard Overview

### Available Widgets

1. **Priority Chart**
   - Pie chart showing incident distribution by priority
   - Color-coded for easy identification
   - Real-time data from ServiceNow

2. **Incidents by Category**
   - Bar chart displaying top categories
   - Shows incident count per category
   - Top 10 categories displayed

3. **Assignment Group Widget**
   - Horizontal bar chart
   - Shows incident distribution per team
   - Helps identify workload balance

4. **Recent Incidents**
   - List of latest incidents
   - Quick view of key information
   - Priority status badges
   - Refresh capability

5. **Empty Assignment Management**
   - Identifies incidents without assignment groups
   - Batch update work notes
   - Real-time success notifications
   - Shows count of affected incidents

## 🔧 Available Commands

### Root Commands
```bash
npm install-all          # Install all dependencies
npm run dev              # Start backend and frontend
npm run server           # Start only backend
npm run client           # Start only frontend
npm run build            # Build frontend for production
```

### Backend Commands
```bash
cd backend
npm start                # Start server
npm run dev              # Start with nodemon (auto-reload)
```

### Frontend Commands
```bash
cd frontend
npm start                # Start development server
npm run build            # Create production build
npm test                 # Run tests
```

## 🌐 API Endpoints

The backend server exposes these REST endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check |
| GET | `/api/incidents` | All incidents |
| GET | `/api/incidents/priority` | By priority |
| GET | `/api/incidents/category` | By category |
| GET | `/api/incidents/assignment-group` | By assignment group |
| GET | `/api/incidents/empty-assignment` | With empty assignment |
| POST | `/api/incidents/update-work-notes` | Update work notes |

## 🎯 Main Features

### Real-time Data Fetch
- Incidents updated from ServiceNow REST API
- Automatic aggregation and filtering
- Error handling with user-friendly messages

### Update Functionality
- Identify incidents with empty assignment groups
- Batch update work notes with custom message
- Success/failure notifications
- Real-time incident list refresh

### Responsive Design
- Works on desktop, tablet, and mobile
- Adaptive grid layout
- Touch-friendly interface
- Optimized charts for all screen sizes

### Security
- ServiceNow credentials stored in environment variables
- CORS protection
- Helmet.js security headers
- Error responses without sensitive data

## 📱 Mobile Access

The application is fully mobile-responsive:

1. Open browser on mobile device
2. Navigate to your server address with port (e.g., `http://your-ip:3000`)
3. Dashboard adapts to screen size
4. All features work on mobile

## 🔍 Troubleshooting

### Issue: Port Already in Use

If port 5000 or 3000 is in use:

```bash
# Change backend port in backend/.env
PORT=5001

# Change frontend port (set in terminal before starting)
# Windows
set PORT=3001 && npm start

# Mac/Linux
PORT=3001 npm start
```

### Issue: Cannot Connect to ServiceNow

1. Verify username and password in `backend/.env`
2. Check internet connection
3. Verify ServiceNow instance is accessible
4. Check if IP is whitelisted in ServiceNow

### Issue: Blank Dashboard

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify backend is running on http://localhost:5000

### Issue: Charts Not Loading

1. Clear browser cache (Ctrl+Shift+Delete)
2. Close and reopen browser
3. Check browser console for errors
4. Verify backend API endpoints working

## 📚 Additional Documentation

- [Main README.md](../README.md) - Full project documentation
- [Backend README.md](../backend/README.md) - Backend API details
- [Frontend README.md](../frontend/README.md) - Frontend structure

## 🛠️ Development Tips

### Hot Reload
- Changes to files automatically reload
- Backend: Uses nodemon for auto-restart
- Frontend: React's built-in hot reload

### Debug Mode
1. Open Chrome DevTools (F12)
2. Check Console for errors
3. Use React DevTools extension
4. Check Network tab for API calls

### Stopping the Application

Press `Ctrl+C` in the terminal running the dev server.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates optimized production build in `frontend/build/`.

### Environment Variables for Production

Update `backend/.env` for production:

```env
PORT=80 (or appropriate port)
SERVICENOW_URL=your_production_url
SERVICENOW_API_KEY=your_production_key
NODE_ENV=production
```

## 📞 Support

For issues or questions:

1. Check the documentation files
2. Review browser console for error messages
3. Verify all dependencies are installed
4. Ensure backend is running before accessing frontend

## Next Steps

- [ ] Explore all dashboard widgets
- [ ] Test the incident update functionality
- [ ] Try filtering and searching
- [ ] Customize the UI (colors, layout)
- [ ] Set up database caching (optional)
- [ ] Deploy to production (optional)

---

Happy analyzing! 🎉
