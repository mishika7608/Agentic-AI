# ServiceNow Incident Dashboard - Complete Setup & Deployment Guide

## Project Overview

A modern, responsive MERN (MongoDB, Express, React, Node.js) web application for managing ServiceNow incidents with real-time dashboards, analytics, and incident management capabilities.

### Key Features ✨

- **Real-time Incident Data** - Fetches incidents directly from ServiceNow API
- **Interactive Dashboards** - Pie charts, bar charts, and detailed incident lists
- **Smart Analytics** - Visualize incidents by Priority, Category, and Assignment Group
- **Auto-Update Capability** - Batch update work notes for incidents with empty assignment groups
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- **Secure Integration** - API key protection and CORS security measures
- **Modern UI** - Clean, intuitive interface with smooth animations

---

## 📋 Project Structure

```
d:\MERN_proj\NewProj\
├── backend/                          # Node.js/Express Backend
│   ├── server.js                    # Main server with API routes
│   ├── package.json                 # Backend dependencies
│   ├── .env                         # Environment variables (API credentials)
│   └── README.md                    # Backend documentation
│
├── frontend/                         # React Frontend Application
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── PriorityChart.js           # Pie chart: incidents by priority
│   │   │   ├── CategoryReport.js          # Bar chart: incidents by category
│   │   │   ├── AssignmentGroupWidget.js   # Bar chart: incidents by assignment group
│   │   │   ├── EmptyAssignmentWidget.js   # Management tool for empty assignments
│   │   │   └── IncidentsList.js           # Recent incidents list
│   │   ├── styles/                  # CSS styling
│   │   │   ├── index.css                  # Global styles
│   │   │   ├── Dashboard.css              # Component styles
│   │   │   └── Incidents.css              # Enhanced incident styles
│   │   ├── utils/
│   │   │   └── api.js               # API client & utility functions
│   │   ├── App.js                   # Main application component
│   │   └── index.js                 # React entry point
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── package.json                 # Frontend dependencies
│   └── README.md                    # Frontend documentation
│
├── package.json                     # Root package.json with scripts
├── .gitignore                       # Git ignore rules
├── README.md                        # Main documentation
└── QUICKSTART.md                    # Quick start guide
```

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js** v14+ ([Download](https://nodejs.org/))
- **npm** v6+ (comes with Node.js)

### Installation & Launch

```bash
# 1. Navigate to project
cd d:\MERN_proj\NewProj

# 2. Install all dependencies
npm install-all

# 3. Start both servers (backend + frontend)
npm run dev
```

The application will automatically open at **http://localhost:3000**

---

## 🔧 Detailed Setup Instructions

### Step 1: Clone/Navigate to Project

```bash
cd d:\MERN_proj\NewProj
```

### Step 2: Install Dependencies

#### Method A: Install All at Once
```bash
npm install-all
```

#### Method B: Manual Installation
```bash
# Install root
npm install

# Install backend
cd backend && npm install && cd ..

# Install frontend
cd frontend && npm install && cd ..
```

### Step 3: Configure Environment Variables

The `backend/.env` file should be configured with your ServiceNow credentials:

```env
PORT=5000
SERVICENOW_URL=https://dev347055.service-now.com/api/now/table/incident
SERVICENOW_USERNAME=your_servicenow_username
SERVICENOW_PASSWORD=your_servicenow_password
NODE_ENV=development
```

### Step 4: Start Development Servers

```bash
npm run dev
```

This starts:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

---

## 🎯 Dashboard Features & Usage

### 1. Priority Chart Widget
- **What it shows**: Pie chart of incidents grouped by priority
- **Use case**: Quickly identify critical incidents
- **How to use**: Review the pie chart to see priority distribution

### 2. Category Report Widget
- **What it shows**: Top 10 incident categories
- **Use case**: Identify problem areas
- **How to use**: Analyze which categories have most incidents

### 3. Assignment Group Widget
- **What it shows**: Incident distribution across teams
- **Use case**: Balance workload across teams
- **How to use**: Check if workload is evenly distributed

### 4. Recent Incidents List
- **What it shows**: Latest 10 incidents
- **Use case**: Quick overview of recent activity
- **How to use**: Review recent incidents and their priority

### 5. Empty Assignment Management
- **What it shows**: Incidents without assignment groups
- **Use case**: Assign unassigned incidents
- **How to use**:
  1. See count of unassigned incidents
  2. Review the list
  3. Click "Update Work Notes" button
  4. System updates all incidents with the message:
     > "We are going to update Assignment group as 'Incident Management'"

---

## 🌐 API Endpoints Reference

### Backend Endpoints (http://localhost:5000/api)

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/health` | GET | Health check | `{status: "Server is running"}` |
| `/incidents` | GET | All incidents | `{success: true, data: [...]}` |
| `/incidents/priority` | GET | By priority | `{success: true, data: {priority: count}}` |
| `/incidents/category` | GET | By category | `{success: true, data: {category: count}}` |
| `/incidents/assignment-group` | GET | By team | `{success: true, data: {group: count}}` |
| `/incidents/empty-assignment` | GET | Unassigned | `{success: true, data: [...]}` |
| `/incidents/update-work-notes` | POST | Update notes | `{success: true, message: "...", data: [...]}` |

---

## 🛠️ Common Commands

### Development Commands
```bash
npm run dev              # Start both servers
npm run server           # Start only backend
npm run client           # Start only frontend
```

### Backend Commands
```bash
cd backend
npm start                # Production mode
npm run dev              # Development with auto-reload
```

### Frontend Commands
```bash
cd frontend
npm start                # Development server
npm run build            # Production build
npm test                 # Run tests
```

### Build for Production
```bash
npm run build            # Creates frontend/build folder
```

---

## 📱 Responsive Design

The application is fully responsive:

| Device | Breakpoint | Layout |
|--------|-----------|--------|
| Desktop | 1200px+ | 2-3 column grid |
| Tablet | 768px-1024px | Adaptive grid |
| Mobile | <768px | Single column stack |

**All features work on mobile:**
- Charts are responsive
- Buttons are touch-friendly (44x44px minimum)
- Font sizes are readable
- Spacing is optimized

---

## 🔒 Security Features

✅ **Secure API Integration**
- API key stored in `.env` file (not in code)
- Bearer token authentication
- CORS protection

✅ **Security Middleware**
- Helmet.js for HTTP headers
- Input validation
- Error handling without sensitive data

✅ **Best Practices**
- No credentials in git (`.gitignore`)
- HTTPS recommended for production
- Environment-based configuration

---

## 🐛 Troubleshooting

### Problem: Ports Already in Use

```bash
# Change backend port
# Edit backend/.env and set PORT=5001

# Change frontend port
set PORT=3001 && npm start
```

### Problem: Cannot Connect to ServiceNow

**Solutions:**
1. Verify API key in `backend/.env`
2. Check internet connection
3. Verify ServiceNow instance URL
4. Whitelist your IP in ServiceNow

### Problem: Charts Not Displaying

**Solutions:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console (F12) for errors
4. Verify backend is running

### Problem: Blank Dashboard

**Solutions:**
1. Open DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed API requests
4. Verify backend server is running

### Problem: CORS Error

**Solution:**
This means the frontend can't communicate with the backend.
- Verify backend is running on `http://localhost:5000`
- Check that frontend is configured to use correct backend URL

---

## 📊 Technology Stack

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| Node.js | Runtime | 14+ |
| Express.js | Web framework | 4.18.2 |
| Axios | HTTP client | 1.5.0 |
| CORS | Cross-origin | 2.8.5 |
| Helmet | Security | 7.0.0 |
| Dotenv | Config | 16.3.1 |

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| React | UI library | 18.2.0 |
| Chart.js | Charts | 4.4.0 |
| React ChartJS-2 | Chart wrapper | 5.2.0 |
| Axios | HTTP client | 1.5.0 |
| Lucide React | Icons | 0.292.0 |

---

## 🚀 Production Deployment

### Build Steps

```bash
# 1. Build frontend
cd frontend
npm run build
cd ..

# 2. Set production environment
# Edit backend/.env
NODE_ENV=production

# 3. Start backend server
cd backend
npm start
```

### Deployment Platforms

**Option 1: Heroku**
```bash
heroku create your-app-name
git push heroku main
```

**Option 2: AWS (EC2)**
- Launch EC2 instance
- Install Node.js
- Clone repository
- Run `npm install-all && npm run build`
- Use PM2 for process management

**Option 3: Docker**
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install-all && npm run build
CMD npm start
```

---

## 📚 Additional Resources

- [ServiceNow API Documentation](https://developer.servicenow.com/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Chart.js Documentation](https://www.chartjs.org/)

---

## 📞 Support & Troubleshooting

### Getting Help

1. **Check Documentation**
   - [QUICKSTART.md](QUICKSTART.md) - Quick start guide
   - [README.md](README.md) - Full documentation
   - [backend/README.md](backend/README.md) - Backend details
   - [frontend/README.md](frontend/README.md) - Frontend details

2. **Debug Issues**
   - Open browser DevTools (F12)
   - Check console for errors
   - Verify server logs
   - Check network requests

3. **Common Solutions**
   - Clear cache and reload
   - Restart servers
   - Check environment variables
   - Verify internet connection

---

## ✅ Verification Checklist

- [ ] Node.js and npm installed
- [ ] Project extracted/cloned
- [ ] Dependencies installed (`npm install-all`)
- [ ] Environment variables configured
- [ ] Backend server running (http://localhost:5000)
- [ ] Frontend server running (http://localhost:3000)
- [ ] Dashboard loads without errors
- [ ] Charts display data
- [ ] Can view incident list
- [ ] Can click "Update Work Notes" button

---

## 📝 Next Steps

1. **Customize UI**
   - Modify colors in CSS files
   - Change branding/logos
   - Adjust layout and spacing

2. **Add Features**
   - Date range filtering
   - Advanced search
   - Export to PDF/CSV
   - Real-time WebSocket updates

3. **Optimize Performance**
   - Add caching layer
   - Implement pagination
   - Compress images
   - Minify CSS/JS

4. **Deploy to Production**
   - Set up HTTPS
   - Configure domain
   - Set up monitoring
   - Implement backups

---

## 🎉 You're All Set!

Your ServiceNow Incident Dashboard is ready to use. Start by running:

```bash
npm run dev
```

Then visit **http://localhost:3000** in your browser.

Happy analyzing! 📊
