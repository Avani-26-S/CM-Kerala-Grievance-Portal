# 02 – System Architecture

## 1. Architecture Overview

The CM Kerala Grievance Portal follows a client-server architecture.

The React frontend communicates with the Node.js and Express backend through REST APIs. The backend manages authentication, grievance processing, database operations and AI integration.

Google Gemini AI is used to analyze grievance descriptions and provide recommendations.

## 2. Main Components

### Frontend Layer
- Developed using React and Vite.
- Displays the public website and role-based dashboards.
- Provides grievance submission and tracking interfaces.
- Communicates with backend APIs.

### Backend Layer
- Developed using Node.js and Express.js.
- Handles API requests.
- Performs authentication and authorization.
- Manages grievance assignment and status updates.
- Connects to SQLite and Gemini AI.

### Database Layer
- SQLite stores user and grievance information.
- Stores grievance reference numbers and status information.
- Maintains grievance status history.

### AI Layer
- Google Gemini API analyzes complaint titles and descriptions.
- Suggests category, department and priority.
- Generates a summary and possible duplicate indication.
- AI results are recommendations requiring human review.

## 3. System Architecture Diagram

```text
                 CITIZEN / CMO / OFFICER
                           |
                           v
                 REACT FRONTEND (VITE)
                           |
                     REST API REQUESTS
                           |
                           v
                NODE.JS + EXPRESS SERVER
                    /             \
                   /               \
                  v                 v
            SQLITE DATABASE    GOOGLE GEMINI AI
                  |                 |
                  v                 v
          USERS AND GRIEVANCES   AI ANALYSIS
          STATUS HISTORY        RECOMMENDATIONS
                  \                 /
                   \               /
                    v             v
                  REACT FRONTEND
                           |
                           v
                   USER DASHBOARDS
```

## 4. Request Flow

1. The user interacts with the React frontend.
2. The frontend sends an API request to Express.
3. Express validates the request and user permissions.
4. The backend reads or updates SQLite records.
5. For AI analysis, the backend sends the complaint to Gemini.
6. Gemini returns structured analysis.
7. The backend sends the response to the frontend.
8. The frontend displays the result.

## 5. Security

- JWT-based authentication.
- Password hashing with bcrypt.
- Role-based access control.
- Environment variables for sensitive configuration.
- Backend-side Gemini API integration.

## 6. Conclusion

The architecture separates presentation, business logic, database storage and AI processing to support maintainability and future enhancements.