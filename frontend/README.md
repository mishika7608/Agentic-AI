# Frontend Documentation

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── PriorityChart.js        # Priority distribution pie chart
│   │   ├── AssignmentGroupWidget.js # Assignment group bar chart
│   │   ├── CategoryReport.js        # Category distribution chart
│   │   └── EmptyAssignmentWidget.js # Empty assignment management
│   ├── styles/
│   │   ├── index.css               # Global styles
│   │   └── Dashboard.css           # Dashboard component styles
│   ├── utils/
│   │   └── api.js                  # API client and utility functions
│   ├── App.js                      # Main application component
│   └── index.js                    # React entry point
├── package.json
└── README.md
```

## Component Overview

### 1. PriorityChart Component

Displays a pie chart of incidents grouped by priority.

**Features:**
- Pie chart visualization
- Color-coded priorities
- Real-time data loading
- Error handling

**Props:** None

**State:**
- `chartData` - Chart configuration object
- `loading` - Loading state
- `error` - Error message

### 2. CategoryReport Component

Shows a bar chart of incidents by category.

**Features:**
- Horizontal bar chart
- Top 10 categories displayed
- Responsive design
- Loading states

**Props:** None

**State:**
- `chartData` - Chart configuration
- `loading` - Loading state
- `error` - Error message

### 3. AssignmentGroupWidget Component

Displays incident distribution across assignment groups.

**Features:**
- Horizontal bar chart
- Assignment group metrics
- Visual comparison
- Responsive layout

**Props:** None

**State:**
- `chartData` - Chart data
- `loading` - Loading state
- `error` - Error message

### 4. EmptyAssignmentWidget Component

Manages incidents with empty assignment groups.

**Features:**
- List of unassigned incidents
- Batch update capability
- Real-time notifications
- Loading states
- Success/error feedback

**Props:** None

**State:**
- `incidents` - Array of incidents
- `loading` - Initial load state
- `updating` - Update operation state
- `error` - Error message
- `successMessage` - Success notification

**Methods:**
- `loadIncidents()` - Fetch incidents with empty assignments
- `handleUpdateWorkNotes()` - Update work notes for incidents

## API Integration

The `src/utils/api.js` file provides utility functions for API communication:

```javascript
// Fetch all incidents
fetchIncidents()

// Get incidents by priority
fetchIncidentsByPriority()

// Get incidents by category
fetchIncidentsByCategory()

// Get incidents by assignment group
fetchIncidentsByAssignmentGroup()

// Get incidents with empty assignment group
fetchEmptyAssignmentIncidents()

// Update work notes
updateWorkNotes()
```

## Styling

### Global Styles (index.css)
- Font setup
- Reset styles
- Scrollbar customization
- Base colors

### Component Styles (Dashboard.css)
- Layout grid
- Responsive breakpoints
- Component-specific styles
- Animation/transitions
- Breakpoints:
  - 1024px - Tablet
  - 768px - Mobile
  - 480px - Small mobile

## Running the Frontend

### Development Server
```bash
cd frontend
npm install
npm start
```

The app will open on `http://localhost:3000` in your browser.

### Production Build
```bash
cd frontend
npm run build
```

## State Management

Currently using React local component state with `useState` hook.

For larger applications, consider:
- Context API
- Redux
- Zustand
- Jotai

## Performance Optimization

### Current Optimizations
- Lazy loading of components
- Efficient chart rendering
- CSS-in-JS styling
- Responsive images

### Future Optimizations
- Code splitting with React.lazy()
- Memoization with useMemo/useCallback
- Image optimization
- Service worker for offline support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Responsive Design

The application uses CSS Grid and Flexbox for responsive design:

- **Desktop (1200px+)**: Multi-column grid layout
- **Tablet (768px-1024px)**: Adaptive grid
- **Mobile (<768px)**: Single column stack

### Mobile Considerations
- Touch-friendly buttons (min 44x44px)
- Readable font sizes (min 16px)
- Proper spacing
- Optimized charts for small screens

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Loading states for better UX

## Charts Configuration

### Chart.js Setup

The app uses Chart.js with React wrapper:

```javascript
import { Chart as ChartJS, ... } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(...);
```

### Chart Types Used
- **Pie Chart**: Priority distribution
- **Horizontal Bar Chart**: Assignment groups & categories

## Error Handling

All components include:
- Try-catch blocks
- Error state management
- User-friendly error messages
- Console logging for debugging

## Loading States

Components show loading indicators:
- Spinner during data fetch
- Disabled buttons during updates
- Placeholder content

## Future Enhancements

- [ ] Add filters and search
- [ ] Export to CSV/PDF
- [ ] Date range selection
- [ ] Incident detail modals
- [ ] Real-time WebSocket updates
- [ ] Dark mode toggle
- [ ] Customize widget layout
- [ ] Advanced analytics

## Troubleshooting

### Charts Not Rendering
- Check browser console for errors
- Verify data is being returned from API
- Clear browser cache

### Styling Issues
- Check CSS file paths
- Verify CSS is being imported
- Use browser dev tools to inspect styles

### API Connection Issues
- Verify backend is running
- Check API endpoint URLs
- Verify CORS is configured

## Development Tips

### Debugging
- Use React DevTools extension
- Check Network tab for API calls
- Console logging for state changes
- Use breakpoints in debugger

### Hot Reload
- Changes to files auto-reload
- State is preserved during reload
- CSS changes visible immediately

### Testing
```bash
npm test
```

Create test files alongside components with `.test.js` extension.
