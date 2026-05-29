# Backend API Documentation

## Overview

The backend is a Node.js/Express server that acts as a bridge between the React frontend and the ServiceNow REST API.

## Environment Setup

Create a `.env` file in the backend directory with your ServiceNow credentials:

```env
PORT=5000
SERVICENOW_URL=https://dev347055.service-now.com/api/now/table/incident
SERVICENOW_USERNAME=your_servicenow_username
SERVICENOW_PASSWORD=your_servicenow_password
NODE_ENV=development
```

## Running the Server

### Development Mode
```bash
cd backend
npm install
npm run dev
```

### Production Mode
```bash
cd backend
npm install
npm start
```

The server will run on `http://localhost:5000`

## API Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Detailed Endpoint Documentation

### 1. Health Check
**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "Server is running"
}
```

### 2. Get All Incidents
**Endpoint:** `GET /api/incidents`

**Query Parameters:**
- None

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "sys_id": "...",
      "number": "INC0001234",
      "short_description": "Server down",
      "priority": "1",
      "category": "Software",
      "assignment_group": "IT Support",
      ...
    },
    ...
  ]
}
```

### 3. Get Incidents by Priority
**Endpoint:** `GET /api/incidents/priority`

**Response:**
```json
{
  "success": true,
  "data": {
    "1": 45,
    "2": 123,
    "3": 234,
    "4": 567
  }
}
```

### 4. Get Incidents by Category
**Endpoint:** `GET /api/incidents/category`

**Response:**
```json
{
  "success": true,
  "data": {
    "Software": 234,
    "Hardware": 156,
    "Network": 89,
    ...
  }
}
```

### 5. Get Incidents by Assignment Group
**Endpoint:** `GET /api/incidents/assignment-group`

**Response:**
```json
{
  "success": true,
  "data": {
    "IT Support": 234,
    "Database Team": 156,
    "Network Team": 89,
    "Unassigned": 45
  }
}
```

### 6. Get Incidents with Empty Assignment Group
**Endpoint:** `GET /api/incidents/empty-assignment`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "sys_id": "...",
      "number": "INC0001234",
      "short_description": "Server issue",
      "priority": "2",
      "category": "Software",
      "assignment_group": null,
      ...
    },
    ...
  ]
}
```

### 7. Update Work Notes for Empty Assignment Incidents
**Endpoint:** `POST /api/incidents/update-work-notes`

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Updated 12 incidents with empty assignment groups",
  "data": [
    {
      "sys_id": "...",
      "number": "INC0001234",
      "status": "Updated"
    },
    ...
  ]
}
```

## ServiceNow API Integration

The backend uses the ServiceNow Table API to fetch incident records. All requests include:

- **Authentication:** Bearer token in Authorization header
- **Base URL:** `https://dev347055.service-now.com/api/now/table/incident`
- **Limit:** 5000 records per request
- **Format:** JSON

## Error Handling

The backend implements comprehensive error handling:

### Common Error Scenarios

1. **Connection Error**
   ```json
   {
     "success": false,
     "message": "Failed to fetch incidents",
     "error": "Connection refused"
   }
   ```

2. **Authentication Error**
   ```json
   {
     "success": false,
     "message": "Failed to fetch incidents",
     "error": "Unauthorized"
   }
   ```

3. **Server Error**
   ```json
   {
     "success": false,
     "message": "Internal server error",
     "error": "..."
   }
   ```

## Middleware Stack

1. **Helmet** - Security headers
2. **CORS** - Cross-origin requests
3. **Compression** - Response compression
4. **Express.json** - JSON parsing
5. **Error Handler** - Global error handling

## Performance Considerations

- **Caching:** Implement Redis for frequently accessed data
- **Pagination:** Add offset/limit parameters for large datasets
- **Rate Limiting:** Consider adding rate limiting for production
- **Database:** Consider caching incident data locally

## Future Improvements

- Add WebSocket support for real-time updates
- Implement GraphQL for flexible queries
- Add database layer for caching
- Implement rate limiting
- Add request logging
- Add monitoring/metrics
